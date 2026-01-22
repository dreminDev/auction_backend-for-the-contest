import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { AuctionInfo, User, Winner } from '../api/client';
import { BidTooLowError } from '../api/errors';
import { WinnersTable } from './WinnersTable';
import './AuctionDetail.css';

export function AuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auctionInfo, setAuctionInfo] = useState<AuctionInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState(1);
  const [minBet, setMinBet] = useState(1);
  const [maxBet, setMaxBet] = useState(1000);
  const [placingBet, setPlacingBet] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDraggingRef = useRef(false);
  const currentUserId = apiClient.getUserId();

  const loadUserBalance = useCallback(async () => {
    try {
      const userData = await apiClient.getUser();
      setUser(userData);
      
      // Обновляем максимальную ставку на основе баланса
      if (userData.balances && Array.isArray(userData.balances) && userData.balances.length > 0) {
        const starsBalance = userData.balances.find(b => b.type === 'stars');
        if (starsBalance && starsBalance.balance !== undefined) {
          setMaxBet(prevMaxBet => {
            const newMaxBet = Math.max(starsBalance.balance, prevMaxBet);
            return newMaxBet;
          });
          // Если текущая ставка больше баланса, уменьшаем её
          setBetAmount(prev => {
            if (prev > starsBalance.balance) {
              return Math.max(1, starsBalance.balance);
            }
            return prev;
          });
        }
      }
    } catch (err) {
      // Тихая обработка ошибки загрузки баланса
    }
  }, []);

  const loadWinners = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiClient.getAuctionWinners(id);
      setWinners(data);
    } catch {
      // Тихая обработка - победители могут отсутствовать
    }
  }, [id]);

  const loadAuctionInfo = useCallback(async () => {
    if (!id || isDraggingRef.current) return;
    
    try {
      setError('');
      const data = await apiClient.getAuctionInfo(id);
      
      if (!data || !data.auction) {
        throw new Error('Данные аукциона не получены');
      }

      setAuctionInfo(data);
      
      // Загружаем победителей для завершенных аукционов
      if (data.auction.status === 'ended') {
        loadWinners();
      }
      
      // Минимальная ставка всегда 1
      setMinBet(1);
      
      // Обновляем текущую ставку только если она меньше 1 и мы не перетаскиваем
      if (!isDraggingRef.current) {
        setBetAmount(prev => prev < 1 ? 1 : prev);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки аукциона';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, loadWinners]);

  useEffect(() => {
    if (!id) {
      setError('ID аукциона не указан');
      setLoading(false);
      return;
    }

    loadUserBalance();
    loadAuctionInfo();
    
    // Обновляем информацию раз в секунду, но только если не перетаскиваем ползунок
    intervalRef.current = setInterval(() => {
      if (!isDraggingRef.current) {
        loadAuctionInfo();
        loadUserBalance();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id, loadAuctionInfo, loadUserBalance]);

  const handlePlaceBet = async () => {
    if (!id || placingBet || !auctionInfo) return;

    try {
      setPlacingBet(true);
      setError('');
      await apiClient.placeBet(id, betAmount, 'stars');
      await loadAuctionInfo();
      await loadUserBalance();
    } catch (err) {
      if (err instanceof BidTooLowError) {
        setError(err.message);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка размещения ставки';
        setError(errorMessage);
      }
    } finally {
      setPlacingBet(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minBet && value <= maxBet) {
      setBetAmount(value);
    }
  };

  const handleSliderMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleSliderMouseUp = () => {
    isDraggingRef.current = false;
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = date.getTime() - now.getTime();
      
      if (diff <= 0) return '00:00';
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } catch {
      return '00:00';
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  if (loading) {
    return (
      <div className="auction-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад к аукционам
        </button>
        <div className="loading">Загрузка аукциона...</div>
      </div>
    );
  }

  if (error && !auctionInfo) {
    return (
      <div className="auction-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад к аукционам
        </button>
        <div className="error">{error}</div>
        <button onClick={loadAuctionInfo} className="retry-button">Повторить</button>
      </div>
    );
  }

  if (!auctionInfo || !auctionInfo.auction) {
    return (
      <div className="auction-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад к аукционам
        </button>
        <div className="error">Аукцион не найден</div>
      </div>
    );
  }

  const { auction, actionBetList = [] } = auctionInfo;
  const bets = actionBetList || [];
  // Сортируем ставки по убыванию суммы для отображения
  const sortedBets = [...bets].sort((a, b) => b.amount - a.amount);
  const topBet = sortedBets.length > 0 ? sortedBets[0] : null;
  const isActive = auction.status === 'active';
  
  // Проверяем, есть ли у текущего пользователя ставка в текущем раунде
  const hasUserBetInCurrentRound = currentUserId !== null && bets.some(
    bet => bet.userId === currentUserId && bet.round === auction.currentRound
  );

  return (
    <div className="auction-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Назад к аукционам
      </button>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      <div className="auction-detail-card">
        {/* Header */}
        <div className="auction-header-telegram">
          <div className="auction-header-top">
            <div className="auction-title-section">
              <h1 className="auction-title-telegram">Аукцион</h1>
              <div className="auction-meta-telegram">
                <span className="round-info">Раунд {auction.currentRound || 1}/{auction.roundCount || 1}</span>
                {isActive && (
                  <span className="status-active-telegram">● Активен</span>
                )}
              </div>
            </div>
            <div className="timer-telegram">
              <div className="timer-value-telegram">{formatTime(auction.roundEndTime || new Date().toISOString())}</div>
              <div className="timer-label-telegram">до конца раунда</div>
            </div>
          </div>
        </div>

        {/* Balance Display */}
        {user && user.balances && user.balances.length > 0 && (
          <div className="balance-display-telegram">
            <div className="balance-label-telegram">Ваш баланс</div>
            <div className="balance-value-telegram">
              {(() => {
                const starsBalance = user.balances.find(b => b.type === 'stars');
                return starsBalance ? (
                  <>
                    <span className="balance-amount-large">{formatNumber(starsBalance.balance)}</span>
                    <span className="balance-currency">⭐</span>
                  </>
                ) : (
                  <span className="no-balance">0 ⭐</span>
                );
              })()}
            </div>
          </div>
        )}

        {/* Current Bet Display */}
        <div className="current-bet-telegram">
          <div className="current-bet-label-telegram">Текущая ставка</div>
          <div className="current-bet-value-telegram">
            {topBet ? (
              <>
                <span className="bet-amount-large">{formatNumber(topBet.amount)}</span>
                <span className="bet-currency">⭐</span>
              </>
            ) : (
              <span className="no-bets">Нет ставок</span>
            )}
          </div>
          {topBet && (
            <div className="current-bet-user-telegram">
              Пользователь {topBet.userId}
            </div>
          )}
        </div>

        {/* Bet Slider Section */}
        {isActive && (
          <div className="bet-section-telegram">
            <div className="bet-slider-wrapper">
              <div className="bet-slider-header">
                <span className="bet-slider-title">Ваша ставка</span>
                <span className="bet-slider-value">{formatNumber(betAmount)} ⭐</span>
              </div>
              <div className="bet-slider-container-telegram">
                <input
                  id="bet-slider"
                  type="range"
                  min={minBet}
                  max={maxBet}
                  value={betAmount}
                  onChange={handleSliderChange}
                  onMouseDown={handleSliderMouseDown}
                  onMouseUp={handleSliderMouseUp}
                  onTouchStart={handleSliderMouseDown}
                  onTouchEnd={handleSliderMouseUp}
                  className="bet-slider-telegram"
                  disabled={placingBet}
                  aria-label="Выбор суммы ставки"
                />
                <div className="bet-slider-labels-telegram">
                  <span>{formatNumber(minBet)}</span>
                  <span>{formatNumber(maxBet)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceBet}
              className={`place-bet-button-telegram ${betAmount < minBet || betAmount > maxBet ? 'disabled' : ''}`}
              disabled={placingBet || betAmount < minBet || betAmount > maxBet}
            >
              {placingBet ? (
                <span>Размещение...</span>
              ) : betAmount < minBet ? (
                <span>Минимум {formatNumber(minBet)} ⭐</span>
              ) : betAmount > maxBet ? (
                <span>Максимум {formatNumber(maxBet)} ⭐</span>
              ) : hasUserBetInCurrentRound ? (
                <span>Добавить {formatNumber(betAmount)} ⭐</span>
              ) : (
                <span>Сделать ставку {formatNumber(betAmount)} ⭐</span>
              )}
            </button>
          </div>
        )}

        {/* Winners Table for ended auctions */}
        {!isActive && (
          <div className="winners-section-telegram">
            <h2 className="winners-section-title-telegram">🏆 Победители</h2>
            <WinnersTable winners={winners} currentUserId={currentUserId} />
          </div>
        )}

        {/* Bets History - only for active auctions */}
        {isActive && (
          <div className="bets-history-telegram">
            <h2 className="bets-history-title-telegram">История ставок</h2>
            {bets.length === 0 ? (
              <div className="empty-bets-telegram">Ставок пока нет</div>
            ) : (
              <div className="bets-list-telegram">
                {sortedBets.map((bet, index) => {
                  if (!bet || !bet.id) return null;
                  const isCurrentUserBet = currentUserId !== null && bet.userId === currentUserId;
                  return (
                    <div 
                      key={bet.id} 
                      className={`bet-item-telegram ${index === 0 ? 'top-bet-telegram' : ''} ${isCurrentUserBet ? 'my-bet-telegram' : ''}`}
                    >
                      <div className="bet-item-content-telegram">
                        <div className="bet-item-rank-telegram">#{index + 1}</div>
                        <div className="bet-item-info-telegram">
                          <div className="bet-item-amount-telegram">
                            {formatNumber(bet.amount)} <span className="bet-currency-small">⭐</span>
                          </div>
                          <div className="bet-item-user-telegram">
                            {isCurrentUserBet ? 'Вы' : `Пользователь ${bet.userId}`}
                          </div>
                        </div>
                      </div>
                      <div className="bet-item-round-telegram">Раунд {bet.round}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Auction, User } from '../api/client';
import './AuctionList.css';

export function AuctionList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadUserBalance = useCallback(async () => {
    try {
      const userData = await apiClient.getUser();
      setUser(userData);
    } catch (err) {
      // Тихая обработка ошибки загрузки баланса
    }
  }, []);

  useEffect(() => {
    const userId = apiClient.getUserId();
    if (userId) {
      loadUserBalance();
    }
    loadAuctions();
    
    // Обновляем время каждую секунду для обновления таймеров
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
      // Обновляем баланс каждую секунду
      if (apiClient.getUserId()) {
        loadUserBalance();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadUserBalance]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAuctions('active');
      setAuctions(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки аукционов');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const diff = date.getTime() - currentTime.getTime();
      
      if (diff <= 0) return 'Завершен';
      
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
      <div className="auction-list-container">
        <div className="loading">Загрузка аукционов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auction-list-container">
        <div className="error">{error}</div>
        <button onClick={loadAuctions} className="retry-button">Повторить</button>
      </div>
    );
  }

  return (
    <div className="auction-list-container">
      <div className="page-header">
        <h1 className="page-title">Активные аукционы</h1>
        {user && user.balances && user.balances.length > 0 && (
          <div className="balance-card">
            <div className="balance-label">Ваш баланс</div>
            <div className="balance-value">
              {(() => {
                const starsBalance = user.balances.find(b => b.type === 'stars');
                return starsBalance ? (
                  <>
                    <span className="balance-amount">{formatNumber(starsBalance.balance)}</span>
                    <span className="balance-currency">⭐</span>
                  </>
                ) : (
                  <span className="no-balance">0 ⭐</span>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      {auctions.length === 0 ? (
        <div className="empty-state">Нет активных аукционов</div>
      ) : (
        <div className="auction-grid">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="auction-card"
              onClick={() => navigate(`/auction/${auction.id}`)}
            >
              <div className="auction-header">
                <span className="auction-status active">Активен</span>
                <span className="auction-round">Раунд {auction.currentRound}/{auction.roundCount}</span>
              </div>
              <div className="auction-info">
                <div className="auction-time">
                  <span className="time-label">До конца раунда:</span>
                  <span className="time-value">{formatTime(auction.roundEndTime)}</span>
                </div>
                <div className="auction-supply">
                  Подарков: {auction.supplyCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

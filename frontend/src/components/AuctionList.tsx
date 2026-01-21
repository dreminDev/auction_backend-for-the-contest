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
  const [statusFilter, setStatusFilter] = useState<'active' | 'ended'>('active');
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

  const loadAuctions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAuctions(statusFilter);
      setAuctions(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки аукционов');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Загружаем аукционы при изменении фильтра
  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  // Настройка интервала для обновления времени и данных
  useEffect(() => {
    const userId = apiClient.getUserId();
    if (userId) {
      loadUserBalance();
    }
    
    // Обновляем время каждую секунду для обновления таймеров (только для активных аукционов)
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

  // Отдельный интервал для обновления активных аукционов
  useEffect(() => {
    if (statusFilter !== 'active') {
      return;
    }

    const updateInterval = setInterval(() => {
      loadAuctions();
    }, 1000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [statusFilter, loadAuctions]);

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

  const isActive = statusFilter === 'active';

  return (
    <div className="auction-list-container">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Аукционы</h1>
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Активные
            </button>
            <button
              className={`status-tab ${statusFilter === 'ended' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ended')}
            >
              Завершенные
            </button>
          </div>
        </div>
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
        <div className="empty-state">
          {isActive ? 'Нет активных аукционов' : 'Нет завершенных аукционов'}
        </div>
      ) : (
        <div className="auction-grid">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="auction-card"
              onClick={() => navigate(`/auction/${auction.id}`)}
            >
              <div className="auction-header">
                <span className={`auction-status ${auction.status === 'active' ? 'active' : 'ended'}`}>
                  {auction.status === 'active' ? 'Активен' : 'Завершен'}
                </span>
                <span className="auction-round">Раунд {auction.currentRound}/{auction.roundCount}</span>
              </div>
              <div className="auction-info">
                {auction.status === 'active' ? (
                  <>
                    <div className="auction-time">
                      <span className="time-label">До конца раунда:</span>
                      <span className="time-value">{formatTime(auction.roundEndTime)}</span>
                    </div>
                    <div className="auction-supply">
                      Подарков: {auction.supplyCount}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="auction-time">
                      <span className="time-label">Завершен:</span>
                      <span className="time-value">
                        {auction.endedAt ? new Date(auction.endedAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '—'}
                      </span>
                    </div>
                    <div className="auction-supply">
                      Подарков: {auction.supplyCount}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

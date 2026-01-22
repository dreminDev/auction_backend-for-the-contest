import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Gift } from '../api/client';
import './Inventory.css';

export function Inventory() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyGifts();
      setGifts(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки подарков');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="loading">Загрузка инвентаря...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error">{error}</div>
        <button onClick={loadGifts} className="retry-button">Повторить</button>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <h1 className="page-title">Мой инвентарь</h1>
      {gifts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <div className="empty-text">У вас пока нет подарков</div>
          <div className="empty-subtext">Участвуйте в аукционах, чтобы получить подарки!</div>
        </div>
      ) : (
        <div className="gifts-grid">
          {gifts.map((gift) => (
            <div key={gift.id} className="gift-card">
              <div className="gift-icon">🎁</div>
              <div className="gift-info">
                <div className="gift-id">ID: {gift.giftId.slice(0, 8)}...</div>
                <div className="gift-serial">Серийный номер: #{gift.serialNumber}</div>
                <div className="gift-date">Получен: {formatDate(gift.addedAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

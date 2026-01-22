import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { GiftCollection } from '../api/client';
import { OutOfStockError } from '../api/errors';
import './CreateAuction.css';

export function CreateAuction() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<GiftCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    roundCount: 5,
    roundDuration: 60, // в секундах
    supplyCount: 10,
    giftCollectionId: '',
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGiftCollections();
      setCollections(data);
      if (data.length > 0 && !formData.giftCollectionId) {
        setFormData(prev => ({ ...prev, giftCollectionId: data[0].id }));
      }
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки коллекций');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Валидация
      if (formData.roundCount < 1 || formData.roundCount > 100) {
        throw new Error('Количество раундов должно быть от 1 до 100');
      }
      // Проверяем в секундах (минимум 5 секунд)
      if (formData.roundDuration < 5 || isNaN(formData.roundDuration)) {
        throw new Error('Длительность раунда должна быть минимум 5 секунд');
      }
      if (formData.supplyCount < 1) {
        throw new Error('Количество подарков должно быть минимум 1');
      }
      if (!formData.giftCollectionId) {
        throw new Error('Выберите коллекцию подарков');
      }

      // Конвертируем секунды в миллисекунды для API
      const roundDurationMs = formData.roundDuration * 1000;

      const auction = await apiClient.createAuction(
        formData.roundCount,
        roundDurationMs,
        formData.supplyCount,
        formData.giftCollectionId
      );

      if (!auction || !auction.id) {
        throw new Error('Аукцион не был создан. Ответ сервера не содержит ID.');
      }

      // Перенаправляем на страницу созданного аукциона
      navigate(`/auction/${auction.id}`);
    } catch (err) {
      if (err instanceof OutOfStockError) {
        setError('Подарки из этой коллекции закончились. Выберите другую коллекцию.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка создания аукциона';
        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0 && secs > 0) {
      return `${minutes} мин ${secs} сек`;
    }
    if (minutes > 0) {
      return `${minutes} мин`;
    }
    return `${seconds} сек`;
  };

  const durationPresets = [
    { label: '10 сек', value: 10 },
    { label: '30 сек', value: 30 },
    { label: '1 мин', value: 60 },
    { label: '2 мин', value: 120 },
    { label: '5 мин', value: 300 },
  ];

  if (loading) {
    return (
      <div className="create-auction-container">
        <div className="loading">Загрузка коллекций...</div>
      </div>
    );
  }

  return (
    <div className="create-auction-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Назад к аукционам
      </button>

      <div className="create-auction-card">
        <h1 className="page-title">Создать аукцион</h1>

        <form onSubmit={handleSubmit} className="create-auction-form">
          <div className="form-group">
            <label htmlFor="roundCount" className="form-label">
              Количество раундов
            </label>
            <input
              id="roundCount"
              type="number"
              min="1"
              max="100"
              value={formData.roundCount}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  roundCount: parseInt(e.target.value, 10) || 1,
                }))
              }
              className="form-input"
              disabled={submitting}
              required
            />
            <div className="form-hint">От 1 до 100 раундов</div>
          </div>

          <div className="form-group">
            <label htmlFor="roundDuration" className="form-label">
              Длительность раунда
            </label>
            <div className="duration-presets">
              {durationPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`preset-button ${formData.roundDuration === preset.value ? 'active' : ''}`}
                  onClick={() =>
                    setFormData(prev => ({ ...prev, roundDuration: preset.value }))
                  }
                  disabled={submitting}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              id="roundDuration"
              type="number"
              min="5"
              step="1"
              value={formData.roundDuration}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                // Валидация: значение должно быть >= 5 секунд
                if (isNaN(value) || value < 5) {
                  return; // Не обновляем, если значение некорректно
                }
                setFormData(prev => ({
                  ...prev,
                  roundDuration: value,
                }));
              }}
              className="form-input"
              disabled={submitting}
              required
              placeholder="Время в секундах (минимум 5)"
            />
            <div className="form-hint">
              {formatDuration(formData.roundDuration)} (минимум 5 секунд)
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="supplyCount" className="form-label">
              Количество подарков
            </label>
            <input
              id="supplyCount"
              type="number"
              min="1"
              value={formData.supplyCount}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  supplyCount: parseInt(e.target.value, 10) || 1,
                }))
              }
              className="form-input"
              disabled={submitting}
              required
            />
            <div className="form-hint">Минимум 1 подарок</div>
          </div>

          <div className="form-group">
            <label htmlFor="giftCollectionId" className="form-label">
              Коллекция подарков
            </label>
            <select
              id="giftCollectionId"
              value={formData.giftCollectionId}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, giftCollectionId: e.target.value }))
              }
              className="form-select"
              disabled={submitting || collections.length === 0}
              required
            >
              {collections.length === 0 ? (
                <option value="">Нет доступных коллекций</option>
              ) : (
                collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.collection} (доступно: {collection.availableCount} из {collection.supplyCount})
                  </option>
                ))
              )}
            </select>
            <div className="form-hint">Выберите коллекцию подарков для аукциона</div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={submitting || collections.length === 0}
          >
            {submitting ? 'Создание...' : 'Создать аукцион'}
          </button>
        </form>
      </div>
    </div>
  );
}

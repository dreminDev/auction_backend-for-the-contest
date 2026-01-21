import { useState } from 'react';
import { apiClient } from '../api/client';
import './Login.css';

interface LoginProps {
  onLogin: (userId: number) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const id = parseInt(userId, 10);
      if (isNaN(id) || id <= 0) {
        throw new Error('Введите корректный числовой ID');
      }

      apiClient.setUserId(id);
      await apiClient.getUser();
      onLogin(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
      apiClient.clearUserId();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в аукционы</h1>
        <p className="login-subtitle">Введите ваш Telegram ID</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Введите ID"
            className="login-input"
            disabled={loading}
            autoFocus
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

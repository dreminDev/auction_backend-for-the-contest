import { useState } from 'react';
import { apiClient } from '../api/client';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (userId: number) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
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
      setUserId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
      apiClient.clearUserId();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2 className="login-form-title">Вход в систему</h2>
        <p className="login-form-subtitle">Введите ваш Telegram ID для участия в аукционах</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Введите Telegram ID"
            className="login-form-input"
            disabled={loading}
            autoFocus
          />
          {error && <div className="login-form-error">{error}</div>}
          <button type="submit" className="login-form-button" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

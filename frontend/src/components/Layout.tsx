import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function Layout({ children, onLogout }: LayoutProps) {
  const location = useLocation();
  const userId = apiClient.getUserId();
  const [addingBalance, setAddingBalance] = useState(false);

  const handleLogout = () => {
    apiClient.clearUserId();
    onLogout();
  };

  const handleAddBalance = async () => {
    if (!userId || addingBalance) return;
    
    try {
      setAddingBalance(true);
      await apiClient.addBalance(50000, 'stars');
      // Баланс обновится автоматически через интервал в компонентах
    } catch (error) {
      console.error('Ошибка при добавлении баланса:', error);
      alert('Не удалось добавить баланс');
    } finally {
      setAddingBalance(false);
    }
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            🎯 Аукционы
          </Link>
          <div className="navbar-right">
            <div className="navbar-links">
              <Link
                to="/"
                className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Аукционы
              </Link>
              <Link
                to="/create"
                className={`navbar-link ${location.pathname === '/create' ? 'active' : ''}`}
              >
                Создать
              </Link>
              <Link
                to="/inventory"
                className={`navbar-link ${location.pathname === '/inventory' ? 'active' : ''}`}
              >
                Инвентарь
              </Link>
            </div>
            {userId && (
              <div className="navbar-user">
                <button 
                  onClick={handleAddBalance} 
                  className="navbar-add-balance-button"
                  disabled={addingBalance}
                  title="Добавить 50,000 ⭐"
                >
                  {addingBalance ? '...' : '+50k ⭐'}
                </button>
                <span className="navbar-user-id">ID: {userId}</span>
                <button onClick={handleLogout} className="navbar-logout-button">
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

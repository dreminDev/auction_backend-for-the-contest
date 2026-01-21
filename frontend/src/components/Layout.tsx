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

  const handleLogout = () => {
    apiClient.clearUserId();
    onLogout();
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

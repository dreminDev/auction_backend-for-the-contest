import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { AuctionList } from './components/AuctionList';
import { AuctionDetail } from './components/AuctionDetail';
import { Inventory } from './components/Inventory';
import { CreateAuction } from './components/CreateAuction';
import { apiClient } from './api/client';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = apiClient.getUserId();
    if (userId) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userId: number) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="app-loading">Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout}>
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<AuctionList />} />
            <Route path="/create" element={<CreateAuction />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PenSquare, LogOut, User, Home, Tags, Menu, X, BarChart3 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = hasRole('ROLE_ADMIN');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <PenSquare size={28} />
          <span>Q&A Platform</span>
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Home size={18} />
            <span>Trang chủ</span>
          </Link>

          <Link to="/tags" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Tags size={18} />
            <span>Tags</span>
          </Link>

          {isAuthenticated && isAdmin && (
            <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="nav-link nav-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                <PenSquare size={18} />
                <span>Viết bài</span>
              </Link>

              <div className="nav-user-menu">
                <button className="nav-user-btn">
                  <User size={18} />
                  <span>{user?.email?.split('@')[0]}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User size={16} />
                    Hồ sơ của tôi
                  </Link>
                  <Link to="/my-posts" onClick={() => setMobileMenuOpen(false)}>Bài viết của tôi</Link>
                  <button onClick={handleLogout}>
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Đăng nhập
              </Link>
              <Link to="/register" className="nav-link nav-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

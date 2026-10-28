import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Library as LibraryIcon,
  PlusCircle,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container navbar-inner">
        {/* Logo / Brand */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="navbar-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="navbar-logo-icon">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <span>PageTurn</span>
        </Link>

        {/* Center Links (Logged In) */}
        {isAuthenticated && (
          <div className="navbar-links">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              Library
            </NavLink>
            <NavLink
              to="/books/add"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              Add Book
            </NavLink>
          </div>
        )}

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAuthenticated ? (
            /* User Avatar Dropdown */
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className="avatar-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                {getUserInitials(user?.name)}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="dropdown-user-info">
                    <p className="dropdown-user-name">{user?.name || 'Reader'}</p>
                    <p className="dropdown-user-email">{user?.email || ''}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile & Goals</span>
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons (Guest) */
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          {isAuthenticated && (
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-drawer-header">
              <div className="flex items-center gap-2 font-heading font-bold">
                <div className="navbar-logo-icon">
                  <BookOpen size={16} />
                </div>
                <span>PageTurn</span>
              </div>
              <button
                type="button"
                className="btn-icon btn-ghost"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `mobile-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  `mobile-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <LibraryIcon size={18} />
                <span>My Library</span>
              </NavLink>
              <NavLink
                to="/books/add"
                className={({ isActive }) =>
                  `mobile-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={18} />
                <span>Add Book</span>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `mobile-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Profile & Goals</span>
              </NavLink>
            </div>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

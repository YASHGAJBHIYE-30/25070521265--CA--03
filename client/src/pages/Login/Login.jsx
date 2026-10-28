import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, val)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'demo@pageturn.com',
      password: 'Demo@1234',
      rememberMe: true
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (newErrors.email || newErrors.password) return;

    try {
      setIsSubmitting(true);
      await login(formData.email.trim(), formData.password);
      showToast('Welcome back to PageTurn!', 'success');
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to continue tracking your reading journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="reader@pageturn.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="login-password">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="login-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo account hint */}
          <div className="demo-account-box">
            <span className="demo-account-text">
              Demo account: <code>demo@pageturn.com</code> / <code>Demo@1234</code>
            </span>
            <button
              type="button"
              className="demo-fill-btn"
              onClick={handleFillDemo}
            >
              Auto-fill demo credentials
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account yet? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>

      {/* Decorative Quote Panel */}
      <div className="auth-panel-side" aria-hidden="true">
        <div className="panel-overlay" />
        <div className="floating-book-shape shape-1" />
        <div className="floating-book-shape shape-2" />
        <div className="panel-content">
          <blockquote className="panel-quote">
            “The more that you read, the more things you will know. The more that
            you learn, the more places you'll go.”
          </blockquote>
          <cite className="panel-author">— Dr. Seuss</cite>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Register.css';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field, value, allValues = formData) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== allValues.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, updated)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword, formData)
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      showToast('Welcome to PageTurn! Your account has been created.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
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
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Start tracking your reading journey with PageTurn today.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="input-group">
              <label className="input-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Austen"
                className={`input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                autoComplete="name"
              />
              {errors.name && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
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
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="input-group">
              <label className="input-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>

      {/* Decorative Panel */}
      <div className="auth-panel-side" aria-hidden="true">
        <div className="panel-overlay" />
        <div className="floating-book-shape shape-1" />
        <div className="floating-book-shape shape-2" />
        <div className="panel-content">
          <blockquote className="panel-quote">
            “A reader lives a thousand lives before he dies. The man who never
            reads lives only one.”
          </blockquote>
          <cite className="panel-author">— George R.R. Martin</cite>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <XCircle size={18} />;
      case 'info':
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type} ${toast.isExiting ? 'exiting' : ''}`}
          role="alert"
        >
          <div className="toast-content">
            <span className="toast-icon">{renderIcon(toast.type)}</span>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;

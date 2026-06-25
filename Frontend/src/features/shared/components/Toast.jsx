import React from 'react';
import { CloseIcon, CheckIcon, BellIcon } from './Icons';
import '../toast.scss';

const ToastItem = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckIcon className="toast-icon success" size={18} />;
      case 'error':
        return <CloseIcon className="toast-icon error" size={18} />;
      default:
        return <BellIcon className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`toast-item ${toast.type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <CloseIcon size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

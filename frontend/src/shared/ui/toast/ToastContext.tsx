'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  isLeaving?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    // Start leaving animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t))
    );
    
    // Actually remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Trigger auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const renderToastPortal = () => {
    if (!mounted || toasts.length === 0) return null;

    const toastIcons: Record<ToastType, string> = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ',
    };

    return createPortal(
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type} ${toast.isLeaving ? 'leaving' : ''}`}
            role="alert"
            aria-live="polite"
          >
            <div className="toast-content">
              <span className="toast-icon">{toastIcons[toast.type]}</span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Закрити повідомлення"
            >
              &times;
            </button>
          </div>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {renderToastPortal()}
    </ToastContext.Provider>
  );
};

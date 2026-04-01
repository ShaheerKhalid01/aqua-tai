'use client';

import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    // Ensure unique key by using timestamp + random number
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
}

function NotificationContainer({ notifications, removeNotification }) {
  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function Notification({ notification, onClose }) {
  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          background: '#10b981',
          color: 'white',
          icon: '✓'
        };
      case 'error':
        return {
          background: '#ef4444',
          color: 'white',
          icon: '✕'
        };
      case 'warning':
        return {
          background: '#f59e0b',
          color: 'white',
          icon: '⚠'
        };
      default:
        return {
          background: '#3b82f6',
          color: 'white',
          icon: 'ℹ'
        };
    }
  };

  const styles = getStyles(notification.type);

  return (
    <div style={{
      background: styles.background,
      color: styles.color,
      padding: '16px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      maxWidth: '400px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease-out',
      position: 'relative'
    }}>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {styles.icon}
      </span>
      <span style={{ flex: 1 }}>
        {notification.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        ✕
      </button>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Helper functions for common notification types
export const notify = {
  success: (message, duration) => {
    const { addNotification } = useNotification();
    addNotification(message, 'success', duration);
  },
  error: (message, duration) => {
    const { addNotification } = useNotification();
    addNotification(message, 'error', duration);
  },
  warning: (message, duration) => {
    const { addNotification } = useNotification();
    addNotification(message, 'warning', duration);
  },
  info: (message, duration) => {
    const { addNotification } = useNotification();
    addNotification(message, 'info', duration);
  }
};

"use client";
import { useState, useEffect, createContext, useContext } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = Date.now().toString();
    const notification = {
      id,
      message,
      type,
      duration,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (message, duration) => addNotification(message, "success", duration);
  const error = (message, duration) => addNotification(message, "error", duration);
  const warning = (message, duration) => addNotification(message, "warning", duration);
  const info = (message, duration) => addNotification(message, "info", duration);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxWidth: "400px"
    }}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getStyles = () => {
    const baseStyles = {
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease",
      transform: isVisible ? "translateX(0)" : "translateX(100%)",
      opacity: isVisible ? 1 : 0,
      maxWidth: "400px",
      wordWrap: "break-word"
    };

    const typeStyles = {
      success: {
        backgroundColor: "#f0fdf4",
        color: "#16a34a",
        border: "1px solid #bbf7d0"
      },
      error: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca"
      },
      warning: {
        backgroundColor: "#fffbeb",
        color: "#d97706",
        border: "1px solid #fde68a"
      },
      info: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        border: "1px solid #bfdbfe"
      }
    };

    return { ...baseStyles, ...typeStyles[notification.type] };
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️"
    };
    return icons[notification.type] || icons.info;
  };

  return (
    <div style={getStyles()}>
      <span style={{ fontSize: "16px", flexShrink: 0 }}>
        {getIcon()}
      </span>
      <span style={{ flex: 1 }}>
        {notification.message}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "inherit",
          opacity: 0.7,
          padding: "0",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.target.style.opacity = 1}
        onMouseLeave={(e) => e.target.style.opacity = 0.7}
      >
        ×
      </button>
    </div>
  );
}

export const useNotifications = () => useContext(NotificationContext);
export default NotificationProvider;

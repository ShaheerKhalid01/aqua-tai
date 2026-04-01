"use client";
import { useState, useEffect, createContext, useContext } from "react";

const ConfirmDialogContext = createContext();

export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const showConfirm = (message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      setDialog({
        message,
        onConfirm: () => {
          setDialog(null);
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          if (onCancel) onCancel();
          resolve(false);
        }
      });
    });
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      {dialog && <ConfirmDialog dialog={dialog} />}
    </ConfirmDialogContext.Provider>
  );
}

function ConfirmDialog({ dialog }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(dialog.onConfirm, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(dialog.onCancel, 300);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      transition: "opacity 0.3s ease",
      opacity: isVisible ? 1 : 0
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transform: isVisible ? "scale(1)" : "scale(0.95)",
        transition: "transform 0.3s ease"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
            flexShrink: 0
          }}>
            <span style={{ fontSize: "24px" }}>⚠️</span>
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "4px"
            }}>
              Confirm Action
            </h3>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#6b7280",
              lineHeight: "1.5"
            }}>
              {dialog.message}
            </p>
          </div>
        </div>
        
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          marginTop: "20px"
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f9fafb";
              e.target.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#6b7280";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #dc2626",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#b91c1c";
              e.target.style.borderColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#dc2626";
              e.target.style.borderColor = "#dc2626";
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export const useConfirmDialog = () => useContext(ConfirmDialogContext);
export default ConfirmDialogProvider;

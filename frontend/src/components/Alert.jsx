import React from "react";

function Alert({ message, type, onClose }) {
  if (!message) return null;

  const baseStyle =
    "flex items-center justify-between p-4 mb-4 rounded-lg shadow";

  const typeStyles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}
      role="alert"
    >
      <span>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold leading-none focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;

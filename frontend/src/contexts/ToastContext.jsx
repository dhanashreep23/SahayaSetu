import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'error') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showError = (message) => addToast(message, 'error');
  const showSuccess = (message) => addToast(message, 'success');
  const showWarning = (message) => addToast(message, 'warning');

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showWarning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast show mb-2 ${toast.type === 'error' ? 'bg-danger' : 
                      toast.type === 'success' ? 'bg-success' : 'bg-warning'} text-white`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};
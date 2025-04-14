import React from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiLoader } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, type = 'success', message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        );
      case 'loading':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <FiLoader className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={type !== 'loading' ? onClose : undefined}></div>
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 relative z-10">
        {type !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex flex-col items-center">
          {getIcon()}
          <p className="text-center text-gray-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;

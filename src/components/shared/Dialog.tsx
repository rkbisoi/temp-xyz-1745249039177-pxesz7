import React, { Fragment, useState } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  children,
}) => {
  if (!isOpen) return null;
  const [isProcessing, setIsProcessing] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-6 w-6 text-intelQEDarkBlue" />;
    }
  };

  const getHeaderClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
      default:
        return 'bg-sky-50';
    }
  };

  const handleConfirm = async () => {
    if (!onConfirm) return;

    setIsProcessing(true);
    try {
      await onConfirm(); // Execute the async action
    } finally {
      setIsProcessing(false);
      onClose(); // Close after processing completes
    }
  };

  return (
    <Fragment>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className={`${getHeaderClass()} px-6 py-4 rounded-t-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4">
            {message && <p className="text-gray-600">{message}</p>}
            {children}
          </div>

          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="btn2"
              >
                {cancelLabel}
              </button>
            )}
            {/* <button
              onClick={onConfirm || onClose}
              className={`btn1 ${type === 'error' ? 'bg-red-600 hover:bg-red-700 border-red-600' : ''}`}
            >
              {confirmLabel}
            </button> */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`btn1 ${type === 'error' ? 'bg-red-600 hover:bg-red-700 border-red-600' : ''}`}
            >
              {isProcessing ? (
                <>
                  <div className='flex flex-row justify-between'>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    <span>Processing...</span>
                  </div>

                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dialog;
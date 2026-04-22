import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Login from './Login';
import Signup from './Signup';
import houslyLogo from '../../assets/images/hously-logo.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl w-full max-w-sm shadow-2xl">
            {/* Close button inside form - top right corner */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Close"
            >
              <X size={18} className="text-gray-600" />
            </button>

            <div className="p-6">
              {/* Logo and Welcome Heading */}
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={houslyLogo} 
                  alt="Hously Finntech Realty" 
                  className="h-14 w-auto mb-3"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {isLogin 
                    ? 'Sign in to access your admin dashboard' 
                    : 'Register for a new admin account'
                  }
                </p>
              </div>
              
              {/* Tabs */}
              <div className="flex mb-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium border-b-2 transition ${
                  isLogin 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-500 border-gray-200 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              {/* <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium border-b-2 transition ${
                  !isLogin 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-500 border-gray-200 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button> */}
            </div>

              {/* Form Content */}
              {isLogin ? (
                <Login 
                  onToggle={() => setIsLogin(false)} 
                  onSuccess={() => {
                    onSuccess();
                    onClose();
                  }} 
                />
              ) : (
                <Signup 
                  onToggle={() => setIsLogin(true)} 
                  onSuccess={() => {
                    onSuccess();
                    onClose();
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
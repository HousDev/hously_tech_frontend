import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Login from './Login';
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
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modal Wrapper with Backdrop Transition */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none pointer-events-none'
        }`}
      >
        {/* Backdrop click to close */}
        <div className="fixed inset-0 cursor-default" onClick={onClose} />
        
        {/* Modal Box with Scale & Slide Transition */}
        <div 
          className={`relative bg-white rounded-2xl w-full max-w-[360px] shadow-2xl border border-slate-100/80 z-10 p-6 transition-all duration-300 transform border-t-[4px] border-t-[#0D47A1] ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer z-20"
          >
            <X size={16} />
          </button>

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-5 mt-2">
            <img 
              src={houslyLogo} 
              alt="Hously Finntech Realty" 
              className="h-10 w-auto mb-3 object-contain"
            />
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 text-center uppercase tracking-wider">
              {isLogin ? 'Admin Portal Access' : 'Register Admin Account'}
            </p>
          </div>
          
       
       

          {/* Form Content */}
          <div className="min-h-0 select-text">
            {isLogin ? (
              <Login 
                onToggle={() => setIsLogin(false)} 
                onSuccess={() => {
                  onSuccess();
                  onClose();
                }} 
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({  onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (user?.role !== 'admin') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Admin access only!');
          setLoading(false);
          return;
        }
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        }
        
        toast.success('Admin login successful!');
        setTimeout(() => {
          navigate('/homes/admin');
          onSuccess();
        }, 1000);
      } else {
        setError(result.message || 'Login failed');
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@houslytech.com"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-8 pr-10 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3 w-3 text-blue-600 rounded"
              disabled={loading}
            />
            <span className="ml-1.5 text-xs text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs text-blue-600 hover:text-blue-800"
            disabled={loading}
            onClick={() => toast.info('Please contact admin to reset password')}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-xs font-medium disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
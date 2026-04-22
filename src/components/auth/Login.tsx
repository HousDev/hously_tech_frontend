/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';
import { login } from '../../services/authService';
import type { LoginCredentials, FormErrors } from '../../types/auth.types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await login(formData);
      
      if (response.success) {
        // Check if user is admin
        if (response.data.user.role !== 'admin') {
          // Clear any stored data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
          
          // Show admin access error
          toast.error(
            <div className="flex items-start space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Admin Access Required</p>
                <p className="text-sm">This portal is for administrators only.</p>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          
          // ADDED: Redirect to home page immediately
          navigate('/');
          onSuccess(); // Close modal
          
          setLoading(false);
          return;
        }
        
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', formData.email);
        }
        
        toast.success(' Admin login successful!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          navigate('/admin');
          onSuccess();
        }, 1500);
      } else {
        toast.error(`❌ ${response.message || 'Login failed. Please check your credentials.'}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      let isAdminError = false;
      
      if (error?.response?.data?.errors) {
        // Extract validation errors from backend
        const validationErrors = error.response.data.errors;
        errorMessage = validationErrors.map((err: any) => err.msg).join(', ');
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Check for admin access denied error
        if (errorMessage.toLowerCase().includes('admin') || 
            errorMessage.toLowerCase().includes('privileges') ||
            errorMessage.toLowerCase().includes('access denied')) {
          isAdminError = true;
          
          toast.error(
            <div className="flex items-start space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Admin Access Required</p>
                <p className="text-sm">This portal is for administrators only. Redirecting to home...</p>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              onClose: () => {
                navigate('/');
                onSuccess();
              }
            }
          );
          
          // ADDED: Redirect to home page immediately
          navigate('/');
          onSuccess();
          
          setLoading(false);
          return;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Only show regular error toast if not an admin error
      if (!isAdminError) {
        toast.error(`❌ ${errorMessage}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (remembered === 'true' && rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Admin Access Notice */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
        <div className="flex items-start">
          <ShieldAlert className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-800">Admin Portal Access</p>
            <p className="text-xs text-blue-600 mt-0.5">
              This portal is restricted to administrators only. Regular users will be redirected to the home page.
            </p>
          </div>
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@houslytech.com"
              className={`w-full pl-8 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.email ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-600 hover:text-blue-800 transition"
              disabled={loading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-8 pr-10 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.password ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <span className="ml-1.5 text-xs text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs text-blue-600 hover:text-blue-800 transition"
            disabled={loading}
            onClick={() => toast.info('Please contact admin to reset password', {
              position: "top-right",
              autoClose: 3000,
            })}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying Admin Access...
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Sign In 
            </>
          )}
        </button>
      </form>

      {/* Toggle to signup */}
      {/* <div className="text-center pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Don't have an admin account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="font-medium text-blue-600 hover:text-blue-800 transition"
            disabled={loading}
          >
            Sign Up
          </button>
        </p>
      </div> */}
    </div>
  );
};

export default Login;
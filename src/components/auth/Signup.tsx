/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { signup } from '../../services/authService';
import type { SignupCredentials, FormErrors } from '../../types/auth.types';
import { toast } from 'react-toastify';

interface SignupProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggle, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
  };

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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await signup(formData);
      
      if (response.success) {
        toast.success('✅ Account created successfully! Redirecting to login...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          onToggle();
        }, 1500);
      } else {
        toast.error(`❌ ${response.message || 'Signup failed'}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      // Handle different types of errors
      if (error?.response?.data?.errors) {
        // Validation errors from backend
        const validationErrors = error.response.data.errors;
        errorMessage = validationErrors.map((err: any) => err.msg).join(', ');
      } else if (error?.response?.data?.message) {
        // Specific error message from backend
        errorMessage = error.response.data.message;
        
        // Check for user already exists error
        if (errorMessage.toLowerCase().includes('already exists') || 
            errorMessage.toLowerCase().includes('user with this')) {
          errorMessage = '❌ User with this email already exists. Please login instead.';
        }
      } else if (error.message) {
        // Network or other errors
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-8 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.name ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

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
              placeholder="john@example.com"
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
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
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
          <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              className={`w-full pl-8 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-3">
            <input
              type="checkbox"
              className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div className="ml-2 text-xs">
            <label className="text-gray-600">
              I agree to the{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 transition underline"
                onClick={() => toast.info('Terms of Service page would open here', {
                  position: "top-right",
                  autoClose: 2000,
                })}
              >
                Terms
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 transition underline"
                onClick={() => toast.info('Privacy Policy page would open here', {
                  position: "top-right",
                  autoClose: 2000,
                })}
              >
                Privacy Policy
              </button>
            </label>
          </div>
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
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Toggle to login */}
      <div className="text-center pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggle}
            className="font-medium text-blue-600 hover:text-blue-800 transition"
            disabled={loading}
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
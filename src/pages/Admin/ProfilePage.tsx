{/* eslint-disable @typescript-eslint/no-explicit-any */}
// ProfilePage.tsx
import { useState, useEffect, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getUserProfile, 
  updateUserProfile, 
  changeUserPassword,
  getAccountStats,
  getCurrentUser
} from '../../services/authService';
import type { User } from '../../types/auth.types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Lock, 
  Calendar, 
  Clock, 
  IdCard,
  Edit2,
  Save,
  X,
  Shield,
  UserCheck,
  Menu,
  ChevronDown,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';

interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  username: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [accountStats, setAccountStats] = useState({
    member_since: '',
    last_login: '',
    user_id: '',
    account_type: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setCurrentPasswordFromServer] = useState<string>('********');

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileFormData>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  useEffect(() => {
    fetchUserProfile();
    // Get current password placeholder (masked)
    const currentUser = getCurrentUser();
    if (currentUser) {
      // In a real app, you might want to show a placeholder like "Current password"
      setCurrentPasswordFromServer('••••••••');
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        resetProfile({
          full_name: response.data.full_name || '',
          email: response.data.email,
          phone: response.data.phone || '',
          bio: response.data.bio || '',
          username: response.data.username
        });

        // Fetch additional account info
        await fetchAccountStats();
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountStats = async () => {
    try {
      const response:any = await getAccountStats();
      if (response.success && response.data) {
        setAccountStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load account stats:', error);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const response = await updateUserProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (data.oldPassword === data.newPassword) {
      toast.error('New password cannot be the same as current password');
      return;
    }

    try {
      const response = await changeUserPassword(data.oldPassword, data.newPassword);
      
      if (response.success) {
        toast.success('Password changed successfully');
        setIsChangingPassword(false);
        resetPassword();
        // Reset password visibility
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
      'admin': { 
        bg: 'bg-purple-100', 
        text: 'text-purple-800',
        icon: <Shield className="w-4 h-4" />
      },
      'user': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        icon: <UserCheck className="w-4 h-4" />
      }
    };

    const statusInfo = statusMap[status?.toLowerCase()] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800',
      icon: <UserIcon className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'User'}
      </span>
    );
  };

  // Toggle password visibility
  const togglePasswordVisibility = (type: 'current' | 'new' | 'confirm') => {
    switch (type) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Header Section - Made responsive */}
      
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Profile Information */}
          <div className="flex-1 space-y-6">
            {/* Personal Information Card - Made responsive */}
            <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow w-full sm:w-auto"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          resetProfile();
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleProfileSubmit(onProfileSubmit)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          Full Name
                        </span>
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            {...registerProfile('full_name')}
                            type="text"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Enter your full name"
                          />
                          <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-900 font-medium text-sm sm:text-base">
                            {user?.full_name || 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <IdCard className="w-4 h-4 text-gray-400" />
                          Username
                        </span>
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            {...registerProfile('username')}
                            type="text"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Enter username"
                          />
                          <IdCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-900 font-medium text-sm sm:text-base">
                            {user?.username || 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          Email Address
                        </span>
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            {...registerProfile('email')}
                            type="email"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Enter email address"
                          />
                          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-900 font-medium text-sm sm:text-base">
                            {user?.email || 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          Phone Number
                        </span>
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            {...registerProfile('phone')}
                            type="tel"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Enter phone number"
                          />
                          <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-900 font-medium text-sm sm:text-base">
                            {user?.phone || 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bio / About Me
                    </label>
                    {isEditing ? (
                      <textarea
                        {...registerProfile('bio')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 resize-none text-sm sm:text-base"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[120px]">
                        <p className="text-gray-900 whitespace-pre-line text-sm sm:text-base">
                          {user?.bio || 'No bio provided'}
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password Card - Made responsive */}
            <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  </div>
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 w-full sm:w-auto"
                    >
                      <Key className="w-4 h-4" />
                      Change Password
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          resetPassword();
                          // Reset password visibility
                          setShowCurrentPassword(false);
                          setShowNewPassword(false);
                          setShowConfirmPassword(false);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordSubmit(onPasswordSubmit)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        <Save className="w-4 h-4" />
                        Update Password
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isChangingPassword ? (
                <div className="p-4 sm:p-6">
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-900">Current Password</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Enter your current password to verify your identity. 
                          We cannot show your actual password for security reasons.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('oldPassword', { 
                            required: 'Current password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                          })}
                          type={showCurrentPassword ? "text" : "password"}
                          className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                          placeholder="Enter your current password"
                        />
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.oldPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.oldPassword.message}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            {...registerPassword('newPassword', { 
                              required: 'New password is required',
                              minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Enter new password"
                          />
                          <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            {...registerPassword('confirmPassword', { 
                              required: 'Please confirm your password',
                              validate: value => value === newPassword || 'Passwords do not match'
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm sm:text-base"
                            placeholder="Confirm new password"
                          />
                          <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${newPassword?.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          At least 6 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          Include uppercase and lowercase letters
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          Include at least one number
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Key className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Password Management</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Your password is securely stored. Click "Change Password" to update it.
                      </p>
                    </div>
                    <div className="w-full max-w-xs mx-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Current Password</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="flex">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-gray-400 rounded-full mx-0.5"></div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">••••••••</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Securely encrypted</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Account Information - Always visible, responsive layout */}
          <div className="lg:w-80">
            <div className={`bg-white rounded-xl  border border-gray-200 overflow-hidden ${isMobileMenuOpen ? 'block' : 'block lg:block'}`}>
              <div className="border-b border-gray-100 px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-1"
                  >
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              <div className={`${isMobileMenuOpen ? 'block' : 'hidden lg:block'} p-4 sm:p-6 space-y-6`}>
                {/* Account Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Account Type</span>
                  </div>
                  {getStatusBadge(accountStats.account_type || user?.role || 'user')}
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {formatDate(accountStats.member_since || user?.created_at || '')}
                    </p>
                  </div>
                </div>

                {/* Last Login */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Login</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {formatDate(accountStats.last_login)}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <IdCard className="w-4 h-4" />
                    <span className="text-sm font-medium">User ID</span>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {accountStats.user_id || user?.id || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{user?.role === 'admin' ? 'Admin' : 'Standard'}</div>
                      <div className="text-xs text-gray-500 mt-1">Access Level</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">Active</div>
                      <div className="text-xs text-gray-500 mt-1">Status</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <span>Edit Profile</span>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <span>Change Password</span>
                      <Key className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
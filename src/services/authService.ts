import type { AxiosResponse } from "axios";
import api from "../lib/api";

/* ---------------- TYPES ---------------- */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AccountStats {
  member_since: string;
  last_login: string;
  user_id: string | number;
  account_type: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/* ---------------- AUTH FUNCTIONS ---------------- */

// Login
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post(
    "/auth/login",
    credentials
  );

  if (response.data.success) {
    const { user, token } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

// Signup - FIXED VERSION
export const signup = async (
  credentials: SignupCredentials
): Promise<AuthResponse> => {
  // Generate a clean username from email
  // Remove dots, hyphens and special chars, replace with underscore
  const cleanUsername = credentials.email
    .split("@")[0]
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 20); // Limit length

  const response: AxiosResponse<AuthResponse> = await api.post(
    "/auth/register",
    {
      username: cleanUsername,
      email: credentials.email,
      password: credentials.password,
      full_name: credentials.name,
    }
  );

  if (response.data.success) {
    const { user, token } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? (JSON.parse(userStr) as User) : null;
};

// Get user profile from server
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/profile');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile',
    };
  }
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await api.put('/auth/profile', profileData);
    
    if (response.data.success && response.data.data) {
      // Update local storage with new user data
      const currentUser = getCurrentUser();
      const updatedUser = {
        ...currentUser,
        ...response.data.data
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile',
    };
  }
};

// Update profile (alias for backward compatibility)
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await updateUserProfile(data);
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.message);
};

// Change password
export const changeUserPassword = async (
  oldPassword: string, 
  newPassword: string
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.put('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change password',
    };
  }
};

// Change password (alias for backward compatibility)
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await changeUserPassword(oldPassword, newPassword);
  return {
    success: response.success,
    message: response.message
  };
};

// Get account statistics (member since, last login, etc.)
export const getAccountStats = async (): Promise<ApiResponse<AccountStats>> => {
  try {
    const response: AxiosResponse<ApiResponse<AccountStats>> = await api.get('/auth/account-stats');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching account stats:', error);
    
    // Fallback to user data if stats endpoint doesn't exist
    const user = getCurrentUser();
    if (user) {
      return {
        success: true,
        message: 'Success',
        data: {
          member_since: user.created_at || new Date().toISOString(),
          last_login: user.updated_at || user.created_at || new Date().toISOString(),
          user_id: user.id.toString(),
          account_type: user.role
        }
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch account statistics',
    };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'avatar');
    
    const response = await api.post(`/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.data.success) {
      // Update user profile with new avatar URL
      await updateUserProfile({ avatar_url: response.data.data.url });
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload profile picture',
    };
  }
};

// Auth check
export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("token"));
};

// Admin check
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// Check if user can access admin area
export const canAccessAdmin = (): boolean => {
  return isAuthenticated() && isAdmin();
};

// Refresh token (if implementing token refresh)
export const refreshToken = async (): Promise<{ success: boolean; token?: string }> => {
  try {
    const response = await api.post('/auth/refresh');
    if (response.data.success) {
      const newToken = response.data.data.token;
      localStorage.setItem('token', newToken);
      return { success: true, token: newToken };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
};

// Get user role
export const getUserRole = (): string => {
  const user = getCurrentUser();
  return user?.role || 'user';
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

// Get user display name
export const getUserDisplayName = (): string => {
  const user = getCurrentUser();
  return user?.full_name || user?.username || user?.email || 'User';
};

// Clear all auth data
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth');
};

// Verify token validity
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.success === true;
  } catch (error) {
    return false;
  }
};

export default api;
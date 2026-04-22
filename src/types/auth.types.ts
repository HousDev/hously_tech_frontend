// auth.types.ts
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

export interface ValidationError {
  msg: string;
  param: string;
  location?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
}

export interface FormErrors {
  [key: string]: string;
}
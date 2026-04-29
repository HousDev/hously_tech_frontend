// lib/api.ts

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
// ─── Base URL ────────────────────────────────────────────────────────────────

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Axios Instance ──────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // ❌ Don't set Content-Type here (important for file upload)
});

// ─── Request Interceptor (Attach Token) ──────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (Handle Errors) ────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect if not admin route
      if (!window.location.pathname.includes("/homes/admin")) {
        window.location.href = "/homes";
      }
    }

    return Promise.reject(error);
  }
);

// ─── API Response Type ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── Helper: unwrap response ─────────────────────────────────────────────────

export async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const res = await promise;

  if (!res.data.success) {
    throw new Error(res.data.message || "Request failed");
  }

  return res.data.data as T;
}

// ─── Generic API Methods (Optional but Clean) ────────────────────────────────

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(api.get(url, config)),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.post(url, data, config)),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.put(url, data, config)),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.patch(url, data, config)),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(api.delete(url, config)),
};

// ─── File Upload Helper ──────────────────────────────────────────────────────

export const uploadFile = <T>(
  url: string,
  file: File,
  fieldName: string = "file"
) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  return unwrap<T>(
    api.post(url, formData, {
      headers: {
        // optional — axios usually sets automatically
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

// ─── Export Default Instance ─────────────────────────────────────────────────

export default api;
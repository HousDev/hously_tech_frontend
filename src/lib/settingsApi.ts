// lib/settingsApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface LogoData {
  navbarLogo: string;
  footerLogo: string;
  favicon: string;
}

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  siteUrl: string;
}

export interface SecuritySettings {
  requireAdminApproval: boolean;
  enable2FA: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

export interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  theme: 'light' | 'dark' | 'auto';
  enableDarkMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  adminNotifications: boolean;
  jobApplicationAlerts: boolean;
  blogCommentAlerts: boolean;
}

export interface AllSettings extends LogoData, GeneralSettings, SecuritySettings, AppearanceSettings, NotificationSettings {}

// ─── API ───────────────────────────────────────────────────────────────

export const settingsApi = {
  // ─── Logos ──────────────────────────────────────────────────────────

  /** GET logo settings (public) */
  getLogos: (): Promise<LogoData> =>
    unwrap(api.get<ApiResponse<LogoData>>('/settings/logos')),

  /** UPLOAD logo (navbar or footer) */
  uploadLogo: async (type: 'navbar' | 'footer', file: File): Promise<{ url: string; fullUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('type', type);

    const res = await api.post<ApiResponse<{ url: string; fullUrl: string; filename: string }>>(
      '/settings/logos/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (!res.data.success) {
      throw new Error(res.data.message || 'Logo upload failed');
    }
    return res.data.data!;
  },

  /** UPLOAD favicon */
// lib/settingsApi.ts - Update uploadFavicon function
uploadFavicon: async (file: File): Promise<{ url: string; fullUrl: string; filename: string }> => {
  const formData = new FormData();
  formData.append('favicon', file);  // Field name must match backend

  // Use the upload route instead of settings route for file upload
  const res = await api.post<ApiResponse<{ url: string; fullUrl: string; filename: string }>>(
    '/upload/favicon',  // Changed from /settings/logos/favicon
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || 'Favicon upload failed');
  }
  
  // After successful upload, update the database with the new favicon URL
  const uploadResult = res.data.data!;
  
  // Update the settings with the new favicon URL
  await api.put('/settings/logos', {
    favicon: uploadResult.fullUrl
  });
  
  return uploadResult;
},

  /** RESET logos to defaults */
  resetLogos: (): Promise<LogoData> =>
    unwrap(api.post<ApiResponse<LogoData>>('/settings/logos/reset', {})),

  // ─── General Settings ───────────────────────────────────────────────

  /** GET general settings */
  getGeneral: (): Promise<GeneralSettings> =>
    unwrap(api.get<ApiResponse<GeneralSettings>>('/settings/general')),

  /** UPDATE general settings */
  updateGeneral: (data: Partial<GeneralSettings>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/general', data)),

  // ─── Security Settings ──────────────────────────────────────────────

  /** GET security settings */
  getSecurity: (): Promise<SecuritySettings> =>
    unwrap(api.get<ApiResponse<SecuritySettings>>('/settings/security')),

  /** UPDATE security settings */
  updateSecurity: (data: Partial<SecuritySettings>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/security', data)),

  // ─── Appearance Settings ────────────────────────────────────────────

  /** GET appearance settings */
  getAppearance: (): Promise<AppearanceSettings> =>
    unwrap(api.get<ApiResponse<AppearanceSettings>>('/settings/appearance')),

  /** UPDATE appearance settings */
  updateAppearance: (data: Partial<AppearanceSettings>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/appearance', data)),

  // ─── Notification Settings ──────────────────────────────────────────

  /** GET notification settings */
  getNotifications: (): Promise<NotificationSettings> =>
    unwrap(api.get<ApiResponse<NotificationSettings>>('/settings/notifications')),

  /** UPDATE notification settings */
  updateNotifications: (data: Partial<NotificationSettings>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/notifications', data)),

  // ─── All Settings ───────────────────────────────────────────────────

  /** GET all settings */
  getAll: (): Promise<AllSettings> =>
    unwrap(api.get<ApiResponse<AllSettings>>('/settings/all')),

  /** UPDATE all settings */
  updateAll: (data: Partial<AllSettings>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/all', data)),
};
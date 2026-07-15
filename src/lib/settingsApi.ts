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

export interface AttendanceSecuritySettings {
  punchInRadius: number;
  punchOutRadius: number;
  maxDistance: number;
  allowRemotePunch: boolean;
  autoPunchOut: boolean;
  autoPunchOutRadius: number;
  delay: number;
  geolocationTracking: boolean;
  selfieOnPunch: boolean;
  maxPunchInTime: string;
  minPunchOutTime: string;
  allowWeekendPunch: boolean;
  lateTime?: string;
  lateAmount?: number;
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

  // ─── Attendance Security Settings ───────────────────────────────────

  /** GET attendance security settings */
  getAttendanceSecurity: (): Promise<AttendanceSecuritySettings> =>
    unwrap(api.get<ApiResponse<AttendanceSecuritySettings>>('/settings/attendance-security')),

  /** UPDATE attendance security settings */
  updateAttendanceSecurity: (data: AttendanceSecuritySettings): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/settings/attendance-security', data)),

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

  // ─── Companies & Branches ──────────────────────────────────────────

  getCompanies: (): Promise<Company[]> =>
    unwrap(api.get<ApiResponse<Company[]>>('/companies')),

  createCompany: (data: Omit<Company, 'id' | 'createdAt' | 'branches'>): Promise<Company> =>
    unwrap(api.post<ApiResponse<Company>>('/companies', data)),

  updateCompany: (id: string, data: Partial<Omit<Company, 'id' | 'createdAt' | 'branches'>>): Promise<Company> =>
    unwrap(api.put<ApiResponse<Company>>(`/companies/${id}`, data)),

  deleteCompany: (id: string): Promise<boolean> =>
    unwrap(api.delete<ApiResponse<boolean>>(`/companies/${id}`)),

  createBranch: (companyId: string, data: Omit<Branch, 'id' | 'createdAt'>): Promise<Branch> =>
    unwrap(api.post<ApiResponse<Branch>>('/companies/branches', { companyId, ...data })),

  updateBranch: (id: string, data: Partial<Omit<Branch, 'id' | 'createdAt'>>): Promise<Branch> =>
    unwrap(api.put<ApiResponse<Branch>>(`/companies/branches/${id}`, data)),

  deleteBranch: (id: string): Promise<boolean> =>
    unwrap(api.delete<ApiResponse<boolean>>(`/companies/branches/${id}`)),
};

export interface Branch {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'active' | 'inactive';
  createdAt: string;
  branches: Branch[];
}
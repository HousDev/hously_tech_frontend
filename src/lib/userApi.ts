// lib/userApi.ts
import api, { unwrap, type ApiResponse } from "./api";

export type UserStatus = "active" | "inactive" | "blocked";
export type UserRole = string;
export type UserGender = "male" | "female" | "other";

export interface UserRecord {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  isEmployee: boolean;
  isActive: boolean;
  avatarUrl?: string;
  companyName?: string;
  attendanceLocation?: string;
  dateOfJoining?: string;
  gender?: UserGender;
  allottedProjects?: string;
  createdAt: string;
}

export const userApi = {
  getAll: (filters?: Record<string, any>): Promise<UserRecord[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return unwrap(api.get<ApiResponse<UserRecord[]>>(`/users?${params.toString()}`));
  },

  getById: (id: string): Promise<UserRecord> =>
    unwrap(api.get<ApiResponse<UserRecord>>(`/users/${id}`)),

  create: (payload: Omit<UserRecord, "id" | "createdAt"> & { password?: string }): Promise<UserRecord> =>
    unwrap(api.post<ApiResponse<UserRecord>>("/users", payload)),

  update: (id: string, payload: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> =>
    unwrap(api.put<ApiResponse<UserRecord>>(`/users/${id}`, payload)),

  toggleStatus: (id: string, status: UserStatus, isActive: boolean): Promise<UserRecord> =>
    unwrap(api.patch<ApiResponse<UserRecord>>(`/users/${id}/status`, { status, isActive })),

  changePassword: (id: string, password: string): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/users/${id}/password`, { password })),

  delete: (id: string): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/users/${id}`)),

  bulkDelete: async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map((id) => userApi.delete(id)));
  },

  uploadAvatar: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file as Base64"));
      };
      reader.readAsDataURL(file);
    });
  }
};

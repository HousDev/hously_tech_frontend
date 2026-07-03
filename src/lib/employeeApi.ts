// lib/employeeApi.ts
import api, { unwrap, type ApiResponse } from "./api";

export type EmployeeStatus = "active" | "on_leave" | "inactive" | "terminated";
export type EmployeeGender = "male" | "female" | "other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type Nationality = "Indian" | "Other";
export type WeekOffDays = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface EmployeeRecord {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  joinDate: string;
  gender?: EmployeeGender;
  avatarUrl?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  address?: string;
  bloodGroup?: BloodGroup;
  company?: string;
  attendanceLocation?: string;
  allottedProjects?: string[];
  maritalStatus?: MaritalStatus;
  nationality?: Nationality;
  aadharNumber?: string;
  panNumber?: string;
  permanentAddress?: string;
  currentAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  highestQualification?: string;
  university?: string;
  passingYear?: string;
  percentage?: string;
  weekOffDays?: WeekOffDays[];
  employeeType?: "Permanent" | "Contract" | "Intern" | "Probation";
  workMode?: "Office" | "Remote" | "Hybrid";
  probationPeriod?: number;
  dateOfLeaving?: string;
  noticePeriod?: number;
  salary?: number;
  salaryType?: "Monthly" | "Weekly" | "Hourly";
  punchInTime?: string;
  laptopAssigned?: "Yes" | "No";
  systemLoginId?: string;
  systemPassword?: string;
  officeEmailId?: string;
  officeEmailPassword?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  createdAt: string;
}

export const employeeApi = {
  getAll: (filters?: Record<string, any>): Promise<EmployeeRecord[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return unwrap(api.get<ApiResponse<EmployeeRecord[]>>(`/employees?${params.toString()}`));
  },

  getById: (id: string): Promise<EmployeeRecord> =>
    unwrap(api.get<ApiResponse<EmployeeRecord>>(`/employees/${id}`)),

  update: (id: string, payload: Omit<EmployeeRecord, "id" | "employeeId" | "createdAt">): Promise<EmployeeRecord> =>
    unwrap(api.put<ApiResponse<EmployeeRecord>>(`/employees/${id}`, payload)),

  updateStatus: (id: string, status: EmployeeStatus): Promise<EmployeeRecord> =>
    unwrap(api.patch<ApiResponse<EmployeeRecord>>(`/employees/${id}/status`, { status })),

  delete: (id: string): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/employees/${id}`)),

  bulkDelete: async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map((id) => employeeApi.delete(id)));
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const res = await api.post<ApiResponse<{ url: string; fullUrl: string }>>(
      "/upload/team-image",
      formData
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Avatar upload failed");
    }

    return res.data.data!.fullUrl;
  }
};

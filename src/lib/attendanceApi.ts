import api, { unwrap, type ApiResponse } from "./api";

export interface PunchPayload {
  isCheckingIn: boolean;
  latitude: number;
  longitude: number;
  selfieBase64?: string;
  deviceInfo?: string;
  workMode?: string;
  shift?: string;
}

export interface AttendanceStatusResponse {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  assignedBranch: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  securitySettings: {
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
  };
  todayLog: {
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    hours: string;
    status: 'Present' | 'Absent' | 'Half Day' | 'Late';
    workMode: 'Office' | 'Remote' | 'Hybrid';
    shift: string;
    faceCapture?: string;
    faceCaptureOut?: string;
  } | null;
}

export const attendanceApi = {
  getStatus: (): Promise<AttendanceStatusResponse> =>
    unwrap(api.get<ApiResponse<AttendanceStatusResponse>>('/attendance/status')),

  punch: (payload: PunchPayload): Promise<{ message?: string; isLate?: boolean; checkInTime?: string; checkOutTime?: string; duration?: string }> =>
    unwrap(api.post<ApiResponse<{ message?: string; isLate?: boolean; checkInTime?: string; checkOutTime?: string; duration?: string }>>('/attendance/punch', payload)),

  getLogs: (): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>('/attendance/logs')),

  getAdminLogs: (dateStr?: string): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>(`/attendance/admin/logs?date=${dateStr || ''}`)),

  getAdminUserLogs: (userId: number, month: number, year: number): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>(`/attendance/admin/user-logs?userId=${userId}&month=${month}&year=${year}`)),

  saveManualAttendance: (payload: {
    userId: number;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
    workMode?: string;
    location?: string;
    hours?: string;
    leaveType?: string;
    comment?: string;
  }): Promise<{ message: string }> =>
    unwrap(api.post<ApiResponse<{ message: string }>>('/attendance/admin/save', payload)),

  getRegularizations: (): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>('/attendance/regularizations')),

  submitRegularization: (payload: {
    type: 'regularization' | 'issue';
    date: string;
    requestedIn?: string;
    requestedOut?: string;
    reason: string;
    category?: string;
  }): Promise<{ id: string }> =>
    unwrap(api.post<ApiResponse<{ id: string }>>('/attendance/regularizations', payload)),
};

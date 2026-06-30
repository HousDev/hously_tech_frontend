// lib/meetingApi.ts
// Standalone meeting API — follows same pattern as enquiryApi.ts

import api, { unwrap, type ApiResponse } from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Meeting {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  title: string;
  description: string | null;
  meeting_type: 'virtual' | 'in_person';
  platform: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  zoom_link: string | null;
  custom_message: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  notes: string | null;
  reminder_sent: boolean;
  reminder_10m_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeetingPayload {
  client_name: string;
  client_email: string;
  client_phone?: string;
  title: string;
  description?: string;
  meeting_type: 'virtual' | 'in_person';
  platform?: string;
  location?: string;
  start_time: string;  // ISO string or 'YYYY-MM-DD HH:mm:ss'
  end_time: string;
  notes?: string;
}

export interface MeetingFilters {
  status?: 'all' | 'scheduled' | 'completed' | 'cancelled';
  meeting_type?: 'all' | 'virtual' | 'in_person';
  search?: string;
  startDate?: string;
  endDate?: string;
  timeFilter?: 'all' | 'upcoming' | 'past' | 'today';
}

export interface MeetingStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  virtual_count: number;
  in_person_count: number;
  today: number;
  upcoming: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const meetingApi = {

  // ─── PUBLIC: Client books a meeting ───────────────────────────────────────
  /** POST /api/meetings — public, no auth required */
  create: (payload: MeetingPayload): Promise<Meeting> =>
    unwrap(api.post<ApiResponse<Meeting>>('/meetings', payload)),

  // ─── ADMIN: Read ──────────────────────────────────────────────────────────

  /** GET /api/meetings — admin: get all meetings with optional filters */
  getAll: (filters?: MeetingFilters): Promise<Meeting[]> => {
    const params = new URLSearchParams();
    if (filters?.status       && filters.status       !== 'all') params.append('status',       filters.status);
    if (filters?.meeting_type && filters.meeting_type !== 'all') params.append('meeting_type', filters.meeting_type);
    if (filters?.timeFilter   && filters.timeFilter   !== 'all') params.append('timeFilter',   filters.timeFilter);
    if (filters?.search)     params.append('search',    filters.search);
    if (filters?.startDate)  params.append('startDate', filters.startDate);
    if (filters?.endDate)    params.append('endDate',   filters.endDate);
    const qs = params.toString();
    return unwrap(api.get<ApiResponse<Meeting[]>>(`/meetings${qs ? `?${qs}` : ''}`));
  },

  /** GET /api/meetings/:id — admin: get single meeting */
  getById: (id: number): Promise<Meeting> =>
    unwrap(api.get<ApiResponse<Meeting>>(`/meetings/${id}`)),

  /** GET /api/meetings/stats — admin: dashboard stats */
  getStats: (): Promise<MeetingStats> =>
    unwrap(api.get<ApiResponse<MeetingStats>>('/meetings/stats')),

  // ─── ADMIN: Write ─────────────────────────────────────────────────────────

  /** PATCH /api/meetings/:id/zoom — admin saves Zoom link */
  updateZoomLink: (id: number, zoom_link: string, custom_message?: string | null, attachment_path?: string | null, attachment_name?: string | null): Promise<Meeting> =>
    unwrap(api.patch<ApiResponse<Meeting>>(`/meetings/${id}/zoom`, { zoom_link, custom_message, attachment_path, attachment_name })),

  /** UPLOAD attachment file */
  uploadAttachment: async (file: File): Promise<{ url: string; fullUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<{ url: string; fullUrl: string; filename: string }>>(
      '/upload/attachment',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    if (!res.data.success) {
      throw new Error(res.data.message || 'File upload failed');
    }
    return res.data.data!;
  },

  /** PATCH /api/meetings/:id/status — admin updates status */
  updateStatus: (id: number, status: Meeting['status']): Promise<Meeting> =>
    unwrap(api.patch<ApiResponse<Meeting>>(`/meetings/${id}/status`, { status })),

  /** DELETE /api/meetings/:id — admin deletes meeting */
  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/meetings/${id}`)),

  /** POST /api/meetings/bulk-delete — admin bulk deletes meetings */
  bulkDelete: (ids: number[]): Promise<void> =>
    unwrap(api.post<ApiResponse<void>>('/meetings/bulk-delete', { ids })),

  /** PATCH /api/meetings/:id/reschedule — admin reschedules meeting */
  reschedule: (id: number, start_time: string, end_time: string): Promise<Meeting> =>
    unwrap(api.patch<ApiResponse<Meeting>>(`/meetings/${id}/reschedule`, { start_time, end_time })),
};

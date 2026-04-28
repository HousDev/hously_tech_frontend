// lib/enquiryApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface Interaction {
  id: number;
  enquiry_id: number;
  type: 'call' | 'email' | 'meeting' | 'note';
  direction: 'outgoing' | 'incoming';
  subject: string;
  content: string;
  duration?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  created_by: number;
  created_at: string;
  metadata?: {
    call_type?: 'cold' | 'follow_up' | 'discovery' | 'closing';
    email_subject?: string;
    meeting_type?: 'virtual' | 'in_person';
  };
}

export interface Meeting {
  id: number;
  enquiry_id: number;
  title: string;
  description: string;
  meeting_type: 'virtual' | 'in_person';
  platform?: string;
  location?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  participants: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUpAction {
  id: number;
  enquiry_id: number;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assigned_to: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface Enquiry {
  id: number;
  full_name: string;
  company_name: string | null;
  email: string;
  phone_number: string | null;
  inquiry_type: string;
  service_type: string | null;
  project_budget: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'closed' | 'converted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  ip_address: string | null;
  assigned_to: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  interaction_history?: Interaction[];
  scheduled_meetings?: Meeting[];
  follow_up_actions?: FollowUpAction[];
}

export interface EnquiryStats {
  total: number;
  new: number;
  in_progress: number;
  contacted: number;
  closed: number;
  converted: number;
  urgent: number;
  today: number;
  meetings_today: number;
  follow_ups_overdue: number;
}

export interface InteractionPayload {
  type: 'call' | 'email' | 'meeting' | 'note';
  direction: 'outgoing' | 'incoming';
  subject: string;
  content: string;
  duration?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: Record<string, any>;
}

export interface MeetingPayload {
  title: string;
  description?: string;
  meeting_type: 'virtual' | 'in_person';
  platform?: string;
  location?: string;
  start_time: string;
  end_time: string;
  participants?: string[];
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface FollowUpPayload {
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  due_date: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number | null;
}

export interface EnquiryFilters {
  status?: string;
  priority?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  hasFollowUp?: string;
  dateRange?: string;
}

export interface EnquiryPayload {
  full_name: string;
  company_name?: string;
  email: string;
  phone_number?: string;
  inquiry_type: string;
  service_type?: string;
  project_budget?: string;
  message: string;
}

// ─── API ───────────────────────────────────────────────────────────────

export const enquiryApi = {
  // ─── Enquiries ───────────────────────────────────────────────────────

  /** GET all enquiries with filters */
  getAll: (filters?: EnquiryFilters): Promise<Enquiry[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange && filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
    if (filters?.hasFollowUp && filters.hasFollowUp !== 'all') params.append('hasFollowUp', filters.hasFollowUp);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    return unwrap(api.get<ApiResponse<Enquiry[]>>(`/enquiries${queryString ? `?${queryString}` : ''}`));
  },

  /** GET enquiry by ID */
  getById: (id: number): Promise<Enquiry> =>
    unwrap(api.get<ApiResponse<Enquiry>>(`/enquiries/${id}`)),

  /** GET enquiry details with all related data */
  getDetails: (id: number): Promise<Enquiry> =>
    unwrap(api.get<ApiResponse<Enquiry>>(`/enquiries/${id}/details`)),

  /** CREATE new enquiry (public) */
  create: (payload: EnquiryPayload): Promise<{ id: number }> =>
    unwrap(api.post<ApiResponse<{ id: number }>>('/enquiries', payload)),

  /** UPDATE enquiry status */
  updateStatus: (id: number, status: Enquiry['status']): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/enquiries/${id}/status`, { status })),

  /** UPDATE enquiry priority */
  updatePriority: (id: number, priority: Enquiry['priority']): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/enquiries/${id}/priority`, { priority })),

  /** ASSIGN enquiry to admin */
  assign: (id: number, adminId: number): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/enquiries/${id}/assign`, { adminId })),

  /** ADD note to enquiry */
  addNote: (id: number, note: string): Promise<void> =>
    unwrap(api.post<ApiResponse<void>>(`/enquiries/${id}/notes`, { note })),

  /** DELETE enquiry */
  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/enquiries/${id}`)),

  /** BULK delete enquiries */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => enquiryApi.delete(id)));
  },

  // ─── Stats & Dashboard ───────────────────────────────────────────────

  /** GET enquiry statistics */
  getStats: (): Promise<EnquiryStats> =>
    unwrap(api.get<ApiResponse<EnquiryStats>>('/enquiries/stats')),

  /** GET recent enquiries */
  getRecent: (limit: number = 10): Promise<Enquiry[]> =>
    unwrap(api.get<ApiResponse<Enquiry[]>>(`/enquiries/recent?limit=${limit}`)),

  /** GET today's enquiries count */
  getTodayCount: (): Promise<{ count: number }> =>
    unwrap(api.get<ApiResponse<{ count: number }>>('/enquiries/today')),

  /** GET enquiry trend */
  getTrend: (range: string = '7days'): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>(`/enquiries/trend?range=${range}`)),

  // ─── Interactions ────────────────────────────────────────────────────

  /** GET all interactions for an enquiry */
  getInteractions: (enquiryId: number): Promise<Interaction[]> =>
    unwrap(api.get<ApiResponse<Interaction[]>>(`/enquiries/${enquiryId}/interactions`)),

  /** ADD interaction (call, email, note) */
  addInteraction: (enquiryId: number, payload: any): Promise<Interaction> =>
    unwrap(api.post<ApiResponse<Interaction>>(`/enquiries/${enquiryId}/interactions`, payload)),

  // ─── Meetings ────────────────────────────────────────────────────────

  /** GET all meetings for an enquiry */
  getMeetings: (enquiryId: number): Promise<Meeting[]> =>
    unwrap(api.get<ApiResponse<Meeting[]>>(`/enquiries/${enquiryId}/meetings`)),

  /** SCHEDULE meeting */
  scheduleMeeting: (enquiryId: number, payload: any): Promise<Meeting> =>
    unwrap(api.post<ApiResponse<Meeting>>(`/enquiries/${enquiryId}/meetings`, payload)),

  // ─── Follow-ups ──────────────────────────────────────────────────────

  /** GET all follow-ups for an enquiry */
  getFollowUps: (enquiryId: number): Promise<FollowUpAction[]> =>
    unwrap(api.get<ApiResponse<FollowUpAction[]>>(`/enquiries/${enquiryId}/follow-ups`)),

  /** CREATE follow-up action */
  createFollowUp: (enquiryId: number, payload: FollowUpPayload): Promise<FollowUpAction> =>
    unwrap(api.post<ApiResponse<FollowUpAction>>(`/enquiries/${enquiryId}/follow-ups`, payload)),

  // ─── Timeline ────────────────────────────────────────────────────────

  /** GET enquiry timeline */
  getTimeline: (enquiryId: number): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>(`/enquiries/${enquiryId}/timeline`)),

  // ─── Import/Export ───────────────────────────────────────────────────

  /** IMPORT enquiries from CSV */
  importCSV: async (file: File): Promise<{ successful: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await api.post<ApiResponse<{ successful: number; failed: number; errors: string[] }>>(
      '/enquiries/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    if (!res.data.success) {
      throw new Error(res.data.message || 'Import failed');
    }
    return res.data.data!;
  },

  // ─── Notifications ───────────────────────────────────────────────────

  /** GET notifications */
  getNotifications: (isRead?: boolean): Promise<any[]> =>
    unwrap(api.get<ApiResponse<any[]>>(`/enquiries/notifications/all${isRead !== undefined ? `?isRead=${isRead}` : ''}`)),

  /** MARK notification as read */
  markNotificationRead: (id: number): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/enquiries/notifications/${id}/read`)),

  /** MARK all notifications as read */
  markAllNotificationsRead: (): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>('/enquiries/notifications/read-all')),

  /** GET unread notification count */
  getUnreadNotificationCount: (): Promise<{ count: number }> =>
    unwrap(api.get<ApiResponse<{ count: number }>>('/enquiries/notifications/unread-count')),
};
// lib/careerApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface Job {
  id: number;
  job_title: string;
  department: string | null;
  location: string | null;
  job_type: string;
  description: string;
  requirements: string[] | string;
  responsibilities: string[] | string;
  benefits: string[] | string;
  salary_range: string | null;
  experience_level: string | null;
  is_active: boolean;
  application_deadline: string | null;
  vacancy_count: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  job_title?: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  experience_level?: string | null; 
  cover_letter: string | null;
  resume_path: string | null;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface JobStats {
  total: number;
  active: number;
  inactive: number;
  departments: number;
  locations: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  rejected: number;
  hired: number;
}

export interface JobFilters {
  search?: string;
  department?: string;
  location?: string;
  job_type?: string;
  active?: 'all' | 'true' | 'false';  // 'all' means show both active and inactive
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApplicationFilters {
  job_id?: number;
  status?: string;
  experience_level?: string; 
  job_title?: string; 
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface JobPayload {
  job_title: string;
  department?: string;
  location?: string;
  job_type?: string;
  description: string;
  requirements: string[] | string;
  responsibilities: string[] | string;
  benefits: string[] | string;
  salary_range?: string;
  experience_level?: string;
  is_active?: boolean;
  application_deadline?: string;
  vacancy_count?: number;
}

export interface ApplicationPayload {
  job_id: number;
  applicant_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume?: File;
}

// ─── API ───────────────────────────────────────────────────────────────

export const careerApi = {
  // ─── Jobs ───────────────────────────────────────────────────────────

  /** GET all jobs with filters */
  getJobs: async (filters?: JobFilters): Promise<{ jobs: Job[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department && filters.department !== 'all') params.append('department', filters.department);
    if (filters?.location && filters.location !== 'all') params.append('location', filters.location);
    if (filters?.job_type && filters.job_type !== 'all') params.append('job_type', filters.job_type);
    
    // FIX: Handle active filter correctly
    if (filters?.active === 'true') {
      params.append('active', 'true');
    } else if (filters?.active === 'false') {
      params.append('active', 'false');
    }
    // If 'all' or undefined, don't send the parameter at all
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);
    
    const res:any = await api.get<ApiResponse<{ jobs: Job[]; total: number; totalPages: number }>>(
      `/career/jobs${params.toString() ? `?${params}` : ''}`
    );
    
    // Parse JSON fields if they're strings
    if (res.data.data?.jobs) {
      res.data.data.jobs = res.data.data.jobs.map((job:any) => ({
        ...job,
        requirements: typeof job.requirements === 'string' 
          ? job.requirements 
          : Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
        responsibilities: typeof job.responsibilities === 'string'
          ? job.responsibilities
          : Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
        benefits: typeof job.benefits === 'string'
          ? job.benefits
          : Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      }));
    }
    
    return unwrap(res);
  },

  /** GET job by ID */
  getJobById: (id: number): Promise<Job> =>
    unwrap(api.get<ApiResponse<Job>>(`/career/jobs/${id}`)),

  /** GET job by slug */
  getJobBySlug: (slug: string): Promise<Job> =>
    unwrap(api.get<ApiResponse<Job>>(`/career/jobs/slug/${slug}`)),

  /** CREATE job */
  createJob: (payload: JobPayload): Promise<{ id: number }> => {
    // Convert arrays to JSON strings for backend
    const formattedPayload = {
      ...payload,
      requirements: Array.isArray(payload.requirements) ? payload.requirements : payload.requirements.split('\n').filter(r => r.trim()),
      responsibilities: Array.isArray(payload.responsibilities) ? payload.responsibilities : payload.responsibilities.split('\n').filter(r => r.trim()),
      benefits: Array.isArray(payload.benefits) ? payload.benefits : payload.benefits.split('\n').filter(b => b.trim()),
    };
    return unwrap(api.post<ApiResponse<{ id: number }>>('/career/jobs', formattedPayload));
  },

  /** UPDATE job */
  updateJob: (id: number, payload: Partial<JobPayload>): Promise<void> => {
    const formattedPayload = { ...payload };
    if (payload.requirements && typeof payload.requirements === 'string') {
      formattedPayload.requirements = payload.requirements.split('\n').filter(r => r.trim());
    }
    if (payload.responsibilities && typeof payload.responsibilities === 'string') {
      formattedPayload.responsibilities = payload.responsibilities.split('\n').filter(r => r.trim());
    }
    if (payload.benefits && typeof payload.benefits === 'string') {
      formattedPayload.benefits = payload.benefits.split('\n').filter(b => b.trim());
    }
    return unwrap(api.put<ApiResponse<void>>(`/career/jobs/${id}`, formattedPayload));
  },

  /** DELETE job */
  deleteJob: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/career/jobs/${id}`)),

  /** BULK delete jobs */
  bulkDeleteJobs: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map(id => careerApi.deleteJob(id)));
  },

  /** BULK toggle active status */
  bulkToggleActive: async (ids: number[], isActive: boolean): Promise<void> => {
    await Promise.all(ids.map(id => careerApi.updateJob(id, { is_active: isActive })));
  },

  // ─── Applications ───────────────────────────────────────────────────

  /** GET applications with filters */
  getApplications: (filters?: ApplicationFilters): Promise<{ applications: Application[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters?.job_id) params.append('job_id', filters.job_id.toString());
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.job_title && filters.job_title !== 'all') params.append('job_title', filters.job_title);
    if (filters?.experience_level && filters.experience_level !== 'all') params.append('experience_level', filters.experience_level);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.search) params.append('search', filters.search);
    return unwrap(api.get<ApiResponse<{ applications: Application[]; total: number; totalPages: number }>>(
      `/career/applications${params.toString() ? `?${params}` : ''}`
    ));
  },

  deleteApplication: (id: number): Promise<void> =>
  unwrap(api.delete<ApiResponse<void>>(`/career/applications/${id}`)),

  /** SUBMIT application (public - with file upload) */
  submitApplication: async (payload: ApplicationPayload): Promise<{ id: number }> => {
    const formData = new FormData();
    formData.append('job_id', payload.job_id.toString());
    formData.append('applicant_name', payload.applicant_name);
    formData.append('email', payload.email);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.cover_letter) formData.append('cover_letter', payload.cover_letter);
    if (payload.resume) formData.append('resume', payload.resume);
    
    const res = await api.post<ApiResponse<{ id: number }>>('/career/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to submit application');
    }
    return res.data.data!;
  },

  /** UPDATE application status (admin) */
  updateApplicationStatus: (id: number, status: string, notes?: string): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/career/applications/${id}/status`, { status, notes })),

  // ─── Stats ──────────────────────────────────────────────────────────

  /** GET job stats */
  getJobStats: async (): Promise<JobStats> => {
    const res = await careerApi.getJobs({ limit: 1000 });
    const allJobs = res.jobs;
    
    const deptSet = new Set(allJobs.map(job => job.department).filter(Boolean));
    const locSet = new Set(allJobs.map(job => job.location).filter(Boolean));
    
    return {
      total: allJobs.length,
      active: allJobs.filter(job => job.is_active).length,
      inactive: allJobs.filter(job => !job.is_active).length,
      departments: deptSet.size,
      locations: locSet.size
    };
  },

  /** GET application stats */
  getApplicationStats: (): Promise<ApplicationStats> =>
    unwrap(api.get<ApiResponse<ApplicationStats>>('/career/applications/stats')),

  // ─── Filter Options ─────────────────────────────────────────────────

  /** GET distinct departments */
  getDepartments: (): Promise<string[]> =>
    unwrap(api.get<ApiResponse<string[]>>('/career/jobs/departments')),

  /** GET distinct locations */
  getLocations: (): Promise<string[]> =>
    unwrap(api.get<ApiResponse<string[]>>('/career/jobs/locations')),

  /** GET distinct job types */
  getJobTypes: (): Promise<string[]> =>
    unwrap(api.get<ApiResponse<string[]>>('/career/jobs/types')),

  /** GET recent applications */
  getRecentApplications: (limit: number = 5): Promise<Application[]> =>
    unwrap(api.get<ApiResponse<Application[]>>(`/career/applications/recent?limit=${limit}`)),


  scheduleInterview: (appId: number, data: any) => 
  api.post(`/career/applications/${appId}/interview`, data),
addFollowUp: (appId: number, message: string) => 
  api.post(`/career/applications/${appId}/followup`, { message }),
getTimeline: (appId: number) => 
  api.get(`/career/applications/${appId}/timeline`),
updateInterviewStatus: (followupId: number, status: string) => 
  api.put(`/career/followups/${followupId}/status`, { status }),

addInteraction: (appId: number, type: string, subject: string, notes: string) =>
  api.post(`/career/applications/${appId}/interaction`, { type, subject, notes }),
};



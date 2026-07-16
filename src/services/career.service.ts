/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './authService';

export interface Job {
  id: number;
  job_title: string;
  department?: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary_range?: string;
  experience_level?: string;
  is_active: boolean;
  application_deadline?: string;
  vacancy_count: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_path?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
  notes?: string;
  job_title?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ApplicationFormData {
  job_id: number;
  applicant_name: string;
  email: string;
  phone?: string;
  experience_level?: string;
  cover_letter?: string;
  linkedin?: string;
  portfolio?: string;
  resume?: File;
  whatsapp?: string;
  gender?: string;
  dob?: string;
  current_city?: string;
  state?: string;
  country?: string;
  current_address?: string;
  candidate_type?: string;
  fresher_studying?: string;
  current_company?: string;
  designation?: string;
  employment_status?: string;
  industry?: string;
  total_experience?: string;
  relevant_experience?: string;
  current_ctc?: string;
  expected_ctc?: string;
  notice_period?: string;
  prev_companies?: any;
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  semester?: string;
  expected_grad_year?: string;
  duration?: string;
  available_from?: string;
  stipend_pref?: string;
  education_list?: any;
  primary_skills?: any;
  secondary_skills?: any;
  skill_level?: string;
  languages?: string;
  earliest_joining_date?: string;
  preferred_work_mode?: string;
  willing_to_relocate?: string;
  preferred_interview_time?: string;
  why_consider?: string;
}

export interface JobFilters {
  search?: string;
  department?: string;
  location?: string;
  job_type?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

class CareerService {
  // Get all jobs
  async getJobs(filters: JobFilters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`/career/jobs?${params.toString()}`);
    return response.data;
  }

  // Get job by ID
  async getJobById(id: number) {
    const response = await api.get(`/career/jobs/${id}`);
    return response.data;
  }

  // Get job by slug
  async getJobBySlug(slug: string) {
    const response = await api.get(`/career/jobs/slug/${slug}`);
    return response.data;
  }

  // Get departments
  async getDepartments() {
    const response = await api.get('/career/jobs/departments');
    return response.data;
  }

  // Get locations
  async getLocations() {
    const response = await api.get('/career/jobs/locations');
    return response.data;
  }

  // Get job types
  async getJobTypes() {
    const response = await api.get('/career/jobs/types');
    return response.data;
  }

  // Submit application - FRONTEND VERSION
  async submitApplication(formData: ApplicationFormData) {
    const data = new FormData();

    // Append all form data
    data.append('job_id', formData.job_id.toString());
    data.append('applicant_name', formData.applicant_name);
    data.append('email', formData.email);

    if (formData.phone) data.append('phone', formData.phone);
    if (formData.experience_level) data.append('experience_level', formData.experience_level);
    if (formData.cover_letter) data.append('cover_letter', formData.cover_letter);
    if (formData.linkedin) data.append('linkedin', formData.linkedin);
    if (formData.portfolio) data.append('portfolio', formData.portfolio);

    if (formData.whatsapp) data.append('whatsapp', formData.whatsapp);
    if (formData.gender) data.append('gender', formData.gender);
    if (formData.dob) data.append('dob', formData.dob);
    if (formData.current_city) data.append('current_city', formData.current_city);
    if (formData.state) data.append('state', formData.state);
    if (formData.country) data.append('country', formData.country);
    if (formData.current_address) data.append('current_address', formData.current_address);
    if (formData.candidate_type) data.append('candidate_type', formData.candidate_type);
    if (formData.fresher_studying) data.append('fresher_studying', formData.fresher_studying);

    if (formData.current_company) data.append('current_company', formData.current_company);
    if (formData.designation) data.append('designation', formData.designation);
    if (formData.employment_status) data.append('employment_status', formData.employment_status);
    if (formData.industry) data.append('industry', formData.industry);
    if (formData.total_experience) data.append('total_experience', formData.total_experience);
    if (formData.relevant_experience) data.append('relevant_experience', formData.relevant_experience);
    if (formData.current_ctc) data.append('current_ctc', formData.current_ctc);
    if (formData.expected_ctc) data.append('expected_ctc', formData.expected_ctc);
    if (formData.notice_period) data.append('notice_period', formData.notice_period);

    if (formData.prev_companies) data.append('prev_companies', typeof formData.prev_companies === 'object' ? JSON.stringify(formData.prev_companies) : formData.prev_companies);

    if (formData.college) data.append('college', formData.college);
    if (formData.university) data.append('university', formData.university);
    if (formData.degree) data.append('degree', formData.degree);
    if (formData.branch) data.append('branch', formData.branch);
    if (formData.semester) data.append('semester', formData.semester);
    if (formData.expected_grad_year) data.append('expected_grad_year', formData.expected_grad_year);
    if (formData.duration) data.append('duration', formData.duration);
    if (formData.available_from) data.append('available_from', formData.available_from);
    if (formData.stipend_pref) data.append('stipend_pref', formData.stipend_pref);

    if (formData.education_list) data.append('education_list', typeof formData.education_list === 'object' ? JSON.stringify(formData.education_list) : formData.education_list);
    if (formData.primary_skills) data.append('primary_skills', typeof formData.primary_skills === 'object' ? JSON.stringify(formData.primary_skills) : formData.primary_skills);
    if (formData.secondary_skills) data.append('secondary_skills', typeof formData.secondary_skills === 'object' ? JSON.stringify(formData.secondary_skills) : formData.secondary_skills);

    if (formData.skill_level) data.append('skill_level', formData.skill_level);
    if (formData.languages) data.append('languages', formData.languages);
    if (formData.earliest_joining_date) data.append('earliest_joining_date', formData.earliest_joining_date);
    if (formData.preferred_work_mode) data.append('preferred_work_mode', formData.preferred_work_mode);
    if (formData.willing_to_relocate) data.append('willing_to_relocate', formData.willing_to_relocate);
    if (formData.preferred_interview_time) data.append('preferred_interview_time', formData.preferred_interview_time);
    if (formData.why_consider) data.append('why_consider', formData.why_consider);

    if (formData.resume instanceof File) {
      data.append('resume', formData.resume);
    }

    try {
      const response = await api.post('/career/applications', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend: Error submitting application:', error);

      if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      throw error;
    }
  }

  // Admin: Create job
  async createJob(jobData: any) {
    const response = await api.post('/career/jobs', jobData);
    return response.data;
  }

  // Admin: Update job
  async updateJob(id: number, jobData: any) {
    const response = await api.put(`/career/jobs/${id}`, jobData);
    return response.data;
  }

  // Admin: Delete job
  async deleteJob(id: number) {
    const response = await api.delete(`/career/jobs/${id}`);
    return response.data;
  }

  // Admin: Get applications
  async getApplications(filters: { job_id?: number; status?: string; page?: number; limit?: number } = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`/career/applications?${params.toString()}`);
    return response.data;
  }

  // Admin: Get application stats
  async getApplicationStats() {
    const response = await api.get('/career/applications/stats');
    return response.data;
  }

  // Admin: Get recent applications
  async getRecentApplications(limit: number = 5) {
    const response = await api.get(`/career/applications/recent?limit=${limit}`);
    return response.data;
  }

  // Admin: Update application status
  async updateApplicationStatus(id: number, status: string, notes?: string) {
    const response = await api.put(`/career/applications/${id}/status`, { status, notes });
    return response.data;
  }
}

export default new CareerService();
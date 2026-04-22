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
}

export interface ApplicationFormData {
  job_id: number;
  applicant_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume?: File;
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
    
    console.log('📤 Frontend: Form data to send:', {
      job_id: formData.job_id,
      applicant_name: formData.applicant_name,
      email: formData.email,
      phone: formData.phone,
      cover_letter: formData.cover_letter,
      resume: formData.resume ? formData.resume.name : 'No file'
    });
    
    // Append all form data
    data.append('job_id', formData.job_id.toString());
    data.append('applicant_name', formData.applicant_name);
    data.append('email', formData.email);
    
    if (formData.phone) {
      data.append('phone', formData.phone);
    }
    
    if (formData.cover_letter) {
      data.append('cover_letter', formData.cover_letter);
    }
    
    if (formData.resume instanceof File) {
      data.append('resume', formData.resume);
    }

    try {
      console.log('🚀 Frontend: Sending application request...');
      const response = await api.post('/career/applications', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Frontend: Application response:', response.data);
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
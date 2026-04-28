// lib/testimonialsApi.ts
import api, { unwrap, type ApiResponse } from "./api";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  rating: number;
  text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialPayload {
  name: string;
  position: string;
  rating?: number;
  text: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

// Converts relative path → full URL (for display)
const toFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
  return `${BASE_URL}/uploads/testimonials/${url}`;
};

// Converts full URL → relative path (for saving to DB)
const toRelativeUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.replace(BASE_URL, '');
  }
  return url;
};

const processTestimonial = (t: Testimonial): Testimonial => ({
  ...t,
  image_url: toFullUrl(t.image_url)
});

export const testimonialsApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const data = await unwrap(api.get<ApiResponse<Testimonial[]>>('/testimonials?active=false'));
    return data.map(processTestimonial);
  },

  getById: (id: number): Promise<Testimonial> =>
    unwrap(api.get<ApiResponse<Testimonial>>(`/testimonials/${id}`))
      .then(processTestimonial),

  create: (payload: TestimonialPayload): Promise<{ id: number }> =>
    unwrap(api.post<ApiResponse<{ id: number }>>('/testimonials', {
      ...payload,
      image_url: toRelativeUrl(payload.image_url || '')
    })),

  update: (id: number, payload: Partial<TestimonialPayload>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/testimonials/${id}`, {
      ...payload,
      image_url: toRelativeUrl(payload.image_url || '')
    })),

  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/testimonials/${id}`)),

  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map(id => testimonialsApi.delete(id)));
  },

  toggleActive: (id: number): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/testimonials/${id}/toggle-active`, {})),

  bulkToggleActive: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map(id => testimonialsApi.toggleActive(id)));
  },

  reorder: (orders: { id: number; display_order: number }[]): Promise<void> =>
    unwrap(api.post<ApiResponse<void>>('/testimonials/reorder', { orders })),

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<ApiResponse<{ path: string; url?: string }>>(
      '/upload/testimonial-image', formData
    );
    if (!res.data.success) throw new Error(res.data.message || 'Upload failed');
    const path = res.data.data!.url || res.data.data!.path;
    return toFullUrl(path);
  },
};
// lib/caseStudyApi.ts
import api, { unwrap, type ApiResponse } from './api';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export interface CaseStudy {
  id: number;
  title: string;
  category: string;
  description: string;
  metrics: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyPayload {
  title: string;
  category: string;
  description: string;
  metrics: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

const toFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
  return `${BASE_URL}/uploads/case-studies/${url}`;
};

const toRelativeUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url.replace(BASE_URL, '');
  return url;
};

const process = (c: CaseStudy): CaseStudy => ({ ...c, image_url: toFullUrl(c.image_url) });

export const caseStudyApi = {
  getAll: async (): Promise<CaseStudy[]> => {
    const data = await unwrap(api.get<ApiResponse<CaseStudy[]>>('/case-studies?active=false'));
    return data.map(process);
  },

  getPublic: async (): Promise<CaseStudy[]> => {
    const data = await unwrap(api.get<ApiResponse<CaseStudy[]>>('/case-studies'));
    return data.map(process);
  },

  getById: (id: number): Promise<CaseStudy> =>
    unwrap(api.get<ApiResponse<CaseStudy>>(`/case-studies/${id}`)).then(process),

  create: (payload: CaseStudyPayload) =>
    unwrap(api.post<ApiResponse<{ id: number }>>('/case-studies', {
      ...payload,
      image_url: toRelativeUrl(payload.image_url || ''),
    })),

  update: (id: number, payload: Partial<CaseStudyPayload>) =>
    unwrap(api.put<ApiResponse<void>>(`/case-studies/${id}`, {
      ...payload,
      image_url: toRelativeUrl(payload.image_url || ''),
    })),

  delete: (id: number) =>
    unwrap(api.delete<ApiResponse<void>>(`/case-studies/${id}`)),

  bulkDelete: async (ids: number[]) => {
    await Promise.all(ids.map(id => caseStudyApi.delete(id)));
  },

  toggleActive: (id: number) =>
    unwrap(api.put<ApiResponse<void>>(`/case-studies/${id}/toggle-active`, {})),

  reorder: (orders: { id: number; display_order: number }[]) =>
    unwrap(api.put<ApiResponse<void>>('/case-studies/reorder', { orders })),

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<ApiResponse<{ path: string; url?: string }>>(
      '/upload/case-study-image', formData
    );
    if (!res.data.success) throw new Error(res.data.message || 'Upload failed');
    return toFullUrl(res.data.data!.url || res.data.data!.path);
  },
};
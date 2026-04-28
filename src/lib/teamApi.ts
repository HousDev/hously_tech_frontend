// lib/teamApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: "linkedin" | "instagram" | "whatsapp";
  url: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  image: string;
  display_order: number;
  is_active: boolean;
  social_links: string; // JSON string
  social_links_parsed?: SocialLink[];
  created_at: string;
  updated_at: string;
}

export interface TeamMemberPayload {
  name: string;
  role: string;
  description?: string;
  image_url?: string;
  image?: string;
  display_order?: number;
  is_active?: boolean;
  social_links?: SocialLink[];
  profile_url?: string;
}

export interface TeamMemberFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

// ─── API ───────────────────────────────────────────────────────────────

export const teamApi = {
  // ─── Team Members ───────────────────────────────────────────────────

  /** GET all team members */
  getAll: (admin: boolean = false): Promise<TeamMember[]> =>
    unwrap(api.get<ApiResponse<TeamMember[]>>(`/team${admin ? '?admin=true' : ''}`)),

  /** GET team member by ID */
  getById: (id: number): Promise<TeamMember> =>
    unwrap(api.get<ApiResponse<TeamMember>>(`/team/${id}`)),

  /** CREATE team member */
  create: (payload: TeamMemberPayload): Promise<{ id: number }> =>
    unwrap(api.post<ApiResponse<{ id: number }>>('/team', payload)),

  /** UPDATE team member */
  update: (id: number, payload: Partial<TeamMemberPayload>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/team/${id}`, payload)),

  /** DELETE team member */
  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/team/${id}`)),

  /** TOGGLE team member status */
  toggleStatus: (id: number): Promise<void> =>
    unwrap(api.patch<ApiResponse<void>>(`/team/${id}/toggle-status`, {})),

  /** REORDER team members */
  reorder: (order: { id: number; display_order: number }[]): Promise<void> =>
    unwrap(api.post<ApiResponse<void>>('/team/reorder', { order })),

  /** BULK delete team members */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => teamApi.delete(id)));
  },

  /** BULK toggle active status */
  bulkToggleActive: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => teamApi.toggleStatus(id)));
  },

  // ─── Image Upload ───────────────────────────────────────────────────

  /** UPLOAD team member image */
  uploadImage: async (file: File): Promise<{ url: string; fullUrl: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post<ApiResponse<{ url: string; fullUrl: string; filename: string }>>(
      '/team/upload-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (!res.data.success) {
      throw new Error(res.data.message || 'Image upload failed');
    }
    return res.data.data!;
  },

  // ─── Data Fix (Admin) ──────────────────────────────────────────────

  /** FIX JSON data in database */
  fixData: (): Promise<void> =>
    unwrap(api.post<ApiResponse<void>>('/team/fix-data')),
};
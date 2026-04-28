// lib/homeApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  bg_gradient: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlidePayload {
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  bg_gradient?: string;
  display_order?: number;
  is_active?: boolean;
}

// ─── API ───────────────────────────────────────────────────────────────

export const homeApi = {
  // ─── Slides ─────────────────────────────────────────────────────────

  /** GET all slides */
  getAll: (): Promise<Slide[]> =>
    unwrap(api.get<ApiResponse<Slide[]>>("/home/slides?active=false")),

  /** GET slide by ID */
  getById: (id: number): Promise<Slide> =>
    unwrap(api.get<ApiResponse<Slide>>(`/home/slides/${id}`)),

  /** CREATE slide */
  create: (payload: SlidePayload): Promise<{ id: number }> =>
    unwrap(api.post<ApiResponse<{ id: number }>>("/home/slides", payload)),

  /** UPDATE slide */
  update: (id: number, payload: Partial<SlidePayload>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/home/slides/${id}`, payload)),

  /** DELETE slide */
  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/home/slides/${id}`)),

  /** SWAP slide order */
  swap: (slide1Id: number, slide2Id: number): Promise<void> =>
    unwrap(
      api.post<ApiResponse<void>>("/home/slides/swap", {
        slide1Id,
        slide2Id,
      })
    ),

  /** BULK delete (parallel for speed) */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => homeApi.delete(id)));
  },

  /** BULK toggle active */
  bulkToggleActive: async (
    ids: number[],
    isActive: boolean
  ): Promise<void> => {
    await Promise.all(
      ids.map((id) => homeApi.update(id, { is_active: isActive }))
    );
  },

  // ─── Image Upload ───────────────────────────────────────────────────

  /**
   * Upload image to backend
   * Uses: POST /api/upload/image
   * Returns: relative URL (store in DB)
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post<
      ApiResponse<{
        url: string;
        fullUrl: string;
        filename: string;
      }>
    >("/upload/image", formData);

    if (!res.data.success) {
      throw new Error(res.data.message || "Image upload failed");
    }

    // ✅ IMPORTANT:
    // return relative path → backend already converts to full URL later
    return res.data.data!.url;
  },
};
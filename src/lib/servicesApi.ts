// lib/servicesApi.ts

import api, { unwrap, type ApiResponse } from "./api";

// ─── Types ─────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  icon_type: "lucide" | "custom";
  icon_name: string | null;
  icon_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  slug: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface ServicePayload {
  title: string;
  short_description: string;
  full_description: string;
  icon_type?: "lucide" | "custom";
  icon_name?: string | null;
  icon_url?: string | null;
  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
  slug?: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

// ─── API ───────────────────────────────────────────────────────────────

export const servicesApi = {
  // ─── Services ────────────────────────────────────────────────────────

  /** GET all services (including inactive) */
  getAll: (): Promise<Service[]> =>
    unwrap(api.get<ApiResponse<Service[]>>("/services?active=false")),

  /** GET service by ID */
  getById: (id: number): Promise<Service> =>
    unwrap(api.get<ApiResponse<Service>>(`/services/${id}`)),

  /** GET service by slug */
  getBySlug: (slug: string): Promise<Service> =>
    unwrap(api.get<ApiResponse<Service>>(`/services/slug/${slug}`)),

  /** GET featured services */
  getFeatured: (limit = 8): Promise<Service[]> =>
    unwrap(
      api.get<ApiResponse<Service[]>>(`/services/featured?limit=${limit}`)
    ),

  /** CREATE service */
  create: (payload: ServicePayload): Promise<{ id: number }> =>
    unwrap(
      api.post<ApiResponse<{ id: number }>>("/services", payload)
    ),

  /** UPDATE service */
  update: (id: number, payload: Partial<ServicePayload>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/services/${id}`, payload)),

  /** DELETE service */
  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/services/${id}`)),

  /** SWAP service order (simple direction-based) */
  simpleSwap: (serviceId: number, direction: "up" | "down"): Promise<{
    currentOrder: number;
    swapOrder: number;
  }> =>
    unwrap(
      api.post<ApiResponse<{ currentOrder: number; swapOrder: number }>>(
        "/services/simple-swap",
        { serviceId, direction }
      )
    ),

  /** BULK delete (parallel) */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => servicesApi.delete(id)));
  },

  /** BULK toggle active */
  bulkToggleActive: async (
    ids: number[],
    isActive: boolean,
    allServices: Service[]
  ): Promise<void> => {
    await Promise.all(
      ids.map((id) => {
        const service = allServices.find((s) => s.id === id);
        if (!service) return Promise.resolve();
        return servicesApi.update(id, { ...service, is_active: isActive });
      })
    );
  },

  // ─── Icon Upload ─────────────────────────────────────────────────────

  /**
   * Upload custom icon to backend
   * Uses: POST /api/upload/service-icon
   * Returns: relative URL
   */
  uploadIcon: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("icon", file);

    const res = await api.post<
      ApiResponse<{
        url: string;
        fullUrl: string;
        filename: string;
        size: number;
      }>
    >("/upload/service-icon", formData);

    if (!res.data.success) {
      throw new Error(res.data.message || "Icon upload failed");
    }

    return res.data.data!.url;
  },
};
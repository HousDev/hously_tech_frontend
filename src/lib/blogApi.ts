// lib/blogApi.ts
import api, { unwrap, type ApiResponse } from "./api";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: number;
  category: string;
  tags: string[];
  featured_image: string;
  read_time: string;
  is_published: boolean;
  published_at: string | null;
  views: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  avgReadTime: string;
  categoriesCount: number;
}

export interface BlogPayload {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  featured_image?: string | null;
  read_time?: string;
  is_published?: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export const blogApi = {
getAll: (): Promise<BlogPost[]> =>
  unwrap(api.get<ApiResponse<BlogPost[]>>("/blog?published=false"))
    .then((res: any) => res.posts ?? res),

  getById: (id: number): Promise<BlogPost> =>
    unwrap(api.get<ApiResponse<BlogPost>>(`/blog/${id}`)),

  getStats: (): Promise<BlogStats> =>
    unwrap(api.get<ApiResponse<BlogStats>>("/blog/stats")),

  create: (payload: BlogPayload): Promise<{ id: number }> =>
    unwrap(api.post<ApiResponse<{ id: number }>>("/blog", payload)),

  update: (id: number, payload: Partial<BlogPayload>): Promise<void> =>
    unwrap(api.put<ApiResponse<void>>(`/blog/${id}`, payload)),

  delete: (id: number): Promise<void> =>
    unwrap(api.delete<ApiResponse<void>>(`/blog/${id}`)),

  bulkDelete: async (ids: number[]): Promise<void> => {
    await Promise.all(ids.map((id) => blogApi.delete(id)));
  },

  bulkTogglePublish: async (ids: number[], publish: boolean, allPosts: BlogPost[]): Promise<void> => {
    await Promise.all(
      ids.map((id) => {
        const post = allPosts.find((p) => p.id === id);
        if (!post) return Promise.resolve();
        return blogApi.update(id, {
          ...post,
          tags: Array.isArray(post.tags) ? post.tags : [],
          is_published: publish,
          published_at: publish ? new Date().toISOString() : null,
        });
      })
    );
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "blog");

    const res = await api.post<ApiResponse<{ url: string; fullUrl: string }>>(
      "/upload/blog-image",
      formData
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Image upload failed");
    }

const url = res.data.data!.url;
const BASE_URL = 'http://localhost:5000';
// Full URL banao agar relative path hai
return url.startsWith('http') ? url : `${BASE_URL}${url}`;  },
};
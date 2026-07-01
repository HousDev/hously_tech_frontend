import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Save, X,
  Eye, EyeOff, Search, Filter,
  Check, Clock,
  ChevronLeft, ChevronRight,
  Tag, FileText,
  BookOpen,
  Copy,
  Upload as UploadIcon, Loader2, FileImage,
  List, Grid,

  Palette,
  Briefcase,
  ArrowUpDown, CalendarDays,
  User as UserIcon,
  Target,
  Smartphone as PhoneIcon,
  Server as ServerIcon, Cloud as CloudIcon,
  Shield as ShieldIcon, Zap as ZapIcon,
  Cpu as CpuIcon, Layers as LayersIcon,
  Users as UsersIcon, Globe as GlobeIcon,
  Code as CodeIcon, Database as DatabaseIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { blogApi, type BlogPost, type BlogStats } from '../../lib/blogApi';
import { useOutletContext } from 'react-router-dom';






// PREDEFINED CATEGORIES
const PREDEFINED_CATEGORIES = [
  {
    id: 1,
    name: 'Technology',
    icon: 'Cpu',
    color: '#3b82f6',
    description: 'Latest tech trends and innovations'
  },
  {
    id: 2,
    name: 'Web Development',
    icon: 'Code',
    color: '#8b5cf6',
    description: 'Frontend, backend, and full-stack development'
  },
  {
    id: 3,
    name: 'Mobile Development',
    icon: 'Smartphone',
    color: '#10b981',
    description: 'iOS, Android, and cross-platform apps'
  },
  {
    id: 4,
    name: 'Cloud Computing',
    icon: 'Cloud',
    color: '#06b6d4',
    description: 'AWS, Azure, Google Cloud, and serverless'
  },
  {
    id: 5,
    name: 'Cybersecurity',
    icon: 'Shield',
    color: '#ef4444',
    description: 'Security best practices and threat prevention'
  },
  {
    id: 6,
    name: 'AI & Machine Learning',
    icon: 'Cpu',
    color: '#ec4899',
    description: 'Artificial Intelligence and ML technologies'
  },
  {
    id: 7,
    name: 'Data Science',
    icon: 'Database',
    color: '#f59e0b',
    description: 'Data analysis, visualization, and insights'
  },
  {
    id: 8,
    name: 'DevOps',
    icon: 'Server',
    color: '#84cc16',
    description: 'CI/CD, Docker, Kubernetes, and automation'
  },
  {
    id: 9,
    name: 'UI/UX Design',
    icon: 'Palette',
    color: '#f97316',
    description: 'User interface and experience design'
  },
  {
    id: 10,
    name: 'Business & Strategy',
    icon: 'Briefcase',
    color: '#6366f1',
    description: 'Tech business insights and strategies'
  },
  {
    id: 11,
    name: 'Startups',
    icon: 'Rocket',
    color: '#14b8a6',
    description: 'Startup stories and entrepreneurship'
  },
  {
    id: 12,
    name: 'Career Tips',
    icon: 'Users',
    color: '#64748b',
    description: 'Career advice and professional growth'
  },
  {
    id: 13,
    name: 'Tutorials',
    icon: 'BookOpen',
    color: '#8b5cf6',
    description: 'Step-by-step guides and how-tos'
  },
  {
    id: 14,
    name: 'Industry News',
    icon: 'Globe',
    color: '#3b82f6',
    description: 'Latest industry updates and news'
  },
  {
    id: 15,
    name: 'Best Practices',
    icon: 'Target',
    color: '#10b981',
    description: 'Coding standards and best practices'
  },
  {
    id: 16,
    name: 'Tools & Reviews',
    icon: 'Layers',
    color: '#f59e0b',
    description: 'Software tools and technology reviews'
  }
];

interface BlogCMSProps {
  isSidebarOpen?: boolean;
}

const BlogCMS = ({ isSidebarOpen = false }: BlogCMSProps) => {
  // State management
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'title'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selectedPosts.length) {
      toast.error('Please select posts to delete');
      return;
    }
    setDeleteTargetIds(selectedPosts);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const deleteToast = toast.loading('Deleting blog post...');
    try {
      await blogApi.delete(id);
      toast.success('Blog post deleted successfully!', { id: deleteToast });
      fetchPosts();
    } catch (err) {
      toast.error('Failed to delete blog post', { id: deleteToast });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const deleteToast = toast.loading(`Deleting ${ids.length} post(s)...`);
    try {
      await blogApi.bulkDelete(ids);
      toast.success(`Successfully deleted ${ids.length} post(s)`, { id: deleteToast });
      setSelectedPosts([]);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete posts', { id: deleteToast });
    }
  };

  // Post form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured_image: '',
    read_time: '5 min read',
    is_published: false,
    meta_title: '',
    meta_description: '',
    author_name: ''
  });

  // Category icons mapping
  const categoryIconsMap = {
    'Technology': CpuIcon,
    'Web Development': CodeIcon,
    'Mobile Development': PhoneIcon,
    'Cloud Computing': CloudIcon,
    'Cybersecurity': ShieldIcon,
    'AI & Machine Learning': CpuIcon,
    'Data Science': DatabaseIcon,
    'DevOps': ServerIcon,
    'UI/UX Design': Palette,
    'Business & Strategy': Briefcase,
    'Startups': ZapIcon,
    'Career Tips': UsersIcon,
    'Tutorials': BookOpen,
    'Industry News': GlobeIcon,
    'Best Practices': Target,
    'Tools & Reviews': LayersIcon
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Blogs CMS');
      setHeaderSubtitle(`Write and manage website blog articles (${posts.length} records)`);
    }
  }, [posts.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAll();
      const sorted = [...data].sort((a, b) => {
        const dA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dB - dA;
      });
      setPosts(sorted);
    } catch (err: any) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await blogApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    const loadingToast = toast.loading(editingPost ? 'Updating blog post...' : 'Creating blog post...');

    try {
      const postData: any = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        read_time: formData.read_time,
        is_published: formData.is_published,
        meta_title: formData.meta_title || '',
        meta_description: formData.meta_description || '',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (formData.featured_image && formData.featured_image.trim()) {
        postData.featured_image = formData.featured_image;
      }

      if (editingPost) {
        await blogApi.update(editingPost.id, postData);
        toast.success('Blog post updated successfully!', { id: loadingToast });
      } else {
        await blogApi.create(postData);
        toast.success('Blog post created successfully!', { id: loadingToast });
      }

      fetchPosts();
      handleCloseModal();
    } catch (err: any) {
      console.error('❌ Error saving blog post:', {
        error: err,
        response: err.response?.data
      });
      toast.error(err.response?.data?.message || 'Failed to save blog post', { id: loadingToast });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
      featured_image: post.featured_image,
      read_time: post.read_time,
      is_published: post.is_published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      author_name: post.author_name || ''
    });

    setIsModalOpen(true);
  };

  /* Deletion triggers confirm modal */


  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const t = toast.loading(currentStatus ? 'Moving to draft...' : 'Publishing...');
    try {
      const postToUpdate = posts.find(p => p.id === id);
      if (!postToUpdate) { toast.error('Post not found', { id: t }); return; }
      await blogApi.update(id, {
        ...postToUpdate,
        tags: Array.isArray(postToUpdate.tags) ? postToUpdate.tags : [],
        is_published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null,
      });
      setPosts(prev => prev.map(p =>
        p.id === id ? { ...p, is_published: !currentStatus, published_at: !currentStatus ? new Date().toISOString() : null } : p
      ));
      toast.success(`Post ${!currentStatus ? 'published' : 'moved to draft'}`, { id: t });
      fetchStats();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update post status', { id: t });
    }
  };

  const handleBulkTogglePublish = async (publish: boolean) => {
    if (selectedPosts.length === 0) { toast.error('Please select posts to update'); return; }
    const t = toast.loading(`${publish ? 'Publishing' : 'Unpublishing'} ${selectedPosts.length} post(s)...`);
    try {
      await blogApi.bulkTogglePublish(selectedPosts, publish, posts);
      setPosts(prev => prev.map(p =>
        selectedPosts.includes(p.id) ? { ...p, is_published: publish, published_at: publish ? new Date().toISOString() : null } : p
      ));
      toast.success(`Successfully ${publish ? 'published' : 'unpublished'} ${selectedPosts.length} post(s)`, { id: t });
      setSelectedPosts([]);
      fetchStats();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update posts', { id: t });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await blogApi.uploadImage(file);
      setFormData(prev => ({ ...prev, featured_image: imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setShowPreview(false);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured_image: '',
      read_time: '5 min read',
      is_published: false,
      meta_title: '',
      meta_description: '',
      author_name: ''
    });
  };



  // Filter and sort logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && post.is_published) ||
      (statusFilter === 'draft' && !post.is_published);

    const matchesCategory =
      categoryFilter === 'all' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const getDateValue = (post: BlogPost) => {
      const d = post.published_at && post.published_at !== 'null'
        ? post.published_at
        : post.created_at;  // ← fallback to created_at for drafts
      const date = new Date(d);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    switch (sortBy) {
      case 'newest':
        return getDateValue(b) - getDateValue(a);
      case 'oldest':
        return getDateValue(a) - getDateValue(b);
      case 'views':
        return b.views - a.views;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate stats
  const totalPostsCount = posts.length;
  const publishedPostsCount = posts.filter(p => p.is_published).length;
  const draftPostsCount = posts.filter(p => !p.is_published).length;

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedPosts.length === currentPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(currentPosts.map(post => post.id));
    }
  };

  const handleSelectPost = (id: number) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(postId => postId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = (categoryIconsMap as any)[categoryName] || Tag;
    return <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    const category = PREDEFINED_CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#3b82f6';
  };

  // Get unique categories from posts
  const categoriesFromPosts = [...new Set(posts.map(post => post.category))]
    .filter(category => category)
    .sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 pt-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, style: { background: '#10B981' } },
          error: { duration: 4000, style: { background: '#EF4444' } },
          loading: { duration: Infinity },
        }}
      />
      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalContentIn {
          from { opacity: 0; transform: scale(0.92) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0px); }
        }
        .animate-modal-backdrop {
          animation: modalBackdropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
        }
        .animate-modal-content {
          animation: modalContentIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>
      {/* Main Container */}
      <div className="bg-transparent font-sans flex flex-col flex-1 min-h-0">

        {/* Stats Cards - Compressed & High Density & Glassmorphic */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-100/60 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Posts</p>
            <p className="text-base font-extrabold text-blue-600 mt-1">{totalPostsCount}</p>
          </div>
          <div className="bg-green-100/50 border-green-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Published</p>
            <p className="text-base font-extrabold text-green-600 mt-1">{publishedPostsCount}</p>
          </div>
          <div className="bg-yellow-100/50 border-yellow-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drafts</p>
            <p className="text-base font-extrabold text-yellow-600 mt-1">{draftPostsCount}</p>
          </div>
          <div className="bg-purple-100/50 border-purple-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categories</p>
            <p className="text-base font-extrabold text-purple-600 mt-1">{PREDEFINED_CATEGORIES.length}</p>
          </div>
        </div>


        {/* Action Row */}
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-sm text-xs font-semibold flex cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Post</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categoriesFromPosts.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="views">Most Views</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
                >
                  <option value="5">Show 5</option>
                  <option value="10">Show 10</option>
                  <option value="25">Show 25</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPosts.length > 0 && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">{selectedPosts.length} selected</span>
            <div className="flex gap-2">
              <button onClick={() => handleBulkTogglePublish(true)} className="px-2 py-1 text-[10px] bg-green-600 text-white rounded cursor-pointer">Publish</button>
              <button onClick={() => handleBulkTogglePublish(false)} className="px-2 py-1 text-[10px] bg-gray-600 text-white rounded cursor-pointer">Unpublish</button>
              <button onClick={handleBulkDeleteClick} className="px-2 py-1 text-[10px] bg-red-600 text-white rounded cursor-pointer">Delete</button>
            </div>
          </div>
        )}

        {/* Grid View for Mobile */}
        {viewMode === 'grid' && (
          <div className="sm:hidden grid grid-cols-1 gap-3 mb-4">
            {currentPosts.map((post) => {
              const categoryColor = getCategoryColor(post.category);
              return (
                <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="flex items-center">
                        <div
                          className="p-1 rounded-md mr-1.5"
                          style={{ backgroundColor: `${categoryColor}20` }}
                        >
                          {getCategoryIcon(post.category)}
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: categoryColor }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePublish(post.id, post.is_published)}
                      className={`px-2 py-0.5 rounded-full text-xs ${post.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <div className="h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">{post.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        {post.published_at && post.published_at !== 'null'
                          ? new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                          : 'Draft'}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views} views
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
            {currentPosts.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-600 text-sm sm:text-lg">No posts found</p>
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 mx-auto text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create First Post</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="min-w-full border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPosts.length === currentPosts.length && currentPosts.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-56 border-r border-b border-slate-300">
                          Post
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                          Category
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">
                          Status
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">
                          Stats
                        </th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {currentPosts.map((post) => {
                        const categoryColor = getCategoryColor(post.category);
                        return (
                          <tr key={post.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPosts.includes(post.id)}
                                  onChange={() => handleSelectPost(post.id)}
                                  className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                                />
                              </div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="flex items-start space-x-2">
                                <div className="w-12 h-8 rounded overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                  {post.featured_image ? (
                                    <img
                                      src={post.featured_image}
                                      alt={post.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="8" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                  ) : (
                                    <FileImage className="w-full h-full p-2 text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 max-w-[150px] sm:max-w-[200px]">
                                  <h4 className="font-bold text-slate-800 mb-0.5 truncate text-[11px] leading-tight">{post.title}</h4>
                                  <p className="text-[9px] text-slate-400 truncate max-w-[140px] sm:max-w-[190px] leading-none">
                                    {post.excerpt}
                                  </p>
                                  <div className="flex items-center text-[9px] text-slate-400 space-x-2 leading-none mt-1">
                                    <span className="flex items-center">
                                      <CalendarDays className="w-2.5 h-2.5 mr-0.5" />
                                      {post.published_at && post.published_at !== 'null'
                                        ? new Date(post.published_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })
                                        : 'Draft'}
                                    </span>
                                    <span className="hidden sm:flex items-center">
                                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                                      {post.read_time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="flex items-center leading-none">
                                <div
                                  className="p-0.5 rounded mr-1"
                                  style={{ backgroundColor: `${categoryColor}20` }}
                                >
                                  {getCategoryIcon(post.category)}
                                </div>
                                <span
                                  className="font-bold text-[10px] truncate"
                                  style={{ color: categoryColor }}
                                >
                                  {post.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <button
                                onClick={() => handleTogglePublish(post.id, post.is_published)}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${post.is_published
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                                  }`}
                              >
                                {post.is_published ? (
                                  <>
                                    <Eye className="w-2.5 h-2.5" />
                                    <span>Published</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-2.5 h-2.5" />
                                    <span>Draft</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="flex items-center text-[10px] text-slate-600 leading-none">
                                <Eye className="w-3 h-3 mr-1 text-slate-400" />
                                <span className="font-semibold">{post.views}</span>
                              </div>
                            </td>
                            <td className="px-2 py-1 border-b border-slate-200 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setPreviewPost(post)}
                                  className="p-0.5 text-sky-600 hover:bg-sky-50 border border-sky-100 rounded cursor-pointer transition-all"
                                  title="Preview"
                                >
                                  <Eye size={11} />
                                </button>
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                >
                                  <Edit size={11} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(post.id)}
                                  className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredPosts.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      {/* Left side - Showing info compact */}
                      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
                        <span className="hidden sm:inline"> - </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold text-gray-800">
                          {Math.min(indexOfLastItem, filteredPosts.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold text-gray-800">{filteredPosts.length}</span>

                        {/* Filter indicators - compact */}
                        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                          <span className="ml-1 text-blue-600 text-[8px] sm:text-[10px] hidden sm:inline">
                            {searchTerm && `🔍 "${searchTerm.slice(0, 8)}${searchTerm.length > 8 ? '…' : ''}"`}
                            {statusFilter !== 'all' && ` • ${statusFilter === 'published' ? 'Pub' : 'Draft'}`}
                            {categoryFilter !== 'all' && ` • ${categoryFilter.slice(0, 10)}${categoryFilter.length > 10 ? '…' : ''}`}
                          </span>
                        )}
                      </div>

                      {/* Pagination controls - compact row */}
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {/* Previous button */}
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>

                        {/* Page numbers - Desktop */}
                        <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
                          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 2) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 1) {
                              pageNumber = totalPages - 2 + i;
                            } else {
                              pageNumber = currentPage - 1 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${currentPage === pageNumber
                                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}

                          {totalPages > 3 && currentPage < totalPages - 1 && (
                            <>
                              <span className="text-gray-400 text-[10px] sm:text-xs px-0.5">...</span>
                              <button
                                onClick={() => goToPage(totalPages)}
                                className="min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Mobile: Current page indicator */}
                        <span className="sm:hidden text-[10px] font-medium text-gray-700 px-1">
                          {currentPage}/{totalPages}
                        </span>

                        {/* Next button */}
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-modal-content">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#0D47A1]" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                    {editingPost ? 'Edit Blog Post' : 'New Blog Post'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {editingPost ? 'Modify article content, category, metadata and status' : 'Publish a new tech article or news item'}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Compact No-Scroll Body */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-2.5">

                {/* Row 1: Title + Category */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      required placeholder="Article title"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white cursor-pointer transition outline-none font-semibold text-slate-700"
                      required
                    >
                      <option value="">Select</option>
                      {PREDEFINED_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Tags + Read Time + Author */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="web, coding"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Read Time</label>
                    <input
                      type="text"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="5 min read"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Author</label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                      placeholder="Author"
                    />
                  </div>
                </div>

                {/* Row 3: Excerpt */}
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Excerpt <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={1}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    required placeholder="Short article summary for listing display"
                  />
                </div>

                {/* Row 4: Content */}
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Article Content <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    required placeholder="Write blog content in plain text/markdown..."
                  />
                </div>

                {/* Row 5: Meta SEO */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta SEO Title</label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                      placeholder="SEO Title"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta SEO Description</label>
                    <input
                      type="text"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                      placeholder="SEO Description"
                    />
                  </div>
                </div>

                {/* Row 6: Cover Image + Published toggle */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {formData.featured_image ? (
                      <div className="relative flex-shrink-0">
                        <img
                          src={formData.featured_image}
                          alt="Cover"
                          className="w-9 h-7 object-cover rounded-lg border border-slate-200"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center cursor-pointer leading-none"
                        >×</button>
                      </div>
                    ) : (
                      <div className="w-9 h-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <FileImage size={12} className="text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cover Image</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-0.5 px-2.5 py-1 text-[10px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
                      >
                        {uploading ? 'Uploading…' : 'Upload Cover'}
                      </button>
                    </div>
                  </div>

                  <div className="w-px h-8 bg-slate-200 flex-shrink-0" />

                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                    <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">Publish</span>
                  </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.title || !formData.excerpt || !formData.content || !formData.category}
                    className={`px-4 py-1.5 text-white font-bold text-xs rounded-lg transition shadow-sm cursor-pointer disabled:opacity-50 ${formData.is_published ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0D47A1] hover:bg-[#1565C0]'}`}
                  >
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setPreviewPost(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-modal-content">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Article Preview</h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{previewPost.category}</p>
                </div>
              </div>
              <button onClick={() => setPreviewPost(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {previewPost.featured_image && (
                <img
                  src={previewPost.featured_image}
                  alt={previewPost.title}
                  className="w-full h-40 object-cover rounded-xl border border-slate-100 mb-4"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <h1 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight">{previewPost.title}</h1>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold mb-3">
                {previewPost.author_name && <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{previewPost.author_name}</span>}
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />
                  {previewPost.published_at && previewPost.published_at !== 'null'
                    ? new Date(previewPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Draft'}
                </span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{previewPost.read_time}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{previewPost.views} views</span>
              </div>
              <hr className="border-slate-100 mb-3" />
              <p className="text-xs font-bold text-slate-700 mb-3 leading-relaxed">{previewPost.excerpt}</p>
              <div className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {previewPost.content}
              </div>
              {previewPost.tags && Array.isArray(previewPost.tags) && previewPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  {previewPost.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsDeleteConfirmOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetIds(null);
            }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-modal-content">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Confirm Delete</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {deleteTargetIds ? `${deleteTargetIds.length} post${deleteTargetIds.length === 1 ? '' : 's'} selected` : '1 post selected'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete {deleteTargetIds ? `these ${deleteTargetIds.length} posts` : 'this post'}? This action <span className="text-red-500 font-bold">cannot be undone</span>.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleteConfirmOpen(false);
                  if (deleteTargetId !== null) {
                    await proceedDelete(deleteTargetId);
                  } else if (deleteTargetIds !== null) {
                    await proceedBulkDelete(deleteTargetIds);
                  }
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCMS;
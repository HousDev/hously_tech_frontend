import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, 
  Eye, EyeOff, Search, Filter, Upload,
  ChevronDown, Check, ExternalLink, Clock, Calendar,
  ChevronLeft, ChevronRight, CheckCircle,
  XCircle, RefreshCw, Tag, FileText, Globe, 
  TrendingUp, BarChart, Link, Type, BookOpen,
  Users, Layers, FolderUp, Copy, AlertCircle,
  Upload as UploadIcon, Link2, Loader2, FileImage,
  FolderTree, Grid3x3, List, Grid, Table, Archive,
  Folder, FolderPlus, FolderMinus, FolderOpen,
  Shield, Zap, Cpu, Smartphone, Palette, Code,
  Server, Database, Cloud, Briefcase, Hash,
  PenTool, ArrowUpDown, GripVertical, CalendarDays,
  User as UserIcon, MoreVertical, Settings,
  MessageSquare, Rocket, Target, Key, Lock,
  Wifi, Terminal, Monitor, Smartphone as PhoneIcon,
  Server as ServerIcon, Cloud as CloudIcon,
  Shield as ShieldIcon, Zap as ZapIcon,
  Cpu as CpuIcon, Layers as LayersIcon,
  Users as UsersIcon, Globe as GlobeIcon,
  Code as CodeIcon, Database as DatabaseIcon,
  CheckSquare, Square, Home, Menu, MoveUp, MoveDown
} from 'lucide-react';
import api from '../../services/authService';
import type { ApiResponse } from '../../types/auth.types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BlogPost {
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

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  avgReadTime: string;
  categoriesCount: number;
}

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
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'title'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<BlogPost[]>>('/blog', {
        params: {
          published: 'false'
        }
      });
      
      if (response.data.success && response.data.data) {
        const sortedPosts = response.data.data.sort((a, b) => {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      toast.error(err.response?.data?.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get<ApiResponse<BlogStats>>('/blog/stats');
      if (response.data.success && response.data.data) {
        setStats(response.data.data);
      }
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
        await api.put(`/blog/${editingPost.id}`, postData);
        toast.success('Blog post updated successfully!');
      } else {
        await api.post('/blog', postData);
        toast.success('Blog post created successfully!');
      }
      
      fetchPosts();
      handleCloseModal();
    } catch (err: any) {
      console.error('❌ Error saving blog post:', {
        error: err,
        response: err.response?.data
      });
      toast.error(err.response?.data?.message || 'Failed to save blog post');
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

 const handleDelete = async (id: number) => {
  const deleteToast = toast.loading('Deleting blog post...');

  try {
    await api.delete(`/blog/${id}`);
    toast.success('Blog post deleted successfully!', {
      id: deleteToast,
    });
    fetchPosts();
  } catch (err) {
    toast.error('Failed to delete blog post', {
      id: deleteToast,
    });
  }
};


 const handleBulkDelete = async () => {
  if (selectedPosts.length === 0) {
    toast.error('Please select posts to delete');
    return;
  }

  const deleteToast = toast.loading(
    `Deleting ${selectedPosts.length} post(s)...`
  );

  try {
    await Promise.all(
      selectedPosts.map(id => api.delete(`/blog/${id}`))
    );

    toast.success(
      `Successfully deleted ${selectedPosts.length} post(s)`,
      { id: deleteToast }
    );

    setSelectedPosts([]);
    fetchPosts();
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || 'Failed to delete posts',
      { id: deleteToast }
    );
  }
};


  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const postToUpdate = posts.find(p => p.id === id);
      
      if (!postToUpdate) {
        toast.error('Post not found');
        return;
      }
      
      const updateData: any = {
        title: postToUpdate.title,
        excerpt: postToUpdate.excerpt,
        content: postToUpdate.content,
        category: postToUpdate.category,
        is_published: !currentStatus,
        tags: Array.isArray(postToUpdate.tags) ? postToUpdate.tags : [],
        read_time: postToUpdate.read_time || '5 min read',
        meta_title: postToUpdate.meta_title || null,
        meta_description: postToUpdate.meta_description || null
      };
      
      if (postToUpdate.featured_image && postToUpdate.featured_image.trim()) {
        updateData.featured_image = postToUpdate.featured_image;
      } else {
        updateData.featured_image = null;
      }
      
      if (!currentStatus) {
        updateData.published_at = new Date().toISOString();
      } else {
        updateData.published_at = null;
      }
      
      const response = await api.put(`/blog/${id}`, updateData);
      
      if (response.data.success) {
        toast.success(`Post ${!currentStatus ? 'published' : 'moved to draft'} successfully`);
        
        setPosts(prevPosts => {
          const postIndex = prevPosts.findIndex(p => p.id === id);
          if (postIndex === -1) return prevPosts;
          
          const newPosts = [...prevPosts];
          newPosts[postIndex] = {
            ...newPosts[postIndex],
            is_published: !currentStatus,
            published_at: !currentStatus ? new Date().toISOString() : null
          };
          
          return newPosts;
        });
        
        fetchStats();
      } else {
        toast.error(response.data.message || 'Failed to update post status');
      }
    } catch (err: any) {
      console.error('❌ Toggle error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      toast.error(err.response?.data?.message || 'Failed to update post status');
    }
  };

  const handleBulkTogglePublish = async (publish: boolean) => {
    if (selectedPosts.length === 0) {
      toast.error('Please select posts to update');
      return;
    }

    const toggleToast = toast.loading(`${publish ? 'Publishing' : 'Unpublishing'} ${selectedPosts.length} post(s)...`);
    
    try {
      for (const id of selectedPosts) {
        const postToUpdate = posts.find(p => p.id === id);
        if (!postToUpdate) continue;
        
        const updateData: any = {
          title: postToUpdate.title,
          excerpt: postToUpdate.excerpt,
          content: postToUpdate.content,
          category: postToUpdate.category,
          is_published: publish,
          tags: Array.isArray(postToUpdate.tags) ? postToUpdate.tags : [],
          read_time: postToUpdate.read_time || '5 min read',
          meta_title: postToUpdate.meta_title || null,
          meta_description: postToUpdate.meta_description || null
        };
        
        if (postToUpdate.featured_image && postToUpdate.featured_image.trim()) {
          updateData.featured_image = postToUpdate.featured_image;
        }
        
        if (publish) {
          updateData.published_at = new Date().toISOString();
        } else {
          updateData.published_at = null;
        }
        
        await api.put(`/blog/${id}`, updateData);
      }
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          selectedPosts.includes(post.id)
            ? { 
                ...post, 
                is_published: publish,
                published_at: publish ? new Date().toISOString() : null
              }
            : post
        )
      );
      
      toast.success(`Successfully ${publish ? 'published' : 'unpublished'} ${selectedPosts.length} post(s)`, { id: toggleToast });
      setSelectedPosts([]);
      fetchStats();
    } catch (error: any) {
      console.error('Bulk toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update posts', { id: toggleToast });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'blog');
      
      const response = await api.post('/upload/blog-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const imageData = response.data.data;
        const imageUrl = imageData.url || imageData.fullUrl;
        
        if (imageUrl) {
          setFormData(prev => ({
            ...prev,
            featured_image: imageUrl
          }));
          toast.success('Image uploaded successfully!');
        } else {
          toast.error('Image uploaded but no URL returned');
        }
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('❌ Upload error details:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    const getDateValue = (dateStr: string | null) => {
      if (!dateStr) return 0;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    switch (sortBy) {
      case 'newest':
        return getDateValue(b.published_at) - getDateValue(a.published_at);
      case 'oldest':
        return getDateValue(a.published_at) - getDateValue(b.published_at);
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
    <div className="bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Main Container */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
        <div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
          {/* Blue Title Section */}
          <div className="bg-blue-200 text-black  rounded-t-lg sm:rounded-t-xl">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Blog Management
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Create, edit, and manage your blog posts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="sm:hidden bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* White Content Section - Show only when sidebar is closed on mobile */}
          {(!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="bg-white rounded-b-lg sm:rounded-b-xl">
              <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                      All Posts ({posts.length})
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                      Create, edit, and organize your blog content
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                      <Plus size={16} className="sm:size-[18px]" />
                      <span className="font-medium">Add Post</span>
                    </button>
                    <div className="sm:hidden flex items-center space-x-2 ml-auto">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Stats Cards */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{totalPostsCount}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Published</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">{publishedPostsCount}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Drafts</p>
                        <p className="text-lg sm:text-xl font-bold text-yellow-600">{draftPostsCount}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-yellow-100 rounded-lg">
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Categories</p>
                        <p className="text-lg sm:text-xl font-bold text-purple-600">{PREDEFINED_CATEGORIES.length}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-purple-100 rounded-lg">
                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats Summary */}
                <div className="sm:hidden grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Total</p>
                    <p className="text-base font-bold text-gray-900">{totalPostsCount}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Pub</p>
                    <p className="text-base font-bold text-green-600">{publishedPostsCount}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Draft</p>
                    <p className="text-base font-bold text-yellow-600">{draftPostsCount}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Cats</p>
                    <p className="text-base font-bold text-purple-600">{PREDEFINED_CATEGORIES.length}</p>
                  </div>
                </div>

                {/* Compact Search and Filter Bar */}
                <div className="bg-white rounded p-2 sm:p-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search posts..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                        <select
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value as any);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="published">Published</option>
                          <option value="draft">Drafts</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                        <select
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="all">All Categories</option>
                          {categoriesFromPosts.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                        <select
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value as any);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="views">Most Views</option>
                          <option value="title">Title A-Z</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <span className="text-xs text-gray-600 hidden sm:inline">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                        </select>
                        <span className="text-xs text-gray-600 hidden sm:inline">per page</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar - Hide when sidebar is open on mobile */}
        {selectedPosts.length > 0 && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedPosts.length} selected
                  </span>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleBulkTogglePublish(true)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkTogglePublish(false)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Unpublish
                  </button>
                </div>
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
              >
                Delete ({selectedPosts.length})
              </button>
            </div>
          </div>
        )}

        {/* Grid View for Mobile */}
        {viewMode === 'grid' && (!isSidebarOpen || window.innerWidth >= 640) && (
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
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        post.is_published 
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
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm sm:shadow-lg overflow-hidden">
            {currentPosts.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-lg">No posts found</p>
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm"
                  >
                    <Plus size={14} className="sm:size-[20px]" />
                    <span>Create First Post</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-20">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-8 sm:w-10">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPosts.length === currentPosts.length && currentPosts.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                       <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[180px] sm:w-[220px]">
  Post
</th>

                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20 sm:w-24">
                          Category
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16 sm:w-20">
                          Status
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12 sm:w-16">
                          Stats
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16 sm:w-20">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPosts.map((post) => {
                        const categoryColor = getCategoryColor(post.category);
                        return (
                          <tr key={post.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPosts.includes(post.id)}
                                  onChange={() => handleSelectPost(post.id)}
                                  className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="flex items-start space-x-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
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
                                    <FileImage className="w-full h-full p-2 text-gray-400" />
                                  )}
                                </div>
<div className="flex-1 min-w-0 max-w-[150px] sm:max-w-[200px]">
                                  <h4 className="font-medium text-gray-900 mb-0.5 truncate text-xs sm:text-sm">{post.title}</h4>
<p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[140px] sm:max-w-[190px]">
  {post.excerpt}
</p>
                                  <div className="flex items-center text-[10px] sm:text-xs text-gray-400 space-x-2">
                                    <span className="flex items-center">
                                      <CalendarDays className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                      {post.published_at && post.published_at !== 'null'
                                        ? new Date(post.published_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                          })
                                        : 'Draft'}
                                    </span>
                                    <span className="hidden sm:flex items-center">
                                      <Clock className="w-2.5 h-2.5 mr-1" />
                                      {post.read_time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="flex items-center">
                                <div 
                                  className="p-0.5 sm:p-1 rounded-md mr-1 sm:mr-1.5"
                                  style={{ backgroundColor: `${categoryColor}20` }}
                                >
                                  {getCategoryIcon(post.category)}
                                </div>
                                <span 
                                  className="font-medium text-[10px] sm:text-xs truncate"
                                  style={{ color: categoryColor }}
                                >
                                  {post.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <button
                                onClick={() => handleTogglePublish(post.id, post.is_published)}
                                className={`inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors min-w-[70px] sm:min-w-[100px] justify-center ${
                                  post.is_published
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {post.is_published ? (
                                  <>
                                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    <span>Publish</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    <span>Draft</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center text-[10px] sm:text-xs text-gray-600">
                                  <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1.5" />
                                  {post.views} views
                                </div>
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 sm:px-4 py-2 sm:py-3 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="text-xs sm:text-sm text-gray-700">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold">{indexOfFirstItem + 1}</span>
                        <span className="hidden sm:inline"> to </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold">
                          {Math.min(indexOfLastItem, filteredPosts.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold">{filteredPosts.length}</span>
                        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                          <span className="ml-1 sm:ml-2 text-blue-600 text-[10px] sm:text-xs hidden sm:inline">
                            {searchTerm && `(Search: "${searchTerm}")`}
                            {statusFilter !== 'all' && ` (Status: ${statusFilter})`}
                            {categoryFilter !== 'all' && ` (Category: ${categoryFilter})`}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-start space-x-1 sm:space-x-2">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
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
                                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-lg transition ${
                                  currentPage === pageNumber
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'border border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          {totalPages > 3 && currentPage < totalPages - 1 && (
                            <>
                              <span className="px-0.5 sm:px-1 text-gray-500">...</span>
                              <button
                                onClick={() => goToPage(totalPages)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
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

      {/* POST MODAL - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {editingPost ? 'Edit Post' : 'New Post'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formData.is_published ? 'Will be published immediately' : 'Will be saved as draft'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      formData.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {formData.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </div>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} className="sm:size-[24px]" />
                    </button>
                  </div>
                </div>

                {showPreview ? (
                  <div className="p-4">
                    <div className="max-w-3xl mx-auto">
                      <img
                        src={formData.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'}
                        alt="Preview"
                        className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
                      />
                      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {formData.title || 'Post Title'}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-6">
                        <span className="flex items-center text-sm">
                          <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {formData.author_name || 'Author Name'}
                        </span>
                        <span className="flex items-center text-sm">
                          <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {new Date().toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-sm">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {formData.read_time}
                        </span>
                      </div>
                      <div className="prose prose-sm sm:prose-lg max-w-none">
                        <p className="text-lg sm:text-xl text-gray-700 mb-6">
                          {formData.excerpt || 'Post excerpt will appear here...'}
                        </p>
                        <div dangerouslySetInnerHTML={{ 
                          __html: formData.content.replace(/\n/g, '<br>') || 'Post content will appear here...' 
                        }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Row 1: Title & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                          placeholder="Post title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        >
                          <option value="">Select category</option>
                          {PREDEFINED_CATEGORIES.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Excerpt & Read Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Excerpt *
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                          rows={2}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                          placeholder="Brief summary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={formData.read_time}
                          onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="5 min read"
                        />
                      </div>
                    </div>

                    {/* Row 3: Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="technology, web, development"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Content *
                        </label>
                        <span className="text-xs text-gray-400">Supports markdown</span>
                      </div>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        rows={4}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                        required
                        placeholder="Write your content here..."
                      />
                    </div>

                    {/* Featured Image + Settings */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Featured Image */}
                      <div className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Featured Image
                          </label>
                          
                          {formData.featured_image ? (
                            <div className="mb-4">
                              <div className="relative">
                                <img
                                  src={formData.featured_image}
                                  alt="Featured"
                                  className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                                  }}
                                />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(formData.featured_image);
                                      toast.success('URL copied!');
                                    }}
                                    className="p-1.5 bg-gray-800 text-white rounded hover:bg-gray-900"
                                    title="Copy URL"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({...prev, featured_image: ''}))}
                                    className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                                    title="Remove"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <input
                                  type="url"
                                  value={formData.featured_image}
                                  onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                  placeholder="Enter image URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const img = new Image();
                                    img.onload = () => toast.success('✅ Valid');
                                    img.onerror = () => toast.error('❌ Invalid URL');
                                    img.src = formData.featured_image;
                                  }}
                                  className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  Test
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Enter Image URL
                                </label>
                                <input
                                  type="url"
                                  value={formData.featured_image}
                                  onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                  placeholder="https://images.unsplash.com/..."
                                />
                              </div>
                              
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                  <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                                </div>
                              </div>

                              <div>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={uploading}
                                  className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition disabled:opacity-50"
                                >
                                  {uploading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                      <span className="text-sm">Uploading...</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <UploadIcon className="w-5 h-5 text-gray-400 mx-auto" />
                                      <div className="text-sm font-medium">Click to upload</div>
                                      <div className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</div>
                                    </div>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Publish & SEO Settings */}
                      <div className="space-y-4 sm:space-y-6">
                        {/* Publish Settings */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">PUBLISH</h3>
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={formData.is_published}
                                onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {formData.is_published ? 'Published' : 'Save as Draft'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formData.is_published 
                                  ? 'Post is publicly visible' 
                                  : 'Post will be saved as draft'}
                              </div>
                            </div>
                          </label>
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">SEO</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Meta Title
                              </label>
                              <input
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                placeholder="SEO title"
                                maxLength={255}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Meta Description
                              </label>
                              <textarea
                                value={formData.meta_description}
                                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                placeholder="SEO description"
                                maxLength={500}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg sm:rounded-xl text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`px-3 sm:px-5 py-2 sm:py-2.5 text-sm rounded-lg sm:rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 ${
                            formData.is_published 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-gray-600 hover:bg-gray-700 text-white'
                          }`}
                          disabled={
                            !formData.title ||
                            !formData.excerpt ||
                            !formData.content ||
                            !formData.category
                          }
                        >
                          {editingPost ? (
                            <>
                              <Save size={14} className="sm:size-[16px]" />
                              <span>
                                {formData.is_published ? 'Update & Publish' : 'Update as Draft'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} className="sm:size-[16px]" />
                              <span>
                                {formData.is_published ? 'Create & Publish' : 'Save as Draft'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCMS;
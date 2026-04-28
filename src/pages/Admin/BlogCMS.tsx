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
  Code as CodeIcon, Database as DatabaseIcon} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { blogApi, type BlogPost, type BlogStats } from '../../lib/blogApi';






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
  toast.success('Blog post updated successfully!');
} else {
  await blogApi.create(postData);
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
await blogApi.delete(id);
    toast.success('Blog post deleted successfully!' );
    fetchPosts();
  } catch (err) {
    toast.error('Failed to delete blog post');
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
    await blogApi.bulkDelete(selectedPosts);


    toast.success(
      `Successfully deleted ${selectedPosts.length} post(s)`
    );

    setSelectedPosts([]);
    fetchPosts();
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || 'Failed to delete posts'
    );
  }
};


 const handleTogglePublish = async (id: number, currentStatus: boolean) => {
  // const t = toast.loading(currentStatus ? 'Moving to draft...' : 'Publishing...');
  try {
    const postToUpdate = posts.find(p => p.id === id);
    if (!postToUpdate) { toast.error('Post not found'); return; }

    await blogApi.update(id, {
      title: postToUpdate.title,
      excerpt: postToUpdate.excerpt,
      content: postToUpdate.content,
      category: postToUpdate.category,
      is_published: !currentStatus,
      tags: Array.isArray(postToUpdate.tags) ? postToUpdate.tags : [],
      read_time: postToUpdate.read_time || '5 min read',
      meta_title: postToUpdate.meta_title || null,
      meta_description: postToUpdate.meta_description || null,
      featured_image: postToUpdate.featured_image?.trim() || null,
      published_at: !currentStatus ? new Date().toISOString() : null,
    });

    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, is_published: !currentStatus, published_at: !currentStatus ? new Date().toISOString() : null }
        : p
    ));
    toast.success(`Post ${!currentStatus ? 'published' : 'moved to draft'}`);
    fetchStats();
  } catch (err: any) {
    toast.error(err?.message || 'Failed to update post status');
  }
};

  const handleBulkTogglePublish = async (publish: boolean) => {
  if (selectedPosts.length === 0) { toast.error('Please select posts to update'); return; }
  const t = toast.loading(`${publish ? 'Publishing' : 'Unpublishing'} ${selectedPosts.length} post(s)...`);
  try {
    await blogApi.bulkTogglePublish(selectedPosts, publish, posts);
    setPosts(prev => prev.map(p =>
      selectedPosts.includes(p.id)
        ? { ...p, is_published: publish, published_at: publish ? new Date().toISOString() : null }
        : p
    ));
    toast.success(`Successfully ${publish ? 'published' : 'unpublished'} ${selectedPosts.length} post(s)`);
    setSelectedPosts([]);
    fetchStats();
  } catch (err: any) {
    toast.error(err?.message || 'Failed to update posts');
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
    <div className="bg-white ">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Main Container */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
 <div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Blog Management
          </h1>
        </div>
       <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Post</span>
            </button>
      </div>
    </div>
  </div>

  {/* White Content Section - Show only when sidebar is closed on mobile */}
  {(!isSidebarOpen || window.innerWidth >= 640) && (
    <div className="bg-white rounded-b-lg sm:rounded-b-xl">
      <div className="px-2 py-2 sm:px-3 sm:py-2.5">
        {/* Header with Actions */}
        <div className="flex flex-row justify-between items-center gap-1.5 mb-2 sm:mb-2.5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
              Posts ({posts.length})
            </h2>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Manage blog content</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Post</span>
            </button>
            <div className="sm:hidden flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Stats Cards */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-1.5 mb-2 sm:mb-2.5">
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{totalPostsCount}</p>
              </div>
              <div className="p-1 bg-blue-100 rounded-lg">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Published</p>
                <p className="text-base sm:text-lg font-bold text-green-600">{publishedPostsCount}</p>
              </div>
              <div className="p-1 bg-green-100 rounded-lg">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Drafts</p>
                <p className="text-base sm:text-lg font-bold text-yellow-600">{draftPostsCount}</p>
              </div>
              <div className="p-1 bg-yellow-100 rounded-lg">
                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Categories</p>
                <p className="text-base sm:text-lg font-bold text-purple-600">{PREDEFINED_CATEGORIES.length}</p>
              </div>
              <div className="p-1 bg-purple-100 rounded-lg">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Summary */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5 mb-2">
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Total</p>
            <p className="text-sm font-bold text-gray-900">{totalPostsCount}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Pub</p>
            <p className="text-sm font-bold text-green-600">{publishedPostsCount}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Draft</p>
            <p className="text-sm font-bold text-yellow-600">{draftPostsCount}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Cats</p>
            <p className="text-sm font-bold text-purple-600">{PREDEFINED_CATEGORIES.length}</p>
          </div>
        </div>

        {/* Compact Search and Filter Bar */}
        <div className="bg-white rounded p-1.5 sm:p-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                <ArrowUpDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="views">Most Views</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-[9px] sm:text-xs text-gray-600 hidden sm:inline">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                <span className="text-[9px] sm:text-xs text-gray-600 hidden sm:inline">per page</span>
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
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-370px)] sm:max-h-[calc(100vh-370px)]">
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
                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${
                  currentPage === pageNumber
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

      {/* POST MODAL - Responsive */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop - Black */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      onClick={handleCloseModal}
    />

    {/* Center wrapper */}
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-3xl bg-white rounded-lg sm:rounded-xl shadow-lg">
        
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-lg sm:rounded-t-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-[#FFC107] rounded-md w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[9px] sm:text-xs text-[#0D47A1] shrink-0">
                bp
              </div>
              <div>
                <h2 className="text-white font-medium text-xs sm:text-sm">
                  {editingPost ? 'Edit Post' : 'Add New Post'}
                </h2>
                <p className="text-white/70 text-[8px] sm:text-[10px] hidden sm:block">
                  {editingPost ? 'Update post details' : 'Add a new post to your blog'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-medium ${
                formData.is_published 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-gray-500/20 text-gray-200'
              }`}>
                {formData.is_published ? 'PUBLISHED' : 'DRAFT'}
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[8px] sm:text-[9px] border border-white/30 rounded text-white hover:bg-white/10 transition"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleCloseModal}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center cursor-pointer shrink-0 hover:bg-white/20 transition"
              >
                <X size={10} className="sm:w-3 sm:h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body - No Scroll on Desktop ─── */}
        <div className="max-h-[70vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          <div className="p-2.5 sm:p-4">
            
            {showPreview ? (
              <div className="p-2 sm:p-4">
                <div className="max-w-3xl mx-auto">
                  <img
                    src={formData.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'}
                    alt="Preview"
                    className="w-full h-32 sm:h-48 object-cover rounded mb-3 sm:mb-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="8" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {formData.title || 'Post Title'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 mb-3 sm:mb-4">
                    <span className="flex items-center text-[10px] sm:text-xs">
                      <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      {formData.author_name || 'Author Name'}
                    </span>
                    <span className="flex items-center text-[10px] sm:text-xs">
                      <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      {new Date().toLocaleDateString()}
                    </span>
                    <span className="flex items-center text-[10px] sm:text-xs">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      {formData.read_time}
                    </span>
                  </div>
                  <div className="prose prose-sm sm:prose max-w-none">
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                      {formData.excerpt || 'Post excerpt will appear here...'}
                    </p>
                    <div dangerouslySetInnerHTML={{ 
                      __html: formData.content.replace(/\n/g, '<br>') || 'Post content will appear here...' 
                    }} />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">

                {/* ROW 1: Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                  <div>
                    <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                      Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                      required
                      placeholder="Post title"
                    />
                  </div>

                  <div>
                    <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                      Category <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
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

                {/* ROW 2: Excerpt & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                  <div>
                    <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                      Excerpt <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      rows={2}
                      className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                      required
                      placeholder="Brief summary"
                    />
                  </div>

                  <div>
                    <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.read_time}
                      onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                      className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                      placeholder="5 min read"
                    />
                  </div>
                </div>

                {/* ROW 3: Tags */}
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                    placeholder="technology, web, development"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="block text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                      Content <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[7px] sm:text-[9px] text-gray-400">Supports markdown</span>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] font-mono resize-none"
                    required
                    placeholder="Write your content here..."
                  />
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-100 my-1" />

                {/* Featured Image + Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
                  {/* Featured Image */}
                  <div className="lg:col-span-2">
                    <div className="bg-[#fafbff] rounded border border-gray-200 p-2 sm:p-3">
                      <label className="block mb-1.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                        Featured Image
                      </label>
                      
                      {formData.featured_image ? (
                        <div className="mb-2 sm:mb-3">
                          <div className="relative">
                            <img
                              src={formData.featured_image}
                              alt="Featured"
                              className="w-full h-28 sm:h-36 object-cover rounded mb-1.5"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="8" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(formData.featured_image);
                                  toast.success('URL copied!');
                                }}
                                className="p-1 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
                                title="Copy URL"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({...prev, featured_image: ''}))}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                title="Remove"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1.5 mt-2">
                            <input
                              type="text"
                              value={formData.featured_image}
                              onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                              className="flex-1 px-2 py-0.5 text-[9px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
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
                              className="px-2 py-0.5 text-[9px] bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                              Test
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[8px] sm:text-[9px] text-gray-600 mb-0.5">
                              Enter Image URL
                            </label>
                            <input
                              type="text"
                              value={formData.featured_image}
                              onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                              className="w-full px-2 py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-[8px] sm:text-[9px]">
                              <span className="px-2 bg-[#fafbff] text-gray-500">OR</span>
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
                              className="w-full border border-dashed border-gray-300 rounded p-2 text-center hover:border-gray-400 transition disabled:opacity-50 bg-white"
                            >
                              {uploading ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                                  <span className="text-[9px] sm:text-[10px]">Uploading...</span>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <UploadIcon className="w-4 h-4 text-gray-400 mx-auto" />
                                  <div className="text-[9px] sm:text-[10px] font-medium">Click to upload</div>
                                  <div className="text-[7px] sm:text-[8px] text-gray-500">PNG, JPG, WebP up to 5MB</div>
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Publish & SEO Settings */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Publish Settings */}
                    <div className="bg-[#fafbff] rounded border border-gray-200 p-2 sm:p-3">
                      <h3 className="text-[9px] sm:text-[10px] font-semibold text-gray-700 mb-1.5">PUBLISH</h3>
                      <label className="flex items-start gap-1.5 cursor-pointer">
                        <div className="flex items-center h-3.5">
                          <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                            className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-medium">
                            {formData.is_published ? 'Published' : 'Save as Draft'}
                          </div>
                          <div className="text-[7px] sm:text-[8px] text-gray-500">
                            {formData.is_published 
                              ? 'Post is publicly visible' 
                              : 'Post will be saved as draft'}
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-[#fafbff] rounded border border-gray-200 p-2 sm:p-3">
                      <h3 className="text-[9px] sm:text-[10px] font-semibold text-gray-700 mb-1.5">SEO</h3>
                      <div className="space-y-1.5">
                        <div>
                          <label className="block text-[7px] sm:text-[8px] text-gray-600 mb-0.5">
                            Meta Title
                          </label>
                          <input
                            type="text"
                            value={formData.meta_title}
                            onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                            className="w-full px-2 py-0.5 text-[8px] sm:text-[9px] border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                            placeholder="SEO title"
                            maxLength={255}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[7px] sm:text-[8px] text-gray-600 mb-0.5">
                            Meta Description
                          </label>
                          <textarea
                            value={formData.meta_description}
                            onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                            rows={1}
                            className="w-full px-2 py-0.5 text-[8px] sm:text-[9px] border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                            placeholder="SEO description"
                            maxLength={500}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-100 my-1" />

                {/* Form Actions */}
                <div className="flex justify-end gap-1.5 sm:gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-300 rounded text-[9px] sm:text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded text-[9px] sm:text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition ${
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
                        <Save size={10} className="sm:w-3 sm:h-3" />
                        <span>{formData.is_published ? 'Update' : 'Update Draft'}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={10} className="sm:w-3 sm:h-3" />
                        <span>{formData.is_published ? 'Create' : 'Save Draft'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BlogCMS;
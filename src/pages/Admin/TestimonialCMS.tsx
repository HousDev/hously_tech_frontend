import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, 
  X, Star, User, 
  Search, Filter,
  ChevronLeft, ChevronRight, Check,
  ThumbsUp, Users, Grid, List
  } from 'lucide-react';
import { testimonialsApi, type Testimonial } from '../../lib/testimonialApi';
import { toast, Toaster } from 'react-hot-toast';


interface TestimonialsCMSProps {
  isSidebarOpen?: boolean;
}

const TestimonialsCMS = ({ isSidebarOpen = false }: TestimonialsCMSProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTestimonials, setSelectedTestimonials] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    rating: 5,
    text: '',
    image: '', 
    image_url: '',
    display_order: 0,
    is_active: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
  try {
    setLoading(true);
    const data = await testimonialsApi.getAll();
    const sorted = [...data].sort((a, b) => a.display_order - b.display_order);
    setTestimonials(sorted);
  } catch (error) {
    toast.error('Failed to fetch testimonials');
  } finally {
    setLoading(false);
  }
};

  

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file (PNG, JPG, JPEG, GIF, WEBP)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }

  setSelectedFile(file);
  const previewUrl = URL.createObjectURL(file);
  
  // Auto-upload immediately
  try {
    setUploadingImage(true);
    const fullUrl = await testimonialsApi.uploadImage(file);
    setFormData(prev => ({ ...prev, image_url: fullUrl }));
    toast.success('Image uploaded successfully!');
    // Clean up blob URL
    URL.revokeObjectURL(previewUrl);
  } catch (err: any) {
    toast.error(err?.message || 'Failed to upload image');
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  } finally {
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

  const handleImageUpload = async () => {
  if (!selectedFile) { alert('Please select an image file first'); return; }
  try {
    setUploadingImage(true);
    const fullUrl = await testimonialsApi.uploadImage(selectedFile);
    setFormData(prev => ({ ...prev, image_url: fullUrl }));
    toast.success('Image uploaded successfully!');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  } catch (err: any) {
    toast.error(err?.message || 'Failed to upload image');
  } finally {
    setUploadingImage(false);
  }
};

 

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.text.trim()) newErrors.text = 'Testimonial text is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  if (selectedFile && !formData.image_url && !uploadingImage) {
    toast.error('Please wait for image upload to complete');
    return;
  }

  const loadingToast = toast.loading(editingTestimonial ? 'Updating testimonial...' : 'Creating testimonial...');

  try {
    setUploading(true);
    const submitData = {
      ...formData,
      rating: Number(formData.rating),
      display_order: Number(formData.display_order) || testimonials.length + 1,
      image_url: formData.image_url
    };

    if (editingTestimonial) {
      await testimonialsApi.update(editingTestimonial.id, submitData);
      toast.success('Testimonial updated successfully!', { id: loadingToast });
    } else {
      await testimonialsApi.create(submitData);
      toast.success('Testimonial created successfully!', { id: loadingToast });
    }

    fetchTestimonials();
    handleCloseModal();
  } catch (error: any) {
    console.error('Error saving testimonial:', error);
    toast.error(error.response?.data?.message || 'Failed to save testimonial', { id: loadingToast });
  } finally {
    setUploading(false);
  }
};

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      rating: testimonial.rating,
      text: testimonial.text,
      image: '',
      image_url: testimonial.image_url,
      display_order: testimonial.display_order,
      is_active: testimonial.is_active
    });
    
    setSelectedFile(null);
    setIsModalOpen(true);
  };

const handleDelete = async (id: number) => {
  const t = toast.loading('Deleting testimonial...');
  try {
    await testimonialsApi.delete(id);
    toast.success('Deleted successfully!', { id: t });
    fetchTestimonials();
  } catch (err: any) {
    toast.error('Failed to delete', { id: t });
  }
};

const handleBulkDelete = async () => {
  if (!selectedTestimonials.length) { toast.error('Please select testimonials'); return; }
  const t = toast.loading(`Deleting ${selectedTestimonials.length}...`);
  try {
    await testimonialsApi.bulkDelete(selectedTestimonials);
    toast.success(`Deleted ${selectedTestimonials.length} testimonial(s)`, { id: t });
    setSelectedTestimonials([]);
    fetchTestimonials();
  } catch (err: any) {
    toast.error('Failed to delete', { id: t });
  }
};


 const handleToggleActive = async (id: number, currentStatus: boolean) => {
  const t = toast.loading(currentStatus ? 'Deactivating...' : 'Activating...');
  try {
    await testimonialsApi.toggleActive(id);
    setTestimonials(prev => prev.map(tm => tm.id === id ? { ...tm, is_active: !currentStatus } : tm));
    toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`, { id: t });
  } catch (err: any) {
    toast.error('Failed to update status', { id: t });
  }
};

const handleBulkToggleActive = async (activate: boolean) => {
  if (!selectedTestimonials.length) { toast.error('Please select testimonials'); return; }
  const t = toast.loading(`${activate ? 'Activating' : 'Deactivating'}...`);
  try {
    await testimonialsApi.bulkToggleActive(selectedTestimonials);
    setTestimonials(prev => prev.map(t =>
      selectedTestimonials.includes(t.id) ? { ...t, is_active: activate } : t
    ));
    toast.success(`Updated ${selectedTestimonials.length} testimonial(s)`, { id: t });
  } catch (err: any) {
    toast.error('Failed to update', { id: t });
  }
};

 const handleReorder = async (id: number, direction: 'up' | 'down') => {
  const currentIndex = testimonials.findIndex(t => t.id === id);
  if (currentIndex === -1) return;
  if (direction === 'up' && currentIndex === 0) return;
  if (direction === 'down' && currentIndex === testimonials.length - 1) return;

  const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  const newTestimonials = [...testimonials];
  [newTestimonials[currentIndex], newTestimonials[swapIndex]] =
    [newTestimonials[swapIndex], newTestimonials[currentIndex]];
  newTestimonials.forEach((t, i) => { t.display_order = i; });

  try {
    await testimonialsApi.reorder(newTestimonials.map((t, i) => ({ id: t.id, display_order: i })));
    setTestimonials(newTestimonials);
  } catch (err: any) {
    toast.error('Failed to reorder');
    fetchTestimonials();
  }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setSelectedFile(null);
    setErrors({});
    setFormData({
      name: '',
      position: '',
      rating: 5,
      text: '',
      image: '',
      image_url: '',
      display_order: testimonials.length + 1,
      is_active: true
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate stats
  const totalTestimonials = testimonials.length;
  const activeTestimonials = testimonials.filter(t => t.is_active).length;
  const inactiveTestimonials = testimonials.filter(t => !t.is_active).length;
  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  // Filter and pagination
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = searchTerm === '' || 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeFilter === 'all' ||
      (activeFilter === 'active' && testimonial.is_active) ||
      (activeFilter === 'inactive' && !testimonial.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedTestimonials.length === currentTestimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(currentTestimonials.map(testimonial => testimonial.id));
    }
  };

  const handleSelectTestimonial = (id: number) => {
    if (selectedTestimonials.includes(id)) {
      setSelectedTestimonials(selectedTestimonials.filter(testimonialId => testimonialId !== id));
    } else {
      setSelectedTestimonials([...selectedTestimonials, id]);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white ">

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
      {/* Main Container */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
       {/* Header - Fixed with sidebar consideration */}
<div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Testimonials Management
          </h1>
        </div>
         <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-2.5 py-2 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Testimonial</span>
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
              Testimonials ({testimonials.length})
            </h2>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Manage client reviews</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Testimonial</span>
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
                <p className="text-base sm:text-lg font-bold text-[#0076d8]">{totalTestimonials}</p>
              </div>
              <div className="p-1 bg-blue-100 rounded-lg">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0076d8]" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                <p className="text-base sm:text-lg font-bold text-green-600">{activeTestimonials}</p>
              </div>
              <div className="p-1 bg-green-100 rounded-lg">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
                <p className="text-base sm:text-lg font-bold text-red-600">{inactiveTestimonials}</p>
              </div>
              <div className="p-1 bg-red-100 rounded-lg">
                <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500">Avg Rating</p>
                <p className="text-base sm:text-lg font-bold text-yellow-600">{avgRating}</p>
              </div>
              <div className="p-1 bg-yellow-100 rounded-lg">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Summary */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5 mb-2">
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Total</p>
            <p className="text-sm font-bold text-[#0076d8]">{totalTestimonials}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Active</p>
            <p className="text-sm font-bold text-green-600">{activeTestimonials}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Inactive</p>
            <p className="text-sm font-bold text-red-600">{inactiveTestimonials}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Rating</p>
            <p className="text-sm font-bold text-yellow-600">{avgRating}</p>
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
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8]"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
                <select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-[9px] sm:text-xs text-gray-600 hidden sm:inline">/pg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

        {/* Bulk Actions Bar - Hide when sidebar is open on mobile */}
        {selectedTestimonials.length > 0 && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedTestimonials.length} selected
                  </span>
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleBulkToggleActive(true)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkToggleActive(false)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
              >
                Delete ({selectedTestimonials.length})
              </button>
            </div>
          </div>
        )}

        {/* Grid View for Mobile */}
        {viewMode === 'grid' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="sm:hidden grid grid-cols-1 gap-3 mb-4">
            {currentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTestimonials.includes(testimonial.id)}
                      onChange={() => handleSelectTestimonial(testimonial.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleReorder(testimonial.id, 'up')}
                        disabled={testimonial.display_order === 0}
                        className="p-0.5 text-gray-500"
                      >
                        <MoveUp size={12} />
                      </button>
                      <span className="text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                        {testimonial.display_order + 1}
                      </span>
                      <button
                        onClick={() => handleReorder(testimonial.id, 'down')}
                        disabled={testimonial.display_order === testimonials.length - 1}
                        className="p-0.5 text-gray-500"
                      >
                        <MoveDown size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      testimonial.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {testimonial.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    {testimonial.image_url ? (
                      <img
src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#0076d8]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">{testimonial.text}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-600">({testimonial.rating})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    {formatDate(testimonial.created_at)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm sm:shadow-lg overflow-hidden">
            {currentTestimonials.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-lg">No testimonials found</p>
                {searchTerm || activeFilter !== 'all' ? (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 sm:mt-4 bg-[#0076d8] hover:bg-[#0066c0] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm"
                  >
                    <Plus size={14} className="sm:size-[20px]" />
                    <span>Add First Testimonial</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-340px)] sm:max-h-[calc(100vh-380px)]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-20">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8 sm:w-10">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTestimonials.length === currentTestimonials.length && currentTestimonials.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 sm:w-16">
                          Order
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28 sm:w-40">
                          Client
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 sm:w-48">
                          Testimonial
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 sm:w-20">
                          Rating
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 sm:w-20">
                          Status
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 sm:w-20">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTestimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedTestimonials.includes(testimonial.id)}
                                onChange={() => handleSelectTestimonial(testimonial.id)}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                  onClick={() => handleReorder(testimonial.id, 'up')}
                                  disabled={testimonial.display_order === 0}
                                  className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  title="Move up"
                                >
                                  <MoveUp size={10} className="sm:size-[14px] text-gray-600" />
                                </button>
                                <span className="font-bold text-gray-900 text-xs sm:text-sm min-w-[20px] sm:min-w-[24px] text-center">
                                  {testimonial.display_order + 1}
                                </span>
                                <button
                                  onClick={() => handleReorder(testimonial.id, 'down')}
                                  disabled={testimonial.display_order === currentTestimonials.length - 1}
                                  className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  title="Move down"
                                >
                                  <MoveDown size={10} className="sm:size-[14px] text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex-shrink-0">
                                {testimonial.image_url ? (
                               <img src={testimonial.image_url} 
                                    alt={testimonial.name}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#0076d8]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{testimonial.name}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{testimonial.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 max-w-xs">{testimonial.text}</p>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={`${
                                    i < testimonial.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-xs sm:text-sm text-gray-600">({testimonial.rating})</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <button
                              onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                              className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                                testimonial.is_active 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {testimonial.is_active ? (
                                <>
                                  <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                  <span className="hidden sm:inline">Active</span>
                                  <span className="sm:hidden">On</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                  <span className="hidden sm:inline">Inactive</span>
                                  <span className="sm:hidden">Off</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <button
                                onClick={() => handleEdit(testimonial)}
                                className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                title="Edit"
                              >
                                <Edit size={12} className="sm:size-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                title="Delete"
                              >
                                <Trash2 size={12} className="sm:size-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
               {filteredTestimonials.length > 0 && (
  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {/* Left side - Showing info compact */}
      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
        <span className="hidden sm:inline">Showing </span>
        <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
        <span className="hidden sm:inline"> - </span>
        <span className="sm:hidden">-</span>
        <span className="font-semibold text-gray-800">
          {Math.min(indexOfLastItem, filteredTestimonials.length)}
        </span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-gray-800">{filteredTestimonials.length}</span>
        
        {/* Filter indicators - compact */}
        {(searchTerm || activeFilter !== 'all') && (
          <span className="ml-1 text-[#0076d8] text-[8px] sm:text-[10px] hidden sm:inline">
            {searchTerm && `🔍 "${searchTerm.slice(0, 8)}${searchTerm.length > 8 ? '…' : ''}"`}
            {activeFilter !== 'all' && ` • ${activeFilter === 'active' ? 'Act' : 'Inact'}`}
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
                    ? 'bg-[#0076d8] text-white font-medium shadow-sm'
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

      {/* Add/Edit Modal - Responsive */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop - Black */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      onClick={handleCloseModal}
    />

    {/* Center wrapper */}
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-3xl bg-white rounded-lg sm:rounded-xl shadow-lg">
        
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-lg sm:rounded-t-xl">
          <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-[#FFC107] rounded-md w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[9px] sm:text-xs text-[#0D47A1] shrink-0">
                tm
              </div>
              <div>
                <h2 className="text-white font-medium text-xs sm:text-sm">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <p className="text-white/70 text-[8px] sm:text-[10px] hidden sm:block">
                  {editingTestimonial ? 'Update testimonial details' : 'Add a new client testimonial'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center cursor-pointer shrink-0 hover:bg-white/20 transition"
            >
              <X size={10} className="sm:w-3 sm:h-3" />
            </button>
          </div>
        </div>

        {/* ─── Body - No Scroll on Desktop ─── */}
        <div className="max-h-[70vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          <div className="p-2.5 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">

              {/* ROW 1: Name + Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Client Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                  />
                  {errors.name && (
                    <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Position/Role <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="CEO, Tech Solutions Inc."
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                  />
                  {errors.position && (
                    <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.position}</p>
                  )}
                </div>
              </div>

              {/* ROW 2: Rating + Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Rating <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className={`p-1 sm:p-1.5 rounded ${
                          formData.rating >= rating
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Star size={12} className={`sm:w-3.5 sm:h-3.5 ${formData.rating >= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    <span className="ml-1 text-[9px] sm:text-xs text-gray-600">({formData.rating}/5)</span>
                  </div>
                  {errors.rating && (
                    <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.rating}</p>
                  )}
                </div>

                <div className="flex items-center mt-1 sm:mt-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded accent-blue-600"
                  />
                  <span className="ml-1.5 text-[9px] sm:text-xs text-gray-700">
                    Active Testimonial
                  </span>
                </div>
              </div>

              {/* ROW 3: Testimonial Text */}
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Testimonial Text <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Share your experience with our services..."
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                />
                {errors.text && (
                  <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.text}</p>
                )}
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 4: Image Upload */}
              <div>
                <label className="block mb-1 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Client Image
                </label>
                
             <div className="border border-dashed border-gray-300 rounded p-2 sm:p-3 text-center bg-[#fafbff]">
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    accept="image/*"
    className="hidden"
  />

  {uploadingImage ? (
    <div className="py-2">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
      <p className="text-[9px] sm:text-xs text-blue-600">Uploading image...</p>
    </div>
  ) : formData.image_url ? (
    <div>
      <div className="flex justify-center mb-2">
        <img 
          src={formData.image_url} 
          alt="Preview" 
          className="w-16 h-16 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setFormData(prev => ({ ...prev, image_url: '' }));
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        className="text-[8px] sm:text-[9px] text-red-600 hover:text-red-800 transition"
      >
        Remove Image
      </button>
    </div>
  ) : (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-[9px] sm:text-xs text-blue-600 font-medium hover:underline"
      >
        Click to browse image
      </button>
      <p className="text-[7px] sm:text-[9px] text-gray-400 mt-0.5">
        PNG, JPG, GIF, WEBP up to 5MB
      </p>
    </div>
  )}
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
                  disabled={uploading || uploadingImage}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded text-[9px] sm:text-xs hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 transition"
                >
                  <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{uploading ? 'Saving...' : (editingTestimonial ? 'Update' : 'Create')}</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TestimonialsCMS;
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
import { useOutletContext } from 'react-router-dom';


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

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selectedTestimonials.length) {
      toast.error('Please select testimonials');
      return;
    }
    setDeleteTargetIds(selectedTestimonials);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const t = toast.loading('Deleting testimonial...');
    try {
      await testimonialsApi.delete(id);
      toast.success('Deleted successfully!', { id: t });
      fetchTestimonials();
    } catch (err: any) {
      toast.error('Failed to delete', { id: t });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const t = toast.loading(`Deleting ${ids.length}...`);
    try {
      await testimonialsApi.bulkDelete(ids);
      toast.success(`Deleted ${ids.length} testimonial(s)`, { id: t });
      setSelectedTestimonials([]);
      fetchTestimonials();
    } catch (err: any) {
      toast.error('Failed to delete', { id: t });
    }
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Testimonials CMS');
      setHeaderSubtitle(`Manage client feedback, ratings, and active review displays (${testimonials.length} records)`);
    }
  }, [testimonials.length, setHeaderTitle, setHeaderSubtitle]);

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

  /* Deletion triggers confirm modal */


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
    <div>

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
          to   { opacity: 1; transform: scale(1)   translateY(0px); }
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
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0 sm:ml-0' : ''
        }`}>
        {/* Header - Fixed with sidebar consideration */}
        {/* Header - Fixed with sidebar consideration */}

        {/* Stats Cards - Compressed & High Density & Glassmorphic */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-100/50 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Reviews</p>
            <p className="text-base font-extrabold text-blue-600 mt-1">{totalTestimonials}</p>
          </div>
          <div className="bg-emerald-100/40 border-emerald-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active</p>
            <p className="text-base font-extrabold text-emerald-600 mt-1">{activeTestimonials}</p>
          </div>
          <div className="bg-red-100/40 border-red-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inactive</p>
            <p className="text-base font-extrabold text-red-600 mt-1">{inactiveTestimonials}</p>
          </div>
          <div className="bg-yellow-100/40 border-yellow-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Rating</p>
            <p className="text-base font-extrabold text-yellow-600 mt-1">{avgRating} ★</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-sm text-xs font-semibold flex cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

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
                <option value="50">Show 50</option>
              </select>
            </div>
          </div>
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
                onClick={handleBulkDeleteClick}
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
                    className={`px-2 py-0.5 rounded-full text-xs ${testimonial.is_active
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
                        className={`${i < testimonial.rating
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
                      onClick={() => handleDeleteClick(testimonial.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}        {/* Table View */}
        {viewMode === 'table' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="flex flex-col justify-between min-h-[480px] bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
            {currentTestimonials.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-600 text-sm sm:text-lg">No testimonials found</p>
                {searchTerm || activeFilter !== 'all' ? (
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 mx-auto text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add First Testimonial</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="min-w-full border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTestimonials.length === currentTestimonials.length && currentTestimonials.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">
                          Order
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                          Client
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-48 border-r border-b border-slate-300">
                          Testimonial
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                          Rating
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                          Status
                        </th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {currentTestimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedTestimonials.includes(testimonial.id)}
                                onChange={() => handleSelectTestimonial(testimonial.id)}
                                className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center space-x-1 justify-center">
                              <button
                                onClick={() => handleReorder(testimonial.id, 'up')}
                                disabled={testimonial.display_order === 0}
                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Move up"
                              >
                                <MoveUp size={11} className="text-slate-600" />
                              </button>
                              <span className="font-bold text-slate-800 text-[11px] min-w-[16px] text-center">
                                {testimonial.display_order + 1}
                              </span>
                              <button
                                onClick={() => handleReorder(testimonial.id, 'down')}
                                disabled={testimonial.display_order === currentTestimonials.length - 1}
                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Move down"
                              >
                                <MoveDown size={11} className="text-slate-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0">
                                {testimonial.image_url ? (
                                  <img src={testimonial.image_url}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#0076d8]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{testimonial.name}</p>
                                <p className="text-[9px] text-slate-400 truncate leading-none mt-0.5">{testimonial.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <p className="text-slate-500 text-[11px] line-clamp-2 max-w-xs leading-tight">{testimonial.text}</p>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  className={`${i < testimonial.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-slate-300'
                                    }`}
                                />
                              ))}
                              <span className="ml-1 text-[10px] font-semibold text-slate-600">({testimonial.rating})</span>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <button
                              onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${testimonial.is_active
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                            >
                              {testimonial.is_active ? (
                                <>
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-2.5 h-2.5" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-2 py-1 border-b border-slate-200 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(testimonial)}
                                className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                title="Edit"
                              >
                                <Edit size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(testimonial.id)}
                                className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                                title="Delete"
                              >
                                <Trash2 size={11} />
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
                                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${currentPage === pageNumber
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 animate-modal-content overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-[#0D47A1]" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                    {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {editingTestimonial ? 'Modify review, rating & client details' : 'Publish a new client review display'}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Row 1: Name + Position */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="CTO, Acme Corp"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                    />
                    {errors.position && <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{errors.position}</p>}
                  </div>
                </div>

                {/* Row 2: Rating + Stars + Display Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white cursor-pointer transition outline-none font-semibold text-slate-700"
                      >
                        {[5, 4, 3, 2, 1].map(n => (
                          <option key={n} value={n}>{n} Stars</option>
                        ))}
                      </select>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={12} className={i <= formData.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Row 3: Feedback textarea */}
                <div>
                  <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Feedback Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Write client testimonial text..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                  />
                  {errors.text && <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{errors.text}</p>}
                </div>

                {/* Row 4: Photo + Active toggle in one card */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {/* Avatar */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {formData.image_url ? (
                      <div className="relative flex-shrink-0">
                        <img
                          src={formData.image_url}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-slate-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => { setFormData(prev => ({ ...prev, image_url: '' })); setSelectedFile(null); }}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center cursor-pointer hover:bg-red-600 transition leading-none"
                        >×</button>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Client Photo</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-0.5 px-2.5 py-1 text-[10px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition cursor-pointer"
                      >
                        {selectedFile ? selectedFile.name.slice(0, 12) + '…' : 'Choose Photo'}
                      </button>
                      {uploadingImage && <span className="ml-1.5 text-[10px] text-blue-600 font-semibold animate-pulse">Uploading…</span>}
                    </div>
                  </div>

                  <div className="w-px h-8 bg-slate-200 flex-shrink-0" />

                  {/* Active toggle */}
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                    <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">Active</span>
                  </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || uploadingImage}
                    className="px-4 py-1.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <span>{uploading ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}</span>
                  </button>
                </div>
              </form>
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
                  {deleteTargetIds ? `${deleteTargetIds.length} testimonial${deleteTargetIds.length === 1 ? '' : 's'} selected` : '1 testimonial selected'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete {deleteTargetIds ? `these ${deleteTargetIds.length} testimonials` : 'this testimonial'}? This action <span className="text-red-500 font-bold">cannot be undone</span>.
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

export default TestimonialsCMS;
import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Edit, Trash2, MoveUp, MoveDown, X,
  Image as ImageIcon, Eye, EyeOff,
  Search, ChevronLeft, ChevronRight, Home, Check,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { homeApi, type Slide } from '../../../lib/homeApi';
import { useOutletContext } from 'react-router-dom';



interface HomeCMSProps {
  isSidebarOpen?: boolean;
}

const HomeCMS = ({ isSidebarOpen = false }: HomeCMSProps) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // New states for search, filter and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSlides, setSelectedSlides] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    bg_gradient: 'from-[#0b3a66]/95 via-[#0b3a66]/70 to-[#00c6ff]/20',
    display_order: 0,
    is_active: true
  });

  const [orderErrors, setOrderErrors] = useState<{ [key: number]: string }>({});

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selectedSlides.length) {
      toast.error('Please select slides');
      return;
    }
    setDeleteTargetIds(selectedSlides);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const t = toast.loading('Deleting slide...');
    try {
      await homeApi.delete(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      toast.dismiss(t);
    } catch {
      toast.error('Failed to delete slide', { id: t });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const t = toast.loading(`Deleting ${ids.length} slide(s)...`);
    try {
      await homeApi.bulkDelete(ids);
      toast.dismiss(t);
      setSelectedSlides([]);
      fetchSlides();
    } catch {
      toast.error('Failed to delete slides', { id: t });
    }
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Home Page CMS');
      setHeaderSubtitle(`Manage home banner, features, and landing sections (${slides.length} records)`);
    }
  }, [slides.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await homeApi.getAll();
      const sorted = [...data].sort((a, b) => a.display_order - b.display_order);
      setSlides(sorted);
      validateOrders(sorted);
    } catch {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };





  const validateOrders = (slidesList: Slide[]) => {
    const errors: { [key: number]: string } = {};
    const orderMap: { [key: number]: number[] } = {};

    slidesList.forEach(slide => {
      if (!orderMap[slide.display_order]) {
        orderMap[slide.display_order] = [];
      }
      orderMap[slide.display_order].push(slide.id);
    });

    Object.keys(orderMap).forEach(order => {
      const orderNum = parseInt(order);
      if (orderMap[orderNum].length > 1) {
        orderMap[orderNum].forEach(slideId => {
          errors[slideId] = `Position ${orderNum + 1} is occupied by multiple slides`;
        });
      }
    });

    setOrderErrors(errors);
    return errors;
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    return homeApi.uploadImage(file);
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
    setImagePreview(previewUrl);
    setActiveTab('upload');

    // ✅ Automatically upload the file
    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadImageToServer(file);
      setFormData({ ...formData, image_url: uploadedUrl });

      // Clean up the blob URL after upload
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setImagePreview(uploadedUrl); // Show actual uploaded image preview
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`);
      setSelectedFile(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file first');
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadImageToServer(selectedFile);

      setFormData({ ...formData, image_url: uploadedUrl });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.image_url.trim()) {
      toast.error('Image is required');
      return;
    }

    if (activeTab === 'url') {
      try {
        new URL(formData.image_url);
      } catch {
        toast.error('Please enter a valid image URL starting with http:// or https://');
        return;
      }
    } else if (activeTab === 'upload' && !formData.image_url.includes('/uploads/home/')) {
      toast.error('Please upload an image first');
      return;
    }

    const requestedOrder = parseInt(formData.display_order.toString()) - 1;
    if (isNaN(requestedOrder) || requestedOrder < 0) {
      toast.error('Please enter a valid order number (1 or higher)');
      return;
    }

    const slideAtPosition = slides.find(s => s.display_order === requestedOrder);
    if (slideAtPosition && (!editingSlide || slideAtPosition.id !== editingSlide.id)) {
      toast.error(`Position ${requestedOrder + 1} is already occupied by another slide. Please choose a different position.`);
      return;
    }

    const maxPosition = slides.length;
    if (requestedOrder > maxPosition) {
      toast.error(`Maximum position available is ${maxPosition + 1}. Please choose a lower position.`);
      return;
    }

    try {
      const slideData = {
        ...formData,
        display_order: requestedOrder
      };


      // REPLACE WITH:
      if (editingSlide) {
        await homeApi.update(editingSlide.id, slideData);
        toast.success('Slide updated successfully');
      } else {
        await homeApi.create(slideData);
      }

      fetchSlides();
      handleCloseModal();
    } catch (err: any) {
      toast.error('Failed to save slide: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image_url: slide.image_url || '',
      bg_gradient: slide.bg_gradient || 'from-[#0b3a66]/95 via-[#0b3a66]/70 to-[#00c6ff]/20',
      display_order: slide.display_order + 1,
      is_active: slide.is_active
    });

    if (slide.image_url && slide.image_url.includes('/uploads/home/')) {
      setActiveTab('upload');
      setImagePreview(slide.image_url);
      setSelectedFile(null);
    } else if (slide.image_url && (slide.image_url.startsWith('http://') || slide.image_url.startsWith('https://'))) {
      setActiveTab('url');
      setImagePreview('');
    } else {
      setActiveTab('upload');
      setImagePreview('');
    }

    setIsModalOpen(true);
  };

  /* Deletion triggers confirm modal */



  const handleToggleActive = async (slideId: number, currentStatus: boolean) => {
    const t = toast.loading(currentStatus ? 'Deactivating slide...' : 'Activating slide...');
    try {
      await homeApi.update(slideId, { is_active: !currentStatus });
      setSlides(prev =>
        prev.map(s => s.id === slideId ? { ...s, is_active: !currentStatus } : s)
      );
      toast.dismiss(t);
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle slide status', { id: t });
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (!selectedSlides.length) { toast.error('Please select slides to update'); return; }
    const t = toast.loading(`${activate ? 'Activating' : 'Deactivating'} ${selectedSlides.length} slide(s)...`);
    try {
      await homeApi.bulkToggleActive(selectedSlides, activate);
      setSlides(prev =>
        prev.map(s => selectedSlides.includes(s.id) ? { ...s, is_active: activate } : s)
      );
      toast.dismiss(t);
    } catch {
      toast.error('Failed to update slides', { id: t });
    }
  };

  const handleReorder = async (slideId: number, direction: 'up' | 'down') => {
    const reorderToast = toast.loading('Moving slide...');

    try {

      const currentIndex = slides.findIndex(s => s.id === slideId);
      if (currentIndex === -1) {
        toast.error('Slide not found');
        return;
      }

      if (direction === 'up' && currentIndex === 0) return;
      if (direction === 'down' && currentIndex === slides.length - 1) return;

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const swapSlideId = slides[swapIndex].id;


      // REPLACE WITH:
      await homeApi.swap(slideId, swapSlideId);

      const newSlides = [...slides];
      [newSlides[currentIndex], newSlides[swapIndex]] =
        [newSlides[swapIndex], newSlides[currentIndex]];

      newSlides.forEach((slide, index) => {
        slide.display_order = index;
      });

      setSlides(newSlides);
      validateOrders(newSlides);
      toast.dismiss(reorderToast);
    } catch (error: any) {
      console.error('❌ Swap error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to move slide', { id: reorderToast });
      fetchSlides();
    }
  };

  const getImageDisplayUrl = (url: string) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/uploads/')) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }

    if (url && !url.includes('://') && url.trim() !== '') {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}/uploads/home/${url}`;
    }

    return url;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
    setSelectedFile(null);
    setImagePreview('');
    setActiveTab('upload');
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      bg_gradient: 'from-[#0b3a66]/95 via-[#0b3a66]/70 to-[#00c6ff]/20',
      display_order: slides.length + 1,
      is_active: true
    });

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const getModalImagePreview = () => {
    if (activeTab === 'url') {
      return formData.image_url;
    } else if (activeTab === 'upload') {
      if (imagePreview) {
        return imagePreview;
      } else if (formData.image_url) {
        return formData.image_url;
      }
    }
    return '';
  };

  useEffect(() => {
    if (!editingSlide) {
      setFormData(prev => ({
        ...prev,
        display_order: slides.length + 1
      }));
    }
  }, [slides.length, editingSlide]);

  // Filter slides based on search and status
  const filteredSlides = slides.filter(slide => {
    const matchesSearch = slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && slide.is_active) ||
      (statusFilter === 'inactive' && !slide.is_active);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSlides = filteredSlides.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate stats
  const totalSlides = slides.length;
  const activeSlides = slides.filter(s => s.is_active).length;
  const inactiveSlides = slides.filter(s => !s.is_active).length;

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedSlides.length === currentSlides.length) {
      setSelectedSlides([]);
    } else {
      setSelectedSlides(currentSlides.map(slide => slide.id));
    }
  };

  const handleSelectSlide = (id: number) => {
    if (selectedSlides.includes(id)) {
      setSelectedSlides(selectedSlides.filter(slideId => slideId !== id));
    } else {
      setSelectedSlides([...selectedSlides, id]);
    }
  };
  const handleDisplayOrderChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      display_order: Math.max(1, value) // Minimum order is 1
    }));
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
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
      {/* Main Container */}
      <div className="bg-transparent font-sans flex flex-col flex-1 min-h-0">


        {/* Stats Cards - Compressed & High Density & Glassmorphic */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-100/80 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Slides</p>
            <p className="text-base font-extrabold text-blue-600 mt-1">{totalSlides}</p>
          </div>
          <div className="bg-emerald-100/50 border-emerald-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active</p>
            <p className="text-base font-extrabold text-emerald-600 mt-1">{activeSlides}</p>
          </div>
          <div className="bg-gray-200/70 border-gray-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inactive</p>
            <p className="text-base font-extrabold text-slate-600 mt-1">{inactiveSlides}</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-sm text-xs font-semibold flex cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Slide</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search slides..."
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
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
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
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar - Hide when sidebar is open on mobile */}
        {selectedSlides.length > 0 && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedSlides.length} selected
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
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition mt-1 sm:mt-0 cursor-pointer font-bold"
              >
                Delete ({selectedSlides.length})
              </button>
            </div>
          </div>
        )}

        {/* Grid View for Mobile - Hide when sidebar is open */}
        {viewMode === 'grid' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className=" sm:hidden grid grid-cols-1 gap-3 mb-4">
            {currentSlides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSlides.includes(slide.id)}
                      onChange={() => handleSelectSlide(slide.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleReorder(slide.id, 'up')}
                        disabled={slide.display_order === 0}
                        className="p-0.5 text-gray-500"
                      >
                        <MoveUp size={12} />
                      </button>
                      <span className="text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                        {slide.display_order + 1}
                      </span>
                      <button
                        onClick={() => handleReorder(slide.id, 'down')}
                        disabled={slide.display_order === slides.length - 1}
                        className="p-0.5 text-gray-500"
                      >
                        <MoveDown size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className={`px-2 py-0.5 rounded-full text-xs ${slide.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                  {slide.image_url ? (
                    <img
                      src={getImageDisplayUrl(slide.image_url)}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{slide.title || '—'}</h3>
                  <p className="text-xs text-gray-600 truncate">{slide.subtitle || '—'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(slide.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {orderErrors[slide.id] && (
                    <span className="text-[10px] text-red-500 text-right">
                      {orderErrors[slide.id]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View - Hide when sidebar is open on mobile */}
        {viewMode === 'table' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
            {currentSlides.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-600 text-sm sm:text-lg">No slides found</p>
                {searchTerm || statusFilter !== 'all' ? (
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 sm:mt-4 bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 mx-auto text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add New Slide</span>
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
                              checked={selectedSlides.length === currentSlides.length && currentSlides.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                          Order
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                          Preview
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                          Title
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell w-48 border-r border-b border-slate-300">
                          Subtitle
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                          Status
                        </th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-b border-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {currentSlides.map((slide, index) => (
                        <tr key={slide.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSlides.includes(slide.id)}
                                onChange={() => handleSelectSlide(slide.id)}
                                className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleReorder(slide.id, 'up')}
                                  disabled={index === 0}
                                  className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                  title="Move up"
                                >
                                  <MoveUp size={11} className="text-slate-600" />
                                </button>
                                <span className="font-bold text-slate-800 text-[11px] min-w-[16px] text-center">
                                  {slide.display_order + 1}
                                </span>
                                <button
                                  onClick={() => handleReorder(slide.id, 'down')}
                                  disabled={index === currentSlides.length - 1}
                                  className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                  title="Move down"
                                >
                                  <MoveDown size={11} className="text-slate-600" />
                                </button>
                              </div>
                              {orderErrors[slide.id] && (
                                <span className="text-[8px] text-red-500 text-center font-semibold">
                                  {orderErrors[slide.id]}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="w-16 h-10 rounded overflow-hidden bg-slate-100 border border-slate-200">
                              {slide.image_url ? (
                                <img
                                  src={getImageDisplayUrl(slide.image_url)}
                                  alt={slide.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                  }}
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                  <ImageIcon className="w-3 h-3 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="max-w-[120px] sm:max-w-xs">
                              <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{slide.title || '—'}</p>
                              <p className="text-slate-400 text-[9px] truncate sm:hidden leading-none mt-0.5">{slide.subtitle || '—'}</p>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 hidden sm:table-cell">
                            <div className="max-w-xs">
                              <p className="text-slate-500 text-[11px] leading-tight truncate">{slide.subtitle || '—'}</p>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <button
                              onClick={() => handleToggleActive(slide.id, slide.is_active)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${slide.is_active
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}
                            >
                              {slide.is_active ? (
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
                                onClick={() => handleEdit(slide)}
                                className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                title="Edit"
                              >
                                <Edit size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(slide.id)}
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
                {filteredSlides.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1 sm:px-4 sm:py-2">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      {/* Showing info - compact */}
                      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
                        <span className="hidden sm:inline"> to </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold text-gray-800">
                          {Math.min(indexOfLastItem, filteredSlides.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold text-gray-800">{filteredSlides.length}</span>

                        {/* Filter/Search badge - compact on mobile, full on desktop */}
                        {(searchTerm || statusFilter !== 'all') && (
                          <span className="ml-1 text-blue-600 text-[8px] sm:text-[10px]">
                            {searchTerm && (
                              <span className="hidden xs:inline">
                                🔍 "{searchTerm.slice(0, 10)}{searchTerm.length > 10 ? '…' : ''}"
                              </span>
                            )}
                            {statusFilter !== 'all' && (
                              <span className="ml-0.5">• {statusFilter === 'active' ? 'Active' : statusFilter === 'inactive' ? 'Inactive' : statusFilter}</span>
                            )}
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
                          title="Previous page"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>

                        {/* Page numbers - shows on desktop, compact on mobile */}
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
                          title="Next page"
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

        <style>{`
          @keyframes hModalBackdropIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes hModalContentIn {
            from { opacity: 0; transform: scale(0.92) translateY(18px); }
            to   { opacity: 1; transform: scale(1) translateY(0px); }
          }
          .h-modal-backdrop {
            animation: hModalBackdropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
            background: rgba(15,23,42,0.45);
            backdrop-filter: blur(4px);
          }
          .h-modal-content {
            animation: hModalContentIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
          }
        `}</style>

        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 h-modal-backdrop">
            <div className="fixed inset-0" onClick={handleCloseModal} />
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 h-modal-content">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Home className="w-3.5 h-3.5 text-[#0D47A1]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                      {editingSlide ? 'Edit Slide' : 'New Slide'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {editingSlide ? 'Modify slide properties and image' : 'Add a new hero banner slide'}
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

                  {/* Row 1: Title + Display Order */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Slide Title"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.display_order}
                        onChange={(e) => handleDisplayOrderChange(parseInt(e.target.value) || 1)}
                        required
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 2: Subtitle + Gradient */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Slide Subtitle"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">BG Gradient</label>
                      <input
                        type="text"
                        value={formData.bg_gradient}
                        onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })}
                        placeholder="from-blue-900 to-slate-900"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      placeholder="Slide description text..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none overflow-hidden"
                    />
                  </div>

                  {/* Row 4: Image + Active toggle */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Image Source <span className="text-red-500">*</span>
                      </p>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => setActiveTab('upload')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition cursor-pointer ${activeTab === 'upload' ? 'bg-[#0D47A1] text-white border-[#0D47A1]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>Upload</button>
                        <button type="button" onClick={() => setActiveTab('url')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition cursor-pointer ${activeTab === 'url' ? 'bg-[#0D47A1] text-white border-[#0D47A1]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>URL</button>
                      </div>
                    </div>

                    {activeTab === 'upload' ? (
                      <div className="flex items-center gap-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Select File
                        </button>
                        {uploadingImage && <span className="text-[10px] text-blue-600 font-bold animate-pulse">Uploading…</span>}
                        {imagePreview && (
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            <img src={imagePreview} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                    )}
                  </div>

                  {/* Active toggle + Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <label className="relative inline-flex items-center cursor-pointer gap-2">
                      <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                      <span className="text-[10px] font-bold text-slate-600">Active</span>
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleCloseModal} className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <span>{editingSlide ? 'Update Slide' : 'Create Slide'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 h-modal-backdrop">
            <div
              className="fixed inset-0"
              onClick={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); setDeleteTargetIds(null); }}
            />
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 h-modal-content">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Confirm Delete</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {deleteTargetIds ? `${deleteTargetIds.length} slide${deleteTargetIds.length === 1 ? '' : 's'} selected` : '1 slide selected'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete {deleteTargetIds ? `these ${deleteTargetIds.length} slides` : 'this slide'}? This action <span className="text-red-500 font-bold">cannot be undone</span>.
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); setDeleteTargetIds(null); }}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleteConfirmOpen(false);
                    if (deleteTargetId !== null) { await proceedDelete(deleteTargetId); }
                    else if (deleteTargetIds !== null) { await proceedBulkDelete(deleteTargetIds); }
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
    </div>
  );
};

export default HomeCMS;


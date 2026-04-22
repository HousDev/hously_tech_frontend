import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, MoveUp, MoveDown, Save, X, 
  Image as ImageIcon, Eye, EyeOff, Upload, Link as LinkIcon, 
  Search, Filter, ChevronLeft, ChevronRight, Home, Check, Menu, Grid, List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/authService';
import type { ApiResponse } from '../../types/auth.types';
import axios from 'axios';

interface Slide {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const [orderErrors, setOrderErrors] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Slide[]>>('/home/slides?active=false');
      if (response.data.success && response.data.data) {
        const sortedSlides = response.data.data.sort((a, b) => a.display_order - b.display_order);
        setSlides(sortedSlides);
        validateOrders(sortedSlides);
      }
    } catch (err) {
      toast.error('Failed to load slides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debugSlides = () => {
    console.log('🔍 DEBUG - Current slides:', slides.map(s => ({
      id: s.id,
      title: s.title,
      order: s.display_order
    })));
  };

  useEffect(() => {
    debugSlides();
  }, [slides]);

  const validateOrders = (slidesList: Slide[]) => {
    const errors: {[key: number]: string} = {};
    const orderMap: {[key: number]: number[]} = {};
    
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
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    uploadFormData.append('type', 'home');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post('http://localhost:5000/api/upload/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ Image uploaded successfully:', response.data.data.url);
        return response.data.data.url;
      }
      throw new Error('Upload failed');
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.success('Image uploaded successfully!');
      
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
      
      console.log('📤 Sending slide data:', slideData);
      
      if (editingSlide) {
        const response = await api.put(`/home/slides/${editingSlide.id}`, slideData);
        toast.success('Slide updated successfully');
      } else {
        const response = await api.post('/home/slides', slideData);
        toast.success('Slide created successfully');
      }
      
      fetchSlides();
      handleCloseModal();
    } catch (err: unknown) {
      console.error('Error saving slide:', err);
      
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', err.response?.data);
        toast.error('Failed to save slide: ' + (err.response?.data?.message || 'Unknown error'));
      } else {
        toast.error('Failed to save slide');
      }
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

const handleDelete = async (id: number) => {
  const deleteToast = toast.loading('Deleting slide...');

  try {
    await api.delete(`/home/slides/${id}`);

    setSlides(prev =>
      prev.filter(slide => slide.id !== id)
    );

    toast.success('Slide deleted successfully', {
      id: deleteToast,
    });
  } catch (error: any) {
    console.error(error);
    toast.error('Failed to delete slide', {
      id: deleteToast,
    });
  }
};



 const handleBulkDelete = async () => {
  if (selectedSlides.length === 0) {
    toast.error('Please select slides');
    return;
  }

  // 🔵 default loading toast
  const loadingToast = toast.loading(
    `Deleting ${selectedSlides.length} slide(s)...`
  );

  try {
    for (const id of selectedSlides) {
      await api.delete(`/home/slides/${id}`);
    }

    // 🟢 default success toast (same as deactivate)
    toast.success(
      `${selectedSlides.length} slide(s) deleted successfully`,
      { id: loadingToast }
    );

    setSelectedSlides([]);
    fetchSlides();
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete slides', {
      id: loadingToast,
    });
  }
};



  const handleToggleActive = async (slideId: number, currentStatus: boolean) => {
    const toggleToast = toast.loading(currentStatus ? 'Deactivating slide...' : 'Activating slide...');
    
    try {
      const response = await api.put(`/home/slides/${slideId}`, {
        is_active: !currentStatus
      });
      
      if (response.data.success) {
        setSlides(prevSlides => 
          prevSlides.map(slide => 
            slide.id === slideId 
              ? { ...slide, is_active: !currentStatus }
              : slide
          )
        );
        
        toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'} successfully`, { id: toggleToast });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle slide status', { id: toggleToast });
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (selectedSlides.length === 0) {
      toast.error('Please select slides to update');
      return;
    }

    const toggleToast = toast.loading(`${activate ? 'Activating' : 'Deactivating'} ${selectedSlides.length} slide(s)...`);
    
    try {
      // Update slides one by one
      for (const id of selectedSlides) {
        await api.put(`/home/slides/${id}`, {
          is_active: activate
        });
      }
      
      setSlides(prevSlides => 
        prevSlides.map(slide => 
          selectedSlides.includes(slide.id)
            ? { ...slide, is_active: activate }
            : slide
        )
      );
      
      toast.success(`Successfully ${activate ? 'activated' : 'deactivated'} ${selectedSlides.length} slide(s)`, { id: toggleToast });
    } catch (error: any) {
      console.error('Bulk toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update slides', { id: toggleToast });
    }
  };

  const handleReorder = async (slideId: number, direction: 'up' | 'down') => {
    const reorderToast = toast.loading('Moving slide...');
    
    try {
      console.log(`🔄 Reordering slide ${slideId} ${direction}`);
      
      const currentIndex = slides.findIndex(s => s.id === slideId);
      if (currentIndex === -1) {
        toast.error('Slide not found');
        return;
      }
      
      if (direction === 'up' && currentIndex === 0) return;
      if (direction === 'down' && currentIndex === slides.length - 1) return;
      
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const swapSlideId = slides[swapIndex].id;
      
      console.log(`🔄 Swapping slide ${slideId} with ${swapSlideId}`);
      
      const response = await api.post('/home/slides/swap', {
        slide1Id: slideId,
        slide2Id: swapSlideId
      });
      
      if (response.data.success) {
        const newSlides = [...slides];
        [newSlides[currentIndex], newSlides[swapIndex]] = 
          [newSlides[swapIndex], newSlides[currentIndex]];
        
        newSlides.forEach((slide, index) => {
          slide.display_order = index;
        });
        
        setSlides(newSlides);
        validateOrders(newSlides);
        toast.success('Slide moved successfully!', { id: reorderToast });
        
        console.log('✅ Swap successful, local state updated');
      } else {
        throw new Error(response.data.message);
      }
      
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
      const baseUrl = 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    
    if (url && !url.includes('://') && url.trim() !== '') {
      const baseUrl = 'http://localhost:5000';
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

const incrementDisplayOrder = () => {
  setFormData(prev => ({
    ...prev,
    display_order: prev.display_order + 1
  }));
};

const decrementDisplayOrder = () => {
  setFormData(prev => ({
    ...prev,
    display_order: Math.max(1, prev.display_order - 1)
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
    <div className="bg-white min-h-screen">
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
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
{/* Header - Keep it sticky but add isolation */}
<div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} 
  bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4 z-20`}> {/* Reduced z-index to 20 */}
          <div className=" bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Home Page Slides
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Manage hero slider content for your homepage
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
                      All Slides ({slides.length})
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                      Create, edit, and organize your homepage slides
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                      <Plus size={16} className="sm:size-[18px]" />
                      <span className="font-medium">Add Slide</span>
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

                {/* Compact Stats Cards - Hide on mobile, show on tablet+ */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{totalSlides}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                          {totalSlides}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">{activeSlides}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-600">{inactiveSlides}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg">
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats Summary */}
                <div className="sm:hidden grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Total</p>
                    <p className="text-base font-bold text-gray-900">{totalSlides}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Active</p>
                    <p className="text-base font-bold text-green-600">{activeSlides}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Inactive</p>
                    <p className="text-base font-bold text-gray-600">{inactiveSlides}</p>
                  </div>
                </div>

                {/* Compact Search and Filter Bar */}
                <div className="bg-white rounded  p-2 sm:p-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search slides..."
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
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
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
                onClick={handleBulkDelete}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
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
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      slide.is_active 
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
                      onClick={() => handleDelete(slide.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm sm:shadow-lg overflow-hidden">
            {currentSlides.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-lg">No slides found</p>
                {searchTerm || statusFilter !== 'all' ? (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm"
                  >
                    <Plus size={14} className="sm:size-[20px]" />
                    <span>Add New Slide</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky  z-20">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10 sm:w-12">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedSlides.length === currentSlides.length && currentSlides.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Preview
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                          Subtitle
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentSlides.map((slide, index) => (
                        <tr key={slide.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSlides.includes(slide.id)}
                                onChange={() => handleSelectSlide(slide.id)}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                  onClick={() => handleReorder(slide.id, 'up')}
                                  disabled={index === 0}
                                  className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  title="Move up"
                                >
                                  <MoveUp size={12} className="sm:size-[14px] text-gray-600" />
                                </button>
                                <span className="font-bold text-gray-900 text-xs sm:text-sm min-w-[20px] sm:min-w-[24px] text-center">
                                  {slide.display_order + 1}
                                </span>
                                <button
                                  onClick={() => handleReorder(slide.id, 'down')}
                                  disabled={index === currentSlides.length - 1}
                                  className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                  title="Move down"
                                >
                                  <MoveDown size={12} className="sm:size-[14px] text-gray-600" />
                                </button>
                              </div>
                              {orderErrors[slide.id] && (
                                <span className="text-[10px] sm:text-xs text-red-500 text-center">
                                  {orderErrors[slide.id]}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <div className="w-12 h-8 sm:w-20 sm:h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                                  <ImageIcon className="w-2 h-2 sm:w-4 sm:h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <div className="max-w-[100px] sm:max-w-xs">
                              <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{slide.title || '—'}</p>
                              <p className="text-gray-600 text-[10px] sm:text-xs truncate sm:hidden">{slide.subtitle || '—'}</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                            <div className="max-w-xs">
                              <p className="text-gray-600 text-sm">{slide.subtitle || '—'}</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <button
                              onClick={() => handleToggleActive(slide.id, slide.is_active)}
                              className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                                slide.is_active 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}
                            >
                              {slide.is_active ? (
                                <>
                                  <Eye className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                  <span className="hidden sm:inline">Active</span>
                                  <span className="sm:hidden">On</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                  <span className="hidden sm:inline">Inactive</span>
                                  <span className="sm:hidden">Off</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button
                                onClick={() => handleEdit(slide)}
                                className="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                title="Edit"
                              >
                                <Edit size={12} className="sm:size-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDelete(slide.id)}
                                className="p-1 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
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
                {filteredSlides.length > 0 && (
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="text-xs sm:text-sm text-gray-700">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold">{indexOfFirstItem + 1}</span>
                        <span className="hidden sm:inline"> to </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold">
                          {Math.min(indexOfLastItem, filteredSlides.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold">{filteredSlides.length}</span>
                        {(searchTerm || statusFilter !== 'all') && (
                          <span className="ml-1 sm:ml-2 text-blue-600 text-[10px] sm:text-xs hidden sm:inline">
                            {searchTerm && `(Search: "${searchTerm}")`}
                            {statusFilter !== 'all' && ` (Filter: ${statusFilter})`}
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

      {/* Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={20} className="sm:size-[24px]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* ROW 1: Title + Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Transform Your Business with"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Advanced IT Solutions"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* ROW 2: Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Delivering scalable software, cloud infrastructure, and intelligent IT services..."
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl resize-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                  </div>

                  {/* ROW 3: Image + Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
                    {/* Image Input */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image *
                      </label>

                      {/* Tabs */}
                      <div className="flex space-x-2 sm:space-x-4 border-b mb-2 sm:mb-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('url');
                            setSelectedFile(null);
                            setImagePreview('');
                          }}
                          className={`pb-2 text-xs sm:text-sm font-medium transition ${
                            activeTab === 'url'
                              ? 'border-b-2 border-blue-600 text-blue-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Image URL
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('upload')}
                          className={`pb-2 text-xs sm:text-sm font-medium transition ${
                            activeTab === 'upload'
                              ? 'border-b-2 border-blue-600 text-blue-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Upload Image
                        </button>
                      </div>

                      {/* URL INPUT */}
                      {activeTab === 'url' && (
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) =>
                            setFormData({ ...formData, image_url: e.target.value })
                          }
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition text-sm"
                        />
                      )}

                      {/* UPLOAD */}
                      {activeTab === 'upload' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />

                          {!selectedFile ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 text-xs sm:text-sm font-medium hover:underline"
                            >
                              Click to browse image
                            </button>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm text-gray-700 truncate">
                                {selectedFile.name}
                              </span>
                              <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={uploadingImage}
                                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 disabled:opacity-50"
                              >
                                {uploadingImage ? 'Uploading...' : 'Upload'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <div className="h-24 sm:h-32 rounded-lg sm:rounded-xl border bg-gray-100 overflow-hidden">
                        {(formData.image_url || imagePreview) && (
                          <img
                            src={getModalImagePreview()}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ROW 4: Gradient + Active */}
                  {/* ROW 4: Display Order + Gradient */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
  {/* Display Order */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Display Order *
    </label>
    <div className="relative">
      <input
        type="text"
        min="1"
        value={formData.display_order}
        onChange={(e) => handleDisplayOrderChange(parseInt(e.target.value) || 1)}
        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm text-center font-bold"
        required
      />
      {/* <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-0.5">
        <button
          type="button"
          onClick={incrementDisplayOrder}
          className="p-0.5 hover:bg-blue-50 rounded"
        >
          <ChevronUp className="w-3 h-3 text-blue-600" />
        </button>
        <button
          type="button"
          onClick={decrementDisplayOrder}
          className="p-0.5 hover:bg-blue-50 rounded"
        >
          <ChevronDown className="w-3 h-3 text-blue-600" />
        </button>
      </div> */}
    </div>
    <p className="text-xs text-gray-500 mt-1">
      Position: {formData.display_order} of {slides.length + 1}
    </p>
  </div>

  {/* Gradient */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Background Gradient
    </label>
    <input
      type="text"
      value={formData.bg_gradient}
      onChange={(e) =>
        setFormData({ ...formData, bg_gradient: e.target.value })
      }
      placeholder="from-[#0b3a66]/95 via-[#0b3a66]/70 to-[#00c6ff]/20"
      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition text-sm"
    />
  </div>
</div>

{/* ROW 5: Active Status */}
<div className="flex items-center space-x-2 sm:space-x-3 pt-2">
  <input
    type="checkbox"
    checked={formData.is_active}
    onChange={(e) =>
      setFormData({ ...formData, is_active: e.target.checked })
    }
    className="h-4 w-4 text-blue-600 rounded"
  />
  <span className="text-sm text-gray-700">
    Active Slide
  </span>
</div>
                  {/* FOOTER */}
                  <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={uploadingImage || !formData.image_url.trim()}
                      className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {editingSlide ? 'Update' : 'Create'} Slide
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCMS;
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, MoveUp, MoveDown, X, 
  Image as ImageIcon, Eye, EyeOff, 
  Search, Filter, ChevronLeft, ChevronRight, Home, Check, Grid, List} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { homeApi, type Slide } from '../../lib/homeApi';



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

  const [orderErrors, setOrderErrors] = useState<{[key: number]: string}>({});

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
  return homeApi.uploadImage(file);
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
      
      
      // REPLACE WITH:
if (editingSlide) {
  await homeApi.update(editingSlide.id, slideData);
  toast.success('Slide updated successfully');
} else {
  await homeApi.create(slideData);
  toast.success('Slide created successfully');
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

const handleDelete = async (id: number) => {
  const t = toast.loading('Deleting slide...');
  try {
    await homeApi.delete(id);
    setSlides(prev => prev.filter(s => s.id !== id));
    toast.success('Slide deleted successfully', { id: t });
  } catch {
    toast.error('Failed to delete slide', { id: t });
  }
};



const handleBulkDelete = async () => {
  if (!selectedSlides.length) { toast.error('Please select slides'); return; }
  const t = toast.loading(`Deleting ${selectedSlides.length} slide(s)...`);
  try {
    await homeApi.bulkDelete(selectedSlides);
    toast.success(`${selectedSlides.length} slide(s) deleted successfully`, { id: t });
    setSelectedSlides([]);
    fetchSlides();
  } catch {
    toast.error('Failed to delete slides', { id: t });
  }
};



  const handleToggleActive = async (slideId: number, currentStatus: boolean) => {
  const t = toast.loading(currentStatus ? 'Deactivating slide...' : 'Activating slide...');
  try {
    await homeApi.update(slideId, { is_active: !currentStatus });
    setSlides(prev =>
      prev.map(s => s.id === slideId ? { ...s, is_active: !currentStatus } : s)
    );
    toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'} successfully`, { id: t });
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
    toast.success(`Successfully ${activate ? 'activated' : 'deactivated'} ${selectedSlides.length} slide(s)`, { id: t });
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
toast.success('Slide moved successfully!', { id: reorderToast });
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
    <div className="bg-white ">
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
  bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4 z-20`}>
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Home Page Slides
          </h1>
        </div>
       <button
  onClick={() => setIsModalOpen(true)}
  className="sm:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
>
  <Plus size={16} />
  <span>Add Slide</span>
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
            <h2 className="text-sm font-semibold text-gray-800">
              Slides ({slides.length})
            </h2>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Manage hero slider</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Slide</span>
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

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-3 gap-1.5 mb-2 sm:mb-3">
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{totalSlides}</p>
            </div>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
              <p className="text-sm sm:text-base font-bold text-green-600">{activeSlides}</p>
            </div>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
              <p className="text-sm sm:text-base font-bold text-gray-600">{inactiveSlides}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded">
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search slides..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 pr-2 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded bg-white"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
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
<div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[400px] sm:max-h-[390px]">               
     <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky  top-0 z-10">
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
      </div>

      {/* Modal - Responsive */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/60"
      onClick={handleCloseModal}
    />

    {/* Center wrapper */}
    <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-[95%] sm:max-w-[500px] md:max-w-[650px] bg-white rounded-xl border border-[#E3F0FF] shadow-[0_8px_40px_rgba(13,71,161,0.18)] overflow-hidden">
        {/* ─── Header (Sticky on mobile) ─── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 sm:px-4 bg-gradient-to-r from-[#0D47A1] to-[#1976D2]">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFC107] rounded-md w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs sm:text-sm text-[#0D47A1] shrink-0">
              ly
            </div>
            <h2 className="text-white font-medium text-sm sm:text-base">
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center cursor-pointer shrink-0 hover:bg-white/20 transition"
          >
            <X size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* ─── Scrollable Body (only on mobile) ─── */}
        <div className="max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
          <div className="p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

              {/* ROW 1: Title + Subtitle - Grid format on mobile (1fr 1fr) */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3">
                <div>
                  <label className="block mb-1 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Transform Your Business with"
                    required
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-1.5 border border-[#D0DCF0] rounded-lg text-xs sm:text-sm text-[#1a1a2e] bg-[#fafbff] outline-none focus:border-[#1565C0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Advanced IT Solutions"
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-1.5 border border-[#D0DCF0] rounded-lg text-xs sm:text-sm text-[#1a1a2e] bg-[#fafbff] outline-none focus:border-[#1565C0] transition-colors"
                  />
                </div>
              </div>

              {/* ROW 2: Description - Full width */}
              <div>
                <label className="block mb-1 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Delivering scalable software, cloud infrastructure, and intelligent IT services..."
                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-1.5 border border-[#D0DCF0] rounded-lg text-xs sm:text-sm text-[#1a1a2e] bg-[#fafbff] resize-none outline-none focus:border-[#1565C0] transition-colors"
                />
              </div>

              {/* Divider */}
              <hr className="border-t border-[#E3F0FF]" />

              {/* ROW 3: Image - Grid format on mobile */}
              <div>
                <label className="block mb-1.5 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                  Image <span className="text-red-600">*</span>
                </label>
                
                {/* Tabs - Grid 2 columns on mobile */}
                <div className="grid grid-cols-2 gap-1 sm:flex sm:w-fit mb-2 border border-[#D0DCF0] rounded-lg overflow-hidden sm:gap-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('url');
                      setSelectedFile(null);
                      setImagePreview('');
                    }}
                    className={`px-2 py-1.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium cursor-pointer transition-all ${
                      activeTab === 'url' 
                        ? 'bg-[#1565C0] text-white' 
                        : 'bg-[#f4f7ff] text-[#6b7db3] hover:bg-[#e8eef8]'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`px-2 py-1.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium cursor-pointer transition-all ${
                      activeTab === 'upload' 
                        ? 'bg-[#1565C0] text-white' 
                        : 'bg-[#f4f7ff] text-[#6b7db3] hover:bg-[#e8eef8]'
                    }`}
                  >
                    Upload Image
                  </button>
                </div>

                {/* Content area with preview */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Input area */}
                  <div className="sm:col-span-2">
                    {activeTab === 'url' && (
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-2.5 py-1.5 sm:px-3 border border-[#D0DCF0] rounded-lg text-xs text-[#1a1a2e] bg-[#fafbff] outline-none focus:border-[#1565C0] transition-colors"
                      />
                    )}

                    {activeTab === 'upload' && (
                      <div className="border-2 border-dashed border-[#D0DCF0] rounded-lg p-3 text-center bg-[#fafbff] cursor-pointer hover:bg-[#f5f7ff] transition">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {!selectedFile ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-[#E3F0FF] flex items-center justify-center mx-auto mb-1.5">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2">
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                              </svg>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] text-[#1565C0] font-medium bg-none border-none cursor-pointer hover:underline"
                            >
                              Click to browse
                            </button>
                            <p className="text-[10px] text-[#8fa6cc] mt-1">
                              PNG, JPG, WebP (max 2MB)
                            </p>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <span className="text-[11px] text-[#1a1a2e] truncate">
                              {selectedFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={uploadingImage}
                              className="px-3 py-1.5 bg-[#1565C0] text-white border-none rounded-md text-[11px] cursor-pointer disabled:opacity-60 hover:bg-[#0e3e8a] transition"
                            >
                              {uploadingImage ? 'Uploading...' : 'Upload'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview - On mobile, below the input */}
                  <div className="mt-2 sm:mt-0">
                    <p className="text-[10px] font-medium text-[#0D47A1] mb-1">
                      Preview
                    </p>
                    <div className="h-[70px] sm:h-[70px] w-full rounded-lg bg-[#E3F0FF] border border-[#D0DCF0] overflow-hidden flex items-center justify-center">
                      {(formData.image_url || imagePreview) ? (
                        <img
                          src={getModalImagePreview()}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-[#8fa6cc]">No image</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-t border-[#E3F0FF]" />

              {/* ROW 4: Display Order + Gradient - Grid 2 cols on mobile */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3">
                <div>
                  <label className="block mb-1 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                    Order <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => handleDisplayOrderChange(parseInt(e.target.value) || 1)}
                    required
                    className="w-full px-2.5 py-1.5 sm:px-3 border border-[#D0DCF0] rounded-lg text-xs sm:text-sm font-semibold text-[#0D47A1] bg-[#fafbff] text-center outline-none focus:border-[#1565C0] transition-colors"
                  />
                  <p className="text-[9px] text-[#6b7db3] mt-1 hidden sm:block">
                    Position: {formData.display_order} of {slides.length + 1}
                  </p>
                </div>
                <div>
                  <label className="block mb-1 text-[11px] sm:text-xs font-medium text-[#0D47A1]">
                    Background
                  </label>
                  <input
                    type="text"
                    value={formData.bg_gradient}
                    onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })}
                    placeholder="Gradient class"
                    className="w-full px-2.5 py-1.5 sm:px-3 border border-[#D0DCF0] rounded-lg text-[10px] sm:text-[11px] text-[#1a1a2e] bg-[#fafbff] outline-none focus:border-[#1565C0] transition-colors"
                  />
                </div>
              </div>
              
              {/* Mobile only: Position info */}
              <p className="text-[9px] text-[#6b7db3] mt-0 sm:hidden">
                Position: {formData.display_order} of {slides.length + 1}
              </p>

              {/* ROW 5: Active toggle - Full width */}
              <div className="flex items-center gap-2 px-2 py-2 sm:px-3 bg-[#E3F0FF] rounded-lg border border-[#b8d0f0]">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-[#1565C0] cursor-pointer shrink-0"
                />
                <label
                  htmlFor="is_active"
                  className="flex flex-wrap items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs font-medium text-[#0D47A1]"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${formData.is_active ? 'bg-[#27ae60]' : 'bg-gray-400'} transition-colors shrink-0`} />
                  Active Slide
                  {formData.is_active && (
                    <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-[#FFFDE7] text-[#F9A825] border border-[#ffe082] whitespace-nowrap">
                      Visible
                    </span>
                  )}
                </label>
              </div>

            </form>
          </div>
        </div>

        {/* ─── Footer (Sticky on mobile) ─── */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#f6f9ff] border-t border-[#E3F0FF] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:shadow-none">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg border border-[#D0DCF0] bg-white text-gray-600 text-[11px] sm:text-xs font-medium cursor-pointer hover:bg-gray-50 transition flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="slide-form"
            onClick={handleSubmit}
            disabled={uploadingImage || !formData.image_url.trim()}
            className="px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg border-none bg-[#1565C0] text-white text-[11px] sm:text-xs font-medium cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50 hover:bg-[#0e3e8a] transition flex-1 sm:flex-none"
          >
            <svg width="11" height="11" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {editingSlide ? 'Update' : 'Create'} Slide
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default HomeCMS;
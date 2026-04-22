import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, 
  Save, X, Upload, Image as ImageIcon, Star, User, 
  Briefcase, MessageSquare, GripVertical, Search, Filter,
  ChevronLeft, ChevronRight, AlertCircle, Check,
  Calendar, Award, ThumbsUp, Users, Grid, List, Home,
  CheckSquare, Square
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  rating: number;
  text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/testimonials?active=false`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        let filtered = response.data.data;
        
        if (searchTerm) {
          filtered = filtered.filter((t: Testimonial) => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.text.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (activeFilter === 'active') {
          filtered = filtered.filter((t: Testimonial) => t.is_active);
        } else if (activeFilter === 'inactive') {
          filtered = filtered.filter((t: Testimonial) => !t.is_active);
        }
        
        filtered.sort((a: Testimonial, b: Testimonial) => a.display_order - b.display_order);
        setTestimonials(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      alert('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    console.log('📤 Uploading image to server:', file.name);
    
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/upload/testimonial-image`, 
        uploadFormData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const imagePath = response.data.data.path;
        console.log('   Image saved at path:', imagePath);
        return imagePath;
      }
      
      throw new Error('Upload failed: ' + (response.data.message || 'Unknown error'));
    } catch (error: any) {
      console.error('❌ Upload error details:', error);
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
      alert('Please select a valid image file (PNG, JPG, JPEG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file first');
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedPath = await uploadImageToServer(selectedFile);
      
      setFormData({ ...formData, image_url: uploadedPath });
      alert('Image uploaded successfully!');
      
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const getImageDisplayUrl = (url: string) => {
    if (!url) {
      return '';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('/uploads/')) {
      const baseUrl = API_BASE_URL.replace('/api', '');
      return `${baseUrl}${url}`;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/uploads/testimonials/${url}`;
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

    if (!validateForm()) {
      return;
    }

    if (selectedFile && !formData.image_url) {
      alert('Please upload the selected image first');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        rating: Number(formData.rating),
        display_order: Number(formData.display_order) || testimonials.length + 1,
        image_url: formData.image_url
      };

      let response;
      if (editingTestimonial) {
        response = await axios.put(
          `${API_BASE_URL}/testimonials/${editingTestimonial.id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/testimonials`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.success) {
        alert(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
        fetchTestimonials();
        handleCloseModal();
      } else {
        alert(response.data.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      alert(error.response?.data?.message || 'Failed to save testimonial');
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
  const deleteToast = toast.loading('Deleting testimonial...');

  try {
    const token = localStorage.getItem('token');

    const response = await axios.delete(
      `${API_BASE_URL}/testimonials/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success('Testimonial deleted successfully!', {
        id: deleteToast,
      });
      fetchTestimonials();
    } else {
      toast.error(response.data.message || 'Failed to delete testimonial', {
        id: deleteToast,
      });
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || 'Failed to delete testimonial',
      { id: deleteToast }
    );
  }
};


 const handleBulkDelete = async () => {
  if (selectedTestimonials.length === 0) {
    toast.error('Please select testimonials to delete');
    return;
  }

  const deleteToast = toast.loading(
    `Deleting ${selectedTestimonials.length} testimonial(s)...`
  );

  try {
    const token = localStorage.getItem('token');

    await Promise.all(
      selectedTestimonials.map((id) =>
        axios.delete(`${API_BASE_URL}/testimonials/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );

    toast.success(
      `Successfully deleted ${selectedTestimonials.length} testimonial(s)`,
      { id: deleteToast }
    );

    setSelectedTestimonials([]);
    fetchTestimonials();
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || 'Failed to delete testimonials',
      { id: deleteToast }
    );
  }
};


  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/testimonials/${id}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchTestimonials();
      } else {
        alert(response.data.message || 'Failed to update testimonial status');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update testimonial status');
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (selectedTestimonials.length === 0) {
      alert('Please select testimonials to update');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      for (const id of selectedTestimonials) {
        await axios.put(
          `${API_BASE_URL}/testimonials/${id}/toggle-active`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      alert(`Successfully ${activate ? 'activated' : 'deactivated'} ${selectedTestimonials.length} testimonial(s)`);
      fetchTestimonials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update testimonials');
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    try {
      const currentIndex = testimonials.findIndex(t => t.id === id);
      if (currentIndex === -1) return;

      if (direction === 'up' && currentIndex === 0) return;
      if (direction === 'down' && currentIndex === testimonials.length - 1) return;

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const swapId = testimonials[swapIndex].id;

      const newTestimonials = [...testimonials];
      [newTestimonials[currentIndex], newTestimonials[swapIndex]] = 
        [newTestimonials[swapIndex], newTestimonials[currentIndex]];

      newTestimonials.forEach((testimonial, index) => {
        testimonial.display_order = index;
      });

      const orders = newTestimonials.map((t, index) => ({
        id: t.id,
        display_order: index
      }));

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/testimonials/reorder`,
        { orders },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setTestimonials(newTestimonials);
        alert('Testimonials reordered successfully!');
      } else {
        alert(response.data.message || 'Failed to reorder testimonials');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reorder testimonials');
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
    <div className="bg-white min-h-screen">
      {/* Main Container */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
        <div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
          {/* Blue Title Section */}
          <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Testimonials Management
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Manage client testimonials and reviews for your website
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
                      All Testimonials ({testimonials.length})
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                      Create, edit, and organize client testimonials
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="hidden sm:flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                      <Plus size={16} className="sm:size-[18px]" />
                      <span className="font-medium">Add Testimonial</span>
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
                        <p className="text-lg sm:text-xl font-bold text-[#0076d8]">{totalTestimonials}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0076d8]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">{activeTestimonials}</p>
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
                        <p className="text-lg sm:text-xl font-bold text-red-600">{inactiveTestimonials}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-red-100 rounded-lg">
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Avg Rating</p>
                        <p className="text-lg sm:text-xl font-bold text-yellow-600">{avgRating}</p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-yellow-100 rounded-lg">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats Summary */}
                <div className="sm:hidden grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Total</p>
                    <p className="text-base font-bold text-[#0076d8]">{totalTestimonials}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Active</p>
                    <p className="text-base font-bold text-green-600">{activeTestimonials}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Inactive</p>
                    <p className="text-base font-bold text-red-600">{inactiveTestimonials}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Rating</p>
                    <p className="text-base font-bold text-yellow-600">{avgRating}</p>
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
                          placeholder="Search testimonials..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076d8] focus:border-[#0076d8] text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                        <select
                          value={activeFilter}
                          onChange={(e) => {
                            setActiveFilter(e.target.value as any);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white text-xs sm:text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active Only</option>
                          <option value="inactive">Inactive Only</option>
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
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white text-xs sm:text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
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
                        src={getImageDisplayUrl(testimonial.image_url)}
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
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)]">
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
                      {currentTestimonials.map((testimonial, index) => (
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
                                  <img
                                    src={getImageDisplayUrl(testimonial.image_url)}
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
                  <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 sm:px-4 py-2 sm:py-3 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="text-xs sm:text-sm text-gray-700">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold">{indexOfFirstItem + 1}</span>
                        <span className="hidden sm:inline"> to </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold">
                          {Math.min(indexOfLastItem, filteredTestimonials.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold">{filteredTestimonials.length}</span>
                        {(searchTerm || activeFilter !== 'all') && (
                          <span className="ml-1 sm:ml-2 text-[#0076d8] text-[10px] sm:text-xs hidden sm:inline">
                            {searchTerm && `(Search: "${searchTerm}")`}
                            {activeFilter !== 'all' && ` (Filter: ${activeFilter})`}
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
                                    ? 'bg-[#0076d8] text-white shadow-sm'
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

      {/* Add/Edit Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={20} className="sm:size-[24px]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* ROW 1: Name + Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#0076d8] focus:border-[#0076d8] transition text-sm"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position/Role *
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="CEO, Tech Solutions Inc."
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#0076d8] focus:border-[#0076d8] transition text-sm"
                      />
                      {errors.position && (
                        <p className="mt-1 text-xs text-red-600">{errors.position}</p>
                      )}
                    </div>
                  </div>

                  {/* ROW 2: Rating + Active */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating *
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            className={`p-2 rounded-lg ${
                              formData.rating >= rating
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <Star size={16} className={formData.rating >= rating ? 'fill-current' : ''} />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
                      </div>
                      {errors.rating && (
                        <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
                      )}
                    </div>

                    <div className="flex items-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({ ...formData, is_active: e.target.checked })
                        }
                        className="h-4 w-4 text-[#0076d8] rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Active Testimonial
                      </span>
                    </div>
                  </div>

                  {/* ROW 3: Testimonial Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial Text *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      placeholder="Share your experience with our services..."
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl resize-none focus:ring-2 focus:ring-[#0076d8] transition text-sm"
                    />
                    {errors.text && (
                      <p className="mt-1 text-xs text-red-600">{errors.text}</p>
                    )}
                  </div>

                  {/* ROW 4: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Image
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {!selectedFile ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[#0076d8] text-sm font-medium hover:underline"
                          >
                            Click to browse image
                          </button>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF, WEBP up to 5MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 truncate max-w-[70%]">
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                            className="px-3 py-1.5 bg-[#0076d8] text-white rounded-lg text-sm
                                       hover:bg-[#0066c0] disabled:opacity-50"
                          >
                            {uploadingImage ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Current image preview */}
                    {formData.image_url && !selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Current Image:
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gray-200">
                            <img
                              src={getImageDisplayUrl(formData.image_url)}
                              alt="Current"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 text-gray-700
                                 hover:bg-gray-50 transition text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={uploading || uploadingImage}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#0076d8] text-white text-sm
                                 hover:bg-[#0066c0] transition disabled:opacity-50"
                    >
                      {uploading ? 'Saving...' : (editingTestimonial ? 'Update' : 'Create')} Testimonial
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

export default TestimonialsCMS;
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, MoveUp, MoveDown, Save, X, 
  Eye, EyeOff, Search, Filter, Upload, 
  ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Check, Grid, List,
  Server
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { servicesApi, type Service } from '../../lib/servicesApi';


// Import ALL Lucide icons dynamically
import * as LucideIcons from 'lucide-react';




// Get all Lucide icon names from the library
const allLucideIcons = Object.keys(LucideIcons).filter(
  key => key !== 'default' && key !== 'createLucideIcon'
);

// Popular icons for quick selection
const popularIcons = [
  'Code', 'Cloud', 'Laptop', 'Palette', 'UserCircle', 'Shield', 'TrendingUp', 'Smartphone',
  'Server', 'Database', 'Lock', 'Globe', 'MessageCircle', 'Mail', 'Phone', 'Users',
  'Briefcase', 'Target', 'Rocket', 'Zap', 'Heart', 'Star', 'ThumbsUp', 'Award'
];

const ServicesCMS = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    icon_type: 'lucide' as 'lucide' | 'custom',
    icon_name: 'Code',
    icon_url: '',
    display_order: 0,
    is_featured: false,
    is_active: true,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

 const fetchServices = async () => {
  try {
    setLoading(true);
    const data = await servicesApi.getAll();
    setServices([...data].sort((a, b) => a.display_order - b.display_order));
  } catch (err) {
    toast.error('Failed to load services');
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    if (formData.short_description.trim().length < 20) {
      toast.error('Short description must be at least 20 characters');
      return;
    }

    if (formData.full_description.trim().length < 50) {
      toast.error('Full description must be at least 50 characters');
      return;
    }

    try {
      const serviceData: any = {
        title: formData.title,
        short_description: formData.short_description,
        full_description: formData.full_description,
        icon_type: formData.icon_type,
        display_order: formData.display_order,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (formData.icon_type === 'lucide') {
        serviceData.icon_name = formData.icon_name || 'Code';
        serviceData.icon_url = null;
      } else {
        serviceData.icon_name = null;
        serviceData.icon_url = formData.icon_url || null;
      }

      if (!editingService) {
        serviceData.slug = formData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }

     if (editingService) {
  await servicesApi.update(editingService.id, serviceData);
  toast.success('Service updated successfully!');
} else {
  await servicesApi.create(serviceData);
  toast.success('Service created successfully!');
}
      
      fetchServices();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving service:', err.response?.data);
      
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map((error: any) => error.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to save service');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      short_description: service.short_description,
      full_description: service.full_description,
      icon_type: service.icon_type,
      icon_name: service.icon_name || 'Code',
      icon_url: service.icon_url || '',
      display_order: service.display_order,
      is_featured: service.is_featured,
      is_active: service.is_active,
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || ''
    });
    setIsModalOpen(true);
  };

const handleDelete = async (id: number) => {
  const deleteToast = toast.loading('Deleting service...');

  try {
await servicesApi.delete(id);

    // 🟢 default green success toast
    toast.success('Service deleted successfully', {
      id: deleteToast,
    });

    fetchServices();
    setSelectedServices(prev =>
      prev.filter(serviceId => serviceId !== id)
    );
  } catch (err) {
    toast.error('Failed to delete service', {
      id: deleteToast,
    });
  }
};



 const handleBulkDelete = async () => {
  if (selectedServices.length === 0) {
    toast.error('Please select services to delete');
    return;
  }

  const deleteToast = toast.loading(
    `Deleting ${selectedServices.length} service(s)...`
  );

  try {
    await servicesApi.bulkDelete(selectedServices);

    toast.success(
      `Successfully deleted ${selectedServices.length} service(s)`,
      { id: deleteToast }
    );

    setSelectedServices([]);
    fetchServices();
  } catch (err) {
    toast.error('Failed to delete services', {
      id: deleteToast,
    });
  }
};


 const handleReorder = async (index: number, direction: 'up' | 'down') => {
  const service = services[index];
  const reorderToast = toast.loading('Moving service...');
  
  try {
    const swapData = await servicesApi.simpleSwap(service.id, direction);
    
    const newServices = [...services];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newServices[index], newServices[swapIndex]] = 
      [newServices[swapIndex], newServices[index]];
    
    newServices[index].display_order = swapData.currentOrder;
    newServices[swapIndex].display_order = swapData.swapOrder;
    
    setServices([...newServices].sort((a, b) => a.display_order - b.display_order));
    toast.success('Service moved successfully!', { id: reorderToast });
  } catch (error: any) {
    toast.error(error?.message || 'Failed to move service', { id: reorderToast });
    fetchServices();
  }
};

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    const toggleToast = toast.loading(currentStatus ? 'Deactivating service...' : 'Activating service...');
    
    try {
      const service = services.find(s => s.id === id);
      if (!service) return;


await servicesApi.update(id, { is_active: !currentStatus });
      
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));

      
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`, { id: toggleToast });
    } catch (err) {
      toast.error('Failed to update service status', { id: toggleToast });
      fetchServices();
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (selectedServices.length === 0) {
      toast.error('Please select services to update');
      return;
    }

    const toggleToast = toast.loading(`${activate ? 'Activating' : 'Deactivating'} ${selectedServices.length} service(s)...`);
    
    try {
     await servicesApi.bulkToggleActive(selectedServices, activate, services);

      
      setServices(prev => prev.map(service => 
        selectedServices.includes(service.id)
          ? { ...service, is_active: activate }
          : service
      ));
      
      toast.success(`Successfully ${activate ? 'activated' : 'deactivated'} ${selectedServices.length} service(s)`, { id: toggleToast });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update services', { id: toggleToast });
    }
  };

 const handleIconUpload = async (file: File) => {
  setUploading(true);
  
  try {
    const iconPath = await servicesApi.uploadIcon(file);
    
    setFormData(prev => ({
      ...prev,
      icon_type: 'custom',
      icon_url: iconPath
    }));
    
    toast.success('Icon uploaded successfully!');
  } catch (err: any) {
    toast.error(err?.message || 'Failed to upload icon');
  } finally {
    setUploading(false);
  }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setShowIconPicker(false);
    setIconSearch('');
    setFormData({
      title: '',
      short_description: '',
      full_description: '',
      icon_type: 'lucide',
      icon_name: 'Code',
      icon_url: '',
      display_order: 0,
      is_featured: false,
      is_active: true,
      meta_title: '',
      meta_description: ''
    });
  };

  // Get icon component function - YOUR ORIGINAL LOGIC
 const getIconComponent = (service: Service) => {
  if (service.icon_type === 'custom' && service.icon_url) {
    return (
      <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <img 
          src={service.icon_url} 
          alt={service.title}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
    );
  }
                                                                                                  
  const iconName = service.icon_name || 'Code';
  // ✅ FIX: Filter out non-component exports properly
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (IconComponent && typeof IconComponent === 'function' && iconName !== 'default' && iconName !== 'createLucideIcon') {
    return (
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <IconComponent className="w-5 h-5 text-blue-600" />
      </div>
    );
  }
  
  // Fallback
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
      <LucideIcons.Code className="w-5 h-5 text-blue-600" />
    </div>
  );
};

  // Filter and pagination logic
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && service.is_active) ||
      (statusFilter === 'inactive' && !service.is_active);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedServices.length === currentServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(currentServices.map(service => service.id));
    }
  };

  const handleSelectService = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
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

  // Stats
  const totalServices = services.length;
  const activeServices = services.filter(s => s.is_active).length;
  const inactiveServices = services.filter(s => !s.is_active).length;

  // Filter icons for search
  const filteredIcons = allLucideIcons.filter(iconName => 
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  ).slice(0, 50);

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
      <div className="">
        {/* Header */}
        <div className="sticky top-16 z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4">
          {/* Blue Title Section */}
          <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <Server className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Services Management
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Manage IT services, icons, and descriptions
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

          {/* White Content Section */}
          <div className="bg-white rounded-b-lg sm:rounded-b-xl">
            <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
              {/* Header with Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    All Services ({services.length})
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                    Create, edit, and organize services
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center"
                  >
                    <Plus size={16} className="sm:size-[18px]" />
                    <span className="font-medium">Add Service</span>
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
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{totalServices}</p>
                    </div>
                    <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                        {totalServices}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                      <p className="text-lg sm:text-xl font-bold text-green-600">{activeServices}</p>
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
                      <p className="text-lg sm:text-xl font-bold text-gray-600">{inactiveServices}</p>
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
                  <p className="text-base font-bold text-gray-900">{totalServices}</p>
                </div>
                <div className="bg-white rounded border border-gray-200 p-2 text-center">
                  <p className="text-[10px] text-gray-500">Active</p>
                  <p className="text-base font-bold text-green-600">{activeServices}</p>
                </div>
                <div className="bg-white rounded border border-gray-200 p-2 text-center">
                  <p className="text-[10px] text-gray-500">Inactive</p>
                  <p className="text-base font-bold text-gray-600">{inactiveServices}</p>
                </div>
              </div>

              {/* Compact Search and Filter Bar */}
              <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search services..."
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedServices.length > 0 && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedServices.length} selected
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
                Delete ({selectedServices.length})
              </button>
            </div>
          </div>
        )}

        {/* Table View - Main View */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm sm:shadow-lg overflow-hidden">
  {currentServices.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <Server className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-lg">No services found</p>
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
                  <span>Add New Service</span>
                </button>
              )}
            </div>
          ) : (
            <>
 <div className="max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-350px)] overflow-auto">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-full">                <table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10 sm:w-12">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServices.length === currentServices.length && currentServices.length > 0}
                            onChange={handleSelectAll}
                            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                        Order
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Icon
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                        Description
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentServices.map((service, index) => (
                      <tr key={service.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleSelectService(service.id)}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center space-x-1 sm:space-x-2 justify-center">
                            <button
                              onClick={() => handleReorder(index, 'up')}
                              disabled={service.display_order === 0}
                              className="p-0.5 sm:p-1 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Move up"
                            >
                              <MoveUp size={12} className="sm:size-[14px] text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 text-xs sm:text-sm min-w-[20px] text-center">
                              {service.display_order}
                            </span>
                            <button
                              onClick={() => handleReorder(index, 'down')}
                              disabled={service.display_order === services.length - 1}
                              className="p-0.5 sm:p-1 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Move down"
                            >
                              <MoveDown size={12} className="sm:size-[14px] text-gray-600" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="flex flex-col items-center">
                            {getIconComponent(service)}
                            <span className="text-[10px] text-gray-500 mt-1 truncate max-w-[60px]">
                              {service.icon_name || 'Custom'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="max-w-[120px] sm:max-w-xs">
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{service.title}</p>
                            <p className="text-gray-600 text-[10px] sm:text-xs truncate sm:hidden">{service.short_description}</p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                          <div className="max-w-xs">
                            <p className="text-gray-600 text-sm line-clamp-2">{service.short_description}</p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <button
                            onClick={() => handleToggleActive(service.id, service.is_active)}
                            className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                              service.is_active 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {service.is_active ? (
                              <>
                                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">Active</span>
                                <span className="sm:hidden">On</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">Inactive</span>
                                <span className="sm:hidden">Off</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                              title="Edit"
                            >
                              <Edit size={12} className="sm:size-[18px]" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
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
              </div>

              {/* Pagination Controls */}
              {filteredServices.length > 0 && (
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4 z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="text-xs sm:text-sm text-gray-700">
                      <span className="hidden sm:inline">Showing </span>
                      <span className="font-semibold">{indexOfFirstItem + 1}</span>
                      <span className="hidden sm:inline"> to </span>
                      <span className="sm:hidden">-</span>
                      <span className="font-semibold">
                        {Math.min(indexOfLastItem, filteredServices.length)}
                      </span>
                      <span className="hidden sm:inline"> of </span>
                      <span className="sm:hidden">/</span>
                      <span className="font-semibold">{filteredServices.length}</span>
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
      </div>

      {/* Modal - YOUR ORIGINAL FORM DESIGN */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
    <div className="flex min-h-full items-center justify-center p-3">
      <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'New Service'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {editingService ? 'Update service details' : 'Add a new service to your portfolio'}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
   

        <form
  onSubmit={handleSubmit}
  className="p-4 bg-white rounded-xl shadow-md space-y-4 max-w-3xl mx-auto"
>
  {/* Title & Display Order */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Service Title *
        <span className="ml-2 text-gray-400">{formData.title.length}/255</span>
      </label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        maxLength={255}
        required
        placeholder="e.g., Web Development"
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {formData.title.length < 3 && (
        <p className="text-xs text-red-500 mt-1">Minimum 3 characters required</p>
      )}
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Display Order
      </label>
      <input
        type="text"
        value={formData.display_order}
        onChange={(e) =>
          setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
        }
        min={0}
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>

  {/* Descriptions */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Short Description *
        <span className="ml-1 text-gray-400">{formData.short_description.length}/500</span>
      </label>
      <textarea
        value={formData.short_description}
        onChange={(e) =>
          setFormData({ ...formData, short_description: e.target.value })
        }
        rows={3}
        maxLength={500}
        placeholder="Brief description for cards"
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      {formData.short_description.length < 20 && (
        <p className="text-xs text-red-500 mt-1">Minimum 20 characters required</p>
      )}
    </div>

    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Full Description *
        <span className="ml-1 text-gray-400">{formData.full_description.length} chars</span>
      </label>
      <textarea
        value={formData.full_description}
        onChange={(e) =>
          setFormData({ ...formData, full_description: e.target.value })
        }
        rows={3}
        placeholder="Detailed service description"
        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      {formData.full_description.length < 50 && (
        <p className="text-xs text-red-500 mt-1">Minimum 50 characters required</p>
      )}
    </div>
  </div>

  {/* Icon Selection */}
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-2">
      Service Icon
    </label>
    
    <div className="space-y-3">
      {/* Icon Type Selection */}
      <div className="flex gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="lucide"
            checked={formData.icon_type === 'lucide'}
            onChange={() => {
              setFormData({...formData, icon_type: 'lucide', icon_url: ''});
              setShowIconPicker(true);
            }}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-xs font-medium">Lucide Icon</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="custom"
            checked={formData.icon_type === 'custom'}
            onChange={() => setFormData({...formData, icon_type: 'custom'})}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-xs font-medium">Custom Icon</span>
        </label>
      </div>

      {/* Lucide Icon Picker */}
      {formData.icon_type === 'lucide' && (
        <div>
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {formData.icon_name && (
                  <div className="p-1.5 bg-blue-50 rounded">
{(() => {
  const Icon = (LucideIcons as any)[formData.icon_name];
  return Icon && typeof Icon === 'function' 
    ? <Icon className="w-4 h-4 text-blue-600" />
    : <LucideIcons.Code className="w-4 h-4 text-blue-600" />;
})()}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-medium text-gray-900">
                    {formData.icon_name || 'Select an icon'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {allLucideIcons.length} icons available
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showIconPicker && (
            <div className="border border-gray-200 rounded-lg p-3 max-h-72 overflow-y-auto bg-gray-50">
              {/* Search */}
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search icons..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Popular Icons */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Popular</h4>
                <div className="grid grid-cols-6 gap-2">
                  {popularIcons.map(iconName => {
                    const Icon = (LucideIcons as any)[iconName];
                    if (!Icon) return null;
                    
                    return (
                      <button
                        type="button"
                        key={iconName}
                        onClick={() => {
                          setFormData({...formData, icon_name: iconName});
                          setShowIconPicker(false);
                        }}
                        className={`p-2 rounded border flex flex-col items-center justify-center transition-all ${
                          formData.icon_name === iconName
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-white bg-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-xs truncate w-full text-center">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Icons */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">All ({filteredIcons.length})</h4>
                <div className="grid grid-cols-10 gap-1.5">
                  {filteredIcons.map(iconName => {
                    const Icon = (LucideIcons as any)[iconName];
                    if (!Icon) return null;
                    
                    return (
                      <button
                        type="button"
                        key={iconName}
                        onClick={() => {
                          setFormData({...formData, icon_name: iconName});
                          setShowIconPicker(false);
                        }}
                        className={`p-1.5 rounded border flex items-center justify-center transition ${
                          formData.icon_name === iconName
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-white bg-white'
                        }`}
                        title={iconName}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Icon Upload */}
      {formData.icon_type === 'custom' && (
        <div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors">
            <div className="flex flex-col items-center space-y-3">
              {formData.icon_url ? (
                <>
                  <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img 
                      src={formData.icon_url} 
                      alt="Uploaded icon"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {formData.icon_url.split('/').pop()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, icon_url: ''})}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove Icon
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                    <Upload className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900 mb-1">
                      Upload Custom Icon
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      PNG, JPG, SVG, WebP up to 5MB
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleIconUpload(file);
                        }}
                        disabled={uploading}
                      />
                      <div className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Recommended: 512×512px or SVG
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Status & SEO */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {/* Status */}
    <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50">
      <div className="flex items-center gap-2">
        <Eye className={`w-4 h-4 ${formData.is_active ? 'text-green-500' : 'text-gray-400'}`} />
        <div>
          <div className="text-xs font-medium">Active Service</div>
          <div className="text-xs text-gray-500">Visible to visitors</div>
        </div>
      </div>
      <input
        type="checkbox"
        checked={formData.is_active}
        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        className="h-4 w-4 text-blue-600 rounded"
      />
    </div>

    {/* SEO */}
    <div className="space-y-2">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Meta Title
          <span className="ml-1 text-gray-400">{formData.meta_title.length}/255</span>
        </label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          maxLength={255}
          placeholder="SEO title"
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Meta Description
          <span className="ml-1 text-gray-400">{formData.meta_description.length}/500</span>
        </label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          rows={2}
          maxLength={500}
          placeholder="SEO description"
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  </div>

  {/* Form Actions */}
  <div className="flex justify-end space-x-3 pt-4 border-t">
    <button
      type="button"
      onClick={handleCloseModal}
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={
        formData.title.length < 3 ||
        formData.short_description.length < 20 ||
        formData.full_description.length < 50
      }
    >
      <Save size={16} />
      <span>{editingService ? 'Update Service' : 'Create Service'}</span>
    </button>
  </div>
</form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesCMS;
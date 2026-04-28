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
    <div className="bg-white">
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
     <div className="sticky top-16 z-10 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4">
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Services Management
          </h1>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="sm:hidden flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-2 rounded-md items-center gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
      </div>
    </div>
  </div>

  {/* White Content Section */}
  <div className="bg-white rounded-b-lg sm:rounded-b-xl">
    <div className="px-2 py-2 sm:px-3 sm:py-2.5">
      {/* Header with Actions */}
      <div className="flex flex-row justify-between items-center gap-1.5 mb-2 sm:mb-2.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
            Services ({services.length})
          </h2>
          <span className="text-[11px] text-gray-500 hidden sm:inline">Manage IT services</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Add Service</span>
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
            <p className="text-sm sm:text-base font-bold text-gray-900">{totalServices}</p>
          </div>
        </div>
        <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
            <p className="text-sm sm:text-base font-bold text-green-600">{activeServices}</p>
          </div>
        </div>
        <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
            <p className="text-sm sm:text-base font-bold text-gray-600">{inactiveServices}</p>
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
                placeholder="Search services..."
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
 <div className="max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-350px)] overflow-auto">
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
  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {/* Left side - Showing info compact */}
      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
        <span className="hidden sm:inline">Showing </span>
        <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
        <span className="hidden sm:inline"> - </span>
        <span className="sm:hidden">-</span>
        <span className="font-semibold text-gray-800">
          {Math.min(indexOfLastItem, filteredServices.length)}
        </span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-gray-800">{filteredServices.length}</span>
        
        {/* Filter/Search indicator */}
        {(searchTerm || statusFilter !== 'all') && (
          <span className="ml-1 text-blue-600 text-[8px] sm:text-[10px] hidden sm:inline">
            {searchTerm && `🔍 "${searchTerm.slice(0, 10)}${searchTerm.length > 10 ? '…' : ''}"`}
            {statusFilter !== 'all' && ` • ${statusFilter === 'active' ? 'Active' : 'Inactive'}`}
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
      </div>

      {/* Modal - YOUR ORIGINAL FORM DESIGN */}
  {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop - Black inset */}
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseModal} />
    
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-3xl shadow-lg">
        
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-lg sm:rounded-t-xl">
          <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-[#FFC107] rounded-md w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[9px] sm:text-xs text-[#0D47A1] shrink-0">
                sv
              </div>
              <div>
                <h2 className="text-white font-medium text-xs sm:text-sm">
                  {editingService ? 'Edit Service' : 'New Service'}
                </h2>
                <p className="text-white/70 text-[8px] sm:text-[10px] hidden sm:block">
                  {editingService ? 'Update service details' : 'Add a new service to your portfolio'}
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

        {/* ─── Body - No Scroll ─── */}
        <div className="p-2.5 sm:p-4">
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">

            {/* ROW 1: Title + Display Order */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Title <span className="text-red-600">*</span>
                  <span className="ml-1 text-gray-400 text-[8px]">({formData.title.length}/255)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={255}
                  required
                  placeholder="e.g., Web Development"
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-200  focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] rounded-lg"
                />
                {formData.title.length < 3 && formData.title.length > 0 && (
                  <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">Min 3 chars</p>
                )}
              </div>

              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] text-center"
                />
              </div>
            </div>

            {/* ROW 2: Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Short Desc <span className="text-red-600">*</span>
                  <span className="ml-1 text-gray-400 text-[8px]">({formData.short_description.length}/500)</span>
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                  maxLength={500}
                  placeholder="Brief description for cards"
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                />
                {formData.short_description.length < 20 && formData.short_description.length > 0 && (
                  <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">Min 20 chars</p>
                )}
              </div>

              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Full Desc <span className="text-red-600">*</span>
                  <span className="ml-1 text-gray-400 text-[8px]">({formData.full_description.length} chars)</span>
                </label>
                <textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  rows={2}
                  placeholder="Detailed service description"
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                />
                {formData.full_description.length < 50 && formData.full_description.length > 0 && (
                  <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">Min 50 chars</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-100 my-1" />

            {/* ROW 3: Icon Selection */}
            <div>
              <label className="block mb-1 text-[9px] sm:text-xs font-medium text-[#0D47A1] ">
                Service Icon
              </label>
              
              {/* Icon Type Selection */}
              <div className="flex gap-2 sm:gap-3 mb-1.5">
                <label className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1 rounded-lg border border-gray-200 bg-[#fafbff] cursor-pointer hover:bg-gray-50 transition flex-1 sm:flex-none justify-center">
                  <input
                    type="radio"
                    value="lucide"
                    checked={formData.icon_type === 'lucide'}
                    onChange={() => {
                      setFormData({...formData, icon_type: 'lucide', icon_url: ''});
                      setShowIconPicker(true);
                    }}
                    className="w-3 h-3 text-blue-600 rounded-lg"
                  />
                  <span className="text-[9px] sm:text-xs font-medium">Lucide</span>
                </label>
                <label className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1 rounded-lg border border-gray-200 bg-[#fafbff] cursor-pointer hover:bg-gray-50 transition flex-1 sm:flex-none justify-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={formData.icon_type === 'custom'}
                    onChange={() => setFormData({...formData, icon_type: 'custom'})}
                    className="w-3 h-3 text-blue-600"
                  />
                  <span className="text-[9px] sm:text-xs font-medium">Custom</span>
                </label>
              </div>

              {/* Lucide Icon Picker */}
              {formData.icon_type === 'lucide' && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="flex items-center justify-between w-full px-2 py-1 sm:px-2.5 sm:py-1 border border-gray-200 rounded bg-[#fafbff] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {formData.icon_name && (
                        <div className="p-0.5 bg-blue-50 rounded">
                          {(() => {
                            const Icon = (LucideIcons as any)[formData.icon_name];
                            return Icon && typeof Icon === 'function' 
                              ? <Icon className="w-3 h-3 text-blue-600" />
                              : <LucideIcons.Code className="w-3 h-3 text-blue-600" />;
                          })()}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="text-[9px] sm:text-xs font-medium text-gray-900">
                          {formData.icon_name || 'Select an icon'}
                        </div>
                        <div className="text-[7px] sm:text-[10px] text-gray-500">
                          {allLucideIcons.length} icons
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} />
                  </button>

                  {showIconPicker && (
                    <div className="mt-1.5 border border-gray-200 rounded p-2 max-h-48 overflow-y-auto bg-[#fafbff]">
                      <div className="mb-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            className="w-full pl-6 pr-2 py-0.5 text-[9px] border border-gray-200 rounded bg-white"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <h4 className="text-[8px] sm:text-[9px] font-semibold text-gray-700 mb-1">Popular</h4>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1">
                          {popularIcons.slice(0, 5).map(iconName => {
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
                                className={`p-1 rounded border flex flex-col items-center ${
                                  formData.icon_name === iconName
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                <span className="text-[6px] truncate w-full text-center mt-0.5">{iconName.slice(0, 6)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[8px] sm:text-[9px] font-semibold text-gray-700 mb-1">All ({filteredIcons.length})</h4>
                        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                          {filteredIcons.slice(0, 16).map(iconName => {
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
                                className={`p-1 rounded border flex items-center justify-center ${
                                  formData.icon_name === iconName
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                                title={iconName}
                              >
                                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
                <div className="border border-dashed border-gray-300 rounded p-2 text-center bg-[#fafbff]">
                  <div className="flex flex-col items-center gap-1">
                    {formData.icon_url ? (
                      <>
                        <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded bg-white border border-gray-200">
                          <img 
                            src={formData.icon_url} 
                            alt="Uploaded icon"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="text-[8px] text-gray-600 truncate max-w-[150px]">
                          {formData.icon_url.split('/').pop()?.slice(0, 15)}
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, icon_url: ''})}
                          className="text-[8px] text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50">
                          <Upload className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="text-[8px] text-gray-500 mb-1">PNG, JPG, SVG up to 5MB</div>
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
                          <div className="inline-flex items-center px-2 py-0.5 bg-blue-600 text-white text-[8px] rounded hover:bg-blue-700 transition">
                            {uploading ? 'Uploading...' : 'Browse'}
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-100 my-1" />

            {/* ROW 4: Status & SEO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
              {/* Status */}
              <div className="bg-[#fafbff] rounded-lg border border-gray-200 p-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Eye className={`w-3 h-3 ${formData.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-[9px] sm:text-xs font-medium text-[#0D47A1]">Active</div>
                    <div className="text-[7px] sm:text-[9px] text-gray-500">Visible to visitors</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600"
                />
              </div>

              {/* SEO Fields */}
              <div className="space-y-1">
                <div>
                  <label className=" block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Meta Title
                    <span className="ml-1 text-gray-400 text-[7px]">({formData.meta_title.length}/255)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    maxLength={255}
                    placeholder="SEO title"
                    className="w-full px-2 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-[#fafbff]"
                  />
                </div>

                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Meta Description
                    <span className="ml-1 text-gray-400 text-[7px]">({formData.meta_description.length}/500)</span>
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={1}
                    maxLength={500}
                    placeholder="SEO description"
                    className="w-full px-2 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-[#fafbff] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-1.5 sm:gap-2 pt-1.5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-200 rounded text-[9px] sm:text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded text-[9px] sm:text-xs hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 transition"
                disabled={
                  formData.title.length < 3 ||
                  formData.short_description.length < 20 ||
                  formData.full_description.length < 50
                }
              >
                <Save size={10} className="sm:w-3 sm:h-3" />
                <span>{editingService ? 'Update' : 'Create'}</span>
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

export default ServicesCMS;
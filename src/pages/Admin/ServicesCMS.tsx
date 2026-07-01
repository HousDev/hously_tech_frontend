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
import { useOutletContext } from 'react-router-dom';


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

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select services to delete');
      return;
    }
    setDeleteTargetIds(selectedServices);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const deleteToast = toast.loading('Deleting service...');
    try {
      await servicesApi.delete(id);
      toast.success('Service deleted successfully', { id: deleteToast });
      fetchServices();
      setSelectedServices(prev => prev.filter(serviceId => serviceId !== id));
    } catch (err) {
      toast.error('Failed to delete service', { id: deleteToast });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const deleteToast = toast.loading(`Deleting ${ids.length} service(s)...`);
    try {
      await servicesApi.bulkDelete(ids);
      toast.success(`Successfully deleted ${ids.length} service(s)`, { id: deleteToast });
      setSelectedServices([]);
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete services', { id: deleteToast });
    }
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Services CMS');
      setHeaderSubtitle(`Manage IT services, icons, and page descriptions (${services.length} records)`);
    }
  }, [services.length, setHeaderTitle, setHeaderSubtitle]);

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

  /* Deletion triggers confirm modal */


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
          <div className="bg-blue-100/60 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Services</p>
            <p className="text-base font-extrabold text-blue-600 mt-1">{totalServices}</p>
          </div>
          <div className="bg-emerald-100/60 border-emerald-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active</p>
            <p className="text-base font-extrabold text-emerald-600 mt-1">{activeServices}</p>
          </div>
          <div className="bg-gray-200/70 border-gray-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inactive</p>
            <p className="text-base font-extrabold text-slate-600 mt-1">{inactiveServices}</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-sm text-xs font-semibold flex cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
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


        {/* Bulk Actions Bar */}
        {selectedServices.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    {selectedServices.length} selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkToggleActive(true)}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkToggleActive(false)}
                    className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
              <button
                onClick={handleBulkDeleteClick}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition mt-1 sm:mt-0 cursor-pointer font-bold"
              >
                Delete ({selectedServices.length})
              </button>
            </div>
          </div>
        )}

        {/* Table View - Main View */}
        <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
          {currentServices.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <Server className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-600 text-sm sm:text-lg">No services found</p>
              {searchTerm || statusFilter !== 'all' ? (
                <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  Try adjusting your search or filter criteria
                </p>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 mx-auto text-xs font-semibold cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add New Service</span>
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
                            checked={selectedServices.length === currentServices.length && currentServices.length > 0}
                            onChange={handleSelectAll}
                            className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                          />
                        </div>
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                        Order
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                        Icon
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-48 border-r border-b border-slate-300">
                        Title
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell w-64 border-r border-b border-slate-300">
                        Description
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                        Status
                      </th>
                      <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {currentServices.map((service, index) => (
                      <tr key={service.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleSelectService(service.id)}
                              className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                            />
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="flex items-center space-x-1 justify-center">
                            <button
                              onClick={() => handleReorder(index, 'up')}
                              disabled={service.display_order === 0}
                              className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Move up"
                            >
                              <MoveUp size={11} className="text-slate-600" />
                            </button>
                            <span className="font-bold text-slate-800 text-[11px] min-w-[16px] text-center">
                              {service.display_order}
                            </span>
                            <button
                              onClick={() => handleReorder(index, 'down')}
                              disabled={service.display_order === services.length - 1}
                              className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Move down"
                            >
                              <MoveDown size={11} className="text-slate-600" />
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="flex flex-col items-center">
                            {getIconComponent(service)}
                            <span className="text-[9px] text-slate-400 mt-1 truncate max-w-[60px] leading-none">
                              {service.icon_name || 'Custom'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="max-w-[120px] sm:max-w-xs">
                            <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{service.title}</p>
                            <p className="text-slate-400 text-[9px] truncate sm:hidden leading-none mt-0.5">{service.short_description}</p>
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200 hidden sm:table-cell">
                          <div className="max-w-xs">
                            <p className="text-slate-500 text-[11px] line-clamp-2 leading-tight">{service.short_description}</p>
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <button
                            onClick={() => handleToggleActive(service.id, service.is_active)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${service.is_active
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                          >
                            {service.is_active ? (
                              <>
                                <CheckCircle className="w-2.5 h-2.5" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-2.5 h-2.5" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-1 border-b border-slate-200 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                              title="Edit"
                            >
                              <Edit size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(service.id)}
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

      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalContentIn {
          from { opacity: 0; transform: scale(0.92) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0px); }
        }
        .svc-modal-backdrop {
          animation: modalBackdropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
        }
        .svc-modal-content {
          animation: modalContentIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 svc-modal-backdrop">
          <div className="fixed inset-0" onClick={handleCloseModal} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 svc-modal-content">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5 text-[#0D47A1]" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                    {editingService ? 'Edit Service' : 'New Service'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {editingService ? 'Modify service properties, descriptions and icons' : 'Publish a new capabilities service offer'}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Compact No-Scroll Body */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Row 1: Title + Display Order */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Title <span className="text-red-500">*</span>
                      <span className="ml-1 text-slate-400 lowercase font-medium normal-case">({formData.title.length}/255)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={255}
                      required
                      placeholder="e.g., Web Development"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                    />
                    {formData.title.length < 3 && formData.title.length > 0 && (
                      <p className="text-[10px] text-red-500 mt-0.5 font-semibold">Min 3 chars</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      min={0}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Row 2: Short + Full Description */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Short Description <span className="text-red-500">*</span>
                      <span className="ml-1 text-slate-400 lowercase font-medium normal-case">({formData.short_description.length}/500)</span>
                    </label>
                    <textarea
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                      maxLength={500}
                      placeholder="Brief description for cards"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    />
                    {formData.short_description.length < 20 && formData.short_description.length > 0 && (
                      <p className="text-[10px] text-red-500 mt-0.5 font-semibold">Min 20 chars</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      rows={2}
                      placeholder="Detailed service description"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none overflow-hidden"
                    />
                  </div>
                </div>

                {/* Row 3: Icon picker — no scroll, inline fixed grid */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Icon</p>
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => setFormData({ ...formData, icon_type: 'lucide', icon_url: '' })} className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition cursor-pointer ${formData.icon_type === 'lucide' ? 'bg-[#0D47A1] text-white border-[#0D47A1]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>Lucide</button>
                      <button type="button" onClick={() => setFormData({ ...formData, icon_type: 'custom' })} className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition cursor-pointer ${formData.icon_type === 'custom' ? 'bg-[#0D47A1] text-white border-[#0D47A1]' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>Upload</button>
                    </div>
                  </div>

                  {formData.icon_type === 'lucide' && (
                    <div>
                      {/* Current selected icon preview */}
                      <div className="flex items-center gap-2 mb-2 p-2 bg-white rounded-lg border border-slate-200">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          {(() => { const Icon = (LucideIcons as any)[formData.icon_name]; return Icon && typeof Icon === 'function' ? <Icon className="w-4 h-4 text-[#0D47A1]" /> : <LucideIcons.Code className="w-4 h-4 text-[#0D47A1]" />; })()}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{formData.icon_name || 'Select below'}</span>
                        <div className="ml-auto relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input type="text" value={iconSearch} onChange={(e) => setIconSearch(e.target.value)} placeholder="Filter…" className="pl-6 pr-2 py-1 text-[10px] border border-slate-200 rounded-md bg-slate-50 outline-none font-semibold w-24" />
                        </div>
                      </div>
                      {/* Fixed icon grid — NO scroll */}
                      <div className="grid grid-cols-12 gap-1">
                        {(iconSearch
                          ? allLucideIcons.filter(n => n.toLowerCase().includes(iconSearch.toLowerCase())).slice(0, 24)
                          : popularIcons
                        ).map(iconName => {
                          const Icon = (LucideIcons as any)[iconName];
                          if (!Icon) return null;
                          return (
                            <button type="button" key={iconName}
                              onClick={() => { setFormData({ ...formData, icon_name: iconName }); setIconSearch(''); }}
                              className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${formData.icon_name === iconName ? 'border-[#0D47A1] bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 bg-white'
                                }`}
                              title={iconName}
                            ><Icon className="w-3.5 h-3.5" /></button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {formData.icon_type === 'custom' && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                      {formData.icon_url ? (
                        <div className="flex items-center gap-2">
                          <img src={formData.icon_url} alt="Icon" className="w-8 h-8 object-contain rounded border border-slate-200" />
                          <button type="button" onClick={() => setFormData({ ...formData, icon_url: '' })} className="text-[10px] text-red-600 hover:text-red-800 font-bold cursor-pointer">Remove</button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp,.gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload(f); }} disabled={uploading} />
                          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-50"><Upload className="w-3.5 h-3.5 text-[#0D47A1]" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-600">{uploading ? 'Uploading…' : 'Upload Icon'}</p>
                            <p className="text-[9px] text-slate-400">PNG, JPG, SVG up to 5MB</p>
                          </div>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 4: Meta SEO + Toggles */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta SEO Title</label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      maxLength={255}
                      placeholder="SEO Title"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta SEO Desc</label>
                    <input
                      type="text"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      maxLength={500}
                      placeholder="SEO Description"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-2 pl-2">
                    <label className="relative inline-flex items-center cursor-pointer gap-2">
                      <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                      <span className="text-[10px] font-bold text-slate-600">Active</span>
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={handleCloseModal} className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formData.title.length < 3 || formData.short_description.length < 20}
                    className="px-4 py-1.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Save size={12} />
                    <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 svc-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); setDeleteTargetIds(null); }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 svc-modal-content">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Confirm Delete</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {deleteTargetIds ? `${deleteTargetIds.length} service${deleteTargetIds.length === 1 ? '' : 's'} selected` : '1 service selected'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete {deleteTargetIds ? `these ${deleteTargetIds.length} services` : 'this service'}? This action <span className="text-red-500 font-bold">cannot be undone</span>.
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
  );
};

export default ServicesCMS;
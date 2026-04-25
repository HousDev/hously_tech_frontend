import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, MapPin, Briefcase, 
  Users, DollarSign, Clock, Search, 
  Save, X, FileText, Mail, 
  ChevronLeft, ChevronRight, BarChart3, 
  Building, Headphones, Code, Server, 
  Award, Globe, Palette, 
  TrendingUp as TrendingUpIcon,
  Grid, List,
  RefreshCw, 
  Users as UsersIcon, Target as TargetIcon,
  Zap as ZapIcon, Check, XCircle,
  IndianRupee, CheckCircle} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { careerApi, type Job, type Application, type JobStats, type ApplicationStats } from '../../lib/careerApi';




interface CareerCMSProps {
  isSidebarOpen?: boolean;
}

const CareerCMS: React.FC<CareerCMSProps> = ({ isSidebarOpen = false }) => {
  // Predefined data
  const predefinedDepartments = [
    'Sales & Marketing',
    'IT Development',
    'Software Engineering',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'DevOps',
    'QA/Testing',
    'UI/UX Design',
    'Project Management',
    'Human Resources',
    'Finance',
    'Customer Support',
    'Operations'
  ];

  const predefinedLocations = [
    'Pune',
    'Remote',
    'Hybrid',
    'Onsite',
    'Mumbai',
    'Bengaluru',
    'Delhi',
    'Chennai',
    'Hyderabad'
  ];

  const predefinedJobTypes = [
    'Remote',
    'Onsite',
    'Hybrid',
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];

  const experienceLevels = [
    'Entry Level',
    'Junior (1-3 years)',
    'Mid Level (3-5 years)',
    'Senior (5-8 years)',
    'Lead (8+ years)',
    'Manager'
  ];

  // States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Stats
  const [jobStats, setJobStats] = useState<JobStats>({
    total: 0,
    active: 0,
    inactive: 0,
    departments: 0,
    locations: 0
  });
  const [appStats, setAppStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [statusViewFilter, setStatusViewFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Selection state
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  
  // Sort state
  const [sortField] = useState<string>('');
  const [sortDirection] = useState<'asc' | 'desc'>('asc');

  // Form state
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    location: '',
    job_type: 'Full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary_range: '',
    experience_level: '',
    is_active: true,
    application_deadline: '',
    vacancy_count: 1
  });

  // Custom department/location inputs
  const [showCustomDept, setShowCustomDept] = useState(false);
  const [showCustomLoc, setShowCustomLoc] = useState(false);
  const [customDept, setCustomDept] = useState('');
  const [customLoc, setCustomLoc] = useState('');

  // Toast notifications
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
    } else if (type === 'error') {
      toast.error(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
      });
    } else {
      toast(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#3B82F6',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
      });
    }
  };

 useEffect(() => {
  fetchAllData();
}, [activeTab, currentPage, itemsPerPage, statusFilter, departmentFilter, locationFilter, jobTypeFilter, statusViewFilter, sortField, sortDirection, searchTerm]); // Add searchTerm here
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'jobs') {
        await fetchJobs();
        await fetchJobStats();
      } else {
        await fetchApplications();
        await fetchAppStats();
      }
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

 // REPLACE with:
const fetchJobs = async () => {
  try {
    // FIX: Convert statusViewFilter to active parameter correctly
    let activeFilter: 'all' | 'true' | 'false' = 'all';
    if (statusViewFilter === 'active') {
      activeFilter = 'true';
    } else if (statusViewFilter === 'inactive') {
      activeFilter = 'false';
    }
    
    const response = await careerApi.getJobs({
      search: searchTerm || undefined,
      department: departmentFilter !== 'all' ? departmentFilter : undefined,
      location: locationFilter !== 'all' ? locationFilter : undefined,
      job_type: jobTypeFilter !== 'all' ? jobTypeFilter : undefined,
      active: activeFilter,  // Now properly typed
      page: currentPage,
      limit: itemsPerPage,
      sort: sortField || undefined,
      order: sortDirection
    });
    
    setJobs(response.jobs);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    showToast('Failed to fetch jobs', 'error');
  }
};

  // REPLACE with:
const fetchApplications = async () => {
  try {
    const response = await careerApi.getApplications({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: currentPage,
      limit: itemsPerPage,
      sort: sortField || undefined,
      order: sortDirection
    });
    
    setApplications(response.applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    showToast('Failed to fetch applications', 'error');
  }
};

  // REPLACE with:
const fetchJobStats = async () => {
  try {
    const stats = await careerApi.getJobStats();
    setJobStats(stats);
  } catch (error) {
    console.error('Failed to fetch job stats:', error);
  }
};

  // REPLACE with:
const fetchAppStats = async () => {
  try {
    const stats = await careerApi.getApplicationStats();
    setAppStats(stats);
  } catch (error) {
    console.error('Failed to fetch app stats:', error);
  }
};

  // REPLACE with:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const jobData = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
      benefits: formData.benefits.split('\n').filter(b => b.trim()),
      is_active: formData.is_active
    };

    if (editingJob) {
      await careerApi.updateJob(editingJob.id, jobData);
      showToast('Job updated successfully!');
    } else {
      await careerApi.createJob(jobData);
      showToast('Job created successfully!');
    }
    
    fetchAllData();
    handleCloseModal();
  } catch (err: any) {
    const errorMessage = err.message || 'Unknown error';
    setError('Failed to save job: ' + errorMessage);
    showToast(`Failed to save job: ${errorMessage}`, 'error');
  }
};

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      job_title: job.job_title,
      department: job.department || '',
      location: job.location || '',
      job_type: job.job_type,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      salary_range: job.salary_range || '',
      experience_level: job.experience_level || '',
      is_active: job.is_active,
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
      vacancy_count: job.vacancy_count || 1
    });
    setIsModalOpen(true);
  };

const handleDelete = async (id: number) => {
  const deleteToast = toast.loading('Deleting job...');

  try {
    await careerApi.deleteJob(id);
    setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    fetchAllData();
    toast.success('Job deleted successfully', { id: deleteToast });
  } catch (err: any) {
    console.error(err);
    toast.error('Failed to delete job', { id: deleteToast });
  }
};

// REPLACE with:
const handleBulkDelete = async () => {
  const selected = activeTab === 'jobs' ? selectedJobs : selectedApplications;

  if (selected.length === 0) {
    toast.error('Please select items to delete');
    return;
  }

  const loadingToast = toast.loading(
    `Deleting ${selected.length} ${activeTab === 'jobs' ? 'job(s)' : 'application(s)'}...`
  );

  try {
    if (activeTab === 'jobs') {
      await careerApi.bulkDeleteJobs(selected);
      setSelectedJobs([]);
    } else {
      // For applications - if you have bulk delete endpoint
      for (const {} of selected) {
        // await careerApi.deleteApplication(id); // Add if available
      }
      setSelectedApplications([]);
    }

    toast.success(
      `${selected.length} ${activeTab === 'jobs' ? 'job(s)' : 'application(s)'} deleted successfully`,
      { id: loadingToast }
    );

    fetchAllData();
  } catch (err: any) {
    console.error(err);
    toast.error('Failed to delete items', { id: loadingToast });
  }
};

 // REPLACE with:
const handleToggleActive = async (id: number, currentStatus: boolean) => {
  const toggleToast = toast.loading(currentStatus ? 'Deactivating job...' : 'Activating job...');
  
  try {
    await careerApi.updateJob(id, { is_active: !currentStatus });
    toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully!`, { id: toggleToast });
    
    // ✅ ADD THIS LINE - Show all jobs to see the status change
    setStatusViewFilter('all');
    
    fetchAllData();
  } catch (err: any) {
    toast.error('Failed to update job status', { id: toggleToast });
  }
};

  // REPLACE with:
const handleUpdateApplicationStatus = async (id: number, status: string) => {
  const statusToast = toast.loading('Updating application status...');
  
  try {
    await careerApi.updateApplicationStatus(id, status);
    toast.success('Application status updated!', { id: statusToast });
    fetchAllData();
  } catch (err: any) {
    toast.error('Failed to update application status', { id: statusToast });
  }
};

// REPLACE with:
const handleBulkUpdateApplicationStatus = async (status: string) => {
  if (selectedApplications.length === 0) {
    showToast('Please select applications to update', 'error');
    return;
  }

  const updateToast = toast.loading(`Updating ${selectedApplications.length} application(s)...`);
  
  try {
    for (const id of selectedApplications) {
      await careerApi.updateApplicationStatus(id, status);
    }
    toast.success(`Updated ${selectedApplications.length} application(s) to ${status}!`, { id: updateToast });
    setSelectedApplications([]);
    fetchAllData();
  } catch (err: any) {
    toast.error('Failed to update applications', { id: updateToast });
  }
};

  const handleAddCustomDept = () => {
    if (customDept.trim()) {
      setFormData({...formData, department: customDept});
      setShowCustomDept(false);
      setCustomDept('');
    }
  };

  const handleAddCustomLoc = () => {
    if (customLoc.trim()) {
      setFormData({...formData, location: customLoc});
      setShowCustomLoc(false);
      setCustomLoc('');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setShowCustomDept(false);
    setShowCustomLoc(false);
    setCustomDept('');
    setCustomLoc('');
    setFormData({
      job_title: '',
      department: '',
      location: '',
      job_type: 'Full-time',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      salary_range: '',
      experience_level: '',
      is_active: true,
      application_deadline: '',
      vacancy_count: 1
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'hired': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadResume = (path: string) => {
    if (path) {
      window.open(path, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDepartmentIcon = (dept: string) => {
    if (dept.includes('Sales') || dept.includes('Marketing')) return <TrendingUpIcon className="w-4 h-4" />;
    if (dept.includes('IT') || dept.includes('Software') || dept.includes('Development')) return <Code className="w-4 h-4" />;
    if (dept.includes('DevOps')) return <Server className="w-4 h-4" />;
    if (dept.includes('Design')) return <Palette className="w-4 h-4" />;
    if (dept.includes('Finance')) return <DollarSign className="w-4 h-4" />;
    if (dept.includes('HR')) return <UsersIcon className="w-4 h-4" />;
    if (dept.includes('Support')) return <Headphones className="w-4 h-4" />;
    if (dept.includes('Project')) return <TargetIcon className="w-4 h-4" />;
    return <Building className="w-4 h-4" />;
  };

  const getLocationColor = (loc: string) => {
    switch (loc?.toLowerCase()) {
      case 'remote': return 'from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200';
      case 'hybrid': return 'from-blue-100 to-blue-50 text-blue-700 border-blue-200';
      case 'onsite': return 'from-purple-100 to-purple-50 text-purple-700 border-purple-200';
      case 'pune': return 'from-orange-100 to-orange-50 text-orange-700 border-orange-200';
      default: return 'from-gray-100 to-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'remote': return <Globe className="w-4 h-4" />;
      case 'full-time': return <Clock className="w-4 h-4" />;
      case 'part-time': return <Clock className="w-4 h-4" />;
      case 'contract': return <Briefcase className="w-4 h-4" />;
      case 'internship': return <Award className="w-4 h-4" />;
      case 'freelance': return <ZapIcon className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    if (isActive) {
      return 'bg-gradient-to-r from-green-100 to-emerald-50 text-green-700 border border-green-200';
    } else {
      return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    if (isActive) {
      return <Check className="w-3 h-3 mr-1.5" />;
    } else {
      return <XCircle className="w-3 h-3 mr-1.5" />;
    }
  };

 

 

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setLocationFilter('all');
    setJobTypeFilter('all');
    setStatusViewFilter('all');
    setCurrentPage(1);
    setSelectedJobs([]);
    setSelectedApplications([]);
  };

  


  // Filter and sort logic
  const filteredItems = activeTab === 'jobs' ? jobs : applications;
  
  const totalItems = activeTab === 'jobs' ? jobStats.total : appStats.total;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Selection handlers
  const handleSelectAll = () => {
    if (activeTab === 'jobs') {
      if (selectedJobs.length === filteredItems.length) {
        setSelectedJobs([]);
      } else {
        setSelectedJobs(filteredItems.map((item: any) => item.id));
      }
    } else {
      if (selectedApplications.length === filteredItems.length) {
        setSelectedApplications([]);
      } else {
        setSelectedApplications(filteredItems.map((item: any) => item.id));
      }
    }
  };

  const handleSelectItem = (id: number) => {
    if (activeTab === 'jobs') {
      if (selectedJobs.includes(id)) {
        setSelectedJobs(selectedJobs.filter(itemId => itemId !== id));
      } else {
        setSelectedJobs([...selectedJobs, id]);
      }
    } else {
      if (selectedApplications.includes(id)) {
        setSelectedApplications(selectedApplications.filter(itemId => itemId !== id));
      } else {
        setSelectedApplications([...selectedApplications, id]);
      }
    }
  };

  // Sort handler
 

  if (loading && jobs.length === 0 && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
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
        <div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
          {/* Blue Title Section */}
          <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
<div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Career Management
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Manage job openings and applications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="sm:hidden bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition"
                >
                  <Plus size={18} />
                </button>
                 <div className="flex justify-center sm:justify-end">
 <button
  onClick={() => setIsModalOpen(true)}
  className="hidden sm:flex ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm"
>
  <Plus size={16} className="sm:size-[18px]" />
  <span className="font-medium">Add Job</span>
</button>

</div>

              </div>
            </div>
          </div>

          {/* White Content Section - Show only when sidebar is closed on mobile */}
          {(!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="bg-white rounded-b-lg sm:rounded-b-xl">
              <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
                {/* Tabs */}
                <div className="flex space-x-1 sm:space-x-2 mb-3 sm:mb-4">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex-1 py-2 px-3 sm:px-4 text-center font-medium transition-all relative rounded-lg sm:rounded-xl ${
                      activeTab === 'jobs'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Briefcase size={16} className="sm:size-[18px]" />
                      <span className="text-xs sm:text-sm">Jobs ({jobStats.total})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`flex-1 py-2 px-3 sm:px-4 text-center font-medium transition-all relative rounded-lg sm:rounded-xl ${
                      activeTab === 'applications'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Users size={16} className="sm:size-[18px]" />
                      <span className="text-xs sm:text-sm">Applications ({appStats.total})</span>
                    </div>
                  </button>
                </div>

                {/* Stats Cards */}
                {activeTab === 'jobs' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Total Jobs</p>
                          <p className="text-base sm:text-lg font-bold text-gray-900">{jobStats.total}</p>
                        </div>
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Active</p>
                          <p className="text-base sm:text-lg font-bold text-green-600">{jobStats.active}</p>
                        </div>
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Inactive</p>
                          <p className="text-base sm:text-lg font-bold text-gray-600">{jobStats.inactive}</p>
                        </div>
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 hidden sm:block lg:block">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Departments</p>
                          <p className="text-base sm:text-lg font-bold text-purple-600">{jobStats.departments}</p>
                        </div>
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 hidden sm:block lg:block">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Locations</p>
                          <p className="text-base sm:text-lg font-bold text-orange-600">{jobStats.locations}</p>
                        </div>
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {Object.entries(appStats).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                        <p className="text-[10px] sm:text-xs text-gray-600 font-medium capitalize truncate">{key}</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search and Filters */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Search Bar */}
                 {/* Search Bar */}
<div className="relative">
  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
  <input
    type="text"
    placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search applications..."}
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      // Add a small debounce to avoid too many API calls
      setCurrentPage(1);
    }}
    className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-xs sm:text-sm bg-white shadow-sm"
  />
  <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
    <button
      onClick={handleResetFilters}
      className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg transition"
      title="Reset filters"
    >
      <RefreshCw size={14} className="sm:size-[16px]" />
    </button>
  </div>
</div>

                  {/* Filter Controls */}
                  {activeTab === 'jobs' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {/* View Mode Toggle */}
                      <div className="flex items-center space-x-1 bg-gray-100 p-0.5 sm:p-1 rounded-lg">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition ${
                            viewMode === 'grid' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Grid size={14} className="sm:size-[16px]" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition ${
                            viewMode === 'list' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <List size={14} className="sm:size-[16px]" />
                        </button>
                      </div>

                      {/* Status Filter */}
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-xs text-gray-600 font-medium hidden sm:inline">Status:</span>
                        <div className="flex items-center space-x-1 bg-gray-100 p-0.5 sm:p-1 rounded-lg">
                          <button
                            onClick={() => setStatusViewFilter('all')}
                            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition text-xs ${
                              statusViewFilter === 'all' 
                                ? 'bg-white text-blue-600 shadow-sm font-medium' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setStatusViewFilter('active')}
                            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition text-xs ${
                              statusViewFilter === 'active' 
                                ? 'bg-green-100 text-green-600 shadow-sm font-medium' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Active
                          </button>
                          <button
                            onClick={() => setStatusViewFilter('inactive')}
                            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition text-xs ${
                              statusViewFilter === 'inactive' 
                                ? 'bg-gray-200 text-gray-600 shadow-sm font-medium' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            Inactive
                          </button>
                        </div>
                      </div>

                      {/* Other Filters */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <select
                          value={departmentFilter}
                          onChange={(e) => {
                            setDepartmentFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm min-w-[100px] sm:min-w-[140px]"
                        >
                          <option value="all">All Departments</option>
                         {Array.from(
  new Set(
    jobs
      .map(job => job.department)
      .filter((dept): dept is string => Boolean(dept)) // ✅ fix
  )
).map(dept => (
  <option key={dept} value={dept}>{dept}</option>
))}
                        </select>

                        <select
                          value={locationFilter}
                          onChange={(e) => {
                            setLocationFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm min-w-[80px] sm:min-w-[120px]"
                        >
                          <option value="all">All Locations</option>
                         {Array.from(
  new Set(
    jobs
      .map(job => job.location)
      .filter((loc): loc is string => Boolean(loc)) // ✅ type guard
  )
).map(loc => (
  <option key={loc} value={loc}>{loc}</option>
))}
                        </select>

                        <select
                          value={jobTypeFilter}
                          onChange={(e) => {
                            setJobTypeFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm min-w-[80px] sm:min-w-[120px]"
                        >
                          <option value="all">All Types</option>
                          {Array.from(new Set(jobs.map(job => job.job_type).filter(Boolean))).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>

                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm"
                        >
                          <option value="6">6 per page</option>
                          <option value="12">12 per page</option>
                          <option value="24">24 per page</option>
                          <option value="48">48 per page</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Applications Tab Filters */}
                  {activeTab === 'applications' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm min-w-[120px] sm:min-w-[150px]"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                      
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm shadow-sm"
                      >
                        <option value="10">10 per page</option>
                        <option value="25">25 per page</option>
                        <option value="50">50 per page</option>
                      </select>
                      
                     
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar - Hide when sidebar is open on mobile */}
        {((activeTab === 'jobs' && selectedJobs.length > 0) || 
          (activeTab === 'applications' && selectedApplications.length > 0)) && 
          (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {activeTab === 'jobs' ? selectedJobs.length : selectedApplications.length} selected
                  </span>
                </div>
                {activeTab === 'applications' && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <select
                      onChange={(e) => handleBulkUpdateApplicationStatus(e.target.value)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      <option value="">Update Status</option>
                      <option value="reviewed">Mark as Reviewed</option>
                      <option value="shortlisted">Mark as Shortlisted</option>
                      <option value="rejected">Mark as Rejected</option>
                      <option value="hired">Mark as Hired</option>
                    </select>
                  </div>
                )}
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
              >
                Delete ({activeTab === 'jobs' ? selectedJobs.length : selectedApplications.length})
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`${isSidebarOpen && window.innerWidth < 640 ? 'hidden' : 'block'}`}>
          {activeTab === 'jobs' ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
<h3 className={`font-bold ${job.is_active ? 'text-gray-900' : 'text-gray-500'} text-sm sm:text-base line-clamp-2`}>
  {job.job_title || 'Untitled Job'}
</h3>                        <div className="flex items-center mt-1">
                            {getDepartmentIcon(job.department || '')}
<span className={`ml-2 ${job.is_active ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm`}>
  {job.department || 'No Department'}
</span>                       </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() => handleSelectItem(job.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getLocationColor(job.location || '')}`}>
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location || 'Remote'}
                        </span>
                        <span className="flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                          {getJobTypeIcon(job.job_type)}
                          <span className="ml-1">{job.job_type}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {job.salary_range && (
                          <div className="flex items-center text-gray-700">
                            <IndianRupee className="w-3 h-3 mr-2 text-green-600" />
                            <span className="font-medium text-xs sm:text-sm truncate">{job.salary_range}</span>
                          </div>
                        )}
                        {job.experience_level && (
                          <div className="flex items-center text-gray-700">
                            <Briefcase className="w-3 h-3 mr-2 text-blue-600" />
                            <span className="text-xs sm:text-sm truncate">{job.experience_level}</span>
                          </div>
                        )}
                      </div>
                      
        <p className={`${job.is_active ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm line-clamp-2 mb-4`}>
  {job.description ? `${job.description.substring(0, 100)}...` : 'No description available'}
</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(job.id, job.is_active)}
                            className={`p-1.5 rounded-lg transition ${
                              job.is_active 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {job.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.is_active)} flex items-center`}>
                          {getStatusIcon(job.is_active)}
                          {job.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View Table
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                          <input
                            type="checkbox"
                            checked={selectedJobs.length === jobs.length && jobs.length > 0}
                            onChange={handleSelectAll}
                            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded"
                          />
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedJobs.includes(job.id)}
                              onChange={() => handleSelectItem(job.id)}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded"
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="max-w-[150px] sm:max-w-xs">
                              <p className="font-medium text-gray-900 text-sm truncate">{job.job_title}</p>
                              <p className="text-gray-500 text-xs">{job.job_type}</p>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center">
                              {getDepartmentIcon(job.department || '')}
                              <span className="ml-2 text-gray-600 text-sm">{job.department || '—'}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-gray-600 text-sm">{job.location || '—'}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <button
                              onClick={() => handleToggleActive(job.id, job.is_active)}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.is_active)}`}
                            >
                              {job.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button
                                onClick={() => handleEdit(job)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit size={14} className="sm:size-[16px]" />
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={14} className="sm:size-[16px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            // Applications Table
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        <input
                          type="checkbox"
                          checked={selectedApplications.length === applications.length && applications.length > 0}
                          onChange={handleSelectAll}
                          className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded"
                        />
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Position
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(app.id)}
                            onChange={() => handleSelectItem(app.id)}
                            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-blue-600 text-sm">
                                {app.applicant_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{app.applicant_name}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{app.job_title || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                          <div className="text-sm text-gray-900">{app.job_title || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{formatDate(app.applied_at)}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {app.resume_path && (
                              <button
                                onClick={() => downloadResume(app.resume_path!)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View Resume"
                              >
                                <FileText size={14} className="sm:size-[16px]" />
                              </button>
                            )}
                            <button
                              onClick={() => window.open(`mailto:${app.email}`)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Email Applicant"
                            >
                              <Mail size={14} className="sm:size-[16px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab === 'jobs' ? 'jobs' : 'applications'} found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || locationFilter !== 'all' || jobTypeFilter !== 'all' || statusViewFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : activeTab === 'jobs'
                  ? 'Create your first job opening'
                  : 'Applications will appear here when candidates apply'}
              </p>
              {activeTab === 'jobs' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Create Job Opening</span>
                </button>
              )}
            </div>
          )}

          {/* Pagination - Hide when sidebar is open on mobile */}
          {filteredItems.length > 0 && (!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-700">
                  Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  of <span className="font-semibold">{totalItems}</span> results
                </div>
                
                <div className="flex items-center justify-between sm:justify-start space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                          onClick={() => setCurrentPage(pageNumber)}
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
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingJob ? 'Edit Job' : 'Create New Job Opening'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={20} className="sm:size-[24px]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Job Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                        placeholder="e.g., Senior Frontend Developer"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      {!showCustomDept ? (
                        <select
                          value={formData.department}
                          onChange={(e) => {
                            if (e.target.value === 'custom') {
                              setShowCustomDept(true);
                            } else {
                              setFormData({...formData, department: e.target.value});
                            }
                          }}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                          required
                        >
                          <option value="">Select Department</option>
                          {predefinedDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                          <option value="custom">+ Add Custom</option>
                        </select>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customDept}
                            onChange={(e) => setCustomDept(e.target.value)}
                            className="flex-1 px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            placeholder="Enter department"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomDept}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition text-sm"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomDept(false)}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      {!showCustomLoc ? (
                        <select
                          value={formData.location}
                          onChange={(e) => {
                            if (e.target.value === 'custom') {
                              setShowCustomLoc(true);
                            } else {
                              setFormData({...formData, location: e.target.value});
                            }
                          }}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                          required
                        >
                          <option value="">Select Location</option>
                          {predefinedLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                          <option value="custom">+ Add Custom</option>
                        </select>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customLoc}
                            onChange={(e) => setCustomLoc(e.target.value)}
                            className="flex-1 px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            placeholder="Enter location"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomLoc}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition text-sm"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomLoc(false)}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type *
                      </label>
                      <select
                        value={formData.job_type}
                        onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                      >
                        {predefinedJobTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={formData.salary_range}
                        onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        placeholder="e.g., ₹8L - ₹12L PA"
                      />
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      >
                        <option value="">Select Level</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vacancy Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vacancy Count *
                      </label>
                      <input
                        type="text"
                        value={formData.vacancy_count}
                        onChange={(e) => setFormData({...formData, vacancy_count: parseInt(e.target.value) || 0})}
                        min="0"
                        max="100"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                      />
                    </div>

                    {/* Application Deadline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.application_deadline}
                        onChange={(e) => setFormData({...formData, application_deadline: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      required
                      placeholder="Brief description of the job..."
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements *
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      rows={3}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      required
                      placeholder="One requirement per line..."
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibilities *
                    </label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                      rows={3}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      required
                      placeholder="One responsibility per line..."
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Benefits *
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      rows={3}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      required
                      placeholder="One benefit per line..."
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                    <label className="flex items-center space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Active Job Opening</span>
                        <p className="text-xs text-gray-500">
                          {formData.is_active 
                            ? 'Visible to candidates'
                            : 'Hidden from candidates'}
                        </p>
                      </div>
                    </label>

                    {editingJob && (
                      <div className="text-xs text-gray-500 text-right">
                        <p>Created: {formatDate(editingJob.created_at)}</p>
                        <p>Updated: {formatDate(editingJob.updated_at)}</p>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition flex items-center space-x-1.5 sm:space-x-2 text-sm shadow-md"
                    >
                      <Save size={16} className="sm:size-[18px]" />
                      <span>{editingJob ? 'Update' : 'Create'} Job</span>
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

export default CareerCMS;
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
  IndianRupee, CheckCircle,
  Download,
  Calendar,
  MessageSquare,
  Phone,
  Video} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { careerApi, type Job, type Application, type JobStats, type ApplicationStats } from '../../lib/careerApi';




interface CareerCMSProps {
  isSidebarOpen?: boolean;
}

const MultiSelectDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
}: {
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  colorClass?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (option: string) => {
    const updated = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(updated);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg bg-[#fafbff] flex items-center justify-between min-h-[30px]"
      >
        <span className={value.length === 0 ? "text-gray-400" : "text-gray-700"}>
          {value.length === 0 ? placeholder : value.join(', ')}
        </span>
        <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map(option => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggle(option)}
                className="w-3.5 h-3.5 rounded accent-blue-600"
              />
              <span className="text-[10px] sm:text-xs text-gray-700">{option}</span>
            </label>
          ))}
          {value.length === 0 && (
            <p className="text-[9px] text-gray-400 px-3 py-1.5 italic">Not selected</p>
          )}
        </div>
      )}
    </div>
  );
};

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
  const experienceFilterOptions = [
  { value: "all", label: "All Experience" },
  { value: "fresher", label: "Fresher (No experience)" },
  { value: "1-2 years", label: "1-2 years" },
  { value: "2-4 years", label: "2-4 years" },
  { value: "4-6 years", label: "4-6 years" },
  { value: "6-9 years", label: "6-9 years" },
  { value: "9+ years", label: "9+ years" },
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
  const [positionFilter, setPositionFilter] = useState('all');
const [experienceFilter, setExperienceFilter] = useState('all');


  const [showInterviewModal, setShowInterviewModal] = useState(false);
const [selectedApp, setSelectedApp] = useState<Application | null>(null);
const [timeline, setTimeline] = useState<any[]>([]);
const [interviewForm, setInterviewForm] = useState({
  scheduled_at: '',
  mode: 'online',
  link_or_address: '',
  message: ''
});
const [newFollowup, setNewFollowup] = useState('');
const [modalTab, setModalTab] = useState('overview');
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
   job_type: [] as string[],
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary_range: '',
    experience_level: [] as string[],
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
  fetchAppStats();
}, [activeTab, currentPage, itemsPerPage, statusFilter, departmentFilter, locationFilter, jobTypeFilter, statusViewFilter, sortField, sortDirection, searchTerm, positionFilter, experienceFilter]); // ✅ ADD experienceFilter
  
const fetchAllData = async () => {
  try {
    setLoading(true);
    
    if (activeTab === 'jobs') {
      await Promise.all([fetchJobs(), fetchJobStats()]);
    } else {
      await Promise.all([fetchApplications(), fetchAppStats()]);
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
      search: searchTerm || undefined,
      job_title: positionFilter !== 'all' ? positionFilter : undefined,
      experience_level: experienceFilter !== 'all' ? experienceFilter : undefined, // ✅ ADD THIS
      page: currentPage,
      limit: itemsPerPage,
      sort: sortField || undefined,
      order: sortDirection
    });
    setApplications(response.applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
  }
};


const openInterviewModal = async (app: Application) => {
  setSelectedApp(app);
  setInterviewForm({
    scheduled_at: '',
    mode: 'online',
    link_or_address: '',
    message: ''
  });
  setNewFollowup('');
  await fetchTimeline(app.id);
  setShowInterviewModal(true);
};

const fetchTimeline = async (appId: number) => {
  try {
    const res = await careerApi.getTimeline(appId);
    setTimeline(res.data.data);
  } catch (err) {
    toast.error('Failed to load timeline');
  }
};

const handleScheduleInterview = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedApp) return;
  try {
    await careerApi.scheduleInterview(selectedApp.id, interviewForm);
    toast.success('Interview scheduled!');
    await fetchTimeline(selectedApp.id);
    setInterviewForm({ scheduled_at: '', mode: 'online', link_or_address: '', message: '' });
  } catch (err) {
    toast.error('Failed to schedule interview');
  }
};

const handleAddFollowup = async () => {
  if (!selectedApp || !newFollowup.trim()) return;
  try {
    await careerApi.addFollowUp(selectedApp.id, newFollowup);
    toast.success('Follow‑up added');
    setNewFollowup('');
    await fetchTimeline(selectedApp.id);
  } catch (err) {
    toast.error('Failed to add follow‑up');
  }
};

const handleUpdateStatus = async (followupId: number, newStatus: string) => {
  try {
    await careerApi.updateInterviewStatus(followupId, newStatus);
    toast.success('Status updated');
    await fetchTimeline(selectedApp!.id);
  } catch (err) {
    toast.error('Failed to update status');
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
    // Set default stats to avoid undefined
    setAppStats({
      total: 0,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0
    });
  }
};

  // REPLACE with:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const jobData = {
  ...formData,
  job_type: Array.isArray(formData.job_type) 
    ? formData.job_type.join(',') 
    : formData.job_type,
  experience_level: Array.isArray(formData.experience_level)
    ? formData.experience_level.join(',')
    : formData.experience_level,
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
  
  const parseField = (val: any): string => {
    if (Array.isArray(val)) return val.join('\n');
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.join('\n');
        return val;
      } catch {
        return val;
      }
    }
    return '';
  };

  setFormData({
    job_title: job.job_title,
    department: job.department || '',
    location: job.location || '',
job_type: job.job_type 
    ? job.job_type.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [],
        description: job.description,
    requirements: parseField(job.requirements),
    responsibilities: parseField(job.responsibilities),
    benefits: parseField(job.benefits),
    salary_range: job.salary_range || '',
experience_level: job.experience_level 
    ? job.experience_level.split(',').map((e: string) => e.trim()).filter(Boolean)
    : [],
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
  for (const id of selected) {
    await careerApi.deleteApplication(id);
  }
  setApplications(prev => prev.filter(app => !selected.includes(app.id)));
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
const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

const handleUpdateApplicationStatus = async (id: number, status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired') => {
  const currentApp = applications.find(a => a.id === id);
  
  if (currentApp?.status === status) return;
  if (processingIds.has(id)) return;

  // Optimistically update UI immediately
  setApplications(prev => 
    prev.map(app => app.id === id ? { ...app, status } : app)
  );
  
  setProcessingIds(prev => new Set(prev).add(id));
  
  try {
    await careerApi.updateApplicationStatus(id, status);
    // ✅ ADD THIS LINE – re-fetch to ensure consistency
    await fetchApplications();
    await fetchAppStats();  // <-- ADD THIS LINE to update stats
  } catch (err: any) {
    // Revert on error
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: currentApp?.status || 'pending' } : app)
    );
    toast.error('Failed to update application status');
  } finally {
    setProcessingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }
};

const handleDeleteApplication = async (id: number) => {
  const deleteToast = toast.loading('Deleting application...');
  try {
    await careerApi.deleteApplication(id);
    setApplications(prev => prev.filter(app => app.id !== id));
    setSelectedApplications(prev => prev.filter(appId => appId !== id));
    toast.success('Application deleted successfully', { id: deleteToast });
    fetchAppStats();
  } catch (err: any) {
    toast.error('Failed to delete application', { id: deleteToast });
  }
};

// REPLACE with:
const handleBulkUpdateApplicationStatus = async (status: string) => {
  if (selectedApplications.length === 0) {
    showToast('Please select applications to update', 'error');
    return;
  }

  // const updateToast = toast.loading(`Updating ${selectedApplications.length} application(s)...`);
  
  // Optimistically update UI immediately
  setApplications(prev =>
    prev.map(app =>
      selectedApplications.includes(app.id)
        ? { ...app, status: status as Application['status'] }
        : app
    )
  );

  try {
    for (const id of selectedApplications) {
      await careerApi.updateApplicationStatus(id, status);
    }
    // toast.success(`Updated ${selectedApplications.length} application(s) to ${status}!`, { id: updateToast });
    setSelectedApplications([]);
    fetchAppStats();
  } catch (err: any) {
    // Revert on error
    fetchApplications();
    toast.error('Failed to update applications');
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
job_type: [],
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      salary_range: '',
      experience_level: [],
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

 const viewResume = (path: string) => {
  if (!path) { toast.error('No resume file available'); return; }
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBaseUrl.replace(/\/api$/, '').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullUrl = path.startsWith('http') ? path : `${baseUrl}/${cleanPath}`;
  window.open(fullUrl, '_blank');
};

const downloadResume = async (path: string) => {
  if (!path) { toast.error('No resume file available'); return; }
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBaseUrl.replace(/\/api$/, '').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullUrl = path.startsWith('http') ? path : `${baseUrl}/${cleanPath}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = path.split('/').pop() || 'resume';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error('Could not download file');
    console.error(error);
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
      setPositionFilter('all'); 
      setExperienceFilter('all');  // ADD THIS

    setCurrentPage(1);
    setSelectedJobs([]);
    setSelectedApplications([]);
  };

  


  // Filter and sort logic
const filteredItems = activeTab === 'jobs' 
  ? jobs 
  : applications.filter(app => {
      const search = searchTerm.toLowerCase();
      if (!search) return true;
      return (
        app.applicant_name?.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search) ||
        app.job_title?.toLowerCase().includes(search)
      );
    });  
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
<div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Career Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
         {activeTab === 'jobs' && (
     <button
            onClick={() => setIsModalOpen(true)}
            className="sm:hidden flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-2 rounded-md items-center gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Add Job</span>
          </button>
  )}
  {activeTab === 'jobs' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
          >
            <Plus size={14} />
            <span>Add Job</span>
          </button>
        )}
        </div>
      </div>
    </div>
  </div>

  {/* White Content Section - Show only when sidebar is closed on mobile */}
  {(!isSidebarOpen || window.innerWidth >= 640) && (
    <div className="bg-white rounded-b-lg sm:rounded-b-xl">
      <div className="px-2 py-2 sm:px-3 sm:py-2.5">
        {/* Tabs */}
        <div className="flex space-x-1 mb-2 sm:mb-2.5">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-1.5 px-2 text-center font-medium transition-all rounded-md text-xs ${
              activeTab === 'jobs'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Briefcase size={14} />
              <span>Jobs ({jobStats.total})</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('applications');
              fetchAppStats();
            }}
            className={`flex-1 py-1.5 px-2 text-center font-medium transition-all rounded-md text-xs ${
              activeTab === 'applications'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Users size={14} />
              <span>Applications ({appStats.total})</span>
            </div>
          </button>
        </div>

        {/* Stats Cards - Jobs */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-2 sm:mb-2.5">
            <div className="bg-blue-50 border border-blue-200 rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">Total</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{jobStats.total}</p>
                </div>
                <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">Active</p>
                  <p className="text-xs sm:text-sm font-bold text-green-600">{jobStats.active}</p>
                </div>
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">Inactive</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-600">{jobStats.inactive}</p>
                </div>
                <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5 hidden sm:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">Depts</p>
                  <p className="text-xs sm:text-sm font-bold text-purple-600">{jobStats.departments}</p>
                </div>
                <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-md px-1.5 py-1 sm:px-2 sm:py-1.5 hidden sm:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">Locs</p>
                  <p className="text-xs sm:text-sm font-bold text-orange-600">{jobStats.locations}</p>
                </div>
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Applications */}
        {activeTab === 'applications' && appStats && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2 sm:mb-2.5">
            <div className="bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Total</p>
              <p className="text-xs sm:text-sm font-bold text-gray-900">{appStats.total || 0}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Pending</p>
              <p className="text-xs sm:text-sm font-bold text-yellow-600">{appStats.pending || 0}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Reviewed</p>
              <p className="text-xs sm:text-sm font-bold text-blue-600">{appStats.reviewed || 0}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Listed</p>
              <p className="text-xs sm:text-sm font-bold text-green-600">{appStats.shortlisted || 0}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Rejected</p>
              <p className="text-xs sm:text-sm font-bold text-red-600">{appStats.rejected || 0}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-md px-1.5 py-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-gray-500">Hired</p>
              <p className="text-xs sm:text-sm font-bold text-purple-600">{appStats.hired || 0}</p>
            </div>
          </div>
        )}

        {/* Search Bar - Compact */}
{/* Search + Filters - ONE ROW */}
<div className="flex flex-nowrap overflow-x-auto items-center gap-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  
  {/* Search - always visible */}
  <div className="relative min-w-[140px] flex-1">
    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
    <input
      type="text"
      placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search applications..."}
      value={searchTerm}
      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
      className="w-full pl-7 pr-6 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
    />
    <button
      onClick={handleResetFilters}
      className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
    >
      <RefreshCw size={10} />
    </button>
  </div>

  {/* Jobs-only filters */}
  {activeTab === 'jobs' && (
    <>
      <div className="flex items-center bg-gray-100 p-0.5 rounded-md shrink-0">
        <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
          <Grid size={13} />
        </button>
        <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
          <List size={13} />
        </button>
      </div>

      <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-md shrink-0">
        <button onClick={() => setStatusViewFilter('all')} className={`px-2 py-0.5 rounded text-xs font-medium ${statusViewFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>All</button>
        <button onClick={() => setStatusViewFilter('active')} className={`px-2 py-0.5 rounded text-xs font-medium ${statusViewFilter === 'active' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}>Active</button>
        <button onClick={() => setStatusViewFilter('inactive')} className={`px-2 py-0.5 rounded text-xs font-medium ${statusViewFilter === 'inactive' ? 'bg-gray-200 text-gray-700' : 'text-gray-600'}`}>Inactive</button>
      </div>

      <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0">
        <option value="all">All Depts</option>
        {Array.from(new Set(jobs.map(job => job.department).filter((d): d is string => !!d))).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0">
        <option value="all">All Locs</option>
        {Array.from(new Set(jobs.map(job => job.location).filter((l): l is string => !!l))).map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0">
        <option value="all">All Types</option>
        {Array.from(new Set(jobs.map(job => job.job_type).filter((t): t is string => !!t))).map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0">
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="24">24</option>
        <option value="48">48</option>
      </select>
    </>
  )}

  {/* Applications-only filters */}
  {activeTab === 'applications' && (
    <>
      <select
        value={positionFilter}
        onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }}
        className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0 min-w-[110px]"
      >
        <option value="all">All Positions</option>
        {Array.from(new Set(applications.map(app => app.job_title).filter((t): t is string => !!t))).map(title => (
          <option key={title} value={title}>{title}</option>
        ))}
      </select>
      <select
  value={experienceFilter}
  onChange={(e) => { setExperienceFilter(e.target.value); setCurrentPage(1); }}
  className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0 min-w-[130px]"
>
  {experienceFilterOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>

      <select
        value={statusFilter}
        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0 min-w-[100px]"
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
        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
        className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white shrink-0"
      >
        <option value="10">10/page</option>
        <option value="25">25/page</option>
        <option value="50">50/page</option>
      </select>

      <button
        onClick={async () => { await fetchAppStats(); await fetchApplications(); toast.success('Refreshed!'); }}
        className="hidden sm:flex px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs items-center gap-1.5 shrink-0 hover:bg-blue-100 transition"
      >
        <RefreshCw size={12} />
        Refresh
      </button>
    </>
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
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[300px] sm:max-h-[330px]">
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
              
            )
          ) : (
            // Applications Table
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[320px] sm:max-h-[380px]">
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
       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider table-cell">
  Experience
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
  {filteredItems.map((app: any) => (
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
{app.applicant_name
  ?.split(" ")
  .map((name: string) => name.charAt(0))
  .slice(0, 2)
  .join("")
  .toUpperCase()}                             </span>
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
                       <td className="px-3 sm:px-6 py-4 table-cell">
  <div className="text-sm text-gray-900">{app.experience_level || '—'}</div>
</td>
                        <td className="px-3 sm:px-6 py-4">
                         <select
  value={app.status}
  onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired')}
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
  <>
    <button
      onClick={() => viewResume(app.resume_path!)}
      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
      title="View Resume"
    >
      <Eye size={14} className="sm:size-[16px]" />
    </button>
    <button
      onClick={() => downloadResume(app.resume_path!)}
      className="p-1 text-purple-600 hover:bg-purple-50 rounded-lg transition"
      title="Download Resume"
    >
      <Download size={14} className="sm:size-[16px]" />
    </button>
  </>
)}

{app.status === 'shortlisted' && (
      <button
        onClick={() => openInterviewModal(app)}
        className="p-1 text-purple-600 hover:bg-purple-50 rounded-lg transition"
        title="Schedule Interview"
      >
        <Calendar size={14} className="sm:size-[16px]" />
      </button>
    )}
    <button
      onClick={() => window.open(`mailto:${app.email}`)}
      className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition"
      title="Email Applicant"
    >
      <Mail size={14} className="sm:size-[16px]" />
    </button>
    {/* ADD THIS */}
    <button
      onClick={() => handleDeleteApplication(app.id)}
      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Delete Application"
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
  <div className="mt-3 sm:mt-4 p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-md">
    <div className="flex items-center justify-between gap-2">
      {/* Left side - showing info compact */}
      <div className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
        <span className="hidden sm:inline">Showing </span>
        <span className="font-semibold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span>
        <span className="hidden sm:inline"> - </span>
        <span className="sm:hidden">-</span>
        <span className="font-semibold text-gray-800">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-gray-800">{totalItems}</span>
      </div>
      
      {/* Pagination controls - compact row */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Previous button */}
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                onClick={() => setCurrentPage(pageNumber)}
                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'border border-gray-300 text-gray-700 hover:bg-white'
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
                onClick={() => setCurrentPage(totalPages)}
                className="min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-white transition"
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
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>

{/* ========== TABBED INTERVIEW & FOLLOW‑UP MODAL ========== */}
{showInterviewModal && selectedApp && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowInterviewModal(false)} />
    <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[95vh] overflow-y-auto">
        
        {/* Header (same gradient as job modal) */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-center p-4">
            <div>
              <h3 className="text-white font-bold text-lg">Enquiry Details</h3>
              <p className="text-blue-100 text-sm">
                ID: #{selectedApp.id} • {selectedApp.applicant_name}
              </p>
            </div>
            <button onClick={() => setShowInterviewModal(false)} className="text-white/80 hover:text-white">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Tabs using modalTab state */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {['Overview', 'Interactions', 'Meetings', 'Follow Ups', 'Timeline'].map((tab) => {
              const tabKey = tab.toLowerCase().replace(' ', '_');
              return (
                <button
                  key={tabKey}
                  onClick={() => setModalTab(tabKey)}
                  className={`px-3 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    modalTab === tabKey
                      ? 'border-[#0D47A1] text-[#0D47A1]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content using modalTab */}
        <div className="p-5 space-y-5">
          {/* OVERVIEW */}
          {modalTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Full Name:</span> {selectedApp.applicant_name}</div>
                    <div><span className="font-medium">Email:</span> {selectedApp.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedApp.phone || '—'}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Enquiry Info</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Position:</span> {selectedApp.job_title}</div>
                      <div><span className="font-medium">Experience:</span> {selectedApp.experience_level || '—'}</div>

                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedApp.status)}`}>
                        {selectedApp.status.toUpperCase()}
                      </span>
                    </div>
                    <div><span className="font-medium">Applied:</span> {formatDate(selectedApp.applied_at)}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Cover Letter / Message</h4>
                  <p className="text-sm text-gray-600">{selectedApp.cover_letter || 'No message provided'}</p>
                </div>
               <div className="flex gap-3">
  {/* Email Button */}
  <button
    onClick={() => {
      if (selectedApp?.email) {
        window.location.href = `mailto:${selectedApp.email}?subject=Application%20for%20${encodeURIComponent(selectedApp.job_title || 'position')}&body=Dear%20${encodeURIComponent(selectedApp.applicant_name.split(' ')[0])},%0A%0A`;
      } else {
        toast.error('No email address available');
      }
    }}
    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
  >
    Email
  </button>

  {/* Call Button */}
 <button
  onClick={() => {
    if (selectedApp?.phone) {
      // Always try to initiate a phone call
      window.location.href = `tel:${selectedApp.phone}`;
    } else {
      toast.error('No phone number available');
    }
  }}
  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
>
  Call
</button>

  {/* Close Button */}
  <button
    onClick={() => setShowInterviewModal(false)}
    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
  >
    Close
  </button>
</div>
              </div>
            </div>
          )}

          {/* INTERACTIONS */}
        {modalTab === 'interactions' && (
  <div className="space-y-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">Log a Call / Email</h4>
      <div className="flex gap-3 mb-3">
        <select
          id="interactionType"
          className="px-3 py-2 border rounded-lg text-sm flex-1"
        >
          <option value="call">Call</option>
          <option value="email">Email</option>
        </select>
        <input
          type="text"
          id="interactionSubject"
          placeholder="Subject / Summary"
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>
      <textarea
        id="interactionNotes"
        rows={2}
        placeholder="Notes..."
        className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
      ></textarea>
      <button
        onClick={async () => {
          const typeSelect = document.getElementById('interactionType') as HTMLSelectElement;
          const subjectInput = document.getElementById('interactionSubject') as HTMLInputElement;
          const notesTextarea = document.getElementById('interactionNotes') as HTMLTextAreaElement;
          
          const type = typeSelect.value;
          const subject = subjectInput.value.trim();
          const notes = notesTextarea.value.trim();
          
          if (!subject) {
            toast.error('Please enter a subject/summary');
            return;
          }
          
          try {
            await careerApi.addInteraction(selectedApp!.id, type, subject, notes);
            toast.success('Interaction logged');
            // Clear form
            subjectInput.value = '';
            notesTextarea.value = '';
            // Refresh timeline
            await fetchTimeline(selectedApp!.id);
          } catch (err) {
            toast.error('Failed to log interaction');
          }
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Add Interaction
      </button>
    </div>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {timeline.filter(i => i.type === 'interaction').map(item => (
        <div key={item.id} className="border-l-4 border-purple-400 pl-3 py-2 bg-gray-50 rounded">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{new Date(item.created_at).toLocaleString()}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{item.message}</p>
        </div>
      ))}
      {timeline.filter(i => i.type === 'interaction').length === 0 && (
        <p className="text-gray-400 italic text-sm">No interactions yet.</p>
      )}
    </div>
  </div>
)}

          {/* MEETINGS (interviews) */}
          {modalTab === 'meetings' && (
            <div className="space-y-5">
              {/* Schedule new interview */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-3">
                  <Calendar size={18} /> Schedule Interview
                </h4>
                <form onSubmit={handleScheduleInterview} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="datetime-local"
                      required
                      value={interviewForm.scheduled_at}
                      onChange={e => setInterviewForm({...interviewForm, scheduled_at: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <select
                      value={interviewForm.mode}
                      onChange={e => setInterviewForm({...interviewForm, mode: e.target.value})}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="online">Online</option>
                      <option value="onsite">Onsite</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder={interviewForm.mode === 'online' ? "Meeting link" : "Address / Phone"}
                    value={interviewForm.link_or_address}
                    onChange={e => setInterviewForm({...interviewForm, link_or_address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <textarea
                    placeholder="Interview notes (optional)"
                    rows={2}
                    value={interviewForm.message}
                    onChange={e => setInterviewForm({...interviewForm, message: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Schedule Interview
                  </button>
                </form>
              </div>

              {/* Existing interviews */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-700">Upcoming & Past Interviews</h4>
                {timeline.filter(i => i.type === 'interview').map(item => (
                  <div key={item.id} className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-600" />
                        <span className="font-medium">
                          {new Date(item.scheduled_at).toLocaleString()}
                        </span>
                      </div>
                      <select
                        value={item.status || 'scheduled'}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="text-xs border rounded px-2 py-0.5"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      {item.mode === 'online' ? <Video size={12} /> : <MapPin size={12} />}
                      {item.link_or_address || (item.mode === 'online' ? 'Online meeting' : 'In person')}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{item.message}</p>
                  </div>
                ))}
                {timeline.filter(i => i.type === 'interview').length === 0 && (
                  <p className="text-gray-400 italic text-sm">No interviews scheduled.</p>
                )}
              </div>
            </div>
          )}

          {/* FOLLOW UPS */}
          {modalTab === 'follow_ups' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Add Follow‑up</h4>
                <textarea
                  rows={2}
                  placeholder="Add a note, reminder, feedback..."
                  value={newFollowup}
                  onChange={e => setNewFollowup(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={handleAddFollowup}
                  disabled={!newFollowup.trim()}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  Add Follow‑up
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {timeline.filter(i => i.type === 'followup').map(item => (
                  <div key={item.id} className="border-l-4 border-green-400 pl-3 py-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
                    <p className="text-sm">{item.message}</p>
                  </div>
                ))}
                {timeline.filter(i => i.type === 'followup').length === 0 && (
                  <p className="text-gray-400 italic text-sm">No follow‑ups yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TIMELINE (combined) */}
          {modalTab === 'timeline' && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {timeline.length === 0 && (
                <p className="text-gray-400 italic text-sm">No activity yet.</p>
              )}
              {timeline.map(item => (
                <div key={item.id} className="border-l-4 pl-3 py-1" style={{ borderLeftColor: 
                  item.type === 'interview' ? '#3b82f6' : item.type === 'followup' ? '#10b981' : '#a855f7'
                }}>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'interview' ? <Calendar size={14} className="text-blue-600" /> : 
                       item.type === 'followup' ? <MessageSquare size={14} className="text-green-600" /> :
                       <Phone size={14} className="text-purple-600" />}
                      <span className="font-medium text-sm capitalize">{item.type}</span>
                      {item.scheduled_at && (
                        <span className="text-xs text-gray-500">{new Date(item.scheduled_at).toLocaleString()}</span>
                      )}
                      {!item.scheduled_at && (
                        <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
                      )}
                    </div>
                    {item.type === 'interview' && (
                      <select
                        value={item.status || 'scheduled'}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="text-xs border rounded px-2 py-0.5"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                    )}
                  </div>
                  {item.type === 'interview' && item.mode && (
                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                      {item.mode === 'online' ? <Video size={12} /> : <MapPin size={12} />}
                      {item.link_or_address || (item.mode === 'online' ? 'Online meeting' : 'In person')}
                    </div>
                  )}
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CareerCMS;
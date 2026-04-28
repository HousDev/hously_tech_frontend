import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, MessageSquare, Phone, Mail, 
  Calendar, AlertCircle, CheckCircle, Clock, User, 
  Building, DollarSign, Trash2, Edit, 
  Download, Upload, FileText, Star, TrendingUp,
  Activity, Inbox, Video, PhoneCall, MapPin, 
  ThumbsUp, ThumbsDown, CalendarCheck,
  Meh,
  Grid, List, Check, 
  
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
// ADD this:
import { enquiryApi, type Enquiry, type EnquiryStats } from '../../lib/enquiryApi';





interface EnquiriesCMSProps {
  isSidebarOpen?: boolean;
}

const EnquiriesCMS = ({ isSidebarOpen = false }: EnquiriesCMSProps) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    meeting_type: 'virtual',
    platform: 'Zoom',
    location: '',
    start_time: '',
    end_time: '',
    participants: [] as string[],
    notes: ''
  });
  const [newCallLog, setNewCallLog] = useState({
    type: 'outgoing',
    subject: '',
    content: '',
    duration: 0,
    sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
    metadata: {
      call_type: 'follow_up' as 'cold' | 'follow_up' | 'discovery' | 'closing'
    }
  });
  const [newFollowUp, setNewFollowUp] = useState({
    type: 'call' as 'call' | 'email' | 'meeting' | 'task',
    title: '',
    description: '',
    due_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [newParticipant, setNewParticipant] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    dateRange: 'all',
    hasFollowUp: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedEnquiries, setSelectedEnquiries] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [filters]);

  

 // REPLACE with:
const fetchEnquiries = async () => {
  try {
    setLoading(true);
    const data = await enquiryApi.getAll(filters);
    setEnquiries(data);
  } catch (error: any) {
    console.error('Failed to fetch enquiries:', error);
    toast.error(error.message || 'Failed to load enquiries');
  } finally {
    setLoading(false);
  }
};

  // REPLACE with:
const fetchEnquiryDetails = async (id: number) => {
  try {
    return await enquiryApi.getDetails(id);
  } catch (error) {
    console.error('Failed to fetch enquiry details:', error);
    return null;
  }
};

  // REPLACE with:
const fetchStats = async () => {
  try {
    const data = await enquiryApi.getStats();
    setStats(data);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

  const handleViewDetails = async (enquiry: Enquiry) => {
    try {
      const detailedEnquiry = await fetchEnquiryDetails(enquiry.id);
      if (detailedEnquiry) {
        setSelectedEnquiry(detailedEnquiry);
      } else {
        setSelectedEnquiry(enquiry);
      }
      setIsDetailModalOpen(true);
      setActiveTab('overview');
    } catch (error) {
      toast.error('Failed to load enquiry details');
    }
  };

  // REPLACE with:
const handleUpdateStatus = async (id: number, status: string) => {
  toast.promise(
    enquiryApi.updateStatus(id, status as Enquiry['status']),
    {
      loading: 'Updating status...',
      success: () => {
        setEnquiries(enquiries.map(e => 
          e.id === id ? { ...e, status: status as Enquiry['status'] } : e
        ));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(prev => prev ? { ...prev, status: status as Enquiry['status'] } : null);
        }
        fetchStats();
        return 'Status updated successfully!';
      },
      error: 'Failed to update status',
    }
  );
};

  // REPLACE with:
const handleAddNote = async () => {
  if (!selectedEnquiry || !newNote.trim()) {
    toast.error('Please enter a note');
    return;
  }

  toast.promise(
    enquiryApi.addInteraction(selectedEnquiry.id, {
      type: 'note',
      direction: 'outgoing',
      subject: `Note added to enquiry #${selectedEnquiry.id}`,
      content: newNote.trim(),
      sentiment: 'neutral',
      metadata: {}
    }),
    {
      loading: 'Adding note...',
      success: (updatedInteraction) => {
        setEnquiries(enquiries.map(e => 
          e.id === selectedEnquiry.id ? {
            ...e,
            interaction_history: [...(e.interaction_history || []), updatedInteraction]
          } : e
        ));
        if (selectedEnquiry) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            interaction_history: [...(selectedEnquiry.interaction_history || []), updatedInteraction]
          });
        }
        setNewNote('');
        setIsNoteModalOpen(false);
        return 'Note added successfully!';
      },
      error: (err) => err.message || 'Failed to add note',
    }
  );
};

 // REPLACE with:
const handleScheduleMeeting = async () => {
  if (!selectedEnquiry) return;

  if (!newMeeting.title.trim()) {
    toast.error('Meeting title is required');
    return;
  }
  
  if (!newMeeting.start_time || !newMeeting.end_time) {
    toast.error('Start and end times are required');
    return;
  }
  
  const start = new Date(newMeeting.start_time);
  const end = new Date(newMeeting.end_time);
  
  if (start >= end) {
    toast.error('End time must be after start time');
    return;
  }

  toast.promise(
    enquiryApi.scheduleMeeting(selectedEnquiry.id, {
      title: newMeeting.title,
      description: newMeeting.description,
      meeting_type: newMeeting.meeting_type,
      platform: newMeeting.meeting_type === 'virtual' ? newMeeting.platform : undefined,
      location: newMeeting.meeting_type === 'in_person' ? newMeeting.location : undefined,
      start_time: newMeeting.start_time,
      end_time: newMeeting.end_time,
      participants: newMeeting.participants,
      notes: newMeeting.notes,
      status: 'scheduled'
    }),
    {
      loading: 'Scheduling meeting...',
      success: (newMeetingData) => {
        setEnquiries(enquiries.map(e => 
          e.id === selectedEnquiry.id ? {
            ...e,
            scheduled_meetings: [...(e.scheduled_meetings || []), newMeetingData]
          } : e
        ));
        if (selectedEnquiry) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            scheduled_meetings: [...(selectedEnquiry.scheduled_meetings || []), newMeetingData]
          });
        }
        setNewMeeting({
          title: '',
          description: '',
          meeting_type: 'virtual',
          platform: 'Zoom',
          location: '',
          start_time: '',
          end_time: '',
          participants: [],
          notes: ''
        });
        setIsMeetingModalOpen(false);
        return 'Meeting scheduled successfully!';
      },
      error: (err) => err.message || 'Failed to schedule meeting',
    }
  );
};

 // REPLACE with:
const handleLogCall = async () => {
  if (!selectedEnquiry) return;

  if (!newCallLog.content.trim()) {
    toast.error('Call summary is required');
    return;
  }

  toast.promise(
    enquiryApi.addInteraction(selectedEnquiry.id, {
      type: 'call',
      direction: newCallLog.type,
      subject: `Call with ${selectedEnquiry.full_name}`,
      content: newCallLog.content.trim(),
      duration: newCallLog.duration || 0,
      sentiment: newCallLog.sentiment,
      metadata: {
        call_type: newCallLog.metadata.call_type
      }
    }),
    {
      loading: 'Logging call...',
      success: (newInteraction) => {
        setEnquiries(enquiries.map(e => 
          e.id === selectedEnquiry.id ? {
            ...e,
            interaction_history: [...(e.interaction_history || []), newInteraction]
          } : e
        ));
        if (selectedEnquiry) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            interaction_history: [...(selectedEnquiry.interaction_history || []), newInteraction]
          });
        }
        setNewCallLog({
          type: 'outgoing',
          subject: '',
          content: '',
          duration: 0,
          sentiment: 'neutral',
          metadata: { call_type: 'follow_up' }
        });
        setIsCallLogModalOpen(false);
        return 'Call logged successfully!';
      },
      error: (err) => err.message || 'Failed to log call',
    }
  );
};

  // REPLACE with:
const handleCreateFollowUp = async () => {
  if (!selectedEnquiry) return;

  toast.promise(
    enquiryApi.createFollowUp(selectedEnquiry.id, {
      type: newFollowUp.type,
      title: newFollowUp.title,
      description: newFollowUp.description,
      due_date: newFollowUp.due_date,
      priority: newFollowUp.priority
    }),
    {
      loading: 'Creating follow-up...',
      success: (newFollowUpData) => {
        setEnquiries(enquiries.map(e => 
          e.id === selectedEnquiry.id ? {
            ...e,
            follow_up_actions: [...(e.follow_up_actions || []), newFollowUpData]
          } : e
        ));
        if (selectedEnquiry) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            follow_up_actions: [...(selectedEnquiry.follow_up_actions || []), newFollowUpData]
          });
        }
        setNewFollowUp({
          type: 'call',
          title: '',
          description: '',
          due_date: '',
          priority: 'medium'
        });
        setIsFollowUpModalOpen(false);
        return 'Follow-up created successfully!';
      },
      error: 'Failed to create follow-up',
    }
  );
};

 // REPLACE with:
const handleDeleteEnquiry = async (id: number) => {
  const deleteToast = toast.loading('Deleting enquiry...');

  try {
    await enquiryApi.delete(id);
    setEnquiries(enquiries.filter(e => e.id !== id));
    fetchStats();
    toast.success('Deleted successfully', { id: deleteToast });
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete enquiry', { id: deleteToast });
  }
};

// REPLACE with:
const handleBulkDelete = async () => {
  if (selectedEnquiries.length === 0) {
    toast.error('Please select enquiries to delete');
    return;
  }

  const deleteToast = toast.loading(`Deleting ${selectedEnquiries.length} enquiry(s)...`);

  try {
    await enquiryApi.bulkDelete(selectedEnquiries);
    toast.success('Deleted successfully', { id: deleteToast });
    setSelectedEnquiries([]);
    fetchEnquiries();
    fetchStats();
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete enquiries', { id: deleteToast });
  }
};

// Add state for export options
const [exportOptions, ] = useState({
  mode: 'selected', // 'selected', 'filtered', or 'all'
  includeInteractions: false,
  includeMeetings: false,
  includeFollowUps: false,
  dateFormat: 'MM/DD/YYYY'
});


const handleExportCSV = () => {
  let dataToExport: Enquiry[];
  
  switch (exportOptions.mode) {
    case 'selected':
      if (selectedEnquiries.length === 0) {
        toast.error('Please select enquiries to export');
        return;
      }
      dataToExport = enquiries.filter(e => selectedEnquiries.includes(e.id));
      break;
    
    case 'filtered':
      dataToExport = filteredEnquiries;
      break;
    
    case 'all':
    default:
      dataToExport = enquiries;
      break;
  }
  
  if (dataToExport.length === 0) {
    toast.error('No data to export');
    return;
  }
  
  // Build headers based on options
  let headers = [
    'ID', 'Full Name', 'Company', 'Email', 'Phone', 
    'Inquiry Type', 'Service Type', 'Budget', 'Status', 
    'Priority', 'Created At', 'Updated At'
  ];
  
  if (exportOptions.includeInteractions) {
    headers.push('Total Interactions', 'Last Interaction Date', 'Last Interaction Type');
  }
  
  if (exportOptions.includeMeetings) {
    headers.push('Total Meetings', 'Next Meeting Date', 'Next Meeting Title');
  }
  
  if (exportOptions.includeFollowUps) {
    headers.push('Pending Follow-ups', 'Overdue Follow-ups', 'Next Follow-up Date');
  }
  
  headers.push('Message');
  
  const csvData = dataToExport.map(enquiry => {
    const row: any[] = [
      enquiry.id,
      `"${enquiry.full_name}"`,
      `"${enquiry.company_name || ''}"`,
      enquiry.email,
      enquiry.phone_number || '',
      enquiry.inquiry_type,
      enquiry.service_type || '',
      enquiry.project_budget || '',
      enquiry.status,
      enquiry.priority,
      formatDateForCSV(enquiry.created_at, exportOptions.dateFormat),
      formatDateForCSV(enquiry.updated_at, exportOptions.dateFormat)
    ];
    
    if (exportOptions.includeInteractions) {
      const interactions = enquiry.interaction_history || [];
      const lastInteraction = interactions[0];
      row.push(
        interactions.length,
        lastInteraction ? formatDateForCSV(lastInteraction.created_at, exportOptions.dateFormat) : '',
        lastInteraction ? lastInteraction.type : ''
      );
    }
    
    if (exportOptions.includeMeetings) {
      const meetings = enquiry.scheduled_meetings || [];
      const upcomingMeetings = meetings.filter(m => 
        m.status === 'scheduled' && new Date(m.start_time) > new Date()
      ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      
      row.push(
        meetings.length,
        upcomingMeetings.length > 0 ? formatDateForCSV(upcomingMeetings[0].start_time, exportOptions.dateFormat) : '',
        upcomingMeetings.length > 0 ? `"${upcomingMeetings[0].title}"` : ''
      );
    }
    
    if (exportOptions.includeFollowUps) {
      const followUps = enquiry.follow_up_actions || [];
      const pendingFollowUps = followUps.filter(f => f.status === 'pending');
      const overdueFollowUps = pendingFollowUps.filter(f => new Date(f.due_date) < new Date());
      const nextFollowUp = pendingFollowUps.sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )[0];
      
      row.push(
        pendingFollowUps.length,
        overdueFollowUps.length,
        nextFollowUp ? formatDateForCSV(nextFollowUp.due_date, exportOptions.dateFormat) : ''
      );
    }
    
    row.push(`"${enquiry.message.replace(/"/g, '""')}"`);
    return row;
  });
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Generate filename
  let filename = `enquiries_export_${new Date().toISOString().split('T')[0]}`;
  filename += `_${exportOptions.mode}`;
  filename += `_${dataToExport.length}_records`;
  
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  toast.success(`Exported ${dataToExport.length} enquiry(s)`);
};

// Helper function for date formatting
const formatDateForCSV = (dateString: string, format: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
};

// In your JSX, update the export section
<div className="flex items-center space-x-2">
  <button
    onClick={() => setIsNoteModalOpen(true)}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded flex items-center space-x-2 text-xs"
  >
    <Download size={14} />
    <span>
      Export CSV 
      {selectedEnquiries.length > 0 && ` (${selectedEnquiries.length} selected)`}
    </span>
  </button>
</div>

  // REPLACE with:
const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  toast.promise(
    enquiryApi.importCSV(file),
    {
      loading: 'Importing CSV...',
      success: (result:any) => {
        fetchEnquiries();
        fetchStats();
        return result.message || `Successfully imported ${result.successful} enquiries`;
      },
      error: 'Failed to import CSV',
    }
  );

  e.target.value = '';
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700 border-blue-300',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-300',
      contacted: 'bg-green-100 text-green-700 border-green-300',
      closed: 'bg-gray-100 text-gray-700 border-gray-300',
      converted: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };


  // Filter enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const matchSearch = e.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                       e.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                       e.message.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'all' || e.status === filters.status;
    const matchPriority = filters.priority === 'all' || e.priority === filters.priority;
    const matchFollowUp = filters.hasFollowUp === 'all' ? true :
                         filters.hasFollowUp === 'yes' ? (e.follow_up_actions && e.follow_up_actions.length > 0) :
                         (e.follow_up_actions && e.follow_up_actions.length === 0);
    return matchSearch && matchStatus && matchPriority && matchFollowUp;
  });

  // Selection handlers
  const handleSelectAll = () => {
    const currentPageEnquiries = filteredEnquiries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    
    if (selectedEnquiries.length === currentPageEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(currentPageEnquiries.map(enquiry => enquiry.id));
    }
  };

  const handleSelectEnquiry = (id: number) => {
    if (selectedEnquiries.includes(id)) {
      setSelectedEnquiries(selectedEnquiries.filter(enquiryId => enquiryId !== id));
    } else {
      setSelectedEnquiries([...selectedEnquiries, id]);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);

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

  // Stats cards
  const statsCards = [
    { label: 'Total', value: stats?.total || 0, icon: FileText, color: 'indigo' },
    { label: 'New', value: stats?.new || 0, icon: Star, color: 'blue' },
    { label: 'In Progress', value: stats?.in_progress || 0, icon: Clock, color: 'purple' },
    { label: 'Contacted', value: stats?.contacted || 0, icon: CheckCircle, color: 'green' },
    { label: 'Converted', value: stats?.converted || 0, icon: TrendingUp, color: 'emerald' },
    { label: 'Urgent', value: stats?.urgent || 0, icon: AlertCircle, color: 'red' },
    { label: 'Today', value: stats?.today || 0, icon: CalendarCheck, color: 'orange' }
  ];

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Toaster position="top-right" />
      
      {/* Main Container */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 sm:ml-0' : ''
      }`}>
        {/* Header - Fixed with sidebar consideration */}
     <div className={`${isSidebarOpen ? 'relative sm:sticky sm:top-4 lg:top-16' : 'sticky top-0 sm:top-4 lg:top-16'} z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}>
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Enquiries Management
          </h1>
        </div>
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
            <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
              Enquiries ({enquiries.length})
            </h2>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Track & manage relationships</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5">
              <label className="cursor-pointer">
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                <div className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-md items-center gap-1.5 transition-all shadow-sm text-xs flex">
                  <Upload size={12} />
                  <span>Import</span>
                </div>
              </label>
              <button
                onClick={handleExportCSV}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md items-center gap-1.5 transition-all shadow-sm text-xs flex"
              >
                <Download size={12} />
                <span>Export</span>
              </button>
            </div>
            <div className="sm:hidden flex items-center gap-1.5 ml-auto">
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

        {/* Compact Stats Cards */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-1.5 mb-2 sm:mb-2.5">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] sm:text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className={`text-sm sm:text-base font-bold text-${stat.color}-600 mt-0.5`}>{stat.value}</p>
                </div>
                <div className={`p-1 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Stats Summary */}
        <div className="sm:hidden grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-2">
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Total</p>
            <p className="text-sm font-bold text-indigo-600">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">New</p>
            <p className="text-sm font-bold text-blue-600">{stats?.new || 0}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Urgent</p>
            <p className="text-sm font-bold text-red-600">{stats?.urgent || 0}</p>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
            <p className="text-[9px] text-gray-500">Today</p>
            <p className="text-sm font-bold text-orange-600">{stats?.today || 0}</p>
          </div>
        </div>

        {/* Compact Search and Filter Bar */}
        <div className="bg-white rounded p-1.5 sm:p-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({...filters, search: e.target.value});
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({...filters, status: e.target.value});
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <select
                  value={filters.priority}
                  onChange={(e) => {
                    setFilters({...filters, priority: e.target.value});
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-[9px] sm:text-xs text-gray-600 hidden sm:inline">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                <span className="text-[9px] sm:text-xs text-gray-600 hidden sm:inline">/pg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

        {/* Bulk Actions Bar */}
        {selectedEnquiries.length > 0 && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-blue-800">
                    {selectedEnquiries.length} selected
                  </span>
                </div>
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
              >
                Delete ({selectedEnquiries.length})
              </button>
            </div>
          </div>
        )}

        {/* Grid View for Mobile */}
        {viewMode === 'grid' && (!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="sm:hidden grid grid-cols-1 gap-3 mb-4">
            {currentEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedEnquiries.includes(enquiry.id)}
                      onChange={() => handleSelectEnquiry(enquiry.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                      #{enquiry.id}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(enquiry.priority)}`}>
                    {enquiry.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {enquiry.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{enquiry.full_name}</p>
                    <p className="text-xs text-gray-500">{enquiry.email}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-900 mb-1">{enquiry.inquiry_type}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{enquiry.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(enquiry.status)} cursor-pointer`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                      <option value="converted">Converted</option>
                    </select>
                    <span className="text-xs text-gray-500">
                      {formatDate(enquiry.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-600">
                      {enquiry.interaction_history?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(enquiry)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setIsNoteModalOpen(true);
                      }}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEnquiry(enquiry.id)}
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
            {currentEnquiries.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-lg">No enquiries found</p>
                {filters.search || filters.status !== 'all' || filters.priority !== 'all' ? (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <label className="cursor-pointer">
                      <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
                      <div className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm">
                        <Upload size={14} className="sm:size-[16px]" />
                        <span>Import CSV</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-390px)] sm:max-h-[calc(100vh-370px)]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-20">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8 sm:w-10">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedEnquiries.length === currentEnquiries.length && currentEnquiries.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 sm:w-16">
                          ID
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 sm:w-48">
                          Customer
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 sm:w-32">
                          Inquiry Type
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 sm:w-24">
                          Status
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 sm:w-20">
                          Priority
                        </th>
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12 sm:w-16">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentEnquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedEnquiries.includes(enquiry.id)}
                                onChange={() => handleSelectEnquiry(enquiry.id)}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <span className="text-xs sm:text-sm font-bold text-indigo-600">#{enquiry.id}</span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                {enquiry.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{enquiry.full_name}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{enquiry.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-gray-900">{enquiry.inquiry_type}</span>
                              {enquiry.service_type && (
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">{enquiry.service_type}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <select
                              value={enquiry.status}
                              onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                              className={`text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border ${getStatusColor(enquiry.status)} cursor-pointer`}
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                              <option value="converted">Converted</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border ${getPriorityColor(enquiry.priority)}`}>
                              {enquiry.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <button
                                onClick={() => handleViewDetails(enquiry)}
                                className="p-1 sm:p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
                                title="View Details"
                              >
                                <Eye size={12} className="sm:size-[18px]" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedEnquiry(enquiry);
                                  setIsNoteModalOpen(true);
                                }}
                                className="p-1 sm:p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100"
                                title="Add Note"
                              >
                                <Edit size={12} className="sm:size-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDeleteEnquiry(enquiry.id)}
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
              {filteredEnquiries.length > 0 && (
  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {/* Left side - Showing info compact */}
      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
        <span className="hidden sm:inline">Showing </span>
        <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
        <span className="hidden sm:inline"> - </span>
        <span className="sm:hidden">-</span>
        <span className="font-semibold text-gray-800">
          {Math.min(indexOfLastItem, filteredEnquiries.length)}
        </span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-gray-800">{filteredEnquiries.length}</span>
        
        {/* Filter indicators - compact */}
        {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
          <span className="ml-1 text-indigo-600 text-[8px] sm:text-[10px] hidden sm:inline">
            {filters.search && `🔍 "${filters.search.slice(0, 8)}${filters.search.length > 8 ? '…' : ''}"`}
            {filters.status !== 'all' && ` • ${filters.status === 'in_progress' ? 'In Prog' : filters.status === 'converted' ? 'Conv' : filters.status}`}
            {filters.priority !== 'all' && ` • ${filters.priority === 'urgent' ? 'Urg' : filters.priority === 'medium' ? 'Med' : filters.priority === 'high' ? 'High' : filters.priority}`}
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
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
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

      {/* Enhanced Detail Modal with Tabs - Responsive */}
     {isDetailModalOpen && selectedEnquiry && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-lg">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Enquiry Details</h2>
              <p className="text-blue-100 text-xs sm:text-xs mt-0.5">ID: #{selectedEnquiry.id} • {selectedEnquiry.full_name}</p>
            </div>
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-2.5 overflow-x-auto">
            {['overview', 'interactions', 'meetings', 'follow-ups', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all text-xs whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-blue-600'
                    : 'text-blue-100 hover:text-white hover:bg-white/15'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-110px)]">
         {activeTab === 'overview' && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
    {/* Left Column - Customer Info & Enquiry Info */}
    <div className="lg:col-span-1 space-y-3">
      {/* Customer Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-xs">
          <User className="w-4 h-4 mr-1.5 text-blue-600" />
          Customer Information
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
            <p className="font-semibold text-gray-900 text-sm">{selectedEnquiry.full_name}</p>
          </div>
          {selectedEnquiry.company_name && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
              <div className="flex items-center">
                <Building className="w-4 h-4 text-gray-400 mr-2" />
                <p className="font-medium text-gray-900 text-sm">{selectedEnquiry.company_name}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-indigo-600 hover:underline text-sm">
                {selectedEnquiry.email}
              </a>
            </div>
          </div>
          {selectedEnquiry.phone_number && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <a href={`tel:${selectedEnquiry.phone_number}`} className="font-medium text-indigo-600 hover:underline text-sm">
                  {selectedEnquiry.phone_number}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enquiry Info Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-xs">
          <FileText className="w-4 h-4 mr-1.5 text-purple-600" />
          Enquiry Info
        </h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Inquiry Type</p>
            <p className="font-semibold text-gray-900 text-sm">{selectedEnquiry.inquiry_type}</p>
          </div>
          {selectedEnquiry.service_type && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Service Type</p>
              <p className="font-medium text-gray-900 text-sm">{selectedEnquiry.service_type}</p>
            </div>
          )}
          {selectedEnquiry.project_budget && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Budget</p>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                <p className="font-medium text-gray-900 text-sm">{selectedEnquiry.project_budget}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(selectedEnquiry.status)}`}>
              {selectedEnquiry.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Priority</p>
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${getPriorityColor(selectedEnquiry.priority)}`}>
              {selectedEnquiry.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column - Message, Quick Actions, Timeline */}
    <div className="lg:col-span-2 space-y-3">
      {/* Message Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-xs">
          <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-600" />
          Message
        </h3>
        <div className="bg-white rounded-lg p-2.5 border border-emerald-200">
          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed max-h-32 overflow-y-auto">{selectedEnquiry.message}</p>
        </div>
      </div>

      {selectedEnquiry.notes && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-xs">
            <Edit className="w-4 h-4 mr-1.5 text-amber-600" />
            Internal Notes
          </h3>
          <div className="bg-white rounded-lg p-2.5 border border-amber-200">
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed max-h-24 overflow-y-auto">{selectedEnquiry.notes}</p>
          </div>
        </div>
      )}

      {/* Quick Actions Card with Checkboxes */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-xs">
          <Activity className="w-4 h-4 mr-1.5 text-rose-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="meeting" 
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
              checked={selectedEnquiry.interaction_history?.some(i => i.type === 'meeting')}
              readOnly
            />
            <label htmlFor="meeting" className="text-xs text-gray-700 cursor-pointer">Meeting</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="call" 
              className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" 
              checked={selectedEnquiry.interaction_history?.some(i => i.type === 'call')}
              readOnly
            />
            <label htmlFor="call" className="text-xs text-gray-700 cursor-pointer">Call</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="followup" 
              className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500" 
              checked={selectedEnquiry.follow_up_actions && selectedEnquiry.follow_up_actions.length > 0}
              readOnly
            />
            <label htmlFor="followup" className="text-xs text-gray-700 cursor-pointer">Follow-up</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="note" 
              className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500" 
              checked={selectedEnquiry.interaction_history?.some(i => i.type === 'note')}
              readOnly
            />
            <label htmlFor="note" className="text-xs text-gray-700 cursor-pointer">Note</label>
          </div>
        </div>
      </div>

      {/* Timeline Card with Email/Call/Close buttons */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 flex items-center text-xs">
            <Calendar className="w-4 h-4 mr-1.5 text-slate-600" />
            Timeline
          </h3>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Created:</span> {new Date(selectedEnquiry.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900">Created</p>
              <p className="text-xs text-gray-500">{formatDate(selectedEnquiry.created_at)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900">Last Updated</p>
              <p className="text-xs text-gray-500">{formatDate(selectedEnquiry.updated_at)}</p>
            </div>
          </div>
        </div>
        
        {/* Email/Call/Close buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
          <a
            href={`mailto:${selectedEnquiry.email}?subject=Regarding your enquiry #${selectedEnquiry.id}`}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1.5 text-xs flex-1"
          >
            <Mail size={12} />
            <span>Email</span>
          </a>
          {selectedEnquiry.phone_number && (
            <a
              href={`tel:${selectedEnquiry.phone_number}`}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center space-x-1.5 text-xs flex-1"
            >
              <Phone size={12} />
              <span>Call</span>
            </a>
          )}
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 font-medium text-xs flex-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {activeTab === 'interactions' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Interaction History</h3>
                <button
                  onClick={() => setIsCallLogModalOpen(true)}
                  className="bg-blue-600 text-white px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs hover:bg-blue-700"
                >
                  <PhoneCall size={14} />
                  <span>Log Call</span>
                </button>
              </div>
              
              {selectedEnquiry.interaction_history && selectedEnquiry.interaction_history.length > 0 ? (
                <div className="space-y-2">
                  {selectedEnquiry.interaction_history.map((interaction) => (
                    <div key={interaction.id} className="bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start space-x-2 mb-2">
                        {interaction.type === 'call' ? (
                          <PhoneCall className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        ) : interaction.type === 'email' ? (
                          <Mail className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : interaction.type === 'meeting' ? (
                          <Video className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-xs">{interaction.subject}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              interaction.direction === 'outgoing' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {interaction.direction === 'outgoing' ? 'Out' : 'In'}
                            </span>
                            {interaction.duration && (
                              <span className="text-xs text-gray-500">{interaction.duration}m</span>
                            )}
                            <span className="text-xs text-gray-400">{formatDate(interaction.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      {interaction.content && (
                        <p className="text-gray-600 text-xs leading-relaxed ml-6 line-clamp-2">{interaction.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No interactions yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Scheduled Meetings</h3>
                <button
                  onClick={() => setIsMeetingModalOpen(true)}
                  className="bg-blue-600 text-white px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs hover:bg-blue-700"
                >
                  <Video size={14} />
                  <span>Schedule</span>
                </button>
              </div>
              
              {selectedEnquiry.scheduled_meetings && selectedEnquiry.scheduled_meetings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedEnquiry.scheduled_meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
                      <h4 className="font-semibold text-gray-900 text-xs mb-1.5">{meeting.title}</h4>
                      <div className="flex flex-wrap items-center gap-1 mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {meeting.meeting_type}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          {formatDate(meeting.start_time)}
                        </div>
                        {meeting.location && (
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin className="w-3 h-3 mr-1.5" />
                            {meeting.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No meetings scheduled</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'follow-ups' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Follow-up Actions</h3>
                <button
                  onClick={() => setIsFollowUpModalOpen(true)}
                  className="bg-blue-600 text-white px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs hover:bg-blue-700"
                >
                  <Clock size={14} />
                  <span>Create</span>
                </button>
              </div>
              
              {selectedEnquiry.follow_up_actions && selectedEnquiry.follow_up_actions.length > 0 ? (
                <div className="space-y-2">
                  {selectedEnquiry.follow_up_actions.map((followUp) => (
                    <div key={followUp.id} className="bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 text-xs">{followUp.title}</h4>
                        <span className="text-xs text-gray-500">{formatDate(followUp.due_date)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(followUp.priority)}`}>
                          {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          followUp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          followUp.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {followUp.status.replace('_', ' ').charAt(0).toUpperCase() + followUp.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">{followUp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No follow-ups yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Complete Timeline</h3>
              
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-3">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0.5 w-4 h-4 bg-blue-100 rounded-full border-2 border-blue-600"></div>
                    <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 text-xs">Enquiry Created</h4>
                        <span className="text-xs text-gray-500">{formatDate(selectedEnquiry.created_at)}</span>
                      </div>
                      <p className="text-gray-600 text-xs">By {selectedEnquiry.full_name}</p>
                    </div>
                  </div>

                  {selectedEnquiry.interaction_history?.slice(0, 3).map((interaction) => (
                    <div key={interaction.id} className="relative pl-8">
                      <div className={`absolute left-0 top-0.5 w-4 h-4 rounded-full border-2 ${
                        interaction.type === 'call' ? 'border-blue-600 bg-blue-100' :
                        interaction.type === 'email' ? 'border-green-600 bg-green-100' :
                        'border-purple-600 bg-purple-100'
                      }`}></div>
                      <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-xs">{interaction.subject}</h4>
                          <span className="text-xs text-gray-500">{formatDate(interaction.created_at)}</span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                          interaction.direction === 'outgoing' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {interaction.direction === 'outgoing' ? 'Outgoing' : 'Incoming'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedEnquiry.interaction_history && selectedEnquiry.interaction_history.length > 3 && (
                    <div className="text-center py-1">
                      <span className="text-xs text-gray-500">+{selectedEnquiry.interaction_history.length - 3} more interactions</span>
                    </div>
                  )}

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0.5 w-4 h-4 bg-gray-100 rounded-full border-2 border-gray-600"></div>
                    <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 text-xs">Last Updated</h4>
                        <span className="text-xs text-gray-500">{formatDate(selectedEnquiry.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-4 py-2.5 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={`mailto:${selectedEnquiry.email}`}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1.5 text-xs flex-1 sm:flex-none justify-center"
            >
              <Mail size={14} />
              <span>Email</span>
            </a>
            {selectedEnquiry.phone_number && (
              <a
                href={`tel:${selectedEnquiry.phone_number}`}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center space-x-1.5 text-xs flex-1 sm:flex-none justify-center"
              >
                <Phone size={14} />
                <span>Call</span>
              </a>
            )}
          </div>
          <button
            onClick={() => setIsDetailModalOpen(false)}
            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 font-medium transition-all text-xs w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Meeting Schedule Modal - Responsive */}
      {isMeetingModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMeetingModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-bold">Schedule Meeting</h3>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1">With {selectedEnquiry.full_name}</p>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                    <input
                      type="text"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="e.g., Project Discovery Call"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                      rows={2}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      placeholder="Meeting agenda and discussion points..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
                      <select
                        value={newMeeting.meeting_type}
                        onChange={(e) => setNewMeeting({...newMeeting, meeting_type: e.target.value as 'virtual' | 'in_person'})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="virtual">Virtual Meeting</option>
                        <option value="in_person">In-Person Meeting</option>
                      </select>
                    </div>
                    
                    {newMeeting.meeting_type === 'virtual' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <select
                          value={newMeeting.platform}
                          onChange={(e) => setNewMeeting({...newMeeting, platform: e.target.value})}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                          <option value="Zoom">Zoom</option>
                          <option value="Google Meet">Google Meet</option>
                          <option value="Microsoft Teams">Microsoft Teams</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                    
                    {newMeeting.meeting_type === 'in_person' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={newMeeting.location}
                          onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Meeting address"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                      <input
                        type="datetime-local"
                        value={newMeeting.start_time}
                        onChange={(e) => setNewMeeting({...newMeeting, start_time: e.target.value})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                      <input
                        type="datetime-local"
                        value={newMeeting.end_time}
                        onChange={(e) => setNewMeeting({...newMeeting, end_time: e.target.value})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                    <div className="flex items-center mb-2">
                      <input
                        type="text"
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Add participant email"
                      />
                      <button
                        onClick={() => {
                          if (newParticipant.trim()) {
                            setNewMeeting({
                              ...newMeeting,
                              participants: [...newMeeting.participants, newParticipant.trim()]
                            });
                            setNewParticipant('');
                          }
                        }}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    {newMeeting.participants.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                        {newMeeting.participants.map((participant, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                            {participant}
                            <button
                              onClick={() => {
                                setNewMeeting({
                                  ...newMeeting,
                                  participants: newMeeting.participants.filter((_, i) => i !== index)
                                });
                              }}
                              className="ml-1 text-indigo-600 hover:text-indigo-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={newMeeting.notes}
                      onChange={(e) => setNewMeeting({...newMeeting, notes: e.target.value})}
                      rows={2}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsMeetingModalOpen(false)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleMeeting}
                    disabled={!newMeeting.title || !newMeeting.start_time || !newMeeting.end_time}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-sm w-full sm:w-auto"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Log Modal - Responsive */}
      {isCallLogModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCallLogModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-bold">Log Call</h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">With {selectedEnquiry.full_name}</p>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
                      <select
                        value={newCallLog.type}
                        onChange={(e) => setNewCallLog({...newCallLog, type: e.target.value as 'outgoing' | 'incoming'})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                      >
                        <option value="outgoing">Outgoing</option>
                        <option value="incoming">Incoming</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                      <select
                        value={newCallLog.metadata.call_type}
                        onChange={(e) => setNewCallLog({
                          ...newCallLog,
                          metadata: {...newCallLog.metadata, call_type: e.target.value as 'cold' | 'follow_up' | 'discovery' | 'closing'}
                        })}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                      >
                        <option value="cold">Cold Call</option>
                        <option value="follow_up">Follow-up</option>
                        <option value="discovery">Discovery</option>
                        <option value="closing">Closing</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newCallLog.duration}
                        onChange={(e) => setNewCallLog({...newCallLog, duration: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setNewCallLog({...newCallLog, sentiment: 'positive'})}
                          className={`flex-1 p-2 rounded-lg flex items-center justify-center space-x-2 text-xs ${
                            newCallLog.sentiment === 'positive' 
                              ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <ThumbsUp size={14} />
                          <span>Positive</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCallLog({...newCallLog, sentiment: 'neutral'})}
                          className={`flex-1 p-2 rounded-lg flex items-center justify-center space-x-2 text-xs ${
                            newCallLog.sentiment === 'neutral' 
                              ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <Meh size={14} />
                          <span>Neutral</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCallLog({...newCallLog, sentiment: 'negative'})}
                          className={`flex-1 p-2 rounded-lg flex items-center justify-center space-x-2 text-xs ${
                            newCallLog.sentiment === 'negative' 
                              ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          <ThumbsDown size={14} />
                          <span>Negative</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call Summary *</label>
                    <textarea
                      value={newCallLog.content}
                      onChange={(e) => setNewCallLog({...newCallLog, content: e.target.value})}
                      rows={3}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                      placeholder="Brief summary of the conversation, key points discussed, and next steps..."
                    />
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsCallLogModalOpen(false)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogCall}
                    disabled={!newCallLog.content.trim()}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-sm w-full sm:w-auto"
                  >
                    Log Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Action Modal - Responsive */}
      {isFollowUpModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFollowUpModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-bold">Create Follow-up Action</h3>
                <p className="text-orange-100 text-xs sm:text-sm mt-1">For {selectedEnquiry.full_name}</p>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Type</label>
                    <select
                      value={newFollowUp.type}
                      onChange={(e) => setNewFollowUp({...newFollowUp, type: e.target.value as 'call' | 'email' | 'meeting' | 'task'})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="call">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="task">Task</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={newFollowUp.title}
                      onChange={(e) => setNewFollowUp({...newFollowUp, title: e.target.value})}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="e.g., Send proposal, Follow-up call, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newFollowUp.description}
                      onChange={(e) => setNewFollowUp({...newFollowUp, description: e.target.value})}
                      rows={2}
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                      placeholder="Detailed description of the follow-up action..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                      <input
                        type="datetime-local"
                        value={newFollowUp.due_date}
                        onChange={(e) => setNewFollowUp({...newFollowUp, due_date: e.target.value})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={newFollowUp.priority}
                        onChange={(e) => setNewFollowUp({...newFollowUp, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent'})}
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsFollowUpModalOpen(false)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFollowUp}
                    disabled={!newFollowUp.title || !newFollowUp.due_date}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-sm w-full sm:w-auto"
                  >
                    Create Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal - Responsive */}
      {isNoteModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNoteModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-bold">Add Note</h3>
                <p className="text-indigo-100 text-xs sm:text-sm mt-1">Enquiry #{selectedEnquiry.id} - {selectedEnquiry.full_name}</p>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                />
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg text-sm w-full sm:w-auto"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesCMS;
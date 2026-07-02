import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Eye, MessageSquare, Phone, Mail,
  Calendar, AlertCircle, CheckCircle, Clock, User,
  Building, DollarSign, Trash2, Edit,
  Download, Upload, FileText, Star, TrendingUp,
  Activity, Video, PhoneCall, MapPin,
  ThumbsUp, ThumbsDown, CalendarCheck,
  Meh,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
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
    hasFollowUp: 'all',
    ignoreDate: false,
    startDate: '',
    endDate: ''
  });
  const [columnFilters, setColumnFilters] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    property: '',
    moveIn: '',
    status: '',
    created: '',
    assignedTo: ''
  });
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPayload, setCreatePayload] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    inquiryType: '',
    serviceType: '',
    projectBudget: '',
    message: '',
    priority: 'medium',
    status: 'new'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [selectedEnquiries, setSelectedEnquiries] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState('overview');

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Enquiries');
      setHeaderSubtitle(`Track & manage customer relationships (${enquiries.length} records)`);
    }
  }, [enquiries.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [filters]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        ...filters,
        dateRange: 'all',
        startDate: !filters.ignoreDate ? (filters.startDate || undefined) : undefined,
        endDate: !filters.ignoreDate ? (filters.endDate || undefined) : undefined
      };
      const data = await enquiryApi.getAll(apiFilters);
      setEnquiries(data);
    } catch (error: any) {
      console.error('Failed to fetch enquiries:', error);
      toast.error(error.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createPayload.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!createPayload.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!createPayload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!createPayload.inquiryType) {
      toast.error('Please select inquiry type');
      return;
    }
    if (!createPayload.serviceType) {
      toast.error('Please select a service');
      return;
    }
    if (!createPayload.message.trim()) {
      toast.error('Message is required');
      return;
    }
    if (createPayload.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    try {
      const enquiryData = {
        full_name: createPayload.fullName,
        company_name: createPayload.companyName || undefined,
        email: createPayload.email,
        phone_number: createPayload.phoneNumber || undefined,
        inquiry_type: createPayload.inquiryType,
        service_type: createPayload.serviceType || undefined,
        project_budget: createPayload.projectBudget || undefined,
        message: createPayload.message,
        priority: createPayload.priority,
        status: createPayload.status
      };

      await enquiryApi.create(enquiryData);
      toast.success('Enquiry created successfully');
      setIsCreateModalOpen(false);
      setCreatePayload({
        fullName: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        inquiryType: '',
        serviceType: '',
        projectBudget: '',
        message: '',
        priority: 'medium',
        status: 'new'
      });
      fetchEnquiries();
      fetchStats();
    } catch (error: any) {
      console.error('Failed to create enquiry:', error);
      toast.error(error.message || 'Failed to create enquiry');
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
      console.error('Failed to fetch enquiry details:', error);
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
  const [exportOptions,] = useState({
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
        success: (result: any) => {
          fetchEnquiries();
          fetchStats();
          if (result.failed > 0) {
            return `Imported ${result.successful} successfully (${result.failed} failed. E.g.: ${result.errors[0]})`;
          }
          return `Successfully imported ${result.successful} enquiries`;
        },
        error: (err: any) => err.message || 'Failed to import CSV',
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
  const filteredEnquiries = enquiries
    .filter(e => {
      // Column Filters
      const matchColId = !columnFilters.id || String(e.id).toLowerCase().includes(columnFilters.id.toLowerCase());
      const matchColName = !columnFilters.name || e.full_name.toLowerCase().includes(columnFilters.name.toLowerCase());
      const matchColPhone = !columnFilters.phone || (e.phone_number || '').toLowerCase().includes(columnFilters.phone.toLowerCase());
      const matchColEmail = !columnFilters.email || e.email.toLowerCase().includes(columnFilters.email.toLowerCase());
      const matchColProperty = !columnFilters.property || 
        e.inquiry_type.toLowerCase().includes(columnFilters.property.toLowerCase()) || 
        (e.service_type || '').toLowerCase().includes(columnFilters.property.toLowerCase());
      const matchColMoveIn = !columnFilters.moveIn || e.priority.toLowerCase().includes(columnFilters.moveIn.toLowerCase());
      const matchColStatus = !columnFilters.status || e.status.toLowerCase().includes(columnFilters.status.toLowerCase());
      const matchColCreated = !columnFilters.created || new Date(e.created_at).toLocaleDateString().toLowerCase().includes(columnFilters.created.toLowerCase());
      const matchColAssignedTo = !columnFilters.assignedTo || 
        (e.assigned_to ? `admin id: ${e.assigned_to}` : 'unassigned').toLowerCase().includes(columnFilters.assignedTo.toLowerCase());

      const matchSearch = e.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.message.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === 'all' || e.status === filters.status;
      const matchPriority = filters.priority === 'all' || e.priority === filters.priority;
      const matchFollowUp = filters.hasFollowUp === 'all' ? true :
        filters.hasFollowUp === 'yes' ? (e.follow_up_actions && e.follow_up_actions.length > 0) :
          (e.follow_up_actions && e.follow_up_actions.length === 0);

      return matchColId && matchColName && matchColPhone && matchColEmail && matchColProperty && matchColMoveIn && matchColStatus && matchColCreated && matchColAssignedTo && matchSearch && matchStatus && matchPriority && matchFollowUp;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Selection handlers
  const handleSelectAll = () => {
    const limitVal = itemsPerPage === 'all' ? filteredEnquiries.length : itemsPerPage;
    const currentPageEnquiries = filteredEnquiries.slice(
      (currentPage - 1) * limitVal,
      currentPage * limitVal
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
  const isAllSelected = itemsPerPage === 'all';
  const limit = isAllSelected ? filteredEnquiries.length : itemsPerPage;
  const totalPages = isAllSelected ? (filteredEnquiries.length > 0 ? 1 : 0) : Math.ceil(filteredEnquiries.length / limit);
  const indexOfLastItem = isAllSelected ? filteredEnquiries.length : currentPage * limit;
  const indexOfFirstItem = isAllSelected ? 0 : indexOfLastItem - limit;
  const currentEnquiries = isAllSelected ? filteredEnquiries : filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);

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
    { label: 'Total', value: stats?.total || 0, icon: FileText, textColor: 'text-indigo-600', bgColor: 'bg-indigo-50/40 border-indigo-100/30 hover:bg-indigo-50/60', iconBg: 'bg-indigo-100/80 text-indigo-600' },
    { label: 'New', value: stats?.new || 0, icon: Star, textColor: 'text-blue-600', bgColor: 'bg-blue-50/40 border-blue-100/30 hover:bg-blue-50/60', iconBg: 'bg-blue-100/80 text-blue-600' },
    { label: 'In Progress', value: stats?.in_progress || 0, icon: Clock, textColor: 'text-purple-600', bgColor: 'bg-purple-50/40 border-purple-100/30 hover:bg-purple-50/60', iconBg: 'bg-purple-100/80 text-purple-600' },
    { label: 'Contacted', value: stats?.contacted || 0, icon: CheckCircle, textColor: 'text-green-600', bgColor: 'bg-green-50/40 border-green-100/30 hover:bg-green-50/60', iconBg: 'bg-green-100/80 text-green-600' },
    { label: 'Converted', value: stats?.converted || 0, icon: TrendingUp, textColor: 'text-emerald-600', bgColor: 'bg-emerald-50/40 border-emerald-100/30 hover:bg-emerald-50/60', iconBg: 'bg-emerald-100/80 text-emerald-600' },
    { label: 'Urgent', value: stats?.urgent || 0, icon: AlertCircle, textColor: 'text-red-600', bgColor: 'bg-red-50/40 border-red-100/30 hover:bg-red-50/60', iconBg: 'bg-red-100/80 text-red-600' },
    { label: 'Today', value: stats?.today || 0, icon: CalendarCheck, textColor: 'text-orange-600', bgColor: 'bg-orange-50/40 border-orange-100/30 hover:bg-orange-50/60', iconBg: 'bg-orange-100/80 text-orange-600' }
  ];

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent font-sans px-6 pt-6 md:px-6 md:py-3">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, style: { background: '#10B981' } },
          error: { duration: 4000, style: { background: '#EF4444' } },
          loading: { duration: Infinity },
        }}
      />
      <style>{`
        @keyframes modalBackdropIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(4px); }
        }
        @keyframes modalContentIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0px); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-modal-backdrop {
          animation: modalBackdropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
          background: rgba(0,0,0,0.45);
        }
        .animate-modal-content {
          animation: modalContentIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .animate-slide-in {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      {/* Main Container */}
      <div className="transition-all duration-300">

        {/* Compact Stats Cards */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          {statsCards.map((stat, idx) => (
            <div key={idx} className={`rounded-xl border px-3 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-base font-extrabold mt-1 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Stats Summary */}
        <div className="sm:hidden grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/20 px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</p>
            <p className="text-sm font-bold text-indigo-600">{stats?.total || 0}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/20 px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">New</p>
            <p className="text-sm font-bold text-blue-600">{stats?.new || 0}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/20 px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Urgent</p>
            <p className="text-sm font-bold text-red-600">{stats?.urgent || 0}</p>
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/20 px-2 py-1.5 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Today</p>
            <p className="text-sm font-bold text-orange-600">{stats?.today || 0}</p>
          </div>
        </div>

        {/* Actions and Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xs">
          {/* Left side: filter selectors */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status selector */}
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer outline-none font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
              <option value="converted">Converted</option>
            </select>

            {/* Priority selector */}
            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value });
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer outline-none font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Show / pg selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemsPerPage(val === 'all' ? 'all' : Number(val));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer outline-none font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
              <span>/pg</span>
            </div>
          </div>

          {/* Right side: Action buttons & Filter toggle button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Create Enquiry Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-xs text-xs font-semibold flex cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Enquiry</span>
            </button>

            {/* Import Data */}
            <label className="cursor-pointer">
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              <div className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-xs text-xs font-semibold flex cursor-pointer">
                <Upload size={14} />
                <span>Import Data</span>
              </div>
            </label>

            {/* Export Data */}
            <button
              onClick={handleExportCSV}
              className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-xs text-xs font-semibold flex cursor-pointer"
            >
              <Download size={14} />
              <span>Export Data</span>
            </button>

            {/* Nice Filter Button */}
            <button
              onClick={() => setIsSideFilterOpen(true)}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 bg-white rounded-lg items-center gap-1.5 transition-all shadow-xs text-xs font-semibold text-slate-700 hover:bg-slate-50 flex cursor-pointer"
              title="Advanced Filters"
            >
              <Filter size={14} className="text-slate-600" />
              <span>Filters</span>
            </button>
          </div>
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
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeleteTargetIds([...selectedEnquiries]);
                  setIsDeleteConfirmOpen(true);
                }}
                className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0 cursor-pointer font-semibold"
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
                      {enquiry.id}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(enquiry.priority)}`}>
                    {enquiry.priority.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#0D47A1] to-[#6daeee] rounded-full flex items-center justify-center text-white font-semibold">
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
                      onClick={() => {
                        setDeleteTargetIds(null);
                        setDeleteTargetId(enquiry.id);
                        setIsDeleteConfirmOpen(true);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
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
          <div className="bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 340px)', minHeight: '320px' }}>
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
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 overflow-y-auto">
                  <table className="w-full table-fixed border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedEnquiries.length === currentEnquiries.length && currentEnquiries.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                          Actions
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-b border-slate-300">
                          Name
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                          Phone
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-44 border-r border-b border-slate-300">
                          Email
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-b border-slate-300">
                          Enquiry Type
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                          Priority
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                          Status
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                          Created
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-b border-slate-300">
                          Assigned To
                        </th>
                      </tr>
                      {/* Search inputs row */}
                      <tr className="bg-slate-50">
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-8"></th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-24"></th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-36">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.name}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, name: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-28">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.phone}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, phone: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-44">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.email}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, email: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-36">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.property}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, property: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-28">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.moveIn}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, moveIn: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-28">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.status}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, status: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-r border-b border-slate-300 w-28">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.created}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, created: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                        <th className="px-2 py-1 border-b border-slate-300 w-28">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={columnFilters.assignedTo}
                            onChange={(e) => {
                              setColumnFilters({ ...columnFilters, assignedTo: e.target.value });
                              setCurrentPage(1);
                            }}
                            className="w-full px-2 py-0.5 text-[10px] font-normal border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {currentEnquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedEnquiries.includes(enquiry.id)}
                                onChange={() => handleSelectEnquiry(enquiry.id)}
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewDetails(enquiry)}
                                className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                title="View Details"
                              >
                                <Eye size={11} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedEnquiry(enquiry);
                                  setIsNoteModalOpen(true);
                                }}
                                className="p-0.5 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded cursor-pointer transition-all"
                                title="Add Note"
                              >
                                <Edit size={11} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTargetIds(null);
                                  setDeleteTargetId(enquiry.id);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                                title="Delete"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center space-x-2">
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#0D47A1] to-[#6daeee] rounded-full flex items-center justify-center text-white font-bold text-[9px]">
                                {enquiry.full_name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 text-[11px] truncate leading-tight">{enquiry.full_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 text-slate-700 text-[11px] font-medium">
                            {enquiry.phone_number || 'N/A'}
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 text-slate-650 text-[11px] font-medium truncate">
                            {enquiry.email}
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 text-slate-800 text-[11px]">
                            <span className="font-semibold block">{enquiry.inquiry_type}</span>
                            {enquiry.service_type && (
                              <p className="text-[9px] text-gray-400 mt-0.5 truncate leading-none">{enquiry.service_type}</p>
                            )}
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getPriorityColor(enquiry.priority)}`}>
                              {enquiry.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <select
                              value={enquiry.status}
                              onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getStatusColor(enquiry.status)} cursor-pointer outline-none bg-white`}
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                              <option value="converted">Converted</option>
                            </select>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 text-gray-500 text-[11px] font-medium">
                            {new Date(enquiry.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-1 border-b border-slate-200 text-gray-650 text-[11px] font-medium">
                            {enquiry.assigned_to ? `Admin ID: ${enquiry.assigned_to}` : 'Unassigned'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls - always pinned at bottom */}
                {filteredEnquiries.length > 0 && (
                  <div className="bg-slate-100/30 border-t border-slate-200/40 px-2 py-2 sm:px-4 sm:py-3 backdrop-blur-md flex-shrink-0">
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

                      {itemsPerPage !== 'all' && (
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
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal with Tabs */}
      {isDetailModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setIsDetailModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden shadow-2xl border border-slate-100 z-10 animate-modal-content flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 bg-white flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-[#0D47A1]" />
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Enquiry Details</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-1 ml-9">ID: #{selectedEnquiry.id} · {selectedEnquiry.full_name}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0.5 px-4 pt-3 pb-0 border-b border-slate-100 overflow-x-auto flex-shrink-0">
              {['overview', 'interactions', 'meetings', 'follow-ups', 'timeline'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === tab
                    ? 'bg-[#0D47A1] text-white'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto flex-1">
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
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEnquiry.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-indigo-600 hover:underline text-sm"
                            >
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
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEnquiry.email}&su=Regarding your enquiry #${selectedEnquiry.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
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
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${interaction.direction === 'outgoing'
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
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
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
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${followUp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
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
                          <div className={`absolute left-0 top-0.5 w-4 h-4 rounded-full border-2 ${interaction.type === 'call' ? 'border-blue-600 bg-blue-100' :
                            interaction.type === 'email' ? 'border-green-600 bg-green-100' :
                              'border-purple-600 bg-purple-100'
                            }`}></div>
                          <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-gray-900 text-xs">{interaction.subject}</h4>
                              <span className="text-xs text-gray-500">{formatDate(interaction.created_at)}</span>
                            </div>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${interaction.direction === 'outgoing'
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
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEnquiry.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#0D47A1] text-white rounded-lg hover:bg-[#1565C0] flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Mail size={12} />
                  <span>Email</span>
                </a>
                {selectedEnquiry.phone_number && (
                  <a
                    href={`tel:${selectedEnquiry.phone_number}`}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Phone size={12} />
                    <span>Call</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 font-semibold transition-all text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Meeting Schedule Modal */}
      {isMeetingModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setIsMeetingModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 z-10 animate-modal-content overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Video className="w-3.5 h-3.5 text-[#0D47A1]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Schedule Meeting</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">With {selectedEnquiry.full_name}</p>
                </div>
              </div>
              <button onClick={() => setIsMeetingModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Meeting Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                    placeholder="e.g., Project Discovery Call"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Meeting agenda and discussion points..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Meeting Type</label>
                    <select
                      value={newMeeting.meeting_type}
                      onChange={(e) => setNewMeeting({ ...newMeeting, meeting_type: e.target.value as 'virtual' | 'in_person' })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="virtual">Virtual Meeting</option>
                      <option value="in_person">In-Person Meeting</option>
                    </select>
                  </div>

                  {newMeeting.meeting_type === 'virtual' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Platform</label>
                      <select
                        value={newMeeting.platform}
                        onChange={(e) => setNewMeeting({ ...newMeeting, platform: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
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
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                      <input
                        type="text"
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                        placeholder="Meeting address"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Start Time <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      value={newMeeting.start_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">End Time <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      value={newMeeting.end_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, end_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Participants</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="Add participant email"
                    />
                    <button
                      onClick={() => {
                        if (newParticipant.trim()) {
                          setNewMeeting({ ...newMeeting, participants: [...newMeeting.participants, newParticipant.trim()] });
                          setNewParticipant('');
                        }
                      }}
                      className="px-3 py-2 bg-[#0D47A1] text-white rounded-lg text-xs font-bold hover:bg-[#1565C0] transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  {newMeeting.participants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {newMeeting.participants.map((p, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {p}
                          <button onClick={() => setNewMeeting({ ...newMeeting, participants: newMeeting.participants.filter((_, i) => i !== idx) })} className="text-indigo-400 hover:text-indigo-700 cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Additional Notes</label>
                  <textarea
                    value={newMeeting.notes}
                    onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex justify-end gap-2 flex-shrink-0">
              <button onClick={() => setIsMeetingModalOpen(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer">Cancel</button>
              <button
                onClick={handleScheduleMeeting}
                disabled={!newMeeting.title || !newMeeting.start_time || !newMeeting.end_time}
                className="px-4 py-1.5 bg-[#0D47A1] text-white rounded-lg text-xs font-bold hover:bg-[#1565C0] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Log Modal */}
      {isCallLogModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setIsCallLogModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 z-10 animate-modal-content overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Log Call</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">With {selectedEnquiry.full_name}</p>
                </div>
              </div>
              <button onClick={() => setIsCallLogModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Call Type</label>
                    <select
                      value={newCallLog.type}
                      onChange={(e) => setNewCallLog({ ...newCallLog, type: e.target.value as 'outgoing' | 'incoming' })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="outgoing">Outgoing</option>
                      <option value="incoming">Incoming</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Purpose</label>
                    <select
                      value={newCallLog.metadata.call_type}
                      onChange={(e) => setNewCallLog({ ...newCallLog, metadata: { ...newCallLog.metadata, call_type: e.target.value as 'cold' | 'follow_up' | 'discovery' | 'closing' } })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="cold">Cold Call</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="discovery">Discovery</option>
                      <option value="closing">Closing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Duration (mins)</label>
                    <input
                      type="number"
                      value={newCallLog.duration}
                      onChange={(e) => setNewCallLog({ ...newCallLog, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sentiment</label>
                    <div className="flex gap-1.5">
                      {(['positive', 'neutral', 'negative'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewCallLog({ ...newCallLog, sentiment: s })}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold border transition-all cursor-pointer ${newCallLog.sentiment === s
                            ? s === 'positive' ? 'bg-green-100 text-green-700 border-green-400'
                              : s === 'neutral' ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                                : 'bg-red-100 text-red-700 border-red-400'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                          {s === 'positive' ? <ThumbsUp size={10} /> : s === 'neutral' ? <Meh size={10} /> : <ThumbsDown size={10} />}
                          <span className="hidden sm:inline capitalize">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Call Summary <span className="text-red-500">*</span></label>
                  <textarea
                    value={newCallLog.content}
                    onChange={(e) => setNewCallLog({ ...newCallLog, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Brief summary of the conversation, key points discussed, and next steps..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex justify-end gap-2 flex-shrink-0">
              <button onClick={() => setIsCallLogModalOpen(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer">Cancel</button>
              <button
                onClick={handleLogCall}
                disabled={!newCallLog.content.trim()}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Log Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Action Modal */}
      {isFollowUpModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setIsFollowUpModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 z-10 animate-modal-content overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Create Follow-up</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">For {selectedEnquiry.full_name}</p>
                </div>
              </div>
              <button onClick={() => setIsFollowUpModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Follow-up Type</label>
                  <select
                    value={newFollowUp.type}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, type: e.target.value as 'call' | 'email' | 'meeting' | 'task' })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newFollowUp.title}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                    placeholder="e.g., Send proposal, Follow-up call..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={newFollowUp.description}
                    onChange={(e) => setNewFollowUp({ ...newFollowUp, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Detailed description of the follow-up action..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      value={newFollowUp.due_date}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, due_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                    <select
                      value={newFollowUp.priority}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex justify-end gap-2 flex-shrink-0">
              <button onClick={() => setIsFollowUpModalOpen(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer">Cancel</button>
              <button
                onClick={handleCreateFollowUp}
                disabled={!newFollowUp.title || !newFollowUp.due_date}
                className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Create Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isNoteModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div className="fixed inset-0" onClick={() => setIsNoteModalOpen(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 z-10 animate-modal-content overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Edit className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Add Note</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">#{selectedEnquiry.id} · {selectedEnquiry.full_name}</p>
                </div>
              </div>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                rows={5}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex justify-end gap-2">
              <button onClick={() => setIsNoteModalOpen(false)} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer">Cancel</button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-1.5 bg-[#0D47A1] text-white rounded-lg text-xs font-bold hover:bg-[#1565C0] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsDeleteConfirmOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetIds(null);
            }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-modal-content">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Confirm Delete</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {deleteTargetIds ? `${deleteTargetIds.length} enquir${deleteTargetIds.length === 1 ? 'y' : 'ies'} selected` : '1 enquiry selected'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete {deleteTargetIds ? `these ${deleteTargetIds.length} enquiries` : 'this enquiry'}? This action <span className="text-red-500 font-bold">cannot be undone</span>.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleteConfirmOpen(false);
                  if (deleteTargetId !== null) {
                    await handleDeleteEnquiry(deleteTargetId);
                  } else if (deleteTargetIds !== null) {
                    await handleBulkDelete();
                  }
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

      {/* Slide-out Side Filter Panel Container */}
      <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${isSideFilterOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 ${isSideFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSideFilterOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-200 z-10 p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${isSideFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#0D47A1]" />
              <h3 className="text-base font-bold text-slate-800">Advanced Filters</h3>
            </div>
            <button
              onClick={() => setIsSideFilterOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            {/* Status Filter */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => {
                  setFilters({ ...filters, priority: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Date</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">From</label>
                  <input
                    type="date"
                    disabled={filters.ignoreDate}
                    value={filters.startDate}
                    onChange={(e) => {
                      setFilters({ ...filters, startDate: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white outline-none disabled:opacity-50 disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">To</label>
                  <input
                    type="date"
                    disabled={filters.ignoreDate}
                    value={filters.endDate}
                    onChange={(e) => {
                      setFilters({ ...filters, endDate: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white outline-none disabled:opacity-50 disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Ignore Date Filter */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Ignore Date Range</label>
                <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">Show enquiries from all time</span>
              </div>
              <input
                type="checkbox"
                checked={filters.ignoreDate}
                onChange={(e) => {
                  setFilters({ ...filters, ignoreDate: e.target.checked });
                  setCurrentPage(1);
                }}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex gap-2">
            <button
              onClick={() => {
                setFilters({
                  status: 'all',
                  priority: 'all',
                  search: '',
                  dateRange: 'all',
                  hasFollowUp: 'all',
                  ignoreDate: false,
                  startDate: '',
                  endDate: ''
                });
                setColumnFilters({
                  id: '',
                  name: '',
                  phone: '',
                  email: '',
                  property: '',
                  moveIn: '',
                  status: '',
                  created: '',
                  assignedTo: ''
                });
                setCurrentPage(1);
              }}
              className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsSideFilterOpen(false)}
              className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Create Enquiry Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <form
            onSubmit={handleCreateEnquiry}
            className="relative bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 z-10 animate-modal-content flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Create New Enquiry</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Enter customer information to add manually</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createPayload.fullName}
                    onChange={(e) => setCreatePayload({ ...createPayload, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={createPayload.email}
                    onChange={(e) => setCreatePayload({ ...createPayload, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={createPayload.phoneNumber}
                    onChange={(e) => setCreatePayload({ ...createPayload, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={createPayload.companyName}
                    onChange={(e) => setCreatePayload({ ...createPayload, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                    placeholder="Your company or organization"
                  />
                </div>
              </div>

              {/* Row 3: Enquiry Type & Service Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Inquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={createPayload.inquiryType}
                    onChange={(e) => setCreatePayload({ ...createPayload, inquiryType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 cursor-pointer bg-white"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="project">New Project</option>
                    <option value="consultation">Free Consultation</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={createPayload.serviceType}
                    onChange={(e) => setCreatePayload({ ...createPayload, serviceType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 cursor-pointer bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App Development</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="devops">DevOps & Automation</option>
                    <option value="custom-software">Custom Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Budget & Priority & Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Budget</label>
                  <input
                    type="text"
                    value={createPayload.projectBudget}
                    onChange={(e) => setCreatePayload({ ...createPayload, projectBudget: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                    placeholder="e.g. ₹50,000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={createPayload.priority}
                    onChange={(e) => setCreatePayload({ ...createPayload, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 cursor-pointer bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={createPayload.status}
                    onChange={(e) => setCreatePayload({ ...createPayload, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700 cursor-pointer bg-white"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={createPayload.message}
                  onChange={(e) => setCreatePayload({ ...createPayload, message: e.target.value })}
                  placeholder="Briefly describe your requirement or challenge..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800 placeholder-slate-450 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Create Enquiry</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EnquiriesCMS;

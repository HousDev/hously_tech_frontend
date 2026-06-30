import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  XCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { meetingApi, type Meeting } from '../../lib/meetingApi';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { createPortal } from 'react-dom';

const MeetingsCMS: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [zoomLinkInput, setZoomLinkInput] = useState<string>('');
  const [customMessageInput, setCustomMessageInput] = useState<string>('');
  const [attachmentPath, setAttachmentPath] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [uploadingAttachment, setUploadingAttachment] = useState<boolean>(false);
  const [savingZoom, setSavingZoom] = useState(false);

  // Bulk selection and reschedule actions
  const [selectedMeetingIds, setSelectedMeetingIds] = useState<number[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [reschedulingMeeting, setReschedulingMeeting] = useState<Meeting | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState<string>('10:00am');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Dropdown position state
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // Calendar states
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'virtual' | 'in_person'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('all');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const timeOptions = [
    '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
    '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
    '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm'
  ];

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Meeting Schedules');
      setHeaderSubtitle(`Track client discovery calls and scheduled meetings (${meetings.length} records)`);
    }
  }, [meetings.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => { loadAllMeetings(); }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.edit-dropdown-btn') || target.closest('.edit-dropdown-menu')) {
        return;
      }
      setOpenDropdownId(null);
      setDropdownPosition(null);
      setIsTimeDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadAllMeetings = async () => {
    try {
      setLoading(true);
      const data = await meetingApi.getAll();
      setMeetings(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load meetings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setZoomLinkInput(meeting.zoom_link || '');
    setCustomMessageInput(meeting.custom_message || '');
    setAttachmentPath(meeting.attachment_path || '');
    setAttachmentName(meeting.attachment_name || '');

    setTimeout(() => {
      const editorEl = document.getElementById('custom-message-wysiwyg');
      if (editorEl) {
        editorEl.innerHTML = meeting.custom_message || '';
      }
    }, 50);
  };

  const handleSaveZoomLink = async () => {
    if (!selectedMeeting || !zoomLinkInput.trim()) return;
    setSavingZoom(true);
    try {
      const updated = await meetingApi.updateZoomLink(
        selectedMeeting.id,
        zoomLinkInput.trim(),
        customMessageInput.trim() || null,
        attachmentPath.trim() || null,
        attachmentName.trim() || null
      );
      setSelectedMeeting(updated);
      setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
      toast.success('Zoom link, custom message and attachment saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save Zoom link.');
    } finally {
      setSavingZoom(false);
    }
  };

  const handleFileBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAttachment(true);
    try {
      const data = await meetingApi.uploadAttachment(file);
      setAttachmentPath(data.url);
      setAttachmentName(file.name);
      toast.success('Attachment uploaded successfully! Save to confirm.');
    } catch (err: any) {
      toast.error(err.message || 'Attachment upload failed.');
    } finally {
      setUploadingAttachment(false);
    }
  };

  const execFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    const editorEl = document.getElementById('custom-message-wysiwyg');
    if (editorEl) {
      setCustomMessageInput(editorEl.innerHTML);
    }
  };

  const handleStatusChange = async (id: number, status: Meeting['status']) => {
    try {
      const updated = await meetingApi.updateStatus(id, status);
      setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
      if (selectedMeeting?.id === id) setSelectedMeeting(updated);
      toast.success('Status updated.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedMeetingIds.length === 0) return;
    setDeleteTargetIds(selectedMeetingIds);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    try {
      await meetingApi.delete(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
      if (selectedMeeting?.id === id) setSelectedMeeting(null);
      setSelectedMeetingIds(prev => prev.filter(selectedId => selectedId !== id));
      toast.success('Meeting deleted.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete meeting.');
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    try {
      await meetingApi.bulkDelete(ids);
      setMeetings(prev => prev.filter(m => !ids.includes(m.id)));
      setSelectedMeetingIds([]);
      if (selectedMeeting && ids.includes(selectedMeeting.id)) {
        setSelectedMeeting(null);
      }
      toast.success('Selected meetings deleted successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete selected meetings.');
    }
  };

  const handleStartReschedule = (meeting: Meeting) => {
    setReschedulingMeeting(meeting);
    if (meeting.start_time) {
      const d = new Date(meeting.start_time);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateVal = String(d.getDate()).padStart(2, '0');
      setRescheduleDate(`${year}-${month}-${dateVal}`);

      const hours = d.getHours();
      const mins = d.getMinutes();
      let ampm = 'am';
      let displayH = hours;
      if (hours >= 12) {
        ampm = 'pm';
        if (hours > 12) displayH = hours - 12;
      }
      if (hours === 0) displayH = 12;
      const slotVal = `${displayH}:${String(mins).padStart(2, '0')}${ampm}`;
      setRescheduleTimeSlot(slotVal);
    } else {
      setRescheduleDate(new Date().toISOString().split('T')[0]);
      setRescheduleTimeSlot('10:00am');
    }
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingMeeting || !rescheduleDate || !rescheduleTimeSlot) return;
    try {
      const slotTo24h = (slot: string): string => {
        if (/^\d{2}:\d{2}$/.test(slot)) return slot;
        const [time, meridiem] = slot.split(/(am|pm)/i);
        let [h, m] = time.split(':').map(Number);
        if (meridiem.toLowerCase() === 'pm' && h !== 12) h += 12;
        if (meridiem.toLowerCase() === 'am' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
      };

      const startHHMM = slotTo24h(rescheduleTimeSlot);
      const [sh, sm] = startHHMM.split(':').map(Number);

      const startDate = new Date(rescheduleDate);
      startDate.setHours(sh, sm, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      const updated = await meetingApi.reschedule(
        reschedulingMeeting.id,
        startDate.toISOString(),
        endDate.toISOString()
      );

      setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
      if (selectedMeeting?.id === updated.id) {
        setSelectedMeeting(updated);
      }

      setReschedulingMeeting(null);
      toast.success('Meeting rescheduled successfully. Reminder email reset.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reschedule meeting.');
    }
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(p => p - 1); }
    else setCurrentMonth(p => p - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(p => p + 1); }
    else setCurrentMonth(p => p + 1);
  };

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (ds: string) =>
    new Date(ds).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Filter logic
  const filteredMeetings = meetings.filter(m => {
    const matchSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || m.meeting_type === typeFilter;
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const mDate = new Date(m.start_time);
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(); dayEnd.setHours(23, 59, 59, 999);
    const matchTime = timeFilter === 'upcoming' ? mDate >= dayStart
      : timeFilter === 'past' ? mDate < dayStart
        : timeFilter === 'today' ? mDate >= dayStart && mDate <= dayEnd
          : true;
    return matchSearch && matchType && matchStatus && matchTime;
  });

  const getMeetingsForDate = (date: Date) =>
    meetings.filter(m => {
      const d = new Date(m.start_time);
      return d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear();
    });

  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Handle dropdown toggle with position calculation
  const handleDropdownToggle = (meetingId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (openDropdownId === meetingId) {
      setOpenDropdownId(null);
      setDropdownPosition(null);
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    // Calculate position - show above or below based on available space
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 150;
    const top = spaceBelow < dropdownHeight
      ? rect.top - dropdownHeight + 10
      : rect.bottom + 8;

    // Clamp horizontal positioning so it does not trigger scroll issues
    const left = Math.max(10, Math.min(rect.left - 100, window.innerWidth - 160));

    setDropdownPosition({
      top: top,
      left: left
    });

    setOpenDropdownId(meetingId);
  };

  return (
    <div className="bg-transparent font-sans">
      <Toaster position="top-right" />
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); background-color: rgba(15, 23, 42, 0); }
          to { opacity: 1; backdrop-filter: blur(8px); background-color: rgba(15, 23, 42, 0.4); }
        }
        @keyframes modalZoomIn {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-backdrop {
          animation: modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-content {
          animation: modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>




      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-100/40 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Meetings</p>
          <p className="text-base font-extrabold text-blue-600 mt-1">{meetings.length}</p>
        </div>
        <div className="bg-indigo-100/40 border-indigo-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upcoming</p>
          <p className="text-base font-extrabold text-indigo-600 mt-1">
            {meetings.filter(m => new Date(m.start_time) >= new Date()).length}
          </p>
        </div>
        <div className="bg-purple-100/40 border-purple-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Virtual (Zoom/Meet)</p>
          <p className="text-base font-extrabold text-purple-600 mt-1">
            {meetings.filter(m => m.meeting_type === 'virtual').length}
          </p>
        </div>
        <div className="bg-emerald-100/40 border-emerald-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In-Person</p>
          <p className="text-base font-extrabold text-emerald-600 mt-1">
            {meetings.filter(m => m.meeting_type === 'in_person').length}
          </p>
        </div>
      </div>

      {/* Tab Switcher & Action Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end mb-6 gap-4">
        <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'calendar'
              ? 'bg-[#0D47A1] text-white shadow-md'
              : 'text-slate-600 hover:text-[#0D47A1]'
              }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'list'
              ? 'bg-[#0D47A1] text-white shadow-md'
              : 'text-slate-600 hover:text-[#0D47A1]'
              }`}
          >
            All Meetings List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0076d8]"></div>
        </div>
      ) : (
        <div className="p-6">
          {/* TAB 1: CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#0c1e4a]">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
                  {weekDays.map(day => (
                    <div key={day} className="text-[10px] font-bold text-slate-400 py-0.5">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: startOffset }).map((_, idx) => (
                    <div key={`offset-${idx}`} className="h-11 sm:h-12 md:h-14 bg-gray-100/30 rounded-lg border border-transparent"></div>
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dateObj = new Date(currentYear, currentMonth, day);
                    const dayMeetings = getMeetingsForDate(dateObj);
                    const isSelected = selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth &&
                      selectedDate.getFullYear() === currentYear;

                    const isToday = today.getDate() === day &&
                      today.getMonth() === currentMonth &&
                      today.getFullYear() === currentYear;

                    return (
                      <button
                        key={`day-${day}`}
                        onClick={() => setSelectedDate(dateObj)}
                        className={`h-11 sm:h-12 md:h-14 p-1.5 rounded-lg border flex flex-col justify-between items-start transition-all relative cursor-pointer ${isSelected
                          ? 'bg-[#0D47A1] border-[#0D47A1] text-white shadow-md'
                          : isToday
                            ? 'bg-blue-50/50 border-[#0D47A1] text-gray-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                      >
                        <span className="text-[10px] md:text-xs">{day}</span>
                        {dayMeetings.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-0.5 w-full justify-end">
                            {dayMeetings.slice(0, 3).map((meeting, mIdx) => (
                              <span
                                key={mIdx}
                                className={`w-1.5 h-1.5 rounded-full ${isSelected
                                  ? 'bg-white'
                                  : meeting.meeting_type === 'virtual'
                                    ? 'bg-indigo-500'
                                    : 'bg-emerald-500'
                                  }`}
                              />
                            ))}
                            {dayMeetings.length > 3 && (
                              <span className={`text-[8px] font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                +{dayMeetings.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 border border-white/20 rounded-xl p-5 bg-white/40 backdrop-blur-md shadow-sm">
                <h3 className="text-base font-bold text-[#0c1e4a] border-b border-gray-100 pb-3 mb-4">
                  Schedule for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>

                {selectedDateMeetings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CalendarIcon className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No meetings scheduled</p>
                    <p className="text-xs text-gray-300 mt-1">No client meetings for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {selectedDateMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-4 border border-gray-200 rounded-xl hover:border-[#0076d8] hover:shadow-sm transition cursor-pointer group"
                        onClick={() => handleSelectMeeting(meeting)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0076d8] transition">
                            {meeting.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5 mt-2.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(meeting.start_time)} – {formatTime(meeting.end_time)}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-gray-500">
                          {meeting.meeting_type === 'virtual' ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Virtual ({meeting.platform || 'Zoom'})</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                              <span>In-Person</span>
                            </>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#0076d8]/10 rounded-full flex items-center justify-center text-xs font-bold text-[#0076d8]">
                            {meeting.client_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{meeting.client_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIST VIEW */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by meeting title, client name, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all outline-none font-semibold text-slate-700"
                      >
                        <option value="all">All Types</option>
                        <option value="virtual">Virtual</option>
                        <option value="in_person">In-Person</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all outline-none font-semibold text-slate-700"
                      >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value as any)}
                        className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all outline-none font-semibold text-slate-700"
                      >
                        <option value="all">All Time</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="today">Today</option>
                        <option value="past">Past</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMeetingIds.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-between transition-all duration-200 animate-fadeIn mb-4">
                  <div className="flex items-center space-x-2 text-red-900 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{selectedMeetingIds.length} meeting{selectedMeetingIds.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <button
                    onClick={handleBulkDeleteClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              )}

              {filteredMeetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-xl">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-base font-semibold text-gray-700">No meetings match your criteria</p>
                  <p className="text-xs text-gray-400 mt-1">Try resetting your filters or search term</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
                  <table className="min-w-full border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                              checked={filteredMeetings.length > 0 && selectedMeetingIds.length === filteredMeetings.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMeetingIds(filteredMeetings.map(m => m.id));
                                } else {
                                  setSelectedMeetingIds([]);
                                }
                              }}
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-b border-slate-300">Meeting details</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-b border-slate-300">Client Info</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">Date & Time</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">Type</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">Status</th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {filteredMeetings.map((meeting) => {
                        const isChecked = selectedMeetingIds.includes(meeting.id);
                        return (
                          <tr key={meeting.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMeetingIds(prev => [...prev, meeting.id]);
                                    } else {
                                      setSelectedMeetingIds(prev => prev.filter(id => id !== meeting.id));
                                    }
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="font-bold text-[11px] text-gray-800 leading-tight">{meeting.title}</div>
                              {meeting.description && (
                                <div className="text-[9px] text-gray-400 mt-0.5 truncate max-w-[200px] leading-none">{meeting.description}</div>
                              )}
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="text-[11px] font-bold text-gray-800 leading-tight">{meeting.client_name}</div>
                              <div className="text-[9px] text-gray-400 mt-0.5 leading-none">{meeting.client_email}</div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <div className="text-[11px] font-bold text-slate-800 leading-tight">{formatDate(meeting.start_time)}</div>
                              <div className="text-[9px] text-gray-400 mt-0.5 leading-none">{formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}</div>
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              {meeting.meeting_type === 'virtual' ? (
                                <div className="flex items-center space-x-1 text-indigo-600 font-bold text-[9px]">
                                  <Video className="w-3 h-3" />
                                  <span>VIRTUAL ({meeting.platform})</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-emerald-600 font-bold text-[9px]">
                                  <MapPin className="w-3 h-3" />
                                  <span>IN-PERSON</span>
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1 border-r border-b border-slate-200">
                              <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(meeting.status)}`}>
                                {meeting.status}
                              </span>
                            </td>
                            <td className="px-2 py-1 border-b border-slate-200 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleSelectMeeting(meeting)}
                                  title="View Details"
                                  className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                >
                                  <Eye size={11} />
                                </button>

                                <div className="relative inline-block text-left">
                                  <button
                                    onClick={(e) => handleDropdownToggle(meeting.id, e)}
                                    className="edit-dropdown-btn text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 font-bold flex items-center space-x-0.5 py-0.5 px-1.5 rounded border border-slate-200 transition text-[9px] cursor-pointer"
                                    title="Edit actions"
                                  >
                                    <span>Edit</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>

                                  {openDropdownId === meeting.id && dropdownPosition && createPortal(
                                    <div
                                      className="edit-dropdown-menu fixed z-[9999] min-w-[140px] bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-fadeIn"
                                      style={{
                                        top: dropdownPosition.top,
                                        left: dropdownPosition.left,
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {meeting.status !== 'cancelled' && (
                                        <button
                                          onClick={() => {
                                            setOpenDropdownId(null);
                                            setDropdownPosition(null);
                                            handleStatusChange(meeting.id, 'cancelled');
                                          }}
                                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center space-x-2 cursor-pointer"
                                        >
                                          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                          <span>Reject</span>
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          setOpenDropdownId(null);
                                          setDropdownPosition(null);
                                          handleStartReschedule(meeting);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                                      >
                                        <CalendarIcon className="w-3.5 h-3.5 text-[#0D47A1] flex-shrink-0" />
                                        <span>Reschedule</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenDropdownId(null);
                                          setDropdownPosition(null);
                                          handleDeleteClick(meeting.id);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100 transition flex items-center space-x-2 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>Delete</span>
                                      </button>
                                    </div>,
                                    document.body
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MEETING DETAILS MODAL */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMeeting(null)}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 overflow-hidden animate-modal-content">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-[#0D47A1]" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Meeting details</span>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Body - Compact 2-column layout (Non-scrollable) */}
            <div className="p-5 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Left Column: Meeting Info & Client Details */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(selectedMeeting.status)}`}>
                      {selectedMeeting.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">ID: #{selectedMeeting.id}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 leading-snug">{selectedMeeting.title}</h3>
                    {selectedMeeting.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">{selectedMeeting.description}</p>
                    )}
                  </div>

                  {/* Grid Specs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Date & Time</span>
                      <div className="flex items-center text-slate-700 font-bold">
                        <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                        <span>{formatTime(selectedMeeting.start_time)} - {formatTime(selectedMeeting.end_time)}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{formatDate(selectedMeeting.start_time)}</div>
                    </div>

                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Meeting Type</span>
                      <div className="flex items-center text-slate-700 font-bold">
                        {selectedMeeting.meeting_type === 'virtual' ? (
                          <>
                            <Video className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                            <span>Zoom ({selectedMeeting.platform})</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                            <span>In-Person</span>
                          </>
                        )}
                      </div>
                      {selectedMeeting.meeting_type === 'in_person' && selectedMeeting.location && (
                        <div className="text-[9px] text-slate-400 mt-0.5 truncate">{selectedMeeting.location}</div>
                      )}
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-2">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Client Contact</span>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="block text-[8px] text-slate-400">Name</span>
                        <span className="font-bold text-slate-700 truncate block">{selectedMeeting.client_name}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Email</span>
                        <span className="font-bold text-slate-700 truncate block" title={selectedMeeting.client_email}>{selectedMeeting.client_email}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Phone</span>
                        <span className="font-bold text-slate-700 truncate block">{selectedMeeting.client_phone || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedMeeting.notes && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 flex items-start gap-2 text-[10px] text-amber-800">
                      <FileText className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="leading-relaxed line-clamp-2">{selectedMeeting.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Virtual Meeting Settings */}
                <div className="space-y-3.5">
                  {selectedMeeting.meeting_type === 'virtual' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Zoom Meeting Link
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="https://zoom.us/j/123456789"
                            value={zoomLinkInput}
                            onChange={(e) => setZoomLinkInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                          />
                          <button
                            onClick={handleSaveZoomLink}
                            disabled={savingZoom}
                            className="bg-[#0076d8] hover:bg-[#0c1e4a] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer"
                          >
                            {savingZoom ? 'Saving...' : 'Save Link'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Custom Email Message & Attachment
                          </label>
                        </div>

                        {/* Editor Controls */}
                        <div className="bg-slate-100 border border-slate-200 rounded-t-lg p-1 flex gap-1 items-center">
                          <button
                            type="button"
                            onClick={() => execFormat('bold')}
                            className="px-2 py-0.5 text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition cursor-pointer"
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            onClick={() => document.getElementById('meeting-attachment-file')?.click()}
                            disabled={uploadingAttachment}
                            className="px-2 py-0.5 text-[10px] text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded transition font-semibold cursor-pointer"
                          >
                            {uploadingAttachment ? 'Uploading...' : 'Add File'}
                          </button>
                          <input
                            type="file"
                            id="meeting-attachment-file"
                            onChange={handleFileBrowse}
                            className="hidden"
                          />
                        </div>

                        <div
                          id="custom-message-wysiwyg"
                          contentEditable
                          data-placeholder="Write instructions or info..."
                          onInput={(e) => setCustomMessageInput(e.currentTarget.innerHTML)}
                          className="w-full p-2 border border-slate-200 rounded-b-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white h-[64px] overflow-hidden resize-none outline-none prose prose-xs empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
                        />

                        {(attachmentPath || attachmentName) && (
                          <div className="bg-slate-50 border border-slate-150 rounded-lg p-1.5 flex items-center justify-between text-[10px] text-slate-700">
                            <span className="truncate font-medium text-slate-500">{attachmentName || attachmentPath}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setAttachmentPath('');
                                setAttachmentName('');
                              }}
                              className="text-red-500 hover:text-red-700 font-bold px-1 py-0.5 rounded cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      {(() => {
                        const hasZoomLink = !!selectedMeeting.zoom_link;
                        const isSent = !!selectedMeeting.reminder_sent;
                        const reminderTime = new Date(new Date(selectedMeeting.start_time).getTime() - 3600000);

                        if (isSent) {
                          return (
                            <div className="bg-green-50/70 border border-green-100 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-green-900 leading-relaxed">
                              <Mail className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-bold">Email Reminder Status: Sent</p>
                                <p className="text-green-800">Email sent to {selectedMeeting.client_email}.</p>
                              </div>
                            </div>
                          );
                        }

                        if (hasZoomLink) {
                          return (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-blue-900 leading-relaxed">
                              <Mail className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-bold">Email Reminder: Pending</p>
                                <p className="text-blue-800">Will be sent automatically at {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 border border-slate-100 rounded-xl border-dashed">
                      <MapPin className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-700">In-Person Meeting</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">This meeting is scheduled in person. Zoom configuration is disabled.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
              {selectedMeeting.meeting_type === 'virtual' ? (
                <button
                  onClick={() => window.open(zoomLinkInput || 'https://zoom.us', '_blank')}
                  className="bg-[#0076d8] hover:bg-[#0c1e4a] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Start Zoom Meeting</span>
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setSelectedMeeting(null)}
                className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* RESCHEDULE MODAL */}
      {reschedulingMeeting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => { setReschedulingMeeting(null); setIsTimeDropdownOpen(false); }}
          />
          <div className="relative w-full sm:max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 overflow-hidden animate-modal-content">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#0D47A1]" />
                Reschedule Meeting
              </span>
              <button
                onClick={() => { setReschedulingMeeting(null); setIsTimeDropdownOpen(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-blue-200 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* Meeting info */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meeting</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{reschedulingMeeting.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{reschedulingMeeting.client_name}</p>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> New Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white rounded-lg border border-slate-200 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8] focus:border-transparent text-gray-700 hover:border-[#0076d8] transition"
                />
              </div>

              {/* Time slots */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> New Time
                  </label>
                  {rescheduleTimeSlot && (
                    <span className="text-xs font-bold text-[#0076d8] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      {rescheduleTimeSlot}
                    </span>
                  )}
                </div>

                {/* Scrollable pill grid */}
                <div className="border border-slate-200 rounded-xl">
                  <div className="grid grid-cols-3 gap-1.5 p-2 max-h-[180px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-track]:bg-slate-50">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setRescheduleTimeSlot(time)}
                        className={`py-2 px-1 text-[11px] font-medium rounded-2xl border transition-all text-center cursor-pointer ${rescheduleTimeSlot === time
                          ? 'bg-[#0076d8] text-white border-[#0076d8] shadow-sm'
                          : 'bg-white text-gray-600 border-slate-200 hover:border-[#0076d8] hover:text-[#0076d8] hover:bg-blue-50'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-4 py-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => { setReschedulingMeeting(null); setIsTimeDropdownOpen(false); }}
                className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer"
              >
                Confirm Rescheduling
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
            <h3 className="text-base font-extrabold text-slate-800">Confirm Delete</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Are you sure you want to delete {deleteTargetIds ? `${deleteTargetIds.length} meeting(s)` : 'this meeting'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleteConfirmOpen(false);
                  if (deleteTargetId !== null) {
                    await proceedDelete(deleteTargetId);
                  } else if (deleteTargetIds !== null) {
                    await proceedBulkDelete(deleteTargetIds);
                  }
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-all"
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

export default MeetingsCMS;
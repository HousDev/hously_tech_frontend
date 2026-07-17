import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import {
  Trash2, Eye, MapPin, Briefcase,
  Users, Search, Filter,
  X, Mail, FileText, Linkedin,
  ChevronLeft, ChevronRight,
  Zap as ZapIcon, Check, XCircle,
  IndianRupee, CheckCircle,
  Download, Upload, Calendar,
  MessageSquare, Phone, Video,
  User, GraduationCap, HelpCircle,
  Award, Globe, Clock
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { careerApi, type Application, type ApplicationStats } from '../../lib/careerApi';
import { io } from 'socket.io-client';

interface TimelineItem {
  id: number;
  type: string;
  content: string;
  created_at: string;
  status?: string;
  scheduled_at?: string;
  mode?: string;
  link_or_address?: string;
  message?: string;
}

// ── Animated Modal Wrapper ────────────────────────────────────────────────────
const AnimatedModal: React.FC<{
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  zIndex?: string;
}> = ({ show, onClose, children, maxWidth = 'max-w-xl', zIndex = 'z-50' }) => {
  const [visible, setVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-3 sm:p-4`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-[280ms]"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Card */}
      <div
        className={`relative w-full ${maxWidth} transition-all duration-[280ms]`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ── Schedule a Meeting Popup Component ──────────────────────────────────
const ScheduleMeetingPopup: React.FC<{
  onClose: () => void;
  calendarSelectedCandidate: Application | null;
  onSchedule: (scheduledAt: string, mode: string, linkOrAddress: string) => Promise<void>;
}> = ({ onClose, calendarSelectedCandidate, onSchedule }) => {
  const today = new Date();
  const [smYear, setSmYear] = useState(today.getFullYear());
  const [smMonth, setSmMonth] = useState(today.getMonth());
  const [smSelectedDate, setSmSelectedDate] = useState<Date>(today);
  const [smTimeFormat, setSmTimeFormat] = useState<'12h' | '24h'>('12h');
  const [smSelectedTime, setSmSelectedTime] = useState<string | null>(null);
  const [smInterviewLink, setSmInterviewLink] = useState('');
  const [loading, setLoading] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const firstDay = new Date(smYear, smMonth, 1).getDay();
  const daysInMonth = new Date(smYear, smMonth + 1, 0).getDate();
  const timeSlots12 = [
    '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
    '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
    '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm',
    '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm'
  ];
  const timeSlots24 = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];
  const timeSlots = smTimeFormat === '12h' ? timeSlots12 : timeSlots24;
  const fmtSelectedDate = smSelectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const prevMonth = () => { if (smMonth === 0) { setSmMonth(11); setSmYear(y => y - 1); } else setSmMonth(m => m - 1); };
  const nextMonth = () => { if (smMonth === 11) { setSmMonth(0); setSmYear(y => y + 1); } else setSmMonth(m => m + 1); };
  const isToday = (d: number) => d === today.getDate() && smMonth === today.getMonth() && smYear === today.getFullYear();
  const isSelected = (d: number) => d === smSelectedDate.getDate() && smMonth === smSelectedDate.getMonth() && smYear === smSelectedDate.getFullYear();

  const getScheduledDateTime = (): Date | null => {
    if (!smSelectedTime) return null;
    const date = new Date(smSelectedDate);
    let hours = 0;
    let minutes = 0;

    if (smTimeFormat === '12h') {
      const match = smSelectedTime.match(/^(\d+):(\d+)(am|pm)$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toLowerCase();
        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        hours = h;
        minutes = m;
      }
    } else {
      const parts = smSelectedTime.split(':');
      if (parts.length === 2) {
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
      }
    }
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const handleSchedule = async () => {
    if (loading) return;
    if (!calendarSelectedCandidate) { toast.error('Please select a candidate'); return; }
    if (!smSelectedTime) { toast.error('Please select a time slot'); return; }

    const dt = getScheduledDateTime();
    if (!dt) return;

    const pad = (n: number) => String(n).padStart(2, '0');
    const scheduledAtStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

    try {
      setLoading(true);
      await onSchedule(scheduledAtStr, 'online', smInterviewLink);
      toast.success(`Interview scheduled for ${calendarSelectedCandidate.applicant_name} on ${fmtSelectedDate} at ${smSelectedTime}`);
      onClose();
    } catch (err) {
      toast.error('Failed to schedule interview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedModal show onClose={onClose} maxWidth="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible flex flex-col sm:block">
        {/* Title */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-7 pb-2 border-b border-slate-100">
          <div className="flex-1" />
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D1B3E] tracking-tight whitespace-nowrap">
              Schedule Interview
            </h2>
            <div className="mx-auto mt-1.5 w-10 h-1 rounded-full bg-yellow-400" />
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 sm:overflow-y-auto sm:max-h-[60vh] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* ── LEFT: Calendar ── */}
          <div className="flex-1 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition text-slate-600 cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-[#0D1B3E] text-sm sm:text-base">{monthNames[smMonth]} {smYear}</span>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition text-slate-600 cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSmSelectedDate(new Date(smYear, smMonth, day))}
                  className={`mx-auto w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer
                    ${isSelected(day)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105 font-bold'
                      : isToday(day)
                        ? 'border-2 border-blue-400 text-blue-600 font-bold'
                        : 'text-slate-700 hover:bg-white hover:shadow-sm border border-transparent'}`}
                >{day}</button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Time + Candidate ── */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Candidate Details</h4>
              <p className="text-sm font-bold text-slate-800">{calendarSelectedCandidate?.applicant_name}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{calendarSelectedCandidate?.job_title}</p>
              <p className="text-xs font-semibold text-slate-600 mt-2 flex items-center gap-1.5">
                <Calendar size={13} className="text-blue-600" />
                <span>{fmtSelectedDate}</span>
              </p>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Available Times</h4>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button onClick={() => setSmTimeFormat('12h')} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${smTimeFormat === '12h' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'}`}>12h</button>
                  <button onClick={() => setSmTimeFormat('24h')} className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${smTimeFormat === '24h' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'}`}>24h</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-36 grid grid-cols-3 gap-1.5 pr-1">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSmSelectedTime(slot)}
                    className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer
                      ${smSelectedTime === slot
                        ? 'bg-[#0D47A1] text-white border-transparent shadow shadow-blue-800/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >{slot}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Interview Link / Location</label>
              <input
                type="text"
                placeholder="Google Meet Link or Room No."
                value={smInterviewLink}
                onChange={e => setSmInterviewLink(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none transition font-semibold text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >Cancel</button>
              <button
                type="button"
                onClick={handleSchedule}
                disabled={loading}
                className="flex-1 py-2 bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-xl text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
              >{loading ? 'Scheduling...' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedModal>
  );
};

const JobApplicants: React.FC = () => {
  const experienceFilterOptions = [
    { value: "all", label: "All Experience" },
    { value: "fresher", label: "Fresher (No experience)" },
    { value: "1-2 years", label: "1-2 years" },
    { value: "2-4 years", label: "2-4 years" },
    { value: "4-6 years", label: "4-6 years" },
    { value: "6-9 years", label: "6-9 years" },
    { value: "9+ years", label: "9+ years" },
  ];

  const SPECIALIZATION_MAP: Record<string, string[]> = {
    'B.TECH': ['CSE', 'IT', 'AI & ML', 'DS', 'Cyber Security', 'ECE', 'EE', 'ME', 'CE', 'other'],
    'M.Tech': ['CSE', 'AI', 'ML', 'DS', 'Cyber Security', 'SE', 'Power Systems', 'Structural', 'other'],
    'Diploma': ['CE', 'ME', 'EE', 'ECE', 'IT', 'Auto', 'Civil', 'other'],
    'B.COM': ['Accounting', 'Finance', 'Banking', 'Taxation', 'Marketing', 'HR', 'Economics', 'IB', 'other'],
    'MBA': ['Marketing', 'Finance', 'HR', 'Operations', 'Business Analytics', 'IT', 'IB', 'SCM', 'Digital Marketing', 'other'],
    'BSC': ['CS', 'IT', 'DS', 'AI', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Biotechnology', 'Microbiology', 'Agriculture', 'Nursing', 'other'],
    'DCA': ['Computer Apps', 'Web Design', 'Programming', 'DBMS', 'Networking', 'Tally', 'MS Office', 'other'],
    'BBA': ['Marketing', 'Finance', 'HR', 'Business Analytics', 'Digital Marketing', 'Sales', 'Retail', 'IB', 'SCM', 'Entrepreneurship', 'other'],
    'CA': ['Audit', 'Taxation', 'GST', 'Finance', 'Risk', 'Forensic', 'Consulting', 'Investment Banking', 'other'],
    'OTHER': ['other']
  };

  // States
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalApps, setTotalApps] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [hasOpenedApp, setHasOpenedApp] = useState<number | null>(null);

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [deleteType, setDeleteType] = useState<'application' | 'bulk_apps'>('application');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [appStats, setAppStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  const lastUpdatedIdsRef = React.useRef<number[]>([]);

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Job Applicants');
      setHeaderSubtitle(`Track & evaluate incoming talent applications (${appStats.total} candidates)`);
    }
  }, [appStats.total, setHeaderTitle, setHeaderSubtitle]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [positionFilter, setPositionFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [eduBranchFilter, setEduBranchFilter] = useState('all');
  const [eduSpecFilter, setEduSpecFilter] = useState('all');

  // Custom Date Filters & Side drawer states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ignoreDate, setIgnoreDate] = useState(false);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);

  const [tempStatusFilter, setTempStatusFilter] = useState('all');
  const [tempPositionFilter, setTempPositionFilter] = useState('all');
  const [tempExperienceFilter, setTempExperienceFilter] = useState('all');
  const [tempGenderFilter, setTempGenderFilter] = useState('all');
  const [tempCityFilter, setTempCityFilter] = useState('all');
  const [tempStateFilter, setTempStateFilter] = useState('all');
  const [tempEduBranchFilter, setTempEduBranchFilter] = useState('all');
  const [tempEduSpecFilter, setTempEduSpecFilter] = useState('all');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempIgnoreDate, setTempIgnoreDate] = useState(false);

  useEffect(() => {
    if (isSideFilterOpen) {
      setTempStatusFilter(statusFilter);
      setTempPositionFilter(positionFilter);
      setTempExperienceFilter(experienceFilter);
      setTempGenderFilter(genderFilter);
      setTempCityFilter(cityFilter);
      setTempStateFilter(stateFilter);
      setTempEduBranchFilter(eduBranchFilter);
      setTempEduSpecFilter(eduSpecFilter);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setTempIgnoreDate(ignoreDate);
    }
  }, [
    isSideFilterOpen, statusFilter, positionFilter, experienceFilter,
    genderFilter, cityFilter, stateFilter, eduBranchFilter,
    eduSpecFilter, startDate, endDate, ignoreDate
  ]);

  // Column search filters
  const [columnFilters, setColumnFilters] = useState({
    applicant: '',
    position: '',
    experience: '',
    status: '',
    mobile: '',
    branch: ''
  });

  // Calendar search popup state
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [calendarSelectedCandidate, setCalendarSelectedCandidate] = useState<Application | null>(null);

  // Candidate Details Popup State
  const [viewingCandidateApp, setViewingCandidateApp] = useState<Application | null>(null);
  const [candidatePopupTab, setCandidatePopupTab] = useState<'overview' | 'personal' | 'candidate' | 'education' | 'statement'>('overview');

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [interviewForm, setInterviewForm] = useState({
    scheduled_at: '',
    mode: 'online',
    link_or_address: '',
    message: ''
  });
  const [newFollowup, setNewFollowup] = useState('');
  const [modalTab, setModalTab] = useState('overview');

  // Selection state
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);

  // Sort state
  const [sortField] = useState<string>('');
  const [sortDirection] = useState<'asc' | 'desc'>('asc');

  // Real-Time Socket Connection Setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
      if (userStr) user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user for socket:', e);
    }

    if (!token || !user) return;

    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const socket = io(SOCKET_URL, {
      auth: { token, userId: user.id },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[JobApplicants] Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[JobApplicants] Socket disconnected.');
    });

    // New application submitted by a candidate
    socket.on('new_application', (data) => {
      console.log('[JobApplicants] new_application received:', data);
      toast.success(`New application from ${data.applicant_name || 'a candidate'}!`, {
        position: 'bottom-right',
        duration: 4000,
      });
      fetchApplications();
      fetchAppStats();
    });

    socket.on('application_status_change', (data) => {
      console.log('[JobApplicants] application_status_change received:', data);
      const index = lastUpdatedIdsRef.current.indexOf(Number(data.id));
      if (index > -1) {
        lastUpdatedIdsRef.current.splice(index, 1);
      } else {
        toast(`Status updated → ${data.status}`, {
          position: 'bottom-right',
          duration: 3000,
          icon: '🔄',
        });
      }
      fetchApplications();
      fetchAppStats();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAppClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteType('application');
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedApplications.length === 0) {
      toast.error('Please select items to delete');
      return;
    }
    setDeleteTargetIds(selectedApplications);
    setDeleteType('bulk_apps');
    setIsDeleteConfirmOpen(true);
  };

  const proceedDeleteApp = async (id: number) => {
    const deleteToast = toast.loading('Deleting application...');
    try {
      await careerApi.deleteApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      setSelectedApplications(prev => prev.filter(appId => appId !== id));
      toast.success('Application deleted successfully', { id: deleteToast });
      fetchAppStats();
    } catch (err: unknown) {
      toast.error('Failed to delete application', { id: deleteToast });
      console.error(err);
    }
  };

  const proceedBulkDeleteApps = async (ids: number[]) => {
    const loadingToast = toast.loading(`Deleting ${ids.length} application(s)...`);
    try {
      for (const id of ids) {
        await careerApi.deleteApplication(id);
      }
      setApplications(prev => prev.filter(app => !ids.includes(app.id)));
      setSelectedApplications([]);
      toast.success(`${ids.length} application(s) deleted successfully`, { id: loadingToast });
      fetchAppStats();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete applications', { id: loadingToast });
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchAppStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, statusFilter, searchTerm, positionFilter, experienceFilter, startDate, endDate, ignoreDate, genderFilter, cityFilter, stateFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await careerApi.getApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        job_title: positionFilter !== 'all' ? positionFilter : undefined,
        experience_level: experienceFilter !== 'all' ? experienceFilter : undefined,
        startDate: !ignoreDate ? (startDate || undefined) : undefined,
        endDate: !ignoreDate ? (endDate || undefined) : undefined,
        gender: genderFilter !== 'all' ? genderFilter : undefined,
        city: cityFilter !== 'all' ? cityFilter : undefined,
        state: stateFilter !== 'all' ? stateFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sort: sortField || undefined,
        order: sortDirection
      });
      setApplications(response.applications);
      setTotalApps(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appIdStr = params.get('application');
    if (appIdStr) {
      const appId = parseInt(appIdStr, 10);
      if (!isNaN(appId) && hasOpenedApp !== appId) {
        setHasOpenedApp(appId);
        careerApi.getApplications({ limit: 100 }).then(res => {
          const found = res.applications.find(a => a.id === appId);
          if (found) {
            setViewingCandidateApp(found);
            setCandidatePopupTab('overview');
          }
        }).catch(console.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, hasOpenedApp]);

  const getBranchSpecVal = (app: Application) => {
    let branch = app.branch || '';
    let spec = '';
    if (!branch && app.education_list) {
      try {
        const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
        if (Array.isArray(edu) && edu.length > 0) {
          for (const item of edu) {
            if (item.branch) branch = item.branch;
            if (item.specialization) spec = item.specialization;
            if (item.stream) spec = item.stream;
            if (branch || spec) break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else if (app.education_list) {
      try {
        const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
        if (Array.isArray(edu) && edu.length > 0) {
          for (const item of edu) {
            if (item.specialization) {
              spec = item.specialization;
              break;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (branch && spec) return `${branch} (${spec})`;
    return branch || spec || '—';
  };

  const checkEducationBranch = (app: Application, selectedBranch: string) => {
    if (!selectedBranch || selectedBranch === 'all') return true;
    const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normSelected = normalize(selectedBranch);

    if (app.branch && normalize(app.branch) === normSelected) return true;
    if (!app.education_list) return false;

    try {
      const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
      if (Array.isArray(edu)) {
        return edu.some(item => {
          const val = item.branch || item.eduLevel || item.degree || '';
          return normalize(val) === normSelected;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const checkEducationSpecialization = (app: Application, selectedSpec: string) => {
    if (!selectedSpec || selectedSpec === 'all') return true;
    const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normSelected = normalize(selectedSpec);

    if (!app.education_list) return false;

    try {
      const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
      if (Array.isArray(edu)) {
        return edu.some(item => {
          const val = item.specialization || item.stream || '';
          return normalize(val) === normSelected;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const renderSectionContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

    return (
      <div className="space-y-2 select-text">
        {lines.map((line, idx) => {
          const bulletMatch = line.match(/^-\s+\*\*(.*?)\*\*[:\s]+(.*)$/);
          if (bulletMatch) {
            const val = bulletMatch[2].trim();
            const cleanVal = (val === '—' || val === 'Same' || val === 'Not Provided' || val === 'undefined') ? '' : val;
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-100 last:border-0 text-xs bg-white hover:bg-slate-50/40 px-1 rounded transition-all">
                <span className="font-extrabold text-slate-400 sm:w-1/3 text-left">{bulletMatch[1]}:</span>
                <span className="font-extrabold text-slate-700 sm:w-2/3 text-left whitespace-pre-line leading-relaxed">{cleanVal}</span>
              </div>
            );
          }

          const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
          if (numberMatch) {
            let cleanText = numberMatch[2].replace(/\*\*/g, '').replace(/\*/g, '').replace(/_/g, '');
            cleanText = cleanText.replace(/:\s*(?:—|Same|Not Provided|undefined)/gi, ': ');
            return (
              <div key={idx} className="flex gap-2.5 py-2 border-b border-slate-100 last:border-0 text-xs items-start">
                <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#0D47A1] shrink-0 text-[10px]">{numberMatch[1]}</span>
                <span className="font-extrabold text-slate-700 select-text text-left leading-relaxed">{cleanText}</span>
              </div>
            );
          }

          if (line.startsWith('- ')) {
            let cleanText = line.substring(2).replace(/\*\*/g, '').replace(/\*/g, '');
            const colonIndex = cleanText.indexOf(':');
            if (colonIndex !== -1) {
              const key = cleanText.substring(0, colonIndex).trim();
              const val = cleanText.substring(colonIndex + 1).trim();
              const cleanVal = (val === '—' || val === 'Same' || val === 'Not Provided' || val === 'undefined') ? '' : val;
              return (
                <div key={idx} className="flex gap-2 py-1.5 border-b border-slate-100 last:border-0 text-xs items-start">
                  <span className="text-[#0D47A1] font-bold shrink-0">•</span>
                  <span className="font-extrabold text-slate-400 w-1/3 text-left">{key}:</span>
                  <span className="font-extrabold text-slate-700 w-2/3 text-left leading-relaxed">{cleanVal}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="flex gap-2 py-1.5 border-b border-slate-100 last:border-0 text-xs items-start">
                <span className="text-[#0D47A1] font-bold shrink-0">•</span>
                <span className="font-extrabold text-slate-700 select-text text-left leading-relaxed">{cleanText}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-line text-left py-1">
              {line.replace(/\*\*/g, '').replace(/\*/g, '').replace(/:\s*(?:—|Same|Not Provided|undefined)/gi, ': ')}
            </p>
          );
        })}
      </div>
    );
  };

  const fetchTimeline = async (appId: number) => {
    try {
      const res = await careerApi.getTimeline(appId);
      setTimeline(res.data.data);
    } catch (err) {
      toast.error('Failed to load timeline');
      console.error(err);
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
      console.error(err);
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
      console.error(err);
    }
  };

  const handleUpdateStatus = async (followupId: number, newStatus: string) => {
    try {
      await careerApi.updateInterviewStatus(followupId, newStatus);
      toast.success('Status updated');
      await fetchTimeline(selectedApp!.id);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const fetchAppStats = async () => {
    try {
      const stats = await careerApi.getApplicationStats();
      setAppStats(stats);
    } catch (error) {
      console.error('Failed to fetch app stats:', error);
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

  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const handleUpdateApplicationStatus = async (id: number, status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired') => {
    const currentApp = applications.find(a => a.id === id);
    if (currentApp?.status === status) return;
    if (processingIds.has(id)) return;

    // Optimistically update UI immediately
    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status } : app)
    );

    if (viewingCandidateApp && viewingCandidateApp.id === id) {
      setViewingCandidateApp(prev => prev ? { ...prev, status } : null);
    }

    setProcessingIds(prev => new Set(prev).add(id));

    try {
      lastUpdatedIdsRef.current.push(id);
      await careerApi.updateApplicationStatus(id, status);
      await fetchApplications();
      await fetchAppStats();
      toast.success(`Updated status to ${status}`);
    } catch (err) {
      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: currentApp?.status || 'pending' } : app)
      );
      if (viewingCandidateApp && viewingCandidateApp.id === id) {
        setViewingCandidateApp(prev => prev ? { ...prev, status: currentApp?.status || 'pending' } : null);
      }
      console.error(err);
      toast.error('Failed to update application status');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBulkUpdateApplicationStatus = async (status: string) => {
    if (selectedApplications.length === 0) {
      toast.error('Please select applications to update');
      return;
    }

    setApplications(prev =>
      prev.map(app =>
        selectedApplications.includes(app.id)
          ? { ...app, status: status as Application['status'] }
          : app
      )
    );

    try {
      lastUpdatedIdsRef.current.push(...selectedApplications);
      for (const id of selectedApplications) {
        await careerApi.updateApplicationStatus(id, status);
      }
      setSelectedApplications([]);
      fetchAppStats();
      fetchApplications();
      toast.success(`Updated status for selected applications`);
    } catch (err) {
      fetchApplications();
      toast.error('Failed to update applications');
      console.error(err);
    }
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

  const handleExportApplications = async () => {
    const exportToast = toast.loading('Preparing applications for export...');
    try {
      const response = await careerApi.getApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        job_title: positionFilter !== 'all' ? positionFilter : undefined,
        experience_level: experienceFilter !== 'all' ? experienceFilter : undefined,
        limit: 99999,
        page: 1
      });

      const exportData = response.applications;
      if (exportData.length === 0) {
        toast.error('No applications found to export', { id: exportToast });
        return;
      }

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '';
        let str = String(val);
        str = str.replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
          return `"${str}"`;
        }
        return str;
      };

      const csvHeaders = [
        'ID', 'Applicant Name', 'Email', 'Phone', 'Job Title',
        'Job ID', 'Experience Level', 'Status', 'Applied At',
        'LinkedIn', 'Portfolio', 'Cover Letter', 'Notes'
      ];

      const csvRows = exportData.map(app => [
        escapeCSV(app.id),
        escapeCSV(app.applicant_name),
        escapeCSV(app.email),
        escapeCSV(app.phone),
        escapeCSV(app.job_title),
        escapeCSV(app.job_id),
        escapeCSV(app.experience_level),
        escapeCSV(app.status),
        escapeCSV(app.applied_at),
        escapeCSV(app.linkedin),
        escapeCSV(app.portfolio),
        escapeCSV(app.cover_letter),
        escapeCSV(app.notes)
      ].join(','));

      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Successfully exported ${exportData.length} application(s)`, { id: exportToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export applications', { id: exportToast });
    }
  };

  const handleImportApplications = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    const importToast = toast.loading('Reading CSV file...');
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        toast.error('Failed to read file content', { id: importToast });
        return;
      }

      try {
        toast.loading('Parsing CSV and validating...', { id: importToast });
        const parseCSV = (csvText: string) => {
          const lines = [];
          let row: string[] = [];
          let insideQuote = false;
          let entry = '';

          for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const nextChar = csvText[i + 1];

            if (char === '"') {
              if (insideQuote && nextChar === '"') {
                entry += '"';
                i++;
              } else {
                insideQuote = !insideQuote;
              }
            } else if (char === ',' && !insideQuote) {
              row.push(entry.trim());
              entry = '';
            } else if ((char === '\r' || char === '\n') && !insideQuote) {
              if (char === '\r' && nextChar === '\n') i++;
              row.push(entry.trim());
              if (row.length > 0 && row.some(cell => cell !== '')) {
                lines.push(row);
              }
              row = [];
              entry = '';
            } else {
              entry += char;
            }
          }
          if (entry || row.length > 0) {
            row.push(entry.trim());
            lines.push(row);
          }
          return lines;
        };

        const parsedLines = parseCSV(text);
        if (parsedLines.length < 2) {
          toast.error('CSV file has no data lines', { id: importToast });
          return;
        }

        const headers = parsedLines[0].map(h => h.toLowerCase());
        const rawRows = parsedLines.slice(1);

        const mappedData = rawRows.map(row => {
          const obj: any = {};
          row.forEach((cell, idx) => {
            const header = headers[idx];
            if (header) obj[header] = cell;
          });
          return obj;
        });

        const payloadList = mappedData.map((item, idx) => {
          const name = item['applicant name'] || item['applicant_name'] || item['name'];
          const email = item['email'];
          const jobIdStr = item['job id'] || item['job_id'];

          if (!name || !email || !jobIdStr) {
            throw new Error(`Row ${idx + 2} is missing required fields (Applicant Name, Email, or Job ID)`);
          }

          const jobId = parseInt(jobIdStr, 10);
          if (isNaN(jobId)) {
            throw new Error(`Row ${idx + 2} has an invalid Job ID: "${jobIdStr}"`);
          }

          return {
            job_id: jobId,
            applicant_name: name,
            email: email,
            phone: item['phone'] || null,
            experience_level: item['experience level'] || item['experience_level'] || null,
            cover_letter: item['cover letter'] || item['cover_letter'] || null,
            resume_path: item['resume path'] || item['resume_path'] || null,
            linkedin: item['linkedin'] || null,
            portfolio: item['portfolio'] || null
          };
        });

        toast.loading(`Importing ${payloadList.length} application(s)...`, { id: importToast });
        const importResult = await careerApi.importApplications(payloadList);
        toast.success(`Successfully imported ${importResult.importedCount} application(s)`, { id: importToast });
        fetchApplications();
        fetchAppStats();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to import CSV applications', { id: importToast });
      }
    };
    reader.readAsText(file);
  };

  const handleSelectItem = (id: number) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app: Application) => {
      // 1. Column Search for Applicant Name
      if (columnFilters.applicant && !app.applicant_name?.toLowerCase().includes(columnFilters.applicant.toLowerCase())) {
        return false;
      }
      // 2. Column Search for Mobile
      if (columnFilters.mobile && !app.phone?.toLowerCase().includes(columnFilters.mobile.toLowerCase())) {
        return false;
      }
      // 3. Column Search for Branch
      if (columnFilters.branch && !getBranchSpecVal(app).toLowerCase().includes(columnFilters.branch.toLowerCase())) {
        return false;
      }
      // 4. Position Dropdown inside column headers
      if (columnFilters.position && columnFilters.position !== 'all' && app.job_title !== columnFilters.position) {
        return false;
      }
      // 5. Experience Dropdown inside column headers
      if (columnFilters.experience && columnFilters.experience !== 'all') {
        const val = app.experience_level?.toLowerCase() || '';
        const selected = columnFilters.experience.toLowerCase();
        if (selected === 'fresher' && !val.includes('fresher')) return false;
        if (selected === '1-2 years' && !val.includes('1-2')) return false;
        if (selected === '2-4 years' && !val.includes('2-4')) return false;
        if (selected === '4-6 years' && !val.includes('4-6')) return false;
        if (selected === '6-9 years' && !val.includes('6-9')) return false;
        if (selected === '9+ years' && !val.includes('9+')) return false;
      }
      // 6. Status Dropdown inside column headers
      if (columnFilters.status && columnFilters.status !== 'all' && app.status !== columnFilters.status) {
        return false;
      }
      // 7. Education Branch and Specialization Sidebar Filters
      if (eduBranchFilter !== 'all' && !checkEducationBranch(app, eduBranchFilter)) {
        return false;
      }
      if (eduSpecFilter !== 'all' && !checkEducationSpecialization(app, eduSpecFilter)) {
        return false;
      }

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, columnFilters, eduBranchFilter, eduSpecFilter]);

  const renderPagination = () => {
    const totalPages = Math.ceil(totalApps / itemsPerPage) || 1;
    if (totalPages <= 1) return null;

    return (
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePaginationChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-xs font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >Previous</button>
          <button
            onClick={() => handlePaginationChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-xs font-semibold rounded-md text-slate-700 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >Next</button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">
              Showing <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalApps)}</span> of <span className="font-bold text-slate-700">{totalApps}</span> applicants
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
              <button
                onClick={() => handlePaginationChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-xs font-medium text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePaginationChange(page)}
                  className={`relative inline-flex items-center px-3.5 py-2 border text-xs font-semibold cursor-pointer ${currentPage === page
                    ? 'z-10 bg-[#0D47A1] border-[#0D47A1] text-white'
                    : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                >{page}</button>
              ))}
              <button
                onClick={() => handlePaginationChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-xs font-medium text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const emailVal = viewingCandidateApp?.email || '';
  const phoneVal = viewingCandidateApp?.phone || '';

  const parseJsonArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  const ProfileField = ({ label, value, icon, isLink }: { label: string; value: any; icon?: React.ReactNode; isLink?: boolean }) => {
    const cleanVal = (val: any) => {
      if (val === null || val === undefined || val === '—' || val === 'Same' || val === 'Not Provided') {
        return '';
      }
      return String(val).trim();
    };
    const displayVal = cleanVal(value);

    return (
      <div className="flex flex-col space-y-0.5">
        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/30 border border-slate-200 rounded-lg min-h-[34px]">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {isLink && displayVal ? (
            <a
              href={displayVal.startsWith('http') ? displayVal : `https://${displayVal}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline select-text truncate"
            >{displayVal}</a>
          ) : (
            <span className="text-xs font-semibold text-slate-700 select-text truncate">{displayVal || '—'}</span>
          )}
        </div>
      </div>
    );
  };

  if (viewingCandidateApp) {
    const candidateTabs = [
      { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
      { id: 'personal', label: 'Personal Info', icon: <User size={14} /> },
      { id: 'candidate', label: 'Work Profile', icon: <Briefcase size={14} /> },
      { id: 'education', label: 'Education & Skills', icon: <GraduationCap size={14} /> },
      { id: 'statement', label: 'Availability & Statement', icon: <HelpCircle size={14} /> }
    ] as const;

    return (
      <div className="flex flex-col h-full p-4 bg-[#f8fafc] border border-slate-200/60 rounded-xl overflow-hidden select-text animate-modal-content space-y-4 outline-none focus:outline-none focus:ring-0">
        {/* Back Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setViewingCandidateApp(null)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold text-[#5b5f70] hover:text-[#0D47A1] hover:bg-white rounded-xl transition cursor-pointer outline-none focus:outline-none focus:ring-0 border border-transparent hover:border-slate-200 hover:shadow-sm"
          >
            <ChevronLeft size={16} /> Back to Applications
          </button>
        </div>

        {/* Combined Profile + Tabs Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Profile Header */}
          <div className="px-4 pt-4 pb-3 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#0D47A1] font-bold text-base shrink-0">
              {viewingCandidateApp?.applicant_name?.split(' ').map((n: string) => n.charAt(0)).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-base md:text-lg font-extrabold text-slate-800 leading-tight">{viewingCandidateApp?.applicant_name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
                <span className="text-slate-400 text-[10px] font-semibold">APP-{String(viewingCandidateApp?.id).padStart(3, '0')}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(viewingCandidateApp?.status || 'pending')}`}>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  {viewingCandidateApp?.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Applied Position -</span>
              <span className="bg-[#0D47A1]/5 text-[#0D47A1] px-2.5 py-0.5 rounded-full font-bold border border-[#0D47A1]/20">
                {viewingCandidateApp?.job_title || 'None'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex gap-1 overflow-x-auto px-4">
              {candidateTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCandidatePopupTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-bold transition whitespace-nowrap cursor-pointer outline-none focus:outline-none focus:ring-0 border-b-2 ${candidatePopupTab === tab.id
                    ? 'text-[#0D47A1] border-[#0D47A1] bg-[#0D47A1]/5'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {tab.icon} <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mt-1 px-4 pb-4 select-text">
            {candidatePopupTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <FileText size={13} />
                    <span>Application Summary</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ProfileField label="Full Name" value={viewingCandidateApp?.applicant_name} icon={<User size={13} />} />
                    <ProfileField label="Email" value={viewingCandidateApp?.email} icon={<Mail size={13} />} />
                    <ProfileField label="Phone" value={viewingCandidateApp?.phone} icon={<Phone size={13} />} />
                    <ProfileField label="Position Applied" value={viewingCandidateApp?.job_title} icon={<Briefcase size={13} />} />
                    <ProfileField label="Experience Level" value={viewingCandidateApp?.experience_level} icon={<Award size={13} />} />
                    <ProfileField label="Applied Date" value={viewingCandidateApp ? formatDate(viewingCandidateApp.applied_at) : ''} icon={<Calendar size={13} />} />
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <FileText size={13} />
                      <span>Candidate Documents</span>
                    </p>
                    <div className="flex items-center space-x-3 bg-white border border-slate-150 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">Candidate_Resume.pdf</p>
                        <p className="text-[10px] text-slate-400">PDF Document</p>
                      </div>
                    </div>
                  </div>
                  {viewingCandidateApp?.resume_path ? (
                    <button
                      onClick={() => viewResume(viewingCandidateApp.resume_path!)}
                      className="w-full bg-[#0D47A1] hover:bg-[#1976D2] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm animate-pulse-subtle"
                    >
                      <Eye size={13} /><span>View Resume in New Tab</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold italic text-center py-2">No resume uploaded.</span>
                  )}
                </div>
              </div>
            )}

            {candidatePopupTab === 'personal' && (
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3 animate-fadeIn">
                <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <User size={13} />
                  <span>Personal & Address Details</span>
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <ProfileField label="Full Name" value={viewingCandidateApp?.applicant_name} icon={<User size={13} />} />
                  <ProfileField label="Email" value={viewingCandidateApp?.email} icon={<Mail size={13} />} />
                  <ProfileField label="Phone / Mobile" value={viewingCandidateApp?.phone} icon={<Phone size={13} />} />
                  <ProfileField label="WhatsApp Number" value={viewingCandidateApp?.whatsapp} icon={<Phone size={13} />} />
                  <ProfileField label="Gender" value={viewingCandidateApp?.gender} icon={<Users size={13} />} />
                  <ProfileField label="Date of Birth" value={viewingCandidateApp?.dob} icon={<Calendar size={13} />} />
                  <ProfileField label="Current City" value={viewingCandidateApp?.current_city} icon={<MapPin size={13} />} />
                  <ProfileField label="State / Province" value={viewingCandidateApp?.state} icon={<MapPin size={13} />} />
                  <ProfileField label="Country" value={viewingCandidateApp?.country} icon={<Globe size={13} />} />
                  <ProfileField label="LinkedIn Portfolio" value={viewingCandidateApp?.linkedin} icon={<Linkedin size={13} className="text-blue-600" />} isLink />
                  <ProfileField label="Website / Portfolio" value={viewingCandidateApp?.portfolio} icon={<Globe size={13} className="text-emerald-600" />} isLink />
                  <div className="col-span-2 lg:col-span-1">
                    <ProfileField label="Current Address" value={viewingCandidateApp?.current_address} icon={<MapPin size={13} />} />
                  </div>
                </div>
              </div>
            )}

            {candidatePopupTab === 'candidate' && (
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3 animate-fadeIn">
                <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <Briefcase size={13} />
                  <span>Candidate Type & Experience</span>
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <ProfileField label="Candidate Classification" value={viewingCandidateApp?.candidate_type} icon={<Briefcase size={13} />} />
                  {viewingCandidateApp?.candidate_type === 'fresher' && (
                    <ProfileField label="Currently Studying?" value={viewingCandidateApp?.fresher_studying} icon={<HelpCircle size={13} />} />
                  )}
                  {viewingCandidateApp?.candidate_type === 'experienced' && (
                    <>
                      <ProfileField label="Current Company" value={viewingCandidateApp?.current_company} icon={<Briefcase size={13} />} />
                      <ProfileField label="Designation" value={viewingCandidateApp?.designation} icon={<Briefcase size={13} />} />
                      <ProfileField label="Employment Status" value={viewingCandidateApp?.employment_status} icon={<Award size={13} />} />
                      <ProfileField label="Industry Sector" value={viewingCandidateApp?.industry} icon={<Briefcase size={13} />} />
                      <ProfileField label="Total Experience" value={viewingCandidateApp?.total_experience} icon={<Briefcase size={13} />} />
                      <ProfileField label="Relevant Experience" value={viewingCandidateApp?.relevant_experience} icon={<Briefcase size={13} />} />
                      <ProfileField label="Current CTC" value={viewingCandidateApp?.current_ctc} icon={<IndianRupee size={13} />} />
                      <ProfileField label="Expected CTC" value={viewingCandidateApp?.expected_ctc} icon={<IndianRupee size={13} />} />
                      <ProfileField label="Notice Period" value={viewingCandidateApp?.notice_period} icon={<Clock size={13} />} />
                    </>
                  )}
                  {viewingCandidateApp?.candidate_type === 'internship' && (
                    <>
                      <ProfileField label="College/School" value={viewingCandidateApp?.college} icon={<GraduationCap size={13} />} />
                      <ProfileField label="University Board" value={viewingCandidateApp?.university} icon={<GraduationCap size={13} />} />
                      <ProfileField label="Degree / Course" value={viewingCandidateApp?.degree} icon={<GraduationCap size={13} />} />
                      <ProfileField label="Degree / Specialization" value={viewingCandidateApp?.branch} icon={<GraduationCap size={13} />} />
                      <ProfileField label="Current Semester" value={viewingCandidateApp?.semester} icon={<Clock size={13} />} />
                      <ProfileField label="Expected Graduation Year" value={viewingCandidateApp?.expected_grad_year} icon={<Calendar size={13} />} />
                      <ProfileField label="Internship Duration" value={viewingCandidateApp?.duration} icon={<Clock size={13} />} />
                      <ProfileField label="Available From Date" value={viewingCandidateApp?.available_from} icon={<Calendar size={13} />} />
                      <ProfileField label="Stipend Expectation" value={viewingCandidateApp?.stipend_pref} icon={<IndianRupee size={13} />} />
                    </>
                  )}
                </div>

                {viewingCandidateApp?.candidate_type === 'experienced' && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Employment History (Previous Companies)</p>
                    {(() => {
                      const list = parseJsonArray(viewingCandidateApp?.prev_companies);
                      if (list.length === 0) {
                        return <p className="text-xs text-slate-400 italic">No previous employment details provided.</p>;
                      }
                      return (
                        <div className="border border-slate-150 rounded-xl overflow-hidden text-xs bg-white">
                          <table className="min-w-full divide-y divide-slate-150">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Company</th>
                                <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                              {list.map((c: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-3 py-1.5 font-semibold text-slate-700">{c.company || ''}</td>
                                  <td className="px-3 py-1.5 text-slate-600">{c.designation || ''}</td>
                                  <td className="px-3 py-1.5 text-slate-500">{c.duration || ''}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {candidatePopupTab === 'education' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={13} />
                    <span>Academic Qualifications</span>
                  </p>
                  {(() => {
                    const list = parseJsonArray(viewingCandidateApp?.education_list);
                    if (list.length === 0) {
                      return <p className="text-xs text-slate-400 italic">No academic history provided.</p>;
                    }
                    return (
                      <div className="border border-slate-150 rounded-xl overflow-hidden text-xs bg-white">
                        <table className="min-w-full divide-y divide-slate-150">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Level</th>
                              <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Institute</th>
                              <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                              <th className="px-3 py-1.5 text-left font-bold text-slate-500 uppercase tracking-wider">Year</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {list.map((edu: any, index: number) => (
                              <tr key={index}>
                                <td className="px-3 py-1.5 font-semibold text-slate-700">{edu.eduLevel || ''}</td>
                                <td className="px-3 py-1.5 text-slate-600">{edu.institute || ''}</td>
                                <td className="px-3 py-1.5 text-slate-500">{edu.branch || ''}</td>
                                <td className="px-3 py-1.5 text-slate-500">{edu.passoutYear || ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Briefcase size={13} />
                    <span>Skills & Competencies</span>
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-col border-b border-slate-100 pb-1.5">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">Primary Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(viewingCandidateApp?.primary_skills).map((skill: string, i: number) => (
                          <span key={i} className="bg-blue-50 text-[#0D47A1] border border-blue-100/50 text-[10px] font-bold px-2 py-0.5 rounded-md">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col border-b border-slate-100 pb-1.5">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">Secondary Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {parseJsonArray(viewingCandidateApp?.secondary_skills).map((skill: string, i: number) => (
                          <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ProfileField label="Skill Level" value={viewingCandidateApp?.skill_level} icon={<Award size={13} />} />
                      <ProfileField label="Languages Known" value={viewingCandidateApp?.languages} icon={<Globe size={13} />} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {candidatePopupTab === 'statement' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Availability Details</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ProfileField label="Earliest Joining Date" value={viewingCandidateApp?.earliest_joining_date} icon={<Calendar size={13} />} />
                    <ProfileField label="Preferred Work Mode" value={viewingCandidateApp?.preferred_work_mode} icon={<Briefcase size={13} />} />
                    <ProfileField label="Willing to Relocate?" value={viewingCandidateApp?.willing_to_relocate} icon={<Globe size={13} />} />
                    <ProfileField label="Preferred Interview Time" value={viewingCandidateApp?.preferred_interview_time} icon={<Clock size={13} />} />
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <HelpCircle size={13} />
                    <span>Why Hously / Statement</span>
                  </p>
                  <div className="text-xs leading-relaxed text-slate-600 bg-white p-3 border border-slate-150 rounded-xl font-medium min-h-[100px] select-text">
                    {viewingCandidateApp?.why_consider || 'No custom statement provided.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 bg-[#f8fafc] select-none">
      <Toaster position="top-right" />
      {/* Stats Cards - Applications */}
      {appStats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6 flex-shrink-0">
          <div className="bg-blue-50/40 border border-blue-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Apps</p>
            <p className="text-sm font-extrabold text-blue-600">{appStats.total || 0}</p>
          </div>
          <div className="bg-yellow-50/40 border border-yellow-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-sm font-extrabold text-yellow-600">{appStats.pending || 0}</p>
          </div>
          <div className="bg-sky-50/40 border border-sky-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reviewed</p>
            <p className="text-sm font-extrabold text-sky-600">{appStats.reviewed || 0}</p>
          </div>
          <div className="bg-green-50/40 border border-green-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Shortlisted</p>
            <p className="text-sm font-extrabold text-[#0D47A1]">{appStats.shortlisted || 0}</p>
          </div>
          <div className="bg-red-50/40 border border-red-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rejected</p>
            <p className="text-sm font-extrabold text-red-600">{appStats.rejected || 0}</p>
          </div>
          <div className="bg-purple-50/40 border border-purple-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hired</p>
            <p className="text-sm font-extrabold text-purple-600">{appStats.hired || 0}</p>
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-8 pr-3 py-1.5 w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] transition-all outline-none"
          />
        </div>

        {/* Applications Filter Bar Layout */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-[#0D47A1] outline-none text-slate-700 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="9999">All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportApplications}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
            <button
              onClick={() => document.getElementById('csv-import-input')?.click()}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
            >
              <Upload size={13} />
              <span>Import</span>
            </button>
            <input
              id="csv-import-input"
              type="file"
              accept=".csv"
              onChange={handleImportApplications}
              className="hidden"
            />
            <button
              onClick={() => setIsSideFilterOpen(true)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
            >
              <Filter size={13} className="text-[#0D47A1]" />
              <span>Filters</span>
              {(statusFilter !== 'all' || positionFilter !== 'all' || experienceFilter !== 'all' || startDate || endDate) && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedApplications.length > 0 && (
        <div className="mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg flex-shrink-0 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                <span className="text-xs sm:text-sm font-medium text-blue-800">
                  {selectedApplications.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  onChange={(e) => handleBulkUpdateApplicationStatus(e.target.value)}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition cursor-pointer"
                >
                  <option value="">Update Status</option>
                  <option value="reviewed">Mark Reviewed</option>
                  <option value="shortlisted">Mark Shortlisted</option>
                  <option value="rejected">Mark Rejected</option>
                  <option value="hired">Mark Hired</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleBulkDeleteClick}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition cursor-pointer font-bold"
            >Delete ({selectedApplications.length})</button>
          </div>
        </div>
      )}

      {/* Main Content Table Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200/65 shadow-sm rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="min-w-full border-collapse border border-slate-100">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
              <tr>
                <th className="px-2 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-slate-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="h-3.5 w-3.5 text-[#0D47A1] rounded border-slate-300 focus:ring-[#0D47A1] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-44 border-r border-slate-200">
                  Applicant
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-slate-200">
                  Mobile No.
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-slate-200">
                  Position
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-slate-200">
                  Experience
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-44 border-r border-slate-200">
                  Degree / Specialization
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-slate-200">
                  Status
                </th>
                <th className="px-3 py-2 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36">
                  Actions
                </th>
              </tr>
              <tr className="bg-slate-100/50 border-b border-slate-200">
                <th className="px-2 py-1 border-r border-slate-200"></th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <input
                    type="text"
                    placeholder="Search applicant..."
                    value={columnFilters.applicant}
                    onChange={(e) => setColumnFilters({ ...columnFilters, applicant: e.target.value })}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                  />
                </th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <input
                    type="text"
                    placeholder="Search mobile..."
                    value={columnFilters.mobile}
                    onChange={(e) => setColumnFilters({ ...columnFilters, mobile: e.target.value })}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                  />
                </th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <select
                    value={columnFilters.position}
                    onChange={(e) => setColumnFilters({ ...columnFilters, position: e.target.value })}
                    className="w-full px-1 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="all">All Positions</option>
                    {Array.from(new Set(applications.map(app => app.job_title).filter((t): t is string => !!t))).map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <select
                    value={columnFilters.experience}
                    onChange={(e) => setColumnFilters({ ...columnFilters, experience: e.target.value })}
                    className="w-full px-1 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    {experienceFilterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <input
                    type="text"
                    placeholder="Search branch..."
                    value={columnFilters.branch}
                    onChange={(e) => setColumnFilters({ ...columnFilters, branch: e.target.value })}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                  />
                </th>
                <th className="px-3 py-1 border-r border-slate-200">
                  <select
                    value={columnFilters.status}
                    onChange={(e) => setColumnFilters({ ...columnFilters, status: e.target.value })}
                    className="w-full px-1 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </th>
                <th className="px-3 py-1"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app: Application) => (
                <tr key={app.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="px-2 py-2 border-r border-slate-100">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleSelectItem(app.id)}
                      className="h-3.5 w-3.5 text-[#0D47A1] rounded border-slate-300 focus:ring-[#0D47A1] cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600 text-[10px]">
                          {app.applicant_name?.split(' ').map((name: string) => name.charAt(0)).slice(0, 2).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate leading-tight">{app.applicant_name}</div>
                        <div
                          onClick={() => {
                            const subject = `Interview Schedule: ${app.job_title || 'Position'} - Hously`;
                            const body = `Dear ${app.applicant_name},\n\nThank you for applying for the ${app.job_title || 'Position'} role at Hously.\n\nWe have reviewed your application and would like to invite you for an interview. Here are the details:\n\n- Date: [Enter Date]\n- Time: [Enter Time]\n- Mode: [Online (Google Meet) / In-person]\n- Link/Address: [Meeting Link or Address]\n\nPlease let us know if this works for you.\n\nBest regards,\nHously HR Team`;
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${app.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                          }}
                          className="text-[10px] text-slate-400 mt-0.5 leading-none cursor-pointer hover:text-[#0D47A1] hover:underline truncate max-w-[150px]"
                          title="Compose email to candidate"
                        >{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 text-xs font-bold text-slate-600">
                    {app.phone || '—'}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100">
                    <div className="text-xs font-semibold text-slate-700 leading-tight truncate max-w-[150px]">{app.job_title || 'N/A'}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 leading-none">{formatDate(app.applied_at)}</div>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 text-xs font-semibold text-slate-500">
                    {app.experience_level || '—'}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 text-xs font-bold text-slate-600 truncate max-w-[150px]" title={getBranchSpecVal(app) || ''}>
                    {getBranchSpecVal(app)}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as any)}
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer transition-all outline-none ${getStatusColor(app.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => { setViewingCandidateApp(app); setCandidatePopupTab('overview'); }}
                        className="p-1 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded cursor-pointer transition-all"
                        title="View Candidate Details"
                      ><Eye size={12} /></button>

                      {app.resume_path && (
                        <button
                          onClick={() => downloadResume(app.resume_path!)}
                          className="p-1 text-purple-600 hover:bg-purple-50 border border-purple-100 rounded cursor-pointer transition-all"
                          title="Download Resume"
                        ><Download size={12} /></button>
                      )}

                      <button
                        onClick={() => { setCalendarSelectedCandidate(app); setShowCalendarPopup(true); }}
                        className="p-1 text-amber-600 hover:bg-amber-50 border border-amber-100 rounded cursor-pointer transition-all"
                        title="Schedule Interview"
                      ><Calendar size={12} /></button>

                      <button
                        onClick={() => {
                          const subject = `Interview Schedule: ${app.job_title || 'Position'} - Hously`;
                          const body = `Dear ${app.applicant_name},\n\nThank you for applying for the ${app.job_title || 'Position'} role at Hously.\n\nBest regards,\nHously HR Team`;
                          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${app.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                        }}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded cursor-pointer transition-all"
                        title="Email Candidate"
                      ><Mail size={12} /></button>

                      <button
                        onClick={() => handleDeleteAppClick(app.id)}
                        className="p-1 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                        title="Delete Application"
                      ><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 italic text-sm">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>

      {/* ========== SCHEDULE A MEETING POPUP ========== */}
      {showCalendarPopup && (
        <ScheduleMeetingPopup
          onClose={() => setShowCalendarPopup(false)}
          calendarSelectedCandidate={calendarSelectedCandidate}
          onSchedule={async (scheduledAt, mode, linkOrAddress) => {
            if (!calendarSelectedCandidate) return;
            await careerApi.scheduleInterview(calendarSelectedCandidate.id, {
              scheduled_at: scheduledAt,
              mode: mode,
              link_or_address: linkOrAddress,
              message: ''
            });
            if (selectedApp && selectedApp.id === calendarSelectedCandidate.id) {
              await fetchTimeline(selectedApp.id);
            }
          }}
        />
      )}

      {/* ========== TABBED INTERVIEW & FOLLOW‑UP MODAL ========== */}
      {showInterviewModal && selectedApp && (
        <AnimatedModal show={showInterviewModal} onClose={() => setShowInterviewModal(false)} maxWidth="max-w-xl">
          <div className="relative w-full bg-white rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-xl sticky top-0 z-10">
              <div className="flex justify-between items-center p-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Enquiry Details</h3>
                  <p className="text-blue-100 text-sm">ID: #{selectedApp.id} • {selectedApp.applicant_name}</p>
                </div>
                <button onClick={() => setShowInterviewModal(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 px-4">
              <div className="flex gap-1 overflow-x-auto">
                {['Overview', 'Interactions', 'Meetings', 'Follow Ups', 'Timeline'].map((tab) => {
                  const tabKey = tab.toLowerCase().replace(' ', '_');
                  return (
                    <button
                      key={tabKey}
                      onClick={() => setModalTab(tabKey)}
                      className={`px-3 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap cursor-pointer ${modalTab === tabKey
                        ? 'border-[#0D47A1] text-[#0D47A1]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >{tab}</button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto flex-1">
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
                        <div>
                          <span className="font-medium">Status:</span>
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
                      <button
                        onClick={() => {
                          const subject = `Interview Schedule: ${selectedApp.job_title || 'Position'} - Hously`;
                          const body = `Dear ${selectedApp.applicant_name},\n\nThank you for applying for the ${selectedApp.job_title || 'Position'} role at Hously.\n\nBest regards,\nHously HR Team`;
                          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedApp.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
                      >Email</button>
                      <button
                        onClick={() => {
                          if (selectedApp?.phone) window.location.href = `tel:${selectedApp.phone}`;
                          else toast.error('No phone number available');
                        }}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer"
                      >Call</button>
                      <button
                        onClick={() => setShowInterviewModal(false)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer"
                      >Close</button>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'interactions' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Log a Call / Email</h4>
                    <div className="flex gap-3 mb-3">
                      <select id="interactionType" className="px-3 py-2 border rounded-lg text-sm flex-1">
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
                          toast.error('Please enter a subject');
                          return;
                        }

                        try {
                          await careerApi.addInteraction(selectedApp!.id, type, subject, notes);
                          toast.success('Interaction logged');
                          subjectInput.value = '';
                          notesTextarea.value = '';
                          await fetchTimeline(selectedApp!.id);
                        } catch (err) {
                          toast.error('Failed to log interaction');
                          console.error(err);
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
                    >Add Interaction</button>
                  </div>
                  <div className="space-y-2">
                    {timeline.filter(i => i.type === 'interaction').map(item => (
                      <div key={item.id} className="border-l-4 border-purple-400 pl-3 py-2 bg-gray-50 rounded">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                      </div>
                    ))}
                    {timeline.filter(i => i.type === 'interaction').length === 0 && (
                      <p className="text-gray-400 italic text-sm">No interactions logged.</p>
                    )}
                  </div>
                </div>
              )}

              {modalTab === 'meetings' && (
                <div className="space-y-5">
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
                          onChange={e => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })}
                          className="px-3 py-2 border rounded-lg text-sm"
                        />
                        <select
                          value={interviewForm.mode}
                          onChange={e => setInterviewForm({ ...interviewForm, mode: e.target.value })}
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
                        onChange={e => setInterviewForm({ ...interviewForm, link_or_address: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <textarea
                        placeholder="Interview notes (optional)"
                        rows={2}
                        value={interviewForm.message}
                        onChange={e => setInterviewForm({ ...interviewForm, message: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
                        Schedule Interview
                      </button>
                    </form>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Upcoming & Past Interviews</h4>
                    {timeline.filter(i => i.type === 'interview').map(item => (
                      <div key={item.id} className="border rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-600" />
                            <span className="font-medium">
                              {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : ''}
                            </span>
                          </div>
                          <select
                            value={item.status || 'scheduled'}
                            onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                            className="text-xs border rounded px-2 py-0.5 cursor-pointer"
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
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
                    >Add Follow‑up</button>
                  </div>
                  <div className="space-y-2">
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

              {modalTab === 'timeline' && (
                <div className="space-y-3">
                  {timeline.length === 0 && (
                    <p className="text-gray-400 italic text-sm">No activity logged.</p>
                  )}
                  {timeline.map(item => (
                    <div key={item.id} className="border-l-4 pl-3 py-1" style={{
                      borderLeftColor:
                        item.type === 'interview' ? '#3b82f6' : item.type === 'followup' ? '#10b981' : '#a855f7'
                    }}>
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {item.type === 'interview' ? <Calendar size={14} className="text-blue-600" /> :
                            item.type === 'followup' ? <MessageSquare size={14} className="text-green-600" /> :
                              <Phone size={14} className="text-purple-600" />}
                          <span className="font-medium text-sm capitalize">{item.type}</span>
                          <span className="text-xs text-gray-500">{new Date(item.scheduled_at || item.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimatedModal>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatedModal show={isDeleteConfirmOpen} onClose={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); setDeleteTargetIds(null); }} maxWidth="max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800">Confirm Delete</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Are you sure you want to delete {deleteTargetIds ? `${deleteTargetIds.length} application(s)` : 'this application'}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); setDeleteTargetIds(null); }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
            >Cancel</button>
            <button
              onClick={async () => {
                setIsDeleteConfirmOpen(false);
                if (deleteType === 'application' && deleteTargetId !== null) {
                  await proceedDeleteApp(deleteTargetId);
                } else if (deleteType === 'bulk_apps' && deleteTargetIds !== null) {
                  await proceedBulkDeleteApps(deleteTargetIds);
                }
                setDeleteTargetId(null);
                setDeleteTargetIds(null);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-all"
            >Delete</button>
          </div>
        </div>
      </AnimatedModal>

      {/* ========== SIDE FILTER DRAWER ========== */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isSideFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" onClick={() => setIsSideFilterOpen(false)} />
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className={`w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100 ${isSideFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#0D47A1]" />
                <h2 className="text-base font-extrabold text-[#0D1B3E]">Filters</h2>
              </div>
              <button onClick={() => setIsSideFilterOpen(false)} className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={tempStatusFilter}
                  onChange={(e) => { setTempStatusFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Position</label>
                <select
                  value={tempPositionFilter}
                  onChange={(e) => { setTempPositionFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Positions</option>
                  {Array.from(new Set(applications.map(app => app.job_title).filter((t): t is string => !!t))).map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Experience Level</label>
                <select
                  value={tempExperienceFilter}
                  onChange={(e) => { setTempExperienceFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  {experienceFilterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Gender</label>
                <select
                  value={tempGenderFilter}
                  onChange={(e) => { setTempGenderFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">City / Location</label>
                <select
                  value={tempCityFilter}
                  onChange={(e) => { setTempCityFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Cities</option>
                  {(Array.from(new Set(applications.map(app => app.current_city).filter((c): c is string => !!c))) as string[]).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Education Branch</label>
                <select
                  value={tempEduBranchFilter}
                  onChange={(e) => {
                    setTempEduBranchFilter(e.target.value);
                    setTempEduSpecFilter('all');
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">All Branches</option>
                  <option value="B.TECH">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="Diploma">Diploma</option>
                  <option value="B.COM">B.Com</option>
                  <option value="MBA">MBA</option>
                  <option value="BSC">B.Sc</option>
                  <option value="DCA">DCA</option>
                  <option value="BBA">BBA</option>
                  <option value="CA">CA</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Specialization</label>
                <select
                  disabled={tempEduBranchFilter === 'all'}
                  value={tempEduSpecFilter}
                  onChange={(e) => { setTempEduSpecFilter(e.target.value); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="all">All Specializations</option>
                  {(SPECIALIZATION_MAP[tempEduBranchFilter] || []).map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date Applied</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="ignoreDate"
                      checked={tempIgnoreDate}
                      onChange={(e) => setTempIgnoreDate(e.target.checked)}
                      className="h-3.5 w-3.5 text-[#0D47A1] focus:ring-[#0D47A1] rounded cursor-pointer"
                    />
                    <label htmlFor="ignoreDate" className="text-[10px] font-bold text-slate-600 cursor-pointer uppercase select-none">Ignore Date</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">From</label>
                    <input
                      type="date"
                      disabled={tempIgnoreDate}
                      value={tempStartDate}
                      onChange={(e) => { setTempStartDate(e.target.value); }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-semibold text-slate-700 outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">To</label>
                    <input
                      type="date"
                      disabled={tempIgnoreDate}
                      value={tempEndDate}
                      onChange={(e) => { setTempEndDate(e.target.value); }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] bg-white font-semibold text-slate-700 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setPositionFilter('all');
                  setExperienceFilter('all');
                  setGenderFilter('all');
                  setCityFilter('all');
                  setStateFilter('all');
                  setEduBranchFilter('all');
                  setEduSpecFilter('all');
                  setStartDate('');
                  setEndDate('');
                  setIgnoreDate(false);
                  setCurrentPage(1);
                  setColumnFilters({ applicant: '', position: 'all', experience: 'all', status: 'all', mobile: '', branch: '' });

                  setTempStatusFilter('all');
                  setTempPositionFilter('all');
                  setTempExperienceFilter('all');
                  setTempGenderFilter('all');
                  setTempCityFilter('all');
                  setTempStateFilter('all');
                  setTempEduBranchFilter('all');
                  setTempEduSpecFilter('all');
                  setTempStartDate('');
                  setTempEndDate('');
                  setTempIgnoreDate(false);
                }}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 hover:border-slate-300 text-slate-600 bg-white rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >Clear All</button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter(tempStatusFilter);
                  setPositionFilter(tempPositionFilter);
                  setExperienceFilter(tempExperienceFilter);
                  setGenderFilter(tempGenderFilter);
                  setCityFilter(tempCityFilter);
                  setEduBranchFilter(tempEduBranchFilter);
                  setEduSpecFilter(tempEduSpecFilter);
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                  setIgnoreDate(tempIgnoreDate);
                  setCurrentPage(1);
                  setIsSideFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-xl transition shadow cursor-pointer"
              >Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;

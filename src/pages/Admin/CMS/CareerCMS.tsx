import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Eye, EyeOff, MapPin, Briefcase,
  Users, DollarSign, Clock, Search, Filter,
  Save, X, Mail, FileText, Linkedin,
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
  Upload,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  User,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { careerApi, type Job, type Application, type JobStats, type ApplicationStats } from '../../../lib/careerApi';




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

interface CareerCMSProps {
  isSidebarOpen?: boolean;
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="fixed inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'smSlideUp 0.35s cubic-bezier(0.34,1.46,0.64,1)' }}
      >
        {/* Title */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-7 pb-2">
          <div className="flex-1" />
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D1B3E] tracking-tight whitespace-nowrap">
              Schedule Interview
            </h2>
            <div className="mx-auto mt-1.5 w-10 h-1 rounded-full bg-yellow-400" />
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 px-4 sm:px-6 pb-6 sm:pb-7 pt-4">
          {/* ── LEFT: Calendar ── */}
          <div className="flex-1 bg-gray-50 rounded-2xl p-4 sm:p-5 sm:mr-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-600">
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-[#0D1B3E] text-base">{monthNames[smMonth]} {smYear}</span>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-600">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSmSelectedDate(new Date(smYear, smMonth, day))}
                  className={`mx-auto w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all
                    ${isSelected(day)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                      : isToday(day)
                        ? 'border-2 border-blue-400 text-blue-600'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm border border-transparent'}`}
                >{day}</button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Time + Candidate ── */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D1B3E] text-sm">{fmtSelectedDate}</span>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setSmTimeFormat('12h')} className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${smTimeFormat === '12h' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>12h</button>
                <button onClick={() => setSmTimeFormat('24h')} className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${smTimeFormat === '24h' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>24h</button>
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-5 gap-1.5">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSmSelectedTime(slot)}
                  className={`py-1 rounded-lg text-[10px] font-medium border transition-all
                    ${smSelectedTime === slot
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                >{slot}</button>
              ))}
            </div>

            {/* Candidates Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2.5">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Candidate Details</p>

              {calendarSelectedCandidate && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-[10px]">
                      {calendarSelectedCandidate.applicant_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">{calendarSelectedCandidate.applicant_name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{calendarSelectedCandidate.email}</p>
                  </div>
                </div>
              )}

              {/* Interview Link */}
              <input
                type="text"
                placeholder="Enter interview link"
                value={smInterviewLink}
                onChange={e => setSmInterviewLink(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50 transition"
              />

              {/* Schedule Button */}
              <button
                onClick={handleSchedule}
                disabled={loading}
                className={`w-full py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200'}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  'Schedule Interview'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes smSlideUp {
          from { transform: translateY(50px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        @keyframes smFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

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

interface DynamicListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({
  label,
  items,
  onChange,
  placeholder = "Add item",
  required = false,
}) => {
  const handleItemChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    onChange(updated);
  };

  const handleAddItem = () => {
    onChange([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const displayItems = items.length === 0 && required ? [''] : items;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Add Line</span>
        </button>
      </div>

      <div className="space-y-1">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`${placeholder} #${index + 1}`}
              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
              required={required && index === 0}
            />
            {(displayItems.length > 1 || !required) && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {displayItems.length === 0 && (
          <p className="text-[10px] text-gray-400 italic">No items added yet. Click "Add Line" to add one.</p>
        )}
      </div>
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const location = useLocation();
  const [hasOpenedApp, setHasOpenedApp] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [deleteType, setDeleteType] = useState<'job' | 'application' | 'bulk_jobs' | 'bulk_apps'>('job');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteJobClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteType('job');
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteAppClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteType('application');
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    const selected = activeTab === 'jobs' ? selectedJobs : selectedApplications;
    if (selected.length === 0) {
      toast.error('Please select items to delete');
      return;
    }
    setDeleteTargetIds(selected);
    setDeleteType(activeTab === 'jobs' ? 'bulk_jobs' : 'bulk_apps');
    setIsDeleteConfirmOpen(true);
  };

  const proceedDeleteJob = async (id: number) => {
    const deleteToast = toast.loading('Deleting job...');
    try {
      await careerApi.deleteJob(id);
      setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
      fetchAllData();
      toast.success('Job deleted successfully', { id: deleteToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job', { id: deleteToast });
    }
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

  const proceedBulkDeleteJobs = async (ids: number[]) => {
    const loadingToast = toast.loading(`Deleting ${ids.length} job(s)...`);
    try {
      await careerApi.bulkDeleteJobs(ids);
      setSelectedJobs([]);
      toast.success(`${ids.length} job(s) deleted successfully`, { id: loadingToast });
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete jobs', { id: loadingToast });
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
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete applications', { id: loadingToast });
    }
  };
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

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Careers CMS');
      setHeaderSubtitle(
        activeTab === 'jobs'
          ? `Create & publish career opportunities (${jobStats.total} active listings)`
          : `Track & evaluate incoming talent applications (${appStats.total} candidates)`
      );
    }
  }, [activeTab, jobStats.total, appStats.total, setHeaderTitle, setHeaderSubtitle]);

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
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    salary_range: '',
    experience_level: [] as string[],
    is_active: true,
    application_deadline: '',
    vacancy_count: 1
  });
  const [formStep, setFormStep] = useState(1);
  const [specsTab, setSpecsTab] = useState<'requirements' | 'responsibilities' | 'benefits'>('requirements');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, itemsPerPage, statusFilter, departmentFilter, locationFilter, jobTypeFilter, statusViewFilter, sortField, sortDirection, searchTerm, positionFilter, experienceFilter, startDate, endDate, ignoreDate, genderFilter, cityFilter, stateFilter]); // ✅ ADD experienceFilter, date filters, gender, city, state

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
      setTotalJobs(response.total || 0);
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
    const tab = params.get('tab');
    if (tab === 'jobs' || tab === 'applications') {
      setActiveTab(tab);
    }
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

  const getBranchVal = (app: Application) => {
    if (app.branch) return app.branch;
    if (!app.education_list) return '';
    try {
      const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
      if (Array.isArray(edu) && edu.length > 0) {
        for (const item of edu) {
          if (item.branch) return item.branch;
          if (item.specialization) return item.specialization;
          if (item.stream) return item.stream;
        }
      }
    } catch (e) {}
    return '';
  };

  const getBranchSpecVal = (app: Application) => {
    let branch = app.branch || '';
    let spec = '';
    if (!branch && app.education_list) {
      try {
        const edu = typeof app.education_list === 'string' ? JSON.parse(app.education_list) : app.education_list;
        if (Array.isArray(edu) && edu.length > 0) {
          for (const item of edu) {
            if (item.branch) {
              branch = item.branch;
            }
            if (item.specialization) {
              spec = item.specialization;
            }
            if (item.stream) {
              spec = item.stream;
            }
            if (branch || spec) break;
          }
        }
      } catch (e) {}
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
      } catch (e) {}
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
    } catch {}
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
    } catch {}
    return false;
  };

  // Parse the dossier cover_letter markdown text
  const parseDossier = (coverLetter: string) => {
    const sections: { [key: string]: string } = {};
    if (!coverLetter) return sections;

    const parts = coverLetter.split(/(?=(?:###|##) )/);
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const firstLine = lines[0] || '';
      const headingMatch = firstLine.match(/^(?:###|##)\s+(.*)$/);

      if (headingMatch) {
        const heading = headingMatch[1].trim().toUpperCase();
        const content = lines.slice(1).join('\n').trim();

        if (heading.includes('PERSONAL DETAILS')) {
          sections['PERSONAL'] = content;
        } else if (heading.includes('CANDIDATE TYPE')) {
          const typeMatch = heading.match(/CANDIDATE TYPE:\s*(.*)$/i);
          sections['CANDIDATE_TYPE_NAME'] = typeMatch ? typeMatch[1].trim() : '';
          sections['CANDIDATE_TYPE'] = content;
        } else if (heading.includes('EDUCATION')) {
          sections['EDUCATION'] = content;
        } else if (heading.includes('SKILLS')) {
          sections['SKILLS'] = content;
        } else if (heading.includes('AVAILABILITY')) {
          sections['AVAILABILITY'] = content;
        } else if (heading.includes('CANDIDATE STATEMENT')) {
          sections['STATEMENT'] = content;
        }
      }
    });
    return sections;
  };

  const getValueFromDossier = (coverLetter: string, keyName: string) => {
    if (!coverLetter) return '';
    const lines = coverLetter.split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^-\s+\*\*(.*?)\*\*[:\s]+(.*)$/);
      if (match && match[1].toLowerCase().replace(/\s/g, '').includes(keyName.toLowerCase().replace(/\s/g, ''))) {
        return match[2].trim();
      }
    }
    return '';
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
            let cleanText = numberMatch[2]
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/_/g, '');
            
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

    if (formData.job_type.length === 0) {
      setError('Please select at least one Job Type');
      showToast('Please select at least one Job Type', 'error');
      return;
    }
    if (formData.experience_level.length === 0) {
      setError('Please select at least one Experience Level');
      showToast('Please select at least one Experience Level', 'error');
      return;
    }
    const cleanRequirements = formData.requirements.filter(r => r.trim());
    if (cleanRequirements.length === 0) {
      setError('Please add at least one Requirement');
      showToast('Please add at least one Requirement', 'error');
      return;
    }
    const cleanResponsibilities = formData.responsibilities.filter(r => r.trim());
    if (cleanResponsibilities.length === 0) {
      setError('Please add at least one Responsibility');
      showToast('Please add at least one Responsibility', 'error');
      return;
    }

    try {
      const jobData = {
        ...formData,
        job_type: Array.isArray(formData.job_type)
          ? formData.job_type.join(',')
          : formData.job_type,
        experience_level: Array.isArray(formData.experience_level)
          ? formData.experience_level.join(',')
          : formData.experience_level,
        requirements: cleanRequirements,
        responsibilities: cleanResponsibilities,
        benefits: formData.benefits.filter(b => b.trim()),
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to save job: ' + errorMessage);
      showToast(`Failed to save job: ${errorMessage}`, 'error');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);

    const parseFieldToArray = (val: unknown): string[] => {
      if (Array.isArray(val)) return (val as string[]).filter(Boolean);
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
          // ignore
        }
        return val.split('\n').map(x => x.trim()).filter(Boolean);
      }
      return [];
    };

    setFormData({
      job_title: job.job_title,
      department: job.department || '',
      location: job.location || '',
      job_type: job.job_type
        ? job.job_type.split(',').map((t: string) => t.trim()).filter(Boolean).map((t: string) => {
          // Normalize old lowercase values to match predefined options
          const match = predefinedJobTypes.find(
            opt => opt.toLowerCase() === t.toLowerCase()
          );
          return match || t;
        })
        : [],
      description: job.description,
      requirements: parseFieldToArray(job.requirements),
      responsibilities: parseFieldToArray(job.responsibilities),
      benefits: parseFieldToArray(job.benefits),
      salary_range: job.salary_range || '',
      experience_level: job.experience_level
        ? job.experience_level.split(',').map((e: string) => e.trim()).filter(Boolean).map((e: string) => {
          const match = experienceLevels.find(
            opt => opt.toLowerCase() === e.toLowerCase()
          );
          return match || e;
        })
        : [],
      is_active: job.is_active,
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
      vacancy_count: job.vacancy_count || 1
    });
    setIsModalOpen(true);
  };

  /* Deletion triggers confirm modal */

  // REPLACE with:
  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    const toggleToast = toast.loading(currentStatus ? 'Deactivating job...' : 'Activating job...');

    try {
      await careerApi.updateJob(id, { is_active: !currentStatus });
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully!`, { id: toggleToast });

      // ✅ ADD THIS LINE - Show all jobs to see the status change
      setStatusViewFilter('all');

      fetchAllData();
    } catch (err: unknown) {
      toast.error('Failed to update job status', { id: toggleToast });
      console.error(err);
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

    if (viewingCandidateApp && viewingCandidateApp.id === id) {
      setViewingCandidateApp(prev => prev ? { ...prev, status } : null);
    }

    setProcessingIds(prev => new Set(prev).add(id));

    try {
      await careerApi.updateApplicationStatus(id, status);
      // ✅ ADD THIS LINE – re-fetch to ensure consistency
      await fetchApplications();
      await fetchAppStats();  // <-- ADD THIS LINE to update stats
    } catch (err) {
      // Revert on error
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

  /* Deletion triggers confirm modal */

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
    } catch (err) {
      // Revert on error
      fetchApplications();
      toast.error('Failed to update applications');
      console.error(err);
    }
  };

  const handleAddCustomDept = () => {
    if (customDept.trim()) {
      setFormData({ ...formData, department: customDept });
      setShowCustomDept(false);
      setCustomDept('');
    }
  };

  const handleAddCustomLoc = () => {
    if (customLoc.trim()) {
      setFormData({ ...formData, location: customLoc });
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
    setFormStep(1);
    setSpecsTab('requirements');
    setFormData({
      job_title: '',
      department: '',
      location: '',
      job_type: [],
      description: '',
      requirements: [],
      responsibilities: [],
      benefits: [],
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

  const handleExportApplications = async () => {
    const exportToast = toast.loading('Preparing applications for export...');
    try {
      const response = await careerApi.getApplications({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        job_title: positionFilter !== 'all' ? positionFilter : undefined,
        experience_level: experienceFilter !== 'all' ? experienceFilter : undefined,
        limit: 99999, // fetch all filtered records
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

    // Reset the input value so the same file can be imported again
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
        // Robust CSV Parser
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
              if (char === '\r' && nextChar === '\n') {
                i++;
              }
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
            if (row.some(cell => cell !== '')) {
              lines.push(row);
            }
          }
          return lines;
        };

        const lines = parseCSV(text);
        if (lines.length < 2) {
          toast.error('CSV file is empty or missing data rows', { id: importToast });
          return;
        }

        // Map column headers to standard names (lowercase and no space/underscore)
        const rawHeaders = lines[0];
        const headers = rawHeaders.map(h => h.toLowerCase().replace(/[\s_-]+/g, ''));

        // Fetch all jobs to resolve titles
        const jobsRes = await careerApi.getJobs({ limit: 1000 });
        const allJobs = jobsRes.jobs;

        const applicationsList: any[] = [];
        const errorsList: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          if (row.length === 0 || row.every(cell => cell === '')) continue;

          const item: any = {};
          headers.forEach((header, idx) => {
            if (row[idx] !== undefined) {
              item[header] = row[idx];
            }
          });

          // Resolve fields
          const name = item.applicantname || item.name || item.applicant || '';
          const email = item.email || item.emailaddress || '';
          const phone = item.phone || item.phonenumber || item.mobile || '';
          const jobTitle = item.jobtitle || item.position || item.job || '';
          const jobIdStr = item.jobid || '';
          const experience = item.experiencelevel || item.experience || '';
          const coverLetter = item.coverletter || item.message || '';
          const status = item.status || 'pending';
          const notes = item.notes || item.comment || item.comments || '';
          const appliedAt = item.appliedat || item.date || item.applieddate || '';
          const linkedin = item.linkedin || item.linkedinprofile || '';
          const portfolio = item.portfolio || item.portfoliolink || '';

          if (!name) {
            errorsList.push(`Row ${i + 1}: Name is required`);
            continue;
          }
          if (!email || !email.includes('@')) {
            errorsList.push(`Row ${i + 1}: Valid email is required`);
            continue;
          }

          let jobId = parseInt(jobIdStr, 10);
          if (isNaN(jobId)) {
            if (jobTitle) {
              // Try to find job by title
              const foundJob = allJobs.find(
                j => j.job_title.toLowerCase().trim() === jobTitle.toLowerCase().trim()
              );
              if (foundJob) {
                jobId = foundJob.id;
              } else {
                errorsList.push(`Row ${i + 1}: No job found matching title "${jobTitle}"`);
                continue;
              }
            } else {
              errorsList.push(`Row ${i + 1}: Job ID or Job Title is required`);
              continue;
            }
          } else {
            // Verify Job ID exists
            const jobExists = allJobs.some(j => j.id === jobId);
            if (!jobExists) {
              errorsList.push(`Row ${i + 1}: Job ID ${jobId} does not exist`);
              continue;
            }
          }

          // Validate status
          const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
          const cleanStatus = status.toLowerCase().trim();
          if (!validStatuses.includes(cleanStatus)) {
            errorsList.push(`Row ${i + 1}: Invalid status "${status}". Allowed values: ${validStatuses.join(', ')}`);
            continue;
          }

          applicationsList.push({
            job_id: jobId,
            applicant_name: name,
            email,
            phone: phone || null,
            experience_level: experience || null,
            cover_letter: coverLetter || null,
            status: cleanStatus,
            notes: notes || null,
            applied_at: appliedAt || null,
            linkedin: linkedin || null,
            portfolio: portfolio || null
          });
        }

        if (errorsList.length > 0) {
          console.error('Import validation errors:', errorsList);
          toast.error(`Import failed:\n${errorsList.slice(0, 3).join('\n')}${errorsList.length > 3 ? `\n...and ${errorsList.length - 3} more errors` : ''}`, {
            id: importToast,
            duration: 6000
          });
          return;
        }

        if (applicationsList.length === 0) {
          toast.error('No valid applications found to import', { id: importToast });
          return;
        }

        toast.loading(`Importing ${applicationsList.length} application(s) to server...`, { id: importToast });
        const res = await careerApi.importApplications(applicationsList);
        toast.success(`Successfully imported ${res.importedCount} application(s)!`, { id: importToast });

        // Refresh page data
        fetchAllData();
      } catch (err: any) {
        console.error(err);
        toast.error(`Import failed: ${err.message || 'Unknown error'}`, { id: importToast });
      }
    };

    reader.onerror = () => {
      toast.error('FileReader error', { id: importToast });
    };

    reader.readAsText(file);
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
    setGenderFilter('all');
    setCityFilter('all');
    setStateFilter('all');
    setEduBranchFilter('all');
    setEduSpecFilter('all');

    setCurrentPage(1);
    setSelectedJobs([]);
    setSelectedApplications([]);
  };




  // Filter and sort logic
  const filteredApplications = applications.filter(app => {
    // 1. Column filters
    if (columnFilters.applicant && !app.applicant_name?.toLowerCase().includes(columnFilters.applicant.toLowerCase()) && !app.email?.toLowerCase().includes(columnFilters.applicant.toLowerCase())) {
      return false;
    }
    if (columnFilters.position && columnFilters.position !== 'all' && !app.job_title?.toLowerCase().includes(columnFilters.position.toLowerCase())) {
      return false;
    }
    if (columnFilters.experience && columnFilters.experience !== 'all' && !app.experience_level?.toLowerCase().includes(columnFilters.experience.toLowerCase())) {
      return false;
    }
    if (columnFilters.mobile && !app.phone?.toLowerCase().includes(columnFilters.mobile.toLowerCase())) {
      return false;
    }
    if (columnFilters.branch && !getBranchVal(app).toLowerCase().includes(columnFilters.branch.toLowerCase())) {
      return false;
    }
    if (columnFilters.status && columnFilters.status !== 'all' && app.status !== columnFilters.status) {
      return false;
    }
    // 1b. Additional Side filters (client-side fallback filter logic)
    if (genderFilter && genderFilter !== 'all' && app.gender !== genderFilter) {
      return false;
    }
    if (cityFilter && cityFilter !== 'all' && app.current_city !== cityFilter) {
      return false;
    }
    if (stateFilter && stateFilter !== 'all' && app.state !== stateFilter) {
      return false;
    }
    if (eduBranchFilter && eduBranchFilter !== 'all' && !checkEducationBranch(app, eduBranchFilter)) {
      return false;
    }
    if (eduSpecFilter && eduSpecFilter !== 'all' && !checkEducationSpecialization(app, eduSpecFilter)) {
      return false;
    }

    // 2. Global search
    const search = searchTerm.toLowerCase();
    if (!search) return true;
    return (
      app.applicant_name?.toLowerCase().includes(search) ||
      app.email?.toLowerCase().includes(search) ||
      app.job_title?.toLowerCase().includes(search)
    );
  });
  const totalItems = activeTab === 'jobs' ? (totalJobs || jobStats.total) : (totalApps || appStats.total);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Selection handlers
  const handleSelectAll = () => {
    if (activeTab === 'jobs') {
      if (selectedJobs.length === jobs.length) {
        setSelectedJobs([]);
      } else {
        setSelectedJobs(jobs.map((item: Job) => item.id));
      }
    } else {
      if (selectedApplications.length === filteredApplications.length) {
        setSelectedApplications([]);
      } else {
        setSelectedApplications(filteredApplications.map((item: Application) => item.id));
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

  const renderPagination = (hasBg = true) => {
    if (totalItems === 0) return null;
    if (isSidebarOpen && window.innerWidth < 640) return null;

    return (
      <div className={`flex items-center justify-between gap-2 text-slate-700 ${hasBg
        ? 'p-2 sm:p-2.5 bg-slate-50 border-t border-slate-200'
        : 'pt-3 border-t border-slate-200'
        }`}>
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
            className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
                  className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition cursor-pointer ${currentPage === pageNumber
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
                  className="min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-white transition cursor-pointer"
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
            className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && jobs.length === 0 && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Derived values for the candidate detail inline panel — computed here to avoid const inside JSX
  const emailVal = viewingCandidateApp?.email || '';
  const phoneVal = viewingCandidateApp?.phone || '';

  const parseJsonArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
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
            >
              {displayVal}
            </a>
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
          {/* Block 1: Top Navigation Row (Sticky Card) */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setViewingCandidateApp(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold text-[#5b5f70] hover:text-[#0D47A1] hover:bg-slate-50 rounded-xl transition cursor-pointer outline-none focus:outline-none focus:ring-0"
            >
              <ChevronLeft size={16} /> Back to Applications
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <select
                value={viewingCandidateApp?.status || 'pending'}
                onChange={(e) => viewingCandidateApp && handleUpdateApplicationStatus(viewingCandidateApp.id, e.target.value as any)}
                className={`px-3 py-1 rounded-xl border text-xs font-extrabold focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer transition-all outline-none ${getStatusColor(viewingCandidateApp?.status || 'pending')}`}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
          </div>

          {/* Block 2: Profile Summary Card Block */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#0D47A1] font-bold text-base shrink-0">
                {viewingCandidateApp?.applicant_name?.split(' ').map((n: string) => n.charAt(0)).slice(0, 2).join('').toUpperCase()}
              </div>
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

          {/* Block 3: Tabs & Content Card Wrapper */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col flex-1 min-h-0 p-4 overflow-hidden">
            {/* Sticky Tabs Navigation */}
            <div className="border-b border-slate-200 bg-white mb-2 flex-shrink-0">
              <div className="flex gap-1 overflow-x-auto">
                {candidateTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCandidatePopupTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold rounded-t-lg transition whitespace-nowrap cursor-pointer outline-none focus:outline-none focus:ring-0 ${
                      candidatePopupTab === tab.id
                        ? "text-[#0D47A1] border-b-2 border-[#0D47A1] bg-[#0D47A1]/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab.icon} <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Tab Content Container */}
            <div className="flex-1 overflow-y-auto mt-1 pr-1 select-text">
              
              {/* Tab 1: Overview */}
              {candidatePopupTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  {/* Basic Summary */}
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

                  {/* Documents & Resume */}
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
                        className="w-full bg-[#0D47A1] hover:bg-[#1976D2] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/10 animate-pulse-subtle"
                      >
                        <Eye size={13} /><span>View Resume in New Tab</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold italic text-center py-2">No resume uploaded.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Personal Info */}
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

              {/* Tab 3: Work Profile */}
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
                        <ProfileField label="Current Company" value={viewingCandidateApp?.current_company} icon={<Building size={13} />} />
                        <ProfileField label="Designation" value={viewingCandidateApp?.designation} icon={<Briefcase size={13} />} />
                        <ProfileField label="Employment Status" value={viewingCandidateApp?.employment_status} icon={<Award size={13} />} />
                        <ProfileField label="Industry Sector" value={viewingCandidateApp?.industry} icon={<Building size={13} />} />
                        <ProfileField label="Total Experience" value={viewingCandidateApp?.total_experience} icon={<Briefcase size={13} />} />
                        <ProfileField label="Relevant Experience" value={viewingCandidateApp?.relevant_experience} icon={<Briefcase size={13} />} />
                        <ProfileField label="Current CTC" value={viewingCandidateApp?.current_ctc} icon={<IndianRupee size={13} />} />
                        <ProfileField label="Expected CTC" value={viewingCandidateApp?.expected_ctc} icon={<IndianRupee size={13} />} />
                        <ProfileField label="Notice Period" value={viewingCandidateApp?.notice_period} icon={<Clock size={13} />} />
                      </>
                    )}

                    {viewingCandidateApp?.candidate_type === 'internship' && (
                      <>
                        <ProfileField label="College/School" value={viewingCandidateApp?.college} icon={<Building size={13} />} />
                        <ProfileField label="University Board" value={viewingCandidateApp?.university} icon={<Building size={13} />} />
                        <ProfileField label="Degree / Course" value={viewingCandidateApp?.degree} icon={<GraduationCap size={13} />} />
                        <ProfileField label="Branch / Specialization" value={viewingCandidateApp?.branch} icon={<Code size={13} />} />
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

              {/* Tab 4: Education & Skills */}
              {candidatePopupTab === 'education' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
                  {/* Academic History */}
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

                  {/* Skills Portfolio */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                    <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Briefcase size={13} />
                      <span>Skills & Competencies</span>
                    </p>
                    
                    <div className="space-y-3">
                      {/* Primary Skills Tags */}
                      <div className="flex flex-col border-b border-slate-100 pb-1.5">
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">Primary Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {parseJsonArray(viewingCandidateApp?.primary_skills).map((skill: string, i: number) => (
                            <span key={i} className="bg-blue-50 text-[#0D47A1] border border-blue-100/50 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Secondary Skills Tags */}
                      <div className="flex flex-col border-b border-slate-100 pb-1.5">
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">Secondary Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {parseJsonArray(viewingCandidateApp?.secondary_skills).map((skill: string, i: number) => (
                            <span key={i} className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
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

              {/* Tab 5: Availability & Statement */}
              {candidatePopupTab === 'statement' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
                  {/* Availability Summary */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3">
                    <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <HelpCircle size={13} />
                      <span>Availability & Preferences</span>
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ProfileField label="Earliest Joining Date" value={viewingCandidateApp?.earliest_joining_date} icon={<Calendar size={13} />} />
                      <ProfileField label="Preferred Work Mode" value={viewingCandidateApp?.preferred_work_mode} icon={<Globe size={13} />} />
                      <ProfileField label="Willing to Relocate?" value={viewingCandidateApp?.willing_to_relocate} icon={<MapPin size={13} />} />
                      <ProfileField label="Preferred Interview Time" value={viewingCandidateApp?.preferred_interview_time} icon={<Clock size={13} />} />
                    </div>
                  </div>

                  {/* Statement Summary */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold text-[#0D47A1] uppercase tracking-wider border-b border-slate-100 pb-1.5 mb-2 flex items-center gap-1.5">
                        <FileText size={13} />
                        <span>Why should we consider you?</span>
                      </p>
                      <div className="bg-white border border-slate-150 rounded-xl p-3 text-xs text-slate-700 leading-relaxed font-semibold italic max-h-[140px] overflow-y-auto whitespace-pre-line text-left shadow-sm select-text">
                        {viewingCandidateApp?.why_consider || ''}
                      </div>
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
    <div className="flex flex-col h-full px-6 pt-6 outline-none focus:outline-none focus:ring-0">
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
      <div className={`bg-transparent font-sans flex flex-col flex-1 min-h-0 transition-all duration-300 outline-none focus:outline-none focus:ring-0 ${isSidebarOpen ? 'ml-0 sm:ml-0' : ''
        }`}>
        <style>{`
          /* Globally disable outlines on focus to prevent black borders from browser focus reset */
          *:focus, *:focus-visible, *:focus-within {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
          }
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



        {(!isSidebarOpen || window.innerWidth >= 640) && (
          <div className="bg-transparent">
            <div className="px-0 py-0">
              {/* Stats Cards - Jobs */}
              {activeTab === 'jobs' && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  <div className="bg-blue-100/40 border border-blue-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Listings</p>
                    <p className="text-sm font-extrabold text-blue-600">{jobStats.total}</p>
                  </div>
                  <div className="bg-emerald-100/40 border border-emerald-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Jobs</p>
                    <p className="text-sm font-extrabold text-emerald-600">{jobStats.active}</p>
                  </div>
                  <div className="bg-gray-100/40 border border-gray-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inactive</p>
                    <p className="text-sm font-extrabold text-slate-600">{jobStats.inactive}</p>
                  </div>
                  <div className="bg-purple-100/40 border border-purple-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Departments</p>
                    <p className="text-sm font-extrabold text-purple-600">{jobStats.departments}</p>
                  </div>
                  <div className="bg-orange-100/40 border border-orange-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Locations</p>
                    <p className="text-sm font-extrabold text-orange-600">{jobStats.locations}</p>
                  </div>
                </div>
              )}

              {/* Stats Cards - Applications */}
              {activeTab === 'applications' && appStats && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
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

              {/* Action Row & Tabs Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-sm w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex-1 sm:flex-none py-1.5 px-4 text-center font-bold transition-all rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'jobs'
                      ? 'bg-[#0D47A1] text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Briefcase size={13} />
                    <span>Jobs ({jobStats.total})</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('applications');
                      fetchAppStats();
                    }}
                    className={`flex-1 sm:flex-none py-1.5 px-4 text-center font-bold transition-all rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'applications'
                      ? 'bg-[#0D47A1] text-white shadow'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Users size={13} />
                    <span>Applications ({appStats.total})</span>
                  </button>
                </div>

                {activeTab === 'jobs' ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm text-xs font-semibold self-end sm:self-auto cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Job</span>
                  </button>
                ) : null}
              </div>

              {/* Filters Bar */}
              <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
                <div className="flex flex-col md:flex-row gap-3 items-slate-stretch md:items-center justify-between">
                  {activeTab === 'jobs' ? (
                    <>
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search jobs..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                          className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center bg-white/60 border border-slate-200/60 p-0.5 rounded-lg shrink-0">
                          <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#0D47A1] text-white shadow-sm' : 'text-gray-600'} cursor-pointer transition-all`}>
                            <Grid size={12} />
                          </button>
                          <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#0D47A1] text-white shadow-sm' : 'text-gray-600'} cursor-pointer transition-all`}>
                            <List size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-0.5 bg-white/60 border border-slate-200/60 p-0.5 rounded-lg shrink-0">
                          <button onClick={() => setStatusViewFilter('all')} className={`px-2 py-1 rounded text-[10px] font-bold ${statusViewFilter === 'all' ? 'bg-slate-200/80 text-slate-800 shadow-sm' : 'text-gray-600'} cursor-pointer`}>All</button>
                          <button onClick={() => setStatusViewFilter('active')} className={`px-2 py-1 rounded text-[10px] font-bold ${statusViewFilter === 'active' ? 'bg-green-100 text-green-700' : 'text-gray-600'} cursor-pointer`}>Active</button>
                          <button onClick={() => setStatusViewFilter('inactive')} className={`px-2 py-1 rounded text-[10px] font-bold ${statusViewFilter === 'inactive' ? 'bg-gray-200 text-gray-700' : 'text-gray-600'} cursor-pointer`}>Inactive</button>
                        </div>

                        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none">
                          <option value="all">All Depts</option>
                          {Array.from(new Set(jobs.map(job => job.department).filter((d): d is string => !!d))).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>

                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none">
                          <option value="all">All Locs</option>
                          {Array.from(new Set(jobs.map(job => job.location).filter((l): l is string => !!l))).map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>

                        <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none">
                          <option value="all">All Types</option>
                          {Array.from(new Set(jobs.map(job => job.job_type).filter((t): t is string => !!t))).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>

                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none">
                          <option value="6">Show 6</option>
                          <option value="12">Show 12</option>
                          <option value="24">Show 24</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    // Applications Filter Bar Layout
                    <div className="flex items-center justify-between w-full">
                      {/* Left: Show Dropdown */}
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

                      {/* Right: Export, Import, Filters Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleExportApplications}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Export Data</span>
                        </button>
                        <button
                          onClick={() => document.getElementById('csv-import-input')?.click()}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
                        >
                          <Upload size={13} />
                          <span>Import Data</span>
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
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
                  onClick={handleBulkDeleteClick}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition mt-1 sm:mt-0 cursor-pointer font-bold"
                >
                  Delete ({activeTab === 'jobs' ? selectedJobs.length : selectedApplications.length})
                </button>
              </div>
            </div>
          )}

        {/* Content Area */}
        <div className={`flex-col flex-1 min-h-0 ${isSidebarOpen && window.innerWidth < 640 ? 'hidden' : 'flex'}`}>
          {activeTab === 'jobs' ? (
            viewMode === 'grid' ? (
              <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Title & Checkbox */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className={`font-extrabold tracking-tight ${job.is_active ? 'text-slate-800' : 'text-slate-400'} text-sm sm:text-[15px] line-clamp-2 leading-snug`}>
                                  {job.job_title || 'Untitled Job'}
                                </h3>
                                <div className="flex items-center mt-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 w-fit">
                                  {getDepartmentIcon(job.department || '')}
                                  <span className={`ml-1.5 ${job.is_active ? 'text-slate-600' : 'text-slate-400'} text-[10px] font-bold uppercase tracking-wider`}>
                                    {job.department || 'No Department'}
                                  </span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(job.id)}
                                onChange={() => handleSelectItem(job.id)}
                                className="h-3.5 w-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer ml-3 mt-0.5"
                              />
                            </div>

                            {/* Location + Job Type Badges */}
                            <div className="flex flex-wrap gap-1.5 mb-3.5">
                              <span className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getLocationColor(job.location || '')} border border-current/10`}>
                                <MapPin className="w-2.5 h-2.5 mr-1" />
                                {job.location || 'Remote'}
                              </span>
                              <span className="flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                                {getJobTypeIcon(job.job_type)}
                                <span className="ml-1">{job.job_type}</span>
                              </span>
                            </div>

                            {/* Specs (Salary & Experience) */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-50/50 border border-slate-100 rounded-xl p-2.5 mb-3.5 text-[11px]">
                              <div>
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Salary Range</span>
                                <div className="flex items-center text-slate-700 font-bold">
                                  <IndianRupee className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                                  <span className="truncate">{job.salary_range || 'Not Specified'}</span>
                                </div>
                              </div>
                              <div>
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Experience</span>
                                <div className="flex items-center text-slate-700 font-bold">
                                  <Briefcase className="w-2.5 h-2.5 mr-1 text-blue-600" />
                                  <span className="truncate">{job.experience_level || 'Entry Level'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className={`${job.is_active ? 'text-slate-600' : 'text-slate-400'} text-xs line-clamp-2 leading-relaxed mb-4`}>
                              {job.description ? job.description : 'No description available'}
                            </p>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleActive(job.id, job.is_active)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${job.is_active
                                  ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                                  : 'text-slate-500 bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                                  }`}
                                title={job.is_active ? "Deactivate Job" : "Activate Job"}
                              >
                                {job.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <button
                                onClick={() => handleEdit(job)}
                                className="p-1.5 text-blue-600 bg-blue-50/50 border border-blue-100 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                                title="Edit Job"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteJobClick(job.id)}
                                className="p-1.5 text-red-600 bg-red-50/50 border border-red-100 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                                title="Delete Job"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeColor(job.is_active)} border border-current/10 flex items-center`}>
                              {job.is_active ? (
                                <>
                                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                  </span>
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {renderPagination(false)}
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <table className="min-w-full border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedJobs.length === jobs.length && jobs.length > 0}
                              onChange={handleSelectAll}
                              className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                            />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                          Job Title
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-b border-slate-300">
                          Department
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-b border-slate-300">
                          Location
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                          Status
                        </th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedJobs.includes(job.id)}
                                onChange={() => handleSelectItem(job.id)}
                                className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="max-w-[150px] sm:max-w-xs">
                              <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">{job.job_title}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{job.job_type}</p>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-slate-400">{getDepartmentIcon(job.department || '')}</span>
                              <span className="text-slate-500 text-[11px] truncate">{job.department || '—'}</span>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-500 text-[11px] truncate">{job.location || '—'}</span>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <button
                              onClick={() => handleToggleActive(job.id, job.is_active)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${job.is_active
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}
                            >
                              {job.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-2 py-1 border-b border-slate-200 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(job)}
                                className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                title="Edit"
                              >
                                <Edit size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteJobClick(job.id)}
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
                {renderPagination(false)}
              </div>
            )
          ) : (
            // Applications Table
            <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-slate-200/60 shadow-sm overflow-hidden outline-none focus:outline-none focus:ring-0">
              <div className="flex-1 overflow-y-auto min-h-0 outline-none focus:outline-none focus:ring-0">
                <table className="min-w-full border-collapse border border-slate-300 outline-none focus:outline-none focus:ring-0">
                  <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                    <tr>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                            onChange={handleSelectAll}
                            className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                          />
                        </div>
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                        Applicant
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 border-r border-b border-slate-300">
                        mobile no.
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-b border-slate-300">
                        Position
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                        Experience
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-48 border-r border-b border-slate-300">
                        Branch / Specialization
                      </th>
                      <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">
                        Status
                      </th>
                      <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-b border-slate-300">
                        Actions
                      </th>
                    </tr>
                    <tr className="bg-slate-100/50">
                      <th className="px-2 py-1 border-r border-b border-slate-300"></th>
                      <th className="px-2 py-1 border-r border-b border-slate-300">
                        <input
                          type="text"
                          placeholder="Search applicant..."
                          value={columnFilters.applicant}
                          onChange={(e) => setColumnFilters({ ...columnFilters, applicant: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                        />
                      </th>
                      <th className="px-2 py-1 border-r border-b border-slate-300">
                        <input
                          type="text"
                          placeholder="Search mobile..."
                          value={columnFilters.mobile}
                          onChange={(e) => setColumnFilters({ ...columnFilters, mobile: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                        />
                      </th>
                      <th className="px-2 py-1 border-r border-b border-slate-300">
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
                      <th className="px-2 py-1 border-r border-b border-slate-300">
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
                      <th className="px-2 py-1 border-r border-b border-slate-300">
                        <input
                          type="text"
                          placeholder="Search branch..."
                          value={columnFilters.branch}
                          onChange={(e) => setColumnFilters({ ...columnFilters, branch: e.target.value })}
                          className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none"
                        />
                      </th>
                      <th className="px-2 py-1 border-r border-b border-slate-300">
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
                      <th className="px-2 py-1 border-b border-slate-300"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {filteredApplications.map((app: Application) => (
                      <tr key={app.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(app.id)}
                            onChange={() => handleSelectItem(app.id)}
                            className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                              <span className="font-bold text-blue-600 text-[10px]">
                                {app.applicant_name
                                  ?.split(" ")
                                  .map((name: string) => name.charAt(0))
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-800 leading-tight">{app.applicant_name}</div>
                              <div
                                onClick={() => {
                                  const subject = `Interview Schedule: ${app.job_title || 'Position'} - Hously`;
                                  const body = `Dear ${app.applicant_name},\n\nThank you for applying for the ${app.job_title || 'Position'} role at Hously.\n\nWe have reviewed your application and would like to invite you for an interview. Here are the details:\n\n- Date: [Enter Date, e.g., July 6]\n- Time: [Enter Time, e.g., 3:00 PM]\n- Mode: [Online (Google Meet) / In-person]\n- Link/Address: [Meeting Link or Address]\n\nPlease let us know if this works for you.\n\nBest regards,\nHously HR Team`;
                                  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${app.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                                }}
                                className="text-[9px] text-slate-400 mt-0.5 leading-none cursor-pointer hover:text-blue-600 hover:underline"
                                title="Email candidate with template"
                              >
                                {app.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="text-[11px] text-slate-600 font-bold">{app.phone || '—'}</div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="text-[11px] font-semibold text-slate-700 leading-tight">{app.job_title || 'N/A'}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5 leading-none">{formatDate(app.applied_at)}</div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="text-[11px] text-slate-500 font-semibold">{app.experience_level || '—'}</div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <div className="text-[11px] text-slate-600 font-bold truncate max-w-[150px]" title={getBranchSpecVal(app) || ''}>
                            {getBranchSpecVal(app)}
                          </div>
                        </td>
                        <td className="px-2 py-1 border-r border-b border-slate-200">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired')}
                            className={`px-1.5 py-0.5 rounded border text-[10px] font-bold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all outline-none ${getStatusColor(app.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </td>
                        <td className="px-2 py-1 border-b border-slate-200 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setViewingCandidateApp(app);
                                setCandidatePopupTab('overview');
                              }}
                              className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                              title="View Candidate Details"
                            >
                              <Eye size={11} />
                            </button>

                            {app.resume_path && (
                              <button
                                onClick={() => downloadResume(app.resume_path!)}
                                className="p-0.5 text-purple-600 hover:bg-purple-50 border border-purple-100 rounded cursor-pointer transition-all"
                                title="Download Resume"
                              >
                                <Download size={11} />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setCalendarSelectedCandidate(app);
                                setShowCalendarPopup(true);
                              }}
                              className="p-0.5 text-amber-600 hover:bg-amber-50 border border-amber-100 rounded cursor-pointer transition-all"
                              title="Schedule Interview"
                            >
                              <Calendar size={11} />
                            </button>
                            <button
                              onClick={() => {
                                const subject = `Interview Schedule: ${app.job_title || 'Position'} - Hously`;
                                const body = `Dear ${app.applicant_name},\n\nThank you for applying for the ${app.job_title || 'Position'} role at Hously.\n\nWe have reviewed your application and would like to invite you for an interview. Here are the details:\n\n- Date: [Enter Date, e.g., July 6]\n- Time: [Enter Time, e.g., 3:00 PM]\n- Mode: [Online (Google Meet) / In-person]\n- Link/Address: [Meeting Link or Address]\n\nPlease let us know if this works for you.\n\nBest regards,\nHously HR Team`;
                                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${app.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                              }}
                              className="p-0.5 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded cursor-pointer transition-all"
                              title="Email Applicant"
                            >
                              <Mail size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteAppClick(app.id)}
                              className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                              title="Delete Application"
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
              {renderPagination(true)}
            </div>

          )}

          {/* Empty State */}
          {(activeTab === 'jobs' ? jobs.length : filteredApplications.length) === 0 && (
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


        </div>
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
            // Update timeline if the current modal is viewing this application
            if (selectedApp && selectedApp.id === calendarSelectedCandidate.id) {
              await fetchTimeline(selectedApp.id);
            }
          }}
        />
      )}



      {/* ========== TABBED INTERVIEW & FOLLOW‑UP MODAL ========== */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop bg-slate-900/60 backdrop-blur-sm">
          <div className="fixed inset-0 cursor-default" onClick={() => setShowInterviewModal(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl z-10 animate-modal-content flex flex-col max-h-[85vh] overflow-hidden">

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
                      className={`px-3 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${modalTab === tabKey
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
            <div className="p-5 space-y-5 overflow-y-auto flex-1">
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
                            const subject = `Interview Schedule: ${selectedApp.job_title || 'Position'} - Hously`;
                            const body = `Dear ${selectedApp.applicant_name},\n\nThank you for applying for the ${selectedApp.job_title || 'Position'} role at Hously.\n\nWe have reviewed your application and would like to invite you for an interview. Here are the details:\n\n- Date: [Enter Date, e.g., July 6]\n- Time: [Enter Time, e.g., 3:00 PM]\n- Mode: [Online (Google Meet) / In-person]\n- Link/Address: [Meeting Link or Address]\n\nPlease let us know if this works for you.\n\nBest regards,\nHously HR Team`;
                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedApp.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
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
                          console.error(err)
                        }
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add Interaction
                    </button>
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
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Schedule Interview
                      </button>
                    </form>
                  </div>

                  {/* Existing interviews */}
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

              {/* TIMELINE (combined) */}
              {modalTab === 'timeline' && (
                <div className="space-y-3">
                  {timeline.length === 0 && (
                    <p className="text-gray-400 italic text-sm">No activity yet.</p>
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
      )}
      {/* ========== JOB CREATE/EDIT MODAL ========== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 z-10 animate-modal-content">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  {editingJob ? 'Edit Job Opening' : 'Create Job Opening'}
                </h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {editingJob ? 'Modify job opening details' : 'Publish a new career opportunity'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => formStep > 1 && setFormStep(1)}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${formStep === 1
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 text-[9px]">1</span>
                  <span>General</span>
                </button>
                <div className="w-3 h-[1px] bg-slate-200" />
                <button
                  type="button"
                  onClick={() => formStep > 2 && setFormStep(2)}
                  disabled={formStep < 2}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition disabled:opacity-50 ${formStep === 2
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 text-[9px]">2</span>
                  <span>Details</span>
                </button>
                <div className="w-3 h-[1px] bg-slate-200" />
                <button
                  type="button"
                  disabled={formStep < 3}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition disabled:opacity-50 ${formStep === 3
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 text-[9px]">3</span>
                  <span>Specs</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {error && <div className="bg-red-50 text-red-600 p-2 rounded-lg text-[10px] font-semibold">{error}</div>}

                {/* Step 1: General Details */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    {/* Job Title */}
                    <div>
                      <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                        required
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>

                    {/* Department + Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Department <span className="text-red-500">*</span>
                        </label>
                        {!showCustomDept ? (
                          <select
                            value={formData.department}
                            onChange={(e) => {
                              if (e.target.value === 'custom') {
                                setShowCustomDept(true);
                              } else {
                                setFormData({ ...formData, department: e.target.value });
                              }
                            }}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700"
                            required
                          >
                            <option value="">Select Department</option>
                            {predefinedDepartments.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                            <option value="custom">+ Add Custom Department</option>
                          </select>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              value={customDept}
                              onChange={(e) => setCustomDept(e.target.value)}
                              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 outline-none font-semibold text-slate-800"
                              placeholder="Enter department"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomDept}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCustomDept(false)}
                              className="px-3 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Location <span className="text-red-500">*</span>
                        </label>
                        {!showCustomLoc ? (
                          <select
                            value={formData.location}
                            onChange={(e) => {
                              if (e.target.value === 'custom') {
                                setShowCustomLoc(true);
                              } else {
                                setFormData({ ...formData, location: e.target.value });
                              }
                            }}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700"
                            required
                          >
                            <option value="">Select Location</option>
                            {predefinedLocations.map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                            <option value="custom">+ Add Custom Location</option>
                          </select>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              value={customLoc}
                              onChange={(e) => setCustomLoc(e.target.value)}
                              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 outline-none font-semibold text-slate-800"
                              placeholder="Enter location"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomLoc}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCustomLoc(false)}
                              className="px-3 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vacancy + Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Vacancy Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.vacancy_count}
                          onChange={(e) => setFormData({ ...formData, vacancy_count: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Application Deadline
                        </label>
                        <input
                          type="date"
                          value={formData.application_deadline}
                          onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-2 items-center pt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Job Opening</span>
                      </label>

                      {editingJob && (
                        <div className="text-[10px] text-slate-400 font-semibold text-right">
                          <p>Created: {formatDate(editingJob.created_at)}</p>
                          <p>Updated: {formatDate(editingJob.updated_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Job Settings & Description */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    {/* Job Type + Salary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Job Type <span className="text-red-500">*</span>
                        </label>
                        <MultiSelectDropdown
                          options={predefinedJobTypes}
                          value={formData.job_type}
                          onChange={(val) => setFormData({ ...formData, job_type: val })}
                          placeholder="Select Job Types"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          value={formData.salary_range}
                          onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                          placeholder="e.g. ₹5,00,000 - ₹8,00,000 P.A."
                        />
                      </div>
                    </div>

                    {/* Experience level */}
                    <div>
                      <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Experience Levels <span className="text-red-500">*</span>
                      </label>
                      <MultiSelectDropdown
                        options={experienceLevels}
                        value={formData.experience_level}
                        onChange={(val) => setFormData({ ...formData, experience_level: val })}
                        placeholder="Select Experience Levels"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                        required
                        placeholder="Provide a detailed overview of the role..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Role Specifications */}
                {formStep === 3 && (
                  <div className="space-y-3">
                    {/* Specs Tab Selector */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => setSpecsTab('requirements')}
                        className={`flex-1 py-1 text-center font-bold transition rounded-md text-[10px] ${specsTab === 'requirements'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        Requirements *
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpecsTab('responsibilities')}
                        className={`flex-1 py-1 text-center font-bold transition rounded-md text-[10px] ${specsTab === 'responsibilities'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        Responsibilities *
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpecsTab('benefits')}
                        className={`flex-1 py-1 text-center font-bold transition rounded-md text-[10px] ${specsTab === 'benefits'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        Benefits
                      </button>
                    </div>

                    {specsTab === 'requirements' && (
                      <DynamicListInput
                        label="Requirements"
                        items={formData.requirements}
                        onChange={(val) => setFormData({ ...formData, requirements: val })}
                        placeholder="e.g. React & TypeScript experience"
                        required
                      />
                    )}

                    {specsTab === 'responsibilities' && (
                      <DynamicListInput
                        label="Responsibilities"
                        items={formData.responsibilities}
                        onChange={(val) => setFormData({ ...formData, responsibilities: val })}
                        placeholder="e.g. Develop high-quality user interface components"
                        required
                      />
                    )}

                    {specsTab === 'benefits' && (
                      <DynamicListInput
                        label="Benefits"
                        items={formData.benefits}
                        onChange={(val) => setFormData({ ...formData, benefits: val })}
                        placeholder="e.g. Comprehensive health insurance"
                      />
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    key="btn-cancel"
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <div className="flex gap-2">
                    {formStep > 1 && (
                      <button
                        key="btn-back"
                        type="button"
                        onClick={() => setFormStep(formStep - 1)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Back
                      </button>
                    )}

                    {formStep < 3 ? (
                      <button
                        key="btn-next"
                        type="button"
                        onClick={() => {
                          if (formStep === 1) {
                            if (!formData.job_title.trim()) {
                              setError("Job Title is required");
                              return;
                            }
                            if (!formData.department) {
                              setError("Department is required");
                              return;
                            }
                            if (!formData.location) {
                              setError("Location is required");
                              return;
                            }
                            setError("");
                          } else if (formStep === 2) {
                            if (formData.job_type.length === 0) {
                              setError("Please select at least one Job Type");
                              return;
                            }
                            if (formData.experience_level.length === 0) {
                              setError("Please select at least one Experience Level");
                              return;
                            }
                            if (!formData.description.trim()) {
                              setError("Job Description is required");
                              return;
                            }
                            setError("");
                          }
                          setFormStep(formStep + 1);
                        }}
                        className="px-4 py-2 bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        key="btn-submit"
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>{editingJob ? 'Update Job' : 'Create Job'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsDeleteConfirmOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetIds(null);
            }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-100 z-10 animate-modal-content">
            <h3 className="text-base font-extrabold text-slate-800">Confirm Delete</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Are you sure you want to delete {deleteTargetIds ? `${deleteTargetIds.length} item(s)` : 'this item'}? This action cannot be undone.
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
                  if (deleteType === 'job' && deleteTargetId !== null) {
                    await proceedDeleteJob(deleteTargetId);
                  } else if (deleteType === 'application' && deleteTargetId !== null) {
                    await proceedDeleteApp(deleteTargetId);
                  } else if (deleteType === 'bulk_jobs' && deleteTargetIds !== null) {
                    await proceedBulkDeleteJobs(deleteTargetIds);
                  } else if (deleteType === 'bulk_apps' && deleteTargetIds !== null) {
                    await proceedBulkDeleteApps(deleteTargetIds);
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

      {/* ========== SIDE FILTER DRAWER ========== */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isSideFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSideFilterOpen(false)}
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className={`w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100 ${isSideFilterOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#0D47A1]" />
                <h2 className="text-base font-extrabold text-[#0D1B3E]">Filters</h2>
              </div>
              <button
                onClick={() => setIsSideFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content / Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>

              {/* Position Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Position</label>
                <select
                  value={positionFilter}
                  onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
                >
                  <option value="all">All Positions</option>
                  {Array.from(new Set(applications.map(app => app.job_title).filter((t): t is string => !!t))).map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Experience Level</label>
                <select
                  value={experienceFilter}
                  onChange={(e) => { setExperienceFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
                >
                  {experienceFilterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Gender</label>
                <select
                  value={genderFilter}
                  onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
                >
                  <option value="all">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">City / Location</label>
                <select
                  value={cityFilter}
                  onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
                >
                  <option value="all">All Cities</option>
                  {(Array.from(new Set(applications.map(app => app.current_city).filter((c): c is string => !!c))) as string[]).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>



              {/* Education Branch Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Education Branch</label>
                <select
                  value={eduBranchFilter}
                  onChange={(e) => { 
                    setEduBranchFilter(e.target.value); 
                    setEduSpecFilter('all');
                    setCurrentPage(1); 
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all"
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

              {/* Specialization Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Specialization</label>
                <select
                  disabled={eduBranchFilter === 'all'}
                  value={eduSpecFilter}
                  onChange={(e) => { setEduSpecFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-medium text-slate-700 outline-none cursor-pointer transition-all disabled:opacity-50 disabled:bg-slate-50"
                >
                  <option value="all">All Specializations</option>
                  {(SPECIALIZATION_MAP[eduBranchFilter] || []).map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date Applied</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="ignoreDate"
                      checked={ignoreDate}
                      onChange={(e) => setIgnoreDate(e.target.checked)}
                      className="h-3.5 w-3.5 text-[#0D47A1] focus:ring-[#0D47A1] rounded cursor-pointer"
                    />
                    <label htmlFor="ignoreDate" className="text-[10px] font-bold text-slate-600 cursor-pointer uppercase select-none">
                      Ignore Date
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">From</label>
                    <input
                      type="date"
                      disabled={ignoreDate}
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-semibold text-slate-700 outline-none disabled:opacity-50 disabled:bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase">To</label>
                    <input
                      type="date"
                      disabled={ignoreDate}
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0D47A1] focus:border-[#0D47A1] bg-white font-semibold text-slate-700 outline-none disabled:opacity-50 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                }}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 hover:border-slate-300 text-slate-600 bg-white rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsSideFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-xl transition shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCMS;



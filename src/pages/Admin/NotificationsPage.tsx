import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar,
  Briefcase,
  Receipt,
  Ticket,
  MessageSquare,
  X,
  RefreshCw,
  SlidersHorizontal,
  CircleDot,
  ChevronDown,
  ClipboardList,
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { settingsApi } from '../../lib/settingsApi';
import { masterDataAPI } from '../../lib/masterApi';
import { employeeApi, type EmployeeRecord } from '../../lib/employeeApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnyNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  career_application_id?: number | null;
  meeting_id?: number | null;
  isLeave?: boolean;
  isTicket?: boolean;
  isExpense?: boolean;
  isTask?: boolean;
  employee_name?: string;
  department?: string;
  branch?: string;
}

type NotificationKind = 'all' | 'enquiry' | 'career' | 'leave' | 'ticket' | 'expense' | 'meeting' | 'task';

const KIND_LABELS: Record<NotificationKind, string> = {
  all: 'All',
  enquiry: 'Enquiry',
  career: 'Career',
  leave: 'Leave',
  ticket: 'Ticket',
  expense: 'Expense',
  meeting: 'Meeting',
  task: 'Task',
};

const KIND_ICONS: Record<NotificationKind, React.ComponentType<{ className?: string }>> = {
  all: Bell,
  enquiry: MessageSquare,
  career: Briefcase,
  leave: Calendar,
  ticket: Ticket,
  expense: Receipt,
  meeting: Calendar,
  task: ClipboardList,
};

// Minimal, professional accent colors per kind
const KIND_ACCENT: Record<NotificationKind, { dot: string; badge: string; icon: string }> = {
  all: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600', icon: 'text-slate-500' },
  enquiry: { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700', icon: 'text-sky-500' },
  career: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', icon: 'text-emerald-500' },
  leave: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700', icon: 'text-amber-500' },
  ticket: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700', icon: 'text-violet-500' },
  expense: { dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700', icon: 'text-rose-500' },
  meeting: { dot: 'bg-teal-500', badge: 'bg-teal-50 text-teal-700', icon: 'text-teal-500' },
  task: { dot: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700', icon: 'text-indigo-500' },
};

// Icon bg for notification avatar (neutral, no heavy gradient)
const KIND_ICON_BG: Record<NotificationKind, string> = {
  all: 'bg-slate-100',
  enquiry: 'bg-sky-50',
  career: 'bg-emerald-50',
  leave: 'bg-amber-50',
  ticket: 'bg-violet-50',
  expense: 'bg-rose-50',
  meeting: 'bg-teal-50',
  task: 'bg-indigo-50',
};

const EMOJI_MAP: Record<string, string> = {
  new_enquiry: '📥',
  status_change: '🔄',
  note_added: '📝',
  assigned: '👤',
  new_meeting: '📅',
  new_application: '📋',
  application_status_change: '🔄',
  leave_new: '📋',
  leave_updated: '🔄',
  leave_deleted: '❌',
  leave_status_changed: '🔔',
};

function getKind(n: AnyNotification): NotificationKind {
  if (n.isTicket) return 'ticket';
  if (n.isLeave) return 'leave';
  if (n.isExpense) return 'expense';
  if (n.isTask) return 'task';
  if (n.career_application_id != null) return 'career';
  if (n.meeting_id != null) return 'meeting';
  return 'enquiry';
}

function getEmoji(n: AnyNotification): string {
  if (n.isTicket) return '🎫';
  if (n.isExpense) return '💵';
  if (n.isTask) return '✅';
  return EMOJI_MAP[n.type] || '📢';
}

function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  let diff = now.getTime() - date.getTime();
  if (diff < 0) {
    const offset = now.getTimezoneOffset() * 60000;
    diff = Math.max(0, now.getTime() - new Date(date.getTime() + offset).getTime());
  }
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 30) return 'Just now';
  if (s < 60) return `${s}s ago`;
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function cleanTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/^[🎫📅📋📥🔄📝👤💼📢🔔❌⚙⚙️💬\uFFFD?\s]+/, '')
    .replace(/[\uFFFD]/g, '')
    .trim();
}

const PAGE_SIZE = 20;

// ─── Component ───────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const navigate = useNavigate();

  const [enquiryNotifs, setEnquiryNotifs] = useState<AnyNotification[]>([]);
  const [careerNotifs, setCareerNotifs] = useState<AnyNotification[]>([]);
  const [leaveNotifs, setLeaveNotifs] = useState<AnyNotification[]>([]);
  const [ticketNotifs, setTicketNotifs] = useState<AnyNotification[]>([]);
  const [expenseNotifs, setExpenseNotifs] = useState<AnyNotification[]>([]);
  const [taskNotifs, setTaskNotifs] = useState<AnyNotification[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Applied filters (only updated on "Apply")
  const [kindFilter, setKindFilter] = useState<NotificationKind>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedDept, setAppliedDept] = useState('all');
  const [appliedBranch, setAppliedBranch] = useState('all');
  const [appliedEmployee, setAppliedEmployee] = useState('all');
  const [appliedUnreadOnly, setAppliedUnreadOnly] = useState(false);

  // Drawer draft state (pending until Apply)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [draftDept, setDraftDept] = useState('all');
  const [draftBranch, setDraftBranch] = useState('all');
  const [draftEmployee, setDraftEmployee] = useState('all');
  const [draftUnreadOnly, setDraftUnreadOnly] = useState(false);

  const drawerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Filter data from APIs ──────────────────────────────────────────────────
  const [branchOptions, setBranchOptions] = useState<{ id: string; name: string }[]>([]);
  const [deptOptions, setDeptOptions] = useState<string[]>([]);

  // Employee search inside drawer
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [empOptions, setEmpOptions] = useState<EmployeeRecord[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const empSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Sync draft from applied when opening
  const openDrawer = () => {
    setDraftDept(appliedDept);
    setDraftBranch(appliedBranch);
    setDraftEmployee(appliedEmployee);
    setDraftUnreadOnly(appliedUnreadOnly);
    // Reset employee search
    setEmpSearchQuery('');
    setEmpOptions([]);
    setDrawerOpen(true);
    requestAnimationFrame(() => setDrawerVisible(true));
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    drawerTimerRef.current = setTimeout(() => setDrawerOpen(false), 300);
  };

  useEffect(() => () => {
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current);
    if (empSearchTimer.current) clearTimeout(empSearchTimer.current);
  }, []);

  const applyFilters = () => {
    setAppliedDept(draftDept);
    setAppliedBranch(draftBranch);
    setAppliedEmployee(draftEmployee);
    setAppliedUnreadOnly(draftUnreadOnly);
    closeDrawer();
  };

  const resetDraft = () => {
    setDraftDept('all');
    setDraftBranch('all');
    setDraftEmployee('all');
    setDraftUnreadOnly(false);
    setEmpSearchQuery('');
    setEmpOptions([]);
  };

  const hasActiveFilters = appliedDept !== 'all' || appliedBranch !== 'all' || appliedEmployee !== 'all' || appliedUnreadOnly;

  // ── Fetch branches from settingsApi ───────────────────────────────────────
  useEffect(() => {
    settingsApi.getCompanies().then(companies => {
      const branches = companies.flatMap(c =>
        (c.branches || []).filter(b => b.status === 'active').map(b => ({ id: b.id, name: b.name }))
      );
      setBranchOptions(branches);
    }).catch(() => {});
  }, []);

  // ── Fetch departments from masterAPI ───────────────────────────────────────
  useEffect(() => {
    masterDataAPI.getAllMasterTypes('common').then(async (types: any[]) => {
      const deptType = types.find((t: any) => t.name?.toLowerCase().includes('department'));
      if (deptType) {
        const vals = await masterDataAPI.getMasterValues(deptType.id);
        setDeptOptions(vals.filter((v: any) => v.status === 'Active').map((v: any) => v.value));
      }
    }).catch(() => {});
  }, []);

  // ── Employee search with debounce ──────────────────────────────────────────
  const searchEmployees = useCallback((query: string) => {
    if (empSearchTimer.current) clearTimeout(empSearchTimer.current);
    empSearchTimer.current = setTimeout(async () => {
      setEmpLoading(true);
      try {
        const results = await employeeApi.getAll(query ? { search: query } : undefined);
        setEmpOptions(results.slice(0, 50)); // cap at 50
      } catch { setEmpOptions([]); } finally { setEmpLoading(false); }
    }, 300);
  }, []);

  // Load employees when drawer opens
  useEffect(() => {
    if (drawerOpen) searchEmployees('');
  }, [drawerOpen, searchEmployees]);

  // Re-search on query change
  useEffect(() => {
    if (drawerOpen) searchEmployees(empSearchQuery);
  }, [empSearchQuery, drawerOpen, searchEmployees]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [enq, car, lea, tic, exp, tsk] = await Promise.allSettled([
        apiClient.get<AnyNotification[]>('/enquiries/notifications/all'),
        apiClient.get<AnyNotification[]>('/career/notifications/all'),
        apiClient.get<AnyNotification[]>('/leaves/notifications'),
        apiClient.get<AnyNotification[]>('/tickets/notifications'),
        apiClient.get<AnyNotification[]>('/expenses/notifications'),
        apiClient.get<AnyNotification[]>('/tasks/notifications'),
      ]);
      setEnquiryNotifs(enq.status === 'fulfilled' ? (enq.value ?? []) : []);
      setCareerNotifs(car.status === 'fulfilled' ? (car.value ?? []) : []);
      setLeaveNotifs(lea.status === 'fulfilled' ? (lea.value ?? []).map(l => ({ ...l, isLeave: true })) : []);
      setTicketNotifs(tic.status === 'fulfilled' ? (tic.value ?? []).map(t => ({ ...t, isTicket: true })) : []);
      setExpenseNotifs(exp.status === 'fulfilled' ? (exp.value ?? []).map(e => ({ ...e, isExpense: true })) : []);
      setTaskNotifs(tsk.status === 'fulfilled' ? (tsk.value ?? []).map(t => ({ ...t, isTask: true })) : []);
    } catch (err) {
      console.error('[NotificationsPage] fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Mark as read ──────────────────────────────────────────────────────────
  const markAllRead = async () => {
    await Promise.allSettled([
      apiClient.put('/enquiries/notifications/read-all'),
      apiClient.put('/career/notifications/read-all'),
      apiClient.patch('/leaves/notifications/read-all'),
      apiClient.patch('/tickets/notifications/read-all'),
      apiClient.patch('/expenses/notifications/read-all'),
      apiClient.patch('/tasks/notifications/read-all'),
    ]);
    fetchAll(true);
  };

  const markOneRead = async (n: AnyNotification) => {
    try {
      if (n.isTicket) await apiClient.patch(`/tickets/notifications/${n.id}/read`);
      else if (n.isLeave) await apiClient.patch(`/leaves/notifications/${n.id}/read`);
      else if (n.isExpense) await apiClient.patch(`/expenses/notifications/${n.id}/read`);
      else if (n.isTask) await apiClient.patch(`/tasks/notifications/${n.id}/read`);
      else if (n.career_application_id != null) await apiClient.put(`/career/notifications/${n.id}/read`);
      else await apiClient.put(`/enquiries/notifications/${n.id}/read`);
      fetchAll(true);
    } catch (_) { /* silent */ }
  };

  const navigateToModule = (n: AnyNotification) => {
    markOneRead(n);
    if (n.isTicket) navigate('/dashboard/hrms/tickets');
    else if (n.isLeave) navigate('/dashboard/hrms/leaves');
    else if (n.isExpense) navigate('/dashboard/hrms/expenses');
    else if (n.isTask) navigate('/dashboard/tasks');
    else if (n.career_application_id != null) navigate('/dashboard/job-applicants');
    else if (n.meeting_id != null) navigate('/dashboard/meetings');
    else navigate('/dashboard/enquiries');
  };

  // ── Combined + deduped ────────────────────────────────────────────────────
  const allNotifications: AnyNotification[] = (() => {
    const combined = [...enquiryNotifs, ...careerNotifs, ...leaveNotifs, ...ticketNotifs, ...expenseNotifs, ...taskNotifs];
    const seen = new Set<string>();
    return combined
      .filter(n => {
        const key = `${getKind(n)}_${n.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  })();

  // ── Apply filters ──────────────────────────────────────────────────────────
  const filtered = allNotifications.filter(n => {
    if (kindFilter !== 'all' && getKind(n) !== kindFilter) return false;
    if (appliedUnreadOnly && n.is_read) return false;
    if (appliedDept !== 'all' && n.department?.toLowerCase() !== appliedDept.toLowerCase()) return false;
    if (appliedBranch !== 'all' && n.branch?.toLowerCase() !== appliedBranch.toLowerCase()) return false;
    if (appliedEmployee !== 'all' && n.employee_name?.toLowerCase() !== appliedEmployee.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        cleanTitle(n.title).toLowerCase().includes(q) ||
        (n.message || '').toLowerCase().includes(q) ||
        (n.employee_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const totalUnread = allNotifications.filter(n => !n.is_read).length;

  useEffect(() => { setCurrentPage(1); }, [kindFilter, searchQuery, appliedDept, appliedBranch, appliedEmployee, appliedUnreadOnly]);

  const kindCounts: Record<NotificationKind, number> = {
    all: allNotifications.length,
    enquiry: enquiryNotifs.filter(n => n.meeting_id == null && n.career_application_id == null).length,
    career: careerNotifs.length,
    leave: leaveNotifs.length,
    ticket: ticketNotifs.length,
    expense: expenseNotifs.length,
    meeting: enquiryNotifs.filter(n => n.meeting_id != null).length,
    task: taskNotifs.length,
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-[#0D47A1] animate-spin" />
          <p className="text-slate-400 text-sm">Loading notifications…</p>
        </div>
      </div>
    );
  }

  // ─── Page ─────────────────────────────────────────────────────────────────
  return (
    // Fill exactly the <main> height so tab bar never scrolls away
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Tab bar — pinned at top, never scrolls ── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200
        shadow-[0_1px_6px_rgba(15,23,42,0.06)] px-4 sm:px-6 py-3 z-30">

        <div className="flex items-center gap-2 flex-wrap">

          {/* Kind tabs — pill style */}
          <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
            {(Object.keys(KIND_LABELS) as NotificationKind[]).map(kind => {
              const Icon = KIND_ICONS[kind];
              const active = kindFilter === kind;
              const accent = KIND_ACCENT[kind];
              return (
                <button
                  key={kind}
                  onClick={() => setKindFilter(kind)}
                  title={KIND_LABELS[kind]}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    transition-all duration-200 select-none
                    ${active
                      ? `${accent.badge} ring-1 ring-inset shadow-sm font-bold`
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${active ? accent.icon : 'text-slate-400'
                    }`} />
                  <span>{KIND_LABELS[kind]}</span>
                  {kindCounts[kind] > 0 && (
                    <span className={`min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[10px] font-extrabold ${active ? 'bg-white/70 text-slate-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {kindCounts[kind]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative flex-shrink-0 w-36 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg
                focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/30 focus:border-[#0D47A1]/50
                transition-all text-slate-700 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={openDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex-shrink-0 ${hasActiveFilters
                ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
          </button>

          {/* Mark all read */}
          {totalUnread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition flex-shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition flex-shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0D47A1]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Scrollable content — only this area scrolls ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Active:</span>
            {appliedUnreadOnly && (
              <Chip label="Unread only" onRemove={() => setAppliedUnreadOnly(false)} />
            )}
            {appliedDept !== 'all' && (
              <Chip label={`Dept: ${appliedDept}`} onRemove={() => setAppliedDept('all')} />
            )}
            {appliedBranch !== 'all' && (
              <Chip label={`Branch: ${appliedBranch}`} onRemove={() => setAppliedBranch('all')} />
            )}
            {appliedEmployee !== 'all' && (
              <Chip label={`Employee: ${appliedEmployee}`} onRemove={() => setAppliedEmployee('all')} />
            )}
            <button
              onClick={() => { setAppliedDept('all'); setAppliedBranch('all'); setAppliedEmployee('all'); setAppliedUnreadOnly(false); }}
              className="text-[11px] text-red-400 hover:text-red-600 font-semibold transition"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Summary line */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {filtered.length === 0
              ? 'No notifications'
              : `${filtered.length} notification${filtered.length > 1 ? 's' : ''}${filtered.filter(n => !n.is_read).length > 0 ? ` · ${filtered.filter(n => !n.is_read).length} unread` : ''}`}
          </p>
          {filtered.length > PAGE_SIZE && (
            <p className="text-xs text-slate-400">Page {safePage} of {totalPages}</p>
          )}
        </div>

        {/* Notification List */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">No notifications found</p>
            <p className="text-xs text-slate-400">
              {searchQuery || hasActiveFilters || kindFilter !== 'all'
                ? 'Try adjusting your filters.'
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {paginated.map((n, idx) => {
              const kind = getKind(n);
              const KindIcon = KIND_ICONS[kind];
              const accent = KIND_ACCENT[kind];
              const iconBg = KIND_ICON_BG[kind];
              const emoji = getEmoji(n);
              const title = cleanTitle(n.title);
              const isFirst = idx === 0;
              const isLast = idx === paginated.length - 1;

              return (
                <div
                  key={`${kind}_${n.id}`}
                  onClick={() => navigateToModule(n)}
                  className={`group relative flex items-start gap-3.5 px-4 py-3.5 cursor-pointer
                    transition-colors duration-150 hover:bg-slate-50/80
                    ${!n.is_read ? 'bg-white' : 'bg-white/50'}
                    ${isFirst ? 'rounded-t-xl border-t border-x border-slate-200' : 'border-x border-b border-slate-200'}
                    ${isLast ? 'rounded-b-xl' : ''}
                  `}
                >
                  {!n.is_read && (
                    <span className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${accent.dot}`} />
                  )}

                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 text-base mt-0.5`}>
                    <span>{emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={`text-sm leading-snug truncate ${!n.is_read ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                        {title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">{n.message?.replace(/[\uFFFD]/g, '')}</p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${accent.badge}`}>
                        <KindIcon className={`w-2.5 h-2.5 ${accent.icon}`} />
                        {KIND_LABELS[kind]}
                      </span>
                      {n.employee_name && <span className="text-[10px] text-slate-400">{n.employee_name}</span>}
                      {n.department && <span className="text-[10px] text-slate-400">· {n.department}</span>}
                      {n.branch && <span className="text-[10px] text-slate-400">· {n.branch}</span>}
                    </div>
                  </div>

                  {!n.is_read && (
                    <CircleDot className={`w-3 h-3 flex-shrink-0 mt-1.5 ${accent.icon} opacity-70`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 mb-4 flex items-center justify-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) page = i + 1;
              else if (safePage <= 4) page = i + 1;
              else if (safePage >= totalPages - 3) page = totalPages - 6 + i;
              else page = safePage - 3 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition ${page === safePage
                      ? 'bg-[#0D47A1] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>{/* end scrollable content */}


      {/* ── Filter Drawer (right side) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${drawerVisible ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Drawer panel */}
          <div
            className={`fixed top-0 right-0 h-full w-80 z-50 bg-white shadow-2xl flex flex-col
              transition-transform duration-300 ease-in-out
              ${drawerVisible ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800">Filters</h3>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

              {/* Unread only */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Unread only</span>
                <button
                  onClick={() => setDraftUnreadOnly(!draftUnreadOnly)}
                  className={`relative rounded-full transition-colors duration-200 flex-shrink-0 ${draftUnreadOnly ? 'bg-[#0D47A1]' : 'bg-slate-200'
                    }`}
                  style={{ width: 40, height: 22 }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200 ${draftUnreadOnly ? 'translate-x-[18px]' : 'translate-x-0'
                      }`}
                    style={{ width: 18, height: 18 }}
                  />
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Branch — from settingsApi */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Branch</label>
                <div className="relative">
                  <select
                    value={draftBranch}
                    onChange={e => setDraftBranch(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8
                      text-sm text-slate-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50
                      cursor-pointer transition-all hover:border-slate-300"
                  >
                    <option value="all">All Branches</option>
                    {branchOptions.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Department — from masterAPI */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
                <div className="relative">
                  <select
                    value={draftDept}
                    onChange={e => setDraftDept(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8
                      text-sm text-slate-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50
                      cursor-pointer transition-all hover:border-slate-300"
                  >
                    <option value="all">All Departments</option>
                    {deptOptions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Employee — searchable, 5 visible, from employeeApi */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employee</label>

                {/* Search input */}
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={empSearchQuery}
                    onChange={e => setEmpSearchQuery(e.target.value)}
                    placeholder="Name or Employee ID…"
                    className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg
                      focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/30 focus:border-[#0D47A1]/50
                      transition-all text-slate-700 placeholder-slate-400"
                  />
                  {empSearchQuery && (
                    <button onClick={() => setEmpSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Employee list — 5 visible, scroll */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* All option */}
                  <button
                    onClick={() => setDraftEmployee('all')}
                    className={`w-full text-left px-3 py-2 text-sm border-b border-slate-100 transition-colors ${
                      draftEmployee === 'all'
                        ? 'bg-[#0D47A1]/8 text-[#0D47A1] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    style={{ backgroundColor: draftEmployee === 'all' ? 'rgba(13,71,161,0.06)' : undefined }}
                  >
                    <span className="text-xs">All Employees</span>
                  </button>

                  {/* Scrollable list */}
                  <div className="overflow-y-auto" style={{ maxHeight: '185px' }}>
                    {empLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-4 h-4 border-2 border-slate-200 border-t-[#0D47A1] rounded-full animate-spin" />
                        <span className="text-xs text-slate-400 ml-2">Loading…</span>
                      </div>
                    ) : empOptions.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No employees found</p>
                    ) : (
                      empOptions.map(emp => {
                        const fullName = `${emp.firstName} ${emp.lastName}`;
                        const isSelected = draftEmployee === fullName;
                        return (
                          <button
                            key={emp.id}
                            onClick={() => setDraftEmployee(fullName)}
                            className={`w-full text-left px-3 py-2 border-b border-slate-50 last:border-0 transition-colors ${
                              isSelected
                                ? 'font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                            style={{ backgroundColor: isSelected ? 'rgba(13,71,161,0.06)' : undefined, color: isSelected ? '#0D47A1' : undefined }}
                          >
                            <div className="flex items-center gap-2">
                              {/* Avatar */}
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-600 uppercase overflow-hidden">
                                {emp.avatarUrl
                                  ? <img src={emp.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  : emp.firstName?.[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{fullName}</p>
                                <p className="text-[10px] text-slate-400">{emp.employeeId} · {emp.department}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Selected indicator */}
                {draftEmployee !== 'all' && (
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-[#0D47A1] font-semibold">✓ {draftEmployee}</span>
                    <button onClick={() => setDraftEmployee('all')} className="text-[10px] text-red-400 hover:text-red-600">Clear</button>
                  </div>
                )}
              </div>
            </div>


            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetDraft}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#0D47A1] rounded-xl hover:bg-[#1565C0] transition shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


// ── Chip component ────────────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

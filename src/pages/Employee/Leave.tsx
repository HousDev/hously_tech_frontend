import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ChevronLeft, ChevronRight, Eye, Edit2, Trash2, X,
  Clock, CheckCircle2, XCircle, Calendar,
  AlertTriangle, FileText, Bookmark, CalendarRange,
  Send, CalendarDays, Lock, Loader2, Plus
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useLeaveSocket } from '../../hooks/useLeaveSocket';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveItem {
  id: number;
  application_no: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  is_half_day: boolean;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  admin_remark?: string;
}

interface LeaveBalance {
  casual:  { allotted: number; taken: number };
  sick:    { allotted: number; taken: number };
  paid:    { allotted: number; taken: number };
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

const ACCENT: Record<string, { cardBg: string; border: string; iconBg: string }> = {
  amber:   { cardBg: 'bg-amber-50/40',   border: 'border-amber-100/60',   iconBg: 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' },
  emerald: { cardBg: 'bg-emerald-50/40', border: 'border-emerald-100/60', iconBg: 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' },
  blue:    { cardBg: 'bg-blue-50/40',    border: 'border-blue-100/60',    iconBg: 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' },
  indigo:  { cardBg: 'bg-indigo-50/40',  border: 'border-indigo-100/60',  iconBg: 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' },
  rose:    { cardBg: 'bg-rose-50/40',    border: 'border-rose-100/60',    iconBg: 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]' },
};

const StatCard = ({ label, value, sub, icon, accent = 'blue' }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; accent?: keyof typeof ACCENT;
}) => {
  const cfg = ACCENT[accent];
  return (
    <div className={`${cfg.cardBg} ${cfg.border} rounded-xl border shadow-md p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${cfg.iconBg} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-sm sm:text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold truncate">{sub}</p>}
      </div>
    </div>
  );
};

const Overlay = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    onClick={onClick}
  />
);

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

// ─── Main Component ───────────────────────────────────────────────────────────

const Leave: React.FC = () => {

  // Data
  const [leaves,  setLeaves]  = useState<LeaveItem[]>([]);
  const [balance, setBalance] = useState<LeaveBalance>({
    casual: { allotted: 12, taken: 0 },
    sick:   { allotted: 8,  taken: 0 },
    paid:   { allotted: 18, taken: 0 },
  });
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Apply form
  const [form, setForm] = useState({
    type: 'Casual Leave', startDate: '', endDate: '', reason: '', isHalfDay: false
  });

  // Filters
  const [filterType,      setFilterType]      = useState('all');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate,   setFilterEndDate]   = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState<number | 'all'>(10);

  // Month navigator
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  });

  // Modals
  const [viewItem,   setViewItem]   = useState<LeaveItem | null>(null);
  const [editItem,   setEditItem]   = useState<LeaveItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<LeaveItem | null>(null);
  const [editForm,   setEditForm]   = useState({ type: '', startDate: '', endDate: '', reason: '', isHalfDay: false });

  // ─── Month navigator constraints ──────────────────────────────────────────────
  const today = useMemo(() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; }, []);
  const prevMonthLimit = useMemo(() => { const d = new Date(today); d.setMonth(d.getMonth() - 24); return d; }, [today]);
  const canGoPrev = viewMonth.getTime() > prevMonthLimit.getTime();
  const canGoNext = viewMonth.getTime() < today.getTime();
  const goPrevMonth = () => { if (!canGoPrev) return; const d = new Date(viewMonth); d.setMonth(d.getMonth()-1); setViewMonth(d); setCurrentPage(1); };
  const goNextMonth = () => { if (!canGoNext) return; const d = new Date(viewMonth); d.setMonth(d.getMonth()+1); setViewMonth(d); setCurrentPage(1); };

  // ─── Month string for API ─────────────────────────────────────────────────────
  const monthParam = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth()+1).padStart(2,'0')}`;

  // ─── Fetch data from API ──────────────────────────────────────────────────────
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<LeaveItem[]>(`/leaves/my?month=${monthParam}`);
      setLeaves(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  }, [monthParam]);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await apiClient.get<LeaveBalance>('/leaves/balance');
      setBalance(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);
  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  // ─── Real-time socket listener ────────────────────────────────────────────────
  useLeaveSocket((event, data) => {
    if (event === 'leave_status_changed') {
      setLeaves(prev => prev.map(l => l.id === data.id ? { ...l, ...data } : l));
      fetchBalance(); // refresh balance when status changes
    }
    if (event === 'leave_deleted') {
      // Admin deleted this employee's leave
      setLeaves(prev => prev.filter(l => l.id !== data.id));
    }
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const calcDays = (start: string, end: string, half: boolean) => {
    if (!start || !end) return 0;
    if (half) return 0.5;
    return Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
  };

  const fmtDate = (d: string) => {
    if (!d) return '–';
    const parts = d.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
    }
    const dt = new Date(d);
    return `${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`;
  };

  // ─── Apply Leave ──────────────────────────────────────────────────────────────
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason.trim()) { toast.error('Please fill all fields'); return; }
    if (new Date(form.startDate) > new Date(form.endDate)) { toast.error('Start date cannot be after end date'); return; }
    const days = calcDays(form.startDate, form.endDate, form.isHalfDay);
    setSubmitting(true);
    try {
      const newLeave = await apiClient.post<LeaveItem>('/leaves', {
        leaveType: form.type, fromDate: form.startDate, toDate: form.endDate,
        days, isHalfDay: form.isHalfDay, reason: form.reason,
      });
      // Only prepend if it matches the current viewMonth without timezone shifts
      const dateParts = newLeave.from_date.split('T')[0].split('-');
      const leaveYear = parseInt(dateParts[0], 10);
      const leaveMonth = parseInt(dateParts[1], 10) - 1;
      if (leaveMonth === viewMonth.getMonth() && leaveYear === viewMonth.getFullYear()) {
        setLeaves(prev => [newLeave, ...prev]);
      }
      setForm({ type: 'Casual Leave', startDate: '', endDate: '', reason: '', isHalfDay: false });
      toast.success('Leave application submitted successfully!');
      setCurrentPage(1);
      setIsApplyOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────────
  const openEdit = (item: LeaveItem) => {
    if (item.status !== 'Pending') { toast.error(`Cannot edit a ${item.status.toLowerCase()} leave request`); return; }
    setEditItem(item);
    setEditForm({ type: item.leave_type, startDate: item.from_date, endDate: item.to_date, reason: item.reason, isHalfDay: item.is_half_day });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.startDate || !editForm.endDate || !editForm.reason.trim()) { toast.error('Please fill all fields'); return; }
    if (new Date(editForm.startDate) > new Date(editForm.endDate)) { toast.error('Start date cannot be after end date'); return; }
    const days = calcDays(editForm.startDate, editForm.endDate, editForm.isHalfDay);
    setSubmitting(true);
    try {
      const updated = await apiClient.put<LeaveItem>(`/leaves/${editItem!.id}`, {
        leaveType: editForm.type, fromDate: editForm.startDate, toDate: editForm.endDate,
        days, isHalfDay: editForm.isHalfDay, reason: editForm.reason,
      });
      setLeaves(prev => prev.map(l => l.id === updated.id ? updated : l));
      setEditItem(null);
      toast.success('Leave updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update leave');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const openDelete = (item: LeaveItem) => {
    if (item.status !== 'Pending') { toast.error(`Cannot delete a ${item.status.toLowerCase()} leave request`); return; }
    setDeleteItem(item);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setSubmitting(true);
    try {
      await apiClient.delete(`/leaves/${deleteItem.id}`);
      setLeaves(prev => prev.filter(l => l.id !== deleteItem.id));
      setDeleteItem(null);
      toast.success('Leave request deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete leave');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Derived stats from balance ───────────────────────────────────────────────
  const pendingCount  = useMemo(() => leaves.filter(l => l.status === 'Pending').length,  [leaves]);
  const rejectedCount = useMemo(() => leaves.filter(l => l.status === 'Rejected').length, [leaves]);

  // ─── Client-side filter + pagination ─────────────────────────────────────────
  const filtered = useMemo(() => leaves.filter(l => {
    if (filterType   !== 'all' && l.leave_type !== filterType)   return false;
    if (filterStatus !== 'all' && l.status     !== filterStatus) return false;
    if (filterStartDate && l.from_date.split('T')[0] < filterStartDate) return false;
    if (filterEndDate   && l.to_date.split('T')[0]   > filterEndDate)   return false;
    return true;
  }), [leaves, filterType, filterStatus, filterStartDate, filterEndDate]);

  const totalPages = useMemo(() => pageSize === 'all' ? 1 : Math.ceil(filtered.length / pageSize) || 1, [filtered.length, pageSize]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const paginated = useMemo(() => {
    if (pageSize === 'all') return filtered;
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filtered, currentPage, pageSize]);

  const showFrom = pageSize === 'all' ? 1 : (currentPage - 1) * (pageSize as number) + 1;
  const showTo   = pageSize === 'all' ? filtered.length : Math.min(currentPage * (pageSize as number), filtered.length);

  const colInp = 'w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all';

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 pt-2 pb-4 md:px-6 md:pt-3 md:pb-6 space-y-3.5 min-h-full">

      {/* StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        <StatCard label="Casual Leave" value={balance.casual.taken}
          sub={`${balance.casual.allotted - balance.casual.taken} of ${balance.casual.allotted} days remaining`}
          icon={<CalendarDays size={18} className="text-emerald-600" />} accent="emerald" />
        <StatCard label="Sick Leave" value={balance.sick.taken}
          sub={`${balance.sick.allotted - balance.sick.taken} of ${balance.sick.allotted} days remaining`}
          icon={<Calendar size={18} className="text-amber-600" />} accent="amber" />
        <StatCard label="Paid Leave" value={balance.paid.taken}
          sub={`${balance.paid.allotted - balance.paid.taken} of ${balance.paid.allotted} days remaining`}
          icon={<CheckCircle2 size={18} className="text-indigo-600" />} accent="indigo" />
        <StatCard label="Pending Requests" value={pendingCount} sub="Awaiting approval"
          icon={<Clock size={18} className="text-blue-600" />} accent="blue" />
        <StatCard label="Rejected Leaves" value={rejectedCount}
          sub={rejectedCount === 0 ? 'None rejected' : 'Requests rejected'}
          icon={<XCircle size={18} className="text-rose-600" />} accent="rose" />
      </div>

      {/* Grid */}
      <div className="w-full">

        {/* ── Leave History Table ───────────────────────────────────────────────── */}
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-auto lg:h-[calc(100vh-270px)] lg:min-h-[400px]">

          {/* Toolbar */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-1 rounded-md">My Leave History</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={goPrevMonth} disabled={!canGoPrev} title="Previous month"
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <ChevronLeft size={14} />
                </button>
                <span className="min-w-[110px] text-center text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <button onClick={goNextMonth} disabled={!canGoNext} title="Next month"
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  <ChevronRight size={14} />
                </button>
              </div>

              <button
                onClick={() => setIsApplyOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D47A1] hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
              >
                <Plus size={13} />
                <span>Apply For Leave</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 size={24} className="animate-spin text-slate-300" />
              </div>
            ) : (
              <table className="min-w-full border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">App #</th>
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Type</th>
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">From</th>
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">To</th>
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Days</th>
                    <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                    <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Actions</th>
                  </tr>
                  <tr className="bg-white border-b-2 border-slate-200 sticky top-[37px] z-10">
                    <th className="px-3 py-2 border-r border-slate-100" />
                    <th className="px-3 py-2 border-r border-slate-100">
                      <select value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }} className={colInp + ' cursor-pointer'}>
                        <option value="all">All Types</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Paid Leave">Paid Leave</option>
                        <option value="Other">Other</option>
                      </select>
                    </th>
                    <th className="px-3 py-2 border-r border-slate-100">
                      <input type="date" value={filterStartDate} onChange={e => { setFilterStartDate(e.target.value); setCurrentPage(1); }} className={colInp} />
                    </th>
                    <th className="px-3 py-2 border-r border-slate-100">
                      <input type="date" value={filterEndDate} onChange={e => { setFilterEndDate(e.target.value); setCurrentPage(1); }} className={colInp} />
                    </th>
                    <th className="px-3 py-2 border-r border-slate-100" />
                    <th className="px-3 py-2 border-r border-slate-100">
                      <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className={colInp + ' cursor-pointer'}>
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.length > 0 ? paginated.map(item => {
                    const isPending = item.status === 'Pending';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition border-b border-slate-100 last:border-b-0">
                        <td className="px-4 py-3 border-r border-slate-100">
                          <button onClick={() => setViewItem(item)} className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer text-left">
                            {item.application_no}
                          </button>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-100">
                          <span className="text-[11px] text-slate-600 font-semibold bg-slate-100/70 px-2 py-0.5 rounded">{item.leave_type}</span>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-100"><span className="text-[11px] text-slate-600 font-medium">{fmtDate(item.from_date)}</span></td>
                        <td className="px-4 py-3 border-r border-slate-100"><span className="text-[11px] text-slate-600 font-medium">{fmtDate(item.to_date)}</span></td>
                        <td className="px-4 py-3 border-r border-slate-100"><span className="text-[11px] text-slate-700 font-semibold">{item.days} {item.days <= 1 ? 'day' : 'days'}</span></td>
                        <td className="px-4 py-3 border-r border-slate-100">
                          {item.status === 'Approved' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Approved</span>}
                          {item.status === 'Pending'  && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending</span>}
                          {item.status === 'Rejected' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Rejected</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewItem(item)} title="View" className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"><Eye size={12} className="text-blue-500" /></button>
                            <button onClick={() => openEdit(item)} title={isPending ? 'Edit' : `Cannot edit ${item.status} leave`}
                              className={`p-1.5 rounded-lg transition ${isPending ? 'hover:bg-blue-50 text-slate-400 hover:text-blue-600 cursor-pointer' : 'opacity-30 cursor-not-allowed text-slate-300'}`}>
                              <Edit2 size={12} className={isPending ? 'text-green-500' : 'text-slate-300'} />
                            </button>
                            <button onClick={() => openDelete(item)} title={isPending ? 'Delete' : `Cannot delete ${item.status} leave`}
                              className={`p-1.5 rounded-lg transition ${isPending ? 'hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer' : 'opacity-30 cursor-not-allowed text-slate-300'}`}>
                              <Trash2 size={12} className={isPending ? 'text-red-500' : 'text-slate-300'} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 text-sm font-semibold">
                        <div className="flex flex-col items-center gap-2"><CalendarDays size={28} className="text-slate-300" /><span>No leave records for this month</span></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="static sm:sticky sm:bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2 select-none">
              <span className="font-semibold">Showing {showFrom}–{showTo} of {filtered.length} records</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">Show:</span>
                  <select value={pageSize === 'all' ? 'all' : pageSize}
                    onChange={e => { const v = e.target.value; setPageSize(v === 'all' ? 'all' : Number(v)); setCurrentPage(1); }}
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white">
                    <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value="all">All</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    <ChevronLeft size={12} />Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${p===currentPage ? 'bg-[#0D47A1] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                    Next<ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>

        {/* APPLY FOR LEAVE */}
        {isApplyOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Overlay onClick={() => setIsApplyOpen(false)} />
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0, y:16 }} transition={{ type:'spring', duration:0.35 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col z-10">
              <div className="sticky top-0 bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Apply For Leave</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Submit a new leave request</p>
                </div>
                <button type="button" onClick={() => setIsApplyOpen(false)} className="p-1 hover:bg-slate-200/60 rounded-lg transition text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleApply} className="flex flex-col flex-grow">
                <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leave Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 cursor-pointer font-medium">
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Start Date</label>
                      <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">End Date</label>
                      <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium" required />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="halfDay" type="checkbox" checked={form.isHalfDay} onChange={e => setForm(f => ({ ...f, isHalfDay: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] cursor-pointer" />
                    <label htmlFor="halfDay" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">Half Day (0.5 day)</label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason</label>
                    <textarea rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium placeholder-slate-300 leading-relaxed resize-none" placeholder="Enter leave reason details..." required />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsApplyOpen(false)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#0D47A1] hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5">
                    {submitting ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />} Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* VIEW */}
        {viewItem && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Overlay onClick={() => setViewItem(null)} />
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0, y:16 }} transition={{ type:'spring', duration:0.35 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col z-10">
              <div className="sticky top-0 bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Leave Request Details</h3>
                  {viewItem.status === 'Approved' && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold">Approved</span>}
                  {viewItem.status === 'Pending'  && <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse">Pending</span>}
                  {viewItem.status === 'Rejected' && <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full text-[9px] font-bold">Rejected</span>}
                </div>
                <button onClick={() => setViewItem(null)} className="p-1 hover:bg-slate-200/60 rounded-lg transition text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><FileText size={9} /> Application #</span>
                    <p className="font-bold text-slate-700 text-xs">{viewItem.application_no}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><Bookmark size={9} /> Leave Type</span>
                    <p className="font-bold text-slate-700 text-xs">{viewItem.leave_type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1"><CalendarRange size={9} /> Duration</span>
                  <p className="font-bold text-slate-700 text-xs">{fmtDate(viewItem.from_date)} → {fmtDate(viewItem.to_date)} (<span className="text-blue-600">{viewItem.days} {viewItem.days<=1?'day':'days'}</span>)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reason</span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-slate-600 text-xs italic leading-relaxed">"{viewItem.reason}"</div>
                </div>
                {viewItem.admin_remark && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Admin Remark</span>
                    <div className={`p-3.5 rounded-xl border-l-4 text-xs italic leading-relaxed ${viewItem.status==='Approved' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-rose-50 border-rose-300 text-rose-700'}`}>
                      "{viewItem.admin_remark}"
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button onClick={() => setViewItem(null)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer">Close</button>
                {viewItem.status === 'Pending' && (
                  <button onClick={() => { setViewItem(null); openEdit(viewItem); }} className="px-4 py-2 bg-[#0D47A1] hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer">Edit Request</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* EDIT */}
        {editItem && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Overlay onClick={() => setEditItem(null)} />
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0, y:16 }} transition={{ type:'spring', duration:0.35 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col z-10">
              <div className="sticky top-0 bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Edit Leave Request</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{editItem.application_no}</p>
                </div>
                <button onClick={() => setEditItem(null)} className="p-1 hover:bg-slate-200/60 rounded-lg transition text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
              </div>
              <form onSubmit={handleEditSave} className="flex flex-col flex-grow">
                <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leave Type</label>
                    <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 cursor-pointer font-medium">
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Start Date</label>
                      <input type="date" value={editForm.startDate} onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">End Date</label>
                      <input type="date" value={editForm.endDate} onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium" required />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="editHalf" type="checkbox" checked={editForm.isHalfDay} onChange={e => setEditForm(f => ({ ...f, isHalfDay: e.target.checked }))} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] cursor-pointer" />
                    <label htmlFor="editHalf" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">Half Day (0.5)</label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason</label>
                    <textarea rows={3} value={editForm.reason} onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 font-medium placeholder-slate-300 leading-relaxed resize-none" placeholder="Enter reason..." required />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#0D47A1] hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5">
                    {submitting && <Loader2 size={11} className="animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* DELETE */}
        {deleteItem && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Overlay onClick={() => setDeleteItem(null)} />
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }} transition={{ duration:0.25 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col z-10">
              <div className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center"><AlertTriangle size={24} /></div>
                <h3 className="font-bold text-slate-800 text-base">Delete Leave Request?</h3>
                <p className="text-xs text-slate-500 leading-relaxed px-2">
                  Are you sure you want to delete <span className="font-bold text-slate-800">{deleteItem.application_no}</span>? This action is permanent.
                </p>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button onClick={() => setDeleteItem(null)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer">Cancel</button>
                <button onClick={handleDelete} disabled={submitting} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5">
                  {submitting && <Loader2 size={11} className="animate-spin" />} Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leave;
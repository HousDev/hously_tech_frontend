import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Check, X, AlertCircle, Eye, Edit2, Trash2,
  ChevronLeft, ChevronRight, Search, Mail, Clock, CheckCircle2,
  XCircle, SlidersHorizontal, RefreshCw, CalendarDays, AlertTriangle,
  FileText, Bookmark, CalendarRange, UserMinus, UserCheck, Users, Loader2, Bell
} from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from '../../../lib/api';
import { useLeaveSocket } from '../../../hooks/useLeaveSocket';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface LeaveRequest {
  id: string;
  application_no: string;
  employee_name: string;
  employee_email: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  admin_remark?: string;
  allotted_cl: number;
  allotted_sl: number;
  allotted_pl: number;
  user_id: number;
}

// ─── Stat Card Accent Classes & Component ──────────────────────────────────────

const ACCENT_CLASSES: Record<string, { cardBg: string; border: string; iconBg: string }> = {
  blue: {
    cardBg: "bg-blue-50/40",
    border: "border-blue-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  emerald: {
    cardBg: "bg-emerald-50/40",
    border: "border-emerald-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  amber: {
    cardBg: "bg-amber-50/40",
    border: "border-amber-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  rose: {
    cardBg: "bg-rose-50/40",
    border: "border-rose-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
};

const StatCard = ({
  label,
  value,
  icon,
  accent = "blue",
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "blue" | "emerald" | "amber" | "rose";
  sub?: string;
}) => {
  const cfg = ACCENT_CLASSES[accent] || ACCENT_CLASSES.blue;
  return (
    <div className={`${cfg.cardBg} ${cfg.border} rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${cfg.iconBg} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
          {label}
        </p>
        <p className="text-sm sm:text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold truncate">{sub}</p>}
      </div>
    </div>
  );
};




export default function HRMSLeaves() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Leave Management");
      setHeaderSubtitle("Manage time-off requests, vacation approvals, and yearly balance trackers");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // ─── State ───────────────────────────────────────────────────────────────────

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLeaveCount, setNewLeaveCount] = useState(0); // notification badge

  // Table Filters
  const [searchAppNo,      setSearchAppNo]      = useState("");
  const [searchEmployee,   setSearchEmployee]   = useState("");
  const [filterLeaveType,  setFilterLeaveType]  = useState("all");
  const [filterFromDate,   setFilterFromDate]   = useState("");
  const [filterToDate,     setFilterToDate]     = useState("");
  const [filterStatus,     setFilterStatus]     = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  // Modals
  const [viewItem,    setViewItem]    = useState<LeaveRequest | null>(null);
  const [editItem,    setEditItem]    = useState<LeaveRequest | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [activeStatusRowId, setActiveStatusRowId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    leaveType: "", fromDate: "", toDate: "", reason: "",
    status: "Pending", adminRemark: "", isHalfDay: false
  });

  // ─── Fetch ────────────────────────────────────────────────────────────────────

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<LeaveRequest[]>('/leaves');
      setLeaveRequests(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  // ─── Real-time socket ─────────────────────────────────────────────────────────

  useLeaveSocket((event, data) => {
    if (event === 'leave_new') {
      setLeaveRequests(prev => [data, ...prev]);
      setNewLeaveCount(c => c + 1);
      toast.success(`📋 New leave request from ${data.employee_name}`, { duration: 5000 });
    }
    if (event === 'leave_updated') {
      setLeaveRequests(prev => prev.map(r => r.id === data.id ? { ...r, ...data } : r));
    }
    if (event === 'leave_deleted') {
      setLeaveRequests(prev => prev.filter(r => String(r.id) !== String(data.id)));
      setSelectedIds(prev => { const c = new Set(prev); c.delete(String(data.id)); return c; });
    }
  });

  // ─── Helper Functions ────────────────────────────────────────────────────────

  // Check if a date falls on "On Leave" today (July 8, 2026)
  const isCurrentlyOnLeave = (fromDateStr: string, toDateStr: string, status: string) => {
    if (status !== "Approved") return false;
    const today = new Date();
    const from = new Date(fromDateStr);
    const to = new Date(toDateStr);
    return today >= from && today <= to;
  };

  const summaryCounts = useMemo(() => {
    let pending = 0, approved = 0, onLeave = 0, rejected = 0;
    leaveRequests.forEach((req) => {
      if (req.status === "Pending") pending++;
      else if (req.status === "Approved") {
        approved++;
        if (isCurrentlyOnLeave(req.from_date, req.to_date, req.status)) onLeave++;
      } else if (req.status === "Rejected") rejected++;
    });
    return { pending, approved, onLeave, rejected };
  }, [leaveRequests]);

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      if (searchAppNo    && !req.application_no.toLowerCase().includes(searchAppNo.toLowerCase()))    return false;
      if (searchEmployee && !req.employee_name.toLowerCase().includes(searchEmployee.toLowerCase()))   return false;
      if (filterLeaveType !== "all" && req.leave_type !== filterLeaveType) return false;
      if (filterFromDate  && new Date(req.from_date) < new Date(filterFromDate)) return false;
      if (filterToDate    && new Date(req.to_date)   > new Date(filterToDate))   return false;
      if (filterStatus !== "all" && req.status !== filterStatus) return false;
      return true;
    });
  }, [leaveRequests, searchAppNo, searchEmployee, filterLeaveType, filterFromDate, filterToDate, filterStatus]);

  // Handle Select All Checked
  const isAllSelected = useMemo(() => {
    if (filteredRequests.length === 0) return false;
    return filteredRequests.every(r => selectedIds.has(r.id));
  }, [filteredRequests, selectedIds]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      const newIds = new Set(selectedIds);
      filteredRequests.forEach(r => newIds.delete(r.id));
      setSelectedIds(newIds);
    } else {
      const newIds = new Set(selectedIds);
      filteredRequests.forEach(r => newIds.add(r.id));
      setSelectedIds(newIds);
    }
  };

  const handleRowSelect = (id: string) => {
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setSelectedIds(newIds);
  };

  // Pagination calculation
  const totalEntries = filteredRequests.length;
  const totalPages = useMemo(() => {
    if (pageSize === "all") return 1;
    return Math.ceil(totalEntries / pageSize) || 1;
  }, [totalEntries, pageSize]);

  // Adjust page number if it exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedRequests = useMemo(() => {
    if (pageSize === "all") return filteredRequests;
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

  // ─── Modal Triggers ──────────────────────────────────────────────────────────

  const openViewModal = (req: LeaveRequest) => {
    setViewItem(req);
  };

  const openEditModal = (req: LeaveRequest) => {
    setEditItem(req);
    setEditForm({
      leaveType: req.leave_type,
      fromDate: req.from_date,
      toDate: req.to_date,
      reason: req.reason,
      status: req.status,
      adminRemark: req.admin_remark || '',
      isHalfDay: req.days === 0.5
    });
  };

  const openDeleteModal = (id: string) => {
    setDeleteItemId(id);
  };

  // ─── Form Handlers ───────────────────────────────────────────────────────────

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.fromDate || !editForm.toDate) { toast.error("Please specify both dates"); return; }
    if (new Date(editForm.fromDate) > new Date(editForm.toDate)) { toast.error("From date cannot be after To date"); return; }
    const diffTime = Math.abs(new Date(editForm.toDate).getTime() - new Date(editForm.fromDate).getTime());
    const diffDays = Math.ceil(diffTime / 86400000) + 1;
    const calculatedDays = editForm.isHalfDay ? 0.5 : diffDays;
    setSubmitting(true);
    try {
      const updated = await apiClient.put<LeaveRequest>(`/leaves/${editItem?.id}/admin`, {
        leaveType: editForm.leaveType, fromDate: editForm.fromDate, toDate: editForm.toDate,
        reason: editForm.reason, status: editForm.status, adminRemark: editForm.adminRemark,
        days: calculatedDays, isHalfDay: editForm.isHalfDay,
      });
      setLeaveRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
      toast.success(`Application ${updated.application_no} updated successfully!`);
      setEditItem(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update leave');
    } finally { setSubmitting(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItemId) return;
    const req = leaveRequests.find(r => r.id === deleteItemId);
    setSubmitting(true);
    try {
      await apiClient.delete(`/leaves/${deleteItemId}/admin`);
      setLeaveRequests(prev => prev.filter(r => r.id !== deleteItemId));
      setSelectedIds(prev => { const c = new Set(prev); c.delete(deleteItemId); return c; });
      toast.success(`Application ${req?.application_no} deleted successfully!`);
      setDeleteItemId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally { setSubmitting(false); }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setSubmitting(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => apiClient.delete(`/leaves/${id}/admin`)));
      setLeaveRequests(prev => prev.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      toast.success("Selected leave applications deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete selected');
    } finally { setSubmitting(false); }
  };

  const handleQuickApprove = async (id: string) => {
    try {
      const updated = await apiClient.patch<LeaveRequest>(`/leaves/${id}/status`, { status: 'Approved' });
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
      setViewItem(prev => prev && prev.id === id ? { ...prev, ...updated } : prev);
      toast.success("Leave request approved ✅");
    } catch (err: any) { toast.error(err.message || 'Failed to approve'); }
  };

  const handleQuickReject = async (id: string) => {
    try {
      const updated = await apiClient.patch<LeaveRequest>(`/leaves/${id}/status`, { status: 'Rejected' });
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
      setViewItem(prev => prev && prev.id === id ? { ...prev, ...updated } : prev);
      toast.error("Leave request rejected ❌");
    } catch (err: any) { toast.error(err.message || 'Failed to reject'); }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Approved' | 'Rejected' | 'Pending') => {
    try {
      const updated = await apiClient.patch<LeaveRequest>(`/leaves/${id}/status`, { status: newStatus });
      setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
      setViewItem(prev => prev && prev.id === id ? { ...prev, ...updated } : prev);
      toast.success(`Leave request status updated to ${newStatus} successfully!`);
    } catch (err: any) {
      toast.error(err.message || `Failed to update status to ${newStatus}`);
    }
  };

  // Helper date format: "3/5/2026"
  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // ─── TSX Render ──────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-3.5 min-h-full bg-slate-50/50 text-slate-700">
      
      {/* 1. Stats Summary Cards (identical to Employees.tsx format) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard
          label="Pending Applications"
          value={summaryCounts.pending}
          icon={<Clock size={18} className="text-amber-600" />}
          accent="amber"
        />
        <StatCard
          label="Approved Leaves"
          value={summaryCounts.approved}
          icon={<UserCheck size={18} className="text-emerald-600" />}
          accent="emerald"
        />
        <StatCard
          label="Employees On Leave"
          value={summaryCounts.onLeave}
          icon={<Calendar size={18} className="text-blue-600" />}
          accent="blue"
          sub="Currently on leave"
        />
        <StatCard
          label="Rejected Leaves"
          value={summaryCounts.rejected}
          icon={<XCircle size={18} className="text-rose-600" />}
          accent="rose"
        />
      </div>

      {/* 2. Main Leaves Container (Same height and border shadow style as Employees.tsx table card) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden h-[calc(100vh-270px)] min-h-[400px] flex flex-col">
        
        {/* Card Header Toolbar (identical toolbar to Employees.tsx) */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-1 rounded-md">
              Leaves Directory
            </span>
            {newLeaveCount > 0 && (
              <button
                onClick={() => setNewLeaveCount(0)}
                title="Clear notifications"
                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-sm hover:bg-blue-700 transition cursor-pointer animate-bounce"
              >
                <Bell size={11} />
                <span>{newLeaveCount} New</span>
              </button>
            )}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
                >
                  <Trash2 size={11} /> Delete ({selectedIds.size})
                </button>
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedIds.size} selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Table body wrapper (identical to Employees.tsx table height/flex layout) */}
        <div className="overflow-y-auto flex-1 overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              {/* Header column names row (identical to Employees.tsx header row style) */}
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                    disabled={filteredRequests.length === 0}
                  />
                </th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Application #</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">From Date</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">To Date</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Days</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>

              {/* Column Filter Row (identical input styling to Employees.tsx) */}
              <tr className="bg-white border-b-2 border-slate-200 sticky top-[37px] z-10">
                <th className="px-3 py-2"></th>
                
                {/* Application No Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={searchAppNo}
                      onChange={(e) => { setSearchAppNo(e.target.value); setCurrentPage(1); }}
                      placeholder="Search app #..."
                      className="w-full pl-5 pr-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-650 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all"
                    />
                  </div>
                </th>

                {/* Employee Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={searchEmployee}
                      onChange={(e) => { setSearchEmployee(e.target.value); setCurrentPage(1); }}
                      placeholder="Search employee..."
                      className="w-full pl-5 pr-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-650 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all"
                    />
                  </div>
                </th>

                {/* Leave Type Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <select
                    value={filterLeaveType}
                    onChange={(e) => { setFilterLeaveType(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Paid Vacation">Paid Vacation</option>
                  </select>
                </th>

                {/* From Date Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <input
                    type="date"
                    value={filterFromDate}
                    onChange={(e) => { setFilterFromDate(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15"
                  />
                </th>

                {/* To Date Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <input
                    type="date"
                    value={filterToDate}
                    onChange={(e) => { setFilterToDate(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15"
                  />
                </th>

                {/* Days Filter - Empty spacer */}
                <th className="px-3 py-2 border-r border-slate-100"></th>

                {/* Status Filter */}
                <th className="px-3 py-2 border-r border-slate-100">
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </th>

                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 font-semibold">
                      <Loader2 size={24} className="animate-spin text-slate-300" />
                      <span>Loading leave applications...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => {
                  const isChecked = selectedIds.has(req.id);
                  return (
                    <tr
                      key={req.id}
                      onClick={() => openViewModal(req)}
                      className={`hover:bg-slate-50/50 transition border-b border-slate-100 last:border-b-0 cursor-pointer ${
                        isChecked ? "bg-blue-50/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3 text-center border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowSelect(req.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                        />
                      </td>

                      {/* Application No */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <button
                          onClick={() => openViewModal(req)}
                          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left text-[11px]"
                        >
                          {req.application_no}
                        </button>
                      </td>

                      {/* Employee details (with Avatar initials style) */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {req.employee_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">{req.employee_name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="text-[11px] text-slate-650 font-semibold bg-slate-100/70 px-2 py-0.5 rounded">
                          {req.leave_type}
                        </span>
                      </td>

                      {/* From Date */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {formatDateString(req.from_date)}
                        </span>
                      </td>

                      {/* To Date */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {formatDateString(req.to_date)}
                        </span>
                      </td>

                      {/* Days */}
                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="text-[11px] text-slate-700 font-semibold">
                          {req.days} {req.days === 1 || req.days === 0.5 ? "day" : "days"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 border-r border-slate-100 relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStatusRowId(activeStatusRowId === req.id ? null : req.id);
                          }}
                          className="transition hover:scale-[1.03] text-left cursor-pointer"
                        >
                          {req.status === "Approved" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Approved
                            </span>
                          )}
                          {req.status === "Pending" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          )}
                          {req.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Rejected
                            </span>
                          )}
                        </button>

                        {activeStatusRowId === req.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveStatusRowId(null);
                              }}
                            />
                            <div className="absolute right-4 top-10 mt-1 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-40 p-1.5 space-y-0.5">
                              {(["Pending", "Approved", "Rejected"] as const).map((status) => {
                                const isCurrent = req.status === status;
                                const dotColor = status === "Approved" ? "bg-emerald-500" : status === "Pending" ? "bg-amber-500" : "bg-red-500";
                                return (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isCurrent) {
                                        handleUpdateStatus(req.id, status);
                                      }
                                      setActiveStatusRowId(null);
                                    }}
                                    disabled={isCurrent}
                                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[10px] font-bold transition-colors ${
                                      isCurrent
                                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                                        : "hover:bg-slate-50 text-slate-700 cursor-pointer"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                    <span>{status}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Actions (identical toolbar style to Employees.tsx table) */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openViewModal(req)}
                            className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={12} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => openEditModal(req)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={12} className="text-green-500" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(req.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400 text-sm font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={24} className="text-slate-350" />
                      <span>No matching leave applications found.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Sticky Pagination Footer (identical class structure to Employees.tsx) */}
        {filteredRequests.length > 0 && (
          <div className="static sm:sticky sm:bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2">
            <span className="font-semibold">
              Showing {(currentPage - 1) * (pageSize === "all" ? filteredRequests.length : pageSize) + 1}–
              {Math.min(currentPage * (pageSize === "all" ? filteredRequests.length : pageSize), filteredRequests.length)} of {filteredRequests.length} applications
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400">Show:</span>
                <select
                  value={pageSize === "all" ? "all" : pageSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageSize(val === "all" ? "all" : Number(val));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-[#0D47A1]/20"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        isCurrent
                          ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm"
                          : "bg-white text-slate-650 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── MODAL DIALOGS (Framer Motion Animated Popups) ──────────────────── */}

      <AnimatePresence>
        
        {/* 1. VIEW APPLICATION MODAL */}
        {viewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Application details</h3>
                  {viewItem.status === "Approved" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      Approved
                    </span>
                  )}
                  {viewItem.status === "Pending" && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse">
                      Pending Approval
                    </span>
                  )}
                  {viewItem.status === "Rejected" && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      Rejected
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5 text-sm overflow-y-auto max-h-[75vh]">
                
                {/* Employee Card */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-base shadow-sm">
                    {viewItem.employee_name ? viewItem.employee_name.charAt(0) : '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs tracking-wide">{viewItem.employee_name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Mail size={10} className="text-gray-300" />
                      {viewItem.employee_email}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <FileText size={10} />
                      Application #
                    </span>
                    <p className="font-bold text-slate-700 text-xs">{viewItem.application_no}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <Bookmark size={10} />
                      Leave Type
                    </span>
                    <p className="font-bold text-slate-700 text-xs">{viewItem.leave_type}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <CalendarRange size={10} />
                      Duration
                    </span>
                    <p className="font-bold text-slate-700 text-xs">
                      {formatDateString(viewItem.from_date)} to {formatDateString(viewItem.to_date)} (
                      <span className="text-blue-600">
                        {viewItem.days} {viewItem.days === 1 || viewItem.days === 0.5 ? "Day" : "Days"}
                      </span>
                      )
                    </p>
                  </div>
                </div>

                {/* Available Leave Balances */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Available balances</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-blue-50/50 rounded-lg text-center border border-blue-50">
                      <div className="text-[9px] text-gray-400 font-bold uppercase">CL</div>
                      <div className="text-xs font-bold text-blue-700 mt-0.5">{viewItem.allotted_cl} Days</div>
                    </div>
                    <div className="p-2.5 bg-emerald-50/50 rounded-lg text-center border border-emerald-50">
                      <div className="text-[9px] text-gray-400 font-bold uppercase">SL</div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">{viewItem.allotted_sl} Days</div>
                    </div>
                    <div className="p-2.5 bg-indigo-50/50 rounded-lg text-center border border-indigo-50">
                      <div className="text-[9px] text-gray-400 font-bold uppercase">PL</div>
                      <div className="text-xs font-bold text-indigo-700 mt-0.5">{viewItem.allotted_pl} Days</div>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reason for Leave</span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-slate-600 text-xs italic leading-relaxed">
                    "{viewItem.reason}"
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewItem(null)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Close
                </button>
                {viewItem.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuickReject(viewItem.id)}
                      className="px-4 py-2 border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(viewItem.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. EDIT APPLICATION MODAL */}
        {editItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Edit leave application</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{editItem.application_no}</p>
                </div>
                <button
                  onClick={() => setEditItem(null)}
                  className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEdit} className="flex flex-col flex-grow">
                <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
                  
                  {/* Leave Type field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leave Type</label>
                    <select
                      value={editForm.leaveType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, leaveType: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Paid Vacation">Paid Vacation</option>
                    </select>
                  </div>

                  {/* Dates fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">From Date</label>
                      <input
                        type="date"
                        value={editForm.fromDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fromDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">To Date</label>
                      <input
                        type="date"
                        value={editForm.toDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, toDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Half day option */}
                  <div className="flex items-center gap-2 p-1">
                    <input
                      type="checkbox"
                      id="editIsHalfDay"
                      checked={editForm.isHalfDay}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isHalfDay: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="editIsHalfDay" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      Mark as half-day (0.5 day)
                    </label>
                  </div>

                  {/* Status selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-[#0D47A1] focus:outline-none focus:ring-1 focus:ring-[#0D47A1]/50 cursor-pointer font-medium"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Reason textarea */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason for Leave</label>
                    <textarea
                      rows={3}
                      value={editForm.reason}
                      onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Specify the reason details..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium placeholder-gray-400 leading-relaxed"
                    />
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* 3. DELETE CONFIRMATION MODAL */}
        {deleteItemId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Alert icon & Title */}
              <div className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-inner">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Delete Leave Record?</h3>
                <p className="text-xs text-gray-500 leading-relaxed px-2">
                  Are you sure you want to delete the leave request{" "}
                  <span className="font-bold text-slate-800">
                    {leaveRequests.find(r => String(r.id) === String(deleteItemId))?.application_no}
                  </span>
                  ? This will permanently remove the application record and cannot be undone.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setDeleteItemId(null)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

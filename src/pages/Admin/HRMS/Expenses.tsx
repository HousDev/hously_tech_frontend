import React, { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FileText, Eye, Trash2, Calendar, ChevronDown, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, DollarSign, Filter, Download, ArrowUpRight,
  Search, X, User, Tag, ShoppingBag, Edit3, ShieldAlert, Image, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../../lib/api";
import { toast } from "react-hot-toast";
import { useExpenseSocket } from "../../../hooks/useExpenseSocket";

// ─── TYPES & SCHEMAS ────────────────────────────────────────────────────────
interface ExpenseClaim {
  id: string; // Claim No.
  dbId?: number;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  category: "Office Supplies" | "Travel & Fuel" | "Utility & Cloud" | "Food & Lodging" | "Other";
  merchant: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  status: "Pending" | "Approved" | "Rejected";
  payrollStatus?: string;
  receiptNo?: string;
  taxAmount?: number;
  receiptUrl?: string;
}

// ─── INITIAL MOCK DATA ──────────────────────────────────────────────────────
const initialClaims: ExpenseClaim[] = [
  { id: "CLM-2026-001", employeeId: "EMP-012", employeeName: "Suraj Kumar", employeeEmail: "suraj.kumar@hously.in", department: "HR", category: "Office Supplies", merchant: "Amazon Business", description: "Wireless mechanical keyboard & Ergonomic Mouse for office setup", amount: 4200, date: "2026-06-24", status: "Pending", receiptNo: "REC-88371-AMZ", taxAmount: 756 },
  { id: "CLM-2026-002", employeeId: "EMP-034", employeeName: "Anjali Sharma", employeeEmail: "anjali.sharma@hously.in", department: "Sales", category: "Travel & Fuel", merchant: "Ola Cabs", description: "Client site presentation presentation taxi bills in Pune", amount: 1850, date: "2026-06-25", status: "Approved", receiptNo: "REC-93041-OLA", taxAmount: 92 },




];

export default function HRMSExpenses() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  // Setup header
  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Expense Claims Ledger");
      setHeaderSubtitle("Audit reimbursement claims, travel receipts, and utility bills filed by staff");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // States
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    id: "",
    employeeName: "",
    category: "",
    merchant: "",
    description: "",
    amount: "",
    date: "",
    status: ""
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    id: "",
    employeeName: "",
    category: "",
    merchant: "",
    description: "",
    amount: "",
    date: "",
    status: ""
  });

  useEffect(() => {
    if (isFilterDrawerOpen) {
      setTempFilters(activeFilters);
    }
  }, [isFilterDrawerOpen, activeFilters]);

  const [activeStatusEditId, setActiveStatusEditId] = useState<string | null>(null);

  // Modal States
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [claimToDelete, setClaimToDelete] = useState<ExpenseClaim | null>(null);
  const [showReceiptSlip, setShowReceiptSlip] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(10);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      const res = await apiClient.get<any[]>('/expenses');
      const mapped = res.map((c: any) => ({
        id: c.claim_no,
        dbId: c.id,
        employeeId: String(c.user_id),
        employeeName: c.employee_name,
        employeeEmail: c.employee_email,
        department: c.department,
        category: c.category,
        merchant: c.merchant,
        description: c.description,
        amount: Number(c.amount),
        date: c.date,
        status: c.status,
        payrollStatus: c.payroll_status,
        receiptUrl: c.receipt_url
      }));
      setClaims(mapped);
    } catch (err) {
      console.error('Failed to fetch expenses for ledger:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Listen to Socket.io events
  useExpenseSocket((event, data) => {
    console.log(`[HRMSExpenses Socket] Event received: ${event}`, data);
    if (event === 'expense_new') {
      // Append new claim
      setClaims(prev => {
        if (prev.some(c => c.id === data.claim_no)) return prev;
        const newClaim = {
          id: data.claim_no,
          dbId: data.id,
          employeeId: String(data.user_id),
          employeeName: data.employee_name,
          employeeEmail: data.employee_email,
          department: data.department,
          category: data.category,
          merchant: data.merchant,
          description: data.description,
          amount: Number(data.amount),
          date: data.date,
          status: data.status,
          receiptUrl: data.receipt_url
        };
        toast.success(`📋 New Expense Claim submitted: ${data.claim_no} by ${data.employee_name}`);
        return [newClaim, ...prev];
      });
    } else if (event === 'expense_status_changed') {
      setClaims(prev => prev.map(c => c.id === data.claim_no ? { ...c, status: data.status } : c));
    } else if (event === 'expense_deleted') {
      setClaims(prev => prev.filter(c => c.dbId !== data.id && c.id !== data.claim_no));
    }
  });

  // Quick listener to close inline status dropdown on clicking outside
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (activeStatusEditId && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveStatusEditId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeStatusEditId]);

  // Statistics computation
  const stats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalAmt = 0;

    claims.forEach(c => {
      if (c.status === "Pending") pending++;
      else if (c.status === "Approved") approved++;
      else if (c.status === "Rejected") rejected++;

      if (c.status === "Approved") {
        totalAmt += c.amount;
      }
    });

    return { pending, approved, rejected, totalAmt };
  }, [claims]);

  // Filter logic
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (activeFilters.id && !c.id.toLowerCase().includes(activeFilters.id.toLowerCase())) return false;
      if (activeFilters.employeeName && !c.employeeName.toLowerCase().includes(activeFilters.employeeName.toLowerCase())) return false;
      if (activeFilters.category && !c.category.toLowerCase().includes(activeFilters.category.toLowerCase())) return false;
      if (activeFilters.merchant && !c.merchant.toLowerCase().includes(activeFilters.merchant.toLowerCase())) return false;
      if (activeFilters.description && !c.description.toLowerCase().includes(activeFilters.description.toLowerCase())) return false;
      if (activeFilters.amount && !c.amount.toString().includes(activeFilters.amount)) return false;
      if (activeFilters.date && c.date !== activeFilters.date) return false;
      if (activeFilters.status && c.status !== activeFilters.status) return false;
      return true;
    });
  }, [claims, activeFilters]);

  // Pagination logic
  const paginatedClaims = useMemo(() => {
    if (pageSize === "All") return filteredClaims;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredClaims.slice(startIndex, startIndex + pageSize);
  }, [filteredClaims, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (pageSize === "All") return 1;
    return Math.ceil(filteredClaims.length / pageSize) || 1;
  }, [filteredClaims, pageSize]);

  // Reset page when filter or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, pageSize]);

  // Status updates
  const handleStatusUpdate = async (claimId: string, newStatus: "Pending" | "Approved" | "Rejected") => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim || !claim.dbId) return;

    if (claim.payrollStatus === 'reimbursed' || claim.payrollStatus === 'in_salary_payrun') {
      toast.error("This claim has already been processed in Payroll Reimbursements and cannot be modified.");
      setActiveStatusEditId(null);
      return;
    }

    try {
      await apiClient.put(`/expenses/${claim.dbId}/status`, { status: newStatus });
      toast.success(`Claim ${claimId} marked as ${newStatus}`);
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    } catch (err: any) {
      console.error('Failed to update status:', err);
      toast.error(err.message || 'Failed to update status');
    }
    setActiveStatusEditId(null);
  };

  // Claim deletion
  const handleDeleteClaim = async () => {
    if (!claimToDelete || !claimToDelete.dbId) return;

    if (claimToDelete.payrollStatus === 'reimbursed' || claimToDelete.payrollStatus === 'in_salary_payrun') {
      toast.error("This claim has already been processed in Payroll Reimbursements and cannot be deleted.");
      setClaimToDelete(null);
      return;
    }

    try {
      await apiClient.delete(`/expenses/${claimToDelete.dbId}`);
      toast.success(`Claim ${claimToDelete.id} deleted successfully`);
      setClaims(prev => prev.filter(c => c.id !== claimToDelete.id));
    } catch (err: any) {
      console.error('Failed to delete claim:', err);
      toast.error(err.message || 'Failed to delete claim');
    } finally {
      setClaimToDelete(null);
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = ["Claim No", "Employee Name", "Email", "Department", "Category", "Merchant/Vendor", "Description", "Amount (INR)", "Date", "Status"];
    const rows = filteredClaims.map(c => [
      c.id, c.employeeName, c.employeeEmail, c.department, c.category, c.merchant, `"${c.description.replace(/"/g, '""')}"`, c.amount, c.date, c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Expense_Claims_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    const cleared = {
      id: "",
      employeeName: "",
      category: "",
      merchant: "",
      description: "",
      amount: "",
      date: "",
      status: ""
    };
    setTempFilters(cleared);
    setActiveFilters(cleared);
  };

  return (
    <div className="flex flex-col w-full flex-1 h-[calc(100vh-80px)] min-h-0 p-4 md:p-5 space-y-4">
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* ─── STATUS CARDS ROW (Sticky on Mobile, normal flex on Desktop) ─── */}
      <div className="sticky top-0 z-20 md:relative bg-slate-50 md:bg-transparent pb-3 md:pb-0 border-b md:border-b-0 border-slate-100 flex-shrink-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pending Claim Card */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4 shadow-xs flex items-center justify-between transition hover:shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-widest block">Pending claims</span>
              <span className="text-xl md:text-xl font-extrabold text-slate-800 block">{stats.pending}</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
              <Clock size={18} className="animate-pulse" />
            </div>
          </div>

          {/* Approved Claim Card */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 shadow-xs flex items-center justify-between transition hover:shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-widest block">Approved claims</span>
              <span className="text-xl md:text-xl font-extrabold text-slate-800 block">{stats.approved}</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500">
              <CheckCircle size={18} />
            </div>
          </div>

          {/* Rejected Claim Card */}
          <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-4 shadow-xs flex items-center justify-between transition hover:shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-widest block">Rejected claims</span>
              <span className="text-xl md:text-xl font-extrabold text-slate-800 block">{stats.rejected}</span>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
              <XCircle size={18} />
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 shadow-xs flex items-center justify-between transition hover:shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#90a1b9] uppercase tracking-widest block">Approved Amount</span>
              <span className="text-xl md:text-xl font-extrabold text-slate-800 block">₹{stats.totalAmt.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTROL CARD & TABLE ─── */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs flex flex-col flex-1 h-full min-h-0 overflow-hidden">

        {/* Action Header & Buttons */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3.5 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Audit Reimbursement Claims ({filteredClaims.length})</h3>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Filter Toggle Drawer Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold rounded-xl bg-gray-100 hover:bg-slate-50 text-slate-600 border-slate-200 transition cursor-pointer"
              title="Open Side Filter Drawer"
            >
              <Filter size={13} />
              <span>Filter Columns</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0271d6] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Download size={13} />
              <span>Export Data</span>
            </button>

            {/* Clear Filters (Only visible if active filters exist) */}
            {Object.values(activeFilters).some(Boolean) && (
              <button
                onClick={handleClearFilters}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition cursor-pointer"
                title="Clear All Filters"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ─── DATA TABLE (Scrollable Container) ─── */}
        <div className="flex-1 overflow-y-auto overflow-x-auto md:overflow-x-hidden scrollbar-thin md:scrollbar-none">
          <table className="w-full text-left border-collapse min-w-[850px] md:min-w-0 table-auto md:table-fixed relative">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
              <tr>
                <th className="py-2.5 px-2.5 w-[110px]">Claim No.</th>
                <th className="py-2.5 px-2.5 w-[140px]">Employee Name</th>
                <th className="py-2.5 px-2.5 w-[110px]">Category</th>
                <th className="py-2.5 px-2.5 w-[120px]">Merchant/Vendor</th>
                <th className="py-2.5 px-2.5 w-[150px]">Description</th>
                <th className="py-2.5 px-2.5 w-[90px] text-right">Amount</th>
                <th className="py-2.5 px-2.5 w-[100px]">Date</th>
                <th className="py-2.5 px-2.5 w-[110px]">Status</th>
                <th className="py-2.5 px-2.5 w-[70px] text-center">Actions</th>
              </tr>

              {/* Column-wise Search Filters Input Row (Always visible as requested!) */}
              <tr className="bg-slate-50/40 border-b border-slate-100">
                {/* Claim No Filter */}
                <td className="p-1.5">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Claim..."
                      value={activeFilters.id}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full pl-6 pr-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    />
                  </div>
                </td>

                {/* Employee Name Filter */}
                <td className="p-1.5">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Name..."
                      value={activeFilters.employeeName}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, employeeName: e.target.value }))}
                      className="w-full pl-6 pr-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    />
                  </div>
                </td>

                {/* Category Filter */}
                <td className="p-1.5">
                  <select
                    value={activeFilters.category}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Utility & Cloud">Utility & Cloud</option>
                    <option value="Food & Lodging">Food & Lodging</option>
                    <option value="Other">Other</option>
                  </select>
                </td>

                {/* Merchant Filter */}
                <td className="p-1.5">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Merchant..."
                      value={activeFilters.merchant}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, merchant: e.target.value }))}
                      className="w-full pl-6 pr-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    />
                  </div>
                </td>

                {/* Description Filter */}
                <td className="p-1.5">
                  <div className="relative">
                    <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Desc..."
                      value={activeFilters.description}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full pl-6 pr-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    />
                  </div>
                </td>

                {/* Amount Filter */}
                <td className="p-1.5 text-right">
                  <input
                    type="number"
                    placeholder="Amount..."
                    value={activeFilters.amount}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium text-right outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                  />
                </td>

                {/* Date Filter */}
                <td className="p-1.5">
                  <input
                    type="date"
                    value={activeFilters.date}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 transition cursor-pointer"
                  />
                </td>

                {/* Status Filter */}
                <td className="p-1.5">
                  <select
                    value={activeFilters.status}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[9.5px] font-medium outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>

                {/* Spacer for actions column */}
                <td className="p-1.5"></td>
              </tr>
            </thead>

            {/* Table data compact size */}
            <tbody className="divide-y divide-slate-100 text-[10.5px] text-slate-600 font-semibold">
              {paginatedClaims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-xs font-medium">
                    No expense claims match the selected search criteria.
                  </td>
                </tr>
              ) : (
                paginatedClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Claim ID */}
                    <td className="py-1.5 px-3 font-bold text-[#0271d6]">{claim.id}</td>

                    {/* Employee */}
                    <td className="py-1.5 px-3">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">{claim.employeeName}</span>
                        <span className="text-[9.5px] text-slate-400 font-medium">{claim.employeeEmail}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px] border border-slate-200/50">
                        <Tag size={9} />
                        {claim.category}
                      </span>
                    </td>

                    {/* Merchant */}
                    <td className="py-1.5 px-3 text-slate-600 flex items-center gap-1.5">
                      <ShoppingBag size={10} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{claim.merchant}</span>
                    </td>

                    {/* Description */}
                    <td className="py-1.5 px-3 font-normal text-slate-500 truncate" title={claim.description}>
                      {claim.description}
                    </td>

                    {/* Amount */}
                    <td className="py-1.5 px-3 text-right text-slate-900 font-bold">
                      ₹{claim.amount.toLocaleString("en-IN")}.00
                    </td>

                    {/* Date */}
                    <td className="py-1.5 px-3 text-slate-500 font-medium">
                      {new Date(claim.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>

                    {/* Status with Inline Edit Click */}
                    <td className="py-1.5 px-3 relative group">
                      {claim.payrollStatus === 'reimbursed' || claim.payrollStatus === 'in_salary_payrun' ? (
                        <>
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-purple-50/90 text-purple-700 border-purple-200 cursor-not-allowed select-none shadow-xs transition-all group-hover:bg-purple-100 group-hover:border-purple-300"
                          >
                            <Lock size={10} className="text-purple-600 flex-shrink-0" />
                            <span>Locked</span>
                          </span>

                          {/* Industry-Level Animated Hover Card (Opens Below, White BG, Blue Text) */}
                          <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-64 bg-white text-blue-950 rounded-xl p-3 border border-blue-100 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 pointer-events-none">
                            {/* Top Pointer Arrow */}
                            <div className="absolute -top-1 left-4 w-2.5 h-2.5 bg-white border-t border-l border-blue-100 rotate-45" />

                            <div className="flex items-center gap-2 border-b border-blue-50 pb-2 mb-1.5 relative z-10">
                              <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
                                <Lock size={12} />
                              </div>
                              <span className="font-bold text-[10px] text-blue-600 uppercase tracking-wider">Payroll Protected</span>
                            </div>
                            <p className="text-[11px] text-blue-900 leading-relaxed font-semibold relative z-10">
                              This expense claim has already been processed in Payroll Reimbursements and cannot be modified.
                            </p>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStatusEditId(activeStatusEditId === claim.id ? null : claim.id);
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border transition cursor-pointer select-none ${claim.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70" :
                            claim.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/70" :
                              "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/70"
                            }`}
                          title="Click to change status"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{
                            backgroundColor: claim.status === "Approved" ? "#10b981" : claim.status === "Rejected" ? "#f43f5e" : "#f59e0b"
                          }} />
                          <span>{claim.status}</span>
                          <ChevronDown size={8} className="opacity-60" />
                        </button>
                      )}

                      {/* Inline Status Selection Popover */}
                      {activeStatusEditId === claim.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute left-3 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-30 min-w-[110px] animate-[fadeIn_0.1s_ease-out]"
                        >
                          <button
                            onClick={() => handleStatusUpdate(claim.id, "Pending")}
                            className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer transition w-full text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, "Approved")}
                            className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer transition w-full text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Approved
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(claim.id, "Rejected")}
                            className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition w-full text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-505" style={{ backgroundColor: "#f43f5e" }} />
                            Rejected
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-1.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                          title="View Claim Details"
                        >
                          <Eye size={13} />
                        </button>
                        {claim.payrollStatus === 'reimbursed' || claim.payrollStatus === 'in_salary_payrun' ? (
                          <button
                            disabled
                            className="p-1 text-slate-300 bg-slate-50 rounded-md cursor-not-allowed opacity-60"
                            title="This expense claim has already been processed in Payroll Reimbursements and cannot be deleted."
                          >
                            <Lock size={13} className="text-slate-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setClaimToDelete(claim)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            title="Delete Claim"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── STICKY FOOTER (Pagination & Page Size selection) ─── */}
        <div className="p-3 md:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white flex-shrink-0 mt-auto sticky bottom-0 z-10 md:relative">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value;
                setPageSize(val === "All" ? "All" : Number(val));
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none cursor-pointer focus:border-blue-400 font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value="All">All</option>
            </select>


          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition text-slate-600"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition text-slate-600"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODALS & OVERLAYS ─── */}
      <AnimatePresence>

        {/* A. Slide-in Right Filters Drawer (Spawns dynamically from right hand side) */}
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/35 backdrop-blur-[1.5px]"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative bg-white shadow-2xl w-80 h-full z-10 border-l border-slate-100 flex flex-col p-5 space-y-4 text-xs font-semibold text-slate-600"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Filter size={15} className="text-blue-600" />
                  <span className="font-extrabold text-slate-800 text-sm">Filter Claims</span>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-500 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Drawer Scrollable Filter Fields */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {/* Claim No. */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim No.</label>
                  <input
                    type="text"
                    placeholder="Search Claim ID..."
                    value={tempFilters.id}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Employee Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Name</label>
                  <input
                    type="text"
                    placeholder="Search Employee..."
                    value={tempFilters.employeeName}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, employeeName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select
                    value={tempFilters.category}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer text-[11px] font-medium"
                  >
                    <option value="">All Categories</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Utility & Cloud">Utility & Cloud</option>
                    <option value="Food & Lodging">Food & Lodging</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Merchant */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant/Vendor</label>
                  <input
                    type="text"
                    placeholder="Search Merchant..."
                    value={tempFilters.merchant}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, merchant: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <input
                    type="text"
                    placeholder="Search Description..."
                    value={tempFilters.description}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</label>
                  <input
                    type="number"
                    placeholder="Search Amount..."
                    value={tempFilters.amount}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                  <input
                    type="date"
                    value={tempFilters.date}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer text-[11px] font-medium"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                  <select
                    value={tempFilters.status}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer text-[11px] font-medium"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition cursor-pointer text-center"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setActiveFilters(tempFilters);
                    setIsFilterDrawerOpen(false);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* B. View Claim Details Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedClaim(null);
                setShowReceiptSlip(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] max-h-[78vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <FileText size={14} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Reimbursement
                    </span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Audit Details
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedClaim(null);
                    setShowReceiptSlip(false);
                  }}
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/40 p-4 text-[11px] text-slate-600 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Employee card */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                  <span className="block border-b border-slate-100 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Filer Employee
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[11px] font-bold text-blue-700">
                      {selectedClaim.employeeName.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {selectedClaim.employeeName}
                      </span>
                      <span className="block truncate text-[10px] text-slate-500">
                        {selectedClaim.employeeEmail}
                      </span>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-700">
                          ID: {selectedClaim.employeeId}
                        </span>
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-500">
                          {selectedClaim.department}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Claim Number
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-slate-800">
                      {selectedClaim.id}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Claim Date
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-slate-800">
                      {new Date(selectedClaim.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Expense Category
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-slate-800">
                      {selectedClaim.category}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Merchant / Vendor
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-slate-800">
                      {selectedClaim.merchant}
                    </span>
                  </div>
                </div>

                {/* Financial summary */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
                  <span className="block border-b border-slate-100 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Financial Summary
                  </span>

                  <div className="grid grid-cols-3 gap-2">

                    <div className="rounded-md bg-blue-50 px-2.5 py-2">
                      <span className="block text-[9px] font-medium text-blue-500">
                        Total Claimed
                      </span>
                      <span className="mt-0.5 block text-[12px] font-semibold text-blue-700">
                        ₹{selectedClaim.amount.toLocaleString("en-IN")}.00
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Audit Status
                    </span>

                    {selectedClaim.payrollStatus === 'reimbursed' || selectedClaim.payrollStatus === 'in_salary_payrun' ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-700 cursor-not-allowed"
                        title="This expense claim has already been processed in Payroll Reimbursements and cannot be modified"
                      >
                        <Lock size={10} className="text-purple-600" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${selectedClaim.status === "Approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : selectedClaim.status === "Rejected"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${selectedClaim.status === "Approved"
                            ? "bg-emerald-500"
                            : selectedClaim.status === "Rejected"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                            }`}
                        />
                        {selectedClaim.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1.5">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Purpose & Description
                  </span>
                  <p className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
                    {selectedClaim.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
                <button
                  onClick={() => setShowReceiptSlip(true)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  View Receipt Slip
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedClaim(null);
                      setShowReceiptSlip(false);
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  {selectedClaim.status === "Pending" && selectedClaim.payrollStatus !== 'reimbursed' && selectedClaim.payrollStatus !== 'in_salary_payrun' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedClaim.id, "Approved");
                        setSelectedClaim(null);
                      }}
                      className="rounded-lg bg-[#0270d6] px-3.5 py-2 text-[11px] font-medium text-white transition hover:bg-slate-800"
                    >
                      Approve Claim
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        )}

        {/* B2. Receipt Slip Modal (Nested popup layout z-60 above details popup) */}
        {showReceiptSlip && selectedClaim && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReceiptSlip(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10 border border-slate-100 flex flex-col p-5 space-y-4"
            >
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #receipt-print-section, #receipt-print-section * {
                    visibility: visible;
                  }
                  #receipt-print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    background: white !important;
                  }
                  #receipt-print-section img {
                    max-height: none !important;
                    width: 100% !important;
                  }
                }
              `}</style>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" />
                  Transaction Receipt Slip
                </span>
                <button
                  onClick={() => setShowReceiptSlip(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-500 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Receipt Ticket Box */}
              <div id="receipt-print-section" className="bg-slate-50 p-4 border border-dashed border-slate-300 rounded-lg text-slate-700 space-y-3 relative">
                {selectedClaim.receiptUrl ? (
                  <div>
                    <img
                      src={selectedClaim.receiptUrl.startsWith('http') ? selectedClaim.receiptUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedClaim.receiptUrl}`}
                      alt="Receipt"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-sm border border-slate-100"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 font-sans">
                    <Image size={48} className="mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-xs font-semibold">No receipt uploaded</p>
                    <p className="text-[9px]">Receipt image not available</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedClaim.receiptUrl) {
                      const printWindow = window.open("", "_blank");
                      if (printWindow) {
                        const fullReceiptUrl = selectedClaim.receiptUrl.startsWith('http') ? selectedClaim.receiptUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedClaim.receiptUrl}`;
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Print Receipt</title>
                              <style>
                                body {
                                  margin: 0;
                                  display: flex;
                                  justify-content: center;
                                  align-items: center;
                                  height: 100vh;
                                  background: white;
                                }
                                img {
                                  max-width: 100%;
                                  max-height: 100%;
                                  object-fit: contain;
                                }
                                @page {
                                  margin: 0;
                                }
                              </style>
                            </head>
                            <body>
                              <img src="${fullReceiptUrl}" onload="window.print(); window.close();" />
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      } else {
                        toast.error("Please allow popups to print the receipt.");
                      }
                    } else {
                      window.print();
                    }
                  }}
                  className="flex-1 py-2 bg-[#0270d6] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
                >
                  Print Slip
                </button>
                <button
                  onClick={() => setShowReceiptSlip(false)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition cursor-pointer text-center hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {claimToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClaimToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden z-10 border border-slate-100 p-5 flex flex-col gap-4 text-xs font-semibold text-slate-600"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <ShieldAlert size={20} className="animate-bounce" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-800 text-xs font-extrabold block">Confirm Delete Claim</span>
                  <span className="text-[10px] text-slate-400 font-medium">This action cannot be undone.</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-slate-600 font-normal leading-relaxed">
                  Are you sure you want to permanently delete expense claim <span className="font-bold text-rose-600">{claimToDelete.id}</span> submitted by <span className="font-bold text-slate-800">{claimToDelete.employeeName}</span>?
                </p>
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <div className="flex justify-between"><span>Amount:</span> <span className="font-bold text-slate-800">₹{claimToDelete.amount.toLocaleString("en-IN")}.00</span></div>
                  <div className="flex justify-between mt-0.5"><span>Category:</span> <span className="font-bold text-slate-800">{claimToDelete.category}</span></div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setClaimToDelete(null)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClaim}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

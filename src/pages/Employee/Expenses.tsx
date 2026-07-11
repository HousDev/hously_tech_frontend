import React, { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FileText, Eye, Calendar, ChevronDown, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, DollarSign, Filter, Plus, ArrowUpRight,
  Search, X, User, Tag, ShoppingBag, Edit3, ShieldAlert, AlertCircle,
  Upload, Image, File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, uploadFile } from "../../lib/api";
import { toast } from "react-hot-toast";
import { useExpenseSocket } from "../../hooks/useExpenseSocket";

// ─── TYPES & SCHEMAS ────────────────────────────────────────────────────────
interface ExpenseClaim {
  id: string; // Claim No.
  dbId?: number | string; // Database primary key
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
  receiptNo: string;
  taxAmount: number;
  receiptUrl?: string; // For uploaded receipt image
}

// ─── INITIAL MOCK DATA ──────────────────────────────────────────────────────
const initialClaims: ExpenseClaim[] = [
  { id: "CLM-2026-001", employeeId: "EMP-012", employeeName: "Suraj Kumar", employeeEmail: "suraj.kumar@hously.in", department: "HR", category: "Office Supplies", merchant: "Amazon Business", description: "Wireless mechanical keyboard & Ergonomic Mouse for office setup", amount: 4200, date: "2026-06-24", status: "Pending", receiptNo: "REC-88371-AMZ", taxAmount: 756 },
  { id: "CLM-2026-002", employeeId: "EMP-034", employeeName: "Anjali Sharma", employeeEmail: "anjali.sharma@hously.in", department: "Sales", category: "Travel & Fuel", merchant: "Ola Cabs", description: "Client site presentation taxi bills in Pune", amount: 1850, date: "2026-06-25", status: "Approved", receiptNo: "REC-93041-OLA", taxAmount: 92 },
  { id: "CLM-2026-003", employeeId: "EMP-012", employeeName: "Suraj Kumar", employeeEmail: "suraj.kumar@hously.in", department: "HR", category: "Utility & Cloud", merchant: "AWS India", description: "Monthly cloud hosting & data storage charges", amount: 8500, date: "2026-06-26", status: "Pending", receiptNo: "REC-11234-AWS", taxAmount: 1530 },
  { id: "CLM-2026-004", employeeId: "EMP-045", employeeName: "Priya Patel", employeeEmail: "priya.patel@hously.in", department: "Marketing", category: "Food & Lodging", merchant: "Taj Hotel", description: "Client dinner meeting at Taj Hotel", amount: 3200, date: "2026-06-27", status: "Rejected", receiptNo: "REC-55678-TAJ", taxAmount: 576 },
];

export default function EmployeeExpenses() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  // Setup header
  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("My Expense Claims");
      setHeaderSubtitle("Track and manage your reimbursement requests");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // States
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    id: "",
    category: "",
    merchant: "",
    description: "",
    amount: "",
    date: "",
    status: ""
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeStatusEditId, setActiveStatusEditId] = useState<string | null>(null);

  // Modal States
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [showReceiptSlip, setShowReceiptSlip] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "All">(10);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    category: "",
    merchant: "",
    description: "",
    amount: "",
    date: "",
    receiptNo: "",
    taxAmount: "",
    receiptFile: null as File | null,
    receiptPreview: null as string | null
  });

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
        receiptNo: c.receipt_no ?? "",
        taxAmount: Number(c.tax_amount ?? 0),
        receiptUrl: c.receipt_url
      }));
      setClaims(mapped);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Listen to Socket.io events
  useExpenseSocket((event, data) => {
    console.log(`[EmployeeExpenses Socket] Event received: ${event}`, data);
    if (event === 'expense_status_changed') {
      setClaims(prev => prev.map(c => c.id === data.claim_no ? { ...c, status: data.status } : c));
    } else if (event === 'expense_deleted') {
      setClaims(prev => prev.filter(c => c.dbId !== data.id && c.id !== data.claim_no));
    } else if (event === 'expense_new') {
      // Append if it doesn't exist
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
          receiptNo: data.receipt_no ?? "",
          taxAmount: Number(data.tax_amount ?? 0),
          receiptUrl: data.receipt_url
        };
        return [newClaim, ...prev];
      });
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

  // Status updates (only for employee's own claims)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStatusUpdate = (_claimId: string, _newStatus: "Pending" | "Approved" | "Rejected") => {
    // Disabled for employees - only Admins can change status
  };

  // Handle receipt file upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewExpense(prev => ({
          ...prev,
          receiptFile: file,
          receiptPreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new expense claim
  const handleCreateExpense = async () => {
    if (!newExpense.category || !newExpense.merchant || !newExpense.description || !newExpense.amount || !newExpense.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let receiptUrl = "";
      if (newExpense.receiptFile) {
        toast.loading("Uploading receipt...", { id: "receipt-upload" });
        const uploadRes = await uploadFile<{ url: string }>('/upload/receipt', newExpense.receiptFile, 'receipt');
        receiptUrl = uploadRes.url;
        toast.success("Receipt uploaded successfully!", { id: "receipt-upload" });
      }

      await apiClient.post('/expenses', {
        category: newExpense.category,
        merchant: newExpense.merchant,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        receipt_url: receiptUrl
      });

      toast.success("Expense claim submitted successfully!");
      fetchExpenses();

      setIsCreateModalOpen(false);
      setNewExpense({
        category: "",
        merchant: "",
        description: "",
        amount: "",
        date: "",
        receiptNo: "",
        taxAmount: "",
        receiptFile: null,
        receiptPreview: null
      });
    } catch (error: any) {
      console.error("Failed to submit expense:", error);
      toast.error(error.message || "Failed to submit expense claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({
      id: "",
      category: "",
      merchant: "",
      description: "",
      amount: "",
      date: "",
      status: ""
    });
  };



  return (
    // Sticky on desktop with full container height
    <div className="flex flex-col w-full md:h-full md:overflow-hidden p-4 md:p-0 space-y-5">
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .receipt-preview {
          max-height: 200px;
          object-fit: contain;
        }
      `}} />

      {/* ─── STATUS CARDS ROW (Sticky on Desktop) ─── */}
      <div className="sticky top-0 z-20 bg-slate-50 md:bg-transparent pb-3 md:pb-3 border-b md:border-b-0 border-slate-100 flex-shrink-0">
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

      {/* ─── MAIN CONTROL CARD & TABLE (Reduced height by 15%) ─── */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs flex flex-col flex-1 overflow-hidden min-h-[300px] max-h-[70vh]">

        {/* Action Header & Buttons */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3.5 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">My Claims ({filteredClaims.length})</h3>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Create Expense Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0271d6] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Expense</span>
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

        {/* ─── DATA TABLE ─── */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[900px] table-fixed relative">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
              <tr>
                <th className="py-2.5 px-3 w-32">Claim No.</th>
                <th className="py-2.5 px-3 w-40">Category</th>
                <th className="py-2.5 px-3 w-44">Merchant/Vendor</th>
                <th className="py-2.5 px-3 w-52">Description</th>
                <th className="py-2.5 px-3 w-32 text-right">Amount</th>
                <th className="py-2.5 px-3 w-36">Date</th>
                <th className="py-2.5 px-3 w-36">Status</th>
                <th className="py-2.5 px-3 w-24 text-center">Actions</th>
              </tr>

              {/* Column-wise Search Filters Input Row */}
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

            {/* Table data */}
            <tbody className="divide-y divide-slate-100 text-[10.5px] text-slate-600 font-semibold">
              {paginatedClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs font-medium">
                    No expense claims match the selected search criteria.
                  </td>
                </tr>
              ) : (
                paginatedClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Claim ID */}
                    <td className="py-1.5 px-3 font-bold text-[#0271d6]">{claim.id}</td>

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
                    <td className="py-1.5 px-3 relative">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border transition select-none ${claim.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          claim.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{
                          backgroundColor: claim.status === "Approved" ? "#10b981" : claim.status === "Rejected" ? "#f43f5e" : "#f59e0b"
                        }} />
                        <span>{claim.status}</span>
                      </span>

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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── STICKY FOOTER (Pagination) ─── */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white flex-shrink-0">
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

        {/* A. Create Expense Modal with Receipt Upload */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Plus size={14} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Submit Request
                    </span>
                    <span className="block text-sm font-semibold text-slate-800">
                      New Expense Claim
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expense Category *</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  >
                    <option value="">Select Category</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Utility & Cloud">Utility & Cloud</option>
                    <option value="Food & Lodging">Food & Lodging</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Merchant */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant / Vendor *</label>
                  <input
                    type="text"
                    placeholder="Enter merchant name..."
                    value={newExpense.merchant}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, merchant: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description *</label>
                  <textarea
                    placeholder="Describe the expense purpose..."
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium resize-none"
                  />
                </div>

                {/* Amount & Date Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount (₹) *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date *</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-[11px] font-medium cursor-pointer"
                    />
                  </div>
                </div>

                {/* Receipt Upload Section */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Receipt</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-blue-400 transition bg-slate-50/50">
                      {newExpense.receiptPreview ? (
                        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 max-w-sm mx-auto shadow-xs">
                          <img
                            src={newExpense.receiptPreview}
                            alt="Receipt Preview"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1 text-left">
                            <span className="block truncate text-[11px] font-semibold text-slate-800">{newExpense.receiptFile?.name}</span>
                            <span className="block text-[9px] text-slate-400">{(newExpense.receiptFile?.size ? (newExpense.receiptFile.size / 1024).toFixed(1) : 0)} KB</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewExpense(prev => ({ ...prev, receiptFile: null, receiptPreview: null }));
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-center">
                            <Upload size={24} className="text-slate-400" />
                          </div>
                          <div className="text-xs text-slate-500">
                            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                          </div>
                          <div className="text-[9px] text-slate-400">
                            PNG, JPG, PDF (Max 5MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-4 py-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExpense}
                  className="px-4 py-2 bg-[#0271d6] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Submit Claim
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
                      Claim Details
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

                  <div className="grid grid-cols-1 gap-2">
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

                <button
                  onClick={() => {
                    setSelectedClaim(null);
                    setShowReceiptSlip(false);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>

          </div>
        )}

        {/* B2. Receipt Slip Modal with Uploaded Receipt */}
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
                  Transaction Receipt
                </span>
                <button
                  onClick={() => setShowReceiptSlip(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-500 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Receipt Display */}
              <div id="receipt-print-section" className="bg-slate-50 p-4 border border-dashed border-slate-300 rounded-lg text-slate-700 space-y-3 relative">
                {/* Receipt Image */}
                {selectedClaim.receiptUrl ? (
                  <div>
                    <img
                      src={selectedClaim.receiptUrl.startsWith('http') ? selectedClaim.receiptUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedClaim.receiptUrl}`}
                      alt="Receipt"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-sm border border-slate-100"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Image size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-medium">No receipt uploaded</p>
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
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceiptSlip(false)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
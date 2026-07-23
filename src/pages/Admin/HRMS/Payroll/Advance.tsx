import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  Filter,
  Search,
  X,
  ChevronDown,
  Eye,
  Trash2,
  Calendar,
  User,
  Hash,
  FileText,
  Wallet,
  AlertCircle,
  Building,
  Plus,
  Save,
  CheckSquare,
  Square,
  Pencil,
  AlertTriangle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../lib/api";
import { useAdvanceSocket } from "../../../../hooks/useAdvanceSocket";

// --- Custom Component: Stat Card ---
const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const bgLightMap: any = {
    "bg-amber-500": "bg-amber-50 text-amber-700 border-amber-100",
    "bg-blue-500": "bg-blue-50 text-blue-600 border-blue-100",
    "bg-emerald-500": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-purple-500": "bg-purple-50 text-purple-600 border-purple-100",
  };
  const theme = bgLightMap[color] || "bg-slate-50 text-slate-655 border-slate-100";
  const [bgClass, textClass, borderClass] = theme.split(" ");

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-3.5 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group flex-1">
      <div className={`p-2.5 rounded-lg border ${bgClass} ${borderClass} group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 ${textClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-base font-bold text-gray-800 mt-0.5">{value}</h3>
      </div>
    </div>
  );
};

// --- User Avatar Component ---
const UserAvatar = ({ name, avatarUrl, size = "w-8 h-8", textSize = "text-[10px]" }: { name: string; avatarUrl?: string; size?: string; textSize?: string }) => {
  const [imageError, setImageError] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fullAvatarUrl = getFullUrl(avatarUrl || '');
  const initials = (name || 'Employee').trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (fullAvatarUrl && !imageError) {
    return (
      <img
        src={fullAvatarUrl}
        alt={name}
        onError={() => setImageError(true)}
        className={`${size} rounded-full object-cover border border-gray-200 shadow-xs flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-[#155dfc] flex items-center justify-center text-white ${textSize} font-bold border border-gray-200 shadow-xs flex-shrink-0`}>
      {initials}
    </div>
  );
};

// --- Interactive Status Dropdown Cell ---
const StatusDropdownCell = ({ item, onUpdateStatus }: { item: any; onUpdateStatus: (id: string, status: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { key: "Pending", label: "Pending", style: "bg-amber-50 border-amber-100 text-amber-700" },
    { key: "Approved", label: "Approved", style: "bg-blue-50 border-blue-100 text-blue-700" },
    { key: "Disbursed", label: "Disbursed", style: "bg-emerald-50 border-emerald-100 text-emerald-700" },
    { key: "Recovering", label: "Recovering", style: "bg-blue-50 border-blue-100 text-blue-700" },
    { key: "Recoverd", label: "Recoverd", style: "bg-emerald-50 border-emerald-100 text-emerald-700" },
    { key: "Rejected", label: "Rejected", style: "bg-rose-50 border-rose-100 text-rose-700" }
  ];

  const currentOpt = options.find(o => o.key === item.status) || options[0];

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border cursor-pointer hover:opacity-85 transition-opacity select-none ${currentOpt.style}`}
      >
        <span>{item.status}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-150 py-1 z-50 text-left">
          <div className="px-2 py-0.5 border-b border-gray-100 text-[8px] font-bold uppercase text-gray-400 tracking-wider">
            Status
          </div>
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                if (item.status !== opt.key) {
                  onUpdateStatus(item.id, opt.key);
                }
                setIsOpen(false);
              }}
              className={`w-full text-left px-2 py-1 text-[10px] font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${item.status === opt.key ? "text-blue-600 bg-blue-50/40" : "text-gray-655"
                }`}
            >
              <span>{opt.label}</span>
              {item.status === opt.key && <span className="w-1 h-1 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Salary Advance & Repayment Request Dashboard ---
export default function Advance() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Salary Advance & Loans");
      setHeaderSubtitle("Manage interest-free salary advances, deduction tenures, and repayment schedules");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Database advances list
  const [advancesList, setAdvancesList] = useState<any[]>([]);
  const [availableEmployeesDb, setAvailableEmployeesDb] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection states
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Column-wise search filters
  const [columnFilters, setColumnFilters] = useState({
    employee: "",
    amount: "",
    reason: "",
    installments: "",
    monthlyEMI: "",
    requestDate: "",
    disbursementDate: "",
    balance: "",
    status: "all",
  });

  // Advanced filters drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    employeeName: "",
    employeeCode: "",
    amountMin: "",
    amountMax: "",
    requestDateFrom: "",
    requestDateTo: "",
    installments: "all",
    department: "all",
    status: "all",
    balanceMin: "",
    balanceMax: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | string>(10);

  // Modals visibility toggles
  const [showRecordAdvance, setShowRecordAdvance] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<any | null>(null);

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { }
  });

  // Searchable employee selection states (Record Modal)
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  // Record Advance form fields
  const [assignEmpName, setAssignEmpName] = useState("");
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignDesignation, setAssignDesignation] = useState("");
  const [assignAmount, setAssignAmount] = useState("");
  const [assignTenure, setAssignTenure] = useState(12);
  const [assignReason, setAssignReason] = useState("");
  const [assignRequestDate, setAssignRequestDate] = useState("2026-07-13");

  // Review status modal state
  const [reviewStatus, setReviewStatus] = useState("Approved");

  const formatCurrency = (val: number) => {
    return "₹" + val.toLocaleString('en-IN');
  };

  const mapStatusToFrontend = (status: string, _amount: number, paidAmount: number) => {
    if (!status) return "Pending";
    const s = status.toLowerCase();
    if (s === "pending") return "Pending";
    if (s === "approved") return "Approved";
    if (s === "disbursed") {
      return paidAmount > 0 ? "Recovering" : "Disbursed";
    }
    if (s === "rejected") return "Rejected";
    if (s === "completed") return "Recoverd";
    return status;
  };

  const mapAdvanceFromBackend = (item: any) => {
    const requestDate = item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : "TBD";
    const nameParts = [item.first_name, item.middle_name, item.last_name].filter(Boolean);
    const employeeName = nameParts.join(' ') || item.email || "Employee";
    const amt = Number(item.amount);
    const paidAmt = Number(item.paid_amount || 0);
    const status = mapStatusToFrontend(item.status, amt, paidAmt);

    let disbursementDate = "-";
    if (status === "Disbursed" || status === "Recovering" || status === "Recoverd") {
      disbursementDate = item.disbursed_at ? new Date(item.disbursed_at).toISOString().split('T')[0] : "-";
    }

    let balance: number | string = "N/A";
    if (status === "Disbursed") {
      balance = amt;
    } else if (status === "Recovering") {
      balance = Math.max(0, amt - paidAmt);
    } else if (status === "Recoverd") {
      balance = 0;
    }

    return {
      id: String(item.id),
      employeeName,
      empId: item.employee_id || `EMP-${item.user_id}`,
      designation: item.designation || item.role || "MTS",
      amount: amt,
      balance: balance,
      monthlyEMI: Number(item.monthly_emi || 0),
      installments: Number(item.total_tenor_months),
      reason: item.reason || "Personal Advance",
      requestDate,
      disbursementDate,
      status,
      department: item.department || "Operations",
      avatarUrl: item.avatar_url || ''
    };
  };

  const fetchAdvances = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payroll/advances");
      if (res.data && res.data.success) {
        const mapped = (res.data.data || []).map(mapAdvanceFromBackend);
        setAdvancesList(mapped);
      }
    } catch (err) {
      console.error("Error fetching advances:", err);
      toast.error("Failed to load advances");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/payroll/employees");
      if (res.data && res.data.success) {
        setAvailableEmployeesDb(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchAdvances();
    fetchEmployees();
  }, []);

  useAdvanceSocket((event, data) => {
    console.log(`[AdminAdvanceSocket] Event: ${event}`, data);
    if (event === 'advance_new') {
      toast.success(`New Advance Request from ${data.employeeName || 'Employee'}: ${formatCurrency(data.amount)}`, {
        icon: '📨',
        duration: 5000
      });
      fetchAdvances();
    } else if (event === 'advance_status_changed' || event === 'advance_deleted') {
      fetchAdvances();
    }
  });

  const handleClearFilters = () => {
    setColumnFilters({
      employee: "",
      amount: "",
      reason: "",
      installments: "",
      monthlyEMI: "",
      requestDate: "",
      disbursementDate: "",
      balance: "",
      status: "all",
    });
    setFilters({
      employeeName: "",
      employeeCode: "",
      amountMin: "",
      amountMax: "",
      requestDateFrom: "",
      requestDateTo: "",
      installments: "all",
      department: "all",
      status: "all",
      balanceMin: "",
      balanceMax: "",
    });
    toast.success("Filters cleared");
  };

  const handleDeleteAdvance = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this salary advance request? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await api.delete(`/payroll/advances/${id}`);
          if (res.data && res.data.success) {
            toast.success("Advance request deleted");
            fetchAdvances();
            setSelectedRows(prev => prev.filter(r => r !== id));
            setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete request");
        }
      }
    });
  };

  const handleDeleteSelected = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected advance requests? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await api.delete(`/payroll/advances/${selectedRows.join(',')}`);
          if (res.data && res.data.success) {
            toast.success("Selected requests deleted");
            fetchAdvances();
            setSelectedRows([]);
            setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete selected requests");
        }
      }
    });
  };

  const handleCreateRequest = async () => {
    if (!assignEmpName.trim()) {
      toast.error("Please select an employee");
      return;
    }
    const amt = parseFloat(assignAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid requested amount");
      return;
    }

    try {
      const res = await api.post('/payroll/advances', {
        userId: assignUserId,
        amount: amt,
        totalTenorMonths: Number(assignTenure),
        reason: assignReason || "Personal Advance Request",
        status: "Pending"
      });
      if (res.data && res.data.success) {
        toast.success("Salary advance request logged successfully!");
        fetchAdvances();
        setAssignEmpName("");
        setAssignEmpId("");
        setAssignUserId("");
        setAssignDesignation("");
        setAssignAmount("");
        setAssignReason("");
        setShowRecordAdvance(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create advance request");
    }
  };

  const handleUpdateStatus = async () => {
    if (!showReviewModal) return;
    try {
      let finalStatus = reviewStatus.toLowerCase();
      if (finalStatus === 'recoverd') finalStatus = 'completed';

      const res = await api.patch(`/payroll/advances/${showReviewModal.id}/status`, { status: finalStatus });
      if (res.data && res.data.success) {
        toast.success("Request status successfully updated!");
        fetchAdvances();
        setShowReviewModal(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleUpdateStatusFromCell = async (id: string, newStatus: string) => {
    try {
      let finalStatus = newStatus.toLowerCase();
      if (finalStatus === 'recoverd') finalStatus = 'completed';
      if (finalStatus === 'recovering') finalStatus = 'disbursed';

      const res = await api.patch(`/payroll/advances/${id}/status`, { status: finalStatus });
      if (res.data && res.data.success) {
        toast.success("Request status successfully updated!");
        fetchAdvances();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Filtered requests list combining both column search and drawer variables
  const filteredRequests = advancesList.filter(item => {
    // 1. Column Search filters
    if (columnFilters.employee && !item.employeeName.toLowerCase().includes(columnFilters.employee.toLowerCase()) && !item.empId.toLowerCase().includes(columnFilters.employee.toLowerCase())) {
      return false;
    }
    if (columnFilters.amount && !String(item.amount).includes(columnFilters.amount)) {
      return false;
    }
    if (columnFilters.reason && !item.reason.toLowerCase().includes(columnFilters.reason.toLowerCase())) {
      return false;
    }
    if (columnFilters.installments && !String(item.installments).includes(columnFilters.installments)) {
      return false;
    }
    if (columnFilters.monthlyEMI && !String(item.monthlyEMI).includes(columnFilters.monthlyEMI)) {
      return false;
    }
    if (columnFilters.requestDate && item.requestDate !== columnFilters.requestDate) {
      return false;
    }
    if (columnFilters.disbursementDate && item.disbursementDate !== columnFilters.disbursementDate) {
      return false;
    }
    if (columnFilters.balance && !String(item.balance).includes(columnFilters.balance)) {
      return false;
    }
    if (columnFilters.status !== "all" && columnFilters.status !== "" && item.status !== columnFilters.status) {
      return false;
    }

    // 2. Advanced Drawer filters
    if (filters.employeeName && !item.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())) {
      return false;
    }
    if (filters.employeeCode && !item.empId.toLowerCase().includes(filters.employeeCode.toLowerCase())) {
      return false;
    }
    if (filters.amountMin && item.amount < parseInt(filters.amountMin)) {
      return false;
    }
    if (filters.amountMax && item.amount > parseInt(filters.amountMax)) {
      return false;
    }
    if (filters.requestDateFrom && item.requestDate < filters.requestDateFrom) {
      return false;
    }
    if (filters.requestDateTo && item.requestDate > filters.requestDateTo) {
      return false;
    }
    if (filters.installments !== "all" && item.installments !== parseInt(filters.installments)) {
      return false;
    }
    if (filters.department !== "all" && item.department !== filters.department) {
      return false;
    }
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters.balanceMin && item.balance < parseInt(filters.balanceMin)) {
      return false;
    }
    if (filters.balanceMax && item.balance > parseInt(filters.balanceMax)) {
      return false;
    }

    return true;
  });

  // Pagination bounds
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredRequests.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredRequests.length / numPageSize);
  const paginatedRequests = isPageSizeAll ? filteredRequests : filteredRequests.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  // Capped searchable employee results (limit 5)
  const filteredAvailableEmployees = availableEmployeesDb.filter(emp => {
    if (employeeSearchQuery.trim() === "") return true;
    const q = employeeSearchQuery.toLowerCase();
    return (
      (emp.name && emp.name.toLowerCase().includes(q)) ||
      (emp.empId && emp.empId.toLowerCase().includes(q)) ||
      (emp.email && emp.email.toLowerCase().includes(q)) ||
      String(emp.id).includes(q)
    );
  }).slice(0, 5);

  return (
    <div className="p-6 w-full space-y-6 bg-gray-50/50 lg:h-[calc(100vh-40px)] lg:overflow-hidden flex flex-col min-h-screen lg:min-h-0 text-gray-655 font-medium">
      <Toaster position="top-right" />

      {/* Animation keyframes */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-animate-scale {
          animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-backdrop {
          animation: fadeIn 0.18s ease-out forwards;
        }
      `}</style>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard icon={Clock} label="Pending Reviews" value={advancesList.filter(a => a.status === "Pending").length} color="bg-amber-500" />
        <StatCard icon={CheckCircle2} label="Approved Requests" value={advancesList.filter(a => a.status === "Approved").length} color="bg-blue-500" />
        <StatCard icon={IndianRupee} label="Active Recoveries" value={advancesList.filter(a => a.status === "Disbursed").length} color="bg-emerald-500" />
        <StatCard icon={TrendingUp} label="Total Outstanding" value={formatCurrency(advancesList.reduce((sum, a) => sum + (a.status === "Disbursed" ? a.balance : 0), 0))} color="bg-purple-500" />
      </div>

      {/* Main Single Column Table Layout */}
      <div className="w-full flex-1 lg:overflow-hidden flex flex-col min-h-0">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Action Header */}
          <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Salary Advance Repayment Ledger</span>
            </div>

            {/* Operations buttons wrapper */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">

              {/* Delete Selected Button */}
              {selectedRows.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all border border-rose-100 cursor-pointer animate-pulse"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedRows.length})</span>
                </button>
              )}

              {/* Advanced Side Filter Toggle Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="bg-white border border-gray-205 hover:bg-slate-50 text-gray-655 text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Filters</span>
              </button>

              {/* Record Advance Request button styled as blue button */}
              <button
                onClick={() => setShowRecordAdvance(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Advance</span>
              </button>
            </div>
          </div>

          {/* DATA TABLE (Scrollable, fills remaining space) */}
          <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
            <table className="w-full border-collapse text-left text-xs">

              {/* STICKY COLUMN-WISE SEARCH HEADER */}
              <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                  <th className="p-3 pl-6 w-10">
                    <button
                      onClick={() => {
                        if (selectedRows.length === paginatedRequests.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(paginatedRequests.map(r => r.id));
                        }
                      }}
                      className="hover:text-gray-700 transition-colors"
                    >
                      {selectedRows.length === paginatedRequests.length && paginatedRequests.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </th>

                  {/* 1. Employee Column Search */}
                  <th className="p-3 min-w-[155px]">
                    <div className="space-y-1">
                      <div>Employee</div>
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={columnFilters.employee}
                        onChange={(e) => setColumnFilters({ ...columnFilters, employee: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 2. Amount Column Search */}
                  <th className="p-3 min-w-[110px]">
                    <div className="space-y-1">
                      <div>Amount</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={columnFilters.amount}
                        onChange={(e) => setColumnFilters({ ...columnFilters, amount: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 3. Reason Column Search */}
                  <th className="p-3 min-w-[130px]">
                    <div className="space-y-1">
                      <div>Reason</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={columnFilters.reason}
                        onChange={(e) => setColumnFilters({ ...columnFilters, reason: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 4. Installments Column Search */}
                  <th className="p-3 min-w-[100px]">
                    <div className="space-y-1">
                      <div>Installments</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={columnFilters.installments}
                        onChange={(e) => setColumnFilters({ ...columnFilters, installments: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 4b. Monthly EMI Column Search */}
                  <th className="p-3 min-w-[110px]">
                    <div className="space-y-1">
                      <div>Monthly EMI</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={columnFilters.monthlyEMI}
                        onChange={(e) => setColumnFilters({ ...columnFilters, monthlyEMI: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 5. Request Date Column Search */}
                  <th className="p-3 min-w-[115px]">
                    <div className="space-y-1">
                      <div>Request Date</div>
                      <input
                        type="date"
                        value={columnFilters.requestDate}
                        onChange={(e) => setColumnFilters({ ...columnFilters, requestDate: e.target.value })}
                        className="w-full px-2 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      />
                    </div>
                  </th>

                  {/* 6. Disbursement Date Column Search */}
                  <th className="p-3 min-w-[115px]">
                    <div className="space-y-1">
                      <div>Disbursement Date</div>
                      <input
                        type="date"
                        value={columnFilters.disbursementDate}
                        onChange={(e) => setColumnFilters({ ...columnFilters, disbursementDate: e.target.value })}
                        className="w-full px-2 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      />
                    </div>
                  </th>

                  {/* 7. Balance Column Search */}
                  <th className="p-3 min-w-[105px]">
                    <div className="space-y-1">
                      <div>Balance</div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={columnFilters.balance}
                        onChange={(e) => setColumnFilters({ ...columnFilters, balance: e.target.value })}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* 8. Status Column filter dropdown */}
                  <th className="p-3 min-w-[115px]">
                    <div className="space-y-1">
                      <div>Status</div>
                      <select
                        value={columnFilters.status}
                        onChange={(e) => setColumnFilters({ ...columnFilters, status: e.target.value })}
                        className="w-full px-1.5 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="all">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Disbursed">Disbursed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Recovering">Recovering</option>
                        <option value="Recoverd">Recoverd</option>
                      </select>
                    </div>
                  </th>

                  {/* 9. Actions Reset controls */}
                  <th className="p-3 pr-6 text-right">
                    <div className="space-y-1">
                      <div>Actions</div>
                      <div className="h-[21px]" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                {paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/45 transition-colors group">
                    <td className="p-4 pl-6">
                      <button
                        onClick={() => {
                          setSelectedRows(prev => prev.includes(req.id) ? prev.filter(r => r !== req.id) : [...prev, req.id]);
                        }}
                        className="hover:text-gray-700 transition-colors"
                      >
                        {selectedRows.includes(req.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <UserAvatar name={req.employeeName} avatarUrl={req.avatarUrl} />
                        <div className="whitespace-nowrap">
                          <p className="font-bold text-gray-855 text-xs whitespace-nowrap">{req.employeeName}</p>
                          <p className="text-[9px] text-gray-400 font-semibold whitespace-nowrap">{req.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-805 font-bold">{formatCurrency(req.amount)}</td>
                    <td className="p-4 text-gray-500 font-normal">{req.reason}</td>
                    <td className="p-4 text-slate-700 font-bold">{req.installments}</td>
                    <td className="p-4 text-slate-700 font-bold">{formatCurrency(req.monthlyEMI)}</td>
                    <td className="p-4 text-gray-455 font-normal">{req.requestDate}</td>
                    <td className="p-4 text-gray-455 font-normal">{req.disbursementDate}</td>
                    <td className="p-4 text-slate-700 font-bold">
                      {typeof req.balance === 'number' ? formatCurrency(req.balance) : req.balance}
                    </td>
                    <td className="p-4">
                      <StatusDropdownCell item={req} onUpdateStatus={handleUpdateStatusFromCell} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        {/* Action 1: View repayment schedule */}
                        <button
                          onClick={() => setShowScheduleModal(req)}
                          className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 transition-all shadow-xs cursor-pointer"
                          title="View EMI Repayment Schedule"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Action 3: Delete request */}
                        <button
                          onClick={() => handleDeleteAdvance(req.id)}
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-gray-100 transition-all shadow-xs cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-12 text-center text-gray-405 font-bold italic bg-white">
                      No matching advance requests logged.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE PAGINATION FOOTER */}
          <div className="border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-xs font-semibold">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value === "All" ? "All" : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-655 cursor-pointer shadow-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
              <span className="text-xs font-semibold">
                Showing {filteredRequests.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredRequests.length)}` : 0} of {filteredRequests.length} requests
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isPageSizeAll}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-655 border border-gray-200 hover:bg-slate-55"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0 || isPageSizeAll}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDE ADVANCED FILTER DRAWER --- */}
      <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isFilterDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsFilterDrawerOpen(false)} />
        <div className={`relative w-80 bg-white h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between z-10 transition-transform duration-300 ease-out transform ${isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="flex justify-between items-center pb-4 border-b border-gray-150">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">Advanced Filters</span>
            </div>
            <button onClick={() => setIsFilterDrawerOpen(false)} className="text-gray-400 hover:text-gray-650 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer scrollable content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
            {/* Employee Name/ID */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Employee Name</label>
              <input
                type="text"
                placeholder="Search name..."
                value={filters.employeeName}
                onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Employee ID Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Employee ID Code</label>
              <input
                type="text"
                placeholder="Search ID e.g. EMP001..."
                value={filters.employeeCode}
                onChange={(e) => setFilters({ ...filters, employeeCode: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
              </select>
            </div>

            {/* Tenure select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Installment Tenure</label>
              <select
                value={filters.installments}
                onChange={(e) => setFilters({ ...filters, installments: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Tenures</option>
                <option value="1">1 Months</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
                <option value="8">8 Months</option>
                <option value="10">10 Months</option>
                <option value="12">12 Months</option>

              </select>
            </div>

            {/* Min / Max Amount Range */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Amount Range (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                  className="w-1/2 bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                  className="w-1/2 bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Request Dates Range */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Request Date Range</label>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={filters.requestDateFrom}
                  onChange={(e) => setFilters({ ...filters, requestDateFrom: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs cursor-pointer focus:outline-none"
                />
                <input
                  type="date"
                  value={filters.requestDateTo}
                  onChange={(e) => setFilters({ ...filters, requestDateTo: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs cursor-pointer focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-gray-200 pt-4 flex gap-2.5 bg-white">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: Record Advance Request --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showRecordAdvance ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-visible flex flex-col transition-all duration-300 transform ${showRecordAdvance ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>

          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Record Advance Request</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Configure interest-free loan deductions parameters</p>
              </div>
            </div>
            <button onClick={() => { setShowRecordAdvance(false); setShowEmployeeDropdown(false); }} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 flex-1 text-xs overflow-visible">

            {/* Custom Searchable Employee Selector Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Select Employee <span className="text-red-500">*</span></label>
              <div
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold flex justify-between items-center cursor-pointer hover:bg-slate-100/50"
              >
                <span className={assignEmpName ? "text-gray-800" : "text-gray-400"}>
                  {assignEmpName ? `${assignEmpName} (${assignEmpId})` : "Choose an employee..."}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {showEmployeeDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmployeeDropdown(false)} />
                  <div className="absolute top-[60px] left-0 right-0 bg-white border border-gray-250 rounded-xl shadow-xl z-50 p-2 space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by ID, name, email..."
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:border-blue-500 bg-slate-50 font-semibold"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[180px] overflow-y-auto divide-y divide-gray-100">
                      {filteredAvailableEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setAssignEmpName(emp.name);
                            setAssignEmpId(emp.empId);
                            setAssignUserId(emp.id);
                            setAssignDesignation(emp.designation || 'Employee');
                            setShowEmployeeDropdown(false);
                            setEmployeeSearchQuery("");
                          }}
                          className="p-2 hover:bg-slate-55 cursor-pointer text-[11px] flex justify-between items-center transition-colors font-medium"
                        >
                          <div>
                            <p className="font-bold text-gray-850">{emp.name}</p>
                            <p className="text-[9px] text-gray-400 font-semibold">{emp.id} • {emp.email}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 italic font-bold">{emp.designation}</span>
                        </div>
                      ))}
                      {filteredAvailableEmployees.length === 0 && (
                        <p className="p-3 text-center text-gray-450 italic text-[11px]">No matching employees found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Amount and Tenure inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Requested Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={assignAmount}
                  onChange={(e) => setAssignAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Tenure (Months) *</label>
                <select
                  value={assignTenure}
                  onChange={(e) => setAssignTenure(Number(e.target.value))}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                >

                  <option value={1}>1 Months</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={4}>4 Months</option>
                  <option value={5}>5 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={7}>7 Months</option>
                  <option value={8}>8 Months</option>
                  <option value={9}>9 Months</option>
                  <option value={10}>10 Months</option>
                  <option value={11}>11 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Request Date *</label>
              <input
                type="date"
                value={assignRequestDate}
                onChange={(e) => setAssignRequestDate(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Reason for Advance</label>
              <textarea
                placeholder="Explain justification for advance (e.g. medical costs, rent advance...)"
                value={assignReason}
                onChange={(e) => setAssignReason(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Dynamic EMI Calculator box */}
            {assignAmount && !isNaN(parseFloat(assignAmount)) && parseFloat(assignAmount) > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">Estimated EMI Recoup</p>
                  <p className="text-[9px] text-blue-500 font-semibold mt-0.5">Deducted from monthly payroll payout</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-800">{formatCurrency(Math.round(parseFloat(assignAmount) / assignTenure))}/mo</p>
                  <p className="text-[9px] text-blue-600 font-bold mt-0.5">For {assignTenure} Months</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <button
              onClick={() => { setShowRecordAdvance(false); setShowEmployeeDropdown(false); }}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRequest}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Request Advance</span>
            </button>
          </div>
        </div>
      </div>
      {/* --- MODAL 2: EMI Repayment Ledger Schedule --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showScheduleModal ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300 transform ${showScheduleModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showScheduleModal && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold border border-blue-200">
                    {showScheduleModal.employeeName?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-855">{showScheduleModal.employeeName}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Repayment Installment Ledger Schedule</p>
                  </div>
                </div>
                <button onClick={() => setShowScheduleModal(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2 border border-gray-100 rounded-xl p-3 bg-slate-50/50">
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Loan Principal</p>
                    <p className="font-bold text-gray-700 mt-0.5">{formatCurrency(showScheduleModal.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Tenure Months</p>
                    <p className="font-bold text-gray-700 mt-0.5">{showScheduleModal.installments} Months</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">EMI recoup</p>
                    <p className="font-bold text-blue-600 mt-0.5">{formatCurrency(Math.round(showScheduleModal.amount / showScheduleModal.installments))}/mo</p>
                  </div>
                </div>

                {/* Repayment Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-[220px] overflow-y-auto">
                  <table className="w-full text-[11px] border-collapse text-left">
                    <thead className="bg-slate-50 text-gray-500 font-bold border-b border-gray-100">
                      <tr>
                        <th className="p-2.5 pl-4">Installment</th>
                        <th className="p-2.5">Recoup Date</th>
                        <th className="p-2.5">Amount Due</th>
                        <th className="p-2.5 pr-4 text-right">Recoup Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-600">
                      {Array.from({ length: showScheduleModal.installments }, (_, i) => {
                        const instNo = i + 1;
                        const emi = Math.round(showScheduleModal.amount / showScheduleModal.installments);

                        // Calculate mock due dates
                        const baseDate = new Date(showScheduleModal.requestDate);
                        baseDate.setMonth(baseDate.getMonth() + instNo);
                        const dueStr = baseDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

                        const isPaid = showScheduleModal.status === "Disbursed" && instNo <= Math.round(showScheduleModal.installments * 0.2);

                        return (
                          <tr key={instNo} className="hover:bg-slate-50/45 transition-colors">
                            <td className="p-2 pl-4 text-gray-400">Month {instNo}</td>
                            <td className="p-2 font-normal">{dueStr}</td>
                            <td className="p-2">{formatCurrency(emi)}</td>
                            <td className="p-2 pr-4 text-right">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${isPaid ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-500"
                                }`}>
                                {isPaid ? "Settled" : "Remaining"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowScheduleModal(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL 3: Review / Approval Action Popups --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showReviewModal ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${showReviewModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showReviewModal && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="font-semibold text-sm text-gray-855">Review Advance Request</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Change request status parameters</p>
                  </div>
                </div>
                <button onClick={() => setShowReviewModal(null)} className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-medium">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Request Details</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Employee:</p>
                    <p className="font-bold text-gray-850 text-right">{showReviewModal.employeeName}</p>
                    <p>Requested Amt:</p>
                    <p className="font-bold text-gray-850 text-right">{formatCurrency(showReviewModal.amount)}</p>
                    <p>Reason:</p>
                    <p className="font-semibold text-gray-600 text-right truncate max-w-[130px]" title={showReviewModal.reason}>
                      {showReviewModal.reason}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Update Status *</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Disbursed">Disbursed</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Recoverd">Recoverd</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <button
                  onClick={() => setShowReviewModal(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Status Changes</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <div className={`fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${deleteConfirmation.isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${deleteConfirmation.isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}>
          <div className="p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 text-red-655 rounded-full flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-none" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{deleteConfirmation.title}</h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-1.5 leading-relaxed">{deleteConfirmation.message}</p>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 flex gap-2 justify-end border-t border-gray-100">
            <button
              onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
              className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-gray-550 rounded-lg text-[11px] font-semibold cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={deleteConfirmation.onConfirm}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer shadow-xs"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
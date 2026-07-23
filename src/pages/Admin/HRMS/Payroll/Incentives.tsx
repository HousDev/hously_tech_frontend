import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Calendar,
  User,
  Hash,
  FileText,
  Wallet,
  AlertCircle,
  DownloadCloud,
  CheckSquare,
  Square,
  Gift,
  Info,
  Sparkles,
  AlertTriangle,
  Trash2,
  Award,
  Plus,
  Loader2,
  IndianRupee
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../lib/api";

// --- Custom Components ---

const StatCard = ({ icon: Icon, label, value, color, subtitle }: any) => {
  const bgLightMap: any = {
    "bg-purple-500": "bg-purple-50 text-purple-600 border-purple-100",
    "bg-amber-500": "bg-amber-50 text-amber-600 border-amber-100",
    "bg-blue-500": "bg-blue-50 text-blue-600 border-blue-100",
    "bg-emerald-500": "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  const theme = bgLightMap[color] || "bg-slate-50 text-slate-600 border-slate-100";
  const [bgClass, textClass, borderClass] = theme.split(" ");

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group flex-1">
      <div className={`p-2.5 rounded-lg border ${bgClass} ${borderClass} group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-4.5 h-4.5 ${textClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-base font-bold text-gray-800 mt-0.5">{value}</h3>
        {subtitle && <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{subtitle}</p>}
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
        className={`${size} rounded-full object-cover border border-purple-100 shadow-xs flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-[#155dfc] flex items-center justify-center text-white ${textSize} font-bold border border-purple-100 shadow-xs flex-shrink-0`}>
      {initials}
    </div>
  );
};

// --- Interactive Status Dropdown Cell ---
const StatusDropdownCell = ({ item, onUpdateStatus }: { item: any; onUpdateStatus: (item: any, status: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = [
    { key: "Pending", label: "Pending", bg: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
    { key: "Approved", label: "Approved", bg: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 },
    { key: "Paid", label: "Paid", bg: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200", icon: IndianRupee },
    { key: "Rejected", label: "Rejected", bg: "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200", icon: AlertCircle },
  ];

  const normalizedStatus = (item.status || "Pending").trim();
  const currentOption = statusOptions.find(o => o.key.toLowerCase() === normalizedStatus.toLowerCase()) || statusOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${currentOption.bg} transition-all shadow-xs cursor-pointer group`}
        title="Click to change review status"
      >
        <CurrentIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
        <span>{currentOption.label}</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 border-b border-gray-100 text-[9px] font-bold uppercase text-gray-400 tracking-wider">
            Select Review Status
          </div>

          {statusOptions.map((opt) => {
            const IconComp = opt.icon;
            const isSelected = normalizedStatus.toLowerCase() === opt.key.toLowerCase();
            return (
              <button
                key={opt.key}
                onClick={() => {
                  if (!isSelected) {
                    onUpdateStatus(item, opt.key);
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-slate-100 font-bold text-gray-900' : 'hover:bg-slate-50 text-gray-700 font-semibold'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <IconComp className="w-3.5 h-3.5 text-gray-500" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export default function Incentives() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Incentives & Bonuses");
      setHeaderSubtitle("Manage employee performance rewards, sales commissions, and referral bonuses");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // State
  const [incentivesData, setIncentivesData] = useState<any[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showAddIncentive, setShowAddIncentive] = useState(false);
  const [showEditIncentive, setShowEditIncentive] = useState<any | null>(null);
  const [showViewDetails, setShowViewDetails] = useState<any | null>(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

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

  // Column-wise search states
  const [columnFilters, setColumnFilters] = useState({
    employee: "",
    type: "",
    amount: "",
    period: "",
    description: "",
    status: "all",
  });

  // Form states
  const [formData, setFormData] = useState({
    userId: "",
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    type: "",
    period: "2026-07",
    amount: "",
    description: "",
  });

  // Edit Form states
  const [editFormData, setEditFormData] = useState({
    id: "",
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    type: "",
    period: "",
    amount: "",
    description: "",
    status: "",
  });

  // Fetch Incentives & Employees from Backend
  const fetchIncentives = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payroll/incentives");
      if (res.data && res.data.success) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mapped = (res.data.data || []).map((item: any) => {
          const monthName = monthNames[(item.month || 1) - 1] || "July";
          const periodStr = `${monthName} ${item.year || 2026}`;

          return {
            id: String(item.id),
            dbId: item.id,
            displayId: `INC-${String(item.id).padStart(3, '0')}`,
            userId: item.user_id,
            employee: item.employee_name || "Employee",
            empId: item.emp_id_details || item.employee_id || `EMP-${item.user_id}`,
            type: item.incentive_type || "Bonus",
            amount: String(item.amount || 0),
            period: periodStr,
            month: item.month,
            year: item.year,
            description: item.title || "Performance Reward",
            status: item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : "Pending",
            department: item.department || item.designation || "General",
            avatarUrl: item.avatar_url || item.avatarUrl || item.avatar || '',
          };
        });
        setIncentivesData(mapped);
      }
    } catch (err) {
      console.error("Error fetching incentives:", err);
      toast.error("Failed to load incentives data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      let empsList: any[] = [];

      try {
        const res = await api.get("/payroll/employees");
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          empsList = res.data.data;
        }
      } catch (e) {
        // Ignore fallback
      }

      if (empsList.length === 0) {
        try {
          const res = await api.get("/employees");
          if (res.data && (res.data.data || Array.isArray(res.data))) {
            empsList = Array.isArray(res.data) ? res.data : (res.data.data || []);
          }
        } catch (e) {
          // Ignore fallback
        }
      }

      if (empsList.length === 0) {
        try {
          const res = await api.get("/tasks/employees");
          if (res.data && (res.data.data || Array.isArray(res.data))) {
            empsList = Array.isArray(res.data) ? res.data : (res.data.data || []);
          }
        } catch (e) {
          // Ignore
        }
      }

      const mappedEmps = empsList.map((emp: any) => ({
        name: emp.name || emp.full_name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.first_name || emp.username || `User #${emp.id}`,
        id: emp.empId || emp.employeeId || emp.employee_id || `EMP-${emp.id}`,
        userId: emp.id || emp.userId || emp.user_id,
        designation: emp.designation || emp.role || "Employee",
        department: emp.department || "General",
        email: emp.email || "",
        avatarUrl: emp.avatarUrl || emp.avatar_url || emp.avatar || '',
      }));

      setAvailableEmployees(mappedEmps);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchIncentives();
    fetchEmployees();
  }, []);

  // Stats calculations
  const stats = {
    totalIncentives: incentivesData.length,
    pending: incentivesData.filter(item => item.status.toLowerCase() === "pending").length,
    approved: incentivesData.filter(item => item.status.toLowerCase() === "approved").length,
    totalAmount: incentivesData.reduce((sum, item) => sum + parseInt(item.amount || "0"), 0),
  };

  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString('en-IN');
  };

  // Filter data
  const filteredData = incentivesData.filter(item => {
    // Global search
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      if (!item.employee.toLowerCase().includes(q) &&
        !item.empId.toLowerCase().includes(q) &&
        !item.displayId.toLowerCase().includes(q) &&
        !item.type.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Column-wise filters
    if (columnFilters.employee && !item.employee.toLowerCase().includes(columnFilters.employee.toLowerCase())) {
      return false;
    }
    if (columnFilters.type && !item.type.toLowerCase().includes(columnFilters.type.toLowerCase())) {
      return false;
    }
    if (columnFilters.amount && !item.amount.includes(columnFilters.amount)) {
      return false;
    }
    if (columnFilters.period && !item.period.toLowerCase().includes(columnFilters.period.toLowerCase())) {
      return false;
    }
    if (columnFilters.description && !item.description.toLowerCase().includes(columnFilters.description.toLowerCase())) {
      return false;
    }
    if (columnFilters.status !== "all" && item.status.toLowerCase() !== columnFilters.status.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Pagination
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredData.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredData.length / (numPageSize || 1));
  const paginatedData = isPageSizeAll ? filteredData : filteredData.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  // Filtered employees for dropdown (all employees searchable)
  const filteredEmployees = availableEmployees.filter(emp => {
    if (employeeSearchQuery.trim() === "") return true;
    const q = employeeSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  });

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(row => row !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(item => item.id));
    }
  };

  const handleClearFilters = () => {
    setColumnFilters({
      employee: "",
      type: "",
      amount: "",
      period: "",
      description: "",
      status: "all",
    });
    setGlobalSearch("");
    toast.success("Filters cleared");
  };

  const handleStatusUpdate = async (item: any, newStatus: string) => {
    try {
      // Optimistic update
      setIncentivesData(prev => prev.map(row => row.id === item.id ? { ...row, status: newStatus } : row));

      const res = await api.patch(`/payroll/incentives/${item.id}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Incentive reward status marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status");
        fetchIncentives();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status in server");
      fetchIncentives();
    }
  };

  const handleAddIncentive = async () => {
    if (!formData.userId) {
      toast.error("Please select an employee");
      return;
    }
    if (!formData.type) {
      toast.error("Please select incentive type");
      return;
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    if (!formData.period) {
      toast.error("Please select the period");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const [yearStr, monthStr] = formData.period.split("-");
    const m = parseInt(monthStr, 10);
    const y = parseInt(yearStr, 10);

    try {
      const payload = {
        userId: formData.userId,
        title: formData.description,
        amount: amt,
        incentiveType: formData.type,
        month: m,
        year: y,
        status: "Pending"
      };

      const res = await api.post("/payroll/incentives", payload);
      if (res.data && res.data.success) {
        toast.success("Incentive reward recorded successfully!");
        setShowAddIncentive(false);
        setFormData({
          userId: "",
          employee: "",
          employeeId: "",
          employeeDesignation: "",
          type: "",
          period: "2026-07",
          amount: "",
          description: "",
        });
        fetchIncentives();
      } else {
        toast.error(res.data?.message || "Failed to add incentive");
      }
    } catch (err) {
      console.error("Error creating incentive:", err);
      toast.error("Failed to record incentive");
    }
  };

  const handleEditIncentive = (item: any) => {
    let formattedPeriod = "2026-07";
    try {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const parts = item.period.split(" ");
      if (parts.length === 2) {
        const mIdx = monthNames.indexOf(parts[0]) + 1;
        const formattedMonth = mIdx < 10 ? `0${mIdx}` : `${mIdx}`;
        formattedPeriod = `${parts[1]}-${formattedMonth}`;
      }
    } catch (e) {
      // Fallback
    }

    setEditFormData({
      id: item.id,
      employee: item.employee,
      employeeId: item.empId,
      employeeDesignation: item.department,
      type: item.type,
      period: formattedPeriod,
      amount: item.amount,
      description: item.description,
      status: item.status,
    });
    setShowEditIncentive(item);
  };

  const handleUpdateIncentive = async () => {
    if (!editFormData.type) {
      toast.error("Please select incentive type");
      return;
    }
    const amt = parseFloat(editFormData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!editFormData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const [yearStr, monthStr] = editFormData.period.split("-");
    const m = parseInt(monthStr, 10);
    const y = parseInt(yearStr, 10);

    try {
      const payload = {
        title: editFormData.description,
        amount: amt,
        incentiveType: editFormData.type,
        month: m,
        year: y,
        status: editFormData.status || "Pending"
      };

      const res = await api.put(`/payroll/incentives/${editFormData.id}`, payload);
      if (res.data && res.data.success) {
        toast.success("Incentive details updated successfully!");
        setShowEditIncentive(null);
        fetchIncentives();
      } else {
        toast.error(res.data?.message || "Failed to update incentive");
      }
    } catch (err) {
      console.error("Error updating incentive:", err);
      toast.error("Failed to update incentive details");
    }
  };

  const handleDeleteIncentive = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this incentive record? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await api.delete(`/payroll/incentives/${id}`);
          if (res.data && res.data.success) {
            toast.success("Incentive record deleted");
            setSelectedRows(prev => prev.filter(r => r !== id));
            fetchIncentives();
          } else {
            toast.error("Failed to delete incentive");
          }
        } catch (err) {
          console.error("Error deleting incentive:", err);
          toast.error("Failed to delete incentive record");
        } finally {
          setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected incentive records? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedRows.map(id => api.delete(`/payroll/incentives/${id}`)));
          toast.success("Selected records successfully deleted");
          setSelectedRows([]);
          fetchIncentives();
        } catch (err) {
          console.error("Error bulk deleting incentives:", err);
          toast.error("Failed to delete selected incentives");
        } finally {
          setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="p-6 w-full space-y-6 bg-gray-50/50 lg:h-[calc(100vh-40px)] lg:overflow-hidden flex flex-col min-h-screen lg:min-h-0 text-gray-655 font-medium">
      <Toaster position="top-right" />

      {/* Inject animation keyframes */}
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard
          icon={Gift}
          label="Total Incentives"
          value={stats.totalIncentives}
          color="bg-purple-500"
          subtitle="Overall reward requests logged"
        />
        <StatCard
          icon={Clock}
          label="Pending Rewards"
          value={stats.pending}
          color="bg-amber-500"
          subtitle="Awaiting administrative review"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved Rewards"
          value={stats.approved}
          color="bg-blue-500"
          subtitle="Verified & ready for payroll run"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Provisioned"
          value={formatCurrency(stats.totalAmount)}
          color="bg-emerald-500"
          subtitle="Cumulative payout allowance sum"
        />
      </div>

      {/* Main Content Dashboard Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Table Action Header */}
        <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Incentive Listings</h3>
            <span className="bg-blue-50 text-blue-600 font-bold border border-blue-100 px-2 py-0.5 rounded text-[10px]">
              {filteredData.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incentives..."
                value={globalSearch}
                onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white shadow-xs w-48 focus:w-60 transition-all"
              />
            </div>

            {/* Clear Filters Button */}
            {(globalSearch || Object.values(columnFilters).some(v => v !== "" && v !== "all")) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 border border-gray-200 bg-white text-gray-500 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Bulk Actions Button */}
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-50 text-rose-650 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-rose-100 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedRows.length})</span>
              </button>
            )}

            {/* Add Reward Button */}
            <button
              onClick={() => {
                fetchEmployees();
                setShowAddIncentive(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm px-4 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Incentive</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
              <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-6 w-10">
                  <button onClick={toggleAll} className="hover:text-gray-700 cursor-pointer transition-colors">
                    {selectedRows.length === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </th>
                <th className="p-3 min-w-[170px]">
                  <div className="space-y-1">
                    <span>Employee / ID</span>
                    <input
                      type="text"
                      placeholder="Filter employee..."
                      value={columnFilters.employee}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, employee: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[140px]">
                  <div className="space-y-1">
                    <span>Incentive Category</span>
                    <input
                      type="text"
                      placeholder="Filter category..."
                      value={columnFilters.type}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, type: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[110px]">
                  <div className="space-y-1">
                    <span>Amount</span>
                    <input
                      type="text"
                      placeholder="Filter amount..."
                      value={columnFilters.amount}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, amount: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[110px]">
                  <div className="space-y-1">
                    <span>Payout Month</span>
                    <input
                      type="text"
                      placeholder="Filter period..."
                      value={columnFilters.period}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, period: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[180px]">
                  <div className="space-y-1">
                    <span>Reason Description</span>
                    <input
                      type="text"
                      placeholder="Filter description..."
                      value={columnFilters.description}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, description: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[135px]">
                  <div className="space-y-1">
                    <span>Review Status</span>
                    <select
                      value={columnFilters.status}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, status: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Paid">Paid</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </th>
                <th className="p-3 pr-6 text-right w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-bold bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span>Loading incentives data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 pl-6">
                    <button onClick={() => toggleRow(item.id)} className="hover:text-gray-700 cursor-pointer transition-colors">
                      {selectedRows.includes(item.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={item.employee} avatarUrl={item.avatarUrl} size="w-8 h-8" textSize="text-[10px]" />
                      <div>
                        <p className="font-bold text-gray-800 text-xs">{item.employee}</p>
                        <p className="text-[9px] text-gray-400 font-semibold">{item.empId} • {item.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-blue-600 text-[9px] font-bold border border-blue-100">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-gray-800">{formatCurrency(parseFloat(item.amount))}</td>
                  <td className="p-3 font-semibold text-gray-600">{item.period}</td>
                  <td className="p-3 text-gray-400 text-[10px] max-w-[180px] truncate" title={item.description}>
                    {item.description}
                  </td>
                  <td className="p-3">
                    <StatusDropdownCell item={item} onUpdateStatus={handleStatusUpdate} />
                  </td>
                  <td className="p-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-gray-405">
                      <button
                        onClick={() => setShowViewDetails(item)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="View Detailed Reason"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditIncentive(item)}
                        className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Edit Parameters"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteIncentive(item.id)}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-bold italic bg-white">
                    No incentive requests found. New requests will appear here once submitted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
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
              Showing {filteredData.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredData.length)}` : 0} of {filteredData.length} records
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isPageSizeAll}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: Add Incentive Request --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 rounded-md ${showAddIncentive ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-visible flex flex-col transition-all duration-300 transform rounded-md ${showAddIncentive ? "scale-100 opacity-100 " : "scale-95 opacity-0"}`}>

          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0 rounded-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Add Performance Incentive</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Record performance bonuses or sales rewards</p>
              </div>
            </div>
            <button onClick={() => { setShowAddIncentive(false); setShowEmployeeDropdown(false); }} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 flex-1 text-xs overflow-visible">

            {/* Searchable Custom Employee Selector */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Select Employee <span className="text-red-500">*</span></label>
              <div
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                className="w-full bg-slate-50 border border-blue-500 rounded-xl p-2.5 text-xs font-semibold flex justify-between items-center cursor-pointer hover:bg-slate-100/50"
              >
                <span className={formData.employee ? "text-gray-900" : "text-gray-400"}>
                  {formData.employee ? `${formData.employee} (${formData.employeeId})` : "Choose an employee..."}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {showEmployeeDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmployeeDropdown(false)} />
                  <div className="absolute top-[60px] left-0 right-0 bg-white rounded-xl shadow-xl z-50 p-2 space-y-2 border border-gray-100">
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
                    <div className="max-h-[180px] overflow-y-auto divide-y divide-gray-100 no-scrollbar">
                      {filteredEmployees.length === 0 ? (
                        <div className="p-3 text-center text-gray-400 text-xs">No employees found</div>
                      ) : (
                        filteredEmployees.map((emp) => (
                          <div
                            key={emp.userId}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                userId: emp.userId,
                                employee: emp.name,
                                employeeId: emp.id,
                                employeeDesignation: emp.designation,
                              }));
                              setShowEmployeeDropdown(false);
                            }}
                            className="p-2 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                          >
                            <UserAvatar name={emp.name} avatarUrl={emp.avatarUrl} size="w-7 h-7" textSize="text-[9px]" />
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-xs truncate mr-2">{emp.name}</span>
                                <span className="bg-blue-50 text-blue-600 font-bold border border-blue-100 px-1.5 py-0.5 rounded text-[9px] flex-shrink-0">{emp.id}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-semibold">{emp.designation} • {emp.department}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Incentive Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Incentive Category <span className="text-red-500">*</span></label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Performance Bonus">Performance Bonus</option>
                <option value="Sales Incentive">Sales Incentive</option>
                <option value="Referral Bonus">Referral Bonus</option>
                <option value="Spot Bonus">Spot Bonus</option>
                <option value="Project Bonus">Project Bonus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Reward Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Target Month/Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Target Payout Month <span className="text-red-500">*</span></label>
                <input
                  type="month"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Justification / Remarks <span className="text-red-500">*</span></label>
              <textarea
                rows={3}
                placeholder="Describe reason or performance metric hit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 resize-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
            <button
              onClick={() => setShowAddIncentive(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddIncentive}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Save Incentive Record
            </button>
          </div>

        </div>
      </div>

      {/* --- MODAL 2: Edit Incentive Modal --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 rounded-md ${showEditIncentive ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 transform rounded-md ${showEditIncentive ? "scale-100 opacity-100 " : "scale-95 opacity-0"}`}>

          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0 rounded-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                <Pencil className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Edit Incentive Record</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Update reward amount or period parameters</p>
              </div>
            </div>
            <button onClick={() => setShowEditIncentive(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 flex-1 text-xs overflow-y-auto">

            {/* Readonly Employee display */}
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200/60 space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Beneficiary</span>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-xs">{editFormData.employee}</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">{editFormData.employeeId}</span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Incentive Category <span className="text-red-500">*</span></label>
              <select
                value={editFormData.type}
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 cursor-pointer"
              >
                <option value="Performance Bonus">Performance Bonus</option>
                <option value="Sales Incentive">Sales Incentive</option>
                <option value="Referral Bonus">Referral Bonus</option>
                <option value="Spot Bonus">Spot Bonus</option>
                <option value="Project Bonus">Project Bonus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Reward Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* Target Month/Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Payout Month <span className="text-red-500">*</span></label>
                <input
                  type="month"
                  value={editFormData.period}
                  onChange={(e) => setEditFormData({ ...editFormData, period: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Remarks / Notes <span className="text-red-500">*</span></label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-gray-800 resize-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
            <button
              onClick={() => setShowEditIncentive(null)}
              className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateIncentive}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>

      {/* --- MODAL 3: View Details Modal --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 rounded-md ${showViewDetails ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform rounded-md ${showViewDetails ? "scale-100 opacity-100 " : "scale-95 opacity-0"}`}>

          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0 rounded-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-purple-500/10 p-2 rounded-lg text-purple-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Incentive Details</h3>
                <p className="text-[10px] text-gray-400 font-semibold">{showViewDetails?.displayId || showViewDetails?.id}</p>
              </div>
            </div>
            <button onClick={() => setShowViewDetails(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {showViewDetails && (
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-100">
                <UserAvatar name={showViewDetails.employee} avatarUrl={showViewDetails.avatarUrl} size="w-9 h-9" textSize="text-xs" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{showViewDetails.employee}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">{showViewDetails.empId} • {showViewDetails.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Category</span>
                  <span className="font-bold text-blue-600 text-xs mt-0.5 block">{showViewDetails.type}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Amount</span>
                  <span className="font-bold text-gray-800 text-xs mt-0.5 block">{formatCurrency(parseFloat(showViewDetails.amount))}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Target Month</span>
                <span className="font-semibold text-gray-700 text-xs">{showViewDetails.period}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Remarks / Metric hit</span>
                <p className="text-xs text-gray-600 leading-relaxed">{showViewDetails.description}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-gray-400">Current Status</span>
                <StatusDropdownCell item={showViewDetails} onUpdateStatus={(item, newStatus) => {
                  handleStatusUpdate(item, newStatus);
                  setShowViewDetails((prev: any) => prev ? { ...prev, status: newStatus } : null);
                }} />
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50/50 border-t border-gray-100 flex justify-end flex-shrink-0">
            <button
              onClick={() => setShowViewDetails(null)}
              className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* --- MODAL 4: Delete Confirmation Dialog --- */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 fade-in-backdrop">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4 modal-animate-scale text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-gray-800">{deleteConfirmation.title}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {deleteConfirmation.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors flex-1 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirmation.onConfirm}
                className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-colors flex-1 shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
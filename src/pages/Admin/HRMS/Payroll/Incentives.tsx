import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  DollarSign,
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
  Plus
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
        <p className="text-[10px] font-semibold text-gray-405 uppercase tracking-wider">{label}</p>
        <h3 className="text-base font-bold text-gray-800 mt-0.5">{value}</h3>
        {subtitle && <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, any> = {
    Pending: { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
    Approved: { bg: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle2 },
    Paid: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: DollarSign },
    Rejected: { bg: "bg-rose-50 text-rose-705 border-rose-100", icon: AlertCircle },
  };
  const { bg, icon: Icon } = config[status] || config.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${bg}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
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

  // Sample employees database
  const availableEmployees = [
    { name: "Suraj Kumar", id: "EMP0019", designation: "MTS-2", department: "Engineering", email: "suraj@hously.co" },
    { name: "Anjali Sharma", id: "EMP0020", designation: "Design Lead", department: "Marketing", email: "anjali@hously.co" },
    { name: "Vikram Patel", id: "EMP0021", designation: "Account Executive", department: "Sales", email: "vikram@hously.co" },
    { name: "Kunal Sen", id: "EMP0022", designation: "Recruiter Manager", department: "HR", email: "kunal@hously.co" },
    { name: "Priya Mehta", id: "EMP0023", designation: "Product Designer", department: "Design", email: "priya@hously.co" },
    { name: "Rahul Verma", id: "EMP0024", designation: "Staff Engineer", department: "Engineering", email: "rahul@hously.co" },
    { name: "SHEKH ABDUL", id: "EMP0016", designation: "GENERAL MANAGER", department: "Operations", email: "abdul@hously.co" }
  ];

  // Sample incentive data
  const [incentivesData, setIncentivesData] = useState([
    {
      id: "INC-001",
      employee: "Suraj Kumar",
      empId: "EMP0019",
      type: "Performance Bonus",
      amount: "15000",
      period: "July 2026",
      description: "Q2 Performance Excellence Award",
      status: "Pending",
      department: "Engineering"
    },
    {
      id: "INC-002",
      employee: "Anjali Sharma",
      empId: "EMP0020",
      type: "Referral Bonus",
      amount: "10000",
      period: "June 2026",
      description: "Successful referral for Senior Designer position",
      status: "Approved",
      department: "Marketing"
    },
    {
      id: "INC-003",
      employee: "Vikram Patel",
      empId: "EMP0021",
      type: "Sales Incentive",
      amount: "25000",
      period: "June 2026",
      description: "Exceeded quarterly sales target by 35%",
      status: "Paid",
      department: "Sales"
    },
    {
      id: "INC-004",
      employee: "Kunal Sen",
      empId: "EMP0022",
      type: "Spot Bonus",
      amount: "5000",
      period: "May 2026",
      description: "Exceptional performance in recruitment drive",
      status: "Pending",
      department: "HR"
    },
    {
      id: "INC-005",
      employee: "Priya Mehta",
      empId: "EMP0023",
      type: "Performance Bonus",
      amount: "12000",
      period: "May 2026",
      description: "Outstanding UI/UX design contributions",
      status: "Approved",
      department: "Design"
    },
    {
      id: "INC-006",
      employee: "Rahul Verma",
      empId: "EMP0024",
      type: "Project Bonus",
      amount: "20000",
      period: "April 2026",
      description: "Successfully delivered major client project ahead of schedule",
      status: "Paid",
      department: "Engineering"
    },
  ]);

  // Stats calculations
  const stats = {
    totalIncentives: incentivesData.length,
    pending: incentivesData.filter(item => item.status === "Pending").length,
    approved: incentivesData.filter(item => item.status === "Approved").length,
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
        !item.id.toLowerCase().includes(q) &&
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
    if (columnFilters.status !== "all" && item.status !== columnFilters.status) {
      return false;
    }

    return true;
  });

  // Pagination
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredData.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredData.length / numPageSize);
  const paginatedData = isPageSizeAll ? filteredData : filteredData.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  // Filtered employees for dropdown (Capped strictly at 5 matches)
  const filteredEmployees = availableEmployees.filter(emp => {
    if (employeeSearchQuery.trim() === "") return true;
    const q = employeeSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  }).slice(0, 5);

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

  const handleAddIncentive = () => {
    if (!formData.employee) {
      toast.error("Please select an employee");
      return;
    }
    if (!formData.type) {
      toast.error("Please select incentive type");
      return;
    }
    const amt = parseInt(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
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

    // Format period input from YYYY-MM to Month YYYY
    const [year, month] = formData.period.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    const periodStr = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const newIncentive = {
      id: `INC-00${incentivesData.length + 1}`,
      employee: formData.employee,
      empId: formData.employeeId,
      type: formData.type,
      amount: formData.amount,
      period: periodStr,
      description: formData.description,
      status: "Pending",
      department: formData.employeeDesignation || "General",
    };

    setIncentivesData([newIncentive, ...incentivesData]);
    setFormData({
      employee: "",
      employeeId: "",
      employeeDesignation: "",
      type: "",
      period: "2026-07",
      amount: "",
      description: "",
    });
    setShowAddIncentive(false);
    toast.success("Incentive reward recorded!");
  };

  const handleEditIncentive = (item: any) => {
    // Parse period string back to YYYY-MM if possible
    let formattedPeriod = "2026-07";
    try {
      const parts = item.period.split(" ");
      if (parts.length === 2) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  const handleUpdateIncentive = () => {
    if (!editFormData.type) {
      toast.error("Please select incentive type");
      return;
    }
    const amt = parseInt(editFormData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!editFormData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const [year, month] = editFormData.period.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    const periodStr = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    setIncentivesData(prev => prev.map(item =>
      item.id === editFormData.id ? {
        ...item,
        type: editFormData.type,
        amount: editFormData.amount,
        period: periodStr,
        description: editFormData.description,
      } : item
    ));

    setShowEditIncentive(null);
    toast.success("Incentive details updated successfully!");
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setIncentivesData(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
    toast.success(`Incentive reward marked as ${newStatus}`);
  };

  const handleDeleteIncentive = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this incentive record? This action cannot be undone.",
      onConfirm: () => {
        setIncentivesData(prev => prev.filter(item => item.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Incentive record deleted");
      }
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected incentive records? This action cannot be undone.`,
      onConfirm: () => {
        setIncentivesData(prev => prev.filter(item => !selectedRows.includes(item.id)));
        setSelectedRows([]);
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Selected records successfully deleted");
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
          icon={DollarSign}
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
              onClick={() => setShowAddIncentive(true)}
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
            <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm border-b border-gray-200">
              <tr className="bg-slate-50 text-gray-500 font-semibold select-none">
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
                <th className="p-3 min-w-[125px]">
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
              {paginatedData.map((item) => (
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
                      <div className="w-8 h-8 rounded-full bg-[#155dfc] flex items-center justify-center text-white text-[10px] font-bold border border-purple-100 shadow-xs flex-shrink-0">
                        {item.employee.split(' ').map(n => n[0]).join('')}
                      </div>
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
                  <td className="p-3 font-bold text-gray-800">{formatCurrency(parseInt(item.amount))}</td>
                  <td className="p-3 font-semibold text-gray-600">{item.period}</td>
                  <td className="p-3 text-gray-400 text-[10px] max-w-[180px] truncate" title={item.description}>
                    {item.description}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-gray-405">
                      <button
                        onClick={() => setShowViewDetails(item)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg  transition-all shadow-xs cursor-pointer"
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
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-bold italic bg-white">
                    No matching incentive reward requests logged.
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
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300  rounded-md  ${showAddIncentive ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
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
                  <div className="absolute top-[60px] left-0 right-0 bg-white  rounded-xl shadow-xl z-50 p-2 space-y-2">
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
                      {filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              employee: emp.name,
                              employeeId: emp.id,
                              employeeDesignation: emp.designation,
                            }));
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
                      {filteredEmployees.length === 0 && (
                        <p className="p-3 text-center text-gray-450 italic text-[11px]">No matching employees found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Category Type selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Incentive Category <span className="text-red-500">*</span></label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="">Select Category Type...</option>
                <option value="Performance Bonus">Performance Bonus</option>
                <option value="Sales Incentive">Sales Incentive</option>
                <option value="Referral Bonus">Referral Bonus</option>
                <option value="Spot Bonus">Spot Bonus</option>
                <option value="Project Bonus">Project Bonus</option>
                <option value="Annual Bonus">Annual Bonus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Reward Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Disbursal Month <span className="text-red-500">*</span></label>
                <input
                  type="month"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Description / Reason <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Explain justification for reward disbursal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-100 border border-purple-100 rounded-xl p-3 flex gap-2 text-purple-800">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="space-y-0.5 text-[10px] font-semibold text-blue-500">
                <p className="font-bold text-red-500">Accounting Guidelines</p>
                <p>New entries will be created in "Pending" status and will require review approval before release.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <button
              onClick={() => setShowAddIncentive(false)}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddIncentive}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Incentive</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 2: Edit Incentive Parameters --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showEditIncentive ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 transform ${showEditIncentive ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showEditIncentive && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Edit Incentive Parameters</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Modify details for request {editFormData.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditIncentive(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Selected Employee</label>
                  <input
                    type="text"
                    disabled
                    value={`${editFormData.employee} (${editFormData.employeeId})`}
                    className="w-full bg-slate-100 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Incentive Category <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="Performance Bonus">Performance Bonus</option>
                    <option value="Sales Incentive">Sales Incentive</option>
                    <option value="Referral Bonus">Referral Bonus</option>
                    <option value="Spot Bonus">Spot Bonus</option>
                    <option value="Project Bonus">Project Bonus</option>
                    <option value="Annual Bonus">Annual Bonus</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Reward Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Disbursal Month <span className="text-red-500">*</span></label>
                    <input
                      type="month"
                      value={editFormData.period}
                      onChange={(e) => setEditFormData({ ...editFormData, period: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Description / Reason <span className="text-red-500">*</span></label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <button
                  onClick={() => setShowEditIncentive(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateIncentive}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Update Reward</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL 3: View Incentive Details Card --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showViewDetails ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${showViewDetails ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showViewDetails && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border border-purple-205">
                    {showViewDetails.employee?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{showViewDetails.employee}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Compensation Reward Ledger ID: {showViewDetails.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowViewDetails(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-gray-600">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Reward Allocations Details</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Employee ID:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.empId}</p>
                    <p>Department:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.department}</p>
                    <p>Bonus Category:</p>
                    <p className="font-bold text-purple-650 text-right">{showViewDetails.type}</p>
                    <p>Reward Payout:</p>
                    <p className="font-bold text-emerald-600 text-right">{formatCurrency(parseInt(showViewDetails.amount))}</p>
                    <p>Processing Month:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.period}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase block">Justification Description</p>
                  <p className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-gray-600 font-normal leading-relaxed">
                    {showViewDetails.description}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-450">Current Status:</span>
                  <StatusBadge status={showViewDetails.status} />
                </div>
                <button
                  onClick={() => setShowViewDetails(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-550 shadow-sm cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- POPUP MODAL: Delete Confirmation --- */}
      <div className={`fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${deleteConfirmation.isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${deleteConfirmation.isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}>
          <div className="p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 text-rose-650 rounded-full flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-none" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{deleteConfirmation.title}</h3>
              <p className="text-[11px] text-gray-450 font-semibold mt-1.5 leading-relaxed">{deleteConfirmation.message}</p>
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
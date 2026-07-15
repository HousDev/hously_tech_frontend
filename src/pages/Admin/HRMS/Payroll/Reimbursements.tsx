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
  Plus,
  Receipt,
  CreditCard,
  Building,
  MapPin,
  Globe,
  Briefcase,
  Users,
  CalendarDays,
  FileSpreadsheet,
  Send,
  Printer,
  Mail,
  ExternalLink,
  RefreshCw,
  Shield,
  Lock,
  Unlock,
  Key,
  LogOut,
  Zap,
  PieChart,
  BarChart3,
  TrendingDown,
  Minus,
  Plus as PlusIcon,
  ArrowRight,
  ArrowLeft,
  Upload,
  DownloadCloud as DownloadCloudIcon,
  Archive,
  FileSpreadsheet as FileSpreadsheetIcon,
  EyeOff,
  Info as InfoIcon,
  HelpCircle,
  ExternalLink as ExternalLinkIcon,
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
    Rejected: { bg: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle },
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

export default function Reimbursements() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Reimbursements");
      setHeaderSubtitle("Manage employee expense reimbursements, claims, and approvals");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // State
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showAddReimbursement, setShowAddReimbursement] = useState(false);
  const [showEditReimbursement, setShowEditReimbursement] = useState<any | null>(null);
  const [showViewDetails, setShowViewDetails] = useState<any | null>(null);

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
    category: "",
    amount: "",
    description: "",
    requestDate: "",
    status: "all",
  });

  // Advanced Filter states
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
    department: "all",
  });

  // Form states
  const [formData, setFormData] = useState({
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    category: "",
    amount: "",
    description: "",
    requestDate: "",
  });

  // Edit Form states
  const [editFormData, setEditFormData] = useState({
    id: "",
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    category: "",
    amount: "",
    description: "",
    requestDate: "",
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
  ];

  // Sample reimbursement data
  const [reimbursementsData, setReimbursementsData] = useState([
    {
      id: "REIM-001",
      employee: "Suraj Kumar",
      empId: "EMP0019",
      category: "Travel",
      amount: "4500",
      description: "Client meeting travel expenses - Mumbai to Pune",
      requestDate: "2026-07-10",
      status: "Pending",
      department: "Engineering"
    },
    {
      id: "REIM-002",
      employee: "Anjali Sharma",
      empId: "EMP0020",
      category: "Office Supplies",
      amount: "2800",
      description: "Stationery and printer cartridges for design team",
      requestDate: "2026-07-08",
      status: "Approved",
      department: "Marketing"
    },
    {
      id: "REIM-003",
      employee: "Vikram Patel",
      empId: "EMP0021",
      category: "Meals",
      amount: "1200",
      description: "Team lunch during client presentation",
      requestDate: "2026-07-05",
      status: "Paid",
      department: "Sales"
    },
    {
      id: "REIM-004",
      employee: "Kunal Sen",
      empId: "EMP0022",
      category: "Travel",
      amount: "3500",
      description: "Cab expenses for interview candidates",
      requestDate: "2026-07-03",
      status: "Pending",
      department: "HR"
    },
    {
      id: "REIM-005",
      employee: "Priya Mehta",
      empId: "EMP0023",
      category: "Software",
      amount: "999",
      description: "Figma design software monthly subscription",
      requestDate: "2026-07-01",
      status: "Approved",
      department: "Design"
    },
    {
      id: "REIM-006",
      employee: "Rahul Verma",
      empId: "EMP0024",
      category: "Equipment",
      amount: "15000",
      description: "New monitor and keyboard for workstation",
      requestDate: "2026-06-28",
      status: "Paid",
      department: "Engineering"
    },
    {
      id: "REIM-007",
      employee: "Suraj Kumar",
      empId: "EMP0019",
      category: "Meals",
      amount: "850",
      description: "Client dinner meeting",
      requestDate: "2026-06-25",
      status: "Rejected",
      department: "Engineering"
    },
  ]);

  // Stats calculations
  const stats = {
    totalReimbursements: reimbursementsData.length,
    pending: reimbursementsData.filter(item => item.status === "Pending").length,
    approved: reimbursementsData.filter(item => item.status === "Approved").length,
    totalAmount: reimbursementsData.reduce((sum, item) => sum + parseInt(item.amount || "0"), 0),
  };

  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString('en-IN');
  };

  // Filter data
  const filteredData = reimbursementsData.filter(item => {
    // Global search
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      if (!item.employee.toLowerCase().includes(q) &&
        !item.empId.toLowerCase().includes(q) &&
        !item.id.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Column-wise filters
    if (columnFilters.employee && !item.employee.toLowerCase().includes(columnFilters.employee.toLowerCase())) {
      return false;
    }
    if (columnFilters.category && !item.category.toLowerCase().includes(columnFilters.category.toLowerCase())) {
      return false;
    }
    if (columnFilters.amount && !item.amount.includes(columnFilters.amount)) {
      return false;
    }
    if (columnFilters.description && !item.description.toLowerCase().includes(columnFilters.description.toLowerCase())) {
      return false;
    }
    if (columnFilters.requestDate && item.requestDate !== columnFilters.requestDate) {
      return false;
    }
    if (columnFilters.status !== "all" && item.status !== columnFilters.status) {
      return false;
    }

    // Advanced drawer filters
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters.amountMin && parseInt(item.amount) < parseInt(filters.amountMin)) {
      return false;
    }
    if (filters.amountMax && parseInt(item.amount) > parseInt(filters.amountMax)) {
      return false;
    }
    if (filters.dateFrom && item.requestDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && item.requestDate > filters.dateTo) {
      return false;
    }
    if (filters.department !== "all" && item.department !== filters.department) {
      return false;
    }

    return true;
  });

  // Pagination
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredData.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredData.length / numPageSize);
  const paginatedData = isPageSizeAll ? filteredData : filteredData.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

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
      category: "",
      amount: "",
      description: "",
      requestDate: "",
      status: "all",
    });
    setFilters({
      category: "all",
      status: "all",
      amountMin: "",
      amountMax: "",
      dateFrom: "",
      dateTo: "",
      department: "all",
    });
    setGlobalSearch("");
    toast.success("All filters cleared");
  };

  const handleAddReimbursement = () => {
    if (!formData.employee) {
      toast.error("Please select an employee");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    const amt = parseInt(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.requestDate) {
      toast.error("Please select the request date");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const newReimbursement = {
      id: `REIM-00${reimbursementsData.length + 1}`,
      employee: formData.employee,
      empId: formData.employeeId,
      category: formData.category,
      amount: formData.amount,
      description: formData.description,
      requestDate: formData.requestDate,
      status: "Pending",
      department: formData.employeeDesignation || "General",
    };

    setReimbursementsData([newReimbursement, ...reimbursementsData]);
    setFormData({
      employee: "",
      employeeId: "",
      employeeDesignation: "",
      category: "",
      amount: "",
      description: "",
      requestDate: "",
    });
    setShowAddReimbursement(false);
    toast.success("Reimbursement claim recorded!");
  };

  const handleEditReimbursement = (item: any) => {
    setEditFormData({
      id: item.id,
      employee: item.employee,
      employeeId: item.empId,
      employeeDesignation: item.department,
      category: item.category,
      amount: item.amount,
      description: item.description,
      requestDate: item.requestDate,
      status: item.status,
    });
    setShowEditReimbursement(item);
  };

  const handleUpdateReimbursement = () => {
    if (!editFormData.category) {
      toast.error("Please select a category");
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

    setReimbursementsData(prev => prev.map(item =>
      item.id === editFormData.id ? {
        ...item,
        category: editFormData.category,
        amount: editFormData.amount,
        description: editFormData.description,
        requestDate: editFormData.requestDate,
      } : item
    ));

    setShowEditReimbursement(null);
    toast.success("Reimbursement details updated successfully!");
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setReimbursementsData(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
    toast.success(`Reimbursement marked as ${newStatus}`);
  };

  const handleDeleteReimbursement = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this reimbursement claim? This action cannot be undone.",
      onConfirm: () => {
        setReimbursementsData(prev => prev.filter(item => item.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Reimbursement claim deleted");
      }
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected claims? This action cannot be undone.`,
      onConfirm: () => {
        setReimbursementsData(prev => prev.filter(item => !selectedRows.includes(item.id)));
        setSelectedRows([]);
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Selected claims successfully deleted");
      }
    });
  };

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

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard
          icon={Receipt}
          label="Pending Claims"
          value={stats.pending}
          color="bg-amber-500"
          subtitle="Awaiting review"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={stats.approved}
          color="bg-blue-500"
          subtitle="Ready for payment"
        />
        <StatCard
          icon={DollarSign}
          label="Paid"
          value={stats.totalReimbursements - stats.pending - stats.approved}
          color="bg-emerald-500"
          subtitle="Successfully processed"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          color="bg-purple-500"
          subtitle="Total claims value"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Table Action Header */}
        <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Reimbursement Claims</h3>
            <span className="bg-blue-50 text-blue-600 font-bold border border-blue-100 px-2 py-0.5 rounded text-[10px]">
              {filteredData.length} records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Clear Filters Button */}
            {(globalSearch || Object.values(columnFilters).some(v => v !== "" && v !== "all") ||
              Object.values(filters).some(v => v !== "" && v !== "all")) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 border border-gray-200 bg-white text-gray-500 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              )}

            {/* Side Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

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
                    <span>Employee</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.employee}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, employee: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[140px]">
                  <div className="space-y-1">
                    <span>Category</span>
                    <select
                      value={columnFilters.category}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, category: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    >
                      <option value="">All</option>
                      <option value="Travel">Travel</option>
                      <option value="Meals">Meals</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Software">Software</option>
                      <option value="Equipment">Equipment</option>
                    </select>
                  </div>
                </th>
                <th className="p-3 min-w-[110px]">
                  <div className="space-y-1">
                    <span>Amount</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.amount}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, amount: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[180px]">
                  <div className="space-y-1">
                    <span>Description</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.description}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, description: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[120px]">
                  <div className="space-y-1">
                    <span>Request Date</span>
                    <input
                      type="date"
                      value={columnFilters.requestDate}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, requestDate: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs cursor-pointer"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[125px]">
                  <div className="space-y-1">
                    <span>Status</span>
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
                      <div className="w-8 h-8 rounded-full bg-[#155dfc] flex items-center justify-center text-white text-[10px] font-bold border border-blue-100 shadow-xs flex-shrink-0">
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
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-gray-800">{formatCurrency(parseInt(item.amount))}</td>
                  <td className="p-3 text-gray-400 text-[10px] max-w-[180px] truncate" title={item.description}>
                    {item.description}
                  </td>
                  <td className="p-3 text-gray-600 text-[10px]">{item.requestDate}</td>
                  <td className="p-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-gray-405">
                      <button
                        onClick={() => setShowViewDetails(item)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditReimbursement(item)}
                        className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReimbursement(item.id)}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Delete"
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
                    No reimbursement claims found
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
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
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
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0 || isPageSizeAll}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- SIDE FILTER DRAWER --- */}
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

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Travel">Travel</option>
                <option value="Meals">Meals</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Software">Software</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
              </select>
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

            {/* Amount Range */}
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

            {/* Date Range */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date Range</label>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  placeholder="From"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs cursor-pointer focus:outline-none"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs cursor-pointer focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-gray-200 pt-4 flex gap-2.5 bg-white">
            <button
              onClick={() => {
                setFilters({
                  category: "all",
                  status: "all",
                  amountMin: "",
                  amountMax: "",
                  dateFrom: "",
                  dateTo: "",
                  department: "all",
                });
                toast.success("Filters reset");
              }}
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




      {/* --- MODAL 2: Edit Reimbursement --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showEditReimbursement ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 transform ${showEditReimbursement ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showEditReimbursement && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Edit Reimbursement</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Modify claim {editFormData.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditReimbursement(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Employee</label>
                  <input
                    type="text"
                    disabled
                    value={`${editFormData.employee} (${editFormData.employeeId})`}
                    className="w-full bg-slate-100 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Category <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Meals">Meals</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Software">Software</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Amount (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Request Date</label>
                    <input
                      type="date"
                      value={editFormData.requestDate}
                      onChange={(e) => setEditFormData({ ...editFormData, requestDate: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Description <span className="text-red-500">*</span></label>
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
                  onClick={() => setShowEditReimbursement(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReimbursement}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Update Claim</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL 3: View Details --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showViewDetails ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${showViewDetails ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showViewDetails && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border border-blue-200">
                    {showViewDetails.employee?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{showViewDetails.employee}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Claim ID: {showViewDetails.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowViewDetails(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-gray-600">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Claim Details</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Employee ID:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.empId}</p>
                    <p>Department:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.department}</p>
                    <p>Category:</p>
                    <p className="font-bold text-purple-650 text-right">{showViewDetails.category}</p>
                    <p>Amount:</p>
                    <p className="font-bold text-emerald-600 text-right">{formatCurrency(parseInt(showViewDetails.amount))}</p>
                    <p>Request Date:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.requestDate}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase block">Description</p>
                  <p className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-gray-600 font-normal leading-relaxed">
                    {showViewDetails.description}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-450">Status:</span>
                  <StatusBadge status={showViewDetails.status} />
                </div>
                <button
                  onClick={() => setShowViewDetails(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-550 shadow-sm cursor-pointer"
                >
                  Close
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
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  Calendar,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Plus,
  Building,
  Info,
  AlertTriangle,
  DownloadCloud,
  CheckSquare,
  Square,
  TrendingUp,
  Pencil,
  IndianRupee
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- Custom Components ---

const StatCard = ({ icon: Icon, label, value, color, subtitle }: any) => {
  const bgLightMap: any = {
    "bg-purple-500": "bg-purple-50 text-purple-600 border-purple-105",
    "bg-blue-500": "bg-blue-50 text-blue-600 border-blue-105",
    "bg-emerald-500": "bg-emerald-50 text-emerald-600 border-emerald-105",
    "bg-amber-500": "bg-amber-50 text-amber-600 border-amber-105"
  };
  const theme = bgLightMap[color] || "bg-slate-50 text-slate-655 border-slate-100";
  const [bgClass, textClass, borderClass] = theme.split(" ");

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group flex-1">
      <div className={`p-2.5 rounded-lg  ${bgClass} ${borderClass} group-hover:scale-105 transition-transform duration-300`}>
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

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, any> = {
    Success: { bg: "bg-emerald-50 text-emerald-700 border-emerald-105", icon: CheckCircle2 },
    Processing: { bg: "bg-blue-50 text-blue-700 border-blue-105", icon: Clock },
    Failed: { bg: "bg-rose-50 text-rose-700 border-rose-105", icon: AlertTriangle }
  };
  const { bg, icon: Icon } = config[status] || { bg: "bg-slate-50 text-slate-700 border-slate-105", icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold border ${bg}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

// --- Main Component ---

export default function PaymentHistory() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Employee Payment History");
      setHeaderSubtitle("Review payout receipts, transaction references, and salary disbursal records per employee");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // States
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState<any | null>(null);
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
    onConfirm: () => {}
  });

  // Column search filters
  const [columnFilters, setColumnFilters] = useState({
    employee: "",
    month: "",
    date: "",
    amount: "",
    method: "all",
    txRef: "",
    status: "all"
  });

  // Add payout form inputs
  const [formData, setFormData] = useState({
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    employeeDept: "",
    month: "2026-07",
    date: "",
    amount: "",
    method: "Bank HDFC IMPS",
    txRef: "",
    status: "Success"
  });

  // Edit payout form inputs
  const [editFormData, setEditFormData] = useState({
    id: "",
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    employeeDept: "",
    month: "",
    date: "",
    amount: "",
    method: "Bank HDFC IMPS",
    txRef: "",
    status: "Success"
  });

  // Searchable employee registry
  const availableEmployeesDb = [
    { name: "Suraj Kumar", id: "EMP0019", dept: "Engineering", designation: "MTS-2", email: "suraj@hously.co" },
    { name: "Anjali Sharma", id: "EMP0020", dept: "Marketing", designation: "Design Lead", email: "anjali@hously.co" },
    { name: "Vikram Patel", id: "EMP0021", dept: "Sales", designation: "Account Executive", email: "vikram@hously.co" },
    { name: "Kunal Sen", id: "EMP0022", dept: "HR", designation: "Recruiter Manager", email: "kunal@hously.co" },
    { name: "Priya Mehta", id: "EMP0023", dept: "Design", designation: "Product Designer", email: "priya@hously.co" },
    { name: "Rahul Verma", id: "EMP0024", dept: "Engineering", designation: "Staff Engineer", email: "rahul@hously.co" },
    { name: "SHEKH ABDUL", id: "EMP0016", dept: "Operations", designation: "GENERAL MANAGER", email: "abdul@hously.co" }
  ];

  // Employee-wise payout logs
  const [paymentsList, setPaymentsList] = useState([
    { id: "TXN-001", employeeName: "Suraj Kumar", empId: "EMP0019", dept: "Engineering", designation: "MTS-2", month: "June 2026", date: "Jun 28, 2026", amount: 95000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883910" },
    { id: "TXN-002", employeeName: "Anjali Sharma", empId: "EMP0020", dept: "Marketing", designation: "Design Lead", month: "June 2026", date: "Jun 28, 2026", amount: 80000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883911" },
    { id: "TXN-003", employeeName: "Vikram Patel", empId: "EMP0021", dept: "Sales", designation: "Account Executive", month: "June 2026", date: "Jun 28, 2026", amount: 75000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883912" },
    { id: "TXN-004", employeeName: "Kunal Sen", empId: "EMP0022", dept: "HR", designation: "Recruiter Manager", month: "June 2026", date: "Jun 28, 2026", amount: 68000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883913" },
    { id: "TXN-005", employeeName: "Priya Mehta", empId: "EMP0023", dept: "Design", designation: "Product Designer", month: "June 2026", date: "Jun 28, 2026", amount: 85000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883914" },
    { id: "TXN-006", employeeName: "Rahul Verma", empId: "EMP0024", dept: "Engineering", designation: "Staff Engineer", month: "June 2026", date: "Jun 28, 2026", amount: 110000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2883915" },
    { id: "TXN-007", employeeName: "Suraj Kumar", empId: "EMP0019", dept: "Engineering", designation: "MTS-2", month: "May 2026", date: "May 28, 2026", amount: 95000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2551029" },
    { id: "TXN-008", employeeName: "Anjali Sharma", empId: "EMP0020", dept: "Marketing", designation: "Design Lead", month: "May 2026", date: "May 28, 2026", amount: 80000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2551030" },
    { id: "TXN-009", employeeName: "Vikram Patel", empId: "EMP0021", dept: "Sales", designation: "Account Executive", month: "May 2026", date: "May 28, 2026", amount: 75000, method: "Bank HDFC IMPS", status: "Success", txRef: "TXN2551031" }
  ]);

  // Statistics calculation
  const stats = {
    totalNetDisbursed: paymentsList.reduce((sum, item) => sum + item.amount, 0),
    lastDisbursalDate: paymentsList.length > 0 ? paymentsList[0].date : "N/A",
    successCount: paymentsList.filter(item => item.status === "Success").length,
    totalTx: paymentsList.length,
    avgSalary: paymentsList.length > 0 ? Math.round(paymentsList.reduce((sum, item) => sum + item.amount, 0) / paymentsList.length) : 0
  };

  const formatCurrency = (val: number) => {
    return "₹" + val.toLocaleString('en-IN');
  };

  // Filter employee payout logs
  const filteredPayments = paymentsList.filter(item => {
    if (columnFilters.method !== "all" && item.method !== columnFilters.method) return false;
    if (columnFilters.status !== "all" && item.status !== columnFilters.status) return false;
    if (columnFilters.employee && !item.employeeName.toLowerCase().includes(columnFilters.employee.toLowerCase()) && !item.empId.toLowerCase().includes(columnFilters.employee.toLowerCase())) return false;
    if (columnFilters.month && !item.month.toLowerCase().includes(columnFilters.month.toLowerCase())) return false;
    if (columnFilters.date && !item.date.toLowerCase().includes(columnFilters.date.toLowerCase())) return false;
    if (columnFilters.txRef && !item.txRef.toLowerCase().includes(columnFilters.txRef.toLowerCase())) return false;
    if (columnFilters.amount && !String(item.amount).includes(columnFilters.amount)) return false;
    return true;
  });

  // Pagination calculation
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredPayments.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredPayments.length / numPageSize);
  const paginatedPayments = isPageSizeAll ? filteredPayments : filteredPayments.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  // Search filtered employees capped strictly to 5 matches
  const filteredEmployees = availableEmployeesDb.filter(emp => {
    if (employeeSearchQuery.trim() === "") return true;
    const q = employeeSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedPayments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedPayments.map(item => item.id));
    }
  };

  const handleClearFilters = () => {
    setColumnFilters({
      employee: "",
      month: "",
      date: "",
      amount: "",
      method: "all",
      txRef: "",
      status: "all"
    });
    toast.success("Filters cleared");
  };

  const handleAddPayment = () => {
    if (!formData.employee) {
      toast.error("Please select an employee");
      return;
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid salary amount");
      return;
    }
    if (!formData.date) {
      toast.error("Please choose a payout execution date");
      return;
    }
    if (!formData.txRef.trim()) {
      toast.error("Please record a transaction reference");
      return;
    }

    const [year, month] = formData.month.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    const monthStr = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const formattedDate = new Date(formData.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const newPayment = {
      id: `TXN-00${paymentsList.length + 1}`,
      employeeName: formData.employee,
      empId: formData.employeeId,
      dept: formData.employeeDept,
      designation: formData.employeeDesignation,
      month: monthStr,
      date: formattedDate,
      amount: amt,
      method: formData.method,
      txRef: formData.txRef,
      status: formData.status
    };

    setPaymentsList([newPayment, ...paymentsList]);
    setFormData({
      employee: "",
      employeeId: "",
      employeeDesignation: "",
      employeeDept: "",
      month: "2026-07",
      date: "",
      amount: "",
      method: "Bank HDFC IMPS",
      txRef: "",
      status: "Success"
    });
    setShowAddPayment(false);
    toast.success("Employee payment history logged!");
  };

  const handleEditPayment = (item: any) => {
    // Attempt parsing month string back to YYYY-MM
    let parsedMonth = "2026-07";
    try {
      const parts = item.month.split(" ");
      if (parts.length === 2) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mIdx = monthNames.indexOf(parts[0]) + 1;
        const formattedMonth = mIdx < 10 ? `0${mIdx}` : `${mIdx}`;
        parsedMonth = `${parts[1]}-${formattedMonth}`;
      }
    } catch (e) {}

    // Attempt parsing date back to YYYY-MM-DD
    let parsedDate = "";
    try {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        parsedDate = d.toISOString().split("T")[0];
      }
    } catch (e) {}

    setEditFormData({
      id: item.id,
      employee: item.employeeName,
      employeeId: item.empId,
      employeeDesignation: item.designation,
      employeeDept: item.dept,
      month: parsedMonth,
      date: parsedDate,
      amount: String(item.amount),
      method: item.method,
      txRef: item.txRef,
      status: item.status
    });
    setShowEditPayment(item);
  };

  const handleUpdatePayment = () => {
    const amt = parseFloat(editFormData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid salary amount");
      return;
    }
    if (!editFormData.txRef.trim()) {
      toast.error("Please record a transaction reference");
      return;
    }

    const [year, month] = editFormData.month.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    const monthStr = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const formattedDate = editFormData.date
      ? new Date(editFormData.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : editFormData.date;

    setPaymentsList(prev => prev.map(item =>
      item.id === editFormData.id ? {
        ...item,
        month: monthStr,
        date: formattedDate,
        amount: amt,
        method: editFormData.method,
        txRef: editFormData.txRef,
        status: editFormData.status
      } : item
    ));

    setShowEditPayment(null);
    toast.success("Payment parameters adjusted!");
  };

  const handleDeletePayment = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this employee's salary disbursal record? This action cannot be undone.",
      onConfirm: () => {
        setPaymentsList(prev => prev.filter(p => p.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Payment history record deleted");
      }
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected employee payment records? This action cannot be undone.`,
      onConfirm: () => {
        setPaymentsList(prev => prev.filter(p => !selectedRows.includes(p.id)));
        setSelectedRows([]);
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Selected payment logs deleted successfully");
      }
    });
  };

  const handleExportCSV = (pay: any) => {
    toast.success(`Exporting Payslip PDF statement for ${pay.employeeName}`);
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

      {/* Payment metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard
          icon={IndianRupee}
          label="Total Paid Out YTD"
          value={formatCurrency(stats.totalNetDisbursed)}
          color="bg-emerald-500"
          subtitle="Aggregate salaries disbursed this FY"
        />
        <StatCard
          icon={Calendar}
          label="Last Disbursal Date"
          value={stats.lastDisbursalDate}
          color="bg-blue-500"
          subtitle="Most recent payroll execution run"
        />
        <StatCard
          icon={CheckCircle2}
          label="Successful Payouts"
          value={`${stats.successCount} / ${stats.totalTx}`}
          color="bg-purple-500"
          subtitle="Completed salary transaction status"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Salary Paid"
          value={formatCurrency(stats.avgSalary)}
          color="bg-amber-500"
          subtitle="Mean payment transaction sum"
        />
      </div>

      {/* Payment history listing card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Action Header */}
        <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Disbursal History Registry</h3>
            <span className="bg-blue-50 text-blue-600 font-bold border border-blue-105 px-2 py-0.5 rounded text-[10px]">
              {filteredPayments.length} transactions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Clear filters trigger */}
            {Object.values(columnFilters).some(v => v !== "" && v !== "all") && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 border border-gray-200 bg-white text-gray-500 hover:bg-slate-55 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Bulk Actions trigger */}
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-50 text-rose-650 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-rose-100 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedRows.length})</span>
              </button>
            )}

            {/* Record Payout Trigger */}
            <button
              onClick={() => setShowAddPayment(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm px-4 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
              <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-6 w-10">
                  <button onClick={toggleAll} className="hover:text-gray-700 cursor-pointer transition-colors">
                    {selectedRows.length === paginatedPayments.length && paginatedPayments.length > 0 ? (
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
                <th className="p-3 min-w-[125px]">
                  <div className="space-y-1">
                    <span>Payout Month</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.month}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, month: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[125px]">
                  <div className="space-y-1">
                    <span>Disbursal Date</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.date}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, date: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[125px]">
                  <div className="space-y-1">
                    <span>Net Paid</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.amount}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, amount: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[145px]">
                  <div className="space-y-1">
                    <span>Transaction Channel</span>
                    <select
                      value={columnFilters.method}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, method: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Channels</option>
                      <option value="Bank HDFC IMPS">Bank HDFC IMPS</option>
                      <option value="ICICI Corporate API">ICICI Corporate API</option>
                      <option value="HSBC NetBanking">HSBC NetBanking</option>
                    </select>
                  </div>
                </th>
                <th className="p-3 min-w-[125px]">
                  <div className="space-y-1">
                    <span>Transaction Ref</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.txRef}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, txRef: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="p-3 min-w-[110px]">
                  <div className="space-y-1">
                    <span>Status</span>
                    <select
                      value={columnFilters.status}
                      onChange={(e) => { setColumnFilters({ ...columnFilters, status: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All</option>
                      <option value="Success">Success</option>
                      <option value="Processing">Processing</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </th>
                <th className="p-3 pr-6 text-right w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
              {paginatedPayments.map((item) => (
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
                        {item.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-xs">{item.employeeName}</p>
                        <p className="text-[9px] text-gray-400 font-semibold">{item.empId} • {item.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-gray-800">{item.month}</td>
                  <td className="p-3 font-semibold text-gray-600">{item.date}</td>
                  <td className="p-3 font-bold text-gray-850">{formatCurrency(item.amount)}</td>
                  <td className="p-3 font-semibold text-gray-400">{item.method}</td>
                  <td className="p-3 text-[#155dfc] font-bold">{item.txRef}</td>
                  <td className="p-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-gray-405">
                      <button
                        onClick={() => setShowViewDetails(item)}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-55 rounded-lg transition-all shadow-xs cursor-pointer border border-transparent"
                        title="View Detailed Ledger"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditPayment(item)}
                        className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-xs cursor-pointer border border-transparent"
                        title="Edit parameters"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePayment(item.id)}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shadow-xs cursor-pointer border border-transparent"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400 font-bold italic bg-white">
                    No matching employee payment history logs found.
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
              Showing {filteredPayments.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredPayments.length)}` : 0} of {filteredPayments.length} records
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

      {/* --- MODAL 1: Record Salary Payout --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showAddPayment ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-visible flex flex-col transition-all duration-300 transform ${showAddPayment ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          
          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Record Salary Payout</h3>
                <p className="text-[10px] text-gray-405 font-semibold">Log a salary transfer reference for an employee</p>
              </div>
            </div>
            <button onClick={() => { setShowAddPayment(false); setShowEmployeeDropdown(false); }} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 flex-1 text-xs overflow-visible">
            
            {/* Searchable Custom Employee Selector Dropdown */}
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
                  <div className="absolute top-[60px] left-0 right-0 bg-white rounded-xl shadow-xl z-50 p-2 space-y-2">
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
                              employeeDept: emp.dept
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
                        <p className="p-3 text-center text-gray-455 italic text-[11px]">No matching employees found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Payout Month <span className="text-red-500">*</span></label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Disbursal Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Net Salary Paid (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  placeholder="e.g. 95000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Transaction Ref <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="TXN..."
                  value={formData.txRef}
                  onChange={(e) => setFormData({ ...formData, txRef: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Payment Channel <span className="text-red-500">*</span></label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full text-xs border border-gray-205 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="Bank HDFC IMPS">Bank HDFC IMPS Transfer</option>
                <option value="ICICI Corporate API">ICICI Corporate API Gateway</option>
                <option value="HSBC NetBanking">HSBC NetBanking Wire</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Payout Status <span className="text-red-500">*</span></label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs border border-gray-205 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="Success">Success (Completed)</option>
                <option value="Processing">Processing (Initiated)</option>
                <option value="Failed">Failed (Aborted)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <button
              onClick={() => setShowAddPayment(false)}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-550 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 2: Edit Payout Record --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showEditPayment ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 transform ${showEditPayment ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showEditPayment && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Edit Payout record</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Modify statement parameters for {editFormData.employee}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditPayment(null)} className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Selected Employee</label>
                  <input
                    type="text"
                    disabled
                    value={`${editFormData.employee} (${editFormData.employeeId})`}
                    className="w-full bg-slate-100 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Payout Month <span className="text-red-500">*</span></label>
                    <input
                      type="month"
                      value={editFormData.month}
                      onChange={(e) => setEditFormData({ ...editFormData, month: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Disbursal Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Net Salary Paid (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Transaction Ref <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editFormData.txRef}
                      onChange={(e) => setEditFormData({ ...editFormData, txRef: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Payment Channel <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.method}
                    onChange={(e) => setEditFormData({ ...editFormData, method: e.target.value })}
                    className="w-full text-xs border border-gray-205 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="Bank HDFC IMPS">Bank HDFC IMPS Transfer</option>
                    <option value="ICICI Corporate API">ICICI Corporate API Gateway</option>
                    <option value="HSBC NetBanking">HSBC NetBanking Wire</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Payout Status <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full text-xs border border-gray-205 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="Success">Success (Completed)</option>
                    <option value="Processing">Processing (Initiated)</option>
                    <option value="Failed">Failed (Aborted)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <button
                  onClick={() => setShowEditPayment(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-550 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Update parameters</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL 3: View Payment details --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showViewDetails ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${showViewDetails ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showViewDetails && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#155dfc] flex items-center justify-center text-white text-xs font-bold border border-blue-200">
                    {showViewDetails.employeeName?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-805">{showViewDetails.employeeName}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Salary transaction record ID: {showViewDetails.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowViewDetails(null)} className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-gray-600">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Employee Reference info</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Employee ID:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.empId}</p>
                    <p>Department:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.dept}</p>
                    <p>Designation:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.designation}</p>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Transaction parameters</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Payroll Cycle Month:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.month}</p>
                    <p>Disbursal Date:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.date}</p>
                    <p>Transaction Channel:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.method}</p>
                    <p>Transaction Ref ID:</p>
                    <p className="font-bold text-blue-600 text-right">{showViewDetails.txRef}</p>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl p-3.5 bg-emerald-50/50 border-emerald-100">
                  <div className="grid grid-cols-2 gap-2 text-emerald-800">
                    <p className="font-bold">Net Salary Paid:</p>
                    <p className="font-bold text-right">{formatCurrency(showViewDetails.amount)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-450">Run Status:</span>
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

      {/* --- POPUP MODAL: Delete Confirmation Dialog --- */}
      <div className={`fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${deleteConfirmation.isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 transform ${deleteConfirmation.isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}>
          <div className="p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 text-rose-650 rounded-full flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-none" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{deleteConfirmation.title}</h3>
              <p className="text-[11px] text-gray-455 font-semibold mt-1.5 leading-relaxed">{deleteConfirmation.message}</p>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 flex gap-2 justify-end border-t border-gray-100">
            <button
              onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
              className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-gray-555 rounded-lg text-[11px] font-semibold cursor-pointer shadow-xs"
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

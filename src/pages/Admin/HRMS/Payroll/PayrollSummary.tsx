import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Download,
  CheckCircle2,
  Users,
  IndianRupee,
  Clock,
  AlertCircle,
  ChevronDown,
  Filter,
  CheckSquare,
  Square,
  FileText,
  Building,
  Wallet,
  Zap,
  Eye,
  Edit2,
  Share2,
  X,
  Lock,
  Search,
  Calendar,
  Trash2,
  Check,
  AlertTriangle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../lib/api";

// --- Custom Components ---

const StatCard = ({ icon: Icon, label, value, subtext, trend, color }: any) => {
  const bgLightMap: any = {
    "bg-blue-500": "bg-blue-50 text-blue-600 border-blue-100",
    "bg-purple-500": "bg-purple-50 text-purple-600 border-purple-100",
    "bg-emerald-500": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "bg-amber-500": "bg-amber-50 text-amber-600 border-amber-100",
  };
  const theme = bgLightMap[color] || "bg-slate-50 text-slate-655 border-slate-100";
  const [bgClass, textClass, borderClass] = theme.split(" ");

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-3.5 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group">
      <div className={`p-2.5 rounded-lg border ${bgClass} ${borderClass} group-hover:scale-105 transition-transform duration-300`}>
        <Icon className={`w-4 h-4 ${textClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-base font-bold text-gray-800 mt-0.5">{value}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          {trend && (
            <span className={`text-[9px] font-semibold px-1 py-0.5 rounded flex items-center gap-0.5 ${trend.type === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {trend.type === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {trend.text}
            </span>
          )}
          {subtext && <span className="text-[9px] text-gray-400 font-semibold">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Completed: { bg: "bg-emerald-50 border-emerald-100/50", text: "text-emerald-700", icon: CheckCircle2 },
    Active: { bg: "bg-blue-50 border-blue-100/50", text: "text-blue-700", icon: Clock },
    Processing: { bg: "bg-indigo-50 border-indigo-150 text-indigo-700 animate-pulse", text: "text-indigo-700", icon: Clock },
    Draft: { bg: "bg-amber-50 border-amber-100/50", text: "text-amber-700", icon: AlertCircle },
  };
  const { bg, text, icon: Icon } = config[status as keyof typeof config] || config.Active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${bg} ${text} shadow-sm`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const TrendingUp = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 0 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
  </svg>
);

const TrendingDown = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.307a11.95 11.95 0 0 1 5.814 5.519l2.74 1.22m0 0-5.94 2.28m5.94-2.28-2.28-5.941" />
  </svg>
);

// --- Main Component ---

export default function PayrollSummary() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Payroll Processing Hub");
      setHeaderSubtitle("Manage payroll payout runs, cycles, status updates, and compliance records");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Main list of Payroll Batch Runs (Fetched live from backend API)
  const [runsList, setRunsList] = useState<any[]>([]);

  const fetchRunsList = async () => {
    try {
      const res = await api.get('/payroll/runs');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setRunsList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch payroll runs from backend:", err);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const res = await api.get('/payroll/employees');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((emp: any) => {
          const salaryVal = Number(emp.monthly_salary) || (Number(emp.salary) > 0 ? Number(emp.salary) : 0) || (Number(emp.ctc) > 0 ? Math.round(Number(emp.ctc) / 12) : 0);
          return {
            id: emp.empId || `EMP-${emp.id}`,
            name: emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Employee',
            email: emp.email || '',
            dept: emp.department || 'General',
            role: emp.designation || emp.role || 'Staff',
            gross: salaryVal,
            basic: Math.round(salaryVal * 0.5),
            hra: Math.round(salaryVal * 0.2),
            allow: Math.round(salaryVal * 0.3),
            pf: 0,
            tax: 0,
            status: 'Processed'
          };
        });
        setPayrollList(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch employees list:", err);
    }
  };

  useEffect(() => {
    fetchRunsList();
    fetchEmployeesList();
  }, []);

  // Employee details roster (Fetched live from backend API)
  const [payrollList, setPayrollList] = useState<any[]>([]);

  // Applied Drawer Filters
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [appliedDept, setAppliedDept] = useState("all");
  const [appliedRole, setAppliedRole] = useState("all");

  // Temporary drawer filter states (applied on button click)
  const [drawerStatus, setDrawerStatus] = useState("all");
  const [drawerDept, setDrawerDept] = useState("all");
  const [drawerRole, setDrawerRole] = useState("all");

  // Column-wise Search States
  const [searchPeriod, setSearchPeriod] = useState("");
  const [searchDates, setSearchDates] = useState("");
  const [searchYear, setSearchYear] = useState("all");
  const [searchStatus, setSearchStatus] = useState("all");

  // Roster details modal Search State
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  // Pay Period cycle switcher
  const [payPeriod, setPayPeriod] = useState("June 2026");

  // Interaction controls
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Delete confirmation modal state
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

  // Modals state
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
  const [runPayrollStep, setRunPayrollStep] = useState(1);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  const [selectedRunDetails, setSelectedRunDetails] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeEmployeeDetail, setActiveEmployeeDetail] = useState<any | null>(null);

  // Run Payroll Modal specific states
  const [runPayrollMonth, setRunPayrollMonth] = useState("July");
  const [runPayrollYear, setRunPayrollYear] = useState("2026");
  const [runPayrollEmpSearch, setRunPayrollEmpSearch] = useState("");
  const [runPayrollSelectedEmpIds, setRunPayrollSelectedEmpIds] = useState<string[]>([]);

  // Status for each employee's component finalization per run:
  const [runEmployeeStatus, setRunEmployeeStatus] = useState<any>({
    "RUN-001": {
      "PAY-092": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-093": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-094": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-095": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-096": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-097": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-098": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-099": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-100": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-101": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
    },
    "RUN-002": {
      "PAY-092": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-093": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-094": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-095": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-096": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-097": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-098": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-099": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-100": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-101": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
    },
    "RUN-003": {
      "PAY-092": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-093": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-094": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-095": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-096": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-097": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-098": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-099": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-100": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
      "PAY-101": { attendance: true, advance: true, reimbursements: true, incentives: true, tds: true, finalized: true },
    }
  });

  // Finalization states for the current employee finalize view
  const [finalizingEmployee, setFinalizingEmployee] = useState<any | null>(null);
  const [finalizingRunId, setFinalizingRunId] = useState<string | null>(null);
  const [activeFinalizeTab, setActiveFinalizeTab] = useState<string>("attendance");
  const isEmployeeFinalized = (selectedRunDetails && finalizingEmployee)
    ? (runEmployeeStatus[selectedRunDetails.id]?.[finalizingEmployee.id]?.finalized || false)
    : false;
  const lopCutAmount = finalizingEmployee ? Math.round((finalizingEmployee.gross / 30) * 2) : 0;
  const netPayout = finalizingEmployee
    ? (finalizingEmployee.gross - lopCutAmount + 10000 + 3700 - finalizingEmployee.pf - finalizingEmployee.tax - 5000)
    : 0;

  // Sync temporary drawer states when drawer opens
  useEffect(() => {
    if (isSideFilterOpen) {
      setDrawerStatus(appliedStatus);
      setDrawerDept(appliedDept);
      setDrawerRole(appliedRole);
    }
  }, [isSideFilterOpen, appliedStatus, appliedDept, appliedRole]);

  // Roster dynamic lookup based on active filters
  const getFilteredEmployeesForRun = (runId: string) => {
    const run = runsList.find(r => r.id === runId);
    if (!run || !run.selectedEmpIds || run.selectedEmpIds.length === 0) {
      return [];
    }
    const empIdsSet = new Set(run.selectedEmpIds.map((id: any) => String(id).toLowerCase().trim()));
    return payrollList.filter(emp => {
      const empIdStr = String(emp.id).toLowerCase().trim();
      if (!empIdsSet.has(empIdStr)) return false;
      if (appliedDept !== "all" && emp.dept !== appliedDept) return false;
      if (appliedRole !== "all" && emp.role !== appliedRole) return false;
      return true;
    });
  };

  // Apply column filters dynamically
  const filteredRuns = runsList.filter(item => {
    if (appliedStatus !== "all" && item.status !== appliedStatus) return false;
    if (searchStatus !== "all" && item.status !== searchStatus) return false;
    if (searchPeriod.trim() !== "" && !item.period.toLowerCase().includes(searchPeriod.toLowerCase())) return false;
    if (searchDates.trim() !== "" && !item.dates.toLowerCase().includes(searchDates.toLowerCase())) return false;

    // Check if run has matching filtered employees
    if (appliedDept !== "all" || appliedRole !== "all") {
      const matchCount = getFilteredEmployeesForRun(item.id).length;
      if (matchCount === 0) return false;
    }

    // Filter by year dropdown (replaces employees search)
    if (searchYear !== "all") {
      const runYear = item.period.split(" ")[1] || "2026";
      if (runYear !== searchYear) return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRuns.length / pageSize);
  const paginatedRuns = filteredRuns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic calculations for Stats Cards
  const stats = {
    totalRuns: runsList.length,
    activeRuns: runsList.filter(r => r.status === "Active" || r.status === "Processing").length,
    completedRuns: runsList.filter(r => r.status === "Completed").length,
    totalProcessed: runsList.filter(r => r.status === "Completed").reduce((sum, r) => sum + r.amount, 0),
  };

  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString('en-IN');
  };

  const formatAmountInLakhs = (amount: number) => {
    const lakhs = amount / 100000;
    return "₹" + lakhs.toFixed(1) + "L";
  };

  const handleResetFilters = () => {
    setSearchPeriod("");
    setSearchDates("");
    setSearchYear("all");
    setSearchStatus("all");

    setDrawerStatus("all");
    setDrawerDept("all");
    setDrawerRole("all");
    setAppliedStatus("all");
    setAppliedDept("all");
    setAppliedRole("all");

    setIsSideFilterOpen(false);
    toast.success("Filters reset successfully");
  };

  const handleApplyFilters = () => {
    setAppliedStatus(drawerStatus);
    setAppliedDept(drawerDept);
    setAppliedRole(drawerRole);
    setIsSideFilterOpen(false);
    toast.success("Filters applied successfully");
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(row => row !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedRuns.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedRuns.map(item => item.id));
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.patch(`/payroll/runs/${id}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Status for ${id} updated to ${newStatus}`);
        fetchRunsList();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
    setActiveDropdownId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected payroll run(s)? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await api.post('/payroll/runs/bulk-delete', { ids: selectedRows });
          if (res.data && res.data.success) {
            toast.success("Selected payroll runs deleted successfully");
            setSelectedRows([]);
            fetchRunsList();
          }
        } catch (err) {
          console.error("Error deleting runs:", err);
          toast.error("Failed to delete selected payroll runs");
        } finally {
          setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteSingleRun = (id: string, period: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete the payroll run for "${period}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await api.delete(`/payroll/runs/${id}`);
          if (res.data && res.data.success) {
            toast.success(`Payroll run for ${period} deleted successfully`);
            setSelectedRows(prev => prev.filter(rowId => rowId !== id));
            fetchRunsList();
          }
        } catch (err) {
          console.error("Error deleting run:", err);
          toast.error("Failed to delete payroll run");
        } finally {
          setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Run payroll batch addition (Backend-connected)
  const handleRunPayrollComplete = async () => {
    if (runPayrollSelectedEmpIds.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }
    try {
      const res = await api.post('/payroll/runs', {
        month: runPayrollMonth,
        year: runPayrollYear,
        selectedEmpIds: runPayrollSelectedEmpIds
      });

      if (res.data && res.data.success) {
        toast.success("Payroll run successfully initialized. Status is Processing.");
        setShowRunPayrollModal(false);
        setRunPayrollEmpSearch("");
        setRunPayrollSelectedEmpIds([]);
        fetchRunsList();
      } else {
        toast.error(res.data?.message || "Failed to initialize payroll run");
      }
    } catch (err) {
      console.error("Error creating payroll run:", err);
      toast.error("Failed to initialize payroll run");
    }
  };

  // Export Data (Exports Batch runs details as a CSV file)
  const handleExportData = () => {
    const headers = ["ID", "Period", "Cycle Dates", "Employees Count", "Total Amount", "Status"];
    const rows = runsList.map(run => [
      run.id,
      run.period,
      `"${run.dates}"`,
      getFilteredEmployeesForRun(run.id).length,
      getFilteredEmployeesForRun(run.id).reduce((sum, emp) => sum + emp.gross, 0),
      run.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_runs_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Batch Payroll Run details successfully exported as CSV!");
  };

  // Download Slip (Downloads individual run payslips text file)
  const handleDownloadSlip = (run: any) => {
    const activeEmployees = getFilteredEmployeesForRun(run.id);
    const content = `Payroll Payslips Summary for Period: ${run.period}\nCycle Dates: ${run.dates}\nTotal Employees: ${activeEmployees.length}\nTotal Amount: ${activeEmployees.reduce((sum, emp) => sum + emp.gross, 0)}\nStatus: ${run.status}\n\nProcessed Employee List:\n` +
      activeEmployees.map(emp => `- ${emp.id} | ${emp.name} | ${emp.dept} | Gross: ${formatCurrency(emp.gross)}`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payslip_summary_${run.period.replace(' ', '_')}.txt`;
    link.click();
    toast.success(`Payslips summary document downloaded for ${run.period}!`);
  };

  const handleOpenPayslipInNewTab = (emp: any) => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Popup blocker prevented opening the payslip. Please enable popups.");
      return;
    }

    const netSalary = emp.gross - emp.pf - emp.tax - 200;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${emp.name}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; padding: 0 !important; }
            .shadow-lg { box-shadow: none !important; }
            .border { border: none !important; }
          }
        </style>
      </head>
      <body class="bg-slate-50 p-8">
        <div class="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-150 shadow-lg overflow-hidden my-4">
          <!-- Logo & Header Section -->
          <div class="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl font-extrabold tracking-wider bg-blue-600 text-white px-3 py-1 rounded-lg">H</span>
                <h2 class="text-lg font-bold tracking-wide">HOUSLY TECHNOLOGIES</h2>
              </div>
              <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-2">Monthly Salary Statement</p>
            </div>
            <div class="text-right">
              <span class="inline-flex px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold">${selectedRunDetails?.period || 'Monthly'} Cycle</span>
              <p class="text-[10px] text-gray-400 font-mono mt-2">Ref ID: TXN-${Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          <!-- Body Content -->
          <div class="p-8 space-y-6">
            <!-- Employee Grid Info -->
            <div class="grid grid-cols-3 gap-4 border border-gray-100 rounded-xl p-4 bg-slate-50/50">
              <div>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Employee Name</span>
                <p class="font-bold text-gray-800 text-sm mt-0.5">${emp.name}</p>
              </div>
              <div>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Employee ID</span>
                <p class="font-bold text-gray-750 text-sm mt-0.5">${emp.id}</p>
              </div>
              <div>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Department</span>
                <p class="font-bold text-gray-755 text-sm mt-0.5">${emp.dept}</p>
              </div>
              <div class="pt-2">
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Designation</span>
                <p class="font-bold text-gray-755 text-sm mt-0.5">${emp.role}</p>
              </div>
              <div class="pt-2">
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Email Address</span>
                <p class="font-bold text-gray-755 text-sm mt-0.5">${emp.email || '-'}</p>
              </div>
              <div class="pt-2">
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Payment Status</span>
                <p class="font-bold text-emerald-600 text-sm mt-0.5">Credited</p>
              </div>
            </div>

            <!-- Financial Table Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Earnings Block -->
              <div class="border border-gray-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                <div class="bg-slate-50 px-4 py-2.5 border-b border-gray-150 flex justify-between items-center font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>Earnings</span>
                  <span class="text-emerald-600">Credit</span>
                </div>
                <div class="divide-y divide-gray-100 p-2 text-xs font-semibold">
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">Basic Salary</span>
                    <span class="text-gray-800 font-bold">₹${emp.basic.toLocaleString("en-IN")}</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">House Rent Allowance (HRA)</span>
                    <span class="text-gray-800 font-bold">₹${emp.hra.toLocaleString("en-IN")}</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">Special Allowance</span>
                    <span class="text-gray-800 font-bold">₹${emp.allow.toLocaleString("en-IN")}</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5 border-t border-gray-200 bg-slate-50/50 mt-1 font-bold text-gray-850">
                    <span>Gross Salary</span>
                    <span>₹${emp.gross.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <!-- Deductions Block -->
              <div class="border border-gray-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
                <div class="bg-slate-50 px-4 py-2.5 border-b border-gray-150 flex justify-between items-center font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>Deductions</span>
                  <span class="text-red-600">Debit</span>
                </div>
                <div class="divide-y divide-gray-100 p-2 text-xs font-semibold">
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">EPF Contribution</span>
                    <span class="text-red-500 font-bold">-₹${emp.pf.toLocaleString("en-IN")}</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">Income Tax (TDS)</span>
                    <span class="text-red-500 font-bold">-₹${emp.tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5">
                    <span class="text-gray-500 font-medium">Professional Tax</span>
                    <span class="text-red-500 font-bold">-₹200</span>
                  </div>
                  <div class="flex justify-between py-2 px-2.5 border-t border-gray-200 bg-slate-50/50 mt-1 font-bold text-red-600">
                    <span>Total Deductions</span>
                    <span>-₹${(emp.pf + emp.tax + 200).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Net Payout summary bar -->
            <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex justify-between items-center shadow-inner">
              <div>
                <span class="text-[9px] text-emerald-700 font-extrabold uppercase tracking-widest">Net Take-Home Salary</span>
                <p class="text-[10px] text-emerald-500 font-medium mt-0.5">Credited to employee bank account</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-extrabold text-emerald-700">₹${netSalary.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <!-- Print Actions block -->
            <div class="flex justify-end gap-3 no-print pt-6 border-t border-gray-100">
              <button onclick="window.close()" class="cursor-pointer px-5 py-2 border border-gray-250 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-gray-500 shadow-sm transition-colors">
                Close View
              </button>
              <button onclick="window.print()" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-5 py-2.5 shadow-md transition-colors flex items-center gap-2">
                Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  // Modal employee search filter list
  const filteredModalEmployees = payrollList.filter(emp => {
    if (selectedRunDetails) {
      const empIds = selectedRunDetails.selectedEmpIds || [];
      if (!empIds.includes(emp.id)) return false;
    }

    if (modalSearchQuery.trim() === "") return true;
    const query = modalSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 w-full space-y-6 bg-gray-50/50 lg:h-[calc(100vh-40px)] lg:overflow-hidden flex flex-col min-h-screen lg:min-h-0 text-gray-655 font-medium">
      <Toaster position="top-right" />

      {/* Animation Styles Injector */}
      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.96);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .modal-animate-scale {
          animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-backdrop {
          animation: fadeIn 0.18s ease-out forwards;
        }
      `}</style>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Total Runs"
          value={stats.totalRuns}
          subtext="Configured cycles"
          trend={{ type: "up", text: "+1" }}
          color="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          label="Active Runs"
          value={stats.activeRuns}
          subtext="In execution"
          color="bg-purple-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedRuns}
          subtext="Successfully disbursed"
          trend={{ type: "up", text: "+1" }}
          color="bg-emerald-500"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Processed"
          value={formatAmountInLakhs(stats.totalProcessed)}
          subtext="Net payouts"
          trend={{ type: "up", text: "+4.2%" }}
          color="bg-amber-500"
        />
      </div>

      {/* Main Single Column Table Layout (Scrolls internally if data exceeds height, outer page is locked) */}
      <div className="w-full flex-1 lg:overflow-hidden flex flex-col min-h-0">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* ACTION HEADER (Locked at top of card) */}
          <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Payroll Batches / Cycles</span>
            </div>

            {/* Operations buttons wrapper */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Select Period Dropdown */}
              <div className="relative">
                <select
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-8 pr-8 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all cursor-pointer shadow-xs"
                >
                  <option>June 2026</option>
                  <option>May 2026</option>
                  <option>April 2026</option>
                  <option>March 2026</option>
                </select>
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Side Filter Button */}
              <button
                onClick={() => setIsSideFilterOpen(true)}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${appliedStatus !== "all" || appliedDept !== "all" || appliedRole !== "all"
                  ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-slate-55"
                  }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Run Payroll (Payroll Button) */}
              <button
                onClick={() => setShowRunPayrollModal(true)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Run Payroll</span>
              </button>

              {/* Delete Selected Button */}
              {selectedRows.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all border border-rose-100 animate-pulse"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedRows.length})</span>
                </button>
              )}

              {/* Working Export Data Button */}
              <button
                onClick={handleExportData}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-all border border-blue-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* DATA TABLE (Scrollable wrapper, fills exactly remaining height) */}
          <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
            <table className="w-full border-collapse text-left text-xs">

              {/* FIXED COLUMN-WISE SEARCH HEADER AT TOP-0 RELATIVE TO SCROLL */}
              <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                  <th className="p-3 pl-6 w-10">
                    <button onClick={toggleAll} className="cursor-pointer hover:text-gray-700 transition-colors">
                      {selectedRows.length === paginatedRuns.length && paginatedRuns.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </th>

                  {/* Period Search */}
                  <th className="p-3 min-w-[130px]">
                    <div className="space-y-1">
                      <div>Period</div>
                      <input
                        type="text"
                        placeholder="Search Period..."
                        value={searchPeriod}
                        onChange={(e) => setSearchPeriod(e.target.value)}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* Dates Search */}
                  <th className="p-3 min-w-[180px]">
                    <div className="space-y-1">
                      <div>Cycle Dates</div>
                      <input
                        type="text"
                        placeholder="Search Dates..."
                        value={searchDates}
                        onChange={(e) => setSearchDates(e.target.value)}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  {/* Year Selector (Replaces Employees Search) */}
                  <th className="p-3 min-w-[120px]">
                    <div className="space-y-1">
                      <div>Employee</div>
                      <select
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="all">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                  </th>

                  <th className="p-3">Total Amount</th>

                  {/* Status Search */}
                  <th className="p-3 min-w-[110px]">
                    <div className="space-y-1">
                      <div>Status</div>
                      <select
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                  </th>

                  <th className="p-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                {paginatedRuns.map((run) => {
                  const matchingEmployees = getFilteredEmployeesForRun(run.id);
                  const totalAmount = matchingEmployees.reduce((sum, emp) => sum + emp.gross, 0);
                  return (
                    <tr key={run.id} className="hover:bg-slate-50/45 transition-colors group">
                      <td className="p-4 pl-6">
                        <button onClick={() => toggleRow(run.id)} className="hover:text-gray-700 transition-colors">
                          {selectedRows.includes(run.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-800">{run.period}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-655 font-normal">{run.dates}</td>
                      <td className="p-4 text-gray-700 font-semibold">{matchingEmployees.length} Employees</td>
                      <td className="p-4 text-gray-900 font-semibold">{formatCurrency(totalAmount)}</td>
                      <td className="p-4">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="p-4 pr-6 text-right relative">
                        <div className="flex items-center justify-end gap-2 text-gray-455">
                          {/* Actions: view, edit, share, slip */}
                          <button
                            onClick={() => {
                              setSelectedRunDetails(run);
                              setModalSearchQuery(""); // reset search
                              setShowDetailsModal(true);
                            }}
                            className="cursor-pointer p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 transition-all shadow-xs"
                            title="View Employees"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setActiveDropdownId(activeDropdownId === run.id ? null : run.id)}
                            className={`cursor-pointer p-1.5 rounded-lg border transition-all shadow-xs ${activeDropdownId === run.id ? "text-amber-600 bg-amber-50 border-amber-200" : "border-gray-100 hover:text-amber-600 hover:bg-amber-55"
                              }`}
                            title="Edit Status"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Payroll Run ${run.period}: Total Payout ${formatCurrency(totalAmount)}`);
                              toast.success("Share summary details copied to clipboard!");
                            }}
                            className="cursor-pointer p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-gray-100 transition-all shadow-xs"
                            title="Share Link"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadSlip(run)}
                            className="cursor-pointer p-1.5 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-gray-100 transition-all shadow-xs"
                            title="Download Slip"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingleRun(run.id, run.period)}
                            className="cursor-pointer p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-gray-100 transition-all shadow-xs"
                            title="Delete Payroll Run"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Dropdown status update menu */}
                        {activeDropdownId === run.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveDropdownId(null)} />
                            <div className="absolute right-6 top-10 w-28 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 text-left">
                              <button
                                onClick={() => updateStatus(run.id, "Completed")}
                                className="cursor-pointer w-full px-3 py-1.5 text-[11px] text-gray-655 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Completed
                              </button>
                              <button
                                onClick={() => updateStatus(run.id, "Active")}
                                className="cursor-pointer w-full px-3 py-1.5 text-[11px] text-gray-655 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Active
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {paginatedRuns.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 text-sm font-semibold italic bg-white">
                      No matching payroll runs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL (Locked at bottom of card) */}
          <div className="border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-xs font-semibold">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-650"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-xs font-semibold">
                Showing {filteredRuns.length > 0 ? `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredRuns.length)}` : 0} of {filteredRuns.length} runs
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-slate-55"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="cursor-pointer p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SLIDE-OUT FILTER SIDEBAR DRAWER (Smooth Transition) --- */}
      <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isSideFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsSideFilterOpen(false)} />
        <div className={`relative w-80 bg-white h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between z-10 transition-transform duration-300 ease-out transform ${isSideFilterOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="flex justify-between items-center pb-4 border-b border-gray-150">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-gray-800">Filter Payroll</h3>
            </div>
            <button onClick={() => setIsSideFilterOpen(false)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 py-6 flex-1 overflow-y-auto">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-450 uppercase tracking-wider block">Status</label>
              <select
                value={drawerStatus}
                onChange={(e) => setDrawerStatus(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Active">Active</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-455 uppercase tracking-wider block">Department</label>
              <select
                value={drawerDept}
                onChange={(e) => setDrawerDept(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-gray-750 cursor-pointer"
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

            {/* Designation/Role Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-455 uppercase tracking-wider block">Designation / Role</label>
              <select
                value={drawerRole}
                onChange={(e) => setDrawerRole(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-gray-750 cursor-pointer"
              >
                <option value="all">All Designations</option>
                <option value="MTS-2">MTS-2</option>
                <option value="Design Lead">Design Lead</option>
                <option value="Account Executive">Account Executive</option>
                <option value="Recruiter Manager">Recruiter Manager</option>
                <option value="Product Designer">Product Designer</option>
                <option value="Staff Engineer">Staff Engineer</option>
                <option value="Senior Analyst">Senior Analyst</option>
                <option value="Operations Lead">Operations Lead</option>
                <option value="SysAdmin">SysAdmin</option>
                <option value="Sales Lead">Sales Lead</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 flex gap-3">
            <button onClick={handleResetFilters} className="flex-1 px-4 py-2.5 border border-gray-200 bg-white hover:bg-slate-55 text-gray-550 text-xs font-semibold rounded-xl transition-all shadow-sm">Reset</button>
            <button onClick={handleApplyFilters} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm text-center">Apply Filters</button>
          </div>
        </div>
      </div>
      {/* --- POPUP MODAL: Run Payroll Batch (Step reviews) --- */}
      {showRunPayrollModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in-backdrop">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col modal-animate-scale max-h-[85vh]">

            {/* Header */}
            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                  <Zap className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Run Payroll Processing</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">Configure pay period cycle and select employees</p>
                </div>
              </div>
              <button
                onClick={() => setShowRunPayrollModal(false)}
                className="cursor-pointer text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 flex-1 text-xs overflow-y-auto scrollbar-none">
              
              {/* Cycle Period Selection Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Month</label>
                  <select
                    value={runPayrollMonth}
                    onChange={(e) => setRunPayrollMonth(e.target.value)}
                    className="cursor-pointer w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-gray-755 shadow-xs"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].map(m => (
                      <option key={m} value={m} className="cursor-pointer">{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Year</label>
                  <select
                    value={runPayrollYear}
                    onChange={(e) => setRunPayrollYear(e.target.value)}
                    className="cursor-pointer w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-gray-755 shadow-xs"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 3 + i).map(y => (
                      <option key={y} value={y} className="cursor-pointer">{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Estimated Payout Summary Card */}
              {runPayrollSelectedEmpIds.length > 0 && (
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex justify-between items-center shadow-xs">
                  <div>
                    <span className="text-[9px] text-blue-700 font-extrabold uppercase tracking-wider">Configured Payout Summary</span>
                    <p className="text-[10px] text-blue-500 font-medium mt-0.5">{runPayrollSelectedEmpIds.length} Employee(s) Selected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-blue-700">
                      {formatCurrency(payrollList.filter(e => runPayrollSelectedEmpIds.includes(e.id)).reduce((sum, e) => sum + e.gross, 0))}
                    </p>
                    <p className="text-[9px] text-blue-400 font-medium">Estimated Gross Total</p>
                  </div>
                </div>
              )}

              {/* Employee Selection Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Select Employees</label>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {runPayrollSelectedEmpIds.length} of {payrollList.length} selected
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, employee ID or department..."
                    value={runPayrollEmpSearch}
                    onChange={(e) => setRunPayrollEmpSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 bg-white"
                  />
                  {runPayrollEmpSearch && (
                    <button
                      type="button"
                      onClick={() => setRunPayrollEmpSearch("")}
                      className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Select All Matching Toggle */}
                <div className="flex justify-between items-center px-1 pt-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    Roster List
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const query = runPayrollEmpSearch.toLowerCase();
                      const matching = payrollList.filter(e => 
                        !query || e.name.toLowerCase().includes(query) || e.id.toLowerCase().includes(query) || e.dept.toLowerCase().includes(query)
                      );
                      const matchingIds = matching.map(e => e.id);
                      const allSelected = matchingIds.every(id => runPayrollSelectedEmpIds.includes(id));
                      if (allSelected) {
                        setRunPayrollSelectedEmpIds(prev => prev.filter(id => !matchingIds.includes(id)));
                      } else {
                        setRunPayrollSelectedEmpIds(prev => Array.from(new Set([...prev, ...matchingIds])));
                      }
                    }}
                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-[10px] font-bold"
                  >
                    {payrollList.filter(e => {
                      const q = runPayrollEmpSearch.toLowerCase();
                      return !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q);
                    }).every(e => runPayrollSelectedEmpIds.includes(e.id)) ? "Deselect All Matching" : "Select All Matching"}
                  </button>
                </div>

                {/* List Container: Scrollable without visible scrollbars */}
                <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 bg-slate-50/50 overflow-hidden shadow-xs">
                  <div className="max-h-[220px] overflow-y-auto scrollbar-none">
                    {payrollList
                      .filter(emp => {
                        if (!runPayrollEmpSearch.trim()) return true;
                        const query = runPayrollEmpSearch.toLowerCase();
                        return emp.name.toLowerCase().includes(query) || emp.id.toLowerCase().includes(query) || emp.dept.toLowerCase().includes(query);
                      })
                      .map(emp => {
                        const isSelected = runPayrollSelectedEmpIds.includes(emp.id);
                        return (
                          <div key={emp.id} className="flex items-center justify-between p-2.5 hover:bg-white transition-colors">
                            <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setRunPayrollSelectedEmpIds(prev => prev.filter(id => id !== emp.id));
                                  } else {
                                    setRunPayrollSelectedEmpIds(prev => [...prev, emp.id]);
                                  }
                                }}
                                className="cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                              />
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0D47A1] to-[#1976D2] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                                {emp.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-800">{emp.name}</p>
                                <p className="text-[10px] text-gray-400 font-semibold">{emp.id} • {emp.dept} ({emp.role})</p>
                              </div>
                              <div className="text-right pr-2">
                                <p className="text-xs font-bold text-gray-700">{formatCurrency(emp.gross)}</p>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    {payrollList.filter(emp => {
                      if (!runPayrollEmpSearch.trim()) return true;
                      const query = runPayrollEmpSearch.toLowerCase();
                      return emp.name.toLowerCase().includes(query) || emp.id.toLowerCase().includes(query) || emp.dept.toLowerCase().includes(query);
                    }).length === 0 && (
                      <div className="p-6 text-center text-gray-400 italic">No employees match search criteria.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowRunPayrollModal(false)}
                className="cursor-pointer px-4 py-2 border border-gray-250 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRunPayrollComplete}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 transition-colors inline-flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Initialize Payroll Run
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- POPUP MODAL: Processed/Processing Employees Details --- */}
      {showDetailsModal && selectedRunDetails && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in-backdrop">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col modal-animate-scale max-h-[85vh] md:max-h-[80vh]">

            {/* Check if run is in "Processing" status and an employee is selected for finalization */}
            {selectedRunDetails.status === "Processing" && finalizingEmployee ? (
              <>
                {/* Header */}
                <div className="bg-slate-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold uppercase shadow-md">
                      {finalizingEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-800">Finalize Employee: {finalizingEmployee.name}</h3>
                      <p className="text-[11px] text-gray-400 font-semibold">{finalizingEmployee.id} • {selectedRunDetails.period} Cycle</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFinalizingEmployee(null)}
                    className="text-gray-455 hover:text-gray-700 p-2 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Horizontal premium tabs */}
                <div className="flex border-b border-gray-200 bg-slate-50/50 overflow-x-auto select-none">
                  {[
                    { id: "attendance", label: "Attendance Parameters", icon: Clock },
                    { id: "advance", label: "Advance Recovery", icon: Wallet },
                    { id: "reimbursements", label: "Expense Claims", icon: FileText },
                    { id: "incentives", label: "Bonuses & Perks", icon: Zap },
                    { id: "tds", label: "Tax & TDS Review", icon: IndianRupee },
                    { id: "overview", label: "Overview Summary", icon: CheckCircle2 }
                  ].map(t => {
                    const isCompleted = runEmployeeStatus[selectedRunDetails.id]?.[finalizingEmployee.id]?.[t.id] || false;
                    const isActive = activeFinalizeTab === t.id;
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveFinalizeTab(t.id)}
                        className={`flex-1 py-3.5 px-4 text-center text-[11px] font-bold border-b-2 whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                          isActive
                            ? "border-blue-600 text-blue-600 bg-white shadow-xs"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-slate-100/50"
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                        <span>{t.label}</span>
                        {isCompleted && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content Panels */}
                <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30 text-xs scrollbar-none">
                  
                  {/* Attendance Tab */}
                  {activeFinalizeTab === "attendance" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-805 tracking-wider uppercase">Attendance Statement</h4>
                        <p className="text-[10px] text-slate-400 font-medium">biometric log audit</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>TOTAL CYCLE DAYS</span>
                          <span className="text-slate-700">30 DAYS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>DAYS PRESENT VERIFIED</span>
                          <span className="text-emerald-600 font-semibold">28 DAYS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>UNPAID LEAVES (LOP)</span>
                          <span className="text-rose-650 font-semibold">02 DAYS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>APPROVED PAID LEAVES</span>
                          <span className="text-slate-700">01 DAY</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>AUDITED WORKING DAYS</span>
                        <span>28 / 30 DAYS</span>
                      </div>
                    </div>
                  )}

                  {/* Advance Tab */}
                  {activeFinalizeTab === "advance" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-805 tracking-wider uppercase">Advance Ledger Statement</h4>
                        <p className="text-[10px] text-slate-400 font-medium">salary recovery logs</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>OUTSTANDING BALANCE</span>
                          <span className="text-slate-700">₹5,000.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>RECOVERY DEDUCTION</span>
                          <span className="text-rose-655 font-semibold">-₹5,000.00</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>REMAINING BALANCE</span>
                        <span className="text-emerald-600">₹0.00</span>
                      </div>
                    </div>
                  )}

                  {/* Reimbursements Tab */}
                  {activeFinalizeTab === "reimbursements" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-805 tracking-wider uppercase">Reimbursements Receipt</h4>
                        <p className="text-[10px] text-slate-400 font-medium">approved claims ledger</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>CLIENT LUNCH & TRAVEL</span>
                          <span className="text-slate-700">₹1,500.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>HOME BROADBAND</span>
                          <span className="text-slate-700">₹700.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>OFFICE SUPPLIES</span>
                          <span className="text-slate-700">₹1,500.00</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>NET APPROVED CLAIMS</span>
                        <span className="text-emerald-600">₹3,700.00</span>
                      </div>
                    </div>
                  )}

                  {/* Incentives Tab */}
                  {activeFinalizeTab === "incentives" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-805 tracking-wider uppercase">Incentive Breakdown Receipt</h4>
                        <p className="text-[10px] text-slate-400 font-medium">performance bonus & add-ons</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>KPI PERFORMANCE BONUS</span>
                          <span className="text-emerald-600">+₹7,500.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>INTERNAL REFERRAL REWARD</span>
                          <span className="text-emerald-600 font-bold">+₹2,500.05</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>TOTAL INCENTIVES</span>
                        <span className="text-emerald-600 font-bold">₹10,000.00</span>
                      </div>
                    </div>
                  )}

                  {/* TDS Review Tab */}
                  {activeFinalizeTab === "tds" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-855 tracking-wider uppercase">Tax Projection Advice</h4>
                        <p className="text-[10px] text-slate-400 font-medium">tax deductions pro-rata</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>PROJECTED GROSS MONTHLY</span>
                          <span className="text-slate-700">₹{finalizingEmployee.gross.toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>SEC 80C DEDUCTIONS</span>
                          <span className="text-slate-400">-₹12,500.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>EPF CONTRIBUTION</span>
                          <span className="text-rose-600">-₹{finalizingEmployee.pf.toLocaleString('en-IN')}.00</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>TAX (TDS) LIABILITY</span>
                        <span className="text-rose-600 font-bold">₹{finalizingEmployee.tax.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                  )}

                  {/* Overview Tab */}
                  {activeFinalizeTab === "overview" && (
                    <div className="space-y-4 w-full max-w-xl mx-auto animate-fade-in py-2">
                      <div className="text-center pb-2">
                        <h4 className="text-xs font-bold text-slate-855 tracking-wider uppercase">Consolidated Invoice</h4>
                        <p className="text-[10px] text-slate-400 font-medium">payroll calculations summary</p>
                      </div>
                      
                      <div className="border-y border-dashed border-slate-300 py-3.5 space-y-3 text-[11px] text-slate-500 font-medium font-mono">
                        <div className="flex justify-between items-center">
                          <span>BASE GROSS SALARY</span>
                          <span className="text-slate-700 font-semibold">₹{finalizingEmployee.gross.toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>LOP ATTENDANCE CUT</span>
                          <span className="text-rose-600 font-bold">-₹{Math.round((finalizingEmployee.gross / 30) * 2).toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>BONUSES & INCENTIVES</span>
                          <span className="text-emerald-650 font-bold">+₹10,000.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>APPROVED CLAIMS</span>
                          <span className="text-emerald-655 font-bold">+₹3,700.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>EPF CONTRIBUTION</span>
                          <span className="text-rose-600 font-bold">-₹{finalizingEmployee.pf.toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>TDS TAX DEDUCTION</span>
                          <span className="text-rose-600 font-bold">-₹{finalizingEmployee.tax.toLocaleString('en-IN')}.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ADVANCE RECOVERY DEDUCTION</span>
                          <span className="text-rose-600 font-bold">-₹5,000.00</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-1 font-mono">
                        <span>NET TAKE-HOME PAYOUT</span>
                        <span className="text-emerald-700 text-sm font-extrabold">₹{(finalizingEmployee.gross - Math.round((finalizingEmployee.gross / 30) * 2) + 10000 + 3700 - finalizingEmployee.pf - finalizingEmployee.tax - 5000).toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer buttons */}
                <div className="bg-slate-50 border-t border-gray-150 px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => setFinalizingEmployee(null)}
                    className="px-4 py-2 border border-gray-250 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm transition-all"
                  >
                    Back to Employee Roster
                  </button>

                  {activeFinalizeTab !== "overview" ? (
                    <button
                      onClick={() => {
                        if (!isEmployeeFinalized) {
                          setRunEmployeeStatus((prev: any) => {
                            const nextState = { ...prev[selectedRunDetails.id]?.[finalizingEmployee.id] };
                            nextState[activeFinalizeTab] = true;
                            return {
                              ...prev,
                              [selectedRunDetails.id]: {
                                ...prev[selectedRunDetails.id],
                                [finalizingEmployee.id]: {
                                  ...prev[selectedRunDetails.id][finalizingEmployee.id],
                                  ...nextState
                                }
                              }
                            };
                          });
                        }
                        const tabsOrder = ["attendance", "advance", "reimbursements", "incentives", "tds", "overview"];
                        const nextIdx = tabsOrder.indexOf(activeFinalizeTab) + 1;
                        if (nextIdx < tabsOrder.length) {
                          setActiveFinalizeTab(tabsOrder[nextIdx]);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl px-5 py-2 shadow-md transition-all transform active:scale-97"
                    >
                      {isEmployeeFinalized ? "Next Section" : "Approve and Proceed"}
                    </button>
                  ) : (
                    !isEmployeeFinalized && (
                      <button
                        onClick={() => {
                          setRunEmployeeStatus((prev: any) => ({
                            ...prev,
                            [selectedRunDetails.id]: {
                              ...prev[selectedRunDetails.id],
                              [finalizingEmployee.id]: {
                                attendance: true,
                                advance: true,
                                reimbursements: true,
                                incentives: true,
                                tds: true,
                                finalized: true
                              }
                            }
                          }));
                          setFinalizingEmployee(null);
                          toast.success(`Successfully finalized payroll calculations for ${finalizingEmployee.name}!`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl px-5 py-2 shadow-md transition-all transform active:scale-97"
                      >
                        Finalize Employee Payroll
                      </button>
                    )
                  )}
                </div>
              </>
            ) : selectedRunDetails.status === "Processing" ? (
              <>
                {/* Modal Title */}
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-blue-650" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">Processing Employees - {selectedRunDetails.period} Batch</h3>
                      <p className="text-[10px] text-gray-400 font-semibold">{selectedRunDetails.dates}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowDetailsModal(false); setSelectedRunDetails(null); }}
                    className="text-gray-455 hover:text-gray-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search query box */}
                <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex justify-between items-center">
                  <div className="relative w-full max-w-sm">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter employee by name, ID, or department..."
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">
                    Roster count: {filteredModalEmployees.length}
                  </div>
                </div>

                {/* Table details */}
                <div className="overflow-auto p-4 flex-1 scrollbar-none">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-xs">
                      <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                        <th className="p-3">Employee Details</th>
                        <th className="p-3">Department & Title</th>
                        <th className="p-3">Gross Salary</th>
                        <th className="p-3">Finalize Status</th>
                        <th className="p-3 pr-4 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                      {filteredModalEmployees.map((item) => {
                        const empStatusObj = runEmployeeStatus[selectedRunDetails.id]?.[item.id];
                        const isEmployeeFinalized = empStatusObj?.finalized || false;
                        return (
                          <tr key={item.id} className="hover:bg-slate-55 transition-colors group">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm border border-blue-200">
                                  {item.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-xs">{item.name}</p>
                                  <p className="text-[9px] text-gray-400 font-semibold">{item.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-655 text-[10px] font-bold">
                                <Building className="w-2.5 h-2.5" />
                                {item.dept}
                              </span>
                            </td>
                            <td className="p-3 text-gray-800 font-bold">{formatCurrency(item.gross)}</td>
                            <td className="p-3">
                              {isEmployeeFinalized ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                                  Finalized
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 animate-pulse">
                                  Pending Review
                                </span>
                              )}
                            </td>
                            <td className="p-3 pr-4 text-right">
                              {isEmployeeFinalized ? (
                                <button
                                  onClick={() => {
                                    setFinalizingEmployee(item);
                                    setActiveFinalizeTab("attendance");
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-[10px] rounded-lg px-3 py-1.5 border border-slate-200 shadow-sm transition-all"
                                >
                                  Review
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setFinalizingEmployee(item);
                                    setActiveFinalizeTab("attendance");
                                  }}
                                  className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-[10px] rounded-lg px-3 py-1.5 transition-colors shadow-sm"
                                >
                                  Finalize
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredModalEmployees.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-400 text-sm font-semibold italic bg-white">
                            No employees are configured in this cycle run.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Cancel & Complete Buttons */}
                <div className="bg-slate-50 border-t border-gray-150 px-6 py-4 flex justify-between items-center">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Payroll Run Status: <span className="text-indigo-650 font-bold animate-pulse">Processing</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedRunDetails(null);
                        toast.success("Payroll remains in Processing state.");
                      }}
                      className="px-4 py-2 border border-gray-250 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setRunsList(prev => prev.map(r => {
                          if (r.id === selectedRunDetails.id) {
                            return { ...r, status: "Completed" };
                          }
                          return r;
                        }));
                        setShowDetailsModal(false);
                        setSelectedRunDetails(null);
                        toast.success("Payroll cycle run successfully completed!");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl px-5 py-2.5 shadow-sm transition-colors"
                    >
                      Complete Payroll
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Original View for historical completed runs
              <>
                <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-650" />
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">Processed Employees - {selectedRunDetails.period} Run</h3>
                      <p className="text-[10px] text-gray-400 font-semibold">{selectedRunDetails.dates}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowDetailsModal(false); setSelectedRunDetails(null); }}
                    className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-200 bg-slate-50/50">
                  <div className="relative max-w-sm">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter by name, email, or employee ID..."
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="overflow-auto p-4 flex-1 scrollbar-none">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-xs">
                      <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                        <th className="p-3">Employee Details</th>
                        <th className="p-3">Dept & Role</th>
                        <th className="p-3">Gross Basic</th>
                        <th className="p-3">Net Salary</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                      {filteredModalEmployees.map((item) => {
                        const net = item.gross - item.pf - item.tax;
                        return (
                          <tr key={item.id} className="hover:bg-slate-55 transition-colors group">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center text-white text-[9px] font-bold shadow-sm border border-blue-200">
                                  {item.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{item.name}</p>
                                  <p className="text-[9px] text-gray-400 font-medium">{item.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-655 text-[10px] font-semibold">
                                <Building className="w-2.5 h-2.5" />
                                {item.dept}
                              </span>
                            </td>
                            <td className="p-3 text-gray-850 font-semibold">{formatCurrency(item.gross)}</td>
                            <td className="p-3 font-semibold text-emerald-600 text-xs">{formatCurrency(net)}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 border-emerald-100/50 text-emerald-700 shadow-sm">
                                Completed
                              </span>
                            </td>
                            <td className="p-3 pr-4 text-right">
                              <button
                                onClick={() => handleOpenPayslipInNewTab(item)}
                                className="cursor-pointer text-blue-600 hover:underline font-semibold"
                              >
                                View Payslip
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredModalEmployees.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 text-sm font-semibold italic bg-white">
                            No employees match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 border-t border-gray-150 px-6 py-4 flex justify-end">
                  <button
                    onClick={() => { setShowDetailsModal(false); setSelectedRunDetails(null); }}
                    className="px-4 py-2 border border-gray-250 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-gray-500 shadow-sm"
                  >
                    Close View
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in-backdrop">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col modal-animate-scale p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800">{deleteConfirmation.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{deleteConfirmation.message}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
                className="cursor-pointer flex-1 py-2.5 border border-gray-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-gray-600 transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirmation.onConfirm}
                className="cursor-pointer flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
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
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
  Calculator,
  Building
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
    "New Regime": { bg: "bg-blue-50 text-blue-700 border-blue-105" },
    "Old Regime": { bg: "bg-purple-50 text-purple-700 border-purple-105" }
  };
  const { bg } = config[status] || { bg: "bg-slate-50 text-slate-700 border-slate-105" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${bg}`}>
      {status}
    </span>
  );
};

// --- Main Component ---

export default function TDS() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Tax Deduction at Source (TDS)");
      setHeaderSubtitle("Manage employee income tax regimes, investment declarations, and monthly YTD liability summaries");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // States
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDeclaration, setShowAddDeclaration] = useState(false);
  const [showEditDeclaration, setShowEditDeclaration] = useState<any | null>(null);
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
    regime: "all",
    c80: "",
    other: "",
    ytdTds: ""
  });

  // Form inputs
  const [formData, setFormData] = useState({
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    employeeDept: "",
    regime: "New Regime",
    c80: "",
    other: "",
    ytdTds: ""
  });

  // Edit Form inputs
  const [editFormData, setEditFormData] = useState({
    id: "",
    employee: "",
    employeeId: "",
    employeeDesignation: "",
    employeeDept: "",
    regime: "New Regime",
    c80: "",
    other: "",
    ytdTds: ""
  });

  // Sample employee database for searchable selector dropdown
  const availableEmployeesDb = [
    { name: "Suraj Kumar", id: "EMP0019", dept: "Engineering", designation: "MTS-2", email: "suraj@hously.co" },
    { name: "Anjali Sharma", id: "EMP0020", dept: "Marketing", designation: "Design Lead", email: "anjali@hously.co" },
    { name: "Vikram Patel", id: "EMP0021", dept: "Sales", designation: "Account Executive", email: "vikram@hously.co" },
    { name: "Kunal Sen", id: "EMP0022", dept: "HR", designation: "Recruiter Manager", email: "kunal@hously.co" },
    { name: "Priya Mehta", id: "EMP0023", dept: "Design", designation: "Product Designer", email: "priya@hously.co" },
    { name: "Rahul Verma", id: "EMP0024", dept: "Engineering", designation: "Staff Engineer", email: "rahul@hously.co" },
    { name: "SHEKH ABDUL", id: "EMP0016", dept: "Operations", designation: "GENERAL MANAGER", email: "abdul@hously.co" }
  ];

  // Declarations list data
  const [declarationsList, setDeclarationsList] = useState([
    { id: "DEC-001", employeeName: "Suraj Kumar", empId: "EMP0019", designation: "MTS-2", dept: "Engineering", regime: "Old Regime", c80: 150000, other: 25000, ytdTds: 45000 },
    { id: "DEC-002", employeeName: "Anjali Sharma", empId: "EMP0020", designation: "Design Lead", dept: "Marketing", regime: "New Regime", c80: 0, other: 0, ytdTds: 18200 },
    { id: "DEC-003", employeeName: "Vikram Patel", empId: "EMP0021", designation: "Account Executive", dept: "Sales", regime: "Old Regime", c80: 120000, other: 15000, ytdTds: 38000 },
    { id: "DEC-004", employeeName: "Kunal Sen", empId: "EMP0022", designation: "Recruiter Manager", dept: "HR", regime: "New Regime", c80: 0, other: 0, ytdTds: 12400 },
    { id: "DEC-005", employeeName: "Priya Mehta", empId: "EMP0023", designation: "Product Designer", dept: "Design", regime: "Old Regime", c80: 150000, other: 30000, ytdTds: 22000 },
    { id: "DEC-006", employeeName: "Rahul Verma", empId: "EMP0024", designation: "Staff Engineer", dept: "Engineering", regime: "New Regime", c80: 0, other: 0, ytdTds: 62000 }
  ]);

  // Statistics summaries
  const stats = {
    projectedTds: declarationsList.reduce((sum, item) => sum + item.ytdTds * 2.5, 0), // Mock factor projection
    declaredCount: declarationsList.filter(item => item.c80 > 0 || item.other > 0).length,
    totalEmployees: declarationsList.length,
    taxRegimeNewCount: declarationsList.filter(item => item.regime === "New Regime").length
  };

  const formatCurrency = (val: number) => {
    return "₹" + val.toLocaleString('en-IN');
  };

  // Filter declarations list
  const filteredDeclarations = declarationsList.filter(item => {
    if (columnFilters.regime !== "all" && item.regime !== columnFilters.regime) return false;
    if (columnFilters.employee && !item.employeeName.toLowerCase().includes(columnFilters.employee.toLowerCase()) && !item.empId.toLowerCase().includes(columnFilters.employee.toLowerCase())) {
      return false;
    }
    if (columnFilters.c80 && !String(item.c80).includes(columnFilters.c80)) return false;
    if (columnFilters.other && !String(item.other).includes(columnFilters.other)) return false;
    if (columnFilters.ytdTds && !String(item.ytdTds).includes(columnFilters.ytdTds)) return false;
    return true;
  });

  // Pagination calculation
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredDeclarations.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredDeclarations.length / numPageSize);
  const paginatedDeclarations = isPageSizeAll ? filteredDeclarations : filteredDeclarations.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

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
    if (selectedRows.length === paginatedDeclarations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedDeclarations.map(item => item.id));
    }
  };

  const handleClearFilters = () => {
    setColumnFilters({
      employee: "",
      regime: "all",
      c80: "",
      other: "",
      ytdTds: ""
    });
    toast.success("Filters cleared");
  };

  const handleAddDeclaration = () => {
    if (!formData.employee) {
      toast.error("Please select an employee");
      return;
    }
    const c80Val = formData.regime === "New Regime" ? 0 : parseFloat(formData.c80 || "0");
    const otherVal = formData.regime === "New Regime" ? 0 : parseFloat(formData.other || "0");
    const tdsVal = parseFloat(formData.ytdTds || "0");

    if (isNaN(c80Val) || isNaN(otherVal) || isNaN(tdsVal)) {
      toast.error("Enter valid numeric tax values");
      return;
    }

    const newDec = {
      id: `DEC-00${declarationsList.length + 1}`,
      employeeName: formData.employee,
      empId: formData.employeeId,
      designation: formData.employeeDesignation,
      dept: formData.employeeDept,
      regime: formData.regime,
      c80: c80Val,
      other: otherVal,
      ytdTds: tdsVal
    };

    setDeclarationsList([newDec, ...declarationsList]);
    setFormData({
      employee: "",
      employeeId: "",
      employeeDesignation: "",
      employeeDept: "",
      regime: "New Regime",
      c80: "",
      other: "",
      ytdTds: ""
    });
    setShowAddDeclaration(false);
    toast.success("Tax declaration added successfully!");
  };

  const handleEditDeclaration = (item: any) => {
    setEditFormData({
      id: item.id,
      employee: item.employeeName,
      employeeId: item.empId,
      employeeDesignation: item.designation,
      employeeDept: item.dept,
      regime: item.regime,
      c80: String(item.c80),
      other: String(item.other),
      ytdTds: String(item.ytdTds)
    });
    setShowEditDeclaration(item);
  };

  const handleUpdateDeclaration = () => {
    const c80Val = editFormData.regime === "New Regime" ? 0 : parseFloat(editFormData.c80 || "0");
    const otherVal = editFormData.regime === "New Regime" ? 0 : parseFloat(editFormData.other || "0");
    const tdsVal = parseFloat(editFormData.ytdTds || "0");

    if (isNaN(c80Val) || isNaN(otherVal) || isNaN(tdsVal)) {
      toast.error("Please enter valid numeric parameters");
      return;
    }

    setDeclarationsList(prev => prev.map(item =>
      item.id === editFormData.id ? {
        ...item,
        regime: editFormData.regime,
        c80: c80Val,
        other: otherVal,
        ytdTds: tdsVal
      } : item
    ));

    setShowEditDeclaration(null);
    toast.success("Declaration adjustments updated successfully!");
  };

  const handleDeleteDeclaration = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this employee's tax declaration request? This action cannot be undone.",
      onConfirm: () => {
        setDeclarationsList(prev => prev.filter(d => d.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Tax declaration record deleted");
      }
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected employee tax declarations? This action cannot be undone.`,
      onConfirm: () => {
        setDeclarationsList(prev => prev.filter(d => !selectedRows.includes(d.id)));
        setSelectedRows([]);
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Selected records deleted successfully");
      }
    });
  };

  return (
    <div className="p-6 w-full space-y-6 bg-gray-50/50 lg:h-[calc(100vh-40px)] lg:overflow-hidden flex flex-col min-h-screen lg:min-h-0 text-gray-655 font-medium">
      <Toaster position="top-right" />

      {/* Inject animation styles */}
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
        <StatCard
          icon={Calculator}
          label="Projected Annual TDS"
          value={formatCurrency(stats.projectedTds)}
          color="bg-purple-500"
          subtitle="Estimated totals for FY 2026-27"
        />
        <StatCard
          icon={CheckCircle2}
          label="Declarations Verified"
          value={`${stats.declaredCount} / ${stats.totalEmployees}`}
          color="bg-amber-500"
          subtitle="Submitted investment declarations"
        />
        <StatCard
          icon={FileText}
          label="Tax Regime Allocations"
          value={`${stats.taxRegimeNewCount} Default`}
          color="bg-blue-500"
          subtitle="Employees under New default Regime"
        />
        <StatCard
          icon={DollarSign}
          label="Form 16 Filing Status"
          value="Q1 Filed"
          color="bg-emerald-500"
          subtitle="Successfully uploaded to NSDL portal"
        />
      </div>

      {/* Main Grid: Declarations table and Slabs Summary panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Declarations list card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col min-h-0 overflow-hidden">
          {/* Table header menu */}
          <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Employee Declarations</h3>
              <span className="bg-blue-50 text-blue-600 font-bold border border-blue-100 px-2 py-0.5 rounded text-[10px]">
                {filteredDeclarations.length} records
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

              {/* Record Declaration Trigger */}
              <button
                onClick={() => setShowAddDeclaration(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm px-4 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Declaration</span>
              </button>
            </div>
          </div>

          {/* Scrollable Declarations Table wrapper */}
          <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm border-b border-gray-200">
                <tr className="bg-slate-50 text-gray-500 font-semibold select-none">
                  <th className="p-3 pl-6 w-10">
                    <button onClick={toggleAll} className="hover:text-gray-700 cursor-pointer transition-colors">
                      {selectedRows.length === paginatedDeclarations.length && paginatedDeclarations.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 min-w-[170px]">
                    <div className="space-y-1">
                      <span>Employee Name</span>
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={columnFilters.employee}
                        onChange={(e) => { setColumnFilters({ ...columnFilters, employee: e.target.value }); setCurrentPage(1); }}
                        className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                      />
                    </div>
                  </th>
                  <th className="p-3 min-w-[115px]">
                    <div className="space-y-1">
                      <span>Tax Regime</span>
                      <select
                        value={columnFilters.regime}
                        onChange={(e) => { setColumnFilters({ ...columnFilters, regime: e.target.value }); setCurrentPage(1); }}
                        className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
                      >
                        <option value="all">All</option>
                        <option value="New Regime">New Regime</option>
                        <option value="Old Regime">Old Regime</option>
                      </select>
                    </div>
                  </th>
                  <th className="p-3 min-w-[125px]">
                    <div className="space-y-1">
                      <span>80C Declarations</span>
                      <input
                        type="text"
                        placeholder="Search 80C..."
                        value={columnFilters.c80}
                        onChange={(e) => { setColumnFilters({ ...columnFilters, c80: e.target.value }); setCurrentPage(1); }}
                        className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                      />
                    </div>
                  </th>
                  <th className="p-3 min-w-[125px]">
                    <div className="space-y-1">
                      <span>80D / Exemptions</span>
                      <input
                        type="text"
                        placeholder="Search 80D..."
                        value={columnFilters.other}
                        onChange={(e) => { setColumnFilters({ ...columnFilters, other: e.target.value }); setCurrentPage(1); }}
                        className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                      />
                    </div>
                  </th>
                  <th className="p-3 min-w-[125px]">
                    <div className="space-y-1">
                      <span>YTD TDS Deducted</span>
                      <input
                        type="text"
                        placeholder="Search TDS..."
                        value={columnFilters.ytdTds}
                        onChange={(e) => { setColumnFilters({ ...columnFilters, ytdTds: e.target.value }); setCurrentPage(1); }}
                        className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                      />
                    </div>
                  </th>
                  <th className="p-3 pr-6 text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                {paginatedDeclarations.map((item) => (
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
                    <td className="p-3">
                      <StatusBadge status={item.regime} />
                    </td>
                    <td className="p-3 font-semibold text-gray-750">
                      {item.regime === "New Regime" ? "N/A (New Regime)" : formatCurrency(item.c80)}
                    </td>
                    <td className="p-3 font-semibold text-gray-750">
                      {item.regime === "New Regime" ? "N/A" : formatCurrency(item.other)}
                    </td>
                    <td className="p-3 font-bold text-gray-850">
                      {formatCurrency(item.ytdTds)}
                    </td>
                    <td className="p-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-gray-405">
                        <button
                          onClick={() => setShowViewDetails(item)}
                          className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-xs cursor-pointer"
                          title="View Detailed Computation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditDeclaration(item)}
                          className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-xs cursor-pointer"
                          title="Edit Parameters"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeclaration(item.id)}
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shadow-xs cursor-pointer"
                          title="Delete declaration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDeclarations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 font-bold italic bg-white">
                      No matching employee tax declarations found.
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
                Showing {filteredDeclarations.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredDeclarations.length)}` : 0} of {filteredDeclarations.length} records
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

        {/* Income Tax Slabs Panel (MNC layout) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-4 overflow-y-auto lg:max-h-full">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 flex-shrink-0">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-xs text-gray-705 uppercase tracking-wider">Income Tax Slabs (FY 2026-27)</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* New Tax Regime default */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>New Tax Regime</span>
                <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-150">Default FY 26-27</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">No deductions (80C, HRA) allowed. Section 87A rebate applies up to ₹7,00,000 taxable net salary.</p>
              
              <div className="divide-y divide-gray-150/50 text-[10px] font-semibold text-gray-600 pt-1 space-y-1">
                <div className="flex justify-between py-1"><span>Up to ₹3,00,000</span> <span className="font-bold text-gray-800">Nil</span></div>
                <div className="flex justify-between py-1"><span>₹3,00,001 - ₹7,00,000</span> <span className="font-bold text-gray-800">5%</span></div>
                <div className="flex justify-between py-1"><span>₹7,00,001 - ₹10,00,000</span> <span className="font-bold text-gray-800">10%</span></div>
                <div className="flex justify-between py-1"><span>₹10,00,001 - ₹12,00,000</span> <span className="font-bold text-gray-800">15%</span></div>
                <div className="flex justify-between py-1"><span>₹12,00,001 - ₹15,00,000</span> <span className="font-bold text-gray-800">20%</span></div>
                <div className="flex justify-between py-1"><span>Above ₹15,00,000</span> <span className="font-bold text-gray-800">30%</span></div>
              </div>
            </div>

            {/* Old Tax Regime card */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center font-bold text-gray-800">
                <span>Old Tax Regime</span>
                <span className="text-[9px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-150">FY 26-27 Options</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Exemptions allowed (80C up to ₹1.5L, 80D up to ₹25k, HRA, LTA, Interest on home loan up to ₹2L).</p>

              <div className="divide-y divide-gray-150/50 text-[10px] font-semibold text-gray-600 pt-1 space-y-1">
                <div className="flex justify-between py-1"><span>Up to ₹2,50,000</span> <span className="font-bold text-gray-800">Nil</span></div>
                <div className="flex justify-between py-1"><span>₹2,50,001 - ₹5,00,000</span> <span className="font-bold text-gray-800">5%</span></div>
                <div className="flex justify-between py-1"><span>₹5,00,001 - ₹10,00,000</span> <span className="font-bold text-gray-800">20%</span></div>
                <div className="flex justify-between py-1"><span>Above ₹10,00,000</span> <span className="font-bold text-gray-800">30%</span></div>
              </div>
            </div>

            {/* Helpful tip box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex gap-2 text-blue-800">
              <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div className="space-y-0.5 font-semibold text-[10px] text-blue-700 leading-relaxed">
                <p className="font-bold text-blue-850">Form 12BB Declaration</p>
                <p>Ensure declarations match physical proofs received by Jan 31st to prevent excess TDS deductions in Q4 payroll runs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: Add Tax Declaration --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showAddDeclaration ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-visible flex flex-col transition-all duration-300 transform ${showAddDeclaration ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          
          <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Record Tax Declaration</h3>
                <p className="text-[10px] text-gray-400 font-semibold">Add tax regime parameter and declared YTD amounts</p>
              </div>
            </div>
            <button onClick={() => { setShowAddDeclaration(false); setShowEmployeeDropdown(false); }} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
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
                        <p className="p-3 text-center text-gray-450 italic text-[11px]">No matching employees found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tax Regime select option */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Selected Tax Regime <span className="text-red-500">*</span></label>
              <select
                value={formData.regime}
                onChange={(e) => setFormData({ ...formData, regime: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
              >
                <option value="New Regime">New Tax Regime (Default)</option>
                <option value="Old Regime">Old Tax Regime (Form 12BB option)</option>
              </select>
            </div>

            {/* Old Regime parameters conditional input boxes */}
            {formData.regime === "Old Regime" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">80C Investments (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Max 150000"
                    value={formData.c80}
                    onChange={(e) => setFormData({ ...formData, c80: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Other Exemptions (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 80D, 24B..."
                    value={formData.other}
                    onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-400 font-semibold leading-relaxed">
                New regime does not allow Section 80C or Section 80D deductions. Declared values will be set to ₹0.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase block">YTD TDS Deducted (₹)</label>
              <input
                type="number"
                placeholder="Total tax already deducted this FY"
                value={formData.ytdTds}
                onChange={(e) => setFormData({ ...formData, ytdTds: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
            <button
              onClick={() => setShowAddDeclaration(false)}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDeclaration}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Declaration</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 2: Edit Declaration parameters --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showEditDeclaration ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 transform ${showEditDeclaration ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {showEditDeclaration && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">Modify Tax Parameters</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Edit tax regime structures for {editFormData.employee}</p>
                  </div>
                </div>
                <button onClick={() => setShowEditDeclaration(null)} className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
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
                    className="w-full bg-slate-100 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Select Tax Regime <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.regime}
                    onChange={(e) => setEditFormData({ ...editFormData, regime: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                  >
                    <option value="New Regime">New Tax Regime (Default)</option>
                    <option value="Old Regime">Old Tax Regime (Form 12BB option)</option>
                  </select>
                </div>

                {editFormData.regime === "Old Regime" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block">80C Investments (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="Max 150000"
                        value={editFormData.c80}
                        onChange={(e) => setEditFormData({ ...editFormData, c80: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block">Other Exemptions (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="e.g. 80D, 24B..."
                        value={editFormData.other}
                        onChange={(e) => setEditFormData({ ...editFormData, other: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-400 font-semibold leading-relaxed">
                    New regime does not allow Section 80C or Section 80D deductions. Declared values will be reset to ₹0.
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">YTD TDS Deducted (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={editFormData.ytdTds}
                    onChange={(e) => setEditFormData({ ...editFormData, ytdTds: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <button
                  onClick={() => setShowEditDeclaration(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDeclaration}
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

      {/* --- MODAL 3: View detailed Tax Computation --- */}
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
                    <p className="text-[10px] text-gray-400 font-semibold">Investment declarations details ({showViewDetails.id})</p>
                  </div>
                </div>
                <button onClick={() => setShowViewDetails(null)} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-gray-600">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Employee Reference info</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Reference ID:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.empId}</p>
                    <p>Department:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.dept}</p>
                    <p>Designation:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.designation}</p>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Declaration & Exemptions</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-750">
                    <p>Tax Regime Scheme:</p>
                    <p className="font-bold text-blue-600 text-right">{showViewDetails.regime}</p>
                    <p>Section 80C Limit:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.regime === "New Regime" ? "N/A" : formatCurrency(showViewDetails.c80)}</p>
                    <p>Section 80D/Other:</p>
                    <p className="font-bold text-gray-855 text-right">{showViewDetails.regime === "New Regime" ? "N/A" : formatCurrency(showViewDetails.other)}</p>
                    <p>Total Exemptions sum:</p>
                    <p className="font-bold text-purple-650 text-right">{showViewDetails.regime === "New Regime" ? "N/A" : formatCurrency(showViewDetails.c80 + showViewDetails.other)}</p>
                  </div>
                </div>

                <div className="border border-slate-150 rounded-xl p-3.5 bg-emerald-50/50 border-emerald-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-emerald-800">
                    <p>YTD TDS Deducted:</p>
                    <p className="font-bold text-right">{formatCurrency(showViewDetails.ytdTds)}</p>
                    <p>Projected Liability:</p>
                    <p className="font-bold text-right">{formatCurrency(showViewDetails.ytdTds * 2.5)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
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

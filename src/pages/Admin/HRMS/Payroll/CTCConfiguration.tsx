import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Settings,
  Plus,
  DollarSign,
  Percent,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  X,
  FileText,
  AlertCircle,
  AlertTriangle,
  Building,
  User,
  PlusCircle,
  Calendar,
  Save,
  Grid,
  CheckSquare,
  Square,
  ChevronDown,
  Search,
  Pencil
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- Custom Component: Stat Card ---
const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const bgLightMap: any = {
    "bg-blue-500": "bg-blue-50 text-blue-600 border-blue-100",
    "bg-purple-500": "bg-purple-50 text-purple-600 border-purple-100",
    "bg-emerald-500": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "bg-amber-500": "bg-amber-50 text-amber-600 border-amber-100",
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

// --- Mock Available Employees Database for custom searchable selector ---
const availableEmployeesDb = [
  { name: "SHEKH ABDUL", id: "EMP0016", dept: "Operations", designation: "GENERAL MANAGER", email: "abdul@hously.co" },
  { name: "Suraj Kumar", id: "EMP0019", dept: "Engineering", designation: "MTS-2", email: "suraj@hously.co" },
  { name: "Anjali Sharma", id: "EMP0020", dept: "Marketing", designation: "Design Lead", email: "anjali@hously.co" },
  { name: "Vikram Patel", id: "EMP0021", dept: "Sales", designation: "Account Executive", email: "vikram@hously.co" },
  { name: "Kunal Sen", id: "EMP0022", dept: "HR", designation: "Recruiter Manager", email: "kunal@hously.co" },
  { name: "Priya Mehta", id: "EMP0023", dept: "Design", designation: "Product Designer", email: "priya@hously.co" },
  { name: "Rahul Verma", id: "EMP0024", dept: "Engineering", designation: "Staff Engineer", email: "rahul@hously.co" }
];

// --- Main CTC Configuration Dashboard ---
export default function CTCConfiguration() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("CTC Configuration");
      setHeaderSubtitle("Manage employee salary packages, statutory brackets, and earnings templates");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Initial assigned configs
  const [configsList, setConfigsList] = useState([
    { id: "CONFIG-01", employeeName: "SHEKH ABDUL", empId: "EMP0016", designation: "GENERAL MANAGER", templateName: "IT Industry Standard", annualCtc: 120000, effectiveFrom: "4/20/2026", status: "active" },
    { id: "CONFIG-02", employeeName: "Kunal Sen", empId: "EMP0022", designation: "Recruiter Manager", templateName: "HR Standard Package", annualCtc: 960000, effectiveFrom: "6/01/2026", status: "active" },
    { id: "CONFIG-03", employeeName: "Vikram Patel", empId: "EMP0021", designation: "Account Executive", templateName: "IT Industry Standard", annualCtc: 840000, effectiveFrom: "5/15/2026", status: "pending" }
  ]);

  // Initial templates
  const [templatesList, setTemplatesList] = useState([
    {
      id: "TEMP-01",
      name: "IT Industry Standard",
      description: "Standard CTC structure for IT professionals",
      isActive: true,
      isDefault: true,
      components: [
        { name: "Basic Salary", type: "Earning", percent: 50, taxable: true },
        { name: "House Rent Allowance (HRA)", type: "Earning", percent: 20, taxable: false },
        { name: "Special Allowance", type: "Earning", percent: 20, taxable: true },
        { name: "Provident Fund (EPF)", type: "Deduction", percent: 10, taxable: false }
      ]
    },
    {
      id: "TEMP-02",
      name: "HR Standard Package",
      description: "Salary layout tailored for human resources and support staff",
      isActive: true,
      isDefault: false,
      components: [
        { name: "Basic Salary", type: "Earning", percent: 50, taxable: true },
        { name: "House Rent Allowance (HRA)", type: "Earning", percent: 25, taxable: false },
        { name: "Conveyance Allowance", type: "Earning", percent: 15, taxable: false },
        { name: "Provident Fund (EPF)", type: "Deduction", percent: 10, taxable: false }
      ]
    }
  ]);

  // Column search filters
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");

  // Selection state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | string>(10);

  // Modal controls
  const [showManageTemplates, setShowManageTemplates] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showAssignCtc, setShowAssignCtc] = useState(false);

  // Searchable Employee Dropdown inside Assign Modal
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  // Viewing detailed breakdown modal
  const [viewDetailsConfig, setViewDetailsConfig] = useState<any | null>(null);

  // State inside "Create CTC Template"
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newCompName, setNewCompName] = useState("");
  const [newCompType, setNewCompType] = useState("Earning");
  const [newCompPercent, setNewCompPercent] = useState("");
  const [newCompTaxable, setNewCompTaxable] = useState(true);
  const [tempComponents, setTempComponents] = useState<any[]>([]);

  // State inside "Assign CTC"
  const [assignEmpName, setAssignEmpName] = useState("");
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignDesignation, setAssignDesignation] = useState("");
  const [assignTemplate, setAssignTemplate] = useState("IT Industry Standard");
  const [assignAnnual, setAssignAnnual] = useState("");
  const [assignEffectiveDate, setAssignEffectiveDate] = useState("2026-07-13");

  const formatCurrency = (val: number) => {
    return "₹" + val.toLocaleString('en-IN');
  };

  const handleClearFilters = () => {
    setSearchEmployee("");
    setSearchStatus("all");
    toast.success("Filters cleared");
  };

  const handleDeleteConfig = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this employee's CTC assignment? This action cannot be undone.",
      onConfirm: () => {
        setConfigsList(prev => prev.filter(c => c.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("CTC assignment deleted");
      }
    });
  };

  const handleDeleteSelected = () => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Confirm Bulk Deletion",
      message: `Are you sure you want to delete the ${selectedRows.length} selected CTC assignments? This action cannot be undone.`,
      onConfirm: () => {
        setConfigsList(prev => prev.filter(c => !selectedRows.includes(c.id)));
        setSelectedRows([]);
        setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        toast.success("Selected configs deleted");
      }
    });
  };

  const handleAddComponent = () => {
    if (!newCompName.trim()) {
      toast.error("Component name is required");
      return;
    }
    const pct = parseFloat(newCompPercent);
    if (isNaN(pct) || pct <= 0) {
      toast.error("Enter a valid percentage");
      return;
    }

    const currentTotal = tempComponents.reduce((sum, c) => sum + c.percent, 0);
    if (currentTotal + pct > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    setTempComponents([
      ...tempComponents,
      { name: newCompName, type: newCompType, percent: pct, taxable: newCompTaxable }
    ]);
    setNewCompName("");
    setNewCompPercent("");
    toast.success("Component added to template draft");
  };

  const handleCancelTemplateEdit = () => {
    setNewTemplateName("");
    setNewTemplateDesc("");
    setTempComponents([]);
    setEditingTemplate(null);
    setShowCreateTemplate(false);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Template name is required");
      return;
    }
    const currentTotal = tempComponents.reduce((sum, c) => sum + c.percent, 0);
    if (currentTotal !== 100) {
      toast.error(`Total percentage must equal exactly 100% (currently ${currentTotal}%)`);
      return;
    }

    if (editingTemplate) {
      setTemplatesList(prev => prev.map(t => t.id === editingTemplate.id ? {
        ...t,
        name: newTemplateName,
        description: newTemplateDesc,
        components: tempComponents
      } : t));
      toast.success("Salary template changes successfully updated!");
    } else {
      const newTemp = {
        id: `TEMP-0${templatesList.length + 1}`,
        name: newTemplateName,
        description: newTemplateDesc,
        isActive: true,
        isDefault: false,
        components: tempComponents
      };
      setTemplatesList([...templatesList, newTemp]);
      toast.success("New salary template successfully configured!");
    }

    handleCancelTemplateEdit();
  };

  const handleAssignCtc = () => {
    if (!assignEmpName.trim()) {
      toast.error("Employee Name is required");
      return;
    }
    const annual = parseFloat(assignAnnual);
    if (isNaN(annual) || annual <= 0) {
      toast.error("Please enter a valid Annual CTC");
      return;
    }

    const newConfig = {
      id: `CONFIG-0${configsList.length + 1}`,
      employeeName: assignEmpName,
      empId: assignEmpId || `EMP00${19 + configsList.length}`,
      designation: assignDesignation || "ASSOCIATE",
      templateName: assignTemplate,
      annualCtc: annual,
      effectiveFrom: assignEffectiveDate ? new Date(assignEffectiveDate).toLocaleDateString() : new Date().toLocaleDateString(),
      status: "active"
    };

    setConfigsList([newConfig, ...configsList]);
    setAssignEmpName("");
    setAssignEmpId("");
    setAssignDesignation("");
    setAssignAnnual("");
    setShowAssignCtc(false);
    toast.success("CTC assigned to employee successfully!");
  };

  // Filter dynamic allocations list
  const filteredConfigs = configsList.filter(item => {
    if (searchStatus !== "all" && item.status !== searchStatus) return false;
    if (searchEmployee.trim() !== "") {
      const q = searchEmployee.toLowerCase();
      return (
        item.employeeName.toLowerCase().includes(q) ||
        item.empId.toLowerCase().includes(q) ||
        item.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Pagination logic (Supports 10, 25, 50, and All)
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredConfigs.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredConfigs.length / numPageSize);
  const paginatedConfigs = isPageSizeAll ? filteredConfigs : filteredConfigs.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  // Dynamic calculations for Stats Cards
  const stats = {
    totalConfigs: configsList.length,
    activeConfigs: configsList.filter(c => c.status === "active").length,
    pendingConfigs: configsList.filter(c => c.status === "pending").length,
    templatesCount: templatesList.length,
  };

  // Live filter employee database search capped strictly at 5 rows
  const filteredAvailableEmployees = availableEmployeesDb.filter(emp => {
    if (employeeSearchQuery.trim() === "") return true;
    const q = employeeSearchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  }).slice(0, 5);

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

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard icon={Grid} label="Total Configs" value={stats.totalConfigs} color="bg-blue-500" />
        <StatCard icon={CheckCircle2} label="Active" value={stats.activeConfigs} color="bg-emerald-500" />
        <StatCard icon={Clock} label="Pending" value={stats.pendingConfigs} color="bg-amber-500" />
        <StatCard icon={Settings} label="Templates" value={stats.templatesCount} color="bg-purple-500" />
      </div>

      {/* Main Single Column Table Layout */}
      <div className="w-full flex-1 lg:overflow-hidden flex flex-col min-h-0">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

          {/* Action Header */}
          <div className="p-4 border-b border-gray-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">CTC Allocation Slabs</span>
            </div>

            {/* Operations buttons wrapper */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">

              {/* Delete Selected Button */}
              {selectedRows.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all border border-rose-100 animate-pulse cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedRows.length})</span>
                </button>
              )}

              {/* Manage Templates custom button with gear icon */}
              <button
                onClick={() => setShowManageTemplates(true)}
                className="bg-blue-400 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-gray-300" />
                <span>Manage Templates</span>
              </button>

              {/* Assign CTC Button with plus icon */}
              <button
                onClick={() => setShowAssignCtc(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign CTC</span>
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
                        if (selectedRows.length === paginatedConfigs.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(paginatedConfigs.map(c => c.id));
                        }
                      }}
                      className="hover:text-gray-700 transition-colors"
                    >
                      {selectedRows.length === paginatedConfigs.length && paginatedConfigs.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </th>

                  {/* Employee search */}
                  <th className="p-3 min-w-[200px]">
                    <div className="space-y-1">
                      <div>Employee</div>
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        className="w-full px-2 py-1 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  </th>

                  <th className="p-3">Template</th>
                  <th className="p-3">Annual CTC</th>
                  <th className="p-3">Monthly CTC</th>
                  <th className="p-3">Effective From</th>

                  {/* Status filter dropdown */}
                  <th className="p-3 min-w-[120px]">
                    <div className="space-y-1">
                      <div>Status</div>
                      <select
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                        className="w-full px-1.5 py-0.5 text-[9px] font-normal border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </th>

                  <th className="p-3 pr-6 text-right">
                    <button
                      onClick={handleClearFilters}
                      className="text-[9px] px-2 py-1 border border-gray-200 bg-white hover:bg-slate-50 text-gray-550 rounded-lg shadow-xs cursor-pointer"
                    >
                      ✕ Clear
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                {paginatedConfigs.map((config) => {
                  const monthly = Math.round(config.annualCtc / 12);
                  return (
                    <tr key={config.id} className="hover:bg-slate-50/45 transition-colors group">
                      <td className="p-4 pl-6">
                        <button
                          onClick={() => {
                            setSelectedRows(prev => prev.includes(config.id) ? prev.filter(r => r !== config.id) : [...prev, config.id]);
                          }}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {selectedRows.includes(config.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-gray-800">{config.employeeName}</p>
                          <p className="text-[9px] text-gray-400 font-semibold">{config.empId} • {config.designation}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-red-50 text-red-650 border-red-100">
                          {config.templateName}
                        </span>
                      </td>
                      <td className="p-4 text-gray-800 font-semibold">{formatCurrency(config.annualCtc)}</td>
                      <td className="p-4 text-blue-650 font-semibold">{formatCurrency(monthly)}</td>
                      <td className="p-4 text-gray-500 font-normal">{config.effectiveFrom}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${config.status === "active" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                          {config.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2 text-gray-400">
                          {/* Actions: View Details breakdown, and delete */}
                          <button
                            onClick={() => setViewDetailsConfig(config)}
                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 transition-all shadow-xs cursor-pointer"
                            title="View Components Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-gray-100 transition-all shadow-xs cursor-pointer"
                            title="Delete Config Assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredConfigs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-405 font-bold italic bg-white">
                      No matching employee CTC configurations assigned.
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
                Showing {filteredConfigs.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredConfigs.length)}` : 0} of {filteredConfigs.length} configs
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isPageSizeAll}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === pageNum
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
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-55 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: Manage CTC Templates --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showManageTemplates ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transition-all duration-300 transform ${showManageTemplates ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>

            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-700 text-white p-2 rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Manage CTC Templates</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">Create and manage CTC templates for employees</p>
                </div>
              </div>
              <button onClick={() => setShowManageTemplates(false)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[60vh] text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-bold text-gray-800">Available Templates ({templatesList.length})</span>
                <button
                  onClick={() => setShowCreateTemplate(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus size={12} />
                  <span>New Template</span>
                </button>
              </div>

              <div className="space-y-3">
                {templatesList.map((temp) => (
                  <div key={temp.id} className="border border-gray-200 rounded-xl p-4 space-y-3 hover:border-blue-500/20 hover:shadow-xs transition-all bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{temp.name}</h4>
                        <p className="text-[11px] text-gray-405 font-semibold mt-0.5">{temp.description}</p>
                        <span className="inline-block mt-2 bg-slate-105 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                          {temp.components.length} components
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => {
                            setViewDetailsConfig({
                              employeeName: "Template Preview",
                              empId: temp.id,
                              designation: "TEMPLATE COMPONENTS",
                              templateName: temp.name,
                              annualCtc: 1200000
                            });
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-lg px-2.5 py-1 bg-white hover:bg-blue-50/50 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setNewTemplateName(temp.name);
                            setNewTemplateDesc(temp.description);
                            setTempComponents(temp.components);
                            setEditingTemplate(temp);
                            setShowCreateTemplate(true);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-green-600 border border-green-200 rounded-lg px-2.5 py-1 bg-white hover:bg-green-50/50 cursor-pointer"
                        >
                          <Pencil size={12} />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              title: "Delete Salary Template",
                              message: `Are you sure you want to delete the "${temp.name}" template? This action cannot be undone.`,
                              onConfirm: () => {
                                setTemplatesList(prev => prev.filter(t => t.id !== temp.id));
                                setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
                                toast.success("Salary template deleted");
                              }
                            });
                          }}
                          disabled={temp.isDefault}
                          className="flex items-center gap-1 text-[11px] font-bold text-red-600 border border-red-200 rounded-lg px-2.5 py-1 bg-white hover:bg-red-50/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-bold border-t border-gray-100 pt-2.5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={temp.isActive}
                          onChange={(e) => {
                            setTemplatesList(prev => prev.map(t => t.id === temp.id ? { ...t, isActive: e.target.checked } : t));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/25 animate-none"
                        />
                        <span>Is Active</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={temp.isDefault}
                          onChange={(e) => {
                            setTemplatesList(prev => prev.map(t => ({ ...t, isDefault: t.id === temp.id ? e.target.checked : false })));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/25 animate-none"
                        />
                        <span>Is Default</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowManageTemplates(false)}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>

      {/* --- MODAL 2: Create CTC Template --- */}
      <div className={`fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showCreateTemplate ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300 transform ${showCreateTemplate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>

            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-700 text-white p-2 rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">
                    {editingTemplate ? "Edit CTC Template" : "Create CTC Template"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    {editingTemplate ? "Modify this CTC structure template" : "Define a new CTC structure template"}
                  </p>
                </div>
              </div>
              <button onClick={handleCancelTemplateEdit} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[60vh] text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Template Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Marketing Team Structure"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Description <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Brief description of the template components setup..."
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="border border-gray-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">Components Drafts</span>
                  <span className={`font-bold text-[10px] ${tempComponents.reduce((sum, c) => sum + c.percent, 0) === 100 ? "text-emerald-600" : "text-rose-600"}`}>
                    Total: {tempComponents.reduce((sum, c) => sum + c.percent, 0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Component name"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    className="col-span-2 bg-white border border-gray-200 rounded-lg p-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={newCompType}
                    onChange={(e) => setNewCompType(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg p-1.5 text-[11px] font-semibold cursor-pointer"
                  >
                    <option value="Earning">Earning</option>
                    <option value="Deduction">Deduction</option>
                  </select>
                  <input
                    type="number"
                    placeholder="%"
                    value={newCompPercent}
                    onChange={(e) => setNewCompPercent(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg p-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-gray-500">
                    <input
                      type="checkbox"
                      checked={newCompTaxable}
                      onChange={(e) => setNewCompTaxable(e.target.checked)}
                      className="rounded border-gray-300 text-red-655 focus:ring-red-500/25"
                    />
                    <span>Taxable</span>
                  </label>
                  <button
                    onClick={handleAddComponent}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-3 py-1 rounded-lg inline-flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <PlusCircle size={12} />
                    <span>Add</span>
                  </button>
                </div>

                {tempComponents.length > 0 && (
                  <div className="mt-3 max-h-[160px] overflow-y-auto space-y-2 pr-1 border border-gray-200/50 rounded-xl p-2 bg-slate-50/50">
                    {tempComponents.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-2.5 shadow-none hover:border-blue-500/10 transition-colors"
                      >
                        {/* Left */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-gray-800">
                            {comp.name}
                          </span>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${comp.type === "Earning"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                              }`}
                          >
                            {comp.type}
                          </span>

                          <span className="bg-slate-50 text-slate-700 font-bold border border-gray-100 px-1.5 py-0.5 rounded text-[9px]">
                            {comp.percent}%
                          </span>

                          {comp.taxable && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded font-bold ">
                              Taxable
                            </span>
                          )}
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setNewCompName(comp.name);
                              setNewCompType(comp.type);
                              setNewCompPercent(String(comp.percent));
                              setNewCompTaxable(comp.taxable);
                              setTempComponents(prev => prev.filter((_, i) => i !== idx));
                              toast.success("Component loaded back to edit fields");
                            }}
                            className="p-1 hover:text-green-600 hover:bg-green-50 rounded border border-gray-100 transition-colors cursor-pointer"
                            title="Edit component parameter"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() =>
                              setTempComponents((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="p-1 hover:text-red-500 hover:bg-rose-50 rounded border border-gray-100 transition-colors cursor-pointer"
                            title="Delete component"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
              <button
                onClick={handleCancelTemplateEdit}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save size={14} />
                <span>{editingTemplate ? "Save Changes" : "Create Template"}</span>
              </button>
            </div>
          </div>
      </div>

      {/* --- MODAL 3: Assign CTC to Employee --- */}
      <div className={`fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${showAssignCtc ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-visible flex flex-col transition-all duration-300 transform ${showAssignCtc ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>

            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="bg-red-500/10 p-2 rounded-lg text-red-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">Assign CTC to Employee</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">Configure salary structure for employees</p>
                </div>
              </div>
              <button onClick={() => { setShowAssignCtc(false); setShowEmployeeDropdown(false); }} className="text-gray-450 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 text-xs overflow-visible">

              {/* Custom Searchable Employee Selector Dropdown (Capped to 5 matching rows) */}
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
                          className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:border-red-500 bg-slate-50 font-semibold"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[180px] overflow-y-auto divide-y divide-gray-100">
                        {filteredAvailableEmployees.map((emp) => (
                          <div
                            key={emp.id}
                            onClick={() => {
                              setAssignEmpName(emp.name);
                              setAssignEmpId(emp.id);
                              setAssignDesignation(emp.designation);
                              setShowEmployeeDropdown(false);
                              setEmployeeSearchQuery("");
                            }}
                            className="p-2 hover:bg-slate-50 cursor-pointer text-[11px] flex justify-between items-center transition-colors font-medium"
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



              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Select CTC Template <span className="text-red-500">*</span></label>
                <select
                  value={assignTemplate}
                  onChange={(e) => setAssignTemplate(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:outline-none font-semibold text-gray-750 cursor-pointer"
                >
                  {templatesList.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Annual CTC (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 120000"
                    value={assignAnnual}
                    onChange={(e) => setAssignAnnual(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Effective From <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={assignEffectiveDate}
                    onChange={(e) => setAssignEffectiveDate(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 text-amber-805">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <div className="space-y-1 text-[10px]">
                  <p className="font-bold">Important Information</p>
                  <p className="font-semibold text-amber-700">The CTC will be automatically broken down into components based on the selected template layout.</p>
                  <p className="font-semibold text-amber-700">Monthly CTC is calculated dynamically as Annual CTC / 12.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <button
                onClick={() => { setShowAssignCtc(false); setShowEmployeeDropdown(false); }}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCtc}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm px-5 py-2 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Assign CTC</span>
              </button>
            </div>
          </div>
        </div>
          {/* --- POPUP MODAL: CTC Breakdown Details (View Payslip components breakdown) --- */}
      <div className={`fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${viewDetailsConfig ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300 transform ${viewDetailsConfig ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {viewDetailsConfig && (
            <>
              <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold border border-red-200">
                    {viewDetailsConfig.employeeName?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-855">{viewDetailsConfig.employeeName}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Compensation Layout Components Setup</p>
                  </div>
                </div>
                <button onClick={() => setViewDetailsConfig(null)} className="text-gray-455 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] text-xs">
                <div className="grid grid-cols-3 gap-2 border border-gray-100 rounded-xl p-3 bg-slate-50/50">
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Reference ID</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{viewDetailsConfig.empId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Role / Target</p>
                    <p className="font-semibold text-gray-700 mt-0.5 truncate max-w-[100px]">{viewDetailsConfig.designation}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Salary Template</p>
                    <p className="font-semibold text-blue-600 mt-0.5 truncate max-w-[110px]">{viewDetailsConfig.templateName}</p>
                  </div>
                </div>

                {/* Find active template components breakdown */}
                {(() => {
                  const template = templatesList.find(t => t.name === viewDetailsConfig.templateName) || templatesList[0];
                  const annualSum = viewDetailsConfig.annualCtc;
                  const monthlySum = Math.round(annualSum / 12);

                  const earnings = template.components.filter(c => c.type === "Earning");
                  const deductions = template.components.filter(c => c.type === "Deduction");

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Earnings Column */}
                        <div className="border border-gray-250/80 rounded-xl overflow-hidden shadow-sm bg-white">
                          <div className="bg-slate-50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-[9px] text-gray-500 uppercase">Earnings (Credit)</span>
                          </div>
                          <div className="divide-y divide-gray-100 p-1 font-semibold">
                            {earnings.map((comp, idx) => {
                              const valAnnual = (annualSum * comp.percent) / 100;
                              const valMonthly = (monthlySum * comp.percent) / 100;
                              return (
                                <div key={idx} className="py-2 px-2 hover:bg-slate-55 rounded flex justify-between items-center text-[10px] font-medium">
                                  <div>
                                    <p className="text-gray-700">{comp.name}</p>
                                    <p className="text-[8px] text-gray-400">{comp.percent}% share</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-gray-800 font-bold">{formatCurrency(valMonthly)}/mo</p>
                                    <p className="text-[8px] text-gray-400 font-semibold">{formatCurrency(valAnnual)}/yr</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Deductions Column */}
                        <div className="border border-gray-250/80 rounded-xl overflow-hidden shadow-sm bg-white">
                          <div className="bg-slate-50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-[9px] text-gray-500 uppercase">Deductions (Debit)</span>
                          </div>
                          <div className="divide-y divide-gray-100 p-1 font-semibold">
                            {deductions.map((comp, idx) => {
                              const valAnnual = (annualSum * comp.percent) / 100;
                              const valMonthly = (monthlySum * comp.percent) / 100;
                              return (
                                <div key={idx} className="py-2 px-2 hover:bg-slate-55 rounded flex justify-between items-center text-[10px] font-medium">
                                  <div>
                                    <p className="text-gray-755">{comp.name}</p>
                                    <p className="text-[8px] text-gray-400">{comp.percent}% share</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-rose-650 font-bold">-{formatCurrency(valMonthly)}/mo</p>
                                    <p className="text-[8px] text-gray-400 font-semibold">-{formatCurrency(valAnnual)}/yr</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-100 border border-black rounded-2xl p-4 flex justify-between items-center shadow-inner mt-2">
                        <div>
                          <p className="text-[10px] text-black-400 font-bold uppercase tracking-wider">Gross Annual Package (CTC)</p>
                          <p className="text-[9px] text-gray-500 font-semibold mt-0.5">Assigned basic and allowance parameters</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-800">{formatCurrency(annualSum)} /yr</p>
                          <p className="text-[10px] text-gray-600 font-bold mt-0.5">{formatCurrency(monthlySum)} /mo</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setViewDetailsConfig(null)}
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-55 rounded-xl text-xs font-semibold text-gray-500 shadow-sm cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* --- DELETE CONFIRMATION MODAL --- */}
      <div className={`fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 ${deleteConfirmation.isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
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
              className="px-3.5 py-1.5 border border-gray-200 bg-white hover:bg-slate-50 text-gray-500 rounded-lg text-[11px] font-semibold cursor-pointer shadow-xs"
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

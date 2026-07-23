import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Settings,
  Plus,
  IndianRupee,
  Percent,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  X,
  FileText,
  AlertCircle,
  Building,
  User,
  Calendar,
  Save,
  Search,
  Pencil,
  Wallet,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { employeeApi, type EmployeeRecord } from "../../../../lib/employeeApi";

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

const formatLakhs = (num: number) => {
  if (!num) return "0.00 Lakh";
  const lakhs = num / 100000;
  return `${lakhs.toFixed(2)} Lakh`;
};

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

export default function CTCConfiguration() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("CTC & Salary Configuration");
      setHeaderSubtitle("Manage fixed monthly salaries and annual CTC package structures (PF-Free)");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEmp, setEditingEmp] = useState<EmployeeRecord | null>(null);

  // Pagination & Column Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [columnFilters, setColumnFilters] = useState({
    employee: "",
    department: "",
    compModel: "",
    monthlySalary: "",
    annualCtc: "",
    taxStatus: "",
  });

  // Modal edit form state
  const [compType, setCompType] = useState<"fixed_monthly" | "ctc">("fixed_monthly");
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [annualCtc, setAnnualCtc] = useState<number>(0);
  const [hikeDate, setHikeDate] = useState<string>("");
  const [hikeType, setHikeType] = useState<string>("percentage_%");
  const [hikeValue, setHikeValue] = useState<number>(0);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeApi.getAll();
      setEmployees(data || []);
    } catch (err) {
      console.error("Failed to load employees for CTC config:", err);
      toast.error("Failed to load employee salary configurations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openEditModal = (emp: EmployeeRecord) => {
    setEditingEmp(emp);
    const isCtc = Boolean(emp.ctc && Number(emp.ctc) > 0);
    setCompType(isCtc ? "ctc" : "fixed_monthly");
    setMonthlySalary(Number(emp.salary) || 0);
    setAnnualCtc(Number(emp.ctc) || 0);
    setHikeDate(emp.hikeEffectiveDate || "");
    setHikeType(emp.hikeType || "percentage_%");
    setHikeValue(Number(emp.hikeValue) || 0);
  };

  const handleSaveConfig = async () => {
    if (!editingEmp) return;

    try {
      let updatedSalary = monthlySalary;
      let updatedCtc = annualCtc;

      if (compType === "ctc") {
        updatedSalary = Math.round(annualCtc / 12);
      } else {
        updatedCtc = 0; // Clear CTC for fixed monthly
      }

      await employeeApi.update(editingEmp.id, {
        ...editingEmp,
        salary: updatedSalary,
        ctc: updatedCtc,
        salaryType: "Monthly",
        hikeEffectiveDate: hikeDate || undefined,
        hikeType,
        hikeValue,
        hikeActive: Boolean(hikeDate && hikeValue > 0)
      } as any);

      toast.success(`Salary package updated for ${editingEmp.firstName} ${editingEmp.lastName}`);
      setEditingEmp(null);
      fetchEmployees();
    } catch (err) {
      console.error("Error saving salary config:", err);
      toast.error("Failed to update salary configuration");
    }
  };

  const filteredEmployees = employees.filter(e => {
    // General Search query (if set)
    if (searchQuery) {
      const full = `${e.firstName || ""} ${e.lastName || ""} ${e.employeeId || ""} ${e.department || ""}`.toLowerCase();
      if (!full.includes(searchQuery.toLowerCase())) return false;
    }

    // Column Filters
    if (columnFilters.employee) {
      const name = `${e.firstName || ""} ${e.lastName || ""} ${e.employeeId || ""}`.toLowerCase();
      if (!name.includes(columnFilters.employee.toLowerCase())) return false;
    }
    if (columnFilters.department) {
      const deptRole = `${e.department || ""} ${e.role || ""}`.toLowerCase();
      if (!deptRole.includes(columnFilters.department.toLowerCase())) return false;
    }
    if (columnFilters.compModel) {
      const isCtc = Boolean(e.ctc && Number(e.ctc) > 0);
      const modelStr = isCtc ? "ctc package" : "fixed monthly";
      if (!modelStr.includes(columnFilters.compModel.toLowerCase())) return false;
    }
    if (columnFilters.monthlySalary) {
      const salary = String(e.salary || 0);
      if (!salary.includes(columnFilters.monthlySalary)) return false;
    }
    if (columnFilters.annualCtc) {
      const ctcVal = String(e.ctc || 0);
      if (!ctcVal.includes(columnFilters.annualCtc)) return false;
    }
    if (columnFilters.taxStatus) {
      const isCtc = Boolean(e.ctc && Number(e.ctc) > 0);
      const taxStatusStr = isCtc ? "no pf (0% deduction) tds tax active" : "no pf (0% deduction) tds exempt";
      if (!taxStatusStr.toLowerCase().includes(columnFilters.taxStatus.toLowerCase())) return false;
    }

    return true;
  });

  // Pagination bounds
  const isPageSizeAll = pageSize === "All";
  const numPageSize = isPageSizeAll ? filteredEmployees.length : Number(pageSize);
  const totalPages = isPageSizeAll ? 1 : Math.ceil(filteredEmployees.length / numPageSize);
  const paginatedEmployees = isPageSizeAll ? filteredEmployees : filteredEmployees.slice((currentPage - 1) * numPageSize, currentPage * numPageSize);

  const ctcCount = employees.filter(e => e.ctc && Number(e.ctc) > 0).length;
  const fixedCount = employees.length - ctcCount;

  return (
    <div className="p-6 space-y-6 w-full h-full flex flex-col bg-gray-50/50 overflow-hidden box-border">
      <Toaster position="top-right" />

      {/* Top Stats */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
        <StatCard icon={User} label="Total Staff Configured" value={employees.length} color="bg-blue-500" />
        <StatCard icon={Wallet} label="Fixed Monthly Salaries" value={fixedCount} color="bg-emerald-500" />
        <StatCard icon={IndianRupee} label="CTC Package Staff" value={ctcCount} color="bg-purple-500" />
        <StatCard icon={ShieldCheck} label="PF Statutory Status" value="Exempt / Disables (0 PF)" color="bg-amber-500" />
      </div>

      {/* Main Table Panel */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-shrink-0 p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Employee Compensation Roster</h3>
            <p className="text-xs text-gray-400 mt-0.5">Configure monthly base pay or annual CTC structures</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID or department..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left text-xs text-gray-600 border-collapse table-fixed">
            <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
              <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 min-w-[200px]">
                  <div className="space-y-1">
                    <span>Employee</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.employee}
                      onChange={e => { setColumnFilters({ ...columnFilters, employee: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[150px]">
                  <div className="space-y-1">
                    <span>Department & Role</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.department}
                      onChange={e => { setColumnFilters({ ...columnFilters, department: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[140px]">
                  <div className="space-y-1">
                    <span>Compensation Model</span>
                    <select
                      value={columnFilters.compModel}
                      onChange={e => { setColumnFilters({ ...columnFilters, compModel: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs cursor-pointer"
                    >
                      <option value="">All</option>
                      <option value="fixed monthly">Fixed Monthly</option>
                      <option value="ctc package">CTC Package</option>
                    </select>
                  </div>
                </th>
                <th className="py-3 px-4 text-right min-w-[140px]">
                  <div className="space-y-1">
                    <span>Base Monthly Salary</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.monthlySalary}
                      onChange={e => { setColumnFilters({ ...columnFilters, monthlySalary: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs text-right"
                    />
                  </div>
                </th>
                <th className="py-3 px-4 text-right min-w-[140px]">
                  <div className="space-y-1">
                    <span>Annual CTC Package</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.annualCtc}
                      onChange={e => { setColumnFilters({ ...columnFilters, annualCtc: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs text-right"
                    />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[160px]">
                  <div className="space-y-1">
                    <span>PF / Tax Status</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={columnFilters.taxStatus}
                      onChange={e => { setColumnFilters({ ...columnFilters, taxStatus: e.target.value }); setCurrentPage(1); }}
                      className="w-full font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </th>
                <th className="py-3 px-4 text-center min-w-[120px]">
                  <div className="space-y-1">
                    <span>Actions</span>
                    <div className="h-6"></div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">Loading compensation data...</td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">No employees found</td>
                </tr>
              ) : (
                paginatedEmployees.map(emp => {
                  const isCtc = Boolean(emp.ctc && Number(emp.ctc) > 0);
                  const baseMonthly = Number(emp.salary) || 0;
                  const ctcVal = Number(emp.ctc) || 0;

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            name={`${emp.firstName} ${emp.lastName}`}
                            avatarUrl={emp.avatarUrl}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-800 font-medium">{emp.department || "General"}</div>
                        <div className="text-[10px] text-gray-400">{emp.role || "Staff"}</div>
                      </td>
                      <td className="py-3 px-4">
                        {isCtc ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            CTC Package
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Fixed Monthly
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        ₹{baseMonthly.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-700">
                        {isCtc ? `₹${ctcVal.toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          No PF (0% Deduction)
                        </div>
                        <div className="text-[9px] text-gray-400">
                          {isCtc ? "TDS Tax Active" : "TDS Exempt"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          Configure
                        </button>
                      </td>
                    </tr>
                  );
                })
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
              onChange={e => {
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
              Showing {filteredEmployees.length > 0 ? `${(currentPage - 1) * numPageSize + 1}-${Math.min(currentPage * numPageSize, filteredEmployees.length)}` : 0} of {filteredEmployees.length} records
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isPageSizeAll}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-655 border border-gray-200 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0 || isPageSizeAll}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Config Modal */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 space-y-3.5 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-800">Configure Package</h3>
                <p className="text-xs text-gray-400">{editingEmp.firstName} {editingEmp.lastName} ({editingEmp.employeeId})</p>
              </div>
              <button onClick={() => setEditingEmp(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation Model Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Compensation Model</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCompType("fixed_monthly")}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    compType === "fixed_monthly" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Fixed Monthly Salary
                </button>
                <button
                  type="button"
                  onClick={() => setCompType("ctc")}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    compType === "ctc" ? "bg-purple-50 border-purple-500 text-purple-700 shadow-sm" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <IndianRupee className="w-4 h-4" />
                  Annual CTC Package
                </button>
              </div>
            </div>

            {/* Inputs based on type */}
            {compType === "fixed_monthly" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Fixed Monthly Net Base Salary (₹)</label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={e => setMonthlySalary(Number(e.target.value))}
                  placeholder="e.g. 35000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-gray-400">Direct monthly payout without CTC component restructuring (0 PF)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Annual CTC Package (₹)</label>
                  <input
                    type="number"
                    value={annualCtc}
                    onChange={e => {
                      const ctc = Number(e.target.value);
                      setAnnualCtc(ctc);
                      setMonthlySalary(Math.round(ctc / 12));
                    }}
                    placeholder="e.g. 600000"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Monthly Base = ₹{Math.round(annualCtc / 12).toLocaleString("en-IN")}/month ({formatLakhs(annualCtc)})
                  </p>
                </div>

                {/* Auto Component Breakdown Display */}
                <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 text-xs">
                  <div className="font-bold text-purple-900 uppercase text-[9px] mb-1.5">CTC Component Breakdown (PF Free)</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-gray-750 font-medium">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400">Basic (50%):</span>
                      <span className="font-semibold">₹{Math.round(annualCtc * 0.50 / 12).toLocaleString("en-IN")}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400">HRA (40%):</span>
                      <span className="font-semibold">₹{Math.round(annualCtc * 0.20 / 12).toLocaleString("en-IN")}/mo</span>
                    </div>
                    <div className="flex justify-between col-span-2 border-t border-purple-100 pt-1.5">
                      <span className="text-[10px] text-gray-400">Special Allowance:</span>
                      <span className="font-semibold">₹{Math.round(annualCtc * 0.30 / 12).toLocaleString("en-IN")}/mo</span>
                    </div>
                    <div className="flex justify-between col-span-2 font-bold text-emerald-700">
                      <span>Provident Fund (PF):</span>
                      <span>₹0 (Exempt)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Increments Section */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="font-semibold text-xs text-gray-700 uppercase tracking-wider">Scheduled Hike Config</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500">Effective Date</label>
                  <input
                    type="date"
                    value={hikeDate}
                    onChange={e => setHikeDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500">Hike Value ({hikeType === 'percentage_%' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    value={hikeValue}
                    onChange={e => setHikeValue(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => setEditingEmp(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

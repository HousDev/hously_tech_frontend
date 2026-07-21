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
  Building,
  User,
  Calendar,
  Save,
  Search,
  Pencil,
  Wallet,
  ShieldCheck,
  Zap
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { employeeApi, type EmployeeRecord } from "../../../../lib/employeeApi";

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
    const full = `${e.firstName} ${e.lastName} ${e.employeeId} ${e.department || ""}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  const ctcCount = employees.filter(e => e.ctc && Number(e.ctc) > 0).length;
  const fixedCount = employees.length - ctcCount;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-gray-50/50 min-h-screen">
      <Toaster position="top-right" />

      {/* Top Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard icon={User} label="Total Staff Configured" value={employees.length} color="bg-blue-500" />
        <StatCard icon={Wallet} label="Fixed Monthly Salaries" value={fixedCount} color="bg-emerald-500" />
        <StatCard icon={DollarSign} label="CTC Package Staff" value={ctcCount} color="bg-purple-500" />
        <StatCard icon={ShieldCheck} label="PF Statutory Status" value="Exempt / Disables (0 PF)" color="bg-amber-500" />
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 uppercase font-semibold text-[10px] text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Compensation Model</th>
                <th className="py-3 px-4 text-right">Base Monthly Salary</th>
                <th className="py-3 px-4 text-right">Annual CTC Package</th>
                <th className="py-3 px-4">PF / Tax Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">Loading compensation data...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">No employees found</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const isCtc = Boolean(emp.ctc && Number(emp.ctc) > 0);
                  const baseMonthly = Number(emp.salary) || 0;
                  const ctcVal = Number(emp.ctc) || 0;

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{emp.employeeId}</div>
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
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 mx-auto"
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
      </div>

      {/* Edit Config Modal */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
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
                  <DollarSign className="w-4 h-4" />
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
              <div className="space-y-4">
                <div className="space-y-1.5">
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-gray-400">Monthly Base = ₹{Math.round(annualCtc / 12).toLocaleString("en-IN")}/month</p>
                </div>

                {/* Auto Component Breakdown Display */}
                <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-xs space-y-2">
                  <div className="font-bold text-purple-900 uppercase text-[10px]">CTC Component Breakdown (PF Free)</div>
                  <div className="flex justify-between text-gray-700">
                    <span>Basic Salary (50%)</span>
                    <span className="font-semibold">₹{Math.round(annualCtc * 0.50 / 12).toLocaleString("en-IN")}/mo</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>HRA (40% of Basic)</span>
                    <span className="font-semibold">₹{Math.round(annualCtc * 0.20 / 12).toLocaleString("en-IN")}/mo</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Special Allowance (Balance)</span>
                    <span className="font-semibold">₹{Math.round(annualCtc * 0.30 / 12).toLocaleString("en-IN")}/mo</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-t border-purple-200/60 pt-1">
                    <span>Provident Fund (PF)</span>
                    <span>₹0 (Exempt)</span>
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

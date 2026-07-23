
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Calculator,
  User,
  Info,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  IndianRupee,
  ChevronDown,
  Building,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  Gift,
  Loader2,
  Sparkles
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../lib/api";

// --- Custom StatCard Component (Exact match with Incentives.tsx) ---
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

// --- Types ---
interface Employee {
  name: string;
  id: string;
  dept: string;
  designation: string;
  email: string;
  salary: number; // monthly base package
}

interface TDSRecord {
  id: string;
  employeeName: string;
  empId: string;
  designation: string;
  dept: string;
  regime: "New Regime" | "Old Regime";
  grossAnnual: number;
  deductions80C: number;
  deductions80D: number;
  deductions24b: number;
  deductions80CCD: number;
  hraExemption: number;
  standardDeduction: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTDS: number;
  verificationStatus?: "Accept" | "Reject" | "Pending" | "Reviewed";
  documents?: Array<{ name: string; category: string; url: string }>;
}

export default function TDS() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Easy TDS Calculator & Manager");
      setHeaderSubtitle("Calculate, compare tax regimes, and apply monthly TDS deductions for your employees in seconds.");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // --- Tabs State ---
  const [activeTab, setActiveTab] = useState<"calculator" | "records">("calculator");

  // --- Dynamic Employees and TDS Records from Backend ---
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [tdsRecords, setTdsRecords] = useState<TDSRecord[]>([]);
  const [stats, setStats] = useState({
    totalDeclarations: 0,
    activeEmployees: 0,
    pendingProofs: 0,
    totalMonthlyTDS: 0,
    totalAnnualTDS: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, tdsRes] = await Promise.all([
        api.get('/payroll/employees'),
        api.get('/payroll/tds')
      ]);

      if (empRes.data && empRes.data.success) {
        const mappedEmps = (empRes.data.data || []).map((e: any) => {
          const ctcVal = Number(e.ctc) || 0;
          const grossAnnualVal = Number(e.gross_annual) || (ctcVal > 0 ? ctcVal : (Number(e.monthly_salary) * 12)) || 0;
          const monthlySalaryVal = Number(e.monthly_salary) || (grossAnnualVal > 0 ? Math.round(grossAnnualVal / 12) : 0) || 50000;

          return {
            id: e.empId || `EMP-${e.id}`,
            dbUserId: e.id,
            name: e.name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'Employee',
            dept: e.department || 'Engineering',
            designation: e.designation || 'Specialist',
            email: e.email || '',
            salary: monthlySalaryVal,
            ctc: ctcVal > 0 ? ctcVal : grossAnnualVal,
            grossAnnual: grossAnnualVal
          };
        });
        setAvailableEmployees(mappedEmps);
      }

      if (tdsRes.data && tdsRes.data.success) {
        setTdsRecords(tdsRes.data.data || []);
        if (tdsRes.data.stats) {
          setStats(tdsRes.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching TDS data:", err);
      toast.error("Failed to fetch TDS records from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Calculator Input States ---
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState("");
  
  const [grossAnnualSalary, setGrossAnnualSalary] = useState<number>(0);
  const [selectedRegime, setSelectedRegime] = useState<"New Regime" | "Old Regime">("New Regime");
  
  // Exemption inputs (applicable if Old Regime is selected)
  const [deductions80C, setDeductions80C] = useState<number>(0);
  const [deductions80D, setDeductions80D] = useState<number>(0);
  const [deductions24b, setDeductions24b] = useState<number>(0);
  const [deductions80CCD, setDeductions80CCD] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);

  // --- UI Filter States (For Records Tab) ---
  const [recordsSearchQuery, setRecordsSearchQuery] = useState("");
  const [viewingRecordDetails, setViewingRecordDetails] = useState<TDSRecord | null>(null);
  const [statusUpdateRecord, setStatusUpdateRecord] = useState<TDSRecord | null>(null);
  const [modalTab, setModalTab] = useState<"tax" | "docs">("tax");
  const [recordsRegimeFilter, setRecordsRegimeFilter] = useState<"New Regime" | "Old Regime">("New Regime");

  // --- Bulk processing state ---
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const runBulkCalculation = async () => {
    setBulkProcessing(true);
    setBulkProgress(20);

    try {
      setBulkProgress(60);
      const res = await api.post('/payroll/tds/bulk-calculate');
      setBulkProgress(100);

      if (res.data && res.data.success) {
        toast.success(res.data.message || "Bulk TDS calculation completed successfully!");
        fetchData();
        setActiveTab("records");
      } else {
        toast.error("Failed to perform bulk calculation");
      }
    } catch (err) {
      console.error("Error in bulk calculation:", err);
      toast.error("Bulk calculation failed on server");
    } finally {
      setBulkProcessing(false);
      setShowBulkModal(false);
    }
  };

  // Pagination State for Saved Records Log
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number | "All">(10);

  // --- Quick fill-in helper when selecting employee ---
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    const annual = (emp as any).grossAnnual || (emp as any).ctc || (emp.salary ? emp.salary * 12 : 0);
    setGrossAnnualSalary(annual);
    setDeductions80C(0);
    setDeductions80D(0);
    setDeductions24b(0);
    setDeductions80CCD(0);
    setHraExemption(0);
    setShowEmpDropdown(false);
    setEmpSearchQuery("");
    toast.success(`Loaded profile for ${emp.name} (Gross CTC: \u20B9${annual.toLocaleString('en-IN')})`);
  };

  // --- TDS Calculation Engine (FY 2026-27 India Slabs) ---
  const calculateTDS = (
    gross: number,
    regime: "New Regime" | "Old Regime",
    c80: number,
    c80d: number,
    c24b: number,
    c80ccd: number,
    hra: number
  ) => {
    const stdDeduction = regime === "New Regime" ? 75000 : 50000;
    
    // Capped values
    const capped80C = Math.min(c80, 150000);
    const capped80D = Math.min(c80d, 75000); // Self max 25k + Senior Parents max 50k
    const capped24b = Math.min(c24b, 200000); // Home loan interest max 2L
    const capped80CCD = Math.min(c80ccd, 50000); // Extra NPS max 50k
    const cappedHRA = hra;

    const totalDeductions = regime === "New Regime" 
      ? stdDeduction 
      : (stdDeduction + capped80C + capped80D + capped24b + capped80CCD + cappedHRA);

    const taxableIncome = Math.max(0, gross - totalDeductions);

    let baseTax = 0;
    const brackets: { label: string; tax: number }[] = [];

    if (regime === "New Regime") {
      // New Tax Regime Slabs (FY 25-26 / FY 26-27 Budget):
      // Up to 4,00,000 -> Nil
      // 4,00,001 to 8,00,000 -> 5%
      // 8,00,001 to 12,00,000 -> 10%
      // 12,00,001 to 16,00,000 -> 15%
      // 16,00,001 to 20,00,000 -> 20%
      // 20,00,001 to 24,00,000 -> 25%
      // Above 24,00,000 -> 30%
      
      const slabLimits = [400000, 800000, 1200000, 1600000, 2000000, 2400000];
      const rates = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];

      let remainingIncome = taxableIncome;
      let prevLimit = 0;

      for (let i = 0; i < slabLimits.length; i++) {
        const limit = slabLimits[i];
        const range = limit - prevLimit;
        const incomeInThisSlab = Math.min(Math.max(0, remainingIncome), range);
        
        if (incomeInThisSlab > 0) {
          const slabTax = incomeInThisSlab * rates[i];
          baseTax += slabTax;
          const startL = prevLimit / 100000;
          const endL = (prevLimit + incomeInThisSlab) / 100000;
          brackets.push({
            label: `\u20B9${startL}L - \u20B9${endL}L @ ${rates[i]*100}%`,
            tax: slabTax
          });
        }
        remainingIncome -= incomeInThisSlab;
        prevLimit = limit;
      }
      
      if (remainingIncome > 0) {
        const slabTax = remainingIncome * rates[rates.length - 1];
        baseTax += slabTax;
        brackets.push({
          label: `Above \u20B924L @ 30%`,
          tax: slabTax
        });
      }

    } else {
      // Old Tax Regime Slabs (FY 26-27):
      // Up to 2,50,000 -> Nil
      // 2,50,001 to 5,00,000 -> 5%
      // 5,00,001 to 10,00,000 -> 20%
      // Above 10,00,000 -> 30%

      const slabLimits = [250000, 500000, 1000000];
      const rates = [0, 0.05, 0.20, 0.30];

      let remainingIncome = taxableIncome;
      let prevLimit = 0;

      for (let i = 0; i < slabLimits.length; i++) {
        const limit = slabLimits[i];
        const range = limit - prevLimit;
        const incomeInThisSlab = Math.min(Math.max(0, remainingIncome), range);
        
        if (incomeInThisSlab > 0) {
          const slabTax = incomeInThisSlab * rates[i];
          baseTax += slabTax;
          const startL = prevLimit / 100000;
          const endL = (prevLimit + incomeInThisSlab) / 100000;
          brackets.push({
            label: `\u20B9${startL}L - \u20B9${endL}L @ ${rates[i]*100}%`,
            tax: slabTax
          });
        }
        remainingIncome -= incomeInThisSlab;
        prevLimit = limit;
      }

      if (remainingIncome > 0) {
        const slabTax = remainingIncome * rates[rates.length - 1];
        baseTax += slabTax;
        brackets.push({
          label: `Above \u20B910L @ 30%`,
          tax: slabTax
        });
      }
    }

    // Section 87A Rebate check
    let rebate87A = 0;
    if (regime === "New Regime") {
      if (taxableIncome <= 1200000) {
        rebate87A = baseTax;
      }
    } else {
      if (taxableIncome <= 500000) {
        rebate87A = baseTax;
      }
    }

    const postRebateTax = baseTax - rebate87A;
    
    // Marginal Relief check for New Regime (FY 2026-27):
    // Capped at excess income above 12,00,000
    let marginalRelief = 0;
    let finalTaxBeforeCess = postRebateTax;

    if (regime === "New Regime" && taxableIncome > 1200000 && taxableIncome <= 1275000) {
      const excessIncome = taxableIncome - 1200000;
      if (postRebateTax > excessIncome) {
        marginalRelief = postRebateTax - excessIncome;
        finalTaxBeforeCess = excessIncome;
      }
    }

    const cess = Math.round(finalTaxBeforeCess * 0.04);
    const annualTax = Math.round(finalTaxBeforeCess + cess);
    const monthlyTDS = Math.round(annualTax / 12);

    return {
      standardDeduction: stdDeduction,
      taxableIncome,
      baseTax,
      rebate87A,
      marginalRelief,
      cess,
      annualTax,
      monthlyTDS,
      brackets
    };
  };

  // Live calculated results
  const currentCalculation = calculateTDS(
    grossAnnualSalary,
    selectedRegime,
    selectedRegime === "Old Regime" ? deductions80C : 0,
    selectedRegime === "Old Regime" ? deductions80D : 0,
    selectedRegime === "Old Regime" ? deductions24b : 0,
    selectedRegime === "Old Regime" ? deductions80CCD : 0,
    selectedRegime === "Old Regime" ? hraExemption : 0
  );

  // Compare New vs Old regime to advise user
  const comparisonNew = calculateTDS(grossAnnualSalary, "New Regime", 0, 0, 0, 0, 0);
  const comparisonOld = calculateTDS(
    grossAnnualSalary,
    "Old Regime",
    selectedRegime === "Old Regime" ? deductions80C : 0,
    selectedRegime === "Old Regime" ? deductions80D : 0,
    selectedRegime === "Old Regime" ? deductions24b : 0,
    selectedRegime === "Old Regime" ? deductions80CCD : 0,
    selectedRegime === "Old Regime" ? hraExemption : 0
  );
  
  const betterRegime = comparisonNew.annualTax < comparisonOld.annualTax ? "New Regime" : "Old Regime";
  const taxDifference = Math.abs(comparisonNew.annualTax - comparisonOld.annualTax);

  // --- Save / Record Action ---
  const handleApplyTDS = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first!");
      return;
    }

    try {
      const payload = {
        userId: (selectedEmployee as any).dbUserId || selectedEmployee.id,
        empId: selectedEmployee.id,
        regime: selectedRegime,
        grossAnnual: grossAnnualSalary,
        deductions80C: selectedRegime === "Old Regime" ? deductions80C : 0,
        deductions80D: selectedRegime === "Old Regime" ? deductions80D : 0,
        deductions24b: selectedRegime === "Old Regime" ? deductions24b : 0,
        deductions80CCD: selectedRegime === "Old Regime" ? deductions80CCD : 0,
        hraExemption: selectedRegime === "Old Regime" ? hraExemption : 0,
        verificationStatus: "Pending"
      };

      const res = await api.post('/payroll/tds', payload);
      if (res.data && res.data.success) {
        toast.success(`TDS parameters saved for ${selectedEmployee.name}.`);
        fetchData();
        setActiveTab("records");
      } else {
        toast.error(res.data?.message || "Failed to save TDS declaration");
      }
    } catch (err) {
      console.error("Error saving TDS declaration:", err);
      toast.error("Failed to save TDS configuration to server");
    }
  };

  const handleUpdateVerificationStatus = async (item: TDSRecord, newStatus: string) => {
    try {
      setTdsRecords(prev => prev.map(r => r.id === item.id ? { ...r, verificationStatus: newStatus as any } : r));
      const res = await api.patch(`/payroll/tds/${item.id}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Verification status updated to ${newStatus}`);
        fetchData();
      } else {
        toast.error("Failed to update status");
        fetchData();
      }
    } catch (err) {
      console.error("Error updating verification status:", err);
      toast.error("Failed to update verification status");
      fetchData();
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      setTdsRecords(prev => prev.filter(r => r.id !== id));
      const res = await api.delete(`/payroll/tds/${id}`);
      if (res.data && res.data.success) {
        toast.success("TDS record deleted successfully.");
        fetchData();
      } else {
        toast.error("Failed to delete record");
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting TDS record:", err);
      toast.error("Failed to delete record");
      fetchData();
    }
  };

  // --- Formatters ---
  const formatCurrency = (val: number) => {
    return "\u20B9" + Math.round(val).toLocaleString('en-IN');
  };

  // --- Filtered lists ---
  const filteredEmployeesList = availableEmployees.filter(emp => {
    const q = empSearchQuery.toLowerCase();
    return emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q) || emp.dept.toLowerCase().includes(q);
  });

  const filteredRecords = tdsRecords.filter(rec => {
    const q = recordsSearchQuery.toLowerCase();
    const matchesSearch = rec.employeeName.toLowerCase().includes(q) || rec.empId.toLowerCase().includes(q) || rec.dept.toLowerCase().includes(q);
    const matchesRegime = rec.regime === recordsRegimeFilter;
    return matchesSearch && matchesRegime;
  });

  const paginatedRecords = (() => {
    if (rowsPerPage === "All") return filteredRecords;
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  })();

  const totalPages = rowsPerPage === "All" ? 1 : Math.ceil(filteredRecords.length / Number(rowsPerPage));

  return (
    <div className="p-6 w-full space-y-6 bg-slate-50/50 lg:h-[calc(100vh-40px)] lg:overflow-hidden flex flex-col min-h-screen lg:min-h-0 text-slate-700 font-medium">
      <Toaster position="top-right" />
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-spin-hover:hover {
          transform: rotate(360deg);
        }
        .animate-spin-hover {
          transition: transform 0.6s ease;
        }
      `}</style>

      {/* Sticky Header Group: Top Dashboard Stats & Navigation Tabs */}
      <div className="md:sticky md:top-0 bg-slate-50/95 backdrop-blur-xs z-30 pt-4 pb-2.5 space-y-4 border-b border-slate-200/60">
        {/* --- Top Dashboard Status Cards (Matching Incentives.tsx) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
          <StatCard
            icon={Calculator}
            label="Active Deductions"
            value={`${stats.activeEmployees || tdsRecords.length} Employees`}
            color="bg-purple-500"
            subtitle="With custom configured TDS"
          />
          <StatCard
            icon={Clock}
            label="Pending Proofs"
            value={`${stats.pendingProofs || tdsRecords.filter(r => r.verificationStatus === 'Pending').length} Pending`}
            color="bg-amber-500"
            subtitle="Awaiting administrative review"
          />
          <StatCard
            icon={IndianRupee}
            label="Monthly TDS Collection"
            value={formatCurrency(stats.totalMonthlyTDS || tdsRecords.reduce((sum, item) => sum + (item.monthlyTDS || 0), 0))}
            color="bg-blue-500"
            subtitle="To deposit in Govt. Portal"
          />
          <StatCard
            icon={Building}
            label="Annual TDS Collection"
            value={formatCurrency(stats.totalAnnualTDS || tdsRecords.reduce((sum, item) => sum + (item.annualTax || 0), 0))}
            color="bg-emerald-500"
            subtitle="Projected yearly deposits"
          />
        </div>

        {/* --- Switch Navigation Tabs --- */}
        <div className="flex justify-between items-center pb-0.5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("calculator")}
              className={`pb-2 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === "calculator"
                  ? "text-blue-600 border-b-2 border-blue-600 font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              1. TDS Calculator & Deductor (Easy Calculator)
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`pb-2 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === "records"
                  ? "text-blue-600 border-b-2 border-blue-600 font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              2. Saved Records Log ({tdsRecords.length})
            </button>
          </div>

          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all hover:scale-102"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            <span>Bulk Process TDS</span>
          </button>
        </div>
      </div>

      {/* --- Tab 1: Interactive Easy TDS Calculator --- */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1 pb-4">
          
          {/* Left Inputs Column */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">STEP 1</span>
              <h3 className="font-bold text-sm text-slate-850">Employee & Base Salary Settings</h3>
            </div>

            {/* A. Search and Select Employee Combobox (Inline Searchable Field) */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Choose Employee <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Please choose an employee or search by ID/name..."
                  value={showEmpDropdown ? empSearchQuery : (selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.id} - ${selectedEmployee.designation})` : empSearchQuery)}
                  onFocus={() => {
                    setShowEmpDropdown(true);
                    setEmpSearchQuery("");
                  }}
                  onChange={(e) => {
                    setEmpSearchQuery(e.target.value);
                    setShowEmpDropdown(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white shadow-xs"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {showEmpDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmpDropdown(false)} />
                  <div className="absolute top-[68px] left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 max-h-60 overflow-y-auto no-scrollbar">
                    {filteredEmployeesList.map((emp) => {
                      const annualCTC = (emp as any).ctc || (emp as any).grossAnnual || (emp.salary * 12);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => handleSelectEmployee(emp)}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-100 last:border-none transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              {emp.name.split(" ").map((n: string) => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-800 leading-tight">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{emp.id} • {emp.dept}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                            {formatCurrency(annualCTC)}/yr
                          </span>
                        </div>
                      );
                    })}
                    {filteredEmployeesList.length === 0 && (
                      <p className="p-3 text-center text-slate-400 italic text-[11px]">No matching employees found.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* B. Salary Base Inputs */}
            {selectedEmployee && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Base Salary (Automated)</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-500 cursor-not-allowed">
                    {formatCurrency(selectedEmployee.salary)} / month
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Gross Annual CTC (\u20B9) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={grossAnnualSalary || ""}
                    onChange={(e) => setGrossAnnualSalary(Number(e.target.value))}
                    placeholder="e.g. 1000000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* C. Tax Regime Selector */}
            {selectedEmployee && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mt-4">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">STEP 2</span>
                  <h3 className="font-bold text-xs text-slate-855 uppercase">Select Regime Scheme</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedRegime("New Regime")}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      selectedRegime === "New Regime"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs text-slate-800">New Tax Regime</span>
                      {betterRegime === "New Regime" && (
                        <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Cheaper</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Slabs revised for FY 26-27. Standard deduction: \u20B975,000. Exemptions (80C, HRA) are not allowed. Tax free up to \u20B912.75L CTC.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedRegime("Old Regime")}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      selectedRegime === "Old Regime"
                        ? "border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/10"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs text-slate-800">Old Tax Regime</span>
                      {betterRegime === "Old Regime" && (
                        <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Cheaper</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Deductions are allowed (HRA, Section 80C, health insurance). Standard deduction: \u20B950,000.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* D. Old Regime Deductions Input parameters */}
            {selectedEmployee && selectedRegime === "Old Regime" && (
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 animate-fadeIn">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Info className="w-3.5 h-3.5 text-purple-600" />
                  <h4 className="font-bold text-[11px] text-slate-700 uppercase">Old Regime Deductions (Investment Declarations)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block whitespace-nowrap overflow-hidden text-ellipsis" title="Section 80C (PF, LIC, ELSS)">Section 80C (PF/LIC/ELSS)</label>
                    <input
                      type="number"
                      max={150000}
                      value={deductions80C || ""}
                      onChange={(e) => setDeductions80C(Math.min(150000, Number(e.target.value)))}
                      placeholder={"Max \u20B91,50,000"}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-blue-600 font-bold">{"Maximum limit is \u20B91,50,000"}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block whitespace-nowrap overflow-hidden text-ellipsis" title="Section 80D (Health Insurance)">Section 80D (Health Ins.)</label>
                    <input
                      type="number"
                      max={75000}
                      value={deductions80D || ""}
                      onChange={(e) => setDeductions80D(Math.min(75000, Number(e.target.value)))}
                      placeholder={"Max \u20B975,000"}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-blue-600 font-bold">{"Maximum limit is \u20B975,000"}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block whitespace-nowrap overflow-hidden text-ellipsis" title="Section 24(b) (Home Loan Interest)">Section 24(b) (Home Loan)</label>
                    <input
                      type="number"
                      max={200000}
                      value={deductions24b || ""}
                      onChange={(e) => setDeductions24b(Math.min(200000, Number(e.target.value)))}
                      placeholder={"Max \u20B92,00,000"}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-blue-600 font-bold">{"Maximum limit is \u20B92,00,000"}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block whitespace-nowrap overflow-hidden text-ellipsis" title="Section 80CCD(1B) (Extra NPS)">Section 80CCD (Extra NPS)</label>
                    <input
                      type="number"
                      max={50000}
                      value={deductions80CCD || ""}
                      onChange={(e) => setDeductions80CCD(Math.min(50000, Number(e.target.value)))}
                      placeholder={"Max \u20B950,000"}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-blue-600 font-bold">{"Maximum limit is \u20B950,000"}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block whitespace-nowrap overflow-hidden text-ellipsis" title="House Rent Allowance (HRA)">HRA Exemption</label>
                    <input
                      type="number"
                      value={hraExemption || ""}
                      onChange={(e) => setHraExemption(Number(e.target.value))}
                      placeholder={"Enter HRA Exemption"}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[9px] text-blue-600 font-bold">{"Max limit: Actual HRA Component"}</span>
                  </div>
                </div>
              </div>
            )}

            {!selectedEmployee && (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Calculator className="w-10 h-10 text-slate-300 animate-pulse" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Please Select an Employee</h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Choose an employee from the selection bar above to load their salary information and calculate TDS in real time.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Calculations and slabs visualization card */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-[170px] self-start">
            
            {/* Direct Tax summary card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col justify-between min-h-[390px] h-fit gap-6 relative overflow-hidden">
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-600/10 rounded-full blur-3xl" />

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">LIVE TAX CALCULATION</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    selectedRegime === "New Regime" 
                      ? "border-blue-500/30 text-blue-400 bg-blue-950/20" 
                      : "border-purple-500/30 text-purple-400 bg-purple-950/20"
                  }`}>
                    {selectedRegime}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Annual Income:</span>
                    <span className="font-bold text-white">{formatCurrency(grossAnnualSalary)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>(-) Standard Deduction:</span>
                    <span className="font-bold text-white">-{formatCurrency(currentCalculation.standardDeduction)}</span>
                  </div>

                  {selectedRegime === "Old Regime" && (
                    <div className="flex justify-between text-slate-400">
                      <span>(-) Total Exemptions:</span>
                      <span className="font-bold text-white">
                        -{formatCurrency(Math.min(deductions80C, 150000) + Math.min(deductions80D, 75000) + Math.min(deductions24b, 200000) + Math.min(deductions80CCD, 50000) + hraExemption)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-300 font-bold uppercase">Net Taxable Income:</span>
                    <span className="text-base font-black text-white">{formatCurrency(currentCalculation.taxableIncome)}</span>
                  </div>
                </div>

                {/* Slabs computation details */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Slab Calculations (\u20B9 Bracket):</p>
                  {currentCalculation.brackets.length === 0 ? (
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>Up to \u20B94L @ 0%</span>
                      <span className="font-bold text-slate-200">\u20B90</span>
                    </div>
                  ) : (
                    currentCalculation.brackets.map((slab, i) => (
                      <div key={i} className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>{slab.label}</span>
                        <span className="font-bold text-slate-200">{formatCurrency(slab.tax)}</span>
                      </div>
                    ))
                  )}

                  {/* Calculations breakdown for Rebate & Cess */}
                  {grossAnnualSalary > 0 && (
                    <div className="border-t border-slate-800/60 pt-1.5 mt-1.5 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-450">
                        <span>Base Slab Tax:</span>
                        <span className="font-bold text-slate-200">{formatCurrency(currentCalculation.baseTax)}</span>
                      </div>
                      
                      {currentCalculation.rebate87A > 0 && (
                        <div className="flex justify-between text-[10px] font-bold text-emerald-400">
                          <span>(-) Section 87A Rebate:</span>
                          <span>-{formatCurrency(currentCalculation.rebate87A)}</span>
                        </div>
                      )}
                      
                      {currentCalculation.marginalRelief > 0 && (
                        <div className="flex justify-between text-[10px] font-bold text-purple-400">
                          <span>(-) Marginal Relief:</span>
                          <span>-{formatCurrency(currentCalculation.marginalRelief)}</span>
                        </div>
                      )}
                      
                      {currentCalculation.cess > 0 && (
                        <div className="flex justify-between text-[10px] font-semibold text-slate-450">
                          <span>(+) Cess @ 4%:</span>
                          <span>+{formatCurrency(currentCalculation.cess)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-[10px] font-black text-white pt-1 border-t border-slate-850/40">
                        <span>Total Tax Payable:</span>
                        <span>{formatCurrency(currentCalculation.annualTax)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Deduction Box */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated Monthly TDS</p>
                  <h2 className="text-2xl font-black text-emerald-400">{formatCurrency(currentCalculation.monthlyTDS)} <span className="text-[10px] text-slate-400 font-medium">/ month</span></h2>
                </div>
                {selectedEmployee && (
                  <button
                    onClick={handleApplyTDS}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Apply to Payroll</span>
                  </button>
                )}
              </div>
            </div>

            {/* Smart regime advisor card */}
            {selectedEmployee && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded">Smart Advisor</span>
                  <h4 className="font-bold text-xs text-slate-855">Which regime is best?</h4>
                </div>

                <div className="text-xs space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">New Regime Tax</p>
                      <p className="text-sm font-black text-slate-700 mt-0.5">{formatCurrency(comparisonNew.annualTax)}/yr</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Old Regime Tax</p>
                      <p className="text-sm font-black text-slate-700 mt-0.5">{formatCurrency(comparisonOld.annualTax)}/yr</p>
                    </div>
                  </div>

                  {taxDifference === 0 ? (
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Total tax is identical in both regimes (\u20B90 Tax). We recommend the default **New Tax Regime**.
                    </p>
                  ) : (
                    <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-3.5 flex gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                      <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                        You should choose the **{betterRegime}**. This will save the employee **{formatCurrency(taxDifference)}** per year!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Tab 2: Saved TDS Logs Table --- */}
      {activeTab === "records" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
          
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Header Actions Menu */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Employee Active TDS Records</h3>
                <span className="bg-blue-50 text-blue-600 font-bold border border-blue-100 px-2 py-0.5 rounded text-[10px]">
                  {filteredRecords.length} records
                </span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search records by name/ID..."
                  value={recordsSearchQuery}
                  onChange={(e) => {
                    setRecordsSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-xs bg-white"
                />
              </div>
            </div>

            {/* Sub-tabs to filter table views based on Regime */}
            <div className="flex gap-2 p-4 pt-2 bg-slate-50/30 border-b border-slate-100 flex-shrink-0">
              <button
                onClick={() => {
                  setRecordsRegimeFilter("New Regime");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  recordsRegimeFilter === "New Regime"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                New Regime Log ({tdsRecords.filter(r => r.regime === "New Regime").length})
              </button>
              <button
                onClick={() => {
                  setRecordsRegimeFilter("Old Regime");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  recordsRegimeFilter === "Old Regime"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Old Regime Log ({tdsRecords.filter(r => r.regime === "Old Regime").length})
              </button>
            </div>

            {/* Table Container - Dynamic Columns based on Selected Filter */}
            <div className="overflow-auto flex-1 min-h-0 no-scrollbar">
              <table className="w-full border-collapse text-left text-[10px]">
                {recordsRegimeFilter === "New Regime" ? (
                  // --- NEW REGIME TABLE HEADERS ---
                  <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                    <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-2 pl-4 whitespace-nowrap">Employee Info</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Gross CTC</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Std. Deduct.</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Taxable Income</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Tax (Pre-Rebate)</th>
                      <th className="py-2.5 px-2 text-right text-emerald-655 whitespace-nowrap">87A Rebate</th>
                      <th className="py-2.5 px-2 text-right text-purple-655 whitespace-nowrap">Marginal Relief</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Cess (4%)</th>
                      <th className="py-2.5 px-2 text-right text-slate-800 whitespace-nowrap">Final Annual Tax</th>
                      <th className="py-2.5 px-2 text-right text-emerald-600 whitespace-nowrap pr-4">Monthly TDS</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap pr-4">Actions</th>
                    </tr>
                  </thead>
                ) : (
                  // --- OLD REGIME TABLE HEADERS ---
                  <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                    <tr className="border-b border-gray-250 text-gray-455 font-semibold select-none uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-2 pl-4 whitespace-nowrap">Employee Info</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Gross CTC</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Std. Deduct.</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap text-blue-600">Sec 80C</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap text-blue-600">Sec 80D</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap text-blue-600">Sec 24(b)</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap text-blue-600">Sec 80CCD</th>
                      <th className="py-2.5 px-2 text-right text-blue-600">HRA Exemp.</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Taxable Income</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Tax (Pre-Rebate)</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap">Cess (4%)</th>
                      <th className="py-2.5 px-2 text-right text-slate-800 whitespace-nowrap">Final Annual Tax</th>
                      <th className="py-2.5 px-2 text-right text-emerald-600 whitespace-nowrap">Monthly TDS</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap text-slate-500 font-bold">Doc. Verification</th>
                      <th className="py-2.5 px-2 text-right whitespace-nowrap pr-4">Actions</th>
                    </tr>
                  </thead>
                )}

                <tbody className="divide-y divide-gray-100 text-gray-500 font-medium">
                  {paginatedRecords.map((item) => {
                    const calc = calculateTDS(
                      item.grossAnnual,
                      item.regime,
                      item.deductions80C,
                      item.deductions80D,
                      item.deductions24b,
                      item.deductions80CCD,
                      item.hraExemption
                    );

                    return recordsRegimeFilter === "New Regime" ? (
                      // --- NEW REGIME ROWS ---
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-2 pl-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                              {item.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-[10px] whitespace-nowrap leading-tight">{item.employeeName}</p>
                              <p className="text-[8px] text-slate-400 font-semibold leading-none">{item.empId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-slate-700 whitespace-nowrap">{formatCurrency(item.grossAnnual)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-500 whitespace-nowrap">-{formatCurrency(calc.standardDeduction)}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(calc.taxableIncome)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-700 whitespace-nowrap">{formatCurrency(calc.baseTax)}</td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-600 whitespace-nowrap">
                          {calc.rebate87A > 0 ? `-${formatCurrency(calc.rebate87A)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-purple-600 whitespace-nowrap">
                          {calc.marginalRelief > 0 ? `-${formatCurrency(calc.marginalRelief)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-500 whitespace-nowrap">
                          {calc.cess > 0 ? `+${formatCurrency(calc.cess)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-black text-slate-800 whitespace-nowrap">{formatCurrency(calc.annualTax)}</td>
                        <td className="py-2 px-2 text-right font-black text-emerald-600 bg-emerald-50/20 whitespace-nowrap pr-4">{formatCurrency(calc.monthlyTDS)}</td>
                        <td className="py-2 px-2 text-right whitespace-nowrap pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setViewingRecordDetails(item); setModalTab("tax"); }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const emp = availableEmployees.find(e => e.id === item.empId);
                                if (emp) {
                                  setSelectedEmployee(emp);
                                  setGrossAnnualSalary(item.grossAnnual);
                                  setSelectedRegime(item.regime);
                                  setDeductions80C(item.deductions80C);
                                  setDeductions80D(item.deductions80D);
                                  setDeductions24b(item.deductions24b || 0);
                                  setDeductions80CCD(item.deductions80CCD || 0);
                                  setHraExemption(item.hraExemption);
                                  setActiveTab("calculator");
                                  toast.success(`Loaded ${item.employeeName} into Calculator.`);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all cursor-pointer"
                              title="Recalculate / Edit"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // --- OLD REGIME ROWS ---
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-2 pl-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                              {item.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-[10px] whitespace-nowrap leading-tight">{item.employeeName}</p>
                              <p className="text-[8px] text-slate-400 font-semibold leading-none">{item.empId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-slate-700 whitespace-nowrap">{formatCurrency(item.grossAnnual)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-500 whitespace-nowrap">-{formatCurrency(calc.standardDeduction)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-blue-600 whitespace-nowrap">
                          {item.deductions80C > 0 ? `-${formatCurrency(item.deductions80C)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-blue-600 whitespace-nowrap">
                          {item.deductions80D > 0 ? `-${formatCurrency(item.deductions80D)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-blue-600 whitespace-nowrap">
                          {item.deductions24b > 0 ? `-${formatCurrency(item.deductions24b)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-blue-600 whitespace-nowrap">
                          {item.deductions80CCD > 0 ? `-${formatCurrency(item.deductions80CCD)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-blue-600 whitespace-nowrap">
                          {item.hraExemption > 0 ? `-${formatCurrency(item.hraExemption)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-slate-800 whitespace-nowrap">{formatCurrency(calc.taxableIncome)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-700 whitespace-nowrap">{formatCurrency(calc.baseTax)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-500 whitespace-nowrap">
                          {calc.cess > 0 ? `+${formatCurrency(calc.cess)}` : "-"}
                        </td>
                        <td className="py-2 px-2 text-right font-black text-slate-800 whitespace-nowrap">{formatCurrency(calc.annualTax)}</td>
                        <td className="py-2 px-2 text-right font-black text-emerald-600 bg-emerald-50/20 whitespace-nowrap pr-4">{formatCurrency(calc.monthlyTDS)}</td>
                        <td 
                          onClick={() => setStatusUpdateRecord(item)}
                          className="py-2 px-2 text-center whitespace-nowrap cursor-pointer hover:bg-slate-50/70 select-none"
                          title="Click to update status"
                        >
                          <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all border shadow-xs inline-block hover:scale-105 active:scale-95 ${
                              item.verificationStatus === "Accept"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50"
                                : item.verificationStatus === "Reject"
                                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/50"
                                : item.verificationStatus === "Reviewed"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/50"
                                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/50"
                            }`}
                          >
                            {item.verificationStatus || "Pending"}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right whitespace-nowrap pr-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setViewingRecordDetails(item); setModalTab("tax"); }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const emp = availableEmployees.find(e => e.id === item.empId);
                                if (emp) {
                                  setSelectedEmployee(emp);
                                  setGrossAnnualSalary(item.grossAnnual);
                                  setSelectedRegime(item.regime);
                                  setDeductions80C(item.deductions80C);
                                  setDeductions80D(item.deductions80D);
                                  setDeductions24b(item.deductions24b || 0);
                                  setDeductions80CCD(item.deductions80CCD || 0);
                                  setHraExemption(item.hraExemption);
                                  setActiveTab("calculator");
                                  toast.success(`Loaded ${item.employeeName} into Calculator.`);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all cursor-pointer"
                              title="Recalculate / Edit"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={recordsRegimeFilter === "New Regime" ? 11 : 15} className="p-12 text-center text-slate-400 font-bold italic bg-white">
                        No active TDS records found for this regime.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination bar at the very bottom */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-semibold text-slate-500 flex-shrink-0">
            {/* Rows selector */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  setRowsPerPage(val === "All" ? "All" : Number(val));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 px-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {rowsPerPage !== "All" && totalPages > 1 ? (
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                >
                  Prev
                </button>
                <span className="px-2 text-[11px] text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                >
                  Next
                </button>
              </div>
            ) : (
              <span className="text-slate-400 font-medium italic">Showing all {filteredRecords.length} records</span>
            )}
          </div>
        </div>
      )}

      {/* --- Detail Computation View Modal --- */}
      {viewingRecordDetails && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {viewingRecordDetails.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{viewingRecordDetails.employeeName}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{viewingRecordDetails.empId} • {viewingRecordDetails.designation}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingRecordDetails(null)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>

            {(() => {
              const calc = calculateTDS(
                viewingRecordDetails.grossAnnual,
                viewingRecordDetails.regime,
                viewingRecordDetails.deductions80C,
                viewingRecordDetails.deductions80D,
                viewingRecordDetails.deductions24b,
                viewingRecordDetails.deductions80CCD,
                viewingRecordDetails.hraExemption
              );

              return (
                <div className="p-6 space-y-4 text-xs font-semibold text-slate-600">
                  {/* Modal Tab Switcher */}
                  <div className="flex border-b border-slate-100 pb-2 mb-2 gap-4">
                    <button
                      onClick={() => setModalTab("tax")}
                      className={`pb-1 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        modalTab === "tax"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Tax Details
                    </button>
                    {viewingRecordDetails.regime === "Old Regime" && (
                      <button
                        onClick={() => setModalTab("docs")}
                        className={`pb-1 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          modalTab === "docs"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Documents ({viewingRecordDetails.documents?.length || 0})
                      </button>
                    )}
                  </div>

                  {/* Both Tab Contents wrapped inside a fixed height div of 300px for size consistency */}
                  <div className="h-[300px] overflow-y-auto no-scrollbar pr-1">
                    {modalTab === "tax" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Side: Salary Structure */}
                        <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2 h-fit">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary Structure Summary</p>
                          <div className="grid grid-cols-2 gap-2 text-slate-700">
                            <p>Gross Annual CTC:</p>
                            <p className="font-bold text-slate-850 text-right">{formatCurrency(viewingRecordDetails.grossAnnual)}</p>
                            <p>Standard Deduction:</p>
                            <p className="font-bold text-slate-850 text-right">-{formatCurrency(calc.standardDeduction)}</p>
                            {viewingRecordDetails.regime === "Old Regime" && (
                              <>
                                <p>Section 80C (PF, LIC):</p>
                                <p className="font-bold text-slate-850 text-right">-{formatCurrency(viewingRecordDetails.deductions80C)}</p>
                                <p>Section 80D (Health):</p>
                                <p className="font-bold text-slate-850 text-right">-{formatCurrency(viewingRecordDetails.deductions80D)}</p>
                                <p>Section 24(b) (Home Loan):</p>
                                <p className="font-bold text-slate-850 text-right">-{formatCurrency(viewingRecordDetails.deductions24b)}</p>
                                <p>Section 80CCD (NPS):</p>
                                <p className="font-bold text-slate-850 text-right">-{formatCurrency(viewingRecordDetails.deductions80CCD)}</p>
                                <p>HRA Exemption:</p>
                                <p className="font-bold text-slate-850 text-right">-{formatCurrency(viewingRecordDetails.hraExemption)}</p>
                              </>
                            )}
                            <div className="col-span-2 pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                              <span>Taxable Net Income:</span>
                              <span>{formatCurrency(calc.taxableIncome)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Tax Calculation */}
                        <div className="space-y-4 h-fit">
                          <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tax Calculation Breakdown</p>
                            <div className="grid grid-cols-2 gap-2 text-slate-700">
                              <p>Base Slab Tax:</p>
                              <p className="font-bold text-slate-850 text-right">{formatCurrency(calc.baseTax)}</p>
                              {calc.rebate87A > 0 && (
                                <>
                                  <p className="text-emerald-700">(-) Sec 87A Rebate:</p>
                                  <p className="font-bold text-emerald-700 text-right">-{formatCurrency(calc.rebate87A)}</p>
                                </>
                              )}
                              {calc.marginalRelief > 0 && (
                                <>
                                  <p className="text-purple-700">(-) Marginal Relief:</p>
                                  <p className="font-bold text-purple-700 text-right">-{formatCurrency(calc.marginalRelief)}</p>
                                </>
                              )}
                              {calc.cess > 0 && (
                                <>
                                  <p>(+) Cess @ 4%:</p>
                                  <p className="font-bold text-slate-850 text-right">+{formatCurrency(calc.cess)}</p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="border border-emerald-100 rounded-xl p-3.5 bg-emerald-50/50 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-emerald-800">
                              <p className="font-bold">Total Annual Tax:</p>
                              <p className="font-black text-right text-sm">{formatCurrency(calc.annualTax)}</p>
                              <p className="font-bold">Monthly TDS Deduction:</p>
                              <p className="font-black text-right text-sm text-emerald-600">{formatCurrency(calc.monthlyTDS)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {viewingRecordDetails.documents && viewingRecordDetails.documents.length > 0 ? (
                          viewingRecordDetails.documents.map((doc, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-2xs">
                              <div className="flex items-center gap-2.5 max-w-[70%]">
                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div className="overflow-hidden">
                                  <p className="font-bold text-slate-800 text-[10px] truncate" title={doc.name}>
                                    {doc.name}
                                  </p>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 font-black px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                                    {doc.category}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => window.open(doc.url, "_blank")}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[10px] cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-xs"
                              >
                                <span>Open</span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 italic">
                            <FileText className="w-8 h-8 text-slate-350 mb-2" />
                            <p className="text-[10px]">No verification documents attached.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewingRecordDetails(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Status Update Popup Modal with Smooth Animation --- */}
      {statusUpdateRecord && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-scale-up">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Update Document Status</h3>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{statusUpdateRecord.employeeName}</p>
              </div>
              <button
                onClick={() => setStatusUpdateRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>

            <div className="p-5 space-y-3">
              {(["Pending", "Reviewed", "Accept", "Reject"] as const).map((status) => {
                const isSelected = statusUpdateRecord.verificationStatus === status;
                const statusStyles = {
                  Pending: "hover:bg-amber-50 hover:text-amber-800 border-amber-200 text-amber-700 bg-amber-50/20",
                  Reviewed: "hover:bg-indigo-50 hover:text-indigo-800 border-indigo-200 text-indigo-700 bg-indigo-50/20",
                  Accept: "hover:bg-emerald-50 hover:text-emerald-800 border-emerald-200 text-emerald-700 bg-emerald-50/20",
                  Reject: "hover:bg-rose-50 hover:text-rose-800 border-rose-200 text-rose-700 bg-rose-50/20",
                };

                return (
                  <button
                    key={status}
                    onClick={() => {
                      handleUpdateVerificationStatus(statusUpdateRecord, status);
                      setStatusUpdateRecord(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-blue-600/30 border-blue-600 bg-blue-50/30 text-blue-700"
                        : `border-slate-200 text-slate-600 bg-white ${statusStyles[status]}`
                    }`}
                  >
                    <span>{status}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-end">
              <button
                onClick={() => setStatusUpdateRecord(null)}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer shadow-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Bulk Auto-TDS calculation processing modal --- */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-scale-up">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">Bulk TDS Calculation Engine</h3>
              </div>
              <button
                disabled={bulkProcessing}
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              {!bulkProcessing ? (
                <>
                  <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-4 flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-blue-900 text-xs">Bulk Processing Notice</p>
                      <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">
                        This operation will automatically run calculation for all **{availableEmployees.length} employees** in the company directory. 
                        It will evaluate both New & Old tax slabs and assign the cheaper regime choice automatically.
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Directory Summary</p>
                    <div className="flex justify-between text-slate-700 text-[11px]">
                      <span>Total Active Employees:</span>
                      <span className="font-bold text-slate-850">{availableEmployees.length} profiles</span>
                    </div>
                    <div className="flex justify-between text-slate-700 text-[11px] pt-1">
                      <span>Default Investments (Old Regime):</span>
                      <span className="font-bold text-slate-850">Standard limits (1.5L 80C + 25k 80D)</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black tracking-wider">
                      <span>Running tax calculations...</span>
                      <span>{bulkProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-200 ease-out rounded-full" 
                        style={{ width: `${bulkProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Optimizing regimes and applying TDS deductions to profiles...</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-2">
              <button
                disabled={bulkProcessing}
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-550 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
              {!bulkProcessing && (
                <button
                  onClick={runBulkCalculation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Start Batch Job</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

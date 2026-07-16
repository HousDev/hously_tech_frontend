import React, { useState } from "react";
import {
  Briefcase,
  CreditCard,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Landmark,
  FileText,
  Download,
  Calendar,
  DollarSign,
  Send,
  HelpCircle,
  History,
  Wallet,
  Award,
  Layers,
  Upload,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

// --- Types ---
interface HikeHistory {
  date: string;
  previousCTC: number;
  newCTC: number;
  hikePercentage: number;
  designation: string;
}

interface PaymentRecord {
  period: string;
  gross: number;
  deductions: number;
  net: number;
  date: string;
  status: "Credited" | "Processing";
  referenceId: string;
}

interface AdvanceRequest {
  id: string;
  amount: number;
  reason: string;
  tenureMonths: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Settled";
}

interface DeclarationDoc {
  id: string;
  category: "Section 80C" | "Section 80D" | "Section 24(b)" | "HRA Rent Receipt";
  amount: number;
  fileName: string;
  status: "Pending Verification" | "Approved" | "Action Required";
  date: string;
}

export default function Payroll() {
  const [innerTab, setInnerTab] = useState<"structure" | "history" | "advance" | "tds">("structure");

  // --- Common Helpers ---
  const formatCurrency = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  // ==========================================
  // 1. STATE & DATA: Payroll Summary Structure
  // ==========================================
  const employeeSalary = {
    grossAnnual: 1200000,
    monthlyGross: 100000,
    basic: 50000,
    hra: 25000,
    specialAllowance: 15000,
    pfContribution: 6000,
    professionalTax: 200,
    estimatedTDS: 3800,
  };

  const hikeTimeline: HikeHistory[] = [
    {
      date: "April 01, 2026",
      previousCTC: 1020000,
      newCTC: 1200000,
      hikePercentage: 17.6,
      designation: "MTS-2",
    },
    {
      date: "April 01, 2025",
      previousCTC: 900000,
      newCTC: 1020000,
      hikePercentage: 13.3,
      designation: "MTS-1",
    },
  ];

  const netMonthly =
    employeeSalary.monthlyGross -
    (employeeSalary.pfContribution +
      employeeSalary.professionalTax +
      employeeSalary.estimatedTDS);

  // ==========================================
  // 2. STATE & DATA: Payment Credit History Logs
  // ==========================================
  const [selectedPayslip, setSelectedPayslip] = useState<PaymentRecord | null>(null);
  const bankDetails = {
    bankName: "HDFC Bank Ltd",
    accountNum: "•••• •••• 9840",
    ifsc: "HDFC0001242",
    holderName: "Suraj Kumar",
  };

  const paymentLogs: PaymentRecord[] = [
    {
      period: "June 2026",
      gross: 100000,
      deductions: 10000,
      net: 90000,
      date: "June 30, 2026",
      status: "Credited",
      referenceId: "TXN8739102428",
    },
    {
      period: "May 2026",
      gross: 100000,
      deductions: 10000,
      net: 90000,
      date: "May 31, 2026",
      status: "Credited",
      referenceId: "TXN7392019483",
    },
    {
      period: "April 2026",
      gross: 100000,
      deductions: 10000,
      net: 90000,
      date: "April 30, 2026",
      status: "Credited",
      referenceId: "TXN1849204829",
    },
    {
      period: "March 2026",
      gross: 85000,
      deductions: 8500,
      net: 76500,
      date: "March 31, 2026",
      status: "Credited",
      referenceId: "TXN0938204823",
    },
    {
      period: "February 2026",
      gross: 85000,
      deductions: 8500,
      net: 76500,
      date: "February 28, 2026",
      status: "Credited",
      referenceId: "TXN6492018492",
    },
    {
      period: "January 2026",
      gross: 85000,
      deductions: 8500,
      net: 76500,
      date: "January 31, 2026",
      status: "Credited",
      referenceId: "TXN1948203810",
    },
  ];

  // ==========================================
  // 3. STATE & DATA: Salary Advance requests
  // ==========================================
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([
    {
      id: "ADV-2026-004",
      amount: 15000,
      reason: "Medical Checkup & Medicines",
      tenureMonths: 2,
      date: "May 10, 2026",
      status: "Settled",
    },
  ]);
  const [advAmount, setAdvAmount] = useState<number>(10000);
  const [advTenure, setAdvTenure] = useState<number>(3);
  const [advReason, setAdvReason] = useState<string>("");
  const [isSubmittingAdv, setIsSubmittingAdv] = useState<boolean>(false);

  const maxAdvanceLimit = 50000;
  const activeOustandingAdv = advanceRequests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.amount, 0);

  const handleRequestAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (advAmount <= 0) {
      toast.error("Please enter a valid request amount.");
      return;
    }
    if (advAmount > maxAdvanceLimit) {
      toast.error(`Request exceeds your maximum advance limit of ${formatCurrency(maxAdvanceLimit)}.`);
      return;
    }
    if (!advReason.trim()) {
      toast.error("Please provide a reason for the advance request.");
      return;
    }

    setIsSubmittingAdv(true);
    setTimeout(() => {
      const newReq: AdvanceRequest = {
        id: `ADV-2026-00${advanceRequests.length + 5}`,
        amount: advAmount,
        reason: advReason,
        tenureMonths: advTenure,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "Pending",
      };

      setAdvanceRequests((prev) => [newReq, ...prev]);
      setAdvReason("");
      setIsSubmittingAdv(false);
      toast.success("Salary advance request submitted successfully!");
    }, 800);
  };

  // ==========================================
  // 4. STATE & DATA: TDS Declarations
  // ==========================================
  const [selectedRegime, setSelectedRegime] = useState<"New Regime" | "Old Regime" | any>("New Regime");
  const [uploadedDocs, setUploadedDocs] = useState<DeclarationDoc[]>([
    {
      id: "DOC-80C-01",
      category: "Section 80C",
      amount: 150000,
      fileName: "PPF_Passbook_FY26.pdf",
      status: "Approved",
      date: "May 12, 2026",
    },
    {
      id: "DOC-HRA-01",
      category: "HRA Rent Receipt",
      amount: 80000,
      fileName: "Rent_Receipt_Q1_2026.pdf",
      status: "Pending Verification",
      date: "June 15, 2026",
    },
  ]);
  const [docCategory, setDocCategory] = useState<"Section 80C" | "Section 80D" | "Section 24(b)" | "HRA Rent Receipt">("Section 80C");
  const [docAmount, setDocAmount] = useState<string>("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState<boolean>(false);

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docAmount || Number(docAmount) <= 0) {
      toast.error("Please enter a valid declaration amount.");
      return;
    }
    if (!docFile) {
      toast.error("Please upload a supporting PDF/Image document.");
      return;
    }

    setIsSubmittingDoc(true);
    setTimeout(() => {
      const newDoc: DeclarationDoc = {
        id: `DOC-NEW-0${uploadedDocs.length + 1}`,
        category: docCategory,
        amount: Number(docAmount),
        fileName: docFile.name,
        status: "Pending Verification",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setUploadedDocs((prev) => [newDoc, ...prev]);
      setDocAmount("");
      setDocFile(null);
      setIsSubmittingDoc(false);
      toast.success(`${docCategory} declaration proof uploaded successfully!`);
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Inner tabs selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px flex-shrink-0">
        {[
          { id: "structure", label: "Salary Structure", icon: Briefcase },
          { id: "history", label: "Payment History", icon: FileText },
          { id: "advance", label: "Salary Advance", icon: DollarSign },
          { id: "tds", label: "Tax Declarations (TDS)", icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInnerTab(tab.id as any)}
            className={`flex items-center gap-1.5 pb-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
              innerTab === tab.id
                ? "text-blue-600 border-blue-650 font-black"
                : "text-slate-400 border-transparent hover:text-slate-650"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SALARY STRUCTURE VIEW */}
      {/* ========================================================================= */}
      {innerTab === "structure" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual CTC Package</p>
                <h3 className="text-xl font-black text-slate-800 mt-1">{formatCurrency(employeeSalary.grossAnnual)}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Fixed Gross Salary</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Monthly In-Hand (Est.)</p>
                <h3 className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(netMonthly)}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Credited to Bank Account</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Increment Hike</p>
                <h3 className="text-xl font-black text-purple-600 mt-1">+17.6%</h3>
                <p className="text-[10px] text-purple-500 font-semibold mt-0.5">Effective Apr 2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-800">Monthly Compensation Breakdown</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500">
                  FY 2026-27
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Earnings (Base & Allowances)</p>
                  <div className="space-y-2 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                      <span>Basic Salary</span>
                      <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.basic)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                      <span>House Rent Allowance (HRA)</span>
                      <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.hra)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                      <span>Special Allowance</span>
                      <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.specialAllowance)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-100/50 rounded-xl text-slate-850 font-bold border-t border-slate-200">
                      <span>Total Gross Earnings</span>
                      <span>{formatCurrency(employeeSalary.monthlyGross)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-[9px] font-black text-rose-500 tracking-wider uppercase">Deductions & Contributions</p>
                  <div className="space-y-2 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                      <span>Employee Provident Fund (EPF)</span>
                      <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.pfContribution)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                      <span>Estimated TDS (Income Tax)</span>
                      <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.estimatedTDS)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                      <span>Professional Tax (PT)</span>
                      <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.professionalTax)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-rose-100/20 rounded-xl text-rose-800 font-bold border-t border-rose-200">
                      <span>Total Deductions</span>
                      <span>-{formatCurrency(employeeSalary.pfContribution + employeeSalary.estimatedTDS + employeeSalary.professionalTax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-800">Increment & CTC Timeline</h3>
                </div>

                <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6 my-2 text-xs">
                  {hikeTimeline.map((hike, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white ring-4 ring-purple-50" />
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold">{hike.date}</p>
                        <p className="font-bold text-slate-800">{hike.designation}</p>
                        <div className="flex items-center gap-2 text-slate-500 font-semibold mt-1">
                          <span>{formatCurrency(hike.previousCTC)}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                          <span className="text-purple-650 font-bold">{formatCurrency(hike.newCTC)}</span>
                          <span className="ml-auto bg-purple-50 text-purple-700 font-extrabold px-1.5 py-0.5 rounded text-[9px]">
                            +{hike.hikePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-2.5 text-xs text-slate-550 font-semibold mt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Your salary components and hikes are locked by HR. Contact the Finance team for clarifications on CTC breakdown.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAYMENT HISTORY / PAYSLIPS */}
      {/* ========================================================================= */}
      {innerTab === "history" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Salary Disbursement Account</h4>
                  <p className="text-xs text-slate-450 mt-1 font-semibold">
                    {bankDetails.bankName} • Account {bankDetails.accountNum}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl p-3 w-full md:w-auto">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">IFSC Code</p>
                  <p className="text-slate-700 font-bold mt-0.5">{bankDetails.ifsc}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Account Holder</p>
                  <p className="text-slate-700 font-bold mt-0.5">{bankDetails.holderName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Salary Credit History</h3>
              <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded">
                All Payments Disbursed
              </span>
            </div>

            <div className="overflow-x-auto flex-grow no-scrollbar">
              <table className="w-full border-collapse text-[11px] text-slate-500 font-semibold">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase select-none">
                    <th className="py-3 px-4 text-left pl-6">Pay Period</th>
                    <th className="py-3 px-4 text-left">Credit Date</th>
                    <th className="py-3 px-4 text-right">Gross Paid</th>
                    <th className="py-3 px-4 text-right">Deductions</th>
                    <th className="py-3 px-4 text-right">Net Credited</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right pr-6">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 pl-6 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {log.period}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{log.date}</td>
                      <td className="py-3.5 px-4 text-right">{formatCurrency(log.gross)}</td>
                      <td className="py-3.5 px-4 text-right text-rose-500">-{formatCurrency(log.deductions)}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{formatCurrency(log.net)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right pr-6">
                        <button
                          onClick={() => setSelectedPayslip(log)}
                          className="p-1 px-2.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1.5 ml-auto"
                        >
                          <FileText className="w-3 h-3" />
                          View Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SALARY ADVANCE REQUESTS */}
      {/* ========================================================================= */}
      {innerTab === "advance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Advance Limit</p>
                <h3 className="text-xl font-black text-slate-800 mt-1">{formatCurrency(maxAdvanceLimit - activeOustandingAdv)}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Based on 50% of monthly gross</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</p>
                <h3 className="text-xl font-black text-amber-600 mt-1">{formatCurrency(activeOustandingAdv)}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">To be deducted from payroll</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
              <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Requests</p>
                <h3 className="text-xl font-black text-purple-600 mt-1">
                  {advanceRequests.filter((r) => r.status === "Pending").length}
                </h3>
                <p className="text-[10px] text-purple-500 font-semibold mt-0.5">Awaiting HR Approval</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <form
              onSubmit={handleRequestAdvance}
              className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">NEW REQUEST</span>
                  <h3 className="font-bold text-sm text-slate-800">Apply for Short-Term Advance</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase text-[10px]">Request Amount</span>
                    <span className="text-blue-600">{formatCurrency(advAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={maxAdvanceLimit}
                    step={1000}
                    value={advAmount}
                    onChange={(e) => setAdvAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{formatCurrency(5000)}</span>
                    <span>{formatCurrency(maxAdvanceLimit)} (Max Limit)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Repayment Tenure</label>
                  <select
                    value={advTenure}
                    onChange={(e) => setAdvTenure(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value={1}>1 Month (Immediate Deduction)</option>
                    <option value={2}>2 Months Installments</option>
                    <option value={3}>3 Months Installments</option>
                    <option value={6}>6 Months Installments</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Reason for Advance <span className="text-rose-500">*</span></label>
                  <textarea
                    value={advReason}
                    onChange={(e) => setAdvReason(e.target.value)}
                    rows={3}
                    placeholder="Describe your requirement (medical emergency, rent deposit, tuition fees, etc.)..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAdv || activeOustandingAdv > 0}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmittingAdv ? "Submitting..." : activeOustandingAdv > 0 ? "Outstanding Advance Active" : "Submit Request to HR"}
              </button>
            </form>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="font-bold text-sm text-slate-800">Requests Log</h3>
                </div>

                <div className="space-y-3.5 max-h-[280px] overflow-y-auto no-scrollbar text-xs">
                  {advanceRequests.map((req, idx) => (
                    <div key={idx} className="border border-slate-100 p-3 bg-slate-50/30 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-[9px] text-slate-400 font-bold">{req.id}</p>
                          <p className="font-bold text-slate-800 mt-0.5">{formatCurrency(req.amount)}</p>
                        </div>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                            req.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : req.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : req.status === "Settled"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold italic">"{req.reason}"</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-slate-100/60 pt-1.5">
                        <span>Applied: {req.date}</span>
                        <span>Tenure: {req.tenureMonths} Months</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2 text-[10px] text-slate-400 font-semibold">
                <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Deductions are automatically configured into monthly payslips once approved by Finance admin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TAX / TDS DECLARATIONS */}
      {/* ========================================================================= */}
      {innerTab === "tds" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-800">Select Tax Regime for TDS Calculations</h4>
                <p className="text-xs text-slate-450 mt-1 font-semibold">
                  Currently calculated TDS will update dynamically based on this selection.
                </p>
              </div>
              <div className="flex gap-2.5 bg-slate-100 p-1.5 rounded-xl self-stretch sm:self-auto justify-center">
                <button
                  onClick={() => {
                    setSelectedRegime("New Regime");
                    toast.success("Tax calculation regime updated to New Regime.");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedRegime === "New Regime"
                      ? "bg-[#0D47A1] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  New Tax Regime (Default)
                </button>
                <button
                  onClick={() => {
                    setSelectedRegime("Old Regime");
                    toast.success("Tax calculation regime updated to Old Regime.");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedRegime === "Old Regime"
                      ? "bg-[#0D47A1] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Old Tax Regime
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs flex gap-3 text-slate-550 font-semibold leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              {selectedRegime === "New Regime" ? (
                <p>
                  Under the <strong>New Tax Regime</strong> (FY 2026-27), investment declarations under Section 80C, 80D, 24(b) etc. are <strong>not applicable</strong>. You get a flat standard deduction of ₹75,000, and no tax applies for net taxable income up to ₹12,00,000.
                </p>
              ) : (
                <p>
                  Under the <strong>Old Tax Regime</strong>, you must upload valid investment proofs to reduce your taxable income. Please upload files like PPF passbook, premium receipts, house rent agreements, and health policy premium slips below.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <form
              onSubmit={handleDocSubmit}
              className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">STEP 1</span>
                  <h3 className="font-bold text-sm text-slate-800">Submit Exemption Claim</h3>
                </div>

                {selectedRegime === "New Regime" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2.5 text-xs text-amber-800 font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <p className="leading-normal text-[10.5px]">
                      Old regime claims will be ignored for tax calculation since you have chosen the New Tax Regime. Toggle regime to Old to apply these.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Claim Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Section 80C">Section 80C (PPF, ELSS, LIC, Sukanya)</option>
                    <option value="Section 80D">Section 80D (Health Insurance Premium)</option>
                    <option value="Section 24(b)">Section 24(b) (Home Loan Interest)</option>
                    <option value="HRA Rent Receipt">HRA Rent Receipt (House Rent Exemption)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Declared Amount (₹) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={docAmount}
                    onChange={(e) => setDocAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Supporting Proof Document <span className="text-rose-500">*</span></label>
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-all">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocFile(e.target.files[0]);
                        }
                      }}
                      accept=".pdf,image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 text-slate-400 font-semibold text-xs flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-350" />
                      {docFile ? (
                        <span className="text-blue-600 font-bold text-[10px] truncate max-w-[200px]">
                          {docFile.name}
                        </span>
                      ) : (
                        <>
                          <span>Click to upload supporting files</span>
                          <span className="text-[9px] text-slate-400 font-medium">Supports PDF, JPG, PNG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingDoc}
                className="w-full mt-6 bg-[#0D47A1] hover:bg-blue-600 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {isSubmittingDoc ? "Uploading Proof..." : "Submit Claims Proof"}
              </button>
            </form>

            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-sm text-slate-800">Uploaded Tax Exemption Proofs</h3>
                  </div>
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-[9px] px-2 py-0.5 rounded">
                    Active Tax Year: 2026-27
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar text-xs">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="border border-slate-100 p-4 bg-slate-50/20 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[12px]">{doc.category}</p>
                            <p className="font-mono text-[9px] text-slate-400 font-semibold mt-0.5">{doc.id} • Submitted on {doc.date}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                              doc.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                               : doc.status === "Pending Verification"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-rose-50 text-rose-700 border-rose-100"
                            }`}
                          >
                            {doc.status}
                          </span>
                          <p className="font-bold text-slate-700 text-xs">{formatCurrency(doc.amount)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100/60 pt-2.5 text-[10px] text-slate-500 font-semibold">
                        <span className="truncate max-w-[200px]">{doc.fileName}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => window.open("#", "_blank")}
                            className="p-1 hover:bg-slate-100 rounded transition cursor-pointer text-slate-400 hover:text-slate-650"
                            title="View Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setUploadedDocs((prev) => prev.filter((d) => d.id !== doc.id));
                              toast.success("Declaration deleted successfully.");
                            }}
                            className="p-1 hover:bg-rose-50 rounded transition cursor-pointer text-slate-450 hover:text-rose-600"
                            title="Delete Claim"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 text-[10px] text-slate-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-650 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Exemption deductions will be verified by HR team within 3-5 business days. Once verified, TDS estimations will adjust automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Payslip Print Preview Overlay --- */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-base text-slate-800">HOUSLY TECH PVT LTD</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Salary Slips Summary Statement</p>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-650 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Employee Name</p>
                  <p className="text-slate-800 font-bold mt-0.5">{bankDetails.holderName}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Pay Period</p>
                  <p className="text-slate-800 font-bold mt-0.5">{selectedPayslip.period}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Payment Mode</p>
                  <p className="text-slate-800 font-bold mt-0.5">Bank Credit ({bankDetails.bankName})</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Reference ID</p>
                  <p className="text-slate-800 font-mono mt-0.5 text-[10px]">{selectedPayslip.referenceId}</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Gross Salary Earned:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(selectedPayslip.gross)}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>(-) Total Deductions:</span>
                  <span className="font-bold">-{formatCurrency(selectedPayslip.deductions)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-black text-slate-900 text-sm">
                  <span>Net Salary Credited:</span>
                  <span className="text-emerald-600">{formatCurrency(selectedPayslip.net)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Print Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

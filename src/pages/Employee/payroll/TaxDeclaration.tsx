import React, { useState } from "react";
import { FileText, Upload, Plus, Trash2, Eye, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface DeclarationDoc {
  id: string;
  category: "Section 80C" | "Section 80D" | "Section 24(b)" | "Section 80CCD" | "HRA Rent Receipt";
  amount: number;
  fileName: string;
  status: "Pending Verification" | "Approved" | "Action Required";
  date: string;
  fileUrl?: string;
}

export default function TaxDeclaration() {
  const [selectedRegime, setSelectedRegime] = useState<"New Regime" | "Old Regime">("New Regime");

  // Toggles for active regime lock
  const [autoCalc, setAutoCalc] = useState<boolean>(false); // OFF by default
  const [oldRegimeToggle, setOldRegimeToggle] = useState<boolean>(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Common dynamic date string e.g., "16 Jul"
  const getTodayDateString = () => {
    const d = new Date();
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    return `${day} ${month}`;
  };
  const todayStr = getTodayDateString();

  // --- NEW REGIME CALCULATION ENGINE ---
  const [grossAnnualInput] = useState<number>(1800000); // Fixed 18L
  const standardDeduction = 75000;
  const netTaxableIncome = Math.max(0, grossAnnualInput - standardDeduction);

  const calculateNewRegimeTDS = (income: number) => {
    let slab5 = 0, slab10 = 0, slab15 = 0, slab20 = 0, slab25 = 0, slab30 = 0;
    if (income > 400000) slab5 = Math.min(400000, income - 400000) * 0.05;
    if (income > 800000) slab10 = Math.min(400000, income - 800000) * 0.1;
    if (income > 1200000) slab15 = Math.min(400000, income - 1200000) * 0.15;
    if (income > 1600000) slab20 = Math.min(400000, income - 1600000) * 0.2;
    if (income > 2000000) slab25 = Math.min(400000, income - 2000000) * 0.25;
    if (income > 2400000) slab30 = (income - 2400000) * 0.3;

    const baseTax = slab5 + slab10 + slab15 + slab20 + slab25 + slab30;
    let rebate87A = income <= 1200000 ? baseTax : 0;
    let marginalRelief = 0;
    if (income > 1200000 && income <= 1275000) {
      const excessIncome = income - 1200000;
      if (baseTax > excessIncome) marginalRelief = baseTax - excessIncome;
    }
    const netTax = Math.max(0, baseTax - rebate87A - marginalRelief);
    const cess = netTax * 0.04;
    const totalTax = netTax + cess;
    return { slab5, slab10, slab15, slab20, slab25, slab30, baseTax, rebate87A, marginalRelief, totalTax, monthlyTDS: totalTax / 12 };
  };
  const taxDetails = calculateNewRegimeTDS(netTaxableIncome);

  // --- OLD REGIME DECLARATIONS ---
  const [oldSubTab, setOldSubTab] = useState<"declaration" | "document">("declaration");

  // Declaration Form inputs
  const [val80C, setVal80C] = useState("");
  const [val80D, setVal80D] = useState("");
  const [val24b, setVal24b] = useState("");
  const [val80CCD, setVal80CCD] = useState("");
  const [valHRA, setValHRA] = useState("");
  const [declarationFiled, setDeclarationFiled] = useState(false);
  const [hrApproved, setHrApproved] = useState(false);

  // Upload proof state
  const [category, setCategory] = useState<"Section 80C" | "Section 80D" | "Section 24(b)" | "Section 80CCD" | "HRA Rent Receipt">("Section 80C");
  const [amount, setAmount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const [uploadedDocs, setUploadedDocs] = useState<DeclarationDoc[]>([
    {
      id: "DOC-80C-01",
      category: "Section 80C",
      amount: 150000,
      fileName: "PPF_Passbook_FY26.pdf",
      status: "Approved",
      date: "May 12, 2026",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ]);

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid declaration amount.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a supporting PDF/Image document.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(selectedFile);
      const newDoc: DeclarationDoc = {
        id: `DOC-NEW-0${uploadedDocs.length + 1}`,
        category: category,
        amount: Number(amount),
        fileName: selectedFile.name,
        status: "Pending Verification",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        fileUrl: fileUrl,
      };
      setUploadedDocs((prev) => [newDoc, ...prev]);
      setAmount("");
      setSelectedFile(null);
      setIsSubmitting(false);
      toast.success(`${category} proof document uploaded successfully!`);
    }, 850);
  };

  const handleDeclarationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeclarationFiled(true);
    toast.success("Declarations filed successfully! Verification pending.", {
      icon: "📄"
    });
  };

  const handleDeleteDoc = (id: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== id));
    setIsDeleteModalOpen(false);
    setDocToDelete(null);
    toast.success("Declaration proof deleted successfully.", {
      icon: "🗑️"
    });
  };

  // Determine locking states
  const isNewTabDisabled = oldRegimeToggle && selectedRegime === "Old Regime";
  const isOldTabDisabled = autoCalc && selectedRegime === "New Regime";

  const formatCurrency = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  return (
    <div className="space-y-6 text-left relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-slide {
          animation: fadeInSlide 0.5s ease-out forwards;
        }
        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #0273d8 25%, #93c5fd 50%, #0273d8 75%);
          background-size: 200% 100%;
          animation: shimmerLine 2.5s infinite linear;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />

      {/* Top Main regime tabs switcher (Sticky) */}
      <div className="sticky top-0 bg-[#f8fafc] z-20 pb-3 pt-3 -mx-6 px-6 -mt-6 mb-5 flex flex-wrap gap-2.5 items-center border-b border-transparent">
        {/* New Tax Regime Tab button */}
        <button
          onClick={() => {
            if (isNewTabDisabled) {
              toast.error("New Regime tab is locked. Turn off Old Regime Toggle first.");
              return;
            }
            setSelectedRegime("New Regime");
          }}
          disabled={isNewTabDisabled}
          className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${isNewTabDisabled
            ? "bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed opacity-50"
            : selectedRegime === "New Regime"
              ? "bg-[#0273d8] text-white border-[#0273d8]"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          New Tax Regime
          {autoCalc && (
            <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          )}
        </button>

        {/* Old Tax Regime Tab button */}
        <button
          onClick={() => {
            if (isOldTabDisabled) {
              toast.error("Old Regime tab is locked. Turn off New Regime Toggle first.");
              return;
            }
            setSelectedRegime("Old Regime");
          }}
          disabled={isOldTabDisabled}
          className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${isOldTabDisabled
            ? "bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed opacity-50"
            : selectedRegime === "Old Regime"
              ? "bg-[#0273d8] text-white border-[#0273d8]"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Old Tax Regime
          {oldRegimeToggle && (
            <>
              {hrApproved ? (
                <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : declarationFiled ? (
                <span className="text-[8px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-amber-500" />
                  Pending
                </span>
              ) : (
                <span className="text-[8px] font-black uppercase text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  Draft
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* ========================================================== */}
      {/* 1. NEW REGIME VIEW */}
      {/* ========================================================== */}
      {selectedRegime === "New Regime" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Automated Regime Projection</h3>
              <p className="text-xs text-slate-455 mt-0.5 font-semibold">
                Turn on the calculation switcher to check tax auto-calculations and timeline flow.
              </p>
            </div>

            <button
              onClick={() => {
                const nextVal = !autoCalc;
                setAutoCalc(nextVal);
                if (nextVal) {
                  toast.success("New Tax Regime Enabled!", {
                    icon: "✅",
                    style: {
                      background: "#ecfdf5",
                      color: "#047857",
                      border: "1px solid #a7f3d0",
                      fontWeight: "bold",
                    }
                  });
                } else {
                  toast("New Tax Regime Disabled.");
                }
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 border ${autoCalc ? "bg-[#0273d8] border-[#0273d8]" : "bg-slate-200 border-slate-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm border border-slate-350 transform transition-transform duration-300 ${autoCalc ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          {autoCalc && (
            <div className="space-y-5 animate-fade-in-slide">
              {/* Timeline Progress */}
              <div className="bg-white rounded-xl border border-slate-200/65 p-4 py-5 overflow-x-auto no-scrollbar flex justify-start md:justify-center">
                <div className="flex items-center justify-between w-full min-w-[500px] md:min-w-0 max-w-2xl relative">
                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Regime selected</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{todayStr}</span>
                  </div>

                  <div className="flex-grow h-1 mx-3 -mt-6 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 shimmer-bg" />
                  </div>

                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Tax auto-calculated</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{todayStr}</span>
                  </div>

                  <div className="flex-grow h-1 mx-3 -mt-6 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 shimmer-bg" />
                  </div>

                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Locked for the year</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{todayStr}</span>
                  </div>
                </div>
              </div>

              {/* 2-Column layout grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/70 overflow-hidden text-slate-750">
                  <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      Live Tax Calculation
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-[#0D47A1] text-white px-2 py-0.5 rounded shadow-xs">
                      New Regime
                    </span>
                  </div>

                  <div className="p-6 space-y-4 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase text-[10px] tracking-wide">Gross Annual Income:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(grossAnnualInput)}</span>
                    </div>

                    <div className="flex justify-between text-rose-500">
                      <span className="text-rose-450 uppercase text-[10px] tracking-wide">(-) Standard Deduction:</span>
                      <span className="font-bold">-{formatCurrency(standardDeduction)}</span>
                    </div>

                    <div className="border-t border-dashed border-slate-200 my-2 pt-2.5 flex justify-between font-black text-slate-900 text-sm">
                      <span>NET TAXABLE INCOME:</span>
                      <span>{formatCurrency(netTaxableIncome)}</span>
                    </div>

                    <div className="pt-2 space-y-2">
                      <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Slab Calculations (Bracket):</p>
                      <div className="space-y-1.5 pl-2 text-[11px] text-slate-550">
                        <div className="flex justify-between">
                          <span>₹0L - ₹4L @ 0%</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹4L - ₹8L @ 5%</span>
                          <span>{formatCurrency(taxDetails.slab5)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹8L - ₹12L @ 10%</span>
                          <span>{formatCurrency(taxDetails.slab10)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹12L - ₹16L @ 15%</span>
                          <span>{formatCurrency(taxDetails.slab15)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>₹16L - ₹20L @ 20%</span>
                          <span>{formatCurrency(taxDetails.slab20)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Base Slab Tax:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(taxDetails.baseTax)}</span>
                      </div>
                      <div className="border-t border-double border-slate-300 pt-3 flex justify-between font-black text-slate-900 text-sm">
                        <span>TOTAL TAX PAYABLE (YEAR):</span>
                        <span>{formatCurrency(taxDetails.totalTax)}</span>
                      </div>
                      <div className="flex justify-between pt-2 text-emerald-650 font-black text-xs bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                        <span className="uppercase text-[9px] mt-0.5 tracking-wider">Estimated Monthly TDS Deduction:</span>
                        <span>{formatCurrency(taxDetails.monthlyTDS)} / month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 text-[10px] text-slate-400 font-bold text-center border-t border-slate-100 tracking-wider">
                    HOUSLY TECH PVT LTD • AUTO TDS CALCULATION RECEIPT
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200/65 p-5 space-y-3.5">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">New Regime Insights</h3>
                    <ul className="text-xs space-y-3 font-semibold text-slate-600 pl-1">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        <span><strong>Flat Standard Deduction:</strong> Flat deduction of ₹75,000 automatically subtracted from gross.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        <span><strong>Zero Tax Limit:</strong> No tax is payable on net taxable incomes up to ₹12,00,000.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. OLD REGIME VIEW */}
      {/* ========================================================== */}
      {selectedRegime === "Old Regime" && (
        <div className="space-y-5">
          {/* Toggle container */}
          <div className="bg-white rounded-xl border border-slate-200/65 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Old Regime Exemption Projection</h3>
              <p className="text-xs text-slate-455 mt-0.5 font-semibold">
                Turn on the declaration toggle to enable step-by-step progress audits and proof submissions.
              </p>
            </div>

            <button
              onClick={() => {
                const nextVal = !oldRegimeToggle;
                setOldRegimeToggle(nextVal);
                if (nextVal) {
                  toast.success("Old Tax Regime Enabled!", {
                    icon: "✅",
                    style: {
                      background: "#ecfdf5",
                      color: "#047857",
                      border: "1px solid #a7f3d0",
                      fontWeight: "bold",
                    }
                  });
                } else {
                  toast("Old Tax Regime Disabled.");
                }
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 border ${oldRegimeToggle ? "bg-[#0273d8] border-[#0273d8]" : "bg-slate-200 border-slate-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm border border-slate-350 transform transition-transform duration-300 ${oldRegimeToggle ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          {/* Toggle-Dependent Content */}
          {oldRegimeToggle && (
            <div className="space-y-6">
              {/* 5-Step Progress Timeline (Matches Image 3) */}
              <div className="bg-white rounded-xl border border-slate-200/65 p-4 py-5 overflow-x-auto no-scrollbar flex justify-start md:justify-center">
                <div className="flex items-center justify-between w-full min-w-[640px] md:min-w-0 max-w-4xl relative">

                  {/* Step 1: Regime selected (Completed) */}
                  <div className="flex flex-col items-center z-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Regime selected</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{todayStr}</span>
                  </div>

                  <div className="flex-grow h-0.5 mx-2 -mt-6 bg-[#0273d8]" />

                  {/* Step 2: Declaration filed */}
                  <div className="flex flex-col items-center z-10 text-center">
                    {(declarationFiled || hrApproved) ? (
                      <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold shadow-md border-2 border-amber-50 text-xs">
                        2
                      </div>
                    )}
                    <span className={`text-[11px] font-bold mt-2 ${(declarationFiled || hrApproved) ? "text-slate-850" : "text-amber-700"}`}>
                      Declaration filed
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                      {(declarationFiled || hrApproved) ? todayStr : "Pending"}
                    </span>
                  </div>

                  <div className={`flex-grow h-0.5 mx-2 -mt-6 ${(declarationFiled || hrApproved) ? "bg-[#0273d8]" : "bg-slate-200"}`} />

                  {/* Step 3: Proof submission */}
                  <div className="flex flex-col items-center z-10 text-center">
                    {hrApproved ? (
                      <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                        ✓
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 ${declarationFiled
                        ? "bg-amber-600 text-white border-amber-50"
                        : "bg-white text-slate-400 border-slate-200"
                        }`}>
                        3
                      </div>
                    )}
                    <span className={`text-[11px] font-bold mt-2 ${hrApproved ? "text-slate-850" : declarationFiled ? "text-amber-700" : "text-slate-455"}`}>
                      Proof submission
                    </span>
                    <span className="text-[9px] text-slate-455 font-bold mt-0.5">
                      {hrApproved ? todayStr : "Due 31 Jan"}
                    </span>
                  </div>

                  <div className={`flex-grow h-0.5 mx-2 -mt-6 ${hrApproved ? "bg-[#0273d8]" : "bg-slate-200"}`} />

                  {/* Step 4: HR verification */}
                  <div className="flex flex-col items-center z-10 text-center">
                    {hrApproved ? (
                      <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center font-bold shadow-sm border-2 border-slate-200 text-xs">
                        4
                      </div>
                    )}
                    <span className={`text-[11px] font-bold mt-2 ${hrApproved ? "text-slate-850" : "text-slate-450"}`}>
                      HR verification
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                      {hrApproved ? todayStr : "—"}
                    </span>
                  </div>

                  <div className={`flex-grow h-0.5 mx-2 -mt-6 ${hrApproved ? "bg-[#0273d8]" : "bg-slate-200"}`} />

                  {/* Step 5: Final tax locked */}
                  <div className="flex flex-col items-center z-10 text-center">
                    {hrApproved ? (
                      <div className="w-8 h-8 rounded-full bg-[#0273d8] text-white flex items-center justify-center font-bold shadow-md border-2 border-blue-50 text-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center font-bold shadow-sm border-2 border-slate-200 text-xs">
                        5
                      </div>
                    )}
                    <span className={`text-[11px] font-bold mt-2 ${hrApproved ? "text-slate-850" : "text-slate-455"}`}>
                      Final tax locked
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                      {hrApproved ? todayStr : "—"}
                    </span>
                  </div>

                </div>
              </div>

              {/* Sub-tab selection */}
              <div className="flex gap-4 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setOldSubTab("declaration")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 ${oldSubTab === "declaration"
                    ? "text-[#0273d8] border-[#0273d8] font-extrabold"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                >
                  Declaration value
                </button>
                <button
                  onClick={() => setOldSubTab("document")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 ${oldSubTab === "document"
                    ? "text-[#0273d8] border-[#0273d8] font-extrabold"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                >
                  Document
                </button>
              </div>

              {/* Nested Content views */}
              {oldSubTab === "declaration" ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                  {/* Declaration Form Inputs */}
                  <form
                    onSubmit={handleDeclarationSubmit}
                    className="lg:col-span-3 bg-white rounded-xl border border-slate-200/65 p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">FORM</span>
                      <h3 className="font-bold text-sm text-slate-800">Old Regime Investment Declarations</h3>
                    </div>

                    {/* Industrial Summary Card */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-semibold text-slate-600">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Declared Deductions</p>
                        <p className="text-slate-800 text-lg font-black mt-1">
                          {formatCurrency(
                            (Number(val80C) || 0) +
                            (Number(val80D) || 0) +
                            (Number(val24b) || 0) +
                            (Number(val80CCD) || 0) +
                            (Number(valHRA) || 0)
                          )}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Deductions Limit Cap</p>
                        <p className="text-slate-700 text-xs font-black mt-1">₹4,75,000 + HRA</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 80C */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Section 80C (PF/LIC/ELSS)</label>
                        <input
                          type="number"
                          value={val80C}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 150000) {
                              setVal80C("150000");
                            } else {
                              setVal80C(e.target.value);
                            }
                          }}
                          placeholder="Max ₹1,50,000"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block">Maximum limit is ₹1,50,000</span>
                      </div>

                      {/* 80D */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Section 80D (Health Ins.)</label>
                        <input
                          type="number"
                          value={val80D}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 75000) {
                              setVal80D("75000");
                            } else {
                              setVal80D(e.target.value);
                            }
                          }}
                          placeholder="Max ₹75,000"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block">Maximum limit is ₹75,000</span>
                      </div>

                      {/* 24(b) */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Section 24(b) (Home Loan)</label>
                        <input
                          type="number"
                          value={val24b}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 200000) {
                              setVal24b("200000");
                            } else {
                              setVal24b(e.target.value);
                            }
                          }}
                          placeholder="Max ₹2,00,000"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block">Maximum limit is ₹2,00,000</span>
                      </div>

                      {/* 80CCD */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Section 80CCD (Extra NPS)</label>
                        <input
                          type="number"
                          value={val80CCD}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 50000) {
                              setVal80CCD("50000");
                            } else {
                              setVal80CCD(e.target.value);
                            }
                          }}
                          placeholder="Max ₹50,000"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block">Maximum limit is ₹50,000</span>
                      </div>

                      {/* HRA */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">HRA Exemption</label>
                        <input
                          type="number"
                          value={valHRA}
                          onChange={(e) => setValHRA(e.target.value)}
                          placeholder="Enter HRA Exemption"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                        <span className="text-[9px] text-slate-400 font-semibold block">Max limit: Actual HRA Component</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-[#0273d8] hover:bg-blue-650 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submit Declarations
                    </button>
                  </form>

                  {/* Insights card */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200/65 p-5 space-y-3.5">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Declaration Guidelines</h3>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                        These inputs are provisional declarations. Supporting documents matching these values must be uploaded under the "Document" sub-tab before the deadline.
                      </p>

                      {declarationFiled && !hrApproved && (
                        <div className="mt-4 p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex gap-2.5 text-xs font-semibold text-amber-805">
                          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">HR Review Pending</p>
                            <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-relaxed">
                              Verification of documents is underway. Once approved, status updates to active automatically.
                            </p>
                          </div>
                        </div>
                      )}

                      {hrApproved && (
                        <div className="mt-4 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex gap-2.5 text-xs font-semibold text-emerald-805">
                          <ShieldCheck className="w-4 h-4 text-emerald-650 flex-shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">Deduction Claims Approved</p>
                            <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-relaxed">
                              Exemptions verified. Final tax slab estimates locked successfully.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                  {/* File Upload Zone */}
                  <form
                    onSubmit={handleDocSubmit}
                    className="lg:col-span-2 bg-white rounded-xl border border-slate-200/65 p-5 space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded">UPLOAD</span>
                        <h3 className="font-bold text-sm text-slate-800">Upload Investment Proof</h3>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Claim Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Section 80C">Section 80C (PF/LIC/ELSS)</option>
                          <option value="Section 80D">Section 80D (Health Ins.)</option>
                          <option value="Section 24(b)">Section 24(b) (Home Loan)</option>
                          <option value="Section 80CCD">Section 80CCD (Extra NPS)</option>
                          <option value="HRA Rent Receipt">HRA Rent Exemption</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Declared Amount (₹) <span className="text-rose-500">*</span></label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="e.g. 150000"
                          className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Supporting Proof Document <span className="text-rose-500">*</span></label>
                        <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-all">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-2 text-slate-400 font-semibold text-xs flex flex-col items-center">
                            <Upload className="w-8 h-8 text-slate-350" />
                            {selectedFile ? (
                              <span className="text-blue-600 font-bold text-[10px] truncate max-w-[200px]">
                                {selectedFile.name}
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
                      disabled={isSubmitting}
                      className="w-full mt-6 bg-[#0273d8] hover:bg-blue-650 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isSubmitting ? "Uploading Proof..." : "Submit Claims Proof"}
                    </button>
                  </form>

                  {/* Upload List */}
                  <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/65 p-5 flex flex-col justify-between min-h-[380px]">
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

                      {uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="border border-slate-100 p-4 bg-slate-50/20 rounded-2xl space-y-3">
                          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-between sm:items-start">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-[12px]">{doc.category}</p>
                                <p className="font-mono text-[9px] text-slate-400 font-semibold mt-0.5">{doc.id} • Submitted on {doc.date}</p>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 w-full sm:w-auto border-t sm:border-t-0 border-slate-100/50 pt-2 sm:pt-0">
                              <span
                                className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${doc.status === "Approved"
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

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100/60 pt-2.5 text-[10px] text-slate-550 font-semibold">
                            <span className="truncate max-w-[200px]">{doc.fileName}</span>
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => {
                                  if (doc.fileUrl) {
                                    window.open(doc.fileUrl, "_blank");
                                  } else {
                                    toast.error("Document preview url not available.");
                                  }
                                }}
                                className="p-1 hover:bg-slate-100 rounded transition cursor-pointer text-slate-400 hover:text-slate-650"
                                title="View Document"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setDocToDelete(doc.id);
                                  setIsDeleteModalOpen(true);
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

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2.5 text-[10px] text-slate-400 font-semibold mt-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-650 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Exemption deductions will be verified by HR team within 3-5 business days. Once verified, TDS estimations will adjust automatically.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Animated Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isDeleteModalOpen
          ? "opacity-100 pointer-events-auto visible backdrop-blur-xs"
          : "opacity-0 pointer-events-none invisible"
          }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/40"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setDocToDelete(null);
          }}
        />

        {/* Modal Box */}
        <div
          className={`bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full relative z-10 shadow-xl transition-all duration-300 transform ${isDeleteModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
            }`}
        >
          <div className="flex items-center gap-3 text-rose-650 mb-3.5">
            <span className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-800">Delete Declaration Proof?</h3>
          </div>

          <p className="text-xs font-semibold text-slate-550 leading-relaxed mb-5">
            Are you sure you want to remove this document claim proof? This action will instantly delete your uploaded file and cannot be undone.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDocToDelete(null);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-550 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (docToDelete) handleDeleteDoc(docToDelete);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

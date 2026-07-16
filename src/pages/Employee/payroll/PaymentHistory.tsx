import React, { useState } from "react";
import { CreditCard, FileText, Download, Landmark, Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface PaymentRecord {
  period: string;
  gross: number;
  deductions: number;
  net: number;
  date: string;
  status: "Credited" | "Processing";
  referenceId: string;
}

export default function PaymentHistory() {
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

  // Column wise Filter States
  const [filterPeriod, setFilterPeriod] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(10);

  const formatCurrency = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  // Filter payment logs
  const filteredLogs = paymentLogs.filter((log) => {
    const matchesPeriod = log.period.toLowerCase().includes(filterPeriod.toLowerCase());
    const matchesDate = log.date.toLowerCase().includes(filterDate.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesPeriod && matchesDate && matchesStatus;
  });

  // Pagination computations
  const effectiveLimit = itemsPerPage === "All" ? filteredLogs.length : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / (effectiveLimit || 1)));
  const displayedLogs = filteredLogs.slice(
    (currentPage - 1) * (effectiveLimit || 1),
    currentPage * (effectiveLimit || 1)
  );

  return (
    <div className="lg:h-full flex flex-col space-y-6 text-left relative min-h-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
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

      {/* Bank Details Card (Fixed at top) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Landmark className="w-5 h-5" />
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

      {/* Card Table Container (Fills remaining height) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden flex-grow min-h-0">
        
        {/* Table Title Header (Fixed) */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-xs text-slate-750 uppercase tracking-wider">Salary Credit History</h3>
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded">
            All Payments Disbursed
          </span>
        </div>

        {/* Scrollable Viewport Wrapper */}
        <div className="overflow-x-auto no-scrollbar flex-grow overflow-y-auto">
          <table className="w-full border-collapse text-[11px] text-slate-500 font-semibold relative">
            <thead>
              <tr className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <th className="py-4 px-4 text-left pl-6 bg-slate-50">Pay Period</th>
                <th className="py-4 px-4 text-left bg-slate-50">Credit Date</th>
                <th className="py-4 px-4 text-right bg-slate-50">Gross Paid</th>
                <th className="py-4 px-4 text-right bg-slate-50">Deductions</th>
                <th className="py-4 px-4 text-right bg-slate-50">Net Credited</th>
                <th className="py-4 px-4 text-center bg-slate-50">Status</th>
                <th className="py-4 px-4 text-right pr-6 bg-slate-50">Payslip</th>
              </tr>
              {/* Column-wise filtering fields */}
              <tr className="sticky top-[48px] z-20 bg-slate-50 border-b border-slate-100">
                <td className="px-4 py-3 bg-slate-50 pl-6">
                  <input
                    type="text"
                    value={filterPeriod}
                    onChange={(e) => { setFilterPeriod(e.target.value); setCurrentPage(1); }}
                    placeholder="Search Period..."
                    className="w-full max-w-[120px] bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </td>
                <td className="px-4 py-3 bg-slate-50">
                  <input
                    type="text"
                    value={filterDate}
                    onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                    placeholder="Search Date..."
                    className="w-full max-w-[120px] bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </td>
                <td className="px-4 py-3 bg-slate-50" /> {/* Gross */}
                <td className="px-4 py-3 bg-slate-50" /> {/* Deductions */}
                <td className="px-4 py-3 bg-slate-50" /> {/* Net */}
                <td className="px-4 py-3 bg-slate-50 text-center">
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-semibold cursor-pointer text-slate-600"
                  >
                    <option value="All">All Status</option>
                    <option value="Credited">Credited</option>
                    <option value="Processing">Processing</option>
                  </select>
                </td>
                <td className="px-4 py-3 bg-slate-50 text-right pr-6" /> {/* Actions */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 text-slate-350" />
                      <p className="font-semibold text-xs">No matching disbursements found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-4 font-bold text-slate-800 pl-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {log.period}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-slate-600 font-medium">{log.date}</td>
                    <td className="py-5 px-4 text-right font-medium">{formatCurrency(log.gross)}</td>
                    <td className="py-5 px-4 text-right text-rose-500 font-medium">-{formatCurrency(log.deductions)}</td>
                    <td className="py-5 px-4 text-right font-extrabold text-emerald-600">{formatCurrency(log.net)}</td>
                    <td className="py-5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        log.status === "Credited"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right pr-6">
                      <button
                        onClick={() => setSelectedPayslip(log)}
                        className="p-1 px-2.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100/50 hover:border-transparent transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1.5 ml-auto"
                      >
                        <FileText className="w-3 h-3" />
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Persistent Pagination Footer */}
        <div className="bg-slate-50/75 border-t border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold text-slate-500 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              Showing <span className="text-slate-800">
                {filteredLogs.length === 0 ? 0 : (currentPage - 1) * (effectiveLimit || 1) + 1}
              </span> to{" "}
              <span className="text-slate-800">
                {Math.min(currentPage * (effectiveLimit || 1), filteredLogs.length)}
              </span>{" "}
              of <span className="text-slate-800">{filteredLogs.length}</span> entries
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 ml-0 sm:ml-4 border-l sm:border-l border-slate-200 pl-0 sm:pl-4">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemsPerPage(val === "All" ? "All" : Number(val));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-650"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
              <span className="text-slate-400 font-bold uppercase text-[9px]">entries</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded-lg transition cursor-pointer ${
                  currentPage === p
                    ? "bg-[#0273d8] border-[#0273d8] text-white font-extrabold"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600 bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center bg-white"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Payslip Modal Statement */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-base text-slate-800">HOUSLY TECH PVT LTD</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Salary Slips Statement</p>
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
                className="px-4 py-2 bg-[#0273d8] hover:bg-blue-650 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
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

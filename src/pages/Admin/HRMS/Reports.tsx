import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { TrendingUp, Users, Download, ArrowUpRight } from "lucide-react";

export default function HRMSReports() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("HR Analytics & Reports");
      setHeaderSubtitle("Export headcount statistics, recruitment funnels, and retention trends");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Analytics Chart Block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Staff Recruitment Funnel (Q2 2026)</h3>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full flex items-center gap-0.5">
            <ArrowUpRight size={10} /> +12.4% Headcount
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { stage: "Applications Screened", val: "184 Candidates", pct: "100%" },
            { stage: "Technical Interviews", val: "42 Candidates", pct: "22.8%" },
            { stage: "HR Round", val: "18 Candidates", pct: "9.7%" },
            { stage: "Hired / Placed", val: "6 Candidates", pct: "3.2%" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.stage}</span>
              <h4 className="text-base font-bold text-gray-900 mt-1">{item.val}</h4>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-2.5 overflow-hidden max-w-[80px] mx-auto">
                <div className="bg-blue-600 h-full" style={{ width: item.pct }} />
              </div>
              <p className="text-[9px] text-blue-600 font-bold mt-1.5">{item.pct} conversion</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exportable reports table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Preconfigured HR Reports</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { name: "Monthly Headcount and Department Ratios.xlsx", format: "Excel Format", size: "124 KB", desc: "Breakdown of staff roles by engineering, design, operations, marketing" },
            { name: "Q1/Q2 Recruitment Funnel Conversion Analysis.pdf", format: "PDF Document", size: "2.8 MB", desc: "Detailed analysis of interview loop drop-offs and hiring source attribution" },
            { name: "Shift Attendance and Working Hours Audit Ledger.xlsx", format: "Excel Format", size: "348 KB", desc: "Consolidated hours logging for monthly compensation calculation" },
            { name: "Employee Leaves and Time-off Accrual Report.xlsx", format: "Excel Format", size: "112 KB", desc: "Yearly CL/SL/Vacation balance breakdown for corporate liability audits" },
          ].map((report, idx) => (
            <div key={idx} className="flex justify-between items-center p-5 first:pt-4 last:pb-4 hover:bg-slate-50/30 transition-colors">
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-gray-800 text-xs">{report.name}</h4>
                <p className="text-[10px] text-gray-500">{report.desc}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{report.format} &bull; {report.size}</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0">
                <Download size={12} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

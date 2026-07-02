import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, Clock, Briefcase, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function HRMSDashboard() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("HRMS Dashboard");
      setHeaderSubtitle("Unified overview of headcounts, attendance trackers, and recruitment metrics");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Staff", val: "48", pct: "+4.2%", positive: true, sub: "employees onboard", icon: Users, color: "bg-blue-500" },
          { label: "Attendance Today", val: "94.2%", pct: "+1.8%", positive: true, sub: "daily check-in rate", icon: Clock, color: "bg-indigo-500" },
          { label: "Open Positions", val: "6 Active", pct: "-2.4%", positive: false, sub: "in-pipeline openings", icon: Briefcase, color: "bg-teal-500" },
          { label: "Compensation Run", val: "₹12.45L", pct: "+0.5%", positive: true, sub: "processed June cycle", icon: DollarSign, color: "bg-purple-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.val}</h3>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold">
                <span className={`inline-flex items-center ${stat.positive ? "text-emerald-600" : "text-rose-600"}`}>
                  {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.pct}
                </span>
                <span className="text-gray-400 font-medium">| {stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Attendance Activity Tracker</h3>
            <span className="text-[10px] text-gray-400 font-medium">Live logs</span>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: "Suraj Kumar", action: "Checked In", time: "09:02 AM", status: "On Time" },
              { name: "Anjali Sharma", action: "Checked In", time: "09:14 AM", status: "On Time" },
              { name: "Kunal Sen", action: "Checked In", time: "09:48 AM", status: "Late" },
              { name: "Neha Gupta", action: "Checked Out", time: "05:30 PM", status: "Shift Ended" },
            ].map((log, idx) => (
              <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                    {log.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-xs">{log.name}</h4>
                    <p className="text-[10px] text-gray-400">{log.action} &bull; {log.time}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                  log.status === "On Time" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  log.status === "Late" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-700 border-slate-100"
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* HR Operations Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">System Task Health</h3>
            <Activity className="text-blue-600" size={14} />
          </div>
          <div className="space-y-4">
            {[
              { label: "Payroll Processing", progress: "100%", desc: "June cycle distributed successfully", color: "bg-emerald-500" },
              { label: "Recruitments Loops", progress: "70%", desc: "3 candidates scheduled for tech interviews", color: "bg-blue-500" },
              { label: "Leave Balance Accruals", progress: "90%", desc: "Automated balance recalculation complete", color: "bg-indigo-500" },
              { label: "Expense Audit Logs", progress: "45%", desc: "8 filings pending reviewer verification", color: "bg-amber-500" },
            ].map((task, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-gray-700">
                  <span>{task.label}</span>
                  <span>{task.progress}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${task.color}`} style={{ width: task.progress }} />
                </div>
                <p className="text-[9px] text-gray-400">{task.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

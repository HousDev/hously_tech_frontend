import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Clock, CheckCircle2, AlertTriangle, XCircle, Search, Download } from "lucide-react";

export default function HRMSAttendance() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Time & Attendance");
      setHeaderSubtitle("Monitor staff attendance logs, check-in times, shift schedules, and leaves");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Attendance Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Present Today", val: "42 Staff", sub: "87.5% attendance", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Late Check-in", val: "4 Staff", sub: "checked in after 9:15 AM", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "On Leaves", val: "2 Staff", sub: "approved time-off cases", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Absent today", val: "0 Staff", sub: "no unexcused absences", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((widget, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${widget.bg} ${widget.color}`}>
              <widget.icon size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{widget.label}</span>
              <h4 className="text-base font-bold text-gray-900 mt-0.5">{widget.val}</h4>
              <p className="text-[9px] text-gray-500 mt-0.5 font-medium">{widget.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Daily Check-In logs</h3>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Download size={13} />
            <span>Export Report</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-3.5 pl-6">Employee ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Shift</th>
                <th className="p-3.5">Check-In</th>
                <th className="p-3.5">Check-Out</th>
                <th className="p-3.5">Working Hours</th>
                <th className="p-3.5 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "EMP-001", name: "Suraj Kumar", shift: "General (9am-6pm)", checkIn: "08:58 AM", checkOut: "06:05 PM", hours: "9h 7m", status: "On Time" },
                { id: "EMP-002", name: "Anjali Sharma", shift: "General (9am-6pm)", checkIn: "09:05 AM", checkOut: "06:00 PM", hours: "8h 55m", status: "On Time" },
                { id: "EMP-003", name: "Vikram Patel", shift: "General (9am-6pm)", checkIn: "09:12 AM", checkOut: "06:01 PM", hours: "8h 49m", status: "On Time" },
                { id: "EMP-004", name: "Kunal Sen", shift: "General (9am-6pm)", checkIn: "09:32 AM", checkOut: "06:00 PM", hours: "8h 28m", status: "Late" },
                { id: "EMP-005", name: "Neha Gupta", shift: "General (9am-6pm)", checkIn: "--", checkOut: "--", hours: "0h", status: "On Leave" },
              ].map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 pl-6 text-gray-400 font-semibold">{log.id}</td>
                  <td className="p-3.5 text-gray-900 font-bold">{log.name}</td>
                  <td className="p-3.5 text-gray-500 font-medium">{log.shift}</td>
                  <td className="p-3.5 text-gray-700 font-semibold">{log.checkIn}</td>
                  <td className="p-3.5 text-gray-700 font-semibold">{log.checkOut}</td>
                  <td className="p-3.5 text-gray-600 font-semibold">{log.hours}</td>
                  <td className="p-3.5 pr-6 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      log.status === "On Time" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      log.status === "Late" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

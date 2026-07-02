import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Calendar, Check, X, AlertCircle } from "lucide-react";

export default function HRMSLeaves() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Leave Management");
      setHeaderSubtitle("Manage time-off requests, vacation approvals, and yearly balance trackers");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Leave balance preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { type: "Casual Leave Balance", val: "12 Days", desc: "Available for utilization", color: "border-l-4 border-blue-500" },
          { type: "Sick Leave Balance", val: "8 Days", desc: "Available for medical cases", color: "border-l-4 border-emerald-500" },
          { type: "Paid Vacation Balances", val: "18 Days", desc: "Carry-over allowed till Dec", color: "border-l-4 border-indigo-500" },
        ].map((bal, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl border border-gray-150 shadow-sm ${bal.color} h-28 flex flex-col justify-between`}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{bal.type}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{bal.val}</h3>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{bal.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Request List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-3">Pending Leave Requests</h3>
        <div className="space-y-4">
          {[
            { name: "Anjali Sharma", type: "Casual Leave", dates: "Jul 9, 2026 (1 day)", reason: "Attending family function", balance: "12 CL left" },
            { name: "Kunal Sen", type: "Sick Leave", dates: "Jul 12 - Jul 13, 2026 (2 days)", reason: "Dental surgery recovery", balance: "8 SL left" },
          ].map((req, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-xs">{req.name}</h4>
                  <span className="text-[9px] text-gray-400 font-bold">({req.balance})</span>
                </div>
                <p className="text-xs text-gray-700 font-semibold">{req.type} &bull; <span className="text-blue-600">{req.dates}</span></p>
                <p className="text-[10px] text-gray-400 italic">" {req.reason} "</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
                  <Check size={12} />
                  <span>Approve</span>
                </button>
                <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100 transition-colors">
                  <X size={12} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

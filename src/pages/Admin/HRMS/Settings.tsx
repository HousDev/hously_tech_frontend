import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Settings, Save, Clock, Calendar } from "lucide-react";

export default function HRMSSettings() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("HRMS Configuration");
      setHeaderSubtitle("Define corporate structures, leave carry-over rules, and shift timing configurations");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Settings Options form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">HR System Settings</h3>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Save size={13} />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shift Timings */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Clock size={14} className="text-blue-500" />
              <span>Shift Timings Settings</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-gray-600">Daily Check-In Buffer (Minutes)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                />
                <p className="text-[9px] text-gray-400 mt-1">Number of minutes grace period allowed before marked Late check-in.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-gray-600">Shift Start Time</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-semibold text-gray-600">Shift End Time</label>
                  <input
                    type="time"
                    defaultValue="18:00"
                    className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Off Allocations */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Calendar size={14} className="text-emerald-500" />
              <span>Leave Allocation Cycles</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-gray-600">Yearly CL (Casual Leave) Allocation</label>
                <input
                  type="number"
                  defaultValue="12"
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-gray-600">Yearly SL (Sick Leave) Allocation</label>
                <input
                  type="number"
                  defaultValue="8"
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h5 className="font-semibold text-xs text-gray-700">Allow Carry Over</h5>
                  <p className="text-[9px] text-gray-400">Allow unused paid vacation leaves to accrue next fiscal year.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

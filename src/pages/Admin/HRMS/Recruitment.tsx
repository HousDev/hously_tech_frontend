import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Briefcase, Users, Plus, Star, MapPin } from "lucide-react";

export default function HRMSRecruitment() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Recruitment Pipeline");
      setHeaderSubtitle("Monitor job postings, screen applicants, and manage recruitment lifecycles");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Openings", val: "6 Jobs", desc: "4 technical, 2 non-tech", color: "bg-blue-500" },
          { label: "Total Applications", val: "84 Candidates", desc: "18 received today", color: "bg-teal-500" },
          { label: "Interviews Scheduled", val: "12 Today", desc: "Across next 3 business days", color: "bg-indigo-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <div className="mt-1">
              <h3 className="text-xl font-bold text-gray-900">{stat.val}</h3>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main pipeline lists */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Active Job Openings</h3>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Plus size={14} />
            <span>Post New Job</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Senior React Developer", dept: "Engineering", loc: "Remote / Noida", applicants: 32, type: "Full-Time" },
            { title: "Product Designer", dept: "Design", loc: "Noida Office", applicants: 15, type: "Full-Time" },
            { title: "SEO Content Specialist", dept: "Marketing", loc: "Remote", applicants: 21, type: "Contract" },
            { title: "HR Recruiter", dept: "HR Ops", loc: "Noida Office", applicants: 16, type: "Full-Time" },
          ].map((job, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 flex justify-between items-start transition-colors">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-xs">{job.title}</h4>
                <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-medium">
                  <span className="bg-slate-200/60 px-2 py-0.5 rounded text-gray-700">{job.dept}</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} /> {job.loc}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-blue-600">{job.applicants} Applied</span>
                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{job.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

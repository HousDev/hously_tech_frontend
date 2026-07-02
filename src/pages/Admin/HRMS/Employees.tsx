import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, Plus, Search, Filter, Mail, Phone, Calendar } from "lucide-react";

export default function HRMSEmployees() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Employees Directory");
      setHeaderSubtitle("Manage profiles, roles, contact listings, and organizational departments");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, role or ID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">
            <Filter size={14} />
            <span>Filters</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Plus size={14} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-4 pl-6">Employee ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "EMP-001", name: "Suraj Kumar", role: "Lead Frontend Engineer", dept: "Engineering", email: "suraj@hously.co", phone: "+91 98765-43210", status: "Active", date: "Jan 12, 2024" },
                { id: "EMP-002", name: "Anjali Sharma", role: "UI/UX Designer", dept: "Product Design", email: "anjali@hously.co", phone: "+91 98765-43211", status: "Active", date: "Mar 05, 2024" },
                { id: "EMP-003", name: "Vikram Patel", role: "HR Generalist", dept: "HR & People", email: "vikram@hously.co", phone: "+91 98765-43212", status: "Active", date: "Jun 19, 2023" },
                { id: "EMP-004", name: "Kunal Sen", role: "DevOps Engineer", dept: "Engineering", email: "kunal@hously.co", phone: "+91 98765-43213", status: "On Leave", date: "Oct 01, 2024" },
                { id: "EMP-005", name: "Neha Gupta", role: "Content Writer", dept: "Marketing", email: "neha@hously.co", phone: "+91 98765-43214", status: "Active", date: "Dec 10, 2024" },
              ].map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 text-gray-400 font-semibold">{emp.id}</td>
                  <td className="p-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{emp.name}</h4>
                      <p className="text-[10px] text-gray-500">{emp.role}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{emp.dept}</td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <Mail size={11} className="text-gray-400" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone size={11} className="text-gray-400" />
                        <span>{emp.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      emp.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-gray-500 font-medium">{emp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

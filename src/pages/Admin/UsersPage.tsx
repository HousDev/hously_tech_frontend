import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { UserCheck, ShieldAlert, Plus, Search, Mail, UserX, UserMinus, ToggleLeft, Edit2, Trash2 } from "lucide-react";

export default function UsersPage() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Users Administration");
      setHeaderSubtitle("Manage system logins, assign security clearances, and monitor user statuses");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Registered Users", val: "32 Users", desc: "Across all access levels", color: "border-l-4 border-blue-500" },
          { label: "Active Administrators", val: "3 Admins", desc: "Full database permissions", color: "border-l-4 border-indigo-500" },
          { label: "Disabled / Blocked", val: "1 Account", desc: "Restricted system logins", color: "border-l-4 border-rose-500" },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl border border-gray-150 shadow-sm ${stat.color} h-28 flex flex-col justify-between`}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{stat.val}</h3>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action and Search Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email or login profile..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0">
          <Plus size={14} />
          <span>Create New User</span>
        </button>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl overflow-hidden pb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-3.5 pl-6">ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Role Authorization</th>
                <th className="p-3.5">System Status</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "USR-01", name: "Suraj Kumar", email: "suraj@hously.co", role: "Super Admin", status: "Active" },
                { id: "USR-02", name: "Anjali Sharma", email: "anjali@hously.co", role: "Editor", status: "Active" },
                { id: "USR-03", name: "Vikram Patel", email: "vikram@hously.co", role: "HR Lead", status: "Active" },
                { id: "USR-04", name: "Rajesh Roy", email: "rajesh@hously.co", role: "Client Representative", status: "Blocked" },
              ].map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 pl-6 text-gray-400 font-semibold">{usr.id}</td>
                  <td className="p-3.5 text-gray-900 font-bold">{usr.name}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                      <Mail size={11} className="text-gray-400" />
                      <span>{usr.email}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-gray-500 font-bold">{usr.role}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      usr.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      {usr.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="Edit Profile">
                        <Edit2 size={13} />
                      </button>
                      <button className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors" title="Toggle Access">
                        <ToggleLeft size={13} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Remove Account">
                        <Trash2 size={13} />
                      </button>
                    </div>
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

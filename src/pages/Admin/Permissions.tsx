import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Shield, Save, Check } from "lucide-react";

export default function PermissionsPage() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Permissions Matrix");
      setHeaderSubtitle("Configure user roles, operation permissions, and security checklists across all system modules");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Mock permissions matrix state
  const [matrix, setMatrix] = useState([
    { role: "Super Admin", modules: { directory: true, recruitment: true, attendance: true, leaves: true, payroll: true, settings: true } },
    { role: "HR Manager", modules: { directory: true, recruitment: true, attendance: true, leaves: true, payroll: true, settings: false } },
    { role: "Department Head", modules: { directory: true, recruitment: false, attendance: true, leaves: true, payroll: false, settings: false } },
    { role: "General Staff", modules: { directory: false, recruitment: false, attendance: false, leaves: false, payroll: false, settings: false } },
  ]);

  const togglePermission = (roleIndex: number, moduleName: string) => {
    setMatrix(prev => prev.map((item, idx) => {
      if (idx !== roleIndex) return item;
      const key = moduleName as keyof typeof item.modules;
      return {
        ...item,
        modules: {
          ...item.modules,
          [key]: !item.modules[key]
        }
      };
    }));
  };

  return (
    <div className="p-6 w-full space-y-6">
      {/* Role permission matrix block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Access Control Policy Matrix</h3>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Save size={13} />
            <span>Save Policies</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-4 pl-6">Role Profile</th>
                <th className="p-4 text-center">Directory Access</th>
                <th className="p-4 text-center">Recruit Access</th>
                <th className="p-4 text-center">Logs Attendance</th>
                <th className="p-4 text-center">Leaves Approval</th>
                <th className="p-4 text-center">Process Payroll</th>
                <th className="p-4 text-center pr-6">System Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {matrix.map((row, roleIdx) => (
                <tr key={row.role} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-gray-900">{row.role}</td>
                  {(Object.keys(row.modules) as Array<keyof typeof row.modules>).map((moduleKey) => (
                    <td key={moduleKey} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={row.modules[moduleKey]}
                          disabled={row.role === "Super Admin"}
                          onChange={() => togglePermission(roleIdx, moduleKey)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

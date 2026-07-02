import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DollarSign, Download, Settings, FileText, CheckCircle2 } from "lucide-react";

export default function HRMSPayroll() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Payroll & Compensation");
      setHeaderSubtitle("Manage employee packages, tax structures, monthly salaries, and payouts");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Payroll Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Net Salary Disbursed", val: "₹12,45,000", cycle: "Processed on Jun 28, 2026", color: "bg-emerald-500" },
          { label: "Provident Fund (PF)", val: "₹88,200", cycle: "Transferred to EPFO portal", color: "bg-blue-500" },
          { label: "TDS Deductions", val: "₹1,12,000", cycle: "Tax filing cycle updated", color: "bg-purple-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <div className="mt-1">
              <h3 className="text-xl font-bold text-gray-900">{stat.val}</h3>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{stat.cycle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Structure list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Processed Payroll Register</h3>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">
              <Settings size={13} />
              <span>Settings</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
              <CheckCircle2 size={13} />
              <span>Run Payroll</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-3.5 pl-6">Payslip ID</th>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Gross Basic</th>
                <th className="p-3.5">Allowances</th>
                <th className="p-3.5">EPF + Taxes</th>
                <th className="p-3.5">Net Disbursed</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "PAY-092", name: "Suraj Kumar", basic: "₹1,10,000", allow: "₹35,000", tax: "₹12,500", net: "₹1,32,500" },
                { id: "PAY-093", name: "Anjali Sharma", basic: "₹72,000", allow: "₹23,000", tax: "₹8,200", net: "₹86,800" },
                { id: "PAY-094", name: "Vikram Patel", basic: "₹82,000", allow: "₹28,000", tax: "₹9,500", net: "₹1,00,500" },
                { id: "PAY-095", name: "Kunal Sen", basic: "₹65,000", allow: "₹20,000", tax: "₹7,200", net: "₹77,800" },
              ].map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 pl-6 text-gray-400 font-semibold">{pay.id}</td>
                  <td className="p-3.5 text-gray-900 font-bold">{pay.name}</td>
                  <td className="p-3.5 text-gray-600 font-semibold">{pay.basic}</td>
                  <td className="p-3.5 text-gray-600 font-semibold">{pay.allow}</td>
                  <td className="p-3.5 text-red-500 font-medium">{pay.tax}</td>
                  <td className="p-3.5 text-emerald-600 font-bold">{pay.net}</td>
                  <td className="p-3.5 pr-6 text-right">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-250 rounded transition-colors text-[10px] font-bold">
                      <Download size={10} />
                      <span>Payslip</span>
                    </button>
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

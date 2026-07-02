import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertCircle, Eye, CheckCircle2, Search } from "lucide-react";

export default function HRMSTickets() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Helpdesk Tickets");
      setHeaderSubtitle("Address internal employee support tickets, IT complaints, and policy queries");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Helpdesk Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Employee Support Tickets</h3>
          <span className="text-[10px] text-gray-400 font-bold">Total: 3 Open</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                <th className="p-3.5 pl-6">Ticket ID</th>
                <th className="p-3.5">Raised By</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: "TCK-801", name: "Suraj Kumar", sub: "VPN login handshake failure", priority: "High", cat: "IT Support", date: "Jul 01, 2026" },
                { id: "TCK-802", name: "Anjali Sharma", sub: "Form 16 Tax statement mismatch", priority: "Medium", cat: "Finance/Payroll", date: "Jun 30, 2026" },
                { id: "TCK-803", name: "Kunal Sen", sub: "Standing desk workspace ergonomic setup request", priority: "Low", cat: "HR Operations", date: "Jun 29, 2026" },
              ].map((tck) => (
                <tr key={tck.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 pl-6 text-gray-400 font-semibold">{tck.id}</td>
                  <td className="p-3.5">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{tck.name}</h4>
                      <p className="text-[9px] text-gray-400 font-medium">{tck.date}</p>
                    </div>
                  </td>
                  <td className="p-3.5 text-gray-700 font-semibold">{tck.sub}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold border ${
                      tck.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-100" :
                      tck.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-700 border-slate-100"
                    }`}>
                      {tck.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-500 font-semibold">{tck.cat}</td>
                  <td className="p-3.5 pr-6 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="Resolve">
                        <CheckCircle2 size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="View details">
                        <Eye size={14} />
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

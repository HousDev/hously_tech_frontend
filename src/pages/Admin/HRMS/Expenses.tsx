import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FileText, Eye, Check, X, Tag } from "lucide-react";

export default function HRMSExpenses() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Expense Claims");
      setHeaderSubtitle("Review reimbursement claims, travel receipts, and utility bills filed by staff");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Claims Ledger */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-3">Reimbursement Claims Audit</h3>
        <div className="space-y-4">
          {[
            { emp: "Suraj Kumar", category: "Office Supplies", amt: "₹4,200", date: "Jun 24, 2026", desc: "Wireless keyboard & Ergonomic Mouse", status: "Pending" },
            { emp: "Anjali Sharma", category: "Travel & Fuel", amt: "₹1,850", date: "Jun 25, 2026", desc: "Client site presentation taxi bills", status: "Approved" },
            { emp: "Kunal Sen", category: "Utility & Cloud", amt: "₹8,400", date: "Jun 26, 2026", desc: "AWS test sandboxing resources", status: "Pending" },
          ].map((claim, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-xs">{claim.emp}</h4>
                  <span className="text-[9px] text-gray-400 font-bold">&bull; {claim.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                  <Tag size={11} className="text-gray-400" />
                  <span>{claim.category}</span>
                  <span className="text-blue-600 font-bold ml-1">{claim.amt}</span>
                </div>
                <p className="text-[10px] text-gray-500 italic">" {claim.desc} "</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {claim.status === "Pending" ? (
                  <>
                    <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
                      <Check size={12} />
                      <span>Approve</span>
                    </button>
                    <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100 transition-colors">
                      <X size={12} />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-100">
                    {claim.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

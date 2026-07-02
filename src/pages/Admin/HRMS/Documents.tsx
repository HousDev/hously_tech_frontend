import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Folder, FileText, Download, Plus, Search } from "lucide-react";

export default function HRMSDocuments() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Document Hub");
      setHeaderSubtitle("Manage internal employee manuals, HR policies, and compliance handbooks");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  return (
    <div className="p-6 w-full space-y-6">
      {/* Folder Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { folder: "Employee Handbook", count: "4 Files", size: "12.4 MB" },
          { folder: "HR Policies", count: "8 Files", size: "4.8 MB" },
          { folder: "Tax & Compliance", count: "12 Files", size: "32.0 MB" },
          { folder: "Training Manuals", count: "6 Files", size: "115.2 MB" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Folder size={22} fill="currentColor" fillOpacity={0.1} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">{item.folder}</h4>
              <p className="text-[9px] text-gray-500 mt-0.5 font-semibold">{item.count} &bull; {item.size}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Corporate policies download list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Corporate Policy Documents</h3>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
            <Plus size={14} />
            <span>Upload Document</span>
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { docName: "Hously Employee Code of Conduct 2026.pdf", updated: "Updated Jan 10, 2026", size: "1.2 MB" },
            { docName: "Leave and Work from Home Policy.pdf", updated: "Updated Mar 15, 2026", size: "850 KB" },
            { docName: "POSH Policy Awareness Handbook.pdf", updated: "Updated Jun 01, 2026", size: "2.1 MB" },
            { docName: "Medical Insurance Claim Guideline.pdf", updated: "Updated Jun 18, 2026", size: "3.4 MB" },
          ].map((doc, idx) => (
            <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-400" />
                <div>
                  <h4 className="font-bold text-gray-800 text-xs">{doc.docName}</h4>
                  <p className="text-[10px] text-gray-400">{doc.updated} &bull; {doc.size}</p>
                </div>
              </div>
              <button className="p-1.5 text-gray-450 hover:text-blue-600 hover:bg-blue-50 border border-gray-250 rounded transition-colors text-[10px] font-bold">
                <Download size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

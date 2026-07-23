import React, { useState, useEffect } from "react";
import { DollarSign, Send, Wallet, Award, Plus, Clock, X, AlertCircle, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../lib/api";
import { useAdvanceSocket } from "../../../hooks/useAdvanceSocket";

interface AdvanceRequest {
  id: string;
  dbId?: number;
  amount: number;
  balance?: number;
  reason: string;
  tenureMonths: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Settled";
}

export default function AdvanceSalary() {
  const [requests, setRequests] = useState<AdvanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqAmount, setReqAmount] = useState<string>("");
  const [tenure, setTenure] = useState<number>(3);
  const [reason, setReason] = useState<string>("");
  const [reqDate, setReqDate] = useState<string>("2026-07-13");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingReqId, setEditingReqId] = useState<string | null>(null);
  const [editingDbId, setEditingDbId] = useState<number | null>(null);

  // Column-wise Filters State
  const [filterId, setFilterId] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterReason, setFilterReason] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(10);

  const maxLimit = 50000;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    } catch (e) {
      return dateStr;
    }
  };

  const mapStatusToFrontend = (status: string) => {
    if (!status) return "Pending";
    const s = status.toLowerCase();
    if (s === "pending") return "Pending";
    if (s === "approved") return "Approved";
    if (s === "disbursed") return "Approved";
    if (s === "rejected") return "Rejected";
    if (s === "completed") return "Settled";
    return "Pending";
  };

  const mapAdvanceFromBackend = (item: any): AdvanceRequest => {
    return {
      id: `ADV-${String(item.id).padStart(3, '0')}`,
      dbId: item.id,
      amount: Number(item.amount),
      balance: Math.max(0, Number(item.amount) - Number(item.paid_amount || 0)),
      reason: item.reason || "",
      tenureMonths: Number(item.total_tenor_months),
      date: formatDate(item.created_at),
      status: mapStatusToFrontend(item.status),
    };
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/payroll/advances?myAdvances=true");
      if (res.data && res.data.success) {
        const mapped = (res.data.data || []).map(mapAdvanceFromBackend);
        setRequests(mapped);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load advance history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useAdvanceSocket((event, data) => {
    console.log(`[EmployeeAdvanceSocket] Event: ${event}`, data);
    if (event === 'advance_status_changed') {
      const statusText = mapStatusToFrontend(data.status);
      toast.success(`Your Advance Request status has been updated to "${statusText}"!`, {
        icon: '🔔',
        duration: 5000
      });
      fetchRequests();
    } else if (event === 'advance_new' || event === 'advance_deleted') {
      fetchRequests();
    }
  });

  // Metric Computations
  const totalTaken = requests
    .filter((r) => r.status === "Approved" || r.status === "Settled")
    .reduce((sum, r) => sum + r.amount, 0);

  const activeOutstanding = requests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + (r.balance || 0), 0);

  const availableLimit = Math.max(0, maxLimit - activeOutstanding);

  const formatCurrency = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesId = req.id.toLowerCase().includes(filterId.toLowerCase());
    const matchesDate = req.date.toLowerCase().includes(filterDate.toLowerCase());
    const matchesReason = req.reason.toLowerCase().includes(filterReason.toLowerCase());
    const matchesStatus = filterStatus === "All" || req.status === filterStatus;
    return matchesId && matchesDate && matchesReason && matchesStatus;
  });

  // Pagination computations
  const effectiveLimit = itemsPerPage === "All" ? filteredRequests.length : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / (effectiveLimit || 1)));
  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * (effectiveLimit || 1),
    currentPage * (effectiveLimit || 1)
  );

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(reqAmount);

    if (!reqAmount || amountNum <= 0) {
      toast.error("Please enter a valid request amount.");
      return;
    }
    
    // Check limit during creation (skip if editing the same request to allow same amount)
    const activeLimitCheck = editingReqId 
      ? availableLimit + (requests.find((r) => r.id === editingReqId)?.amount || 0)
      : availableLimit;

    if (amountNum > activeLimitCheck) {
      toast.error(`Requested amount exceeds your limit of ${formatCurrency(activeLimitCheck)}.`);
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for the advance request.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingReqId && editingDbId) {
        // Edit flow
        const res = await api.put(`/payroll/advances/${editingDbId}`, {
          amount: amountNum,
          totalTenorMonths: tenure,
          reason: reason
        });
        if (res.data && res.data.success) {
          toast.success("Salary advance request updated successfully!", { icon: "📝" });
          fetchRequests();
        }
      } else {
        // Create flow
        const res = await api.post('/payroll/advances', {
          amount: amountNum,
          totalTenorMonths: tenure,
          reason: reason,
          status: 'pending'
        });
        if (res.data && res.data.success) {
          toast.success("Salary advance request submitted successfully!", { icon: "📨" });
          fetchRequests();
        }
      }
      
      setReqAmount("");
      setReason("");
      setTenure(3);
      setEditingReqId(null);
      setEditingDbId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:h-full flex flex-col space-y-6 text-left relative min-h-0">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/60">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Advance Received</p>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(totalTaken)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Sum of all approved disbursements</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/65">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Repayable</p>
            <h3 className="text-xl font-black text-amber-600 mt-0.5">{formatCurrency(activeOutstanding)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">To be deducted from payroll</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/65">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Advance Pool</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">{formatCurrency(availableLimit)}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Maximum eligible limit: {formatCurrency(maxLimit)}</p>
          </div>
        </div>
      </div>

      {/* Table Header and Request Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2 flex-shrink-0">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800">Salary Advance History</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">Track approvals, deduction tenures, and outstanding balances.</p>
        </div>

        <button
          onClick={() => {
            if (availableLimit <= 0) {
              toast.error("You have reached your maximum salary advance limit.");
              return;
            }
            setEditingReqId(null);
            setReqAmount("");
            setTenure(3);
            setReason("");
            setReqDate("2026-07-13");
            setIsModalOpen(true);
          }}
          className="bg-[#0273d8] hover:bg-blue-650 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request Advance
        </button>
      </div>

      {/* Industry Level Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden flex flex-col flex-grow min-h-0">
        <div className="overflow-x-auto no-scrollbar flex-grow overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[850px] relative">
            <thead>
              <tr className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-5 py-4 bg-slate-50">Request ID</th>
                <th className="px-5 py-4 bg-slate-50">Application Date</th>
                <th className="px-5 py-4 bg-slate-50">Amount</th>
                <th className="px-5 py-4 bg-slate-50">Tenure</th>
                <th className="px-5 py-4 bg-slate-50">Monthly EMI</th>
                <th className="px-5 py-4 bg-slate-50">Reason</th>
                <th className="px-5 py-4 bg-slate-50">Status</th>
                <th className="px-5 py-4 bg-slate-50 text-right">Actions</th>
              </tr>
              {/* Column wise search bars */}
              <tr className="sticky top-[48px] z-20 bg-slate-50 border-b border-slate-100">
                <td className="px-5 py-3 bg-slate-50">
                  <input
                    type="text"
                    value={filterId}
                    onChange={(e) => { setFilterId(e.target.value); setCurrentPage(1); }}
                    placeholder="Search ID..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-medium"
                  />
                </td>
                <td className="px-5 py-3 bg-slate-50">
                  <input
                    type="text"
                    value={filterDate}
                    onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                    placeholder="Search Date..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-medium"
                  />
                </td>
                <td className="px-5 py-3 bg-slate-50" /> {/* Amount */}
                <td className="px-5 py-3 bg-slate-50" /> {/* Tenure */}
                <td className="px-5 py-3 bg-slate-50" /> {/* Monthly EMI */}
                <td className="px-5 py-3 bg-slate-50">
                  <input
                    type="text"
                    value={filterReason}
                    onChange={(e) => { setFilterReason(e.target.value); setCurrentPage(1); }}
                    placeholder="Search Reason..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-medium"
                  />
                </td>
                <td className="px-5 py-3 bg-slate-50">
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-blue-500 font-semibold cursor-pointer text-slate-655"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Settled">Settled</option>
                  </select>
                </td>
                <td className="px-5 py-3 bg-slate-50 text-right" /> {/* Actions */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {displayedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 text-slate-350" />
                      <p className="font-semibold text-xs">No matching requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-5 font-mono font-bold text-slate-800">{req.id}</td>
                    <td className="px-5 py-5 font-medium text-slate-500">{req.date}</td>
                    <td className="px-5 py-5 font-extrabold text-slate-800">{formatCurrency(req.amount)}</td>
                    <td className="px-5 py-5 font-medium">{req.tenureMonths} Months</td>
                    <td className="px-5 py-5 font-extrabold text-blue-600">
                      {formatCurrency(req.amount / req.tenureMonths)}
                    </td>
                    <td className="px-5 py-5 font-medium text-slate-500 max-w-[200px] truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          req.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : req.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : req.status === "Settled"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-right">
                      {req.status === "Pending" && (
                        <button
                          onClick={() => {
                            setEditingReqId(req.id);
                            setEditingDbId(req.dbId || null);
                            setReqAmount(String(req.amount));
                            setTenure(req.tenureMonths);
                            setReason(req.reason);
                            // Parse date format MM/DD/YYYY back to YYYY-MM-DD
                            const parts = req.date.split("/");
                            if (parts.length === 3) {
                              setReqDate(`${parts[2]}-${parts[0]}-${parts[1]}`);
                            } else {
                              setReqDate("2026-07-13");
                            }
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-[#0273d8] transition cursor-pointer"
                          title="Edit Request"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/75 border-t border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              Showing <span className="text-slate-800">
                {filteredRequests.length === 0 ? 0 : (currentPage - 1) * (effectiveLimit || 1) + 1}
              </span> to{" "}
              <span className="text-slate-800">
                {Math.min(currentPage * (effectiveLimit || 1), filteredRequests.length)}
              </span>{" "}
              of <span className="text-slate-800">{filteredRequests.length}</span> entries
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 ml-0 sm:ml-4 border-l sm:border-l border-slate-200 pl-0 sm:pl-4">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const val = e.target.value;
                  setItemsPerPage(val === "All" ? "All" : Number(val));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-650"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">All</option>
              </select>
              <span className="text-slate-400 font-bold uppercase text-[9px]">entries</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded-lg transition cursor-pointer ${
                  currentPage === p
                    ? "bg-[#0273d8] border-[#0273d8] text-white font-extrabold"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600 bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center bg-white"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Animated Request Modal Popup */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto visible backdrop-blur-xs"
            : "opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Overlay backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40"
          onClick={() => {
            if (!isSubmitting) setIsModalOpen(false);
          }}
        />

        {/* Modal Box */}
        <div
          className={`bg-white rounded-2xl border border-slate-100 max-w-md w-full relative z-10 shadow-2xl transition-all duration-300 transform ${
            isModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                <Wallet className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-sm text-slate-800">
                {editingReqId ? "Edit Advance Request" : "Apply for Advance"}
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleRequestSubmit} className="p-5 space-y-4">
            {/* Limit Info Alert */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2 text-[10px] text-slate-555 font-semibold">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Available advance pool is <span className="font-extrabold text-slate-700">{formatCurrency(availableLimit)}</span>. Approved requests deductions are processed dynamically from monthly payslips.
              </p>
            </div>

            {/* Request Amount */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Requested Amount (₹) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={reqAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const dynamicLimitCheck = editingReqId 
                    ? availableLimit + (requests.find((r) => r.id === editingReqId)?.amount || 0)
                    : availableLimit;
                  
                  if (val > dynamicLimitCheck) {
                    setReqAmount(String(dynamicLimitCheck));
                  } else {
                    setReqAmount(e.target.value);
                  }
                }}
                placeholder="e.g. 50000"
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50"
              />
              <span className="text-[9px] text-slate-400 font-semibold block">
                Maximum limit you can apply is {formatCurrency(
                  editingReqId 
                    ? availableLimit + (requests.find((r) => r.id === editingReqId)?.amount || 0)
                    : availableLimit
                )}
              </span>
            </div>

            {/* Repayment Tenure */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Tenure (Months) <span className="text-rose-500">*</span></label>
              <select
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer text-slate-650"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
                  <option key={val} value={val}>
                    {val} {val === 1 ? "Month (Immediate Deduction)" : "Months Installments"}
                  </option>
                ))}
              </select>
            </div>

            {/* Request Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Request Date <span className="text-rose-500">*</span></label>
              <input
                type="date"
                value={reqDate}
                onChange={(e) => setReqDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-blue-500 bg-slate-50/50 cursor-pointer text-slate-650"
              />
            </div>

            {/* Reason for Advance */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Reason for Advance <span className="text-rose-500">*</span></label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Describe your requirement (medical emergency, household expense, etc.)..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-550 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-[#0273d8] hover:bg-blue-650 text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : editingReqId ? "Save Changes" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle, Eye, CheckCircle2, Search, X, Edit, Trash2,
  Tag, Calendar, Clock, ChevronLeft, ChevronRight, Plus,
  Ticket as TicketIcon, Loader2, UserCheck
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { useTicketSocket } from "../../hooks/useTicketSocket";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TicketItem {
  id: string | number;
  ticket_no?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string;
  date: string;
  description: string;
}

interface Employee {
  id: number;
  name: string;
  emp_id?: string;
  department?: string;
  avatar_url?: string | null;
  role?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  "Open": "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  "Resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const PRIORITY_COLORS: Record<string, string> = {
  "Critical": "bg-red-50 text-red-700 border-red-200",
  "High": "bg-rose-50 text-rose-700 border-rose-100",
  "Medium": "bg-amber-50 text-amber-700 border-amber-100",
  "Low": "bg-slate-50 text-slate-600 border-slate-200",
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "Open") return <AlertCircle size={11} className="text-blue-600" />;
  if (status === "In Progress") return <Clock size={11} className="text-amber-600" />;
  if (status === "Resolved") return <CheckCircle2 size={11} className="text-emerald-600" />;
  return null;
};

// ─── Searchable Employee Select ───────────────────────────────────────────────

function EmployeeSearchSelect({
  employees,
  value,
  onChange,
  placeholder = "Search employee…",
}: {
  employees: Employee[];
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(""); }}
          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#0D47A1]/50 focus:ring-2 focus:ring-[#0D47A1]/10 bg-white transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); onChange(""); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full"
          >
            <X size={11} className="text-slate-400" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2.5 text-[10px] text-slate-400 text-center">No employees found</p>
          ) : (
            filtered.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => { setQuery(emp.name); onChange(emp.name); setOpen(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#0D47A1]/5 transition flex items-center gap-2.5 group"
              >
                {emp.avatar_url && !imageErrors[emp.id] ? (
                  <img
                    src={emp.avatar_url}
                    alt={emp.name}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    onError={() => setImageErrors(prev => ({ ...prev, [emp.id]: true }))}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#0D47A1]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-[#0D47A1]">
                      {emp.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-700 group-hover:text-[#0D47A1] truncate">{emp.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {emp.emp_id && (
                      <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1 py-0.5 rounded leading-none">
                        {emp.emp_id}
                      </span>
                    )}
                    {emp.role && (
                      <span className="text-[8px] bg-blue-50 text-[#0D47A1] font-semibold px-1 py-0.5 rounded leading-none capitalize">
                        {emp.role}
                      </span>
                    )}
                    {emp.department && (
                      <span className="text-[9px] text-slate-400 font-medium leading-none">
                        {emp.department}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeTickets() {

  // ── Data ────────────────────────────────────────────────────────────────

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets");
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setTickets(list.map((t: any) => ({
        id: t.id,
        ticket_no: t.ticket_no,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        assignedTo: t.original_assigned_name || t.assigned_name || "Unassigned",
        date: t.date,
        description: t.description,
      })));
    } catch (err: any) {
      console.error("fetchTickets error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Socket.IO integration
  useTicketSocket((event, data) => {
    console.log(`[EmployeeTickets Socket] Received event "${event}":`, data);
    fetchTickets();
  });

  useEffect(() => {
    const load = async () => {
      setEmpLoading(true);
      try {
        const res = await api.get("/tasks/employees");
        const data = res.data;
        const list = Array.isArray(data) ? data
          : Array.isArray(data?.data) ? data.data : [];
        const mappedList: Employee[] = list.map((e: any) => ({
          id: e.id,
          name: e.full_name || e.name || `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.email || "Unknown",
          emp_id: e.employee_id || e.employeeId || e.username || `EMP-${e.id}`,
          department: e.department,
          avatar_url: e.avatar_url || e.avatarUrl || null,
          role: e.role
        }));
        setEmployees(mappedList);
      } catch {
        setEmployees([
          { id: 1, name: "Rahul Mehta", department: "IT" },
          { id: 2, name: "Priya Patel", department: "Finance" },
          { id: 3, name: "Amit Kumar", department: "HR" },
          { id: 4, name: "Neha Gupta", department: "Admin" },
          { id: 5, name: "Vikram Singh", department: "Operations" },
          { id: 6, name: "Pooja Patel", department: "Marketing" },
        ]);
      } finally {
        setEmpLoading(false);
      }
    };
    load();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  // ── Form Modal state ───────────────────────────────────────────────────

  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState("IT Support");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formAssignedTo, setFormAssignedTo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openForm = () => { setShowForm(true); document.body.style.overflow = "hidden"; };
  const closeForm = () => { setShowForm(false); document.body.style.overflow = ""; };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/tickets", {
        subject: formSubject,
        category: formCategory,
        priority: formPriority,
        description: formDescription,
        assignedToName: formAssignedTo,
      });
      setFormSubject("");
      setFormDescription("");
      setFormAssignedTo("");
      setFormPriority("Medium");
      closeForm();
      fetchTickets();
      toast.success(`🎫 Ticket raised successfully!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Table state ────────────────────────────────────────────────────────

  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
  const [searchFilters, setSearchFilters] = useState({ id: "", subject: "", category: "", priority: "", status: "", assignedTo: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredTickets = tickets.filter((t) =>
    Object.keys(searchFilters).every((key) => {
      const fv = searchFilters[key as keyof typeof searchFilters].toLowerCase();
      if (!fv) return true;
      if (key === 'id') {
        const ticketNo = t.ticket_no ? t.ticket_no.toLowerCase() : "";
        return ticketNo.includes(fv) || t.id.toString().includes(fv);
      }
      return t[key as keyof TicketItem]?.toString().toLowerCase().includes(fv);
    })
  );

  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentTickets = filteredTickets.slice(startIdx, startIdx + pageSize);

  const handleSearch = (col: string, val: string) => { setSearchFilters((p) => ({ ...p, [col]: val })); setCurrentPage(1); };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedTickets(e.target.checked ? currentTickets.map((t) => t.id) : []);
  const handleSelectTicket = (id: any) => setSelectedTickets((p) => p.includes(id) ? p.filter((t) => t !== id) : [...p, id]);

  // ── Action Popup ────────────────────────────────────────────────────────

  const [popup, setPopup] = useState<{ type: "view" | "edit" | "delete"; ticket: TicketItem } | null>(null);
  const [editForm, setEditForm] = useState({ subject: "", status: "", priority: "", assignedTo: "", description: "" });

  const openPopup = (type: "view" | "edit" | "delete", ticket: TicketItem) => {
    setPopup({ type, ticket });
    if (type === "edit") setEditForm({ subject: ticket.subject, status: ticket.status, priority: ticket.priority, assignedTo: ticket.assignedTo, description: ticket.description });
    document.body.style.overflow = "hidden";
  };
  const closePopup = () => { setPopup(null); document.body.style.overflow = ""; };

  const handleSaveEdit = async () => {
    if (!popup) return;
    try {
      await api.put(`/tickets/${popup.ticket.id}`, {
        subject: editForm.subject,
        status: editForm.status,
        priority: editForm.priority,
        assignedToName: editForm.assignedTo,
        description: editForm.description,
      });
      fetchTickets();
      toast.success("Ticket updated!");
      closePopup();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    }
  };

  const handleDelete = async () => {
    if (!popup) return;
    try {
      await api.delete(`/tickets/${popup.ticket.id}`);
      fetchTickets();
      toast.success("Ticket deleted!");
      closePopup();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete ticket");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-[calc(100vh-115px)] md:h-[calc(100vh-130px)] flex flex-col overflow-hidden  p-1">

      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
        {[
          { label: "Total Raised", value: stats.total, bg: "bg-blue-50", border: "border-blue-100", iconBg: "bg-blue-100", iconColor: "text-[#0D47A1]", valColor: "text-[#0D47A1]", icon: <TicketIcon size={18} /> },
          { label: "Open", value: stats.open, bg: "bg-sky-50", border: "border-sky-100", iconBg: "bg-sky-100", iconColor: "text-sky-600", valColor: "text-sky-700", icon: <AlertCircle size={18} /> },
          { label: "In Progress", value: stats.inProgress, bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-100", iconColor: "text-amber-600", valColor: "text-amber-700", icon: <Clock size={18} /> },
          { label: "Resolved", value: stats.resolved, bg: "bg-emerald-50", border: "border-emerald-100", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", valColor: "text-emerald-700", icon: <CheckCircle2 size={18} /> },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm flex items-center gap-3`}>
            <div className={`${s.iconBg} ${s.iconColor} p-2.5 rounded-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className={`text-2xl font-extrabold ${s.valColor}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Full Width Table ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">

        {/* Toolbar with Raise Ticket Button */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-1 rounded-md">My Tickets</span>
            <span className="text-[10px] text-slate-400 font-semibold">({filteredTickets.length})</span>
            {selectedTickets.length > 0 && (
              <button
                onClick={() => { setTickets((p) => p.filter((t) => !selectedTickets.includes(t.id))); setSelectedTickets([]); toast.success(`${selectedTickets.length} ticket(s) deleted.`); }}
                className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
              >
                <Trash2 size={10} /> Delete ({selectedTickets.length})
              </button>
            )}
          </div>

          {/* Raise Ticket Button */}
          <button
            onClick={openForm}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D47A1] hover:bg-blue-800 text-white rounded-lg text-[10px] font-extrabold shadow-sm shadow-[#0D47A1]/20 transition cursor-pointer"
          >
            <Plus size={12} /> Raise Ticket
          </button>
        </div>

        {/* ── Table Container: Header + Filter sticky, only body scrolls ── */}
        <div className="relative flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar">
            <table className="w-full border-collapse text-[10px] min-w-[720px]">

              {/* ── THEAD: Sticky Header + Filter ── */}
              <thead className="sticky top-0 z-10">
                {/* Main Header Row */}
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-3 text-center w-10">
                    <input type="checkbox" checked={selectedTickets.length === currentTickets.length && currentTickets.length > 0} onChange={handleSelectAll} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] cursor-pointer" />
                  </th>
                  {["Ticket ID", "Subject", "Category", "Priority", "Status", "Assigned To"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                  <th className="px-3 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>

                {/* Filter Row */}
                <tr className="bg-[#f8fafd] border-b-2 border-slate-200">
                  <th className="px-3 py-2" />
                  {(["id", "subject", "category"] as const).map((col) => (
                    <th key={col} className="px-2 py-2">
                      <div className="relative">
                        <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <input type="text" placeholder={col.charAt(0).toUpperCase() + col.slice(1)} value={searchFilters[col]} onChange={(e) => handleSearch(col, e.target.value)}
                          className="w-full pl-5 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition" />
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-2">
                    <select value={searchFilters.priority} onChange={(e) => handleSearch("priority", e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-500 outline-none focus:border-[#0D47A1]/40 cursor-pointer shadow-sm">
                      <option value="">All Priority</option>
                      {["Critical", "High", "Medium", "Low"].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </th>
                  <th className="px-2 py-2">
                    <select value={searchFilters.status} onChange={(e) => handleSearch("status", e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-500 outline-none focus:border-[#0D47A1]/40 cursor-pointer shadow-sm">
                      <option value="">All Status</option>
                      {["Open", "In Progress", "Resolved"].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </th>
                  <th className="px-2 py-2">
                    <div className="relative">
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <input type="text" placeholder="Assigned" value={searchFilters.assignedTo} onChange={(e) => handleSearch("assignedTo", e.target.value)}
                        className="w-full pl-5 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition" />
                    </div>
                  </th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>

              {/* ── TBODY: Scrollable ── */}
              <tbody className="divide-y divide-slate-100">
                {currentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      <TicketIcon size={28} className="mx-auto mb-2 text-slate-200" />
                      No tickets found. Raise your first ticket!
                    </td>
                  </tr>
                ) : (
                  currentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3 py-2.5 text-center">
                        <input type="checkbox" checked={selectedTickets.includes(ticket.id)} onChange={() => handleSelectTicket(ticket.id)} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] cursor-pointer" />
                      </td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-450">{ticket.ticket_no || ticket.id}</td>
                      <td className="px-3 py-2.5 text-slate-700 font-medium max-w-[200px] truncate">{ticket.subject}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-medium">{ticket.category}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${PRIORITY_COLORS[ticket.priority] || ""}`}>{ticket.priority}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${STATUS_COLORS[ticket.status] || ""}`}>
                          <StatusIcon status={ticket.status} />{ticket.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 font-medium">{ticket.assignedTo}</td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openPopup("view", ticket)} className="p-1.5 text-[#0D47A1] hover:bg-[#0D47A1]/5 rounded-lg transition cursor-pointer" title="View"><Eye size={13} /></button>
                          <button onClick={() => openPopup("edit", ticket)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer" title="Edit"><Edit size={13} /></button>
                          <button onClick={() => openPopup("delete", ticket)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer" title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        {filteredTickets.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 flex-shrink-0 sticky bottom-0 z-10">
            <span className="text-[10px] text-slate-400 font-medium">
              Showing {startIdx + 1}–{Math.min(startIdx + pageSize, filteredTickets.length)} of {filteredTickets.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition disabled:opacity-40 cursor-pointer">
                <ChevronLeft size={12} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pg = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1) pg = currentPage - 2 + i;
                  else if (currentPage >= totalPages - 1) pg = totalPages - 4 + i;
                }
                return (
                  <button key={pg} onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition cursor-pointer ${currentPage === pg ? "bg-[#0D47A1] text-white" : "border border-slate-200 hover:bg-white text-slate-600"}`}>
                    {pg}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-slate-400 text-[10px]">…</span>}
              {totalPages > 5 && currentPage < totalPages - 1 && (
                <button onClick={() => setCurrentPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold transition cursor-pointer border border-slate-200 hover:bg-white text-slate-600`}>
                  {totalPages}
                </button>
              )}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-white transition disabled:opacity-40 cursor-pointer">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Raise Ticket Center Popup ─────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeForm} style={{ animation: "fadeIn 0.15s ease" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>

            <div className="bg-gradient-to-r from-[#0D47A1] to-blue-700 px-6 py-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <TicketIcon size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Raise a Support Ticket</h3>
                  <p className="text-blue-100 text-[10px]">Fill in the details below</p>
                </div>
              </div>
              <button onClick={closeForm} className="p-2 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50 bg-white text-slate-700 font-medium text-xs cursor-pointer">
                  <option value="IT Support">IT Support</option>
                  <option value="Finance/Payroll">Finance / Payroll</option>
                  <option value="HR Operations">HR Operations</option>
                  <option value="Admin">Admin</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UserCheck size={11} /> Assigned To
                  {empLoading && <Loader2 size={10} className="animate-spin text-slate-400" />}
                </label>
                <EmployeeSearchSelect employees={employees} value={formAssignedTo} onChange={setFormAssignedTo} placeholder="Search and select employee…" />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select value={formPriority} onChange={(e) => setFormPriority(e.target.value)} required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50 bg-white text-slate-700 font-medium text-xs cursor-pointer">
                  <option value="Critical">🔴 Critical</option>
                  <option value="High">🟠 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formSubject} onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Printer not working" required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50 text-slate-700 font-medium placeholder-slate-300" />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea rows={4} value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the issue in detail…" required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]/50 text-slate-700 font-medium placeholder-slate-300 resize-none" />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-[#0D47A1] hover:bg-blue-800 disabled:opacity-60 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md shadow-[#0D47A1]/20 transition flex items-center justify-center gap-2 cursor-pointer">
                  {submitting ? <><Loader2 size={13} className="animate-spin" /> Submitting…</> : <><TicketIcon size={13} /> Submit Ticket</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Action Popup ──────────────────────────────────────────────── */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePopup} style={{ animation: "fadeIn 0.15s ease" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div className="bg-gradient-to-r from-[#0D47A1] to-blue-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-sm">
                  {popup.type === "view" && "Ticket Details"}
                  {popup.type === "edit" && "Edit Ticket"}
                  {popup.type === "delete" && "Confirm Deletion"}
                </h3>
                <p className="text-blue-200 text-[10px] font-mono">{popup.ticket.id}</p>
              </div>
              <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"><X size={18} /></button>
            </div>

            <div className="p-5">
              {popup.type === "view" && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                    <p className="text-slate-800 text-xs font-bold">{popup.ticket.subject}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Description</span>
                    <p className="text-slate-700 text-xs leading-relaxed">{popup.ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Category", icon: <Tag size={12} className="text-slate-400" />, value: popup.ticket.category },
                      { label: "Assigned To", icon: <UserCheck size={12} className="text-slate-400" />, value: popup.ticket.assignedTo },
                      { label: "Date", icon: <Calendar size={12} className="text-slate-400" />, value: popup.ticket.date },
                    ].map((row) => (
                      <div key={row.label} className="border border-slate-100 rounded-xl p-3">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">{row.label}</span>
                        <div className="flex items-center gap-1.5">{row.icon}<p className="text-xs font-bold text-slate-700">{row.value}</p></div>
                      </div>
                    ))}
                    <div className="border border-slate-100 rounded-xl p-3">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Priority</span>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${PRIORITY_COLORS[popup.ticket.priority]}`}>{popup.ticket.priority}</span>
                    </div>
                    <div className="border border-slate-100 rounded-xl p-3 col-span-2">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${STATUS_COLORS[popup.ticket.status]}`}>
                        <StatusIcon status={popup.ticket.status} /> {popup.ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {popup.type === "edit" && (
                <div className="space-y-3">
                  {[{ label: "Subject", field: "subject", type: "input" }, { label: "Description", field: "description", type: "textarea" }].map(({ label, field, type }) => (
                    <div key={field}>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
                      {type === "textarea" ? (
                        <textarea rows={3} value={editForm[field as keyof typeof editForm]} onChange={(e) => setEditForm((p) => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1]/50 focus:ring-2 focus:ring-[#0D47A1]/10 text-slate-700 font-medium resize-none" />
                      ) : (
                        <input type="text" value={editForm[field as keyof typeof editForm]} onChange={(e) => setEditForm((p) => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1]/50 focus:ring-2 focus:ring-[#0D47A1]/10 text-slate-700 font-medium" />
                      )}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                      <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1]/50 bg-white text-slate-700 font-medium cursor-pointer">
                        {["Open", "In Progress", "Resolved"].map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
                      <select value={editForm.priority} onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1]/50 bg-white text-slate-700 font-medium cursor-pointer">
                        {["Critical", "High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Assigned To</label>
                    <EmployeeSearchSelect employees={employees} value={editForm.assignedTo} onChange={(v) => setEditForm((p) => ({ ...p, assignedTo: v }))} />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={closePopup} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                    <button onClick={handleSaveEdit} className="flex-1 py-2 bg-[#0D47A1] hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer">Save Changes</button>
                  </div>
                </div>
              )}

              {popup.type === "delete" && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-800">Confirm Deletion</h4>
                      <p className="text-[11px] text-red-600 mt-1 leading-relaxed">
                        Are you sure you want to permanently delete ticket <span className="font-extrabold">{popup.ticket.id}</span>? This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={closePopup} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer">Delete Ticket</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn { from { transform: scale(0.92) translateY(8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Desktop & Mobile both get sticky + increased height */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

      `}</style>
    </div>
  );
}
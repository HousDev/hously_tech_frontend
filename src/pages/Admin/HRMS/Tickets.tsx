import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AlertCircle,
  Eye,
  CheckCircle2,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../../lib/api";
import { useTicketSocket } from "../../../hooks/useTicketSocket";
import toast from "react-hot-toast";

// ─── Types & Searchable Employee Select ────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  role?: string;
  emp_id?: string;
  department?: string;
  avatar_url?: string | null;
}

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
        <div className="absolute z-[60] mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
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

// ─── Stat Card Accent Classes & Component ──────────────────────────────────────

const ACCENT_CLASSES: Record<string, { cardBg: string; border: string; iconBg: string }> = {
  blue: {
    cardBg: "bg-blue-50/40",
    border: "border-blue-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  emerald: {
    cardBg: "bg-emerald-50/40",
    border: "border-emerald-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  amber: {
    cardBg: "bg-amber-50/40",
    border: "border-amber-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
  rose: {
    cardBg: "bg-rose-50/40",
    border: "border-rose-100/60",
    iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  },
};

const StatCard = ({
  label,
  value,
  icon,
  accent = "blue",
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "blue" | "emerald" | "amber" | "rose";
  sub?: string;
}) => {
  const cfg = ACCENT_CLASSES[accent] || ACCENT_CLASSES.blue;
  return (
    <div className={`${cfg.cardBg} ${cfg.border} rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${cfg.iconBg} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
          {label}
        </p>
        <p className="text-sm sm:text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold truncate">{sub}</p>}
      </div>
    </div>
  );
};

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

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tickets");
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setTickets(list.map((t: any) => ({
        id: t.id,
        ticket_no: t.ticket_no,
        employee: t.employee_name || "Unknown",
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        assignedTo: t.assigned_name || "",
        date: t.date,
        description: t.description,
      })));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/tasks/employees");
      const data = res.data;
      const list = Array.isArray(data) ? data
        : Array.isArray(data?.data) ? data.data : [];
      setEmployees(list.map((e: any) => ({
        id: e.id,
        name: e.full_name || e.name || `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.email || "Unknown",
        role: e.role || "Staff",
        emp_id: e.employee_id || e.employeeId || e.username || `EMP-${e.id}`,
        department: e.department || "",
        avatar_url: e.avatar_url || e.avatarUrl || null
      })));
    } catch (err) {
      console.error("fetchEmployees error:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchEmployees();
  }, []);

  useTicketSocket((event, data) => {
    console.log(`[HRMSTickets Socket] Received event "${event}":`, data);
    fetchTickets();
  });

  const stats = {
    open: tickets.filter(t => t.status === "Open").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
    critical: tickets.filter(t => t.priority === "Critical").length,
  };

  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
  const [searchFilters, setSearchFilters] = useState<{ [key: string]: string }>({
    id: "",
    subject: "",
    employee: "",
    category: "",
    priority: "",
    status: "",
    assignedTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<{ [key: string]: string }>({
    id: "",
    subject: "",
    employee: "",
    category: "",
    priority: "",
    status: "",
    assignedTo: "",
  });

  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters(searchFilters);
    }
  }, [isFilterOpen, searchFilters]);

  const [popupType, setPopupType] = useState<"view" | "edit" | "delete" | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Edit fields state
  const [editSubject, setEditSubject] = useState("");
  const [editStatus, setEditStatus] = useState("Open");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  const filteredTickets = tickets.filter(ticket => {
    return Object.keys(searchFilters).every(key => {
      const filterValue = searchFilters[key].toLowerCase();
      if (!filterValue) return true;
      if (key === 'id') {
        const tNo = ticket.ticket_no ? ticket.ticket_no.toLowerCase() : "";
        return tNo.includes(filterValue) || ticket.id.toString().includes(filterValue);
      }
      const ticketValue = ticket[key as keyof typeof ticket]?.toString().toLowerCase() || "";
      return ticketValue.includes(filterValue);
    });
  });

  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTickets.length);
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTickets(e.target.checked ? currentTickets.map(t => t.id) : []);
  };

  const handleSelectTicket = (id: any) => {
    setSelectedTickets(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSearch = (column: string, value: string) => {
    setSearchFilters(prev => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value === "All" ? filteredTickets.length : parseInt(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-50/50 text-blue-700 border-blue-200/50";
      case "In Progress": return "bg-amber-50/50 text-amber-700 border-amber-200/50";
      case "Resolved": return "bg-emerald-50/50 text-emerald-700 border-emerald-200/50";
      default: return "bg-slate-50 text-slate-700 border-slate-200/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle size={12} className="text-blue-600" />;
      case "In Progress": return <Clock size={12} className="text-amber-600" />;
      case "Resolved": return <CheckCircle2 size={12} className="text-emerald-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-50 text-red-700 border-red-100";
      case "High": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Low": return "bg-slate-50 text-slate-700 border-slate-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const openPopup = (type: "view" | "edit" | "delete", ticket: any) => {
    setPopupType(type);
    setSelectedTicket(ticket);
    if (type === "edit") {
      setEditSubject(ticket.subject);
      setEditStatus(ticket.status);
      setEditPriority(ticket.priority);
      setEditAssignedTo(ticket.assignedTo);
    }
  };

  const closePopup = () => {
    setPopupType(null);
    setSelectedTicket(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedTicket) return;
    try {
      await api.put(`/tickets/${selectedTicket.id}`, {
        subject: editSubject,
        status: editStatus,
        priority: editPriority,
        assignedToName: editAssignedTo,
      });
      fetchTickets();
      toast.success("Ticket updated successfully!");
      closePopup();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    }
  };

  const renderPopup = () => {
    if (!popupType || !selectedTicket) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={closePopup}
        />

        {/* Modal Content */}
        <div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col"
          style={{ animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-0.5 rounded">
                {selectedTicket.ticket_no || selectedTicket.id}
              </span>
              <h3 className="font-extrabold text-sm text-slate-800">
                {popupType === "view" && "Ticket Details"}
                {popupType === "edit" && "Modify Ticket"}
                {popupType === "delete" && "Confirm Deletion"}
              </h3>
            </div>
            <button
              onClick={closePopup}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
            {popupType === "view" && (
              <div className="space-y-4">
                <div className="bg-slate-50/50 rounded-xl p-3.5 border border-slate-100">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                  <p className="text-slate-800 text-xs font-bold leading-relaxed">{selectedTicket.subject}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Employee</span>
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-800">{selectedTicket.employee}</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Assigned Support</span>
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-800">{selectedTicket.assignedTo || "Unassigned"}</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Category</span>
                    <div className="flex items-center gap-1.5">
                      <Tag size={13} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-800">{selectedTicket.category}</p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Created Date</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-800">{selectedTicket.date}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col justify-center">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Priority</span>
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] font-extrabold border ${getPriorityColor(selectedTicket.priority)} w-max`}>
                      {selectedTicket.priority}
                    </span>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col justify-center">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold border ${getStatusColor(selectedTicket.status)} w-max`}>
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {popupType === "edit" && (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Subject Title</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]/20 font-semibold text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]/20 font-semibold text-slate-700 bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={e => setEditPriority(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]/20 font-semibold text-slate-700 bg-white"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Assigned Support Staff</label>
                  <EmployeeSearchSelect
                    employees={employees}
                    value={editAssignedTo}
                    onChange={setEditAssignedTo}
                    placeholder="Search and select staff…"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={closePopup}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold text-xs shadow-sm shadow-blue-100"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {popupType === "delete" && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-red-800">Confirm Action</h4>
                    <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                      Are you sure you want to permanently delete support ticket <span className="font-extrabold text-red-900">{selectedTicket.id}</span>?
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={closePopup}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await api.delete(`/tickets/${selectedTicket.id}`);
                        fetchTickets();
                        setSelectedTickets(prev => prev.filter(t => t !== selectedTicket.id));
                        toast.success("Ticket deleted successfully!");
                        closePopup();
                      } catch (err: any) {
                        toast.error(err.response?.data?.message || "Failed to delete ticket");
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-bold text-xs shadow-sm shadow-red-100 cursor-pointer"
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 w-full space-y-6 flex flex-col h-full bg-[#f3f6fb] min-w-0">
      {/* 1. Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 flex-shrink-0">
        <StatCard
          label="Open Tickets"
          value={stats.open}
          icon={<AlertCircle size={18} className="text-blue-600" />}
          accent="blue"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Clock size={18} className="text-amber-600" />}
          accent="amber"
        />
        <StatCard
          label="Resolved Tickets"
          value={stats.resolved}
          icon={<CheckCircle2 size={18} className="text-emerald-600" />}
          accent="emerald"
        />
        <StatCard
          label="Critical Priority"
          value={stats.critical}
          icon={<AlertCircle size={18} className="text-rose-600" />}
          accent="rose"
        />
      </div>

      {/* 2. Main Tickets Container (Standardized Card Layout with responsive heights) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:h-[calc(100vh-120px)] h-auto min-h-[400px] w-full">
        {/* Card Header Toolbar (identical toolbar to Leaves/Employees list views) */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 select-none flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-1 rounded-md">
              Support Directory
            </span>
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => {
                    setTickets(tickets.filter(t => !selectedTickets.includes(t.id)));
                    setSelectedTickets([]);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold shadow-sm transition cursor-pointer"
                >
                  <Trash2 size={11} /> Delete Selected ({selectedTickets.length})
                </button>
                <span className="text-[10px] text-slate-500 font-bold">
                  {selectedTickets.length} selected
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition rounded-lg text-[10px] font-bold cursor-pointer"
            >
              <Filter size={11} />
              <span>Filters</span>
            </button>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="text-[10px] border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="All">All items</option>
            </select>
          </div>
        </div>

        {/* 3. Table Container - Scrollable only in Desktop */}
        <div className="overflow-y-auto md:flex-1 overflow-x-auto custom-scrollbar w-full">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedTickets.length === currentTickets.length && currentTickets.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>

              {/* Column-wise search inputs — MNC premium style */}
              <tr className="bg-[#f8fafd] border-b-2 border-slate-200 sticky top-[37px] z-10">
                <th className="px-3 py-2"></th>
                <th className="px-2 py-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ticket ID"
                      value={searchFilters.id}
                      onChange={e => handleSearch("id", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition"
                    />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={searchFilters.subject}
                      onChange={e => handleSearch("subject", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition"
                    />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Employee"
                      value={searchFilters.employee}
                      onChange={e => handleSearch("employee", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition"
                    />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Category"
                      value={searchFilters.category}
                      onChange={e => handleSearch("category", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition"
                    />
                  </div>
                </th>
                <th className="px-2 py-2">
                  <select
                    value={searchFilters.priority}
                    onChange={e => handleSearch("priority", e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-500 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 cursor-pointer shadow-sm transition"
                  >
                    <option value="">All Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </th>
                <th className="px-2 py-2">
                  <select
                    value={searchFilters.status}
                    onChange={e => handleSearch("status", e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-500 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 cursor-pointer shadow-sm transition"
                  >
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </th>
                <th className="px-2 py-2">
                  <div className="relative">
                    <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Assigned to"
                      value={searchFilters.assignedTo}
                      onChange={e => handleSearch("assignedTo", e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 placeholder-slate-300 outline-none focus:border-[#0D47A1]/40 focus:ring-2 focus:ring-[#0D47A1]/10 shadow-sm transition"
                    />
                  </div>
                </th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {currentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-[#0D47A1] font-mono font-bold">{ticket.ticket_no || ticket.id}</td>
                  <td className="p-3 font-semibold text-slate-800 max-w-[200px] truncate">{ticket.subject}</td>
                  <td className="p-3">
                    <div>
                      <h4 className="font-medium text-slate-500">{ticket.employee}</h4>
                      <p className="text-[9px] text-slate-400 font-medium">{ticket.date}</p>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-500">{ticket.category}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">{ticket.assignedTo || "—"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openPopup("view", ticket)}
                        className="p-1 text-slate-400 hover:text-[#0D47A1] hover:bg-slate-100 rounded transition cursor-pointer"
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => openPopup("edit", ticket)}
                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        title="Edit ticket"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => openPopup("delete", ticket)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition cursor-pointer"
                        title="Delete ticket"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentTickets.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-bold text-xs bg-white">
                    No support tickets found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination (Matching standard Leaves/Employees pagination UI) */}
        {filteredTickets.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/20 select-none flex-shrink-0">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Showing {startIndex + 1} to {endIndex} of {filteredTickets.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-white text-[10px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={10} className="inline mr-0.5" /> Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition cursor-pointer ${currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                      : 'border border-transparent hover:bg-slate-100 text-slate-600'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-white text-[10px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ChevronRight size={10} className="inline ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Premium Slide-out Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-45 transition-transform duration-300 ease-in-out transform flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h4 className="text-white font-extrabold text-sm">Tickets Filters</h4>
            <p className="text-blue-100 text-[9px] font-semibold uppercase tracking-wider">Refine support catalog</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {Object.keys(tempFilters).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                Filter by {key === "assignedTo" ? "Assigned" : key}
              </label>
              <div className="relative">
                <Search size={12} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${key}...`}
                  value={tempFilters[key]}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-semibold text-slate-700"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 flex gap-2.5">
          <button
            onClick={() => {
              const cleared = { id: "", subject: "", employee: "", category: "", priority: "", status: "", assignedTo: "" };
              setTempFilters(cleared);
              setSearchFilters(cleared);
            }}
            className="flex-1 py-2 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl transition text-xs font-bold text-center cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              setSearchFilters(tempFilters);
              setIsFilterOpen(false);
            }}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-xs font-bold text-center cursor-pointer shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Slide-out Backdrop Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-30 transition-opacity duration-300"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {renderPopup()}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        /* Desktop: sticky table scroll height constraints */
        @media (min-width: 768px) {
          .table-scroll {
            max-height: calc(100vh - 420px);
            min-height: 400px;
            overflow-y: auto;
            overflow-x: auto;
          }
          .table-scroll thead {
            position: sticky;
            top: 0;
            z-index: 10;
          }
        }
        /* Mobile: disable fixed sizes so table matches native flow */
        @media (max-width: 767px) {
          .table-scroll {
            max-height: none !important;
            min-height: auto !important;
            overflow-y: visible !important;
          }
          .table-scroll thead {
            position: relative !important;
          }
        }
      `}</style>
    </div>
  );
}
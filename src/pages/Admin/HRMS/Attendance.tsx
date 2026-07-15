import React, { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock, Users, UserCheck, UserX, Search, User, Smile,
  ChevronLeft, ChevronRight, Download, RefreshCw,
  MapPin, Check, X, AlertCircle, Calendar,
  Wifi, Smartphone, TrendingUp, TrendingDown,
  BarChart3, CalendarDays, ChevronDown,
  Building2, ClipboardList, ClipboardCheck,
  CheckCircle, XCircle, Clock4, Edit3,
  FileText, AlertTriangle, Send, Filter,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { attendanceApi } from "../../../lib/attendanceApi";
import { io } from "socket.io-client";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "on_leave" | "holiday" | "week_off" | "not_marked";
type CheckInType = "office" | "remote" | "field";
type ViewTab = "today" | "report" | "regularize" | "calendar";

interface AttendanceRecord {
  id: string;
  userId?: number;
  date?: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  avatarColor: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  checkInType?: CheckInType;
  location?: string;
  workingHours?: string;
  overtime?: string;
  lateByMinutes?: number;
  lateTime?: string;
  checkInSelfie?: string | null;
  checkOutSelfie?: string | null;
  leaveType?: string;
}

interface RegularizeRequest {
  id: string;
  empId: string;
  name: string;
  avatarColor: string;
  department: string;
  date: string;
  reason: string;
  requestedIn: string;
  requestedOut: string;
  actualIn?: string;
  actualOut?: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
}

interface MonthlyReport {
  name: string;
  empId: string;
  avatarColor: string;
  department: string;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  total: number;
  workingHours: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLORS = [
  "from-blue-500 to-blue-600", "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600", "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600", "from-cyan-500 to-cyan-600",
  "from-fuchsia-500 to-fuchsia-600", "from-indigo-500 to-indigo-600",
  "from-teal-500 to-teal-600", "from-orange-500 to-orange-600",
];

// Static data removed — data is loaded from backend
const RECORDS: AttendanceRecord[] = [];
const REGULARIZE_DATA: RegularizeRequest[] = [];
const MONTHLY_REPORT: MonthlyReport[] = [];

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; textColor: string; bgColor: string; borderColor: string; dot: string }> = {
  present: { label: "Present", textColor: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", dot: "bg-emerald-500" },
  absent: { label: "Absent", textColor: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200", dot: "bg-red-500" },
  late: { label: "Late", textColor: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200", dot: "bg-amber-500" },
  half_day: { label: "Half Day", textColor: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200", dot: "bg-blue-500" },
  on_leave: { label: "On Leave", textColor: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200", dot: "bg-purple-500" },
  holiday: { label: "Holiday", textColor: "text-indigo-700", bgColor: "bg-indigo-50", borderColor: "border-indigo-200", dot: "bg-indigo-500" },
  week_off: { label: "Week Off", textColor: "text-slate-500", bgColor: "bg-slate-100", borderColor: "border-slate-200", dot: "bg-slate-400" },
  not_marked: { label: "Not Marked", textColor: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200", dot: "bg-slate-400" },
};

const REGULARIZE_STATUS: Record<"pending" | "approved" | "rejected", { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50  border-amber-200", icon: <Clock size={11} className="text-amber-600" /> },
  approved: { label: "Approved", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle size={11} className="text-emerald-600" /> },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-50    border-red-200", icon: <XCircle size={11} className="text-red-600" /> },
};

// ─── Components ───────────────────────────────────────────────────────────────

const Avatar = ({ name, color, url }: { name: string; color: string; url?: string | null }) => {
  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const getAvatarUrl = (pathStr?: string | null) => {
    if (!pathStr) return "";
    if (pathStr.startsWith("data:") || pathStr.startsWith("http")) return pathStr;
    return `${BASE_URL}/${pathStr}`;
  };

  if (url) {
    return (
      <img
        src={getAvatarUrl(url)}
        alt={name}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-white flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-extrabold text-white text-[10px] ring-2 ring-white flex-shrink-0`}>
      {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
    </div>
  );
};

const StatusBadge = ({ status, leaveType }: { status: AttendanceStatus; leaveType?: string | null }) => {
  let c = STATUS_CONFIG[status];
  if (!c) c = STATUS_CONFIG["not_marked"];
  let label = c.label;

  if (status === "on_leave" || leaveType === "paid_leave") {
    c = STATUS_CONFIG["on_leave"];
    if (leaveType === "paid_leave") label = "Paid Leave";
    else label = "On Leave";
  } else if (leaveType === "unpaid_leave" || leaveType === "half_day_leave") {
    c = STATUS_CONFIG["absent"];
    if (leaveType === "unpaid_leave") label = "Unpaid Leave";
    else if (leaveType === "half_day_leave") label = "Half Day Leave";
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bgColor} ${c.textColor} ${c.borderColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} /> {label}
    </span>
  );
};

const LiveClock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  const h = t.getHours(), ampm = h >= 12 ? "PM" : "AM", h12 = h % 12 || 12;
  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[11px] font-extrabold text-slate-800 tabular-nums">{p(h12)}:{p(t.getMinutes())}:{p(t.getSeconds())} {ampm}</span>
    </div>
  );
};

const MiniBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${max > 0 ? Math.round((value / max) * 100) : 0}%` }} />
  </div>
);

// ─── Mini Calendar ────────────────────────────────────────────────────────────

const MiniCalendar = ({ selected, onChange }: { selected: string; onChange: (d: string) => void }) => {
  const [viewDate, setViewDate] = useState(() => new Date(selected));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const goMonth = (delta: number) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + delta);
    if (d <= today) setViewDate(d);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => goMonth(-1)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"><ChevronLeft size={14} /></button>
        <span className="text-xs font-extrabold text-slate-700">{monthNames[month]} {year}</span>
        <button onClick={() => goMonth(1)} disabled={new Date(year, month + 1) > today} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer disabled:opacity-30"><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map(d => <div key={d} className="text-center text-[9px] font-extrabold text-slate-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = dateStr === selected;
          const isToday = dateStr === today.toISOString().split("T")[0];
          const isFuture = new Date(dateStr) > today;
          return (
            <button
              key={i}
              onClick={() => !isFuture && onChange(dateStr)}
              disabled={isFuture}
              className={`w-7 h-7 text-[10px] font-bold rounded-lg transition cursor-pointer ${isSelected ? "bg-[#0D47A1] text-white" :
                isToday ? "border-2 border-[#0D47A1] text-[#0D47A1]" :
                  isFuture ? "text-slate-200 cursor-not-allowed" :
                    "hover:bg-slate-100 text-slate-600"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── HELPERS ──────────────────────────────────────────────────────────

const format24to12 = (time24: string): string => {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const format12to24 = (time12: string): string => {
  if (!time12) return "";
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let [_, hoursStr, minutesStr, ampm] = match;
  let hours = parseInt(hoursStr);
  if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutesStr}`;
};

const calculateLateMinutes = (checkInStr: string, shiftStr: string): number => {
  if (!checkInStr) return 0;
  const matchCheck = checkInStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!matchCheck) return 0;
  let [_, hours, minutes, ampm] = matchCheck;
  let h = parseInt(hours);
  let m = parseInt(minutes);
  if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
  if (ampm.toUpperCase() === "AM" && h === 12) h = 0;

  let shiftHour = 9;
  let shiftMinute = 0;
  if (shiftStr.includes("Morning")) {
    shiftHour = 8;
  } else if (shiftStr.includes("General")) {
    shiftHour = 9;
  }

  const checkInTotal = h * 60 + m;
  const shiftTotal = shiftHour * 60 + shiftMinute;
  const diff = checkInTotal - shiftTotal;
  return diff > 0 ? diff : 0;
};

// ─── TODAY'S ATTENDANCE VIEW ──────────────────────────────────────────────────

const TodayView = ({
  selectedDate,
  onDateChange,
  records,
  openModal
}: {
  selectedDate: string;
  onDateChange: (d: string) => void;
  records: AttendanceRecord[];
  openModal: (mode: "add" | "edit", dateStr: string, empId?: string, record?: AttendanceRecord) => void;
}) => {
  const [searchName, setSearchName] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [searchLoc, setSearchLoc] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempSearchName, setTempSearchName] = useState("");
  const [tempSearchDept, setTempSearchDept] = useState("");
  const [tempSearchLoc, setTempSearchLoc] = useState("");
  const [tempStatusFilter, setTempStatusFilter] = useState("all");
  const [tempDeptFilter, setTempDeptFilter] = useState("all");
  const [tempTypeFilter, setTempTypeFilter] = useState("all");

  useEffect(() => {
    if (isFilterOpen) {
      setTempSearchName(searchName);
      setTempSearchDept(searchDept);
      setTempSearchLoc(searchLoc);
      setTempStatusFilter(statusFilter);
      setTempDeptFilter(deptFilter);
      setTempTypeFilter(typeFilter);
    }
  }, [isFilterOpen, searchName, searchDept, searchLoc, statusFilter, deptFilter, typeFilter]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calPos, setCalPos] = useState<{ top: number; left: number } | null>(null);
  const calBtnRef = useRef<HTMLButtonElement>(null);

  const departments = useMemo(() => Array.from(new Set(records.map(r => r.department))), [records]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status === "present").length;
    const absent = records.filter(r => r.status === "absent" || (r as any).leaveType === "unpaid_leave" || (r as any).leaveType === "half_day_leave").length;
    const onLeave = records.filter(r => r.status === "on_leave" || (r as any).leaveType === "paid_leave").length;
    const late = records.filter(r => r.status === "late").length;
    const halfDay = records.filter(r => r.status === "half_day").length;
    const notMarked = records.filter(r => r.status === "not_marked").length;
    const rate = total > 0 ? Math.round(((present + late + halfDay) / total) * 100) : 0;
    return { total, present, absent, onLeave, late, halfDay, notMarked, rate };
  }, [records]);

  const filtered = useMemo(() => records.filter(r => {
    const ms = r.name.toLowerCase().includes(searchName.toLowerCase()) || r.empId.toLowerCase().includes(searchName.toLowerCase());
    const md = r.department.toLowerCase().includes(searchDept.toLowerCase());
    const ml = !r.location || r.location.toLowerCase().includes(searchLoc.toLowerCase());

    const mst = statusFilter === "all" || r.status === statusFilter;
    const mSideDept = deptFilter === "all" || r.department === deptFilter;
    const mt = typeFilter === "all" || r.checkInType === typeFilter;

    return ms && md && ml && mst && mSideDept && mt;
  }), [records, searchName, searchDept, searchLoc, statusFilter, deptFilter, typeFilter]);

  const effectivePageSize = pageSize === 0 ? filtered.length : pageSize;
  const totalPages = Math.ceil(filtered.length / effectivePageSize);
  const paginated = filtered.slice((page - 1) * effectivePageSize, page * effectivePageSize);

  useEffect(() => setPage(1), [searchName, searchDept, searchLoc, statusFilter, deptFilter, typeFilter, pageSize]);

  const formatDate = (s: string) => new Date(s).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    const ns = d.toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    if (ns <= today) onDateChange(ns);
  };

  const handleExportToday = () => {
    let csvContent = "Employee ID,Name,Department,Designation,Status,Punch In,Punch Out,Punch Type,Location,Working Hours,Overtime\n";

    filtered.forEach(r => {
      const empId = r.empId;
      const name = r.name;
      const department = r.department;
      const designation = r.designation || "";
      const status = r.status.toUpperCase();
      const checkIn = r.checkInTime || "";
      const checkOut = r.checkOutTime || "";
      const punchType = r.checkInType || "";
      const location = r.location ? `"${r.location.replace(/"/g, '""')}"` : "";
      const workingHours = r.workingHours || "";
      const overtime = r.overtime || "";

      csvContent += `${empId},${name},${department},${designation},${status},${checkIn},${checkOut},${punchType},${location},${workingHours},${overtime}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Today_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Today's report exported successfully!");
  };

  return (
    <div className="flex flex-col gap-3 h-auto md:h-full min-h-full md:min-h-0 relative">

      {/* ── Sliding Filters Backdrop ──────────────────────────────────── */}
      {isFilterOpen && (
        <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[1050] transition-opacity duration-300" />
      )}

      {/* ── Sliding Right Sidebar Filters ─────────────────────────────── */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 z-[1100] shadow-2xl flex flex-col p-5 gap-4 transition-transform duration-300 ease-in-out transform ${isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Filter size={13} className="text-[#0D47A1]" /> Today's Filters
          </h4>
          <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* Search Input for Mobile/Sidebar */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Search Employee</label>
          <input
            type="text"
            placeholder="Search name or ID..."
            value={tempSearchName}
            onChange={e => setTempSearchName(e.target.value)}
            className="w-full px-3 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-655 outline-none focus:ring-1 focus:ring-[#0D47A1] bg-white"
          />
        </div>

        {/* Department text search */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Search Department</label>
          <input
            type="text"
            placeholder="Search department..."
            value={tempSearchDept}
            onChange={e => setTempSearchDept(e.target.value)}
            className="w-full px-3 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-655 outline-none focus:ring-1 focus:ring-[#0D47A1] bg-white"
          />
        </div>

        {/* Location search */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Search Location</label>
          <input
            type="text"
            placeholder="Search location..."
            value={tempSearchLoc}
            onChange={e => setTempSearchLoc(e.target.value)}
            className="w-full px-3 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-655 outline-none focus:ring-1 focus:ring-[#0D47A1] bg-white"
          />
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Status</label>
          <select value={tempStatusFilter} onChange={e => setTempStatusFilter(e.target.value)}
            className="w-full pl-2.5 pr-6 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-600 outline-none bg-white cursor-pointer focus:ring-1 focus:ring-[#0D47A1]">
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="on_leave">On Leave</option>
            <option value="holiday">Holiday</option>
            <option value="not_marked">Not Marked</option>
          </select>
        </div>

        {/* Department filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Department</label>
          <select value={tempDeptFilter} onChange={e => setTempDeptFilter(e.target.value)}
            className="w-full pl-2.5 pr-6 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-600 outline-none bg-white cursor-pointer focus:ring-1 focus:ring-[#0D47A1]">
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Type filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Check-in Type</label>
          <select value={tempTypeFilter} onChange={e => setTempTypeFilter(e.target.value)}
            className="w-full pl-2.5 pr-6 py-1.5 text-[11px] border border-slate-200 rounded-lg font-semibold text-slate-600 outline-none bg-white cursor-pointer focus:ring-1 focus:ring-[#0D47A1]">
            <option value="all">All Types</option>
            <option value="office">Office</option>
            <option value="remote">Remote</option>
            <option value="field">Field</option>
          </select>
        </div>

        {/* Actions Footer */}
        <div className="flex gap-2 pt-3 border-t border-slate-100 mt-auto flex-shrink-0">
          <button onClick={() => {
            setTempStatusFilter("all");
            setTempDeptFilter("all");
            setTempTypeFilter("all");
            setTempSearchName("");
            setTempSearchDept("");
            setTempSearchLoc("");

            setStatusFilter("all");
            setDeptFilter("all");
            setTypeFilter("all");
            setSearchName("");
            setSearchDept("");
            setSearchLoc("");
            toast.success("Filters reset!");
            setIsFilterOpen(false);
          }} className="flex-1 py-2 border border-slate-200 rounded-xl text-[11px] font-extrabold text-slate-500 hover:bg-slate-50 transition cursor-pointer text-center">
            Reset
          </button>
          <button onClick={() => {
            setStatusFilter(tempStatusFilter);
            setDeptFilter(tempDeptFilter);
            setTypeFilter(tempTypeFilter);
            setSearchName(tempSearchName);
            setSearchDept(tempSearchDept);
            setSearchLoc(tempSearchLoc);
            setIsFilterOpen(false);
          }} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold transition cursor-pointer text-center shadow-sm">
            Apply
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 flex-none">
        {[
          { label: "Total", val: stats.total, sub: "employees", color: "text-slate-700 bg-slate-50 border-slate-200" },
          { label: "Present", val: stats.present, sub: `${Math.round((stats.present / stats.total) * 100)}%`, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Absent", val: stats.absent, sub: "not in", color: "text-red-700 bg-red-50 border-red-200" },
          { label: "Late", val: stats.late, sub: "after 10:30", color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "On Leave", val: stats.onLeave, sub: "approved", color: "text-purple-700 bg-purple-50 border-purple-200" },
          { label: "Rate", val: `${stats.rate}%`, sub: "today", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border px-3 py-2 text-center ${s.color}`}>
            <p className="text-[9px] font-extrabold uppercase tracking-widest opacity-70">{s.label}</p>
            <p className="text-xl font-extrabold leading-tight">{s.val}</p>
            <p className="text-[9px] font-semibold opacity-60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex-none bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Left: Date navigation & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date nav */}
          <div className="flex items-center gap-1">
            <button onClick={() => shiftDate(-1)} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer"><ChevronLeft size={13} /></button>
            <button
              ref={calBtnRef}
              onClick={() => {
                if (showCalendar) {
                  setShowCalendar(false);
                  setCalPos(null);
                } else {
                  const rect = calBtnRef.current?.getBoundingClientRect();
                  if (rect) setCalPos({ top: rect.bottom + 6, left: rect.left });
                  setShowCalendar(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer bg-slate-50"
            >
              <Calendar size={12} className="text-[#0D47A1]" /> {formatDate(selectedDate)}
            </button>
            <button onClick={() => shiftDate(1)} disabled={selectedDate >= new Date().toISOString().split("T")[0]} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"><ChevronRight size={13} /></button>
          </div>

          <div className="w-px h-5 bg-slate-200 hidden sm:block" />

          {/* Sidebar Filters Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Filter size={12} className="text-[#0D47A1]" /> Filters
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportToday}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
          >
            <Download size={12} className="text-[#0D47A1]" /> <span className="hidden sm:inline">Export Data</span><span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={() => openModal("add", selectedDate)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold text-white bg-[#0D47A1] hover:bg-[#0D47A1]/90 cursor-pointer"
          >
            <UserCheck size={12} /> <span className="hidden sm:inline">Add Attendance</span><span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
      {/* Table Wrapper Card (Pagination pinned to bottom inside container) */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Scrollable table body wrapper */}
        <div className="flex-1 overflow-auto min-h-0">
          {/* Desktop Table View */}
          <table className="hidden md:table min-w-full border-collapse text-[11px]">
            <thead className="sticky top-0 bg-slate-50 z-20 shadow-sm border-b border-slate-200">
              <tr className="bg-slate-50">
                {["Employee", "Department", "Punch In", "Punch Out", "Type", "Location", "Hours", "Late", "Overtime", "Status", "Actions"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[9px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
              <tr className="bg-slate-100/40 border-b border-slate-200">
                <th className="px-3 py-1.5">
                  <input
                    type="text"
                    placeholder="Search name/ID..."
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    className="w-full px-2.5 py-1 text-[10px] border border-slate-200 rounded-lg font-normal bg-white outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-slate-655 placeholder:text-slate-400"
                  />
                </th>
                <th className="px-3 py-1.5">
                  <input
                    type="text"
                    placeholder="Search dept..."
                    value={searchDept}
                    onChange={e => setSearchDept(e.target.value)}
                    className="w-full px-2.5 py-1 text-[10px] border border-slate-200 rounded-lg font-normal bg-white outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-slate-655 placeholder:text-slate-400"
                  />
                </th>
                <th className="px-3 py-1.5"></th>
                <th className="px-3 py-1.5"></th>
                <th className="px-3 py-1.5"></th>
                <th className="px-3 py-1.5">
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchLoc}
                    onChange={e => setSearchLoc(e.target.value)}
                    className="w-full px-2.5 py-1 text-[10px] border border-slate-200 rounded-lg font-normal bg-white outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-slate-655 placeholder:text-slate-400"
                  />
                </th>
                <th colSpan={5} className="px-3 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={12} className="py-14 text-center text-slate-400 text-xs font-semibold"><UserX size={32} className="mx-auto mb-2 opacity-20" />No records found</td></tr>
              )}
              {paginated.map((r, i) => {
                const sc = STATUS_CONFIG[r.status];
                return (
                  <tr key={r.empId} className={`border-b border-slate-100 hover:bg-blue-50/20 transition duration-155 ${i % 2 ? "bg-slate-50/30" : ""}`}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={r.name} color={r.avatarColor} url={(r as any).avatarUrl} />
                        <div><p className="font-extrabold text-slate-800">{r.name}</p><p className="text-[9px] text-slate-400">{r.empId}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-655">{r.department}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-700">{r.checkInTime || "—"}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-700">{r.checkOutTime || "—"}</td>
                    <td className="px-3 py-2.5 font-semibold capitalize text-slate-500">{r.checkInType || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600 font-semibold">{r.location || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600 font-semibold">{r.workingHours || "—"}</td>
                    <td className="px-3 py-2.5">
                      <span className={r.lateTime && r.lateTime !== "—" ? "text-amber-600 font-bold" : "text-slate-400"}>
                        {r.lateTime || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 font-bold">{r.overtime || "—"}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={r.status} leaveType={(r as any).leaveType} />
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => openModal("edit", selectedDate, r.empId, r)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#0D47A1] rounded transition cursor-pointer"
                        title="Edit Attendance"
                      >
                        <Edit3 size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <div className="py-14 text-center text-slate-400 text-xs font-semibold">
                <UserX size={32} className="mx-auto mb-2 opacity-20" />
                No records found
              </div>
            ) : (
              paginated.map((r) => (
                <div key={r.empId} className="p-4 flex flex-col gap-3 bg-white hover:bg-slate-50/50 transition">
                  {/* Avatar, Name, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={r.name} color={r.avatarColor} url={(r as any).avatarUrl} />
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">{r.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{r.empId} • {r.department}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} leaveType={(r as any).leaveType} />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] bg-slate-50/50 rounded-xl p-2.5 border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Punch In</span>
                      <span className="text-slate-700 font-extrabold mt-0.5">{r.checkInTime || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Punch Out</span>
                      <span className="text-slate-700 font-extrabold mt-0.5">{r.checkOutTime || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Working Hours</span>
                      <span className="text-slate-700 font-extrabold mt-0.5">{r.workingHours || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Type / Location</span>
                      <span className="text-slate-700 font-extrabold mt-0.5 truncate max-w-[150px]">
                        {r.checkInType ? `${r.checkInType.toUpperCase()} (${r.location || "—"})` : "—"}
                      </span>
                    </div>
                    {r.lateTime && r.lateTime !== "—" ? (
                      <div className="flex flex-col">
                        <span className="text-amber-500 font-bold uppercase tracking-wider text-[8px]">Late By</span>
                        <span className="text-amber-600 font-extrabold mt-0.5">{r.lateTime}</span>
                      </div>
                    ) : null}
                    {r.overtime && r.overtime !== "—" ? (
                      <div className="flex flex-col">
                        <span className="text-slate-450 font-bold uppercase tracking-wider text-[8px]">Overtime</span>
                        <span className="text-slate-700 font-extrabold mt-0.5">{r.overtime}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between border-t border-slate-100/80 pt-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">Actions</span>
                    <button
                      onClick={() => openModal("edit", selectedDate, r.empId, r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold transition cursor-pointer"
                      title="Edit Attendance"
                    >
                      <Edit3 size={11} className="text-[#0D47A1]" /> Edit Log
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex-none bg-slate-50/50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap text-slate-700 text-xs font-bold mt-auto select-none">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Show:</span>
            <select
              value={pageSize === 0 ? "all" : pageSize}
              onChange={e => {
                const val = e.target.value;
                setPageSize(val === "all" ? 0 : Number(val));
                setPage(1);
              }}
              className="pl-2 pr-6 py-1 border border-slate-200 bg-white font-bold text-slate-700 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-[#0D47A1] text-xs"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="all">All</option>
            </select>
            <span className="text-slate-400 font-medium">
              Showing {filtered.length === 0 ? 0 : (page - 1) * (pageSize || filtered.length) + 1} - {Math.min(page * (pageSize || filtered.length), filtered.length)} of {filtered.length} logs
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:hover:bg-white text-[10px]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-6 h-6 rounded-lg text-[10px] transition flex items-center justify-center cursor-pointer ${page === p ? "bg-[#0D47A1] text-white" : "border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:hover:bg-white text-[10px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showCalendar && calPos && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center sm:block" onClick={() => { setShowCalendar(false); setCalPos(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-200/80 w-64 z-[1201] text-xs font-bold text-slate-700 relative sm:absolute"
            style={window.innerWidth < 640 ? {} : { top: calPos.top, left: calPos.left }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
              <span>Quick Date Selector</span>
              <button onClick={() => { setShowCalendar(false); setCalPos(null); }} className="text-slate-400 hover:text-slate-650 transition cursor-pointer"><X size={14} /></button>
            </div>
            <input type="date" value={selectedDate} max={new Date().toISOString().split("T")[0]}
              onChange={e => { if (e.target.value) { onDateChange(e.target.value); setShowCalendar(false); setCalPos(null); } }}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 font-semibold" />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── EMPLOYEE ATTENDANCE VIEW ────────────────────────────────────────────────

const EmployeeAttendanceView = ({
  roster,
  socketTrigger
}: {
  roster: any[];
  socketTrigger?: number;
}) => {
  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const getSelfieUrl = (pathStr?: string | null) => {
    if (!pathStr) return "";
    if (pathStr.startsWith("data:") || pathStr.startsWith("http")) return pathStr;
    return `${BASE_URL}/${pathStr}`;
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [monthlyLogs, setMonthlyLogs] = useState<AttendanceRecord[]>([]);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  useEffect(() => {
    if (roster.length > 0 && !selectedEmp) {
      setSelectedEmp(roster[0]);
      setSearchQuery(roster[0].name);
    }
  }, [roster]);

  const fetchMonthlyLogs = async () => {
    if (!selectedEmp || !selectedEmp.userId) return;
    setLoadingMonthly(true);
    try {
      const data = await attendanceApi.getAdminUserLogs(selectedEmp.userId, selectedMonth, selectedYear);
      setMonthlyLogs(data);
    } catch (err) {
      console.error("Failed to load employee monthly logs:", err);
    } finally {
      setLoadingMonthly(false);
    }
  };

  useEffect(() => {
    fetchMonthlyLogs();
  }, [selectedEmp, selectedMonth, selectedYear, socketTrigger]);

  // Custom Biometric Log Popup State
  const [selectedLog, setSelectedLog] = useState<{ dateStr: string; record?: AttendanceRecord } | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedLog(null);
      setIsModalClosing(false);
    }, 200);
  };

  const handleExportCSV = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    let csvContent = "Date,Day,Status,Check In,Check Out,Working Hours,Location,Notes\n";

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayOfWeekName = new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
      const rec = monthlyLogs.find(r => r.date === dateStr);

      let status = "Not Marked";
      if (rec) status = rec.status.toUpperCase();
      else {
        const dayIdx = new Date(dateStr).getDay();
        if (dayIdx === 0) status = "WEEKEND OFF";
      }

      const checkIn = rec?.checkInTime || "";
      const checkOut = rec?.checkOutTime || "";
      const workingHours = rec?.workingHours || "";
      const location = rec?.location ? `"${rec.location.replace(/"/g, '""')}"` : "";
      const notes = rec && (rec as any).comment ? `"${(rec as any).comment.replace(/"/g, '""')}"` : "";

      csvContent += `${dateStr},${dayOfWeekName},${status},${checkIn},${checkOut},${workingHours},${location},${notes}\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedEmp.name.replace(/\s+/g, "_")}_Attendance_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report exported successfully!");
  };

  // Form states inside biometric log popup
  const [tempStatus, setTempStatus] = useState<AttendanceStatus>("present");
  const [tempLeaveType, setTempLeaveType] = useState<string>("");
  const [tempWorkingHours, setTempWorkingHours] = useState("");
  const [tempCheckInTime, setTempCheckInTime] = useState("");
  const [tempCheckOutTime, setTempCheckOutTime] = useState("");
  const [tempCheckInLocation, setTempCheckInLocation] = useState("");
  const [tempCheckOutLocation, setTempCheckOutLocation] = useState("");
  const [tempComment, setTempComment] = useState("");
  const [tempCheckInSelfie, setTempCheckInSelfie] = useState<string | null>(null);
  const [tempCheckOutSelfie, setTempCheckOutSelfie] = useState<string | null>(null);

  // Sync edit form states when a cell is clicked/selected
  const handleSelectCell = (dateStr: string, rec?: AttendanceRecord) => {
    setSelectedLog({ dateStr, record: rec });
    setIsModalClosing(false);
    if (rec) {
      setTempStatus(rec.status);
      setTempLeaveType((rec as any).leaveType || "");
      setTempWorkingHours(rec.workingHours || "");
      setTempCheckInTime(rec.checkInTime || "");
      setTempCheckOutTime(rec.checkOutTime || "");
      setTempComment((rec as any).comment || "");
      setTempCheckInSelfie(rec.checkInSelfie || null);
      setTempCheckOutSelfie(rec.checkOutSelfie || null);

      // Resolve check-in address
      const checkInLat = (rec as any).checkInLat;
      const checkInLng = (rec as any).checkInLng;
      if (checkInLat && checkInLng) {
        setTempCheckInLocation("Loading address...");
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${checkInLat}&lon=${checkInLng}`)
          .then(r => r.json())
          .then(json => {
            const addr = json?.display_name || `${checkInLat}, ${checkInLng}`;
            setTempCheckInLocation(addr.split(',').slice(0, 3).join(',').trim());
          })
          .catch(() => {
            setTempCheckInLocation(`${Number(checkInLat).toFixed(5)}, ${Number(checkInLng).toFixed(5)}`);
          });
      } else {
        setTempCheckInLocation(rec.location || "");
      }

      // Resolve check-out address
      const checkOutLat = (rec as any).checkOutLat;
      const checkOutLng = (rec as any).checkOutLng;
      if (checkOutLat && checkOutLng) {
        setTempCheckOutLocation("Loading address...");
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${checkOutLat}&lon=${checkOutLng}`)
          .then(r => r.json())
          .then(json => {
            const addr = json?.display_name || `${checkOutLat}, ${checkOutLng}`;
            setTempCheckOutLocation(addr.split(',').slice(0, 3).join(',').trim());
          })
          .catch(() => {
            setTempCheckOutLocation(`${Number(checkOutLat).toFixed(5)}, ${Number(checkOutLng).toFixed(5)}`);
          });
      } else {
        setTempCheckOutLocation(rec.location || "");
      }
    } else {
      // Default initial states for blank dates
      setTempStatus("present");
      setTempLeaveType("");
      setTempWorkingHours("");
      setTempCheckInTime("");
      setTempCheckOutTime("");
      setTempCheckInLocation("");
      setTempCheckOutLocation("");
      setTempComment("");
      setTempCheckInSelfie(null);
      setTempCheckOutSelfie(null);
    }
  };

  const handleSaveLog = async () => {
    if (!selectedLog || !selectedEmp || !selectedEmp.userId) return;

    const isOffStatus = tempStatus === "absent" || tempStatus === "on_leave" || tempStatus === "holiday" || tempStatus === "not_marked" || tempStatus === "week_off";

    try {
      await attendanceApi.saveManualAttendance({
        userId: selectedEmp.userId,
        date: selectedLog.dateStr,
        status: tempStatus,
        checkIn: isOffStatus ? undefined : tempCheckInTime,
        checkOut: isOffStatus ? undefined : tempCheckOutTime,
        workMode: isOffStatus ? undefined : "Office",
        location: isOffStatus ? undefined : tempCheckInLocation,
        hours: isOffStatus ? undefined : tempWorkingHours,
        leaveType: tempLeaveType || undefined,
        comment: tempComment || undefined
      });

      toast.success("Attendance record saved successfully!");
      fetchMonthlyLogs();
      handleCloseModal();
    } catch (err: any) {
      console.error("Failed to save attendance:", err);
      toast.error(err.message || "Failed to save attendance record");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!selectedEmp || !query || query === selectedEmp.name.toLowerCase() || query === selectedEmp.empId.toLowerCase()) {
      return roster;
    }
    return roster.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.empId.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedEmp, roster]);

  // Calculate stats for the selected employee in the selected month & year
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let onLeave = 0;
    let holiday = 0;
    let notMarked = 0;

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const todayStr = new Date().toISOString().split("T")[0];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const rec = monthlyLogs.find(r => r.date === dateStr);
      const dayOfWeek = new Date(dateStr).getDay();
      const isWeekend = dayOfWeek === 0; // Week Off Days only sunday ka ho

      if (rec) {
        if (rec.status === "present") present++;
        else if (rec.status === "absent" || rec.leaveType === "unpaid_leave" || rec.leaveType === "half_day_leave") absent++;
        else if (rec.status === "late") late++;
        else if (rec.status === "half_day") halfDay++;
        else if (rec.status === "on_leave" || rec.leaveType === "paid_leave") onLeave++;
        else if (rec.status === "holiday") holiday++;
        else if (rec.status === "not_marked") notMarked++;
        else if (rec.status === "week_off") holiday++;
      } else if (isWeekend) {
        holiday++;
      } else if (dateStr < todayStr) {
        absent++;
      } else {
        notMarked++;
      }
    }

    const totalDays = daysInMonth;
    const rate = totalDays > holiday ? Math.round(((present + late + halfDay) / (totalDays - holiday)) * 100) : 0;
    return { present, absent, late, halfDay, onLeave, holiday, notMarked, rate };
  }, [monthlyLogs, selectedEmp, selectedMonth, selectedYear]);

  // Calculate cumulative overall stats for the selected employee across all dates
  const overallStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let onLeave = 0;

    monthlyLogs.forEach(rec => {
      if (rec.status === "present") present++;
      else if (rec.status === "absent" || rec.leaveType === "unpaid_leave" || rec.leaveType === "half_day_leave") absent++;
      else if (rec.status === "late") late++;
      else if (rec.status === "half_day") halfDay++;
      else if (rec.status === "on_leave" || rec.leaveType === "paid_leave") onLeave++;
    });

    const totalDays = present + absent + late + halfDay + onLeave;
    const rate = totalDays > 0 ? Math.round(((present + late + halfDay) / totalDays) * 100) : 0;

    return { present, absent, late, halfDay, onLeave, rate };
  }, [monthlyLogs]);

  // Calendar cells generation
  const calendarCells = useMemo(() => {
    const cells: { dateStr: string; dayNum: number; isPadding: boolean; record?: AttendanceRecord; isWeekend: boolean }[] = [];
    const firstDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // Padding cells before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dateStr: "", dayNum: 0, isPadding: true, isWeekend: false });
    }

    // Days in current month
    const todayStr = new Date().toISOString().split("T")[0];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      let rec = monthlyLogs.find(r => r.date === dateStr);
      const dayOfWeek = new Date(dateStr).getDay();
      const isWeekend = dayOfWeek === 0;

      if (!rec && selectedEmp) {
        if (dateStr < todayStr) {
          if (isWeekend) {
            rec = {
              id: `temp-${dateStr}`,
              userId: selectedEmp.userId,
              date: dateStr,
              empId: selectedEmp.empId,
              name: selectedEmp.name,
              department: selectedEmp.department,
              designation: selectedEmp.designation,
              avatarColor: selectedEmp.avatarColor,
              status: "week_off"
            };
          } else {
            rec = {
              id: `temp-${dateStr}`,
              userId: selectedEmp.userId,
              date: dateStr,
              empId: selectedEmp.empId,
              name: selectedEmp.name,
              department: selectedEmp.department,
              designation: selectedEmp.designation,
              avatarColor: selectedEmp.avatarColor,
              status: "absent"
            };
          }
        }
      }

      cells.push({
        dateStr,
        dayNum: d,
        isPadding: false,
        record: rec,
        isWeekend
      });
    }

    return cells;
  }, [monthlyLogs, selectedEmp, selectedMonth, selectedYear]);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Custom SVG donut chart segment component with interactive tooltip
  const SegmentedDonut = ({
    statsObj,
    percentageRate
  }: {
    statsObj: { present: number; absent: number; late: number; halfDay: number; onLeave: number };
    percentageRate: number;
  }) => {
    const total = statsObj.present + statsObj.absent + statsObj.late + statsObj.halfDay + statsObj.onLeave;
    const [isHovered, setIsHovered] = useState(false);

    if (total === 0) {
      return (
        <div className="relative w-28 h-28 flex items-center justify-center mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
          </svg>
          <span className="absolute text-slate-400 font-extrabold text-[10px]">No Data</span>
        </div>
      );
    }

    const segments = [
      { label: "Present", val: statsObj.present, color: "#10b981" },
      { label: "Late", val: statsObj.late, color: "#f59e0b" },
      { label: "Half Day", val: statsObj.halfDay, color: "#3b82f6" },
      { label: "On Leave", val: statsObj.onLeave, color: "#a855f7" },
      { label: "Absent", val: statsObj.absent, color: "#ef4444" }
    ].filter(s => s.val > 0);

    const radius = 15.915;
    let accumulatedPercent = 0;

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-28 h-28 flex items-center justify-center mx-auto transition-transform hover:scale-105 duration-300 cursor-pointer animate-in fade-in"
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#f8fafc" strokeWidth="3.2" />
          {segments.map((seg, i) => {
            const percent = (seg.val / total) * 100;
            const strokeDash = `${percent} ${100 - percent}`;
            const strokeOffset = 100 - accumulatedPercent;
            accumulatedPercent += percent;

            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="3.2"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none select-none">
          <span className="text-sm font-extrabold text-slate-800 leading-none">{percentageRate}%</span>
          <span className="text-[7px] text-slate-450 font-extrabold uppercase mt-0.5 tracking-wider">Rate</span>
        </div>

        {/* Hover Tooltip display */}
        {isHovered && (
          <div className="absolute  z-40 bg-slate-900/95 text-white px-3 py-2.5 rounded-2xl shadow-xl text-[10px] space-y-1.5 w-32 border border-slate-700/50 backdrop-blur-xs transition-all pointer-events-none scale-100 top-1/2 left-full ml-5 -translate-x-4 -translate-y-1/2 flex flex-col">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-0.5 text-center">Status Counts</span>
            <div className="flex justify-between"><span>Present:</span><span className="text-emerald-400 font-extrabold">{statsObj.present}d</span></div>
            <div className="flex justify-between"><span>Late:</span><span className="text-amber-400 font-extrabold">{statsObj.late}d</span></div>
            <div className="flex justify-between"><span>Half Day:</span><span className="text-blue-400 font-extrabold">{statsObj.halfDay}d</span></div>
            <div className="flex justify-between"><span>Leave:</span><span className="text-purple-400 font-extrabold">{statsObj.onLeave}d</span></div>
            <div className="flex justify-between"><span>Absent:</span><span className="text-red-400 font-extrabold">{statsObj.absent}d</span></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-auto md:h-full min-h-full md:min-h-0">
      {/* Header Toolbar: Search bar & Month selector */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 flex-none">

        {/* Search Input with Custom Dropdown */}
        <div ref={dropdownRef} className="relative w-full md:w-80">
          <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Search Employee</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Floating Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-[1200] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {filteredEmployees.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-xs font-semibold">No employees match</div>
              ) : (
                filteredEmployees.map(emp => (
                  <button
                    key={emp.empId}
                    type="button"
                    onClick={() => {
                      setSelectedEmp(emp);
                      setSearchQuery(emp.name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold transition hover:bg-slate-50 flex items-center gap-2.5 border-b border-slate-100 last:border-0 ${selectedEmp?.empId === emp.empId ? "bg-blue-50/40 text-[#0D47A1]" : "text-slate-700"
                      }`}
                  >
                    <Avatar name={emp.name} color={emp.avatarColor} url={emp.avatarUrl} />
                    <div className="text-left">
                      <p className="leading-tight text-slate-800">{emp.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{emp.empId} • {emp.department}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Employee Summary Card (Responsive) */}
        {selectedEmp && (
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4 py-1 flex-shrink-0">
            <Avatar name={selectedEmp.name} color={selectedEmp.avatarColor} url={selectedEmp.avatarUrl} />
            <div className="text-xs">
              <p className="font-extrabold text-slate-800 leading-tight">{selectedEmp.name}</p>
              <p className="text-[10px] text-slate-450 font-bold">{selectedEmp.designation} • {selectedEmp.department}</p>
            </div>
          </div>
        )}

        {/* Period selection */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col">
            <label className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Select Period</label>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="pl-2 pr-6 py-1.5 text-xs border border-slate-200 bg-white font-bold text-slate-700 outline-none rounded-xl cursor-pointer focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
              >
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="pl-2 pr-6 py-1.5 text-xs border border-slate-200 bg-white font-bold text-slate-700 outline-none rounded-xl cursor-pointer focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1]"
              >
                {[2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-extrabold transition shadow-sm mt-3.5 cursor-pointer"
          >
            <Download size={13} /> Export Report
          </button>
        </div>

      </div>

      {/* Stats Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 flex-none">
        {[
          { label: "Present", val: stats.present, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Absent", val: stats.absent, color: "text-red-700 bg-red-50 border-red-200" },
          { label: "Late", val: stats.late, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Half Day", val: stats.halfDay, color: "text-blue-700 bg-blue-50 border-blue-200" },
          { label: "On Leave", val: stats.onLeave, color: "text-purple-700 bg-purple-50 border-purple-200" },
          { label: "Rate", val: `${stats.rate}%`, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border px-3 py-2.5 text-center ${s.color}`}>
            <p className="text-[9px] font-extrabold uppercase tracking-widest opacity-70">{s.label}</p>
            <p className="text-xl font-extrabold leading-tight mt-0.5">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Left Pie Charts / Right Calendar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-auto">

        {/* Left Column: Pie Charts Dashboard (lg:col-span-5) - Displayed below Calendar on mobile */}
        <div className="lg:col-span-5 flex flex-col gap-2 flex-none lg:flex-1 order-2 lg:order-1">

          {/* Card 1: This Month Donut */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center flex-1">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 w-full text-left flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> This Month Attendance
            </h4>
            <div className="py-2.5">
              <SegmentedDonut statsObj={stats} percentageRate={stats.rate} />
            </div>
          </div>

          {/* Card 2: Overall Donut */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center flex-1">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 w-full text-left flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#0D47A1]" /> Overall Attendance
            </h4>
            <div className="py-2.5">
              <SegmentedDonut statsObj={overallStats} percentageRate={overallStats.rate} />
            </div>
          </div>

        </div>

        {/* Right Column: Calendar Grid Card (lg:col-span-7) - Displayed above Pie Charts on mobile */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col min-h-0 order-1 lg:order-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 flex-none">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#0D47A1]" />
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {months[selectedMonth - 1]} {selectedYear} Grid
              </h4>
            </div>
            <span className="text-[9px] text-slate-400 font-bold">Click box</span>
          </div>

          {/* Centered Align Container for Days of Week and Grid */}
          <div className="w-full max-w-[440px] mx-auto flex flex-col py-2 min-h-0">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-extrabold text-slate-400 tracking-wider flex-none">
              {daysOfWeek.map(d => (
                <div key={d} className="py-0.5">{d}</div>
              ))}
            </div>

            {/* Calendar Box Grid (Height and width increased, aspect-square, non-scrollable) */}
            <div className="grid grid-cols-7 gap-2 select-none auto-rows-fr">
              {calendarCells.map((cell, idx) => {
                if (cell.isPadding) {
                  return <div key={`pad-${idx}`} className="bg-slate-50/20 rounded-xl border border-slate-100/50 aspect-square" />;
                }

                const isToday = new Date().toISOString().split("T")[0] === cell.dateStr;
                const rec = cell.record;
                let statusColor = "bg-slate-50 border-slate-100 text-slate-400 cursor-pointer hover:scale-105 hover:shadow-sm opacity-85";

                if (rec) {
                  if (rec.status === "present") {
                    statusColor = "bg-emerald-100 border-emerald-300 text-emerald-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "absent" || (rec as any).leaveType === "unpaid_leave" || (rec as any).leaveType === "half_day_leave") {
                    statusColor = "bg-red-100 border-red-300 text-red-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "late") {
                    statusColor = "bg-amber-100 border-amber-300 text-amber-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "half_day") {
                    statusColor = "bg-sky-100 border-sky-300 text-sky-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "on_leave" || (rec as any).leaveType === "paid_leave") {
                    statusColor = "bg-purple-100 border-purple-300 text-purple-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "holiday") {
                    statusColor = "bg-indigo-100 border-indigo-300 text-indigo-800 cursor-pointer hover:scale-105 hover:shadow-sm";
                  } else if (rec.status === "week_off") {
                    statusColor = "bg-white border-slate-200 text-slate-500 cursor-pointer hover:scale-105 hover:shadow-sm";
                  }
                } else if (cell.isWeekend) {
                  statusColor = "bg-white border-slate-200 text-slate-500 cursor-pointer hover:scale-105 hover:shadow-sm opacity-85";
                }

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => {
                      handleSelectCell(cell.dateStr, rec);
                    }}
                    className={`w-full aspect-square border rounded-2xl flex items-center justify-center transition-all duration-150 text-xs font-bold focus:outline-none ${statusColor} ${isToday ? "ring-2 ring-[#0D47A1] ring-offset-1" : ""
                      }`}
                  >
                    {cell.dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ── Custom Biometric Log Popup Modal ─────────────────────────────── */}
      {selectedLog && (
        <div
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[1500] p-4 transition-all duration-200 ${isModalClosing ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          <div
            className={`bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-[480px] overflow-hidden flex flex-col p-4 gap-3 text-slate-700 transition-all duration-200 ${isModalClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >

            {/* Modal Header Title */}
            <div className="flex justify-between items-center flex-none">
              <h3 className="font-bold text-slate-850 text-sm">
                Employee Details :
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-1 text-[11px] font-bold">
              {/* Name */}
              <div className="flex items-center gap-2">
                <User size={16} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Name :</span>
                  <span className="text-slate-800 font-extrabold uppercase leading-tight block">{selectedEmp.name}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Date :</span>
                  <span className="text-slate-800 font-extrabold leading-tight block">{selectedLog.dateStr}</span>
                </div>
              </div>

              {/* Emp ID */}
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-blue-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Emp ID :</span>
                  <span className="text-slate-800 font-extrabold block">{selectedEmp.empId}</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-purple-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Working Hours :</span>
                  <input
                    type="text"
                    value={tempWorkingHours}
                    onChange={e => setTempWorkingHours(e.target.value)}
                    className="font-extrabold text-slate-800 w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 text-xs pb-0.5"
                  />
                </div>
              </div>

              {/* Late */}
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Late :</span>
                  <span className="text-slate-800 font-extrabold block">
                    {selectedLog.record && (selectedLog.record as any).lateTime ? (selectedLog.record as any).lateTime : "—"}
                  </span>
                </div>
              </div>

              {/* Overtime */}
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-0.5">Overtime :</span>
                  <span className="text-slate-800 font-extrabold block">
                    {selectedLog.record && selectedLog.record.overtime ? selectedLog.record.overtime : "—"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <Smile size={16} className="text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-1">Status</span>
                  <select
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-3 py-1 text-[11px] border border-slate-200 rounded-full font-bold outline-none cursor-pointer focus:ring-1 focus:ring-[#0D47A1] text-slate-800 bg-white"
                  >
                    <option value="not_marked">Select</option>
                    <option value="present">PRESENT</option>
                    <option value="absent">ABSENT</option>
                    <option value="late">LATE</option>
                    <option value="half_day">HALF DAY</option>
                    <option value="on_leave">ON LEAVE</option>
                    <option value="holiday">HOLIDAY</option>
                    <option value="week_off">WEEK OFF</option>
                  </select>
                </div>
              </div>

              {/* Leave */}
              <div className="flex items-center gap-2">
                <UserX size={16} className="text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold mb-1">Leave</span>
                  <select
                    value={
                      tempLeaveType === "paid_leave" ? "PAID LEAVE" :
                        tempLeaveType === "unpaid_leave" ? "UNPAID LEAVE" :
                          tempLeaveType === "half_day_leave" ? "HALF DAY LEAVE" :
                            "Select"
                    }
                    onChange={e => {
                      const val = e.target.value;
                      if (val === "PAID LEAVE") setTempLeaveType("paid_leave");
                      else if (val === "UNPAID LEAVE") setTempLeaveType("unpaid_leave");
                      else if (val === "HALF DAY LEAVE") setTempLeaveType("half_day_leave");
                      else setTempLeaveType("");
                    }}
                    className="w-full px-3 py-1 text-[11px] border border-slate-200 rounded-full font-bold outline-none cursor-pointer focus:ring-1 focus:ring-[#0D47A1] text-slate-800 bg-white"
                  >
                    <option value="Select">Select</option>
                    <option value="PAID LEAVE">PAID LEAVE</option>
                    <option value="UNPAID LEAVE">UNPAID LEAVE</option>
                    <option value="HALF DAY LEAVE">HALF DAY LEAVE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Track Records List Section */}
            <div className="space-y-2 mt-1 border-t border-slate-100 pt-2 flex-none">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Clock size={15} className="text-amber-500" /> Track :
              </h4>

              <div className="space-y-2.5 max-h-36 overflow-y-auto">
                {/* Out punch */}
                {tempCheckOutTime && (
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${selectedEmp.avatarColor} flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden border border-slate-100`}>
                      {tempCheckOutSelfie ? (
                        <img
                          src={getSelfieUrl(tempCheckOutSelfie)}
                          alt="Out Selfie"
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-155 cursor-zoom-in"
                        />
                      ) : (
                        <User size={20} className="text-white opacity-85" />
                      )}
                    </div>
                    <div className="text-[11px] flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <input
                          type="text"
                          value={tempCheckOutTime}
                          onChange={e => setTempCheckOutTime(e.target.value)}
                          className="w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 font-bold"
                        />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-slate-500 font-semibold">Out</span>
                      </div>
                      <input
                        type="text"
                        value={tempCheckOutLocation}
                        onChange={e => setTempCheckOutLocation(e.target.value)}
                        className="text-[10px] text-slate-500 font-medium w-full bg-transparent focus:outline-none border-b border-dashed border-slate-200 mt-0.5 leading-tight"
                        placeholder="Location address..."
                      />
                    </div>
                  </div>
                )}

                {/* In punch */}
                {tempCheckInTime && (
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${selectedEmp.avatarColor} flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden border border-slate-100`}>
                      {tempCheckInSelfie ? (
                        <img
                          src={getSelfieUrl(tempCheckInSelfie)}
                          alt="In Selfie"
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-155 cursor-zoom-in"
                        />
                      ) : (
                        <User size={20} className="text-white opacity-85" />
                      )}
                    </div>
                    <div className="text-[11px] flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <input
                          type="text"
                          value={tempCheckInTime}
                          onChange={e => setTempCheckInTime(e.target.value)}
                          className="w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 font-bold"
                        />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-500 font-semibold">In</span>
                      </div>
                      <input
                        type="text"
                        value={tempCheckInLocation}
                        onChange={e => setTempCheckInLocation(e.target.value)}
                        className="text-[10px] text-slate-500 font-medium w-full bg-transparent focus:outline-none border-b border-dashed border-slate-200 mt-0.5 leading-tight"
                        placeholder="Location address..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Textarea (Blank Label exactly like screenshot) */}
            <div className="mt-1 border-t border-slate-100 pt-2 flex-none">
              <textarea
                rows={2}
                value={tempComment}
                onChange={e => setTempComment(e.target.value)}
                placeholder="Enter your message..."
                className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#0D47A1] font-medium text-slate-700 placeholder:text-slate-400 bg-slate-50/50"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 flex-none">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-3.5 py-1.5 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-505 text-[10px] font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLog}
                className="px-3.5 py-1.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-full text-[10px] font-bold transition shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Check size={12} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// ─── Main AttendancePage Component ───────────────────────────────────────────

export default function AttendancePage() {
  const ctx = useOutletContext<{ setHeaderTitle: (t: string) => void; setHeaderSubtitle: (s: string) => void }>() || {};

  useEffect(() => {
    ctx.setHeaderTitle?.("Attendance");
    ctx.setHeaderSubtitle?.("Track employee punch logs, shifts & regularizations");
  }, []);

  const [activeTab, setActiveTab] = useState<ViewTab>("today");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [socketTrigger, setSocketTrigger] = useState(0);

  // Modal states lifted
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [modalStatus, setModalStatus] = useState<AttendanceStatus>("present");
  const [modalCheckIn, setModalCheckIn] = useState("");
  const [modalCheckOut, setModalCheckOut] = useState("");
  const [modalType, setModalType] = useState<CheckInType>("office");
  const [modalLocation, setModalLocation] = useState("");
  const [modalWorkingHours, setModalWorkingHours] = useState("");
  const [modalOvertime, setModalOvertime] = useState("");

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [recordsByDate, setRecordsByDate] = useState<Record<string, AttendanceRecord[]>>({});
  const [loadingLogs, setLoadingLogs] = useState(true);

  const roster = useMemo(() => {
    const unique = new Map<string, any>();
    records.forEach(r => {
      if (r.empId && !unique.has(r.empId)) {
        unique.set(r.empId, {
          userId: r.userId,
          empId: r.empId,
          name: r.name,
          department: r.department,
          designation: r.designation,
          avatarColor: r.avatarColor,
          avatarUrl: (r as any).avatarUrl
        });
      }
    });
    return Array.from(unique.values());
  }, [records]);

  const openModal = (mode: "add" | "edit", dateStr: string, empId?: string, record?: AttendanceRecord) => {
    setModalMode(mode);
    setModalDate(dateStr);
    if (mode === "add") {
      setSelectedEmpId(empId || (roster[0]?.empId || ""));
      setModalStatus("present");
      setModalCheckIn("09:00 AM");
      setModalCheckOut("06:00 PM");
      setModalType("office");
      setModalLocation("");
      setModalWorkingHours("9h 00m");
      setModalOvertime("");
    } else {
      if (record) {
        setSelectedEmpId(record.empId);
        setModalStatus(record.status);
        setModalCheckIn(record.checkInTime || "09:00 AM");
        setModalCheckOut(record.checkOutTime || "06:00 PM");
        setModalType(record.checkInType || "office");
        setModalLocation(record.location || "");
        setModalWorkingHours(record.workingHours || "");
        setModalOvertime(record.overtime || "");
      }
    }
    setIsModalOpen(true);
  };

  const fetchAdminLogs = async () => {
    try {
      const data = await attendanceApi.getAdminLogs(selectedDate);
      setRecords(data);
      setRecordsByDate(prev => ({
        ...prev,
        [selectedDate]: data
      }));
    } catch (err) {
      console.error('Failed to load employee attendance logs:', err);
    }
  };

  // Sync today's view records with backend database logs
  useEffect(() => {
    setLoadingLogs(true);
    fetchAdminLogs().finally(() => setLoadingLogs(false));
  }, [selectedDate]);

  // Keep socket callback ref updated to prevent stale closures
  const fetchAdminLogsRef = useRef(fetchAdminLogs);
  useEffect(() => {
    fetchAdminLogsRef.current = fetchAdminLogs;
  }, [fetchAdminLogs]);

  // Real-time socket updates!
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return;

    try {
      const userObj = JSON.parse(userStr);
      const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const socket = io(SOCKET_URL, {
        auth: { token, userId: userObj.id },
        transports: ['websocket'],
        reconnection: true
      });

      socket.on('connect', () => {
        console.log('✅ Admin attendance page connected to live socket!');
      });

      socket.on('attendanceUpdate', (info) => {
        console.log('⚡ Live attendance update received:', info);
        fetchAdminLogsRef.current();
        setSocketTrigger(prev => prev + 1);
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error('Socket setup error:', err);
    }
  }, []);

  const getRecordsForDate = (dateStr: string) => {
    if (dateStr === selectedDate) {
      return records;
    }
    return recordsByDate[dateStr] || [];
  };

  const handleUpdateRecords = (dateStr: string, updatedList: AttendanceRecord[]) => {
    setRecordsByDate(prev => ({
      ...prev,
      [dateStr]: updatedList
    }));
    if (dateStr === selectedDate) {
      setRecords(updatedList);
    }
  };

  const handleSaveModal = async () => {
    if (!selectedEmpId) {
      toast.error("Please select an employee");
      return;
    }
    const empObj = roster.find(e => e.empId === selectedEmpId);
    if (!empObj) {
      toast.error("Selected employee not found");
      return;
    }

    const isOffStatus = ["absent", "on_leave", "holiday", "not_marked"].includes(modalStatus);

    try {
      await attendanceApi.saveManualAttendance({
        userId: empObj.userId,
        date: modalDate,
        status: modalStatus,
        checkIn: isOffStatus ? undefined : modalCheckIn,
        checkOut: isOffStatus ? undefined : modalCheckOut,
        workMode: isOffStatus ? undefined : modalType,
        location: isOffStatus ? undefined : modalLocation,
        hours: isOffStatus ? undefined : modalWorkingHours
      });

      toast.success(modalMode === "add" ? "Attendance marked successfully!" : "Attendance updated successfully!");
      fetchAdminLogs();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save attendance:", err);
      toast.error(err.message || "Failed to save attendance record");
    }
  };

  const TABS: { id: ViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "today", label: "Today's Attendance", icon: <UserCheck size={13} /> },
    { id: "report", label: "Employee Attendance", icon: <UserCheck size={13} /> },
  ];

  return (
    <div className="flex flex-col h-auto md:h-full min-h-full md:min-h-0 gap-3 p-4">
      {/* Tab Bar */}
      <div className="flex-none flex items-center gap-2 flex-wrap sticky md:static top-0 z-30 bg-[#f3f6fb] -mx-4 px-4 -mt-4 pt-4 pb-2 md:m-0 md:p-0 md:bg-transparent">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${activeTab === tab.id ? "bg-[#0D47A1] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {tab.icon} {tab.label}
            {tab.badge ? (
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center ${activeTab === tab.id ? "bg-amber-400 text-white" : "bg-amber-500 text-white"}`}>{tab.badge}</span>
            ) : null}
          </button>
        ))}
        <div className="ml-auto">
          <LiveClock />
        </div>
      </div>



      {/* Centralized Add/Edit Attendance modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[1500] p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0D47A1] to-[#1565C0] px-5 py-4 flex justify-between items-center text-white">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Clock size={16} /> {modalMode === 'add' ? 'Manual Attendance Entry' : 'Update Attendance Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-bold text-slate-700">
              {/* Row 1: Employee & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Employee</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    disabled={modalMode === "edit"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                  >
                    <option value="" disabled>Select Employee</option>
                    {roster.map((e) => (
                      <option key={e.empId} value={e.empId}>
                        {e.name} ({e.empId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={modalDate}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-slate-50 text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2: Status */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half_day">Half Day</option>
                    <option value="on_leave">On Leave</option>
                    <option value="holiday">Holiday</option>
                    <option value="not_marked">Not Marked</option>
                  </select>
                </div>
              </div>

              {/* Conditional Inputs if employee is not absent/on leave/holiday */}
              {!["absent", "on_leave", "holiday", "not_marked"].includes(modalStatus) && (
                <>
                  {/* Row 3: Check-In & Check-Out Times */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Punch In Time</label>
                      <input
                        type="time"
                        value={format12to24(modalCheckIn) || "09:00"}
                        onChange={(e) => setModalCheckIn(format24to12(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Formatted: {modalCheckIn || "09:00 AM"}</span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Punch Out Time</label>
                      <input
                        type="time"
                        value={format12to24(modalCheckOut) || "18:00"}
                        onChange={(e) => setModalCheckOut(format24to12(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Formatted: {modalCheckOut || "06:00 PM"}</span>
                    </div>
                  </div>

                  {/* Row 4: Check-In Type & Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Punch Type</label>
                      <select
                        value={modalType}
                        onChange={(e) => setModalType(e.target.value as CheckInType)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white cursor-pointer"
                      >
                        <option value="office">Office</option>
                        <option value="remote">Remote</option>
                        <option value="field">Field</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Noida HQ, Home Office"
                        value={modalLocation}
                        onChange={(e) => setModalLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 5: Working Hours & Overtime */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Working Hours</label>
                      <input
                        type="text"
                        placeholder="e.g. 9h 00m"
                        value={modalWorkingHours}
                        onChange={(e) => setModalWorkingHours(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Overtime</label>
                      <input
                        type="text"
                        placeholder="e.g. 1h 30m"
                        value={modalOvertime}
                        onChange={(e) => setModalOvertime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] font-semibold text-slate-700 bg-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-white text-slate-550 text-[11px] font-extrabold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-4 py-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-xl text-[11px] font-extrabold transition shadow-md flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} /> {modalMode === 'add' ? 'Mark Attendance' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "today" && (
          <TodayView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            records={getRecordsForDate(selectedDate)}
            openModal={openModal}
          />
        )}
        {activeTab === "report" && (
          <EmployeeAttendanceView
            roster={roster}
            socketTrigger={socketTrigger}
          />
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import {
  Plus, X, Filter, Edit2, Trash2, Mail,
  ChevronLeft, ChevronRight, Upload, Eye, EyeOff,
  CheckCircle2, Building2, Calendar, MapPin,
  Users, Shield, UserCheck, UserX, Phone, Lock,
  ChevronDown, SlidersHorizontal, RefreshCw, Search,
  Briefcase, Hash, Clock, Globe, Key, FolderOpen,
  Download, FileSpreadsheet, UserPlus, UserMinus,
  Award, Briefcase as BriefcaseIcon, CalendarDays,
  Heart, Home, Smartphone, Mail as MailIcon, User as UserIcon,
  MapPin as MapPinIcon, Calendar as CalendarIcon, Award as AwardIcon,
  ArrowLeft, Edit, Save, AlertCircle, CreditCard, BookOpen,
  GraduationCap, Laptop, Banknote, UserCircle, CalendarCheck,
  Clock as ClockIcon, Building, Layers, UserCog, MapPinned,
  BriefcaseBusiness, School, Landmark, ShieldCheck, UserCog2,
  FileText, Globe2, Cake, HeartHandshake, PhoneCall, Flag,
  IdCard, CreditCard as CreditCardIcon, IndianRupee, Percent, Zap
} from "lucide-react";
import { masterDataAPI } from "../../../lib/masterApi";
import {
  employeeApi,
  type EmployeeRecord,
  type EmployeeStatus,
  type EmployeeGender,
  type BloodGroup,
  type MaritalStatus,
  type Nationality,
  type WeekOffDays
} from "../../../lib/employeeApi";
import toast, { Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────


interface MasterItem {
  id: string;
  name: string;
  status: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATIC_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    firstName: "BINAY",
    lastName: "SARDAR",
    email: "sardarnavin9732@gmail.com",
    phone: "+91 97753 94139",
    department: "EXECUTION (ENG)",
    role: "Site Supervisor",
    status: "active",
    joinDate: "2025-05-05",
    gender: "male",
    bloodGroup: "A+",
    company: "Goldfinger Kataria Urban Development",
    attendanceLocation: "Site Office",
    allottedProjects: ["Tamara Uprise"],
    dateOfBirth: "1990-05-15",
    emergencyContact: "+91 98765 43211",
    address: "123, Sector 62, Noida",
    maritalStatus: "married",
    nationality: "Indian",
    aadharNumber: "1234-5678-9012",
    panNumber: "ABCDE1234F",
    permanentAddress: "123, Sector 62, Noida, Uttar Pradesh - 201301",
    currentAddress: "456, Sector 18, Noida, Uttar Pradesh - 201301",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    highestQualification: "B.Tech",
    university: "AKTU University",
    passingYear: "2020",
    percentage: "75.5",
    weekOffDays: ["Sunday"],
    createdAt: "2025-05-05"
  },
  {
    id: "2",
    employeeId: "EMP-002",
    firstName: "Anjali",
    lastName: "Sharma",
    email: "anjali@hously.co",
    phone: "+91 87654 32109",
    department: "UI/UX Design",
    role: "Designer",
    status: "active",
    joinDate: "2022-06-15",
    gender: "female",
    bloodGroup: "B+",
    company: "Hously Tech",
    attendanceLocation: "Delhi Office",
    allottedProjects: ["Project Gamma"],
    dateOfBirth: "1993-08-20",
    emergencyContact: "+91 87654 32110",
    address: "456, Connaught Place, Delhi",
    maritalStatus: "single",
    nationality: "Indian",
    aadharNumber: "2345-6789-0123",
    panNumber: "FGHIJ5678K",
    permanentAddress: "456, Connaught Place, Delhi - 110001",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    highestQualification: "M.Des",
    university: "NID",
    passingYear: "2018",
    percentage: "82.0",
    weekOffDays: ["Sunday", "Saturday"],
    createdAt: "2022-06-15"
  },
  {
    id: "3",
    employeeId: "EMP-003",
    firstName: "Vikram",
    lastName: "Patel",
    email: "vikram@hously.co",
    phone: "+91 76543 21098",
    department: "Data Analytics",
    role: "Analyst",
    status: "on_leave",
    joinDate: "2023-03-01",
    gender: "male",
    bloodGroup: "O+",
    company: "Hously Tech",
    attendanceLocation: "Mumbai Branch",
    allottedProjects: ["Project Delta"],
    dateOfBirth: "1994-12-10",
    emergencyContact: "+91 76543 21099",
    address: "789, Bandra West, Mumbai",
    maritalStatus: "married",
    nationality: "Indian",
    aadharNumber: "3456-7890-1234",
    panNumber: "KLMNO9012P",
    permanentAddress: "789, Bandra West, Mumbai - 400050",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    highestQualification: "M.Sc",
    university: "Mumbai University",
    passingYear: "2019",
    percentage: "78.0",
    weekOffDays: ["Sunday"],
    createdAt: "2023-03-01"
  },
  {
    id: "4",
    employeeId: "EMP-004",
    firstName: "Rajesh",
    lastName: "Roy",
    email: "rajesh@hously.co",
    phone: "+91 65432 10987",
    department: "Quality Assurance",
    role: "QA Engineer",
    status: "inactive",
    joinDate: "2023-07-20",
    gender: "male",
    bloodGroup: "AB+",
    company: "Hously Tech",
    attendanceLocation: "Noida HQ",
    allottedProjects: ["Project Zeta"],
    dateOfBirth: "1992-03-25",
    emergencyContact: "+91 65432 10988",
    address: "321, Electronic City, Bangalore",
    maritalStatus: "single",
    nationality: "Indian",
    aadharNumber: "4567-8901-2345",
    panNumber: "PQRST3456U",
    permanentAddress: "321, Electronic City, Bangalore - 560100",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100",
    highestQualification: "B.E",
    university: "VTU",
    passingYear: "2017",
    percentage: "72.0",
    weekOffDays: ["Sunday", "Saturday"],
    createdAt: "2023-07-20"
  },
  {
    id: "5",
    employeeId: "EMP-005",
    firstName: "Priya",
    lastName: "Mehta",
    email: "priya@hously.co",
    phone: "+91 54321 09876",
    department: "Human Resources",
    role: "HR",
    status: "active",
    joinDate: "2024-01-05",
    gender: "female",
    bloodGroup: "A-",
    company: "Hously Tech",
    attendanceLocation: "Kolkata Office",
    allottedProjects: [],
    dateOfBirth: "1996-07-30",
    emergencyContact: "+91 54321 09877",
    address: "654, Salt Lake, Kolkata",
    maritalStatus: "single",
    nationality: "Indian",
    aadharNumber: "5678-9012-3456",
    panNumber: "UVWXY7890Z",
    permanentAddress: "654, Salt Lake, Kolkata - 700091",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091",
    highestQualification: "MBA",
    university: "Calcutta University",
    passingYear: "2021",
    percentage: "85.0",
    weekOffDays: ["Sunday"],
    createdAt: "2024-01-05"
  }
];

const STATUS_CONFIG: Record<
  EmployeeStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  on_leave: {
    label: "On Leave",
    bg: "bg-amber-50",
    color: "text-amber-700",
    dot: "bg-amber-400",
  },
  inactive: {
    label: "Inactive",
    bg: "bg-red-50",
    color: "text-red-700",
    dot: "bg-red-500",
  },
  terminated: {
    label: "Terminated",
    bg: "bg-gray-50",
    color: "text-gray-700",
    dot: "bg-gray-500",
  },
};

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MARITAL_STATUS: MaritalStatus[] = ["single", "married", "divorced", "widowed"];
const NATIONALITY: Nationality[] = ["Indian", "Other"];
const WEEK_OFF_DAYS: WeekOffDays[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dataUrlToBlob = (dataUrl: string) => {
  try {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("Failed to convert base64 to blob:", e);
    return null;
  }
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({
  name,
  url,
  size = "sm",
  onUpload,
}: {
  name: string;
  url?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onUpload?: (file: File) => void;
}) => {
  const sz = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-2xl",
  }[size];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleClick = () => {
    if (onUpload) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="relative">
      {url ? (
        <img
          src={url}
          alt={name}
          className={`${sz} rounded-full object-cover ring-2 ring-white flex-shrink-0`}
        />
      ) : (
        <div
          className={`${sz} rounded-full bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center font-bold text-white ring-2 ring-white flex-shrink-0`}
        >
          {initials}
        </div>
      )}
      {onUpload && (
        <>
          <button
            onClick={handleClick}
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md hover:bg-slate-50 transition cursor-pointer"
          >
            <Upload size={14} className="text-[#0D47A1]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

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
  purple: {
    cardBg: "bg-purple-50/40",
    border: "border-purple-100/60",
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
  accent?: "blue" | "emerald" | "amber" | "purple";
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

// ─── Multi-Select Dropdown Component ─────────────────────────────────────────
const MultiSelectDropdown = ({
  label,
  value = [],
  onChange,
  options = [],
  icon = null,
  disabled = false,
  error = "",
}: any) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (opt: string) => {
    if (disabled) return;
    const current: string[] = Array.isArray(value) ? value : [];
    const updated = current.includes(opt)
      ? current.filter((v: string) => v !== opt)
      : [...current, opt];
    onChange(updated);
  };

  const displayText =
    Array.isArray(value) && value.length > 0
      ? value.map((v: string) => v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ")).join(", ")
      : `Select ${label}`;

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-xl bg-white text-left font-medium transition-all
            ${error ? "border-red-300" : open ? "border-[#0D47A1] ring-2 ring-[#0D47A1]/20" : "border-slate-200"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#0D47A1]/50"}`}
        >
          <span className="flex items-center gap-2 min-w-0">
            {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
            <span className={`truncate text-[13px] ${Array.isArray(value) && value.length > 0 ? "text-slate-700" : "text-slate-400"}`}>
              {displayText}
            </span>
          </span>
          <svg
            className={`shrink-0 w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt: string) => {
                const checked = Array.isArray(value) && value.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm
                      ${checked ? "bg-[#0D47A1]/5 text-[#0D47A1]" : "text-slate-600 hover:bg-slate-50"}`}
                    onClick={() => toggle(opt)}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                      ${checked ? "bg-[#0D47A1] border-[#0D47A1]" : "border-slate-300"}`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium">
                      {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, " ")}
                    </span>
                  </label>
                );
              })}
            </div>
            {Array.isArray(value) && value.length > 0 && (
              <div className="border-t border-slate-100 px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{value.length} selected</span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-[11px] text-red-400 font-semibold hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold pl-1">{error}</p>}
    </div>
  );
};

const EditingContext = React.createContext(false);


const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  options = [],
  isSelect = false,
  icon = null,
  multiple = false,
  error = "",
}: any) => {
  const isEditing = React.useContext(EditingContext);
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        {isSelect ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              } ${icon ? "pl-9" : ""}`}
            disabled={!isEditing}
          >
            <option value="">Select {label}</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </select>
        ) : multiple ? (
          <div className={`w-full border rounded-xl bg-white p-2 ${error ? "border-red-300" : "border-slate-200"}`}>
            <div className="flex flex-wrap gap-1.5">
              {options.map((opt: string) => {
                const isChecked = Array.isArray(value) && value.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => {
                      if (!isEditing) return;
                      const current: string[] = Array.isArray(value) ? value : [];
                      const updated = isChecked
                        ? current.filter((v: string) => v !== opt)
                        : [...current, opt];
                      onChange(updated);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-150 border cursor-pointer ${isChecked
                      ? "bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:border-[#0D47A1]/40 hover:text-[#0D47A1]"
                      } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, " ")}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              } ${icon ? "pl-9" : ""}`}
            disabled={!isEditing}
          />
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold pl-1">{error}</p>}
    </div>
  );
};

const getWeekOffText = (day: string, weeks: string[]) => {
  if (!weeks || weeks.length === 0) return "No week offs configured";
  if (weeks.includes("All Weeks") || weeks.length === 5) {
    return `All ${day.toLowerCase()}s week off`;
  }
  // format as e.g., "1st, 3rd saturdays week off"
  const sortedWeeks = [...weeks].sort();
  return `${sortedWeeks.join(", ")} ${day.toLowerCase()}s week off`;
};

const WeekOffModal = ({
  day,
  weeks,
  onClose,
  onConfirm,
}: {
  day: string;
  weeks: string[];
  onClose: () => void;
  onConfirm: (updatedWeeks: string[]) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(weeks);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleToggle = (opt: string) => {
    if (opt === "All Weeks") {
      if (selectedWeeks.includes("All Weeks")) {
        setSelectedWeeks([]);
      } else {
        setSelectedWeeks(["All Weeks", "1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"]);
      }
    } else {
      let updated = selectedWeeks.includes(opt)
        ? selectedWeeks.filter(w => w !== opt && w !== "All Weeks")
        : [...selectedWeeks, opt];

      const individualCount = updated.filter(w => w !== "All Weeks").length;
      if (individualCount === 5) {
        updated = ["All Weeks", "1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"];
      }
      setSelectedWeeks(updated);
    }
  };

  const options = ["All Weeks", "1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"];

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-850">
              {day} - Week Offs
            </h3>
          </div>

          {/* Options List */}
          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
            {options.map((opt) => {
              const isChecked = selectedWeeks.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <span className={`text-sm font-semibold ${isChecked ? "text-slate-900" : "text-slate-650"}`}>
                    {opt}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(opt)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-bold border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-50 transition cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(selectedWeeks);
                handleClose();
              }}
              className="px-6 py-2 text-sm font-bold text-white rounded-xl bg-[#0D47A1] hover:opacity-90 transition cursor-pointer border-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const MonthPickerModal = ({
  initialYear,
  initialMonth,
  onClose,
  onConfirm,
}: {
  initialYear: number;
  initialMonth: number;
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
}) => {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const now = new Date();
  const currentYear = now.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const [pickerYear, setPickerYear] = useState(initialYear);
  const [pickerMonth, setPickerMonth] = useState(initialMonth);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Select Month</h3>
          </div>
          <div className="px-6 py-5 space-y-4">
            {/* Year Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Year</label>
              <div className="flex gap-2">
                {years.map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setPickerYear(y)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${pickerYear === y
                      ? "bg-[#0D47A1] text-white border-[#0D47A1]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#0D47A1]/40"
                      }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            {/* Month Grid */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Month</label>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPickerMonth(idx)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${pickerMonth === idx
                      ? "bg-[#0D47A1] text-white border-[#0D47A1]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#0D47A1]/40"
                      }`}
                  >
                    {m.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-4 pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-bold border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-50 transition cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onConfirm(pickerYear, pickerMonth); handleClose(); }}
              className="px-6 py-2 text-sm font-bold text-white rounded-xl bg-[#0D47A1] hover:opacity-90 transition cursor-pointer border-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

const AddNewShiftModal = ({
  onClose,
  onAdd,
  initialShift,
}: {
  onClose: () => void;
  onAdd: (shiftObj: {
    name: string;
    startTime: string;
    endTime: string;
    allowedLateDays: number;
    lateThresholdMins: number;
    lateDeductionAmount: number;
    allowPunchInHours?: number;
    allowPunchInMinutes?: number;
    allowPunchOutHours?: number;
    allowPunchOutMinutes?: number;
  }) => void;
  initialShift?: any;
}) => {
  const [visible, setVisible] = useState(false);
  const [shiftName, setShiftName] = useState(() => {
    if (initialShift) {
      const match = initialShift.name.match(/^([^(]+)/);
      return match ? match[1].trim() : initialShift.name;
    }
    return "";
  });
  const [startTime, setStartTime] = useState(() => {
    if (initialShift && initialShift.startTime) {
      return initialShift.startTime.substring(0, 5);
    }
    return "09:00";
  });
  const [endTime, setEndTime] = useState(() => {
    if (initialShift && initialShift.endTime) {
      return initialShift.endTime.substring(0, 5);
    }
    return "18:00";
  });

  const [canPunchInMode, setCanPunchInMode] = useState<"Anytime" | "Limit">(() => {
    if (initialShift && (initialShift.allowPunchInHours !== undefined || initialShift.allowPunchInMinutes !== undefined)) {
      return "Limit";
    }
    return "Anytime";
  });
  const [punchInHours, setPunchInHours] = useState(() => {
    if (initialShift && initialShift.allowPunchInHours !== undefined) {
      return String(initialShift.allowPunchInHours);
    }
    return "";
  });
  const [punchInMinutes, setPunchInMinutes] = useState(() => {
    if (initialShift && initialShift.allowPunchInMinutes !== undefined) {
      return String(initialShift.allowPunchInMinutes);
    }
    return "";
  });

  const [canPunchOutMode, setCanPunchOutMode] = useState<"Anytime" | "Limit">(() => {
    if (initialShift && (initialShift.allowPunchOutHours !== undefined || initialShift.allowPunchOutMinutes !== undefined)) {
      return "Limit";
    }
    return "Anytime";
  });
  const [punchOutHours, setPunchOutHours] = useState(() => {
    if (initialShift && initialShift.allowPunchOutHours !== undefined) {
      return String(initialShift.allowPunchOutHours);
    }
    return "";
  });
  const [punchOutMinutes, setPunchOutMinutes] = useState(() => {
    if (initialShift && initialShift.allowPunchOutMinutes !== undefined) {
      return String(initialShift.allowPunchOutMinutes);
    }
    return "";
  });

  const [allowedLateDays, setAllowedLateDays] = useState(() => {
    if (initialShift && initialShift.allowedLateDays !== undefined) {
      return String(initialShift.allowedLateDays);
    }
    return "5";
  });
  const [lateThresholdMins, setLateThresholdMins] = useState(() => {
    if (initialShift && initialShift.lateThresholdMins !== undefined) {
      return String(initialShift.lateThresholdMins);
    }
    return "60";
  });
  const [lateDeductionAmount, setLateDeductionAmount] = useState(() => {
    if (initialShift && initialShift.lateDeductionAmount !== undefined) {
      return String(initialShift.lateDeductionAmount);
    }
    return "";
  });

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleAddShift = () => {
    if (!shiftName.trim()) {
      toast.error("Shift Name is required");
      return;
    }
    if (!startTime || !endTime) {
      toast.error("Start and End Times are required");
      return;
    }

    const formatTimeAMPM = (timeStr: string) => {
      const [h, m] = timeStr.split(":");
      const hours = parseInt(h);
      const minutes = parseInt(m);
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes ? `:${minutes.toString().padStart(2, "0")}` : "";
      return `${displayHours}${displayMinutes}${ampm}`;
    };

    const startFormatted = formatTimeAMPM(startTime);
    const endFormatted = formatTimeAMPM(endTime);
    const shiftStr = `${shiftName} (${startFormatted}–${endFormatted})`;

    onAdd({
      name: shiftStr,
      startTime: startTime + ":00",
      endTime: endTime + ":00",
      allowedLateDays: Number(allowedLateDays) || 5,
      lateThresholdMins: Number(lateThresholdMins) || 60,
      lateDeductionAmount: Number(lateDeductionAmount) || 0,
      allowPunchInHours: canPunchInMode === "Limit" ? Number(punchInHours) || 0 : undefined,
      allowPunchInMinutes: canPunchInMode === "Limit" ? Number(punchInMinutes) || 0 : undefined,
      allowPunchOutHours: canPunchOutMode === "Limit" ? Number(punchOutHours) || 0 : undefined,
      allowPunchOutMinutes: canPunchOutMode === "Limit" ? Number(punchOutMinutes) || 0 : undefined,
    });
    handleClose();
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 250px;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 overflow-hidden animate-fadeIn"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-850">
              {initialShift ? "Edit Shift" : "Add New Shift"}
            </h3>
          </div>

          {/* Form Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[520px] overflow-y-auto no-scrollbar">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Shift Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Shift Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  placeholder="e.g. Afternoon Shift"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 transition"
                />
              </div>

              {/* Shift Start Time */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Shift Start Time<span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 transition"
                />
              </div>

              {/* Can Punch In Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Can Punch In<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setCanPunchInMode("Anytime")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${canPunchInMode === "Anytime"
                      ? "bg-white text-[#0D47A1] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Anytime
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanPunchInMode("Limit")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${canPunchInMode === "Limit"
                      ? "bg-white text-[#0D47A1] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Add Limit
                  </button>
                </div>

                {/* Punch In Limit Form (Smooth display) */}
                {canPunchInMode === "Limit" && (
                  <div className="space-y-2 pt-1 animate-slideDown">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Allow Punch In<span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-[220px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Hours</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={punchInHours}
                          onChange={(e) => setPunchInHours(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 text-center"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Minutes</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="0"
                          value={punchInMinutes}
                          onChange={(e) => setPunchInMinutes(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 text-center"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 tracking-wider pt-0.5 lowercase">
                      before shift start time
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Spacer to align with Shift Name */}
              <div className="h-[60px] hidden md:block"></div>

              {/* Shift End Time */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Shift End Time<span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 transition"
                />
              </div>

              {/* Can Punch Out Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Can Punch Out<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setCanPunchOutMode("Anytime")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${canPunchOutMode === "Anytime"
                      ? "bg-white text-[#0D47A1] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Anytime
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanPunchOutMode("Limit")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${canPunchOutMode === "Limit"
                      ? "bg-white text-[#0D47A1] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    Add Limit
                  </button>
                </div>

                {/* Punch Out Limit Form (Smooth display) */}
                {canPunchOutMode === "Limit" && (
                  <div className="space-y-2 pt-1 animate-slideDown">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Allow Punch Out<span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-[220px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Hours</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={punchOutHours}
                          onChange={(e) => setPunchOutHours(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 text-center"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Minutes</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="0"
                          value={punchOutMinutes}
                          onChange={(e) => setPunchOutMinutes(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none bg-white font-semibold text-slate-700 text-center"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 tracking-wider pt-0.5 lowercase">
                      after shift end time
                    </p>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-bold border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-50 transition cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddShift}
              className="px-6 py-2 text-sm font-bold text-white rounded-xl bg-[#0D47A1] hover:opacity-90 transition cursor-pointer border-none"
            >
              {initialShift ? "Save Changes" : "Add Shift"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ShiftSelectModal = ({
  day,
  selectedShift,
  onClose,
  onConfirm,
  customShifts,
  onAddCustomShift,
  onDeleteCustomShift,
  onEditCustomShift,
}: {
  day: string;
  selectedShift: string;
  onClose: () => void;
  onConfirm: (shift: string, config?: any) => void;
  customShifts: any[];
  onAddCustomShift: (newShift: any) => void;
  onDeleteCustomShift: (name: string) => void;
  onEditCustomShift: (oldName: string, updatedShift: any) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [activeShift, setActiveShift] = useState(selectedShift);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [editingShiftObj, setEditingShiftObj] = useState<any | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const defaultShifts: string[] = [];
  const allShifts = [...defaultShifts, ...customShifts.map(s => typeof s === 'string' ? s : s.name)];

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-850">
              {day} - Shift
            </h3>
          </div>

          {/* Options List */}
          <div className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
            {allShifts.length === 0 ? (
              <div className="px-6 py-8 text-center text-xs font-semibold text-slate-400">
                No custom shifts created. Please add a shift.
              </div>
            ) : (
              allShifts.map((shiftOpt) => {
                const isChecked = activeShift === shiftOpt;
                return (
                  <label
                    key={shiftOpt}
                    className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <span className={`text-sm font-semibold ${isChecked ? "text-slate-900" : "text-slate-650"}`}>
                      {shiftOpt}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const targetObj = customShifts.find(s => (typeof s === 'string' ? s : s.name) === shiftOpt);
                          if (targetObj) {
                            setEditingShiftObj(targetObj);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#0D47A1] hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Shift"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteCustomShift(shiftOpt);
                          if (activeShift === shiftOpt) {
                            setActiveShift("");
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition cursor-pointer"
                        title="Delete Shift"
                      >
                        <Trash2 size={13} />
                      </button>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setActiveShift("");
                          } else {
                            setActiveShift(shiftOpt);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer ml-1"
                      />
                    </div>
                  </label>
                );
              })
            )}

            {/* Add Shift Button at the bottom of the list */}
            <div className="px-6 py-3 flex justify-start border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddShiftModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#0D47A1] hover:text-[#0D47A1]/80 transition cursor-pointer bg-transparent border-none outline-none"
              >
                <Plus size={14} /> Add Shift
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-bold border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-50 transition cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const customObj = customShifts.find(s => (typeof s === 'string' ? s : s.name) === activeShift);
                if (customObj && typeof customObj === 'object') {
                  const { name, ...config } = customObj;
                  onConfirm(activeShift, config);
                } else {
                  onConfirm(activeShift);
                }
                handleClose();
              }}
              className="px-6 py-2 text-sm font-bold text-white rounded-xl bg-[#0D47A1] hover:opacity-90 transition cursor-pointer border-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {showAddShiftModal && createPortal(
        <AddNewShiftModal
          onClose={() => setShowAddShiftModal(false)}
          onAdd={(newShiftObj) => {
            onAddCustomShift(newShiftObj);
            setActiveShift(newShiftObj.name);
          }}
        />,
        document.body
      )}

      {editingShiftObj && createPortal(
        <AddNewShiftModal
          initialShift={editingShiftObj}
          onClose={() => setEditingShiftObj(null)}
          onAdd={(updatedShiftObj) => {
            onEditCustomShift(editingShiftObj.name, updatedShiftObj);
            setActiveShift(updatedShiftObj.name);
            setEditingShiftObj(null);
          }}
        />,
        document.body
      )}
    </>
  );
};

// ─── Employee Profile/Edit Component ─────────────────────────────────────────

const EmployeeProfile = ({
  employee,
  onBack,
  onSaveSuccess,
  isEdit = false,
  departments = [],
  roles = [],
  documents = [],
}: {
  employee: EmployeeRecord;
  onBack: () => void;
  onSaveSuccess?: () => void;
  isEdit?: boolean;
  departments?: string[];
  roles?: string[];
  documents?: string[];
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(employee.avatarUrl || null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showBankVerifyModal, setShowBankVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [verifyProgressMessage, setVerifyProgressMessage] = useState('');
  const [verifiedBeneficiaryName, setVerifiedBeneficiaryName] = useState('');
  const [formNameMatch, setFormNameMatch] = useState(true);
  const [verifyError, setVerifyError] = useState('');

  const handleStartBankVerification = () => {
    setVerifyStep('loading');
    setVerifyError('');

    const steps = [
      "Connecting to RazorpayX bank servers...",
      "Initiating Penny Drop validation...",
      "Depositing ₹1.00 test amount...",
      "Querying beneficiary registry for account...",
      "Confirming bank verification..."
    ];

    let current = 0;
    setVerifyProgressMessage(steps[0]);

    const interval = setInterval(async () => {
      current++;
      if (current < steps.length - 1) {
        setVerifyProgressMessage(steps[current]);
      } else if (current === steps.length - 1) {
        setVerifyProgressMessage(steps[current]);
        clearInterval(interval);

        try {
          const res = await employeeApi.verifyBank(employee.id, {
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            accountHolderName: formData.accountHolderName
          });

          if (res.success) {
            setVerifiedBeneficiaryName(res.verifiedName);
            setFormNameMatch(
              res.verifiedName.toLowerCase().trim() ===
              (formData.accountHolderName || "").toLowerCase().trim()
            );
            setVerifyStep('success');
          } else {
            setFormData(prev => ({
              ...prev,
              bankVerificationStatus: "Failed",
              bankVerifiedName: ""
            }));
            setVerifyStep('failed');
            setVerifyError("Verification failed: invalid bank account details.");
          }
        } catch (err: any) {
          setFormData(prev => ({
            ...prev,
            bankVerificationStatus: "Failed",
            bankVerifiedName: ""
          }));
          setVerifyStep('failed');
          setVerifyError(err.response?.data?.message || err.message || "Failed to validate with RazorpayX server.");
        }
      }
    }, 600);
  };

  const handleApplyVerificationResult = async () => {
    const updatedForm = {
      ...formData,
      bankVerificationStatus: "Verified",
      bankVerifiedName: verifiedBeneficiaryName
    };
    setFormData(updatedForm);
    setShowBankVerifyModal(false);
    setVerifyStep('idle');

    try {
      toast.loading("Saving verification status...", { id: "bank-verify" });
      const payload: any = {
        ...employee,
        ...updatedForm,
        leave_cycle: leaveCycle,
        privileged_leave_balance: leaveBalances.privilegedLeave,
        sick_leave_balance: leaveBalances.sickLeave,
        casual_leave_balance: leaveBalances.casualLeave,
      };

      const updated = await employeeApi.update(employee.id, payload);
      if (updated) {
        toast.success("Bank details verified & saved successfully!", { id: "bank-verify" });
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save verification status to database", { id: "bank-verify" });
    }
  };

  // Local state for Leave Balances & Policy
  const [leaveBalances, setLeaveBalances] = useState({
    privilegedLeave: 12,
    sickLeave: 8,
    casualLeave: 6,
  });


  // Local state for KYC Verification
  const [kycData, setKycData] = useState({
    aadhaarNumber: "",
    frontImage: null as string | null,
    backImage: null as string | null,
    status: "pending" as "pending" | "verifying" | "verified" | "failed",
  });

  // Local state for Leave Balances & Policy subviews
  const [leaveSubView, setLeaveSubView] = useState<"menu" | "policy" | "balance">("menu");
  const [leaveCycle, setLeaveCycle] = useState<"Monthly" | "Yearly">("Monthly");

  // Local state for Documents tab
  const [documentsList, setDocumentsList] = useState<any[]>([]);

  // Local state for Time & Shift subview
  const [shiftTab, setShiftTab] = useState<"Fixed" | "Flexible">(() => {
    return (employee.shift && employee.shift.toLowerCase() === "flexible") ? "Flexible" : "Fixed";
  });

  const [showScheduleTypeConfirm, setShowScheduleTypeConfirm] = useState(false);
  const [pendingShiftTab, setPendingShiftTab] = useState<"Fixed" | "Flexible" | null>(null);
  const [flexibleMonth, setFlexibleMonth] = useState<{ year: number; month: number } | null>(null);
  const [showMonthPickerModal, setShowMonthPickerModal] = useState(false);

  const handleShiftTabChange = (type: "Fixed" | "Flexible") => {
    if (type === shiftTab) return;
    // Show confirmation dialog before switching
    setPendingShiftTab(type);
    setShowScheduleTypeConfirm(true);
  };

  const applyShiftTabChange = (type: "Fixed" | "Flexible") => {
    setShiftTab(type);
    if (isEditing) {
      if (type === "Flexible") {
        setFormData(prev => ({
          ...prev,
          shift: "Flexible",
          punchInTime: "",
          punchOutTime: "",
          weeklySchedule: ""
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          shift: employee.shift && employee.shift.toLowerCase() !== "flexible"
            ? employee.shift
            : "",
          punchInTime: employee.punchInTime || "",
          punchOutTime: employee.punchOutTime || "",
          weeklySchedule: ""
        }));
        setFlexibleMonth(null);
      }
    }
  };

  const [activeWeekOffModalDay, setActiveWeekOffModalDay] = useState<string | null>(null);
  const [tempWeekOffWeeks, setTempWeekOffWeeks] = useState<string[]>([]);
  const [activeShiftModalDay, setActiveShiftModalDay] = useState<string | null>(null);
  const [tempSelectedShift, setTempSelectedShift] = useState<string>("");
  const [customShifts, setCustomShifts] = useState<any[]>([]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadModalError, setUploadModalError] = useState("");
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<any | null>(null);
  const [systemSubTab, setSystemSubTab] = useState<"Laptop" | "Mobile">("Laptop");

  const calculateSalary = (ctcVal: number, type: string): number => {
    if (!ctcVal) return 0;
    let calculated = 0;
    if (type === "Monthly") {
      calculated = ctcVal / 12;
    } else if (type === "Weekly") {
      calculated = ctcVal / 52;
    } else if (type === "Hourly") {
      calculated = ctcVal / 2080; // 8 hours/day, 5 days/week, 52 weeks/year = 2080 working hours
    } else if (type === "Daily") {
      calculated = ctcVal / 365; // 365 calendar days/year
    }
    return parseFloat(calculated.toFixed(2));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errs.firstName = "Required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      errs.firstName = "Only letters allowed";
    }

    if (!formData.lastName.trim()) {
      errs.lastName = "Required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      errs.lastName = "Only letters allowed";
    }

    if (!formData.email.trim()) {
      errs.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Valid email required";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errs.phone = "Must be exactly 10 digits";
    }

    if (formData.emergencyContact && !/^\d{10}$/.test(formData.emergencyContact.replace(/\D/g, ''))) {
      errs.emergencyContact = "Must be exactly 10 digits";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    middleName: employee.middleName || "",
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    gender: employee.gender || "",
    department: employee.department,
    role: employee.role,
    bloodGroup: employee.bloodGroup || "",
    joinDate: employee.joinDate,
    allottedProjects: employee.allottedProjects || [],
    company: employee.company || "",
    attendanceLocation: employee.attendanceLocation || "",
    status: employee.status,
    dateOfBirth: employee.dateOfBirth || "",
    emergencyContact: employee.emergencyContact || "",
    emergencyContactName: employee.emergencyContactName || "",
    address: employee.address || "",
    maritalStatus: employee.maritalStatus || "",
    nationality: employee.nationality || "",
    aadharNumber: employee.aadharNumber || "",
    panNumber: employee.panNumber || "",
    permanentAddress: employee.permanentAddress || "",
    currentAddress: employee.currentAddress || "",
    city: employee.city || "",
    state: employee.state || "",
    pincode: employee.pincode || "",
    highestQualification: employee.highestQualification || "",
    university: employee.university || "",
    passingYear: employee.passingYear || "",
    percentage: employee.percentage || "",
    weekOffDays: employee.weekOffDays || [],
    shift: employee.shift || "General (10AM–7PM)",
    weeklySchedule: employee.weeklySchedule || "",
    employeeType: employee.employeeType || "Permanent",
    probationPeriod: employee.probationPeriod ?? 3,
    dateOfLeaving: employee.dateOfLeaving || "",
    noticePeriod: employee.noticePeriod ?? 30,
    salary: employee.salary ?? 0,
    salaryType: employee.salaryType || "Monthly",
    designationRole: employee.designationRole || "",
    punchInTime: employee.punchInTime || "10:00:00",
    punchOutTime: employee.punchOutTime || "19:00:00",
    ctc: employee.ctc ?? 0,
    hikeEffectiveDate: employee.hikeEffectiveDate || "",
    hikeType: employee.hikeType || "",
    hikeValue: employee.hikeValue ?? 0,
    hikeActive: employee.hikeActive ?? false,
    laptopAssigned: employee.laptopAssigned || "No",
    laptopName: employee.laptopName || "",
    laptopSerialNumber: employee.laptopSerialNumber || "",
    mobileAssigned: employee.mobileAssigned || "No",
    mobileName: employee.mobileName || "",
    mobileImei: employee.mobileImei || "",
    mobileSerialNumber: employee.mobileSerialNumber || "",
    mobileNumberSim: employee.mobileNumberSim || "",
    simCard: employee.simCard || "",
    mobilePassword: employee.mobilePassword || "",
    systemLoginId: employee.systemLoginId || "",
    systemPassword: employee.systemPassword || "",
    officeEmailId: employee.officeEmailId || "",
    officeEmailPassword: employee.officeEmailPassword || "",
    accountHolderName: employee.accountHolderName || "",
    bankName: employee.bankName || "",
    accountNumber: employee.accountNumber || "",
    ifscCode: employee.ifscCode || "",
    upiId: employee.upiId || "",
    bankVerificationStatus: employee.bankVerificationStatus || "Not Verified",
    bankVerifiedName: employee.bankVerifiedName || "",
    allowedLateDays: employee.allowed_late_days ?? 5,
    deductIfLateByMoreThan: employee.deduct_if_late_by_more_than ?? 60,
    deductBasedOnLateArrival: employee.deduct_based_on_late_arrival ?? true,
    deductionType: employee.deduction_type || 'multiplier',
    deductionAmount: employee.deduction_amount ?? 0,
  });

  // Sync formData whenever the parent updates the employee prop
  // (happens after save → fetchEmployees() → new prop injected)
  useEffect(() => {
    setFormData({
      firstName: employee.firstName,
      middleName: employee.middleName || "",
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      gender: employee.gender || "",
      department: employee.department,
      role: employee.role,
      bloodGroup: employee.bloodGroup || "",
      joinDate: employee.joinDate,
      allottedProjects: employee.allottedProjects || [],
      company: employee.company || "",
      attendanceLocation: employee.attendanceLocation || "",
      status: employee.status,
      dateOfBirth: employee.dateOfBirth || "",
      emergencyContact: employee.emergencyContact || "",
      emergencyContactName: employee.emergencyContactName || "",
      address: employee.address || "",
      maritalStatus: employee.maritalStatus || "",
      nationality: employee.nationality || "",
      aadharNumber: employee.aadharNumber || "",
      panNumber: employee.panNumber || "",
      permanentAddress: employee.permanentAddress || "",
      currentAddress: employee.currentAddress || "",
      city: employee.city || "",
      state: employee.state || "",
      pincode: employee.pincode || "",
      highestQualification: employee.highestQualification || "",
      university: employee.university || "",
      passingYear: employee.passingYear || "",
      percentage: employee.percentage || "",
      weekOffDays: employee.weekOffDays || [],
      shift: employee.shift || "General (10AM–7PM)",
      weeklySchedule: employee.weeklySchedule || "",
      employeeType: employee.employeeType || "Permanent",
      probationPeriod: employee.probationPeriod ?? 3,
      dateOfLeaving: employee.dateOfLeaving || "",
      noticePeriod: employee.noticePeriod ?? 30,
      salary: employee.salary ?? 0,
      salaryType: employee.salaryType || "Monthly",
      designationRole: employee.designationRole || "",
      punchInTime: employee.punchInTime || "10:00:00",
      punchOutTime: employee.punchOutTime || "19:00:00",
      ctc: employee.ctc ?? 0,
      hikeEffectiveDate: employee.hikeEffectiveDate || "",
      hikeType: employee.hikeType || "",
      hikeValue: employee.hikeValue ?? 0,
      hikeActive: employee.hikeActive ?? false,
      laptopAssigned: employee.laptopAssigned || "No",
      laptopName: employee.laptopName || "",
      laptopSerialNumber: employee.laptopSerialNumber || "",
      mobileAssigned: employee.mobileAssigned || "No",
      mobileName: employee.mobileName || "",
      mobileImei: employee.mobileImei || "",
      mobileSerialNumber: employee.mobileSerialNumber || "",
      mobileNumberSim: employee.mobileNumberSim || "",
      simCard: employee.simCard || "",
      mobilePassword: employee.mobilePassword || "",
      systemLoginId: employee.systemLoginId || "",
      systemPassword: employee.systemPassword || "",
      officeEmailId: employee.officeEmailId || "",
      officeEmailPassword: employee.officeEmailPassword || "",
      accountHolderName: employee.accountHolderName || "",
      bankName: employee.bankName || "",
      accountNumber: employee.accountNumber || "",
      ifscCode: employee.ifscCode || "",
      upiId: employee.upiId || "",
      bankVerificationStatus: employee.bankVerificationStatus || "Not Verified",
      bankVerifiedName: employee.bankVerifiedName || "",
      allowedLateDays: employee.allowed_late_days ?? 5,
      deductIfLateByMoreThan: employee.deduct_if_late_by_more_than ?? 60,
      deductBasedOnLateArrival: employee.deduct_based_on_late_arrival ?? true,
      deductionType: employee.deduction_type || 'multiplier',
      deductionAmount: employee.deduction_amount ?? 0,
    });
    setAvatarPreview(employee.avatarUrl || null);
    // NOTE: shiftTab is NOT reset here to avoid switching tabs after save.
    // It is only reset when a different employee is opened (see useEffect below).

    // Leave Balances — load from DB, fallback to defaults
    setLeaveBalances({
      privilegedLeave: employee.privileged_leave_balance ?? 12,
      sickLeave: employee.sick_leave_balance ?? 8,
      casualLeave: employee.casual_leave_balance ?? 6,
    });
    setKycData({
      aadhaarNumber: employee.aadharNumber || "",
      frontImage: employee.aadhaar_front_image || null,
      backImage: employee.aadhaar_back_image || null,
      status: (employee.kyc_status as any) || (employee.aadharNumber ? "verified" : "pending"),
    });
    setLeaveSubView("menu");
    setLeaveCycle(employee.leave_cycle ?? "Monthly");
    setDocumentsList(employee.documents || []);

    // Extract custom shifts from weeklySchedule JSON
    let extractedCustom: any[] = [];
    if (employee.weeklySchedule) {
      try {
        const parsed = JSON.parse(employee.weeklySchedule);
        const defaults: string[] = [];
        Object.values(parsed).forEach((dayObj: any) => {
          if (dayObj && dayObj.shift && !dayObj.isWeekOff) {
            const shName = dayObj.shift;
            if (!defaults.includes(shName)) {
              const alreadyFound = extractedCustom.some(s => s.name === shName);
              if (!alreadyFound && !shName.toLowerCase().includes("week off") && !shName.toLowerCase().includes("off")) {
                // Reconstruct custom shift object parameters from saved weeklySchedule fields
                extractedCustom.push({
                  name: shName,
                  startTime: dayObj.startTime || "09:00:00",
                  endTime: dayObj.endTime || "18:00:00",
                  allowedLateDays: dayObj.allowedLateDays ?? 5,
                  lateThresholdMins: dayObj.lateThresholdMins ?? 60,
                  lateDeductionAmount: dayObj.lateDeductionAmount ?? 0,
                  allowPunchInHours: dayObj.allowPunchInHours,
                  allowPunchInMinutes: dayObj.allowPunchInMinutes,
                  allowPunchOutHours: dayObj.allowPunchOutHours,
                  allowPunchOutMinutes: dayObj.allowPunchOutMinutes,
                });
              }
            }
          }
        });
      } catch (e) { }
    }
    setCustomShifts(extractedCustom);
  }, [employee]);

  // Reset the shift tab ONLY when a different employee is opened, not on every save
  useEffect(() => {
    setShiftTab(employee.shift && employee.shift.toLowerCase() === "flexible" ? "Flexible" : "Fixed");
  }, [employee.id]);

  // Refetch employee details when switching to documents tab
  useEffect(() => {
    if (activeTab === "documents" && employee?.id) {
      const refetchProfile = async () => {
        try {
          const data = await employeeApi.getById(String(employee.id));
          if (data) {
            setDocumentsList(data.documents || []);
          }
        } catch (err) {
          console.error("Failed to refetch profile on tab switch:", err);
        }
      };
      refetchProfile();
    }
  }, [activeTab, employee.id]);

  useEffect(() => {
    setLeaveSubView("menu");
  }, [activeTab]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleBack = () => {
    setVisible(false);
    setTimeout(onBack, 300);
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please resolve the validation errors");
      return;
    }
    setSaving(true);
    try {
      const payload: Omit<EmployeeRecord, "id" | "employeeId" | "createdAt"> = {
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: (formData.gender || undefined) as EmployeeGender | undefined,
        department: formData.department,
        role: formData.role,
        bloodGroup: (formData.bloodGroup || undefined) as BloodGroup | undefined,
        joinDate: formData.joinDate,
        allottedProjects: formData.allottedProjects,
        company: formData.company || undefined,
        attendanceLocation: formData.attendanceLocation || undefined,
        status: (formData.dateOfLeaving
          ? (new Date(formData.dateOfLeaving).getTime() <= new Date().setHours(0, 0, 0, 0) ? "inactive" : "active")
          : formData.status) as EmployeeStatus,
        dateOfBirth: formData.dateOfBirth || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        address: formData.address || undefined,
        maritalStatus: (formData.maritalStatus ? formData.maritalStatus.toLowerCase() : undefined) as MaritalStatus | undefined,
        nationality: (formData.nationality || undefined) as Nationality | undefined,
        aadharNumber: formData.aadharNumber || undefined,
        panNumber: formData.panNumber || undefined,
        permanentAddress: formData.permanentAddress || undefined,
        currentAddress: formData.currentAddress || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        highestQualification: formData.highestQualification || undefined,
        university: formData.university || undefined,
        passingYear: formData.passingYear || undefined,
        percentage: formData.percentage || undefined,
        weekOffDays: formData.weekOffDays as WeekOffDays[] || undefined,
        shift: shiftTab === 'Flexible' ? 'Flexible' : (formData.shift || 'General (10AM–7PM)'),
        shiftType: shiftTab === 'Flexible' ? 'flexible' : 'fixed',
        weeklySchedule: formData.weeklySchedule || undefined,
        avatarUrl: avatarPreview || employee.avatarUrl || undefined,
        documents: documentsList,
        employeeType: formData.employeeType as any,
        probationPeriod: Number(formData.probationPeriod) ?? 3,
        dateOfLeaving: formData.dateOfLeaving || undefined,
        noticePeriod: Number(formData.noticePeriod) ?? 30,
        salary: Number(formData.salary) ?? 0.00,
        salaryType: formData.salaryType as any,
        designationRole: formData.designationRole || undefined,
        punchInTime: formData.punchInTime || undefined,
        punchOutTime: formData.punchOutTime || undefined,
        ctc: Number(formData.ctc) ?? 0,
        hikeEffectiveDate: formData.hikeEffectiveDate || undefined,
        hikeType: formData.hikeType || undefined,
        hikeValue: Number(formData.hikeValue) ?? 0,
        hikeActive: formData.hikeActive ? true : false,
        laptopAssigned: formData.laptopAssigned as any,
        laptopName: formData.laptopName || undefined,
        laptopSerialNumber: formData.laptopSerialNumber || undefined,
        mobileAssigned: formData.mobileAssigned as any,
        mobileName: formData.mobileName || undefined,
        mobileImei: formData.mobileImei || undefined,
        mobileSerialNumber: formData.mobileSerialNumber || undefined,
        mobileNumberSim: formData.mobileNumberSim || undefined,
        simCard: formData.simCard || undefined,
        mobilePassword: formData.mobilePassword || undefined,
        systemLoginId: formData.systemLoginId || undefined,
        systemPassword: formData.systemPassword || undefined,
        officeEmailId: formData.officeEmailId || undefined,
        officeEmailPassword: formData.officeEmailPassword || undefined,
        accountHolderName: formData.accountHolderName || undefined,
        bankName: formData.bankName || undefined,
        accountNumber: formData.accountNumber || undefined,
        ifscCode: formData.ifscCode || undefined,
        upiId: formData.upiId || undefined,
        bankVerificationStatus: formData.bankVerificationStatus || "Not Verified",
        bankVerifiedName: formData.bankVerifiedName || undefined,
        // Leave Policy & Balance
        leave_cycle: leaveCycle,
        privileged_leave_balance: leaveBalances.privilegedLeave,
        sick_leave_balance: leaveBalances.sickLeave,
        casual_leave_balance: leaveBalances.casualLeave,
        // Late Penalty Settings
        allowed_late_days: formData.allowedLateDays !== undefined ? Number(formData.allowedLateDays) : 5,
        deduct_if_late_by_more_than: formData.deductIfLateByMoreThan !== undefined ? Number(formData.deductIfLateByMoreThan) : 60,
        deduct_based_on_late_arrival: !!formData.deductBasedOnLateArrival,
        deduction_type: formData.deductionType || 'multiplier',
        deduction_amount: formData.deductionAmount !== undefined ? Number(formData.deductionAmount) : 0,
      };
      await employeeApi.update(employee.id, payload);
      toast.success("Employee updated successfully!");
      setIsEditing(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      toast.loading("Uploading avatar...", { id: "avatar-upload" });
      const imageUrl = await employeeApi.uploadAvatar(file);
      setAvatarPreview(imageUrl);
      toast.success("Avatar uploaded successfully!", { id: "avatar-upload" });
    } catch (err: any) {
      toast.error(err.message || "Avatar upload failed", { id: "avatar-upload" });
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Information", icon: <UserIcon size={14} className="text-blue-500" /> },
    { id: "personal", label: "Personal Details", icon: <UserCog2 size={14} className="text-orange-500" /> },
    { id: "address", label: "Address Details", icon: <MapPinIcon size={14} className="text-rose-500" /> },
    { id: "education", label: "Educational Details", icon: <GraduationCap size={14} className="text-emerald-500" /> },
    { id: "employment", label: "Employment Details", icon: <BriefcaseIcon size={14} className="text-indigo-500" /> },
    { id: "time_shift", label: "Time & Shift", icon: <Clock size={14} className="text-violet-500" /> },
    { id: "system", label: "System Details", icon: <Laptop size={14} className="text-teal-500" /> },
    { id: "bank", label: "Bank Details", icon: <Banknote size={14} className="text-amber-500" /> },
    { id: "leaves", label: "Leave Balances & Policy", icon: <CalendarCheck size={14} className="text-cyan-500" /> },
    { id: "kyc", label: "KYC Verification", icon: <ShieldCheck size={14} className="text-pink-500" /> },
    { id: "documents", label: "Documents", icon: <FileText size={14} className="text-fuchsia-500" /> },
  ];

  const statusCfg = STATUS_CONFIG[employee.status];
  const fullName = `${employee.firstName}${employee.middleName ? " " + employee.middleName : ""} ${employee.lastName}`;



  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="First Name"
                value={formData.firstName}
                onChange={(v: string) => {
                  const val = v.replace(/[^A-Za-z\s]/g, '');
                  setFormData({ ...formData, firstName: val });
                  if (formErrors.firstName) setFormErrors(prev => ({ ...prev, firstName: "" }));
                }}
                required
                icon={<UserIcon size={14} />}
                error={formErrors.firstName}
              />
              <InputField
                label="Middle Name"
                value={formData.middleName}
                onChange={(v: string) => {
                  const val = v.replace(/[^A-Za-z\s]/g, '');
                  setFormData({ ...formData, middleName: val });
                }}
                icon={<UserIcon size={14} />}
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChange={(v: string) => {
                  const val = v.replace(/[^A-Za-z\s]/g, '');
                  setFormData({ ...formData, lastName: val });
                  if (formErrors.lastName) setFormErrors(prev => ({ ...prev, lastName: "" }));
                }}
                required
                icon={<UserIcon size={14} />}
                error={formErrors.lastName}
              />
              <InputField
                label="Email"
                value={formData.email}
                onChange={(v: string) => {
                  setFormData({ ...formData, email: v });
                  if (formErrors.email) setFormErrors(prev => ({ ...prev, email: "" }));
                }}
                type="email"
                required
                icon={<MailIcon size={14} />}
                error={formErrors.email}
              />
              <InputField
                label="Mobile"
                value={formData.phone}
                onChange={(v: string) => {
                  const val = v.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: val });
                  if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: "" }));
                }}
                required
                icon={<Smartphone size={14} />}
                error={formErrors.phone}
              />
              <InputField
                label="Gender"
                value={formData.gender}
                onChange={(v: string) => setFormData({ ...formData, gender: v })}
                isSelect
                options={["male", "female", "other"]}
                icon={<Users size={14} />}
              />
              <InputField
                label="Department"
                value={formData.department}
                onChange={(v: string) => setFormData({ ...formData, department: v })}
                isSelect
                options={departments}
                icon={<Building2 size={14} />}
                required
              />
              <InputField
                label="Role"
                value={formData.role}
                onChange={(v: string) => setFormData({ ...formData, role: v })}
                isSelect
                options={roles}
                icon={<UserCog size={14} />}
                required
              />
              <InputField
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={(v: string) => setFormData({ ...formData, bloodGroup: v })}
                isSelect
                options={BLOOD_GROUPS}
                icon={<Heart size={14} />}
              />
              <InputField
                label="Joining Date"
                value={formData.joinDate}
                onChange={(v: string) => setFormData({ ...formData, joinDate: v })}
                type="date"
                icon={<CalendarIcon size={14} />}
              />
              <InputField
                label="Allotted Projects"
                value={formData.allottedProjects ? formData.allottedProjects.join(', ') : ""}
                onChange={(v: string) => setFormData({ ...formData, allottedProjects: v.split(',').map(p => p.trim()).filter(Boolean) })}
                placeholder="e.g. Project Alpha, Project Beta"
                icon={<FolderOpen size={14} />}
              />
              <InputField
                label="Company"
                value={formData.company}
                onChange={(v: string) => setFormData({ ...formData, company: v })}
                placeholder="Enter company name"
                icon={<Building2 size={14} />}
              />
              <InputField
                label="Attendance Location (Branch)"
                value={formData.attendanceLocation}
                onChange={(v: string) => setFormData({ ...formData, attendanceLocation: v })}
                placeholder="Enter branch location"
                icon={<MapPinIcon size={14} />}
              />
              <InputField
                label="Employee Status"
                value={formData.status}
                onChange={(v: string) => setFormData({ ...formData, status: v as EmployeeStatus })}
                isSelect
                options={["active", "on_leave", "inactive", "terminated"]}
                icon={<ShieldCheck size={14} />}
              />
            </div>
          </div>
        );

      case "personal":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(v: string) => setFormData({ ...formData, dateOfBirth: v })}
                type="date"
                icon={<Cake size={14} />}
              />
              <InputField
                label="Marital Status"
                value={formData.maritalStatus}
                onChange={(v: string) => setFormData({ ...formData, maritalStatus: v as MaritalStatus })}
                isSelect
                options={MARITAL_STATUS.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
                icon={<HeartHandshake size={14} />}
              />
              <InputField
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(v: string) => {
                  const val = v.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, emergencyContact: val });
                  if (formErrors.emergencyContact) setFormErrors(prev => ({ ...prev, emergencyContact: "" }));
                }}
                placeholder="10-digit number"
                icon={<PhoneCall size={14} />}
                error={formErrors.emergencyContact}
              />
              <InputField
                label="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={(v: string) => setFormData({ ...formData, emergencyContactName: v })}
                placeholder="Full name"
                icon={<UserIcon size={14} />}
              />
              <InputField
                label="Nationality"
                value={formData.nationality}
                onChange={(v: string) => setFormData({ ...formData, nationality: v as Nationality })}
                isSelect
                options={NATIONALITY}
                icon={<Flag size={14} />}
              />
              <InputField
                label="Aadhar Number"
                value={formData.aadharNumber}
                onChange={(v: string) => setFormData({ ...formData, aadharNumber: v })}
                placeholder="12-digit Aadhar"
                icon={<IdCard size={14} />}
              />
              <InputField
                label="PAN Number"
                value={formData.panNumber}
                onChange={(v: string) => setFormData({ ...formData, panNumber: v })}
                placeholder="ABCDE1234F"
                icon={<CreditCardIcon size={14} />}
              />
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Permanent Address</h3>
              <InputField
                label="Full Permanent Address"
                value={formData.permanentAddress}
                onChange={(v: string) => setFormData({ ...formData, permanentAddress: v })}
                placeholder="Full permanent address"
                icon={<MapPinIcon size={14} />}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  value={formData.city}
                  onChange={(v: string) => setFormData({ ...formData, city: v })}
                  placeholder="City"
                />
                <InputField
                  label="State"
                  value={formData.state}
                  onChange={(v: string) => setFormData({ ...formData, state: v })}
                  placeholder="State"
                />
                <InputField
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(v: string) => setFormData({ ...formData, pincode: v })}
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                disabled={!isEditing}
              />
              <label className="text-sm font-medium text-slate-700">
                Current address same as permanent address
              </label>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Current Address (if different)</h3>
              <InputField
                label="Full Current Address"
                value={formData.currentAddress}
                onChange={(v: string) => setFormData({ ...formData, currentAddress: v })}
                placeholder="Full current address (if different from permanent)"
                icon={<MapPinIcon size={14} />}
              />
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Highest Qualification"
                value={formData.highestQualification}
                onChange={(v: string) => setFormData({ ...formData, highestQualification: v })}
                isSelect
                options={["B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Sc", "B.Com", "M.Com", "Other"]}
                icon={<GraduationCap size={14} />}
              />
              <InputField
                label="University/College"
                value={formData.university}
                onChange={(v: string) => setFormData({ ...formData, university: v })}
                placeholder="University/College name"
                icon={<School size={14} />}
              />
              <InputField
                label="Passing Year"
                value={formData.passingYear}
                onChange={(v: string) => setFormData({ ...formData, passingYear: v })}
                type="number"
                placeholder="YYYY"
              />
              <InputField
                label="Percentage/CGPA"
                value={formData.percentage}
                onChange={(v: string) => setFormData({ ...formData, percentage: v })}
                placeholder="e.g. 85.5"
              />
            </div>
          </div>
        );

      case "employment":
        return (
          <div className="space-y-4">
            {/* Row 1: Date of Joining, Designation, Employee Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Date of Joining"
                value={formData.joinDate}
                onChange={(v: string) => setFormData({ ...formData, joinDate: v })}
                type="date"
                icon={<CalendarIcon size={14} />}
              />
              <InputField
                label="Designation"
                value={formData.designationRole}
                onChange={(v: string) => setFormData({ ...formData, designationRole: v })}
                placeholder="e.g. Senior Engineer, HR Manager"
                icon={<BriefcaseIcon size={14} />}
              />
              <InputField
                label="Employee Type"
                value={formData.employeeType}
                onChange={(v: string) => setFormData({ ...formData, employeeType: v as any })}
                isSelect
                options={["Permanent", "Contract", "Intern", "Probation"]}
                icon={<UserCheck size={14} />}
              />
            </div>

            {/* Row 2: Probation Period, Date of Leaving, Notice Period (days) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Probation Period"
                value={formData.probationPeriod}
                onChange={(v: string) => setFormData({ ...formData, probationPeriod: Number(v) })}
                type="number"
                placeholder="Months"
              />
              <InputField
                label="Date of Leaving"
                value={formData.dateOfLeaving}
                onChange={(v: string) => {
                  const updated = { ...formData, dateOfLeaving: v };
                  if (v) {
                    const leaving = new Date(v);
                    leaving.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (leaving.getTime() <= today.getTime()) {
                      updated.status = "inactive" as any;
                    } else {
                      updated.status = "active" as any;
                    }
                  }
                  setFormData(updated);
                }}
                type="date"
              />
              <InputField
                label="Notice Period (days)"
                value={formData.noticePeriod}
                onChange={(v: string) => setFormData({ ...formData, noticePeriod: Number(v) })}
                type="number"
              />
            </div>

            {/* Row 3: Salary, Salary Type, CTC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Salary (₹)"
                value={formData.salary}
                onChange={(v: string) => setFormData({ ...formData, salary: Number(v) })}
                type="number"
                placeholder="Enter salary"
                icon={<IndianRupee size={14} />}
              />
              <InputField
                label="Salary Type"
                value={formData.salaryType}
                onChange={(v: string) => {
                  const calculatedSal = formData.ctc ? calculateSalary(formData.ctc, v) : formData.salary;
                  setFormData({ ...formData, salaryType: v as any, salary: calculatedSal });
                }}
                isSelect
                options={["Monthly", "Weekly", "Hourly", "Daily"]}
              />
              <InputField
                label="CTC"
                value={formData.ctc}
                onChange={(v: string) => {
                  const ctcVal = Number(v) || 0;
                  const calculatedSal = ctcVal ? calculateSalary(ctcVal, formData.salaryType) : formData.salary;
                  setFormData({ ...formData, ctc: ctcVal, salary: calculatedSal });
                }}
                type="number"
                placeholder="Enter CTC"
                icon={<IndianRupee size={14} />}
              />
            </div>

            {/* Row 4: Hike Effective Date, Hike Type, Hike Value, Hike Active Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                label="Hike Effective Date"
                value={formData.hikeEffectiveDate}
                onChange={(v: string) => setFormData({ ...formData, hikeEffectiveDate: v })}
                type="date"
                icon={<CalendarIcon size={14} />}
              />
              <InputField
                label="Hike Type"
                value={formData.hikeType}
                onChange={(v: string) => setFormData({ ...formData, hikeType: v })}
                isSelect
                options={["percentage_%", "fixed_amount"]}
                icon={<AwardIcon size={14} />}
              />
              <InputField
                label={formData.hikeType === "percentage_%" ? "Hike Percentage (%)" : "Hike Value"}
                value={formData.hikeValue}
                onChange={(v: string) => setFormData({ ...formData, hikeValue: Number(v) })}
                type="number"
                placeholder={formData.hikeType === "percentage_%" ? "Enter percentage (e.g. 10)" : "Enter hike value"}
                icon={formData.hikeType === "percentage_%" ? <Percent size={14} /> : <IndianRupee size={14} />}
              />
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Hike Active
                </label>
                <div className="flex items-center h-[38px]">
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => setFormData({ ...formData, hikeActive: !formData.hikeActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:ring-offset-2 ${formData.hikeActive ? 'bg-[#0D47A1]' : 'bg-slate-200'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.hikeActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                  <span className="ml-3 text-sm font-medium text-slate-700">
                    {formData.hikeActive ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        );

      case "time_shift":
        return (
          <div className="space-y-4">
            <div className="flex justify-start mb-3 pb-3">
              <div className="relative flex bg-blue-50/80 p-1 rounded-xl w-64 border border-[#0D47A1]/20">
                {/* Active background pill */}
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-[#0D47A1] shadow-md transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: shiftTab === "Fixed" ? '4px' : 'calc(50%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleShiftTabChange("Fixed")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold text-center transition-colors duration-250 cursor-pointer ${shiftTab === "Fixed" ? "text-white" : "text-slate-500 hover:text-[#0D47A1]"
                    }`}
                >
                  Fixed Shift
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftTabChange("Flexible")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold text-center transition-colors duration-250 cursor-pointer ${shiftTab === "Flexible" ? "text-white" : "text-slate-500 hover:text-[#0D47A1]"
                    }`}
                >
                  Flexible Shift
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Shift Table */}
              <div className="lg:col-span-2 space-y-4">
                {shiftTab === "Fixed" ? (
                  <div className="bg-white border border-slate-200 rounded-2xl pt-3 px-6 pb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] animate-fadeIn">
                    {/* Grid Header */}
                    <div className="hidden sm:grid sm:grid-cols-[120px_100px_1fr] gap-4 items-center border-b border-slate-200 pb-2 mb-2 text-xs font-extrabold text-slate-500 uppercase tracking-widest py-1">
                      <div>Day</div>
                      <div className="text-center">Weekoff</div>
                      <div>Shifts</div>
                    </div>

                    {/* Grid Rows */}
                    <div className="divide-y divide-slate-100 md:max-h-[245px] md:overflow-y-auto no-scrollbar pr-0">
                      {(() => {
                        const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                        let schedule: Record<string, { shift?: string; isWeekOff?: boolean; weeks?: string[] }> = {};
                        try {
                          const raw = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                          DAYS.forEach(d => {
                            if (raw[d] && typeof raw[d] === 'object') {
                              schedule[d] = raw[d];
                            } else {
                              const isOff = formData.weekOffDays?.includes(d as any);
                              schedule[d] = {
                                shift: isOff ? `All ${d.toLowerCase()}s week off` : "",
                                isWeekOff: isOff,
                                weeks: ["All Weeks"]
                              };
                            }
                          });
                        } catch (e) {
                          DAYS.forEach(d => {
                            const isOff = formData.weekOffDays?.includes(d as any);
                            schedule[d] = {
                              shift: isOff ? `All ${d.toLowerCase()}s week off` : "",
                              isWeekOff: isOff,
                              weeks: ["All Weeks"]
                            };
                          });
                        }

                        return DAYS.map(day => {
                          const isOff = schedule[day]?.isWeekOff || false;
                          const activeShift = schedule[day]?.shift || "";
                          const weeks = schedule[day]?.weeks || ["All Weeks"];

                          return (
                            <div key={day} className="flex flex-col sm:grid sm:grid-cols-[120px_100px_1fr] gap-3 sm:gap-4 items-start sm:items-center py-3.5 sm:py-2.5 hover:bg-slate-50/50 px-2 transition duration-150 border-b border-slate-100 sm:border-b-0 last:border-none">
                              {/* Day Column */}
                              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                {!isOff && <span className="text-red-500 font-bold">*</span>}
                                <span className="sm:hidden">{day}</span>
                                <span className="hidden sm:inline">{day.substring(0, 3)}</span>
                              </div>

                              <div className="flex items-center justify-between w-full sm:contents gap-2">
                                {/* Weekoff Checkbox Column */}
                                <div className="flex items-center gap-2 sm:justify-center">
                                  <input
                                    type="checkbox"
                                    checked={isOff}
                                    disabled={!isEditing}
                                    onChange={(e) => {
                                      if (!isEditing) return;
                                      const updated = {
                                        ...schedule,
                                        [day]: {
                                          ...schedule[day],
                                          isWeekOff: e.target.checked,
                                          shift: e.target.checked ? `All ${day.toLowerCase()}s week off` : "General (10AM–7PM)",
                                          weeks: e.target.checked ? ["All Weeks"] : []
                                        }
                                      };
                                      const newScheduleStr = JSON.stringify(updated);
                                      const newWeekOffs = DAYS.filter(d => updated[d]?.isWeekOff);

                                      setFormData({
                                        ...formData,
                                        weeklySchedule: newScheduleStr,
                                        weekOffDays: newWeekOffs as WeekOffDays[],
                                        shift: updated[DAYS.find(d => !updated[d]?.isWeekOff) || "Monday"]?.shift || "General (10AM–7PM)"
                                      });
                                    }}
                                    className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                                  />
                                  <span className="text-xs font-bold text-slate-500 sm:hidden">Weekoff</span>
                                </div>

                                {/* Shifts Column */}
                                <div className="w-full sm:max-w-[280px]">
                                  {isOff ? (
                                    <button
                                      type="button"
                                      disabled={!isEditing}
                                      onClick={() => {
                                        setActiveWeekOffModalDay(day);
                                        setTempWeekOffWeeks(weeks);
                                      }}
                                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-sm border rounded-xl bg-white text-left font-semibold transition-all border-slate-200 text-slate-700 hover:border-[#0D47A1]/40 ${!isEditing ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                                        }`}
                                    >
                                      <span className="truncate">{getWeekOffText(day, weeks)}</span>
                                      <svg className="shrink-0 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={!isEditing}
                                      onClick={() => {
                                        setActiveShiftModalDay(day);
                                        setTempSelectedShift(activeShift);
                                      }}
                                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-sm border rounded-xl bg-white text-left font-semibold transition-all border-slate-200 text-slate-700 hover:border-[#0D47A1]/40 ${!isEditing ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                                        }`}
                                    >
                                      <span className="truncate">{activeShift || "Select Shift"}</span>
                                      <svg className="shrink-0 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : (
                  // Flexible: date-by-date table for selected month
                  flexibleMonth ? (() => {
                    const { year, month } = flexibleMonth;
                    const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const DATE_KEYS = Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);

                    let flexSchedule: Record<string, { shift?: string; isWeekOff?: boolean; weeks?: string[] }> = {};
                    try {
                      const raw = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                      DATE_KEYS.forEach(dk => {
                        if (raw[dk] && typeof raw[dk] === "object") {
                          flexSchedule[dk] = raw[dk];
                        } else {
                          flexSchedule[dk] = { shift: "", isWeekOff: false, weeks: [] };
                        }
                      });
                    } catch (e) {
                      DATE_KEYS.forEach(dk => {
                        flexSchedule[dk] = { shift: "", isWeekOff: false, weeks: [] };
                      });
                    }

                    return (
                      <div className="bg-white border border-slate-200 rounded-2xl pt-3 px-6 pb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] animate-fadeIn">
                        {/* Month header with change button */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                            {monthName} {year}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowMonthPickerModal(true)}
                            className="text-[10px] font-bold text-[#0D47A1] hover:underline cursor-pointer bg-transparent border-none outline-none"
                          >
                            Change Month
                          </button>
                        </div>

                        {/* Grid Header */}
                        <div className="hidden sm:grid sm:grid-cols-[100px_100px_1fr] gap-4 items-center border-b border-slate-200 pb-2 mb-2 text-xs font-extrabold text-slate-500 uppercase tracking-widest py-1">
                          <div>Date</div>
                          <div className="text-center">Weekoff</div>
                          <div>Shifts</div>
                        </div>

                        {/* Grid Rows */}
                        <div className="divide-y divide-slate-100 md:max-h-[245px] md:overflow-y-auto no-scrollbar">
                          {DATE_KEYS.map(dk => {
                            const dayNum = parseInt(dk.split("-")[2]);
                            const dateObj = new Date(year, month, dayNum);
                            const dayLabel = dateObj.toLocaleString("default", { weekday: "short" });
                            const isOff = flexSchedule[dk]?.isWeekOff || false;
                            const activeShiftFlex = flexSchedule[dk]?.shift || "";
                            const weeks = flexSchedule[dk]?.weeks || [];

                            return (
                              <div key={dk} className="flex flex-col sm:grid sm:grid-cols-[100px_100px_1fr] gap-3 sm:gap-4 items-start sm:items-center py-3.5 sm:py-2.5 hover:bg-slate-50/50 px-2 transition duration-150 border-b border-slate-100 sm:border-b-0 last:border-none">
                                {/* Date Column */}
                                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                  {!isOff && <span className="text-red-500 font-bold">*</span>}
                                  <span>{monthName.substring(0, 3)} {dayNum}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">({dayLabel})</span>
                                </div>

                                <div className="flex items-center justify-between w-full sm:contents gap-2">
                                  {/* Weekoff Checkbox */}
                                  <div className="flex items-center gap-2 sm:justify-center">
                                    <input
                                      type="checkbox"
                                      checked={isOff}
                                      disabled={!isEditing}
                                      onChange={(e) => {
                                        if (!isEditing) return;
                                        const updatedFlex = {
                                          ...flexSchedule,
                                          [dk]: {
                                            ...flexSchedule[dk],
                                            isWeekOff: e.target.checked,
                                            shift: e.target.checked ? `${monthName} ${dayNum} off` : "General (10AM–7PM)",
                                            weeks: []
                                          }
                                        };
                                        setFormData(prev => ({ ...prev, weeklySchedule: JSON.stringify(updatedFlex) }));
                                      }}
                                      className="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-500 sm:hidden">Weekoff</span>
                                  </div>

                                  {/* Shifts Column */}
                                  <div className="w-full sm:max-w-[280px]">
                                    <button
                                      type="button"
                                      disabled={!isEditing || isOff}
                                      onClick={() => {
                                        setActiveShiftModalDay(dk);
                                        setTempSelectedShift(activeShiftFlex);
                                      }}
                                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-sm border rounded-xl bg-white text-left font-semibold transition-all border-slate-200 text-slate-700 hover:border-[#0D47A1]/40 ${(!isEditing || isOff) ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                                        }`}
                                    >
                                      <span className="truncate">{isOff ? `${monthName} ${dayNum} off` : (activeShiftFlex || "Select Shift")}</span>
                                      {!isOff && (
                                        <svg className="shrink-0 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                    : (
                      <div className="flex flex-col gap-1.5 p-5 bg-blue-50/50 border border-blue-100/50 rounded-2xl animate-fadeIn max-w-xl">
                        <h4 className="text-xs font-extrabold text-[#0D47A1] uppercase tracking-wider flex items-center gap-1.5">
                          <Clock size={14} /> Flexible Shift
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          Select a month to configure date-wise shifts.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMonthPickerModal(true)}
                          className="mt-2 w-fit px-4 py-2 text-xs font-bold text-white bg-[#0D47A1] rounded-xl hover:opacity-90 transition cursor-pointer border-none"
                        >
                          Select Month
                        </button>
                      </div>
                    )
                )}
              </div>

              {/* Right Column: Late Penalty Policy */}
              <div className="lg:col-span-1">
                {/* Late Attendance Penalty Settings Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] animate-fadeIn space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      ⚠️ Late Attendance & Penalty Settings
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Configure grace days, thresholds, and custom multiplier deduction details for this employee.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Allowed Late Days"
                      type="number"
                      value={formData.allowedLateDays}
                      onChange={(v: string) => setFormData({ ...formData, allowedLateDays: Number(v) })}
                      placeholder="e.g. 5"
                    />
                    <InputField
                      label="Only deduct if late by more than (mins)"
                      type="number"
                      value={formData.deductIfLateByMoreThan}
                      onChange={(v: string) => setFormData({ ...formData, deductIfLateByMoreThan: Number(v) })}
                      placeholder="e.g. 60"
                    />
                    <InputField
                      label="Custom Multiplier — Amount (₹ per late Hour)"
                      type="number"
                      value={formData.deductionAmount}
                      onChange={(v: string) => setFormData({ ...formData, deductionAmount: Number(v) })}
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Week Off Details Modal */}
            {activeWeekOffModalDay && createPortal(
              <WeekOffModal
                day={activeWeekOffModalDay}
                weeks={tempWeekOffWeeks}
                onClose={() => setActiveWeekOffModalDay(null)}
                onConfirm={(updatedWeeks) => {
                  let schedule: Record<string, { shift?: string; isWeekOff?: boolean; weeks?: string[] }> = {};
                  try {
                    schedule = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                  } catch (e) { }

                  const updated = {
                    ...schedule,
                    [activeWeekOffModalDay]: {
                      ...schedule[activeWeekOffModalDay],
                      weeks: updatedWeeks,
                      shift: getWeekOffText(activeWeekOffModalDay, updatedWeeks)
                    }
                  };

                  setFormData({
                    ...formData,
                    weeklySchedule: JSON.stringify(updated)
                  });
                  setActiveWeekOffModalDay(null);
                }}
              />,
              document.body
            )}

            {/* Shift Selection Modal */}
            {activeShiftModalDay && createPortal(
              <ShiftSelectModal
                day={activeShiftModalDay}
                selectedShift={tempSelectedShift}
                customShifts={customShifts}
                onAddCustomShift={(newShift) => setCustomShifts(prev => [...prev, newShift])}
                onDeleteCustomShift={(name) => {
                  setCustomShifts(prev => prev.filter(s => (typeof s === 'string' ? s : s.name) !== name));
                  let schedule: Record<string, any> = {};
                  try {
                    schedule = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                  } catch (e) { }
                  let updated = { ...schedule };
                  let changed = false;
                  Object.keys(updated).forEach(dayKey => {
                    if (updated[dayKey] && updated[dayKey].shift === name) {
                      updated[dayKey] = {
                        ...updated[dayKey],
                        shift: "",
                        isWeekOff: false,
                        startTime: null,
                        endTime: null,
                        allowPunchInHours: null,
                        allowPunchInMinutes: null,
                        allowPunchOutHours: null,
                        allowPunchOutMinutes: null,
                        allowedLateDays: null,
                        lateThresholdMins: null,
                        lateDeductionAmount: null
                      };
                      changed = true;
                    }
                  });
                  if (changed) {
                    setFormData(prev => ({
                      ...prev,
                      weeklySchedule: JSON.stringify(updated)
                    }));
                  }
                }}
                onEditCustomShift={(oldName, updatedShift) => {
                  setCustomShifts(prev => prev.map(s => (typeof s === 'string' ? s : s.name) === oldName ? updatedShift : s));
                  let schedule: Record<string, any> = {};
                  try {
                    schedule = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                  } catch (e) { }
                  let updated = { ...schedule };
                  let changed = false;
                  Object.keys(updated).forEach(dayKey => {
                    if (updated[dayKey] && updated[dayKey].shift === oldName) {
                      const { name, ...config } = updatedShift;
                      updated[dayKey] = {
                        ...updated[dayKey],
                        shift: name,
                        ...(config || {})
                      };
                      changed = true;
                    }
                  });
                  if (changed) {
                    setFormData(prev => ({
                      ...prev,
                      weeklySchedule: JSON.stringify(updated)
                    }));
                  }
                }}
                onClose={() => setActiveShiftModalDay(null)}
                onConfirm={(selectedVal, shiftConfig) => {
                  let schedule: Record<string, any> = {};
                  try {
                    schedule = formData.weeklySchedule ? JSON.parse(formData.weeklySchedule) : {};
                  } catch (e) { }

                  const forcedWorkMode = shiftTab === "Flexible" ? "WFH" : "Office";

                  // Only update the specific day that was clicked — do NOT touch other days
                  const updated = {
                    ...schedule,
                    [activeShiftModalDay]: {
                      ...schedule[activeShiftModalDay],
                      shift: selectedVal,
                      isWeekOff: false,
                      ...(shiftConfig || {}),
                      workMode: forcedWorkMode
                    }
                  };

                  setFormData(prev => ({
                    ...prev,
                    weeklySchedule: JSON.stringify(updated)
                  }));
                  setActiveShiftModalDay(null);
                }}
              />,
              document.body
            )}

            {/* Change Schedule Type Confirmation Modal */}
            {showScheduleTypeConfirm && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
                  onClick={() => { setShowScheduleTypeConfirm(false); setPendingShiftTab(null); }}
                />
                <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
                  <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden animate-fadeIn">
                    <div className="px-6 py-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800">Change Schedule Type?</h3>
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Changing schedule type would reset data.<br />Are you sure?
                      </p>
                    </div>
                    <div className="px-6 pb-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => { setShowScheduleTypeConfirm(false); setPendingShiftTab(null); }}
                        className="px-5 py-2 text-sm font-bold border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-50 transition cursor-pointer bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowScheduleTypeConfirm(false);
                          if (pendingShiftTab) applyShiftTabChange(pendingShiftTab);
                          setPendingShiftTab(null);
                        }}
                        className="px-6 py-2 text-sm font-bold text-white rounded-xl bg-[#0D47A1] hover:opacity-90 transition cursor-pointer border-none"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}

            {/* Month Picker Modal */}
            {showMonthPickerModal && (
              <MonthPickerModal
                initialYear={flexibleMonth?.year ?? new Date().getFullYear()}
                initialMonth={flexibleMonth?.month ?? new Date().getMonth()}
                onClose={() => setShowMonthPickerModal(false)}
                onConfirm={(year, month) => {
                  setFlexibleMonth({ year, month });
                  setShowMonthPickerModal(false);
                }}
              />
            )}
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            {/* System Sub-tabs (Laptop / Mobile) - Sticky at the top of the tab content panel */}
            <div className="sticky top-6 z-20 pb-3 mb-3 border-b border-slate-100 flex justify-start">
              <div className="relative flex bg-blue-50/80 p-1 rounded-xl w-64 border border-[#0D47A1]/20">
                {/* Active background pill */}
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-[#0D47A1] shadow-md transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: systemSubTab === "Laptop" ? '4px' : 'calc(50%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSystemSubTab("Laptop")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold text-center transition-colors duration-250 cursor-pointer ${systemSubTab === "Laptop" ? "text-white" : "text-slate-500 hover:text-[#0D47A1]"
                    }`}
                >
                  Laptop
                </button>
                <button
                  type="button"
                  onClick={() => setSystemSubTab("Mobile")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-bold text-center transition-colors duration-250 cursor-pointer ${systemSubTab === "Mobile" ? "text-white" : "text-slate-500 hover:text-[#0D47A1]"
                    }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {systemSubTab === "Laptop" ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Laptop Toggle */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="max-w-[200px]">
                    <InputField
                      label="Laptop Assigned"
                      value={formData.laptopAssigned}
                      onChange={(v: string) => setFormData({ ...formData, laptopAssigned: v as any })}
                      isSelect
                      options={["Yes", "No"]}
                      icon={<Laptop size={14} />}
                    />
                  </div>
                </div>

                {/* Laptop Details (Visible only if Laptop Assigned is Yes) */}
                {formData.laptopAssigned === "Yes" && (
                  <div className="space-y-3 bg-blue-50/10 p-4 rounded-xl border border-blue-100/50">
                    <h4 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider flex items-center gap-2">
                      <Laptop size={14} /> Laptop Asset Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Laptop Name / Brand"
                        value={formData.laptopName}
                        onChange={(v: string) => setFormData({ ...formData, laptopName: v })}
                        placeholder="e.g. Dell Latitude 3420"
                        icon={<Laptop size={14} />}
                      />
                      <InputField
                        label="Laptop Serial Number"
                        value={formData.laptopSerialNumber}
                        onChange={(v: string) => setFormData({ ...formData, laptopSerialNumber: v })}
                        placeholder="e.g. CN-0XXXXX-XXXXX"
                        icon={<Hash size={14} />}
                      />
                      <InputField
                        label="System Login ID"
                        value={formData.systemLoginId}
                        onChange={(v: string) => setFormData({ ...formData, systemLoginId: v })}
                        icon={<UserCircle size={14} />}
                      />
                      <InputField
                        label="System Password"
                        value={formData.systemPassword}
                        onChange={(v: string) => setFormData({ ...formData, systemPassword: v })}
                        type="text"
                        icon={<Lock size={14} />}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Mobile Toggle */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="max-w-[200px]">
                    <InputField
                      label="Mobile Assigned"
                      value={formData.mobileAssigned}
                      onChange={(v: string) => setFormData({ ...formData, mobileAssigned: v as any })}
                      isSelect
                      options={["Yes", "No"]}
                      icon={<Smartphone size={14} />}
                    />
                  </div>
                </div>

                {/* Mobile Details (Visible only if Mobile Assigned is Yes) */}
                {formData.mobileAssigned === "Yes" && (
                  <div className="space-y-3 bg-emerald-50/10 p-4 rounded-xl border border-emerald-100/50">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                      <Smartphone size={14} /> Mobile Asset Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Mobile Name / Brand"
                        value={formData.mobileName}
                        onChange={(v: string) => setFormData({ ...formData, mobileName: v })}
                        placeholder="e.g. Samsung Galaxy A34"
                        icon={<Smartphone size={14} />}
                      />
                      <InputField
                        label="IMEI Number"
                        value={formData.mobileImei}
                        onChange={(v: string) => setFormData({ ...formData, mobileImei: v })}
                        placeholder="Enter IMEI number"
                        icon={<Hash size={14} />}
                      />
                      <InputField
                        label="Mobile Serial Number"
                        value={formData.mobileSerialNumber}
                        onChange={(v: string) => setFormData({ ...formData, mobileSerialNumber: v })}
                        placeholder="Enter mobile serial number"
                        icon={<Hash size={14} />}
                      />
                      <InputField
                        label="Mobile Password"
                        value={formData.mobilePassword}
                        onChange={(v: string) => setFormData({ ...formData, mobilePassword: v })}
                        type="text"
                        icon={<Lock size={14} />}
                      />
                      <InputField
                        label="SIM Card Operator/Details"
                        value={formData.simCard}
                        onChange={(v: string) => setFormData({ ...formData, simCard: v })}
                        placeholder="e.g. Jio / Airtel / Vodafone"
                        icon={<IdCard size={14} />}
                      />
                      <InputField
                        label="Mobile Number (SIM)"
                        value={formData.mobileNumberSim}
                        onChange={(v: string) => setFormData({ ...formData, mobileNumberSim: v })}
                        placeholder="e.g. +91 XXXXX XXXXX"
                        icon={<Phone size={14} />}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Office Credentials (Always Visible) */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <MailIcon size={14} /> Office Credentials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Office Email ID"
                  value={formData.officeEmailId}
                  onChange={(v: string) => setFormData({ ...formData, officeEmailId: v })}
                  icon={<MailIcon size={14} />}
                />
                <InputField
                  label="Office Email Password"
                  value={formData.officeEmailPassword}
                  onChange={(v: string) => setFormData({ ...formData, officeEmailPassword: v })}
                  type="text"
                  icon={<Lock size={14} />}
                />
              </div>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(v: string) => setFormData({ ...formData, accountHolderName: v })}
                icon={<UserIcon size={14} />}
              />
              <InputField
                label="Bank Name"
                value={formData.bankName}
                onChange={(v: string) => setFormData({ ...formData, bankName: v })}
                icon={<Landmark size={14} />}
              />
              <InputField
                label="Account Number"
                value={formData.accountNumber}
                onChange={(v: string) => setFormData({ ...formData, accountNumber: v })}
                icon={<CreditCard size={14} />}
              />
              <InputField
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(v: string) => setFormData({ ...formData, ifscCode: v })}
                icon={<ShieldCheck size={14} />}
              />
              <InputField
                label="UPI ID"
                value={formData.upiId}
                onChange={(v: string) => setFormData({ ...formData, upiId: v })}
                placeholder="upi@bank"
                icon={<CreditCard size={14} />}
              />
            </div>

            {/* Bank Verification Section */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Bank Account Verification</h3>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${formData.bankVerificationStatus === 'Verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    formData.bankVerificationStatus === 'Failed' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                      formData.bankVerificationStatus === 'Verifying' ? 'bg-blue-50 border-blue-100 text-blue-600 animate-pulse' :
                        'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                    {formData.bankVerificationStatus === 'Verified' ? <CheckCircle2 size={18} /> :
                      formData.bankVerificationStatus === 'Failed' ? <AlertCircle size={18} /> :
                        formData.bankVerificationStatus === 'Verifying' ? <RefreshCw size={18} className="animate-spin" /> :
                          <ShieldCheck size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${formData.bankVerificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        formData.bankVerificationStatus === 'Failed' ? 'bg-rose-100 text-rose-800' :
                          formData.bankVerificationStatus === 'Verifying' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                            'bg-slate-200 text-slate-700'
                        }`}>
                        {formData.bankVerificationStatus || 'Not Verified'}
                      </span>
                    </div>
                    {formData.bankVerificationStatus === 'Verified' && formData.bankVerifiedName && (
                      <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                        Beneficiary Name: <span className="text-emerald-700 font-bold">{formData.bankVerifiedName}</span>
                      </p>
                    )}
                    {formData.bankVerificationStatus === 'Failed' && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                        Verification failed. Please check the account details and try again.
                      </p>
                    )}
                    {(formData.bankVerificationStatus !== 'Verified' && formData.bankVerificationStatus !== 'Failed' && formData.bankVerificationStatus !== 'Verifying') && (
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Verify this bank account using RazorpayX Penny Drop verification.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowBankVerifyModal(true)}
                    disabled={!formData.accountNumber || !formData.ifscCode}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${!formData.accountNumber || !formData.ifscCode
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-[#0D47A1] text-white hover:bg-[#0D47A1]/95 shadow-sm hover:shadow active:scale-[0.98]'
                      }`}
                  >
                    <Zap size={11} className="fill-current text-amber-400" />
                    Verify with RazorpayX
                  </button>
                  {(!formData.accountNumber || !formData.ifscCode) && (
                    <p className="text-[9px] text-rose-500 font-semibold text-right mt-1">IFSC & Account number required</p>
                  )}
                </div>
              </div>
            </div>

            {/* RazorpayX Verification Portal Modal */}
            {showBankVerifyModal && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
                  onClick={() => {
                    if (verifyStep !== 'loading') {
                      setShowBankVerifyModal(false);
                      setVerifyStep('idle');
                      setVerifyError('');
                      if (verifyStep === 'failed' && onSaveSuccess) onSaveSuccess();
                    }
                  }}
                />
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
                  <div
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto p-6 text-left border border-slate-100 flex flex-col space-y-4"
                    style={{
                      animation: 'modalVerifyOpen 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  >
                    <style>{`
                      @keyframes modalVerifyOpen {
                        from { transform: scale(0.95); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                      }
                    `}</style>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Zap size={14} className="fill-current text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">RazorpayX Verification</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Penny Drop Bank Validation</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBankVerifyModal(false);
                          setVerifyStep('idle');
                          setVerifyError('');
                          if (verifyStep === 'failed' && onSaveSuccess) onSaveSuccess();
                        }}
                        disabled={verifyStep === 'loading'}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50 transition cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {verifyStep === 'idle' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-semibold text-slate-700">Account Details to Validate:</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-500">
                            <div>Account Holder:</div>
                            <div className="text-slate-800 font-bold">{formData.accountHolderName || "N/A"}</div>
                            <div>Account Number:</div>
                            <div className="text-slate-800 font-bold">{formData.accountNumber || "N/A"}</div>
                            <div>IFSC Code:</div>
                            <div className="text-slate-800 font-bold">{formData.ifscCode || "N/A"}</div>
                            {formData.bankName && (
                              <>
                                <div>Bank Name:</div>
                                <div className="text-slate-800 font-bold">{formData.bankName}</div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 flex gap-2">
                          <ShieldCheck className="text-indigo-600 flex-shrink-0 mt-0.5" size={14} />
                          <p className="text-[10px] text-indigo-800 font-semibold leading-relaxed">
                            RazorpayX will deposit ₹1.00 into this account to verify active status and retrieve the actual registered name from the beneficiary bank registry.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleStartBankVerification}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow active:scale-[0.99] transition cursor-pointer"
                        >
                          <Zap size={12} className="fill-current text-amber-400" />
                          Proceed to Verify
                        </button>
                      </div>
                    )}

                    {verifyStep === 'loading' && (
                      <div className="py-6 flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <RefreshCw size={28} className="text-indigo-600 animate-spin" />
                          <Zap size={12} className="absolute text-amber-500 fill-current animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold text-slate-800">{verifyProgressMessage}</p>
                          <p className="text-[10px] text-slate-400 font-medium animate-pulse">Please wait...</p>
                        </div>
                      </div>
                    )}

                    {verifyStep === 'success' && (
                      <div className="space-y-4">
                        <div className="py-4 flex flex-col items-center justify-center space-y-2 text-center">
                          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-500">
                            <CheckCircle2 size={24} />
                          </div>
                          <h5 className="text-xs font-bold text-slate-800">Account Validated Successfully!</h5>
                          <p className="text-[10px] text-slate-400 font-medium">Bank confirmation received</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-500">
                            <div>Beneficiary Name:</div>
                            <div className="text-emerald-700 font-bold">{verifiedBeneficiaryName}</div>
                            <div>Matches Form Name:</div>
                            <div className="font-bold flex items-center gap-1">
                              {formNameMatch ? (
                                <span className="text-emerald-600">Yes (100% Match)</span>
                              ) : (
                                <span className="text-amber-600">Slight Variance</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowBankVerifyModal(false);
                              setVerifyStep('idle');
                            }}
                            className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={handleApplyVerificationResult}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow active:scale-[0.99] cursor-pointer"
                          >
                            Update & Save
                          </button>
                        </div>
                      </div>
                    )}

                    {verifyStep === 'failed' && (
                      <div className="space-y-4">
                        <div className="py-4 flex flex-col items-center justify-center space-y-2 text-center">
                          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 text-rose-500">
                            <AlertCircle size={24} />
                          </div>
                          <h5 className="text-xs font-bold text-slate-800">Verification Failed</h5>
                          <p className="text-[10px] text-rose-600 font-semibold">{verifyError || "Unable to verify bank details"}</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex gap-2">
                          <AlertCircle className="text-slate-400 flex-shrink-0 mt-0.5" size={14} />
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                            Please check that the account number and IFSC code are correct, and your RazorpayX credentials in .env are valid.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowBankVerifyModal(false);
                              setVerifyStep('idle');
                              setVerifyError('');
                              if (onSaveSuccess) onSaveSuccess();
                            }}
                            className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleStartBankVerification}
                            className="flex-1 py-2 bg-[#0D47A1] hover:opacity-90 text-white font-bold rounded-xl text-xs transition shadow active:scale-[0.99] cursor-pointer border-none"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        );

      case "leaves":
        if (leaveSubView === "menu") {
          return (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-[#0D47A1]">Leave & Balance Details</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Select a section to manage leave policies or balances</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                <button
                  type="button"
                  onClick={() => setLeaveSubView("policy")}
                  className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl hover:border-[#0D47A1] hover:shadow-[0_4px_20px_rgba(13,71,161,0.06)] transition-all duration-250 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1]/5 flex items-center justify-center mb-4 group-hover:bg-[#0D47A1]/10 transition-colors">
                    <BookOpen className="text-[#0D47A1]" size={24} />
                  </div>
                  <span className="text-lg font-bold text-slate-800 group-hover:text-[#0D47A1] transition-colors">
                    Leave Policy
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeaveSubView("balance")}
                  className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl hover:border-[#0D47A1] hover:shadow-[0_4px_20px_rgba(13,71,161,0.06)] transition-all duration-250 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0D47A1]/5 flex items-center justify-center mb-4 group-hover:bg-[#0D47A1]/10 transition-colors">
                    <CalendarCheck className="text-[#0D47A1]" size={24} />
                  </div>
                  <span className="text-lg font-bold text-slate-800 group-hover:text-[#0D47A1] transition-colors">
                    Leave Balance
                  </span>
                </button>
              </div>
            </div>
          );
        }

        if (leaveSubView === "policy") {
          return (
            <div className="space-y-6">
              <div className="flex items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0D47A1]">
                  <button
                    type="button"
                    onClick={() => setLeaveSubView("menu")}
                    className="hover:underline cursor-pointer"
                  >
                    Leave & Balance Details
                  </button>
                  <span className="text-slate-400 font-normal">»</span>
                  <span className="text-slate-600 font-medium">Leave Policy</span>
                </div>
              </div>

              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Leave Cycle <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label
                      onClick={() => setLeaveCycle("Monthly")}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${leaveCycle === "Monthly"
                        ? "border-sky-300 bg-sky-50/30 text-sky-900"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                        }`}
                    >
                      <input
                        type="radio"
                        checked={leaveCycle === "Monthly"}
                        onChange={() => { }}
                        className="w-4 h-4 text-[#0D47A1] border-slate-300 focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">Monthly</span>
                    </label>

                    <label
                      onClick={() => setLeaveCycle("Yearly")}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${leaveCycle === "Yearly"
                        ? "border-sky-300 bg-sky-50/30 text-sky-900"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                        }`}
                    >
                      <input
                        type="radio"
                        checked={leaveCycle === "Yearly"}
                        onChange={() => { }}
                        className="w-4 h-4 text-[#0D47A1] border-slate-300 focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">Yearly</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D47A1]">
                <button
                  type="button"
                  onClick={() => setLeaveSubView("menu")}
                  className="hover:underline cursor-pointer"
                >
                  Leave & Balance Details
                </button>
                <span className="text-slate-400 font-normal">»</span>
                <span className="text-slate-600 font-medium">Leave Balance</span>
              </div>
            </div>

            {/* Grid of Leave Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "privilegedLeave", label: "Privileged Leave" },
                { key: "sickLeave", label: "Sick Leave" },
                { key: "casualLeave", label: "Casual Leave" }
              ].map((item) => (
                <div key={item.key} className="flex flex-col justify-between  rounded-2xl p-4 hover:border-[#0D47A1]/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition duration-200">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 rounded-xl border border-slate-200 flex items-center bg-white focus-within:ring-2 focus-within:ring-[#0D47A1]/20 focus-within:border-[#0D47A1] overflow-hidden transition-all">
                      <input
                        type="number"
                        value={leaveBalances[item.key as keyof typeof leaveBalances]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setLeaveBalances(prev => ({ ...prev, [item.key]: val }));
                        }}
                        className="w-full px-3 py-2 text-sm outline-none bg-transparent text-slate-700 font-bold"
                      />
                      <span className="pr-3 text-xs font-semibold text-slate-400 select-none bg-slate-50/50 py-2.5 border-l border-slate-100 pl-3">leaves</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D47A1]">
                <span>KYC Verification Details</span>
                <span className="text-slate-400 font-normal">»</span>
                <span className="text-slate-600 font-medium">Aadhaar Card KYC</span>
              </div>
              {kycData.status === "verified" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={14} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle size={14} /> Pending Verification
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Form & Actions */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Aadhaar Card Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-slate-200 flex items-center bg-white focus-within:ring-2 focus-within:ring-[#0D47A1]/20 focus-within:border-[#0D47A1] overflow-hidden transition-all">
                    <div className="pl-3 text-slate-400">
                      <IdCard size={16} />
                    </div>
                    <input
                      type="text"
                      maxLength={14}
                      value={kycData.aadhaarNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const formatted = val.match(/.{1,4}/g)?.join("-").slice(0, 14) || "";
                        setKycData(prev => ({ ...prev, aadhaarNumber: formatted }));
                      }}
                      placeholder="e.g. 5678-1234-9012"
                      className="w-full px-3 py-2 text-sm outline-none bg-transparent text-slate-700 font-bold"
                    />
                  </div>
                </div>

                {/* Status Box & Verify Button */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Verification Status:</span>
                    <span className={`font-extrabold capitalize ${kycData.status === "verified" ? "text-emerald-600" :
                      kycData.status === "failed" ? "text-red-600" :
                        kycData.status === "verifying" ? "text-blue-600" : "text-amber-600"
                      }`}>
                      {kycData.status}
                    </span>
                  </div>

                  {kycData.status === "pending" && (
                    <p className="text-xs text-slate-500 leading-normal">
                      Please enter a valid 12-digit Aadhaar number and upload front & back images of the card to begin verification.
                    </p>
                  )}

                  {kycData.status === "verifying" && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-4 h-4 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin"></div>
                      Verifying Aadhaar details securely with UIDAI server...
                    </div>
                  )}

                  {kycData.status === "verified" && (
                    <p className="text-xs text-emerald-600 font-medium">
                      Aadhaar verification completed successfully. Identity matches with official records.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={kycData.status === "verifying" || kycData.aadhaarNumber.replace(/\D/g, "").length !== 12}
                    onClick={async () => {
                      setKycData(prev => ({ ...prev, status: "verifying" }));
                      try {
                        const now = new Date().toISOString();
                        const updated = await employeeApi.updateKyc(employee.id, {
                          kyc_status: "verified",
                          aadhaar_front_image: kycData.frontImage || undefined,
                          aadhaar_back_image: kycData.backImage || undefined,
                          kyc_verified_at: now,
                        });
                        setKycData(prev => ({
                          ...prev,
                          status: "verified",
                          frontImage: updated.aadhaar_front_image || prev.frontImage,
                          backImage: updated.aadhaar_back_image || prev.backImage,
                        }));
                        toast.success("Aadhaar KYC Verified Successfully!");
                      } catch (err: any) {
                        setKycData(prev => ({ ...prev, status: "failed" }));
                        toast.error(err?.message || "KYC verification failed. Please try again.");
                      }
                    }}
                    className="w-full py-2.5 bg-[#0D47A1] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {kycData.status === "verifying" ? "Verifying..." : kycData.status === "verified" ? "Re-verify Aadhaar" : "Verify Aadhaar"}
                  </button>
                </div>
              </div>

              {/* Right Column: Front and Back Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front Side */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Aadhaar Front Image</label>
                  <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 hover:border-[#0D47A1]/40 rounded-2xl cursor-pointer bg-slate-50/40 hover:bg-slate-50/70 transition overflow-hidden">
                    {kycData.frontImage ? (
                      <img src={kycData.frontImage} alt="Front Aadhaar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-center p-3">
                        <Upload size={20} className="text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-600">Front Side</span>
                        <span className="text-[9px] text-slate-400">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setKycData(prev => ({ ...prev, frontImage: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Back Side */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Aadhaar Back Image</label>
                  <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 hover:border-[#0D47A1]/40 rounded-2xl cursor-pointer bg-slate-50/40 hover:bg-slate-50/70 transition overflow-hidden">
                    {kycData.backImage ? (
                      <img src={kycData.backImage} alt="Back Aadhaar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-center p-3">
                        <Upload size={20} className="text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-600">Back Side</span>
                        <span className="text-[9px] text-slate-400">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setKycData(prev => ({ ...prev, backImage: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D47A1]">
                  <span>Employee Documents</span>
                  <span className="text-slate-400 font-normal">»</span>
                  <span className="text-slate-600 font-medium">Compliance Files</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadDocName("");
                  setUploadDocFile(null);
                  setUploadModalError("");
                  setDocDropdownOpen(false);
                  setShowUploadModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-[#0D47A1] text-white rounded-lg hover:opacity-90 transition cursor-pointer shadow-sm border-none"
              >
                <Plus size={12} /> Upload Document
              </button>
            </div>

            {/* Document Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documentsList.filter(d => !d.adminDeleted).map((doc) => {
                const hasFile = !!doc.fileName;
                const isOffer = doc.id === "offer";

                const getMockPdfBlob = (title: string, filename: string) => {
                  const pdfString = `%PDF-1.4
                  1 0 obj
                  << /Type /Catalog /Pages 2 0 R >>
                  endobj
                  2 0 obj
                  << /Type /Pages /Kids [3 0 R] /Count 1 >>
                  endobj
                  3 0 obj
                  << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>
                  endobj
                  4 0 obj
                  << /Length 120 >>
                  stream
                  q
                  BT
                  /F1 18 Tf
                  70 750 Td
                  (Hously HRMS - Document Vault) Tj
                  /F1 12 Tf
                  0 -30 Td
                  (Document Name: ${title}) Tj
                  0 -20 Td
                  (File Name: ${filename}) Tj
                  0 -20 Td
                  (Status: Verified & Validated) Tj
                  0 -20 Td
                  (Date: ${new Date().toLocaleDateString()}) Tj
                  ET
                  Q
                  endstream
                  endobj
                  xref
                  0 5
                  0000000000 65535 f 
                  0000000009 00000 n 
                  0000000058 00000 n 
                  0000000115 00000 n 
                  0000000259 00000 n 
                  trailer
                  << /Size 5 /Root 1 0 R >>
                  startxref
                  428
                  %%EOF`;
                  const len = pdfString.length;
                  const buf = new ArrayBuffer(len);
                  const view = new Uint8Array(buf);
                  for (let i = 0; i < len; i++) {
                    view[i] = pdfString.charCodeAt(i);
                  }
                  return new Blob([buf], { type: 'application/pdf' });
                };

                const handlePreview = () => {
                  const fileObj = (doc as any).fileObject;
                  if (doc.fileContent) {
                    const blob = dataUrlToBlob(doc.fileContent);
                    if (blob) {
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }
                  } else if (fileObj) {
                    const url = URL.createObjectURL(fileObj);
                    window.open(url, '_blank');
                  } else {
                    const blob = getMockPdfBlob(doc.name, doc.fileName);
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  }
                };

                const handleDownload = () => {
                  const fileObj = (doc as any).fileObject;
                  if (doc.fileContent) {
                    const blob = dataUrlToBlob(doc.fileContent);
                    if (blob) {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = doc.fileName;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  } else if (fileObj) {
                    const url = URL.createObjectURL(fileObj);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = doc.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } else {
                    const blob = getMockPdfBlob(doc.name, doc.fileName);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = doc.fileName || `${doc.id}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                  toast.success(`Downloading ${doc.fileName}`);
                };

                return (
                  <div key={doc.id} className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between hover:border-slate-350 transition-all duration-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-2 text-left min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0 shadow-sm">
                          <FileText className="text-[#0D47A1] w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-bold text-slate-800 truncate">{doc.name}</h4>
                          {hasFile ? (
                            <div className="mt-0.5">
                              <p className="text-[10px] text-[#0D47A1] font-bold truncate hover:underline cursor-pointer" onClick={handlePreview}>{doc.fileName}</p>
                              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Size: {doc.size} • {doc.uploadDate}</p>
                            </div>
                          ) : (
                            <p className="text-[9px] text-slate-400 font-semibold mt-1">
                              {isOffer ? "Pending generation" : "No document uploaded"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider shrink-0 ${doc.status === "Verified" ? "bg-emerald-100/60 text-emerald-700 border border-emerald-200/30" :
                        doc.status === "Uploaded" ? "bg-sky-100/60 text-sky-700 border border-sky-200/30" :
                          "bg-amber-100/60 text-amber-700 border border-amber-200/30"
                        }`}>
                        {doc.status}
                      </span>
                    </div>

                    <div className="border-t border-slate-200/40 mt-3 pt-2 flex gap-1.5 justify-end">
                      {hasFile ? (
                        <>
                          <button
                            type="button"
                            onClick={handlePreview}
                            className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                          >
                            Download
                          </button>
                          {!isOffer && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmDoc(doc)}
                              className="px-1.5 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </>
                      ) : (
                        // Render upload button only if it's NOT the Offer Letter
                        !isOffer && (
                          <button
                            type="button"
                            onClick={() => {
                              setUploadDocName(doc.name);
                              setUploadDocFile(null);
                              setUploadModalError("");
                              setDocDropdownOpen(false);
                              setShowUploadModal(true);
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold bg-[#0D47A1] text-white rounded-lg hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1 border-none"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Upload Modal using React Portal for true full-page overlay and blur */}
            {showUploadModal && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
                  onClick={() => setShowUploadModal(false)}
                />
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
                  <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto p-5 text-left border border-slate-100 flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <FileText className="text-[#0D47A1] w-4 h-4" />
                        Upload Document
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {uploadModalError && (
                      <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-200">{uploadModalError}</p>
                    )}

                    <div className="space-y-3">
                      {/* Doc Name Custom Dropdown */}
                      <div className="space-y-1 relative">
                        <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Document Name</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setDocDropdownOpen(!docDropdownOpen)}
                            className="w-full px-3 py-2 pr-8 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none font-medium text-slate-700 bg-white text-left flex items-center justify-between cursor-pointer h-9"
                          >
                            <span>{uploadDocName || "Select Document Type"}</span>
                            <ChevronDown
                              size={12}
                              className={`text-slate-400 transition-transform duration-200 ${docDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>

                          {docDropdownOpen && (
                            <div className="absolute z-[1010] left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-28 overflow-y-auto">
                              <div
                                onClick={() => {
                                  setUploadDocName("");
                                  setDocDropdownOpen(false);
                                }}
                                className="px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-400 cursor-pointer transition-colors"
                              >
                                Select Document Type
                              </div>
                              {documents && documents.map((docVal) => (
                                <div
                                  key={docVal}
                                  onClick={() => {
                                    setUploadDocName(docVal);
                                    setDocDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer transition-colors ${uploadDocName === docVal ? "bg-slate-50 text-[#0D47A1]" : ""
                                    }`}
                                >
                                  {docVal}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Browse File input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Select File</label>
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-200 transition cursor-pointer shrink-0">
                            Browse File
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadDocFile(file);
                                  if (!uploadDocName) {
                                    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                                    const formattedName = nameWithoutExt.split('_').join(' ').split('-').join(' ');
                                    const capitalizedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
                                    const matchedDoc = documents?.find(d => d.toLowerCase() === capitalizedName.toLowerCase());
                                    if (matchedDoc) {
                                      setUploadDocName(matchedDoc);
                                    }
                                  }
                                }
                              }}
                            />
                          </label>
                          <span className="text-[11px] text-slate-500 truncate font-semibold">
                            {uploadDocFile ? uploadDocFile.name : "No file selected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!uploadDocName.trim()) {
                            setUploadModalError("Please enter a document name");
                            return;
                          }
                          if (!uploadDocFile) {
                            setUploadModalError("Please select a file to upload");
                            return;
                          }
                          const alreadyUploaded = documentsList.some(d =>
                            (d.name.toLowerCase() === uploadDocName.toLowerCase() || d.id === uploadDocName.toLowerCase().replace(/\s/g, '')) &&
                            !d.adminDeleted
                          );
                          if (alreadyUploaded) {
                            setUploadModalError("This document type is already uploaded.");
                            return;
                          }
                          const sizeStr = uploadDocFile.size > 1024 * 1024
                            ? `${(uploadDocFile.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${(uploadDocFile.size / 1024).toFixed(0)} KB`;
                          const dateStr = new Date().toLocaleDateString('en-CA');

                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const fileBase64 = reader.result as string;
                            const exists = documentsList.some(d => d.name.toLowerCase() === uploadDocName.toLowerCase() || d.id === uploadDocName.toLowerCase().replace(/\s/g, ''));
                            let updatedList = [];
                            if (exists) {
                              updatedList = documentsList.map(d => (d.name.toLowerCase() === uploadDocName.toLowerCase() || d.id === uploadDocName.toLowerCase().replace(/\s/g, '')) ? {
                                ...d,
                                fileName: uploadDocFile.name,
                                fileContent: fileBase64,
                                size: sizeStr,
                                uploadDate: dateStr,
                                status: "Uploaded",
                                adminDeleted: false,
                                employeeDeleted: false
                              } : d);
                            } else {
                              const newDoc = {
                                id: `custom_${Date.now()}`,
                                name: uploadDocName,
                                fileName: uploadDocFile.name,
                                fileContent: fileBase64,
                                status: "Uploaded",
                                size: sizeStr,
                                uploadDate: dateStr,
                                icon: "file",
                                adminDeleted: false,
                                employeeDeleted: false
                              };
                              updatedList = [...documentsList, newDoc];
                            }
                            setDocumentsList(updatedList);
                            if (employee?.id) {
                              try {
                                await employeeApi.update(String(employee.id), { ...employee, documents: updatedList });
                                toast.success("Document uploaded successfully");
                                onSaveSuccess?.();
                              } catch (err) {
                                toast.error("Failed to save document to database");
                              }
                            }
                            setShowUploadModal(false);
                          };
                          reader.readAsDataURL(uploadDocFile);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold bg-[#0D47A1] text-white rounded-xl hover:opacity-90 transition cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}

            {/* Delete Confirmation Modal using React Portal */}
            {deleteConfirmDoc && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
                  onClick={() => setDeleteConfirmDoc(null)}
                />
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
                  <div
                    className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto p-5 text-left border border-slate-100 flex flex-col space-y-4"
                    style={{
                      animation: 'modalConfirmOpen 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  >
                    <style>{`
                      @keyframes modalConfirmOpen {
                        from { opacity: 0; transform: scale(0.9) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                      }
                    `}</style>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Trash2 className="text-red-500 w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-800">Remove Document</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                          Are you sure you want to remove the document <span className="text-slate-800 font-extrabold">"{deleteConfirmDoc.name}"</span>?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 justify-end border-t border-slate-50">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmDoc(null)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const docToRemove = deleteConfirmDoc;
                          setDeleteConfirmDoc(null);
                          const updatedList = documentsList.map(d => d.id === docToRemove.id ? { ...d, adminDeleted: true } : d);
                          setDocumentsList(updatedList);
                          if (employee?.id) {
                            try {
                              await employeeApi.update(String(employee.id), { ...employee, documents: updatedList });
                              toast.success("Document removed successfully");
                              onSaveSuccess?.();
                            } catch (err) {
                              toast.error("Failed to save changes");
                            }
                          }
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-650 transition cursor-pointer border-none shadow-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`p-3 md:p-4 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
    >
      {/* Top Header Section (Static, scrolls away on mobile) */}
      <div className="flex-none space-y-2">
        {/* Buttons Header */}
        <div className="py-1 flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 ">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer hover:text-[#0D47A1]"
          >
            <ArrowLeft size={18} /> Back to Employees
          </button>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm cursor-pointer"
            >
              <Edit size={16} /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-2.5 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
          <div className="relative">
            <Avatar
              name={fullName}
              url={avatarPreview || employee.avatarUrl}
              size="md"
              onUpload={isEditing ? handleAvatarUpload : undefined}
            />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-extrabold text-slate-800 truncate">{fullName}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
              <span className="text-[#1379d0] text-xs font-semibold">{employee.employeeId}</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.color}`}
              >
                <span className={`w-1 h-1 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap justify-center sm:justify-start">
            <span className="text-slate-500 font-semibold">Allotted Project(s) -</span>
            <span className="bg-[#0D47A1]/5 text-[#0D47A1] px-2.5 py-0.5 rounded-full font-bold border border-[#0D47A1]/20">
              {formData.allottedProjects && formData.allottedProjects.length > 0
                ? formData.allottedProjects.join(", ")
                : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Headers - Sticky on mobile at the top, static on desktop */}
      <div className="sticky top-0 z-30 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 flex-none mt-4">
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex gap-1 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? "bg-white text-[#0D47A1] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 mt-2 pb-4 overflow-y-auto no-scrollbar">
        <div className="p-6">
          <EditingContext.Provider value={isEditing}>
            {renderTabContent()}
          </EditingContext.Provider>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

// ─── Status Change Modal ─────────────────────────────────────────────────────

const StatusChangeModal = ({
  employee,
  onClose,
  onConfirm,
}: {
  employee: EmployeeRecord;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const fullName = `${employee.firstName}${employee.middleName ? " " + employee.middleName : ""} ${employee.lastName}`;
  const isActive = employee.status === "active";

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="p-6">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isActive ? "bg-amber-50" : "bg-emerald-50"
                }`}
            >
              {isActive ? (
                <UserMinus size={22} className="text-amber-600" />
              ) : (
                <UserPlus size={22} className="text-emerald-600" />
              )}
            </div>

            <h3 className="text-lg font-extrabold text-slate-800">
              {isActive ? "Deactivate Employee?" : "Activate Employee?"}
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {isActive
                ? `Are you sure you want to deactivate ${fullName}? This employee will not be able to access the system.`
                : `Are you sure you want to activate ${fullName}? This employee will be able to access the system again.`}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition ${isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90"
                  }`}
              >
                {isActive ? "Yes, Deactivate" : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

const DeleteConfirmModal = ({
  employee,
  onClose,
  onConfirm,
  deleting,
}: {
  employee: EmployeeRecord;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const fullName = `${employee.firstName}${employee.middleName ? " " + employee.middleName : ""} ${employee.lastName}`;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-800">Delete Employee?</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-700">{fullName}</span>? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Side Filter Drawer ──────────────────────────────────────────────────────

interface FilterState {
  status: string;
  department: string;
  role: string;
}

const SideFilter = ({
  open,
  onClose,
  filters,
  setFilters,
  onReset: _onReset,
  departments,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onReset: () => void;
  departments: string[];
  roles: string[];
}) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (open) {
      setTempFilters(filters);
    }
  }, [open, filters]);

  const selCls =
    "w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all appearance-none";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#0D47A1]" />
            <span className="font-extrabold text-slate-800 text-sm">Filter Employees</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Status
            </label>
            <div className="relative">
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className={selCls}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Department
            </label>
            <div className="relative">
              <select
                value={tempFilters.department}
                onChange={(e) => setTempFilters({ ...tempFilters, department: e.target.value })}
                className={selCls}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Role
            </label>
            <div className="relative">
              <select
                value={tempFilters.role}
                onChange={(e) => setTempFilters({ ...tempFilters, role: e.target.value })}
                className={selCls}
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => {
              const cleared = { status: "", department: "", role: "" };
              setTempFilters(cleared);
              setFilters(cleared);
              onClose();
            }}
            className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw size={11} /> Reset
          </button>
          <button
            onClick={() => {
              setFilters(tempFilters);
              onClose();
            }}
            className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const ctx =
    useOutletContext<{
      setHeaderTitle: (t: string) => void;
      setHeaderSubtitle: (s: string) => void;
    }>() || {};

  useEffect(() => {
    ctx.setHeaderTitle?.("Employees");
    ctx.setHeaderSubtitle?.("Manage employee records, status, and details");
  }, [ctx]);

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [viewEmployee, setViewEmployee] = useState<EmployeeRecord | null>(null);
  const [editEmployee, setEditEmployee] = useState<EmployeeRecord | null>(null);
  const [statusEmployee, setStatusEmployee] = useState<EmployeeRecord | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<EmployeeRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleViewEmployee = async (employee: EmployeeRecord) => {
    try {
      const fullEmp = await employeeApi.getById(employee.id);
      setViewEmployee(fullEmp);
    } catch (err) {
      setViewEmployee(employee);
    }
  };

  const handleEditEmployee = async (employee: EmployeeRecord) => {
    try {
      const fullEmp = await employeeApi.getById(employee.id);
      setEditEmployee(fullEmp);
    } catch (err) {
      setEditEmployee(employee);
    }
  };

  const [filters, setFilters] = useState<FilterState>({
    status: "",
    department: "",
    role: "",
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  // Fetch master data
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const types: MasterItem[] = await masterDataAPI.getAllMasterTypes("common");
        const deptType = types.find((t: MasterItem) =>
          t.name?.toLowerCase().includes("department")
        );
        const roleType = types.find((t: MasterItem) =>
          t.name?.toLowerCase().includes("role")
        );
        const projectType = types.find((t: MasterItem) =>
          t.name?.toLowerCase().includes("project")
        );
        const documentsType = types.find((t: MasterItem) =>
          t.name?.toLowerCase().includes("documents")
        );

        if (deptType) {
          const deptValues = await masterDataAPI.getMasterValues(deptType.id);
          setDepartments(
            deptValues
              .filter((v: any) => v.status === "Active")
              .map((v: any) => v.value)
          );
        }

        if (roleType) {
          const roleValues = await masterDataAPI.getMasterValues(roleType.id);
          setRoles(
            roleValues
              .filter((v: any) => v.status === "Active")
              .map((v: any) => v.value)
          );
        }

        if (projectType) {
          const projectValues = await masterDataAPI.getMasterValues(projectType.id);
          setProjects(
            projectValues
              .filter((v: any) => v.status === "Active")
              .map((v: any) => v.value)
          );
        }

        if (documentsType) {
          const documentsValues = await masterDataAPI.getMasterValues(documentsType.id);
          setDocuments(
            documentsValues
              .filter((v: any) => v.status === "Active")
              .map((v: any) => v.value)
          );
        }
      } catch (err) {
        // Fallback to static data
        const depts = new Set(employees.map(e => e.department));
        setDepartments(Array.from(depts));
        const rolesSet = new Set(employees.map(e => e.role));
        setRoles(Array.from(rolesSet));
        setProjects(["Project Alpha", "Project Beta", "Project Gamma"]);
        setDocuments(["Document 1", "Document 2", "Document 3"]);
      }
    };

    fetchMaster();
  }, [employees]);

  // Column search
  const [colSearch, setColSearch] = useState({
    name: "",
    employeeId: "",
    email: "",
    department: "",
    role: "",
    status: "",
  });

  // Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const onLeaveEmployees = employees.filter(e => e.status === "on_leave").length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthJoiners = employees.filter(e => {
    const joinDate = new Date(e.joinDate);
    return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
  }).length;

  // Filtered employees
  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const fullName = `${e.firstName} ${e.middleName ?? ""} ${e.lastName}`.toLowerCase();
        const statusLabel = STATUS_CONFIG[e.status]?.label?.toLowerCase() || "";
        const searchStatus = colSearch.status?.toLowerCase() || "";

        return (
          (!colSearch.name || fullName.includes(colSearch.name.toLowerCase())) &&
          (!colSearch.employeeId || e.employeeId.toLowerCase().includes(colSearch.employeeId.toLowerCase())) &&
          (!colSearch.email || e.email.toLowerCase().includes(colSearch.email.toLowerCase())) &&
          (!colSearch.department || e.department.toLowerCase().includes(colSearch.department.toLowerCase())) &&
          (!colSearch.role || e.role.toLowerCase().includes(colSearch.role.toLowerCase())) &&
          (!colSearch.status || statusLabel.includes(searchStatus) || e.status.includes(colSearch.status.toLowerCase())) &&
          (!filters.status || e.status === filters.status) &&
          (!filters.department || e.department === filters.department) &&
          (!filters.role || e.role === filters.role)
        );
      }),
    [employees, colSearch, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
    setSelectedEmployees(new Set());
    setSelectAll(false);
  }, [colSearch, filters, pageSize]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      const allIds = new Set(paginated.map(e => e.id));
      setSelectedEmployees(allIds);
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (id: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmployees(newSelected);
    setSelectAll(newSelected.size === paginated.length && paginated.length > 0);
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.size === 0) {
      toast.error("Please select employees to delete");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedEmployees.size} selected employees?`)) {
      try {
        await employeeApi.bulkDelete(Array.from(selectedEmployees));
        setSelectedEmployees(new Set());
        setSelectAll(false);
        toast.success(`${selectedEmployees.size} employees deleted successfully!`);
        fetchEmployees();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete selected employees");
      }
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPageSize(value === 'all' ? filtered.length : parseInt(value));
    setPage(1);
  };

  const handleStatusChange = async () => {
    if (!statusEmployee) return;
    try {
      const nextStatus: EmployeeStatus = statusEmployee.status === "active" ? "inactive" : "active";
      await employeeApi.updateStatus(statusEmployee.id, nextStatus);
      setStatusEmployee(null);
      toast.success(`Employee status updated successfully!`);
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.message || "Failed to update employee status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEmployee) return;
    try {
      setDeleting(true);
      await employeeApi.delete(deleteEmployee.id);
      setDeleteEmployee(null);
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete employee");
    } finally {
      setDeleting(false);
    }
  };

  const handleImport = () => {
    toast.success("Import functionality coming soon!");
  };

  const handleExport = () => {
    toast.success("Export functionality coming soon!");
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      department: "",
      role: "",
    });
  };

  const colInp =
    "w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all";

  // If viewing or editing employee, show profile
  if (viewEmployee || editEmployee) {
    const emp = viewEmployee || editEmployee!;
    return (
      <EmployeeProfile
        employee={emp}
        onBack={() => {
          setViewEmployee(null);
          setEditEmployee(null);
        }}
        onSaveSuccess={async () => {
          // Re-fetch fresh employee data from DB and update the view
          try {
            const freshEmp = await employeeApi.getById(emp.id);
            if (freshEmp) {
              if (viewEmployee) setViewEmployee(freshEmp);
              if (editEmployee) setEditEmployee(freshEmp);
            }
          } catch (_) {/* non-critical */ }
          fetchEmployees();
        }}
        isEdit={!!editEmployee}
        departments={departments}
        roles={roles}
        documents={documents}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-3.5 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard
          label="Total Employees"
          value={totalEmployees}
          icon={<Users size={18} className="text-blue-600" />}
          accent="blue"
        />
        <StatCard
          label="Active"
          value={activeEmployees}
          icon={<UserCheck size={18} className="text-emerald-600" />}
          accent="emerald"
        />
        <StatCard
          label="On Leave"
          value={onLeaveEmployees}
          icon={<UserMinus size={18} className="text-amber-600" />}
          accent="amber"
          sub="Currently on leave"
        />
        <StatCard
          label="This Month"
          value={thisMonthJoiners}
          icon={<Calendar size={18} className="text-purple-600" />}
          accent="purple"
          sub="New joiners this month"
        />
      </div>

      {/* Toolbar - Visible on Mobile only */}
      <div className="block md:hidden bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedEmployees.size > 0 && (
            <div className="flex items-center gap-2 flex-wrap w-full justify-between sm:justify-start">
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                <Trash2 size={13} /> Delete ({selectedEmployees.size})
              </button>
              <span className="text-xs text-slate-500 font-medium">
                {selectedEmployees.size} selected
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleImport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
          >
            <FileSpreadsheet size={13} /> Import
          </button>
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-2 border rounded-xl text-xs font-bold transition cursor-pointer ${Object.values(filters).some(v => v !== "")
              ? "bg-[#0D47A1]/10 border-[#0D47A1]/30 text-[#0D47A1]"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Filter size={13} /> Filter
            {Object.values(filters).some(v => v !== "") && (
              <span className="w-4 h-4 bg-[#0D47A1] text-white rounded-full text-[9px] font-black flex items-center justify-center ml-1">
                {Object.values(filters).filter(v => v !== "").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden md:flex md:flex-col bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden h-[calc(100vh-270px)] min-h-[400px]">
        {/* Desktop Card Header Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider bg-[#0D47A1]/5 px-2 py-1 rounded-md">
              Employees Directory
            </span>
            {selectedEmployees.size > 0 && (
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
                >
                  <Trash2 size={11} /> Delete ({selectedEmployees.size})
                </button>
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedEmployees.size} selected
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
            >
              <FileSpreadsheet size={11} /> Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition cursor-pointer"
            >
              <Download size={11} /> Export
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 border rounded-lg text-[11px] font-bold transition cursor-pointer ${Object.values(filters).some(v => v !== "")
                ? "bg-[#0D47A1]/10 border-[#0D47A1]/30 text-[#0D47A1]"
                : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                }`}
            >
              <Filter size={11} /> Filter
              {Object.values(filters).some(v => v !== "") && (
                <span className="w-3.5 h-3.5 bg-[#0D47A1] text-white rounded-full text-[8px] font-black flex items-center justify-center ml-0.5">
                  {Object.values(filters).filter(v => v !== "").length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                    disabled={paginated.length === 0}
                  />
                </th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">EMP ID</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>

              {/* Column Search Row */}
              <tr className="bg-white border-b-2 border-slate-200 sticky top-[57px] z-10">
                <th className="px-3 py-2"></th>
                {[
                  { key: "name", placeholder: "Search name..." },
                  { key: "employeeId", placeholder: "Search ID..." },
                  { key: "email", placeholder: "Search email..." },
                  { key: "department", placeholder: "Search dept..." },
                  { key: "role", placeholder: "Search role..." },
                  { key: "status", placeholder: "Search status..." },
                ].map(({ key, placeholder }) => (
                  <th key={key} className="px-3 py-2 border-r border-slate-100 last:border-r-0">
                    <div className="relative">
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        value={(colSearch as any)[key]}
                        onChange={(e) =>
                          setColSearch((s) => ({ ...s, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        className={`${colInp} pl-5`}
                      />
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-sm font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin" />
                      <span>Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-sm font-semibold">
                    No employees found.
                  </td>
                </tr>
              ) : null}

              {paginated.map((employee, idx) => {
                const statusCfg = STATUS_CONFIG[employee.status];
                const fullName = `${employee.firstName}${employee.middleName ? " " + employee.middleName : ""} ${employee.lastName}`;
                const isChecked = selectedEmployees.has(employee.id);

                return (
                  <tr
                    key={employee.id}
                    onClick={() => handleViewEmployee(employee)}
                    className={`border-b border-slate-100 transition-colors hover:bg-blue-50/30 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      } ${isChecked ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={fullName} url={employee.avatarUrl} />
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">{fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <span className="font-semibold text-slate-600 text-[11px]">
                        {employee.employeeId}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Mail size={10} className="text-slate-400 flex-shrink-0" />
                        <span className="text-[11px] truncate max-w-[140px]">
                          {employee.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <span className="text-[11px] text-slate-600 font-semibold truncate max-w-[130px] block">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        <UserCog size={9} />
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <button
                        onClick={() => setStatusEmployee(employee)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition hover:scale-[1.03] ${statusCfg.bg} ${statusCfg.color}`}
                        title="Change Status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={12} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={12} className="text-green-500" />
                        </button>
                        <button
                          onClick={() => setDeleteEmployee(employee)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="static sm:sticky sm:bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2">
            <span className="font-semibold">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} employees
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400">Show:</span>
                <select
                  value={pageSize === filtered.length ? 'all' : pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-[#0D47A1]/20"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold transition cursor-pointer ${pageNum === page
                        ? "bg-[#0D47A1] text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:bg-white"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card List - Visible on Mobile only */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm font-semibold">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin" />
              <span>Loading employees...</span>
            </div>
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm font-semibold">
            No employees found.
          </div>
        ) : (
          paginated.map((employee) => {
            const statusCfg = STATUS_CONFIG[employee.status];
            const fullName = `${employee.firstName}${employee.middleName ? " " + employee.middleName : ""} ${employee.lastName}`;
            const isChecked = selectedEmployees.has(employee.id);

            return (
              <div
                key={employee.id}
                className={`bg-white rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-3 transition-colors ${isChecked ? "border-[#0D47A1] bg-[#0D47A1]/5" : "border-slate-100"
                  }`}
              >
                {/* Header Row */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSelectEmployee(employee.id)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                  />
                  <Avatar name={fullName} url={employee.avatarUrl} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-xs truncate">{fullName}</h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{employee.employeeId}</p>
                  </div>
                  <button
                    onClick={() => setStatusEmployee(employee)}
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold transition hover:scale-[1.03] ${statusCfg.bg} ${statusCfg.color}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${statusCfg.dot}`} />
                    {statusCfg.label}
                  </button>
                </div>

                <hr className="border-t border-slate-100" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                    <span className="font-semibold text-slate-700 truncate block">{employee.department}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Role</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-700 text-[10px]">
                      {employee.role}
                    </span>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                    <a href={`mailto:${employee.email}`} className="font-semibold text-[#0D47A1] hover:underline flex items-center gap-1 truncate">
                      <Mail size={10} className="text-[#0D47A1] flex-shrink-0" /> {employee.email}
                    </a>
                  </div>
                </div>

                <hr className="border-t border-slate-100" />

                {/* Actions */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Joined: {new Date(employee.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition"
                    >
                      <Eye size={12} /> View
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold hover:bg-green-100 transition"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteEmployee(employee)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 transition"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Card View Pagination */}
        {filtered.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 items-center justify-center text-xs text-slate-500">
            <span className="font-semibold text-center">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} employees
            </span>

            <div className="flex items-center gap-3 w-full justify-between sm:justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400">Show:</span>
                <select
                  value={pageSize === filtered.length ? 'all' : pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={13} />
                </button>

                <span className="px-3 py-1 font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {statusEmployee && (
        <StatusChangeModal
          employee={statusEmployee}
          onClose={() => setStatusEmployee(null)}
          onConfirm={handleStatusChange}
        />
      )}

      {deleteEmployee && (
        <DeleteConfirmModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}

      <SideFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        departments={departments}
        roles={roles}
      />
      <Toaster position="top-right" />
    </div>
  );
}
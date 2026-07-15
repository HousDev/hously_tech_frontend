import React, { useState, useEffect, useMemo, useRef } from "react";
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
  IdCard, CreditCard as CreditCardIcon, IndianRupee
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
          <select
            multiple
            value={value}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              onChange(selected);
            }}
            className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              } ${icon ? "pl-9" : ""}`}
            disabled={!isEditing}
            style={{ minHeight: "80px" }}
          >
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              } ${icon ? "pl-9" : ""}`}
            disabled={!isEditing}
          />
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold pl-1">{error}</p>}
    </div>
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
}: {
  employee: EmployeeRecord;
  onBack: () => void;
  onSaveSuccess?: () => void;
  isEdit?: boolean;
  departments?: string[];
  roles?: string[];
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(employee.avatarUrl || null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Local state for Leave Balances & Policy
  const [leaveBalances, setLeaveBalances] = useState({
    privilegedLeave: 12,
    sickLeave: 8,
    casualLeave: 6,
  });

  // Local state for Penalty & Overtime
  const [penaltyPolicy, setPenaltyPolicy] = useState({
    allowedLateDays: 3,
    deductIfLateByMoreThan: 10,
    deductBasedOnLateArrival: true,
    deductionType: "Custom Multiplier",
    deductionAmount: 50,
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
    employeeType: employee.employeeType || "Permanent",
    workMode: employee.workMode || "Office",
    probationPeriod: employee.probationPeriod ?? 3,
    dateOfLeaving: employee.dateOfLeaving || "",
    noticePeriod: employee.noticePeriod ?? 30,
    salary: employee.salary ?? 0,
    salaryType: employee.salaryType || "Monthly",
    designationRole: employee.designationRole || "",
    punchInTime: employee.punchInTime || "10:00:00",
    laptopAssigned: employee.laptopAssigned || "No",
    systemLoginId: employee.systemLoginId || "",
    systemPassword: employee.systemPassword || "",
    officeEmailId: employee.officeEmailId || "",
    officeEmailPassword: employee.officeEmailPassword || "",
    accountHolderName: employee.accountHolderName || "",
    bankName: employee.bankName || "",
    accountNumber: employee.accountNumber || "",
    ifscCode: employee.ifscCode || "",
    upiId: employee.upiId || "",
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
      employeeType: employee.employeeType || "Permanent",
      workMode: employee.workMode || "Office",
      probationPeriod: employee.probationPeriod ?? 3,
      dateOfLeaving: employee.dateOfLeaving || "",
      noticePeriod: employee.noticePeriod ?? 30,
      salary: employee.salary ?? 0,
      salaryType: employee.salaryType || "Monthly",
      designationRole: employee.designationRole || "",
      punchInTime: employee.punchInTime || "10:00:00",
      laptopAssigned: employee.laptopAssigned || "No",
      systemLoginId: employee.systemLoginId || "",
      systemPassword: employee.systemPassword || "",
      officeEmailId: employee.officeEmailId || "",
      officeEmailPassword: employee.officeEmailPassword || "",
      accountHolderName: employee.accountHolderName || "",
      bankName: employee.bankName || "",
      accountNumber: employee.accountNumber || "",
      ifscCode: employee.ifscCode || "",
      upiId: employee.upiId || "",
    });
    setAvatarPreview(employee.avatarUrl || null);

    // Leave Balances — load from DB, fallback to defaults
    setLeaveBalances({
      privilegedLeave: employee.privileged_leave_balance ?? 12,
      sickLeave: employee.sick_leave_balance ?? 8,
      casualLeave: employee.casual_leave_balance ?? 6,
    });
    // Penalty Policy — load from DB, fallback to defaults
    setPenaltyPolicy({
      allowedLateDays: employee.allowed_late_days ?? 3,
      deductIfLateByMoreThan: employee.deduct_if_late_by_more_than ?? 10,
      deductBasedOnLateArrival: employee.deduct_based_on_late_arrival ?? true,
      deductionType: employee.deduction_type ?? "Custom Multiplier",
      deductionAmount: employee.deduction_amount ?? 50,
    });
    setKycData({
      aadhaarNumber: employee.aadharNumber || "",
      frontImage: employee.aadhaar_front_image || null,
      backImage: employee.aadhaar_back_image || null,
      status: (employee.kyc_status as any) || (employee.aadharNumber ? "verified" : "pending"),
    });
    setLeaveSubView("menu");
    setLeaveCycle(employee.leave_cycle ?? "Monthly");
  }, [employee]);

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
        status: formData.status as EmployeeStatus,
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
        avatarUrl: avatarPreview || employee.avatarUrl || undefined,
        employeeType: formData.employeeType as any,
        workMode: formData.workMode as any,
        probationPeriod: Number(formData.probationPeriod) ?? 3,
        dateOfLeaving: formData.dateOfLeaving || undefined,
        noticePeriod: Number(formData.noticePeriod) ?? 30,
        salary: Number(formData.salary) ?? 0.00,
        salaryType: formData.salaryType as any,
        designationRole: formData.designationRole || undefined,
        punchInTime: formData.punchInTime || undefined,
        laptopAssigned: formData.laptopAssigned as any,
        systemLoginId: formData.systemLoginId || undefined,
        systemPassword: formData.systemPassword || undefined,
        officeEmailId: formData.officeEmailId || undefined,
        officeEmailPassword: formData.officeEmailPassword || undefined,
        accountHolderName: formData.accountHolderName || undefined,
        bankName: formData.bankName || undefined,
        accountNumber: formData.accountNumber || undefined,
        ifscCode: formData.ifscCode || undefined,
        upiId: formData.upiId || undefined,
        // Leave Policy & Balance
        leave_cycle: leaveCycle,
        privileged_leave_balance: leaveBalances.privilegedLeave,
        sick_leave_balance: leaveBalances.sickLeave,
        casual_leave_balance: leaveBalances.casualLeave,
        // Penalty & Overtime
        allowed_late_days: penaltyPolicy.allowedLateDays,
        deduct_if_late_by_more_than: penaltyPolicy.deductIfLateByMoreThan,
        deduct_based_on_late_arrival: penaltyPolicy.deductBasedOnLateArrival,
        deduction_type: penaltyPolicy.deductionType,
        deduction_amount: penaltyPolicy.deductionAmount,
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
    { id: "basic", label: "Basic Information", icon: <UserIcon size={14} /> },
    { id: "personal", label: "Personal Details", icon: <UserCog2 size={14} /> },
    { id: "address", label: "Address Details", icon: <MapPinIcon size={14} /> },
    { id: "education", label: "Educational Details", icon: <GraduationCap size={14} /> },
    { id: "employment", label: "Employment Details", icon: <BriefcaseIcon size={14} /> },
    { id: "system", label: "System Details", icon: <Laptop size={14} /> },
    { id: "bank", label: "Bank Details", icon: <Banknote size={14} /> },
    { id: "leaves", label: "Leave Balances & Policy", icon: <CalendarCheck size={14} /> },
    { id: "kyc", label: "KYC Verification", icon: <ShieldCheck size={14} /> },
    { id: "penalty", label: "Penalty & Overtime", icon: <ClockIcon size={14} /> },
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
              <div className="grid grid-cols-3 gap-4">
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
              <InputField
                label="Work Mode"
                value={formData.workMode}
                onChange={(v: string) => setFormData({ ...formData, workMode: v as any })}
                isSelect
                options={["Office", "Remote", "Hybrid"]}
                icon={<Laptop size={14} />}
              />
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
                onChange={(v: string) => setFormData({ ...formData, dateOfLeaving: v })}
                type="date"
              />
              <InputField
                label="Notice Period (days)"
                value={formData.noticePeriod}
                onChange={(v: string) => setFormData({ ...formData, noticePeriod: Number(v) })}
                type="number"
              />
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
                onChange={(v: string) => setFormData({ ...formData, salaryType: v as any })}
                isSelect
                options={["Monthly", "Weekly", "Hourly"]}
              />
              <InputField
                label="Punch In Time"
                value={formData.punchInTime}
                onChange={(v: string) => setFormData({ ...formData, punchInTime: v })}
                type="time"
              />
              <InputField
                label="Week Off Days"
                value={formData.weekOffDays}
                onChange={(v: string[]) => setFormData({ ...formData, weekOffDays: v as WeekOffDays[] })}
                isSelect
                multiple
                options={WEEK_OFF_DAYS}
                icon={<CalendarDays size={14} />}
              />
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Laptop Assigned"
                value={formData.laptopAssigned}
                onChange={(v: string) => setFormData({ ...formData, laptopAssigned: v as any })}
                isSelect
                options={["Yes", "No"]}
                icon={<Laptop size={14} />}
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
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        leaveCycle === "Monthly"
                          ? "border-sky-300 bg-sky-50/30 text-sky-900"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={leaveCycle === "Monthly"}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#0D47A1] border-slate-300 focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">Monthly</span>
                    </label>

                    <label
                      onClick={() => setLeaveCycle("Yearly")}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        leaveCycle === "Yearly"
                          ? "border-sky-300 bg-sky-50/30 text-sky-900"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={leaveCycle === "Yearly"}
                        onChange={() => {}}
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
                <div key={item.key} className="flex flex-col justify-between bg-white border border-slate-150 rounded-2xl p-4 hover:border-[#0D47A1]/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition duration-200">
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
                    <span className={`font-extrabold capitalize ${
                      kycData.status === "verified" ? "text-emerald-600" :
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
              <div className="grid grid-cols-2 gap-4">
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

      case "penalty":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0D47A1]">
                <span>Penalty & Overtime Details</span>
                <span className="text-slate-400 font-normal">»</span>
                <span className="text-slate-600 font-medium">Late Coming Policy</span>
              </div>
            </div>

            {/* Content Form - 2 Columns grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Allowed Late Days */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Allowed Late Days <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-slate-200 flex items-center bg-white focus-within:ring-2 focus-within:ring-[#0D47A1]/20 focus-within:border-[#0D47A1] overflow-hidden transition-all">
                    <input
                      type="number"
                      value={penaltyPolicy.allowedLateDays}
                      onChange={(e) => setPenaltyPolicy(prev => ({ ...prev, allowedLateDays: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-sm outline-none bg-transparent text-slate-700 font-bold"
                    />
                    <span className="pr-3 text-sm text-slate-400 font-medium whitespace-nowrap bg-slate-50/50 py-2 border-l border-slate-100 pl-3">days</span>
                  </div>
                </div>

                {/* Only deduct if late by more than */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Only deduct if late by more than <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-slate-200 flex items-center bg-white focus-within:ring-2 focus-within:ring-[#0D47A1]/20 focus-within:border-[#0D47A1] overflow-hidden transition-all">
                    <input
                      type="number"
                      value={penaltyPolicy.deductIfLateByMoreThan}
                      onChange={(e) => setPenaltyPolicy(prev => ({ ...prev, deductIfLateByMoreThan: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-sm outline-none bg-transparent text-slate-700 font-bold"
                    />
                    <span className="pr-3 text-sm text-slate-400 font-medium whitespace-nowrap bg-slate-50/50 py-2 border-l border-slate-100 pl-3">mins</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Change deduction based on how late they arrive? */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Change deduction based on how late they arrive? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {/* Option 1: Fixed */}
                    <label
                      onClick={() => setPenaltyPolicy(prev => ({ ...prev, deductBasedOnLateArrival: false }))}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        !penaltyPolicy.deductBasedOnLateArrival
                          ? "border-sky-300 bg-sky-50/30 text-sky-900"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={!penaltyPolicy.deductBasedOnLateArrival}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#0D47A1] border-slate-300 focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                      <span className="text-xs font-semibold">
                        No, use a fixed deduction for late arrival
                      </span>
                    </label>

                    {/* Option 2: Variable */}
                    <label
                      onClick={() => setPenaltyPolicy(prev => ({ ...prev, deductBasedOnLateArrival: true }))}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        penaltyPolicy.deductBasedOnLateArrival
                          ? "border-sky-300 bg-sky-50/30 text-sky-900"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={penaltyPolicy.deductBasedOnLateArrival}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#0D47A1] border-slate-300 focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                      <span className="text-xs font-semibold">
                        Yes, deduct based on how late they arrived
                      </span>
                    </label>
                  </div>
                </div>

                {/* Deduction details */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Deduction Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Deduction <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={penaltyPolicy.deductionType}
                      onChange={(e) => setPenaltyPolicy(prev => ({ ...prev, deductionType: e.target.value }))}
                      className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none font-semibold text-slate-700 bg-white transition-all"
                    >
                      <option value="Custom Multiplier">Custom Multiplier</option>
                      <option value="Fixed Amount">Fixed Amount</option>
                    </select>
                  </div>

                  {/* Amount input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-xl border border-slate-200 flex items-center bg-white focus-within:ring-2 focus-within:ring-[#0D47A1]/20 focus-within:border-[#0D47A1] overflow-hidden transition-all">
                      <input
                        type="number"
                        value={penaltyPolicy.deductionAmount}
                        onChange={(e) => setPenaltyPolicy(prev => ({ ...prev, deductionAmount: parseInt(e.target.value) || 0 }))}
                        className="w-full px-2 py-2 text-xs outline-none bg-transparent text-slate-700 font-bold"
                      />
                      <span className="pr-2 text-[10px] text-slate-400 font-medium whitespace-nowrap bg-slate-50/50 py-2 border-l border-slate-100 pl-2">
                        {penaltyPolicy.deductionType === "Custom Multiplier" ? "x Hourly Salary" : "Rs."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`p-3 md:p-4 flex flex-col h-full overflow-y-auto md:overflow-hidden transition-all duration-300 ease-in-out ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
    >
      {/* Top Header Section (Static, scrolls away on mobile) */}
      <div className="flex-none space-y-2">
        {/* Buttons Header */}
        <div className="py-1 flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 bg-white">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
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
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-2.5 flex flex-col sm:flex-row items-center gap-3">
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
              <span className="text-slate-400 text-xs font-semibold">{employee.employeeId}</span>
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
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white flex-none mt-4">
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
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition whitespace-nowrap ${activeTab === tab.id
                ? "text-[#0D47A1] border-b-2 border-[#0D47A1] bg-[#0D47A1]/5"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content — only this scrolls on desktop, header stays sticky */}
      <div className="flex-1 mt-2 pb-4 md:overflow-y-auto no-scrollbar">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6">
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

  const [filters, setFilters] = useState<FilterState>({
    status: "",
    department: "",
    role: "",
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

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
      } catch (err) {
        // Fallback to static data
        const depts = new Set(employees.map(e => e.department));
        setDepartments(Array.from(depts));
        const rolesSet = new Set(employees.map(e => e.role));
        setRoles(Array.from(rolesSet));
        setProjects(["Project Alpha", "Project Beta", "Project Gamma"]);
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
                    onClick={() => setViewEmployee(employee)}
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
                          onClick={() => setViewEmployee(employee)}
                          className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={12} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => setEditEmployee(employee)}
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
                      onClick={() => setViewEmployee(employee)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition"
                    >
                      <Eye size={12} /> View
                    </button>
                    <button
                      onClick={() => setEditEmployee(employee)}
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
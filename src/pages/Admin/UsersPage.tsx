import React, { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus, X, Filter, Edit2, Trash2, Mail,
  ChevronLeft, ChevronRight, Upload, Eye, EyeOff,
  CheckCircle2, Building2, Calendar, MapPin,
  Users, Shield, UserCheck, UserX, Phone, Lock,
  ChevronDown, SlidersHorizontal, RefreshCw, Search,
  Briefcase, Hash, Clock, Globe, Key, FolderOpen
} from "lucide-react";
import { masterDataAPI } from "../../lib/masterApi";
import { settingsApi } from "../../lib/settingsApi";
import type { Company, Branch } from "../../lib/settingsApi";
import { userApi, type UserRecord, type UserStatus, type UserGender, type UserRole } from "../../lib/userApi";
import toast, { Toaster } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────


interface MasterItem {
  id: string;
  name: string;
  status: string;
}

interface MasterValue {
  id: string;
  value: string;
  status: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATIC_USERS: UserRecord[] = [
  {
    id: "USR-001",
    firstName: "Suraj",
    lastName: "Kumar",
    email: "suraj@hously.co",
    phone: "+91 98765 43210",
    department: "Software Development",
    role: "Super Admin",
    status: "active",
    isEmployee: true,
    isActive: true,
    companyName: "Hously Tech",
    attendanceLocation: "Noida HQ",
    dateOfJoining: "2022-01-10",
    gender: "male",
    allottedProjects: "Project Alpha, Project Beta",
    createdAt: "2022-01-10"
  },
  {
    id: "USR-002",
    firstName: "Anjali",
    lastName: "Sharma",
    email: "anjali@hously.co",
    phone: "+91 87654 32109",
    department: "UI/UX Design",
    role: "Editor",
    status: "active",
    isEmployee: true,
    isActive: true,
    companyName: "Hously Tech",
    attendanceLocation: "Delhi Office",
    dateOfJoining: "2022-06-15",
    gender: "female",
    allottedProjects: "Project Gamma",
    createdAt: "2022-06-15"
  },
  {
    id: "USR-003",
    firstName: "Vikram",
    lastName: "Patel",
    email: "vikram@hously.co",
    phone: "+91 76543 21098",
    department: "Data Analytics",
    role: "Admin",
    status: "active",
    isEmployee: true,
    isActive: true,
    companyName: "Hously Tech",
    attendanceLocation: "Mumbai Branch",
    dateOfJoining: "2023-03-01",
    gender: "male",
    allottedProjects: "Project Delta, Project Epsilon",
    createdAt: "2023-03-01"
  },
  {
    id: "USR-004",
    firstName: "Rajesh",
    lastName: "Roy",
    email: "rajesh@hously.co",
    phone: "+91 65432 10987",
    department: "Quality Assurance (QA) / Testing",
    role: "Employee",
    status: "blocked",
    isEmployee: true,
    isActive: false,
    companyName: "Hously Tech",
    attendanceLocation: "Noida HQ",
    dateOfJoining: "2023-07-20",
    gender: "male",
    allottedProjects: "Project Zeta",
    createdAt: "2023-07-20"
  },
  {
    id: "USR-005",
    firstName: "Priya",
    lastName: "Mehta",
    email: "priya@hously.co",
    phone: "+91 54321 09876",
    department: "Database Administration (DBA)",
    role: "HR Lead",
    status: "inactive",
    isEmployee: false,
    isActive: false,
    allottedProjects: "",
    createdAt: "2024-01-05"
  },
];

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-emerald-50",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    bg: "bg-amber-50",
    color: "text-amber-700",
    dot: "bg-amber-400",
  },
  blocked: {
    label: "Blocked",
    bg: "bg-red-50",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({
  name,
  url,
  size = "sm",
}: {
  name: string;
  url?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) => {
  const sz = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  }[size];

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sz} rounded-full object-cover ring-2 ring-white flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center font-bold text-white ring-2 ring-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  desc,
  icon,
  accent,
}: {
  label: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent} flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
        {label}
      </p>
      <p className="text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
      <p className="text-[9px] text-slate-400 font-semibold truncate">{desc}</p>
    </div>
  </div>
);

// ─── Change Password Modal ──────────────────────────────────────────────────

const ChangePasswordModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (password: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    onConfirm(password);
    handleClose();
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full transition-all duration-250"
          style={{
            maxWidth: 440,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          }}
        >
          <div className="h-1.5 rounded-t-2xl" />

          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D47A1]/10 flex items-center justify-center">
                  <Key size={18} className="text-[#0D47A1]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Change Password</h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Enter new password for this user
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none font-medium text-slate-800 placeholder-slate-300 focus:ring-1 focus:ring-[#0D47A1]/25 focus:border-[#0D47A1] pl-8 pr-8 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none font-medium text-slate-800 placeholder-slate-300 focus:ring-1 focus:ring-[#0D47A1]/25 focus:border-[#0D47A1] pl-8 pr-8 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 font-semibold">{error}</p>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── View User Modal ──────────────────────────────────────────────────────────

const ViewUserModal = ({
  user,
  onClose,
}: {
  user: UserRecord;
  onClose: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const statusCfg = STATUS_CONFIG[user.status];
  const fullName = `${user.firstName}${user.middleName ? " " + user.middleName : ""} ${user.lastName}`;

  const DetailItem = ({
    icon,
    label,
    value,
    bg = "bg-slate-50",
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    bg?: string;
  }) =>
    value ? (
      <div className={`flex items-start gap-3 p-3 rounded-xl ${bg}`}>
        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xs font-semibold text-slate-700 leading-tight mt-0.5 break-all">
            {value}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full transition-all duration-250"
          style={{
            maxWidth: 560,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          }}
        >
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-2xl opacity-10" />

            <div className="relative px-6 pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={fullName} url={user.avatarUrl} size="lg" />
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">{fullName}</h2>
                    <p className="text-[11px] text-slate-400 font-medium">{user.id}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        <Shield size={9} /> {user.role}
                      </span>
                      {user.isEmployee && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <UserCheck size={9} /> Employee
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <DetailItem
                  icon={<Mail size={14} className="text-[#0D47A1]" />}
                  label="Email"
                  value={user.email}
                  bg="bg-blue-50/50"
                />
                <DetailItem
                  icon={<Phone size={14} className="text-[#0D47A1]" />}
                  label="Phone"
                  value={user.phone}
                  bg="bg-blue-50/50"
                />
                <DetailItem
                  icon={<Building2 size={14} className="text-slate-500" />}
                  label="Department"
                  value={user.department}
                />
                <DetailItem
                  icon={<Briefcase size={14} className="text-slate-500" />}
                  label="Role"
                  value={user.role}
                />
                <DetailItem
                  icon={<Hash size={14} className="text-slate-500" />}
                  label="User ID"
                  value={user.id}
                />
                <DetailItem
                  icon={<FolderOpen size={14} className="text-slate-500" />}
                  label="Allotted Projects"
                  value={user.allottedProjects || "None"}
                />
                <DetailItem
                  icon={<Clock size={14} className="text-slate-500" />}
                  label="Created On"
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : undefined
                  }
                />
              </div>

              {user.isEmployee && (
                <div className="mt-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 border border-blue-100/50">
                  <p className="text-[9px] font-extrabold text-[#0D47A1] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Building2 size={12} /> Employee Details
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <DetailItem
                      icon={<Globe size={13} className="text-blue-500" />}
                      label="Company"
                      value={user.companyName}
                      bg="bg-white/60"
                    />
                    <DetailItem
                      icon={<MapPin size={13} className="text-blue-500" />}
                      label="Branch / Location"
                      value={user.attendanceLocation}
                      bg="bg-white/60"
                    />
                    <DetailItem
                      icon={<Calendar size={13} className="text-blue-500" />}
                      label="Date of Joining"
                      value={
                        user.dateOfJoining
                          ? new Date(user.dateOfJoining).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : undefined
                      }
                      bg="bg-white/60"
                    />
                    <DetailItem
                      icon={<Users size={13} className="text-blue-500" />}
                      label="Gender"
                      value={
                        user.gender
                          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                          : undefined
                      }
                      bg="bg-white/60"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Reusable Add/Edit User Modal ─────────────────────────────────────────────

interface UserFormModalProps {
  onClose: () => void;
  onSave: (user: Omit<UserRecord, "id" | "createdAt">) => void;
  departments: string[];
  roles: string[];
  projects: string[];
  companies: Company[];
  mode?: "add" | "edit";
  initialUser?: UserRecord | null;
}

const UserFormModal = ({
  onClose,
  onSave,
  departments,
  roles,
  projects,
  companies,
  mode = "add",
  initialUser,
}: UserFormModalProps) => {
  const [visible, setVisible] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialUser?.avatarUrl ?? null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEmployee, setIsEmployee] = useState(initialUser?.isEmployee ?? false);
  const [isActive, setIsActive] = useState(initialUser ? initialUser.status === "active" : true);
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: initialUser?.firstName ?? "",
    middleName: initialUser?.middleName ?? "",
    lastName: initialUser?.lastName ?? "",
    email: initialUser?.email ?? "",
    phone: initialUser?.phone ?? "",
    password: "",
    confirmPassword: "",
    department: initialUser?.department ?? "",
    role: initialUser?.role ?? "",
    companyName: initialUser?.companyName ?? "",
    attendanceLocation: initialUser?.attendanceLocation ?? "",
    dateOfJoining: initialUser?.dateOfJoining ?? "",
    gender: (initialUser?.gender ?? "") as UserGender | "",
    allottedProjects: initialUser?.allottedProjects ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    try {
      toast.loading("Uploading avatar...", { id: "avatar-upload" });
      const imageUrl = await userApi.uploadAvatar(file);
      setAvatarPreview(imageUrl);
      toast.success("Avatar uploaded successfully!", { id: "avatar-upload" });
    } catch (err: any) {
      toast.error(err.message || "Avatar upload failed", { id: "avatar-upload" });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.department) errs.department = "Required";
    if (!form.role) errs.role = "Required";

    if (mode === "add") {
      if (!form.password || form.password.length < 6) errs.password = "Min 6 characters";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    onSave({
      firstName: form.firstName,
      middleName: form.middleName || undefined,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      department: form.department,
      role: form.role,
      status: isActive ? "active" : "inactive",
      isEmployee,
      isActive,
      avatarUrl: avatarPreview ?? undefined,
      companyName: form.companyName || undefined,
      attendanceLocation: form.attendanceLocation || undefined,
      dateOfJoining: form.dateOfJoining || undefined,
      gender: (form.gender as UserGender) || undefined,
      allottedProjects: form.allottedProjects || undefined,
    });

    setSaving(false);
    handleClose();
  };

  const handleChangePassword = (newPassword: string) => {
    console.log("Password updated:", newPassword);
  };

  const inp = (err?: string) =>
    `w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-all font-medium text-slate-800 placeholder-slate-300 ${err
      ? "border-red-300 focus:ring-1 focus:ring-red-200"
      : "border-slate-200 focus:ring-1 focus:ring-[#0D47A1]/25 focus:border-[#0D47A1]"
    }`;

  const selCls = (err?: string) =>
    `w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none font-semibold text-slate-700 cursor-pointer bg-white appearance-none transition-all ${err
      ? "border-red-300"
      : "border-slate-200 focus:ring-1 focus:ring-[#0D47A1]/25 focus:border-[#0D47A1]"
    }`;

  const Label = ({
    text,
    required,
    error,
  }: {
    text: string;
    required?: boolean;
    error?: string;
  }) => (
    <div className="mb-1">
      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
        {text} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <span className="ml-2 text-[9px] text-red-500 font-semibold">{error}</span>}
    </div>
  );

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />

      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full transition-all duration-250"
          style={{
            maxWidth: 820,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
          }}
        >
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center shadow-sm">
                <Users size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  {mode === "edit" ? "Edit User" : "Add New User"}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  {mode === "edit"
                    ? "Update user details"
                    : "Fill in the details to create a user account"}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="w-44 flex-shrink-0 bg-slate-50 border-r border-slate-100 flex flex-col items-center gap-3 px-4 py-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-14 h-14 rounded-full cursor-pointer group"
                    onClick={() => fileRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-[#0D47A1]/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-0.5 group-hover:border-[#0D47A1] transition-colors">
                        <Upload size={13} className="text-slate-400 group-hover:text-[#0D47A1]" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0D47A1] rounded-full flex items-center justify-center shadow-sm">
                      <Upload size={7} className="text-white" />
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400 font-semibold text-center">
                    Photo · Max 5MB
                    <br />
                    JPG, PNG, WEBP
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="w-full h-px bg-slate-200" />

                <div className="w-full space-y-1">
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                    User Type
                  </p>
                  <label
                    className={`flex items-start gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${isEmployee ? "border-[#0D47A1]/30 bg-[#0D47A1]/5" : "border-slate-200"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all ${isEmployee ? "bg-[#0D47A1] border-[#0D47A1]" : "border-slate-300"
                        }`}
                      onClick={() => setIsEmployee((e) => !e)}
                    >
                      {isEmployee && (
                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-700 leading-tight">
                        Employee Record
                      </p>
                      <p className="text-[8px] text-slate-400 leading-tight mt-0.5">
                        Creates linked employee profile
                      </p>
                    </div>
                  </label>
                </div>

                <div className="w-full space-y-1">
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Account Status
                  </p>
                  <label
                    className={`flex items-start gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${isActive ? "border-emerald-300 bg-emerald-50" : "border-slate-200"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all ${isActive ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                        }`}
                      onClick={() => setIsActive((a) => !a)}
                    >
                      {isActive && (
                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-700 leading-tight">Active User</p>
                      <p className="text-[8px] text-slate-400 leading-tight mt-0.5">
                        Can log in immediately
                      </p>
                    </div>
                  </label>
                </div>

                {mode === "edit" && (
                  <>
                    <div className="w-full h-px bg-slate-200" />
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(true)}
                        className="w-full py-2 text-xs font-bold text-[#0D47A1] border-2 border-[#0D47A1]/20 rounded-xl hover:bg-[#0D47A1]/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Key size={12} />
                        Change Password
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 px-5 py-4 space-y-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <Label text="First Name" required error={errors.firstName} />
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      placeholder="John"
                      className={inp(errors.firstName)}
                    />
                  </div>
                  <div>
                    <Label text="Middle Name" />
                    <input
                      value={form.middleName}
                      onChange={(e) => setForm((f) => ({ ...f, middleName: e.target.value }))}
                      placeholder="(Optional)"
                      className={inp()}
                    />
                  </div>
                  <div>
                    <Label text="Last Name" required error={errors.lastName} />
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      placeholder="Doe"
                      className={inp(errors.lastName)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label text="Email" required error={errors.email} />
                    <div className="relative">
                      <Mail size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="john@example.com"
                        type="email"
                        className={`${inp(errors.email)} pl-7`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label text="Phone" required error={errors.phone} />
                    <div className="relative">
                      <Phone size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className={`${inp(errors.phone)} pl-7`}
                      />
                    </div>
                  </div>
                </div>

                {mode === "add" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <Label text="Password" required error={errors.password} />
                      <div className="relative">
                        <Lock size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={form.password}
                          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          className={`${inp(errors.password)} pl-7 pr-8`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label text="Confirm Password" required error={errors.confirmPassword} />
                      <div className="relative">
                        <Lock size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={form.confirmPassword}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                          }
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter password"
                          className={`${inp(errors.confirmPassword)} pl-7 pr-8`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                        >
                          {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label text="Department" required error={errors.department} />
                    <div className="relative">
                      <Building2 size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={form.department}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, department: e.target.value, role: "" }))
                        }
                        className={`${selCls(errors.department)} pl-7`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <Label text="Role" required error={errors.role} />
                    <div className="relative">
                      <Shield size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        className={`${selCls(errors.role)} pl-7`}
                      >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label text="Allotted Projects" />
                  <div className="relative">
                    <FolderOpen size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={form.allottedProjects}
                      onChange={(e) => setForm((f) => ({ ...f, allottedProjects: e.target.value }))}
                      className={`${selCls()} pl-7 appearance-none`}
                    >
                      <option value="">Select Projects</option>
                      {projects.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isEmployee ? "120px" : "0px",
                    opacity: isEmployee ? 1 : 0,
                  }}
                >
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    <div>
                      <Label text="Company Name" />
                      <div className="relative">
                        <select
                          value={form.companyName}
                          onChange={(e) => {
                            const newComp = e.target.value;
                            setForm((f) => ({ ...f, companyName: newComp, attendanceLocation: "" }));
                          }}
                          className={`${selCls()} appearance-none`}
                        >
                          <option value="">Select Company</option>
                          {companies.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <Label text="Branch" />
                      <div className="relative">
                        <MapPin size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                        <select
                          value={form.attendanceLocation}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, attendanceLocation: e.target.value }))
                          }
                          disabled={!form.companyName}
                          className={`${selCls()} pl-6 appearance-none disabled:opacity-50`}
                        >
                          <option value="">
                            {!form.companyName ? "Select Company first" : "Select Branch"}
                          </option>
                          {companies
                            .find((c) => c.name === form.companyName)
                            ?.branches.map((b) => (
                              <option key={b.id} value={b.name}>
                                {b.name}
                              </option>
                            ))}
                        </select>
                        <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <Label text="Joining Date" />
                      <div className="relative">
                        <Calendar size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={form.dateOfJoining}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, dateOfJoining: e.target.value }))
                          }
                          className={`${inp()} pl-6`}
                        />
                      </div>
                    </div>
                    <div>
                      <Label text="Gender" />
                      <div className="relative">
                        <select
                          value={form.gender}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, gender: e.target.value as UserGender }))
                          }
                          className={`${selCls()} appearance-none`}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex gap-3 rounded-b-2xl bg-white">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "edit" ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus size={13} />
                    {mode === "edit" ? "Update User" : "Create User"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onConfirm={handleChangePassword}
        />
      )}
    </>
  );
};

// ─── Status Confirmation Modal ────────────────────────────────────────────────

const StatusConfirmModal = ({
  user,
  onClose,
  onConfirm,
}: {
  user: UserRecord;
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

  const fullName = `${user.firstName}${user.middleName ? " " + user.middleName : ""} ${user.lastName}`;
  const isDeactivate = user.status === "active";

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-250"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="p-6">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDeactivate ? "bg-amber-50" : "bg-emerald-50"
                }`}
            >
              {isDeactivate ? (
                <UserX size={22} className="text-amber-600" />
              ) : (
                <UserCheck size={22} className="text-emerald-600" />
              )}
            </div>

            <h3 className="text-lg font-extrabold text-slate-800">
              {isDeactivate ? "Deactivate User?" : "Activate User?"}
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {isDeactivate
                ? `Are you sure you want to deactivate ${fullName}? This user will not be able to log in until activated again.`
                : `Are you sure you want to activate ${fullName}? This user will be able to log in again.`}
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
                className={`flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition ${isDeactivate
                  ? "bg-gradient-to-r from-red-500 to-red-500 hover:opacity-90"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90"
                  }`}
              >
                {isDeactivate ? "Yes, Deactivate" : "Yes, Activate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

const DeleteConfirmModal = ({
  user,
  onClose,
  onConfirm,
}: {
  user: UserRecord;
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

  const fullName = `${user.firstName}${user.middleName ? " " + user.middleName : ""} ${user.lastName}`;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-250"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-800">Delete User?</h3>
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
                className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Side Filter Drawer ───────────────────────────────────────────────────────

interface FilterState {
  status: string;
  role: string;
  department: string;
  isEmployee: string;
}

const SideFilter = ({
  open,
  onClose,
  filters,
  setFilters,
  onReset,
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
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#0D47A1]" />
            <span className="font-extrabold text-slate-800 text-sm">Filter Users</span>
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
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={selCls}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
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
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
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

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Department
            </label>
            <div className="relative">
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
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
              Employee Record
            </label>
            <div className="relative">
              <select
                value={filters.isEmployee}
                onChange={(e) => setFilters({ ...filters, isEmployee: e.target.value })}
                className={selCls}
              >
                <option value="">All Users</option>
                <option value="yes">Has Employee Record</option>
                <option value="no">No Employee Record</option>
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
            onClick={onReset}
            className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw size={11} /> Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const ctx =
    useOutletContext<{
      setHeaderTitle: (t: string) => void;
      setHeaderSubtitle: (s: string) => void;
    }>() || {};

  useEffect(() => {
    ctx.setHeaderTitle?.("Users Administration");
    ctx.setHeaderSubtitle?.("Manage system logins, roles, and employee records");
  }, [ctx]);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const list = await settingsApi.getCompanies();
        setCompanies(list);
      } catch (err) {
        console.error("Failed to load companies in UsersPage", err);
      }
    };
    fetchCompanies();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [viewUser, setViewUser] = useState<UserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [statusUser, setStatusUser] = useState<UserRecord | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    role: "",
    department: "",
    isEmployee: "",
  });

  // Checkbox selection
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);

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
        setDepartments([
          "Software Development",
          "UI/UX Design",
          "Database Administration (DBA)",
          "Data Analytics",
          "Quality Assurance (QA) / Testing",
          "Other",
        ]);
        setRoles(["Super Admin", "Admin", "HR Lead", "Editor", "Employee", "Viewer"]);
        setProjects(["Project Alpha", "Project Beta", "Project Gamma", "Project Delta", "Project Epsilon"]);
      }
    };

    fetchMaster();
  }, []);

  const [colSearch, setColSearch] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    status: "",
  });

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const fullName = `${u.firstName} ${u.middleName ?? ""} ${u.lastName}`.toLowerCase();
        const statusLabel = STATUS_CONFIG[u.status]?.label?.toLowerCase() || "";
        const searchStatus = colSearch.status?.toLowerCase() || "";

        return (
          (!colSearch.name ||
            fullName.includes(colSearch.name.toLowerCase()) ||
            u.id.toLowerCase().includes(colSearch.name.toLowerCase())) &&
          (!colSearch.email || u.email.toLowerCase().includes(colSearch.email.toLowerCase())) &&
          (!colSearch.department ||
            u.department.toLowerCase().includes(colSearch.department.toLowerCase())) &&
          (!colSearch.role || u.role.toLowerCase().includes(colSearch.role.toLowerCase())) &&
          (!colSearch.status ||
            statusLabel.includes(searchStatus) ||
            u.status.includes(colSearch.status.toLowerCase())) &&
          (!filters.status || u.status === filters.status) &&
          (!filters.role || u.role === filters.role) &&
          (!filters.department || u.department === filters.department) &&
          (!filters.isEmployee || (filters.isEmployee === "yes" ? u.isEmployee : !u.isEmployee))
        );
      }),
    [users, colSearch, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset selections when page/filters change
  useEffect(() => {
    setPage(1);
    setSelectedUsers(new Set());
    setSelectAll(false);
  }, [colSearch, filters, pageSize]);

  // Handle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      const allIds = new Set(paginated.map(u => u.id));
      setSelectedUsers(allIds);
    } else {
      setSelectedUsers(new Set());
    }
  };

  // Handle individual selection
  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setSelectAll(newSelected.size === paginated.length && paginated.length > 0);
  };

  // Handle delete selected
  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select users to delete");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} selected users?`)) {
      try {
        await userApi.bulkDelete(Array.from(selectedUsers));
        toast.success(`${selectedUsers.size} users deleted successfully!`);
        setSelectedUsers(new Set());
        setSelectAll(false);
        fetchUsers();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete selected users");
      }
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPageSize(value === 'all' ? filtered.length : parseInt(value));
    setPage(1);
  };

  const handleAddUser = async (newUser: Omit<UserRecord, "id" | "createdAt">) => {
    try {
      await userApi.create(newUser);
      toast.success("User created successfully!");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (updatedUser: Omit<UserRecord, "id" | "createdAt">) => {
    if (!editingUser) return;
    try {
      await userApi.update(editingUser.id, updatedUser);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusUser) return;
    try {
      const nextStatus: UserStatus = statusUser.status === "active" ? "inactive" : "active";
      await userApi.toggleStatus(statusUser.id, nextStatus, nextStatus === "active");
      toast.success("User status updated successfully!");
      setStatusUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    try {
      await userApi.delete(deleteUser.id);
      toast.success("User deleted successfully!");
      setDeleteUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const colInp =
    "w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all";

  return (
    <>
      <div className="p-4 md:p-6 space-y-4 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            label="Total Users"
            value={`${users.length}`}
            desc="Across all access levels"
            icon={<Users size={18} className="text-blue-600" />}
            accent="bg-blue-50"
          />
          <StatCard
            label="Admins"
            value={`${users.filter((u) => u.role === "Super Admin" || u.role === "Admin").length}`}
            desc="Full system permissions"
            icon={<Shield size={18} className="text-indigo-600" />}
            accent="bg-indigo-50"
          />
          <StatCard
            label="Blocked"
            value={`${users.filter((u) => u.status === "blocked").length}`}
            desc="Restricted system logins"
            icon={<UserX size={18} className="text-red-500" />}
            accent="bg-red-50"
          />
        </div>

        {/* Toolbar - Sticky */}
        <div className="sticky top-0 z-20 bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {selectedUsers.size > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
                >
                  <Trash2 size={13} /> Delete Selected ({selectedUsers.size})
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition cursor-pointer ${Object.values(filters).some((v) => v)
                ? "bg-[#0D47A1]/10 border-[#0D47A1]/30 text-[#0D47A1]"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Filter size={13} /> Filter
              {Object.values(filters).some((v) => v) && (
                <span className="w-4 h-4 bg-[#0D47A1] text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {Object.values(filters).filter((v) => v).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> Add User
            </button>
          </div>
        </div>

        {/* Table with scroll */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(100vh-380px)]">
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
                  {["User", "Email", "Department", "Role", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>

                {/* Column Search Row - Sticky */}
                <tr className="bg-white border-b-2 border-slate-200 sticky top-[57px] z-10">
                  <th className="px-3 py-2"></th>
                  {[
                    { key: "name", placeholder: "Search name..." },
                    { key: "email", placeholder: "Search email..." },
                    { key: "department", placeholder: "Search dept..." },
                    { key: "role", placeholder: "Search role..." },
                    { key: "status", placeholder: "Search status..." },
                  ].map(({ key, placeholder }) => (
                    <th key={key} className="px-3 py-2 border-r border-slate-100">
                      <div className="relative">
                        <Search
                          size={9}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300"
                        />
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
                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-400 text-sm font-semibold border-b border-slate-100"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#0D47A1] border-t-transparent rounded-full animate-spin" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-slate-400 text-sm font-semibold border-b border-slate-100"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : null}

                {paginated.map((user, idx) => {
                  const statusCfg = STATUS_CONFIG[user.status];
                  const fullName = `${user.firstName}${user.middleName ? " " + user.middleName : ""} ${user.lastName}`;
                  const isChecked = selectedUsers.has(user.id);

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-100 transition-colors hover:bg-blue-50/30 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                        }`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={fullName} url={user.avatarUrl} />
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">{fullName}</p>
                            <p className="text-[9px] text-slate-400 font-semibold">{user.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 border-r border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Mail size={10} className="text-slate-400 flex-shrink-0" />
                          <span className="text-[11px] truncate max-w-[140px]">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="text-[11px] text-slate-600 font-semibold truncate max-w-[130px] block">
                          {user.department}
                        </span>
                      </td>

                      <td className="px-4 py-3 border-r border-slate-100">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          <Shield size={9} />
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 border-r border-slate-100">
                        <button
                          onClick={() => setStatusUser(user)}
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
                            onClick={() => setViewUser(user)}
                            className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={12} className="text-blue-500" />
                          </button>

                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={12} className="text-green-500" />
                          </button>

                          <button
                            onClick={() => setDeleteUser(user)}
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

          {/* Pagination - Sticky Bottom */}
          {filtered.length > 0 && (
            <div className="sticky bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2">
              <span className="font-semibold">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} users
              </span>

              <div className="flex items-center gap-3">
                {/* Page Size Selector */}
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

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      </div>

      {showModal && (
        <UserFormModal
          mode="add"
          onClose={() => setShowModal(false)}
          onSave={handleAddUser}
          departments={departments}
          roles={roles}
          projects={projects}
          companies={companies}
        />
      )}

      {editingUser && (
        <UserFormModal
          mode="edit"
          initialUser={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
          departments={departments}
          roles={roles}
          projects={projects}
          companies={companies}
        />
      )}

      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}

      {statusUser && (
        <StatusConfirmModal
          user={statusUser}
          onClose={() => setStatusUser(null)}
          onConfirm={handleStatusConfirm}
        />
      )}

      {deleteUser && (
        <DeleteConfirmModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <SideFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={() =>
          setFilters({
            status: "",
            role: "",
            department: "",
            isEmployee: "",
          })
        }
        departments={departments}
        roles={roles}
      />
      <Toaster position="top-right" />
    </>
  );
}
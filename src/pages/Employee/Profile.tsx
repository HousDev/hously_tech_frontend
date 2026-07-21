import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Plus, X, Upload, Eye, Download,
  User as UserIcon, UserCog2, MapPin as MapPinIcon,
  GraduationCap, Briefcase as BriefcaseIcon, Laptop,
  Banknote, CalendarCheck, Clock as ClockIcon, ShieldCheck,
  Edit, Save, Phone, Mail as MailIcon, Hash, MapPin,
  CalendarDays, Home, IndianRupee, Award, Calendar as CalendarIcon, Percent,
  UserCircle, Lock, IdCard, Smartphone, ChevronDown, Trash2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/api";
import { employeeApi, type EmployeeRecord, type EmployeeStatus, type EmployeeGender, type BloodGroup, type MaritalStatus, type Nationality, type WeekOffDays } from "../../lib/employeeApi";
import { masterDataAPI } from "../../lib/masterApi";

// ─── Constants ───────────────────────────────────────────────────────────────
const WEEK_OFF_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── InputField Component ────────────────────────────────────────────────────
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
  error = "",
  disabled = false,
}: any) => {
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
            disabled={disabled}
          >
            <option value="">Select {label}</option>
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
            className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white ${error ? "border-red-300 focus:ring-red-200" : "border-slate-200"
              } ${icon ? "pl-9" : ""}`}
            disabled={disabled}
          />
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold pl-1">{error}</p>}
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

const resolveAvatarUrl = (url: any): string | null => {
  if (!url) return null;
  if (typeof url === 'string') return url;
  if (url && typeof url === 'object' && url.type === 'Buffer' && Array.isArray(url.data)) {
    try {
      const bytes = new Uint8Array(url.data);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return binary;
    } catch (e) {
      console.error("Failed to decode avatar buffer:", e);
    }
  }
  return null;
};

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

// ─── Main Profile Component ──────────────────────────────────────────────────
export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeRecord | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    role: "",
    joinDate: "",
    company: "",
    attendanceLocation: "",
    allottedProjects: [] as string[],
    status: "active",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyContactName: "",
    address: "",
    bloodGroup: "",
    maritalStatus: "",
    nationality: "",
    aadharNumber: "",
    panNumber: "",
    permanentAddress: "",
    currentAddress: "",
    city: "",
    state: "",
    pincode: "",
    highestQualification: "",
    university: "",
    passingYear: "",
    percentage: "",
    weekOffDays: [] as WeekOffDays[],
    employeeType: "Permanent",
    workMode: "Office",
    probationPeriod: 3,
    dateOfLeaving: "",
    noticePeriod: 30,
    salary: 0,
    salaryType: "Monthly",
    designationRole: "",
    punchInTime: "10:00:00",
    punchOutTime: "19:00:00",
    ctc: 0,
    hikeEffectiveDate: "",
    hikeType: "",
    hikeValue: 0,
    hikeActive: false,
    laptopAssigned: "No",
    laptopName: "",
    laptopSerialNumber: "",
    mobileAssigned: "No",
    mobileName: "",
    mobileImei: "",
    mobileSerialNumber: "",
    mobileNumberSim: "",
    simCard: "",
    mobilePassword: "",
    systemLoginId: "",
    systemPassword: "",
    officeEmailId: "",
    officeEmailPassword: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  // Local state for Documents tab
  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const [masterDocuments, setMasterDocuments] = useState<string[]>([]);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<any | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadModalError, setUploadModalError] = useState("");

  // Determine if active tab is editable
  const EDITABLE_TABS = ["personal", "address", "education", "bank", "documents"];
  const isTabEditable = EDITABLE_TABS.includes(activeTab);

  // Fetch master documents list
  useEffect(() => {
    const fetchMasterDocs = async () => {
      try {
        const types = await masterDataAPI.getAllMasterTypes("common");
        const docType = types.find((t: any) => t.name?.toLowerCase().includes("documents"));
        if (docType) {
          const docValues = await masterDataAPI.getMasterValues(docType.id);
          setMasterDocuments(
            docValues
              .filter((v: any) => v.status === "Active")
              .map((v: any) => v.value)
          );
        }
      } catch (err) {
        console.error("Failed to load master documents:", err);
        setMasterDocuments(["Document 1", "Document 2", "Document 3"]);
      }
    };
    fetchMasterDocs();
  }, []);

  // Load employee details on mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await employeeApi.getById(String(user.id));
        if (data) {
          setEmployee(data);
          setFormData({
            firstName: data.firstName || "",
            middleName: data.middleName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            department: data.department || "",
            role: data.role || "",
            joinDate: data.joinDate || "",
            company: data.company || "",
            attendanceLocation: data.attendanceLocation || "",
            allottedProjects: data.allottedProjects || [],
            status: data.status || "active",
            dateOfBirth: data.dateOfBirth || "",
            emergencyContact: data.emergencyContact || "",
            emergencyContactName: data.emergencyContactName || "",
            address: data.address || "",
            bloodGroup: data.bloodGroup || "",
            maritalStatus: data.maritalStatus || "",
            nationality: data.nationality || "",
            aadharNumber: data.aadharNumber || "",
            panNumber: data.panNumber || "",
            permanentAddress: data.permanentAddress || "",
            currentAddress: data.currentAddress || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
            highestQualification: data.highestQualification || "",
            university: data.university || "",
            passingYear: data.passingYear || "",
            percentage: data.percentage || "",
            weekOffDays: data.weekOffDays || [],
            employeeType: data.employeeType || "Permanent",
            workMode: data.workMode || "Office",
            probationPeriod: data.probationPeriod ?? 3,
            dateOfLeaving: data.dateOfLeaving || "",
            noticePeriod: data.noticePeriod ?? 30,
            salary: data.salary ?? 0,
            salaryType: data.salaryType || "Monthly",
            designationRole: data.designationRole || "",
            punchInTime: data.punchInTime || "10:00:00",
            punchOutTime: data.punchOutTime || "19:00:00",
            ctc: data.ctc ?? 0,
            hikeEffectiveDate: data.hikeEffectiveDate || "",
            hikeType: data.hikeType || "",
            hikeValue: data.hikeValue ?? 0,
            hikeActive: data.hikeActive ?? false,
            laptopAssigned: data.laptopAssigned || "No",
            laptopName: data.laptopName || "",
            laptopSerialNumber: data.laptopSerialNumber || "",
            mobileAssigned: data.mobileAssigned || "No",
            mobileName: data.mobileName || "",
            mobileImei: data.mobileImei || "",
            mobileSerialNumber: data.mobileSerialNumber || "",
            mobileNumberSim: data.mobileNumberSim || "",
            simCard: data.simCard || "",
            mobilePassword: data.mobilePassword || "",
            systemLoginId: data.systemLoginId || "",
            systemPassword: data.systemPassword || "",
            officeEmailId: data.officeEmailId || "",
            officeEmailPassword: data.officeEmailPassword || "",
            accountHolderName: data.accountHolderName || "",
            bankName: data.bankName || "",
            accountNumber: data.accountNumber || "",
            ifscCode: data.ifscCode || "",
            upiId: data.upiId || "",
          });
          const isSame = !!data.permanentAddress && data.permanentAddress === data.currentAddress;
          setSameAsPermanent(isSame);
          setAvatarPreview(resolveAvatarUrl(data.avatarUrl));
          setDocumentsList(data.documents || []);
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user]);

  // Refetch employee details when switching to documents tab
  useEffect(() => {
    if (activeTab === "documents" && user?.id) {
      const refetchProfile = async () => {
        try {
          const data = await employeeApi.getById(String(user.id));
          if (data) {
            setEmployee(data);
            setDocumentsList(data.documents || []);
          }
        } catch (err) {
          console.error("Failed to refetch profile on tab switch:", err);
        }
      };
      refetchProfile();
    }
  }, [activeTab, user]);

  // Handle Save (only saves editable tab fields to backend)
  const handleSave = async () => {
    if (!employee?.id) return;
    try {
      setSaving(true);
      // Merge editable values with current employee values
      const payload: any = {
        ...employee,
        documents: documentsList,
        // Personal Details
        dateOfBirth: formData.dateOfBirth || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        address: formData.address || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        maritalStatus: (formData.maritalStatus ? formData.maritalStatus.toLowerCase() : undefined) as MaritalStatus | undefined,
        nationality: formData.nationality || undefined,
        aadharNumber: formData.aadharNumber || undefined,
        panNumber: formData.panNumber || undefined,
        // Address Details
        permanentAddress: formData.permanentAddress || undefined,
        currentAddress: sameAsPermanent ? formData.permanentAddress : (formData.currentAddress || undefined),
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
        // Educational Details
        highestQualification: formData.highestQualification || undefined,
        university: formData.university || undefined,
        passingYear: formData.passingYear || undefined,
        percentage: formData.percentage || undefined,
        // Bank Details
        accountHolderName: formData.accountHolderName || undefined,
        bankName: formData.bankName || undefined,
        accountNumber: formData.accountNumber || undefined,
        ifscCode: formData.ifscCode || undefined,
        upiId: formData.upiId || undefined,
      };

      const updated = await employeeApi.update(String(employee.id), payload);
      if (updated) {
        setEmployee(updated);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!employee?.id) return;
    toast.loading("Uploading avatar...", { id: "avatar-upload" });
    try {
      const imageUrl = await employeeApi.uploadAvatar(file);
      setAvatarPreview(imageUrl);
      
      const payload: any = {
        ...employee,
        avatarUrl: imageUrl
      };
      
      const updated = await employeeApi.update(String(employee.id), payload);
      if (updated) {
        setEmployee(updated);
        toast.success("Avatar uploaded successfully!", { id: "avatar-upload" });
      }
    } catch (err: any) {
      console.error(err);
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
    { id: "kyc", label: "KYC Verification", icon: <ShieldCheck size={14} /> },
    { id: "documents", label: "Documents", icon: <FileText size={14} /> },
  ];

  const renderTabContent = () => {
    const disabled = !isEditing;

    switch (activeTab) {
      case "basic":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="First Name" value={formData.firstName} disabled={true} />
            <InputField label="Middle Name" value={formData.middleName} disabled={true} />
            <InputField label="Last Name" value={formData.lastName} disabled={true} />
            <InputField label="Email" value={formData.email} disabled={true} icon={<MailIcon size={14} />} />
            <InputField label="Mobile" value={formData.phone} disabled={true} icon={<Phone size={14} />} />
            <InputField label="Gender" value={formData.gender} disabled={true} isSelect options={["male", "female", "other"]} />
            <InputField label="Department" value={formData.department} disabled={true} />
            <InputField label="Role" value={formData.role} disabled={true} />
            <InputField label="Blood Group" value={formData.bloodGroup} disabled={true} isSelect options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
            <InputField label="Joining Date" value={formData.joinDate} disabled={true} type="date" />
            <InputField label="Allotted Projects" value={formData.allottedProjects ? formData.allottedProjects.join(', ') : ""} disabled={true} />
            <InputField label="Company" value={formData.company} disabled={true} />
            <InputField label="Attendance Location (Branch)" value={formData.attendanceLocation} disabled={true} icon={<MapPinIcon size={14} />} />
            <InputField label="Employee Status" value={formData.status} disabled={true} isSelect options={["active", "on_leave", "inactive", "terminated"]} />
          </div>
        );

      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Date of Birth" value={formData.dateOfBirth} onChange={(v: string) => setFormData({ ...formData, dateOfBirth: v })} type="date" disabled={disabled} />
            <InputField label="Marital Status" value={formData.maritalStatus} onChange={(v: string) => setFormData({ ...formData, maritalStatus: v })} isSelect options={["single", "married", "divorced", "widowed"]} disabled={disabled} />
            <InputField label="Emergency Contact" value={formData.emergencyContact} onChange={(v: string) => {
              const val = v.replace(/\D/g, '').slice(0, 10);
              setFormData({ ...formData, emergencyContact: val });
            }} disabled={disabled} placeholder="10-digit number" icon={<Phone size={14} />} />
            <InputField label="Emergency Contact Name" value={formData.emergencyContactName} onChange={(v: string) => setFormData({ ...formData, emergencyContactName: v })} disabled={disabled} placeholder="Full name" />
            <InputField label="Nationality" value={formData.nationality} onChange={(v: string) => setFormData({ ...formData, nationality: v })} isSelect options={["Indian", "Other"]} disabled={disabled} />
            <InputField label="Aadhar Number" value={formData.aadharNumber} onChange={(v: string) => setFormData({ ...formData, aadharNumber: v })} disabled={disabled} placeholder="12-digit number" />
            <InputField label="PAN Number" value={formData.panNumber} onChange={(v: string) => setFormData({ ...formData, panNumber: v })} disabled={disabled} placeholder="ABCDE1234F" />
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
                disabled={disabled}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  value={formData.city}
                  onChange={(v: string) => setFormData({ ...formData, city: v })}
                  placeholder="City"
                  disabled={disabled}
                />
                <InputField
                  label="State"
                  value={formData.state}
                  onChange={(v: string) => setFormData({ ...formData, state: v })}
                  placeholder="State"
                  disabled={disabled}
                />
                <InputField
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(v: string) => setFormData({ ...formData, pincode: v })}
                  placeholder="6-digit pincode"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                checked={sameAsPermanent}
                onChange={(e) => {
                  setSameAsPermanent(e.target.checked);
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, currentAddress: prev.permanentAddress }));
                  }
                }}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                disabled={disabled}
              />
              <label className="text-sm font-medium text-slate-700">
                Current address same as permanent address
              </label>
            </div>

            {!sameAsPermanent && (
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Current Address (if different)</h3>
                <InputField
                  label="Full Current Address"
                  value={formData.currentAddress}
                  onChange={(v: string) => setFormData({ ...formData, currentAddress: v })}
                  placeholder="Full current address (if different from permanent)"
                  icon={<MapPinIcon size={14} />}
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        );

      case "education":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Highest Qualification"
              value={formData.highestQualification}
              onChange={(v: string) => setFormData({ ...formData, highestQualification: v })}
              isSelect
              options={["B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Sc", "B.Com", "M.Com", "Other"]}
              icon={<GraduationCap size={14} />}
              disabled={disabled}
            />
            <InputField label="School / University" value={formData.university} onChange={(v: string) => setFormData({ ...formData, university: v })} disabled={disabled} />
            <InputField label="Year of Passing" value={formData.passingYear} onChange={(v: string) => setFormData({ ...formData, passingYear: v })} disabled={disabled} />
            <InputField label="Percentage / CGPA" value={formData.percentage} onChange={(v: string) => setFormData({ ...formData, percentage: v })} disabled={disabled} />
          </div>
        );

      case "employment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Date of Joining" value={formData.joinDate} disabled={true} type="date" />
            <InputField label="Designation" value={formData.designationRole} disabled={true} />
            <InputField label="Employee Type" value={formData.employeeType} disabled={true} isSelect options={["Permanent", "Contract", "Intern", "Probation"]} />
            <InputField label="Work Mode" value={formData.workMode} disabled={true} isSelect options={["Office", "Remote", "Hybrid"]} />
            <InputField label="Probation Period" value={formData.probationPeriod} disabled={true} type="number" />
            <InputField label="Date of Leaving" value={formData.dateOfLeaving} disabled={true} type="date" />
            <InputField label="Notice Period (days)" value={formData.noticePeriod} disabled={true} type="number" />
            <InputField label="Salary (₹)" value={formData.salary} disabled={true} type="number" icon={<IndianRupee size={14} />} />
            <InputField label="Salary Type" value={formData.salaryType} disabled={true} isSelect options={["Monthly", "Weekly", "Hourly", "Daily"]} />
            <InputField label="Punch In Time" value={formData.punchInTime} disabled={true} type="time" />
            <InputField label="Punch Out Time" value={formData.punchOutTime} disabled={true} type="time" />
            <InputField label="CTC" value={formData.ctc} disabled={true} type="number" icon={<IndianRupee size={14} />} />
            <InputField label="Hike Effective Date" value={formData.hikeEffectiveDate} disabled={true} type="date" icon={<CalendarIcon size={14} />} />
            <InputField label="Hike Type" value={formData.hikeType} disabled={true} isSelect options={["percentage_%", "fixed_amount"]} icon={<Award size={14} />} />
            <InputField
              label={formData.hikeType === "percentage_%" ? "Hike Percentage (%)" : "Hike Value"}
              value={formData.hikeValue}
              disabled={true}
              type="number"
              icon={formData.hikeType === "percentage_%" ? <Percent size={14} /> : <IndianRupee size={14} />}
            />
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Hike Active
              </label>
              <div className="flex items-center h-[38px]">
                <button
                  type="button"
                  disabled={true}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    formData.hikeActive ? 'bg-[#0D47A1]' : 'bg-slate-200'
                  } opacity-50 cursor-not-allowed`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.hikeActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-slate-700">
                  {formData.hikeActive ? "On" : "Off"}
                </span>
              </div>
            </div>
            <MultiSelectDropdown label="Week Off Days" value={formData.weekOffDays} onChange={() => {}} options={WEEK_OFF_DAYS} icon={<CalendarDays size={14} />} disabled={true} />
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            {/* Asset Assignment Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <InputField label="Laptop Assigned" value={formData.laptopAssigned} disabled={true} isSelect options={["Yes", "No"]} icon={<Laptop size={14} />} />
              <InputField label="Mobile Assigned" value={formData.mobileAssigned} disabled={true} isSelect options={["Yes", "No"]} icon={<Smartphone size={14} />} />
            </div>

            {/* Laptop Details (Visible only if Laptop Assigned is Yes) */}
            {formData.laptopAssigned === "Yes" && (
              <div className="space-y-3 bg-blue-50/10 p-4 rounded-xl border border-blue-100/50 animate-fadeIn">
                <h4 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider flex items-center gap-2">
                  <Laptop size={14} /> Laptop Asset Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Laptop Name / Brand" value={formData.laptopName} disabled={true} icon={<Laptop size={14} />} />
                  <InputField label="Laptop Serial Number" value={formData.laptopSerialNumber} disabled={true} icon={<Hash size={14} />} />
                  <InputField label="System Login ID" value={formData.systemLoginId} disabled={true} icon={<UserCircle size={14} />} />
                  <InputField label="System Password" value={formData.systemPassword} disabled={true} type="password" icon={<Lock size={14} />} />
                </div>
              </div>
            )}

            {/* Mobile Details (Visible only if Mobile Assigned is Yes) */}
            {formData.mobileAssigned === "Yes" && (
              <div className="space-y-3 bg-emerald-50/10 p-4 rounded-xl border border-emerald-100/50 animate-fadeIn">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                  <Smartphone size={14} /> Mobile Asset Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Mobile Name / Brand" value={formData.mobileName} disabled={true} icon={<Smartphone size={14} />} />
                  <InputField label="IMEI Number" value={formData.mobileImei} disabled={true} icon={<Hash size={14} />} />
                  <InputField label="Mobile Serial Number" value={formData.mobileSerialNumber} disabled={true} icon={<Hash size={14} />} />
                  <InputField label="Mobile Password" value={formData.mobilePassword} disabled={true} type="password" icon={<Lock size={14} />} />
                  <InputField label="SIM Card Operator/Details" value={formData.simCard} disabled={true} icon={<IdCard size={14} />} />
                  <InputField label="Mobile Number (SIM)" value={formData.mobileNumberSim} disabled={true} icon={<Phone size={14} />} />
                </div>
              </div>
            )}

            {/* Office Credentials (Always Visible) */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <MailIcon size={14} /> Office Credentials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Office Email ID" value={formData.officeEmailId} disabled={true} icon={<MailIcon size={14} />} />
                <InputField label="Office Email Password" value={formData.officeEmailPassword} disabled={true} type="password" icon={<Lock size={14} />} />
              </div>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Account Holder Name" value={formData.accountHolderName} onChange={(v: string) => setFormData({ ...formData, accountHolderName: v })} disabled={disabled} />
            <InputField label="Bank Name" value={formData.bankName} onChange={(v: string) => setFormData({ ...formData, bankName: v })} disabled={disabled} />
            <InputField label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({ ...formData, accountNumber: v })} disabled={disabled} />
            <InputField label="IFSC Code" value={formData.ifscCode} onChange={(v: string) => setFormData({ ...formData, ifscCode: v })} disabled={disabled} />
            <InputField label="UPI ID" value={formData.upiId} onChange={(v: string) => setFormData({ ...formData, upiId: v })} disabled={disabled} />
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs text-left font-medium">
              KYC verification details are managed and updated by the HR administration department.
            </div>
            <InputField label="Aadhaar Card Number" value={formData.aadharNumber} disabled={true} />
            <InputField label="PAN Card Number" value={formData.panNumber} disabled={true} />
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-[#0D47A1]">Compliance Documents</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documentsList.filter(d => !d.employeeDeleted).map((doc) => {
                const hasFile = !!doc.fileName;
                const isOffer = doc.id === "offer";

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
                    const htmlContent = `
                      <html>
                        <body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; background: #f8fafc;">
                          <div style="max-width: 400px; margin: 40px auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: left; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #0F172A; margin: 0 0 10px 0;">${doc.name}</h2>
                            <p style="color: #64748b; font-size: 13px;">File: <b>${doc.fileName}</b></p>
                            <div style="margin: 20px 0; border: 2px dashed #cbd5e1; border-radius: 8px; height: 100px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">
                              [ Document Preview Mock ]
                            </div>
                            <p style="font-size: 10px; color: #94a3b8;">Size: ${doc.size} &bull; Uploaded: ${doc.uploadDate}</p>
                          </div>
                        </body>
                      </html>
                    `;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
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
                    const content = `Mock document details for ${doc.name}`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = doc.fileName || `${doc.id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                };

                return (
                  <div key={doc.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all duration-200">
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
                      <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider shrink-0 bg-emerald-100/60 text-emerald-700">
                        {doc.status}
                      </span>
                    </div>

                    <div className="border-t border-slate-200/40 mt-3 pt-2 flex gap-1.5 justify-end">
                      {hasFile ? (
                        <>
                          <button type="button" onClick={handlePreview} className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                            View
                          </button>
                          <button type="button" onClick={handleDownload} className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
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
                            Upload
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Upload Modal */}
            {showUploadModal && createPortal(
              <>
                <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={() => { setShowUploadModal(false); setDocDropdownOpen(false); }} />
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
                  <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto p-5 text-left border border-slate-100 flex flex-col space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                        <FileText className="text-[#0D47A1] w-4 h-4" /> Upload Document
                      </h3>
                      <button type="button" onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition cursor-pointer">
                        <X size={15} />
                      </button>
                    </div>

                    {uploadModalError && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg">{uploadModalError}</p>}

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
                              {masterDocuments && masterDocuments.map((docVal) => (
                                <div
                                  key={docVal}
                                  onClick={() => {
                                    setUploadDocName(docVal);
                                    setDocDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer transition-colors ${
                                    uploadDocName === docVal ? "bg-slate-50 text-[#0D47A1]" : ""
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
                          <label className="px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 rounded-xl cursor-pointer">
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
                                    const matchedDoc = masterDocuments?.find(d => d.toLowerCase() === capitalizedName.toLowerCase());
                                    if (matchedDoc) {
                                      setUploadDocName(matchedDoc);
                                    }
                                  }
                                }
                              }}
                            />
                          </label>
                          <span className="text-[11px] text-slate-500 truncate font-semibold">{uploadDocFile ? uploadDocFile.name : "No file selected"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 justify-end">
                      <button type="button" onClick={() => { setShowUploadModal(false); setDocDropdownOpen(false); }} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl">Cancel</button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!uploadDocName.trim()) { setUploadModalError("Please enter a name"); return; }
                          if (!uploadDocFile) { setUploadModalError("Please select a file"); return; }
                          const alreadyUploaded = documentsList.some(d => 
                            d.name.toLowerCase() === uploadDocName.toLowerCase() && 
                            !d.employeeDeleted
                          );
                          if (alreadyUploaded) {
                            setUploadModalError("This document type is already uploaded.");
                            return;
                          }
                          const sizeStr = uploadDocFile.size > 1024 * 1024 ? `${(uploadDocFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(uploadDocFile.size / 1024).toFixed(0)} KB`;
                          
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const fileBase64 = reader.result as string;
                            const exists = documentsList.some(d => d.name.toLowerCase() === uploadDocName.toLowerCase());
                            let updatedList = [];
                            if (exists) {
                              updatedList = documentsList.map(d => d.name.toLowerCase() === uploadDocName.toLowerCase() ? { 
                                ...d, 
                                fileName: uploadDocFile.name, 
                                fileContent: fileBase64, 
                                size: sizeStr, 
                                uploadDate: new Date().toLocaleDateString('en-CA'), 
                                status: "Uploaded",
                                employeeDeleted: false,
                                adminDeleted: false
                              } : d);
                            } else {
                              updatedList = [...documentsList, { 
                                id: `custom_${Date.now()}`, 
                                name: uploadDocName, 
                                fileName: uploadDocFile.name, 
                                fileContent: fileBase64, 
                                status: "Uploaded", 
                                size: sizeStr, 
                                uploadDate: new Date().toLocaleDateString('en-CA'), 
                                icon: "file",
                                employeeDeleted: false,
                                adminDeleted: false
                              }];
                            }
                            setDocumentsList(updatedList);
                            if (employee?.id) {
                              try {
                                const updated = await employeeApi.update(String(employee.id), { ...employee, documents: updatedList });
                                if (updated) {
                                  setEmployee(updated);
                                }
                                toast.success("Document uploaded successfully");
                              } catch (err) {
                                toast.error("Failed to save document to database");
                              }
                            }
                            setShowUploadModal(false);
                            setDocDropdownOpen(false);
                          };
                          reader.readAsDataURL(uploadDocFile);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold bg-[#0D47A1] text-white rounded-xl"
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
                          const updatedList = documentsList.map(d => d.id === docToRemove.id ? { ...d, employeeDeleted: true } : d);
                          setDocumentsList(updatedList);
                          if (employee?.id) {
                            try {
                              const updated = await employeeApi.update(String(employee.id), { ...employee, documents: updatedList });
                              if (updated) {
                                setEmployee(updated);
                              }
                              toast.success("Document removed successfully");
                            } catch (err) {
                              toast.error("Failed to save changes");
                            }
                          }
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-655 transition cursor-pointer border-none shadow-sm"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D47A1]" />
      </div>
    );
  }

  const fullName = `${employee?.firstName || ""}${employee?.middleName ? " " + employee.middleName : ""} ${employee?.lastName || ""}`;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "bg-emerald-100/60", color: "text-emerald-700", dot: "bg-emerald-500", label: "Active" };
      case "on_leave":
        return { bg: "bg-amber-100/60", color: "text-amber-700", dot: "bg-amber-500", label: "On Leave" };
      case "inactive":
        return { bg: "bg-slate-100/60", color: "text-slate-700", dot: "bg-slate-500", label: "Inactive" };
      case "terminated":
        return { bg: "bg-rose-100/60", color: "text-rose-700", dot: "bg-rose-500", label: "Terminated" };
      default:
        return { bg: "bg-emerald-100/60", color: "text-emerald-700", dot: "bg-emerald-500", label: "Active" };
    }
  };

  const statusCfg = getStatusConfig(employee?.status || "active");

  return (
    <div className="w-full h-[calc(100vh-95px)] overflow-hidden flex flex-col text-left">
      {/* Sticky Top Header Section */}
      <div className="flex-none space-y-3">
        {/* Top Header Card - Left aligned Profile details */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-row items-center gap-4 text-left shadow-sm">
          {/* Avatar on Left (Updateable) */}
          <Avatar
            name={fullName}
            url={avatarPreview || undefined}
            size="md"
            onUpload={handleAvatarUpload}
          />
          
          {/* Profile Info to the Right */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-slate-800 truncate">{fullName}</h2>
            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                <Hash size={10} className="text-slate-400" />
                {employee?.employeeId || "EMP-XXX"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.color}`}>
                <span className={`w-1 h-1 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              <span className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                <MailIcon size={10} className="text-slate-400" />
                {employee?.email || "No email"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Headers and Edit Button Row */}
        <div className="border-b border-slate-200 py-2 flex items-center justify-between flex-wrap gap-3 bg-white">
          {/* Scrollable Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false); // Reset editing mode when switching tabs
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0D47A1] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Body Content - Scrollable with rounded-md class */}
      <div className="flex-1 mt-3 overflow-y-auto no-scrollbar pb-6">
        <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm text-left">
          
          {/* Action button inside the form div (Only render if tab is editable) */}
          {isTabEditable && activeTab !== "documents" && (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {activeTab === "personal" && "Personal Details"}
                {activeTab === "address" && "Address Details"}
                {activeTab === "education" && "Educational Details"}
                {activeTab === "bank" && "Bank Details"}
              </h3>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#0D47A1] text-white rounded-lg text-xs font-bold hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
                    >
                      <Save size={12} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#0D47A1] text-white rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
                  >
                    <Edit size={12} /> Edit details
                  </button>
                )}
              </div>
            </div>
          )}

          <EditingContext.Provider value={isEditing}>
            {renderTabContent()}
          </EditingContext.Provider>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

const EditingContext = React.createContext(false);

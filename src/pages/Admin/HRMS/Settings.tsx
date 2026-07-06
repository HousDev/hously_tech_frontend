import React, { useState, useEffect, useRef } from "react";
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
  IdCard, CreditCard as CreditCardIcon, IndianRupee,
  Building as BuildingIcon, Factory, Store, Home as HomeIcon,
  Navigation, Map, MapPinOff, Loader2, RefreshCw as RefreshIcon,
  Settings, Users as UsersIcon, Briefcase as BriefcaseIcon2,
  FileText as FileTextIcon, Bell, Shield as ShieldIcon,
  CreditCard as CreditCardIcon2, CheckCircle, XCircle,
  CheckCircle as CheckCircleIcon, ClipboardCheck, MapPin as MapPinIcon2,
  Camera, Clock as ClockIcon2, Calendar as CalendarIcon2, Save as SaveIcon,
  RotateCcw, Ruler, Maximize, Minimize, MapPinned as MapPinnedIcon,
  Timer, CalendarRange, Smartphone as SmartphoneIcon,
  Camera as CameraIcon, Clock9, Clock12, Clock3, Clock6, LogOut, ScanFace
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { masterDataAPI } from "../../../lib/masterApi";
import { settingsApi } from "../../../lib/settingsApi";
import { FaceEnrollmentTab } from "./FaceEnrollmentTab";

import type { Company, Branch } from "../../../lib/settingsApi";

// ─── Delete Confirmation Modal ──────────────────────────────────────────────

const DeleteConfirmModal = ({
  title,
  onClose,
  onConfirm,
  deleting,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          }}
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 text-center">Delete {title}?</h3>
            <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer"
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

// ─── Company Form Modal ──────────────────────────────────────────────────────

const CompanyFormModal = ({
  onClose,
  onSave,
  editData,
  mode = "add",
}: {
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Company | Branch | null;
  mode?: "add" | "edit" | "branch";
}) => {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: editData?.name || "",
    code: editData?.code || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    address: editData?.address || "",
    city: editData?.city || "",
    state: editData?.state || "",
    country: editData?.country || "India",
    latitude: editData?.latitude || null,
    longitude: editData?.longitude || null,
    status: editData?.status || "active",
  });

  useEffect(() => {
    const loadLocationsFromMasters = async () => {
      try {
        const types = await masterDataAPI.getAllMasterTypes("common");
        const stateType = types.find((t: any) => t.name.toLowerCase() === "state");
        const cityType = types.find((t: any) => t.name.toLowerCase() === "city");

        if (stateType) {
          const vals = await masterDataAPI.getMasterValues(stateType.id);
          setStatesList(vals.filter((v: any) => v.status === "Active" || v.status === "active").map((v: any) => v.value));
        }
        if (cityType) {
          const vals = await masterDataAPI.getMasterValues(cityType.id);
          setCitiesList(vals.filter((v: any) => v.status === "Active" || v.status === "active").map((v: any) => v.value));
        }
      } catch (err) {
        console.error("Failed to load master location data", err);
      }
    };
    loadLocationsFromMasters();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const getLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setGettingLocation(false);
          setShowLocation(true);
          toast.success("Location fetched successfully!");
        },
        (_error) => {
          setLocationError("Permission denied. Please allow location access.");
          setGettingLocation(false);
          toast.error("Failed to get location");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave(formData);
      setSaving(false);
      handleClose();
    }, 500);
  };

  const isBranch = mode === "branch";
  const title = isBranch ? "Add New Branch" : "Add New Company";
  const subtitle = isBranch ? "Create new branch profile" : "Create new company profile";

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full max-w-2xl transition-all duration-300 flex flex-col max-h-[90vh]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
          }}
        >
          <div className="px-6 py-3.5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center shadow-sm">
                  <BuildingIcon size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-800">{title}</h2>
                  <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3 overflow-hidden">
            <h3 className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider flex items-center gap-2">
              <Building2 size={12} /> {isBranch ? "Branch Details" : "Company Details"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., COMP001"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="company@example.com"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit phone number"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>

              <div className="col-span-2 space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white"
                >
                  <option value="">Select State</option>
                  {statesList.map((st, index) => (
                    <option key={index} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white"
                >
                  <option value="">Select City</option>
                  {citiesList.map((ct, index) => (
                    <option key={index} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 bg-white"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-slate-100 pt-3 mt-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-extrabold text-[#0D47A1] uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={12} /> Location
                </h3>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={gettingLocation}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#0D47A1] text-white rounded-lg text-[10px] font-bold hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Getting...
                    </>
                  ) : (
                    <>
                      <Navigation size={12} /> Get Location
                    </>
                  )}
                </button>
              </div>

              {locationError && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200 text-red-600 text-xs">
                  <MapPinOff size={14} />
                  {locationError}
                </div>
              )}

              {showLocation && location && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="space-y-0.5">
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={location.lat}
                      readOnly
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-700"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={location.lng}
                      readOnly
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-700"
                    />
                  </div>
                </div>
              )}

              {!showLocation && !locationError && (
                <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                  <MapPin size={18} className="text-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Click "Get Location" to fetch current location</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-lg hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Creating..." : mode === "branch" ? "Create Branch" : "Create Company"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─── Branch View Modal ──────────────────────────────────────────────────────

const BranchViewModal = ({
  company,
  onClose,
  onEditBranch,
  onDeleteBranch,
}: {
  company: Company;
  onClose: () => void;
  onEditBranch: (company: Company, branch: Branch) => void;
  onDeleteBranch: (company: Company, branch: Branch) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const filteredBranches = company.branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full max-w-lg transition-all duration-300 flex flex-col"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
            maxHeight: "80vh",
          }}
        >
          <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Branches - {company.name}
                </h2>
                <p className="text-[10px] text-slate-400">{filteredBranches.length} branches found</p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 px-5 py-2.5 border-b border-slate-100">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search branches..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredBranches.length === 0 && (
              <div className="text-center py-8">
                <Store size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-medium">No branches found</p>
              </div>
            )}

            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-[#0D47A1]/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Store size={13} className="text-[#0D47A1] flex-shrink-0" />
                      <h4 className="font-bold text-sm text-slate-800 truncate">{branch.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 ${branch.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                          }`}
                      >
                        {branch.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{branch.code}</p>
                    <div className="mt-1 text-[10px] text-slate-500 space-y-0.5">
                      <p className="flex items-center gap-1 truncate">
                        <Mail size={10} className="flex-shrink-0" /> {branch.email}
                      </p>
                      <p className="flex items-center gap-1 truncate">
                        <Phone size={10} className="flex-shrink-0" /> {branch.phone}
                      </p>
                      <p className="flex items-center gap-1 truncate">
                        <MapPin size={10} className="flex-shrink-0" /> {branch.address || "No address"}, {branch.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => onEditBranch(company, branch)}
                      className="p-1 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDeleteBranch(company, branch)}
                      className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-1.5 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Company Card ─────────────────────────────────────────────────────────────

const CompanyCard = ({
  company,
  onViewBranches,
  onAddBranch,
  onEdit,
  onDelete,
}: {
  company: Company;
  onViewBranches: (company: Company) => void;
  onAddBranch: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}) => {
  const activeBranches = company.branches.filter(b => b.status === "active").length;
  const inactiveBranches = company.branches.filter(b => b.status === "inactive").length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0D47A1]/10 to-[#1976D2]/10 flex items-center justify-center flex-shrink-0">
            <BuildingIcon size={16} className="text-[#0D47A1]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-800 truncate">{company.name}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${company.status === "active"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
                  }`}
              >
                {company.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">{company.code}</p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 truncate">
                <MapPin size={11} className="flex-shrink-0" /> {company.address || "No address"}
              </span>
              <span className="flex items-center gap-1 truncate">
                <Mail size={11} className="flex-shrink-0" /> {company.email}
              </span>
              <span className="flex items-center gap-1 truncate">
                <Phone size={11} className="flex-shrink-0" /> {company.phone}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(company)}
            className="p-1 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(company)}
            className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-semibold text-slate-600">Branches:</span>
          <span className="text-emerald-600 font-bold">{activeBranches} Active</span>
          <span className="text-slate-300">|</span>
          <span className="text-red-500 font-bold">{inactiveBranches} Inactive</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewBranches(company)}
            className="px-2.5 py-1 text-[10px] font-bold text-[#0D47A1] border border-[#0D47A1]/30 rounded-lg hover:bg-[#0D47A1]/5 transition cursor-pointer"
          >
            View All Branches
          </button>
          <button
            onClick={() => onAddBranch(company)}
            className="px-2.5 py-1 text-[10px] font-bold bg-[#0D47A1] text-white rounded-lg hover:opacity-90 transition shadow-sm cursor-pointer"
          >
            <Plus size={11} className="inline mr-1" /> Add Branch
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Settings Tabs ──────────────────────────────────────────────────────────

const SettingsTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: "companies", label: "Companies", icon: <BuildingIcon size={14} /> },
    { id: "security", label: "Security", icon: <ShieldCheck size={14} /> },
    {
      id: "face-enrollment",
      label: "Attendance Face Enrollment",
      icon: <ScanFace size={14} />,
    },


  ];

  return (
    <div className="bg-transparent border-b border-slate-200">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  );
};

// ─── Stats Cards ─────────────────────────────────────────────────────────────

const StatsCards = ({ companies }: { companies: Company[] }) => {
  const total = companies.length;
  const active = companies.filter(c => c.status === "active").length;
  const inactive = companies.filter(c => c.status === "inactive").length;

  return (
    <div className="bg-transparent py-3 border-b border-slate-100">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0D47A1] flex items-center justify-center">
            <BuildingIcon size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-lg font-extrabold text-slate-800">{total}</p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <CheckCircleIcon size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-lg font-extrabold text-emerald-700">{active}</p>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
            <XCircle size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Inactive</p>
            <p className="text-lg font-extrabold text-red-600">{inactive}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Security Settings Component ────────────────────────────────────────────

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    punchInRadius: 200,
    punchOutRadius: 200,
    maxDistance: 500,
    allowRemotePunch: false,
    autoPunchOut: false,
    autoPunchOutRadius: 1.00,
    delay: 15,
    geolocationTracking: false,
    selfieOnPunch: false,
    maxPunchInTime: "10:30",
    minPunchOutTime: "18:00",
    allowWeekendPunch: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success("Security settings saved successfully!");
  };

  const handleResetDefaults = () => {
    setFormData({
      punchInRadius: 200,
      punchOutRadius: 200,
      maxDistance: 500,
      allowRemotePunch: false,
      autoPunchOut: false,
      autoPunchOutRadius: 1.00,
      delay: 15,
      geolocationTracking: false,
      selfieOnPunch: false,
      maxPunchInTime: "10:30",
      minPunchOutTime: "18:00",
      allowWeekendPunch: false,
    });
    toast.success("Settings reset to defaults!");
  };

  const handleRefresh = () => {
    toast.success("Security settings refreshed!");
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-[#0D47A1] transition-colors duration-300 shadow-inner">
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
      </div>
    </label>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header - Sticky */}
      <div className="flex-none bg-transparent py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#0D47A1]" />
            Security Configuration
          </h1>
          <p className="text-xs text-slate-400">Configure system security and attendance settings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-bold hover:bg-[#1565C0] transition shadow-sm cursor-pointer"
          >
            <RefreshIcon size={14} /> Refresh
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#475569] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-sm cursor-pointer"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 pt-4 pb-6 pr-1">
        {/* Location Validation */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon2 size={24} className="text-green-500" />
            <h3 className="text-sm font-extrabold text-slate-800">Location Validation</h3>
            <span className="text-xs text-slate-400 ml-2">Require employees to be within office radius to punch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Punch-In Radius (meters)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D47A1]">
                  <Ruler size={14} className="text-blue-500 font-bold" />
                </div>
                <input
                  type="number"
                  value={formData.punchInRadius}
                  onChange={(e) => handleChange('punchInRadius', parseInt(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Distance allowed for punch-in</p>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Punch-Out Radius (meters)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D47A1]">
                  <Ruler size={14} className="text-red-500 font-bold" />
                </div>
                <input
                  type="number"
                  value={formData.punchOutRadius}
                  onChange={(e) => handleChange('punchOutRadius', parseInt(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Distance allowed for punch-out</p>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Max Distance (meters)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D47A1]">
                  <Maximize size={14} className="text-yellow-500 font-bold" />
                </div>
                <input
                  type="number"
                  value={formData.maxDistance}
                  onChange={(e) => handleChange('maxDistance', parseInt(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Maximum punch distance allowed</p>
            </div>
          </div>
        </div>

        {/* Remote Punch & Auto Punch-Out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <SmartphoneIcon size={24} className="text-red-500 font-extrabold" />
                  Allow Remote Punch
                </h4>
                <p className="text-xs text-slate-400 ml-7">Allow employees to punch from outside office</p>
              </div>
              <ToggleSwitch checked={formData.allowRemotePunch} onChange={(v) => handleChange('allowRemotePunch', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <LogOut size={24} className="text-[#0D47A1] font-extrabold" />
                  Auto Punch-Out
                </h4>
                <p className="text-xs text-slate-400 ml-7">Automatically logout if outside office radius</p>
              </div>
              <ToggleSwitch checked={formData.autoPunchOut} onChange={(v) => handleChange('autoPunchOut', v)} />
            </div>
          </div>
        </div>

        {/* Auto Punch-Out Radius & Delay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <label className="text-[10px] font-extrabold text-black uppercase tracking-wider block mb-1">
              Auto Punch-Out Radius (km)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D47A1] font-extrabold">
                <MapPinnedIcon size={18} />
              </div>
              <input
                type="number"
                step="0.01"
                value={formData.autoPunchOutRadius}
                onChange={(e) => handleChange('autoPunchOutRadius', parseFloat(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <label className="text-[10px] font-extrabold text-black uppercase tracking-wider block mb-1">
              Delay (minutes)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-extrabold">
                <Timer size={18} />
              </div>
              <input
                type="number"
                value={formData.delay}
                onChange={(e) => handleChange('delay', parseInt(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Geolocation Tracking & Selfie on Punch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 ">
                  <MapPinned size={24} className="text-green-500" />
                  Geolocation Tracking
                </h4>
                <p className="text-xs text-slate-400 ml-7">Track employee location during work hours</p>
              </div>
              <ToggleSwitch checked={formData.geolocationTracking} onChange={(v) => handleChange('geolocationTracking', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <CameraIcon size={24} className="text-purple-500" />
                  Selfie on Punch
                </h4>
                <p className="text-xs text-slate-400 ml-7">Require photo verification for punches</p>
              </div>
              <ToggleSwitch checked={formData.selfieOnPunch} onChange={(v) => handleChange('selfieOnPunch', v)} />
            </div>
          </div>
        </div>

        {/* Time Restrictions */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon2 size={24} className="text-orange-500" />
            <h3 className="text-sm font-extrabold text-slate-800">Time Restrictions</h3>
            <span className="text-xs text-slate-400 ml-2">Set allowed punch-in/out times</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Max Punch-In Time
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-extrabold">
                  <Clock9 size={16} />
                </div>
                <input
                  type="time"
                  value={formData.maxPunchInTime}
                  onChange={(e) => handleChange('maxPunchInTime', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Latest time to punch-in</p>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Min Punch-Out Time
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-extrabold">
                  <Clock3 size={16} />
                </div>
                <input
                  type="time"
                  value={formData.minPunchOutTime}
                  onChange={(e) => handleChange('minPunchOutTime', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Earliest time to punch-out</p>
            </div>
          </div>
        </div>

        {/* Allow Weekend Punch */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <CalendarRange size={24} className="text-blue-500" />
                Allow Weekend Punch
              </h4>
              <p className="text-xs text-slate-400 ml-7">Allow employees to punch on weekends</p>
            </div>
            <ToggleSwitch checked={formData.allowWeekendPunch} onChange={(v) => handleChange('allowWeekendPunch', v)} />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-md cursor-pointer"
          >
            <SaveIcon size={16} /> Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Settings Page ─────────────────────────────────────────────────────

export default function SettingsPage() {
  const ctx =
    useOutletContext<{
      setHeaderTitle: (t: string) => void;
      setHeaderSubtitle: (s: string) => void;
    }>() || {};

  useEffect(() => {
    ctx.setHeaderTitle?.("Settings");
    ctx.setHeaderSubtitle?.("Manage company, users, roles and more");
  }, [ctx]);

  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showBranches, setShowBranches] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingBranch, setEditingBranch] = useState<{ company: Company; branch: Branch } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "company" | "branch"; data: any; company?: Company } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getCompanies();
      setCompanies(data);
    } catch (e) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreateCompany = async (data: any) => {
    try {
      if (editingCompany) {
        await settingsApi.updateCompany(editingCompany.id, {
          name: data.name,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status,
        });
        toast.success("Company updated successfully!");
        setEditingCompany(null);
      } else {
        await settingsApi.createCompany(data);
        toast.success("Company created successfully!");
      }
      setShowCompanyModal(false);
      loadCompanies();
    } catch (error: any) {
      toast.error("Failed to save company");
    }
  };

  const handleAddBranch = async (data: any) => {
    if (!selectedCompany) return;
    try {
      if (editingBranch) {
        await settingsApi.updateBranch(editingBranch.branch.id, {
          name: data.name,
          code: data.code,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status,
        });
        toast.success("Branch updated successfully!");
        setEditingBranch(null);
      } else {
        await settingsApi.createBranch(selectedCompany.id, data);
        toast.success("Branch created successfully!");
      }
      setShowBranchModal(false);
      loadCompanies();
      if (showBranches) {
        const updatedCompanyList = await settingsApi.getCompanies();
        const updatedShowBranch = updatedCompanyList.find(c => c.id === showBranches.id);
        if (updatedShowBranch) {
          setShowBranches(updatedShowBranch);
        }
      }
    } catch (e: any) {
      toast.error("Failed to save branch");
    }
  };

  const handleEditBranch = (company: Company, branch: Branch) => {
    setEditingBranch({ company, branch });
    setSelectedCompany(company);
    setShowBranchModal(true);
  };

  const handleDeleteCompany = async () => {
    if (!deleteTarget || deleteTarget.type !== "company") return;
    setDeleting(true);
    try {
      await settingsApi.deleteCompany(deleteTarget.data.id);
      toast.success("Company deleted successfully!");
      setDeleteTarget(null);
      loadCompanies();
    } catch (e) {
      toast.error("Failed to delete company");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!deleteTarget || deleteTarget.type !== "branch" || !deleteTarget.company) return;
    setDeleting(true);
    try {
      await settingsApi.deleteBranch(deleteTarget.data.id);
      toast.success("Branch deleted successfully!");
      setDeleteTarget(null);
      loadCompanies();
      if (showBranches) {
        const updatedCompanyList = await settingsApi.getCompanies();
        const updatedShowBranch = updatedCompanyList.find(c => c.id === showBranches.id);
        if (updatedShowBranch) {
          setShowBranches(updatedShowBranch);
        }
      }
    } catch (e) {
      toast.error("Failed to delete branch");
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = () => {
    loadCompanies();
    toast.success("Data refreshed!");
  };

  const renderContent = () => {
    if (activeTab === "security") {
      return <SecuritySettings />;
    }

    if (activeTab === "face-enrollment") {
      return <FaceEnrollmentTab />;
    }

    if (activeTab === "companies") {
      return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex-none bg-transparent py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">Companies</h1>
              <p className="text-xs text-slate-400">Company Management</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                title="Refresh"
              >
                <RefreshIcon size={16} />
              </button>
              <button
                onClick={() => {
                  setEditingCompany(null);
                  setShowCompanyModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                <Plus size={16} /> Create Company
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex-none">
            <StatsCards companies={companies} />
          </div>

          {/* Company List */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pb-6 pr-1">
            {companies.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <BuildingIcon size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No companies found</p>
                <button
                  onClick={() => setShowCompanyModal(true)}
                  className="mt-3 px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm cursor-pointer"
                >
                  <Plus size={14} className="inline mr-1" /> Create Company
                </button>
              </div>
            )}
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewBranches={(c) => setShowBranches(c)}
                onAddBranch={(c) => {
                  setSelectedCompany(c);
                  setEditingBranch(null);
                  setShowBranchModal(true);
                }}
                onEdit={(c) => {
                  setEditingCompany(c);
                  setShowCompanyModal(true);
                }}
                onDelete={(c) => setDeleteTarget({ type: "company", data: c })}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };


  return (
    <div className="p-4 md:p-6 flex flex-col h-[calc(100vh-70px)] overflow-hidden">
      {/* Settings Header - Static */}
      <div className="flex-none bg-transparent py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center shadow-sm">
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-400">Manage company, users, roles and more</p>
        </div>
      </div>

      {/* Tabs - Static */}
      <div className="flex-none">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 mt-4 overflow-hidden">
        {renderContent()}
      </div>

      {/* Company Form Modal - No Scroll */}
      {showCompanyModal && (
        <CompanyFormModal
          mode={editingCompany ? "edit" : "add"}
          editData={editingCompany}
          onClose={() => {
            setShowCompanyModal(false);
            setEditingCompany(null);
          }}
          onSave={handleCreateCompany}
        />
      )}

      {/* Branch Form Modal - No Scroll */}
      {showBranchModal && selectedCompany && (
        <CompanyFormModal
          mode={editingBranch ? "edit" : "branch"}
          editData={editingBranch?.branch || null}
          onClose={() => {
            setShowBranchModal(false);
            setSelectedCompany(null);
            setEditingBranch(null);
          }}
          onSave={handleAddBranch}
        />
      )}

      {/* Branch View Modal */}
      {showBranches && (
        <BranchViewModal
          company={showBranches}
          onClose={() => setShowBranches(null)}
          onEditBranch={handleEditBranch}
          onDeleteBranch={(company, branch) => setDeleteTarget({ type: "branch", data: branch, company })}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.type === "company" ? "Company" : "Branch"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteTarget.type === "company" ? handleDeleteCompany : handleDeleteBranch}
          deleting={deleting}
        />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
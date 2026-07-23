import React, { useEffect, useState, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Shield,
  Save,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  DollarSign,
  FileText,
  Clock,
  Calendar,
  Layers,
  Globe,
  Settings,
  CheckCircle2,
  Check,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Sparkles,
  Wallet,
} from "lucide-react";

import api from "../../lib/api";
import { masterDataAPI } from "../../lib/masterApi";

interface PermissionItem {
  id: string;
  label: string;
}

interface PermissionModule {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  permissions: PermissionItem[];
}

interface UserItem {
  id: string;
  name: string;
  employee_id: string;
  role?: string;
}

// 100% Real Hously System Modules Map based on actual routes, components, and controllers
const HOUSLY_MODULES_DATA: PermissionModule[] = [
  {
    id: "administration",
    name: "Administration",
    icon: Layers,
    description: "System Master Data Types, Custom Document Templates, Status Updates & Exports",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "manage_master_types", label: "Manage Master " },
      { id: "users_manage", label: "Manage Users" },
      { id: "gernal_settings", label: "Gernal Settings" },
      { id: "permissions_manage", label: "Manage Permissions" },
      { id: "documents_manage", label: "Manage Documents" },
      { id: "intigration_manage", label: "Manage Intigration" },
      { id: "settings_manage", label: "Manage Settings" },

    ],
  },
  {
    id: "dashboard",
    name: "Dashboard & Analytics",
    icon: Layers,
    description: "Main Admin & HRMS Dashboard view and analytics controls",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_admin_dashboard", label: "View Admin Dashboard" },
      { id: "view_hrms_dashboard", label: "View HRMS Dashboard" },
      { id: "view_reports", label: "View Reports" },
      { id: "export_reports", label: "Export Reports" },
    ],
  },
  {
    id: "hrms",
    name: "HRMS & Employee Management",
    icon: Users,
    description: "Employee Directory, Profiles, Onboarding, Asset Tracking, KYC, Bank Verification, Biometrics, Recruitment & HR Reports",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_employees", label: "View Employee" },
      { id: "create_employees", label: "Create Employee" },
      { id: "edit_employees", label: "Edit Employee" },
      { id: "delete_employees", label: "Delete Employee" },
      { id: "update_employees_status", label: "Update Employee status" },
      { id: "view_hr_reports", label: "View HR Reports" },
      { id: "export_employees", label: "Export Employee" },
      { id: "view_hr_reports_export", label: "View HR Reports Export (Excel/PDF)" },
    ],
  },
  {
    id: "payroll",
    name: "Payroll",
    icon: DollarSign,
    description: "CTC Config, Payroll Processing, Payslips, Incentives, Tax Declarations, TDS & Payouts",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_payroll_summary", label: "View Payroll Summary" },
      { id: "view_ctc_config", label: "View Employee CTC Structure & Allowances" },
      { id: "view_advances", label: "View Advances" },
      { id: "view_incentives", label: "View Incentives" },
      { id: "view_reimbursement", label: "View Reimbursement" },
      { id: "view_payment_history", label: "View Payment History" },
    ],
  },
  {
    id: "payroll_ctc_config",
    name: "Payroll Configuration",
    icon: DollarSign,
    description: "CTC Configuration ",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_ctc_config", label: "View CTC Configuration" },
      { id: "create_ctc_config", label: "Create CTC Configuration" },
      { id: "edit_ctc_config", label: "Edit CTC Configuration" },
      { id: "delete_ctc_config", label: "Delete CTC Configuration" },
    ],
  },
  {
    id: "payroll_advance",
    name: "Payroll Advance",
    icon: Wallet,
    description: "Salary Advances, EMI Tenure Repayments, Outstanding Balances & Approvals",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_advance_salary", label: "View Advance Salary " },
      { id: "create_advance_salary", label: "Create Advance Salary Request" },
      { id: "edit_advance_salary", label: "Edit Advance Salary Request" },
      { id: "update_advance_status", label: "Update Advance Salary Status" },
      { id: "delete_advance_salary", label: "Delete Advance Salary Request" },
    ],
  },
  {
    id: "payroll_incentive",
    name: "Payroll Incentive",
    icon: Wallet,
    description: "Incentives Management  ",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_incentive", label: "View Incentive " },
      { id: "create_incentive", label: "Create Incentive" },
      { id: "edit_incentive", label: "Edit Incentive" },
      { id: "update_incentive_status", label: "Update Incentive Status" },
      { id: "delete_incentive", label: "Delete Incentive" },
    ],
  },
  {
    id: "payroll_tds",
    name: "Payroll TDS",
    icon: Wallet,
    description: "TDS Declarations, Investment Proofs, Tax Computation & Compliance Reports",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_tds_declarations", label: "View TDS Declarations" },
      { id: "run_tds_declarations", label: "Run TDS Declarations" },
      { id: "update_tds_declarations", label: "Update TDS Declaration" },
      { id: "delete_tds_declarations", label: "Delete TDS Declaration" },
      { id: "chose_regime", label: "Chose Regime" },
      { id: "view_investment_proofs", label: "View Investment Proofs" },
      { id: "submit_investment_proofs", label: "Submit Investment Proofs" },
    ],
  },

  {
    id: "attendance",
    name: "Attendance & Shifts",
    icon: Clock,
    description: "Daily Punch Logs, Geolocation & Selfie Punch, Regularizations, and Shift Schedules",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_attendance", label: "View Daily Punch Logs" },
      { id: "edit_attendance", label: "Edit Attendance" },
      { id: "mark_attendance", label: "Mark Attendance" },
      { id: "apply_regularization", label: "Apply for Missed Punch / Regularization Request" },
      { id: "update_regularization", label: "Update status of Attendance Regularization Requests" },
      { id: "export_attendance", label: "Export Monthly Attendance Records & Reports (Excel / PDF / CSV)" },
    ],
  },
  {
    id: "leaves",
    name: "Leave Management",
    icon: Calendar,
    description: "Leave Applications, Approvals, Annual Balances, Bulk Actions & Policies",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_leaves", label: "View Leave" },
      { id: "create_leave", label: "Create Leave" },
      { id: "update_leave", label: "Update Leave" },
      { id: "delete_leave", label: "Delete Leave" },
    ],
  },
  {
    id: "tasks",
    name: "Task & Project Management",
    icon: Briefcase,
    description: "Assigning Tasks, Tracking Progress, Hours Logging, Comments & Analytics",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_tasks", label: "View Task List" },
      { id: "create_tasks", label: "Create Tasks" },
      { id: "edit_tasks", label: "Edit Task" },
      { id: "update_task_status", label: "Update Task Status " },
      { id: "delete_tasks", label: "Delete Task" },
    ],
  },
  {
    id: "helpdesk",
    name: "Helpdesk & Tickets",
    icon: HelpCircle,
    description: "Employee Support Tickets, Category Tags, Agent Assignments & Resolution Pipeline",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_tickets", label: "View Tickets List" },
      { id: "create_tickets", label: "Create Ticket" },
      { id: "update_tickets", label: "Edit Ticket" },
      { id: "update_ticket_status", label: "Update Ticket Status " },
      { id: "delete_tickets", label: "Delete Ticket Records" },
      { id: "bulk_ticket_actions", label: "Bulk Actions On Selected Tickets" },
    ],
  },
  {
    id: "expenses",
    name: "Company Expenses",
    icon: DollarSign,
    description: "Office Vouchers, Operational Expenses, Receipt Verification & Audit Approvals",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_expenses", label: "View Expenses " },
      { id: "create_expenses", label: "Create Expense" },
      { id: "edit_expenses", label: "Edit Expense" },
      { id: "update_expenses", label: "Update Status" },
      { id: "delete_expenses", label: "Delete Expense" },
      { id: "export_expenses", label: "Export (Excel/PDF/CSV) Expense" },
    ],
  },
  {
    id: "cms",
    name: "CMS Content",
    icon: Globe,
    description: "Website CMS Management (Home, Services, Blogs, Careers, Case Studies, Team, Testimonials, Settings & Enquiries)",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "manage_home_cms", label: "Manage Home Page" },
      { id: "manage_services_cms", label: "Manage Services Page" },
      { id: "manage_blog_cms", label: "Manage Blog Page" },
      { id: "manage_career_cms", label: "Manage Job Openings Page" },
      { id: "manage_casestudy_cms", label: "Manage Case Studies Page" },
      { id: "manage_team_cms", label: "Manage Team Members Page" },
      { id: "manage_testimonials_cms", label: "Manage Client Testimonials Page" },
      { id: "publish_cms_content", label: "Publish / Unpublish Live Website Content" },
    ],
  },
  {
    id: "job_applications",
    name: "Job Applications",
    icon: Briefcase,
    description: "Applicant Resumes, Candidate Screening, Interview Scheduling & Hiring Status",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_job_applications", label: "View Applications" },
      { id: "view_applicant_resume", label: "View Resume" },
      { id: "update_application_status", label: "Update Status" },
      { id: "schedule_candidate_interview", label: "Schedule Interview" },
      { id: "send_applicant_email", label: "Send Email" },
      { id: "add_applicant_notes", label: "Add Notes" },
      { id: "delete_job_application", label: "Delete Application" },
      { id: "export_job_applicants", label: "Export Data" },
    ],
  },
  {
    id: "enquiry",
    name: "Enquiries",
    icon: Briefcase,
    description: "Enquiries Management",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_enquiries", label: "View Enquiry" },
      { id: "create_enquiry", label: "Create Enquiry" },
      { id: "edit_enquiry", label: "Edit Enquiry" },
      { id: "update_status_enquiry", label: "Update status Enquiry" },
      { id: "delete_enquiry", label: "Delete Enquiry" },
      { id: "export_import_enquiry", label: "Export/Import Enquiry" },
    ],
  },
  {
    id: "meetings",
    name: "Meetings",
    icon: Calendar,
    description: "Meetings Management",
    permissions: [
      { id: "full_access", label: "Full Access" },
      { id: "view_meetings", label: "View Meeting" },
      { id: "create_meeting", label: "Create Meeting" },
      { id: "edit_meeting", label: "Edit Meeting" },
      { id: "delete_meeting", label: "Delete Meeting" },
    ],
  },


];



interface SearchableSelectOption {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function SearchableSelect({ options, value, onChange, placeholder = "Search or select..." }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => String(o.id) === String(value));

  // Sync display text with selected option
  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.name);
    }
  }, [value, selectedOption]);

  // Filter options as user types directly in the input box
  const filteredOptions = useMemo(() => {
    if (!query.trim() || (selectedOption && query === selectedOption.name)) {
      return options;
    }
    const term = query.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(term));
  }, [options, query, selectedOption]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedOption) {
          setQuery(selectedOption.name);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Direct Inline Editable Input Box */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-300 rounded-lg pl-3.5 pr-8 py-2 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-text shadow-2xs transition-all"
        />
        <ChevronDown
          size={14}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* Floating Options List Popup (Max 5 items ~ h-48 height, hidden scrollbar) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-48 overflow-y-auto space-y-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.id) === String(value);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setQuery(opt.name);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${isSelected
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    <span className="truncate">{opt.name}</span>
                    {isSelected && <Check size={13} className="text-blue-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 font-medium">No matching results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PermissionsPage() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Permissions");
      setHeaderSubtitle("Manage permissions settings across all Hously system modules");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Dynamic Roles fetched from masterDataAPI
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);

  // Dynamic Users fetched from Employees API (employee_details)
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // Tab State: Role Permissions vs User Permissions
  const [activeTab, setActiveTab] = useState<"role" | "user">("role");
  const [selectedRole, setSelectedRole] = useState("PAYROLL MANAGER");
  const [selectedUser, setSelectedUser] = useState("u4");

  // Fetch Employees from employee_details API for TARGET USER dropdown
  useEffect(() => {
    const fetchEmployeesFromAPI = async () => {
      try {
        setLoadingUsers(true);
        let data: any[] = [];

        try {
          const res = await api.get("/employees");
          data = res?.data?.data || res?.data || [];
        } catch (e) {
          const res = await api.get("/tasks/employees");
          data = res?.data?.data || res?.data || [];
        }

        if (Array.isArray(data) && data.length > 0) {
          const mappedUsers: UserItem[] = data.map((emp: any, index: number) => {
            const firstName = emp.firstName || emp.first_name || "";
            const middleName = emp.middleName || emp.middle_name || "";
            const lastName = emp.lastName || emp.last_name || "";

            let fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();

            if (!fullName) {
              fullName =
                emp.full_name ||
                emp.fullname ||
                emp.name ||
                emp.user_name ||
                emp.username ||
                "Employee";
            }

            const empCode =
              emp.employeeId ||
              emp.employee_id ||
              emp.emp_id ||
              emp.empId ||
              `EMP-${String(emp.id || emp.user_id || index + 1).padStart(3, "0")}`;

            return {
              id: String(emp.id || emp.user_id || emp.userId || `u_${index}`),
              name: fullName,
              employee_id: String(empCode),
              role: emp.role || emp.designationRole || "STAFF",
            };
          });

          if (mappedUsers.length > 0) {
            setUsersList(mappedUsers);
            if (!mappedUsers.some((u) => String(u.id) === String(selectedUser))) {
              setSelectedUser(String(mappedUsers[0].id));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching employees for User Permissions:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchEmployeesFromAPI();
  }, []);

  // Fetch Roles from masterDataAPI where masterType name is 'Role'
  useEffect(() => {
    const fetchMasterRoles = async () => {
      try {
        setLoadingRoles(true);
        const tabs = ["common", "hrms", "documents"];
        let roleMasterType: any = null;

        for (const tabId of tabs) {
          try {
            const types = await masterDataAPI.getAllMasterTypes(tabId);
            if (Array.isArray(types)) {
              const found = types.find(
                (t: any) =>
                  t.name &&
                  (t.name.toLowerCase().trim() === "role" ||
                    t.name.toLowerCase().includes("role"))
              );
              if (found) {
                roleMasterType = found;
                break;
              }
            }
          } catch (err) {
            // continue checking next tab
          }
        }

        if (roleMasterType && roleMasterType.id) {
          const values = await masterDataAPI.getMasterValues(roleMasterType.id);
          if (Array.isArray(values) && values.length > 0) {
            const fetchedRoles = values
              .filter((v: any) => v.status === "Active" || !v.status)
              .map((v: any) => (v.value ? v.value.toUpperCase().trim() : ""))
              .filter(Boolean);

            if (fetchedRoles.length > 0) {
              if (!fetchedRoles.includes("SUPER ADMIN")) {
                fetchedRoles.unshift("SUPER ADMIN");
              }
              setRolesList(fetchedRoles);
              if (!fetchedRoles.includes(selectedRole)) {
                setSelectedRole(fetchedRoles[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching master roles from API:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchMasterRoles();
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  // Real Hously Initial Role Permissions Mapping
  const [rolePermissions, setRolePermissions] = useState<Record<string, Set<string>>>({
    "SUPER ADMIN": new Set(HOUSLY_MODULES_DATA.flatMap((m) => m.permissions.map((p) => p.id))),
    "HR MANAGER": new Set([
      "view_admin_dashboard",
      "view_hrms_dashboard",
      "view_employees",
      "create_employees",
      "edit_employees",
      "delete_employees",
      "update_employees_status",
      "view_hr_reports",
      "export_employees",
      "view_hr_reports_export",
      "view_attendance",
      "mark_attendance",
      "apply_regularization",
      "update_regularization",
      "export_attendance",
      "view_leaves",
      "create_leave",
      "update_leave",
      "delete_leave",
      "view_tasks",
      "create_tasks",
      "edit_tasks",
      "update_task_status",
      "delete_tasks",
      "view_tickets",
      "create_tickets",
      "update_tickets",
      "update_ticket_status",
      "delete_tickets",
      "bulk_ticket_actions",
      "view_ctc_config",
      "documents_manage",
      "users_manage",
      "view_job_applications",
      "update_application_status",
      "schedule_candidate_interview",
      "view_enquiries",
      "update_status_enquiry",
      "view_meetings",
      "create_meeting",
    ]),
    "PAYROLL MANAGER": new Set([
      "view_admin_dashboard",
      "view_payroll_summary",
      "view_ctc_config",
      "edit_ctc_config",
      "view_advances",
      "view_incentives",
      "view_reimbursement",
      "view_payment_history",
      "view_advance_salary",
      "update_advance_status",
      "view_incentive",
      "update_incentive_status",
      "view_tds_declarations",
      "run_tds_declarations",
      "view_employees",
      "view_attendance",
      "view_leaves",
    ]),
    ACCOUNTANT: new Set([
      "view_admin_dashboard",
      "view_payroll_summary",
      "view_payment_history",
      "view_reimbursement",
      "view_expenses",
      "create_expenses",
      "edit_expenses",
      "update_expenses",
      "export_expenses",
    ]),
    "DEPARTMENT HEAD": new Set([
      "view_hrms_dashboard",
      "view_attendance",
      "update_regularization",
      "view_leaves",
      "update_leave",
      "view_tasks",
      "create_tasks",
      "edit_tasks",
      "update_task_status",
      "view_meetings",
    ]),
    "GENERAL STAFF": new Set([
      "view_hrms_dashboard",
      "view_tasks",
      "update_task_status",
      "view_tickets",
      "create_tickets",
    ]),
  });

  // User Specific Overrides State
  const [userPermissions, setUserPermissions] = useState<Record<string, Set<string>>>({
    u1: new Set(HOUSLY_MODULES_DATA.flatMap((m) => m.permissions.map((p) => p.id))),
    u2: new Set(HOUSLY_MODULES_DATA.flatMap((m) => m.permissions.map((p) => p.id))),
    u4: new Set([
      "view_admin_dashboard",
      "view_payroll_summary",
      "view_ctc_config",
      "edit_ctc_config",
      "view_advances",
      "view_incentives",
      "view_reimbursement",
      "view_payment_history",
      "view_advance_salary",
      "update_advance_status",
      "view_incentive",
      "update_incentive_status",
      "view_tds_declarations",
    ]),
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Total permissions across all real modules (excluding virtual "full_access")
  const totalPermissionsCount = useMemo(() => {
    return HOUSLY_MODULES_DATA.reduce(
      (sum, mod) => sum + mod.permissions.filter((p) => p.id !== "full_access").length,
      0
    );
  }, []);

  // Currently active set of selected permissions
  const currentSelectedSet = useMemo(() => {
    if (activeTab === "role") {
      return rolePermissions[selectedRole] || new Set();
    } else {
      return userPermissions[selectedUser] || new Set();
    }
  }, [activeTab, selectedRole, selectedUser, rolePermissions, userPermissions]);

  // Count active selections (excluding virtual "full_access")
  const totalSelectedCount = useMemo(() => {
    let count = 0;
    currentSelectedSet.forEach((id) => {
      if (id !== "full_access") {
        count++;
      }
    });
    return count;
  }, [currentSelectedSet]);

  // Toggle single permission
  const handleTogglePermission = (permId: string) => {
    if (activeTab === "role" && selectedRole === "SUPER ADMIN") return;

    if (activeTab === "role") {
      setRolePermissions((prev) => {
        const currentSet = new Set(prev[selectedRole] || []);
        if (currentSet.has(permId)) {
          currentSet.delete(permId);
        } else {
          currentSet.add(permId);
        }
        return { ...prev, [selectedRole]: currentSet };
      });
    } else {
      setUserPermissions((prev) => {
        const currentSet = new Set(prev[selectedUser] || []);
        if (currentSet.has(permId)) {
          currentSet.delete(permId);
        } else {
          currentSet.add(permId);
        }
        return { ...prev, [selectedUser]: currentSet };
      });
    }
  };

  // Toggle all permissions inside a module card
  const handleToggleModuleAll = (moduleObj: PermissionModule) => {
    if (activeTab === "role" && selectedRole === "SUPER ADMIN") return;

    const nonFullAccessPermIds = moduleObj.permissions
      .filter((p) => p.id !== "full_access")
      .map((p) => p.id);
    const allSelected = nonFullAccessPermIds.every((id) => currentSelectedSet.has(id));

    if (activeTab === "role") {
      setRolePermissions((prev) => {
        const currentSet = new Set(prev[selectedRole] || []);
        if (allSelected) {
          nonFullAccessPermIds.forEach((id) => currentSet.delete(id));
          currentSet.delete("full_access");
        } else {
          nonFullAccessPermIds.forEach((id) => currentSet.add(id));
          currentSet.add("full_access");
        }
        return { ...prev, [selectedRole]: currentSet };
      });
    } else {
      setUserPermissions((prev) => {
        const currentSet = new Set(prev[selectedUser] || []);
        if (allSelected) {
          nonFullAccessPermIds.forEach((id) => currentSet.delete(id));
          currentSet.delete("full_access");
        } else {
          nonFullAccessPermIds.forEach((id) => currentSet.add(id));
          currentSet.add("full_access");
        }
        return { ...prev, [selectedUser]: currentSet };
      });
    }
  };

  // Global Select All / Deselect All
  const handleGlobalSelectAll = () => {
    if (activeTab === "role" && selectedRole === "SUPER ADMIN") return;

    const allPermIds = HOUSLY_MODULES_DATA.flatMap((m) => m.permissions.map((p) => p.id));
    const isAllGloballySelected = totalSelectedCount === totalPermissionsCount;

    if (activeTab === "role") {
      setRolePermissions((prev) => ({
        ...prev,
        [selectedRole]: isAllGloballySelected ? new Set() : new Set(allPermIds),
      }));
    } else {
      setUserPermissions((prev) => ({
        ...prev,
        [selectedUser]: isAllGloballySelected ? new Set() : new Set(allPermIds),
      }));
    }
  };

  // Save Handler
  const handleSaveChanges = () => {
    const targetName =
      activeTab === "role"
        ? `Role: ${selectedRole}`
        : `User: ${usersList.find((u) => String(u.id) === String(selectedUser))?.name}`;

    setToastMessage(`Permission policies for ${targetName} saved successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Card Collapse
  const toggleCollapse = (modId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Search Filtered Modules
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return HOUSLY_MODULES_DATA;
    const q = searchQuery.toLowerCase();

    return HOUSLY_MODULES_DATA.map((mod) => {
      const matchModuleName = mod.name.toLowerCase().includes(q);
      const matchingPermissions = mod.permissions.filter((p) =>
        p.label.toLowerCase().includes(q)
      );

      if (matchModuleName) return mod;
      if (matchingPermissions.length > 0) {
        return { ...mod, permissions: matchingPermissions };
      }
      return null;
    }).filter(Boolean) as PermissionModule[];
  }, [searchQuery]);

  return (
    <div className="h-[calc(100vh-85px)] flex flex-col bg-[#f8fafc] text-slate-800 p-4 md:p-6 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 flex items-center gap-3 min-w-[320px]">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check size={14} className="text-white stroke-[3]" />
          </div>

          <span className="text-gray-700 text-[15px]">
            {toastMessage}
          </span>
        </div>
      )}
      {/* Fixed Non-Scrolling Top Header Section */}
      <div className="shrink-0 space-y-4 mb-4">
        {/* Main Top Header Controls Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Navigation Tabs (Role Permissions | User Permissions) */}
            <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-200 pb-2 md:pb-0">
              <button
                onClick={() => setActiveTab("role")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "role"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
              >
                <Shield size={15} />
                <span>Role Permissions</span>
              </button>

              <button
                onClick={() => setActiveTab("user")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "user"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
              >
                <User size={15} />
                <span>User Permissions</span>
              </button>
            </div>

            {/* Right Action Tools: Search Bar, Counter, Select All, Save */}
            <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
              {/* Search Bar */}
              <div className="relative min-w-[220px] max-w-xs flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search modules or permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Counter Badge */}
              <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 tracking-wider">
                <span>{totalSelectedCount}</span>
                <span className="text-slate-400 font-normal"> / {totalPermissionsCount}</span>
              </div>

              {/* Select All Button */}
              <button
                onClick={handleGlobalSelectAll}
                disabled={activeTab === "role" && selectedRole === "SUPER ADMIN"}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {totalSelectedCount === totalPermissionsCount ? "Deselect All" : "Select All"}
              </button>

              {/* Save Changes Button */}
              <button
                onClick={handleSaveChanges}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1960fc] hover:bg-[#0271d8] text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Target Selector Bar (TARGET ROLE or TARGET USER) with SearchableSelect */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="max-w-xs">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {activeTab === "role" ? "TARGET ROLE" : "TARGET USER"}
            </label>

            {activeTab === "role" ? (
              <SearchableSelect
                options={rolesList.map((r) => ({ id: r, name: r }))}
                value={selectedRole}
                onChange={(val) => setSelectedRole(val)}
                placeholder="Select Role..."
              />
            ) : (
              <SearchableSelect
                options={usersList.map((u) => ({ id: String(u.id), name: `${u.name} (${u.employee_id})` }))}
                value={selectedUser}
                onChange={(val) => setSelectedUser(val)}
                placeholder="Select User..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Scrollable Container ONLY for Cards Grid */}
      <div className="flex-1 overflow-y-auto pr-1 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Module Cards Grid (4 columns layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredModules.map((moduleObj) => {
            const isCollapsed = !!collapsedModules[moduleObj.id];
            const nonFullAccessPerms = moduleObj.permissions.filter((p) => p.id !== "full_access");
            const nonFullAccessPermIds = nonFullAccessPerms.map((p) => p.id);
            const selectedInModule = nonFullAccessPermIds.filter((id) =>
              currentSelectedSet.has(id)
            ).length;
            const totalInModule = nonFullAccessPerms.length;
            const isAllModuleSelected =
              totalInModule > 0 && selectedInModule === totalInModule;

            return (
              <div
                key={moduleObj.id}
                className={`bg-white rounded-xl shadow-2xs border border-slate-200/80 overflow-hidden flex flex-col hover:border-slate-300 transition-all ${isCollapsed ? "h-auto" : "h-[290px]"
                  }`}
              >
                {/* Card Header (Fixed height) */}
                <div className="shrink-0 p-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => toggleCollapse(moduleObj.id)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                    >
                      {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>

                    <span className="font-bold text-xs text-slate-800 truncate">
                      {moduleObj.name}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                      {selectedInModule}/{totalInModule}
                    </span>
                  </div>
                </div>

                {/* Card Body - Internal Scrollable List of Permissions (Hidden Scrollbar) */}
                {!isCollapsed && (
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-2 bg-white pr-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {moduleObj.permissions.map((perm) => {
                      const isChecked = perm.id === "full_access" ? isAllModuleSelected : currentSelectedSet.has(perm.id);
                      const isDisabled =
                        activeTab === "role" && selectedRole === "SUPER ADMIN";

                      return (
                        <label
                          key={perm.id}
                          className={`flex items-start justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${isDisabled ? "cursor-not-allowed opacity-75" : ""
                            }`}
                        >
                          <span className="text-xs text-slate-600 font-medium leading-tight">
                            {perm.label}
                          </span>

                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isDisabled}
                            onChange={() => {
                              if (perm.id === "full_access") {
                                handleToggleModuleAll(moduleObj);
                              } else {
                                handleTogglePermission(perm.id);
                              }
                            }}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5 disabled:opacity-50 shrink-0"
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

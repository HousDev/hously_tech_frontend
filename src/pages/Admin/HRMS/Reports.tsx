import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Users,
  Download,
  FileSpreadsheet,
  File,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock as ClockIcon,
  X,
  Calendar,
  Ticket as TicketIcon,
  DollarSign,
  TrendingUp,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingDown,
  MapPin
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { settingsApi } from "../../../lib/settingsApi";
import { apiClient } from "../../../lib/api";
import defaultLogo from "../../../assets/images/hously-logo.png";

// --- Helper Functions ---

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
  if (isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString('en-IN');
};

const isWithinMonthRange = (dateStr: string, from: string, to: string) => {
  if (!dateStr) return true;
  // If it doesn't contain a 4-digit year (like 2026), it's a placeholder row (e.g. '—') - always show it!
  if (!/\d{4}/.test(dateStr)) return true;
  const itemMonth = dateStr.slice(0, 7); // e.g. "2026-07"
  if (from && itemMonth < from) return false;
  if (to && itemMonth > to) return false;
  return true;
};

const AddressCell = ({ lat, lng, fallback }: { lat: any; lng: any; fallback: string }) => {
  const [address, setAddress] = useState<string>("Loading...");

  useEffect(() => {
    if (!lat || !lng) {
      setAddress(fallback || "—");
      return;
    }
    const timer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(r => r.json())
        .then(json => {
          const addr = json?.display_name || `${lat}, ${lng}`;
          setAddress(addr.split(',').slice(0, 3).join(',').trim());
        })
        .catch(() => {
          setAddress(`${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`);
        });
    }, 450); // Stagger requests to avoid 429 rate limit
    return () => clearTimeout(timer);
  }, [lat, lng, fallback]);

  return <span title={address}>{address}</span>;
};

// --- Custom Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; icon: any }> = {
    "Present": { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
    "Absent": { bg: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle },
    "Late": { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: ClockIcon },
    "Half Day": { bg: "bg-blue-50 text-blue-700 border-blue-100", icon: ClockIcon },
    "Pending": { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: ClockIcon },
    "Approved": { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
    "Rejected": { bg: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle },
    "Paid": { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
    "Open": { bg: "bg-blue-50 text-blue-700 border-blue-100", icon: ClockIcon },
    "In Progress": { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: ClockIcon },
    "Closed": { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
    "High": { bg: "bg-rose-50 text-rose-700 border-rose-100", icon: AlertCircle },
    "Medium": { bg: "bg-amber-50 text-amber-700 border-amber-100", icon: ClockIcon },
    "Low": { bg: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle2 },
  };
  const item = config[status] || { bg: "bg-slate-50 text-slate-700 border-slate-100", icon: ClockIcon };
  const Icon = item.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.bg}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const EmployeeAvatar = ({ name, image, size = "w-8 h-8", textSize = "text-[10px]" }: { name: string; image?: string; size?: string; textSize?: string }) => {
  const initials = getInitials(name);
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  const colorIndex = name.length % colors.length;

  if (image) {
    return (
      <div className={`${size} rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-100`}>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white ${textSize} font-extrabold flex-shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
};

// --- Main Component ---

export default function Reports() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Reports");
      setHeaderSubtitle("Comprehensive employee reports and analytics");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  // Logo State & Fetch
  const [navbarLogo, setNavbarLogo] = useState<string>("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoData = await settingsApi.getLogos();
        if (logoData && logoData.navbarLogo) {
          setNavbarLogo(logoData.navbarLogo);
        }
      } catch (error) {
        console.error("Failed to load settings logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Tab State (Employee is default)
  const [activeTab, setActiveTab] = useState("Employee");
  const [pageSize, setPageSize] = useState<number | string>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Month-Year Date Range State (for tabs except Employee)
  const [fromMonth, setFromMonth] = useState("2026-01");
  const [toMonth, setToMonth] = useState("2026-12");

  // Column Search Filters
  const [empSearch, setEmpSearch] = useState({ id: "", name: "", department: "", position: "", email: "", joinDate: "" });
  const [salSearch, setSalSearch] = useState({ empId: "", name: "", department: "", monthlySalary: "", basic: "", allowances: "", deductions: "", netSalary: "" });
  const [attSearch, setAttSearch] = useState({ name: "", date: "", checkIn: "", checkOut: "", status: "", workingHours: "" });
  const [leaveSearch, setLeaveSearch] = useState({ employee: "", leaveType: "", fromDate: "", toDate: "", days: "", status: "", reason: "" });
  const [expSearch, setExpSearch] = useState({ employee: "", category: "", description: "", amount: "", date: "", status: "" });
  const [tktSearch, setTktSearch] = useState({ ticket: "", employee: "", subject: "", category: "", priority: "", assignedTo: "", date: "", status: "" });

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Reactive API States
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load data from actual database APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === "Employee" || activeTab === "Salary") {
          const rawEmps = await apiClient.get<any[]>("/employees");
          
          // Map to Employees
          const emps = rawEmps.map((item: any) => ({
            id: item.employeeId || item.id || "",
            name: item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || "No Name",
            department: item.department || "N/A",
            position: item.role || item.designationRole || "N/A",
            email: item.email || "N/A",
            joinDate: item.joinDate ? item.joinDate.slice(0, 10) : "N/A",
            image: item.avatarUrl || ""
          }));
          setEmployeesData(emps);

          // Map to Salaries
          const salaries = rawEmps.map((item: any, idx: number) => {
            const monthlySalary = Number(item.salary) || 0;
            const basic = Math.round(monthlySalary * 0.5);
            const allowances = Math.round(monthlySalary * 0.5);
            const deductions = 0;
            const netSalary = monthlySalary;

            return {
              sr: idx + 1,
              empId: item.employeeId || item.id || "",
              name: item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || "No Name",
              department: item.department || "N/A",
              monthlySalary: String(monthlySalary),
              basic: String(basic),
              allowances: String(allowances),
              deductions: String(deductions),
              netSalary: String(netSalary),
              date: item.joinDate ? item.joinDate.slice(0, 7) + "-01" : new Date().toISOString().slice(0, 7) + "-01",
              image: item.avatarUrl || ""
            };
          });
          setSalaryData(salaries);
        } else if (activeTab === "Attendance") {
          // Compute range dates
          const fromDate = `${fromMonth}-01`;
          
          // Dynamically compute the last day of the toMonth
          const [toYearStr, toMonthStr] = toMonth.split("-");
          const toYear = parseInt(toYearStr, 10);
          const toMonthNum = parseInt(toMonthStr, 10);
          const lastDay = new Date(toYear, toMonthNum, 0).getDate();
          const toDate = `${toMonth}-${String(lastDay).padStart(2, "0")}`;
          
          const response = await apiClient.get<any>(`/attendance/admin/logs?fromDate=${fromDate}&toDate=${toDate}`);
          const logsArray = Array.isArray(response) ? response : (response?.data || response?.logs || []);
          const mappedLogs = logsArray.map((item: any) => {
            const checkInAddr = (item.checkInLat && item.checkInLng) 
              ? `${Number(item.checkInLat).toFixed(4)}, ${Number(item.checkInLng).toFixed(4)}`
              : item.location || "Office";

            const checkOutAddr = (item.checkOutLat && item.checkOutLng)
              ? `${Number(item.checkOutLat).toFixed(4)}, ${Number(item.checkOutLng).toFixed(4)}`
              : item.location || "Office";

            return {
              name: item.name || "No Name",
              empId: item.empId || "",
              date: item.date || "",
              checkIn: item.checkInTime || "-",
              checkOut: item.checkOutTime || "-",
              status: item.status || "Present",
              workingHours: item.workingHours || "-",
              image: item.avatarUrl || "",
              checkInLat: item.checkInLat,
              checkInLng: item.checkInLng,
              checkOutLat: item.checkOutLat,
              checkOutLng: item.checkOutLng,
              checkInAddress: checkInAddr,
              checkOutAddress: checkOutAddr
            };
          });
          setAttendanceData(mappedLogs);
        } else if (activeTab === "Leave") {
          const rawLeaves = await apiClient.get<any[]>("/leaves");
          const mappedLeaves = rawLeaves.map((item: any) => {
            const days = Math.ceil((new Date(item.to_date).getTime() - new Date(item.from_date).getTime()) / (1000 * 3600 * 24)) + 1;
            return {
              employee: item.employee_name || "No Name",
              empId: item.employeeId || "",
              leaveType: item.leave_type || "N/A",
              fromDate: item.from_date ? item.from_date.slice(0, 10) : "",
              toDate: item.to_date ? item.to_date.slice(0, 10) : "",
              days: isNaN(days) ? 1 : days,
              status: item.status || "Pending",
              reason: item.reason || "",
              date: item.from_date ? item.from_date.slice(0, 10) : "",
              image: item.avatar_url || item.avatarUrl || ""
            };
          });
          setLeaveData(mappedLeaves);
        } else if (activeTab === "Expenses") {
          const rawExpenses = await apiClient.get<any[]>("/expenses");
          const mappedExpenses = rawExpenses.map((item: any) => ({
            employee: item.employee_name || "No Name",
            empId: item.employeeId || "",
            category: item.category || "N/A",
            description: item.description || "",
            amount: String(item.amount || 0),
            date: item.date ? item.date.slice(0, 10) : "",
            status: item.status || "Pending",
            image: item.avatar_url || item.avatarUrl || ""
          }));
          setExpenseData(mappedExpenses);
        } else if (activeTab === "Tickets") {
          const rawTickets = await apiClient.get<any[]>("/tickets");
          const mappedTickets = rawTickets.map((item: any) => ({
            ticket: item.ticket_no || item.ticket_id || `TKT-${String(item.id).padStart(3, "0")}`,
            employee: item.employee_name || "No Name",
            empId: item.employeeId || "",
            subject: item.subject || "",
            category: item.category || "N/A",
            priority: item.priority || "Medium",
            assignedTo: item.assigned_name || "Unassigned",
            date: item.created_at ? item.created_at.slice(0, 10) : item.date ? item.date.slice(0, 10) : "",
            status: item.status || "Open",
            image: item.avatar_url || item.avatarUrl || ""
          }));
          setTicketData(mappedTickets);
        }
      } catch (error) {
        console.error(`Failed to load ${activeTab} data:`, error);
        toast.error(`Failed to load ${activeTab} data from backend.`);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [activeTab, fromMonth, toMonth]);

  // --- Filter Logic ---

  const getFilteredData = () => {
    switch (activeTab) {
      case "Employee":
        return employeesData.filter(item => {
          return (
            item.id.toLowerCase().includes(empSearch.id.toLowerCase()) &&
            item.name.toLowerCase().includes(empSearch.name.toLowerCase()) &&
            item.department.toLowerCase().includes(empSearch.department.toLowerCase()) &&
            item.position.toLowerCase().includes(empSearch.position.toLowerCase()) &&
            item.email.toLowerCase().includes(empSearch.email.toLowerCase()) &&
            item.joinDate.includes(empSearch.joinDate)
          );
        });

      case "Salary":
        return salaryData.filter(item => {
          return (
            isWithinMonthRange(item.date, fromMonth, toMonth) &&
            item.empId.toLowerCase().includes(salSearch.empId.toLowerCase()) &&
            item.name.toLowerCase().includes(salSearch.name.toLowerCase()) &&
            item.department.toLowerCase().includes(salSearch.department.toLowerCase()) &&
            item.monthlySalary.toLowerCase().includes(salSearch.monthlySalary.toLowerCase()) &&
            item.basic.toLowerCase().includes(salSearch.basic.toLowerCase()) &&
            item.allowances.toLowerCase().includes(salSearch.allowances.toLowerCase()) &&
            item.deductions.toLowerCase().includes(salSearch.deductions.toLowerCase()) &&
            item.netSalary.toLowerCase().includes(salSearch.netSalary.toLowerCase())
          );
        });

      case "Attendance":
        return attendanceData.filter(item => {
          return (
            isWithinMonthRange(item.date, fromMonth, toMonth) &&
            item.name.toLowerCase().includes(attSearch.name.toLowerCase()) &&
            item.date.includes(attSearch.date) &&
            (item.checkIn.toLowerCase().includes(attSearch.checkIn.toLowerCase()) || (item.checkInAddress && item.checkInAddress.toLowerCase().includes(attSearch.checkIn.toLowerCase()))) &&
            (item.checkOut.toLowerCase().includes(attSearch.checkOut.toLowerCase()) || (item.checkOutAddress && item.checkOutAddress.toLowerCase().includes(attSearch.checkOut.toLowerCase()))) &&
            item.status.toLowerCase().includes(attSearch.status.toLowerCase()) &&
            item.workingHours.toLowerCase().includes(attSearch.workingHours.toLowerCase())
          );
        });

      case "Leave":
        return leaveData.filter(item => {
          return (
            isWithinMonthRange(item.date, fromMonth, toMonth) &&
            item.employee.toLowerCase().includes(leaveSearch.employee.toLowerCase()) &&
            item.leaveType.toLowerCase().includes(leaveSearch.leaveType.toLowerCase()) &&
            item.fromDate.includes(leaveSearch.fromDate) &&
            item.toDate.includes(leaveSearch.toDate) &&
            String(item.days).toLowerCase().includes(leaveSearch.days.toLowerCase()) &&
            item.status.toLowerCase().includes(leaveSearch.status.toLowerCase()) &&
            item.reason.toLowerCase().includes(leaveSearch.reason.toLowerCase())
          );
        });

      case "Expenses":
        return expenseData.filter(item => {
          return (
            isWithinMonthRange(item.date, fromMonth, toMonth) &&
            item.employee.toLowerCase().includes(expSearch.employee.toLowerCase()) &&
            item.category.toLowerCase().includes(expSearch.category.toLowerCase()) &&
            item.description.toLowerCase().includes(expSearch.description.toLowerCase()) &&
            item.amount.toLowerCase().includes(expSearch.amount.toLowerCase()) &&
            item.date.includes(expSearch.date) &&
            item.status.toLowerCase().includes(expSearch.status.toLowerCase())
          );
        });

      case "Tickets":
        return ticketData.filter(item => {
          return (
            isWithinMonthRange(item.date, fromMonth, toMonth) &&
            item.ticket.toLowerCase().includes(tktSearch.ticket.toLowerCase()) &&
            item.employee.toLowerCase().includes(tktSearch.employee.toLowerCase()) &&
            item.subject.toLowerCase().includes(tktSearch.subject.toLowerCase()) &&
            item.category.toLowerCase().includes(tktSearch.category.toLowerCase()) &&
            item.priority.toLowerCase().includes(tktSearch.priority.toLowerCase()) &&
            item.assignedTo.toLowerCase().includes(tktSearch.assignedTo.toLowerCase()) &&
            item.date.includes(tktSearch.date) &&
            item.status.toLowerCase().includes(tktSearch.status.toLowerCase())
          );
        });

      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const totalRecords = filteredData.length;
  const isAll = pageSize === "All";
  const limit = isAll ? totalRecords : Number(pageSize);
  const totalPages = isAll ? 1 : Math.ceil(totalRecords / limit);
  const paginatedData = isAll ? filteredData : filteredData.slice((currentPage - 1) * limit, currentPage * limit);

  // --- Handlers ---

  const handleExportClick = async (type: "excel" | "pdf") => {
    if (type === "excel") {
      console.log("Excel Export clicked. activeTab:", activeTab, "filteredData length:", filteredData?.length, "filteredData:", filteredData);
      toast.loading("Preparing Excel download...", { id: "excel-export" });

      // Load xlsx dynamically if it is not present
      if (!(window as any).XLSX) {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load XLSX library"));
            document.head.appendChild(script);
          });
        } catch (err) {
          toast.error("Failed to load Excel library. Please try again.", { id: "excel-export" });
          return;
        }
      }

      try {
        const XLSX = (window as any).XLSX;
        let dataToExport: any[] = [];
        let fileName = `${activeTab}_Report`;

        if (activeTab === "Employee") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Employee ID": item.id,
            "Name": item.name,
            "Department": item.department,
            "Position": item.position,
            "Email": item.email,
            "Join Date": item.joinDate
          }));
        } else if (activeTab === "Salary") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Employee ID": item.empId,
            "Name": item.name,
            "Department": item.department,
            "Monthly Salary": Number(item.monthlySalary),
            "Basic": Number(item.basic),
            "Allowances": Number(item.allowances),
            "Deductions": Number(item.deductions),
            "Net Salary": Number(item.netSalary)
          }));
          fileName = `Salary_Sheet_${fromMonth}_to_${toMonth}`;
        } else if (activeTab === "Attendance") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Employee ID": item.empId,
            "Employee Name": item.name,
            "Date": item.date,
            "Check In": item.checkIn,
            "Check In Location": item.checkInAddress || "",
            "Check Out": item.checkOut,
            "Check Out Location": item.checkOutAddress || "",
            "Status": item.status,
            "Working Hours": item.workingHours
          }));
          fileName = `Attendance_Report_${fromMonth}_to_${toMonth}`;
        } else if (activeTab === "Leave") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Employee ID": item.empId,
            "Employee Name": item.employee,
            "Leave Type": item.leaveType,
            "From Date": item.fromDate,
            "To Date": item.toDate,
            "Days": Number(item.days),
            "Status": item.status,
            "Reason": item.reason
          }));
          fileName = `Leave_Report_${fromMonth}_to_${toMonth}`;
        } else if (activeTab === "Expenses") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Employee ID": item.empId,
            "Employee Name": item.employee,
            "Category": item.category,
            "Description": item.description,
            "Amount": Number(item.amount),
            "Date": item.date,
            "Status": item.status
          }));
          fileName = `Expenses_Report_${fromMonth}_to_${toMonth}`;
        } else if (activeTab === "Tickets") {
          dataToExport = filteredData.map((item: any, idx: number) => ({
            "Sr No": idx + 1,
            "Ticket ID": item.ticket,
            "Employee ID": item.empId,
            "Employee Name": item.employee,
            "Subject": item.subject,
            "Category": item.category,
            "Priority": item.priority,
            "Assigned To": item.assignedTo,
            "Date": item.date,
            "Status": item.status
          }));
          fileName = `Tickets_Report_${fromMonth}_to_${toMonth}`;
        }

        console.log("dataToExport details:", dataToExport);
        if (!dataToExport || dataToExport.length === 0) {
          toast.error(`No data found to export for ${activeTab} tab.`, { id: "excel-export" });
          setShowExportDropdown(false);
          return;
        }

        toast.success(`Exporting ${dataToExport.length} rows to Excel...`, { id: "excel-export" });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } catch (error: any) {
        console.error("Failed to generate Excel:", error);
        toast.error(`Excel error: ${error.message || error}`, { id: "excel-export" });
      }

      setShowExportDropdown(false);
      return;
    }

    const getMonthsInRange = (startStr: string, endStr: string) => {
      const months = [];
      const [startYear, startMonth] = startStr.split("-").map(Number);
      const [endYear, endMonth] = endStr.split("-").map(Number);
      
      let currYear = startYear;
      let currMonth = startMonth;
      
      while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
        months.push({
          year: currYear,
          month: currMonth,
        });
        currMonth++;
        if (currMonth > 12) {
          currMonth = 1;
          currYear++;
        }
      }
      return months;
    };

    toast.loading("Preparing PDF download...", { id: "pdf-export" });

    // Load html2pdf dynamically if it is not present
    if (!(window as any).html2pdf) {
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load html2pdf.js"));
          document.head.appendChild(script);
        });
      } catch (err) {
        toast.error("Failed to load PDF library. Please try again.", { id: "pdf-export" });
        return;
      }
    }

    // Resolve absolute URL for backend setting logo
    const getFullLogoUrl = (url: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      const apiURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const backendBase = apiURL.replace("/api", "");
      return `${backendBase.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    };

    const getLogoBase64 = async () => {
      // 1. Try to fetch the settings logo from the backend
      const logoUrl = getFullLogoUrl(navbarLogo);
      if (logoUrl) {
        try {
          const response = await fetch(logoUrl);
          if (response.ok) {
            const blob = await response.blob();
            return await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        } catch (err) {
          console.warn("Failed to fetch settings logo via CORS, trying default logo:", err);
        }
      }

      // 2. Fall back to local default logo
      if (defaultLogo) {
        try {
          const response = await fetch(defaultLogo);
          if (response.ok) {
            const blob = await response.blob();
            return await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        } catch (err) {
          console.warn("Failed to convert default logo to base64:", err);
        }
      }

      return "";
    };

    const logoBase64 = await getLogoBase64();
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    let tableHeaderHTML = "";
    let tableRowsHTML = "";
    let monthlyPagesHTML = ""; // Only used by Attendance for multi-month grids
    let reportTitle = "";
    let headerColor = "#1e293b"; // Slate as default
    const reportWidth = "1020px"; // Fits A4 Landscape safely with 5mm margins

    if (activeTab === "Employee") {
      reportTitle = "Employees Report";
      headerColor = "#dc2626"; // Crimson Red for Employee Report
      tableHeaderHTML = `
        <tr>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Sr</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Emp ID</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Name</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Department</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Position</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Email</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: left; font-size: 10px; font-weight: bold;">Join Date</th>
        </tr>
      `;
      tableRowsHTML = filteredData.map((item: any, idx: number) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold;">${item.id}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${item.name}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.department}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.position}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.email}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.joinDate}</td>
        </tr>
      `).join("");
    } else if (activeTab === "Salary") {
      reportTitle = `Salary Sheet — ${fromMonth} to ${toMonth}`;
      headerColor = "#1e293b"; // Dark Slate for Salary Report
      tableHeaderHTML = `
        <tr>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 10px; font-weight: bold;">Sr</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Emp ID</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Name</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Department</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Monthly Salary</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Basic</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Allowances</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Deductions</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Net Salary</th>
        </tr>
      `;
      tableRowsHTML = filteredData.map((item: any, idx: number) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold;">${item.empId}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${item.name}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.department}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">${formatCurrency(item.monthlySalary)}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">${formatCurrency(item.basic)}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; color: #2563eb;">+${formatCurrency(item.allowances)}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; color: #dc2626;">-${formatCurrency(item.deductions)}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #059669; background: #f0fdf4;">${formatCurrency(item.netSalary)}</td>
        </tr>
      `).join("");
    } else if (activeTab === "Attendance") {
      const monthsList = getMonthsInRange(fromMonth, toMonth);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      reportTitle = `Attendance Report — ${fromMonth} to ${toMonth}`;
      headerColor = "#0b3a60"; // Corporate Dark Blue

      monthlyPagesHTML = monthsList.map((mInfo, mIdx) => {
        const { year, month } = mInfo;
        const monthName = monthNames[month - 1];
        const daysCount = new Date(year, month, 0).getDate();

        // Build compact headers strictly locked to 20px
        let daysHeadersHTML = "";
        for (let d = 1; d <= daysCount; d++) {
          const dayStr = d < 10 ? `0${d}` : `${d}`;
          daysHeadersHTML += `
            <th style="padding: 4px 0px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 5.5px; width: 20px; min-width: 20px; font-weight: bold; box-sizing: border-box;">
              ${dayStr}<br/>${monthName.slice(0, 3).toUpperCase()}
            </th>
          `;
        }

        const monthTableHeaderHTML = `
          <tr>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 15px; min-width: 15px; box-sizing: border-box;" rowspan="2">SR</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; font-weight: bold; width: 32px; min-width: 32px; box-sizing: border-box;" rowspan="2">EMP ID</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; font-weight: bold; width: 60px; min-width: 60px; box-sizing: border-box;" rowspan="2">NAME</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; font-weight: bold; width: 42px; min-width: 42px; box-sizing: border-box;" rowspan="2">SALARY</th>
            <th style="padding: 2px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 8px; text-align: center; font-weight: bold; box-sizing: border-box;" colspan="${daysCount}">DAILY ATTENDANCE LOG</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 25px; min-width: 25px; box-sizing: border-box;" rowspan="2">PRES</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 25px; min-width: 25px; box-sizing: border-box;" rowspan="2">ABS</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 25px; min-width: 25px; box-sizing: border-box;" rowspan="2">WRK</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 28px; min-width: 28px; box-sizing: border-box;" rowspan="2">HOURS</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 40px; min-width: 40px; box-sizing: border-box;" rowspan="2">PAID</th>
            <th style="padding: 4px 1px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 7px; text-align: center; font-weight: bold; width: 40px; min-width: 40px; box-sizing: border-box;" rowspan="2">ATT %</th>
          </tr>
          <tr>
            ${daysHeadersHTML}
          </tr>
        `;

        const monthTableRowsHTML = employeesData.map((emp, idx) => {
          let dailyCellsHTML = "";
          let presentCount = 0;
          let absentCount = 0;
          let totalHrs = 0;
          let totalWeekdays = 0;

          for (let d = 1; d <= daysCount; d++) {
            const currentDate = new Date(year, month - 1, d);
            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 0;

            if (isWeekend) {
              dailyCellsHTML += `
                <td style="padding: 2px 0px; border: 1px solid #cbd5e1; background: #eff6ff; color: #3b82f6; font-size: 5.5px; font-weight: bold; text-align: center; vertical-align: middle; height: 35px; width: 20px; min-width: 20px; box-sizing: border-box;">
                  <div style="color: #3b82f6; font-weight: bold;">WKD</div>
                </td>
              `;
            } else {
              totalWeekdays++;
              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dayLog = attendanceData.find(a => a.empId === emp.id && a.date === dateStr);

              if (dayLog) {
                const statusLower = dayLog.status.toLowerCase();
                if (statusLower === 'absent') {
                  absentCount++;
                  dailyCellsHTML += `
                    <td style="padding: 2px 0px; border: 1px solid #cbd5e1; background: #fee2e2; color: #ef4444; font-size: 5.5px; font-weight: bold; text-align: center; vertical-align: middle; height: 35px; width: 20px; min-width: 20px; box-sizing: border-box;">
                      <div style="color: #ef4444; font-weight: bold;">ABS</div>
                    </td>
                  `;
                } else if (statusLower === 'week_off' || statusLower === 'weekoff') {
                  dailyCellsHTML += `
                    <td style="padding: 2px 0px; border: 1px solid #cbd5e1; background: #eff6ff; color: #3b82f6; font-size: 5.5px; font-weight: bold; text-align: center; vertical-align: middle; height: 35px; width: 20px; min-width: 20px; box-sizing: border-box;">
                      <div style="color: #3b82f6; font-weight: bold;">WKD</div>
                    </td>
                  `;
                } else {
                  presentCount++;
                  const ci = dayLog.checkIn || "-";
                  const co = dayLog.checkOut || "-";
                  const h = parseFloat(dayLog.workingHours) || 0.0;
                  totalHrs += h;
                  dailyCellsHTML += `
                    <td style="padding: 2px 0px; border: 1px solid #cbd5e1; text-align: center; font-size: 5px; vertical-align: middle; background: #ffffff; height: 35px; width: 20px; min-width: 20px; box-sizing: border-box;">
                      <div style="color: #16a34a; font-weight: bold; font-size: 5.5px; line-height: 1.1;">${ci.replace(" AM", "").replace(" PM", "")}</div>
                      <div style="color: #334155; font-weight: 500; font-size: 5.5px; line-height: 1.1; margin-top: 1px;">${co.replace(" AM", "").replace(" PM", "")}</div>
                      <div style="color: #94a3b8; font-size: 4.5px; line-height: 1.1; margin-top: 1px;">${h.toFixed(1)}h</div>
                    </td>
                  `;
                }
              } else {
                absentCount++;
                dailyCellsHTML += `
                  <td style="padding: 2px 0px; border: 1px solid #cbd5e1; background: #fee2e2; color: #ef4444; font-size: 5.5px; font-weight: bold; text-align: center; vertical-align: middle; height: 35px; width: 20px; min-width: 20px; box-sizing: border-box;">
                    <div style="color: #ef4444; font-weight: bold;">ABS</div>
                  </td>
                `;
              }
            }
          }

          const salaryObj = salaryData.find(s => s.empId === emp.id) || { monthlySalary: "90000", netSalary: "90000" };
          const monthlySalaryNum = parseInt(salaryObj.monthlySalary, 10);
          const totalWorkDays = totalWeekdays;
          const attendancePercentage = totalWeekdays > 0 ? ((presentCount / totalWeekdays) * 100).toFixed(1) : "0.0";
          const salaryPaid = totalWeekdays > 0 ? Math.round((monthlySalaryNum / totalWeekdays) * presentCount) : 0;

          return `
            <tr>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; height: 35px;">${idx + 1}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 7px; font-weight: bold; height: 35px;">${emp.id}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; font-size: 7px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; height: 35px;">${emp.name}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: right; font-size: 7px; font-weight: bold; height: 35px;">${formatCurrency(monthlySalaryNum)}</td>
              ${dailyCellsHTML}
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; color: #16a34a; height: 35px;">${presentCount}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; color: #ef4444; height: 35px;">${absentCount}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; height: 35px;">${totalWorkDays}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; color: #2563eb; height: 35px;">${totalHrs.toFixed(1)}h</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: right; font-size: 7px; font-weight: bold; color: #059669; height: 35px;">${formatCurrency(salaryPaid)}</td>
              <td style="padding: 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 7px; font-weight: bold; background: ${parseFloat(attendancePercentage) >= 95 ? "#f0fdf4" : "#fffbeb"}; color: ${parseFloat(attendancePercentage) >= 95 ? "#16a34a" : "#d97706"}; height: 35px;">${attendancePercentage}%</td>
            </tr>
          `;
        }).join("");

        const isLast = mIdx === monthsList.length - 1;
        const pageBreakHTML = isLast ? "" : `<div style="page-break-after: always; height: 1px; clear: both;"></div>`;

        return `
          <div style="box-sizing: border-box; width: 100%;">
            <!-- Month Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 25px; margin-bottom: 30px;">
              <div style="display: flex; align-items: center; justify-content: flex-start;">
                ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="max-height: 50px; object-fit: contain;" />` : `<div style="font-size: 22px; font-weight: 900; color: #1e3a8a; border: 2px solid #1e3a8a; padding: 6px 14px; letter-spacing: 1.5px;">HOUSLY</div>`}
              </div>
              <div style="text-align: right;">
                <h1 style="font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; margin: 0 0 6px 0;">Hously Finntech Reality</h1>
                <p style="font-size: 14px; font-weight: 700; color: #475569; margin: 0 0 4px 0;">Attendance Report of ${monthName} ${year}</p>
                <p style="font-size: 11px; color: #64748b; font-weight: 600; margin: 6px 0 0 0;">Generated on: ${dateStr}</p>
              </div>
            </div>
            
            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 7px; margin-top: 10px; table-layout: fixed; border: 1px solid #cbd5e1;">
              <thead>
                ${monthTableHeaderHTML}
              </thead>
              <tbody>
                ${monthTableRowsHTML}
              </tbody>
            </table>
            
            <!-- Footer -->
            <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              Total Records: ${totalRecords}
            </div>
          </div>
          ${pageBreakHTML}
        `;
      }).join("");
    } else if (activeTab === "Leave") {
      reportTitle = `Leave Report — ${fromMonth} to ${toMonth}`;
      headerColor = "#7c3aed"; // Violet for Leave Report
      tableHeaderHTML = `
        <tr>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 10px; font-weight: bold;">Sr</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Employee</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Leave Type</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">From Date</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">To Date</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 10px; font-weight: bold;">Days</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Status</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Reason</th>
        </tr>
      `;
      tableRowsHTML = filteredData.map((item: any, idx: number) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">
            <div style="font-weight: bold;">${item.employee}</div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace;">${item.empId}</div>
          </td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600; color: #7c3aed;">${item.leaveType}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.fromDate}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.toDate}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${item.days}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${item.status}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; color: #475569;">${item.reason}</td>
        </tr>
      `).join("");
    } else if (activeTab === "Expenses") {
      reportTitle = `Expenses Report — ${fromMonth} to ${toMonth}`;
      headerColor = "#0ea5e9"; // Sky Blue for Expenses
      tableHeaderHTML = `
        <tr>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 10px; font-weight: bold;">Sr</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Employee</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Category</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Description</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: right; font-size: 10px; font-weight: bold;">Amount</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Date</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Status</th>
        </tr>
      `;
      tableRowsHTML = filteredData.map((item: any, idx: number) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">
            <div style="font-weight: bold;">${item.employee}</div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace;">${item.empId}</div>
          </td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${item.category}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; color: #475569;">${item.description}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">${formatCurrency(item.amount)}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.date}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${item.status}</td>
        </tr>
      `).join("");
    } else if (activeTab === "Tickets") {
      reportTitle = `Tickets Report — ${fromMonth} to ${toMonth}`;
      headerColor = "#475569"; // Slate for Tickets
      tableHeaderHTML = `
        <tr>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; text-align: center; font-size: 10px; font-weight: bold;">Sr</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Ticket ID</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Employee</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Subject</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Category</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Priority</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Assigned To</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Date</th>
          <th style="padding: 10px; border: 1px solid #cbd5e1; background: ${headerColor}; color: white; font-size: 10px; font-weight: bold;">Status</th>
        </tr>
      `;
      tableRowsHTML = filteredData.map((item: any, idx: number) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold;">${item.ticket}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">
            <div style="font-weight: bold;">${item.employee}</div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace;">${item.empId}</div>
          </td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.subject}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.category}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${item.priority}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.assignedTo}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.date}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600;">${item.status}</td>
        </tr>
      `).join("");
    }

    // Create an invisible wrapper container in the DOM so that style and dimensions are fully computed.
    // The wrapper has height: 0 and overflow: hidden, keeping it invisible to users on screen,
    // while allowing html2canvas to render the unrestricted element inside it perfectly.
    const wrapper = document.createElement("div");
    wrapper.style.height = "0";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "absolute";
    wrapper.style.left = "0";
    wrapper.style.top = "0";

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.background = "white";
    element.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    element.style.color = "#334155";
    element.style.width = reportWidth;
    element.style.boxSizing = "border-box";

    const headerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 25px; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; justify-content: flex-start;">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="max-height: 50px; object-fit: contain;" />` : `<div style="font-size: 22px; font-weight: 900; color: #1e3a8a; border: 2px solid #1e3a8a; padding: 6px 14px; letter-spacing: 1.5px;">HOUSLY</div>`}
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 24px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; margin: 0 0 6px 0;">Hously Finntech Reality</h1>
          <p style="font-size: 14px; font-weight: 700; color: #475569; margin: 0 0 4px 0;">${reportTitle}</p>
          <p style="font-size: 11px; color: #64748b; font-weight: 600; margin: 6px 0 0 0;">Generated on: ${dateStr}</p>
        </div>
      </div>
    `;

    // For Attendance tab: use multi-month page grid compiled in monthlyPagesHTML
    // For all other tabs: use single headerHTML + table
    if (activeTab === "Attendance") {
      element.innerHTML = monthlyPagesHTML;
    } else {
      element.innerHTML = `
        ${headerHTML}
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; table-layout: auto; border: 1px solid #cbd5e1;">
          <thead>
            ${tableHeaderHTML}
          </thead>
          <tbody>
            ${tableRowsHTML}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 600; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          Total Records: ${totalRecords}
        </div>
      `;
    }

    wrapper.appendChild(element);
    document.body.appendChild(wrapper);

    const opt = {
      margin: 5, // Smaller margins to maximize printable width
      filename: `${reportTitle.replace(/\s+/g, "_")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true }, // Crisp scaling factor
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true }
    };

    try {
      await (window as any).html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully!", { id: "pdf-export" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF download.", { id: "pdf-export" });
    } finally {
      document.body.removeChild(wrapper);
    }

    setShowExportDropdown(false);
  };

  // --- Render Table Layouts ---

  const renderEmployeeTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 min-w-[120px]">Employee ID</th>
            <th className="p-4 min-w-[180px]">Name</th>
            <th className="p-4 min-w-[150px]">Department</th>
            <th className="p-4 min-w-[150px]">Position</th>
            <th className="p-4 min-w-[180px]">Email</th>
            <th className="p-4 min-w-[130px]">Join Date</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ID..."
                  value={empSearch.id}
                  onChange={(e) => { setEmpSearch({ ...empSearch, id: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Name..."
                  value={empSearch.name}
                  onChange={(e) => { setEmpSearch({ ...empSearch, name: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Dept..."
                  value={empSearch.department}
                  onChange={(e) => { setEmpSearch({ ...empSearch, department: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Pos..."
                  value={empSearch.position}
                  onChange={(e) => { setEmpSearch({ ...empSearch, position: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Email..."
                  value={empSearch.email}
                  onChange={(e) => { setEmpSearch({ ...empSearch, email: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Date..."
                  value={empSearch.joinDate}
                  onChange={(e) => { setEmpSearch({ ...empSearch, joinDate: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition">
              <td className="p-4 font-mono font-bold text-slate-500">{item.id}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.name} image={item.image} />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                  <Building className="w-3 h-3" />
                  {item.department}
                </span>
              </td>
              <td className="p-4 text-slate-600 font-medium">{item.position}</td>
              <td className="p-4 text-slate-500 font-medium">{item.email}</td>
              <td className="p-4 text-slate-500 font-semibold">{item.joinDate}</td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={6} className="p-10 text-center text-slate-400 font-semibold text-sm">No employees matching search criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderSalaryTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 w-12 text-center">Sr</th>
            <th className="p-4 min-w-[110px]">Emp ID</th>
            <th className="p-4 min-w-[180px]">Employee Name</th>
            <th className="p-4 min-w-[140px]">Department</th>
            <th className="p-4 min-w-[130px]">Monthly Salary</th>
            <th className="p-4 min-w-[110px]">Basic</th>
            <th className="p-4 min-w-[110px]">Allowances</th>
            <th className="p-4 min-w-[110px]">Deductions</th>
            <th className="p-4 min-w-[120px]">Net Salary</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2"></th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ID..."
                  value={salSearch.empId}
                  onChange={(e) => { setSalSearch({ ...salSearch, empId: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Name..."
                  value={salSearch.name}
                  onChange={(e) => { setSalSearch({ ...salSearch, name: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Dept..."
                  value={salSearch.department}
                  onChange={(e) => { setSalSearch({ ...salSearch, department: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Salary..."
                  value={salSearch.monthlySalary}
                  onChange={(e) => { setSalSearch({ ...salSearch, monthlySalary: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Basic..."
                  value={salSearch.basic}
                  onChange={(e) => { setSalSearch({ ...salSearch, basic: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Allow..."
                  value={salSearch.allowances}
                  onChange={(e) => { setSalSearch({ ...salSearch, allowances: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Deduct..."
                  value={salSearch.deductions}
                  onChange={(e) => { setSalSearch({ ...salSearch, deductions: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Net..."
                  value={salSearch.netSalary}
                  onChange={(e) => { setSalSearch({ ...salSearch, netSalary: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any) => (
            <tr key={item.sr} className="hover:bg-slate-50/50 transition">
              <td className="p-4 text-center font-bold text-slate-400">{item.sr}</td>
              <td className="p-4 font-mono font-bold text-slate-500">{item.empId}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.name} image={item.image} />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                  <Building className="w-3 h-3" />
                  {item.department}
                </span>
              </td>
              <td className="p-4 text-slate-600 font-semibold">{formatCurrency(item.monthlySalary)}</td>
              <td className="p-4 text-slate-500 font-medium">{formatCurrency(item.basic)}</td>
              <td className="p-4 text-blue-600 font-semibold">+{formatCurrency(item.allowances)}</td>
              <td className="p-4 text-rose-500 font-semibold">-{formatCurrency(item.deductions)}</td>
              <td className="p-4 text-emerald-600 font-bold text-sm bg-emerald-50/30">{formatCurrency(item.netSalary)}</td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={9} className="p-10 text-center text-slate-400 font-semibold text-sm">No records found matching date range or filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderAttendanceTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 min-w-[200px]">Employee Name</th>
            <th className="p-4 min-w-[130px]">Date</th>
            <th className="p-4 min-w-[110px]">Check In</th>
            <th className="p-4 min-w-[110px]">Check Out</th>
            <th className="p-4 min-w-[130px]">Status</th>
            <th className="p-4 min-w-[130px]">Working Hours</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Employee..."
                  value={attSearch.name}
                  onChange={(e) => { setAttSearch({ ...attSearch, name: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Date..."
                  value={attSearch.date}
                  onChange={(e) => { setAttSearch({ ...attSearch, date: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Check In..."
                  value={attSearch.checkIn}
                  onChange={(e) => { setAttSearch({ ...attSearch, checkIn: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Check Out..."
                  value={attSearch.checkOut}
                  onChange={(e) => { setAttSearch({ ...attSearch, checkOut: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Status..."
                  value={attSearch.status}
                  onChange={(e) => { setAttSearch({ ...attSearch, status: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hours..."
                  value={attSearch.workingHours}
                  onChange={(e) => { setAttSearch({ ...attSearch, workingHours: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.name} image={item.image} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{item.empId}</span>
                  </div>
                </div>
              </td>
              <td className="p-4 text-slate-500 font-semibold">{item.date}</td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">{item.checkIn}</span>
                  {item.checkInAddress && (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[130px]">
                        <AddressCell lat={item.checkInLat} lng={item.checkInLng} fallback={item.checkInAddress} />
                      </span>
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">{item.checkOut}</span>
                  {item.checkOutAddress && (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[130px]">
                        <AddressCell lat={item.checkOutLat} lng={item.checkOutLng} fallback={item.checkOutAddress} />
                      </span>
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
              <td className="p-4 font-bold text-slate-700">{item.workingHours} hrs</td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={6} className="p-10 text-center text-slate-400 font-semibold text-sm">No records found matching date range or filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderLeaveTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 min-w-[200px]">Employee</th>
            <th className="p-4 min-w-[140px]">Leave Type</th>
            <th className="p-4 min-w-[120px]">From Date</th>
            <th className="p-4 min-w-[120px]">To Date</th>
            <th className="p-4 min-w-[90px] text-center">Days</th>
            <th className="p-4 min-w-[130px]">Status</th>
            <th className="p-4 min-w-[180px]">Reason</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Employee..."
                  value={leaveSearch.employee}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, employee: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Leave Type..."
                  value={leaveSearch.leaveType}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, leaveType: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="From..."
                  value={leaveSearch.fromDate}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, fromDate: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="To..."
                  value={leaveSearch.toDate}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, toDate: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Days..."
                  value={leaveSearch.days}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, days: e.target.value }); setCurrentPage(1); }}
                  className="w-full pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition text-center"
                />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Status..."
                  value={leaveSearch.status}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, status: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reason..."
                  value={leaveSearch.reason}
                  onChange={(e) => { setLeaveSearch({ ...leaveSearch, reason: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.employee} image={item.image} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{item.employee}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{item.empId}</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-[10px] border border-purple-100">
                  {item.leaveType}
                </span>
              </td>
              <td className="p-4 text-slate-500 font-semibold">{item.fromDate}</td>
              <td className="p-4 text-slate-500 font-semibold">{item.toDate}</td>
              <td className="p-4 text-center font-bold text-slate-700">{item.days}</td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
              <td className="p-4 text-slate-600 font-medium max-w-[200px] truncate" title={item.reason}>{item.reason}</td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={7} className="p-10 text-center text-slate-400 font-semibold text-sm">No records found matching date range or filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderExpenseTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 min-w-[200px]">Employee</th>
            <th className="p-4 min-w-[140px]">Category</th>
            <th className="p-4 min-w-[220px]">Description</th>
            <th className="p-4 min-w-[130px]">Amount</th>
            <th className="p-4 min-w-[120px]">Date</th>
            <th className="p-4 min-w-[130px]">Status</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Employee..."
                  value={expSearch.employee}
                  onChange={(e) => { setExpSearch({ ...expSearch, employee: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Category..."
                  value={expSearch.category}
                  onChange={(e) => { setExpSearch({ ...expSearch, category: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Description..."
                  value={expSearch.description}
                  onChange={(e) => { setExpSearch({ ...expSearch, description: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Amount..."
                  value={expSearch.amount}
                  onChange={(e) => { setExpSearch({ ...expSearch, amount: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date..."
                  value={expSearch.date}
                  onChange={(e) => { setExpSearch({ ...expSearch, date: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Status..."
                  value={expSearch.status}
                  onChange={(e) => { setExpSearch({ ...expSearch, status: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.employee} image={item.image} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{item.employee}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{item.empId}</span>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold text-[10px] border border-cyan-100">
                  {item.category}
                </span>
              </td>
              <td className="p-4 text-slate-600 font-medium max-w-[200px] truncate" title={item.description}>{item.description}</td>
              <td className="p-4 font-bold text-slate-800">{formatCurrency(item.amount)}</td>
              <td className="p-4 text-slate-500 font-semibold">{item.date}</td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={6} className="p-10 text-center text-slate-400 font-semibold text-sm">No records found matching date range or filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderTicketTable = () => {
    return (
      <table className="w-full border-collapse text-left text-xs bg-white">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 min-w-[90px]">Ticket</th>
            <th className="p-4 min-w-[200px]">Employee</th>
            <th className="p-4 min-w-[180px]">Subject</th>
            <th className="p-4 min-w-[130px]">Category</th>
            <th className="p-4 min-w-[110px]">Priority</th>
            <th className="p-4 min-w-[130px]">Assigned To</th>
            <th className="p-4 min-w-[120px]">Date</th>
            <th className="p-4 min-w-[120px]">Status</th>
          </tr>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ticket..."
                  value={tktSearch.ticket}
                  onChange={(e) => { setTktSearch({ ...tktSearch, ticket: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Employee..."
                  value={tktSearch.employee}
                  onChange={(e) => { setTktSearch({ ...tktSearch, employee: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Subject..."
                  value={tktSearch.subject}
                  onChange={(e) => { setTktSearch({ ...tktSearch, subject: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Category..."
                  value={tktSearch.category}
                  onChange={(e) => { setTktSearch({ ...tktSearch, category: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Priority..."
                  value={tktSearch.priority}
                  onChange={(e) => { setTktSearch({ ...tktSearch, priority: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Assignee..."
                  value={tktSearch.assignedTo}
                  onChange={(e) => { setTktSearch({ ...tktSearch, assignedTo: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date..."
                  value={tktSearch.date}
                  onChange={(e) => { setTktSearch({ ...tktSearch, date: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
            <th className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Status..."
                  value={tktSearch.status}
                  onChange={(e) => { setTktSearch({ ...tktSearch, status: e.target.value }); setCurrentPage(1); }}
                  className="w-full pl-7 pr-2 py-1.5 text-[10px] font-medium border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedData.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition">
              <td className="p-4 font-mono font-bold text-slate-500">{item.ticket}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={item.employee} image={item.image} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{item.employee}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{item.empId}</span>
                  </div>
                </div>
              </td>
              <td className="p-4 text-slate-600 font-medium max-w-[180px] truncate" title={item.subject}>{item.subject}</td>
              <td className="p-4 text-slate-500 font-medium">{item.category}</td>
              <td className="p-4"><StatusBadge status={item.priority} /></td>
              <td className="p-4 text-slate-600 font-semibold">{item.assignedTo}</td>
              <td className="p-4 text-slate-500 font-semibold">{item.date}</td>
              <td className="p-4"><StatusBadge status={item.status} /></td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={8} className="p-10 text-center text-slate-400 font-semibold text-sm">No records found matching date range or filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderActiveTable = () => {
    if (loadingData) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading actual data from database...</p>
        </div>
      );
    }
    switch (activeTab) {
      case "Employee":
        return renderEmployeeTable();
      case "Salary":
        return renderSalaryTable();
      case "Attendance":
        return renderAttendanceTable();
      case "Leave":
        return renderLeaveTable();
      case "Expenses":
        return renderExpenseTable();
      case "Tickets":
        return renderTicketTable();
      default:
        return null;
    }
  };

  // --- Render Pagination ---

  const renderPaginationBar = () => {
    const isAll = pageSize === "All";
    const sizeNum = isAll ? totalRecords : Number(pageSize);
    const startIdx = totalRecords > 0 ? (currentPage - 1) * sizeNum + 1 : 0;
    const endIdx = Math.min(currentPage * sizeNum, totalRecords);

    return (
      <div className="border-t border-slate-100 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20 flex-shrink-0">
        <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value;
              setPageSize(val === "All" ? "All" : Number(val));
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer shadow-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="All">All</option>
          </select>
          <span className="text-slate-400 font-medium ml-1">
            Showing {startIdx} - {endIdx} of {totalRecords} records
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isAll}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          
          <span className="px-4 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-extrabold shadow-inner min-w-[70px] text-center">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0 || isAll}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 w-full md:h-[calc(100vh-40px)] h-auto flex flex-col bg-slate-50/40 md:overflow-hidden overflow-visible animate-fadeIn">
      <Toaster position="top-right" />

      {/* Tabs list + Export trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/55 shadow-xs">
          {["Employee", "Salary", "Attendance", "Leave", "Expenses", "Tickets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Premium Outline Export Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="px-4.5 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50/50 bg-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer animate-pulse-subtle"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform" />
          </button>

          {showExportDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 transition-all transform scale-100">
                <button
                  onClick={() => handleExportClick("excel")}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => handleExportClick("pdf")}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <File className="w-4 h-4 text-rose-500" />
                  <span>Export PDF</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Table Card (fills space and remains sticky on desktop, scrolls on mobile) */}
      <div className="bg-white rounded-2xl shadow-sm flex flex-col flex-1 min-h-0 md:overflow-hidden overflow-visible">

        {/* Table Title and Date-Range Selector Header (Visible for tabs requiring date filters) */}
        {activeTab !== "Employee" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4.5 border-b border-slate-100 gap-4 flex-shrink-0 bg-slate-50/20">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-wide uppercase">
              {activeTab} Reports
            </h3>

            {/* From Month-Year to To Month-Year range filters */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">From:</span>
                <input
                  type="month"
                  value={fromMonth}
                  onChange={(e) => { setFromMonth(e.target.value); setCurrentPage(1); }}
                  className="text-xs font-semibold text-slate-600 outline-none bg-transparent cursor-pointer border-none p-0 focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">To:</span>
                <input
                  type="month"
                  value={toMonth}
                  onChange={(e) => { setToMonth(e.target.value); setCurrentPage(1); }}
                  className="text-xs font-semibold text-slate-600 outline-none bg-transparent cursor-pointer border-none p-0 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Employee" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4.5 border-b border-slate-100 gap-4 flex-shrink-0 bg-slate-50/20">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-wide uppercase">
              Employee Directory
            </h3>
          </div>
        )}

        {/* Scrollable table wrapper */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto relative">
          {renderActiveTable()}
        </div>

        {/* Pagination at the very bottom */}
        {renderPaginationBar()}
      </div>
    </div>
  );
}
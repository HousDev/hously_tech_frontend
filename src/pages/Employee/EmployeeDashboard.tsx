import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
  User,
  LogOut,
  Menu,
  Clock,
  Briefcase,
  ListTodo,
  Layers,
  PieChart,
  Activity,
  Megaphone,
  Search,
  ChevronDown,
  FileText,
  Receipt,
  ClipboardList,
  DollarSign,
} from 'lucide-react';
import { FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import houslyLogo from '../../assets/images/hously-logo.png';
import Attendance from './Attendance';
import Leave from './Leave';
import Ticket from './Ticket';
import Expenses from './Expenses';
import Tasks from './Tasks';
import Profile from './Profile';
import PaymentHistory from './payroll/PaymentHistory';
import AdvanceSalary from './payroll/AdvanceSalary';
import TaxDeclaration from './payroll/TaxDeclaration';
import toast, { Toaster } from 'react-hot-toast';
import { apiClient } from '../../lib/api';
import { useLeaveSocket } from '../../hooks/useLeaveSocket';
import { useTicketSocket } from '../../hooks/useTicketSocket';
import { useExpenseSocket } from '../../hooks/useExpenseSocket';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import { playNotificationSound } from '../../lib/sound';

interface NotificationItem {
  id: number;
  user_id: number;
  leave_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  let diffMs = now.getTime() - date.getTime();

  // timezone offset correction if server returned local time parsed as UTC or vice versa
  if (diffMs < 0) {
    const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() + timezoneOffsetMs);
    const adjustedDiffMs = now.getTime() - adjustedDate.getTime();

    if (adjustedDiffMs >= 0) {
      diffMs = adjustedDiffMs;
    } else {
      diffMs = 0; // clock desync clamp
    }
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'leave' | 'ticket' | 'expenses' | 'tasks' | 'profile' | 'payroll-history' | 'payroll-advance' | 'payroll-declarations'>('dashboard');
  const [payrollMenuOpen, setPayrollMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserAvatar(resolveAvatarUrl(user.avatar_url || (user as any).avatarUrl));
      const fetchLatestProfile = async () => {
        try {
          const profile = await apiClient.get<any>('/auth/profile');
          if (profile) {
            const imgUrl = profile.avatar_url || profile.avatarUrl || null;
            setUserAvatar(resolveAvatarUrl(imgUrl));
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.avatar_url !== profile.avatar_url || parsedUser.avatarUrl !== profile.avatarUrl) {
                parsedUser.avatar_url = profile.avatar_url;
                parsedUser.avatarUrl = profile.avatarUrl;
                localStorage.setItem('user', JSON.stringify(parsedUser));
              }
            }
          }
        } catch (err) {
          console.warn('[EmployeeDashboard] Failed to fetch latest user profile for avatar:', err);
        }
      };
      fetchLatestProfile();
    } else {
      setUserAvatar(null);
    }
  }, [user]);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTask, setSearchTask] = useState('');
  const [searchAnnouncement, setSearchAnnouncement] = useState('');

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [ticketNotifications, setTicketNotifications] = useState<any[]>([]);
  const [expenseNotifications, setExpenseNotifications] = useState<any[]>([]);
  const [taskNotifications, setTaskNotifications] = useState<any[]>([]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiClient.get<NotificationItem[]>('/leaves/notifications');
      console.log(`[EmployeeDashboard] Fetched ${data ? data.length : 0} notifications:`, data);
      setNotifications(data ?? []);
    } catch (err) {
      console.error('Failed to fetch employee notifications:', err);
    }
  }, []);

  const fetchTicketNotifications = useCallback(async () => {
    try {
      const data = await apiClient.get<any[]>('/tickets/notifications');
      setTicketNotifications(data ?? []);
    } catch (err) {
      console.error('Failed to fetch employee ticket notifications:', err);
    }
  }, []);

  const fetchExpenseNotifications = useCallback(async () => {
    try {
      const data = await apiClient.get<any[]>('/expenses/notifications');
      setExpenseNotifications(data ?? []);
    } catch (err) {
      console.error('Failed to fetch employee expense notifications:', err);
    }
  }, []);

  const fetchTaskNotifications = useCallback(async () => {
    try {
      const data = await apiClient.get<any[]>('/tasks/notifications');
      setTaskNotifications(data ?? []);
    } catch (err) {
      console.error('Failed to fetch employee task notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchTicketNotifications();
    fetchExpenseNotifications();
    fetchTaskNotifications();
  }, [fetchNotifications, fetchTicketNotifications, fetchExpenseNotifications, fetchTaskNotifications]);

  useLeaveSocket((event, data) => {
    console.log(`[EmployeeDashboard] useLeaveSocket callback: event="${event}"`, data);
    if (event === 'leave_status_changed') {
      playNotificationSound();
      fetchNotifications();
    }
    if (event === 'leave_deleted') {
      fetchNotifications();
    }
  });

  useTicketSocket((event, data) => {
    console.log(`[EmployeeDashboard] useTicketSocket callback: event="${event}"`, data);
    fetchTicketNotifications();
    if (event === 'ticket_status_changed') {
      if (user && data.updatedBy !== user.id) {
        playNotificationSound();
        toast.success(`🎫 Ticket status updated: ${data.subject} is now ${data.status}`);
      }
    }
  });

  useExpenseSocket((event, data) => {
    console.log(`[EmployeeDashboard] useExpenseSocket callback: event="${event}"`, data);
    fetchExpenseNotifications();
    if (event === 'expense_status_changed') {
      playNotificationSound();
      toast.success(`💵 Expense status updated: ${data.claim_no} is now ${data.status}`);
    }
  });

  useTaskSocket((event, data) => {
    console.log(`[EmployeeDashboard] useTaskSocket callback: event="${event}"`, data);
    fetchTaskNotifications();
    if (event === 'new_notification') {
      playNotificationSound();
      toast.success(data.message || data.title || `New Task Notification!`);
    } else if (event === 'task_status_updated') {
      playNotificationSound();
      toast.success(` Task status updated!`);
    } else if (event === 'task_comment_added') {
      playNotificationSound();
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/homes');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      await apiClient.patch(`/leaves/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await apiClient.patch('/leaves/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const markTicketNotificationRead = async (id: number) => {
    try {
      await apiClient.patch(`/tickets/notifications/${id}/read`);
      fetchTicketNotifications();
    } catch (err) {
      console.error('Failed to mark ticket notification read:', err);
    }
  };

  const markAllTicketNotificationsRead = async () => {
    try {
      await apiClient.patch('/tickets/notifications/read-all');
      fetchTicketNotifications();
    } catch (err) {
      console.error('Failed to mark all ticket notifications read:', err);
    }
  };

  const markExpenseNotificationRead = async (id: number) => {
    try {
      await apiClient.patch(`/expenses/notifications/${id}/read`);
      fetchExpenseNotifications();
    } catch (err) {
      console.error('Failed to mark expense notification read:', err);
    }
  };

  const markAllExpenseNotificationsRead = async () => {
    try {
      await apiClient.patch('/expenses/notifications/read-all');
      fetchExpenseNotifications();
    } catch (err) {
      console.error('Failed to mark all expense notifications read:', err);
    }
  };

  const markTaskNotificationRead = async (id: number) => {
    try {
      await apiClient.patch(`/tasks/notifications/${id}/read`);
      fetchTaskNotifications();
    } catch (err) {
      console.error('Failed to mark task notification read:', err);
    }
  };

  const markAllTaskNotificationsRead = async () => {
    try {
      await apiClient.patch('/tasks/notifications/read-all');
      fetchTaskNotifications();
    } catch (err) {
      console.error('Failed to mark all task notifications read:', err);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, color: 'text-amber-500' },
    { id: 'leave', label: 'Leave', icon: Briefcase, color: 'text-rose-500' },
    { id: 'ticket', label: 'Ticket', icon: ListTodo, color: 'text-purple-500' },
    { id: 'expenses', icon: Receipt, label: 'Expenses', color: 'text-emerald-500' },
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList, color: 'text-indigo-500' },
  ];

  const unreadCount = notifications.filter(n => !n.is_read || (n.is_read as any) === '0').length +
    ticketNotifications.filter(n => !n.is_read || (n.is_read as any) === '0').length +
    expenseNotifications.filter(n => !n.is_read || (n.is_read as any) === '0').length +
    taskNotifications.filter(n => !n.is_read || (n.is_read as any) === '0').length;

  // KPI Cards
  const kpiCards = [
    { label: "Today's Attendance", value: 'Present', subValue: '9:00 AM - 6:00 PM', icon: Clock, bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Leave Balance', value: '12 Days', subValue: 'Annual Leave', icon: Briefcase, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Pending Tasks', value: '5', subValue: 'Due this week', icon: ListTodo, bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
    { label: 'Active Projects', value: '3', subValue: 'In progress', icon: Layers, bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Upcoming Meetings', value: '4', subValue: 'Today', icon: Calendar, bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
  ];

  // Recent Tasks Data - 10 tasks
  const recentTasks = [
    { task: 'Complete Q3 Report', priority: 'High', dueDate: 'Today', status: 'In Progress' },
    { task: 'Review Project Alpha', priority: 'Medium', dueDate: 'Tomorrow', status: 'Pending' },
    { task: 'Team Sync Meeting', priority: 'Low', dueDate: 'Jul 10', status: 'Completed' },
    { task: 'Update Documentation', priority: 'High', dueDate: 'Jul 12', status: 'In Progress' },
    { task: 'Client Presentation', priority: 'Urgent', dueDate: 'Jul 8', status: 'Pending' },
    { task: 'Code Review PR #42', priority: 'High', dueDate: 'Jul 9', status: 'In Progress' },
    { task: 'Deploy to Production', priority: 'Urgent', dueDate: 'Jul 7', status: 'Completed' },
    { task: 'Write Test Cases', priority: 'Medium', dueDate: 'Jul 11', status: 'Pending' },
    { task: 'Design System Update', priority: 'Low', dueDate: 'Jul 15', status: 'Pending' },
    { task: 'Client Meeting Prep', priority: 'High', dueDate: 'Jul 8', status: 'In Progress' },
  ];

  // Recent Announcements Data
  const recentAnnouncements = [
    { title: 'Q3 Performance Reviews', date: 'Jul 5, 2026', description: 'All employees must complete self-assessment by July 15.', category: 'HR' },
    { title: 'New Attendance Policy', date: 'Jul 3, 2026', description: 'Updated attendance policy effective from August 1.', category: 'Policy' },
    { title: 'Company Holiday', date: 'Jul 1, 2026', description: 'Office closed on July 15 for Annual General Meeting.', category: 'Event' },
    { title: 'New Hire Orientation', date: 'Jun 28, 2026', description: 'Welcome 5 new team members joining next week.', category: 'HR' },
    { title: 'System Maintenance', date: 'Jun 25, 2026', description: 'Scheduled maintenance on July 20 from 2-4 AM.', category: 'IT' },
  ];

  // Filter functions
  const filteredTasks = recentTasks.filter(item =>
    item.task.toLowerCase().includes(searchTask.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTask.toLowerCase())
  );

  const filteredAnnouncements = recentAnnouncements.filter(item =>
    item.title.toLowerCase().includes(searchAnnouncement.toLowerCase()) ||
    item.category.toLowerCase().includes(searchAnnouncement.toLowerCase())
  );

  const headerTitle = {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    leave: 'Leave Management',
    ticket: 'Helpdesk Tickets',
    expenses: 'Expenses Management',
    tasks: 'My Tasks',
    profile: 'My Profile',
    'payroll-history': 'Salary Payment History',
    'payroll-advance': 'Salary Advance & Loans',
    'payroll-declarations': 'TDS & Tax Savings Declarations'
  }[activeTab] || 'Dashboard';

  const mobileHeaderTitle = {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    leave: 'Leaves',
    ticket: 'Tickets',
    expenses: 'Expenses',
    tasks: 'Tasks',
    profile: 'Profile',
    'payroll-history': 'Payments',
    'payroll-advance': 'Advances',
    'payroll-declarations': 'Tax Declarations'
  }[activeTab] || 'Dashboard';

  const headerSubtitle = {
    dashboard: 'Overview of your activities, tasks, and meetings',
    attendance: 'Track your daily punch-in, punch-out, and logs',
    leave: 'Apply for leaves and track your leave balances',
    ticket: 'Raise support tickets and view their progress',
    expenses: 'Track your expenses and view their progress',
    tasks: 'View, progress, and log hours for your tasks',
    profile: 'View and manage your personal and employment information',
    'payroll-history': 'Track month-on-month payslips and salary credit status',
    'payroll-advance': 'Request emergency short-term salary advance and review repayment status',
    'payroll-declarations': 'Choose tax regimes and upload investment declaration proofs'
  }[activeTab] || 'Overview of your activities, tasks, and meetings';

  const mobileHeaderSubtitle = {
    dashboard: 'Activity summary',
    attendance: 'Punch-in/out logs',
    leave: 'Balances & applications',
    ticket: 'Support progress',
    expenses: 'Reimbursement claims',
    tasks: 'Log hours & tasks',
    profile: 'Personal info',
    'payroll-history': 'Payslips history',
    'payroll-advance': 'Emergency advances',
    'payroll-declarations': 'Tax exemptions'
  }[activeTab] || 'Activity summary';

  return (
    <div className="min-h-screen bg-[#f0f4f9] font-sans">
      <Toaster position="top-right" />

      {/* Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-56' : 'w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-white flex flex-col shadow-xl border-r border-slate-100`}
      >
        <div className={`h-16 flex items-center ${sidebarOpen ? 'px-5' : 'justify-center'}`}>
          <img src={houslyLogo} alt="Hously" className={`${sidebarOpen ? 'h-12 w-auto' : 'h-8 w-auto'}`} />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileSidebarOpen(false);
                }}
                className={`flex items-center w-full rounded-xl transition-all duration-200 group px-3 py-2.5 text-left cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white shadow-md shadow-blue-800/10 font-bold'
                    : 'text-gray-700 hover:text-slate-900 hover:bg-slate-100/80'}`}
              >
                <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white scale-110' : item.color}`} />
                {sidebarOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
              </button>
            );
          })}

          {/* Collapsible Payroll Menu */}
          {(() => {
            const isPayrollActive = ['payroll-summary', 'payroll-history', 'payroll-advance', 'payroll-declarations'].includes(activeTab);
            return (
              <div className="space-y-1">
                <button
                  onClick={() => setPayrollMenuOpen(!payrollMenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer
                    ${isPayrollActive
                      ? 'bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white shadow-md shadow-blue-800/10 font-bold border-transparent'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className={`w-4 h-4 group-hover:rotate-12 transition-transform duration-300 ${isPayrollActive ? 'text-white' : 'text-[#0D47A1]'}`} />
                    {sidebarOpen && (
                      <span className={`text-sm font-semibold tracking-wide ${isPayrollActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        My Payroll
                      </span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPayrollActive ? 'text-white/80' : 'text-slate-400'} ${payrollMenuOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Sub Menu with connecting vertical line */}
                {payrollMenuOpen && sidebarOpen && (
                  <div className="pl-4 ml-3.5 border-l border-slate-200/80 flex flex-col gap-0.5 mt-1 text-left">
                    {[
                      { id: 'payroll-history', label: 'Payment History', icon: FileText, color: 'text-teal-500' },
                      { id: 'payroll-advance', label: 'Salary Advance', icon: DollarSign, color: 'text-purple-500' },
                      { id: 'payroll-declarations', label: 'Tax Declarations', icon: Layers, color: 'text-emerald-500' },
                    ].map((sub) => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id as any);
                            setMobileSidebarOpen(false);
                          }}
                          className={`flex items-center rounded-lg transition-all duration-200 group px-3 py-2 text-left cursor-pointer
                            ${isSubActive
                              ? 'bg-[#0D47A1]/10 text-[#0D47A1] font-bold border-l-2 border-[#1976D2] pl-2.5'
                              : 'text-gray-650 hover:text-slate-900 hover:bg-slate-100/80'}`}
                        >
                          <sub.icon className={`w-3.5 h-3.5 mr-2.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isSubActive ? 'text-[#0D47A1] scale-110' : sub.color}`} />
                          <span className="text-xs font-semibold tracking-wide">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </nav>

        <div className="px-3 pb-4 pt-2 border-t border-slate-100 flex flex-col gap-1">
          <button
            onClick={() => window.open(`${window.location.origin}/homes`, "_blank")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-slate-100 transition ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiExternalLink className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Visit Website</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 min-h-screen ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white shadow-sm border-b border-slate-100">
          <div className="px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 transition">
                {sidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-xl font-bold text-slate-800 leading-tight">
                  <span className="inline sm:hidden">{mobileHeaderTitle}</span>
                  <span className="hidden sm:inline">{headerTitle}</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                  <span className="inline sm:hidden">{mobileHeaderSubtitle}</span>
                  <span className="hidden sm:inline">{headerSubtitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-slate-100 transition relative flex items-center">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            await markAllNotificationsRead();
                            await markAllTicketNotificationsRead();
                            await markAllExpenseNotificationsRead();
                            await markAllTaskNotificationsRead();
                          }}
                          className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 && ticketNotifications.length === 0 && expenseNotifications.length === 0 && taskNotifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                          <p className="text-xs font-semibold">No notifications yet</p>
                        </div>
                      ) : (
                        [
                          ...notifications,
                          ...ticketNotifications.map(t => ({ ...t, isTicket: true })),
                          ...expenseNotifications.map(e => ({ ...e, isExpense: true })),
                          ...taskNotifications.map(t => ({ ...t, isTask: true }))
                        ]
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((n) => {
                            const fmtTime = formatRelativeTime(n.created_at);
                            const isTicket = (n as any).isTicket === true;
                            const isExpense = (n as any).isExpense === true;
                            const isTask = (n as any).isTask === true;
                            return (
                              <div
                                key={isTicket ? `ticket_${n.id}` : isExpense ? `expense_${n.id}` : isTask ? `task_${n.id}` : `leave_${n.id}`}
                                onClick={() => {
                                  if (isTicket) {
                                    markTicketNotificationRead(n.id);
                                    setActiveTab('ticket');
                                  } else if (isExpense) {
                                    markExpenseNotificationRead(n.id);
                                    setActiveTab('expenses');
                                  } else if (isTask) {
                                    markTaskNotificationRead(n.id);
                                    setActiveTab('tasks');
                                  } else {
                                    markNotificationRead(n.id);
                                    setActiveTab('leave');
                                  }
                                  setShowNotifications(false);
                                }}
                                className={`p-3 border-b border-gray-50 hover:bg-slate-50 transition cursor-pointer select-none ${(!n.is_read || (n.is_read as any) === '0') ? 'bg-blue-50/25 border-l-2 border-blue-500' : ''}`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-sm mt-0.5">{isTicket ? '🎫' : isExpense ? '💵' : isTask ? '📋' : '🔔'}</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-800">
                                      {n.title.replace(/^[🎫📅📋📥🔄📝👤💼📢🔔❌?\s]+/, '').trim()}
                                    </p>
                                    <p className="text-[11px] text-slate-550 mt-0.5 leading-relaxed">{n.message}</p>
                                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">{fmtTime}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user?.full_name || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setUserAvatar(null)}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#0D47A1] text-white rounded-full flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {user?.full_name ? user.full_name.split(' ').map(w => w.charAt(0)).slice(0, 2).join('').toUpperCase() : 'E'}
                      </span>
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-gray-800">{user?.full_name || 'Employee'}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user?.role || 'Staff'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900 text-sm">{user?.full_name || 'Employee'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'staff@houslytech.com'}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                      >
                        <User className="w-4 h-4" /><span>Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">
                        <Settings className="w-4 h-4" /><span>Settings</span>
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" /><span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={`p-4 md:p-6 ${(activeTab === 'expenses' || activeTab === 'payroll-advance' || activeTab === 'payroll-history') ? 'md:overflow-hidden' : 'overflow-y-auto'}`} style={{ height: 'calc(100vh - 64px)' }}>
          {activeTab === 'attendance' && <Attendance />}

          {activeTab === 'leave' && <Leave />}

          {activeTab === 'ticket' && <Ticket />}

          {activeTab === 'expenses' && <Expenses />}

          {activeTab === 'tasks' && <Tasks />}

          {activeTab === 'profile' && <Profile />}

          {activeTab === 'payroll-history' && <PaymentHistory />}

          {activeTab === 'payroll-advance' && <AdvanceSalary />}

          {activeTab === 'payroll-declarations' && <TaxDeclaration />}



          {activeTab === 'dashboard' && (
            <div className="max-w-full space-y-6">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {kpiCards.map((kpi, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
                    <div className="flex items-start justify-between">
                      <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                        <kpi.icon className={`w-4 h-4 ${kpi.textColor}`} />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-[10px] text-slate-404 font-medium uppercase tracking-wider">{kpi.label}</p>
                      <h4 className="text-lg font-bold mt-0.5 text-slate-800">{kpi.value}</h4>
                      <p className="text-[10px] text-slate-400">{kpi.subValue}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Distribution + Recent Tasks - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Time Distribution - Left Side (1/3 width) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-1 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
                      Time Distribution
                    </h3>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">This Week</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#93C5FD" strokeWidth="10" strokeDasharray="75 164" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#6EE7B7" strokeWidth="10" strokeDasharray="55 164" strokeDashoffset="-75" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#FCD34D" strokeWidth="10" strokeDasharray="38 164" strokeDashoffset="-130" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#C4B5FD" strokeWidth="10" strokeDasharray="16 164" strokeDashoffset="-168" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-700">40h</p>
                          <p className="text-[7px] text-slate-400 font-medium tracking-wider">TOTAL HOURS</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-w-xs mt-4 grid grid-cols-2 gap-2">
                      {[
                        { color: 'bg-blue-400', label: 'Meetings', value: '8h' },
                        { color: 'bg-emerald-400', label: 'Work', value: '6h' },
                        { color: 'bg-amber-400', label: 'Break', value: '4h' },
                        { color: 'bg-purple-400', label: 'Learning', value: '2h' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                          <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                          <span className="text-xs font-semibold text-slate-700 ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Tasks - Right Side (2/3 width with more height) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-2 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                      <ListTodo className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                      Recent Tasks
                    </h3>
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">{recentTasks.length} tasks</span>
                  </div>

                  {/* Small Search Bar */}
                  <div className="relative mb-3 max-w-[200px]">
                    <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTask}
                      onChange={(e) => setSearchTask(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition text-slate-808"
                    />
                  </div>

                  <div className="overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-slate-100">
                          <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Task</th>
                          <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Priority</th>
                          <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Due</th>
                          <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-slate-700">
                        {filteredTasks.map((item, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                            <td className="py-1.5 text-xs text-slate-808">{item.task}</td>
                            <td className="py-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
                                item.priority === 'High' ? 'bg-orange-50 text-orange-600' :
                                  item.priority === 'Medium' ? 'bg-blue-50 text-blue-600' :
                                    'bg-slate-50 text-slate-600'
                                }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="py-1.5 text-slate-400 font-medium">{item.dueDate}</td>
                            <td className="py-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                item.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                  'bg-slate-50 text-slate-600'
                                }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Recent Announcements - Full Width */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-purple-500" strokeWidth={2.5} />
                    Recent Announcements
                  </h3>
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-medium">Hously</span>
                </div>

                {/* Small Search Bar */}
                <div className="relative mb-3 max-w-[200px]">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchAnnouncement}
                    onChange={(e) => setSearchAnnouncement(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] transition text-slate-808"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Title</th>
                        <th className="text-left font-semibold text-slate-500 py-1.5 text-[10px] uppercase tracking-wider">Date</th>
                        <th className="text-left font-semibold text-slate-505 py-1.5 text-[10px] uppercase tracking-wider">Category</th>
                        <th className="text-left font-semibold text-slate-505 py-1.5 text-[10px] uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold text-slate-705">
                      {filteredAnnouncements.map((item, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-1.5 text-xs text-slate-808">{item.title}</td>
                          <td className="py-1.5 text-slate-400 font-medium">{item.date}</td>
                          <td className="py-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.category === 'HR' ? 'bg-purple-50 text-purple-600' :
                              item.category === 'Policy' ? 'bg-blue-50 text-blue-600' :
                                item.category === 'Event' ? 'bg-emerald-50 text-emerald-600' :
                                  'bg-slate-50 text-slate-600'
                              }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-1.5 text-slate-500 font-medium">{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Meetings - Full Width */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" strokeWidth={2.5} />
                    Upcoming Meetings
                  </h3>
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-medium">4 meetings</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left font-semibold text-slate-505 py-1.5 text-[10px] uppercase tracking-wider">Meeting</th>
                        <th className="text-left font-semibold text-slate-550 py-1.5 text-[10px] uppercase tracking-wider">Time</th>
                        <th className="text-left font-semibold text-slate-550 py-1.5 text-[10px] uppercase tracking-wider">Attendees</th>
                        <th className="text-left font-semibold text-slate-550 py-1.5 text-[10px] uppercase tracking-wider">Priority</th>
                        <th className="text-left font-semibold text-slate-550 py-1.5 text-[10px] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold text-slate-705">
                      {[
                        { meeting: 'Team Standup', time: 'Today, 3:00 PM', attendees: '8 members', priority: 'High', status: 'Scheduled' },
                        { meeting: 'Client Review', time: 'Tomorrow, 10:00 AM', attendees: '5 members', priority: 'Urgent', status: 'Scheduled' },
                        { meeting: 'Project Planning', time: 'Jul 10, 2:00 PM', attendees: '6 members', priority: 'Medium', status: 'Pending' },
                        { meeting: 'HR Session', time: 'Jul 12, 11:00 AM', attendees: '12 members', priority: 'Low', status: 'Scheduled' },
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-1.5 text-xs text-slate-808">{item.meeting}</td>
                          <td className="py-1.5 text-slate-400 font-medium">{item.time}</td>
                          <td className="py-1.5 text-slate-500 font-medium">{item.attendees}</td>
                          <td className="py-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
                              item.priority === 'High' ? 'bg-orange-50 text-orange-600' :
                                item.priority === 'Medium' ? 'bg-blue-50 text-blue-600' :
                                  'bg-slate-50 text-slate-600'
                              }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-slate-50 text-slate-600'
                              }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
import { useState, useEffect, useRef } from 'react';
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
  X,
  Building2,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
  User2,
  Globe,
  TrendingUp,
  Award,
  Zap,
  Coffee,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  Users,
  Mail,
  MessageSquare,
  Link,
  CreditCard,
  Shield,
  Phone,
  MapPin,
  Gift,
  Crown
} from 'lucide-react';
import { FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import houslyLogo from '../../assets/images/hously-logo.png';
import Attendance from './Attendance';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance'>('attendance');
  const { user, logout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle outside clicks for dropdowns
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, color: 'text-emerald-500' },
  ];

  // Notification data
  const notifications = [
    { id: 1, title: 'Meeting Reminder', message: 'Team sync at 3:00 PM', time: '5 mins ago', type: 'meeting', read: false },
    { id: 2, title: 'Task Assigned', message: 'You have been assigned to Project Alpha', time: '1 hour ago', type: 'task', read: false },
    { id: 3, title: 'Leave Approved', message: 'Your leave request for July 20 has been approved', time: '3 hours ago', type: 'leave', read: false },
    { id: 4, title: 'Performance Review', message: 'Your Q3 performance review is scheduled', time: '1 day ago', type: 'review', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Quick action items
  const quickActions = [
    { icon: Coffee, label: 'Take Break', color: 'from-amber-400 to-orange-400' },
    { icon: FileText, label: 'Submit Report', color: 'from-blue-400 to-blue-600' },
    { icon: Users, label: 'Team Chat', color: 'from-purple-400 to-pink-400' },
    { icon: Calendar, label: 'Schedule Meet', color: 'from-emerald-400 to-teal-400' },
  ];

  // Dashboard statistics
  const stats = [
    {
      label: 'Weekly Hours',
      value: '42.5h',
      target: 'Target: 40h',
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      progress: 85,
      change: '+8%',
      changeColor: 'text-emerald-500'
    },
    {
      label: 'Present Days',
      value: '18/20',
      target: 'This month',
      icon: User2,
      color: 'from-emerald-500 to-teal-500',
      progress: 90,
      change: '+2%',
      changeColor: 'text-emerald-500'
    },
    {
      label: 'Leave Balance',
      value: '12 Days',
      target: 'Paid leave available',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-500',
      progress: 60,
      change: '-3%',
      changeColor: 'text-red-500'
    },
    {
      label: 'Compliance Rate',
      value: '98.5%',
      target: 'Timing adherence',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      progress: 98,
      change: '+1.2%',
      changeColor: 'text-emerald-500'
    },
  ];

  // Recent activities
  const recentActivities = [
    { action: 'Punched in at 9:00 AM', time: 'Today, 9:00 AM', icon: Clock, color: 'text-blue-500' },
    { action: 'Completed daily standup', time: 'Today, 10:30 AM', icon: CheckCircle, color: 'text-emerald-500' },
    { action: 'Submitted weekly report', time: 'Yesterday, 4:00 PM', icon: FileText, color: 'text-purple-500' },
    { action: 'Requested leave for July 25', time: '2 days ago', icon: Calendar, color: 'text-orange-500' },
  ];

  // Upcoming events
  const upcomingEvents = [
    { title: 'Team Meeting', time: 'Today, 3:00 PM', type: 'meeting', priority: 'high' },
    { title: 'Project Deadline', time: 'Jul 25, 5:00 PM', type: 'deadline', priority: 'urgent' },
    { title: 'Performance Review', time: 'Jul 28, 2:00 PM', type: 'review', priority: 'medium' },
  ];

  // Quick stats cards
  const quickStats = [
    { label: 'Tasks Completed', value: '24/32', icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Team Members', value: '8', icon: Users, color: 'text-blue-500' },
    { label: 'Projects', value: '3', icon: Briefcase, color: 'text-purple-500' },
    { label: 'Streak', value: '12 days', icon: Award, color: 'text-amber-500' },
  ];

  // Derive title from active tab
  const headerTitle = activeTab === 'dashboard' ? 'Dashboard Overview' : 'Attendance Workspace';
  const headerSubtitle = activeTab === 'dashboard'
    ? 'View your summary, updates, and metrics'
    : 'Punch in/out, log hours, and view history';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans select-text text-gray-800">

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Styled exactly like Dashboard.tsx */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-54' : 'w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-white/95 backdrop-blur-md flex flex-col shadow-[4px_0_24px_rgba(15,23,42,0.06)] border-r border-slate-100`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
          <div className="flex items-start space-x-3">
            <img src={houslyLogo} alt="Hously" className={`${sidebarOpen ? 'h-13 w-30' : 'h-10 w-auto'}`} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as 'dashboard' | 'attendance');
                  setMobileSidebarOpen(false);
                }}
                className={`flex items-center w-full rounded-lg transition-all duration-200 group px-3 py-2.5 text-left cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white shadow-md shadow-blue-800/10 font-bold'
                    : 'text-gray-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className={`w-4 h-4 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : item.color}`} />
                {sidebarOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Visit Website & Logout Buttons - Bottom of Sidebar */}
        <div className="px-3 pb-4 pt-2 border-t border-slate-100 flex flex-col gap-1">
          <button
            onClick={() => {
              const baseUrl = window.location.origin;
              window.open(`${baseUrl}/homes`, "_blank");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-slate-100/80 hover:text-slate-900 transition-all duration-200 group cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}
            title="Visit Website"
          >
            <FiExternalLink className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            {sidebarOpen && <span className="text-sm font-semibold tracking-wide">Visit Website</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            {sidebarOpen && <span className="text-sm font-semibold tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out min-h-screen
          ${sidebarOpen ? 'lg:ml-54' : 'lg:ml-20'}
        `}
      >
        {/* Header - Styled exactly like Dashboard.tsx */}
        <header className="sticky top-0 z-[30] h-16 bg-white/95 backdrop-blur-md text-gray-900 transition-all duration-300 ease-in-out overflow-visible shadow-[0_4px_24px_rgba(15,23,42,0.06)] border-b border-slate-100">
          <div className="px-4 h-full">
            <div className="flex items-center justify-between h-full">

              {/* LEFT */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  {sidebarOpen ? <Menu className="w-5 h-5 text-black" /> : <ChevronRight className="w-5 h-5 text-black" />}
                </button>

                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  <Menu className="w-5 h-5 text-gray-800" />
                </button>

                <div className="flex flex-col select-none">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
                    {headerTitle}
                  </h1>
                  {headerSubtitle && (
                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide leading-none mt-0.5">
                      {headerSubtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5 text-gray-800" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[92vw] sm:absolute sm:left-auto sm:translate-x-0 sm:right-0 sm:top-full sm:mt-1 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999]">
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">Mark all read</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-200 text-center">
                        <button className="text-xs text-blue-600 font-medium hover:text-blue-800">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-full flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {user?.full_name
                          ? user.full_name
                            .split(' ')
                            .map((word) => word.charAt(0))
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                          : user?.username?.charAt(0).toUpperCase() || 'E'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">
                        {user?.full_name || user?.username || 'Employee'}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-tight capitalize">
                        {user?.role || 'Staff'}
                      </p>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999]">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-full flex items-center justify-center">
                            <span className="font-bold text-lg">
                              {user?.full_name?.charAt(0).toUpperCase() ||
                                user?.username?.charAt(0).toUpperCase() ||
                                'E'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.full_name || user?.username || 'Employee User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email || 'staff@houslytech.com'}
                            </p>
                            <p className="text-xs text-emerald-600 font-semibold mt-0.5 capitalize">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1"></span>
                              {user?.role || 'Staff'} • Active
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>My Reports</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="bg-[#f3f6fb] flex flex-col overflow-y-auto p-4 md:p-6" style={{ height: 'calc(100vh - 64px)' }}>
          {activeTab === 'attendance' ? (
            <Attendance />
          ) : (
            /* Dashboard Overview view - Modern MNC Design */
            <div className="max-w-7xl mx-auto space-y-6">

              {/* Greetings Banner with Quick Actions */}
              <div className="relative bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1a237e] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-blue-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.full_name?.split(' ')[0] || user?.username || 'Team Member'}!
                        </h2>
                        <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium max-w-xl">
                          Welcome to your MNC portal. Track your schedule, attendance, leaves, and system logs dynamically.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                        <Award className="w-3.5 h-3.5" />
                        Level 4
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                        <Star className="w-3.5 h-3.5" />
                        4.8 Rating
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-400/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        On Track
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`bg-gradient-to-r ${action.color} p-3 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer`}
                        title={action.label}
                      >
                        <action.icon className="w-5 h-5" />
                      </button>
                    ))}
                    <button
                      onClick={() => setShowQuickActions(!showQuickActions)}
                      className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-white hover:bg-white/30 transition cursor-pointer"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-extrabold ${stat.changeColor}`}>{stat.change}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold tracking-wide uppercase leading-none">{stat.label}</p>
                      <h4 className="text-2xl font-black mt-2 text-slate-800">{stat.value}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${stat.progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">{stat.target}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 text-center hover:bg-white transition-all duration-200">
                    <div className={`${stat.color} inline-flex p-2 rounded-lg bg-opacity-10`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xl font-black text-slate-800 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Mid Sections - 3 Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 lg:col-span-1">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Recent Activity
                    </h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Live</span>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 group hover:bg-slate-50 p-2 rounded-xl transition-all duration-200">
                        <div className={`${activity.color} bg-opacity-10 p-2 rounded-lg flex-shrink-0`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{activity.action}</p>
                          <p className="text-xs text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* News & Announcements */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 lg:col-span-1">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      Announcements
                    </h3>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Hously</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'Annual General Meeting', date: 'July 15, 2026', body: 'All personnel required for corporate overview and planning.', icon: Calendar, color: 'text-blue-500' },
                      { title: 'New Attendance Locations', date: 'July 05, 2026', body: 'Select "Client Site" or "Field Office" during check-ins.', icon: MapPin, color: 'text-emerald-500' },
                      { title: 'Team Building Event', date: 'July 28, 2026', body: 'Annual team building at Resort Valley. Registration open.', icon: Gift, color: 'text-amber-500' },
                    ].map((news, i) => (
                      <div key={i} className="group p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className={`${news.color} bg-opacity-10 p-2 rounded-lg flex-shrink-0`}>
                            <news.icon className={`w-4 h-4 ${news.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-400">{news.date}</span>
                            <h4 className="font-extrabold text-sm text-slate-800 mt-0.5 group-hover:text-blue-600 transition-colors">{news.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{news.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming & Profile Quickcard */}
                <div className="space-y-6 lg:col-span-1">
                  {/* Upcoming Events */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        Upcoming
                      </h3>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{upcomingEvents.length} events</span>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${event.priority === 'urgent' ? 'bg-red-500' : event.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                              <p className="text-xs text-slate-400">{event.time}</p>
                            </div>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${event.priority === 'urgent' ? 'bg-red-100 text-red-600' : event.priority === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                            {event.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Quickcard */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Profile
                      </h3>
                      <button className="text-xs text-blue-600 font-medium hover:underline">View Full</button>
                    </div>
                    <div className="flex flex-col items-center py-2">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#0D47A1] to-[#1976D2] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md border-4 border-slate-100 ring-2 ring-blue-500/20">
                        {user?.full_name
                          ? user.full_name
                            .split(' ')
                            .map((word) => word.charAt(0))
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                          : user?.username?.charAt(0).toUpperCase() || 'E'}
                      </div>
                      <h4 className="font-black text-slate-800 text-base mt-4">{user?.full_name || user?.username || 'Employee'}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{user?.email || 'staff@houslytech.com'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-semibold capitalize">{user?.role || 'Staff'}</span>
                      </div>

                      <div className="w-full mt-5 grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-slate-400 font-medium">Team</p>
                          <p className="text-sm font-extrabold text-slate-800">Core</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-slate-400 font-medium">Projects</p>
                          <p className="text-sm font-extrabold text-slate-800">3 Active</p>
                        </div>
                      </div>

                      <div className="w-full mt-3 flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white text-sm font-bold py-2 rounded-xl shadow-md shadow-blue-800/20 hover:shadow-lg transition">
                          <Mail className="w-4 h-4 inline mr-1" /> Email
                        </button>
                        <button className="flex-1 bg-slate-100 text-slate-700 text-sm font-bold py-2 rounded-xl hover:bg-slate-200 transition">
                          <MessageSquare className="w-4 h-4 inline mr-1" /> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Quick Links */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase flex items-center gap-2">
                    <Link className="w-4 h-4 text-slate-400" />
                    Quick Links
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { label: 'HR Portal', icon: Users, color: 'text-purple-500' },
                    { label: 'Payroll', icon: CreditCard, color: 'text-emerald-500' },
                    { label: 'IT Support', icon: Settings, color: 'text-blue-500' },
                    { label: 'Company Wiki', icon: FileText, color: 'text-orange-500' },
                    { label: 'Directory', icon: User2, color: 'text-indigo-500' },
                    { label: 'Policy Docs', icon: Shield, color: 'text-red-500' },
                  ].map((link, i) => (
                    <button key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition group">
                      <link.icon className={`w-4 h-4 ${link.color}`} />
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">{link.label}</span>
                    </button>
                  ))}
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
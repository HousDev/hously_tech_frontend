


// export default AdminDashboard;
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Briefcase, 
  FileText, 
  Settings,
  MessageSquare,
  Bell,
  ChevronRight,
  X,
  User,
  LogOut,
  Menu,
  Plus,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  User2,
  Users,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import houslyLogo from '../../assets/images/hously-logo.png';
import DashboardAnalytics from '../../components/admin/DashboardAnalytics';
import { toast } from 'react-hot-toast';

// Interfaces
interface EnquiryNotification {
  career_application_id: any;
  id: number;
  enquiry_id: number;
  title: string;
  message: string;
  type: 'new_enquiry' | 'status_change' | 'note_added' | 'assigned';
  is_read: boolean;
  admin_id?: number;
  created_at: string;
}

interface Enquiry {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  inquiry_type: string;
  status: 'new' | 'in_progress' | 'contacted' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

interface DashboardStats {
  total: number;
  new: number;
  in_progress: number;
  contacted: number;
  closed: number;
  urgent: number;
  today: number;
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMessagesSidebar, setShowMessagesSidebar] = useState(false);

  // ✅ useAuth context - no more getCurrentUser / isAdmin / logout imports
  const { user, isAdmin, logout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeMessageTab, setActiveMessageTab] = useState('chat');
  const [careerNotifications, setCareerNotifications] = useState<any[]>([]);
  const [unreadCareerCount, setUnreadCareerCount] = useState(0);

  // Enquiry notifications
  const [enquiryNotifications, setEnquiryNotifications] = useState<EnquiryNotification[]>([]);
  const [unreadEnquiryCount, setUnreadEnquiryCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
const careerFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const enquiryFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
  { path: '/homes/admin',             icon: LayoutDashboard, label: 'Dashboard',    section: 'dashboard'    },
  { path: '/homes/admin/home',        icon: Home,            label: 'Home Page',    section: 'home'         },
  { path: '/homes/admin/services',    icon: Briefcase,       label: 'Services',     section: 'services'     },
  { path: '/homes/admin/blog',        icon: FileText,        label: 'Blogs',        section: 'blog'         },
  { path: '/homes/admin/testimonials',icon: ThumbsUp,        label: 'Testimonials', section: 'testimonials' },
  { path: '/homes/admin/enquiries',   icon: MessageSquare,   label: 'Enquiries',    section: 'enquiries'    },
  { path: '/homes/admin/case-studies',icon: FolderOpen,      label: 'Case Studies', section: 'casestudies'  },
  { path: '/homes/admin/career',      icon: Users,           label: 'Careers',      section: 'career'       },
  { path: '/homes/admin/team',        icon: User2,           label: 'Team Members', section: 'team'         },
  { path: '/homes/admin/settings',    icon: Settings,        label: 'Settings',     section: 'settings'     },
];

  // Messages data
  const messages = [
    { id: 1, name: 'Archie Parker',  message: 'Kalid is online',          status: 'online',  unread: false },
    { id: 2, name: 'Alfie Mason',    message: 'Taherah left 7 mins ago',  status: 'offline', unread: false },
    { id: 3, name: 'AharlieKane',   message: 'Sami is online',           status: 'online',  unread: false },
    { id: 4, name: 'Athan Jacoby',  message: 'Nargis left 30 mins ago',  status: 'offline', unread: false },
    { id: 5, name: 'Bashid Samim',  message: 'Rashid left 50 mins ago',  status: 'offline', unread: false },
    { id: 6, name: 'Breddie Ronan', message: 'Kalid is online',          status: 'online',  unread: false },
    { id: 7, name: 'George Carson', message: 'Taherah left 7 mins ago',  status: 'offline', unread: false },
  ];

  // Notifications (static UI data)
  const notifications = [
    { id: 1, title: 'New Contact Form',  message: 'You have received a new contact form submission', time: '5 min ago',   read: false, type: 'contact'    },
    { id: 2, title: 'Blog Comment',      message: 'John Doe commented on your blog post',             time: '1 hour ago',  read: false, type: 'blog'       },
    { id: 3, title: 'Job Application',   message: 'New job application received for Senior Developer',time: '2 hours ago', read: true,  type: 'career'     },
    { id: 4, title: 'Service Inquiry',   message: 'Service inquiry from Michael Brown',               time: '3 hours ago', read: true,  type: 'service'    },
    { id: 5, title: 'New Subscriber',    message: 'New newsletter subscriber added',                  time: '5 hours ago', read: true,  type: 'subscriber' },
  ];

  // Notes data
  const notes = [
    { id: 1, title: 'Meeting Notes',  content: 'Discuss project timeline with team', time: 'Yesterday', pinned: true  },
    { id: 2, title: 'Content Ideas',  content: 'Blog topics for next month',         time: '2 days ago', pinned: false },
    { id: 3, title: 'Design Updates', content: 'Update homepage banner design',      time: '3 days ago', pinned: false },
  ];

  // Alerts data
  const alerts = [
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance at 2 AM',      time: 'Tomorrow',   type: 'warning' },
    { id: 2, title: 'Backup Completed',   message: 'Daily backup completed successfully', time: 'Today',      type: 'success' },
    { id: 3, title: 'Storage Warning',    message: 'Storage usage at 85%',               time: '2 hours ago', type: 'error'  },
  ];

  // ─── Logout ──────────────────────────────────────────────────────────────────
  function handleLogout() {
    logout();
    navigate('/homes');
  }

  // User dropdown items — defined AFTER handleLogout
 const userMenuItems = [
  { icon: User,     label: 'Profile',       action: () => navigate('/homes/admin/profile')  },
  { icon: Bell,     label: 'Notifications', action: () => setShowNotifications(true)         },
  { icon: Settings, label: 'Settings',      action: () => navigate('/homes/admin/settings') },
  { icon: LogOut,   label: 'Logout',        action: handleLogout, isLogout: true              },
];

  // ─── Fetch enquiry notifications ─────────────────────────────────────────────
  const fetchEnquiryNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const [notifs, countData] = await Promise.all([
        apiClient.get<EnquiryNotification[]>('/enquiries/notifications/all'),
        apiClient.get<{ count: number }>('/enquiries/notifications/unread-count'),
      ]);
      setEnquiryNotifications(notifs ?? []);
      setUnreadEnquiryCount(countData?.count ?? 0);
    } catch (error) {
      console.error('Failed to fetch enquiry notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // ─── Fetch career notifications ───────────────────────────────────────────────
  const fetchCareerNotifications = async () => {
    try {
      const [notifs, countData] = await Promise.all([
        apiClient.get<any[]>('/career/notifications/all'),
        apiClient.get<{ count: number }>('/career/notifications/unread-count'),
      ]);
      setCareerNotifications(notifs ?? []);
      setUnreadCareerCount(countData?.count ?? 0);
    } catch (error) {
      console.error('Failed to fetch career notifications:', error);
    }
  };

  // ─── Fetch recent enquiries ───────────────────────────────────────────────────
  const fetchRecentEnquiries = async () => {
    try {
      const data = await apiClient.get<Enquiry[]>('/enquiries/recent?limit=5');
      setRecentEnquiries(data ?? []);
    } catch (error) {
      console.error('Failed to fetch recent enquiries:', error);
    }
  };

  // ─── Fetch dashboard statistics ───────────────────────────────────────────────
  const fetchDashboardStats = async () => {
    try {
      const data = await apiClient.get<DashboardStats>('/enquiries/stats');
      setDashboardStats(data ?? null);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // ─── Mark enquiry notification as read ───────────────────────────────────────
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await apiClient.put(`/enquiries/notifications/${notificationId}/read`);
      fetchEnquiryNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // ─── Mark all enquiry notifications as read ───────────────────────────────────
  const markAllNotificationsAsRead = async () => {
    try {
      await apiClient.put('/enquiries/notifications/read-all');
      fetchEnquiryNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // ─── Mark career notification as read ────────────────────────────────────────
  const markCareerNotificationAsRead = async (notificationId: number) => {
    try {
      await apiClient.put(`/career/notifications/${notificationId}/read`);
      fetchCareerNotifications();
    } catch (error) {
      console.error('Failed to mark career notification as read:', error);
    }
  };

  // ─── Mark all career notifications as read ───────────────────────────────────
  const markAllCareerNotificationsAsRead = async () => {
    try {
      await apiClient.put('/career/notifications/read-all');
      fetchCareerNotifications();
    } catch (error) {
      console.error('Failed to mark all career notifications as read:', error);
    }
  };

  // ─── Format date/time ────────────────────────────────────────────────────────
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMins    = Math.floor(diffMs / (1000 * 60));
    const diffHours   = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays    = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffSeconds < 30)  return 'Just now';
    if (diffSeconds < 60)  return `${diffSeconds} seconds ago`;
    if (diffMins === 1)    return '1 min ago';
    if (diffMins < 60)     return `${diffMins} mins ago`;
    if (diffHours === 1)   return '1 hour ago';
    if (diffHours < 24)    return `${diffHours} hours ago`;
    if (diffDays === 1)    return 'Yesterday';
    if (diffDays < 7)      return `${diffDays} days ago`;
    if (diffDays < 14)     return '1 week ago';
    if (diffDays < 30)     return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60)     return '1 month ago';
    if (diffDays < 365)    return `${Math.floor(diffDays / 30)} months ago`;
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  };

  // ─── Notification icon ───────────────────────────────────────────────────────
 const getNotificationIcon = (type: string, isCareer: boolean) => {
  if (isCareer) {
    switch (type) {
      case 'new_application':          return '📋';
      case 'application_status_change':return '🔄';
      default:                         return '💼';
    }
  }
  switch (type) {
    case 'new_enquiry':   return '📥';
    case 'status_change': return '🔄';
    case 'note_added':    return '📝';
    case 'assigned':      return '👤';
    default:              return '📢';
  }
};

// ─── Socket.IO connection ────────────────────────────────────────────────────
useEffect(() => {
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return;
  }

  const socket = io('http://localhost:5000', {
    auth: { token, userId: user.id },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketRef.current = socket;

  socket.on('connect', () => {
    setSocketConnected(true);
  });

  socket.on('disconnect', () => {
    setSocketConnected(false);
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
    setSocketConnected(false);
  });

  // ✅ Only show toast, don't add to state
  socket.on('new_notification', (notification) => {
    toast.success(notification.title);
    // No state update here - fetchAllData() will get it

     fetchEnquiryNotifications();
  fetchCareerNotifications();
  });

  socket.on('unread_count_update', (data) => {
    setUnreadEnquiryCount(data.count);
  });

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (careerFetchTimeoutRef.current) clearTimeout(careerFetchTimeoutRef.current);
    if (enquiryFetchTimeoutRef.current) clearTimeout(enquiryFetchTimeoutRef.current);
  };
}, [user]);
 
// ─── Main init effect ────────────────────────────────────────────────────────
useEffect(() => {
  if (!isAdmin()) {
    navigate('/homes');
  }

  // ✅ ALWAYS fetch on mount, not just when socket disconnected
  fetchEnquiryNotifications();
  fetchRecentEnquiries();
  fetchDashboardStats();
  fetchCareerNotifications();

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
}, [navigate]); // ✅ Remove socketConnected from deps

  // ─── Badge count: derived directly from arrays (always in sync) ──────────────
 const totalUnread = [
  ...enquiryNotifications.filter(n => !n.is_read && !n.career_application_id),
  ...careerNotifications.filter(n => !n.is_read && n.career_application_id),
].length;

  // ─── Breadcrumbs ─────────────────────────────────────────────────────────────
const isDashboard = location.pathname === '/homes/admin';

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(Boolean);
const crumbs = [{ label: 'Dashboard', url: '/homes/admin' }];

    pathnames.forEach((_, index) => {
      const url = '/' + pathnames.slice(0, index + 1).join('/');
      const navItem = navItems.find(item => item.path === url);
      if (navItem && navItem.path !== '/admin') {
        crumbs.push({ label: navItem.label, url: navItem.path });
      }
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Socket status indicator */}
      {/* <div className="fixed bottom-4 right-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-lg ${
          socketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium">
            {socketConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div> */}

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Messages Sidebar Overlay */}
      {showMessagesSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:z-50"
          onClick={() => setShowMessagesSidebar(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-54' : 'w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Logo */}
        <div className={`h-16 border-b border-gray-200 flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
          <div className="flex items-start space-x-3">
            <img src={houslyLogo} alt="Hously" className={`${sidebarOpen ? 'h-13 w-30' : 'h-10 w-auto'}`} />
            {sidebarOpen && <span className="text-lg font-semibold text-gray-900"></span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Collapsed */}
          {!sidebarOpen && (
            <div className="space-y-1">
              {navItems.slice(0, 6).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { setSidebarOpen(true); setMobileSidebarOpen(false); }}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Expanded */}
          {sidebarOpen && (
            <div className="mb-6">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center rounded-lg transition-all duration-200 group px-3 py-2.5
                          ${isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen
        ${sidebarOpen ? 'lg:ml-54' : 'lg:ml-20'}`}>

        {/* Header */}
        <header className="sticky top-0 z-[50] h-16 bg-white text-gray-900 border-b border-gray-200 transition-all duration-300 ease-in-out overflow-visible">
          <div className="px-4 h-full">
            <div className="flex items-center justify-between h-full">

              {/* LEFT */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition"
                >
                  {sidebarOpen
                    ? <Menu className="w-5 h-5 text-black" />
                    : <ChevronRight className="w-5 h-5 text-black" />}
                </button>

                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <Menu className="w-5 h-5 text-gray-800" />
                </button>

                <h1 className="text-lg font-semibold tracking-wide">{pageTitle}</h1>
              </div>

              {/* RIGHT */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
  const baseUrl = window.location.origin;
  window.open(`${baseUrl}/homes`, '_blank');
}}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition text-sm"
                >
                  <ArrowRight size={16} />
                  <span className="hidden md:inline font-medium">Visit Website</span>
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition relative"
                  >
                    <Bell className="w-5 h-5 text-gray-800" />
                    {/* ✅ Badge uses totalUnread derived from arrays — always accurate */}
                    {totalUnread > 0 && !loadingNotifications && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </span>
                    )}
                    {loadingNotifications && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
                      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={async () => {
                              await markAllNotificationsAsRead();
                              await markAllCareerNotificationsAsRead();
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={() => navigate('/admin/enquiries')}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            View all
                          </button>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {enquiryNotifications.length === 0 && careerNotifications.length === 0 ? (
                          <div className="p-4 text-center">
                            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        ) : (
                          <>
                            {/* ✅ Combine + sort + slice */}
                            {[...enquiryNotifications, ...careerNotifications]
                            .filter((notification, index, self) => 
    index === self.findIndex(n => n.id === notification.id)
  )
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .slice(0, 10)
                              .map((notification) => {
const isCareer = notification.career_application_id !== null && 
                 notification.career_application_id !== undefined;                                return (
                                  <div
                                    key={`${isCareer ? 'career' : 'enquiry'}_${notification.id}`}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                                      !notification.is_read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => {
                                      if (isCareer) {
                                        markCareerNotificationAsRead(notification.id);
                                        navigate('/homes/admin/career');
                                      } else {
                                        markNotificationAsRead(notification.id);
                                        navigate('/homes/admin/enquiries');
                                      }
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <div className="text-lg mr-2">
{getNotificationIcon(notification.type, isCareer)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                          {!notification.is_read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></span>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-1.5">
                                          {formatDateTime(notification.created_at)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                            {/* Show "X more" only if combined total > 10 */}
                            {(enquiryNotifications.length + careerNotifications.length) > 10 && (
                              <div className="p-3 text-center border-t border-gray-200">
                                <button
                                  onClick={() => navigate('/admin/enquiries')}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  View {(enquiryNotifications.length + careerNotifications.length) - 10} more notifications
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate('/homes/admin/enquiries')}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Go to Enquiries
                          </button>
                          <button
                            onClick={fetchEnquiryNotifications}
                            className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition"
                          >
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-200 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {user?.full_name
  ? user.full_name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  : user?.username?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold">
                              {user?.full_name?.charAt(0).toUpperCase() ||
                               user?.username?.charAt(0).toUpperCase() ||
                               'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.full_name || user?.username || 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email || 'info@gmail.com'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                              {user?.role || 'User'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {userMenuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => { item.action(); setShowUserMenu(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition
                              ${item.isLogout
                                ? 'text-red-500 hover:bg-red-100'
                                : 'text-gray-800 hover:bg-gray-100'}`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Right Messages Sidebar */}
        <div
          className={`fixed top-0 right-0 z-50 h-screen w-80 bg-white shadow-xl transition-all duration-300 ease-in-out
            ${showMessagesSidebar ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <button
              onClick={() => setShowMessagesSidebar(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-4">
              {['chat', 'notes', 'alerts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMessageTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all capitalize
                    ${activeMessageTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeMessageTab === 'chat' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Chat List</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-gray-500 hover:text-gray-700">Show All</button>
                    <span className="text-gray-400">...</span>
                  </div>
                </div>

                <button className="w-full mb-4 flex items-center justify-center space-x-2 p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Chat</span>
                </button>

                <div className="space-y-4">
                  {['A', 'B', 'G'].map(letter => (
                    <div key={letter}>
                      <div className="text-xs font-semibold text-gray-400 mb-2">{letter}</div>
                      {messages.filter(m => m.name.startsWith(letter)).map((message) => (
                        <div key={message.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-1">
                          <div className="relative mr-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">{message.name.charAt(0)}</span>
                            </div>
                            {message.status === 'online' && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{message.name}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeMessageTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {notes.map((note) => (
                  <div key={note.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{note.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{note.content}</p>
                      </div>
                      {note.pinned && (
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{note.time}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMessageTab === 'alerts' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Alerts</h3>
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                </div>
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    alert.type === 'success' ? 'border-green-200 bg-green-50' :
                    'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start">
                      <div className={`mr-3 p-2 rounded-full ${
                        alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        alert.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{alert.time}</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {isDashboard ? (
            <DashboardAnalytics />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


// export default AdminDashboard;
import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Briefcase, 
  FileText, 
  Settings,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronRight,
  X,
  User,
  LogOut,
  Menu,
  Users as UsersIcon,
  Eye,
  Plus,
  AlertCircle,
  MessageCircle,
  ArrowLeft,
  Mail,
  Clock,
  Phone,
  Download,
  RefreshCw,
  ThumbsUp,
  User2,
  Users,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { logout, getCurrentUser, isAdmin } from '../../services/authService';
import houslyLogo from '../../assets/images/hously-logo.png';
import DashboardAnalytics from '../../components/admin/DashboardAnalytics'; // ✅ ADD THIS IMPORT

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Hously Finntech Realty';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@hously.in';
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+91 9371 00 9381';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@houslytech.com';

// Interfaces
interface EnquiryNotification {
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
  const [user, setUser] = useState(getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeMessageTab, setActiveMessageTab] = useState('chat');
  
  // New state variables for real enquiry notifications
  const [enquiryNotifications, setEnquiryNotifications] = useState<EnquiryNotification[]>([]);
  const [unreadEnquiryCount, setUnreadEnquiryCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
  { 
    path: '/admin', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    section: 'dashboard'
  },
  { 
    path: '/admin/home', 
    icon: Home, 
    label: 'Home Page',
    section: 'home'
  },
  { 
    path: '/admin/services', 
    icon: Briefcase, 
    label: 'Services',
    section: 'services'
  },
  { 
    path: '/admin/blog', 
    icon: FileText, 
    label: 'Blogs',
    section: 'blog'
  },
  { 
    path: '/admin/testimonials', 
    icon: ThumbsUp,
    label: 'Testimonials',
    section: 'testimonials'
  },
  { 
    path: '/admin/enquiries', 
    icon: MessageSquare, 
    label: 'Enquiries',
    section: 'enquiries'
  },
  { 
    path: '/admin/career', 
    icon: Users, 
    label: 'Careers',
    section: 'career'
  },
  { 
    path: '/admin/team', 
    icon: User2,
    label: 'Team Members',
    section: 'team'
  },
  { 
    path: '/admin/settings', 
    icon: Settings, 
    label: 'Settings',
    section: 'settings'
  },
];

  // Messages data - From your image
  const messages = [
    { id: 1, name: 'Archie Parker', message: 'Kalid is online', status: 'online', unread: false },
    { id: 2, name: 'Alfie Mason', message: 'Taherah left 7 mins ago', status: 'offline', unread: false },
    { id: 3, name: 'AharlieKane', message: 'Sami is online', status: 'online', unread: false },
    { id: 4, name: 'Athan Jacoby', message: 'Nargis left 30 mins ago', status: 'offline', unread: false },
    { id: 5, name: 'Bashid Samim', message: 'Rashid left 50 mins ago', status: 'offline', unread: false },
    { id: 6, name: 'Breddie Ronan', message: 'Kalid is online', status: 'online', unread: false },
    { id: 7, name: 'George Carson', message: 'Taherah left 7 mins ago', status: 'offline', unread: false },
  ];

  // Notifications for website admin
  const notifications = [
    { id: 1, title: 'New Contact Form', message: 'You have received a new contact form submission', time: '5 min ago', read: false, type: 'contact' },
    { id: 2, title: 'Blog Comment', message: 'John Doe commented on your blog post', time: '1 hour ago', read: false, type: 'blog' },
    { id: 3, title: 'Job Application', message: 'New job application received for Senior Developer', time: '2 hours ago', read: true, type: 'career' },
    { id: 4, title: 'Service Inquiry', message: 'Service inquiry from Michael Brown', time: '3 hours ago', read: true, type: 'service' },
    { id: 5, title: 'New Subscriber', message: 'New newsletter subscriber added', time: '5 hours ago', read: true, type: 'subscriber' },
  ];

  // Notes data
  const notes = [
    { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline with team', time: 'Yesterday', pinned: true },
    { id: 2, title: 'Content Ideas', content: 'Blog topics for next month', time: '2 days ago', pinned: false },
    { id: 3, title: 'Design Updates', content: 'Update homepage banner design', time: '3 days ago', pinned: false },
  ];

  // Alerts data
  const alerts = [
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance at 2 AM', time: 'Tomorrow', type: 'warning' },
    { id: 2, title: 'Backup Completed', message: 'Daily backup completed successfully', time: 'Today', type: 'success' },
    { id: 3, title: 'Storage Warning', message: 'Storage usage at 85%', time: '2 hours ago', type: 'error' },
  ];

  // User dropdown items
  const userMenuItems = [
    { icon: User, label: 'Profile', action: () => navigate('/admin/profile') },
    { icon: Bell, label: 'Notifications', action: () => setShowNotifications(true) },
    { icon: Settings, label: 'Settings', action: () => navigate('/admin/settings') },
    { icon: LogOut, label: 'Logout', action: handleLogout, isLogout: true },
  ];

  // Fetch enquiry notifications
  const fetchEnquiryNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enquiries/notifications/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiryNotifications(response.data.data);

      // Get unread count
      const unreadResponse = await axios.get(`${API_BASE_URL}/enquiries/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadEnquiryCount(unreadResponse.data.data.count);
    } catch (error) {
      console.error('Failed to fetch enquiry notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch recent enquiries
  const fetchRecentEnquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enquiries/recent?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentEnquiries(response.data.data);
    } catch (error) {
      console.error('Failed to fetch recent enquiries:', error);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enquiries/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/enquiries/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnquiryNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/enquiries/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnquiryNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Handle enquiry status update
  const handleUpdateEnquiryStatus = async (enquiryId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/enquiries/${enquiryId}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRecentEnquiries();
      fetchDashboardStats();
    } catch (error) {
      console.error('Failed to update enquiry status:', error);
    }
  };

  // Format date/time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contacted': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_enquiry': return '📥';
      case 'status_change': return '🔄';
      case 'note_added': return '📝';
      case 'assigned': return '👤';
      default: return '📢';
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }

    // Fetch initial data
    fetchEnquiryNotifications();
    fetchRecentEnquiries();
    fetchDashboardStats();

    // Set up polling for real-time updates
    const notificationInterval = setInterval(fetchEnquiryNotifications, 10000); // Every 10 seconds
    const statsInterval = setInterval(fetchDashboardStats, 30000); // Every 30 seconds

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        // Don't close messages sidebar when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(notificationInterval);
      clearInterval(statsInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Get unread counts
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  // Get current page info
  const isDashboard = location.pathname === '/admin';
  
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Dashboard', url: '/admin' }];

    pathnames.forEach((path, index) => {
      const url = '/' + pathnames.slice(0, index + 1).join('/');
      const navItem = navItems.find(item => item.path === url);

      if (navItem && navItem.path !== '/admin') {
        crumbs.push({
          label: navItem.label,
          url: navItem.path,
        });
      }
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  const handleBackToWebsite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        {/* Logo Section in Sidebar */}
        <div className={`h-16 border-b border-gray-200 flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'}`}>
          <div className="flex items-start space-x-3">
            <img src={houslyLogo} alt="Hously" className={`${sidebarOpen ? 'h-13 w-30' : 'h-10 w-auto'}`} />
            {sidebarOpen && <span className="text-lg font-semibold text-gray-900"></span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Collapsed View - Only Icons */}
          {!sidebarOpen && (
            <div className="space-y-1">
              {navItems.slice(0, 6).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setSidebarOpen(true);
                      setMobileSidebarOpen(false);
                    }}
                    className={`
                      flex items-center justify-center p-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Expanded View */}
          {sidebarOpen && (
            <>
              <div className="mb-6">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                                    (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          onClick={() => {
                            setMobileSidebarOpen(false);
                          }}
                          className={`
                            flex items-center rounded-lg transition-all duration-200 group px-3 py-2.5
                            ${isActive 
                              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                            }
                          `}
                        >
                          <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen
        ${sidebarOpen ? 'lg:ml-54' : 'lg:ml-20'}`}>
        
        {/* Top Navigation Bar - Header */}
        <header
          className={`sticky top-0 z-[60] h-16 bg-white text-gray-900 border-b border-gray-200 transition-all duration-300 ease-in-out overflow-visible
            ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}
        >
          <div className="px-4 h-full">
            <div className="flex items-center justify-between h-full">

              {/* LEFT SIDE */}
              <div className="flex items-center space-x-3">

                {/* Sidebar Toggle Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition"
                >
                  {sidebarOpen ? (
                    <Menu className="w-5 h-5 text-black" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-black" />
                  )}
                </button>

                {/* Mobile Sidebar Toggle */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <Menu className="w-5 h-5 text-gray-800" />
                </button>

                {/* Page Title */}
                <h1 className="text-lg font-semibold tracking-wide">
                  {pageTitle}
                </h1>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center space-x-3">
              <button
  onClick={() => {
    const baseUrl = window.location.origin;
    // Open home page WITHOUT welcome parameter to skip welcome page
    window.open(`${baseUrl}/`, '_blank');
  }}
  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition text-sm"
>
  <ArrowRight size={16} />
  <span className="hidden md:inline font-medium">Visit Website</span>
</button>

                {/* Notifications with Real-time Enquiry Updates */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition relative"
                  >
                    <Bell className="w-5 h-5 text-gray-800" />
                    {unreadEnquiryCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadEnquiryCount}
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
                            onClick={markAllNotificationsAsRead}
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
                        {enquiryNotifications.length === 0 ? (
                          <div className="p-4 text-center">
                            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        ) : (
                          <>
                            {enquiryNotifications.slice(0, 10).map((notification) => (
                              <div 
                                key={notification.id} 
                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                                  !notification.is_read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => {
                                  markNotificationAsRead(notification.id);
                                  navigate(`/admin/enquiries`);
                                }}
                              >
                                <div className="flex items-start">
                                  <div className="text-lg mr-2">
                                    {getNotificationIcon(notification.type)}
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
                            ))}
                            
                            {enquiryNotifications.length > 10 && (
                              <div className="p-3 text-center border-t border-gray-200">
                                <button
                                  onClick={() => navigate('/admin/enquiries')}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  View {enquiryNotifications.length - 10} more notifications
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
                            onClick={() => navigate('/admin/enquiries')}
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
                        {user?.full_name?.charAt(0).toUpperCase() || 
                         user?.username?.charAt(0).toUpperCase() || 
                         'A'}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown */}
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
                            onClick={() => {
                              item.action();
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition
                              ${
                                item.isLogout
                                  ? 'text-red-500 hover:bg-red-100'
                                  : 'text-gray-800 hover:bg-gray-100'
                              }`}
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
          {/* Sidebar Header */}
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
              <button
                onClick={() => setActiveMessageTab('chat')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all
                  ${activeMessageTab === 'chat' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveMessageTab('notes')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all
                  ${activeMessageTab === 'notes' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveMessageTab('alerts')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all
                  ${activeMessageTab === 'alerts' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Alerts
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeMessageTab === 'chat' && (
              <>
                {/* Chat List Header */}
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

                {/* Add Chat Button */}
                <button className="w-full mb-4 flex items-center justify-center space-x-2 p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Chat</span>
                </button>

                {/* Chat Contacts - Grouped by Alphabet */}
                <div className="space-y-4">
                  {/* A Section */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-2">A</div>
                    {messages.filter(m => m.name.startsWith('A')).map((message) => (
                      <div key={message.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-1">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {message.name.charAt(0)}
                            </span>
                          </div>
                          {message.status === 'online' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{message.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* B Section */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-2">B</div>
                    {messages.filter(m => m.name.startsWith('B')).map((message) => (
                      <div key={message.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-1">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {message.name.charAt(0)}
                            </span>
                          </div>
                          {message.status === 'online' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{message.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* G Section */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-2">G</div>
                    {messages.filter(m => m.name.startsWith('G')).map((message) => (
                      <div key={message.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-1">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {message.name.charAt(0)}
                            </span>
                          </div>
                          {message.status === 'online' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{message.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
        <main className="p-4  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {isDashboard ? (
            <DashboardAnalytics /> // ✅ REPLACED OLD DASHBOARD WITH NEW ANALYTICS
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
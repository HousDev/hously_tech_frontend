import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, TrendingUp, Activity, 
  BarChart3, LineChart, FileText, 
  Eye, UserPlus, Briefcase, 
  Calendar, Clock, Mail, Target,
  RefreshCw  // Added import
} from 'lucide-react';
import {
  BarChart as RechartsBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  BarChart
} from 'recharts';
import axios from 'axios';
import OnlineReportImage from '../../../src/assets/images/Online report-rafiki.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Type definitions
interface DashboardStats {
  totalVisitors: number;
  todayVisitors: number;
  activeSessions: number;
  todayEnquiries: number;
  bounceRate: number;
  avgSessionDuration: number;
  growth: number;
  totalEnquiries: number;
  totalJobApplications: number;
  pendingApplications: number;
  scheduledMeetings: number;
  conversionRate: number;
}

interface JobApplication {
  id: string | number;
  applicant_name: string;
  job_title: string;
  applied_at: string;
  status: string;
  email: string;
  phone?: string;
}

interface Enquiry {
  id: string | number;
  full_name: string;
  inquiry_type: string;
  created_at: string;
  status: string;
  email: string;
  phone_number?: string;
  message?: string;
}

interface ChartDataItem {
  date: string;
  visitors?: number;
  enquiries?: number;
  applications?: number;
  conversions?: number;
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  path: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface RecentActivity {
  id: string | number;
  type: 'enquiry' | 'application' | 'meeting' | 'note';
  title: string;
  description: string;
  time: string;
  user: string;
  status: string;
}

// Add Quote interface
interface Quote {
  text: string;
  author: string;
  category?: string;
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7days');
  const [activeChart, setActiveChart] = useState('traffic');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dynamic data states
  const [user, setUser] = useState({ name: '', initial: '' });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalVisitors: 108658,
    todayVisitors: 2847,
    activeSessions: 142,
    todayEnquiries: 0,
    bounceRate: 42.3,
    avgSessionDuration: 245,
    growth: 12.5,
    totalEnquiries: 0,
    totalJobApplications: 0,
    pendingApplications: 0,
    scheduledMeetings: 0,
    conversionRate: 24.8
  });
  
  const [recentJobApplications, setRecentJobApplications] = useState<JobApplication[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [trafficData, setTrafficData] = useState<ChartDataItem[]>([]);
  const [performanceData, setPerformanceData] = useState<ChartDataItem[]>([]);

  // Quote states
  const [quote, setQuote] = useState<Quote>({
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation"
  });
  const [lastQuoteUpdate, setLastQuoteUpdate] = useState<Date>(new Date());

  // Motivational quotes array
  const motivationalQuotes: Quote[] = [
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
      category: "motivation"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "action"
    },
    {
      text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      author: "Roy T. Bennett",
      category: "courage"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "belief"
    },
    {
      text: "Opportunities don't happen. You create them.",
      author: "Chris Grosser",
      category: "opportunity"
    },
    {
      text: "The harder I work, the more luck I seem to have.",
      author: "Thomas Jefferson",
      category: "work"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      category: "persistence"
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
      category: "future"
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
      category: "perseverance"
    },
    {
      text: "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
      category: "doubt"
    }
  ];

  // Function to update quote
  const updateQuote = () => {
    // Get random quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const newQuote = motivationalQuotes[randomIndex];
    
    setQuote(newQuote);
    setLastQuoteUpdate(new Date());
    
    // Store in localStorage to persist across refreshes
    localStorage.setItem('lastQuote', JSON.stringify({
      quote: newQuote,
      timestamp: new Date().toISOString()
    }));
  };

  // Initialize on component mount
  useEffect(() => {
    setGreeting(getGreeting());
    fetchCurrentUser();
    fetchDashboardStats();
    fetchRecentJobApplications();
    fetchRecentEnquiries();
    fetchRecentActivities();
    fetchChartData();
    
    // Load saved quote from localStorage
    const savedQuote = localStorage.getItem('lastQuote');
    if (savedQuote) {
      try {
        const { quote, timestamp } = JSON.parse(savedQuote);
        const lastUpdate = new Date(timestamp);
        const now = new Date();
        const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
        
        // If last update was more than 10 minutes ago, get new quote
        if (diffMinutes >= 10) {
          updateQuote();
        } else {
          setQuote(quote);
          setLastQuoteUpdate(lastUpdate);
        }
      } catch (error) {
        updateQuote(); // If error, get new quote
      }
    } else {
      updateQuote(); // First time, get initial quote
    }
  }, []);

  // Set up interval to update quote every 10 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateQuote();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  // Function to get greeting based on time
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Fetch current user
  const fetchCurrentUser = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const firstName = userData.full_name?.split(' ')[0] || userData.username || 'Admin';
      setUser({
        name: firstName,
        initial: firstName.charAt(0).toUpperCase()
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser({ name: 'Admin', initial: 'A' });
    }
  };

  // Fetch dashboard statistics - UPDATED
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Fetch total enquiries
      const enquiriesRes = await axios.get(`${API_BASE_URL}/enquiries/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { data: { total: 0, today: 0 } } }));

      // Fetch total job applications
      const applicationsRes = await axios.get(`${API_BASE_URL}/career/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { data: { total: 0, pending: 0 } } }));

      console.log('Enquiries Stats:', enquiriesRes.data);
      console.log('Applications Stats:', applicationsRes.data);

      setDashboardStats(prev => ({
        ...prev,
        totalEnquiries: enquiriesRes.data?.data?.total || enquiriesRes.data?.total || 0,
        todayEnquiries: enquiriesRes.data?.data?.today || enquiriesRes.data?.today || 0,
        totalJobApplications: applicationsRes.data?.data?.total || applicationsRes.data?.total || 0,
        pendingApplications: applicationsRes.data?.data?.pending || applicationsRes.data?.pending || 0
      }));

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent job applications (1-2 entries) - UPDATED
  const fetchRecentJobApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/career/applications?limit=2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentJobApplications(response.data.data?.applications || response.data.applications || []);
    } catch (error) {
      console.error('Error fetching recent job applications:', error);
      setRecentJobApplications([]);
    }
  };

  // Fetch recent enquiries (1-2 entries) - UPDATED
  const fetchRecentEnquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enquiries?limit=2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentEnquiries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent enquiries:', error);
      setRecentEnquiries([]);
    }
  };

  // Fetch chart data - UPDATED
  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch trend data for charts
      const trendRes = await axios.get(`${API_BASE_URL}/enquiries/trend?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { data: [] } }));

      if (trendRes.data.data && trendRes.data.data.length > 0) {
        const formattedData = trendRes.data.data.map((item: any) => ({
          date: item.period || item.date || item.week,
          enquiries: item.new || 0,
          contacted: item.contacted || 0,
          closed: item.closed || 0
        }));
        setTrafficData(formattedData);
      }

      // Generate performance data (you might want to fetch this from backend too)
      const performance = [
        { date: 'Mon', conversions: 65, enquiries: 120 },
        { date: 'Tue', conversions: 78, enquiries: 145 },
        { date: 'Wed', conversions: 82, enquiries: 160 },
        { date: 'Thu', conversions: 72, enquiries: 138 },
        { date: 'Fri', conversions: 88, enquiries: 175 },
        { date: 'Sat', conversions: 45, enquiries: 95 },
        { date: 'Sun', conversions: 52, enquiries: 110 },
      ];
      setPerformanceData(performance);

    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      // Combine enquiries and applications for activity feed
      const activities: RecentActivity[] = [];
      
      // Add enquiries as activities
      recentEnquiries.slice(0, 2).forEach((enquiry) => {
        activities.push({
          id: enquiry.id,
          type: 'enquiry',
          title: 'New Enquiry Received',
          description: `${enquiry.inquiry_type} from ${enquiry.full_name}`,
          time: formatTimeAgo(enquiry.created_at),
          user: enquiry.full_name,
          status: enquiry.status
        });
      });

      // Add job applications as activities
      recentJobApplications.slice(0, 2).forEach((app) => {
        activities.push({
          id: app.id,
          type: 'application',
          title: 'Job Application Submitted',
          description: `Application for ${app.job_title || 'position'}`,
          time: formatTimeAgo(app.applied_at),
          user: app.applicant_name,
          status: app.status
        });
      });

      setRecentActivities(activities.slice(0, 3)); // Limit to 3 activities
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  // Update activities when enquiries or applications change
  useEffect(() => {
    if (recentEnquiries.length > 0 || recentJobApplications.length > 0) {
      fetchRecentActivities();
    }
  }, [recentEnquiries, recentJobApplications]);

  // Update chart data when time range changes
  useEffect(() => {
    if (timeRange) {
      fetchChartData();
    }
  }, [timeRange]);

  // Helper functions
  const formatNumber = (num: number): string => num?.toLocaleString() || '0';
  
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-green-100 text-green-800 border-green-200',
      reviewed: 'bg-purple-100 text-purple-800 border-purple-200',
      shortlisted: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      scheduled: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
      converted: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const quickActions: QuickAction[] = [
    { label: 'View Enquiries', icon: MessageSquare, path: '/admin/enquiries', color: 'blue' },
    { label: 'View Applications', icon: UserPlus, path: '/admin/career', color: 'green' },
    { label: 'Schedule Meeting', icon: Calendar, path: '/admin/schedule', color: 'purple' },
    { label: 'Analytics Report', icon: BarChart3, path: '/admin/analytics', color: 'orange' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enquiry': return <MessageSquare className="w-4 h-4" />;
      case 'application': return <UserPlus className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Greeting Section */}
{/* Greeting Section */}
<div className="mb-6 relative overflow-hidden rounded-2xl px-6 py-5 backdrop-blur-md bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl"> 
  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> 
  
  {/* Decorative elements */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
   
  <div className="relative z-10"> 
    <div className="flex items-center justify-between gap-4"> 
      <div className="flex items-center gap-4 flex-1"> 
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg"> 
          <span className="text-2xl font-bold text-white">{user.initial}</span> 
        </div> 
        <div className="flex-1"> 
          <h1 className="text-2xl font-bold leading-tight text-white mb-0.5"> 
            {greeting}, {user.name}! 
          </h1> 
          <p className="text-white/80 text-sm">Welcome back to your dashboard</p> 
        </div> 
      </div> 
 
      {/* Illustration image - compact and attractive */} 
      <div className="hidden lg:flex flex-shrink-0"> 
        <div className="relative">
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl"></div>
          <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"> 
            <img  
              src={OnlineReportImage}  
              className="w-full h-full object-cover scale-110" 
              alt="Online Report" 
            /> 
          </div> 
        </div> 
      </div> 
    </div> 
     
    {/* Minimal Quote Section */} 
    <div className="flex items-start gap-3 mt-4 pt-3 border-t border-white/20"> 
      <div className="pt-0.5 flex-shrink-0"> 
        <svg className="w-4 h-4 text-yellow-300/90" fill="currentColor" viewBox="0 0 24 24"> 
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /> 
        </svg> 
      </div> 
      <div className="flex-1"> 
        <p className="text-white/90 text-sm italic font-light leading-relaxed"> 
          "{quote.text}" 
        </p> 
      </div> 
    </div> 
  </div> 
</div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Total Visitors Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">+{dashboardStats.growth}%</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(dashboardStats.totalVisitors)}</h3>
                  <p className="text-xs text-gray-500 font-medium">Total Visitors</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Today</span>
                    <span className="font-bold text-gray-700">{formatNumber(dashboardStats.todayVisitors)}</span>
                  </div>
                </div>
              </div>

              {/* Total Enquiries Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(dashboardStats.totalEnquiries)}</h3>
                  <p className="text-xs text-gray-500 font-medium">Total Enquiries</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Today</span>
                    <span className="font-bold text-gray-700">{formatNumber(dashboardStats.todayEnquiries)}</span>
                  </div>
                </div>
              </div>

              {/* Job Applications Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(dashboardStats.totalJobApplications)}</h3>
                  <p className="text-xs text-gray-500 font-medium">Job Applications</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Pending</span>
                    <span className="font-bold text-gray-700">{formatNumber(dashboardStats.pendingApplications)}</span>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.conversionRate}%</h3>
                  <p className="text-xs text-gray-500 font-medium">Conversion Rate</p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Active Sessions</span>
                    <span className="font-bold text-gray-700">{formatNumber(dashboardStats.activeSessions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
  
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChart('traffic')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        activeChart === 'traffic' 
                          ? 'bg-blue-100 text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Traffic</span>
                    </button>
                    <button
                      onClick={() => setActiveChart('enquiries')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        activeChart === 'enquiries' 
                          ? 'bg-blue-100 text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Enquiries</span>
                    </button>
                    <button
                      onClick={() => setActiveChart('performance')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        activeChart === 'performance' 
                          ? 'bg-blue-100 text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Performance</span>
                    </button>
                  </div>
                  
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-gray-700"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>

                <div className="h-48">
                  {activeChart === 'traffic' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { date: 'Jan 10', visitors: 1200, bounce: 42.5 },
                        { date: 'Jan 11', visitors: 1500, bounce: 38.2 },
                        { date: 'Jan 12', visitors: 1100, bounce: 45.8 },
                        { date: 'Jan 13', visitors: 1800, bounce: 35.4 },
                        { date: 'Jan 14', visitors: 2200, bounce: 32.1 },
                        { date: 'Jan 15', visitors: 1950, bounce: 36.7 },
                        { date: 'Jan 16', visitors: 2100, bounce: 33.9 },
                      ]}>
                        <defs>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBounce" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value/1000}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'visitors') return [`${value.toLocaleString()} visitors`, 'Visitors'];
                            if (name === 'bounce') return [`${value}%`, 'Bounce Rate'];
                            return [value, name];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="visitors"
                          stroke="#6366f1"
                          fill="url(#colorVisitors)"
                          strokeWidth={2}
                          name="Visitors"
                        />
                        <Area
                          type="monotone"
                          dataKey="bounce"
                          stroke="#10b981"
                          fill="url(#colorBounce)"
                          strokeWidth={2}
                          name="Bounce Rate"
                          yAxisId={1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {activeChart === 'enquiries' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { date: 'Jan 10', enquiries: 15, responded: 8 },
                        { date: 'Jan 11', enquiries: 20, responded: 12 },
                        { date: 'Jan 12', enquiries: 12, responded: 6 },
                        { date: 'Jan 13', enquiries: 25, responded: 15 },
                        { date: 'Jan 14', enquiries: 30, responded: 18 },
                        { date: 'Jan 15', enquiries: 22, responded: 14 },
                        { date: 'Jan 16', enquiries: 28, responded: 16 },
                      ]}>
                        <defs>
                          <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorResponded" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'enquiries') return [`${value} enquiries`, 'Total Enquiries'];
                            if (name === 'responded') return [`${value} responded`, 'Responded'];
                            return [value, name];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="enquiries"
                          stroke="#8b5cf6"
                          fill="url(#colorEnquiries)"
                          strokeWidth={2}
                          name="Total Enquiries"
                        />
                        <Area
                          type="monotone"
                          dataKey="responded"
                          stroke="#06b6d4"
                          fill="url(#colorResponded)"
                          strokeWidth={2}
                          name="Responded"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {activeChart === 'performance' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { day: 'Mon', conversions: 65, enquiries: 120, applications: 8 },
                        { day: 'Tue', conversions: 78, enquiries: 145, applications: 12 },
                        { day: 'Wed', conversions: 82, enquiries: 160, applications: 15 },
                        { day: 'Thu', conversions: 72, enquiries: 138, applications: 10 },
                        { day: 'Fri', conversions: 88, enquiries: 175, applications: 18 },
                        { day: 'Sat', conversions: 45, enquiries: 95, applications: 6 },
                        { day: 'Sun', conversions: 52, enquiries: 110, applications: 7 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'conversions') return [`${value} conversions`, 'Conversions'];
                            if (name === 'enquiries') return [`${value} enquiries`, 'Enquiries'];
                            if (name === 'applications') return [`${value} applications`, 'Applications'];
                            return [value, name];
                          }}
                        />
                        <Bar 
                          dataKey="enquiries" 
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                          name="Enquiries"
                        />
                        <Bar 
                          dataKey="applications" 
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          name="Applications"
                        />
                        <Bar 
                          dataKey="conversions" 
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                          name="Conversions"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/admin/enquiries'}
                    className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-blue-50 hover:bg-blue-100"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-700">View Enquiries</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/career'}
                    className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-green-50 hover:bg-green-100"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                      <UserPlus className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700">View Applications</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/schedule'}
                    className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-purple-50 hover:bg-purple-100"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-purple-700">Schedule Meeting</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/analytics'}
                    className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-orange-50 hover:bg-orange-100"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100">
                      <BarChart3 className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-orange-700">Analytics Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Data Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              
              {/* Recent Job Applications Table */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Job Applications</h3>
                    <p className="text-sm text-gray-500">Latest applications</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/career'}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View All
                  </button>
                </div>

                {recentJobApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Applied</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentJobApplications.map((application) => (
                          <tr 
                            key={application.id} 
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {application.applicant_name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 block">{application.applicant_name}</span>
                                  <span className="text-xs text-gray-500 block">{application.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-sm text-gray-600">{application.job_title || 'N/A'}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-sm text-gray-600">
                                {formatDate(application.applied_at)}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.location.href = `/admin/career?application=${application.id}`}
                                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {application.email && (
                                  <a
                                    href={`mailto:${application.email}`}
                                    className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent job applications</p>
                  </div>
                )}
              </div>

              {/* Recent Enquiries Table */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Enquiries</h3>
                    <p className="text-sm text-gray-500">Latest enquiries</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/enquiries'}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View All
                  </button>
                </div>

                {recentEnquiries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Received</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEnquiries.map((enquiry) => (
                          <tr 
                            key={enquiry.id} 
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {enquiry.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 block">{enquiry.full_name}</span>
                                  <span className="text-xs text-gray-500 block">{enquiry.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-sm text-gray-600">{enquiry.inquiry_type}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-sm text-gray-600">
                                {formatTimeAgo(enquiry.created_at)}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(enquiry.status)}`}>
                                {enquiry.status?.charAt(0).toUpperCase() + enquiry.status?.slice(1) || 'New'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => window.location.href = `/admin/enquiries?id=${enquiry.id}`}
                                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {enquiry.email && (
                                  <a
                                    href={`mailto:${enquiry.email}`}
                                    className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent enquiries</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => window.location.href = '/admin/activity'}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {recentActivities.length > 0 ? recentActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'enquiry' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'application' ? 'bg-green-100 text-green-600' :
                        activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                      <div className="text-xs text-gray-500">{activity.user}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, TrendingUp, Activity,
  BarChart3,
  Eye, UserPlus,
  Calendar, Mail, Target
} from 'lucide-react';
import {
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
  contacted?: number;
  closed?: number;
  applications?: number;
  conversions?: number;
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

// Custom Pie Chart Renderer with Legend list for MNC level look
const renderPieChartWithLegend = (data: { name: string, value: number, color: string }[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full h-full font-sans">
      {/* Pie Chart container */}
      <div className="w-full sm:w-1/2 h-48 relative flex items-center justify-center flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ name: string; value: number; color?: string }> }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg shadow-xl text-white text-xs z-50">
                      <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#3b82f6' }}></span>
                        {entry.name}
                      </p>
                      <p className="text-slate-300">
                        Value: <span className="font-bold text-white">{entry.value.toLocaleString()}</span> ({percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text (Total count) */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
          <span className="text-lg font-black text-slate-700 tracking-tight leading-none mt-0.5">{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full sm:w-1/2 flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {data.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          return (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/30 backdrop-blur-sm border border-slate-200/20 hover:bg-white/50 transition-all shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-[11px] font-semibold text-slate-600 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 text-right flex-shrink-0">
                <span className="text-[11px] font-extrabold text-slate-700">{item.value.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-slate-400 bg-white/80 border border-slate-200/50 px-1 rounded shadow-sm min-w-[38px] text-center">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DashboardAnalyticsProps {
  setHeaderTitle?: (title: string) => void;
  setHeaderSubtitle?: (subtitle: string) => void;
}

export default function Dashboard({ }: DashboardAnalyticsProps = {}) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [timeRange] = useState('7days');
  const [activeChart, setActiveChart] = useState('traffic');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic data states
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

  // Real-time backend detailed stats for Pie Charts
  const [enquiryStatusStats, setEnquiryStatusStats] = useState({
    new: 0,
    in_progress: 0,
    contacted: 0,
    closed: 0,
    converted: 0
  });

  const [applicationStatusStats, setApplicationStatusStats] = useState({
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  // Initialize on component mount
  useEffect(() => {
    setGreeting(getGreeting());
    fetchDashboardStats();
    fetchRecentJobApplications();
    fetchRecentEnquiries();
    fetchRecentActivities();
    fetchChartData();
  }, []);

  // Function to get greeting based on time
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
      }).catch(() => ({ data: { data: {} } }));

      // Fetch total job applications
      const applicationsRes = await axios.get(`${API_BASE_URL}/career/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ data: { data: {} } }));

      const enqData = enquiriesRes.data?.data || {};
      const appData = applicationsRes.data?.data || {};

      setEnquiryStatusStats({
        new: enqData.new || 0,
        in_progress: enqData.in_progress || 0,
        contacted: enqData.contacted || 0,
        closed: enqData.closed || 0,
        converted: enqData.converted || 0
      });

      setApplicationStatusStats({
        pending: appData.pending || 0,
        reviewed: appData.reviewed || 0,
        shortlisted: appData.shortlisted || 0,
        rejected: appData.rejected || 0,
        hired: appData.hired || 0
      });

      setDashboardStats(prev => ({
        ...prev,
        totalEnquiries: enqData.total || 0,
        todayEnquiries: enqData.today || 0,
        totalJobApplications: appData.total || 0,
        pendingApplications: appData.pending || 0
      }));

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent job applications (5 entries) - UPDATED
  const fetchRecentJobApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/career/applications?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentJobApplications(response.data.data?.applications || response.data.applications || []);
    } catch (error) {
      console.error('Error fetching recent job applications:', error);
      setRecentJobApplications([]);
    }
  };

  // Fetch recent enquiries (5 entries) - UPDATED
  const fetchRecentEnquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/enquiries?limit=5`, {
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
          enquiries: item.enquiries !== undefined ? item.enquiries : (item.new || 0),
          contacted: item.contacted || 0,
          closed: item.closed || 0
        }));
        setTrafficData(formattedData);
      } else {
        setTrafficData([]);
      }

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


  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enquiry': return <MessageSquare className="w-4 h-4" />;
      case 'application': return <UserPlus className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const trafficPieData = [
    { name: 'Organic Search', value: Math.round(dashboardStats.totalVisitors * 0.45) || 450, color: '#6366f1' },
    { name: 'Direct Traffic', value: Math.round(dashboardStats.totalVisitors * 0.25) || 250, color: '#3b82f6' },
    { name: 'Referral Web', value: Math.round(dashboardStats.totalVisitors * 0.18) || 180, color: '#0d9488' },
    { name: 'Social Media', value: Math.round(dashboardStats.totalVisitors * 0.12) || 120, color: '#ec4899' },
  ];

  const totalEnquiriesFromStatus = enquiryStatusStats.new + enquiryStatusStats.in_progress + enquiryStatusStats.contacted + enquiryStatusStats.closed + enquiryStatusStats.converted;
  const enquiriesPieData = totalEnquiriesFromStatus > 0 ? [
    { name: 'New Enquiries', value: enquiryStatusStats.new, color: '#3b82f6' },
    { name: 'In Progress / Contacted', value: enquiryStatusStats.in_progress + enquiryStatusStats.contacted, color: '#8b5cf6' },
    { name: 'Closed / Converted', value: enquiryStatusStats.closed + enquiryStatusStats.converted, color: '#10b981' }
  ] : [
    { name: 'New Enquiries', value: 5, color: '#3b82f6' },
    { name: 'In Progress / Contacted', value: 3, color: '#8b5cf6' },
    { name: 'Closed / Converted', value: 2, color: '#10b981' }
  ];

  const totalAppsFromStatus = applicationStatusStats.pending + applicationStatusStats.reviewed + applicationStatusStats.shortlisted + applicationStatusStats.hired + applicationStatusStats.rejected;
  const performancePieData = totalAppsFromStatus > 0 ? [
    { name: 'Pending Review', value: applicationStatusStats.pending, color: '#f59e0b' },
    { name: 'Reviewed / Shortlist', value: applicationStatusStats.reviewed + applicationStatusStats.shortlisted, color: '#06b6d4' },
    { name: 'Hired Candidates', value: applicationStatusStats.hired, color: '#10b981' },
    { name: 'Rejected', value: applicationStatusStats.rejected, color: '#f43f5e' }
  ] : [
    { name: 'Pending Review', value: 4, color: '#f59e0b' },
    { name: 'Reviewed / Shortlist', value: 3, color: '#06b6d4' },
    { name: 'Hired Candidates', value: 2, color: '#10b981' },
    { name: 'Rejected', value: 1, color: '#f43f5e' }
  ];

  return (
    <div className="w-full px-6">

      {/* Greeting Header */}
      <div className="flex items-center justify-between mb-8 mt-8">
        <div className="flex flex-col select-none">
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight leading-tight">
            <span className="text-black">
              {greeting},
            </span>{" "}
            <span className="text-[#0f50ab]">
              {authUser?.full_name || authUser?.username || "System Administrator"}!
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wide leading-none mt-0.5">
            Here's what's happening today.
          </p>
        </div>

        {/* Compact Calendar Date Row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/40 backdrop-blur-md border border-slate-200/40 px-3 py-1.5 rounded-full shadow-sm w-fit font-medium select-none">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Metric Cards - Compressed & High Density & Glassmorphic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Total Visitors Card */}
            <div className="bg-blue-50/50 backdrop-blur-md rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/40 flex flex-col justify-between h-28 hover:bg-blue-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Visitors</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>+{dashboardStats.growth}%</span>
                </div>
              </div>
              <div className="my-1">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{formatNumber(dashboardStats.totalVisitors)}</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-slate-100/10">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Today: <strong className="text-slate-600 font-semibold">{formatNumber(dashboardStats.todayVisitors)}</strong></span>
              </div>
            </div>

            {/* Total Enquiries Card */}
            <div className="bg-indigo-50/50 backdrop-blur-md rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100/40 flex flex-col justify-between h-28 hover:bg-indigo-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </div>
              <div className="my-1">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{formatNumber(dashboardStats.totalEnquiries)}</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-slate-100/10">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Today: <strong className="text-slate-600 font-semibold">{formatNumber(dashboardStats.todayEnquiries)}</strong></span>
              </div>
            </div>

            {/* Job Applications Card */}
            <div className="bg-pink-50/50 backdrop-blur-md rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100/40 flex flex-col justify-between h-28 hover:bg-pink-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Applications</span>
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              </div>
              <div className="my-1">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{formatNumber(dashboardStats.totalJobApplications)}</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-slate-100/10">
                <UserPlus className="w-3.5 h-3.5 text-pink-500" />
                <span>Pending: <strong className="text-slate-600 font-semibold">{formatNumber(dashboardStats.pendingApplications)}</strong></span>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-emerald-50/50 backdrop-blur-md rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-300 border border-emerald-100/40 flex flex-col justify-between h-28 hover:bg-emerald-50/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600">
                  <span>Active</span>
                </div>
              </div>
              <div className="my-1">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{dashboardStats.conversionRate}%</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-slate-100/10">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sessions: <strong className="text-slate-600 font-semibold">{formatNumber(dashboardStats.activeSessions)}</strong></span>
              </div>
            </div>
          </div>

          {/* Charts Section - MNC Level Glassmorphic Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Main Chart Card */}
            <div className="lg:col-span-2 bg-white/40 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-200/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Pill Toggle Controls */}
                <div className="bg-slate-100/80 p-0.5 rounded-lg flex items-center w-fit border border-slate-200/40">
                  <button
                    onClick={() => setActiveChart('traffic')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${activeChart === 'traffic'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span>Traffic Breakdown</span>
                  </button>
                  <button
                    onClick={() => setActiveChart('enquiries')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${activeChart === 'enquiries'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Enquiries Status</span>
                  </button>
                  <button
                    onClick={() => setActiveChart('performance')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-semibold ${activeChart === 'performance'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Applications Status</span>
                  </button>
                </div>
              </div>

              <div className="h-56 flex items-center justify-center">
                {activeChart === 'traffic' && renderPieChartWithLegend(trafficPieData)}
                {activeChart === 'enquiries' && renderPieChartWithLegend(enquiriesPieData)}
                {activeChart === 'performance' && renderPieChartWithLegend(performancePieData)}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-sm border border-slate-200/40">
              <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard/enquiries')}
                  className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-blue-50/50 hover:bg-blue-100/50 border border-blue-100/20"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">View Enquiries</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/career?tab=applications')}
                  className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-green-50/50 hover:bg-green-100/50 border border-green-100/20"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                    <UserPlus className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-700">View Applications</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/meetings')}
                  className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-purple-50/50 hover:bg-purple-100/50 border border-purple-100/20"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">Schedule Meeting</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:shadow-sm bg-orange-50/50 hover:bg-orange-100/50 border border-orange-100/20"
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

            {/* Recent Job Applications Table Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-sm border border-slate-200/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Job Applications</h3>
                  <p className="text-sm text-gray-500">Latest applications</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/career?tab=applications')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              {recentJobApplications.length > 0 ? (
                <div className="space-y-2">
                  {recentJobApplications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200/10 hover:bg-white/30 transition shadow-sm bg-white/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#0D47A1] to-[#6daeee] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {application.applicant_name?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">{application.applicant_name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{application.job_title || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                          {formatDate(application.applied_at).split(',')[0]}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(application.status)}`}>
                          {application.status || 'Pending'}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => navigate(`/dashboard/career?tab=applications&application=${application.id}`)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {application.email && (
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${application.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50/50 rounded cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No recent job applications</p>
                </div>
              )}
            </div>

            {/* Recent Enquiries Table Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-sm border border-slate-200/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Enquiries</h3>
                  <p className="text-sm text-gray-500">Latest enquiries</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/enquiries')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              {recentEnquiries.length > 0 ? (
                <div className="space-y-2">
                  {recentEnquiries.slice(0, 5).map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200/10 hover:bg-white/30 transition shadow-sm bg-white/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#0D47A1] to-[#63a3e3] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {enquiry.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 block truncate">{enquiry.full_name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{enquiry.inquiry_type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                          {formatTimeAgo(enquiry.created_at)}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status || 'New'}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => navigate(`/dashboard/enquiries?id=${enquiry.id}`)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {enquiry.email && (
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${enquiry.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50/50 rounded cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No recent enquiries</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section Card */}
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-sm border border-slate-200/40 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button
                onClick={() => navigate('/dashboard/activity')}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.length > 0 ? recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200/10 hover:bg-white/30 transition shadow-sm bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === 'enquiry' ? 'bg-blue-100 text-blue-600' :
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
                    <span className="text-xs text-slate-400">{activity.time}</span>
                    <div className="text-xs text-slate-500 font-semibold">{activity.user}</div>
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
  );
}





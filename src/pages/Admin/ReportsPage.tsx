import { BarChart2, TrendingUp, TrendingDown, Users, MessageSquare, Briefcase, Calendar, FileText, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', enquiries: 42, meetings: 18, careers: 8 },
  { month: 'Feb', enquiries: 58, meetings: 24, careers: 12 },
  { month: 'Mar', enquiries: 35, meetings: 15, careers: 6 },
  { month: 'Apr', enquiries: 72, meetings: 30, careers: 15 },
  { month: 'May', enquiries: 63, meetings: 27, careers: 10 },
  { month: 'Jun', enquiries: 89, meetings: 38, careers: 18 },
  { month: 'Jul', enquiries: 76, meetings: 32, careers: 14 },
];

const trafficData = [
  { month: 'Jan', visitors: 1200 },
  { month: 'Feb', visitors: 1850 },
  { month: 'Mar', visitors: 1400 },
  { month: 'Apr', visitors: 2200 },
  { month: 'May', visitors: 1900 },
  { month: 'Jun', visitors: 2800 },
  { month: 'Jul', visitors: 2400 },
];

const pieData = [
  { name: 'IT Solutions', value: 38 },
  { name: 'Cloud Services', value: 27 },
  { name: 'Consulting', value: 20 },
  { name: 'Support', value: 15 },
];
const PIE_COLORS = ['#0D47A1', '#1976D2', '#42A5F5', '#90CAF9'];

const stats = [
  { label: 'Total Enquiries', value: '435', change: '+12.5%', up: true, icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: 'Meetings Held', value: '184', change: '+8.2%', up: true, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Applications', value: '83', change: '-3.1%', up: false, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Blog Posts', value: '47', change: '+5.7%', up: true, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Team Members', value: '24', change: '+2', up: true, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Conversions', value: '68%', change: '+4.3%', up: true, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Reports</h1>
            <p className="text-sm text-slate-500">Overview of all platform activity and metrics</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px #0001', fontSize: 12 }} />
              <Bar dataKey="enquiries" name="Enquiries" fill="#0D47A1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meetings" name="Meetings" fill="#42A5F5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="careers" name="Applications" fill="#90CAF9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Enquiry by Service</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs text-slate-600">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Website Visitors (2025)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px #0001', fontSize: 12 }} />
            <Line type="monotone" dataKey="visitors" stroke="#0D47A1" strokeWidth={2.5} dot={{ r: 4, fill: '#0D47A1' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus, Search, Filter, X, Edit2, Trash2,
  Clock, Calendar, User, CheckCircle2, Circle, AlertCircle,
  MessageCircle, Send, RefreshCw, BarChart2,
  ClipboardList, Zap, TrendingUp, AlertTriangle,
  Layers, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  comment: string;
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  assignee_id: number | null;
  assignee_name: string | null;
  assignee_avatar: string | null;
  creator_id: number;
  creator_name: string | null;
  creator_avatar: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  comments: TaskComment[];
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Static Tasks ────────────────────────────────────────────────────────────

const STATIC_TASKS: Task[] = [
  {
    id: 1,
    title: "Design the new dashboard UI",
    description: "Create a modern dashboard with charts, stats cards, and activity feed. Follow the new design system.",
    assignee_id: 101,
    assignee_name: "Suraj Kumar",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "high",
    status: "in_progress",
    due_date: "2026-07-15",
    estimated_hours: 8,
    actual_hours: 3.5,
    comments: [
      {
        id: 1,
        task_id: 1,
        user_id: 101,
        user_name: "Suraj Kumar",
        user_avatar: null,
        comment: "Working on the initial wireframes. Should have a prototype by tomorrow.",
        created_at: "2026-07-01T10:30:00Z"
      }
    ],
    created_at: "2026-06-28T09:00:00Z",
    updated_at: "2026-07-01T10:30:00Z"
  },
  {
    id: 2,
    title: "Implement user authentication API",
    description: "Build JWT-based authentication with login, register, and refresh token endpoints.",
    assignee_id: 102,
    assignee_name: "Anjali Sharma",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "urgent",
    status: "todo",
    due_date: "2026-07-10",
    estimated_hours: 12,
    actual_hours: 0,
    comments: [],
    created_at: "2026-06-30T14:20:00Z",
    updated_at: "2026-06-30T14:20:00Z"
  },
  {
    id: 3,
    title: "Fix responsive layout issues",
    description: "Fix mobile responsiveness issues on the settings page and profile page.",
    assignee_id: 103,
    assignee_name: "Vikram Patel",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "medium",
    status: "review",
    due_date: "2026-07-05",
    estimated_hours: 4,
    actual_hours: 3,
    comments: [
      {
        id: 2,
        task_id: 3,
        user_id: 103,
        user_name: "Vikram Patel",
        user_avatar: null,
        comment: "Fixed most issues. Ready for review.",
        created_at: "2026-07-02T15:45:00Z"
      },
      {
        id: 3,
        task_id: 3,
        user_id: 1,
        user_name: "Admin",
        user_avatar: null,
        comment: "Looks good! Just fix the header alignment on mobile.",
        created_at: "2026-07-02T16:20:00Z"
      }
    ],
    created_at: "2026-07-01T08:00:00Z",
    updated_at: "2026-07-02T16:20:00Z"
  },
  {
    id: 4,
    title: "Database migration for user roles",
    description: "Add role-based access control tables and migrate existing users.",
    assignee_id: 104,
    assignee_name: "Rajesh Roy",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "high",
    status: "completed",
    due_date: "2026-06-30",
    estimated_hours: 6,
    actual_hours: 5.5,
    comments: [
      {
        id: 4,
        task_id: 4,
        user_id: 104,
        user_name: "Rajesh Roy",
        user_avatar: null,
        comment: "Migration completed successfully. All tests passing.",
        created_at: "2026-06-30T12:00:00Z"
      }
    ],
    created_at: "2026-06-25T10:00:00Z",
    updated_at: "2026-06-30T12:00:00Z"
  },
  {
    id: 5,
    title: "Create user onboarding tutorial",
    description: "Build an interactive step-by-step tutorial for new users.",
    assignee_id: 105,
    assignee_name: "Priya Mehta",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "low",
    status: "todo",
    due_date: "2026-07-20",
    estimated_hours: 10,
    actual_hours: 0,
    comments: [],
    created_at: "2026-07-02T09:15:00Z",
    updated_at: "2026-07-02T09:15:00Z"
  },
  {
    id: 6,
    title: "Update API documentation",
    description: "Update the API documentation with new endpoints and examples.",
    assignee_id: 101,
    assignee_name: "Suraj Kumar",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "medium",
    status: "todo",
    due_date: "2026-07-08",
    estimated_hours: 4,
    actual_hours: 0,
    comments: [],
    created_at: "2026-07-03T11:00:00Z",
    updated_at: "2026-07-03T11:00:00Z"
  },
  {
    id: 7,
    title: "Fix login page validation",
    description: "Fix the validation issues on the login page and improve error messages.",
    assignee_id: 102,
    assignee_name: "Anjali Sharma",
    assignee_avatar: null,
    creator_id: 1,
    creator_name: "Admin",
    creator_avatar: null,
    priority: "high",
    status: "in_progress",
    due_date: "2026-07-04",
    estimated_hours: 3,
    actual_hours: 1.5,
    comments: [
      {
        id: 5,
        task_id: 7,
        user_id: 102,
        user_name: "Anjali Sharma",
        user_avatar: null,
        comment: "Working on the validation fixes. Should be done today.",
        created_at: "2026-07-03T14:30:00Z"
      }
    ],
    created_at: "2026-07-02T16:00:00Z",
    updated_at: "2026-07-03T14:30:00Z"
  }
];

// ─── Static Employees ─────────────────────────────────────────────────────────

const STATIC_EMPLOYEES: Employee[] = [
  {
    id: 101,
    username: "suraj.kumar",
    email: "suraj@hously.co",
    full_name: "Suraj Kumar",
    avatar_url: null,
    role: "Developer",
    phone: "+91 98765 43210",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z"
  },
  {
    id: 102,
    username: "anjali.sharma",
    email: "anjali@hously.co",
    full_name: "Anjali Sharma",
    avatar_url: null,
    role: "Designer",
    phone: "+91 87654 32109",
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z"
  },
  {
    id: 103,
    username: "vikram.patel",
    email: "vikram@hously.co",
    full_name: "Vikram Patel",
    avatar_url: null,
    role: "Developer",
    phone: "+91 76543 21098",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z"
  },
  {
    id: 104,
    username: "rajesh.roy",
    email: "rajesh@hously.co",
    full_name: "Rajesh Roy",
    avatar_url: null,
    role: "DBA",
    phone: "+91 65432 10987",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z"
  },
  {
    id: 105,
    username: "priya.mehta",
    email: "priya@hously.co",
    full_name: "Priya Mehta",
    avatar_url: null,
    role: "HR",
    phone: "+91 54321 09876",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z"
  }
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string; dot: string }> = {
  low: { label: 'Low', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
  todo: { label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  review: { label: 'Under Review', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isOverdue = (task: Task) => {
  if (!task.due_date || task.status === 'completed') return false;
  return new Date(task.due_date) < new Date();
};

const getInitials = (name: string | null) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name, avatarUrl, size = 'sm' }: { name: string | null; avatarUrl?: string | null; size?: 'xs' | 'sm' | 'md' }) => {
  const sizeClass = { xs: 'w-5 h-5 text-[8px]', sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs' }[size];
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name ?? ''} className={`${sizeClass} rounded-full object-cover ring-2 ring-white`} />;
  }
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center font-bold text-white ring-2 ring-white`}>
      {getInitials(name)}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon, color, sub }: { title: string; value: string | number; icon: React.ReactNode; color: string; sub?: string }) => (
  <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-4 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-shadow`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
      <p className="text-2xl font-extrabold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

const TaskFormModal = ({
  task, employees, onClose, onSave
}: {
  task: Task | null;
  employees: Employee[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    assignee_id: task?.assignee_id ? String(task.assignee_id) : '',
    priority: task?.priority ?? 'medium' as TaskPriority,
    status: task?.status ?? 'todo' as TaskStatus,
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    estimated_hours: task?.estimated_hours ? String(task.estimated_hours) : '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || undefined,
        assignee_id: form.assignee_id ? parseInt(form.assignee_id) : null,
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || null,
        estimated_hours: form.estimated_hours ? parseFloat(form.estimated_hours) : null,
      };
      await onSave(payload);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center shadow-sm">
                <ClipboardList size={16} className="text-white" />
              </div>
              <h2 className="text-base font-extrabold text-slate-800">{task ? 'Edit Task' : 'Create New Task'}</h2>
            </div>
            <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Design the login page UI"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-800"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add task details, requirements, or notes..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 resize-none"
              />
            </div>

            {/* Row: Assignee + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assign To</label>
                <select
                  value={form.assignee_id}
                  onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700 cursor-pointer bg-white"
                >
                  <option value="">Unassigned</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.full_name || emp.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700 cursor-pointer bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Row: Status + Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700 cursor-pointer bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={form.estimated_hours}
                onChange={e => setForm(f => ({ ...f, estimated_hours: e.target.value }))}
                placeholder="e.g. 4.5"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={handleClose} className="flex-1 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 text-sm font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ─── Task Detail Modal ───────────────────────────────────────────────────────

const TaskDetailModal = ({
  task,
  onClose,
  onEdit
}: {
  task: Task;
  onClose: () => void;
  onEdit: (t: Task) => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task);

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[56] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl pointer-events-auto w-full max-w-lg transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          }}
        >
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-2xl opacity-10" />

            <div className="relative px-6 pt-5 pb-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priority.bg} ${priority.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                      {priority.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                        <AlertCircle size={11} /> Overdue
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-800 leading-tight">{task.title}</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Description */}
              {task.description && (
                <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignee</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignee_name} avatarUrl={task.assignee_avatar} size="sm" />
                    <span className="text-sm font-semibold text-slate-700 truncate">{task.assignee_name ?? 'Unassigned'}</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={task.creator_name} avatarUrl={task.creator_avatar} size="sm" />
                    <span className="text-sm font-semibold text-slate-700 truncate">{task.creator_name ?? '—'}</span>
                  </div>
                </div>
                {task.due_date && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                    <p className={`text-sm font-semibold ${overdue ? 'text-red-500' : 'text-slate-700'}`}>
                      {formatDate(task.due_date)}
                      {overdue && ' ⚠️'}
                    </p>
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hours</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {task.actual_hours}h / {task.estimated_hours ?? '?'}h
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDate(task.created_at)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task ID</p>
                  <p className="text-sm font-semibold text-slate-700">#{task.id}</p>
                </div>
              </div>

              {/* Comments */}
              {task.comments && task.comments.length > 0 && (
                <div className="border-t border-slate-100 pt-3 mb-3">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MessageCircle size={12} /> Comments ({task.comments.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {task.comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <Avatar name={c.user_name} avatarUrl={c.user_avatar} size="xs" />
                        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-bold text-slate-700">{c.user_name}</span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    setTimeout(() => onEdit(task), 300);
                  }}
                  className="flex-1 py-2 text-sm font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

const DeleteConfirmModal = ({
  task,
  onClose,
  onConfirm,
  deleting,
}: {
  task: Task;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full pointer-events-auto transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          }}
        >
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 text-center">Delete Task?</h3>
          <p className="text-sm text-slate-500 text-center mt-2">
            Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={handleClose} className="flex-1 py-2.5 text-sm font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={deleting} className="flex-1 py-2.5 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-sm disabled:opacity-60 cursor-pointer">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Side Filter Drawer ──────────────────────────────────────────────────────

interface FilterState {
  status: string;
  priority: string;
  assignee: string;
}

const SideFilter = ({
  open,
  onClose,
  filters,
  setFilters,
  onReset,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onReset: () => void;
  employees: Employee[];
}) => {
  const selCls =
    "w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all appearance-none";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#0D47A1]" />
            <span className="font-extrabold text-slate-800 text-sm">Filter Tasks</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Status
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={selCls}
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Priority
            </label>
            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className={selCls}
              >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Assignee
            </label>
            <div className="relative">
              <select
                value={filters.assignee}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                className={selCls}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={String(emp.id)}>
                    {emp.full_name || emp.username}
                  </option>
                ))}
              </select>
              <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw size={11} /> Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main TasksPage ───────────────────────────────────────────────────────────

export default function TasksPage() {
  const context = useOutletContext<{ setHeaderTitle: (t: string) => void; setHeaderSubtitle: (s: string) => void } | null>();

  useEffect(() => {
    context?.setHeaderTitle?.('Task Management');
    context?.setHeaderSubtitle?.('Manage and track all your tasks');
  }, []);

  const [tasks, setTasks] = useState<Task[]>(STATIC_TASKS);
  const [employees] = useState<Employee[]>(STATIC_EMPLOYEES);

  // Checkbox selection
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Column-wise search
  const [colSearch, setColSearch] = useState({
    title: '',
    assignee: '',
    priority: '',
    status: '',
    due_date: '',
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priority: '',
    assignee: '',
  });
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.due_date === today);
  const overdueTasks = tasks.filter(t => isOverdue(t));
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent');

  // Filtered tasks with column search
  const filteredTasks = tasks.filter(t => {
    const matchTitle = t.title.toLowerCase().includes(colSearch.title.toLowerCase()) ||
      (t.description?.toLowerCase().includes(colSearch.title.toLowerCase()) || false);
    const matchAssignee = t.assignee_name?.toLowerCase().includes(colSearch.assignee.toLowerCase()) ?? true;
    const matchPriority = t.priority.toLowerCase().includes(colSearch.priority.toLowerCase());
    const matchStatus = t.status.toLowerCase().includes(colSearch.status.toLowerCase());
    const matchDueDate = t.due_date ? t.due_date.includes(colSearch.due_date) : true;

    const matchFilterStatus = !filters.status || t.status === filters.status;
    const matchFilterPriority = !filters.priority || t.priority === filters.priority;
    const matchFilterAssignee = !filters.assignee || t.assignee_id === parseInt(filters.assignee);

    return matchTitle && matchAssignee && matchPriority && matchStatus && matchDueDate &&
      matchFilterStatus && matchFilterPriority && matchFilterAssignee;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedTasks(new Set());
    setSelectAll(false);
  }, [colSearch, filters, pageSize]);

  // Handle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      const allIds = new Set(paginatedTasks.map(t => t.id));
      setSelectedTasks(allIds);
    } else {
      setSelectedTasks(new Set());
    }
  };

  // Handle individual selection
  const handleSelectTask = (taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setSelectAll(newSelected.size === paginatedTasks.length && paginatedTasks.length > 0);
  };

  // Handle delete selected
  const handleDeleteSelected = () => {
    if (selectedTasks.size === 0) {
      toast.error('Please select tasks to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.size} selected tasks?`)) {
      setTasks(prev => prev.filter(t => !selectedTasks.has(t.id)));
      setSelectedTasks(new Set());
      setSelectAll(false);
      toast.success(`${selectedTasks.size} tasks deleted successfully!`);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPageSize(value === 'all' ? filteredTasks.length : parseInt(value));
    setCurrentPage(1);
  };

  const handleCreate = async (data: any) => {
    const newTask: Task = {
      id: Date.now(),
      title: data.title,
      description: data.description || null,
      assignee_id: data.assignee_id || null,
      assignee_name: employees.find(e => e.id === data.assignee_id)?.full_name || null,
      assignee_avatar: null,
      creator_id: 1,
      creator_name: 'Admin',
      creator_avatar: null,
      priority: data.priority,
      status: data.status,
      due_date: data.due_date || null,
      estimated_hours: data.estimated_hours || null,
      actual_hours: 0,
      comments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task created successfully!');
  };

  const handleUpdate = async (data: any) => {
    if (!editTask) return;
    setTasks(prev => prev.map(t =>
      t.id === editTask.id ? {
        ...t,
        ...data,
        assignee_name: employees.find(e => e.id === data.assignee_id)?.full_name || null,
      } : t
    ));
    toast.success('Task updated!');
    setEditTask(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setTasks(prev => prev.filter(t => t.id !== deleteConfirm.id));
    toast.success('Task deleted');
    setDeleteConfirm(null);
    setDeleting(false);
  };

  const resetFilters = () => {
    setFilters({ status: '', priority: '', assignee: '' });
  };

  const colInp =
    "w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 placeholder-slate-300 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all";

  return (
    <div className="p-4 md:p-6 space-y-5 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<ClipboardList size={20} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Today's Tasks"
          value={todayTasks.length}
          icon={<Calendar size={20} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon={<AlertTriangle size={20} className="text-red-500" />}
          color="bg-red-50"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={<Clock size={20} className="text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          title="High Priority"
          value={highPriorityTasks.length}
          icon={<Zap size={20} className="text-orange-500" />}
          color="bg-orange-50"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Toolbar above table - Sticky */}
        <div className="sticky top-0 z-20 px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-500">
              {filteredTasks.length} tasks found
            </div>
            {selectedTasks.size > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
                >
                  <Trash2 size={13} /> Delete Selected ({selectedTasks.size})
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} selected
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition cursor-pointer ${Object.values(filters).some(v => v)
                ? "bg-[#0D47A1]/10 border-[#0D47A1]/30 text-[#0D47A1]"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <Filter size={13} /> Filter
              {Object.values(filters).some(v => v) && (
                <span className="w-4 h-4 bg-[#0D47A1] text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> New Task
            </button>
          </div>
        </div>

        {/* Table with scroll */}
        <div className="overflow-y-auto max-h-[calc(100vh-380px)]">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                    disabled={paginatedTasks.length === 0}
                  />
                </th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>

              {/* Column Search Row - Sticky */}
              <tr className="bg-white border-b-2 border-slate-200 sticky top-[57px] z-10">
                <th className="px-3 py-2"></th>
                <th className="px-3 py-2">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={colSearch.title}
                      onChange={(e) => setColSearch(s => ({ ...s, title: e.target.value }))}
                      placeholder="Search task..."
                      className={`${colInp} pl-5`}
                    />
                  </div>
                </th>
                <th className="px-3 py-2">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={colSearch.assignee}
                      onChange={(e) => setColSearch(s => ({ ...s, assignee: e.target.value }))}
                      placeholder="Search assignee..."
                      className={`${colInp} pl-5`}
                    />
                  </div>
                </th>
                <th className="px-3 py-2">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={colSearch.priority}
                      onChange={(e) => setColSearch(s => ({ ...s, priority: e.target.value }))}
                      placeholder="Search priority..."
                      className={`${colInp} pl-5`}
                    />
                  </div>
                </th>
                <th className="px-3 py-2">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={colSearch.status}
                      onChange={(e) => setColSearch(s => ({ ...s, status: e.target.value }))}
                      placeholder="Search status..."
                      className={`${colInp} pl-5`}
                    />
                  </div>
                </th>
                <th className="px-3 py-2">
                  <div className="relative">
                    <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      value={colSearch.due_date}
                      onChange={(e) => setColSearch(s => ({ ...s, due_date: e.target.value }))}
                      placeholder="Search date..."
                      className={`${colInp} pl-5`}
                    />
                  </div>
                </th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-sm font-semibold">
                    No tasks found. Create your first task!
                  </td>
                </tr>
              )}
              {paginatedTasks.map(task => {
                const priority = PRIORITY_CONFIG[task.priority];
                const status = STATUS_CONFIG[task.status];
                const overdue = isOverdue(task);
                const isChecked = selectedTasks.has(task.id);

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-blue-50/30 border-b border-slate-100 transition-colors ${isChecked ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectTask(task.id)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-slate-800 truncate">{task.title}</p>
                      {task.description && <p className="text-[10px] text-slate-400 truncate">{task.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee_name} avatarUrl={task.assignee_avatar} size="xs" />
                        <span className="font-semibold text-slate-600 truncate max-w-[80px]">{task.assignee_name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priority.bg} ${priority.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.color} border ${status.border}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${overdue ? 'text-red-500' : 'text-slate-600'}`}>
                        {task.due_date ? formatDate(task.due_date) : '—'}
                        {overdue && ' ⚠️'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewTask(task)}
                          className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-400 hover:text-[#0D47A1] transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setEditTask(task)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(task)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination - Sticky Bottom */}
        {filteredTasks.length > 0 && (
          <div className="sticky bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2">
            <span className="font-semibold">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>

            <div className="flex items-center gap-3">
              {/* Page Size Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400">Show:</span>
                <select
                  value={pageSize === filteredTasks.length ? 'all' : pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-[#0D47A1]/20"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold transition cursor-pointer ${pageNum === currentPage
                        ? "bg-[#0D47A1] text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:bg-white"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {createOpen && (
        <TaskFormModal task={null} employees={employees} onClose={() => setCreateOpen(false)} onSave={handleCreate} />
      )}

      {editTask && (
        <TaskFormModal task={editTask} employees={employees} onClose={() => setEditTask(null)} onSave={handleUpdate} />
      )}

      {viewTask && (
        <TaskDetailModal
          task={viewTask}
          onClose={() => setViewTask(null)}
          onEdit={(t) => {
            setViewTask(null);
            setTimeout(() => setEditTask(t), 300);
          }}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          task={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}

      {/* Side Filter */}
      <SideFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        employees={employees}
      />
    </div>
  );
}
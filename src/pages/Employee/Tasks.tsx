import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, X, Edit2, Trash2,
  Clock, Calendar, User, CheckCircle2, Circle, AlertCircle,
  MessageCircle, Send, RefreshCw, BarChart2,
  ClipboardList, Zap, TrendingUp, AlertTriangle,
  Layers, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import { useTaskSocket } from '../../hooks/useTaskSocket';

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

// ─── Helpers & Configurations ─────────────────────────────────────────────────

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
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-4 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0 text-left">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
      <p className="text-2xl font-extrabold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

const TaskFormModal = ({
  task, employees, onClose, onSave, currentUser
}: {
  task: Task | null;
  employees: any[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  currentUser: any;
}) => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    assignee_id: task?.assignee_id ? String(task.assignee_id) : (task ? '' : String(currentUser?.id || '')),
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
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
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
          <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100/80 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] flex items-center justify-center shadow-sm">
                <ClipboardList size={16} className="text-white" />
              </div>
              <h2 className="text-base font-extrabold text-slate-800">{task ? 'Edit Task Details' : 'Create New Task'}</h2>
            </div>
            <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 text-left">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Add validation logic"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-800"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add task details, requirements, or notes..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700 resize-none"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">Assignee</label>
              <select
                value={form.assignee_id}
                onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700 cursor-pointer bg-white"
              >
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp.id} value={String(emp.id)}>{emp.full_name || emp.username}</option>
                ))}
              </select>
            </div>

            {/* Row: Priority + Status */}
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Row: Due Date + Estimated Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-semibold text-slate-700"
                />
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
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none transition-all font-medium text-slate-700"
                />
              </div>
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
  onEdit,
  onAddComment,
  currentUser
}: {
  task: Task;
  onClose: () => void;
  onEdit: (t: Task) => void;
  onAddComment: (commentText: string) => void;
  currentUser: any;
}) => {
  const [visible, setVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task);

  // Check if current employee is creator of this task to show/hide edit options
  const isCreator = task.creator_id === currentUser?.id;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 pointer-events-auto"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[56] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100/50 pointer-events-auto w-full max-w-2xl overflow-hidden transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-[#0D47A1]/5 to-[#1976D2]/5 opacity-80 pointer-events-none" />

          <div className="relative flex flex-col max-h-[78vh]">
            
            {/* Modal Top Bar */}
            <div className="px-5 pt-4 pb-2.5 flex items-center justify-between border-b border-slate-100/80 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#0D47A1] bg-[#0D47A1]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                  Task #{task.id}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 flex-1 z-10 text-left overflow-hidden flex flex-col">
              {/* Title and Badge */}
              <div className="mb-4">
                <h2 className="text-lg font-extrabold text-slate-800 leading-snug tracking-tight mb-1.5 font-sans">
                  {task.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${status.bg} ${status.color} ${status.border} shadow-sm`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {status.label}
                  </span>
                  {overdue && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-100 shadow-sm animate-pulse">
                      <AlertCircle size={9} /> Overdue
                    </span>
                  )}
                </div>
              </div>

              {/* Two-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-hidden flex-1">
                
                {/* Left Side (Main Content) */}
                <div className="md:col-span-3 flex flex-col min-h-0 space-y-4 overflow-hidden">
                  
                  {/* Description Box */}
                  <div className="flex flex-col min-h-0 flex-shrink-0">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Description
                    </h3>
                    <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl overflow-y-auto max-h-24">
                      {task.description ? (
                        <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                          {task.description}
                        </p>
                      ) : (
                        <p className="text-[11px] italic text-slate-400">No description provided for this task.</p>
                      )}
                    </div>
                  </div>

                  {/* Comments Box */}
                  <div className="flex flex-col flex-1 min-h-0">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2 flex-shrink-0">
                      <MessageCircle size={12} className="text-slate-400" />
                      Comments ({task.comments?.length || 0})
                    </h3>
                    
                    {/* Compact Scrollable Feed */}
                    <div className="flex-1 overflow-y-auto pr-1 mb-2 space-y-2.5 max-h-36">
                      {task.comments && task.comments.length > 0 ? (
                        task.comments.map(c => (
                          <div key={c.id} className="flex gap-2">
                            <div className="mt-0.5 flex-shrink-0">
                              <Avatar name={c.user_name} avatarUrl={c.user_avatar} size="xs" />
                            </div>
                            <div className="flex-1 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2 text-xs">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[9px] font-bold text-slate-700">{c.user_name}</span>
                                <span className="text-[8px] font-medium text-slate-400 bg-white px-1 py-0.5 rounded border border-slate-100">
                                  {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed font-medium">{c.comment}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                          <MessageCircle size={16} className="mx-auto text-slate-300 mb-0.5" />
                          <p className="text-[9px] font-bold text-slate-400">No comments yet</p>
                        </div>
                      )}
                    </div>

                    {/* Compact Input */}
                    <form onSubmit={handleSubmitComment} className="flex gap-1.5 items-center border-t border-slate-100 pt-2 flex-shrink-0 bg-white">
                      <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50/50 outline-none focus:bg-white focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]/20 transition"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0D47A1] to-[#1976D2] text-white flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition shadow-sm cursor-pointer flex-shrink-0"
                      >
                        <Send size={10} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side (Metadata Panel) */}
                <div className="md:col-span-2 flex flex-col justify-between overflow-y-auto">
                  <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-3 space-y-3">
                    <h3 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-1.5">
                      Details
                    </h3>
                    
                    {/* Priority */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Priority</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${priority.bg} ${priority.color} border shadow-sm`}>
                        <span className={`w-1 h-1 rounded-full ${priority.dot}`} />
                        {priority.label}
                      </span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Due Date</span>
                      <div className="text-right">
                        <span className={`font-bold ${overdue ? 'text-red-500' : 'text-slate-600'}`}>
                          {task.due_date ? formatDate(task.due_date) : 'No deadline'}
                        </span>
                        {overdue && (
                          <span className="block text-[8px] font-extrabold text-red-500 uppercase tracking-wider">
                            ⚠️ Overdue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hours Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-400">Hours Logged</span>
                        <span className="font-bold text-slate-700">
                          {task.actual_hours}h / {task.estimated_hours ?? '?'}h
                        </span>
                      </div>
                      {task.estimated_hours && task.estimated_hours > 0 ? (
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              task.actual_hours >= task.estimated_hours ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, (task.actual_hours / task.estimated_hours) * 100)}%` }}
                          />
                        </div>
                      ) : null}
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Assignee</span>
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee_name} avatarUrl={task.assignee_avatar} size="xs" />
                        <span className="font-bold text-slate-700 truncate max-w-[80px]">
                          {task.assignee_name ?? 'Unassigned'}
                        </span>
                      </div>
                    </div>

                    {/* Created By */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Created By</span>
                      <div className="flex items-center gap-2">
                        <Avatar name={task.creator_name} avatarUrl={task.creator_avatar} size="xs" />
                        <span className="font-bold text-slate-700 truncate max-w-[80px]">
                          {task.creator_name ?? '—'}
                        </span>
                      </div>
                    </div>

                    {/* Date Created */}
                    <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-2.5 mt-2.5">
                      <span className="font-bold text-slate-400">Created At</span>
                      <span className="font-bold text-slate-500">
                        {formatDate(task.created_at)}
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer (Conditional footer buttons if the employee created the task) */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 z-10 bg-white">
              <button
                onClick={handleClose}
                className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Close Details
              </button>
              {isCreator && (
                <button
                  onClick={() => {
                    handleClose();
                    setTimeout(() => onEdit(task), 300);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#0b3d8f] hover:to-[#1565c0] text-white rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={11} /> Edit Details
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

const DeleteConfirmModal = ({
  task, onClose, onConfirm, deleting,
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
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full pointer-events-auto transition-all duration-300 text-left"
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
            Are you sure you want to delete your task "<strong>{task.title}</strong>"? This action cannot be undone.
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

// ─── Main Employee Tasks Component ───────────────────────────────────────────

export default function Tasks() {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Column-wise searches
  const [colSearch, setColSearch] = useState({
    title: '',
    priority: '',
    status: '',
    due_date: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // API methods
  const fetchTasks = async () => {
    try {
      const data = await apiClient.get<any>('/tasks');
      if (data) {
        const list = Array.isArray(data) ? data : (data.data || []);
        setTasks(list);
      }
    } catch (err) {
      console.warn('Error fetching tasks:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await apiClient.get<any>('/tasks/employees');
      if (res) {
        const list = Array.isArray(res) ? res : (res.data || []);
        setEmployees(list);
      }
    } catch (err) {
      console.warn('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchEmployees()]);
      setLoading(false);
    };
    initData();
  }, []);

  const handleOpenViewTask = async (task: Task) => {
    setViewTask(task);
    try {
      const res = await apiClient.get<any>(`/tasks/${task.id}`);
      if (res) {
        const taskDetail = res.data || res;
        setViewTask(taskDetail);
      }
    } catch (err) {
      console.warn('Failed to load task comments:', err);
    }
  };

  // Listen for socket events to refresh tasks list in real-time
  useTaskSocket((event, data) => {
    console.log(`[EmployeeTasks] socket event: ${event}`, data);
    fetchTasks();
    if (viewTask && (event === 'task_updated' || event === 'task_comment_added' || event === 'task_status_updated')) {
      if (data.taskId === viewTask.id || (viewTask && viewTask.id === data.taskId)) {
        apiClient.get<any>(`/tasks/${viewTask.id}`).then(res => {
          if (res) {
            const taskDetail = res.data || res;
            setViewTask(taskDetail);
          }
        });
      }
    }
  });

  // Filter ONLY my tasks
  // (Assignee ID matches current logged-in employee ID or assignee name matches full_name)
  const myTasks = tasks.filter(t => 
    t.assignee_id === user?.id || 
    t.assignee_name?.toLowerCase() === user?.full_name?.toLowerCase() ||
    // fallback context
    (user?.full_name === undefined && t.assignee_id === 101)
  );

  // Apply column-wise filters
  const filteredTasks = myTasks.filter(t => {
    const matchTitle = t.title.toLowerCase().includes(colSearch.title.toLowerCase()) ||
      (t.description?.toLowerCase().includes(colSearch.title.toLowerCase()) || false);
    const matchPriority = t.priority.toLowerCase().includes(colSearch.priority.toLowerCase());
    const matchStatus = t.status.toLowerCase().includes(colSearch.status.toLowerCase());
    const matchDueDate = t.due_date ? t.due_date.includes(colSearch.due_date) : true;

    return matchTitle && matchPriority && matchStatus && matchDueDate;
  });

  // Pagination math
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedTasks(new Set());
    setSelectAll(false);
  }, [colSearch, pageSize]);

  // Personal statistics
  const pendingCount = myTasks.filter(t => t.status !== 'completed').length;
  const overdueCount = myTasks.filter(t => isOverdue(t)).length;
  const highPriorityCount = myTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
  const completedCount = myTasks.filter(t => t.status === 'completed').length;

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

  // Handle bulk delete (only allowed on tasks created by user)
  const handleDeleteSelected = async () => {
    if (selectedTasks.size === 0) {
      toast.error('Please select tasks to delete');
      return;
    }

    const deletableTasks = paginatedTasks.filter(t => selectedTasks.has(t.id) && t.creator_id === user?.id);
    if (deletableTasks.length === 0) {
      toast.error('You can only delete tasks created by yourself.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${deletableTasks.length} tasks you created?`)) {
      try {
        const deletePromises = deletableTasks.map(t => apiClient.delete(`/tasks/${t.id}`));
        await Promise.all(deletePromises);
        toast.success(`${deletableTasks.length} tasks deleted successfully!`);
        fetchTasks();
        setSelectedTasks(new Set());
        setSelectAll(false);
      } catch (err) {
        console.error('Error batch deleting tasks:', err);
        toast.error('Failed to delete some tasks');
      }
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPageSize(value === 'all' ? filteredTasks.length : parseInt(value));
    setCurrentPage(1);
  };

  // Create task
  const handleCreate = async (data: any) => {
    try {
      await apiClient.post('/tasks', data);
      toast.success('Task created successfully!');
      fetchTasks();
    } catch (err) {
      console.error('API error saving task:', err);
      toast.error('Failed to create task');
    }
  };

  // Edit task details
  const handleUpdate = async (data: any) => {
    if (!editTask) return;
    try {
      await apiClient.put(`/tasks/${editTask.id}`, data);
      toast.success('Task updated!');
      fetchTasks();
      setEditTask(null);
    } catch (err) {
      console.error('API error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/tasks/${deleteConfirm.id}`);
      toast.success('Task deleted successfully');
      fetchTasks();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('API error deleting task:', err);
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  // Interactive write comment handler
  const handleAddComment = async (taskId: number, commentText: string) => {
    try {
      await apiClient.post(`/tasks/${taskId}/comments`, { comment: commentText });
      toast.success('Comment posted successfully');
      const res = await apiClient.get<any>(`/tasks/${taskId}`);
      if (res) {
        const taskDetail = res.data || res;
        setViewTask(taskDetail);
      }
      fetchTasks();
    } catch (err) {
      console.error('API error saving comment:', err);
      toast.error('Failed to post comment');
    }
  };

  const colInp =
    "w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md bg-white outline-none font-medium text-slate-600 placeholder-slate-350 focus:border-[#0D47A1]/50 focus:ring-1 focus:ring-[#0D47A1]/15 transition-all text-left";

  return (
    <div className="space-y-5 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Total Tasks"
          value={myTasks.length}
          icon={<ClipboardList size={20} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingCount}
          icon={<Clock size={20} className="text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          title="High Priority"
          value={highPriorityCount}
          icon={<Zap size={20} className="text-orange-500" />}
          color="bg-orange-50"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueCount}
          icon={<AlertTriangle size={20} className="text-red-500" />}
          color="bg-red-50"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col min-h-[480px]">
        {/* Count/Toolbar Header - Sticky */}
        <div className="sticky top-0 z-20 px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-500 text-left">
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
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> Create Task
            </button>
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="overflow-y-auto flex-1 max-h-[calc(100vh-240px)]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <RefreshCw className="animate-spin text-[#0D47A1] mb-2" size={24} />
              <p className="text-xs font-semibold text-slate-400">Loading tasks data...</p>
            </div>
          ) : (
            <table className="min-w-full border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
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
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-extrabold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-right font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>

                {/* Column Searches */}
                <tr className="bg-white border-b-2 border-slate-200 sticky top-[48px] z-10">
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2">
                    <div className="relative">
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-350" />
                      <input
                        value={colSearch.title}
                        onChange={(e) => setColSearch(s => ({ ...s, title: e.target.value }))}
                        placeholder="Search title..."
                        className={`${colInp} pl-5`}
                      />
                    </div>
                  </th>
                  <th className="px-3 py-2">
                    <div className="relative">
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-350" />
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
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-350" />
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
                      <Search size={9} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-350" />
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
              <tbody className="divide-y divide-slate-100">
                {paginatedTasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm font-semibold">
                      No tasks found. Create a new task!
                    </td>
                  </tr>
                )}
                {paginatedTasks.map(task => {
                  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['medium'];
                  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG['todo'];
                  const overdue = isOverdue(task);
                  const isChecked = selectedTasks.has(task.id);

                  // Check if task was created by the logged in employee
                  const isMyCreatedTask = task.creator_id === user?.id;

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-blue-50/30 border-b border-slate-100 transition-colors ${isChecked ? 'bg-blue-50/50' : ''} cursor-pointer`}
                      onClick={() => handleOpenViewTask(task)}
                    >
                      <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectTask(task.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 max-w-xs text-left">
                        <p className="font-bold text-slate-800 truncate">{task.title}</p>
                        {task.description && <p className="text-[10px] text-slate-450 truncate">{task.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priority.bg} ${priority.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <span className={`font-semibold ${overdue ? 'text-red-500' : 'text-slate-650'}`}>
                          {task.due_date ? formatDate(task.due_date) : '—'}
                          {overdue && ' ⚠️'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenViewTask(task)}
                            className="p-1.5 hover:bg-[#0D47A1]/10 rounded-lg text-slate-450 hover:text-[#0D47A1] transition cursor-pointer"
                            title="View details & comments"
                          >
                            <Eye size={13} />
                          </button>
                          {isMyCreatedTask ? (
                            <>
                              <button
                                onClick={() => setEditTask(task)}
                                className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-450 hover:text-blue-600 transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(task)}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-450 hover:text-red-500 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-105 border border-slate-200/60 px-2 py-0.5 rounded shadow-sm select-none mr-2">
                              View Only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && filteredTasks.length > 0 && (
          <div className="sticky bottom-0 z-20 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white/95 backdrop-blur-sm flex-wrap gap-2">
            <span className="font-semibold">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-450">Show:</span>
                <select
                  value={pageSize === filteredTasks.length ? 'all' : pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none cursor-pointer bg-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="all">All</option>
                </select>
              </div>

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

      {/* Form Modals */}
      {createOpen && (
        <TaskFormModal task={null} employees={employees} onClose={() => setCreateOpen(false)} onSave={handleCreate} currentUser={user} />
      )}

      {editTask && (
        <TaskFormModal task={editTask} employees={employees} onClose={() => setEditTask(null)} onSave={handleUpdate} currentUser={user} />
      )}

      {/* Task Details Modal */}
      {viewTask && (
        <TaskDetailModal
          task={viewTask}
          onClose={() => setViewTask(null)}
          onEdit={(t) => {
            setViewTask(null);
            setTimeout(() => setEditTask(t), 300);
          }}
          onAddComment={(commentText) => handleAddComment(viewTask.id, commentText)}
          currentUser={user}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          task={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}

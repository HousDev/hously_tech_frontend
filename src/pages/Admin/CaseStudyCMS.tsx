// pages/Admin/CaseStudyCMS.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown,
  X, Search, Filter, ChevronLeft, ChevronRight, Check,
  BookOpen, Grid, List, Image as ImageIcon,
} from 'lucide-react';
import { caseStudyApi, type CaseStudy } from '../../lib/caseStudyApi';
import { toast, Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

interface Props { isSidebarOpen?: boolean; }

const EMPTY_FORM = {
  title: '', category: '', description: '', metrics: '',
  image_url: '', display_order: 0, is_active: true,
};

const CaseStudyCMS = ({ isSidebarOpen = false }: Props) => {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [isModalOpen, setModal] = useState(false);
  const [formData, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadImg] = useState(false);
  const [selectedFile, setFile] = useState<File | null>(null);
  const [searchTerm, setSearch] = useState('');
  const [activeFilter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [viewMode, setView] = useState<'table' | 'grid'>('table');
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (!selected.length) {
      toast.error('Select items first');
      return;
    }
    setDeleteTargetIds(selected);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const t = toast.loading('Deleting...');
    try {
      await caseStudyApi.delete(id);
      toast.dismiss(t);
      fetchAll();
    } catch {
      toast.error('Delete failed', { id: t });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const t = toast.loading(`Deleting ${ids.length} case study(s)...`);
    try {
      await caseStudyApi.bulkDelete(ids);
      toast.dismiss(t);
      setSelected([]);
      fetchAll();
    } catch {
      toast.error('Bulk delete failed', { id: t });
    }
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Case Studies CMS');
      setHeaderSubtitle(`Publish and manage client success stories (${items.length} records)`);
    }
  }, [items.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await caseStudyApi.getAll();
      setItems([...data].sort((a, b) => a.display_order - b.display_order));
    } catch { toast.error('Failed to fetch case studies'); }
    finally { setLoading(false); }
  };

  /* ── stats ── */
  const total = items.length;
  const active = items.filter(i => i.is_active).length;
  const inactive = items.filter(i => !i.is_active).length;

  /* ── filter / paginate ── */
  const filtered = items.filter(i => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s ||
      i.title.toLowerCase().includes(s) ||
      i.category.toLowerCase().includes(s) ||
      i.description.toLowerCase().includes(s);
    const matchStatus =
      activeFilter === 'all' ||
      (activeFilter === 'active' && i.is_active) ||
      (activeFilter === 'inactive' && !i.is_active);
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* ── validate ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.category.trim()) e.category = 'Category is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.metrics.trim()) e.metrics = 'Metrics is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ── image ── */
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, JPEG, GIF, WEBP)');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setFile(f);
    const previewUrl = URL.createObjectURL(f);

    try {
      setUploadImg(true);
      const url = await caseStudyApi.uploadImage(f);
      setForm(p => ({ ...p, image_url: url }));
      URL.revokeObjectURL(previewUrl);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image');
      setForm(p => ({ ...p, image_url: '' }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setUploadImg(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Select an image first'); return; }
    try {
      setUploadImg(true);
      const url = await caseStudyApi.uploadImage(selectedFile);
      setForm(p => ({ ...p, image_url: url }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: any) { toast.error(e?.message || 'Upload failed'); }
    finally { setUploadImg(false); }
  };

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const t = toast.loading(editing ? 'Updating case study...' : 'Creating case study...');
    try {
      setSaving(true);
      const payload = { ...formData, display_order: Number(formData.display_order) || items.length };
      if (editing) {
        await caseStudyApi.update(editing.id, payload);
        toast.success('Case study updated successfully!', { id: t });
      } else {
        await caseStudyApi.create(payload);
        toast.dismiss(t);
      }
      fetchAll();
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save case study', { id: t });
    } finally {
      setSaving(false);
    }
  };

  /* ── edit ── */
  const handleEdit = (item: CaseStudy) => {
    setEditing(item);
    setForm({
      title: item.title, category: item.category,
      description: item.description, metrics: item.metrics,
      image_url: item.image_url, display_order: item.display_order,
      is_active: item.is_active,
    });
    setFile(null);
    setModal(true);
  };

  /* Deletion triggers confirm modal */
  /* ── toggle ── */
  const handleToggle = async (id: number, current: boolean) => {
    const t = toast.loading(current ? 'Deactivating...' : 'Activating...');
    try {
      await caseStudyApi.toggleActive(id);
      setItems(p => p.map(i => i.id === id ? { ...i, is_active: !current } : i));
      toast.dismiss(t);
    } catch {
      toast.error('Failed to update status', { id: t });
    }
  };

  /* ── reorder ── */
  const handleReorder = async (id: number, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === items.length - 1) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    const next = [...items];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    next.forEach((i, n) => { i.display_order = n; });
    try {
      await caseStudyApi.reorder(next.map((i, n) => ({ id: i.id, display_order: n })));
      setItems(next);
    } catch { toast.error('Reorder failed'); fetchAll(); }
  };

  /* ── close modal ── */
  const closeModal = () => {
    setModal(false); setEditing(null); setFile(null); setErrors({});
    setForm({ ...EMPTY_FORM, display_order: items.length + 1 });
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── selection ── */
  const toggleSelectAll = () => {
    setSelected(selected.length === pageItems.length ? [] : pageItems.map(i => i.id));
  };
  const toggleSelect = (id: number) => {
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading && !items.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 pt-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, style: { background: '#10B981' } },
          error: { duration: 4000, style: { background: '#EF4444' } },
          loading: { duration: Infinity },
        }}
      />
      <div className={`bg-transparent font-sans flex flex-col flex-1 min-h-0 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : ''}`}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; backdrop-filter: blur(0px); background-color: rgba(15, 23, 42, 0); }
            to { opacity: 1; backdrop-filter: blur(8px); background-color: rgba(15, 23, 42, 0.4); }
          }
          @keyframes modalZoomIn {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-modal-backdrop {
            animation: modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-modal-content {
            animation: modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

        {/* Stats Cards - Compressed & High Density & Glassmorphic */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-100/40 border-blue-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Studies</p>
            <p className="text-base font-extrabold text-blue-600 mt-1">{total}</p>
          </div>
          <div className="bg-green-100/40 border-green-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active</p>
            <p className="text-base font-extrabold text-green-600 mt-1">{active}</p>
          </div>
          <div className="bg-red-100/40 border-red-100/30 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex flex-col justify-between">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inactive</p>
            <p className="text-base font-extrabold text-red-600 mt-1">{inactive}</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            onClick={() => setModal(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg items-center gap-1.5 transition-all shadow-sm text-xs font-semibold flex cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Case Study</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeFilter}
                onChange={e => { setFilter(e.target.value as any); setPage(1); }}
                className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
              >
                {[5, 10, 25, 50].map(n => <option key={n} value={n}>Show {n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Bulk Actions ── */}
        {selected.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{selected.length} selected</span>
            </div>
            <button onClick={handleBulkDeleteClick} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition cursor-pointer">
              Delete ({selected.length})
            </button>
          </div>
        )}

        {/* ── Grid View (mobile) ── */}
        {viewMode === 'grid' && (
          <div className="sm:hidden grid grid-cols-1 gap-3 mb-4">
            {pageItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} className="h-4 w-4 text-blue-600 rounded mt-0.5" />
                  <button
                    onClick={() => handleToggle(item.id, item.is_active)}
                    className={`px-2 py-0.5 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                )}
                <p className="font-semibold text-sm text-gray-900 mb-0.5">{item.title}</p>
                <p className="text-xs text-blue-600 mb-1">{item.category}</p>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                <p className="text-xs text-green-700 mb-2">📊 {item.metrics}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">{fmtDate(item.created_at)}</span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded cursor-pointer transition-all"><Edit size={12} /></button>
                    <button onClick={() => handleDeleteClick(item.id)} className="p-1 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Table View ── */}
        {viewMode === 'table' && (
          <div className="flex flex-col flex-1 min-h-0 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {pageItems.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-600 text-sm sm:text-lg font-bold">No case studies found</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="min-w-full border-collapse border border-slate-300">
                    <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                      <tr>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                          <div className="flex items-center">
                            <input type="checkbox" checked={selected.length === pageItems.length && pageItems.length > 0} onChange={toggleSelectAll} className="h-3 w-3 text-[#0D47A1] rounded cursor-pointer" />
                          </div>
                        </th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">Order</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">Image</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">Title</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">Category</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-b border-slate-300">Metrics</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-r border-b border-slate-300">Status</th>
                        <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 border-r border-b border-slate-300">Date</th>
                        <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16 border-b border-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {pageItems.map(item => (
                        <tr key={item.id} className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200">
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex items-center">
                              <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} className="h-3 w-3 text-[#0D47A1] rounded cursor-pointer" />
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleReorder(item.id, 'up')} disabled={item.display_order === 0} className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer">
                                  <MoveUp size={11} className="text-slate-600" />
                                </button>
                                <span className="font-bold text-slate-800 text-[11px] min-w-[16px] text-center">{item.display_order + 1}</span>
                                <button onClick={() => handleReorder(item.id, 'down')} disabled={item.display_order === items.length - 1} className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer">
                                  <MoveDown size={11} className="text-slate-600" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.title} className="w-14 h-10 object-cover rounded border border-slate-200" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-14 h-10 rounded bg-slate-100 flex items-center justify-center">
                                <ImageIcon className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <p className="font-bold text-slate-800 text-[11px] leading-tight">{item.title}</p>
                            <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 leading-none">{item.description}</p>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold rounded-full whitespace-nowrap">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <p className="text-[10px] text-slate-600 line-clamp-2 max-w-[200px] leading-tight">{item.metrics}</p>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200">
                            <button
                              onClick={() => handleToggle(item.id, item.is_active)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${item.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                            >
                              {item.is_active ? <><Eye className="w-2.5 h-2.5" />Active</> : <><EyeOff className="w-2.5 h-2.5" />Inactive</>}
                            </button>
                          </td>
                          <td className="px-2 py-1 border-r border-b border-slate-200 text-[10px] text-slate-500 font-semibold">{fmtDate(item.created_at)}</td>
                          <td className="px-2 py-1 border-b border-slate-200 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleEdit(item)} className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all" title="Edit"><Edit size={11} /></button>
                              <button onClick={() => handleDeleteClick(item.id)} className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all" title="Delete"><Trash2 size={11} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filtered.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
                        <span className="hidden sm:inline">Showing </span>
                        <span className="font-semibold text-gray-800">{(currentPage - 1) * perPage + 1}</span>
                        <span className="hidden sm:inline"> – </span>
                        <span className="sm:hidden">-</span>
                        <span className="font-semibold text-gray-800">
                          {Math.min(currentPage * perPage, filtered.length)}
                        </span>
                        <span className="hidden sm:inline"> of </span>
                        <span className="sm:hidden">/</span>
                        <span className="font-semibold text-gray-800">{filtered.length}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1 sm:p-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>

                        {/* Desktop page numbers */}
                        <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pg: number;
                            if (totalPages <= 5) pg = i + 1;
                            else if (currentPage <= 3) pg = i + 1;
                            else if (currentPage >= totalPages - 2) pg = totalPages - 4 + i;
                            else pg = currentPage - 2 + i;
                            return (
                              <button
                                key={pg}
                                onClick={() => setPage(pg)}
                                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${currentPage === pg
                                  ? 'bg-[#0076d8] text-white font-medium shadow-sm'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                {pg}
                              </button>
                            );
                          })}
                        </div>

                        {/* Mobile page indicator */}
                        <span className="sm:hidden text-[10px] font-medium text-gray-700 px-1">
                          {currentPage}/{totalPages}
                        </span>

                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1 sm:p-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 overflow-hidden animate-modal-content">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  {editing ? 'Edit Case Study' : 'Create Case Study'}
                </h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {editing ? 'Modify case study properties and metrics' : 'Publish a new client success story'}
                </p>
              </div>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                <X size={14} />
              </button>
            </div>

            {/* Body - Compact 2-column layout (Non-scrollable) */}
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Enterprise Cloud Migration..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                      {errors.title && <p className="text-[9px] text-red-500 mt-0.5 font-semibold">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                        placeholder="Cloud Computing, AI..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                      {errors.category && <p className="text-[9px] text-red-500 mt-0.5 font-semibold">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Metrics / Results <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.metrics}
                        onChange={e => setForm(p => ({ ...p, metrics: e.target.value }))}
                        placeholder="Reduced costs by 42%..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                      />
                      {errors.metrics && <p className="text-[9px] text-red-500 mt-0.5 font-semibold">{errors.metrics}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={formData.display_order}
                          onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) }))}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div className="flex items-center justify-center h-full pt-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]"></div>
                          <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description & Image */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Describe the client's success story details..."
                        className="w-full h-[96px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none overflow-hidden font-semibold text-slate-800 placeholder-slate-400 resize-none overflow-hidden"
                      />
                      {errors.description && <p className="text-[9px] text-red-500 mt-0.5 font-semibold">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Cover Image
                      </label>
                      <div className="border border-dashed border-slate-200 bg-slate-50 rounded-xl p-3 flex items-center justify-between gap-3 h-[72px]">
                        <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />

                        {uploadingImg ? (
                          <div className="flex items-center gap-2 mx-auto">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Uploading...</span>
                          </div>
                        ) : formData.image_url ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <img
                                src={formData.image_url}
                                alt="Preview"
                                className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Uploaded</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setForm(p => ({ ...p, image_url: '' }));
                                setFile(null);
                                if (fileRef.current) fileRef.current.value = '';
                              }}
                              className="text-[9px] text-red-600 hover:text-red-800 font-bold uppercase tracking-wider transition cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="px-2.5 py-1.5 text-[9px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition cursor-pointer"
                            >
                              Choose Image
                            </button>
                            <span className="text-[8px] text-slate-400 font-semibold">
                              PNG, JPG, WEBP up to 5MB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingImg}
                    className="px-4 py-2 bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <span>{saving ? 'Saving...' : editing ? 'Update Case Study' : 'Create Case Study'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop">
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsDeleteConfirmOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetIds(null);
            }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 animate-modal-content">
            <h3 className="text-base font-extrabold text-slate-800">Confirm Delete</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Are you sure you want to delete {deleteTargetIds ? `${deleteTargetIds.length} item(s)` : 'this item'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleteConfirmOpen(false);
                  if (deleteTargetId !== null) {
                    await proceedDelete(deleteTargetId);
                  } else if (deleteTargetIds !== null) {
                    await proceedBulkDelete(deleteTargetIds);
                  }
                  setDeleteTargetId(null);
                  setDeleteTargetIds(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyCMS;
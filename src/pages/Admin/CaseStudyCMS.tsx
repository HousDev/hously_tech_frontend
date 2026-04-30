// pages/Admin/CaseStudyCMS.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown,
  X, Search, Filter, ChevronLeft, ChevronRight, Check,
  BookOpen, Grid, List, Image as ImageIcon,
} from 'lucide-react';
import { caseStudyApi, type CaseStudy } from '../../lib/caseStudyApi';
import { toast, Toaster } from 'react-hot-toast';

interface Props { isSidebarOpen?: boolean; }

const EMPTY_FORM = {
  title: '', category: '', description: '', metrics: '',
  image_url: '', display_order: 0, is_active: true,
};

const CaseStudyCMS = ({ isSidebarOpen = false }: Props) => {
  const [items, setItems]           = useState<CaseStudy[]>([]);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState<CaseStudy | null>(null);
  const [isModalOpen, setModal]     = useState(false);
  const [formData, setForm]         = useState({ ...EMPTY_FORM });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [saving, setSaving]         = useState(false);
  const [uploadingImg, setUploadImg]= useState(false);
  const [selectedFile, setFile]     = useState<File | null>(null);
  const [searchTerm, setSearch]     = useState('');
  const [activeFilter, setFilter]   = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setPage]      = useState(1);
  const [perPage, setPerPage]       = useState(10);
  const [selected, setSelected]     = useState<number[]>([]);
  const [viewMode, setView]         = useState<'table' | 'grid'>('table');
  const fileRef = useRef<HTMLInputElement>(null);

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
  const total    = items.length;
  const active   = items.filter(i => i.is_active).length;
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
  const totalPages  = Math.ceil(filtered.length / perPage);
  const pageItems   = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* ── validate ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim())       e.title       = 'Title is required';
    if (!formData.category.trim())    e.category    = 'Category is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.metrics.trim())     e.metrics     = 'Metrics is required';
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
    toast.success('Image uploaded successfully!');
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
      toast.success('Image uploaded!');
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
      toast.success('Case study created successfully!', { id: t });
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

  /* ── delete ── */
  const handleDelete = async (id: number) => {
  const t = toast.loading('Deleting...');
  try {
    await caseStudyApi.delete(id);
    toast.success('Deleted successfully!', { id: t });
    fetchAll();
  } catch {
    toast.error('Delete failed', { id: t });
  }
};

 const handleBulkDelete = async () => {
  if (!selected.length) {
    toast.error('Select items first');
    return;
  }
  const t = toast.loading(`Deleting ${selected.length} case study(s)...`);
  try {
    await caseStudyApi.bulkDelete(selected);
    toast.success(`Deleted ${selected.length} case study(s)`, { id: t });
    setSelected([]);
    fetchAll();
  } catch {
    toast.error('Bulk delete failed', { id: t });
  }
};
  /* ── toggle ── */
 const handleToggle = async (id: number, current: boolean) => {
  const t = toast.loading(current ? 'Deactivating...' : 'Activating...');
  try {
    await caseStudyApi.toggleActive(id);
    setItems(p => p.map(i => i.id === id ? { ...i, is_active: !current } : i));
    toast.success(`Case study ${!current ? 'activated' : 'deactivated'}`, { id: t });
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
    <div className="bg-white ">
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
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0' : ''}`}>

        {/* ── Header ── */}
      <div className="sticky top-0 sm:top-4 lg:top-16 z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4">
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-white/20 p-1 rounded-md">
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-bold">Case Studies Management</h1>
          <p className="text-black text-[9px] sm:text-xs hidden sm:block">Manage case studies for your website</p>
        </div>
      </div>
      <button
          onClick={() => setModal(true)}
          className="sm:hidden flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-2.5 py-2 rounded-md items-center gap-1.5 text-xs"
        >
          <Plus size={14} />
          <span className="font-medium">Add Case Study</span>
        </button>
        <button
          onClick={() => setModal(true)}
          className="hidden sm:flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
        >
          <Plus size={14} />
          <span className="font-medium">Add Case Study</span>
        </button>
    </div>
  </div>

  <div className="bg-white rounded-b-lg sm:rounded-b-xl px-2 py-2 sm:px-3 sm:py-2.5">
    <div className="flex justify-between items-center mb-2 sm:mb-2.5">
      <div className="flex items-baseline gap-2">
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800">Case Studies ({items.length})</h2>
        <span className="text-[11px] text-gray-500 hidden sm:inline">Manage success stories</span>
      </div>
      <div className="flex items-center gap-1.5">
        {/* <button
          onClick={() => setModal(true)}
          className="hidden sm:flex bg-[#0076d8] hover:bg-[#0066c0] text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
        >
          <Plus size={14} />
          <span className="font-medium">Add Case Study</span>
        </button> */}
        <div className="sm:hidden flex gap-1.5">
          <button onClick={() => setView('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setView('table')} className={`p-1 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}>
            <List size={16} />
          </button>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="hidden sm:grid grid-cols-3 gap-1.5 mb-2 sm:mb-2.5">
      {[
        { label: 'Total', val: total, color: 'blue', icon: <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /> },
        { label: 'Active', val: active, color: 'green', icon: <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> },
        { label: 'Inactive', val: inactive, color: 'red', icon: <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" /> },
      ].map(s => (
        <div key={s.label} className="bg-white rounded border border-gray-200 px-2 py-1 sm:px-3 sm:py-1.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-xs text-gray-500">{s.label}</p>
              <p className={`text-sm sm:text-base font-bold text-${s.color}-600`}>{s.val}</p>
            </div>
            <div className={`p-1 bg-${s.color}-100 rounded-lg`}>{s.icon}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Mobile stats */}
    <div className="sm:hidden grid grid-cols-3 gap-1.5 mb-2">
      {[['Total', total, 'blue'], ['Active', active, 'green'], ['Inactive', inactive, 'red']].map(([l, v, c]) => (
        <div key={String(l)} className="bg-white rounded border border-gray-200 px-1.5 py-1 text-center">
          <p className="text-[9px] text-gray-500">{l}</p>
          <p className={`text-sm font-bold text-${c}-600`}>{v}</p>
        </div>
      ))}
    </div>

    {/* Search & filter */}
    <div className="bg-white rounded p-1.5 sm:p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
          <input
            type="text" placeholder="Search case studies..." value={searchTerm}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8]"
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Filter className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 hidden sm:block" />
          <select
            value={activeFilter}
            onChange={e => { setFilter(e.target.value as any); setPage(1); }}
            className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="px-1.5 py-1 sm:px-2 sm:py-1 text-[10px] sm:text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#0076d8] focus:border-[#0076d8] bg-white"
          >
            {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
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
            <button onClick={handleBulkDelete} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700">
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
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Table View ── */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {pageItems.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No case studies found</p>
                {!searchTerm && activeFilter === 'all' && (
                  <button onClick={() => setModal(true)} className="mt-4 bg-[#0076d8] text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto text-sm">
                    <Plus size={16} /><span>Add First Case Study</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto max-h-[calc(100vh-340px)] sm:max-h-[calc(100vh-390px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left w-10">
                          <input type="checkbox" checked={selected.length === pageItems.length && pageItems.length > 0} onChange={toggleSelectAll} className="h-4 w-4 text-blue-600 rounded" />
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-16">Order</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-20">Image</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-32">Category</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Metrics</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-24">Status</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-24">Date</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pageItems.map(item => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} className="h-4 w-4 text-blue-600 rounded" />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-col items-center space-y-1">
                              <button onClick={() => handleReorder(item.id, 'up')} disabled={item.display_order === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                <MoveUp size={12} className="text-gray-600" />
                              </button>
                              <span className="font-bold text-gray-900 text-sm">{item.display_order + 1}</span>
                              <button onClick={() => handleReorder(item.id, 'down')} disabled={item.display_order === items.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                                <MoveDown size={12} className="text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.title} className="w-14 h-10 object-cover rounded-lg border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                          </td>
                         <td className="px-2 py-2 sm:px-3 sm:py-3">
  <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs rounded-full whitespace-nowrap">
    {item.category}
  </span>
</td>
                          <td className="px-3 py-3">
                            <p className="text-xs text-gray-700 line-clamp-2 max-w-[200px]">{item.metrics}</p>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleToggle(item.id, item.is_active)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all ${item.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                            >
                              {item.is_active ? <><Eye className="w-3 h-3 mr-1" />Active</> : <><EyeOff className="w-3 h-3 mr-1" />Inactive</>}
                            </button>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-500">{fmtDate(item.created_at)}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100" title="Edit"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-100" title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
               {filtered.length > 0 && (
  <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      <p className="text-[9px] sm:text-xs text-gray-600">
        <span className="font-semibold text-gray-800">{(currentPage - 1) * perPage + 1}</span>
        <span className="hidden sm:inline"> – </span>
        <span className="sm:hidden">-</span>
        <span className="font-semibold text-gray-800">{Math.min(currentPage * perPage, filtered.length)}</span>
        <span className="hidden sm:inline"> of </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-gray-800">{filtered.length}</span>
      </p>
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
                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${
                  currentPage === pg 
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

      {/* ── Modal ── */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop - Black */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      onClick={closeModal}
    />

    {/* Center wrapper */}
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl bg-white rounded-lg sm:rounded-xl shadow-lg">
        
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-lg sm:rounded-t-xl">
          <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-[#FFC107] rounded-md w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[9px] sm:text-xs text-[#0D47A1] shrink-0">
                cs
              </div>
              <div>
                <h2 className="text-white font-medium text-xs sm:text-sm">
                  {editing ? 'Edit Case Study' : 'Add New Case Study'}
                </h2>
                <p className="text-white/70 text-[8px] sm:text-[10px] hidden sm:block">
                  {editing ? 'Update case study details' : 'Add a new case study to your portfolio'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center cursor-pointer shrink-0 hover:bg-white/20 transition"
            >
              <X size={10} className="sm:w-3 sm:h-3" />
            </button>
          </div>
        </div>

        {/* ─── Scrollable Body ─── */}
        <div className="max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
          <div className="p-2.5 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">

              {/* ROW 1: Title + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Enterprise Cloud Migration..."
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                  />
                  {errors.title && <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.title}</p>}
                </div>
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    placeholder="Cloud Computing, AI, DevOps..."
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                  />
                  {errors.category && <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.category}</p>}
                </div>
              </div>

              {/* ROW 2: Description */}
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the case study..."
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                />
                {errors.description && <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.description}</p>}
              </div>

              {/* ROW 3: Metrics */}
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Metrics / Results <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.metrics}
                  onChange={e => setForm(p => ({ ...p, metrics: e.target.value }))}
                  placeholder="Reduced costs by 42%, improved uptime..."
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                />
                {errors.metrics && <p className="text-[7px] sm:text-[10px] text-red-500 mt-0.5">{errors.metrics}</p>}
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 4: Display Order + Active */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) }))}
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] text-center"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-4 sm:mt-5">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600"
                  />
                  <span className="text-[9px] sm:text-xs text-gray-700">Active (visible on site)</span>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 5: Image Upload */}
              <div>
                <label className="block mb-1 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Cover Image
                </label>
                
                <div className="border border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center bg-[#fafbff]">
  <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />

  {uploadingImg ? (
    <div className="py-2">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
      <p className="text-[9px] sm:text-xs text-blue-600">Uploading image...</p>
    </div>
  ) : formData.image_url ? (
    <div>
      <div className="flex justify-center mb-2">
        <img 
          src={formData.image_url} 
          alt="Preview" 
          className="w-20 h-16 object-cover rounded-lg border border-gray-200" 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setForm(p => ({ ...p, image_url: '' }));
          setFile(null);
          if (fileRef.current) fileRef.current.value = '';
        }}
        className="text-[8px] sm:text-[9px] text-red-600 hover:text-red-800 transition"
      >
        Remove Image
      </button>
    </div>
  ) : (
    <div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="text-[9px] sm:text-xs text-blue-600 font-medium hover:underline"
      >
        Click to browse image
      </button>
      <p className="text-[7px] sm:text-[8px] text-gray-400 mt-0.5">
        PNG, JPG, WEBP up to 5MB
      </p>
    </div>
  )}
</div>

                {formData.image_url && !selectedFile && (
                  <div className="mt-2 flex items-center gap-2 sm:gap-3">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg border border-gray-200 bg-gray-50"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                      <p className="text-[8px] sm:text-[9px] text-gray-500 mb-0.5">Current image</p>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                        className="text-[8px] sm:text-[9px] text-red-600 hover:text-red-800 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* Form Actions */}
              <div className="flex justify-end gap-1.5 sm:gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-300 rounded-lg text-[9px] sm:text-xs text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImg}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded-lg text-[9px] sm:text-xs hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 transition"
                >
                  <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CaseStudyCMS;
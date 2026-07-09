import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  ArrowLeft,
  Upload,
  Download,
  Search,
  Database,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import { masterDataAPI } from "../../lib/masterApi";
import { ImportModal } from "./ImportModal";
import { toast } from "react-toastify";
import type { ToastContentProps } from "react-toastify";

type ImportType = "master" | "values";

interface Value {
  id: string;
  value: string;
  status: string;
}

interface MasterItem {
  id: string;
  name: string;
  status: string;
  values: Value[];
  valueCount: number;
}

interface Tab {
  id: string;
  title: string;
}

const tabs: Tab[] = [
  { id: "common", title: "Common Master" },
  { id: "enquiry", title: "Enquiry Master" },
  { id: "meeting", title: "Meeting Master" },
  { id: "career", title: "Career Master" },
];

type TabId = "common" | "enquiry" | "meeting" | "career";

export default function MasterDataPage() {
  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle("Master Data");
      setHeaderSubtitle("Manage systems wide tags and dynamic drop-down options");
    }
  }, [setHeaderTitle, setHeaderSubtitle]);

  const [activeId, setActiveId] = useState<TabId>(() => {
    const savedTab = localStorage.getItem("masterDataActiveTab");
    return (savedTab && tabs.some(t => t.id === savedTab)) ? savedTab as TabId : "common";
  });

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

  const [items, setItems] = useState<MasterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValuesLoading, setIsValuesLoading] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "master" | "value"; id: string; name: string } | null>(null);

  const [currentView, setCurrentView] = useState<"list" | "values">("list");
  const [selectedMaster, setSelectedMaster] = useState<MasterItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<ImportType>("master");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<MasterItem | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [valueStatus, setValueStatus] = useState("Active");
  const [editingValue, setEditingValue] = useState<Value | null>(null);

  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const isAllSelected = (selectedMaster?.values?.length ?? 0) > 0 && selectedValueIds.length === (selectedMaster?.values?.length ?? 0);

  const loadMasterTypes = async () => {
    try {
      setIsLoading(true);
      const data = await masterDataAPI.getAllMasterTypes(activeId);
      console.log("master data : ", data)
      const rawItems = Array.isArray(data) ? data : [];

      const itemsWithValueCounts = await Promise.all(
        rawItems.map(async (item: any) => {
          try {
            const values = await masterDataAPI.getMasterValues(item.id);
            return {
              ...item,
              values: Array.isArray(values) ? values : [],
              valueCount: values?.length || 0
            };
          } catch {
            return { ...item, values: [], valueCount: 0 };
          }
        })
      );

      setItems(itemsWithValueCounts);
    } catch (error) {
      console.error("Error loading master types:", error);
      toast.error("Error loading master types ❌");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("masterDataActiveTab", activeId);
  }, [activeId]);

  useEffect(() => {
    loadMasterTypes();
  }, [activeId]);

  const loadMasterValues = async (masterTypeId: string) => {
    try {
      setIsValuesLoading(true);
      const values = await masterDataAPI.getMasterValues(masterTypeId);
      setSelectedMaster(prev => prev ? { ...prev, values: Array.isArray(values) ? values : [] } : null);
      setItems(prev => prev.map(item =>
        item.id === masterTypeId ? {
          ...item,
          values: Array.isArray(values) ? values : [],
          valueCount: values?.length || 0
        } : item
      ));
    } catch (error) {
      console.error("Error loading master values:", error);
      toast.error("Error loading master values ❌");
    } finally {
      setIsValuesLoading(false);
    }
  };

  const toggleSelectAll = () => {
    setSelectedValueIds(isAllSelected ? [] : selectedMaster?.values.map(v => v.id) || []);
  };

  const toggleSelectValue = (id: string) => {
    setSelectedValueIds(prev => prev.includes(id) ? prev.filter(valId => valId !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!selectedMaster || selectedValueIds.length === 0) return;

    toast.info(
      (props: ToastContentProps) => (
        <div>
          <p className="text-sm mb-2">Delete {selectedValueIds.length} selected values?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await Promise.all(selectedValueIds.map(id => masterDataAPI.deleteMasterValue(id)));
                  const updatedValues = selectedMaster.values.filter(v => !selectedValueIds.includes(v.id));

                  setItems(prev => prev.map(item =>
                    item.id === selectedMaster.id
                      ? { ...item, values: updatedValues, valueCount: updatedValues.length }
                      : item
                  ));

                  setSelectedMaster(prev => prev ? { ...prev, values: updatedValues } : null);
                  setSelectedValueIds([]);
                  toast.success("Values deleted successfully 🗑️");
                  props.closeToast();
                } catch (error) {
                  console.error("Error deleting values:", error);
                  toast.error("Error deleting values ❌");
                  props.closeToast();
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-xs"
            >
              Yes
            </button>
            <button onClick={props.closeToast} className="px-3 py-1 bg-gray-300 rounded text-xs">
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, draggable: false, position: "top-center" }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditMode && currentItem) {
        await masterDataAPI.updateMasterType(currentItem.id, { name, status });
        loadMasterTypes();
        toast.success("Master type updated successfully ✅");
      } else {
        await masterDataAPI.createMasterType({
          tabId: activeId,
          name,
          status
        });
        loadMasterTypes();
        toast.success("Master type created successfully ✅");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving master type:", error);
      toast.error("Error saving master type ❌");
    }
  };

  const handleEdit = (item: MasterItem) => {
    setCurrentItem(item);
    setName(item.name);
    setStatus(item.status);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (item: MasterItem) => {
    setDeleteTarget({
      type: "master",
      id: item.id,
      name: item.name
    });
    setDeleteConfirmOpen(true);
  };

  const resetForm = () => {
    setName("");
    setStatus("Active");
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentItem(null);
  };

  const handleCardClick = async (master: MasterItem) => {
    setSelectedMaster(master);
    setCurrentView("values");
    setSearchTerm("");
    setSelectedValueIds([]);
    await loadMasterValues(master.id);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedMaster(null);
    setSearchTerm("");
    setSelectedValueIds([]);
  };

  const handleValueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedMaster?.id) {
      toast.error("Invalid master ❌");
      return;
    }

    try {
      if (editingValue) {
        await masterDataAPI.updateMasterValue(editingValue.id, {
          value: valueInput,
          status: valueStatus,
        });
        toast.success("Value updated successfully ✅");
      } else {
        await masterDataAPI.createMasterValue(selectedMaster.id, {
          value: valueInput,
          status: valueStatus,
        });
        toast.success("Value created successfully ✅");
      }
      loadMasterValues(selectedMaster.id);
      resetValueForm();
    } catch (error) {
      console.error("Error saving value:", error);
      toast.error("Error saving value ❌");
    }
  };

  const handleEditValue = (value: Value) => {
    setValueInput(value.value);
    setValueStatus(value.status);
    setEditingValue(value);
    setIsValueModalOpen(true);
  };

  const handleDeleteValue = (value: Value) => {
    setDeleteTarget({
      type: "value",
      id: value.id,
      name: value.value
    });
    setDeleteConfirmOpen(true);
  };

  const executeDeletion = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "master") {
        await masterDataAPI.deleteMasterType(deleteTarget.id);
        setItems(prev => prev.filter(item => item.id !== deleteTarget.id));
        if (selectedMaster?.id === deleteTarget.id) {
          setCurrentView("list");
          setSelectedMaster(null);
          setSelectedValueIds([]);
        }
        toast.success("Master type deleted successfully 🗑️");
      } else {
        await masterDataAPI.deleteMasterValue(deleteTarget.id);
        if (selectedMaster) {
          const updatedValues = selectedMaster.values.filter(v => v.id !== deleteTarget.id);
          setItems(prev => prev.map(item =>
            item.id === selectedMaster.id
              ? { ...item, values: updatedValues, valueCount: updatedValues.length }
              : item
          ));
          setSelectedMaster(prev => prev ? { ...prev, values: updatedValues } : prev);
          setSelectedValueIds(prev => prev.filter(id => id !== deleteTarget.id));
        }
        toast.success("Option value deleted successfully 🗑️");
      }
    } catch (error) {
      console.error(`Error deleting ${deleteTarget.type}:`, error);
      toast.error(`Error deleting ${deleteTarget.type} ❌`);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const resetValueForm = () => {
    setValueInput("");
    setValueStatus("Active");
    setIsValueModalOpen(false);
    setEditingValue(null);
  };

  const handleExport = async () => {
    if (!selectedMaster) return;

    try {
      const blob = await masterDataAPI.exportMasterValues(selectedMaster.id);
      downloadFile(blob, `${selectedMaster.name}_values.csv`);
      toast.success(`Values exported successfully ✅`);
    } catch (error) {
      console.error("Error exporting values:", error);
      toast.error("Error exporting values ❌");
    }
  };

  const handleImport = async (file: File) => {
    try {
      if (importType === "master") {
        await masterDataAPI.importMasterTypes(activeId, file);
        await loadMasterTypes();
        toast.success("Master types imported successfully ✅");
      } else {
        if (!selectedMaster) {
          toast.error("Please select a master first ❌");
          return;
        }
        await masterDataAPI.importMasterValues(selectedMaster.id, file);
        await loadMasterValues(selectedMaster.id);
        toast.success(`Values imported successfully ✅`);
      }
    } catch (error) {
      console.error(`Error importing:`, error);
      toast.error(`Failed to import ❌`);
    }
  };

  const handleMasterExport = async () => {
    try {
      const blob = await masterDataAPI.exportMasterTypes(activeId);
      downloadFile(blob, `${activeTab.title}_master_types.csv`);
      toast.success("Master types exported successfully ✅");
    } catch (error) {
      console.error("Error exporting master types:", error);
      toast.error("Error exporting master types ❌");
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const filteredValues = selectedMaster?.values
    ?.filter(value => value.value.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const filteredMasterItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-6 pt-0 w-full space-y-6 flex flex-col">
      {currentView === "list" ? (
        <>
          {/* Sticky Header block for List View */}
          <div className="sticky top-0 bg-[#f3f6fb] pt-6 pb-4 z-10 space-y-4">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-white px-6 rounded-xl gap-6 select-none overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveId(t.id as TabId);
                setCurrentView("list");
                setSelectedMaster(null);
                setSearchTerm("");
              }}
              className={`relative py-3.5 text-xs font-semibold transition-all whitespace-nowrap ${
                t.id === activeId
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search master types..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Buttons Group */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setImportType("master");
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Upload size={14} className="text-white" />
              <span>Import</span>
            </button>

            <button
              onClick={handleMasterExport}
              disabled={!filteredMasterItems.length}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              <Download size={14} className="text-white" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>Create Master</span>
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-2 mt-2 select-none">
          <div className="h-4 w-1 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{activeTab.title}</h2>
        </div>
      </div>

          {/* Master Types Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4" />
              <p className="text-gray-500 text-sm">Loading master types...</p>
            </div>
          ) : filteredMasterItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                <Database size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">No master types found</h3>
              <p className="text-gray-500 text-xs max-w-sm mb-4">Common master is currently empty. Create master types to start organizing options.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus size={14} />
                <span>Create One</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMasterItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="group bg-white p-5 rounded-xl hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors flex-1">
                        {item.name}
                      </h3>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-1 font-medium">
                      {item.valueCount} {item.valueCount === 1 ? 'option' : 'options'} configured
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${item.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {item.status}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 hover:underline">
                      Manage Values &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* VALUES VIEW */
        <>
          {/* Sticky Header block for Values View */}
          <div className="sticky top-0 bg-[#f3f6fb] pt-6 pb-4 z-10 space-y-4">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 bg-white px-6 rounded-xl gap-6 select-none overflow-x-auto">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id as TabId);
                    setCurrentView("list");
                    setSelectedMaster(null);
                    setSearchTerm("");
                  }}
                  className={`relative py-3.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    t.id === activeId
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Master List</span>
            </button>

            {/* Header info block */}
            <div className="p-6 bg-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">{selectedMaster?.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedMaster?.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${selectedMaster?.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {selectedMaster?.status}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {selectedMaster?.values?.length} total records
                  </span>
                </div>
              </div>

              {/* Actions bar for values */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search values..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-44 pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <button
                  onClick={() => {
                    setImportType("values");
                    setIsImportModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Upload size={13} className="text-white" />
                  <span>Import</span>
                </button>

                <button
                  onClick={handleExport}
                  disabled={!selectedMaster?.values?.length}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                >
                  <Download size={13} className="text-white" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setIsValueModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={13} />
                  <span>Add Value</span>
                </button>

                {selectedValueIds.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete ({selectedValueIds.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-xl overflow-hidden pb-6">
            {isValuesLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2" />
                <p className="text-gray-500 text-xs">Loading values...</p>
              </div>
            ) : filteredValues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-xs">
                  {selectedMaster?.values?.length === 0 ? (
                    "No values added yet. Click 'Add Value' to create one."
                  ) : (
                    `No values found matching "${searchTerm}"`
                  )}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-150 bg-slate-50 text-gray-500 font-semibold select-none">
                      <th className="p-3.5 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                      </th>
                      <th className="p-3.5 w-16 text-center">S.No</th>
                      <th className="p-3.5">Option Value</th>
                      <th className="p-3.5 w-32">Status</th>
                      <th className="p-3.5 w-24 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredValues.map((value, index) => (
                      <tr key={value.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedValueIds.includes(value.id)}
                            onChange={() => toggleSelectValue(value.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                          />
                        </td>
                        <td className="p-3.5 text-center text-gray-400 font-medium">{index + 1}</td>
                        <td className="p-3.5 text-gray-900 font-medium">{value.value}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            value.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            {value.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-6">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEditValue(value)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteValue(value)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal - Create/Edit Master Type */}
      <Modal isOpen={isModalOpen} onClose={resetForm} title={isEditMode ? "Edit Master Type" : "Create Master Type"}>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
              placeholder="e.g. Lead Status, Property Location"
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              {isEditMode ? "Save Changes" : "Create Master"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal - Create/Edit Value */}
      <Modal isOpen={isValueModalOpen} onClose={resetValueForm} title={editingValue ? "Edit Option Value" : "Add Option Value"}>
        <form onSubmit={handleValueSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Value</label>
            <input
              type="text"
              value={valueInput}
              onChange={e => setValueInput(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
              placeholder="e.g. Warm, Hot, Cold, Ready to Move"
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Status</label>
            <select
              value={valueStatus}
              onChange={e => setValueStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetValueForm}
              className="px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              {editingValue ? "Save Value" : "Add Value"}
            </button>
          </div>
        </form>
      </Modal>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        title={`Import ${importType === "master" ? "Common Master Types" : selectedMaster?.name + " Values"}`}
        type={importType}
      />

      {/* Modal - Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        title="Confirm Deletion"
        width="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-100 flex items-start gap-2.5">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold mb-0.5 text-red-950">Warning: This action is permanent!</h4>
              <p className="text-[11px] leading-relaxed text-red-900">
                Are you sure you want to delete the {deleteTarget?.type === "master" ? "master type" : "option value"}{" "}
                <strong className="font-bold text-red-950">"{deleteTarget?.name}"</strong>? All associated records will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeleteTarget(null);
              }}
              className="px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDeletion}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
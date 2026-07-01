/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Linkedin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
  Grid,
  List,
  Instagram,
  Globe,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { teamApi, type TeamMember, type SocialLink } from '../../lib/teamApi';
import { useOutletContext } from 'react-router-dom';






interface TeamCMSProps {
  isSidebarOpen?: boolean;
}

const TeamCMS = ({ isSidebarOpen = false }: TeamCMSProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // States for search, filter and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  /* ── delete confirm states ── */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetIds, setDeleteTargetIds] = useState<number[] | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select team members to delete');
      return;
    }
    setDeleteTargetIds(selectedMembers);
    setIsDeleteConfirmOpen(true);
  };

  const proceedDelete = async (id: number) => {
    const deleteToast = toast.loading('Deleting team member...');
    try {
      await teamApi.delete(id);
      toast.success('Team member deleted successfully', { id: deleteToast });
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete team member', { id: deleteToast });
    }
  };

  const proceedBulkDelete = async (ids: number[]) => {
    const deleteToast = toast.loading(`Deleting ${ids.length} team member(s)...`);
    try {
      await teamApi.bulkDelete(ids);
      toast.success(`Successfully deleted ${ids.length} team member(s)`, { id: deleteToast });
      setSelectedMembers([]);
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      toast.error(error.message || 'Failed to delete team members', { id: deleteToast });
    }
  };
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "linkedin", url: "" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>() || {};

  useEffect(() => {
    if (setHeaderTitle && setHeaderSubtitle) {
      setHeaderTitle('Team Members CMS');
      setHeaderSubtitle(`Manage executive profile roles and contact linkages (${teamMembers.length} records)`);
    }
  }, [teamMembers.length, setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);




  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamApi.getAll(true); // true for admin (show all)
      const sortedMembers = members.sort((a, b) => a.display_order - b.display_order);
      setTeamMembers(sortedMembers);
    } catch (error: any) {
      console.error('Failed to fetch team members:', error);
      toast.error(error.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true);
      const result = await teamApi.uploadImage(file);
      return result.url; // Returns relative path like /uploads/team/filename.jpg
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, JPEG, GIF, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Auto upload immediately
    try {
      setUploadingImage(true);
      const uploadedUrl = await teamApi.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: uploadedUrl.url }));
      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }

    try {
      const uploadedUrl = await uploadImageToServer(selectedFile);

      setFormData({ ...formData, image_url: uploadedUrl });
      toast.success("Image uploaded successfully!");

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // TeamCMS.tsx - Social Links section fix

  // Add this helper function at the top of your component (after imports, before the component)
  const parseSocialLinks = (socialLinksData: any): SocialLink[] => {
    try {
      if (!socialLinksData) {
        return [];
      }

      // If it's already an array
      if (Array.isArray(socialLinksData)) {
        return socialLinksData;
      }

      // If it's a string, parse it
      if (typeof socialLinksData === "string") {
        const parsed = JSON.parse(socialLinksData);
        return Array.isArray(parsed) ? parsed : [];
      }

      // If it's an object, try to convert
      if (typeof socialLinksData === "object") {
        return [socialLinksData];
      }

      return [];
    } catch (error) {
      console.error(
        "Error parsing social links:",
        error,
        "Data:",
        socialLinksData
      );
      return [];
    }
  };


  const getWhatsappUrl = (url: string): string => {
    if (!url) return "#";

    // Clean the number - remove spaces, dashes, etc.
    const cleanNumber = url.replace(/[^\d]/g, "");

    // If it's already a full URL, return it
    if (url.startsWith("http")) return url;

    // If it's just a number, create WhatsApp link
    if (/^\d+$/.test(cleanNumber)) {
      return `https://wa.me/${cleanNumber}`;
    }

    return "#";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.role.trim()) {
      toast.error("Role is required");
      return;
    }

    if (!formData.image_url.trim()) {
      toast.error("Image is required");
      return;
    }

    // Validate WhatsApp URLs
    const whatsappLink = socialLinks.find(
      (link) => link.platform === "whatsapp"
    );
    if (
      whatsappLink &&
      whatsappLink.url &&
      !whatsappLink.url.match(/^[\d+\s\-()]+$/) &&
      !whatsappLink.url.startsWith("http")
    ) {
      toast.error(
        "Please enter a valid WhatsApp number (digits only with optional +, spaces, dashes, parentheses)"
      );
      return;
    }

    try {
      const payload = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
        social_links: socialLinks,
        display_order: editingMember ? editingMember.display_order : teamMembers.length,
      };


      if (editingMember) {
        await teamApi.update(editingMember.id, payload);
        toast.success("Team member updated successfully");
      } else {
        await teamApi.create(payload);
        toast.success("Team member created successfully");
      }

      fetchTeamMembers();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving team member:", error);
      toast.error(error.message || "Failed to save team member");
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      image_url: member.image_url || "",
      is_active: member.is_active,
    });

    // Parse social links - use social_links_parsed if available, otherwise parse
    let parsedLinks: SocialLink[] = [];
    if (member.social_links_parsed && member.social_links_parsed.length > 0) {
      parsedLinks = member.social_links_parsed;
    } else if (member.social_links) {
      parsedLinks = parseSocialLinks(member.social_links);
    }

    setSocialLinks(parsedLinks.length > 0 ? parsedLinks : [{ platform: "linkedin", url: "" }]);

    if (member.image_url) {
      setImagePreview(member.image_url);
    }

    setIsModalOpen(true);
  };

  /* Deletion triggers confirm modal */

  const handleToggleActive = async (memberId: number, currentStatus: boolean) => {
    const toggleToast = toast.loading(
      currentStatus ? "Deactivating team member..." : "Activating team member..."
    );

    try {
      await teamApi.toggleStatus(memberId);

      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, is_active: !currentStatus } : member
        )
      );

      toast.success(
        `Team member ${!currentStatus ? "activated" : "deactivated"} successfully`,
        { id: toggleToast }
      );
    } catch (error: any) {
      console.error("Toggle error:", error);
      toast.error(error.message || "Failed to toggle status", { id: toggleToast });
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select team members to update");
      return;
    }

    const toggleToast = toast.loading(
      `${activate ? "Activating" : "Deactivating"} ${selectedMembers.length} team member(s)...`
    );

    try {
      await teamApi.bulkToggleActive(selectedMembers);

      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          selectedMembers.includes(member.id) ? { ...member, is_active: activate } : member
        )
      );

      toast.success(
        `Successfully ${activate ? "activated" : "deactivated"} ${selectedMembers.length} team member(s)`,
        { id: toggleToast }
      );
    } catch (error: any) {
      console.error("Bulk toggle error:", error);
      toast.error(error.message || "Failed to update team members", { id: toggleToast });
    }
  };

  const handleReorder = async (memberId: number, direction: "up" | "down") => {
    const reorderToast = toast.loading("Reordering team members...");

    try {
      const currentIndex = teamMembers.findIndex((m) => m.id === memberId);
      if (currentIndex === -1) {
        toast.error("Team member not found", { id: reorderToast });
        return;
      }

      if (direction === "up" && currentIndex === 0) {
        toast.error("Already at the top", { id: reorderToast });
        return;
      }
      if (direction === "down" && currentIndex === teamMembers.length - 1) {
        toast.error("Already at the bottom", { id: reorderToast });
        return;
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const updatedMembers = [...teamMembers];
      [updatedMembers[currentIndex], updatedMembers[swapIndex]] = [
        updatedMembers[swapIndex],
        updatedMembers[currentIndex],
      ];

      // Update display_order
      const orderData = updatedMembers.map((member, index) => ({
        id: member.id,
        display_order: index,
      }));

      await teamApi.reorder(orderData);

      setTeamMembers(updatedMembers);
      toast.success("Team member moved successfully!", { id: reorderToast });
    } catch (error: any) {
      console.error("Reorder error:", error);
      toast.error(error.message || "Failed to move team member", { id: reorderToast });
      fetchTeamMembers(); // Refresh to fix any inconsistencies
    }
  };
  // CORRECT
  const getImageDisplayUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads/")) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setSelectedFile(null);
    setImagePreview("");
    setSocialLinks([{ platform: "linkedin", url: "" }]);
    setFormData({
      name: "",
      role: "",
      description: "",
      image_url: "",
      is_active: true,
    });

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const addSocialLink = () => {
    if (socialLinks.length >= 3) {
      toast.error("Maximum 3 social links allowed");
      return;
    }
    setSocialLinks([...socialLinks, { platform: "linkedin", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value as any };
    setSocialLinks(newLinks);
  };

  // Filter team members based on search and status
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.is_active) ||
      (statusFilter === "inactive" && !member.is_active);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate stats
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter((m) => m.is_active).length;
  const inactiveMembers = teamMembers.filter((m) => !m.is_active).length;

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedMembers.length === currentMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(currentMembers.map((member) => member.id));
    }
  };

  const handleSelectMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "instagram":
        return <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "whatsapp":
        return <FaWhatsapp className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn";
      case "instagram":
        return "Instagram";
      case "whatsapp":
        return "WhatsApp";
      default:
        return "Website";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 pt-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

      {/* Main Container */}
      <div
        className={`bg-transparent font-sans flex flex-col flex-1 min-h-0 transition-all duration-300 ${isSidebarOpen ? "ml-0 sm:ml-0" : ""
          }`}
      >


        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-100/40 border border-blue-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Members</p>
            <p className="text-sm font-extrabold text-blue-600">{totalMembers}</p>
          </div>
          <div className="bg-emerald-100/40 border border-emerald-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active</p>
            <p className="text-sm font-extrabold text-emerald-600">{activeMembers}</p>
          </div>
          <div className="bg-gray-100/40 border border-gray-100/30 rounded-xl px-3.5 py-2 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-between h-15">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inactive</p>
            <p className="text-sm font-extrabold text-slate-600">{inactiveMembers}</p>
          </div>
        </div>

        {/* Action Button Row - on top */}
        <div className="flex justify-end mb-2 mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-all shadow-sm text-[11px] font-bold cursor-pointer h-7 justify-center"
          >
            <Plus size={12} />
            <span>Add Member</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 w-full bg-white/60 focus:bg-white border border-slate-200/60 rounded-lg text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-[10px] sm:text-xs border border-slate-200/60 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/60 focus:bg-white cursor-pointer transition-all font-semibold text-slate-700 outline-none"
              >
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="25">Show 25</option>
              </select>
            </div>
          </div>
        </div>
        {/* Bulk Actions Bar - Hide when sidebar is open on mobile */}
        {selectedMembers.length > 0 &&
          (!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm font-medium text-blue-800">
                      {selectedMembers.length} selected
                    </span>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleBulkToggleActive(true)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkToggleActive(false)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleBulkDeleteClick}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0 cursor-pointer font-bold"
                >
                  Delete ({selectedMembers.length})
                </button>
              </div>
            </div>
          )}

        {/* Grid View for Mobile - Hide when sidebar is open */}
        {viewMode === "grid" &&
          (!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="sm:hidden grid grid-cols-1 gap-3 mb-4">
              {currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleReorder(member.id, "up")}
                          disabled={member.display_order === 0}
                          className="p-0.5 text-gray-500"
                        >
                          <MoveUp size={12} />
                        </button>
                        <span className="text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                          {member.display_order + 1}
                        </span>
                        <button
                          onClick={() => handleReorder(member.id, "down")}
                          disabled={
                            member.display_order === teamMembers.length - 1
                          }
                          className="p-0.5 text-gray-500"
                        >
                          <MoveDown size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleActive(member.id, member.is_active)
                      }
                      className={`px-2 py-0.5 rounded-full text-xs ${member.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {member.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.image_url ? (
                        <img
                          src={getImageDisplayUrl(member.image_url)}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">
                        {member.role}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {parseSocialLinks(member.social_links).map(
                          (social, index) => (
                            <a
                              key={index}
                              href={
                                social.platform === "whatsapp"
                                  ? getWhatsappUrl(social.url)
                                  : social.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-gray-600 hover:text-blue-600"
                              title={getPlatformLabel(social.platform)}
                            >
                              {getSocialIcon(social.platform)}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(member.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Table View - Hide when sidebar is open on mobile */}
        {viewMode === "table" &&
          (!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="flex flex-col flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 shadow-sm overflow-hidden">
              {currentMembers.length === 0 ? (
                <div className="p-6 sm:p-12 text-center">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-slate-600 text-sm sm:text-lg">
                    No team members found
                  </p>
                  {searchTerm || statusFilter !== "all" ? (
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  ) : (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 bg-[#0D47A1] hover:bg-[#1976D2] text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 mx-auto text-xs font-semibold cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add New Team Member</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="min-w-full border-collapse border border-slate-300">
                      <thead className="bg-slate-200/50 backdrop-blur-md sticky top-0 z-20">
                        <tr>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 border-r border-b border-slate-300">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  selectedMembers.length ===
                                  currentMembers.length &&
                                  currentMembers.length > 0
                                }
                                onChange={handleSelectAll}
                                className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                              />
                            </div>
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                            Order
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                            Image
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                            Name
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36 border-r border-b border-slate-300">
                            Role
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-40 border-r border-b border-slate-300">
                            Social Links
                          </th>
                          <th className="px-2 py-1 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-r border-b border-slate-300">
                            Status
                          </th>
                          <th className="px-2 py-1 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 border-b border-slate-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent">
                        {currentMembers.map((member) => {
                          return (
                            <tr
                              key={member.id}
                              className="hover:bg-blue-50/50 bg-white/20 transition-all duration-200"
                            >
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(
                                      member.id
                                    )}
                                    onChange={() =>
                                      handleSelectMember(member.id)
                                    }
                                    className="h-3 w-3 text-[#0D47A1] rounded focus:ring-[#0D47A1] cursor-pointer"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <div className="flex items-center space-x-1 justify-center">
                                  <button
                                    onClick={() =>
                                      handleReorder(member.id, "up")
                                    }
                                    disabled={member.display_order === 0}
                                    className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                    title="Move up"
                                  >
                                    <MoveUp
                                      size={11}
                                      className="text-slate-600"
                                    />
                                  </button>
                                  <span className="font-bold text-slate-800 text-[11px] min-w-[16px] text-center">
                                    {member.display_order + 1}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleReorder(member.id, "down")
                                    }
                                    disabled={
                                      member.display_order ===
                                      teamMembers.length - 1
                                    }
                                    className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                    title="Move down"
                                  >
                                    <MoveDown
                                      size={11}
                                      className="text-slate-600"
                                    />
                                  </button>
                                </div>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <div className="w-12 h-10 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                  {member.image_url ? (
                                    <img
                                      src={getImageDisplayUrl(member.image_url)}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src =
                                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                      }}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                      <ImageIcon className="w-3 h-3 text-slate-400" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">
                                  {member.name}
                                </p>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <p className="text-slate-500 text-[11px] truncate leading-tight">
                                  {member.role}
                                </p>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <div className="flex items-center space-x-1">
                                  {(() => {
                                    const links = parseSocialLinks(
                                      member.social_links
                                    );

                                    if (!links || links.length === 0) {
                                      return (
                                        <span className="text-[10px] text-slate-400 font-bold">
                                          No links
                                        </span>
                                      );
                                    }

                                    return links
                                      .filter((social) => social && social.url) // Filter out invalid links
                                      .map((social, socialIndex) => (
                                        <a
                                          key={socialIndex}
                                          href={
                                            social.platform === "whatsapp"
                                              ? getWhatsappUrl(social.url)
                                              : social.url
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-all border border-slate-200"
                                          title={`${getPlatformLabel(
                                            social.platform
                                          )}: ${social.url}`}
                                          onClick={(e) => {
                                            if (
                                              !social.url ||
                                              social.url === "#"
                                            ) {
                                              e.preventDefault();
                                              toast.error(
                                                "No URL set for this social link"
                                              );
                                            }
                                          }}
                                        >
                                          {getSocialIcon(social.platform)}
                                        </a>
                                      ));
                                  })()}
                                </div>
                              </td>
                              <td className="px-2 py-1 border-r border-b border-slate-200">
                                <button
                                  onClick={() =>
                                    handleToggleActive(
                                      member.id,
                                      member.is_active
                                    )
                                  }
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold transition-all cursor-pointer ${member.is_active
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                    }`}
                                >
                                  {member.is_active ? (
                                    <>
                                      <Eye className="w-2.5 h-2.5" />
                                      <span>Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-2.5 h-2.5" />
                                      <span>Inactive</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-2 py-1 border-b border-slate-200 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleEdit(member)}
                                    className="p-0.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded cursor-pointer transition-all"
                                    title="Edit"
                                  >
                                    <Edit
                                      size={11}
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(member.id)}
                                    className="p-0.5 text-red-600 hover:bg-red-50 border border-red-100 rounded cursor-pointer transition-all"
                                    title="Delete"
                                  >
                                    <Trash2
                                      size={11}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {filteredMembers.length > 0 && (
                    <div className="bg-gray-50 border-t border-gray-200 px-2 py-1.5 sm:px-4 sm:py-2">
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        {/* Left side - Showing info compact */}
                        <div className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
                          <span className="hidden sm:inline">Showing </span>
                          <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span>
                          <span className="hidden sm:inline"> - </span>
                          <span className="sm:hidden">-</span>
                          <span className="font-semibold text-gray-800">
                            {Math.min(indexOfLastItem, filteredMembers.length)}
                          </span>
                          <span className="hidden sm:inline"> of </span>
                          <span className="sm:hidden">/</span>
                          <span className="font-semibold text-gray-800">{filteredMembers.length}</span>

                          {/* Filter indicators - compact */}
                          {(searchTerm || statusFilter !== "all") && (
                            <span className="ml-1 text-blue-600 text-[8px] sm:text-[10px] hidden sm:inline">
                              {searchTerm && `🔍 "${searchTerm.slice(0, 8)}${searchTerm.length > 8 ? '…' : ''}"`}
                              {statusFilter !== "all" && ` • ${statusFilter === 'active' ? 'Act' : 'Inact'}`}
                            </span>
                          )}
                        </div>

                        {/* Pagination controls - compact row */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {/* Previous button */}
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>

                          {/* Page numbers - Desktop */}
                          <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                              let pageNumber;
                              if (totalPages <= 3) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 2) {
                                pageNumber = i + 1;
                              } else if (currentPage >= totalPages - 1) {
                                pageNumber = totalPages - 2 + i;
                              } else {
                                pageNumber = currentPage - 1 + i;
                              }

                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => goToPage(pageNumber)}
                                  className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${currentPage === pageNumber
                                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}

                            {totalPages > 3 && currentPage < totalPages - 1 && (
                              <>
                                <span className="text-gray-400 text-[10px] sm:text-xs px-0.5">...</span>
                                <button
                                  onClick={() => goToPage(totalPages)}
                                  className="min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                >
                                  {totalPages}
                                </button>
                              </>
                            )}
                          </div>

                          {/* Mobile: Current page indicator */}
                          <span className="sm:hidden text-[10px] font-medium text-gray-700 px-1">
                            {currentPage}/{totalPages}
                          </span>

                          {/* Next button */}
                          <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="p-1 sm:p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
          )}      {/* Modal - Responsive */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop">
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
            <div
              className="fixed inset-0"
              onClick={handleCloseModal}
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 overflow-hidden animate-modal-content">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-800">
                    {editingMember ? "Edit Team Member" : "Create Team Member"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {editingMember ? "Modify team member details and contact links" : "Add a new profile to your team"}
                  </p>
                </div>
                <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              {/* Compact Body - Non scrollable */}
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-3.5">

                  {/* Row 1: Name + Role */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Senior Developer"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Description / Bio */}
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Short Bio
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief professional summary..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Row 3: Profile Image Uplod & Preview */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Profile Photo <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition cursor-pointer"
                        >
                          Choose File
                        </button>
                        <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[120px]">
                          {selectedFile ? selectedFile.name : (editingMember ? 'Avatar Uploaded' : 'No photo selected')}
                        </span>
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="flex items-center gap-2 shrink-0">
                        <img
                          src={getImageDisplayUrl(imagePreview)}
                          alt="Preview"
                          className="w-10 h-10 object-cover rounded-full border border-slate-200 shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image_url: '' }));
                            setImagePreview('');
                          }}
                          className="text-[9px] text-red-600 hover:text-red-800 font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Social Links Repeater */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Social Links (Max 3)
                      </label>
                      {socialLinks.length < 3 && (
                        <button
                          type="button"
                          onClick={addSocialLink}
                          className="text-[9px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {socialLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <select
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                            className="px-2 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white cursor-pointer font-semibold text-slate-700 outline-none w-24 shrink-0"
                          >
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                            <option value="github">GitHub</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="whatsapp">WhatsApp</option>
                          </select>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                            placeholder="Profile Link / Number"
                            className="flex-1 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition outline-none font-semibold text-slate-800 placeholder-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="p-1 text-red-500 hover:text-red-700 transition cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Controls & Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          uploadingImage ||
                          !formData.name.trim() ||
                          !formData.role.trim() ||
                          !formData.image_url.trim()
                        }
                        className="px-3.5 py-1.5 bg-[#0D47A1] hover:bg-[#1976D2] text-white rounded-lg text-[10px] font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        <span>{editingMember ? "Update" : "Create"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
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
    </div>
  );
};

export default TeamCMS;

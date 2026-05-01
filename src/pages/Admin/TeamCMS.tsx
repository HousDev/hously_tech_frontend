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

const handleDelete = async (id: number) => {
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

const handleBulkDelete = async () => {
  if (selectedMembers.length === 0) {
    toast.error('Please select team members to delete');
    return;
  }

  const deleteToast = toast.loading(`Deleting ${selectedMembers.length} team member(s)...`);

  try {
    await teamApi.bulkDelete(selectedMembers);
    toast.success(
      `Successfully deleted ${selectedMembers.length} team member(s)`,
      { id: deleteToast }
    );
    setSelectedMembers([]);
    fetchTeamMembers();
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    toast.error(error.message || 'Failed to delete team members', { id: deleteToast });
  }
};

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
    <div className="bg-white ">
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
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-0 sm:ml-0" : ""
        }`}
      >
        {/* Header - Fixed with sidebar consideration */}
       <div
  className={`${
    isSidebarOpen
      ? "relative sm:sticky sm:top-4 lg:top-16"
      : "sticky top-0 sm:top-4 lg:top-16"
  } z-30 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4`}
>
  {/* Blue Title Section */}
  <div className="bg-blue-200 text-black rounded-t-lg sm:rounded-t-xl">
    <div className="px-2 py-1.5 sm:px-3 sm:py-2">
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-md">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight">
            Team Management
          </h1>
        </div>
        <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-2 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Member</span>
            </button>
      </div>
    </div>
  </div>

  {/* White Content Section - Show only when sidebar is closed on mobile */}
  {(!isSidebarOpen || window.innerWidth >= 640) && (
    <div className="bg-white rounded-b-lg sm:rounded-b-xl">
      <div className="px-2 py-2 sm:px-3 sm:py-2.5">
        {/* Header with Actions */}
        <div className="flex flex-row justify-between items-center gap-1.5 mb-2 sm:mb-2.5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
              Team Members ({teamMembers.length})
            </h2>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Manage your team</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md items-center gap-1.5 text-xs"
            >
              <Plus size={14} />
              <span>Add Member</span>
            </button>
            <div className="sm:hidden flex items-center gap-1.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1 rounded ${
                  viewMode === "table"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-3 gap-1.5 mb-2 sm:mb-3">
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
              <p className="text-sm sm:text-base font-bold text-gray-900">{totalMembers}</p>
            </div>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
              <p className="text-sm sm:text-base font-bold text-green-600">{activeMembers}</p>
            </div>
          </div>
          <div className="bg-white rounded border border-gray-200 px-1.5 py-1 sm:p-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-gray-500">Inactive</p>
              <p className="text-sm sm:text-base font-bold text-gray-600">{inactiveMembers}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded">
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded bg-white"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
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
                  onClick={handleBulkDelete}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition mt-1 sm:mt-0"
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
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        member.is_active
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
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm sm:shadow-lg overflow-hidden">
              {currentMembers.length === 0 ? (
                <div className="p-6 sm:p-12 text-center">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-lg">
                    No team members found
                  </p>
                  {searchTerm || statusFilter !== "all" ? (
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  ) : (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 mx-auto text-xs sm:text-sm"
                    >
                      <Plus size={14} className="sm:size-[20px]" />
                      <span>Add New Team Member</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-340px)]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky z-20">
                        <tr>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-10 sm:w-12">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  selectedMembers.length ===
                                    currentMembers.length &&
                                  currentMembers.length > 0
                                }
                                onChange={handleSelectAll}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </div>
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Order
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Social Links
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentMembers.map((member) => {
                          return (
                            <tr
                              key={member.id}
                              className="hover:bg-blue-50/50 transition-colors"
                            >
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(
                                      member.id
                                    )}
                                    onChange={() =>
                                      handleSelectMember(member.id)
                                    }
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                  <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() =>
                                        handleReorder(member.id, "up")
                                      }
                                      disabled={member.display_order === 0}
                                      className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                      title="Move up"
                                    >
                                      <MoveUp
                                        size={12}
                                        className="sm:size-[14px] text-gray-600"
                                      />
                                    </button>
                                    <span className="font-bold text-gray-900 text-xs sm:text-sm min-w-[20px] sm:min-w-[24px] text-center">
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
                                      className="p-0.5 sm:p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                                      title="Move down"
                                    >
                                      <MoveDown
                                        size={12}
                                        className="sm:size-[14px] text-gray-600"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                      <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="max-w-[100px] sm:max-w-xs">
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                    {member.name}
                                  </p>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="max-w-[100px] sm:max-w-xs">
                                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                                    {member.role}
                                  </p>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="flex items-center space-x-1">
                                  {(() => {
                                    const links = parseSocialLinks(
                                      member.social_links
                                    );
                                    

                                    if (!links || links.length === 0) {
                                      return (
                                        <span className="text-xs text-gray-400">
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
                                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
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
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <button
                                  onClick={() =>
                                    handleToggleActive(
                                      member.id,
                                      member.is_active
                                    )
                                  }
                                  className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                                    member.is_active
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-gray-100 text-gray-800 border border-gray-200"
                                  }`}
                                >
                                  {member.is_active ? (
                                    <>
                                      <Eye className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                      <span className="hidden sm:inline">
                                        Active
                                      </span>
                                      <span className="sm:hidden">On</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1.5" />
                                      <span className="hidden sm:inline">
                                        Inactive
                                      </span>
                                      <span className="sm:hidden">Off</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-3 sm:px-6 py-2 sm:py-4">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <button
                                    onClick={() => handleEdit(member)}
                                    className="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                    title="Edit"
                                  >
                                    <Edit
                                      size={12}
                                      className="sm:size-[18px]"
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-1 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                    title="Delete"
                                  >
                                    <Trash2
                                      size={12}
                                      className="sm:size-[18px]"
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
                className={`min-w-[24px] h-6 sm:min-w-[28px] sm:h-7 flex items-center justify-center text-[11px] sm:text-xs rounded-md transition ${
                  currentPage === pageNumber
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
          )}
      </div>

      {/* Modal - Responsive */}
    {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop - Black */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      onClick={handleCloseModal}
    />

    {/* Center wrapper */}
    <div className="flex min-h-full items-center justify-center p-2 sm:p-3">
      <div className="relative w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-lg">
        
        {/* ─── Header ─── */}
        <div className="bg-gradient-to-r from-[#0D47A1] to-[#1976D2] rounded-t-lg sm:rounded-t-xl">
          <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-[#FFC107] rounded-md w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[9px] sm:text-xs text-[#0D47A1] shrink-0">
                tm
              </div>
              <div>
                <h2 className="text-white font-medium text-xs sm:text-sm">
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <p className="text-white/70 text-[8px] sm:text-[10px] hidden sm:block">
                  {editingMember ? "Update team member details" : "Add a new member to your team"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
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

              {/* ROW 1: Name + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Role <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Developer"
                    className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                    required
                  />
                </div>
              </div>

              {/* ROW 2: Description */}
              <div>
                <label className="block mb-0.5 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about the team member's role and expertise..."
                  className="w-full px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                />
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 3: Image + Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {/* Image Input */}
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Profile Image <span className="text-red-600">*</span>
                  </label>

                  <div className="border border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center bg-[#fafbff]">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
{!selectedFile && !formData.image_url ? (
  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="text-[9px] sm:text-xs text-blue-600 font-medium hover:underline"
  >
    Click to browse image
  </button>
) : uploadingImage ? (
  <div className="flex items-center gap-2">
    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
    <span className="text-[9px] sm:text-xs text-gray-600">Uploading...</span>
  </div>
) : (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
    <span className="text-[9px] sm:text-xs text-gray-700 truncate">
      {formData.image_url ? "✓ Image uploaded" : "Image selected"}
    </span>
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="px-2 py-0.5 sm:px-2.5 sm:py-1 border border-gray-300 text-gray-700 rounded-lg text-[8px] sm:text-[9px] hover:bg-gray-50 transition"
    >
      Change
    </button>
  </div>
)}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <p className="text-[9px] sm:text-xs font-medium text-[#0D47A1] mb-1">
                    Preview
                  </p>
                  <div className="h-20 sm:h-24 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden">
                    {(formData.image_url || imagePreview) && (
                      <img
src={imagePreview?.startsWith("blob:") 
  ? imagePreview 
  : getImageDisplayUrl(imagePreview || formData.image_url)}                        alt="Preview"
className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 4: Social Links */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[9px] sm:text-xs font-medium text-[#0D47A1]">
                    Social Links (Max 3)
                  </label>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    disabled={socialLinks.length >= 3}
                    className="text-[8px] sm:text-[9px] text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition"
                  >
                    + Add Link
                  </button>
                </div>

                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-1.5 mb-1.5">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                      className="px-2 py-1 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 bg-[#fafbff]"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    <input
                      type={link.platform === "whatsapp" ? "text" : "url"}
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      maxLength={link.platform === "whatsapp" ? 10 : undefined}

                      placeholder={
                        link.platform === "whatsapp"
                          ? "Enter phone number"
                          : "Enter URL"
                      }
                      className="flex-1 px-2 py-1 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 bg-[#fafbff]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="p-1 text-red-600 hover:text-red-800 transition"
                    >
                      <X size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-[7px] sm:text-[8px] text-gray-400 mt-0.5">
                  For WhatsApp: Enter phone number with country code (e.g., +1234567890)
                </p>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* ROW 5: Active Status */}
              <div className="flex items-center gap-1.5 sm:gap-2 py-0.5">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600"
                />
                <span className="text-[9px] sm:text-xs text-gray-700">Active Member</span>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-100 my-1" />

              {/* Form Actions */}
              <div className="flex justify-end gap-1.5 sm:gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-300 rounded-lg text-[9px] sm:text-xs text-gray-700 hover:bg-gray-50 transition"
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
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded-lg text-[9px] sm:text-xs hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 transition"
                >
                  <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{editingMember ? "Update" : "Create"}</span>
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

export default TeamCMS;

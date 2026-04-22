/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Upload,
  Linkedin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
  Menu,
  Grid,
  List,
  Instagram,
  Globe,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface SocialLink {
  platform: "linkedin" | "instagram" | "whatsapp";
  url: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  social_links: string; // JSON string of SocialLink[]
  created_at: string;
  updated_at: string;
}

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found");
      throw new Error("No authentication token");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const getUploadHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/team`,
        getAuthHeaders()
      );

      if (response.data.success && response.data.data) {
        const sortedMembers = response.data.data.sort(
          (a: TeamMember, b: TeamMember) => a.display_order - b.display_order
        );
        setTeamMembers(sortedMembers);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch team members"
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch team members:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load team members";
      toast.error(errorMessage);

      // For debugging - remove in production
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        `${API_BASE_URL}/team/upload-image`,
        formData,
        getUploadHeaders()
      );

      if (response.data.success) {
        return response.data.data.url;
      }
      throw new Error("Upload failed");
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image";
      toast.error(errorMessage);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, GIF, WEBP)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
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
        console.log("No social links data");
        return [];
      }

      // If it's already an array
      if (Array.isArray(socialLinksData)) {
        console.log("Social links is array:", socialLinksData);
        return socialLinksData;
      }

      // If it's a string, parse it
      if (typeof socialLinksData === "string") {
        console.log("Social links is string:", socialLinksData);
        const parsed = JSON.parse(socialLinksData);
        return Array.isArray(parsed) ? parsed : [];
      }

      // If it's an object, try to convert
      if (typeof socialLinksData === "object") {
        console.log("Social links is object:", socialLinksData);
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

  const stringifySocialLinks = (links: SocialLink[]): string => {
    return JSON.stringify(links);
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
        ...formData,
        social_links: stringifySocialLinks(socialLinks),
        display_order: editingMember
          ? editingMember.display_order
          : teamMembers.length,
      };

      console.log("📤 Sending team member data:", payload);

      if (editingMember) {
        const response = await axios.put(
          `${API_BASE_URL}/team/${editingMember.id}`,
          payload,
          getAuthHeaders()
        );

        if (response.data.success) {
          toast.success("Team member updated successfully");
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/team`,
          payload,
          getAuthHeaders()
        );

        if (response.data.success) {
          toast.success("Team member created successfully");
        }
      }

      fetchTeamMembers();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving team member:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save team member";
      toast.error(errorMessage);
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

    const parsedLinks = parseSocialLinks(member.social_links);
    setSocialLinks(
      parsedLinks.length > 0 ? parsedLinks : [{ platform: "linkedin", url: "" }]
    );

    if (member.image_url) {
      setImagePreview(member.image_url);
    }

    setIsModalOpen(true);
  };

 const handleDelete = async (id: number) => {
  const deleteToast = toast.loading('Deleting team member...');

  try {
    const response = await axios.delete(`${API_BASE_URL}/team/${id}`, getAuthHeaders());

    if (response.data.success) {
      toast.success('Team member deleted successfully', { id: deleteToast });
      fetchTeamMembers();
    } else {
      toast.error('Failed to delete team member', { id: deleteToast });
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to delete team member';
    toast.error(errorMessage, { id: deleteToast });
  }
};

const handleBulkDelete = async () => {
  if (selectedMembers.length === 0) {
    toast.error('Please select team members to delete');
    return;
  }

  const deleteToast = toast.loading(`Deleting ${selectedMembers.length} team member(s)...`);

  try {
    for (const id of selectedMembers) {
      await axios.delete(`${API_BASE_URL}/team/${id}`, getAuthHeaders());
    }

    toast.success(
      `Successfully deleted ${selectedMembers.length} team member(s)`,
      { id: deleteToast }
    );
    setSelectedMembers([]);
    fetchTeamMembers();
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to delete team members';
    toast.error(errorMessage, { id: deleteToast });
  }
};

  const handleToggleActive = async (
    memberId: number,
    currentStatus: boolean
  ) => {
    const toggleToast = toast.loading(
      currentStatus
        ? "Deactivating team member..."
        : "Activating team member..."
    );

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/team/${memberId}/toggle-status`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        setTeamMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId
              ? { ...member, is_active: !currentStatus }
              : member
          )
        );

        toast.success(
          `Team member ${
            !currentStatus ? "activated" : "deactivated"
          } successfully`,
          { id: toggleToast }
        );
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Toggle error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle status";
      toast.error(errorMessage, { id: toggleToast });
    }
  };

  const handleBulkToggleActive = async (activate: boolean) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select team members to update");
      return;
    }

    const toggleToast = toast.loading(
      `${activate ? "Activating" : "Deactivating"} ${
        selectedMembers.length
      } team member(s)...`
    );

    try {
      for (const id of selectedMembers) {
        await axios.patch(
          `${API_BASE_URL}/team/${id}/toggle-status`,
          {},
          getAuthHeaders()
        );
      }

      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          selectedMembers.includes(member.id)
            ? { ...member, is_active: activate }
            : member
        )
      );

      toast.success(
        `Successfully ${activate ? "activated" : "deactivated"} ${
          selectedMembers.length
        } team member(s)`,
        { id: toggleToast }
      );
    } catch (error: any) {
      console.error("Bulk toggle error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update team members";
      toast.error(errorMessage, { id: toggleToast });
    }
  };

  const handleReorder = async (memberId: number, direction: "up" | "down") => {
    const reorderToast = toast.loading("Moving team member...");

    try {
      const currentIndex = teamMembers.findIndex((m) => m.id === memberId);
      if (currentIndex === -1) {
        toast.error("Team member not found");
        return;
      }

      if (direction === "up" && currentIndex === 0) return;
      if (direction === "down" && currentIndex === teamMembers.length - 1)
        return;

      const swapIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const swapMemberId = teamMembers[swapIndex].id;

      const updatedMembers = [...teamMembers];
      [updatedMembers[currentIndex], updatedMembers[swapIndex]] = [
        updatedMembers[swapIndex],
        updatedMembers[currentIndex],
      ];

      // Update display_order
      updatedMembers.forEach((member, index) => {
        member.display_order = index;
      });

      const response = await axios.post(
        `${API_BASE_URL}/team/reorder`,
        {
          order: updatedMembers.map((m) => ({
            id: m.id,
            display_order: m.display_order,
          })),
        },
        getAuthHeaders()
      );

      if (response.data.success) {
        setTeamMembers(updatedMembers);
        toast.success("Team member moved successfully!", { id: reorderToast });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Reorder error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to move team member";
      toast.error(errorMessage, { id: reorderToast });
      fetchTeamMembers();
    }
  };

  const getImageDisplayUrl = (url: string) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("/uploads/")) {
      return `${API_BASE_URL.replace("/api", "")}${url}`;
    }

    if (url && !url.includes("://") && url.trim() !== "") {
      return `${API_BASE_URL.replace("/api", "")}/uploads/team/${url}`;
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
    <div className="bg-white min-h-screen">
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
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
                      Team Management
                    </h1>
                    <p className="text-black text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                      Manage your team members and their profiles
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="sm:hidden bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* White Content Section - Show only when sidebar is closed on mobile */}
          {(!isSidebarOpen || window.innerWidth >= 640) && (
            <div className="bg-white rounded-b-lg sm:rounded-b-xl">
              <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                      All Team Members ({teamMembers.length})
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
                      Add, edit, and organize your team members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg items-center space-x-2 transition-all duration-200 shadow-sm text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                      <Plus size={16} className="sm:size-[18px]" />
                      <span className="font-medium">Add Member</span>
                    </button>
                    <div className="sm:hidden flex items-center space-x-2 ml-auto">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded ${
                          viewMode === "grid"
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded ${
                          viewMode === "table"
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Stats Cards - Hide on mobile, show on tablet+ */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Total
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {totalMembers}
                        </p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                          {totalMembers}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Active
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">
                          {activeMembers}
                        </p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded border border-gray-200 p-2 sm:p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Inactive
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-gray-600">
                          {inactiveMembers}
                        </p>
                      </div>
                      <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg">
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats Summary */}
                <div className="sm:hidden grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Total</p>
                    <p className="text-base font-bold text-gray-900">
                      {totalMembers}
                    </p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Active</p>
                    <p className="text-base font-bold text-green-600">
                      {activeMembers}
                    </p>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2 text-center">
                    <p className="text-[10px] text-gray-500">Inactive</p>
                    <p className="text-base font-bold text-gray-600">
                      {inactiveMembers}
                    </p>
                  </div>
                </div>

                {/* Compact Search and Filter Bar */}
                <div className="bg-white rounded p-2 sm:p-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search team members..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-full pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
                        <select
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value as any);
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <span className="text-xs text-gray-600 hidden sm:inline">
                          Show:
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs sm:text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                        </select>
                        <span className="text-xs text-gray-600 hidden sm:inline">
                          per page
                        </span>
                      </div>
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
                  <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)]">
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
                          const parsedSocialLinks = parseSocialLinks(
                            member.social_links
                          );
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
                                    console.log(
                                      "Displaying social links for",
                                      member.name,
                                      ":",
                                      links
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
                                            console.log(
                                              "Clicking social link:",
                                              social
                                            );
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
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4 z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="text-xs sm:text-sm text-gray-700">
                          <span className="hidden sm:inline">Showing </span>
                          <span className="font-semibold">
                            {indexOfFirstItem + 1}
                          </span>
                          <span className="hidden sm:inline"> to </span>
                          <span className="sm:hidden">-</span>
                          <span className="font-semibold">
                            {Math.min(indexOfLastItem, filteredMembers.length)}
                          </span>
                          <span className="hidden sm:inline"> of </span>
                          <span className="sm:hidden">/</span>
                          <span className="font-semibold">
                            {filteredMembers.length}
                          </span>
                          {(searchTerm || statusFilter !== "all") && (
                            <span className="ml-1 sm:ml-2 text-blue-600 text-[10px] sm:text-xs hidden sm:inline">
                              {searchTerm && `(Search: "${searchTerm}")`}
                              {statusFilter !== "all" &&
                                ` (Filter: ${statusFilter})`}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-start space-x-1 sm:space-x-2">
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>

                          <div className="flex items-center space-x-0.5 sm:space-x-1">
                            {Array.from(
                              { length: Math.min(3, totalPages) },
                              (_, i) => {
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
                                    className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-lg transition ${
                                      currentPage === pageNumber
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "border border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm"
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              }
                            )}

                            {totalPages > 3 && currentPage < totalPages - 1 && (
                              <>
                                <span className="px-0.5 sm:px-1 text-gray-500">
                                  ...
                                </span>
                                <button
                                  onClick={() => goToPage(totalPages)}
                                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition"
                                >
                                  {totalPages}
                                </button>
                              </>
                            )}
                          </div>

                          <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleCloseModal}
          />
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {editingMember ? "Edit Team Member" : "Add New Team Member"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={20} className="sm:size-[24px]" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* ROW 1: Name + Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        placeholder="Senior Developer"
                        className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* ROW 2: Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description about the team member's role and expertise..."
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl resize-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                  </div>

                  {/* ROW 3: Image + Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
                    {/* Image Input */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image *
                      </label>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
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
                            className="text-blue-600 text-xs sm:text-sm font-medium hover:underline"
                          >
                            Click to browse image
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm text-gray-700 truncate">
                              {selectedFile
                                ? selectedFile.name
                                : "Image selected"}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-50"
                              >
                                Change
                              </button>
                              {selectedFile && (
                                <button
                                  type="button"
                                  onClick={handleImageUpload}
                                  disabled={uploadingImage}
                                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {uploadingImage ? "Uploading..." : "Upload"}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <div className="h-24 sm:h-32 rounded-lg sm:rounded-xl border bg-gray-100 overflow-hidden">
                        {(formData.image_url || imagePreview) && (
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ROW 4: Social Links */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Social Links (Max 3)
                      </label>
                      <button
                        type="button"
                        onClick={addSocialLink}
                        disabled={socialLinks.length >= 3}
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      >
                        + Add Link
                      </button>
                    </div>

                    {socialLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <select
                          value={link.platform}
                          onChange={(e) =>
                            updateSocialLink(index, "platform", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                        <input
                          type={link.platform === "whatsapp" ? "text" : "url"}
                          value={link.url}
                          onChange={(e) =>
                            updateSocialLink(index, "url", e.target.value)
                          }
                          placeholder={
                            link.platform === "whatsapp"
                              ? "Enter phone number (e.g., +1234567890)"
                              : "Enter URL"
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="p-2 text-red-600 hover:text-red-800 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">
                      For WhatsApp: Enter phone number with country code (e.g.,
                      +1234567890)
                    </p>
                  </div>

                  {/* ROW 5: Active Status */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Active Member</span>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
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
                      className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {editingMember ? "Update" : "Create"} Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCMS;

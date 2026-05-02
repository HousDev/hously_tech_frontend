

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import careerService, { type Job, type ApplicationFormData } from "../../../../../services/career.service";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Users,
  IndianRupee,
} from "lucide-react";

export default function JobApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    cover_letter: "",
    experience_level: "", 
  });

  const [formErrors, setFormErrors] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    experience_level: "",
    resume: "",
  });
  const experienceOptions = [
  { value: "fresher", label: "Fresher " },
  { value: "1-2 years", label: "1-2 years" },
  { value: "2-4 years", label: "2-3 years" },
  { value: "4-6 years", label: "4-5 years" },
  { value: "6-9 years", label: "5+ years" },
];

  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setJobError(null);
        
        if (id) {
          const response = await careerService.getJobBySlug(id);
          
          if (response.success && response.data) {
            setJob(response.data);
            
            if (!response.data.is_active) {
              setJobError("This job is no longer accepting applications");
            }
          } else {
            setJobError("Job not found");
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setJobError("Unable to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        resume: "Please upload a PDF, DOC, or DOCX file only.",
      });
      return;
    }

    if (file.size > maxSize) {
      setFormErrors({
        ...formErrors,
        resume: "File size must be less than 5MB.",
      });
      return;
    }

    setResume(file);
    setFormErrors({
      ...formErrors,
      resume: "",
    });
  };

  const handleRemoveResume = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateForm = () => {
    const errors = {
      applicant_name: "",
      email: "",
      phone: "",
      experience_level: "",
      resume: "",
    };

    let isValid = true;

    if (!formData.applicant_name.trim()) {
      errors.applicant_name = "Full name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }


    if (!formData.experience_level) {
  errors.experience_level = "Please select your experience level";
  isValid = false;
}
    if (!resume) {
      errors.resume = "Resume is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm() || !job) {
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData: ApplicationFormData = {
        job_id: job.id,
        applicant_name: formData.applicant_name,
        email: formData.email,
        phone: formData.phone,
          experience_level: formData.experience_level,  // add this

        cover_letter: formData.cover_letter || undefined,
        resume: resume || undefined,
      };


      const response = await careerService.submitApplication(applicationData);

      if (response.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
          navigate(`/career/job/${id}`);
        }, 5000);
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {jobError || "Job not found"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            The job you're trying to apply for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/career")}
            className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to All Jobs
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 pt-20">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Thank you for applying for the{" "}
            <span className="font-semibold">{job.job_title}</span> position. 
            We've received your application and will review it shortly.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-blue-600">
              <Loader2 className="animate-spin h-3 w-3 sm:h-4 sm:w-4" />
              <span>Redirecting in 5 seconds...</span>
            </div>
            <button
              onClick={() => navigate(`/career/job/${id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
            >
              Return to job details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(`/career/job/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2 sm:mb-3 group text-xs sm:text-sm md:mt-0 mt-5"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 group-hover:-translate-x-1 transition-transform  " />
            Back to Job Details
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Apply for <span className="text-blue-600">{job.job_title}</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {job.department} • {job.job_type}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-gray-500">Ref:</span>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-medium rounded-full">
                #{job.id}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{submitError}</span>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Column - Application Form */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Application Form
                </h2>
                <div className="text-[10px] sm:text-xs text-gray-500">
                  Step 1 of 2 •{" "}
                  <span className="text-blue-600 font-medium">
                    Personal Details
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 pb-2 border-b">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                        <User className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="applicant_name"
                        value={formData.applicant_name}
                        onChange={handleChange}
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border ${
                          formErrors.applicant_name
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]`}
                        placeholder="John Doe"
                      />
                      {formErrors.applicant_name && (
                        <p className="mt-0.5 text-[9px] sm:text-xs text-red-600 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.applicant_name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                        <Mail className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border ${
                          formErrors.email
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-0.5 text-[9px] sm:text-xs text-red-600 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                        <Phone className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border ${
                          formErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {formErrors.phone && (
                        <p className="mt-0.5 text-[9px] sm:text-xs text-red-600 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Experience Level */}
<div>
  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
    <Briefcase className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
    Experience Level *
  </label>
  <select
    name="experience_level"
    value={formData.experience_level}
    onChange={handleChange}
    required
    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
  >
    <option value="">Select experience level</option>
    {experienceOptions.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
</div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                        <Linkedin className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="mt-3 sm:mt-4">
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                      <Globe className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff]"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    name="cover_letter"
                    value={formData.cover_letter}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#fafbff] resize-none"
                    placeholder="Tell us why you're the perfect candidate for this position..."
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">
                    Resume / CV *
                    <span className="text-gray-400 ml-1">(PDF, DOC, DOCX – max 5MB)</span>
                  </label>

                  <div
                    className={`flex items-center justify-between border ${
                      formErrors.resume
                        ? "border-red-300"
                        : dragActive
                        ? "border-blue-500"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2 transition-all cursor-pointer bg-[#fafbff]`}
                    onClick={handleUploadClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="flex items-center gap-2">
                      {resume ? (
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                      )}
                      <span className="text-[10px] sm:text-xs text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">
                        {resume ? resume.name : "Upload your resume"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {resume && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveResume();
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )}
                      <span className="text-[9px] sm:text-[10px] text-gray-400">
                        {resume ? formatFileSize(resume.size) : "Browse"}
                      </span>
                    </div>
                  </div>

                  {formErrors.resume && (
                    <p className="mt-1 text-[9px] sm:text-xs text-red-600 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.resume}
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5"
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-3 w-3 sm:h-4 sm:w-4" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Submit Application
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/career/job/${id}`)}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Job Info & Tips */}
          <div className="lg:w-2/5">
            <div className="space-y-4 sm:space-y-5">
              {/* Job Summary */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  Job Summary
                </h3>
<div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">                  <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-blue-50 rounded-lg">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-[9px] sm:text-[10px] text-gray-500">Position</p>
                      <p className="text-[10px] sm:text-xs font-semibold">{job.job_title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-green-50 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-[9px] sm:text-[10px] text-gray-500">Location</p>
                      <p className="text-[10px] sm:text-xs font-semibold">{job.location || "Remote"}</p>
                    </div>
                  </div>

                  {job.experience_level && (
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-purple-50 rounded-lg">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-[9px] sm:text-[10px] text-gray-500">Experience</p>
                        <p className="text-[10px] sm:text-xs font-semibold">{job.experience_level}</p>
                      </div>
                    </div>
                  )}

                  {job.salary_range && (
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-yellow-50 rounded-lg">
                      <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-[9px] sm:text-[10px] text-gray-500">Salary</p>
                        <p className="text-[10px] sm:text-xs font-semibold">{job.salary_range}</p>
                      </div>
                    </div>
                  )}

                  {job.vacancy_count > 0 && (
                    <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-pink-50 rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" />
                      <div className="flex-1">
                        <p className="text-[9px] sm:text-[10px] text-gray-500">Vacancies</p>
                        <p className="text-[10px] sm:text-xs font-semibold">{job.vacancy_count}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-gray-50 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-[9px] sm:text-[10px] text-gray-500">Posted</p>
                      <p className="text-[10px] sm:text-xs font-semibold">{formatDate(job.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  Application Tips
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 p-1.5 hover:bg-white/50 rounded transition-colors">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-[9px] sm:text-[10px]">1</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-700">
                      Ensure your resume is updated and matches the job requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-2 p-1.5 hover:bg-white/50 rounded transition-colors">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-[9px] sm:text-[10px]">2</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-700">
                      Customize your cover letter to highlight relevant experience
                    </span>
                  </li>
                  <li className="flex items-start gap-2 p-1.5 hover:bg-white/50 rounded transition-colors">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-[9px] sm:text-[10px]">3</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-700">
                      Double-check all contact information for accuracy
                    </span>
                  </li>
                  <li className="flex items-start gap-2 p-1.5 hover:bg-white/50 rounded transition-colors">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-[9px] sm:text-[10px]">4</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-700">
                      Include links to your portfolio or relevant projects
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
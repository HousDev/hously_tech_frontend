/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/purity */
// import { useState, useRef, type ChangeEvent } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getJobById } from "../../index";
// import {
//   ArrowLeft,
//   Upload,
//   FileText,
//   User,
//   Mail,
//   Phone,
//   Linkedin,
//   Globe,
//   Briefcase,
//   Calendar,
//   MapPin,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   X,
// } from "lucide-react";

// export default function JobApplicationPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const job = id ? getJobById(id) : null;
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [dragActive, setDragActive] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     linkedin: "",
//     portfolio: "",
//     coverLetter: "",
//   });

//   const [formErrors, setFormErrors] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     resume: "",
//   });

//   const [resume, setResume] = useState<File | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [, setUploadProgress] = useState(0);

//   // Handle form input changes
//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Clear error when user starts typing
//     if (formErrors[name as keyof typeof formErrors]) {
//       setFormErrors({
//         ...formErrors,
//         [name]: "",
//       });
//     }
//   };

//   // Handle drag events
//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   // Handle drop event
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   // Validate and set file
//   const validateAndSetFile = (file: File) => {
//     // Check file type
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (!allowedTypes.includes(file.type)) {
//       setFormErrors({
//         ...formErrors,
//         resume: "Please upload a PDF, DOC, or DOCX file only.",
//       });
//       return;
//     }

//     if (file.size > maxSize) {
//       setFormErrors({
//         ...formErrors,
//         resume: "File size must be less than 5MB.",
//       });
//       return;
//     }

//     setResume(file);
//     setFormErrors({
//       ...formErrors,
//       resume: "",
//     });
//   };

//   // Remove resume
//   const handleRemoveResume = () => {
//     setResume(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Trigger file input click
//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const errors = {
//       fullName: "",
//       email: "",
//       phone: "",
//       resume: "",
//     };

//     let isValid = true;

//     // Validate name
//     if (!formData.fullName.trim()) {
//       errors.fullName = "Full name is required";
//       isValid = false;
//     }

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!emailRegex.test(formData.email)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     // Validate phone
//     const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
//     if (!formData.phone) {
//       errors.phone = "Phone number is required";
//       isValid = false;
//     } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
//       errors.phone = "Please enter a valid phone number";
//       isValid = false;
//     }

//     // Validate resume
//     if (!resume) {
//       errors.resume = "Resume is required";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setUploadProgress(0);

//     // Simulate file upload progress
//     const uploadInterval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(uploadInterval);
//           return prev;
//         }
//         return prev + 10;
//       });
//     }, 100);

//     try {
//       // Simulate API call with FormData
//       const formDataToSend = new FormData();
//       formDataToSend.append("jobId", id || "");
//       formDataToSend.append("fullName", formData.fullName);
//       formDataToSend.append("email", formData.email);
//       formDataToSend.append("phone", formData.phone);
//       formDataToSend.append("linkedin", formData.linkedin);
//       formDataToSend.append("portfolio", formData.portfolio);
//       formDataToSend.append("coverLetter", formData.coverLetter);
//       if (resume) {
//         formDataToSend.append("resume", resume);
//       }

//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       clearInterval(uploadInterval);
//       setUploadProgress(100);

//       // Add a small delay to show 100% completion
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       setIsSubmitting(false);
//       setIsSubmitted(true);

//       // Redirect after 5 seconds
//       setTimeout(() => {
//         navigate(`/career/job/${id}`);
//       }, 5000);

//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       clearInterval(uploadInterval);
//       setIsSubmitting(false);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Job not found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The job you're trying to apply for doesn't exist or has been
//             removed.
//           </p>
//           <button
//             onClick={() => navigate("/career/job")}
//             className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             Back to All Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
//         <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale">
//             <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             Application Submitted!
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Thank you for applying for the{" "}
//             <span className="font-semibold">{job.title}</span> position at{" "}
//             {job.company}. We've received your application and will review it
//             shortly.
//           </p>
//           <div className="space-y-4">
//             <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
//               <svg
//                 className="animate-spin h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               <span>Redirecting in 5 seconds...</span>
//             </div>
//             <button
//               onClick={() => navigate(`/career/job/${id}`)}
//               className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//             >
//               Return to job details
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-28">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={() => navigate(`/career/job/${id}`)}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-3 group"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Job Details
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
//                 Apply for <span className="text-blue-600">{job.title}</span>
//               </h1>
//               <p className="text-gray-600">
//                 {job.company} • {job.type.join(" • ")}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="hidden md:inline text-sm text-gray-500">
//                 Ref:
//               </span>
//               <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
//                 #{Math.random().toString(36).substr(2, 6).toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Horizontal Layout - Side by Side */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Column - Application Form (70%) */}
//           <div className="lg:w-3/5">
//             <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900">
//                   Application Form
//                 </h2>
//                 <div className="text-sm text-gray-500">
//                   Step 1 of 2 •{" "}
//                   <span className="text-blue-600 font-medium">
//                     Personal Details
//                   </span>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Personal Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
//                     Personal Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {/* Full Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <User className="inline w-4 h-4 mr-1" />
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         className={`w-full px-4 py-3 border ${
//                           formErrors.fullName
//                             ? "border-red-300"
//                             : "border-gray-300"
//                         } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
//                         placeholder="John Doe"
//                       />
//                       {formErrors.fullName && (
//                         <p className="mt-1 text-sm text-red-600 flex items-center">
//                           <AlertCircle className="w-4 h-4 mr-1" />
//                           {formErrors.fullName}
//                         </p>
//                       )}
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Mail className="inline w-4 h-4 mr-1" />
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className={`w-full px-4 py-3 border ${
//                           formErrors.email
//                             ? "border-red-300"
//                             : "border-gray-300"
//                         } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
//                         placeholder="john@example.com"
//                       />
//                       {formErrors.email && (
//                         <p className="mt-1 text-sm text-red-600 flex items-center">
//                           <AlertCircle className="w-4 h-4 mr-1" />
//                           {formErrors.email}
//                         </p>
//                       )}
//                     </div>

//                     {/* Phone */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Phone className="inline w-4 h-4 mr-1" />
//                         Phone Number *
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className={`w-full px-4 py-3 border ${
//                           formErrors.phone
//                             ? "border-red-300"
//                             : "border-gray-300"
//                         } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
//                         placeholder="+1 (555) 123-4567"
//                       />
//                       {formErrors.phone && (
//                         <p className="mt-1 text-sm text-red-600 flex items-center">
//                           <AlertCircle className="w-4 h-4 mr-1" />
//                           {formErrors.phone}
//                         </p>
//                       )}
//                     </div>

//                     {/* LinkedIn */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Linkedin className="inline w-4 h-4 mr-1" />
//                         LinkedIn Profile
//                       </label>
//                       <input
//                         type="url"
//                         name="linkedin"
//                         value={formData.linkedin}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         placeholder="https://linkedin.com/in/username"
//                       />
//                     </div>
//                   </div>

//                   {/* Portfolio */}
//                   <div className="mt-5">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <Globe className="inline w-4 h-4 mr-1" />
//                       Portfolio / Website
//                     </label>
//                     <input
//                       type="url"
//                       name="portfolio"
//                       value={formData.portfolio}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                       placeholder="https://yourportfolio.com"
//                     />
//                   </div>
//                 </div>

//                 {/* Resume Upload - Enhanced */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Resume / CV *
//                     <span className="text-xs text-gray-500 font-normal ml-1">
//                       (PDF, DOC, DOCX – max 5MB)
//                     </span>
//                   </label>

//                   <div
//                     className={`flex items-center justify-between border ${
//                       formErrors.resume
//                         ? "border-red-300"
//                         : dragActive
//                         ? "border-blue-500"
//                         : "border-gray-300"
//                     } rounded-lg px-4 py-2 transition-all cursor-pointer bg-white`}
//                     onClick={handleUploadClick}
//                     onDragEnter={handleDrag}
//                     onDragLeave={handleDrag}
//                     onDragOver={handleDrag}
//                     onDrop={handleDrop}
//                   >
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />

//                     {/* Left */}
//                     <div className="flex items-center space-x-3">
//                       {resume ? (
//                         <FileText className="w-5 h-5 text-green-600" />
//                       ) : (
//                         <Upload className="w-5 h-5 text-blue-600" />
//                       )}

//                       <span className="text-sm text-gray-700 truncate max-w-[220px]">
//                         {resume ? resume.name : "Upload your resume"}
//                       </span>
//                     </div>

//                     {/* Right */}
//                     <div className="flex items-center space-x-2">
//                       {resume && (
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleRemoveResume();
//                           }}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}

//                       <span className="text-xs text-gray-500">
//                         {resume ? formatFileSize(resume.size) : "Browse"}
//                       </span>
//                     </div>
//                   </div>

//                   {formErrors.resume && (
//                     <p className="mt-1 text-xs text-red-600 flex items-center">
//                       <AlertCircle className="w-4 h-4 mr-1" />
//                       {formErrors.resume}
//                     </p>
//                   )}
//                 </div>

//                 {/* Terms & Submit */}
//                 <div className="pt-6 border-t">
//                   <div className="flex items-start mb-2">
//                     {/* <input
//                       type="checkbox"
//                       id="terms"
//                       required
//                       className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     /> */}
//                     {/* <label htmlFor="terms" className="text-sm text-gray-600">
//                       I agree to the processing of my personal data for recruitment purposes in accordance with 
//                       <span className="text-blue-600 hover:text-blue-800 font-medium ml-1 cursor-pointer">
//                         Hously's Privacy Policy
//                       </span>.
//                     </label> */}
//                   </div>

//                   {/* Submit Button */}
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center ${
//                         isSubmitting
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-[#0076d8] hover:from-[#024a9e] hover:to-[#0270e1] hover:shadow-lg transform hover:-translate-y-0.5"
//                       } text-white`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Submitting Application...
//                         </>
//                       ) : (
//                         "Submit Application"
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => navigate(`/career/job/${id}`)}
//                       className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Right Column - Job Info & Tips (30%) */}
//           <div className="lg:w-2/5">
//             <div className="space-y-6">
//               {/* Job Summary */}
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">
//                   Job Summary
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="flex items-center p-3 bg-blue-50 rounded-lg">
//                     <Briefcase className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-500">Position</p>
//                       <p className="font-semibold">{job.title}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center p-3 bg-green-50 rounded-lg">
//                     <MapPin className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-500">Location</p>
//                       <p className="font-semibold">{job.location}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center p-3 bg-purple-50 rounded-lg">
//                     <svg
//                       className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                       />
//                     </svg>
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-500">Job Type</p>
//                       <p className="font-semibold">{job.type.join(", ")}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
//                     <DollarSign className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-500">Salary</p>
//                       <p className="font-semibold">{job.salary}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center p-3 bg-gray-50 rounded-lg">
//                     <Calendar className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-500">Posted</p>
//                       <p className="font-semibold">{job.posted}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Application Tips */}
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                   <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
//                   Application Tips
//                 </h3>
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
//                   <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="text-blue-600 font-bold text-xs">1</span>
//                     </div>
//                     <span>
//                       Ensure your resume is updated and matches the job
//                       requirements
//                     </span>
//                   </li>
//                   <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="text-blue-600 font-bold text-xs">2</span>
//                     </div>
//                     <span>
//                       Customize your cover letter to highlight relevant
//                       experience
//                     </span>
//                   </li>
//                   <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="text-blue-600 font-bold text-xs">3</span>
//                     </div>
//                     <span>
//                       Double-check all contact information for accuracy
//                     </span>
//                   </li>
//                   <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="text-blue-600 font-bold text-xs">4</span>
//                     </div>
//                     <span>
//                       Include links to your portfolio or relevant projects
//                     </span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Contact & Support */}
//               {/* <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
//                 <div className="space-y-4">
//                   <div className="p-3 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-2">
//                       If you have questions about the application process, our HR team is here to help:
//                     </p>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center">
//                         <Mail className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-700">careers@hously.com</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="w-4 h-4 text-gray-400 mr-2" />
//                         <span className="text-gray-700">+1 (555) 123-4567</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-3 bg-blue-50 rounded-lg">
//                     <p className="text-sm text-blue-700">
//                       <span className="font-semibold">Note:</span> Applications are typically reviewed within 3-5 business days. You'll receive an email confirmation once your application is received.
//                     </p>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







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
  });

  const [formErrors, setFormErrors] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    resume: "",
  });

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
            
            // Check if job is active
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

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  // Validate and set file
  const validateAndSetFile = (file: File) => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

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

  // Remove resume
  const handleRemoveResume = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      applicant_name: "",
      email: "",
      phone: "",
      resume: "",
    };

    let isValid = true;

    // Validate name
    if (!formData.applicant_name.trim()) {
      errors.applicant_name = "Full name is required";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Validate resume
    if (!resume) {
      errors.resume = "Resume is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  // Handle form submission
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
      cover_letter: formData.cover_letter || undefined,
      resume: resume || undefined,
    };

    console.log('Submitting application data:', applicationData);

    const response = await careerService.submitApplication(applicationData);

    if (response.success) {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate(`/career/job/${id}`);
      }, 5000);
    } else {
      throw new Error(response.message || 'Failed to submit application');
    }
  } catch (error: any) {
    console.error('Error submitting application:', error);
    
    // Show user-friendly error messages
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

  // Format file size
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
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {jobError || "Job not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The job you're trying to apply for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/career")}
            className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to All Jobs
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying for the{" "}
            <span className="font-semibold">{job.job_title}</span> position. 
            We've received your application and will review it shortly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Redirecting in 5 seconds...</span>
            </div>
            <button
              onClick={() => navigate(`/career/job/${id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Return to job details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/career/job/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Job Details
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Apply for <span className="text-blue-600">{job.job_title}</span>
              </h1>
              <p className="text-gray-600">
                {job.department} • {job.job_type}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-500">
                Ref:
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                #{job.id}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Horizontal Layout - Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Application Form (70%) */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Application Form
                </h2>
                <div className="text-sm text-gray-500">
                  Step 1 of 2 •{" "}
                  <span className="text-blue-600 font-medium">
                    Personal Details
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="applicant_name"
                        value={formData.applicant_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.applicant_name
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="John Doe"
                      />
                      {formErrors.applicant_name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.applicant_name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.email
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          formErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Linkedin className="inline w-4 h-4 mr-1" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="cover_letter"
                    value={formData.cover_letter}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tell us why you're the perfect candidate for this position..."
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Resume / CV *
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      (PDF, DOC, DOCX – max 5MB)
                    </span>
                  </label>

                  <div
                    className={`flex items-center justify-between border ${
                      formErrors.resume
                        ? "border-red-300"
                        : dragActive
                        ? "border-blue-500"
                        : "border-gray-300"
                    } rounded-lg px-4 py-2 transition-all cursor-pointer bg-white`}
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

                    {/* Left */}
                    <div className="flex items-center space-x-3">
                      {resume ? (
                        <FileText className="w-5 h-5 text-green-600" />
                      ) : (
                        <Upload className="w-5 h-5 text-blue-600" />
                      )}

                      <span className="text-sm text-gray-700 truncate max-w-[220px]">
                        {resume ? resume.name : "Upload your resume"}
                      </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center space-x-2">
                      {resume && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveResume();
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <span className="text-xs text-gray-500">
                        {resume ? formatFileSize(resume.size) : "Browse"}
                      </span>
                    </div>
                  </div>

                  {formErrors.resume && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.resume}
                    </p>
                  )}
                </div>

                {/* Terms & Submit */}
                <div className="pt-6 border-t">
                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#0076d8] hover:from-[#024a9e] hover:to-[#0270e1] hover:shadow-lg transform hover:-translate-y-0.5"
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/career/job/${id}`)}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Job Info & Tips (30%) */}
          <div className="lg:w-2/5">
            <div className="space-y-6">
              {/* Job Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Job Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-semibold">{job.job_title}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{job.location || "Remote"}</p>
                    </div>
                  </div>

                  {job.experience_level && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-semibold">{job.experience_level}</p>
                      </div>
                    </div>
                  )}

                  {job.salary_range && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-semibold">{job.salary_range}</p>
                      </div>
                    </div>
                  )}

                  {job.vacancy_count > 0 && (
                    <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                      <Users className="w-5 h-5 text-pink-600 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Vacancies</p>
                        <p className="font-semibold">{job.vacancy_count}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-semibold">{formatDate(job.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Application Tips
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    <span>
                      Ensure your resume is updated and matches the job requirements
                    </span>
                  </li>
                  <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">2</span>
                    </div>
                    <span>
                      Customize your cover letter to highlight relevant experience
                    </span>
                  </li>
                  <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">3</span>
                    </div>
                    <span>
                      Double-check all contact information for accuracy
                    </span>
                  </li>
                  <li className="flex items-start p-2 hover:bg-white/50 rounded transition-colors">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">4</span>
                    </div>
                    <span>
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
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { useParams, useNavigate } from "react-router-dom";
// // import { getJobById } from "../index";
// // import { MapPin, Briefcase, Calendar, DollarSign, ArrowLeft, CheckCircle } from "lucide-react";

// // export default function JobDetailsPage() {
// //   const { id } = useParams<{ id: string }>();
// //   const navigate = useNavigate();
// //   const job = id ? getJobById(id) : null;

// //   if (!job) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20"> {/* Added pt-20 */}
// //         <div className="text-center">
// //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
// //           <button 
// //             onClick={() => navigate("/career")}
// //             className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-9 py-3 rounded-lg font-semibold"
// //           >
// //             Back to Jobs
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const handleApply = () => {
// //     navigate(`/career/job/${id}/apply`);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 pt-26"> {/* Added pt-20 for navbar spacing */}
// //       {/* Main Content */}
// //       <div className="max-w-6xl mx-auto px-4 pb-16">
// //         {/* Back Button - Fixed position for better visibility */}
// //         <div className="mb-6">
// //           <button
// //             onClick={() => navigate("/career")}
// //             className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
// //           >
// //             <ArrowLeft className="w-5 h-5 mr-2" />
// //             Back to Jobs
// //           </button>
// //         </div>

// //         {/* Job Header */}
// //         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
// //           <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
// //             <div className="flex-1">
// //               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
// //               <p className="text-lg md:text-xl text-gray-600 mb-4">{job.company}</p>
              
// //               <div className="flex flex-wrap gap-2 mb-6">
// //                 {job.type.map((tag, i) => (
// //                   <span
// //                     key={i}
// //                     className="px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 font-medium"
// //                   >
// //                     {tag}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
            
// //             <button
// //               onClick={handleApply}
// //               className="bg-gradient-to-r from-[#0076d8] to-[#0076d8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity hover:shadow-lg transform hover:-translate-y-0.5 transition-transform mt-4 md:mt-0 md:ml-4"
// //             >
// //               Apply Now
// //             </button>
// //           </div>

// //           {/* Job Info Grid */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
// //             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
// //               <div className="p-2 bg-blue-100 rounded-lg">
// //                 <Briefcase className="w-5 h-5 text-blue-600" />
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500">Job Type</p>
// //                 <p className="font-semibold">{job.type[0]}</p>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
// //               <div className="p-2 bg-green-100 rounded-lg">
// //                 <MapPin className="w-5 h-5 text-green-600" />
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500">Location</p>
// //                 <p className="font-semibold">{job.location}</p>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
// //               <div className="p-2 bg-purple-100 rounded-lg">
// //                 <DollarSign className="w-5 h-5 text-purple-600" />
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500">Salary</p>
// //                 <p className="font-semibold">{job.salary}</p>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
// //               <div className="p-2 bg-orange-100 rounded-lg">
// //                 <Calendar className="w-5 h-5 text-orange-600" />
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-500">Posted</p>
// //                 <p className="font-semibold">{job.posted}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <p className="text-gray-700 leading-relaxed">{job.description}</p>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
// //           {/* Left Column - Job Details */}
// //           <div className="lg:col-span-2 space-y-6 md:space-y-8">
// //             {/* About Company */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
// //               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">About Hously Finntech Realty</h2>
// //               <p className="text-gray-700 leading-relaxed">{job.aboutCompany}</p>
// //             </div>

// //             {/* Key Responsibilities */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
// //               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Key Responsibilities</h2>
// //               <ul className="space-y-3 md:space-y-4">
// //                 {job.responsibilities.map((responsibility, index) => (
// //                   <li key={index} className="flex items-start">
// //                     <div className="flex-shrink-0 mt-1.5">
// //                       <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
// //                     </div>
// //                     <span className="text-gray-700">{responsibility}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>

// //             {/* Requirements */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
// //               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Requirements</h2>
// //               <ul className="space-y-3 md:space-y-4">
// //                 {job.requirements.map((requirement, index) => (
// //                   <li key={index} className="flex items-start">
// //                     <div className="flex-shrink-0 mt-1.5">
// //                       <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
// //                     </div>
// //                     <span className="text-gray-700">{requirement}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>

// //           {/* Right Column - Benefits & Apply Card */}
// //           <div className="space-y-6 md:space-y-8">
// //             {/* Benefits */}
// //             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8">
// //               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">What You'll Gain</h2>
// //               <ul className="space-y-3 md:space-y-4">
// //                 {job.benefits.map((benefit, index) => (
// //                   <li key={index} className="flex items-start">
// //                     <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
// //                     <span className="text-gray-700">{benefit}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>

// //             {/* Apply Card */}
// //             <div className="bg-gradient-to-br from-[#0270e1] to-[#024a9e] rounded-2xl shadow-lg p-6 md:p-8 text-white">
// //               <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Apply?</h2>
// //               <p className="mb-4 md:mb-6 opacity-90 text-sm md:text-base">
// //                 Don't miss this opportunity. We are excited to review your application!
// //               </p>
// //               <button
// //                 onClick={handleApply}
// //                 className="w-full bg-white text-[#0270e1] py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition-colors"
// //               >
// //                 Apply Now
// //               </button>
// //               <p className="text-xs md:text-sm opacity-80 mt-3 md:mt-4 text-center">
// //                 Applications are reviewed on a rolling basis
// //               </p>
// //             </div>

// //             {/* Job Summary */}
// //             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
// //               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Job Summary</h2>
// //               <div className="space-y-3 md:space-y-4">
// //                 <div className="flex justify-between py-2 md:py-3 border-b">
// //                   <span className="text-gray-600 text-sm md:text-base">Job Type:</span>
// //                   <span className="font-semibold text-sm md:text-base">{job.type[0]}</span>
// //                 </div>
// //                 <div className="flex justify-between py-2 md:py-3 border-b">
// //                   <span className="text-gray-600 text-sm md:text-base">Location:</span>
// //                   <span className="font-semibold text-sm md:text-base">{job.location}</span>
// //                 </div>
// //                 <div className="flex justify-between py-2 md:py-3 border-b">
// //                   <span className="text-gray-600 text-sm md:text-base">Salary:</span>
// //                   <span className="font-semibold text-sm md:text-base">{job.salary}</span>
// //                 </div>
// //                 <div className="flex justify-between py-2 md:py-3">
// //                   <span className="text-gray-600 text-sm md:text-base">Posted:</span>
// //                   <span className="font-semibold text-sm md:text-base">{job.posted}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import careerService, { type Job } from "../../../../services/career.service";
// import { 
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   MapPin, Briefcase, Calendar, ArrowLeft, 
//   CheckCircle, Loader2, AlertCircle, Clock, Users, 
//   IndianRupee
// } from "lucide-react";

// export default function JobDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         if (id) {
//           const response = await careerService.getJobBySlug(id);
          
//           if (response.success && response.data) {
//             setJob(response.data);
//           } else {
//             setError("Job not found");
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching job details:", err);
//         setError("Unable to load job details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [id]);

//   const handleApply = () => {
//     if (job) {
//       navigate(`/career/job/${job.slug}/apply`);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   // Helper function to safely parse requirements, responsibilities, and benefits
//   const parseArrayField = (field: any): string[] => {
//     if (!field) return [];
    
//     if (Array.isArray(field)) {
//       return field.filter(item => item !== null && item !== undefined).map(item => String(item));
//     }
    
//     if (typeof field === 'string') {
//       try {
//         // Try to parse as JSON
//         const parsed = JSON.parse(field);
//         if (Array.isArray(parsed)) {
//           return parsed.filter(item => item !== null && item !== undefined).map(item => String(item));
//         }
//       } catch {
//         // If not valid JSON, split by newlines
//         return field.split('\n').filter((item: string) => item.trim() !== '');
//       }
//     }
    
//     return [];
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
//         <div className="text-center max-w-md px-4">
//           <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             {error || "Job not found"}
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The job you're looking for doesn't exist or has been removed.
//           </p>
//           <button 
//             onClick={() => navigate("/career")}
//             className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-9 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             Back to Jobs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Parse requirements and responsibilities
//   const requirements = parseArrayField(job.requirements);
//   const responsibilities = parseArrayField(job.responsibilities);
//   const benefits = parseArrayField(job.benefits);

//   return (
//     <div className="min-h-screen bg-gray-50 pt-26">
//       <div className="max-w-7xl mx-auto px-4 pb-16">
//         {/* Back Button */}
//         <div className="mb-6">
//           <button
//             onClick={() => navigate("/career")}
//             className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Jobs
//           </button>
//         </div>

//         {/* Job Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//           <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
//             <div className="flex-1">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
//               {job.department && (
//                 <p className="text-lg md:text-xl text-gray-600 mb-4">{job.department}</p>
//               )}
              
//               <div className="flex flex-wrap gap-2 mb-6">
//                 <span className="px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
//                   {job.job_type}
//                 </span>
//                 {job.experience_level && (
//                   <span className="px-3 py-1.5 text-sm rounded-full bg-green-100 text-green-700 font-medium">
//                     {job.experience_level}
//                   </span>
//                 )}
//               </div>
//             </div>
            
//             <button
//               onClick={handleApply}
//               className="bg-gradient-to-r from-[#0076d8] to-[#0076d8] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity hover:shadow-lg transform hover:-translate-y-0.5 transition-transform mt-4 md:mt-0 md:ml-4"
//             >
//               Apply Now
//             </button>
//           </div>

//           {/* Job Info Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Briefcase className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Job Type</p>
//                 <p className="font-semibold">{job.job_type}</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <MapPin className="w-5 h-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Location</p>
//                 <p className="font-semibold">{job.location || "Remote"}</p>
//               </div>
//             </div>

//             {job.salary_range && (
//               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <IndianRupee className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Salary</p>
//                   <p className="font-semibold">{job.salary_range}</p>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <div className="p-2 bg-orange-100 rounded-lg">
//                 <Calendar className="w-5 h-5 text-orange-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Posted</p>
//                 <p className="font-semibold">{formatDate(job.created_at)}</p>
//               </div>
//             </div>
//           </div>

//           {job.vacancy_count > 0 && (
//             <div className="flex items-center space-x-3 mb-4">
//               <Users className="w-5 h-5 text-blue-600" />
//               <span className="text-sm text-gray-600">
//                 {job.vacancy_count} position{job.vacancy_count > 1 ? 's' : ''} available
//               </span>
//             </div>
//           )}

//           {job.application_deadline && (
//             <div className="flex items-center space-x-3 mb-6 p-3 bg-yellow-50 rounded-lg">
//               <Clock className="w-5 h-5 text-yellow-600" />
//               <span className="text-sm text-yellow-700">
//                 Apply before: {new Date(job.application_deadline).toLocaleDateString()}
//               </span>
//             </div>
//           )}

//           <p className="text-gray-700 leading-relaxed">{job.description}</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           {/* Left Column - Job Details */}
//           <div className="lg:col-span-2 space-y-6 md:space-y-8">
//             {/* About Company - You can customize this */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">About Our Company</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 We are a dynamic and innovative company looking for talented individuals to join our team. 
//                 We offer a collaborative environment where you can grow professionally and make a real impact.
//               </p>
//             </div>

//             {/* Key Responsibilities */}
//             {responsibilities.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Key Responsibilities</h2>
//                 <ul className="space-y-3 md:space-y-4">
//                   {responsibilities.map((responsibility, index) => (
//                     <li key={index} className="flex items-start">
//                       <div className="flex-shrink-0 mt-1.5">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
//                       </div>
//                       <span className="text-gray-700">{responsibility}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Requirements */}
//             {requirements.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Requirements</h2>
//                 <ul className="space-y-3 md:space-y-4">
//                   {requirements.map((requirement, index) => (
//                     <li key={index} className="flex items-start">
//                       <div className="flex-shrink-0 mt-1.5">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
//                       </div>
//                       <span className="text-gray-700">{requirement}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Benefits & Apply Card */}
//           <div className="space-y-6 md:space-y-8">
//             {/* Benefits */}
//             {benefits.length > 0 && (
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">What You'll Gain</h2>
//                 <ul className="space-y-3 md:space-y-4">
//                   {benefits.map((benefit, index) => (
//                     <li key={index} className="flex items-start">
//                       <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
//                       <span className="text-gray-700">{benefit}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Apply Card */}
//             <div className="bg-gradient-to-br from-[#0270e1] to-[#024a9e] rounded-2xl shadow-lg p-6 md:p-8 text-white">
//               <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Ready to Apply?</h2>
//               <p className="mb-4 md:mb-6 opacity-90 text-sm md:text-base">
//                 Don't miss this opportunity. We are excited to review your application!
//               </p>
//               <button
//                 onClick={handleApply}
//                 className="w-full bg-white text-[#0270e1] py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition-colors"
//               >
//                 Apply Now
//               </button>
//               <p className="text-xs md:text-sm opacity-80 mt-3 md:mt-4 text-center">
//                 Applications are reviewed on a rolling basis
//               </p>
//             </div>

//             {/* Job Summary */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//               <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Job Summary</h2>
//               <div className="space-y-3 md:space-y-4">
//                 <div className="flex justify-between py-2 md:py-3 border-b">
//                   <span className="text-gray-600 text-sm md:text-base">Job Type:</span>
//                   <span className="font-semibold text-sm md:text-base">{job.job_type}</span>
//                 </div>
//                 <div className="flex justify-between py-2 md:py-3 border-b">
//                   <span className="text-gray-600 text-sm md:text-base">Location:</span>
//                   <span className="font-semibold text-sm md:text-base">{job.location || "Remote"}</span>
//                 </div>
//                 {job.salary_range && (
//                   <div className="flex justify-between py-2 md:py-3 border-b">
//                     <span className="text-gray-600 text-sm md:text-base">Salary:</span>
//                     <span className="font-semibold text-sm md:text-base">{job.salary_range}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between py-2 md:py-3 border-b">
//                   <span className="text-gray-600 text-sm md:text-base">Posted:</span>
//                   <span className="font-semibold text-sm md:text-base">{formatDate(job.created_at)}</span>
//                 </div>
//                 <div className="flex justify-between py-2 md:py-3">
//                   <span className="text-gray-600 text-sm md:text-base">Job ID:</span>
//                   <span className="font-semibold text-sm md:text-base">#{job.id}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import careerService, { type Job } from "../../../../services/career.service";
import { 
  MapPin, Briefcase, Calendar, ArrowLeft, 
  CheckCircle, Loader2, AlertCircle, Clock, Users, 
  IndianRupee
} from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (id) {
          const response = await careerService.getJobBySlug(id);
          
          if (response.success && response.data) {
            setJob(response.data);
          } else {
            setError("Job not found");
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Unable to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = () => {
    if (job) {
      navigate(`/career/job/${job.slug}/apply`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    
    if (Array.isArray(field)) {
      return field.filter(item => item !== null && item !== undefined).map(item => String(item));
    }
    
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item !== null && item !== undefined).map(item => String(item));
        }
      } catch {
        return field.split('\n').filter((item: string) => item.trim() !== '');
      }
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {error || "Job not found"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate("/career")}
            className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const requirements = parseArrayField(job.requirements);
  const responsibilities = parseArrayField(job.responsibilities);
  const benefits = parseArrayField(job.benefits);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/career")}
            className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all text-xs sm:text-sm md:mt-0 mt-5"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to Jobs
          </button>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{job.job_title}</h1>
              {job.department && (
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-4">{job.department}</p>
              )}
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                  {job.job_type}
                </span>
                {job.experience_level && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-green-100 text-green-700 font-medium">
                    {job.experience_level}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleApply}
              className="bg-gradient-to-r from-[#0076d8] to-[#0076d8] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg transform hover:-translate-y-0.5 mt-3 md:mt-0 md:ml-4"
            >
              Apply Now
            </button>
          </div>

          {/* Job Info Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
  
  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
    <div className="p-2 bg-blue-100 rounded-lg">
      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-[10px] sm:text-xs text-gray-500">Job Type</p>
      <p className="text-xs sm:text-sm font-semibold">{job.job_type}</p>
    </div>
  </div>

  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
    <div className="p-2 bg-green-100 rounded-lg">
      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
    </div>
    <div>
      <p className="text-[10px] sm:text-xs text-gray-500">Location</p>
      <p className="text-xs sm:text-sm font-semibold">
        {job.location || "Remote"}
      </p>
    </div>
  </div>

  {job.salary_range && (
    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-purple-100 rounded-lg">
        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-gray-500">Salary</p>
        <p className="text-xs sm:text-sm font-semibold">{job.salary_range}</p>
      </div>
    </div>
  )}

  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
    <div className="p-2 bg-orange-100 rounded-lg">
      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
    </div>
    <div>
      <p className="text-[10px] sm:text-xs text-gray-500">Posted</p>
      <p className="text-xs sm:text-sm font-semibold">
        {formatDate(job.created_at)}
      </p>
    </div>
  </div>

</div>

          {job.vacancy_count > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-[10px] sm:text-xs text-gray-600">
                {job.vacancy_count} position{job.vacancy_count > 1 ? 's' : ''} available
              </span>
            </div>
          )}

          {job.application_deadline && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
              <span className="text-[10px] sm:text-xs text-yellow-700">
                Apply before: {new Date(job.application_deadline).toLocaleDateString()}
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">About Our Company</h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                We are a dynamic and innovative company looking for talented individuals to join our team. 
                We offer a collaborative environment where you can grow professionally and make a real impact.
              </p>
            </div>

            {responsibilities.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Key Responsibilities</h2>
                <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                  {responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Requirements</h2>
                <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {benefits.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">What You'll Gain</h2>
                <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#0270e1] to-[#024a9e] rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4">Ready to Apply?</h2>
              <p className="text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 md:mb-6 opacity-90">
                Don't miss this opportunity. We are excited to review your application!
              </p>
              <button
                onClick={handleApply}
                className="w-full bg-white text-[#0270e1] py-2 sm:py-3 md:py-3.5 rounded-lg font-bold text-xs sm:text-sm md:text-base hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </button>
              <p className="text-[8px] sm:text-[10px] md:text-xs opacity-80 mt-2 sm:mt-3 md:mt-4 text-center">
                Applications are reviewed on a rolling basis
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Job Summary</h2>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex justify-between py-1.5 sm:py-2 border-b">
                  <span className="text-[10px] sm:text-xs text-gray-600">Job Type:</span>
                  <span className="text-[10px] sm:text-xs font-semibold">{job.job_type}</span>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2 border-b">
                  <span className="text-[10px] sm:text-xs text-gray-600">Location:</span>
                  <span className="text-[10px] sm:text-xs font-semibold">{job.location || "Remote"}</span>
                </div>
                {job.salary_range && (
                  <div className="flex justify-between py-1.5 sm:py-2 border-b">
                    <span className="text-[10px] sm:text-xs text-gray-600">Salary:</span>
                    <span className="text-[10px] sm:text-xs font-semibold">{job.salary_range}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 sm:py-2 border-b">
                  <span className="text-[10px] sm:text-xs text-gray-600">Posted:</span>
                  <span className="text-[10px] sm:text-xs font-semibold">{formatDate(job.created_at)}</span>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2">
                  <span className="text-[10px] sm:text-xs text-gray-600">Job ID:</span>
                  <span className="text-[10px] sm:text-xs font-semibold">#{job.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useState, useMemo, type ChangeEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { jobs } from "./index";
// import { Search, MapPin, ArrowUpDown } from "lucide-react";

// export default function CareersPage() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("all");
//   const [selectedType, setSelectedType] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");

//   const handleViewDetails = (jobId: string) => {
//     navigate(`/career/job/${jobId}`);
//   };

//   const handleReset = () => {
//     setSearchTerm("");
//     setSelectedLocation("all");
//     setSelectedType("all");
//     setSortBy("newest");
//   };

//   // Filter jobs based on search criteria
//   const filteredJobs = useMemo(() => {
//     const results = jobs.filter(job => {
//       // Search term filter
//       const matchesSearch = searchTerm === "" || 
//         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.company.toLowerCase().includes(searchTerm.toLowerCase());

//       // Location filter
//       const matchesLocation = selectedLocation === "all" || 
//         (selectedLocation === "remote" && job.location.toLowerCase() === "remote") ||
//         (selectedLocation === "hybrid" && job.location.toLowerCase() === "hybrid") ||
//         (selectedLocation === "onsite" && job.location.toLowerCase() !== "remote" && job.location.toLowerCase() !== "hybrid");

//       // Job type filter
//       const matchesType = selectedType === "all" || 
//         job.type.some(type => type.toLowerCase() === selectedType);

//       return matchesSearch && matchesLocation && matchesType;
//     });

//     // Sort the filtered results
//     results.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           // Assuming jobs have a date property or use id as proxy for newest
//           return parseInt(b.id) - parseInt(a.id);
//         case "oldest":
//           return parseInt(a.id) - parseInt(b.id);
//         case "title-asc":
//           return a.title.localeCompare(b.title);
//         case "title-desc":
//           return b.title.localeCompare(a.title);
//         default:
//           return 0;
//       }
//     });

//     return results;
//   }, [searchTerm, selectedLocation, selectedType, sortBy]);

//   // Get unique locations from jobs
//   const locations = useMemo(() => {
//     const uniqueLocations = new Set<string>();
//     jobs.forEach(job => {
//       uniqueLocations.add(job.location);
//     });
//     return Array.from(uniqueLocations);
//   }, []);

//   // Get unique job types from jobs
//   const jobTypes = useMemo(() => {
//     const types = new Set<string>();
//     jobs.forEach(job => {
//       job.type.forEach(type => {
//         if (type.toLowerCase() !== "internship") {
//           types.add(type.toLowerCase());
//         }
//       });
//     });
//     return Array.from(types);
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen pt-20"> {/* Added pt-20 for navbar space */}
//       {/* Hero Section */}
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
//             Find Your Dream Job
//           </h1>
//           <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg mb-10">
//             Browse through our latest job openings and take the next step in your career journey.
//           </p>

//           {/* Search Section - Optimized for button removal */}
//           <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
//               {/* Search Input */}
//               <div className="md:col-span-5">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//                     placeholder="Job title, keywords, or company"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Location Filter */}
//               <div className="md:col-span-3">
//                 <div className="relative">
//                   <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <select
//                     value={selectedLocation}
//                     onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLocation(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                   >
//                     <option value="all">All Locations</option>
//                     <option value="remote">Remote</option>
//                     <option value="hybrid">Hybrid</option>
//                     <option value="onsite">Onsite</option>
//                     {locations
//                       .filter(loc => !['remote', 'hybrid'].includes(loc.toLowerCase()))
//                       .map((location, index) => (
//                         <option key={index} value={location.toLowerCase()}>
//                           {location.charAt(0).toUpperCase() + location.slice(1)}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Job Type Filter */}
//               <div className="md:col-span-2">
//                 <select
//                   value={selectedType}
//                   onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                 >
//                   <option value="all">All Types</option>
//                   {jobTypes.map((type, index) => (
//                     <option key={index} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Reset Button - Adjusted column span */}
//               <div className="md:col-span-2">
//                 <button
//                   onClick={handleReset}
//                   className="w-full text-blue-600 hover:text-blue-800 px-4 py-3 border border-gray-300  rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                   title="Reset all filters"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Clear all filters
//                 </button>
//               </div>
//             </div>

//             {/* Search Stats */}
//             {/* <div className="flex justify-between items-center text-sm text-gray-600">
//               <div>
//                 Showing <span className="font-semibold">{filteredJobs.length}</span> of{" "}
//                 <span className="font-semibold">{jobs.length}</span> jobs
//               </div>
//               {(searchTerm || selectedLocation !== "all" || selectedType !== "all") && (
//                 <button
//                   onClick={handleReset}
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div> */}
//           </div>

//           {/* Active Filters Display */}
//           {(searchTerm || selectedLocation !== "all" || selectedType !== "all") && (
//             <div className="max-w-6xl mx-auto mt-4 flex flex-wrap gap-2">
//               {searchTerm && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
//                   Search: "{searchTerm}"
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="ml-2 text-blue-500 hover:text-blue-700"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               )}
//               {selectedLocation !== "all" && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
//                   Location: {selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)}
//                   <button
//                     onClick={() => setSelectedLocation("all")}
//                     className="ml-2 text-green-500 hover:text-green-700"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               )}
//               {selectedType !== "all" && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
//                   Type: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
//                   <button
//                     onClick={() => setSelectedType("all")}
//                     className="ml-2 text-purple-500 hover:text-purple-700"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Jobs Section */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
//             Latest Job Opportunities
//           </h2>
          
//           {/* Sort Options */}
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-600 text-sm flex items-center gap-1">
//               <ArrowUpDown className="w-4 h-4" />
//               Sort by:
//             </span>
//             <select 
//               value={sortBy}
//               onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             >
//               <option value="newest">Newest First</option>
//               <option value="oldest">Oldest First</option>
//               <option value="title-asc">Job Title (A-Z)</option>
//               <option value="title-desc">Job Title (Z-A)</option>
//             </select>
//           </div>
//         </div>

//         {/* No Results Message */}
//         {filteredJobs.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
//               <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
//             <p className="text-gray-600 mb-6">
//               Try adjusting your search filters or browse all available positions.
//             </p>
//             <button
//               onClick={handleReset}
//               className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//             >
//               View All Jobs
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredJobs.map((job) => (
//                 <div
//                   key={job.id}
//                   className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-xl transition-all duration-300 p-6 flex flex-col group hover:border-blue-300"
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
//                         {job.title}
//                       </h3>
//                       <p className="text-sm text-gray-500">{job.company}</p>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
//                       New
//                     </span>
//                   </div>

//                   <div className="flex gap-2 mb-4 flex-wrap">
//                     {job.type.map((tag, i) => (
//                       <span
//                         key={i}
//                         className={`text-xs px-3 py-1 rounded-full font-medium ${
//                           tag.toLowerCase() === "internship"
//                             ? "bg-green-100 text-green-700"
//                             : tag.toLowerCase() === "remote"
//                             ? "bg-blue-100 text-blue-700"
//                             : tag.toLowerCase() === "hybrid"
//                             ? "bg-purple-100 text-purple-700"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   <p className="text-gray-600 text-sm flex-grow mb-6 line-clamp-3">
//                     {job.description}
//                   </p>

//                   <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
//                     <div className="flex items-center text-xs text-gray-500">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       <span>{job.location}</span>
//                       <span className="mx-2">•</span>
//                       <span>Posted {job.posted}</span>
//                     </div>
//                     <button 
//                       onClick={() => handleViewDetails(job.id)}
//                       className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity hover:shadow-md"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination (optional) */}
//             {filteredJobs.length > 9 && (
//               <div className="mt-12 flex justify-center">
//                 <nav className="flex items-center space-x-2">
//                   <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
//                     Previous
//                   </button>
//                   <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">1</button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
//                     2
//                   </button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
//                     3
//                   </button>
//                   <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useMemo, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowUpDown, Loader2, Briefcase } from "lucide-react";
import careerService, { type Job } from "../../../services/career.service"; // Adjust path as needed

export default function CareersPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await careerService.getJobs({
          search: searchTerm || undefined,
          location: selectedLocation !== "all" ? selectedLocation : undefined,
          job_type: selectedType !== "all" ? selectedType : undefined,
          active: true // Only fetch active jobs
        });
        
        if (response.success && response.data.jobs) {
          setJobs(response.data.jobs);
        } else {
          setError("Failed to load jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, selectedLocation, selectedType]);

  const handleViewDetails = (jobSlug: string) => {
    navigate(`/career/job/${jobSlug}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedType("all");
    setSortBy("newest");
  };

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const results = jobs.filter(job => {
      // Search term filter
      const matchesSearch = searchTerm === "" || 
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase());

      // Location filter
      const matchesLocation = selectedLocation === "all" || 
        (selectedLocation === "remote" && job.location?.toLowerCase() === "remote") ||
        (selectedLocation === "hybrid" && job.location?.toLowerCase() === "hybrid") ||
        (selectedLocation === "onsite" && job.location?.toLowerCase() !== "remote" && job.location?.toLowerCase() !== "hybrid") ||
        job.location?.toLowerCase() === selectedLocation;

      // Job type filter
      const matchesType = selectedType === "all" || 
        job.job_type?.toLowerCase().includes(selectedType);

      return matchesSearch && matchesLocation && matchesType;
    });

    // Sort the filtered results
    results.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title-asc":
          return a.job_title.localeCompare(b.job_title);
        case "title-desc":
          return b.job_title.localeCompare(a.job_title);
        default:
          return 0;
      }
    });

    return results;
  }, [jobs, searchTerm, selectedLocation, selectedType, sortBy]);

  // Get unique locations from jobs
  const locations = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    
    const uniqueLocations = new Set<string>();
    jobs.forEach(job => {
      if (job.location) {
        uniqueLocations.add(job.location);
      }
    });
    return Array.from(uniqueLocations);
  }, [jobs]);

  // Get unique job types from jobs
  const jobTypes = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    
    const types = new Set<string>();
    jobs.forEach(job => {
      if (job.job_type) {
        types.add(job.job_type);
      }
    });
    return Array.from(types);
  }, [jobs]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please try again later or contact support.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-md mb-10">
            Browse through our latest job openings and take the next step in your career journey.
          </p>

          {/* Search Section */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              {/* Search Input */}
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Job title, keywords, or company"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="md:col-span-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedLocation}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                    {locations
                      .filter(loc => loc && !['remote', 'hybrid'].includes(loc.toLowerCase()))
                      .map((location, index) => (
                        <option key={index} value={location.toLowerCase()}>
                          {location}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  {jobTypes.map((type, index) => (
                    <option key={index} value={type.toLowerCase()}>
                      {type.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="md:col-span-2">
                <button
                  onClick={handleReset}
                  className="w-full text-blue-600 hover:text-blue-800 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  title="Reset all filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedLocation !== "all" || selectedType !== "all") && (
              <div className="max-w-6xl mx-auto mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {selectedLocation !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    Location: {selectedLocation}
                    <button
                      onClick={() => setSelectedLocation("all")}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {selectedType !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                    Type: {selectedType}
                    <button
                      onClick={() => setSelectedType("all")}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Latest Job Opportunities
            {jobs.length > 0 && (
              <span className="ml-2 text-blue-600">({filteredJobs.length})</span>
            )}
          </h2>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm flex items-center gap-1">
              <ArrowUpDown className="w-4 h-4" />
              Sort by:
            </span>
            <select 
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Job Title (A-Z)</option>
              <option value="title-desc">Job Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* No Results Message */}
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <Briefcase className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No job openings available</h3>
            <p className="text-gray-600 mb-6">
              Check back later for new opportunities or subscribe to job alerts.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters or browse all available positions.
            </p>
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View All Jobs
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-xl transition-all duration-300 p-6 flex flex-col group hover:border-blue-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-gray-500">{job.department || "General"}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      New
                    </span>
                  </div>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        job.job_type === 'internship'
                          ? "bg-green-100 text-green-700"
                          : job.location?.toLowerCase() === 'remote'
                          ? "bg-blue-100 text-blue-700"
                          : job.location?.toLowerCase() === 'hybrid'
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {job.job_type?.replace('-', ' ')}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                      {job.experience_level || "Experience not specified"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm flex-grow mb-6 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location || "Not specified"}</span>
                      <span className="mx-2">•</span>
                      <span>Posted {formatDate(job.created_at)}</span>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(job.slug)}
                      className="bg-gradient-to-r from-[#0270e1] to-[#024a9e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity hover:shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (optional) */}
            {filteredJobs.length > 9 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">1</button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
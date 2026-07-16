/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Lightbulb, Users, TrendingUp, Search, ClipboardList, Code, Handshake, ChevronRight, Calendar, MapPin, Clock, Zap } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumb';
import careerService from '../../../services/career.service'; // Adjust path as needed

interface HiringStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  content: {
    heading: string;
    text: string;
  };
}

interface Job {
  id: number;
  job_title: string;
  department?: string;
  location?: string;
  job_type: string;
  description: string;
  experience_level?: string;
  created_at: string;
  slug: string;
}

const HouslyCareerPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [walkInDrives, setWalkInDrives] = useState<any[]>([]);
  const [driveVisible, setDriveVisible] = useState(false);
  const [hoveredDrive, setHoveredDrive] = useState<number | null>(null);
  const navigate = useNavigate();

  const hiringSteps: HiringStep[] = [
    {
      id: 0,
      title: "Job Opportunities",
      icon: <Search className="w-6 h-6" />,
      content: {
        heading: "Job Opportunities",
        text: "Discover exciting career opportunities at Hously Finntech Realty and take the next step in your professional journey. Apply for your desired position by submitting your resume along with a detailed summary of your skills, qualifications, and professional experience. Our team carefully reviews each application to match candidates with the right role."
      }
    },
    {
      id: 1,
      title: "Shortlisting",
      icon: <ClipboardList className="w-6 h-6" />,
      content: {
        heading: "Shortlisting",
        text: "Our HR team at Hously Finntech Realty carefully reviews every application to ensure a strong alignment between your skills, experience, and the role's requirements. Candidates who best match the position are shortlisted for the next stage of the recruitment process. We value talent and aim to provide a fair and transparent hiring experience."
      }
    },
    {
      id: 2,
      title: "Technical Interview",
      icon: <Code className="w-6 h-6" />,
      content: {
        heading: "Technical Interview",
        text: "In this stage, we evaluate your technical expertise and problem-solving skills in detail. You'll meet with the team members you'll be collaborating with to discuss your past projects and work on relevant real-world challenges. This ensures we understand your capabilities and how well they align with the role's requirements."
      }
    },
    {
      id: 3,
      title: "HR Interview",
      icon: <Users className="w-6 h-6" />,
      content: {
        heading: "HR Interview",
        text: "During the HR interview, we focus on your soft skills, cultural fit, and long-term career aspirations. Our goal is to understand your passions, motivations, and how you can grow with the Hously Finntech Realty team. This stage helps ensure that both you and the company are aligned for a successful and fulfilling collaboration."
      }
    },
    {
      id: 4,
      title: "Decision & Offer",
      icon: <Handshake className="w-6 h-6" />,
      content: {
        heading: "Decision & Offer",
        text: "After a final review by the Hously Finntech Realty hiring committee, successful candidates receive a formal job offer. We guide you through your compensation package, benefits, and any remaining questions to ensure a clear understanding of your role and next steps. Our goal is to make your joining experience smooth and transparent."
      }
    }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await careerService.getJobs({
          active: true,
          limit: 3 // Only fetch 3 jobs
        });

        if (response.success && response.data.jobs) {
          // Get only active jobs and sort by newest
          const activeJobs = response.data.jobs
            .filter((job: any) => job.is_active)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3); // Ensure we only take 3 jobs

          setJobs(activeJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch walk-in drives
  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    fetch(`${base}/api/career/walk-in-drives`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setWalkInDrives(data.data.filter((d: any) => d.status === 'Active'));
          // Trigger animation after data loads
          setTimeout(() => setDriveVisible(true), 100);
        }
      })
      .catch(() => { });
  }, []);


  const progressWidth = `${(activeStep / (hiringSteps.length - 1)) * 100}%`;

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

  const getJobTypeColor = (jobType: string) => {
    switch (jobType?.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-700';
      case 'part-time': return 'bg-blue-100 text-blue-700';
      case 'contract': return 'bg-purple-100 text-purple-700';
      case 'internship': return 'bg-yellow-100 text-yellow-700';
      case 'remote': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewAllJobs = () => {
    navigate('/career/job'); // Navigate to job listing page
  };

  const handleViewJobDetails = (slug: string) => {
    navigate(`/career/job/${slug}`);
  };

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-white">
        {/* Compact Hero Section */}
        <div className="relative overflow-hidden bg-[#dbeafe] py-10">
          {/* Soft Background Accents */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0270e1] rounded-full blur-3xl opacity-10"></div>
            <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#fed700] rounded-full blur-3xl opacity-10"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            {/* Heading */}
            <h1 className="font-bold text-gray-900 leading-tight mb-4">
              <span className="block text-3xl md:text-5xl lg:text-4xl">
                Join <span className="text-[#0270e1]">Hously</span> Finntech Realty
              </span>
              <span className="block text-2xl md:text-4xl lg:text-2xl mt-1 text-gray-700">
                Build the Future with Technology
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              Hously is a fast-growing IT solutions company delivering innovative web,
              cloud, and AI services. Join our team and create technology that matters.
            </p>

            <Link to="/career/job">
              <button className="bg-[#0076d8] hover:from-[#024a9e] hover:to-[#0270e1] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                Explore Opportunities
              </button>
            </Link>
          </div>
        </div>

        {/* Why Work With Us - REDUCED SPACE */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-3xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            Why Work With Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Innovation */}
            <div className="text-center transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0270e1] to-[#024a9e]
                rounded-full flex items-center justify-center mx-auto mb-4
                animate-float group-hover:rotate-6 transition-all duration-500 shadow-lg hover:shadow-xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">Innovation</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                At Hously, innovation drives everything we do. We don't just follow trends —
                we build future-ready technology.
              </p>
            </div>

            {/* Collaboration */}
            <div className="text-center transition-all duration-500 hover:scale-105">
              <div
                className="w-16 h-16 bg-gradient-to-br from-[#0270e1] to-[#024a9e]
                rounded-full flex items-center justify-center mx-auto mb-4
                animate-float transition-all duration-500 shadow-lg hover:shadow-xl"
                style={{ animationDelay: "0.3s" }}
              >
                <Users className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">Collaboration</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We thrive on teamwork and shared vision, creating a culture where ideas
                grow through collaboration.
              </p>
            </div>

            {/* Growth */}
            <div className="text-center transition-all duration-500 hover:scale-105">
              <div
                className="w-16 h-16 bg-gradient-to-br from-[#0270e1] to-[#024a9e]
                rounded-full flex items-center justify-center mx-auto mb-4
                animate-float transition-all duration-500 shadow-lg hover:shadow-xl"
                style={{ animationDelay: "0.6s" }}
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">Growth</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We invest in your growth with continuous learning, mentorship, and clear
                career progression paths.
              </p>
            </div>
          </div>
        </div>

        {/* ===== WALK-IN DRIVES SECTION ===== */}
        {walkInDrives.length > 0 && (
          <div className="py-14 px-4 bg-gradient-to-b from-white to-blue-50/30">
            <div className="max-w-6xl mx-auto">

              {/* Header */}
              <div className={`text-center mb-10 transition-all duration-700 ${driveVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-200/60 rounded-full px-5 py-2 mb-5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest">Live Recruitment</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Walk-in <span className="text-[#0270e1]">Recruitment</span> Drives
                </h2>
                <p className="text-gray-500 text-base max-w-xl mx-auto">
                  No lengthy rounds. Just walk in, meet our team, and get hired on the spot.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {walkInDrives.map((drive, i) => (
                  <div
                    key={drive.id}
                    onMouseEnter={() => setHoveredDrive(drive.id)}
                    onMouseLeave={() => setHoveredDrive(null)}
                    className={`relative group rounded-2xl border overflow-hidden transition-all duration-500 ${driveVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      } ${hoveredDrive === drive.id
                        ? 'border-blue-300 shadow-xl shadow-blue-100/50 -translate-y-1'
                        : 'border-gray-200 shadow-sm hover:shadow-md'
                      } bg-white`}
                    style={{ transitionDelay: `${i * 120 + 200}ms` }}
                  >
                    {/* Top gradient bar */}
                    <div className={`h-1 bg-gradient-to-r from-[#0270e1] via-cyan-400 to-blue-500 transition-opacity duration-500 ${hoveredDrive === drive.id ? 'opacity-100' : 'opacity-40'}`} />

                    {/* Hover glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/10 transition-opacity duration-500 ${hoveredDrive === drive.id ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />

                    <div className="p-6 relative z-10">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${hoveredDrive === drive.id ? 'bg-[#0270e1] text-white scale-110' : 'bg-blue-50 text-blue-600'}`}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className={`font-extrabold text-base leading-snug line-clamp-2 transition-colors duration-300 ${hoveredDrive === drive.id ? 'text-[#0270e1]' : 'text-gray-900'}`}>
                              {drive.title}
                            </h3>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </span>
                      </div>

                      {/* Date / Time / Location */}
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-[#0270e1] shrink-0" />
                          <span className="font-semibold">{drive.date}</span>
                          {drive.time && (
                            <>
                              <span className="text-gray-300">·</span>
                              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-gray-500">{drive.time}</span>
                            </>
                          )}
                        </div>
                        {drive.location && (
                          <div className="flex items-center gap-2.5 text-sm text-gray-500">
                            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                            <span className="line-clamp-1">{drive.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {drive.description && (
                        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">{drive.description}</p>
                      )}

                      {/* Skills */}
                      {drive.skills && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {drive.skills.split(',').slice(0, 5).map((skill: string, idx: number) => (
                            <span key={idx} className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                              {skill.trim()}
                            </span>
                          ))}
                          {drive.skills.split(',').length > 5 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
                              +{drive.skills.split(',').length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Walk-in · No appointment needed
                        </span>
                        <Link
                          to="/career/job"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0270e1] hover:text-[#024a9e] transition-colors group/link"
                        >
                          View Jobs
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className={`text-center mt-8 transition-all duration-700 delay-500 ${driveVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm text-gray-400">
                  Bring your updated resume · Dress professionally · Come prepared
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Job Openings - Only 3 Jobs */}
        <div className="bg-gray-50 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">
                Current Openings
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our latest career opportunities
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0270e1]"></div>
                <p className="mt-4 text-gray-600">Loading job openings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No current openings</h3>
                <p className="text-gray-600 mb-6">
                  Check back soon for new opportunities!
                </p>
                <Link to="/career/job">
                  <button className="bg-[#0270e1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#024a9e] transition-colors cursor-pointer">
                    View All Jobs
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col group hover:border-blue-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {job.job_title}
                          </h3>
                          <p className="text-sm text-gray-500">{job.department || "General"}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          New
                        </span>
                      </div>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getJobTypeColor(job.job_type)}`}
                        >
                          {job.job_type?.replace('-', ' ') || 'Full-time'}
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
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{job.location || "Not specified"}</span>
                          <span className="mx-2">•</span>
                          <span>Posted {formatDate(job.created_at)}</span>
                        </div>
                        <button
                          onClick={() => handleViewJobDetails(job.slug)}
                          className="text-[#0270e1] hover:text-[#024a9e] text-sm font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button - Navigates to Job Listing Page */}
                <div className="text-center">
                  <button
                    onClick={handleViewAllJobs}
                    className="inline-flex items-center gap-2 bg-white text-[#0270e1] border-2 border-[#0270e1] hover:bg-[#0270e1] hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    View All Job Openings
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>


        {/* How We Hire - Interactive Timeline */}
        <div className="bg-white py-10 px-4">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Section Intro */}
            <div className="max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">
                How We Hire
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Discover exciting career opportunities at Hously Finntech Realty and take the next step in your professional journey.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-5xl mx-auto mb-10 md:mb-12 py-5 px-4 md:px-0">
              {/* Background Line - Mobile (vertical) */}
              <div className="absolute left-11 md:left-1/2 top-0 h-full w-0.5 bg-gray-200 md:hidden" />

              {/* Background Line - Desktop (horizontal) */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block" />

              {/* Progress Line - Mobile (vertical) */}
              <div
                className="absolute left-11 md:left-1/2 top-0 w-0.5 bg-[#0076d8] md:hidden transition-all duration-500"
                style={{ height: progressWidth }}
              />

              {/* Progress Line - Desktop (horizontal) */}
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 -translate-y-1/2 hidden md:block transition-all duration-500"
                style={{ width: progressWidth }}
              />

              {/* Steps */}
              <div className="relative flex flex-col gap-8 md:flex-row md:justify-between md:items-center z-20">
                {hiringSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative flex flex-row items-start gap-6 md:flex-col md:items-center md:gap-0 group"
                  >
                    {/* Mobile line connector */}
                    <div className="absolute left-[-17px] top-6 h-full w-0.5 bg-transparent md:hidden" />

                    {/* Step number indicator for mobile */}
                    <div className={`absolute left-[-28px] top-6 w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 md:hidden ${activeStep >= index
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                      }`}>
                      {index + 1}
                    </div>

                    {/* Icon Container */}
                    <button
                      onClick={() => setActiveStep(index)}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all relative z-20 focus:outline-none ${activeStep === index
                        ? 'bg-[#0076d8] border-[#0076d8] text-white scale-110 shadow-lg shadow-blue-200'
                        : activeStep > index
                          ? 'bg-[#0076d8] border-[#0076d8] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {/* Desktop Icon */}
                      <div className="hidden md:block">{step.icon}</div>

                      {/* Mobile Icon (smaller) */}
                      <div className="md:hidden">
                        {React.cloneElement(step.icon as React.ReactElement)}
                      </div>
                    </button>

                    {/* Title and Description */}
                    <div className="flex-1 md:flex-none md:text-center md:mt-4 md:max-w-[120px]">
                      <p
                        className={`text-base font-semibold mb-1 ${activeStep === index ? 'text-blue-600' : 'text-gray-700'
                          }`}
                      >
                        {step.title}
                      </p>
                      {/* Optional description for mobile */}
                      <p className="text-sm text-gray-500 md:hidden">
                        {`Step ${index + 1} of ${hiringSteps.length}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Panel */}
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm border-l-4 border-blue-600 text-center min-h-[180px]">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                {hiringSteps[activeStep].content.heading}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                {hiringSteps[activeStep].content.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HouslyCareerPage;
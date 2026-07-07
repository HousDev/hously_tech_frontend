




// // import React, { useState, useRef, useEffect } from 'react';
// // import { Swiper, SwiperSlide } from 'swiper/react';
// // import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// // import type { Swiper as SwiperType } from 'swiper';
// // import { Link } from "react-router-dom";
// // import { caseStudyApi, type CaseStudy } from '../lib/caseStudyApi';

// // // Import Swiper styles
// // import 'swiper/swiper-bundle.css';

// // const CaseStudiesSection: React.FC = () => {
// //   const swiperRef = useRef<SwiperType | null>(null);
// //   const [currentSlide, setCurrentSlide] = useState(1);
// //   const [totalSlides, setTotalSlides] = useState(0);
// //   const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const renderAnimatedText = (text: string) => {
// //     const words = text.split(' ');

// //     return words.map((word, wordIndex) => (
// //       <span key={wordIndex} className="inline-block">
// //         {word.split('').map((letter, letterIndex) => (
// //           <span
// //             key={`${wordIndex}-${letterIndex}`}
// //             className="inline-block animate-fadeInUp"
// //             style={{
// //               animationDelay: `${(wordIndex * 100 + letterIndex * 50)}ms`
// //             }}
// //           >
// //             {letter}
// //           </span>
// //         ))}
// //         {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
// //       </span>
// //     ));
// //   };

// //   // Fetch case studies from API
// //   useEffect(() => {
// //     const fetchCaseStudies = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
// //         // Use getPublic() to fetch only active case studies
// //         const data = await caseStudyApi.getPublic();

// //         // Sort by display_order if needed
// //         const sortedData = [...data].sort((a, b) => a.display_order - b.display_order);

// //         setCaseStudies(sortedData);
// //         setTotalSlides(sortedData.length);
// //       } catch (err) {
// //         console.error('Error fetching case studies:', err);
// //         setError('Failed to load case studies. Please try again later.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCaseStudies();
// //   }, []);

// //   const subTitle = "Case Study";
// //   const mainTitle = "IT Projects Case Study";
// //   const description = "Explore our portfolio of successful technology implementations across various industries, showcasing our expertise in delivering innovative solutions.";

// //   // Show loading state
// //   if (loading) {
// //     return (
// //       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
// //         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
// //           <div className="flex justify-center items-center min-h-[400px]">
// //             <div className="text-center">
// //               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
// //               <p className="text-gray-600">Loading case studies...</p>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // Show error state
// //   if (error) {
// //     return (
// //       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
// //         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
// //           <div className="text-center py-12">
// //             <div className="text-red-600 mb-4">
// //               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             </div>
// //             <p className="text-gray-600 mb-4">{error}</p>
// //             <button 
// //               onClick={() => window.location.reload()}
// //               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //             >
// //               Try Again
// //             </button>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // Show empty state
// //   if (caseStudies.length === 0) {
// //     return (
// //       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
// //         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
// //           <div className="text-center py-12">
// //             <p className="text-gray-600">No case studies available at the moment.</p>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <>
// //       <section
// //         id="case-studies"
// //         className="relative overflow-hidden pt-[80px] pb-[40px] bg-white"
// //       >
// //         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
// //           {/* Title Section */}
// //           <div className="flex flex-wrap justify-center -mx-3">
// //             <div className="w-full xl:w-1/2 lg:w-2/3 px-3">
// //               <div className="text-center mb-[30px] relative z-10 -mt-4">
// //                 {/* Shadow Title */}
// //                 <div
// //                   className="text-[100px] sm:text-[400px] md:text-[350px] lg:text-[200px] font-bold leading-none text-gray-100 opacity-70
// //                              relative left-1/2 -translate-x-1/2 translate-y-10
// //                              w-max -my-[0.6em] z-[-2]"
// //                   style={{ fontFamily: '"Space Grotesk", sans-serif' }}
// //                 >
// //                   Case
// //                 </div>

// //                 {/* Sub Title */}
// //                 <div className="flex items-center justify-center space-x-2 mb-4">
// //                   <div className="w-10 h-[1px] bg-[#0076d8]"></div>
// //                   <span
// //                     className="inline-block text-[12px] sm:text-[14px] font-medium uppercase tracking-wider text-[#0076d8] relative pb-1 animate-slideInUp"
// //                     style={{
// //                       fontFamily: '"Space Grotesk", sans-serif',
// //                       animationDelay: '0ms',
// //                     }}
// //                   >
// //                     {renderAnimatedText(subTitle)}
// //                   </span>
// //                   <div className="w-10 h-[1px] bg-[#0076d8]"></div>
// //                 </div>

// //                 {/* Main Title */}
// //                 <h2
// //                   className="text-[28px] sm:text-[36px] md:text-[36px] lg:text-[39px] font-bold leading-tight text-gray-900 mb-4 -mt-5 animate-slideInUp"
// //                   style={{
// //                     fontFamily: '"Space Grotesk", sans-serif',
// //                     animationDelay: '0ms',
// //                   }}
// //                 >
// //                   {renderAnimatedText(mainTitle)}
// //                 </h2>

// //                 {/* Description */}
// //                 <p
// //                   className="text-gray-600 leading-[1.6] text-[14px] sm:text-[16px] mb-5 animate-slideInUp max-w-2xl mx-auto"
// //                   style={{
// //                     fontFamily: '"DM Sans", sans-serif',
// //                     animationDelay: '200ms',
// //                   }}
// //                 >
// //                   {description}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Slider Section */}
// //         <div className="container mx-auto px-4 md:px-6 max-w-[1500px]">
// //           <div className="relative">
// //             <Swiper
// //               modules={[Navigation, Pagination, Autoplay]}
// //               spaceBetween={20}
// //               slidesPerView={1}
// //               centeredSlides={true}
// //               loop={caseStudies.length > 1} // Only loop if more than 1 slide
// //               autoplay={caseStudies.length > 1 ? {
// //                 delay: 8000,
// //                 disableOnInteraction: false,
// //               } : false}
// //               navigation={{
// //                 nextEl: '.custom-next',
// //                 prevEl: '.custom-prev',
// //               }}
// //               pagination={{
// //                 el: '.custom-pagination',
// //                 type: 'progressbar',
// //               }}
// //               onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
// //               onSwiper={(swiper) => {
// //                 swiperRef.current = swiper;
// //               }}
// //               className="project-slider pb-10"
// //               breakpoints={{
// //                 320: {
// //                   slidesPerView: 1,
// //                   spaceBetween: 15,
// //                   centeredSlides: false,
// //                 },
// //                 768: {
// //                   slidesPerView: 1.2,
// //                   spaceBetween: 20,
// //                   centeredSlides: true,
// //                 },
// //                 1024: {
// //                   slidesPerView: 1.5,
// //                   spaceBetween: 24,
// //                   centeredSlides: true,
// //                         }}
// //                       />
// //                     </div>

// //                     {/* Overlay Content */}
// //                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 md:p-8 flex flex-col justify-end">
// //                       {/* Category Tag */}
// //                       <div className="inline-block mb-3 md:mb-4">
// //                         <span className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-white text-[10px] sm:text-xs md:text-sm font-medium">
// //                           {study.category}
// //                         </span>
// //                       </div>

// //                       {/* Title */}
// //                       <h3 className="text-white font-bold text-base sm:text-xl md:text-[28px] leading-tight mb-2 md:mb-3 max-w-full md:max-w-[441px]">
// //                         {study.title}
// //                       </h3>

// //                       {/* Description */}
// //                       <p className="text-white/90 text-xs sm:text-sm md:text-base mb-2 md:mb-3 max-w-full md:max-w-[441px]">
// //                         {study.description}
// //                       </p>

// //                       {/* Metrics */}
// //                       <div className="flex items-center gap-3 mt-2 md:mt-3">
// //                         <div className="flex items-center gap-1.5">
// //                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
// //                           <span className="text-white text-[10px] sm:text-xs font-medium">{study.metrics}</span>
// //                         </div>
// //                       </div>

// //                       {/* View Details Button */}
// //                       <Link
// //                         to={`/CaseStudy`}
// //                         className="mt-4 md:mt-6 inline-flex items-center gap-1.5 text-white font-medium text-xs sm:text-sm hover:text-blue-300 transition-colors"
// //                         state={{ caseStudy: study }}
// //                       >
// //                         View Case Study
// //                         <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
// //                           <path
// //                             d="M6 4L10 8L6 12"
// //                             stroke="currentColor"
// //                             strokeWidth="2"
// //                             strokeLinecap="round"
// //                             strokeLinejoin="round"
// //                           />
// //                         </svg>
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </SwiperSlide>
// //               ))}
// //             </Swiper>

// //             {/* Custom Controls - Only show if there are case studies */}
// //             {caseStudies.length > 0 && (
// //               <div className="mt-6 md:mt-[20px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-[1404px] mx-auto px-4">
// //                 {/* Slide Counter */}
// //                 <div className="flex items-center gap-2 order-2 md:order-1">
// //                   <span className="text-xl md:text-[24px] font-bold text-gray-900 leading-none">
// //                     {currentSlide.toString().padStart(2, '0')}
// //                   </span>
// //                   <span className="text-gray-400 text-base md:text-[18px] leading-none">/</span>
// //                   <span className="text-gray-400 text-base md:text-[18px] leading-none">
// //                     {totalSlides.toString().padStart(2, '0')}
// //                   </span>
// //                 </div>

// //                 {/* Progress Bar */}
// //                 <div className="flex-1 relative h-[2px] bg-gray-200 overflow-hidden max-w-full md:max-w-[1000px] order-1 md:order-2 w-full">
// //                   <div
// //                     className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
// //                     style={{
// //                       width: `${(currentSlide / totalSlides) * 100}%`,
// //                     }}
// //                   />
// //                 </div>

// //                 {/* Navigation Arrows - Only show if more than 1 slide */}
// //                 {caseStudies.length > 1 && (
// //                   <div className="flex items-center gap-3 order-3">
// //                     <button 
// //                       className="custom-prev w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
// //                       aria-label="Previous slide"
// //                     >
// //                       <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                         <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                       </svg>
// //                     </button>

// //                     <button 
// //                       className="custom-next w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
// //                       aria-label="Next slide"
// //                     >
// //                       <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                         <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                       </svg>
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Global Styles */}
// //       <style>{`
// //         @keyframes slideInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(30px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         @keyframes fadeInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         .animate-slideInUp {
// //           animation: slideInUp 0.9s ease forwards;
// //         }

// //         .animate-fadeInUp {
// //           animation: fadeInUp 0.5s ease forwards;
// //           opacity: 0;
// //         }

// //         /* Custom Swiper Styles */
// //         .project-slider .swiper-slide {
// //           opacity: 0.5;
// //           transition: opacity 0.3s ease;
// //         }

// //         .project-slider .swiper-slide-active {
// //           opacity: 1;
// //         }

// //         .swiper-pagination-progressbar {
// //           position: relative !important;
// //           height: 1px !important;
// //           background: #D7D7D7 !important;
// //           margin: 0 !important;
// //         }

// //         .swiper-pagination-progressbar-fill {
// //           background: #0076d8 !important;
// //           height: 3px !important;
// //           top: -1px !important;
// //         }

// //         /* Mobile Responsive Adjustments */
// //         @media (max-width: 768px) {
// //           .project-slider .swiper-slide {
// //             opacity: 0.7;
// //           }

// //           .project-slider .swiper-slide-active {
// //             opacity: 1;
// //           }
// //         }
// //       `}</style>
// //     </>
// //   );
// // };

// // export default CaseStudiesSection;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { caseStudyApi, type CaseStudy } from '../lib/caseStudyApi';
import Breadcrumb from './Breadcrumb';
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Tag,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */



const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-[#0077d9] rounded-full animate-spin mx-auto"></div>
      <p className="text-sm text-slate-600 mt-3 font-medium">{label}</p>
    </div>
  </div>
);

const ErrorView: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-slate-600 mb-4">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-[#0077d9] text-white rounded-lg hover:bg-[#005fa8] transition-colors"
    >
      Try Again
    </button>
  </div>
);

const sharedStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease forwards; opacity: 0; }
  .line-clamp-1 { display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden; }
  .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
`;

/* ─────────────────────────────────────────────
   Reusable Card
───────────────────────────────────────────── */

interface CardProps {
  study: CaseStudy;
  index?: number;
  linkTo: string;
  linkLabel?: string;
  hideOverlay?: boolean;
}

const CaseStudyCard: React.FC<CardProps> = ({ study, index = 0, linkTo, linkLabel = 'Read Case Study', hideOverlay = false }) => (
  <div
    className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Image */}
    <div className="relative overflow-hidden h-48 sm:h-56">
      <img
        alt={study.title}
        src={study.image_url || 'https://via.placeholder.com/800x400?text=No+Image'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'; }}
      />
      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5 text-slate-700 text-[10px] font-medium">
          {study.category}
        </span>
      </div>
      {/* Hover gradient overlay — hidden on home section */}
      {!hideOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>

    {/* Content */}
    <div className="p-4 sm:p-5">
      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-[#0077d9] transition-colors duration-300">
        {study.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">
        {study.description}
      </p>

      {/* Metrics */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
        <span className="text-xs font-medium text-slate-700 line-clamp-1">{study.metrics}</span>
      </div>

      <Link
        to={linkTo}
        state={{ study }}
        className="inline-flex items-center gap-1.5 text-[#0077d9] font-medium text-xs hover:text-[#005fa8] transition-colors group/link"
      >
        <span>{linkLabel}</span>
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
      </Link>
    </div>

    {/* Accent top line */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0077d9] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {/* Corner accent */}
    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#0077d9]/20 rotate-45 transform origin-top-right" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   1. Home-page Section  (default export)
───────────────────────────────────────────── */

const CaseStudiesSection: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await caseStudyApi.getPublic();
        // Sort by display_order and take only the latest 3
        setCaseStudies([...data].sort((a, b) => a.display_order - b.display_order).slice(0, 3));
      } catch {
        setError('Failed to load case studies. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,118,216,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,118,216,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-full border border-blue-200/30 mb-3 -mt-2">


              <span className="text-[10px] font-bold text-[#0077d9] tracking-wider uppercase">Case Studies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-2">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Our Successful</span>
              <br />
              <span className="text-[#0077d9]">IT Projects Case Study</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Explore our portfolio of successful technology implementations across various industries
            </p>
          </div>

          {/* Body — latest 3 cards, no overlay */}
          {loading ? (
            <Spinner label="Loading case studies..." />
          ) : error ? (
            <ErrorView message={error} />
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No case studies available at the moment.</p>
              <p className="text-xs text-slate-400 mt-0.5">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study, i) => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  index={i}
                  linkTo="/caseStudyDetails"
                  linkLabel="View Details"
                  hideOverlay
                />
              ))}
            </div>
          )}

          {/* View All */}
          {!loading && !error && caseStudies.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/casestudy"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0077d9] text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>View All Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <style>{sharedStyles}</style>
    </>
  );
};

/* ─────────────────────────────────────────────
   2. /casestudy  — All Case Studies Page
───────────────────────────────────────────── */

export const CaseStudiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filtered, setFiltered] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch from backend — same approach as blogApi.getAll()
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await caseStudyApi.getPublic();
        const sorted = [...data].sort((a, b) => a.display_order - b.display_order);
        setCaseStudies(sorted);
        setFiltered(sorted);
      } catch {
        setCaseStudies([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Unique categories (same pattern as Blog)
  const categories = ['All', ...Array.from(new Set(caseStudies.map(s => s.category).filter(Boolean)))];

  // Live filter (same pattern as Blog)
  useEffect(() => {
    let result = [...caseStudies];
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeCategory, caseStudies]);

  return (
    <>
      {/* Breadcrumb banner — identical to Blog */}
      <Breadcrumb />

      {/* Hero text — identical pattern to Blog */}
      <div className="py-5 px-6 max-w-7xl mx-auto">
        {/* Back button — left aligned */}
        <button
          onClick={() => navigate("/homes")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 text-xs font-medium hover:border-[#0076d8] hover:text-[#0076d8] transition-all mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Title + subtitle — centered */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our <span className="text-[#0076d8]">Case Studies</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Explore how we've delivered impactful technology solutions across industries.
          </p>
        </div>
      </div>

      {/* Main section — identical structure to Blog */}
      <section className="py-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Search + Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search case studies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8] bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${activeCategory === cat
                    ? 'bg-[#0076d8] text-white border-[#0076d8] shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0076d8] hover:text-[#0076d8]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center items-center py-24">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-[#0076d8] rounded-full animate-spin" />
            </div>
          )}

          {/* Cards grid */}
          {!loading && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No case studies found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filtered.map((study, index) => (
                    <article
                      key={study.id}
                      onClick={() => navigate('/caseStudyDetails', { state: { study } })}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={study.image_url || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop'}
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={e => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop';
                          }}
                        />
                        {/* Category badge */}
                        <span className="absolute top-3 left-3 bg-[#0076d8] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                          {study.category || 'Case Study'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Meta — key metric */}
                        {/* <div className="flex flex-wrap items-center gap-3 mb-3 text-gray-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#0076d8]" />
                            {study.metrics || 'Key Result'}
                          </span>
                        </div> */}

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#0076d8] transition-colors line-clamp-2">
                          {study.title}
                        </h3>

                        {/* Description / excerpt */}
                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                          {study.description}
                        </p>

                        {/* Footer — same layout as Blog "Read More →" row */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-[#0076d8] text-xs font-semibold group-hover:underline">
                            Read Case Study →
                          </span>
                          <span className="text-gray-400 text-[10px] bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            {study.category}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{sharedStyles}</style>
    </>
  );
};

/* ─────────────────────────────────────────────
   3. /caseStudyDetails  — Single Detail Page
───────────────────────────────────────────── */

export const CaseStudyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const study = location.state?.study as CaseStudy | undefined;

  if (!study) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4 pt-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-9 h-9 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Case Study Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">We couldn't load the details. Please go back and try again.</p>
          <button
            onClick={() => navigate("/casestudy")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0077d9] text-white font-medium text-sm hover:bg-[#005fa8] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const metricsList = study.metrics
    ? study.metrics.split(',').map(m => m.trim()).filter(Boolean)
    : [];

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] pt-20">

        {/* ── Full-bleed Hero ── */}
        <div className="relative w-full h-[340px] sm:h-[420px] md:h-[500px] overflow-hidden">
          <img
            src={study.image_url || 'https://via.placeholder.com/1400x600?text=No+Image'}
            alt={study.title}
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.55)' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1400x600?text=Image+Not+Found'; }}
          />
          {/* Layered gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0077d9]/30 to-transparent" />

          {/* Back button */}
          <div className="absolute top-5 left-5 sm:top-7 sm:left-8">
            <button
              onClick={() => navigate("/casestudy")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition-all duration-300 text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </button>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14">
            <div className="container mx-auto max-w-6xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0077d9] text-white text-[11px] font-bold rounded-md mb-4 uppercase tracking-widest">
                <Tag className="w-3 h-3" />
                {study.category}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug max-w-4xl drop-shadow-lg">
                {study.title}
              </h1>
              {/* Metrics pill */}
              {/* {study.metrics && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/90 text-sm font-medium">{study.metrics}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Main Content ── */}
            <div className="flex-1 space-y-6">

              {/* Overview */}
              <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[#0077d9]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-[#0077d9]" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Project Overview</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{study.description}</p>
              </div>

              {/* Challenge */}
              {study.challenge && (
                <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-l-4 border-orange-400">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 font-bold text-sm">!</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">The Challenge</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{study.challenge}</p>
                </div>
              )}

              {/* Solution */}
              {study.solution && (
                <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-l-4 border-[#0077d9]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#0077d9]" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Our Solution</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{study.solution}</p>
                </div>
              )}

              {/* Results */}
              {study.result && (
                <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-l-4 border-emerald-500">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Results Achieved</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{study.result}</p>
                </div>
              )}

              {/* Metrics bullets */}
              {metricsList.length > 0 && (
                <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Key Results</h2>
                  </div>
                  <ul className="space-y-3">
                    {metricsList.map((m, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        </span>
                        <span className="text-slate-600 text-sm sm:text-base">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {study.technologies && Array.isArray(study.technologies) && study.technologies.length > 0 && (
                <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#0077d9]/10 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-4 h-4 text-[#0077d9]" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Technologies Used</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0077d9] rounded-full text-xs font-semibold border border-blue-100/80 hover:shadow-sm transition-shadow"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sticky Sidebar ── */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4 lg:sticky lg:top-28">

              {/* Project Info card */}
              <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)] overflow-hidden">
                <div className="bg-gradient-to-r from-[#0077d9] to-[#0090ff] px-5 py-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Project Info</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4 text-[#0077d9]" />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Category</p>
                      <p className="text-sm text-slate-800 font-semibold mt-0.5">{study.category}</p>
                    </div>
                  </div>
                  {study.client && (
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-[#0077d9]" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Client</p>
                        <p className="text-sm text-slate-800 font-semibold mt-0.5">{study.client}</p>
                      </div>
                    </div>
                  )}
                  {study.duration && (
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#0077d9]" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Duration</p>
                        <p className="text-sm text-slate-800 font-semibold mt-0.5">{study.duration}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#0077d9]" />
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Key Metric</p>
                      <p className="text-sm text-slate-800 font-semibold mt-0.5">{study.metrics}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlight result card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0077d9] via-[#0090ff] to-[#004fa8] p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute bottom-2 left-2 w-12 h-12 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-white/80" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Key Result</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{study.metrics}</p>
                </div>
              </div>

              {/* CTA */}
              {study.external_url && (
                <a
                  href={study.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white border-2 border-[#0077d9] text-[#0077d9] rounded-xl font-semibold text-sm hover:bg-[#0077d9] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <span>View Live Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Back to all */}
              <button
                onClick={() => navigate('/casestudy')}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                All Case Studies
              </button>
            </div>

          </div>
        </div>
      </div>

      <style>{sharedStyles}</style>
    </>
  );
};

export default CaseStudiesSection;
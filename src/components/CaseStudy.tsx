




// import React, { useState, useRef, useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import type { Swiper as SwiperType } from 'swiper';
// import { Link } from "react-router-dom";
// import { caseStudyApi, type CaseStudy } from '../lib/caseStudyApi';

// // Import Swiper styles
// import 'swiper/swiper-bundle.css';

// const CaseStudiesSection: React.FC = () => {
//   const swiperRef = useRef<SwiperType | null>(null);
//   const [currentSlide, setCurrentSlide] = useState(1);
//   const [totalSlides, setTotalSlides] = useState(0);
//   const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const renderAnimatedText = (text: string) => {
//     const words = text.split(' ');
    
//     return words.map((word, wordIndex) => (
//       <span key={wordIndex} className="inline-block">
//         {word.split('').map((letter, letterIndex) => (
//           <span
//             key={`${wordIndex}-${letterIndex}`}
//             className="inline-block animate-fadeInUp"
//             style={{
//               animationDelay: `${(wordIndex * 100 + letterIndex * 50)}ms`
//             }}
//           >
//             {letter}
//           </span>
//         ))}
//         {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
//       </span>
//     ));
//   };

//   // Fetch case studies from API
//   useEffect(() => {
//     const fetchCaseStudies = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         // Use getPublic() to fetch only active case studies
//         const data = await caseStudyApi.getPublic();
        
//         // Sort by display_order if needed
//         const sortedData = [...data].sort((a, b) => a.display_order - b.display_order);
        
//         setCaseStudies(sortedData);
//         setTotalSlides(sortedData.length);
//       } catch (err) {
//         console.error('Error fetching case studies:', err);
//         setError('Failed to load case studies. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCaseStudies();
//   }, []);

//   const subTitle = "Case Study";
//   const mainTitle = "IT Projects Case Study";
//   const description = "Explore our portfolio of successful technology implementations across various industries, showcasing our expertise in delivering innovative solutions.";

//   // Show loading state
//   if (loading) {
//     return (
//       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
//         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
//           <div className="flex justify-center items-center min-h-[400px]">
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//               <p className="text-gray-600">Loading case studies...</p>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
//         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
//           <div className="text-center py-12">
//             <div className="text-red-600 mb-4">
//               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Show empty state
//   if (caseStudies.length === 0) {
//     return (
//       <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
//         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
//           <div className="text-center py-12">
//             <p className="text-gray-600">No case studies available at the moment.</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section
//         id="case-studies"
//         className="relative overflow-hidden pt-[80px] pb-[40px] bg-white"
//       >
//         <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
//           {/* Title Section */}
//           <div className="flex flex-wrap justify-center -mx-3">
//             <div className="w-full xl:w-1/2 lg:w-2/3 px-3">
//               <div className="text-center mb-[30px] relative z-10 -mt-4">
//                 {/* Shadow Title */}
//                 <div
//                   className="text-[100px] sm:text-[400px] md:text-[350px] lg:text-[200px] font-bold leading-none text-gray-100 opacity-70
//                              relative left-1/2 -translate-x-1/2 translate-y-10
//                              w-max -my-[0.6em] z-[-2]"
//                   style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                 >
//                   Case
//                 </div>

//                 {/* Sub Title */}
//                 <div className="flex items-center justify-center space-x-2 mb-4">
//                   <div className="w-10 h-[1px] bg-[#0076d8]"></div>
//                   <span
//                     className="inline-block text-[12px] sm:text-[14px] font-medium uppercase tracking-wider text-[#0076d8] relative pb-1 animate-slideInUp"
//                     style={{
//                       fontFamily: '"Space Grotesk", sans-serif',
//                       animationDelay: '0ms',
//                     }}
//                   >
//                     {renderAnimatedText(subTitle)}
//                   </span>
//                   <div className="w-10 h-[1px] bg-[#0076d8]"></div>
//                 </div>

//                 {/* Main Title */}
//                 <h2
//                   className="text-[28px] sm:text-[36px] md:text-[36px] lg:text-[39px] font-bold leading-tight text-gray-900 mb-4 -mt-5 animate-slideInUp"
//                   style={{
//                     fontFamily: '"Space Grotesk", sans-serif',
//                     animationDelay: '0ms',
//                   }}
//                 >
//                   {renderAnimatedText(mainTitle)}
//                 </h2>

//                 {/* Description */}
//                 <p
//                   className="text-gray-600 leading-[1.6] text-[14px] sm:text-[16px] mb-5 animate-slideInUp max-w-2xl mx-auto"
//                   style={{
//                     fontFamily: '"DM Sans", sans-serif',
//                     animationDelay: '200ms',
//                   }}
//                 >
//                   {description}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Slider Section */}
//         <div className="container mx-auto px-4 md:px-6 max-w-[1500px]">
//           <div className="relative">
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               spaceBetween={20}
//               slidesPerView={1}
//               centeredSlides={true}
//               loop={caseStudies.length > 1} // Only loop if more than 1 slide
//               autoplay={caseStudies.length > 1 ? {
//                 delay: 8000,
//                 disableOnInteraction: false,
//               } : false}
//               navigation={{
//                 nextEl: '.custom-next',
//                 prevEl: '.custom-prev',
//               }}
//               pagination={{
//                 el: '.custom-pagination',
//                 type: 'progressbar',
//               }}
//               onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//               }}
//               className="project-slider pb-10"
//               breakpoints={{
//                 320: {
//                   slidesPerView: 1,
//                   spaceBetween: 15,
//                   centeredSlides: false,
//                 },
//                 768: {
//                   slidesPerView: 1.2,
//                   spaceBetween: 20,
//                   centeredSlides: true,
//                 },
//                 1024: {
//                   slidesPerView: 1.5,
//                   spaceBetween: 24,
//                   centeredSlides: true,
//                 }
//               }}
//             >
//               {caseStudies.map((study) => (
//                 <SwiperSlide key={study.id} className="max-w-full md:max-w-[870px]">
//                   <div className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer mx-2 md:mx-0">
//                     {/* Image */}
//                     <div className="overflow-hidden rounded-xl md:rounded-2xl">
//                       <img
//                         alt={study.title}
//                         src={study.image_url || 'https://via.placeholder.com/800x400?text=No+Image'}
//                         className="w-full h-[280px] sm:h-[350px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
//                         loading="lazy"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
//                         }}
//                       />
//                     </div>

//                     {/* Overlay Content */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 md:p-8 flex flex-col justify-end">
//                       {/* Category Tag */}
//                       <div className="inline-block mb-3 md:mb-4">
//                         <span className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-white text-[10px] sm:text-xs md:text-sm font-medium">
//                           {study.category}
//                         </span>
//                       </div>

//                       {/* Title */}
//                       <h3 className="text-white font-bold text-base sm:text-xl md:text-[28px] leading-tight mb-2 md:mb-3 max-w-full md:max-w-[441px]">
//                         {study.title}
//                       </h3>

//                       {/* Description */}
//                       <p className="text-white/90 text-xs sm:text-sm md:text-base mb-2 md:mb-3 max-w-full md:max-w-[441px]">
//                         {study.description}
//                       </p>

//                       {/* Metrics */}
//                       <div className="flex items-center gap-3 mt-2 md:mt-3">
//                         <div className="flex items-center gap-1.5">
//                           <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                           <span className="text-white text-[10px] sm:text-xs font-medium">{study.metrics}</span>
//                         </div>
//                       </div>

//                       {/* View Details Button */}
//                       <Link
//                         to={`/CaseStudy`}
//                         className="mt-4 md:mt-6 inline-flex items-center gap-1.5 text-white font-medium text-xs sm:text-sm hover:text-blue-300 transition-colors"
//                         state={{ caseStudy: study }}
//                       >
//                         View Case Study
//                         <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
//                           <path
//                             d="M6 4L10 8L6 12"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </Link>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Custom Controls - Only show if there are case studies */}
//             {caseStudies.length > 0 && (
//               <div className="mt-6 md:mt-[20px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-[1404px] mx-auto px-4">
//                 {/* Slide Counter */}
//                 <div className="flex items-center gap-2 order-2 md:order-1">
//                   <span className="text-xl md:text-[24px] font-bold text-gray-900 leading-none">
//                     {currentSlide.toString().padStart(2, '0')}
//                   </span>
//                   <span className="text-gray-400 text-base md:text-[18px] leading-none">/</span>
//                   <span className="text-gray-400 text-base md:text-[18px] leading-none">
//                     {totalSlides.toString().padStart(2, '0')}
//                   </span>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="flex-1 relative h-[2px] bg-gray-200 overflow-hidden max-w-full md:max-w-[1000px] order-1 md:order-2 w-full">
//                   <div
//                     className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
//                     style={{
//                       width: `${(currentSlide / totalSlides) * 100}%`,
//                     }}
//                   />
//                 </div>

//                 {/* Navigation Arrows - Only show if more than 1 slide */}
//                 {caseStudies.length > 1 && (
//                   <div className="flex items-center gap-3 order-3">
//                     <button 
//                       className="custom-prev w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
//                       aria-label="Previous slide"
//                     >
//                       <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </button>

//                     <button 
//                       className="custom-next w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
//                       aria-label="Next slide"
//                     >
//                       <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Global Styles */}
//       <style>{`
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-slideInUp {
//           animation: slideInUp 0.9s ease forwards;
//         }

//         .animate-fadeInUp {
//           animation: fadeInUp 0.5s ease forwards;
//           opacity: 0;
//         }

//         /* Custom Swiper Styles */
//         .project-slider .swiper-slide {
//           opacity: 0.5;
//           transition: opacity 0.3s ease;
//         }

//         .project-slider .swiper-slide-active {
//           opacity: 1;
//         }

//         .swiper-pagination-progressbar {
//           position: relative !important;
//           height: 1px !important;
//           background: #D7D7D7 !important;
//           margin: 0 !important;
//         }

//         .swiper-pagination-progressbar-fill {
//           background: #0076d8 !important;
//           height: 3px !important;
//           top: -1px !important;
//         }

//         /* Mobile Responsive Adjustments */
//         @media (max-width: 768px) {
//           .project-slider .swiper-slide {
//             opacity: 0.7;
//           }
          
//           .project-slider .swiper-slide-active {
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default CaseStudiesSection;


import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Link } from "react-router-dom";
import { caseStudyApi, type CaseStudy } from '../lib/caseStudyApi';

import 'swiper/swiper-bundle.css';

const CaseStudiesSection: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderAnimatedText = (text: string) => {
    const words = text.split(' ');
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((letter, letterIndex) => (
          <span
            key={`${wordIndex}-${letterIndex}`}
            className="inline-block animate-fadeInUp"
            style={{ animationDelay: `${(wordIndex * 100 + letterIndex * 50)}ms` }}
          >
            {letter}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));
  };

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await caseStudyApi.getPublic();
        const sortedData = [...data].sort((a, b) => a.display_order - b.display_order);
        setCaseStudies(sortedData);
        setTotalSlides(sortedData.length);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError('Failed to load case studies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  const subTitle = "Case Study";
  const mainTitle = "IT Projects Case Study";
  const description = "Explore our portfolio of successful technology implementations across various industries, showcasing our expertise in delivering innovative solutions.";

  if (loading) {
    return (
      <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading case studies...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <section className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
          <div className="text-center py-12">
            <p className="text-gray-600">No case studies available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="case-studies" className="relative overflow-hidden pt-[80px] pb-[40px] bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-[1488px]">
          <div className="flex flex-wrap justify-center -mx-3">
            <div className="w-full xl:w-1/2 lg:w-2/3 px-3">
              <div className="text-center mb-[30px] relative z-10 -mt-4">
                <div className="text-[100px] sm:text-[400px] md:text-[350px] lg:text-[200px] font-bold leading-none text-gray-100 opacity-70 relative left-1/2 -translate-x-1/2 translate-y-10 w-max -my-[0.6em] z-[-2]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Case
                </div>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-10 h-[1px] bg-[#0076d8]"></div>
                  <span className="inline-block text-[12px] sm:text-[14px] font-medium uppercase tracking-wider text-[#0076d8] relative pb-1 animate-slideInUp" style={{ fontFamily: '"Space Grotesk", sans-serif', animationDelay: '0ms' }}>
                    {renderAnimatedText(subTitle)}
                  </span>
                  <div className="w-10 h-[1px] bg-[#0076d8]"></div>
                </div>
                <h2 className="text-[28px] sm:text-[36px] md:text-[36px] lg:text-[39px] font-bold leading-tight text-gray-900 mb-4 -mt-5 animate-slideInUp" style={{ fontFamily: '"Space Grotesk", sans-serif', animationDelay: '0ms' }}>
                  {renderAnimatedText(mainTitle)}
                </h2>
                <p className="text-gray-600 leading-[1.6] text-[14px] sm:text-[16px] mb-5 animate-slideInUp max-w-2xl mx-auto" style={{ fontFamily: '"DM Sans", sans-serif', animationDelay: '200ms' }}>
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-[1500px]">
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              centeredSlides={true}
              loop={caseStudies.length > 1}
              autoplay={caseStudies.length > 1 ? { delay: 8000, disableOnInteraction: false } : false}
              navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
              pagination={{ el: '.custom-pagination', type: 'progressbar' }}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              className="project-slider pb-10"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15, centeredSlides: false },
                768: { slidesPerView: 1.2, spaceBetween: 20, centeredSlides: true },
                1024: { slidesPerView: 1.5, spaceBetween: 24, centeredSlides: true }
              }}
            >
              {caseStudies.map((study) => (
                <SwiperSlide key={study.id} className="max-w-full md:max-w-[870px]">
                  <div className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer mx-2 md:mx-0">
                    <div className="overflow-hidden rounded-xl md:rounded-2xl">
                      <img
                        alt={study.title}
                        src={study.image_url || 'https://via.placeholder.com/800x400?text=No+Image'}
                        className="w-full h-[280px] sm:h-[350px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'; }}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 md:p-8 flex flex-col justify-end">
                      <div className="inline-block mb-3 md:mb-4">
                        <span className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-white text-[10px] sm:text-xs md:text-sm font-medium">
                          {study.category}
                        </span>
                      </div>

                      <h3 className="text-white font-bold text-base sm:text-xl md:text-[28px] leading-tight mb-2 md:mb-3 max-w-full md:max-w-[441px] line-clamp-2">
                        {study.title}
                      </h3>

                      {/* Description truncated to 2 lines */}
                      <p className="text-white/90 text-xs sm:text-sm md:text-base mb-2 md:mb-3 max-w-full md:max-w-[441px] line-clamp-2">
                        {study.description}
                      </p>

                      {/* Only metrics, no extra results */}
                      <div className="flex items-center gap-3 mt-2 md:mt-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-white text-[10px] sm:text-xs font-medium line-clamp-1">
                            {study.metrics}
                          </span>
                        </div>
                      </div>

                      {/* Link to case study page (grid + modal) */}
                      <Link
                        to="/casestudy"
                        className="mt-4 md:mt-6 inline-flex items-center gap-1.5 text-white font-medium text-xs sm:text-sm hover:text-blue-300 transition-colors"
                      >
                        View Case Study
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {caseStudies.length > 0 && (
              <div className="mt-6 md:mt-[20px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-[1404px] mx-auto px-4">
                <div className="flex items-center gap-2 order-2 md:order-1">
                  <span className="text-xl md:text-[24px] font-bold text-gray-900 leading-none">{currentSlide.toString().padStart(2, '0')}</span>
                  <span className="text-gray-400 text-base md:text-[18px] leading-none">/</span>
                  <span className="text-gray-400 text-base md:text-[18px] leading-none">{totalSlides.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex-1 relative h-[2px] bg-gray-200 overflow-hidden max-w-full md:max-w-[1000px] order-1 md:order-2 w-full">
                  <div className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300" style={{ width: `${(currentSlide / totalSlides) * 100}%` }} />
                </div>
                {caseStudies.length > 1 && (
                  <div className="flex items-center gap-3 order-3">
                    <button className="custom-prev w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="custom-next w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideInUp { animation: slideInUp 0.9s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease forwards; opacity: 0; }
        .project-slider .swiper-slide { opacity: 0.5; transition: opacity 0.3s ease; }
        .project-slider .swiper-slide-active { opacity: 1; }
        .swiper-pagination-progressbar { position: relative !important; height: 1px !important; background: #D7D7D7 !important; margin: 0 !important; }
        .swiper-pagination-progressbar-fill { background: #0076d8 !important; height: 3px !important; top: -1px !important; }
        @media (max-width: 768px) { .project-slider .swiper-slide { opacity: 0.7; } .project-slider .swiper-slide-active { opacity: 1; } }
        /* Ensure text truncation works */
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  );
};

export default CaseStudiesSection;
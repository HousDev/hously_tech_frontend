


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { homeApi, type Slide } from "../lib/homeApi";

// const HeroSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSlides = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const allSlides = await homeApi.getAll();
//         const activeSlides = allSlides
//           .filter((s) => s.is_active)
//           .sort((a, b) => a.display_order - b.display_order);
//         setSlides(activeSlides);
//       } catch (err) {
//         console.error("Failed to fetch slides:", err);
//         setError("Unable to load slides. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSlides();
//   }, []);

//   useEffect(() => {
//     if (slides.length === 0 || isAnimating) return;
//     const timer = setInterval(() => {
//       triggerSlide((prev) => (prev + 1) % slides.length);
//     }, 7000);
//     return () => clearInterval(timer);
//   }, [slides.length, isAnimating]);

//   const triggerSlide = (getNext: (prev: number) => number) => {
//     setIsAnimating(true);
//     setTimeout(() => setCurrentSlide(getNext), 500);
//     setTimeout(() => setIsAnimating(false), 1500);
//   };

//   const nextSlide = () => {
//     if (slides.length === 0) return;
//     triggerSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     if (slides.length === 0) return;
//     triggerSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const getImageUrl = (url: string) => {
//     if (!url) return "";
//     if (url.startsWith("http://") || url.startsWith("https://")) return url;
//     const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//     const baseUrl = backendUrl.replace(/\/api$/, "");
//     return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
//   };

//   // ── Loading ──
//   if (loading) {
//     return (
//       <div className="relative min-h-screen bg-gradient-to-br from-[#0b3a66] via-[#0076d8] to-[#003a6e] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-[#ffd801] animate-spin" />
//             <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-[#0076d8]/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
//           </div>
//           <p className="text-white/60 text-sm tracking-widest uppercase animate-pulse">Loading</p>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ──
//   if (error) {
//     return (
//       <div className="relative min-h-screen bg-gradient-to-br from-[#0b3a66] to-[#0076d8] flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
//             <span className="text-2xl">⚠️</span>
//           </div>
//           <p className="text-white text-base sm:text-lg mb-5">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-white text-[#0076d8] px-6 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Empty ──
//   if (slides.length === 0) {
//     return (
//       <div className="relative min-h-screen bg-gradient-to-br from-[#0b3a66] to-[#0076d8] flex items-center justify-center px-4">
//         <div className="text-center">
//           <p className="text-white text-base sm:text-lg font-medium">No slides available</p>
//           <p className="text-white/60 mt-2 text-xs sm:text-sm">Add slides from the admin panel</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="relative min-h-screen overflow-hidden">

//         {/* ── Background Slides ── */}
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-all duration-1200 ${
//               index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
//             }`}
//           >
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{ backgroundImage: `url('${getImageUrl(slide.image_url)}')` }}
//             />
//             <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg_gradient}`} />
//             {/* Layered overlays for depth */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
//           </div>
//         ))}

//         {/* ── Animated Background Orbs ── */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-[#0076d8]/15 rounded-full blur-3xl animate-orb-1" />
//           <div className="absolute bottom-1/4 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-[#ffd801]/10 rounded-full blur-3xl animate-orb-2" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-white/5 rounded-full blur-3xl animate-orb-3" />
//         </div>

//         {/* ── Grid Pattern Overlay ── */}
//         <div
//           className="absolute inset-0 opacity-5 pointer-events-none"
//           style={{
//             backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
//             backgroundSize: "60px 60px",
//           }}
//         />

       

//         {/* ── Main Content ── */}
//         <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-2 pt-20 pb-4">
//           <div className="w-full max-w-4xl mx-auto text-center">
//             <div key={currentSlide}>

//               {/* Badge */}
//               <div
//                 className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6
//                   bg-white/10 backdrop-blur-md border border-white/20 rounded-full
//                   transition-all duration-600 ${
//                     isAnimating ? "opacity-0 -translate-y-3 scale-95" : "opacity-100 translate-y-0 scale-100"
//                   }`}
//               >
//                 <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffd801] animate-pulse" />
//                 <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wider">
//                   Hously Finntech Realty
//                 </span>
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#ffd801] animate-pulse" />
//               </div>

//               {/* Main Title */}
//               <h1
//                 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
//                   font-bold text-white leading-tight tracking-tight mb-2 sm:mb-3
//                   transition-all duration-700 ${
//                     isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
//                   }`}
//               >
//                 {slides[currentSlide].title}
//               </h1>

//               {/* Subtitle — brand blue */}
//               <h2
//                 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl
//                   font-bold mb-4 sm:mb-5
//                   text-[#ffd801]
//                   drop-shadow-[0_0_20px_rgba(0,118,216,0.6)]
//                   transition-all duration-700 delay-100 ${
//                     isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
//                   }`}
//               >
//                 {slides[currentSlide].subtitle}
//               </h2>

//               {/* Divider */}
//               {/* <div
//                 className={`flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6
//                   transition-all duration-600 delay-150 ${
//                     isAnimating ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
//                   }`}
//               >
//                 <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#ffd801]/70 to-[#ffd801]" />
//                 <div className="flex gap-1">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#ffd801]" />
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#ffd801]/50" />
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#ffd801]/20" />
//                 </div>
//                 <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#ffd801]/70 to-[#ffd801]" />
//               </div> */}

//               {/* Description */}
//               <p
//                 className={`text-sm sm:text-base md:text-lg text-white/75
//                   max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-7 sm:mb-9
//                   transition-all duration-700 delay-200 ${
//                     isAnimating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
//                   }`}
//               >
//                 {slides[currentSlide].description}
//               </p>

//               {/* CTA Buttons */}
//               <div
//                 className={`flex flex-row gap-3 sm:gap-4 justify-center items-center
//                   transition-all duration-700 delay-300 ${
//                     isAnimating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
//                   }`}
//               >
//                 {/* Primary */}
//                 <button
//                   onClick={() => navigate("/about")}
//                   className="group relative overflow-hidden
//                     bg-[#0076d8] hover:bg-[#005bb5] text-white
//                     px-5 py-2.5 sm:px-7 sm:py-3.5
//                     text-sm sm:text-base font-semibold rounded-full
//                     shadow-lg shadow-[#0076d8]/40 hover:shadow-xl hover:shadow-[#0076d8]/50
//                     transition-all duration-300 hover:scale-105 active:scale-95
//                     flex items-center gap-2 border border-[#0076d8]/50"
//                 >
//                   <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 ease-out" />
//                   <span className="relative whitespace-nowrap">Discover More</span>
//                   <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform duration-300" />
//                 </button>

//                 {/* Secondary */}
//                 <button
//                   onClick={() => navigate("/contact")}
//                   className="group relative overflow-hidden
//                     border-2 border-white/40 hover:border-[#ffd801] text-white
//                     px-5 py-2.5 sm:px-7 sm:py-3.5
//                     text-sm sm:text-base font-semibold rounded-full
//                     backdrop-blur-sm hover:bg-[#ffd801]/10
//                     transition-all duration-300 hover:scale-105 active:scale-95
//                     flex items-center gap-2"
//                 >
//                   <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-600 ease-out" />
//                   <span className="relative whitespace-nowrap">Contact Us</span>
//                   <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform duration-300" />
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ── Slide Progress Bar (top) ── */}
//         <div className="absolute top-0 left-0 right-0 z-30 h-0.5 bg-white/10">
//           <div
//             className="h-full bg-gradient-to-r from-[#0076d8] to-[#ffd801] transition-all duration-500"
//             style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
//           />
//         </div>

//         {/* ── Controls ── */}
//         <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-20 flex justify-center items-center gap-2 sm:gap-3">
//           <button
//             onClick={prevSlide}
//             className="bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white
//               p-1.5 sm:p-2 rounded-full border border-white/20 hover:border-white/40
//               transition-all duration-300 hover:scale-110 active:scale-95"
//           >
//             {/* <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> */}
//           </button>

//           <div className="flex items-center gap-1 sm:gap-1.5">
//             {slides.map((slide, index) => (
//               <button
//                 key={slide.id}
//                 onClick={() => triggerSlide(() => index)}
//                 className={`transition-all duration-500 rounded-full ${
//                   index === currentSlide
//                     ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#ffd801] shadow-md shadow-[#ffd801]/60"
//                     : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/35 hover:bg-white/60"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             onClick={nextSlide}
//             className="bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white
//               p-1.5 sm:p-2 rounded-full border border-white/20 hover:border-white/40
//               transition-all duration-300 hover:scale-110 active:scale-95"
//           >
//             {/* <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> */}
//           </button>
//         </div>

//       </div>

//       <style>{`
//         @keyframes orb-1 {
//           0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
//           50% { transform: translate(-30px, 20px) scale(1.1); opacity: 0.7; }
//         }
//         @keyframes orb-2 {
//           0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
//           50% { transform: translate(20px, -30px) scale(1.15); opacity: 0.6; }
//         }
//         @keyframes orb-3 {
//           0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
//           50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
//         }
//         .animate-orb-1 { animation: orb-1 8s ease-in-out infinite; }
//         .animate-orb-2 { animation: orb-2 10s ease-in-out infinite; }
//         .animate-orb-3 { animation: orb-3 12s ease-in-out infinite; }
//         .duration-1200 { transition-duration: 1200ms; }
//         .duration-600 { transition-duration: 600ms; }
//       `}</style>
//     </>
//   );
// };

// export default HeroSlider;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { homeApi, type Slide } from "../lib/homeApi";



// ─── Hero Slider ────────────────────────────────────────────────────────────
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        const allSlides = await homeApi.getAll();
        const activeSlides = allSlides
          .filter((s) => s.is_active)
          .sort((a, b) => a.display_order - b.display_order);
        setSlides(activeSlides);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
        setError("Unable to load slides. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0 || isAnimating) return;
    const timer = setInterval(() => {
      triggerSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, isAnimating]);

  const triggerSlide = (getNext: (prev: number) => number) => {
    setIsAnimating(true);
    setTimeout(() => setCurrentSlide(getNext), 320);
    setTimeout(() => setIsAnimating(false), 950);
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    triggerSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    triggerSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const baseUrl = backendUrl.replace(/\/api$/, "");
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const isPngImage = (url: string) => {
    if (!url) return false;
    const clean = url.split("?")[0].split("#")[0];
    return clean.toLowerCase().endsWith(".png");
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#edf4f8] px-4 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,120,120,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_28%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-[28px] bg-white/30 px-8 py-8 backdrop-blur-md">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#dce4ee] border-t-[#ff6b7a]" />
            <div
              className="absolute inset-0 animate-spin rounded-full border-4 border-b-[#8b5cf6]/60 border-transparent"
              style={{ animationDirection: "reverse", animationDuration: "1.4s" }}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#5d6472] sm:text-sm">
            Loading
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#edf4f8] px-4 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,120,120,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_28%)]" />
        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/60 bg-white/78 px-6 py-8 text-center shadow-xl backdrop-blur-xl sm:px-8 sm:py-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="mb-5 text-base text-[#2f2f35] sm:text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-gradient-to-r from-[#ff6b7a] to-[#8b5cf6] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (slides.length === 0) {
    return (
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#edf4f8] px-4 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,120,120,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_28%)]" />
        <div className="relative z-10 rounded-[28px] border border-white/60 bg-white/78 px-8 py-10 text-center shadow-xl backdrop-blur-xl">
          <p className="text-base font-medium text-[#2f2f35] sm:text-lg">No slides available</p>
          <p className="mt-2 text-sm text-[#69717f]">Add slides from the admin panel</p>
        </div>
      </div>
    );
  }

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#edf4f8]">

      {/* ── Radial color overlays ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,120,120,0.09),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.09),transparent_24%),radial-gradient(circle_at_70%_78%,rgba(255,107,122,0.07),transparent_20%)]" />

      {/* ── Light glass overlay so text stays readable ── */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.48),rgba(237,244,248,0.80))]" />

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-32 xl:px-12">
        <div className="grid w-full items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 xl:gap-12">

          {/* ── Left: Text content ──
              Mobile order:
                1. Badge
                2. Title (h1)
                3. Subtitle (h2)
                -- image comes between (order-3 on mobile, see right col) --
                4. Description + Buttons + Controls
          ── */}
          <div className="order-1 flex justify-center lg:order-1 lg:justify-start">
            <div
              className={`w-full max-w-xl text-center transition-all duration-700 lg:text-left ${
                isAnimating ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {/* 1 — Badge */}
              <div className="-mt-2 mb-3 inline-flex items-center gap-2 rounded-full border border-[#f1d7de] bg-[#0076d8] px-4 py-2 shadow-sm backdrop-blur-sm sm:-mt-3">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-xs font-medium tracking-[0.18em] text-white sm:text-sm">
                  Hously Finntech Realty
                </span>
              </div>

              {/* 2 — Title */}
              <h1
                className="text-[2rem] font-extrabold leading-[1.15] tracking-normal text-[#0076d8] sm:text-[2.7rem] md:text-[3.25rem] lg:text-[4.1rem]"
                style={{
                  textShadow:
                    "1px 1px 0 rgba(255,255,255,0.6), 2px 3px 0 rgba(214,61,151,0.18), 4px 6px 14px rgba(31,41,55,0.18)",
                }}
              >
                {current.title}
              </h1>

              {/* 3 — Subtitle */}
              <h2 className="mt-4 text-[1.2rem] font-semibold leading-snug tracking-normal text-[#1F2937] sm:mt-5 sm:text-[1.6rem] md:text-[1.95rem] lg:text-[2.45rem]">
                {current.subtitle}
              </h2>

              {/* ── IMAGE SLOT (mobile only, shown between subtitle & description) ── */}
              {/* On mobile this appears here via order, on lg it's hidden (shown in right col) */}
              <div
                className={`block lg:hidden mt-5 transition-all duration-700 ${
                  isAnimating
                    ? "translate-x-4 scale-95 opacity-0"
                    : "translate-x-0 scale-100 opacity-100"
                }`}
              >
                <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[380px]">
                  {isPngImage(current.image_url) ? (
                    <img
                      src={getImageUrl(current.image_url)}
                      alt={current.title}
                      className="w-full h-auto block"
                      style={{
                        objectFit: "contain",
                        maxHeight: "280px",
                        filter: "drop-shadow(0px 16px 32px rgba(31,41,55,0.14))",
                      }}
                    />
                  ) : (
                    <div className="rounded-[24px] border border-white/60 bg-white/85 p-3 shadow-[0_16px_36px_rgba(31,41,55,0.14)] backdrop-blur-sm">
                      <img
                        src={getImageUrl(current.image_url)}
                        alt={current.title}
                        className="w-full h-auto block rounded-xl"
                        style={{ objectFit: "contain", maxHeight: "260px" }}
                      />
                    </div>
                  )}
                  <div className="pointer-events-none absolute -right-2 -top-3 h-16 w-16 rounded-full bg-[#ff6b7a]/10 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-3 -left-2 h-16 w-16 rounded-full bg-[#8b5cf6]/12 blur-2xl" />
                </div>
              </div>

              {/* 4 — Description */}
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#6B7280] sm:mt-5 sm:text-[15px] md:text-[16px] lg:mx-0">
                {current.description}
              </p>

              {/* 5 — Buttons */}
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap lg:justify-start">
                <button
                  onClick={() => navigate("/about")}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#0076d8] to-[#0076d8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(141,92,246,0.22)] transition-all duration-300 hover:scale-[1.03] active:scale-95 sm:px-7 sm:text-base"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    Discover More
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="group inline-flex items-center justify-center rounded-full border border-[#dce3ed] bg-white/78 px-6 py-3.5 text-sm font-semibold text-[#30303a] shadow-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#0076d8] hover:text-[#0076d8] hover:shadow-md active:scale-95 sm:px-7 sm:text-base"
                >
                  <span className="flex items-center gap-2">
                    Contact Us
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>

            </div>
          </div>

          {/* ── Right: Image (desktop only — hidden on mobile, shown in left col above) ── */}
          <div className="hidden lg:flex order-2 items-center justify-center">
            <div
              className={`relative w-full max-w-[340px] transition-all duration-700 sm:max-w-[430px] md:max-w-[520px] lg:max-w-[620px] ${
                isAnimating
                  ? "translate-x-6 scale-95 opacity-0"
                  : "translate-x-0 scale-100 opacity-100"
              }`}
            >
              {isPngImage(current.image_url) ? (
                <img
                  src={getImageUrl(current.image_url)}
                  alt={current.title}
                  className="w-full h-auto block"
                  style={{
                    objectFit: "contain",
                    maxHeight: "460px",
                    filter: "drop-shadow(0px 24px 48px rgba(31,41,55,0.14))",
                  }}
                />
              ) : (
                <div className="rounded-[28px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_48px_rgba(31,41,55,0.16)] backdrop-blur-sm sm:p-6">
                  <img
                    src={getImageUrl(current.image_url)}
                    alt={current.title}
                    className="w-full h-auto block rounded-2xl"
                    style={{ objectFit: "contain", maxHeight: "420px" }}
                  />
                </div>
              )}

              {/* Decorative blobs */}
              <div className="pointer-events-none absolute -right-3 -top-4 h-20 w-20 rounded-full bg-[#ff6b7a]/10 blur-3xl sm:-right-5 sm:-top-5 sm:h-24 sm:w-24" />
              <div className="pointer-events-none absolute -bottom-5 -left-4 h-24 w-24 rounded-full bg-[#8b5cf6]/12 blur-3xl sm:-bottom-7 sm:-left-6 sm:h-28 sm:w-28" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide controls (Centered globally at the bottom) ── */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-2 sm:bottom-8">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => triggerSlide(() => index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              index === currentSlide
                ? "w-10 bg-gradient-to-r from-[#0076d8] to-[#0076d8]"
                : "w-2 bg-[#cbd6e2] hover:bg-[#aebed0]"
            }`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#dfe5ee]">
        <div
          className="h-full bg-gradient-to-r from-[#0076d8] via-[#0066c0] to-[#8b5cf6] transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;
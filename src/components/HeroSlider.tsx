/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { ArrowRight} from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const HeroSlider = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const navigate = useNavigate();

//   const slides = [
//     {
//       title: "Transform Your Business with",
//       subtitle: "Advanced IT Solutions",
//       description:
//         "Delivering scalable software, cloud infrastructure, and intelligent IT services to power modern enterprises.",
//       image:
//         "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
//       bgGradient:
//         "from-[#0b3a66]/95 via-[#0b3a66]/70 to-[#00c6ff]/20",
//     },
//     {
//       title: "Build Digital Excellence with",
//       subtitle: "Cloud Computing & Software Services",
//       description:
//         "Secure, high-performance cloud platforms and custom software solutions designed for growth and reliability.",
//       image:
//         "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
//       bgGradient:
//         "from-[#091f3a]/95 via-[#0076d8]/65 to-[#00c6ff]/25",
//     },
//     {
//       title: "Protect Your Digital Ecosystem with",
//       subtitle: "Cybersecurity & IT Infrastructure",
//       description:
//         "Enterprise-grade security, compliance, and IT infrastructure solutions to safeguard your digital assets.",
//       image:
//         "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80",
//       bgGradient:
//         "from-[#0b3a66]/90 via-[#1a2a4a]/60 to-[#00c6ff]/30",
//     },
//   ];
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//       }, 500);
//       setTimeout(() => {
//         setIsAnimating(false);
//       }, 1500);
//     }, 7000);

//     return () => clearInterval(timer);
//   }, [slides.length]);

//   const nextSlide = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 500);
//     setTimeout(() => {
//       setIsAnimating(false);
//     }, 1500);
//   };

//   const prevSlide = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     }, 500);
//     setTimeout(() => {
//       setIsAnimating(false);
//     }, 1500);
//   };

//   return (
//     <>
//       <div className="relative min-h-screen overflow-hidden">
//         {/* Background Images with Transition */}
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-all duration-1000 ${
//               index === currentSlide
//                 ? "opacity-100 scale-100"
//                 : "opacity-0 scale-110"
//             }`}
//           >
//             <div
//               className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
//               style={{ backgroundImage: `url('${slide.image}')` }}
//             />
//             <div
//               className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}
//             />
//           </div>
//         ))}

//         {/* Hero Content */}
//         <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <div key={currentSlide}>
//               <h1
//                 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 ${
//                   isAnimating
//                     ? "translate-x-full opacity-0"
//                     : "translate-x-0 opacity-100"
//                 }`}
//               >
//                 {slides[currentSlide].title}
//                 <span className="block mt-2 bg-gradient-to-r from-[#ffd801] via-[#ffd801] to-[#0076d8] bg-clip-text text-transparent animate-gradient">
//                   {slides[currentSlide].subtitle}
//                 </span>
//               </h1>

//               <p
//                 className={`text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-200 ${
//                   isAnimating
//                     ? "translate-x-full opacity-0"
//                     : "translate-x-0 opacity-100"
//                 }`}
//               >
//                 {slides[currentSlide].description}
//               </p>

//              <div
//   className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center
//     transform transition-all duration-1000 delay-300 ${
//       isAnimating
//         ? "translate-y-6 opacity-0"
//         : "-translate-y-2 opacity-100"
//     }`}
// >
//   <button
//     onClick={() => navigate("/about")}
//     className="bg-[#0076d8] hover:bg-[#0066c0] text-white
//       px-5 py-3 sm:px-8 sm:py-4
//       text-base sm:text-lg
//       rounded-full font-semibold transition transform hover:scale-110
//       shadow-xl shadow-[#0076d8]/30 flex items-center space-x-2
//       hover:shadow-2xl hover:shadow-[#0076d8]/50 group backdrop-blur-sm"
//   >
//     <span>Discover More</span>
//     <ArrowRight
//       size={20}
//       className="group-hover:translate-x-1 transition"
//     />
//   </button>

//   <button
//     onClick={() => navigate("/contact")}
//     className="border-2 border-[#ffd801] hover:border-white text-white
//       px-5 py-3 sm:px-8 sm:py-4
//       text-base sm:text-lg
//       rounded-full font-semibold hover:bg-[#ffd801]/20 backdrop-blur-sm
//       transition transform hover:scale-110 flex items-center space-x-2 group"
//   >
//     <span>Contact Us</span>
//     <ArrowRight
//       size={20}
//       className="group-hover:translate-x-1 transition"
//     />
//   </button>
// </div>

//             </div>
//           </div>
//         </div>

//         {/* Slider Controls */}
//         <div className="absolute bottom-0 sm:bottom-2 left-0 right-0 z-20 flex justify-center items-center space-x-3">
//           <button
//             onClick={prevSlide}
//             className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition transform hover:scale-110 hover:-translate-x-1"
//           >
//             {/* <ChevronLeft size={18} /> */}
//           </button>

//           <div className="flex space-x-1.5">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setIsAnimating(true);
//                   setTimeout(() => setCurrentSlide(index), 500);
//                   setTimeout(() => setIsAnimating(false), 1500);
//                 }}
//                 className={`transition-all duration-500 rounded-full ${
//                   index === currentSlide
//                     ? "w-8 h-2 bg-[#ffd801] shadow-lg shadow-[#ffd801]/50 backdrop-blur-sm"
//                     : "w-2 h-2 bg-white/50 hover:bg-white/80 hover:scale-125 backdrop-blur-sm"
//                 }`}
//               />
//             ))}
//           </div>

//           <button
//             onClick={nextSlide}
//             className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition transform hover:scale-110 hover:translate-x-1"
//           >
//             {/* <ChevronRight size={18} /> */}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
        
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }
//       `}</style>
//     </>
//   );
// };

// export default HeroSlider;






import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/authService"; // Adjust path as needed
import type { ApiResponse } from "../types/auth.types"; // Adjust path as needed
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  bg_gradient: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<ApiResponse<Slide[]>>("/home/slides");
        
        if (response.data.success && response.data.data) {
          // Filter active slides and sort by display order
          const activeSlides = response.data.data
            .filter((slide: { is_active: any; }) => slide.is_active)
            .sort((a: { display_order: number; }, b: { display_order: number; }) => a.display_order - b.display_order);
          
          setSlides(activeSlides);
        } else {
          setError("Failed to load slides from server");
        }
      } catch (err) {
        console.error("Failed to fetch slides:", err);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length === 0 || isAnimating) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 500);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    }, 7000);

    return () => clearInterval(timer);
  }, [slides.length, isAnimating]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 500);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, 500);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // Get proper image URL (handles both full URLs and relative paths)
  const getImageUrl = (url: string) => {
    if (!url) return "";
    
    // If it's already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // If it's a relative path, prepend backend URL
    // Use environment variable if available, otherwise default to localhost
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">No slides available</p>
          <p className="text-white/80 mt-2">Please add slides from the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Images with Transition */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
              style={{ backgroundImage: `url('${getImageUrl(slide.image_url)}')` }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.bg_gradient}`}
            />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div key={currentSlide}>
              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 ${
                  isAnimating
                    ? "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                {slides[currentSlide].title}
                <span className="block mt-2 bg-gradient-to-r from-[#ffd801] via-[#ffd801] to-[#0076d8] bg-clip-text text-transparent animate-gradient">
                  {slides[currentSlide].subtitle}
                </span>
              </h1>

              <p
                className={`text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-200 ${
                  isAnimating
                    ? "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                {slides[currentSlide].description}
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center
                  transform transition-all duration-1000 delay-300 ${
                    isAnimating
                      ? "translate-y-6 opacity-0"
                      : "-translate-y-2 opacity-100"
                  }`}
              >
                <button
                  onClick={() => navigate("/about")}
                  className="bg-[#0076d8] hover:bg-[#0066c0] text-white
                    px-5 py-3 sm:px-8 sm:py-4
                    text-base sm:text-lg
                    rounded-full font-semibold transition transform hover:scale-110
                    shadow-xl shadow-[#0076d8]/30 flex items-center space-x-2
                    hover:shadow-2xl hover:shadow-[#0076d8]/50 group backdrop-blur-sm"
                >
                  <span>Discover More</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-[#ffd801] hover:border-white text-white
                    px-5 py-3 sm:px-8 sm:py-4
                    text-base sm:text-lg
                    rounded-full font-semibold hover:bg-[#ffd801]/20 backdrop-blur-sm
                    transition transform hover:scale-110 flex items-center space-x-2 group"
                >
                  <span>Contact Us</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-0 sm:bottom-2 left-0 right-0 z-20 flex justify-center items-center space-x-3">
          <button
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition transform hover:scale-110 hover:-translate-x-1"
          >
            {/* <ChevronLeft size={18} /> */}
          </button>

          <div className="flex space-x-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => setCurrentSlide(index), 500);
                  setTimeout(() => setIsAnimating(false), 1500);
                }}
                className={`transition-all duration-500 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-2 bg-[#ffd801] shadow-lg shadow-[#ffd801]/50 backdrop-blur-sm"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80 hover:scale-125 backdrop-blur-sm"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition transform hover:scale-110 hover:translate-x-1"
          >
            {/* <ChevronRight size={18} /> */}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default HeroSlider;
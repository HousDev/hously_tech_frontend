// WelcomePage.tsx
import {
  Building2,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Award,
  Users,
  Globe,
  Target,
  Zap,
  CheckCircle,
  ChevronUp,
  X,
  ArrowDown,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import logo from "../assets/images/hously-logo.png";
import { Link } from "react-router-dom";
import TimelineDot from "./TimelineDot";


interface WelcomePageProps {
  onSectorClick: (sectorId: string) => void;
}

// Move StatItem component outside to fix React Hook error
const StatItem = ({ 
  stat, 
  index, 
  visibleStats 
}: { 
  stat: { value: string; label: string; icon: React.ElementType };
  index: number;
  visibleStats: boolean;
}) => {
  const Icon = stat.icon;
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (visibleStats) {
      const targetValue = parseInt(stat.value);
      if (isNaN(targetValue)) return;

      const duration = 1500;
      const steps = 60;
      const increment = targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setCount(targetValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [visibleStats, stat.value]);

    return (
    <div
      key={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200/50 
        shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 overflow-hidden group
        ${visibleStats ? "animate-scale-in" : "opacity-0"}`}
      style={{
        animationDelay: `${index * 150}ms`,
        transform: isHovered
          ? "translateY(-4px) sm:translateY(-6px) md:translateY(-8px) scale(1.02)"
          : "translateY(0) scale(1)",
      }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
          style={{ transitionDelay: "100ms" }}
        ></div>
      </div>

      {/* Icon Container with Glow Effect */}
      <div className="relative flex justify-center mb-2 sm:mb-3 md:mb-4">
        <div className="relative">
          {/* Outer Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg md:rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
          ></div>

          {/* Icon Background */}
          <div
            className={`relative p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg md:rounded-xl shadow-lg 
            transform transition-all duration-500 ${isHovered ? "scale-110 rotate-6" : ""}`}
          >
            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-white" />
          </div>

          {/* Pulsing Ring */}
          <div
            className={`absolute inset-0 border-2 border-blue-400/50 rounded-md sm:rounded-lg md:rounded-xl ${
              isHovered ? "animate-ping-slow" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* Animated Number Counter */}
      <div className="flex flex-col items-center text-center">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text transition-all duration-500">
          {stat.value.includes("+") ? (
            <>
              <span className="inline-block min-w-[2ch] text-center">
                {visibleStats ? count : 0}
              </span>
              <span>+</span>
            </>
          ) : (
            stat.value
          )}
        </div>

        {/* Animated Underline */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
      </div>

      {/* Label with Hover Effect */}
      <div className="relative flex justify-center mt-1 sm:mt-2">
        <div className="text-[10px] xs:text-xs sm:text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-500 leading-tight px-1 sm:px-2 text-center">
          {stat.label}
        </div>

        {/* Label Background on Hover */}
        <div className="absolute inset-x-0 -inset-y-1 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-l border-blue-400/30 group-hover:border-blue-500/70 transition-colors duration-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-r border-cyan-400/30 group-hover:border-cyan-500/70 transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-l border-blue-400/30 group-hover:border-blue-500/70 transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-r border-cyan-400/30 group-hover:border-cyan-500/70 transition-colors duration-500"></div>

      {/* Pulse Effect on Hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl ring-2 ring-blue-400/30 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};
function WelcomePage({ onSectorClick }: WelcomePageProps) {
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const timeline = [
    {
      year: "2012-2018",
      title: "AAKAR INFRA SERVICES - The Beginning",
      desc: "Started with a vision in infrastructure development, focusing on quality construction and civil engineering projects. Built a strong foundation with residential and commercial construction, establishing partnerships with leading developers across the region.",
      services: ["Civil Engineering", "Infrastructure Development", "Construction Management", "Site Planning", "Residential Projects", "Commercial Construction"],
      milestone: "Founded with commitment to excellence"
    },
    {
      year: "2019-2021",
      title: "Digital Transformation & Growth",
      desc: "Embraced technology and innovation, introducing digital solutions for project management and client engagement. Diversified operations and expanded service offerings to meet evolving market demands with smart construction techniques and IoT integration.",
      services: ["Smart Construction", "Digital Project Management", "Client Portals", "IoT Integration", "Project Consulting", "Quality Assurance"],
      milestone: "Launched technology division"
    },
    {
      year: "2025 & Beyond",
      title: "HOUSLY FINNTECH REALTY - The Future",
      desc: "Rebranded to HOUSLY FINNTECH REALTY, unifying three powerful divisions under one visionary brand. A comprehensive multi-sector conglomerate leading innovation in real estate, finance, and technology. Building tomorrow, today with AI-powered solutions and global expansion.",
      services: ["Real Estate Development", "Financial Technology", "IT Solutions", "AI-Powered Solutions", "Blockchain Integration", "Smart City Projects"],
      milestone: "Shaping the future of integrated services"
    },
  ];

  // useEffect(() => {
  //   timelineRefs.current = timelineRefs.current.slice(0, timeline.length);
  // }, [timeline]);

  const [activeModal, setActiveModal] = useState<null | "real-estate" | "finance">(null);

  const sectors = [
  {
  id: "real-estate",
  title: "Real Estate",
  description: "Premium residential and commercial properties. Building dreams, creating landmarks.",
  icon: Building2,
  color: "from-indigo-600 to-purple-600",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
  hoverGradient: "linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)",
  accentColor: "#8b5cf6",
image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&h=650"
,  features: [
    "Property Development",
    "Commercial Buildings",
    "Residential Apartments",
    "Real Estate Investment",
  ],
}
,
   {
  id: "finance",
  title: "Finance",
  description: "Comprehensive financial solutions and investment services. Empowering financial freedom.",
  icon: TrendingUp,
  color: "from-emerald-600 to-teal-600",
  gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
  hoverGradient: "linear-gradient(135deg, #047857 0%, #0f766e 100%)",
  accentColor: "#14b8a6",
  image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&h=650",
  features: [
    "Financial Planning",
    "Investment Advisory",
    "Wealth Management",
    "Risk Analysis",
  ],
},
    {
  id: "it-tech",
  title: "IT & Technology",
  description: "Cutting-edge technology solutions and digital transformation. Innovating tomorrow.",
  icon: Cpu,
  color: "from-blue-600 to-cyan-500",
  gradient: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
  hoverGradient: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)",
  accentColor: "#0ea5e9",
image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&h=650"
,  features: [
    "Software Development",
    "IT Consulting",
    "Digital Transformation",
    "Cloud & Automation",
  ],
}
,
  ];

  const stats = [
    { value: "12+", label: "Years Combined Experience", icon: Award },
    { value: "100+", label: "Projects Completed", icon: Target },
    { value: "500+", label: "Happy Clients", icon: Users },
    { value: "3", label: "Industry Sectors", icon: Globe },
  ];

  const features = [
    { icon: Zap, title: "Innovative Solutions", desc: "Cutting-edge approaches to modern challenges" },
    { icon: Award, title: "Award-Winning Service", desc: "Recognized excellence across industries" },
    { icon: CheckCircle, title: "Proven Track Record", desc: "Decades of successful project delivery" },
    { icon: Globe, title: "Global Presence", desc: "Serving clients across multiple regions" },
  ];

   useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCards(new Array(sectors.length).fill(false));
    timelineRefs.current = timelineRefs.current.slice(0, timeline.length);
  }, [sectors.length, timeline.length]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewBrand(true);
    }, 2000);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setParallaxOffset(scrollY * 0.5);
      const scrolled = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
      setShowScrollTop(scrollY > 300);

      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setVisibleStats(true);
        }
      }

      cardsRef.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) {
            setVisibleCards((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fix ref callback type issue
  const setCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
    cardsRef.current[index] = el;
  }, []);


  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        {/* Logo */}
        <div className="fixed top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 z-40 animate-fade-in">
          <img src={logo} alt="Hously Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-2xl" />
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMDAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 sm:opacity-20 md:opacity-40"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2, 1.5, 0.5, 2.5, 1.8].map((delay, i) => (
            <div
              key={i}
              className={`absolute ${i === 0 ? 'top-10 left-5' : i === 1 ? 'top-20 right-10' : i === 2 ? 'top-40 left-20' : i === 3 ? 'top-60 right-40' : i === 4 ? 'top-80 left-60' : i === 5 ? 'bottom-40 right-20' : 'bottom-60 left-40'} 
                w-1 h-1 sm:w-2 sm:h-2 ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-emerald-400'} rounded-full animate-float`}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        {/* Parallax Background */}
        <div
          className="absolute inset-0 opacity-5 sm:opacity-10 pointer-events-none"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <div className="absolute top-10 left-5 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-blue-400 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-5 w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-cyan-400 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-emerald-400 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
<div className="container mx-auto px-3 sm:px-0 md:px-0 py-0">
            {/* Hero Section */}
<section className="min-h-screen px-4 pt-0 pb-0">
  <div className="max-w-6xl mx-auto w-full">
    <div className="text-center">

      {/* Old Brand */}
      <div
        className={`transition-all duration-1000 ${
          showNewBrand
            ? "opacity-0 -translate-y-12 scale-95 pointer-events-none mt-0"
            : "opacity-100 translate-y-0 scale-100 mt-36 sm:mt-2 md:mt-20"
        }`}
      >
        <div className="inline-block space-y-6 sm:space-y-8">
          {/* Est Badge with decorative lines */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-slate-300" />
            <div className="text-xs sm:text-s font-medium text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              Est. 2013
            </div>
            <div className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-slate-300" />
          </div>

          {/* Main Brand */}
          <div className="space-y-4 sm:space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-medium text-slate-800 tracking-tight leading-none">
              AAKAR
            </h1>
            
            <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto" />
            
            <p className="text-xl md:text-2xl lg:text-5xl font-extralight text-slate-500 tracking-wide">
              Infra Services
            </p>
          </div>

         
          {/* Additional Info - Legacy Statement */}
         {/* Additional Info - Legacy Statement */}
          <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 px-4">
            <p className="text-sm md:text-base text-slate-600 font-light tracking-wide max-w-md mx-auto leading-relaxed">
              Experts in Real Estate Mandates, Construction, and More Since 2013
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span className="tracking-wide">10+ Years</span>
              </div>
              <div className="w-px h-3 bg-slate-300" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="tracking-wide">390+ Projects</span>
              </div>
              <div className="w-px h-3 bg-slate-300" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <span className="tracking-wide">Pune & PCMC</span>
              </div>
            </div>

            {/* Core Services - Minimal List */}
            <div className="pt-6 space-y-2 text-xs text-slate-500 font-light tracking-wide">
              <div className="flex items-center justify-center gap-2">
                <span>Real Estate Mandates</span>
                <span className="text-slate-300">•</span>
                <span>Construction & Building</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>Digital Marketing</span>
                <span className="text-slate-300">•</span>
                <span>Finance & Home Loans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transition Icon */}
      {!showNewBrand && (
        <div className="flex justify-center my-8 sm:my-12 transition-all duration-700">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border border-slate-300 rounded-full flex items-center justify-center">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 animate-spin-slow" />
            </div>
            <div className="absolute inset-0 border border-indigo-400 rounded-full animate-ping opacity-20" />
          </div>
        </div>
      )}

      {/* New Brand */}
      <div
        className={`transition-all duration-1000 delay-700 ${
          showNewBrand
            ? "opacity-100 translate-y-0 scale-100 -mt-83 sm:-mt-70 md:-mt-115"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Glow */}
        <div className="relative inline-block">
          <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 blur-2xl sm:blur-3xl" />

          <div className="relative px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 bg-white border border-indigo-200 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse" />
              <span className="text-xs sm:text-s font-medium text-indigo-600 uppercase tracking-wider sm:tracking-widest">
                Reimagined 2025
              </span>
            </div>

            {/* HOUSLY */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none uppercase">
                <span className="bg-[#0076d8] bg-clip-text text-transparent">
                  hously
                </span>
                {/* <span className="bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  ly
                </span> */}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-slate-700 tracking-[0.15em] sm:tracking-[0.2em]">
                FINNTECH REALTY
              </p>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 py-4 sm:py-6 px-4">
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-light leading-relaxed">
            From building infrastructure to building futures. Our 12-year legacy continues
            with an expanded vision—unifying real estate, finance, and technology
            under one innovative brand.
          </p>
        </div>

        {/* Pillars */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-5 px-4">
          {[
            { label: "Real Estate", icon: Building2, color: "indigo" },
            { label: "Finance", icon: TrendingUp, color: "emerald" },
            { label: "Technology", icon: Cpu, color: "blue" },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            const colorMap :any= {
              indigo: { 
                bg: "bg-indigo-100", 
                text: "text-indigo-600",
                highlight: "bg-indigo-500/10",
                border: "border-indigo-300"
              },
              emerald: { 
                bg: "bg-emerald-100", 
                text: "text-emerald-600",
                highlight: "bg-emerald-500/10",
                border: "border-emerald-300"
              },
              blue: { 
                bg: "bg-blue-100", 
                text: "text-blue-600",
                highlight: "bg-blue-500/10",
                border: "border-blue-300"
              },
            };
            const colors = colorMap[pillar.color];
            
            return (
              <div
                key={i}
                className="group relative opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${900 + i * 120}ms` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 ${colors.highlight} rounded-2xl blur-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`relative px-4 sm:px-6 py-3 sm:py-4 bg-white border border-slate-200 rounded-2xl 
                                hover:shadow-lg hover:${colors.border} transition-all duration-300
                                hover:shadow-${pillar.color}-100`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`relative p-1.5 sm:p-2 ${colors.bg} rounded-lg group-hover:rotate-[360deg] 
                                    transition-transform duration-700 ease-in-out overflow-hidden`}>
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                                    bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                    transition-transform duration-700" />
                      
                      <Icon className={`relative w-4 h-4 sm:w-5 sm:h-5 ${colors.text} group-hover:scale-110 
                                      transition-transform duration-300`} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900
                                   transition-colors duration-300">
                      {pillar.label}
                    </span>
                  </div>
                </div>
                
                {/* Animated border highlight */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 pointer-events-none`}>
                  <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border} 
                                  animate-pulse`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tagline */}
        <div className="max-w-3xl mx-auto mt-3 sm:mt-4 space-y-2 pb-3 sm:pb-4 px-4">
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-light">
            Building integrated solutions across real estate, finance, and technology.
          </p>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { text: "One Vision" },
                { text: "Three Verticals" },
                { text: "Limitless Possibilities" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="group relative cursor-default">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                      {item.text}
                    </span>
                    <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500" />
                  </div>
                  {i < 2 && (
                    <div className="relative w-1.5 h-1.5">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-8 sm:mb-10">
          <div className="relative inline-block group">
            {/* Glow effect behind button */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Main Button */}
            <button className="relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 
                             bg-[#0076d8]
                             bg-size-200 bg-pos-0 hover:bg-pos-100
                             text-white rounded-full 
                             hover:shadow-2xl hover:shadow-indigo-500/30
                             transition-all duration-500 ease-out
                             border border-white/20
                             overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                            bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transition-transform duration-700 ease-out" />
              
              <span className="relative text-sm sm:text-base font-semibold tracking-wide">
                <span className="bg-white bg-clip-text text-transparent 
                               drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                  Explore Our Divisions
                </span>
              </span>
              
              <ArrowDown className="relative w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-y-1 transition-transform duration-300" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full border-2 border-white/0 
                            group-hover:border-white/30 transition-all duration-300" />
            </button>
          </div>
          
          {/* Scroll hint with icon */}
          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2 sm:gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            {/* Mouse Icon */}
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Scroll down</span>

            <div className="relative w-5 h-8 sm:w-6 sm:h-10 border-2 border-slate-400 rounded-full flex items-start justify-center pt-1.5 sm:pt-2">
              <div className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-slate-400 rounded-full animate-scroll-down" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

            {/* Sector Cards */}
            <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 mt-0 pt-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center mt-0 mb-2 text-slate-800">
                Explore Our Divisions
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-center text-slate-600 mb-4 sm:mb-6 md:mb-8">
                Click on any division to access specialized services and solutions
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {sectors.map((sector, index) => {
                  const Icon = sector.icon;
                  return (
                    <div
                      key={sector.id}
                      ref={(el) => setCardRef(el, index)}
                      onClick={() => sector.id === "real-estate" || sector.id === "finance" ? setActiveModal(sector.id) : onSectorClick(sector.id)}
                      onMouseEnter={() => setHoveredCard(sector.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="group cursor-pointer"
                      style={{
                        animation: visibleCards[index] ? `cardReveal 0.8s ease-out ${index * 200}ms forwards` : "none",
                        opacity: 0,
                      }}
                    >
                      <div className="relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 overflow-hidden h-full border border-slate-200 hover:border-transparent group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                        {/* Animated Background Layer */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0" style={{ background: sector.gradient, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
                        </div>

                        {/* Image Section */}
                        <div className="relative h-32 sm:h-36 md:h-40 lg:h-48 xl:h-56 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                          <img src={sector.image} alt={sector.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />

                          {/* Floating Icon */}
                          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                              <Icon className={`w-5.5 h-5.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${sector.color.replace("from-", "text-").replace(" to-", "-500")}`} />
                            </div>
                          </div>

                          {/* Animated Overlay */}
                          <div className={`absolute inset-0 ${sector.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                        </div>

                        {/* Content Section */}
                        <div className="relative p-3 sm:p-4 md:p-6 lg:p-8">
                          {/* Floating Badge */}
                          <div className={`absolute -top-3 sm:-top-4 md:-top-6 left-3 sm:left-4 md:left-8 p-2 sm:p-2 md:p-3 lg:p-4 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br ${sector.color} shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                            <Icon className="w-5 h-5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-white" />
                          </div>

                          <div className="pt-3 sm:pt-4 md:pt-6 lg:pt-8">
                            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4 text-slate-800 group-hover:text-white transition-colors duration-300">
                              {sector.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-200 transition-colors duration-300 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-relaxed">
                              {sector.description}
                            </p>

                            {/* Features List */}
                            <div className="mb-3 sm:mb-4 md:mb-6 transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                {sector.features.map((feature, i) => (
                                  <div key={i} className="flex items-center gap-0.5 sm:gap-1">
                                    <div className={`w-1 h-1 rounded-full ${sector.color.replace("from-", "bg-").replace(" to-", "-500")}`}></div>
                                    <span className="text-[10px] xs:text-xs text-slate-600 group-hover:text-slate-300 transition-colors duration-300">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* CTA Button */}
                            <div className="flex items-center text-blue-600 font-semibold group-hover:text-white transition-all duration-300">
                              <span className="text-xs sm:text-sm md:text-base">Explore Division</span>
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1 sm:ml-2 transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                            </div>
                          </div>
                        </div>

                        {/* Animated Border Bottom */}
                        <div className={`h-0.5 sm:h-1 md:h-1.5 bg-gradient-to-r ${sector.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl ring-1 ring-transparent group-hover:ring-white/30 transition-all duration-500 pointer-events-none"></div>

                        {/* Particle Effects on Hover */}
                        {hoveredCard === sector.id && (
                          <>
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white/30 rounded-full animate-ping" style={{ animationDelay: "0s" }}></div>
                            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-white/30 rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
                            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats Section */}
            <div ref={statsRef} className="mt-12 sm:mt-20 md:mt-20 mb-12 sm:mb-16 md:mb-20">
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-800">
                  Our Impact in Numbers
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600">
                  Excellence measured through achievements
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-6xl mx-auto px-2 sm:px-3 md:px-4">
                {stats.map((stat, index) => (
                  <StatItem key={index} stat={stat} index={index} visibleStats={visibleStats} />
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12 sm:mt-20 md:mt-20 mb-12 sm:mb-16 md:mb-20">
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-800">
                  Why Choose Us
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600">
                  What sets us apart from the rest
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto px-2 sm:px-3 md:px-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="group bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200 shadow-lg transition-all duration-500 animate-fade-in hover:bg-white hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 active:scale-95"
                      style={{ animationDelay: `${index * 150 + 3500}ms` }}>
                      <div className="flex justify-center sm:justify-start mb-3 sm:mb-4">
                        <div className="inline-flex p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg md:rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 animate-pulse sm:animate-none">
                          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 mb-1 sm:mb-2 text-center sm:text-left">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center sm:text-left">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Section */}
          {/* Timeline Section */}
<div className="mt-12 sm:mt-16 mb-8">
  {/* Heading */}
  <div className="text-center mb-6">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-slate-800">
      Our Transformation Journey
    </h2>
    <p className="text-xs sm:text-sm text-slate-600">From vision to Realty</p>
  </div>

  <div className="max-w-5xl mx-auto px-2 sm:px-4">
    {/* MOBILE VIEW */}
    <div className="sm:hidden">
      <div className="relative py-4">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500"></div>
        {timeline.map((item, index) => (
          <div key={index} className="relative mb-8 last:mb-0 pl-10">
            {/* Dot */}
            <div className="absolute left-2.5 top-1 transform -translate-x-1/2 z-10">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            </div>
            {/* Card */}
            <div className="bg-white/90 rounded-xl p-3 border border-slate-200 shadow">
              <div className="inline-block px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold mb-1.5">
                {item.year}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{item.desc}</p>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg mb-2 w-fit">
                <Award className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700">{item.milestone}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-100">
                {item.services.map((service, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0"></div>
                    <span className="text-[10px] text-slate-600">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* DESKTOP VIEW - Compact Alternating */}
  {/* DESKTOP VIEW */}
<div className="hidden sm:block relative overflow-hidden w-full">
  {/* Timeline Moving Dot */}
  <TimelineDot cardRefs={timelineRefs} />

  {timeline.map((item, index) => {
    const isRight = index % 2 === 0;
    return (
      <div
        key={index}
        ref={(el:any) => (timelineRefs.current[index] = el)}
        className="relative flex items-start mb-0 last:mb-0"
      >
        {/* LEFT CARD */}
        <div className={`w-1/2 pr-10 ${isRight ? "block" : "invisible"}`}>
          {isRight && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold mb-2">
                {item.year}
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.desc}</p>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg mb-3 w-fit">
                <Award className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700">{item.milestone}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Key Services:</p>
                <div className="grid grid-cols-2 gap-1">
                  {item.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <span className="text-xs text-slate-600">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className={`w-1/2 pl-10 ${!isRight ? "block" : "invisible"}`}>
          {!isRight && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold mb-2">
                {item.year}
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.desc}</p>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg mb-3 w-fit">
                <Award className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-700">{item.milestone}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Key Services:</p>
                <div className="grid grid-cols-2 gap-1">
                  {item.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <span className="text-xs text-slate-600">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>
  </div>
</div>

            {/* CTA Section */}
            <div className="mt-12 sm:mt-20 md:mt-32 mb-0 w-full">
              <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
                  <div className="absolute bottom-0 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
                </div>

                <div className="relative z-10 container mx-auto max-w-6xl">
                  <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 md:mb-3">
                      Our Journey Forward
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-blue-100">
                      A transformation story of vision and innovation
                    </p>
                  </div>

                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 items-center mb-4 sm:mb-6 md:mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-500">
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
                        <div className="p-1.5 sm:p-2 md:p-3 bg-slate-700/50 rounded-md sm:rounded-lg md:rounded-xl">
                          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-slate-300" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-300">AAKAR INFRA SERVICES</h3>
                          <p className="text-blue-200 text-[10px] xs:text-xs">Where it began</p>
                        </div>
                      </div>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                        Built on excellence and trust, establishing a legacy of quality infrastructure.
                      </p>
                    </div>

                    <div className="flex justify-center my-1 sm:my-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 sm:p-2 md:p-3 lg:p-4 rounded-full">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-400/30 shadow-lg sm:shadow-xl md:shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
                        <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg md:rounded-xl shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white animate-spin-slow" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white">HOUSLY FINNTECH REALTY</h3>
                          <p className="text-cyan-200 text-[10px] xs:text-xs">The future is now</p>
                        </div>
                      </div>
                      <p className="text-white text-xs sm:text-sm leading-relaxed">
                        Expanding horizons across real estate, finance, and technology.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/20 text-center">
                    <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 italic leading-relaxed">
                      "Building on our strong foundation, we're creating a future where real estate, finance, and technology converge to deliver unparalleled value."
                    </blockquote>
                    <p className="text-blue-200 text-xs sm:text-sm">Transforming industries and shaping the future together.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-3 sm:px-4 md:px- py-3 sm:py-4 md:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <p className="text-slate-400 text-center sm:text-left">
                  © {new Date().getFullYear()} Hously Finntech Realty. All rights reserved.
                </p>
                <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  <Link to="/privacy-policy" state={{ fromWelcome: true }} className="text-slate-400 hover:text-white transition-colors duration-300">Privacy Policy</Link>
                  <Link to="/terms-of-service" state={{ fromWelcome: true }} className="text-slate-400 hover:text-white transition-colors duration-300">Terms of Service</Link>
                  <Link to="/cookie-policy" state={{ fromWelcome: true }} className="text-slate-400 hover:text-white transition-colors duration-300">Cookie Policy</Link>
                </div>
              </div>
            </div>
          </footer>

          {/* Scroll to Top Button */}
          <button onClick={scrollToTop} className={`fixed right-2 bottom-2 sm:right-4 sm:bottom-4 md:right-8 md:bottom-8 z-50 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full shadow-xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ${showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}>
            <ChevronUp className="w-6 h-6 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Add custom animations */}
        <style>{`
        @keyframes scroll-down {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(8px);
  }
}

@layer utilities {
  .animate-scroll-down {
    animation: scroll-down 1.5s ease-in-out infinite;
  }
  .bg-size-200 {
    background-size: 200%;
  }
  .bg-pos-0 {
    background-position: 0% 50%;
  }
  .bg-pos-100 {
    background-position: 100% 50%;
  }
}
        
         @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float linear infinite; }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      
          @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes spin-once { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .animate-spin-once { animation: spin-once 1s ease-in-out; }
          @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
          @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          .animate-gradient { background-size: 200% 200%; animation: gradient 6s ease infinite; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
          @keyframes slide-down { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-slide-down { animation: slide-down 0.6s ease-out; }
          @keyframes scale-in { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
          @keyframes ping-slow { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
          @keyframes fadeOut { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); visibility: hidden; } }
          @keyframes cardReveal { 0% { opacity: 0; transform: translateY(40px) scale(0.92); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        `}</style>
      </div>

      {/* Modals */}
      {activeModal === "real-estate" && (
        <ComingSoonModal
          title="Real Estate Division"
          description="Premium residential and commercial property solutions."
          services={["Residential Projects", "Commercial Spaces", "Property Management", "Real Estate Consulting"]}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "finance" && (
        <ComingSoonModal
          title="Finance Division"
          description="Smart financial solutions and investment services."
          services={["Investment Advisory", "Wealth Management", "Financial Planning", "Portfolio Management"]}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}

const ComingSoonModal = ({
  title,
  description,
  services,
  onClose,
}: {
  title: string;
  description: string;
  services: string[];
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-lg w-full mx-2 sm:mx-3 md:mx-4 animate-scale-in">
        <div className="p-4 sm:p-5 md:p-6 text-center">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">{title}</h2>
            <button onClick={onClose} className="p-1 sm:p-2 hover:bg-slate-100 rounded-full transition" aria-label="Close modal">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">{description}</p>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6">
            <p className="font-semibold text-sm sm:text-base">Website Under Development</p>
            <p className="text-xs sm:text-sm opacity-90 mt-1">Launching Soon 🚀</p>
          </div>
          <div className="text-left mb-4 sm:mb-5 md:mb-6">
            <h4 className="font-semibold mb-1.5 sm:mb-2 text-slate-700 text-sm sm:text-base">Our Services</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              {services.map((s, i) => (
                <li key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-green-500 flex-shrink-0">✔</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={onClose} className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
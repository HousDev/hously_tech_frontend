

// import React, { useEffect, useRef, useState } from "react";
// import {
//   ThumbsUp,
//   ShieldCheck,
//   Code,
//   Cloud,
//   Rocket,
//   Settings,
//   Palette,
// } from "lucide-react";


// const About: React.FC = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     if (!scrollContainer) return;

//     let animationFrameId: number;
//     let scrollPosition = 0;

//     const animate = () => {
//       if (scrollContainer) {
//         scrollPosition += 0.5;

//         if (scrollPosition >= scrollContainer.scrollWidth / 2) {
//           scrollPosition = 0;
//         }

//         scrollContainer.scrollLeft = scrollPosition;
//       }
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   const services = [
//     { icon: Code, name: "Web Development", color: "from-blue-500 to-blue-700" },
//     {
//       icon: Cloud,
//       name: "Cloud Solutions",
//       color: "from-cyan-500 to-cyan-700",
//     },
//     {
//       icon: Rocket,
//       name: "Digital Transformation",
//       color: "from-purple-500 to-purple-700",
//     },
//     {
//       icon: Settings,
//       name: "Software Development",
//       color: "from-indigo-500 to-indigo-700",
//     },
//     { icon: Palette, name: "UI/UX Design", color: "from-pink-500 to-pink-700" },
//   ];
//   const [stats, setStats] = useState({
//   projects: 0,
//   success: 0,
//   support: 0,
// });

// useEffect(() => {
//   const duration = 1500; // animation time
//   const steps = 60;
//   const interval = duration / steps;

//   let p = 0;
//   let s = 0;
//   let sp = 0;

//   const timer = setInterval(() => {
//     p += 100 / steps;
//     s += 95 / steps;
//     sp += 24 / steps;

//     setStats({
//       projects: Math.min(Math.round(p), 100),
//       success: Math.min(Math.round(s), 95),
//       support: Math.min(Math.round(sp), 24),
//     });

//     if (p >= 100 && s >= 95 && sp >= 24) {
//       clearInterval(timer);
//     }
//   }, interval);

//   return () => clearInterval(timer);
// }, []);


//   return (
//     <>
// <section className="relative  flex items-center overflow-hidden bg-white pt-2 sm:pt-2 lg:pt-10 pb-2 sm:pb-2 lg:pb-6">
//         {/* Background Text Watermark */}
//         <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03] pointer-events-none">
//           <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black text-blue-900 select-none whitespace-nowrap">
//             HOUSLY
//           </h1>
//         </div>

//        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 relative z-10 w-full">
//   {/* Section Header */}
//   <div className="mb-2 sm:mb-6 lg:mb-8">

//     {/* Centered WHO WE ARE with lines */}
//     <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
//       <div className="w-8 sm:w-10 lg:w-16 h-0.5 bg-[#0076d8]"></div>

//       <h3 className="text-[#0076d8] font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
//         WHO WE ARE?
//       </h3>

//       <div className="w-8 sm:w-10 lg:w-16 h-0.5 bg-[#0076d8]"></div>
//     </div>

//     {/* Main Heading */}
//     <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight text-center max-w-4xl mx-auto">
//       Transforming Businesses with Innovative IT Solutions
//     </h2>
//   </div>

//   {/* Content Grid */}
//   <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">

//     {/* Left Side - Images */}
//     <div className="grid grid-cols-2 gap-4 sm:gap-4">
//       <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
//         <img
//           src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
//           alt="IT Services"
//           className="w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover"
//         />
//       </div>

//       <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 mt-6 sm:mt-8 lg:mt-12">
//         <img
//     src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80"

//           alt="Cloud Computing"
//           className="w-full h-[220px] sm:h-[320px] lg:h-[380px] object-cover"
//         />
//       </div>
//     </div>

//     {/* Right Side - Features */}
//    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
//   {/* Feature 1 */}
//   <div className="bg-gradient-to-br from-[#0076d8]/5 to-[#ffd801]/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-xl transition duration-300 border border-gray-100">
//     <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
//       <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#0076d8] to-[#0066c0] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
//         <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
//       </div>
//       <div className="flex-1">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
//           100% Customers Satisfaction
//         </h3>
//         <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
//           Our expert team delivers reliable IT solutions with a strong focus on quality,
//           performance, and complete customer satisfaction.
//         </p>
//       </div>
//     </div>
//   </div>

//   {/* Feature 2 */}
//   <div className="bg-gradient-to-br from-[#ffd801]/5 to-[#0076d8]/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-xl transition duration-300 border border-gray-100">
//     <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
//       <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#0076d8] to-[#0066c0] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
//         <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
//       </div>
//       <div className="flex-1">
//         <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
//           Quality Assurance Guarantee
//         </h3>
//         <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
//           Our expert team ensures rigorous quality checks to deliver reliable,
//           high-performance solutions you can trust.
//         </p>
//       </div>
//     </div>
//   </div>

//   {/* Stats */}
//   <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
//     <div className="text-center">
//       <div className="text-2xl lg:text-3xl font-bold text-black">
//         {stats.projects}+
//       </div>
//       <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Projects Done</div>
//     </div>
//     <div className="text-center">
//       <div className="text-2xl lg:text-3xl font-bold text-black">
//         {stats.success}%
//       </div>
//       <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Success Rate</div>
//     </div>
//     <div className="text-center">
//       <div className="text-2xl lg:text-3xl font-bold text-black">
//         {stats.support}/7
//       </div>
//       <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Support</div>
//     </div>
//   </div>
// </div>
//   </div>
// </div>


//         {/* Decorative Elements */}
//         <div className="absolute top-20 right-10 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[#0076d8]/5 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[#ffd801]/5 rounded-full blur-3xl"></div>
//       </section>

//       {/* Auto-Scrolling Services Marquee Section */}
//       <section
//         className="relative py-4 sm:py-6 overflow-hidden"
//         style={{ backgroundColor: "#F4F1FC" }}
//       >
//         <div
//           ref={scrollRef}
//           className="flex items-center overflow-x-hidden whitespace-nowrap"
//           style={{
//             scrollBehavior: "auto",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {/* Duplicate content twice for seamless infinite loop */}
//           {[...Array(2)].map((_, duplicateIndex) => (
//             <div
//               key={duplicateIndex}
//               className="flex items-center flex-shrink-0"
//             >
//               {services.map((service, index) => {
//                 return (
//                   <React.Fragment key={`${duplicateIndex}-${index}`}>
//                     <div className="inline-flex items-center mx-2 sm:mx-3">
//                       <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-3 sm:mr-4 lg:mr-5 flex items-center justify-center">
//                         {/* <FaStar className="w-full h-full text-[#5ca0d7]" /> */}
//                       </div>

//                       <div className="flex items-center pb-2">
//                         <span
//                           className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 tracking-tight"
//                           style={{
//                             fontFamily: '"Space Grotesk", sans-serif',
//                             lineHeight: "0.75em",
//                           }}
//                         >
//                           {service.name}
//                         </span>
//                       </div>
//                     </div>
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// };

// export default About;




import React, { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  ShieldCheck,
  Code,
  Cloud,
  Rocket,
  Settings,
  Palette,

  Sparkles,
  Zap,
  Award,
  CheckCircle,
} from "lucide-react";

const About: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;

    const animate = () => {
      if (scrollContainer) {
        scrollPosition += 0.5;

        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const services = [
    { icon: Code, name: "Web Development", gradient: "from-blue-500 to-blue-600" },
    { icon: Cloud, name: "Cloud Solutions", gradient: "from-cyan-500 to-cyan-600" },
    { icon: Rocket, name: "Digital Transformation", gradient: "from-purple-500 to-purple-600" },
    { icon: Settings, name: "Software Development", gradient: "from-indigo-500 to-indigo-600" },
    { icon: Palette, name: "UI/UX Design", gradient: "from-pink-500 to-pink-600" },
  ];

  const [stats, setStats] = useState({
    projects: 0,
    success: 0,
    support: 0,
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let p = 0;
    let s = 0;
    let sp = 0;

    const timer = setInterval(() => {
      p += 100 / steps;
      s += 95 / steps;
      sp += 24 / steps;

      setStats({
        projects: Math.min(Math.round(p), 100),
        success: Math.min(Math.round(s), 95),
        support: Math.min(Math.round(sp), 24),
      });

      if (p >= 100 && s >= 95 && sp >= 24) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Main Section - Modern Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 sm:py-12">
        {/* Premium Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,118,216,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,118,216,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="mb-6 sm:mb-10">
            <div className="flex flex-col items-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-full border border-blue-200/30 mb-3">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase"> WHO WE ARE </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight mb-2">
                <span className="text-[#0077d9]">
                  Transforming Businesses with
                </span>
                <br />
                <span className="bg-gradient-to-r from-black via-black to-black bg-clip-text text-transparent">
                  Innovative IT Solutions
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 text-center max-w-2xl">
                Empowering enterprises with cutting-edge technology and premium digital solutions
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Left Side - Premium Image Gallery */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div className="group relative rounded-xl overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10"></div>
                <img
                  src="/Innovatio.png"
                  alt="IT Services"
                  className="w-full h-[240px] sm:h-[300px] lg:h-[380px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-semibold tracking-wider border border-white/30">
                    Innovation
                  </span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="group relative rounded-xl overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-500 hover:scale-[1.02] mt-4 sm:mt-8 lg:mt-12">
                  <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10"></div>
                  <img
                    src="/technology.png"
                    alt="Cloud Computing"
                    className="w-full h-[160px] sm:h-[200px] lg:h-[240px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-semibold tracking-wider border border-white/30">
                      Technology
                    </span>
                  </div>
                </div>

                {/* Stats Mini */}
                <div className="grid grid-cols-3 gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80 shadow-md">
                  {[
                    { value: stats.projects + "+", label: "Projects" },
                    { value: stats.success + "%", label: "Success" },
                    { value: stats.support + "/7", label: "Support" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-[#0077d9] bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Premium Features */}
            <div className="space-y-3 sm:space-y-4">
              {/* Feature 1 */}
              <div className="group relative bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-[#bedbff] to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-[#0077d9] rounded-lg shadow-md shadow-blue-500/30 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-0.5">
                      100% Customer Satisfaction
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Delivering reliable IT solutions with focus on quality and performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-[#bedbff] to-white  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-[#0077d9] to-[#0077d9] rounded-lg shadow-md shadow-purple-500/30 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-0.5">
                      Quality Assurance Guarantee
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Rigorous quality checks for reliable, high-performance solutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Premium Highlight */}
              <div className="group relative bg-gradient-to-r from-[#bedbff] to-white  backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-blue-200/30 shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-0.5">
                <div className="relative flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-[#0077d9] rounded-lg shadow-md shadow-blue-500/30 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-0.5">
                      Trusted by 500+ Clients
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Join thousands of satisfied businesses worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/80 shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0077d9]" />
                  <span className="text-[10px] font-medium text-slate-700">24/7 Support</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/80 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-[#0077d9]" />
                  <span className="text-[10px] font-medium text-slate-700">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Auto-Scrolling Services Marquee */}
      <section className="relative py-4 sm:py-5 overflow-hidden bg-gradient-to-r from-slate-50 via-white to-blue-50/50 border-y border-blue-100/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>

        <div
          ref={scrollRef}
          className="flex items-center overflow-x-hidden whitespace-nowrap"
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[...Array(2)].map((_, duplicateIndex) => (
            <div key={duplicateIndex} className="flex items-center flex-shrink-0">
              {services.map((service, index) => (
                <React.Fragment key={`${duplicateIndex}-${index}`}>
                  <div className="inline-flex items-center mx-2 sm:mx-4 group cursor-pointer">
                    <div className={`p-1.5 sm:p-2 bg-gradient-to-br ${service.gradient} rounded-lg shadow-md shadow-blue-500/20 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                      {service.name}
                    </span>
                    <span className="ml-3 text-blue-300 text-lg font-thin">✦</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
      </section>
    </>
  );
};

export default About;
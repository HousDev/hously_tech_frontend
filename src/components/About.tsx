import React, { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  ShieldCheck,
  Code,
  Cloud,
  Rocket,
  Settings,
  Palette,
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
    { icon: Code, name: "Web Development", color: "from-blue-500 to-blue-700" },
    {
      icon: Cloud,
      name: "Cloud Solutions",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      icon: Rocket,
      name: "Digital Transformation",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: Settings,
      name: "Software Development",
      color: "from-indigo-500 to-indigo-700",
    },
    { icon: Palette, name: "UI/UX Design", color: "from-pink-500 to-pink-700" },
  ];
  const [stats, setStats] = useState({
  projects: 0,
  success: 0,
  support: 0,
});

useEffect(() => {
  const duration = 1500; // animation time
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
<section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
        {/* Background Text Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03] pointer-events-none">
          <h1 className="text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black text-blue-900 select-none whitespace-nowrap">
            HOUSLY
          </h1>
        </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 relative z-10 w-full">
  {/* Section Header */}
  <div className="mb-2 sm:mb-6 lg:mb-8">
    
    {/* Centered WHO WE ARE with lines */}
    <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
      <div className="w-10 sm:w-14 lg:w-20 h-0.5 bg-[#0076d8]"></div>

      <h3 className="text-[#0076d8] font-semibold text-xs sm:text-sm uppercase tracking-wider">
        WHO WE ARE?
      </h3>

      <div className="w-10 sm:w-14 lg:w-20 h-0.5 bg-[#0076d8]"></div>
    </div>

    {/* Main Heading */}
    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight text-center max-w-4xl mx-auto">
      Transforming Businesses with Innovative IT Solutions
    </h2>
  </div>

  {/* Content Grid */}
  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
    
    {/* Left Side - Images */}
    <div className="grid grid-cols-2 gap-4 sm:gap-4">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
          alt="IT Services"
          className="w-full h-[280px] sm:h-[350px] lg:h-[500px] object-cover"
        />
      </div>

      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500 mt-6 sm:mt-8 lg:mt-12">
        <img
    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80"

          alt="Cloud Computing"
          className="w-full h-[250px] sm:h-[370px] lg:h-[450px] object-cover"
        />
      </div>
    </div>

    {/* Right Side - Features */}
   <div className="space-y-5 sm:space-y-6 lg:space-y-8">
  {/* Feature 1 */}
  <div className="bg-gradient-to-br from-[#0076d8]/5 to-[#ffd801]/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition duration-300 border border-gray-100">
    <div className="flex items-start gap-4 sm:gap-5 lg:gap-6">
      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#0076d8] to-[#0066c0] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
        <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          100% Customers Satisfaction
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Our expert team delivers reliable IT solutions with a strong focus on quality,
          performance, and complete customer satisfaction.
        </p>
      </div>
    </div>
  </div>

  {/* Feature 2 */}
  <div className="bg-gradient-to-br from-[#ffd801]/5 to-[#0076d8]/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition duration-300 border border-gray-100">
    <div className="flex items-start gap-4 sm:gap-5 lg:gap-6">
      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#0076d8] to-[#0066c0] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
        <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          Quality Assurance Guarantee
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Our expert team ensures rigorous quality checks to deliver reliable,
          high-performance solutions you can trust.
        </p>
      </div>
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-black">
        {stats.projects}+
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">Projects Done</div>
    </div>
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-black">
        {stats.success}%
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">Success Rate</div>
    </div>
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-bold text-black">
        {stats.support}/7
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-1">Support</div>
    </div>
  </div>
</div>
  </div>
</div>


        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[#0076d8]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[#ffd801]/5 rounded-full blur-3xl"></div>
      </section>

      {/* Auto-Scrolling Services Marquee Section */}
      <section
        className="relative py-6 sm:py-8 overflow-hidden"
        style={{ backgroundColor: "#F4F1FC" }}
      >
        <div
          ref={scrollRef}
          className="flex items-center overflow-x-hidden whitespace-nowrap"
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Duplicate content twice for seamless infinite loop */}
          {[...Array(2)].map((_, duplicateIndex) => (
            <div
              key={duplicateIndex}
              className="flex items-center flex-shrink-0"
            >
              {services.map((service, index) => {
                return (
                  <React.Fragment key={`${duplicateIndex}-${index}`}>
                    <div className="inline-flex items-center mx-3 sm:mx-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mr-4 sm:mr-5 lg:mr-6 flex items-center justify-center">
                        {/* <FaStar className="w-full h-full text-[#5ca0d7]" /> */}
                      </div>

                      <div className="flex items-center pb-2">
                        <span
                          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight"
                          style={{
                            fontFamily: '"Space Grotesk", sans-serif',
                            lineHeight: "0.75em",
                          }}
                        >
                          {service.name}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
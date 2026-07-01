import Breadcrumb from "../../components/Breadcrumb";
import TeamSection from "../../components/team_sec";
import TechFeaturesSection from "../../components/tech_soln";
import { FaArrowRight, FaPlay } from "react-icons/fa";

export default function Component() {
  return (
    <div className="w-full bg-[#fcfdfe]">
      {/* Add Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * {
          font-family: 'Inter', sans-serif !important;
        }
        
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(15px) rotate(-2deg);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-float-rev {
          animation: floatReverse 7s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 25s linear infinite;
        }

        /* Timeline connector line */
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 30px;
          bottom: -30px;
          width: 2px;
          background: linear-gradient(to bottom, #0077d9 30%, rgba(0, 119, 217, 0.1) 100%);
        }
        .timeline-line:last-child::before {
          display: none;
        }
      `}</style>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Desktop Version */}
      <div className="hidden lg:block">
        {/* About Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Background Decorators */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-[10%] w-[350px] h-[350px] bg-gradient-to-tr from-blue-300/10 to-purple-300/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-10 right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-200/15 to-blue-200/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,119,217,0.015)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(0,119,217,0.015)_1.5px,transparent_1.5px)] bg-[size:30px_30px]" />
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Image Block (Larger Images, balanced grid) */}
              <div className="col-span-6 relative">
                <div className="relative inline-block pr-[120px] pb-[140px] ml-4">
                  {/* Main Image - Float Animation */}
                  <div className="rounded-[30px] overflow-hidden shadow-2xl border border-slate-100/50 bg-white p-2.5 animate-float">
                    <img
                      alt="About Main"
                      src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-1.jpg"
                      className="w-[340px] h-[430px] rounded-[24px] object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Secondary Image - Float Reverse Animation */}
                  <div className="absolute bottom-4 right-[10px] border-[8px] border-white rounded-[28px] overflow-hidden shadow-2xl animate-float-rev bg-white p-1">
                    <img
                      alt="About Small"
                      src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-2.jpg"
                      className="w-[210px] h-[210px] rounded-[22px] object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Circle Badge Tag */}
                  <div className="absolute top-[120px] right-[-30px] inline-flex items-center justify-center w-[180px] h-[180px] border-[22px] border-white/50 rounded-full bg-slate-900/10 backdrop-blur-[6px] shadow-lg">
                    <span className="absolute top-1/2 left-1/2 -ml-[80px] -mt-[80px] animate-spin-slow inline-block w-[160px] h-[160px] font-bold text-slate-800 text-[10px] tracking-wider uppercase">
                      {Array.from("IT SOLUTIONS • TECHNOLOGY & INNOVATION • ").map(
                        (char, index) => (
                          <span
                            key={index}
                            className="absolute h-[170px] w-[14px] left-[46%] top-[-8px] origin-center-bottom"
                            style={{ transform: `rotate(${9.2 * (index + 1)}deg)` }}
                          >
                            {char}
                          </span>
                        )
                      )}
                    </span>

                    {/* Play Button */}
                    <a className="z-10 inline-flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#0077d9] text-white shadow-lg cursor-pointer hover:scale-115 hover:bg-[#005db0] transition-all duration-300">
                      <FaPlay className="text-[11px] ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Text Block (Larger Text) */}
              <div className="col-span-6 pl-4">
                <div className="space-y-5">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20 animate-[slideInRight_900ms_ease_100ms_both]">
                    <span className="w-2 h-2 rounded-full bg-[#0077d9] animate-ping" />
                    <span className="text-[11px] font-bold text-[#0077d9] tracking-wider uppercase">About Us</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-[38px] leading-tight font-extrabold text-slate-950 tracking-tight animate-[slideInRight_900ms_ease_200ms_both]">
                    Comprehensive IT Services for Modern <span className="text-[#0077d9]">Business Transformation</span>
                  </h2>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xl animate-[slideInRight_900ms_ease_300ms_both]">
                    We provide end-to-end IT solutions including cloud infrastructure, cybersecurity, custom software development, and digital transformation to help businesses grow and innovate.
                  </p>
                </div>

                {/* Features (2x2 Grid, 4 Features) */}
                <div className="grid grid-cols-2 gap-6 pt-6 pb-6 border-b border-slate-100 animate-[fadeInUp_900ms_ease_400ms_both]">
                  {/* Feature 1 */}
                  <div className="group flex gap-3.5 items-start p-3 rounded-2xl hover:bg-slate-50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 border border-transparent hover:border-slate-100/55">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0077d9]/10 rounded-xl flex-shrink-0 text-[#0077d9] group-hover:bg-[#0077d9] group-hover:text-white transition-all duration-300">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5 group-hover:text-[#0077d9] transition-colors duration-300">
                        100% Satisfaction
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Experienced specialists committed to delivery excellence.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="group flex gap-3.5 items-start p-3 rounded-2xl hover:bg-slate-50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 border border-transparent hover:border-slate-100/55">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500/10 rounded-xl flex-shrink-0 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5 group-hover:text-amber-500 transition-colors duration-300">
                        QA Guarantee
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Rigorous standards ensuring high-performance software.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 (New) */}
                  <div className="group flex gap-3.5 items-start p-3 rounded-2xl hover:bg-slate-50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 border border-transparent hover:border-slate-100/55">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 rounded-xl flex-shrink-0 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5 group-hover:text-purple-600 transition-colors duration-300">
                        Cybersecurity
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Advanced threat protection and active zero-trust security layers.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4 (New) */}
                  <div className="group flex gap-3.5 items-start p-3 rounded-2xl hover:bg-slate-50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 border border-transparent hover:border-slate-100/55">
                    <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 rounded-xl flex-shrink-0 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5 group-hover:text-emerald-600 transition-colors duration-300">
                        Cloud & DevOps
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Optimized multi-cloud deployment with CI/CD automation pipelines.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Learn More Button */}
                <div className="mt-6 flex items-center animate-[fadeInUp_900ms_ease_500ms_both]">
                  <a className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077d9] hover:gap-2.5 transition-all duration-300 cursor-pointer group">
                    Learn More About Us
                    <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Process Section with Reduced Top Gap (pt-10 instead of pt-20) */}
        <section className="relative overflow-hidden bg-slate-50 pt-10 pb-16 border-t border-b border-slate-100">
          {/* Background image & pattern overlays */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'url("https://html.themehour.net/assets/img/bg/about-bg-1-1.png")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fcfdfe] via-transparent to-[#fcfdfe] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Left Column: Premium Process Steps */}
              <div className="col-span-7 pr-6">
                <div className="space-y-3 mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0077d9] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#0077d9] tracking-wider uppercase">Our Journey</span>
                  </div>
                  <h2 className="text-[32px] leading-tight font-extrabold text-slate-900 tracking-tight">
                    How Does <span className="text-[#0077d9]">It Work?</span>
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
                    We follow a structured roadmap to analyze goals, design systems, deploy with high precision, and guarantee seamless operations.
                  </p>
                </div>

                {/* Steps Timeline with lines */}
                <div className="relative pl-2">
                  {/* Step 1 */}
                  <div className="timeline-line relative flex gap-5 pb-8">
                    <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-[#0077d9] rounded-xl text-xs font-bold text-[#0077d9] shadow-sm">
                      1
                    </span>
                    <div className="pt-0.5">
                      <h3 className="text-slate-900 text-sm font-bold mb-1">
                        Discovery & Planning
                      </h3>
                      <p className="text-slate-400 text-[11px] leading-relaxed max-w-md">
                        We run custom research workshops to map out infrastructure requirements and build a unified product plan.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="timeline-line relative flex gap-5 pb-8">
                    <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-[#0077d9] rounded-xl text-xs font-bold text-[#0077d9] shadow-sm">
                      2
                    </span>
                    <div className="pt-0.5">
                      <h3 className="text-slate-900 text-sm font-bold mb-1">
                        Design & Development
                      </h3>
                      <p className="text-slate-400 text-[11px] leading-relaxed max-w-md">
                        Our engineering team creates fast, responsive interfaces and implements secure cloud-ready backend layers.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="timeline-line relative flex gap-5">
                    <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-[#0077d9] rounded-xl text-xs font-bold text-[#0077d9] shadow-sm">
                      3
                    </span>
                    <div className="pt-0.5">
                      <h3 className="text-slate-900 text-sm font-bold mb-1">
                        Testing & Support
                      </h3>
                      <p className="text-slate-400 text-[11px] leading-relaxed max-w-md">
                        We deploy rigid automated pipeline checks and assure round-the-clock platform monitoring support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Process Image with floating effects */}
              <div className="col-span-5 relative">
                <div className="relative rounded-[28px] overflow-hidden shadow-2xl p-2 bg-white border border-slate-100/50 animate-float-rev">
                  <img
                    alt="IT Work Process"
                    src="/talk.png"
                    className="w-full h-[380px] rounded-[22px] object-cover"
                  />
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/75 backdrop-blur-[8px] border border-white/10 text-white">
                    <p className="text-[10px] uppercase tracking-widest text-[#0077d9] font-bold mb-0.5">Agile Sprint Delivery</p>
                    <p className="text-[11px] text-slate-300 leading-snug">Ensuring high quality milestones on a bi-weekly cycle.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Version (visible only on mobile) */}
      <div className="block lg:hidden bg-white">
        {/* Mobile About Section */}
        <section className="py-12 px-4 relative overflow-hidden">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20 mb-3 text-[10px] font-bold text-[#0077d9] tracking-wider uppercase">
              About Us
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-3 leading-snug">
              Comprehensive IT Services for Modern <span className="text-[#0077d9]">Business Transformation</span>
            </h2>

            <p className="text-slate-500 leading-relaxed mb-6 text-xs">
              We provide end-to-end IT solutions including cloud infrastructure, cybersecurity,
              custom software development, and digital transformation to help businesses grow.
            </p>

            {/* Mobile Features */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-[#0077d9]/10 rounded-lg text-[#0077d9] flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    100% Customer Satisfaction
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    We bring experienced specialists, cloud architects, and tech experts.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-500/10 rounded-lg text-amber-500 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Quality Assurance Guarantee
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Our rigorous testing standards ensure secure, high-performance systems.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <a
                href="#"
                className="inline-flex items-center justify-center py-2.5 px-6 rounded-full bg-[#0077d9] text-white text-xs font-semibold w-full gap-2 hover:bg-[#005db0] transition-colors"
              >
                More About Us
                <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          </div>

          {/* Mobile Images */}
          <div className="relative mt-8">
            <div className="rounded-2xl overflow-hidden mb-4 shadow-md bg-white p-1">
              <img
                alt="About"
                src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-1.jpg"
                className="w-full h-56 object-cover rounded-xl"
              />
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-md mb-4 bg-white">
                <img
                  alt="img"
                  src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-2.jpg"
                  className="w-full h-44 object-cover rounded-xl"
                />
              </div>

              <div className="absolute bottom-4 right-4">
                <a className="z-10 inline-flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white text-[#0077d9] shadow cursor-pointer">
                  <FaPlay className="text-[9px] ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Work Process */}
        <section className="relative overflow-hidden bg-slate-50 py-10 px-4 border-t border-b border-slate-100">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'url("https://html.themehour.net/assets/img/bg/about-bg-1-1.png")',
            }}
          />

          <div className="relative z-10">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20 text-[10px] font-bold text-[#0077d9] tracking-wider uppercase mb-2">
                Work Process
              </span>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                How Does It Work?
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                We follow a structured approach to understand requirements, design systems, develop, and deliver.
              </p>
            </div>

            {/* Mobile Image */}
            <div className="rounded-2xl overflow-hidden mb-6 shadow-md bg-white p-1">
              <img
                alt="IT Work Process"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center border border-[#0077d9] rounded-lg bg-slate-50 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900">1</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 mb-0.5">
                    Discovery & Planning
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    We analyze business needs, define goals, and create clear roadmaps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center border border-[#0077d9] rounded-lg bg-slate-50 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900">2</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 mb-0.5">
                    Design & Development
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    We design intuitive interfaces and develop scalable, secure systems.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center border border-[#0077d9] rounded-lg bg-slate-50 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900">3</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-950 mb-0.5">
                    Testing & Support
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    We test thoroughly and provide long-term technical support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Team and Tech Sections (Responsive by default) */}
      <TeamSection />
      <TechFeaturesSection />
    </div>
  );
}
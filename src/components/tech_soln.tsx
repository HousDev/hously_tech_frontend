import React from 'react';

const TechFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-1.svg",
      title: "IT Consulting",
      description: "Expert IT consulting to optimize your business processes.",
      delay: "0ms"
    },
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-2.svg",
      title: "Cloud Solutions",
      description: "Secure and scalable cloud infrastructure for productivity.",
      delay: "150ms"
    },
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-3.svg",
      title: "Cybersecurity",
      description: "Protect your data and systems with advanced security.",
      delay: "300ms"
    },
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-4.svg",
      title: "Software Development",
      description: "Custom software, web, and mobile applications.",
      delay: "450ms"
    }
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translate3d(50px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-slideInRight { 
          animation: slideInRight 900ms cubic-bezier(0.16, 1, 0.3, 1) both; 
        }
        
        /* Floating micro-movement for rotated visual interest */
        @keyframes floatRotate {
          0%, 100% { transform: rotate(30deg) translateY(0px); }
          50% { transform: rotate(30deg) translateY(-6px); }
        }
        .animate-float-rotate {
          animation: floatRotate 6s ease-in-out infinite;
        }
      `}</style>

      {/* Desktop Version */}
      <div className="hidden lg:block bg-slate-50 border-t border-b border-slate-100">
        <section className="py-16 relative overflow-hidden">
          {/* Background Decorators */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-[5%] w-[250px] h-[250px] bg-gradient-to-tr from-blue-400/5 to-purple-400/5 rounded-full blur-[90px] animate-pulse" />
            <div className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,119,217,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,119,217,0.012)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-12 gap-10 items-center">
              
              {/* Content Column (Left Side) */}
              <div className="col-span-6">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0077d9]" />
                    <span className="text-[10px] font-bold text-[#0077d9] tracking-wider uppercase">IT Solutions</span>
                  </div>
                  <h2 className="text-2xl lg:text-[30px] leading-tight font-extrabold text-slate-900 tracking-tight">
                    Empowering Businesses with <span className="text-[#0077d9]">Innovative IT Solutions</span>
                  </h2>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed max-w-lg">
                    Transform your digital operations with our enterprise-grade services tailored for scalability, resilience, and business growth.
                  </p>
                </div>

                {/* Premium Compact Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="group bg-white p-4.5 rounded-xl border border-slate-100/70 hover:border-[#0077d9]/35 hover:shadow-[0_8px_25px_-5px_rgba(0,119,217,0.06)] transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#0077d9] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                      
                      <div className="w-8 h-8 flex items-center justify-center bg-[#0077d9]/10 rounded-lg mb-3 group-hover:bg-[#0077d9] transition-all duration-300">
                        <img
                          alt={feature.title}
                          src={feature.icon}
                          className="w-4 h-4 filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
                        />
                      </div>
                      
                      <h3 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-[#0077d9] transition-colors duration-250">
                        {feature.title}
                      </h3>
                      <p className="text-[10.5px] text-gray-500 leading-normal">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restored Layout Style Visual Column (Right Side - Tall + Rotated Top Right + Square Lower Right) */}
              <div className="col-span-6">
                <div className="relative animate-slideInRight max-w-[540px] mx-auto">
                  <div className="flex -mx-3 items-center">
                    
                    {/* Left Tall Image */}
                    <div className="w-1/2 px-3">
                      <div className="rounded-[24px] overflow-hidden shadow-xl border border-slate-100/50 bg-white p-1.5 transition-transform duration-500 hover:scale-[1.02]">
                        <img
                          alt="IT Consulting"
                          src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80"
                          className="w-full h-[420px] object-cover rounded-[18px]"
                        />
                      </div>
                    </div>
                    
                    {/* Right Double Image Stack */}
                    <div className="w-1/2 px-3 flex flex-col gap-4">
                      {/* Top Rotated Image (30deg) */}
                      <div className="rounded-[24px] overflow-hidden shadow-2xl border border-slate-100/50 bg-white p-1.5 animate-float-rotate transition-transform duration-500 hover:scale-[1.02]">
                        <img
                          alt="IT service"
                          src="https://html.themehour.net/robor/demo/assets/img/feature/4-2.jpg"
                          className="w-full h-[210px] object-cover rounded-[18px]"
                        />
                      </div>
                      
                      {/* Bottom Unrotated Image */}
                      <div className="rounded-[24px] overflow-hidden shadow-xl border border-slate-100/50 bg-white p-1.5 transition-transform duration-500 hover:scale-[1.02]">
                        <img
                          alt="IT service"
                          src="https://html.themehour.net/robor/demo/assets/img/feature/4-3.jpg"
                          className="w-full h-[170px] object-cover rounded-[18px]"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Mobile Version */}
      <div className="block lg:hidden bg-slate-50 border-t border-b border-slate-100">
        <section className="py-10 px-4">
          <div className="max-w-md mx-auto">
            
            {/* Mobile Title Section */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#0077d9]/10 rounded-full border border-[#0077d9]/20 text-[10px] font-bold text-[#0077d9] tracking-wider uppercase mb-2">
                IT Solutions
              </span>
              <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                Empowering Businesses with Innovative Solutions
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                Transforming businesses with technology solutions and expert consulting.
              </p>
            </div>

            {/* Mobile Image Section */}
            <div className="relative mb-6">
              <div className="rounded-2xl overflow-hidden shadow-md bg-white p-1 mb-4">
                <img
                  alt="IT Consulting"
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border-2 border-white shadow-sm">
                  <img
                    alt="IT Service"
                    src="https://html.themehour.net/robor/demo/assets/img/feature/4-2.jpg"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-white shadow-sm">
                  <img
                    alt="IT Service"
                    src="https://html.themehour.net/robor/demo/assets/img/feature/4-3.jpg"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Features Grid */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-[#0077d9]/30 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#0077d9]/10 rounded-lg flex-shrink-0">
                      <img
                        alt={feature.title}
                        src={feature.icon}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                        {feature.title}
                      </h3>
                      <p className="text-gray-500 text-[10.5px] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TechFeaturesSection;
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
      delay: "270ms"
    },
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-3.svg",
      title: "Cybersecurity",
      description: "Protect your data and systems with advanced security.",
      delay: "0ms"
    },
    {
      icon: "https://html.themehour.net/robor/demo/assets/img/icon/feature-icon4-4.svg",
      title: "Software Development",
      description: "Custom software, web, and mobile applications.",
      delay: "270ms"
    }
  ];

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translate3d(100%, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translate3d(0, 100%, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-slideInRight { animation: slideInRight 900ms ease both; }
        .animate-slideInUp { animation: slideInUp 900ms ease both; }
      `}</style>

      {/* Desktop Version (hidden on mobile) */}
      <div className="hidden lg:block">
        <section className="py-10 pr-14 pl-20 bg-gray-100 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-3">
            <div className="flex flex-wrap flex-row-reverse -mx-10 -mt-16 items-start">
              
              {/* Images Column */}
              <div className="w-full lg:w-1/2 px-10 mt-0 pt-20">
                <div className="relative inline-block animate-slideInRight">
                  <div className="flex flex-wrap -mx-3 -mt-6">
                    <div className="w-1/2 px-3 mt-6">
                      <div className="rounded-3xl overflow-hidden">
                        <img
                          alt="IT Consulting"
                          src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80"
                          className="w-250 h-156"
                        />
                      </div>
                    </div>
                    <div className="w-1/2 px-3 mt-6">
                      <div className="rounded-3xl overflow-hidden rotate-[30deg] mb-6">
                        <img
                          alt="IT service"
                          src="https://html.themehour.net/robor/demo/assets/img/feature/4-2.jpg"
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="rounded-3xl overflow-hidden">
                        <img
                          alt="IT service"
                          src="https://html.themehour.net/robor/demo/assets/img/feature/4-3.jpg"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full lg:w-1/2 px-10 mt-16">
                <div className="mb-10 relative z-10">
                  <span className="inline-block text-base font-medium uppercase text-blue-600 mb-6 animate-slideInUp">
                    IT Solutions
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight animate-slideInUp">
                    <span className="block">Empowering Businesses</span>
                    <span className="block">with Innovative IT Solutions</span>
                  </h2>
                </div>

                <div className="flex flex-wrap -mx-3 -mt-5">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="w-full md:w-1/2 px-3 mt-6 animate-slideInUp"
                      style={{ animationDelay: feature.delay }}
                    >
                      <div className="bg-white p-5 rounded-2xl border border-gray-300 text-center transition-all duration-400 hover:shadow-lg">
                        <div className="inline-block mb-4">
                          <img
                            alt={feature.title}
                            src={feature.icon}
                            className="transition-all duration-400 w-15 h-10 mx-auto"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-6">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Version (visible only on mobile) */}
      <div className="block lg:hidden">
        <section className="py-4 bg-gray-100 px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Mobile Title Section */}
            <div className="text-center mb-10 ">
              <span className="inline-block text-blue-600 font-medium uppercase tracking-wider text-sm mb-3 ">
                IT Solutions
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Empowering Businesses with Innovative IT Solutions
              </h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Transforming businesses with cutting-edge technology solutions and expert consulting
              </p>
            </div>
             {/* Mobile Image Section */}
            <div className="relative pb-6">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img
                  alt="IT Consulting"
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-48 object-cover"
                />
              </div>
              
              {/* Smaller Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    alt="IT Service"
                    src="https://html.themehour.net/robor/demo/assets/img/feature/4-2.jpg"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img
                    alt="IT Service"
                    src="https://html.themehour.net/robor/demo/assets/img/feature/4-3.jpg"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Features Grid */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                        <img
                          alt={feature.title}
                          src={feature.icon}
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
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
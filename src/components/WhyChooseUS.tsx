/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";

const WhyChooseUsSection: React.FC = () => {
  const [, setRotation] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Add intersection observer to trigger counting when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isCounting) {
            setIsCounting(true);
            startCounting();
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    const section = document.getElementById('why-choose-us');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isCounting]);

  const startCounting = () => {
    let start = 0;
    const end = 12; // Count to 12
    const duration = 1500; // ms
    const stepTime = 20; // ms
    const increment = end / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setExperienceCount(end);
        clearInterval(counter);
      } else {
        setExperienceCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(counter);
  };

  const renderAnimatedText = (text: string, className: string = '') => {
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((letter, letterIndex) => (
          <span
            key={`${wordIndex}-${letterIndex}`}
            className={`inline-block animate-fadeInUp ${className}`}
            style={{
              animationDelay: `${(wordIndex * 100 + letterIndex * 50)}ms`
            }}
          >
            {letter}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));
  };

  const features = [
    {
      id: 1,
      number: "01.",
      title: "Expert Team & Experience",
      description: "Our team of certified AI specialists, data scientists, and industry experts bring 24+ years of collective experience to deliver cutting-edge solutions.",
    },
    {
      id: 2,
      number: "02.",
      title: "End-to-End Solutions",
      description: "From web development and AI integration to cloud solutions and digital transformation, we provide comprehensive technology services under one roof.",
    },
    {
      id: 3,
      number: "03.",
      title: "Innovation Focus",
      description: "We constantly push technological boundaries with AI research, machine learning advancements, and innovative automation solutions.",
    },
    {
      id: 4,
      number: "04.",
      title: "Client-Centric Approach",
      description: "We prioritize your business goals, ensuring our technology solutions drive tangible results and competitive advantage.",
    }
  ];

  const subTitle = "WHY CHOOSE US";
  const mainTitle = "Our goal is to build a world where technology serves humanity.";

  return (
    <>
      <section
        id="why-choose-us"
        className="relative overflow-hidden bg-black pt-[60px] pb-[60px]"
      >
        <style>
          {`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
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

            .animate-slideInLeft {
              animation: slideInLeft 0.9s ease forwards;
            }

            .animate-slideInUp {
              animation: slideInUp 0.9s ease forwards;
            }

            .animate-fadeInUp {
              animation: fadeInUp 0.5s ease forwards;
              opacity: 0;
            }

            .animate-spin-slow {
              animation: spinSlow 18s linear infinite;
            }
          `}
        </style>

        <div className="container mx-auto px-6 max-w-[1488px]">
          <div className="flex flex-wrap -mx-10 -mt-10">
            {/* Left Column - 7/12 on desktop, full width on mobile */}
            <div className="w-full xl:w-7/12 px-10 mt-10">
              {/* Title Section */}
              <div className="mb-[60px] xl:mb-[60px] mb-10 relative z-10 xl:-mt-4">
                {/* Sub Title */}
                <span
                  className="inline-block text-[12px] sm:text-[13px] font-medium uppercase tracking-wider text-[#0076d8] mb-5 xl:mb-7 relative pb-1 animate-slideInLeft"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    animationDelay: '0ms',
                  }}
                >
                  {renderAnimatedText(subTitle)}
                </span>

                {/* Main Title */}
                <h2
                  className="text-[24px] sm:text-[32px] md:text-[40px] xl:text-[48px] font-bold leading-tight text-white mb-5 xl:-mt-6 animate-slideInLeft"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    animationDelay: '0ms',
                  }}
                >
                  {renderAnimatedText(mainTitle)}
                </h2>
              </div>

              {/* Image */}
              <div className="inline-block w-full max-w-full md:xl:max-w-[645px] rounded-[20px] xl:rounded-[30px] overflow-hidden animate-slideInUp mb-10 xl:mb-0">
                <img
                  alt="Why Choose Us"
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
                  className="w-full h-[200px] md:h-[520px] object-cover"
                />
              </div>
            </div>

            {/* Right Column - 5/12 on desktop, full width on mobile */}
            <div className="w-full xl:w-5/12 px-10 mt-2">
              {/* Counter Section */}
              <div className="text-center xl:text-right mb-6 xl:mb-16">
                {/* 12+ in one line */}
                <div className="flex justify-center xl:justify-end items-end leading-none animate-slideInUp">
                  {/* Animated number */}
                  <span
                    className="text-white font-bold text-[100px] sm:text-[140px] md:text-[200px] xl:text-[240px] leading-[0.74]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {experienceCount}
                  </span>
                  
                  {/* Plus sign - ALWAYS VISIBLE */}
                  <span
                    className="font-bold text-[50px] sm:text-[70px] md:text-[100px] xl:text-[140px] leading-[0.8] ml-2"
                    style={{
                      WebkitTextStroke: "1px #ffffff",
                      color: "transparent",
                      fontFamily: '"Space Grotesk", sans-serif'
                    }}
                  >
                    +
                  </span>
                </div>

                {/* Text below - ALWAYS VISIBLE */}
                <div
                  className="text-white font-bold text-center xl:text-right mx-auto xl:ml-auto mt-4 animate-slideInUp"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  <div className="text-[24px] sm:text-[30px] md:text-[36px] xl:text-[40px] leading-[1.1]">Years Of</div>
                  <div className="text-[24px] sm:text-[30px] md:text-[36px] xl:text-[40px] leading-[1.1]">Experience</div>
                </div>
              </div>

              {/* Features Section with Circle Animation */}
              <div className="relative xl:ml-[-198px] ml-0">
                {/* Animated Circle - Hidden on mobile, visible on xl */}
                <div className="hidden xl:block absolute bottom-0 left-0 -translate-y-1 animate-slideInUp">
                  <div className="relative w-[244px] h-[244px]">
                    {/* Rotating Circular Text */}
                    <div className="absolute inset-0 animate-spin-slow">
                      <svg
                        viewBox="0 0 244 244"
                        className="w-full h-full"
                      >
                        <defs>
                          <path
                            id="circlePath"
                            d="
                              M 122,122
                              m -92,0
                              a 92,92 0 1,1 184,0
                              a 92,92 0 1,1 -184,0
                            "
                          />
                        </defs>

                        <text
                          fill="white"
                          fontSize="13"
                          fontWeight="600"
                          letterSpacing="8"
                        >
                          <textPath
                            href="#circlePath"
                            startOffset="0%"
                          >
                            HOUSLY • IT AND AUTOMATION • INTEGRATION •
                          </textPath>
                        </text>
                      </svg>
                    </div>

                    {/* Grey Ring */}
                    <div className="absolute inset-[10px] rounded-full border-[32px] border-white/30" />

                    {/* Center Arrow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      
                        <FaArrowRightLong className="text-white text-[32px]" />
                     
                    </div>
                  </div>
                </div>

                {/* Features Cards */}
                <div className="space-y-[30px] xl:space-y-[50px]">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className={`flex gap-4 xl:gap-6 max-w-full xl:max-w-[379px] animate-slideInUp
                        ${index === 0 ? 'xl:-mt-50' : ''}
                        ${index === 1 ? 'xl:-mt-4' : ''}
                        ${index === 2 ? 'xl:-mt-10' : ''}
                        ${index === 3 ? 'xl:-mt-1' : ''}
                        ${index >= 2 ? 'xl:ml-[320px]' : ''}
                      `}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Number */}
                      <div 
                        className="text-[22px] xl:text-[28px] font-bold text-gray-300 shrink-0"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                        }}
                      >
                        {feature.number}
                      </div>
                      
                      {/* Content */}
                      <div>
                        {/* Title */}
                        <h4 
                          className="text-white font-bold text-[16px] xl:text-[20px] leading-[1.417] xl:-mt-2 mb-2"
                          style={{
                            fontFamily: '"Space Grotesk", sans-serif',
                          }}
                        >
                          {feature.title}
                        </h4>
                        
                        {/* Description */}
                        <p 
                          className="text-gray-400 text-[14px] xl:text-[15px] leading-[1.75] max-w-full xl:max-w-[298px]"
                          style={{
                            fontFamily: '"DM Sans", sans-serif',
                          }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUsSection;
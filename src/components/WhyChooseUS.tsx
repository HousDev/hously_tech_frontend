

/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { Sparkles, Zap, Users, Cpu, Shield } from 'lucide-react';

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
      { threshold: 0.3 }
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
    const end = 12;
    const duration = 1500;
    const stepTime = 20;
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
      number: "01",
      title: "Expert Team & Experience",
      description: "Our team of certified AI specialists, data scientists, and industry experts bring 24+ years of collective experience to deliver cutting-edge solutions.",
      icon: Users
    },
    {
      id: 2,
      number: "02",
      title: "End-to-End Solutions",
      description: "From web development and AI integration to cloud solutions and digital transformation, we provide comprehensive technology services under one roof.",
      icon: Cpu
    },
    {
      id: 3,
      number: "03",
      title: "Innovation Focus",
      description: "We constantly push technological boundaries with AI research, machine learning advancements, and innovative automation solutions.",
      icon: Zap
    },
    {
      id: 4,
      number: "04",
      title: "Client-Centric Approach",
      description: "We prioritize your business goals, ensuring our technology solutions drive tangible results and competitive advantage.",
      icon: Shield
    }
  ];

  const subTitle = "WHY CHOOSE US";
  const mainTitle = "Our goal is to build a world where technology serves humanity.";

  return (
    <>
      <section
        id="why-choose-us"
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 sm:py-12"
      >
        <style>
          {`
            @keyframes slideInLeft {
              from { opacity: 0; transform: translateX(-30px); }
              to { opacity: 1; transform: translateX(0); }
            }

            @keyframes slideInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes spinSlow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-slideInLeft {
              animation: slideInLeft 0.7s ease forwards;
            }

            .animate-slideInUp {
              animation: slideInUp 0.7s ease forwards;
            }

            .animate-fadeInUp {
              animation: fadeInUp 0.4s ease forwards;
              opacity: 0;
            }

            .animate-spin-slow {
              animation: spinSlow 18s linear infinite;
            }

            .glass-card {
              background: rgba(255, 255, 255, 0.04);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.06);
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .glass-card:hover {
              background: rgba(255, 255, 255, 0.07);
              border-color: rgba(59, 130, 246, 0.2);
              transform: translateX(4px);
            }
          `}
        </style>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">

            {/* Left Column */}
            <div className="lg:col-span-7">
              {/* Title Section */}
              <div className="mb-6 lg:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 backdrop-blur-sm rounded-full border border-blue-400/15 mb-3 animate-slideInLeft">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span className="text-[9px] font-semibold text-blue-400 tracking-wider uppercase">
                    {renderAnimatedText(subTitle)}
                  </span>
                </div>

                <h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white animate-slideInLeft"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  {renderAnimatedText(mainTitle)}
                </h2>
              </div>

              {/* Image */}
              <div className="relative group animate-slideInUp">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <div className="relative rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                  <img
                    alt="Why Choose Us"
                    src="/tech3.png"
                    className="w-full h-[160px] sm:h-[260px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5">
              {/* Counter */}
              <div className="text-center lg:text-right mb-5 lg:mb-6">
                <div className="flex justify-center lg:justify-end items-end leading-none animate-slideInUp">
                  <span
                    className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-5xl"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {experienceCount}
                  </span>
                  <span
                    className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-3xl ml-1.5"
                    style={{
                      WebkitTextStroke: "1px #ffffff",
                      color: "transparent",
                      fontFamily: '"Space Grotesk", sans-serif'
                    }}
                  >
                    +
                  </span>
                </div>
                <div className="text-white font-medium mt-1 animate-slideInUp" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  <div className="text-sm sm:text-base md:text-lg">Years Of Experience</div>
                </div>
              </div>

              {/* Features */}
              <div className="relative">
                {/* Animated Circle - Smaller */}
                <div className="hidden lg:block absolute -top-14 -left-14 animate-slideInUp">
                  <div className="relative w-[140px] h-[140px]">
                    <div className="absolute inset-0 animate-spin-slow">
                      <svg viewBox="0 0 140 140" className="w-full h-full">
                        <defs>
                          <path id="circlePath" d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
                        </defs>
                        <text fill="white" fontSize="8" fontWeight="500" letterSpacing="4">
                          <textPath href="#circlePath" startOffset="0%">
                            HOUSLY • IT AND AUTOMATION • INTEGRATION •
                          </textPath>
                        </text>
                      </svg>
                    </div>
                    <div className="absolute inset-[6px] rounded-full border-[16px] border-white/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <FaArrowRightLong className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Cards */}
                <div className="space-y-3 lg:space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="glass-card rounded-lg p-3 sm:p-3.5 transition-all duration-400 hover:shadow-lg hover:shadow-blue-500/5 animate-slideInUp"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 border border-white/5">
                          <feature.icon className="w-3.5 h-3.5 text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="text-[10px] font-bold text-blue-400"
                              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                            >
                              {feature.number}
                            </span>
                            <span className="w-4 h-px bg-gradient-to-r from-blue-400/30 to-transparent"></span>
                            <h4
                              className="text-white font-semibold text-xs sm:text-sm"
                              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                            >
                              {feature.title}
                            </h4>
                          </div>
                          <p
                            className="text-gray-400 text-[11px] sm:text-xs leading-relaxed"
                            style={{ fontFamily: '"DM Sans", sans-serif' }}
                          >
                            {feature.description}
                          </p>
                        </div>
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
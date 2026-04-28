

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { testimonialsApi, type Testimonial } from '../lib/testimonialApi';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

const TestimonialsSection: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [ currentSlide,setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ setMaxCardHeight] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const calculateMaxHeight = () => {
        if (window.innerWidth < 768) {
          return 300; // Reduced from 320
        } else if (window.innerWidth < 1024) {
          return 350; // Reduced from 380
        } else {
          return 390; // Reduced from 420
        }
      };
    }
  }, [testimonials]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await testimonialsApi.getAll();
      
      const activeTestimonials = data
        .filter((t: Testimonial) => t.is_active)
        .sort((a: Testimonial, b: Testimonial) => a.display_order - b.display_order);
      
      setTestimonials(activeTestimonials);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Failed to load testimonials');
      
      // Fallback data
      setTestimonials([
        {
          id: 1,
          name: "Laxman",
          position: "Co-founder",
          rating: 5,
          text: "Their AI-powered analytics platform transformed our decision-making process, increasing efficiency by 65% in the first quarter with seamless integration and exceptional 24/7 support.",
          image_url: "https://html.themehour.net/robor/demo/assets/img/testimonial/testi1-1.jpg",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Kamlesh",
          position: "Co-founder",
          rating: 5,
          text: "Cloud migration executed flawlessly.",
          image_url: "https://html.themehour.net/robor/demo/assets/img/testimonial/testi1-2.jpg",
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return url;
  };

  const renderAnimatedText = (text: string) => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className="inline-block animate-fadeInUp"
        style={{
          animationDelay: `${index * 50}ms`
        }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    ));
  };

  if (loading && testimonials.length === 0) {
    return (
      <section className="relative overflow-hidden py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <section className="relative overflow-hidden py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-red-600">Error: {error}</p>
          <button 
            onClick={fetchTestimonials}
            className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .animate-slideInUp {
          animation: slideInUp 0.9s ease forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.9s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        /* Card height consistency classes - REDUCED HEIGHTS */
        .testimonial-card-mobile {
          height: 300px;
          min-height: 300px;
          max-height: 300px;
        }

        .testimonial-card-tablet {
          height: 350px;
          min-height: 350px;
          max-height: 350px;
        }

        .testimonial-card-desktop {
          height: 390px;
          min-height: 390px;
          max-height: 390px;
        }

        /* Make sure text container takes available space */
        .testimonial-text-container {
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        /* Text clamping for consistent appearance */
        .testimonial-text-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .testimonial-text-clamp-tablet {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .testimonial-text-clamp-desktop {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Custom Pagination Bullets */
        .testimonial-bullet {
          display: inline-block;
          width: 40px;
          height: 6px;
          background-color: #D7D7D7;
          border-radius: 10px;
          transition: all 0.4s;
          cursor: pointer;
          margin: 0 4px;
        }

        .testimonial-bullet.swiper-pagination-bullet-active {
          background-color: #6D30FB;
          width: 60px;
        }

        /* Mobile & Tablet Pagination */
        .mobile-testimonial-bullet {
          display: inline-block;
          width: 30px;
          height: 4px;
          background-color: #D7D7D7;
          border-radius: 10px;
          transition: all 0.4s;
          cursor: pointer;
          margin: 0 2px;
        }

        .mobile-testimonial-bullet.swiper-pagination-bullet-active {
          background-color: #0076d8;
          width: 40px;
        }

        /* Tablet Pagination */
        .tablet-testimonial-bullet {
          display: inline-block;
          width: 35px;
          height: 5px;
          background-color: #D7D7D7;
          border-radius: 10px;
          transition: all 0.4s;
          cursor: pointer;
          margin: 0 3px;
        }

        .tablet-testimonial-bullet.swiper-pagination-bullet-active {
          background-color: #6D30FB;
          width: 50px;
        }

        /* Image fallback styles */
        .testimonial-image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0076d8;
          color: white;
          font-weight: bold;
        }

        /* Ensure consistent card width */
        .testimonial-card-width {
          width: 100%;
        }

        /* Desktop specific width */
        @media (min-width: 1024px) {
          .testimonial-card-width-lg {
            width: 380px;
          }
        }

        @media (min-width: 1280px) {
          .testimonial-card-width-xl {
            width: 472px;
          }
        }
      `}</style>

      {/* Mobile Version (0px to 767px) - FONT SIZES REDUCED */}
      <div className="block md:hidden">
        <section className="relative overflow-hidden py-5 bg-gray-100 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Title Section - FONT SIZES REDUCED */}
            <div className="text-center mb-8">
              <span className="inline-block text-[#0076d8] font-medium uppercase tracking-wider text-[11px] mb-3">
                Testimonials
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                What Our Clients Say About Us
              </h2>
              <p className="text-gray-600 text-xs max-w-md mx-auto mb-6">
                Hear from businesses that have transformed with our IT solutions
              </p>
            </div>

            {/* Mobile Testimonial Slider */}
            <div className="mb-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                centeredSlides={true}
                loop={testimonials.length > 1}
                speed={800}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  nextEl: '.mobile-testimonial-next',
                  prevEl: '.mobile-testimonial-prev',
                }}
                pagination={{
                  el: '.mobile-testimonial-pagination',
                  clickable: true,
                  renderBullet: (_index: number, className: string) => {
                    return `<span class="${className} mobile-testimonial-bullet"></span>`;
                  },
                }}
                onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                className="pb-10"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div 
                      className="bg-white rounded-2xl p-5 shadow-lg mx-2 testimonial-card-mobile testimonial-card-width flex flex-col"
                      style={{ minHeight: '30px', height: '200px' }}
                    >
                      {/* Rating Stars - SIZE REDUCED */}
                      <div className="flex gap-1 text-[#0076d8] mb-3 text-sm">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      {/* Testimonial Text Container */}
                      <div className="testimonial-text-container mb-5">
                        <p className="text-gray-600 leading-relaxed text-xs testimonial-text-clamp">
                          "{testimonial.text}"
                        </p>
                      </div>

                      {/* Profile - Fixed at bottom */}
                      <div className="mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            {testimonial.image_url ? (
                              <img
                                alt={testimonial.name}
                                src={getImageUrl(testimonial.image_url)}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-12 h-12 rounded-full testimonial-image-fallback text-sm';
                                    fallback.textContent = testimonial.name.charAt(0);
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full testimonial-image-fallback text-sm">
                                {testimonial.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-600 text-xs">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Show message if no testimonials */}
              {testimonials.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No testimonials available yet.</p>
                </div>
              )}

              {/* Mobile Slider Controls - SIZE REDUCED */}
            {testimonials.length > 0 && (
  <div className="flex items-center justify-center gap-3 mt-4">
    
    <button className="mobile-testimonial-prev flex-shrink-0 w-10 h-10 rounded-full bg-[#0076d8] text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    {/* ❌ Removed pagination dots */}

    <button className="mobile-testimonial-next flex-shrink-0 w-10 h-10 rounded-full bg-[#0076d8] text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>

  </div>
)}
            </div>
          </div>
        </section>
      </div>

      {/* Tablet Version (768px to 1023px) - FONT SIZES REDUCED */}
      <div className="hidden md:block lg:hidden">
        <section className="relative overflow-hidden py-5 bg-gray-100 px-2">
          <div className="max-w-6xl mx-auto">
            {/* Tablet Title Section - FONT SIZES REDUCED */}
            <div className="text-center mb-10">
              <span className="inline-block text-[#0076d8] font-medium uppercase tracking-wider text-xs mb-4">
                Testimonials
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                What Our Clients Say About Us
              </h2>
              <p className="text-gray-600 text-base max-w-2xl mx-auto mb-8">
                Hear from businesses that have transformed with our IT solutions
              </p>
            </div>

            {/* Tablet Slider Container */}
            <div className="relative">
              {testimonials.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={28}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    loop={testimonials.length > 1}
                    speed={700}
                    autoplay={{
                      delay: 4500,
                      disableOnInteraction: false,
                    }}
                    navigation={{
                      nextEl: '.tablet-testimonial-next',
                      prevEl: '.tablet-testimonial-prev',
                    }}
                    pagination={{
                      el: '.tablet-testimonial-pagination',
                      clickable: true,
                      renderBullet: (_index: number, className: string) => {
                        return `<span class="${className} tablet-testimonial-bullet"></span>`;
                      },
                    }}
                    onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    className="pb-14"
                    breakpoints={{
                      768: {
                        slidesPerView: 1.3,
                        spaceBetween: 24,
                      },
                      900: {
                        slidesPerView: 1.5,
                        spaceBetween: 28,
                      }
                    }}
                  >
                    {testimonials.map((testimonial) => (
                      <SwiperSlide key={testimonial.id}>
                        <div 
                          className="bg-white rounded-2xl p-6 shadow-xl testimonial-card-tablet testimonial-card-width flex flex-col"
                          style={{ minHeight: '350px', height: '350px' }}
                        >
                          {/* Rating Stars - SIZE REDUCED */}
                          <div className="flex gap-1.5 text-[#0076d8] mb-4 text-base">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>

                          {/* Testimonial Text Container */}
                          <div className="testimonial-text-container mb-6">
                            <p className="text-gray-600 text-base leading-relaxed testimonial-text-clamp-tablet">
                              "{testimonial.text}"
                            </p>
                          </div>

                          {/* Profile - Fixed at bottom */}
                          <div className="mt-auto">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {testimonial.image_url ? (
                                  <img
                                    alt={testimonial.name}
                                    src={getImageUrl(testimonial.image_url)}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = 'w-14 h-14 rounded-full testimonial-image-fallback text-base';
                                        fallback.textContent = testimonial.name.charAt(0);
                                        parent.appendChild(fallback);
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full testimonial-image-fallback text-base">
                                    {testimonial.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {testimonial.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {testimonial.position}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Tablet Controls - SIZE REDUCED */}
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <button className="tablet-testimonial-prev flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="tablet-testimonial-pagination justify-between"></div>
                    <button className="tablet-testimonial-next flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base">No testimonials available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Version (1024px and above) - FONT SIZES REDUCED */}
      <div className="hidden lg:block">
        <section className="relative overflow-hidden pt-2 pb-8 bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1488px]">
            <div className="flex flex-wrap -mx-3 flex-row-reverse items-start">
              {/* Right Side - Static Image (Remains unchanged) */}
              <div className="w-full xl:w-7/12 px-3 mt-12">
                <div className="text-right">
                  <div className="inline-block rounded-3xl overflow-hidden max-w-full xl:max-w-[773px] animate-slideInRight">
                    <img
                      alt="Testimonial"
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                      className="w-full h-130 object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Left Side - Content */}
              <div className="w-full xl:w-5/12 px-3 mt-12">
                {/* Title Area - FONT SIZES REDUCED */}
                <div className="mb-8 lg:mb-[32px] relative z-10 -mt-4">
                  <span
                    className="inline-block text-xs lg:text-[13px] font-medium uppercase tracking-wider text-[#0076d8] mb-3 lg:mb-5 relative pb-1 animate-slideInUp"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {renderAnimatedText('Testimonials')}
                  </span>

                  <h2
                    className="text-3xl lg:text-4xl xl:text-[38px] font-bold leading-tight lg:leading-tight text-gray-900 mb-9  lg:-mt-4 animate-slideInUp"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {renderAnimatedText('What Our Clients Say About us')}
                  </h2>
                </div>

                {/* Slider Area */}
                <div className="relative z-10 mb-6 animate-slideInUp lg:-mr-[372px] xl:-mr-[372px]">
                  <div className="-m-4 lg:-m-[25px] px-3">
                    {testimonials.length > 0 ? (
                      <>
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          spaceBetween={24}
                          slidesPerView={'auto'}
                          centeredSlides={false}
                          loop={testimonials.length > 1}
                          speed={1000}
                          autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                          }}
                          navigation={{
                            nextEl: '.testimonial-next',
                            prevEl: '.testimonial-prev',
                          }}
                          pagination={{
                            el: '.testimonial-pagination',
                            clickable: true,
                            renderBullet: (_index: number, className: string) => {
                              return `<span class="${className} testimonial-bullet"></span>`;
                            },
                          }}
                          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                          onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                          }}
                          className="testimonial-slider py-4 lg:py-6.25"
                          breakpoints={{
                            1024: {
                              slidesPerView: 'auto',
                              spaceBetween: 24,
                            },
                            1280: {
                              slidesPerView: 'auto',
                              spaceBetween: 24,
                            }
                          }}
                        >
                          {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id} className="!w-full lg:!w-[380px] xl:!w-[472px]">
                              <div 
                                className="bg-white rounded-2xl lg:rounded-[30px] p-6 lg:p-7 xl:p-9 shadow-lg lg:shadow-[0_10px_20px_rgba(0,0,0,0.06)] testimonial-card-desktop testimonial-card-width-lg testimonial-card-width-xl flex flex-col"
                                style={{ minHeight: '200px', height: '320px' }}
                              >
                                {/* Rating Stars - SIZE REDUCED */}
                                <div className="flex gap-1.5 text-[#0076d8] mb-3 lg:mb-4 text-base lg:text-lg">
                                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                                    <svg key={i} className="w-4 lg:w-4.5 h-4 lg:h-4.5 fill-current" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  ))}
                                </div>

                                {/* Testimonial Text Container */}
                                <div className="testimonial-text-container mb-5 lg:mb-8">
                                  <p
                                    className="text-sm lg:text-base xl:text-[20px] text-gray-600 leading-relaxed lg:leading-[1.5em]  testimonial-text-clamp-desktop"
                                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                                  >
                                    "{testimonial.text}"
                                  </p>
                                </div>

                                {/* Profile - Fixed at bottom */}
                                <div className="mt-auto">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 rounded-full overflow-hidden">
                                      {testimonial.image_url ? (
                                        <img
                                          alt={testimonial.name}
                                          src={getImageUrl(testimonial.image_url)}
                                          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-white"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                              const fallback = document.createElement('div');
                                              fallback.className = 'w-12 h-12 lg:w-14 lg:h-14 rounded-full testimonial-image-fallback text-base';
                                              fallback.textContent = testimonial.name.charAt(0);
                                              parent.appendChild(fallback);
                                            }
                                          }}
                                        />
                                      ) : (
                                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full testimonial-image-fallback text-base">
                                          {testimonial.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h3
                                        className="text-sm lg:text-base xl:text-[16px] font-medium text-gray-900 mb-0.5"
                                        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                                      >
                                        {testimonial.name}
                                      </h3>
                                      <p
                                        className="text-xs lg:text-[12px] text-gray-600"
                                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                                      >
                                        {testimonial.position}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {/* Custom Controls - SIZE REDUCED */}
                        <div className="mt-5 lg:mt-6 flex items-center border border-gray-300 rounded-3xl lg:rounded-[40px] p-1.5 lg:p-2 max-w-full lg:max-w-[662px]">
                          <button className="testimonial-prev flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0076d8] text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300">
                            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div className="testimonial-pagination flex-1 flex items-center justify-center gap-1"></div>
                          <button className="testimonial-next flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0076d8] text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300">
                            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No testimonials available yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TestimonialsSection;
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Don't show on hero slider (home page hero section)
  const [isHomePageHero, setIsHomePageHero] = useState(false);

  useEffect(() => {
    const checkHeroSection = () => {
      const heroSection = document.querySelector('.min-h-screen.overflow-hidden');
      const isScrolledPastHero = window.scrollY > window.innerHeight * 0.8;
      
      if (heroSection && !isScrolledPastHero) {
        setIsHomePageHero(true);
      } else {
        setIsHomePageHero(false);
      }
    };

    window.addEventListener('scroll', checkHeroSection);
    checkHeroSection(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', checkHeroSection);
    };
  }, []);

  if (isHomePageHero) {
    return null; // Don't show button on hero slider
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[#0076d8] text-white rounded-full shadow-lg hover:bg-[#0076d8] transition-all duration-300 hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0076d8] focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default BackToTop;
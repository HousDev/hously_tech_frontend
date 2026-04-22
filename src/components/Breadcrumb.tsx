import React from "react";
import { useLocation, Link } from "react-router-dom";

interface BreadcrumbItem {
  path: string;
  label: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Define breadcrumb data for different routes
  const breadcrumbData: Record<string, { title: string; items: BreadcrumbItem[] }> = {
    "/": {
      title: "Home",
      items: [{ path: "/", label: "Home" }]
    },
    "/about": {
      title: "About Us",
      items: [
        { path: "/", label: "Home" },
        { path: "/about", label: "About Us" }
      ]
    },
    "/services": {
      title: "Our Services",
      items: [
        { path: "/", label: "Home" },
        { path: "/services", label: "Our Services" }
      ]
    },
    "/career": {
      title: "Career Opportunities",
      items: [
        { path: "/", label: "Home" },
        { path: "/career", label: "Career" }
      ]
    },
    "/contact": {
      title: "Contact Us",
      items: [
        { path: "/", label: "Home" },
        { path: "/contact", label: "Contact Us" }
      ]
    },
    "/testimonial": {
      title: "Testimonials",
      items: [
        { path: "/", label: "Home" },
        { path: "/testimonial", label: "Testimonials" }
      ]
    },
     "/casestudy": {
      title: "CaseStudy",
      items: [
        { path: "/", label: "Home" },
        { path: "/casestudy", label: "CaseStudy" }
      ]
    },
  };

  // Get current route data or use default
  const currentPath = location.pathname;
  const routeData = breadcrumbData[currentPath] || {
    title: "Page",
    items: [
      { path: "/", label: "Home" },
      { path: currentPath, label: currentPath.replace("/", "") || "Current Page" }
    ]
  };

  // Determine background gradient based on route
  const getBackgroundGradient = () => {
    const gradients: Record<string, string> = {
      "/": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "/about": "linear-gradient(135deg, #0076d8 0%, #0066c0 100%)",
      "/services": "linear-gradient(135deg, #0076d8 0%, #0066c0 100%)",
      "/career": "linear-gradient(135deg, #0076d8 0%, #0066c0 100%)",
      "/contact": "linear-gradient(135deg, #0076d8 0%, #0066c0 100%)",
      "/testimonial": "linear-gradient(135deg, #0076d8 0%, #0066c0 100%)",
    };
    return gradients[currentPath] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  };

  return (
    <>
      {/* Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

            .breadcumb-content {
              height: 35vh;
              min-height: 180px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              position: relative;
              overflow: hidden;
              transition: all 0.5s ease;
              margin-top: 80px; /* ADD THIS: Pushes breadcrumb below navbar */
            }

            .breadcumb-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: ${getBackgroundGradient()};
              transition: all 0.5s ease;
              z-index: -1;
            }

            .breadcumb-content::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80') center/cover;
              opacity: 0.1;
              z-index: -1;
            }

            .font-space-grotesk {
              font-family: 'Space Grotesk', sans-serif;
            }

            .breadcrumb-title {
              position: relative;
              display: inline-block;
            }

            .breadcrumb-title span {
              display: inline-block;
              opacity: 0;
              transform: translateY(20px);
              animation: letterReveal 0.5s forwards;
            }

            @keyframes letterReveal {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .breadcrumb-separator {
              transition: color 0.3s ease;
            }

            .breadcrumb-item:hover .breadcrumb-separator {
              color: #ffd801;
            }
          `,
        }}
      />

      {/* Breadcrumb */}
      <div className="breadcumb-content text-center">
        {/* Animated Title with letter spacing effect */}
        <h1 className="font-space-grotesk font-bold text-white text-4xl md:text-6xl lg:text-7xl mb-3 md:mb-6 px-4">
          <div className="breadcrumb-title">
            {routeData.title.split('').map((letter, index) => (
              <span 
                key={index}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  marginRight: letter === ' ' ? '0.5em' : '0.1em'
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </h1>

        {/* Breadcrumb Navigation */}
        <ul className="inline-flex items-center gap-2 text-white text-sm md:text-base lg:text-lg font-space-grotesk font-medium">
          {routeData.items.map((item, index) => (
            <React.Fragment key={item.path}>
              <li className={`breadcrumb-item flex items-center ${index === routeData.items.length - 1 ? 'text-[#ffd801] font-semibold' : ''}`}>
                {index === routeData.items.length - 1 ? (
                  <span className="cursor-default">{item.label}</span>
                ) : (
                  <Link 
                    to={item.path} 
                    className="hover:text-[#ffd801] transition-colors duration-300 hover:scale-105 inline-block"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {index < routeData.items.length - 1 && (
                <li className="breadcrumb-separator mx-2 text-white/60">
                  <span className="transition-colors duration-300">/</span>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-4 w-8 h-8 border-2 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-4 w-6 h-6 border-2 border-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border border-white/10 rounded-full"></div>
      </div>
    </>
  );
};

export default Breadcrumb;
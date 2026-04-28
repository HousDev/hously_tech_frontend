

import React, { useState, useEffect } from 'react';
import { 
  X,
  Code, 
  Cloud, 
  Laptop, 
  Palette, 
  UserCircle, 
  Shield, 
  TrendingUp, 
  Smartphone,
  Server,
  Database,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  Users,
  Briefcase,
  Target,
  Rocket,
  Zap,
  Heart,
  Star as StarIcon,
  ThumbsUp,
  Award,
  Loader2
} from 'lucide-react';
import { servicesApi, type Service } from '../lib/servicesApi';

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Code, Cloud, Laptop, Palette, UserCircle, Shield, TrendingUp, Smartphone,
  Server, Database, Globe, MessageCircle, Mail, Phone, Users, Briefcase,
  Target, Rocket, Zap, Heart, StarIcon, ThumbsUp, Award
};

// AnimatedText component
interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((letter, index) => (
        <span key={index} className="inline-block" style={{ animationDelay: `${index * 0.03}s` }}>
          {letter}
        </span>
      ))}
    </span>
  );
};

// ServiceCard component
const ServiceCard: React.FC<{ 
  service: Service; 
  onReadMore: () => void;
  getIconComponent: (service: Service) => React.ReactNode;
}> = ({ service, onReadMore, getIconComponent }) => {
  
  return (
    <div 
      className="w-full lg:w-1/2 xl:w-1/4 px-3 mt-3 animate-slideInUp group/card"
      style={{ animationDelay: `${(service.display_order - 1) * 270}ms` }}
    >
      <div className="bg-white rounded-2xl p-5 overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200 group-hover/card:-translate-y-1">
        
        {/* Card hover effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-gray-50/30 to-transparent"></div>
        </div>
        
        {/* Icon */}
        <div className="mb-3 relative z-10">
          <div className="relative inline-block transition-all duration-300 ease-out">
            <div className="relative text-[#0174d7] transition-all duration-300 group-hover/card:scale-105 group-hover/card:translate-y-[-2px]">
              {getIconComponent(service)}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 
          className="text-lg font-semibold text-[#051600] mb-2 relative z-10"
        >
          <a
            href={`/services/${service.slug}`}
            className="text-[#051600] no-underline relative inline-block hover:text-[#0174d7] transition-colors"
          >
            {service.title}
          </a>
        </h3>
        
        {/* Description */}
        <p 
          className="text-xs text-[#6F756D] leading-relaxed mt-2 mb-4 flex-grow"
        >
          {service.short_description}
        </p>
        
        {/* Read More Link */}
        <button
          onClick={onReadMore}
          className="inline-flex items-center font-medium text-[11px] text-[#051600] hover:text-[#0174d7] transition-all duration-500 no-underline pb-0.5 relative group/button mt-auto z-10 bg-transparent border-none cursor-pointer overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0174d7]/10 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></span>
          
          <span className="relative z-10 flex items-center gap-2">
            Read More
            <i className="fas fa-long-arrow-right text-[10px] transition-all duration-500 group-hover/button:translate-x-2 group-hover/button:text-[#0174d7]" />
          </span>
          
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0174d7] transition-all duration-500 group-hover/card:w-full group-hover/card:delay-150"></span>
        </button>
      </div>
    </div>
  );
};

// Modal Component
const ServiceModal: React.FC<{ service: Service | null; onClose: () => void }> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Icon */}
          <div className="mb-4">
            <div className="text-[#0174d7]">
              {iconMap[service.icon_name || 'Code'] ? 
                React.createElement(iconMap[service.icon_name || 'Code'], { size: 40, strokeWidth: 1.5 }) : 
                <Code size={40} strokeWidth={1.5} />
              }
            </div>
          </div>

          {/* Title */}
          <h3 
            className="text-2xl font-semibold text-[#051600] mb-3"
          >
            {service.title}
          </h3>

          {/* Full Description */}
          <p 
            className="text-[#6F756D] leading-relaxed text-base"
          >
            {service.full_description}
          </p>
        </div>
      </div>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await servicesApi.getAll();
        const activeServices = response.filter(service => service.is_active);
        setServices(activeServices);
        
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIconComponent = (service: Service) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    if (service.icon_type === 'custom' && service.icon_url) {
      const fullUrl = service.icon_url.startsWith('http') 
        ? service.icon_url 
        : `${backendUrl}${service.icon_url.startsWith('/') ? '' : '/'}${service.icon_url}`;
      
      return (
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <img 
            src={fullUrl} 
            alt={service.title}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const IconComponent = iconMap[service.icon_name || 'Code'] || Code;
              return <IconComponent size={40} strokeWidth={1.5} />;
            }}
          />
        </div>
      );
    }
    
    const iconName = service.icon_name || 'Code';
    const IconComponent = iconMap[iconName] || Code;
    return <IconComponent size={40} strokeWidth={1.5} />;
  };

  if (loading) {
    return (
      <section
        id="service-sec"
        className="relative z-10 bg-[#F5F5F5] pt-6 sm:pt-8 pb-16 overflow-hidden min-h-[600px] flex items-center justify-center"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#0174d7] animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="service-sec"
        className="relative z-10 bg-[#F5F5F5] pt-6 sm:pt-8 pb-16 overflow-hidden"
      >
        {/* Background shape */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[-1] pointer-events-none">
          <img
            src="https://html.themehour.net/robor/demo/assets/img/shape/bg-shape1.png"
            alt="Background shape"
            className="max-w-full h-auto origin-bottom scale-98 hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {error && (
          <div className="container mx-auto max-w-[1488px] px-3 mb-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-[1488px] px-3">
          {/* Title section */}
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-8/12 xl:w-6/12">
              <div className="text-center relative z-10 mb-8 mt-0">
                {/* Shadow title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] w-max opacity-50 select-none">
                  <h2 
                    className="text-[200px] sm:text-[250px] lg:text-[150px] font-bold text-white leading-none m-0"
                  >
                    Services
                  </h2>
                </div>
                
                {/* Subtitle */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-6 h-0.5 bg-[#0174d7]"></div>
                  <span 
                    className="inline-block text-[#0174d7] text-xs sm:text-sm font-medium uppercase tracking-wide relative pb-1 animate-slideInUp"
                  >
                    <AnimatedText text="OUR" />
                    {' '}
                    <AnimatedText text="SERVICES" />
                  </span>
                  <div className="w-6 h-0.5 bg-[#0174d7]"></div>
                </div>
                
                {/* Main title */}
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#051600] mb-4 mt-[-0.4em] animate-slideInUp leading-tight"
                >
                  <AnimatedText text="Innovative" />{' '}
                  <AnimatedText text="IT" />{' '}
                  <AnimatedText text="Solutions" />{' '}
                  <AnimatedText text="for" />{' '}
                  <AnimatedText text="Business" />
                </h2>
              </div>
            </div>
          </div>

          {/* Services grid */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center -mx-3 -mt-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onReadMore={() => setSelectedService(service)}
                    getIconComponent={getIconComponent}
                  />
                ))
              ) : (
                <div className="w-full text-center py-12">
                  <p className="text-sm text-gray-600">No services available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <ServiceModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
      />
      
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Custom hover effects */
        .group-hover\\/card .fas.fa-long-arrow-right {
          transition: transform 0.3s ease;
        }

        /* Ensure smooth transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInUp {
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
          animation: slideInUp 0.6s ease forwards;
        }
      `}</style>
    </>
  );
};

export default ServicesSection;
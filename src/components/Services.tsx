/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from 'react';
// import { 
//   X,
//   Code, 
//   Cloud, 
//   Laptop, 
//   Palette, 
//   UserCircle, 
//   Shield, 
//   TrendingUp, 
//   Smartphone 
// } from 'lucide-react';

// // TypeScript interfaces
// interface Service {
//   id: number;
//   title: string;
//   description: string;
//   fullDescription: string;
//   icon: React.ReactNode;
//   animationDelay: string;
//   readMoreLink: string;
//   serviceLink: string;
// }

// interface AnimatedTextProps {
//   text: string;
//   className?: string;
// }

// // Move AnimatedText component outside to fix render error
// const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
//   return (
//     <span className={`inline-block ${className}`}>
//       {text.split('').map((letter, index) => (
//         <div key={index} className="inline-block">
//           {letter}
//         </div>
//       ))}
//     </span>
//   );
// };


// const ServiceCard: React.FC<{ service: Service; onReadMore: () => void }> = ({ service, onReadMore }) => {
//   return (
//     <div 
//       className="w-full lg:w-1/2 xl:w-1/4 px-3 mt-3 animate-slideInUp group/card"
//       style={{ animationDelay: service.animationDelay }}
//     >
//       <div className="bg-white rounded-2xl p-6 overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200 group-hover/card:-translate-y-1">
        
//         {/* Card hover effect - subtle lift and shadow */}
//         <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
//           <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-gray-50/30 to-transparent"></div>
//         </div>
        
//         {/* Icon with subtle hover effects */}
//         <div className="mb-4 relative z-10">
//           <div className="relative inline-block transition-all duration-300 ease-out">
//             {/* Icon subtle lift and shadow */}
//             <div className="relative text-[#0174d7] transition-all duration-300 group-hover/card:scale-105 group-hover/card:translate-y-[-2px]">
//               {React.cloneElement(service.icon as React.ReactElement, {
//               })}
//             </div>
//           </div>
//         </div>
        
//         {/* Title - no hover color change */}
//         <h3 
//           className="text-xl font-semibold text-[#051600] mb-2 relative z-10"
//           style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//         >
//           <a
//             href={service.serviceLink}
//             className="text-[#051600] no-underline relative inline-block"
//           >
//             {service.title}
//           </a>
//         </h3>
        
//         {/* Description - no hover effects */}
//         <p 
//           className="text-sm text-[#6F756D] leading-relaxed mt-2 mb-4 flex-grow"
//           style={{ fontFamily: '"DM Sans", sans-serif' }}
//         >
//           {service.description}
//         </p>
        
//         {/* Read More Link - subtle hover effect */}
//           <button
//           onClick={onReadMore}
//           className="inline-flex items-center font-medium text-xs text-[#051600] hover:text-[#0174d7] transition-all duration-500 no-underline pb-0.5 relative group/button mt-auto z-10 bg-transparent border-none cursor-pointer overflow-hidden"
//           style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//         >
//           {/* Animated background for button */}
//           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0174d7]/10 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></span>
          
//           <span className="relative z-10 flex items-center gap-2">
//             Read More
//             <i className="fas fa-long-arrow-right text-xs transition-all duration-500 group-hover/button:translate-x-2 group-hover/button:text-[#0174d7]" />
//           </span>
          
//           {/* Animated underline */}
//           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0174d7] transition-all duration-500 group-hover/card:w-full group-hover/card:delay-150"></span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Modal Component
// const ServiceModal: React.FC<{ service: Service | null; onClose: () => void }> = ({ service, onClose }) => {
//   if (!service) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
//         <div className="p-8 relative">
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>

//           {/* Icon - Using React Icon */}
//           <div className="mb-6">
//             <div className="text-[#0174d7]">
//               {service.icon}
//             </div>
//           </div>

//           {/* Title */}
//           <h3 
//             className="text-3xl font-semibold text-[#051600] mb-4"
//             style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//           >
//             {service.title}
//           </h3>

//           {/* Full Description */}
//           <p 
//             className="text-[#6F756D] leading-relaxed text-lg"
//             style={{ fontFamily: '"DM Sans", sans-serif' }}
//           >
//             {service.fullDescription}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ServicesSection: React.FC = () => {
//   const [selectedService, setSelectedService] = useState<Service | null>(null);

//   // Data for services - Updated with React Icons and smaller size
//   const services: Service[] = [
//     {
//       id: 1,
//       title: 'Web Development',
//       description: 'Custom websites and applications built with modern technologies.',
//       fullDescription: 'We create custom websites and web applications using the latest technologies like React, Next.js, and Node.js. Our team specializes in building responsive, fast, and user-friendly solutions that drive business growth. From e-commerce platforms to corporate websites, we deliver excellence in every project with a focus on performance, security, and scalability.',
//       icon: <Code size={48} strokeWidth={1.5} />,
//       animationDelay: '0ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 2,
//       title: 'Cloud Solutions',
//       description: 'Scalable cloud infrastructure and migration services.',
//       fullDescription: 'Transform your business with our comprehensive cloud solutions. We provide end-to-end cloud migration, infrastructure setup, and ongoing management services across AWS, Azure, and Google Cloud platforms. Our expertise ensures seamless transitions, cost optimization, enhanced security, and improved scalability for your business operations.',
//       icon: <Cloud size={48} strokeWidth={1.5} />,
//       animationDelay: '270ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 3,
//       title: 'Software Dev',
//       description: 'Custom software solutions for business needs.',
//       fullDescription: 'We develop custom software solutions tailored to your specific business requirements. Our agile development process ensures efficient delivery of enterprise applications, CRM systems, inventory management tools, and more. We use cutting-edge technologies and best practices to create software that scales with your business and delivers measurable results.',
//       icon: <Laptop size={48} strokeWidth={1.5} />,
//       animationDelay: '540ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 4,
//       title: 'UI/UX Design',
//       description: 'User-centered design for better engagement.',
//       fullDescription: 'Our UI/UX design services focus on creating intuitive and engaging user experiences. We conduct thorough user research, create wireframes and prototypes, and design beautiful interfaces that not only look great but also drive conversions. Every design decision is backed by data and user insights to ensure maximum impact and user satisfaction.',
//       icon: <Palette size={48} strokeWidth={1.5} />,
//       animationDelay: '810ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 5,
//       title: 'IT Consulting',
//       description: 'Expert technology advisory services.',
//       fullDescription: 'Our IT consulting services help businesses make informed technology decisions. We provide strategic guidance on digital transformation, technology stack selection, system architecture, and process optimization. Our consultants bring years of industry experience to help you leverage technology for competitive advantage and operational excellence.',
//       icon: <UserCircle size={48} strokeWidth={1.5} />,
//       animationDelay: '0ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 6,
//       title: 'Cybersecurity',
//       description: 'Security solutions and threat protection.',
//       fullDescription: 'Protect your business from cyber threats with our comprehensive cybersecurity services. We offer vulnerability assessments, penetration testing, security audits, and 24/7 monitoring. Our team implements robust security measures including firewalls, encryption, and access controls to safeguard your data and systems from evolving threats.',
//       icon: <Shield size={48} strokeWidth={1.5} />,
//       animationDelay: '270ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 7,
//       title: 'Data Analytics',
//       description: 'Actionable insights from business data.',
//       fullDescription: 'Turn your data into actionable insights with our analytics services. We help you collect, process, and analyze large datasets to uncover patterns and trends. Our solutions include business intelligence dashboards, predictive analytics, and machine learning models that empower data-driven decision making and drive business growth.',
//       icon: <TrendingUp size={48} strokeWidth={1.5} />,
//       animationDelay: '540ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     },
//     {
//       id: 8,
//       title: 'Mobile Apps',
//       description: 'Native and cross-platform mobile applications.',
//       fullDescription: 'We build powerful mobile applications for iOS and Android platforms. Whether you need a native app for maximum performance or a cross-platform solution for broader reach, our team delivers high-quality mobile experiences. From concept to launch and beyond, we ensure your app meets user expectations and business objectives.',
//       icon: <Smartphone size={48} strokeWidth={1.5} />,
//       animationDelay: '810ms',
//       readMoreLink: '#',
//       serviceLink: '#'
//     }
//   ];

//   return (
//     <>
//       <section
//         id="service-sec"
//         className="relative z-10 bg-[#F5F5F5] pt-6 sm:pt-8 pb-16 overflow-hidden"
//       >
//         {/* Background shape */}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[-1] pointer-events-none">
//           <img
//             src="https://html.themehour.net/robor/demo/assets/img/shape/bg-shape1.png"
//             alt="Background shape"
//             className="max-w-full h-auto origin-bottom scale-98 hover:scale-105 transition-transform duration-300"
//           />
//         </div>

//         <div className="container mx-auto max-w-[1488px] px-3">
//           {/* Title section */}
//           <div className="flex flex-wrap justify-center">
//             <div className="w-full lg:w-8/12 xl:w-6/12">
//               <div className="text-center relative z-10 mb-10 mt-0">
//                 {/* Shadow title */}
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] w-max opacity-50 select-none">
//                   <h2 
//                     className="text-[300px] font-bold text-white leading-none m-0"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     Services
//                   </h2>
//                 </div>
                
//                 {/* Subtitle - OUR SERVICES with blue color and line */}
//                 <div className="flex items-center justify-center space-x-2 mb-5">
//                   <div className="w-8 h-0.5 bg-[#0174d7]"></div>
//                   <span 
//                     className="inline-block text-[#0174d7] text-base font-medium uppercase tracking-wide relative pb-1 animate-slideInUp"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     <AnimatedText text="OUR" />
//                     {' '}
//                     <AnimatedText text="SERVICES" />
//                   </span>
//                   <div className="w-8 h-0.5 bg-[#0174d7]"></div>
//                 </div>
                
//                 {/* Main title */}
//                 <h2 
//                   className="text-3xl md:text-5xl font-bold text-[#051600] mb-4 mt-[-0.4em] animate-slideInUp leading-tight"
//                   style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                 >
//                   <AnimatedText text="Innovative" />{' '}
//                   <AnimatedText text="IT" />{' '}
//                   <AnimatedText text="Solutions" />{' '}
//                   <AnimatedText text="for" />{' '}
//                   <AnimatedText text="Business" />
//                 </h2>
//               </div>
//             </div>
//           </div>

//           {/* Services grid - Added container for better control */}
//           <div className="max-w-6xl mx-auto">
//             <div className="flex flex-wrap justify-center -mx-3 -mt-3">
//               {services.map((service) => (
//                 <ServiceCard 
//                   key={service.id} 
//                   service={service} 
//                   onReadMore={() => setSelectedService(service)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modal */}
//       <ServiceModal 
//         service={selectedService} 
//         onClose={() => setSelectedService(null)} 
//       />
//       <style>{`
//   @keyframes shimmer {
//     0% {
//       transform: translateX(-100%);
//     }
//     100% {
//       transform: translateX(100%);
//     }
//   }

//   .animate-shimmer {
//     animation: shimmer 2s infinite;
//   }

//   /* Custom hover effects */
//   .group-hover\\/card .fas.fa-long-arrow-right {
//     transition: transform 0.3s ease;
//   }

//   /* Ensure smooth transitions */
//   * {
//     transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
//   }
// `}</style>
//     </>
//   );
// };

// export default ServicesSection;
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
import api from '../services/authService';
import type { ApiResponse } from '../types/auth.types';

// TypeScript interfaces
interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  icon_type: 'lucide' | 'custom';
  icon_name: string | null;
  icon_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  slug: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

interface AnimatedTextProps {
  text: string;
  className?: string;
}

// Move AnimatedText component outside to fix render error
const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((letter, index) => (
        <div key={index} className="inline-block">
          {letter}
        </div>
      ))}
    </span>
  );
};

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Code, Cloud, Laptop, Palette, UserCircle, Shield, TrendingUp, Smartphone,
  Server, Database, Globe, MessageCircle, Mail, Phone, Users, Briefcase,
  Target, Rocket, Zap, Heart, StarIcon, ThumbsUp, Award
};

// Fallback icons array in case API fails
const fallbackServices: Service[] = [
  {
    id: 1,
    title: 'Web Development',
    short_description: 'Custom websites and applications built with modern technologies.',
    full_description: 'We create custom websites and web applications using the latest technologies like React, Next.js, and Node.js. Our team specializes in building responsive, fast, and user-friendly solutions that drive business growth. From e-commerce platforms to corporate websites, we deliver excellence in every project with a focus on performance, security, and scalability.',
    icon_type: 'lucide',
    icon_name: 'Code',
    icon_url: null,
    display_order: 1,
    is_featured: true,
    is_active: true,
    slug: 'web-development',
    meta_title: 'Web Development Services',
    meta_description: 'Custom web development services using modern technologies',
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    title: 'Cloud Solutions',
    short_description: 'Scalable cloud infrastructure and migration services.',
    full_description: 'Transform your business with our comprehensive cloud solutions. We provide end-to-end cloud migration, infrastructure setup, and ongoing management services across AWS, Azure, and Google Cloud platforms. Our expertise ensures seamless transitions, cost optimization, enhanced security, and improved scalability for your business operations.',
    icon_type: 'lucide',
    icon_name: 'Cloud',
    icon_url: null,
    display_order: 2,
    is_featured: true,
    is_active: true,
    slug: 'cloud-solutions',
    meta_title: 'Cloud Solutions Services',
    meta_description: 'Scalable cloud infrastructure and migration services',
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    title: 'Software Development',
    short_description: 'Custom software solutions for business needs.',
    full_description: 'We develop custom software solutions tailored to your specific business requirements. Our agile development process ensures efficient delivery of enterprise applications, CRM systems, inventory management tools, and more. We use cutting-edge technologies and best practices to create software that scales with your business and delivers measurable results.',
    icon_type: 'lucide',
    icon_name: 'Laptop',
    icon_url: null,
    display_order: 3,
    is_featured: true,
    is_active: true,
    slug: 'software-development',
    meta_title: 'Software Development Services',
    meta_description: 'Custom software solutions for business needs',
    created_at: '',
    updated_at: ''
  },
  {
    id: 4,
    title: 'UI/UX Design',
    short_description: 'User-centered design for better engagement.',
    full_description: 'Our UI/UX design services focus on creating intuitive and engaging user experiences. We conduct thorough user research, create wireframes and prototypes, and design beautiful interfaces that not only look great but also drive conversions. Every design decision is backed by data and user insights to ensure maximum impact and user satisfaction.',
    icon_type: 'lucide',
    icon_name: 'Palette',
    icon_url: null,
    display_order: 4,
    is_featured: true,
    is_active: true,
    slug: 'ui-ux-design',
    meta_title: 'UI/UX Design Services',
    meta_description: 'User-centered design for better engagement',
    created_at: '',
    updated_at: ''
  },
  {
    id: 5,
    title: 'IT Consulting',
    short_description: 'Expert technology advisory services.',
    full_description: 'Our IT consulting services help businesses make informed technology decisions. We provide strategic guidance on digital transformation, technology stack selection, system architecture, and process optimization. Our consultants bring years of industry experience to help you leverage technology for competitive advantage and operational excellence.',
    icon_type: 'lucide',
    icon_name: 'UserCircle',
    icon_url: null,
    display_order: 5,
    is_featured: true,
    is_active: true,
    slug: 'it-consulting',
    meta_title: 'IT Consulting Services',
    meta_description: 'Expert technology advisory services',
    created_at: '',
    updated_at: ''
  },
  {
    id: 6,
    title: 'Cybersecurity',
    short_description: 'Security solutions and threat protection.',
    full_description: 'Protect your business from cyber threats with our comprehensive cybersecurity services. We offer vulnerability assessments, penetration testing, security audits, and 24/7 monitoring. Our team implements robust security measures including firewalls, encryption, and access controls to safeguard your data and systems from evolving threats.',
    icon_type: 'lucide',
    icon_name: 'Shield',
    icon_url: null,
    display_order: 6,
    is_featured: true,
    is_active: true,
    slug: 'cybersecurity',
    meta_title: 'Cybersecurity Services',
    meta_description: 'Security solutions and threat protection',
    created_at: '',
    updated_at: ''
  },
  {
    id: 7,
    title: 'Data Analytics',
    short_description: 'Actionable insights from business data.',
    full_description: 'Turn your data into actionable insights with our analytics services. We help you collect, process, and analyze large datasets to uncover patterns and trends. Our solutions include business intelligence dashboards, predictive analytics, and machine learning models that empower data-driven decision making and drive business growth.',
    icon_type: 'lucide',
    icon_name: 'TrendingUp',
    icon_url: null,
    display_order: 7,
    is_featured: true,
    is_active: true,
    slug: 'data-analytics',
    meta_title: 'Data Analytics Services',
    meta_description: 'Actionable insights from business data',
    created_at: '',
    updated_at: ''
  },
  {
    id: 8,
    title: 'Mobile Apps',
    short_description: 'Native and cross-platform mobile applications.',
    full_description: 'We build powerful mobile applications for iOS and Android platforms. Whether you need a native app for maximum performance or a cross-platform solution for broader reach, our team delivers high-quality mobile experiences. From concept to launch and beyond, we ensure your app meets user expectations and business objectives.',
    icon_type: 'lucide',
    icon_name: 'Smartphone',
    icon_url: null,
    display_order: 8,
    is_featured: true,
    is_active: true,
    slug: 'mobile-apps',
    meta_title: 'Mobile App Development',
    meta_description: 'Native and cross-platform mobile applications',
    created_at: '',
    updated_at: ''
  }
];

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
      <div className="bg-white rounded-2xl p-6 overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-200 group-hover/card:-translate-y-1">
        
        {/* Card hover effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-gray-50/30 to-transparent"></div>
        </div>
        
        {/* Icon */}
        <div className="mb-4 relative z-10">
          <div className="relative inline-block transition-all duration-300 ease-out">
            <div className="relative text-[#0174d7] transition-all duration-300 group-hover/card:scale-105 group-hover/card:translate-y-[-2px]">
              {getIconComponent(service)}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 
          className="text-xl font-semibold text-[#051600] mb-2 relative z-10"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
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
          className="text-sm text-[#6F756D] leading-relaxed mt-2 mb-4 flex-grow"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {service.short_description}
        </p>
        
        {/* Read More Link */}
        <button
          onClick={onReadMore}
          className="inline-flex items-center font-medium text-xs text-[#051600] hover:text-[#0174d7] transition-all duration-500 no-underline pb-0.5 relative group/button mt-auto z-10 bg-transparent border-none cursor-pointer overflow-hidden"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0174d7]/10 to-transparent translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000"></span>
          
          <span className="relative z-10 flex items-center gap-2">
            Read More
            <i className="fas fa-long-arrow-right text-xs transition-all duration-500 group-hover/button:translate-x-2 group-hover/button:text-[#0174d7]" />
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
        <div className="p-8 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Icon */}
          <div className="mb-6">
            <div className="text-[#0174d7]">
              {iconMap[service.icon_name || 'Code'] ? 
                React.createElement(iconMap[service.icon_name || 'Code'], { size: 48, strokeWidth: 1.5 }) : 
                <Code size={48} strokeWidth={1.5} />
              }
            </div>
          </div>

          {/* Title */}
          <h3 
            className="text-3xl font-semibold text-[#051600] mb-4"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            {service.title}
          </h3>

          {/* Full Description */}
          <p 
            className="text-[#6F756D] leading-relaxed text-lg"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
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
        console.log('🔍 Fetching services from API...');
        
        const response = await api.get<ApiResponse<Service[]>>('/services');
        
        if (response.data.success && response.data.data) {
          console.log('✅ Services fetched successfully:', response.data.data.length);
          
          // Filter active services and sort by display order
          const activeServices = response.data.data
            .filter((service: { is_active: any; }) => service.is_active)
            .sort((a: { display_order: number; }, b: { display_order: number; }) => a.display_order - b.display_order);
          
          setServices(activeServices);
        } else {
          console.warn('⚠️ Using fallback services - API response invalid');
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error('❌ Error fetching services:', err);
        setError('Failed to load services. Showing demo services.');
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get icon component with fallback
  const getIconComponent = (service: Service) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    if (service.icon_type === 'custom' && service.icon_url) {
      const fullUrl = service.icon_url.startsWith('http') 
        ? service.icon_url 
        : `${backendUrl}${service.icon_url.startsWith('/') ? '' : '/'}${service.icon_url}`;
      
      return (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <img 
            src={fullUrl} 
            alt={service.title}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              console.error(`❌ Error loading custom icon for ${service.title}`);
              e.currentTarget.style.display = 'none';
              // Show fallback Lucide icon
              const IconComponent = iconMap[service.icon_name || 'Code'] || Code;
              return <IconComponent size={48} strokeWidth={1.5} />;
            }}
          />
        </div>
      );
    }
    
    // Use Lucide icon
    const iconName = service.icon_name || 'Code';
    const IconComponent = iconMap[iconName] || Code;
    
    return <IconComponent size={48} strokeWidth={1.5} />;
  };

  if (loading) {
    return (
      <section
        id="service-sec"
        className="relative z-10 bg-[#F5F5F5] pt-6 sm:pt-8 pb-16 overflow-hidden min-h-[600px] flex items-center justify-center"
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  if (error && services.length === 0) {
    return (
      <section
        id="service-sec"
        className="relative z-10 bg-[#F5F5F5] pt-6 sm:pt-8 pb-16 overflow-hidden"
      >
        <div className="container mx-auto max-w-[1488px] px-3 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading Services
          </button>
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
              <div className="text-center relative z-10 mb-10 mt-0">
                {/* Shadow title */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] w-max opacity-50 select-none">
                  <h2 
                    className="text-[300px] font-bold text-white leading-none m-0"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Services
                  </h2>
                </div>
                
                {/* Subtitle */}
                <div className="flex items-center justify-center space-x-2 mb-5">
                  <div className="w-8 h-0.5 bg-[#0174d7]"></div>
                  <span 
                    className="inline-block text-[#0174d7] text-base font-medium uppercase tracking-wide relative pb-1 animate-slideInUp"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    <AnimatedText text="OUR" />
                    {' '}
                    <AnimatedText text="SERVICES" />
                  </span>
                  <div className="w-8 h-0.5 bg-[#0174d7]"></div>
                </div>
                
                {/* Main title */}
                <h2 
                  className="text-3xl md:text-5xl font-bold text-[#051600] mb-4 mt-[-0.4em] animate-slideInUp leading-tight"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
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
                  <p className="text-gray-600">No services available at the moment.</p>
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
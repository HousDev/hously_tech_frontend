/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import logo from "../assets/images/footer-logo1.png";
// import { useNavigate } from "react-router-dom";



// import {
//   FaFacebookF,
//   FaTwitter,
//   FaLinkedinIn,
//   FaInstagram,
//   FaYoutube,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaArrowRight,
//   FaPhoneAlt,
// } from "react-icons/fa";

// // Define ScrollLink component outside of Footer
// interface ScrollLinkProps {
//   to: string;
//   children: React.ReactNode;
//   className?: string;
//   style?: React.CSSProperties;
// }

// const ScrollLink: React.FC<ScrollLinkProps> = ({
//   to,
//   children,
//   className = "",
//   style,
// }) => {
//   const navigate = useNavigate();

//   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();

//     // Navigate to the new page
//     navigate(to);

//     // Scroll to top after a small delay to ensure navigation happens first
//     setTimeout(() => {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: "smooth",
//       });
//     }, 10);
//   };

//   return (
//     <a href={to} className={className} style={style} onClick={handleClick}>
//       {children}
//     </a>
//   );
// };

// const Footer: React.FC = () => {
//   // Function to handle link clicks with scroll to top (for inline use)
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* Desktop Footer (hidden on mobile) */}
//       <div className="hidden lg:block">
//         {/* Footer Widget Area */}
//         <div className="relative overflow-hidden max-w-[1820px] mx-auto ">
//           {/* Background Layers */}
//           <div className="absolute inset-0  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />

//           {/* Content */}
//           <div className="relative z-10 pt-[20px] pb-[20px] px-6">
//             <div className="container mx-auto max-w-[1488px]">
//               <div className="flex flex-wrap justify-between -mx-3">
//                 {/* Column 1: Company Info */}
//                 <div className="w-full md:w-auto px-3 pl-[20px] mb-10 md:mb-0 animate-slideInUp">
//                   <div className="max-w-[283px]">
//                     {/* Logo */}
//                     <div className="flex items-center mb-8">
//                       <div className="flex items-center">
//                         <img
//                           src={logo}
//                           alt="Hously Logo"
//                           className="h-25 w-auto transform hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                     </div>

//                     {/* Description */}
//                     <p
//                       className="text-gray-300 leading-relaxed mb-8"
//                       style={{ fontFamily: '"DM Sans", sans-serif' }}
//                     >
//                       Leading provider of comprehensive IT solutions including
//                       web development, AI integration, cloud services, and
//                       digital transformation for businesses worldwide.
//                     </p>

//                     {/* Social Links with React Icons */}
//                     <div className="flex gap-3">
//                       <a
//                         href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
//                         title="Follow us on Facebook"
//                       >
//                         <FaFacebookF className="text-base" />
//                       </a>
//                       <a
//                         href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
//                         title="Follow us on Instagram"
//                       >
//                         <FaInstagram className="text-base" />
//                       </a>
//                       <a
//                         href="https://www.linkedin.com/company/houlsy-finntech-realty/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
//                         title="Follow us on LinkedIn"
//                       >
//                         <FaLinkedinIn className="text-base" />
//                       </a>
//                       <a
//                         href="#"
//                         className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
//                         title="Follow us on Twitter"
//                       >
//                         <FaTwitter className="text-base" />
//                       </a>
//                       <a
//                         href="#"
//                         className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
//                         title="Follow us on YouTube"
//                       >
//                         <FaYoutube className="text-base" />
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Column 2: Useful Links */}
//                 <div
//                   className="w-full sm:w-auto px-3 mb-10 sm:mb-0 animate-slideInUp"
//                   style={{ animationDelay: "270ms" }}
//                 >
//                   <h3
//                     className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     Useful Links
//                   </h3>

//                   <ul className="space-y-3">
//                     <li>
//                       <ScrollLink
//                         to="/"
//                         className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         Home
//                       </ScrollLink>
//                     </li>

//                     <li>
//                       <ScrollLink
//                         to="/services"
//                         className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         Services
//                       </ScrollLink>
//                     </li>

//                     <li>
//                       <ScrollLink
//                         to="/about"
//                         className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         About Us
//                       </ScrollLink>
//                     </li>

//                     <li>
//                       <ScrollLink
//                         to="/contact"
//                         className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         Contact
//                       </ScrollLink>
//                     </li>

//                     <li>
//                       <ScrollLink
//                         to="/career"
//                         className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         Career
//                       </ScrollLink>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Column 3: Company */}
//                 <div
//                   className="w-full sm:w-auto px-3 mb-10 sm:mb-0 animate-slideInUp"
//                   style={{ animationDelay: "540ms" }}
//                 >
//                   <h3
//                     className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     Company
//                   </h3>
//                   <ul className="space-y-3">
//                     {[
//                       "About Company",
//                       "Our Team",
//                       "Careers",
//                       "Partners",
//                       "Press & Media",
//                       "Investor Relations",
//                     ].map((item) => (
//                       <li key={item}>
//                         <a
//                           href="#"
//                           className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                           style={{ fontFamily: '"DM Sans", sans-serif' }}
//                         >
//                           {item}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Column 4: Services */}
//                 <div
//                   className="w-full md:w-auto px-3 mb-10 md:mb-0 animate-slideInUp"
//                   style={{ animationDelay: "810ms" }}
//                 >
//                   <h3
//                     className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     Our Services
//                   </h3>
//                   <ul className="space-y-3">
//                     {[
//                       "Web Development",
//                       "AI & Chatbot Development",
//                       "Cloud & DevOps",
//                       "Software Development",
//                       "IT Consulting",
//                     ].map((service) => (
//                       <li key={service}>
//                         <a
//                           href="#"
//                           className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
//                           style={{ fontFamily: '"DM Sans", sans-serif' }}
//                         >
//                           {service}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Column 5: Contact/Download */}
//                 <div
//                   className="w-full md:w-auto px-3 animate-slideInUp"
//                   style={{ animationDelay: "1080ms" }}
//                 >
//                   <h3
//                     className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
//                     style={{ fontFamily: '"Space Grotesk", sans-serif' }}
//                   >
//                     Contact Us
//                   </h3>

//                   {/* Contact Info with React Icons */}
//                   <div className="mb-8 space-y-4">
//                     <div className="flex items-start gap-3 mb-4">
//                       <FaMapMarkerAlt className="text-[#fed700] mt-1 flex-shrink-0" />
//                       <p
//                         className="text-gray-300"
//                         style={{ fontFamily: '"DM Sans", sans-serif' }}
//                       >
//                         First Floor,Tamara Uprise Rahatani,
//                         <br />
//                         Pune, 411017
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-3 mb-4">
//                       <FaPhoneAlt className="text-[#fed700] flex-shrink-0" />
//                       <a
//                         href="tel:+919371009381"
//                         className="text-gray-300 hover:text-white transition-colors"
//                       >
//                         +91 9371 00 9381
//                       </a>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <FaEnvelope className="text-[#fed700] flex-shrink-0" />
//                       <a
//                         href="mailto:info@hously.in"
//                         className="text-gray-300 hover:text-white transition-colors"
//                       >
//                         info@hously.in
//                       </a>
//                     </div>
//                   </div>

//                   {/* Newsletter */}
//                   <div className="max-w-[250px]">
//                     <p
//                       className="text-gray-300 mb-4 text-sm"
//                       style={{ fontFamily: '"DM Sans", sans-serif' }}
//                     >
//                       Subscribe to our newsletter
//                     </p>

//                     <div className="flex items-center gap-2">
//                       {/* Input Field */}
//                       <input
//                         type="email"
//                         placeholder="Enter your email"
//                         className="w-full h-[45px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
//                       />

//                       {/* Arrow Button */}
//                       <button className="w-[45px] h-[45px] bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
//                         <FaArrowRight className="text-sm text-white" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Footer (visible only on mobile) - 2 Column Grid */}
//       <div className="block lg:hidden">
//         <div className="bg-gradient-to-br from-gray-900 via-blue-900/80 to-gray-900">
//           <div className="px-3 py-4">
//             {/* Mobile Logo and Company Info */}
//             <div className="mb-5 text-center">
//               <div className="flex items-center mb-2 justify-start sm:justify-start">
//                 <div className="flex items-center">
//                   <img
//                     src={logo}
//                     alt="Hously Logo final"
//                     className="h-23 w-auto transform hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//               </div>

//               <p className="text-gray-300 text-sm mb-2 text-left sm:text-center">
//                 Leading provider of comprehensive IT solutions including web
//                 development, AI integration, cloud services, and digital
//                 transformation.
//               </p>

//               {/* Mobile Social Links with React Icons */}
//               <div className="flex justify-start gap-3 mb-2">
//                 <a
//                   href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
//                 >
//                   <FaFacebookF className="text-sm" />
//                 </a>
//                 <a
//                   href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
//                 >
//                   <FaInstagram className="text-sm" />
//                 </a>
//                 <a
//                   href="https://www.linkedin.com/company/houlsy-finntech-realty/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
//                 >
//                   <FaLinkedinIn className="text-sm" />
//                 </a>
//                 <a
//                   href="#"
//                   className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
//                 >
//                   <FaTwitter className="text-sm" />
//                 </a>
//                 <a
//                   href="#"
//                   className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
//                 >
//                   <FaYoutube className="text-sm" />
//                 </a>
//               </div>
//             </div>

//             {/* 2 Column Grid for Mobile */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               {/* Column 1: Useful Links */}
//               <div>
//                 <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
//                   Useful Links
//                 </h3>
//                 <ul className="space-y-2">
//                   <li>
//                     <ScrollLink
//                       to="/"
//                       className="text-gray-300 hover:text-white text-sm transition-colors"
//                     >
//                       Home
//                     </ScrollLink>
//                   </li>
//                   <li>
//                     <ScrollLink
//                       to="/services"
//                       className="text-gray-300 hover:text-white text-sm transition-colors"
//                     >
//                       Services
//                     </ScrollLink>
//                   </li>
//                   <li>
//                     <ScrollLink
//                       to="/about"
//                       className="text-gray-300 hover:text-white text-sm transition-colors"
//                     >
//                       About Us
//                     </ScrollLink>
//                   </li>
//                   <li>
//                     <ScrollLink
//                       to="/contact"
//                       className="text-gray-300 hover:text-white text-sm transition-colors"
//                     >
//                       Contact
//                     </ScrollLink>
//                   </li>
//                   <li>
//                     <ScrollLink
//                       to="/career"
//                       className="text-gray-300 hover:text-white text-sm transition-colors"
//                     >
//                       Career
//                     </ScrollLink>
//                   </li>
//                 </ul>
//               </div>

//               {/* Column 2: Company */}
//               <div>
//                 <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
//                   Company
//                 </h3>
//                 <ul className="space-y-2">
//                   {["About Company", "Our Team", "Careers", "Partners"].map(
//                     (item) => (
//                       <li key={item}>
//                         <a
//                           href="#"
//                           className="text-gray-300 hover:text-white text-sm transition-colors"
//                         >
//                           {item}
//                         </a>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>

//               {/* Column 3: Services */}
//               <div>
//                 <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
//                   Our Services
//                 </h3>
//                 <ul className="space-y-2">
//                   {[
//                     "Web Development",
//                     "AI & Chatbot",
//                     "Cloud & DevOps",
//                     "Software Dev",
//                     "IT Consulting",
//                   ].map((service) => (
//                     <li key={service}>
//                       <a
//                         href="#"
//                         className="text-gray-300 hover:text-white text-sm transition-colors"
//                       >
//                         {service}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Column 4: Contact Us */}
//               <div>
//                 <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
//                   Contact Us
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex items-start gap-2">
//                     <FaMapMarkerAlt className="text-[#fed700] mt-1 text-xs flex-shrink-0" />
//                     <p
//                       className="text-gray-300 text-xs"
//                       style={{ fontFamily: '"DM Sans", sans-serif' }}
//                     >
//                       First Floor,Tamara Uprise,
//                       <br />
//                       Pune, 411017
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3 mb-4">
//                     <FaPhoneAlt className="text-[#fed700] flex-shrink-0" />
//                     <a
//                       href="tel:+919371009381"
//                       className="text-gray-300 hover:text-white transition-colors"
//                     >
//                       +91 9371 00 9381
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FaEnvelope className="text-[#fed700] text-xs flex-shrink-0" />
//                     <a
//                       href="mailto:info@hously.in"
//                       className="text-gray-300 hover:text-white text-xs"
//                     >
//                       info@hously.in
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Newsletter */}
//             <div className="mb-8">
//               <h3 className="text-white text-lg font-bold mb-4">
//                 Subscribe to our Newsletter
//               </h3>

//               <div className="flex items-center gap-2">
//                 {/* Input */}
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="w-full h-[45px] bg-white/10 border border-white/20 rounded-full px-4 text-white placeholder-gray-400 text-sm focus:outline-none"
//                 />

//                 {/* Arrow Button */}
//                 <button className="w-[45px] h-[45px] bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
//                   <FaArrowRight className="text-sm text-white" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer - Both Desktop & Mobile */}
//       <footer className="bg-gray-900 py-4">
//         <div className="w-full flex flex-col sm:flex-row items-center sm:items-center sm:justify-between">
//           {/* Left corner © text (heading/text added, no CSS change) */}
//           <p className="text-gray-400 text-xs sm:text-sm text-left pl-2">
//             © {new Date().getFullYear()} <span>Hously Finntech Realty</span>.
//             All rights reserved.
//           </p>

//           {/* Right corner links (only links added) */}
//           <div className="flex gap-4 text-xs sm:text-sm pr-2">
//             <a
//               href="/privacy-policy"
//     onClick={(e) => {
//       e.preventDefault();
//       navigate('/privacy-policy', { state: { fromWelcome: false } });
//     }}
//     className="text-gray-400 hover:text-white transition"
//   >
//     Privacy Policy
//   </a>
//             <a
//               href="/terms-of-service"
//     onClick={(e) => {
//       e.preventDefault();
//       navigate('/terms-of-service', { state: { fromWelcome: false } });
//     }}
//     className="text-gray-400 hover:text-white transition"
//   >
//     Terms of Service
//   </a>
//             <a
//              href="/cookie-policy"
//     onClick={(e) => {
//       e.preventDefault();
//       navigate('/cookie-policy', { state: { fromWelcome: false } });
//     }}
//     className="text-gray-400 hover:text-white transition"
//   >
//     Cookie Policy
//   </a>
//           </div>
//         </div>
//       </footer>

//       {/* Global Styles */}
//       <style>{`
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-slideInUp {
//           animation: slideInUp 0.9s ease forwards;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Footer;



// components/Footer.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaArrowRight,
  FaPhoneAlt,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define ScrollLink component outside of Footer
interface ScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({
  to,
  children,
  className = "",
  style,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Navigate to the new page
    navigate(to);

    // Scroll to top after a small delay to ensure navigation happens first
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 10);
  };

  return (
    <a href={to} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
};

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [footerLogo, setFooterLogo] = useState<string>("/images/footer-logo1.png");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch footer logo from API
  useEffect(() => {
    fetchFooterLogo();
  }, []);

  const fetchFooterLogo = async () => {
    try {
      console.log('🔄 Fetching footer logo...');
      
      const response = await axios.get(`${API_BASE_URL}/settings/logos`);
      
      console.log('📥 Footer logo response:', response.data);
      
      if (response.data.success) {
        const logoData = response.data.data;
        
        // Set the footer logo if available, otherwise use default
        if (logoData.footerLogo) {
          // Add cache busting query parameter to avoid cached images
          const timestamp = new Date().getTime();
          const logoUrl = logoData.footerLogo.includes('?') 
            ? `${logoData.footerLogo}&t=${timestamp}`
            : `${logoData.footerLogo}?t=${timestamp}`;
          
          setFooterLogo(logoUrl);
          console.log('✅ Footer logo set:', logoUrl);
        } else {
          // Use default logo with cache busting
          const timestamp = new Date().getTime();
          setFooterLogo(`/images/footer-logo1.png?t=${timestamp}`);
          console.log('⚠️ Using default footer logo');
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch footer logo:', error);
      
      // Use default logo with cache busting on error
      const timestamp = new Date().getTime();
      setFooterLogo(`/images/footer-logo1.png?t=${timestamp}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Footer logo failed to load, using default');
    const target = e.currentTarget;
    
    // Try loading with cache busting
    const timestamp = new Date().getTime();
    
    // If the current src is not the default one, try loading the default
    if (!target.src.includes('/images/footer-logo1.png')) {
      target.src = `/images/footer-logo1.png?t=${timestamp}`;
    } else {
      // If default also fails, try without cache busting
      if (target.src.includes('?')) {
        target.src = target.src.split('?')[0];
      }
    }
  };

  return (
    <>
      {/* Desktop Footer (hidden on mobile) */}
      <div className="hidden lg:block">
        {/* Footer Widget Area */}
        <div className="relative overflow-hidden max-w-[1820px] mx-auto ">
          {/* Background Layers */}
          <div className="absolute inset-0  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />

          {/* Content */}
          <div className="relative z-10 pt-[20px] pb-[20px] px-6">
            <div className="container mx-auto max-w-[1488px]">
              <div className="flex flex-wrap justify-between -mx-3">
                {/* Column 1: Company Info */}
                <div className="w-full md:w-auto px-3 pl-[20px] mb-10 md:mb-0 animate-slideInUp">
                  <div className="max-w-[283px]">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                      <div className="flex items-center">
                        {loading ? (
                          <div className="h-25 w-48 bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                          <img
                            src={footerLogo}
                            alt="Hously Footer Logo"
                            className="h-25 w-auto transform hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className="text-gray-300 leading-relaxed mb-8"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Leading provider of comprehensive IT solutions including
                      web development, AI integration, cloud services, and
                      digital transformation for businesses worldwide.
                    </p>

                    {/* Social Links with React Icons */}
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                        title="Follow us on Facebook"
                      >
                        <FaFacebookF className="text-base" />
                      </a>
                      <a
                        href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                        title="Follow us on Instagram"
                      >
                        <FaInstagram className="text-base" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/houlsy-finntech-realty/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                        title="Follow us on LinkedIn"
                      >
                        <FaLinkedinIn className="text-base" />
                      </a>
                      <a
                        href="#"
                        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                        title="Follow us on Twitter"
                      >
                        <FaTwitter className="text-base" />
                      </a>
                      <a
                        href="#"
                        className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                        title="Follow us on YouTube"
                      >
                        <FaYoutube className="text-base" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Useful Links */}
                <div
                  className="w-full sm:w-auto px-3 mb-10 sm:mb-0 animate-slideInUp"
                  style={{ animationDelay: "270ms" }}
                >
                  <h3
                    className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Useful Links
                  </h3>

                  <ul className="space-y-3">
                    <li>
                      <ScrollLink
                        to="/"
                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Home
                      </ScrollLink>
                    </li>

                    <li>
                      <ScrollLink
                        to="/services"
                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Services
                      </ScrollLink>
                    </li>

                    <li>
                      <ScrollLink
                        to="/about"
                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        About Us
                      </ScrollLink>
                    </li>

                    <li>
                      <ScrollLink
                        to="/contact"
                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Contact
                      </ScrollLink>
                    </li>

                    <li>
                      <ScrollLink
                        to="/career"
                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Career
                      </ScrollLink>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Company */}
                <div
                  className="w-full sm:w-auto px-3 mb-10 sm:mb-0 animate-slideInUp"
                  style={{ animationDelay: "540ms" }}
                >
                  <h3
                    className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "About Company",
                      "Our Team",
                      "Careers",
                      "Partners",
                      "Press & Media",
                      "Investor Relations",
                    ].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: Services */}
                <div
                  className="w-full md:w-auto px-3 mb-10 md:mb-0 animate-slideInUp"
                  style={{ animationDelay: "810ms" }}
                >
                  <h3
                    className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Our Services
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Web Development",
                      "AI & Chatbot Development",
                      "Cloud & DevOps",
                      "Software Development",
                      "IT Consulting",
                    ].map((service) => (
                      <li key={service}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {service}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 5: Contact/Download */}
                <div
                  className="w-full md:w-auto px-3 animate-slideInUp"
                  style={{ animationDelay: "1080ms" }}
                >
                  <h3
                    className="text-white text-2xl font-bold mb-10 pb-4 relative after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Contact Us
                  </h3>

                  {/* Contact Info with React Icons */}
                  <div className="mb-8 space-y-4">
                    <div className="flex items-start gap-3 mb-4">
                      <FaMapMarkerAlt className="text-[#fed700] mt-1 flex-shrink-0" />
                      <p
                        className="text-gray-300"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        First Floor,Tamara Uprise Rahatani,
                        <br />
                        Pune, 411017
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <FaPhoneAlt className="text-[#fed700] flex-shrink-0" />
                      <a
                        href="tel:+919371009381"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        +91 9371 00 9381
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#fed700] flex-shrink-0" />
                      <a
                        href="mailto:info@hously.in"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        info@hously.in
                      </a>
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div className="max-w-[250px]">
                    <p
                      className="text-gray-300 mb-4 text-sm"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Subscribe to our newsletter
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Input Field */}
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-[45px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      />

                      {/* Arrow Button */}
                      <button className="w-[45px] h-[45px] bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
                        <FaArrowRight className="text-sm text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer (visible only on mobile) - 2 Column Grid */}
      <div className="block lg:hidden">
        <div className="bg-gradient-to-br from-gray-900 via-blue-900/80 to-gray-900">
          <div className="px-3 py-4">
            {/* Mobile Logo and Company Info */}
            <div className="mb-5 text-center">
              <div className="flex items-center mb-2 justify-start sm:justify-start">
                <div className="flex items-center">
                  {loading ? (
                    <div className="h-23 w-40 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <img
                      src={footerLogo}
                      alt="Hously Footer Logo"
                      className="h-23 w-auto transform hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-2 text-left sm:text-center">
                Leading provider of comprehensive IT solutions including web
                development, AI integration, cloud services, and digital
                transformation.
              </p>

              {/* Mobile Social Links with React Icons */}
              <div className="flex justify-start gap-3 mb-2">
                <a
                  href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a
                  href="https://www.linkedin.com/company/houlsy-finntech-realty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaYoutube className="text-sm" />
                </a>
              </div>
            </div>

            {/* 2 Column Grid for Mobile */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Column 1: Useful Links */}
              <div>
                <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
                  Useful Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <ScrollLink
                      to="/"
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      Home
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/services"
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      Services
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/about"
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      About Us
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/contact"
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      Contact
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/career"
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      Career
                    </ScrollLink>
                  </li>
                </ul>
              </div>

              {/* Column 2: Company */}
              <div>
                <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
                  Company
                </h3>
                <ul className="space-y-2">
                  {["About Company", "Our Team", "Careers", "Partners"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Column 3: Services */}
              <div>
                <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
                  Our Services
                </h3>
                <ul className="space-y-2">
                  {[
                    "Web Development",
                    "AI & Chatbot",
                    "Cloud & DevOps",
                    "Software Dev",
                    "IT Consulting",
                  ].map((service) => (
                    <li key={service}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white text-sm transition-colors"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact Us */}
              <div>
                <h3 className="text-white text-lg font-bold mb-4 pb-2 border-b border-blue-500/50">
                  Contact Us
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-[#fed700] mt-1 text-xs flex-shrink-0" />
                    <p
                      className="text-gray-300 text-xs"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      First Floor,Tamara Uprise,
                      <br />
                      Pune, 411017
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <FaPhoneAlt className="text-[#fed700] flex-shrink-0" />
                    <a
                      href="tel:+919371009381"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      +91 9371 00 9381
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#fed700] text-xs flex-shrink-0" />
                    <a
                      href="mailto:info@hously.in"
                      className="text-gray-300 hover:text-white text-xs"
                    >
                      info@hously.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Newsletter */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-bold mb-4">
                Subscribe to our Newsletter
              </h3>

              <div className="flex items-center gap-2">
                {/* Input */}
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[45px] bg-white/10 border border-white/20 rounded-full px-4 text-white placeholder-gray-400 text-sm focus:outline-none"
                />

                {/* Arrow Button */}
                <button className="w-[45px] h-[45px] bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
                  <FaArrowRight className="text-sm text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Both Desktop & Mobile */}
      <footer className="bg-gray-900 py-4">
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-center sm:justify-between">
          {/* Left corner © text (heading/text added, no CSS change) */}
          <p className="text-gray-400 text-xs sm:text-sm text-left pl-2">
            © {new Date().getFullYear()} <span>Hously Finntech Realty</span>.
            All rights reserved.
          </p>

          {/* Right corner links (only links added) */}
          <div className="flex gap-4 text-xs sm:text-sm pr-2">
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                navigate('/privacy-policy', { state: { fromWelcome: false } });
              }}
              className="text-gray-400 hover:text-white transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              onClick={(e) => {
                e.preventDefault();
                navigate('/terms-of-service', { state: { fromWelcome: false } });
              }}
              className="text-gray-400 hover:text-white transition"
            >
              Terms of Service
            </a>
            <a
              href="/cookie-policy"
              onClick={(e) => {
                e.preventDefault();
                navigate('/cookie-policy', { state: { fromWelcome: false } });
              }}
              className="text-gray-400 hover:text-white transition"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
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

        .animate-slideInUp {
          animation: slideInUp 0.9s ease forwards;
        }
      `}</style>
    </>
  );
};

export default Footer;




// components/Footer.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { settingsApi } from "../lib/settingsApi";

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
    navigate(to);
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

  useEffect(() => {
    fetchFooterLogo();
  }, []);

  const fetchFooterLogo = async () => {
    try {
      const logoData = await settingsApi.getLogos();
      
      if (logoData.footerLogo) {
        const timestamp = new Date().getTime();
        const logoUrl = logoData.footerLogo.includes('?') 
          ? `${logoData.footerLogo}&t=${timestamp}`
          : `${logoData.footerLogo}?t=${timestamp}`;
        setFooterLogo(logoUrl);
      } else {
        const timestamp = new Date().getTime();
        setFooterLogo(`/images/footer-logo1.png?t=${timestamp}`);
      }
    } catch (error) {
      const timestamp = new Date().getTime();
      setFooterLogo(`/images/footer-logo1.png?t=${timestamp}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const timestamp = new Date().getTime();
    
    if (!target.src.includes('/images/footer-logo1.png')) {
      target.src = `/images/footer-logo1.png?t=${timestamp}`;
    } else {
      if (target.src.includes('?')) {
        target.src = target.src.split('?')[0];
      }
    }
  };

  return (
    <>
      {/* Desktop Footer */}
      <div className="hidden lg:block">
        <div className="relative overflow-hidden max-w-[1820px] mx-auto">
          <div className="absolute inset-0 bg-[#0F172A]" />

          <div className="relative z-10 pt-4 pb-4 px-6">
            <div className="container mx-auto max-w-[1488px]">
              <div className="flex flex-wrap justify-between -mx-3">
                {/* Column 1: Company Info */}
                <div className="w-full md:w-auto px-3 pl-[20px] mb-6 md:mb-0 animate-slideInUp">
                  <div className="max-w-[260px]">
                    <div className="flex items-center mb-5">
                      <div className="flex items-center">
                        {loading ? (
                          <div className="h-20 w-40 bg-gray-700 animate-pulse rounded"></div>
                        ) : (
                          <img
                            src={footerLogo}
                            alt="Hously Footer Logo"
                            className="h-20 w-auto transform hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>

                    <p
                      className="text-gray-300 leading-relaxed mb-5 text-sm"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Leading provider of comprehensive IT solutions including
                      web development, AI integration, cloud services, and
                      digital transformation for businesses worldwide.
                    </p>

                    <div className="flex gap-2">
                      <a
                        href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FaFacebookF className="text-sm" />
                      </a>
                      <a
                        href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FaInstagram className="text-sm" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/houlsy-finntech-realty/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FaLinkedinIn className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FaTwitter className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:-translate-y-1"
                      >
                        <FaYoutube className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Useful Links */}
                <div
                  className="w-full sm:w-auto px-3 mb-6 sm:mb-0 animate-slideInUp"
                  style={{ animationDelay: "270ms" }}
                >
                  <h3
                    className="text-white text-lg font-bold mb-6 pb-3 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Useful Links
                  </h3>

                  <ul className="space-y-2">
                    <li>
                      <ScrollLink
                        to="/"
                        className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Home
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink
                        to="/services"
                        className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Services
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink
                        to="/about"
                        className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        About Us
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink
                        to="/contact"
                        className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Contact
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink
                        to="/career"
                        className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        Career
                      </ScrollLink>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Company */}
                <div
                  className="w-full sm:w-auto px-3 mb-6 sm:mb-0 animate-slideInUp"
                  style={{ animationDelay: "540ms" }}
                >
                  <h3
                    className="text-white text-lg font-bold mb-6 pb-3 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Company
                  </h3>
                  <ul className="space-y-2">
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
                          className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
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
                  className="w-full md:w-auto px-3 mb-6 md:mb-0 animate-slideInUp"
                  style={{ animationDelay: "810ms" }}
                >
                  <h3
                    className="text-white text-lg font-bold mb-6 pb-3 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Our Services
                  </h3>
                  <ul className="space-y-2">
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
                          className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
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
                    className="text-white text-lg font-bold mb-6 pb-3 relative after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-[#fed700]"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    Contact Us
                  </h3>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-[#fed700] mt-0.5 flex-shrink-0 text-sm" />
                      <p
                        className="text-gray-300 text-sm"
                        style={{ fontFamily: '"DM Sans", sans-serif' }}
                      >
                        First Floor, Tamara Uprise Rahatani,
                        <br />
                        Pune, 411017
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhoneAlt className="text-[#fed700] flex-shrink-0 text-sm" />
                      <a
                        href="tel:+919371009381"
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        +91 9371 00 9381
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-[#fed700] flex-shrink-0 text-sm" />
                      <a
                        href="mailto:info@hously.in"
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        info@hously.in
                      </a>
                    </div>
                  </div>

                  <div className="max-w-[240px]">
                    <p
                      className="text-gray-300 mb-3 text-xs"
                      style={{ fontFamily: '"DM Sans", sans-serif' }}
                    >
                      Subscribe to our newsletter
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      <button className="w-10 h-10 bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
                        <FaArrowRight className="text-xs text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="block lg:hidden">
        <div className="bg-gradient-to-br from-gray-900 via-blue-900/80 to-gray-900">
          <div className="px-3 py-4">
            <div className="mb-4 text-center">
              <div className="flex items-center mb-2 justify-start">
                <div className="flex items-center">
                  {loading ? (
                    <div className="h-16 w-32 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <img
                      src={footerLogo}
                      alt="Hously Footer Logo"
                      className="h-16 w-auto transform hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-xs mb-3 text-left">
                Leading provider of comprehensive IT solutions including web
                development, AI integration, cloud services, and digital
                transformation.
              </p>

              <div className="flex justify-start gap-2 mb-3">
                <a
                  href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaFacebookF className="text-xs" />
                </a>
                <a
                  href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaInstagram className="text-xs" />
                </a>
                <a
                  href="https://www.linkedin.com/company/houlsy-finntech-realty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaLinkedinIn className="text-xs" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaTwitter className="text-xs" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <FaYoutube className="text-xs" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-white text-base font-bold mb-3 pb-2 border-b border-blue-500/50">
                  Useful Links
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <ScrollLink
                      to="/"
                      className="text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      Home
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/services"
                      className="text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      Services
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/about"
                      className="text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      About Us
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/contact"
                      className="text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      Contact
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="/career"
                      className="text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      Career
                    </ScrollLink>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white text-base font-bold mb-3 pb-2 border-b border-blue-500/50">
                  Company
                </h3>
                <ul className="space-y-1.5">
                  {["About Company", "Our Team", "Careers", "Partners"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white text-xs transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-white text-base font-bold mb-3 pb-2 border-b border-blue-500/50">
                  Our Services
                </h3>
                <ul className="space-y-1.5">
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
                        className="text-gray-300 hover:text-white text-xs transition-colors"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white text-base font-bold mb-3 pb-2 border-b border-blue-500/50">
                  Contact Us
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <FaMapMarkerAlt className="text-[#fed700] mt-0.5 text-[10px] flex-shrink-0" />
                    <p className="text-gray-300 text-[10px]">
                      First Floor, Tamara Uprise,
                      <br />
                      Pune, 411017
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[#fed700] text-[10px] flex-shrink-0" />
                    <a
                      href="tel:+919371009381"
                      className="text-gray-300 hover:text-white text-xs"
                    >
                      +91 9371 00 9381
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaEnvelope className="text-[#fed700] text-[10px] flex-shrink-0" />
                    <a
                      href="mailto:info@hously.in"
                      className="text-gray-300 hover:text-white text-[10px]"
                    >
                      info@hously.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white text-base font-bold mb-3">
                Subscribe to our Newsletter
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 bg-white/10 border border-white/20 rounded-full px-3 text-white placeholder-gray-400 text-xs focus:outline-none"
                />
                <button className="w-10 h-10 bg-[#0076d8] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
                  <FaArrowRight className="text-xs text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="bg-gray-900 py-3">
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-center sm:justify-between">
          <p className="text-gray-400 text-[10px] sm:text-xs text-left pl-2">
            © {new Date().getFullYear()} <span>Hously Finntech Realty</span>.
            All rights reserved.
          </p>

          <div className="flex gap-3 text-[10px] sm:text-xs pr-2">
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
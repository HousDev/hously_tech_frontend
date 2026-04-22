import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import logo from "../assets/images/hously-logo.png";
import footerLogo from "../assets/images/footer-logo1.png";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { isAdmin, getCurrentUser, logout } from "../services/authService";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface NavbarUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface NavbarProps {
  user?: NavbarUser | null;
  onLoginClick: () => void;
}

interface LogoSettings {
  navbarLogo: string;
  footerLogo: string;
  favicon: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [logoData, setLogoData] = useState<LogoSettings>({
    navbarLogo: logo,
    footerLogo: footerLogo,
    favicon: "/favicon.png"
  });
  const [loadingLogos, setLoadingLogos] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isUserAdmin = isAdmin();
  const currentUser = user || getCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logos from API
  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      setLoadingLogos(true);
      const response = await axios.get(`${API_BASE_URL}/settings/logos`);
      
      if (response.data.success) {
        setLogoData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch logos:', error);
      setLogoData({
        navbarLogo: logo,
        footerLogo: footerLogo,
        favicon: "/favicon.png"
      });
    } finally {
      setLoadingLogos(false);
    }
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Nav links data
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/career", label: "Career" },
  ];

  const handleAdminClick = () => {
    if (isUserAdmin) {
      navigate("/admin");
    } else {
      onLoginClick();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Get the appropriate logo based on scroll state and page
  const getCurrentLogo = () => {
    if (loadingLogos) {
      return isScrolled || !isHomePage ? logo : footerLogo;
    }
    return isScrolled || !isHomePage ? logoData.navbarLogo : logoData.footerLogo;
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[70] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-6 right-6 bg-[#0c1e4a] text-white p-3 rounded-full hover:bg-[#0076d8] transition"
          >
            <X size={24} />
          </button>

          {/* Logo */}
          <div className="mb-8">
            {loadingLogos ? (
              <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <img 
                src={logoData.navbarLogo} 
                alt="Hously Logo" 
                className="h-12 w-auto" 
                onError={(e) => {
                  e.currentTarget.src = logo;
                }}
              />
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hously is a modern and innovative IT solutions company delivering
            reliable, scalable, and secure digital services tailored to meet
            the evolving needs of businesses across industries.
          </p>

          {/* Contact Details */}
          <div className="mb-8">
            <h3 className="text-[#0c1e4a] text-xl font-bold mb-6">
              Contact Details
            </h3>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-[#0076d8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700">
                    First Floor,Tamara Uprise Rahatni, Pune, 411017
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-[#0076d8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">+91 9371 00 9381</p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-[#0076d8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">info@hously.in</p>
              </div>
            </div>
          </div>

          {/* Admin Section */}
          {currentUser && (
            <div className="mb-8">
              <h3 className="text-[#0c1e4a] text-xl font-bold mb-6">
                Admin Access
              </h3>
              <div className="space-y-3">
                {isUserAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Settings size={20} />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <CgProfile size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      onLoginClick();
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <CgProfile size={20} />
                    <span>Admin Login</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Follow Us */}
          <div>
            <h3 className="text-[#0c1e4a] text-xl font-bold mb-6">Follow Us</h3>

            {/* Social Links with React Icons */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1CxvUhjQLX/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#0c1e4a]
                 hover:bg-[#0076d8] hover:text-white transition-all duration-300
                 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                title="Follow us on Facebook"
              >
                <FaFacebookF className="text-base" />
              </a>

              <a
                href="https://www.instagram.com/hously.in?igsh=MWFtMmNsMjh0Ym5idg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#0c1e4a]
                 hover:bg-[#0076d8] hover:text-white transition-all duration-300
                 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                title="Follow us on Instagram"
              >
                <FaInstagram className="text-base" />
              </a>

              <a
                href="https://www.linkedin.com/company/houlsy-finntech-realty/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#0c1e4a]
                 hover:bg-[#0076d8] hover:text-white transition-all duration-300
                 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                title="Follow us on LinkedIn"
              >
                <FaLinkedinIn className="text-base" />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#0c1e4a]
                 hover:bg-[#0076d8] hover:text-white transition-all duration-300
                 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                title="Follow us on Twitter"
              >
                <FaTwitter className="text-base" />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#0c1e4a]
                 hover:bg-[#0076d8] hover:text-white transition-all duration-300
                 transform hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg"
                title="Follow us on YouTube"
              >
                <FaYoutube className="text-base" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg"
            : isHomePage
            ? "bg-transparent"
            : "bg-white shadow-lg"
        }`}
      >
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled || !isHomePage
              ? "px-4 sm:px-6 lg:px-8 py-4"
              : "bg-white/20 backdrop-blur-md border-b border-white/30 px-4 sm:px-6 lg:px-8 py-4"
          }`}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center navbar-logo">
              {loadingLogos ? (
                <div className={`bg-gray-200 animate-pulse rounded transition-all duration-300 ${
                  isScrolled || !isHomePage
                    ? "h-14 sm:h-16 md:h-14 w-40"
                    : "h-11 sm:h-12 md:h-14 w-36"
                }`}></div>
              ) : (
                <img
                  src={getCurrentLogo()}
                  alt="Hously Logo"
                  className={`transition-all duration-300 ${
                    isScrolled || !isHomePage
                      ? "h-14 sm:h-16 md:h-14 w-auto"
                      : "h-11 sm:h-12 md:h-14 w-auto filter drop-shadow-lg"
                  }`}
                  style={{
                    filter:
                      isScrolled || !isHomePage
                        ? "none"
                        : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.1) contrast(1.2)",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = isScrolled || !isHomePage ? logo : footerLogo;
                  }}
                />
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition font-medium relative group ${
                      isScrolled || !isHomePage
                        ? active
                          ? "text-[#0076d8] font-semibold"
                          : "text-gray-700 hover:text-[#0076d8]"
                        : active
                        ? "text-[#ffd801] font-semibold"
                        : "text-white hover:text-[#ffd801]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      } ${
                        isScrolled || !isHomePage
                          ? "bg-[#0076d8]"
                          : "bg-[#ffd801]"
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Admin Login/Profile Button */}
              {isUserAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`p-2.5 rounded-lg transition ${
                      isScrolled || !isHomePage
                        ? "hover:bg-gray-100 text-gray-700"
                        : "text-white hover:bg-white/30 backdrop-blur-sm"
                    }`}
                    title="Profile"
                  >
                    <CgProfile size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[45]"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-[50] border border-gray-100">
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition flex items-center space-x-2"
                        >
                          <Settings size={16} />
                          <span>Admin Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                        >
                          <CgProfile size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAdminClick}
                  className={`p-2.5 rounded-lg transition ${
                    isScrolled || !isHomePage
                      ? "hover:bg-gray-100 text-gray-700"
                      : "text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}
                  title="Admin Login"
                >
                  <CgProfile size={20} />
                </button>
              )}

              <button
                onClick={() => navigate("/contact")}
                className="bg-[#0076d8] hover:bg-[#0066c0] text-white px-7 py-3 rounded-full transition font-semibold shadow-lg shadow-[#0076d8]/30 flex items-center space-x-2 hover:shadow-xl hover:shadow-[#0076d8]/50 transform hover:scale-105"
              >
                <span>Get A Quote</span>
              </button>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2.5 rounded-lg transition hover:rotate-180 duration-300 ${
                  isScrolled || !isHomePage
                    ? "hover:bg-gray-100 text-gray-700"
                    : "text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isScrolled || !isHomePage ? "bg-[#0076d8]" : "bg-white"
                      }`}
                    ></div>
                  ))}
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded transition ${
                  isScrolled || !isHomePage
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white "
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div
              className={`lg:hidden mt-4 pt-4 animate-fadeIn ${
                isScrolled || !isHomePage
                  ? "border-t border-gray-200"
                  : "border-t border-white/20"
              }`}
            >
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition ${
                        isScrolled || !isHomePage
                          ? active
                            ? "bg-blue-50 text-[#0076d8] border-l-4 border-[#0076d8]"
                            : "text-gray-700 hover:text-[#0076d8] hover:bg-gray-50"
                          : active
                          ? "bg-white/30 text-[#ffd801] border-l-4 border-[#ffd801] backdrop-blur-sm"
                          : "text-white hover:text-[#ffd801] hover:bg-white/20"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                {/* Admin Login/Profile Mobile - Modern Card Style */}
                {isUserAdmin ? (
                  <div className={`mt-4 p-4 rounded-xl ${
                    isScrolled || !isHomePage
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
                      : "bg-white/10 backdrop-blur-md border border-white/20"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full ${
                        isScrolled || !isHomePage
                          ? "bg-blue-100"
                          : "bg-white/20"
                      }`}>
                        <CgProfile size={20} className={
                          isScrolled || !isHomePage ? "text-blue-600" : "text-white"
                        } />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${
                          isScrolled || !isHomePage ? "text-gray-800" : "text-white"
                        }`}>
                          {currentUser?.username || 'Admin'}
                        </p>
                        <p className={`text-xs ${
                          isScrolled || !isHomePage ? "text-gray-500" : "text-white/70"
                        }`}>
                          Administrator
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/admin");
                        }}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 ${
                          isScrolled || !isHomePage
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                            : "bg-white/90 text-blue-600 hover:bg-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        <Settings size={16} />
                        <span className="text-sm">Dashboard</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 ${
                          isScrolled || !isHomePage
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                        }`}
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleAdminClick();
                    }}
                    className={`flex items-center justify-center gap-3 w-full mt-4 px-6 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      isScrolled || !isHomePage
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                        : "bg-white/90 text-blue-600 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm"
                    }`}
                  >
                    <CgProfile size={22} />
                    <span>Admin Login</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate("/contact");
                    setIsOpen(false);
                  }}
                  className="w-full mt-3 bg-[#0076d8] hover:bg-[#0066c0] text-white px-6 py-3.5 rounded-full transition font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get A Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
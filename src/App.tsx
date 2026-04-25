// /* eslint-disable react-hooks/set-state-in-effect */
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // import Navbar from './components/Navbar';
// // import Footer from './components/Footer';
// // import BackToTop from './components/BackToTop'; // Import the new component

// // // Pages
// // import HomePage from './pages/HomePage';
// // import AboutPage from './pages/About/page';
// // import ServicesPage from './pages/services/page';
// // import ContactSection from './pages/Contact/page';
// // import TestimonialPage from './pages/Testinomial/page';
// // import CaseStudyApp from './pages/CaseStudy/page';
// // import HouslyCareerPage from './pages/Career/page';
// // import CareersPage from './pages/Career/job/page';
// // import JobDetailsPage from './pages/Career/job/[id]/page';
// // import JobApplicationPage from './pages/Career/job/[id]/apply/page';
// // import { useState } from 'react';

// // function App() {
// //   const [showIt,setShowIt]=useState(true)
// //   return (
// //     <Router>
// //       {showIt?<div>
// //         <a href='https://hously.in'>finance</a>
// //         <a href='https://hously.in'>Real Estatef</a>
// //         <button onClick={()=>setShowIt(false)}>IT Services</button>
// //       </div>:<div className="relative min-h-screen">
// //         <Navbar />

// //         <main className="flex-grow">
// //           <Routes>
// //             <Route path="/" element={<HomePage />} />
// //             <Route path="/about" element={<AboutPage />} />
// //             <Route path="/services" element={<ServicesPage />} />
// //             <Route path="/contact" element={<ContactSection />} />
// //             <Route path="/testimonial" element={<TestimonialPage />} />
// //             <Route path="/casestudy" element={<CaseStudyApp />} />
// //             <Route path="/career" element={<HouslyCareerPage />} />
// //             <Route path="/career/job" element={<CareersPage />} />
// //             {/* Dynamic routes for job details and application */}
// //             <Route path="/career/job/:id" element={<JobDetailsPage />} />
// //             <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />
// //           </Routes>
// //         </main>

// //         <Footer />
        
// //         {/* Add BackToTop button here - it will appear on all pages */}
// //         <BackToTop />
// //       </div>}
// //     </Router>
// //   );
// // }

// /* eslint-disable react-hooks/purity */
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import BackToTop from "./components/BackToTop";
// import WelcomePage from "./components/welcome_page";

// // Main Pages
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/About/page";
// import ServicesPage from "./pages/services/page";
// import ContactSection from "./pages/Contact/page";
// import TestimonialPage from "./pages/Testinomial/page";
// import CaseStudyApp from "./pages/CaseStudy/page";
// import HouslyCareerPage from "./pages/Career/page";
// import CareersPage from "./pages/Career/job/page";
// import JobDetailsPage from "./pages/Career/job/[id]/page";
// import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// // Policy Pages
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import TermsOfService from "./components/TermsOfService";
// import CookiePolicy from "./components/CookiePolicy";

// // Admin Pages
// import AdminDashboard from "./pages/Admin/Dashboard";
// import HomeCMS from "./pages/Admin/HomeCMS";
// import ServicesCMS from "./pages/Admin/ServicesCMS";
// import BlogCMS from "./pages/Admin/BlogCMS";
// import CareerCMS from "./pages/Admin/CareerCMS";
// import SettingsCMS from "./pages/Admin/SettingsCMS";
// import Profile from "./pages/Admin/ProfilePage";
// import TestimonialsCMS from "./pages/Admin/TestimonialCMS";
// // Auth Components
// import AuthModal from "./components/auth/AuthModal";

// // Auth Services
// import { getCurrentUser, isAdmin, logout } from "./services/authService";
// import { toast } from "react-toastify";

// // Admin Protected Route Component
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   if (!isAdmin()) {
//     logout();
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//           <p className="text-gray-600">You need admin privileges to access this page.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// function AppContent() {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [user, setUser] = useState(getCurrentUser());
//   const location = useLocation();

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       setShowWelcome(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   // const handleAuthSuccess = () => {
//   //   setUser(getCurrentUser());
//   // };

//   const handleAuthSuccess = () => {
//   const currentUser = getCurrentUser();
//   setUser(currentUser);
  
//   // Check if user is admin or regular user
//   if (currentUser && currentUser.role !== 'admin') {
//     // Regular user - redirect to home page
//     toast.success('Welcome back!', {
//       position: "top-right",
//       autoClose: 2000,
//     });
//     // You can optionally redirect to a user dashboard if you have one
//     // For now, just close the modal and stay on current page
//   } else if (currentUser && currentUser.role === 'admin') {
//     // Admin user - redirect to admin dashboard
//     setTimeout(() => {
//       navigator('/admin');
//     }, 1000);
//   }
// };

//   // Handle welcome page visibility and URL parameters
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
    
//     // Check if welcome parameter is set in URL
//     if (params.get('welcome') === 'true') {
//       setShowWelcome(true);
//     } else if (location.pathname !== "/") {
//       // Hide welcome page when navigating away from home
//       setShowWelcome(false);
//     }
    
//     // Update user state
//     setUser(getCurrentUser());
//   }, [location.pathname, location.search]);

//   // Show welcome page if showWelcome is true and on home route
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

//   // Routes where Navbar & Footer should be hidden
//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/admin",
//     "/admin/*"
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
//   );

//   // Check if current route is admin route
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={user}
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* Main Pages */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           {/* Career Pages */}
//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           {/* Policy Pages (NO Navbar & Footer) */}
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* Protected Admin Routes */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           >
//             <Route index element={<div className="p-6">Select a section from the sidebar</div>} />
//             <Route path="home" element={<HomeCMS />} />
//             <Route path="services" element={<ServicesCMS />} />
//             <Route path="blog" element={<BlogCMS />} />
//             <Route path="career" element={<CareerCMS />} />
//             <Route path="settings" element={<SettingsCMS />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="TestimonialsCMS " element={<TestimonialsCMS />} />
//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;





// /* eslint-disable react-hooks/purity */
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import BackToTop from "./components/BackToTop";
// import WelcomePage from "./components/welcome_page";

// // Main Pages
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/About/page";
// import ServicesPage from "./pages/services/page";
// import ContactSection from "./pages/Contact/page";
// import TestimonialPage from "./pages/Testinomial/page";
// import CaseStudyApp from "./pages/CaseStudy/page";
// import HouslyCareerPage from "./pages/Career/page";
// import CareersPage from "./pages/Career/job/page";
// import JobDetailsPage from "./pages/Career/job/[id]/page";
// import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// // Policy Pages
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import TermsOfService from "./components/TermsOfService";
// import CookiePolicy from "./components/CookiePolicy";

// // Admin Pages
// import AdminDashboard from "./pages/Admin/Dashboard";
// import HomeCMS from "./pages/Admin/HomeCMS";
// import ServicesCMS from "./pages/Admin/ServicesCMS";
// import BlogCMS from "./pages/Admin/BlogCMS";
// import CareerCMS from "./pages/Admin/CareerCMS";
// import SettingsCMS from "./pages/Admin/SettingsCMS";
// import Profile from "./pages/Admin/ProfilePage";
// import TestimonialsCMS from "./pages/Admin/TestimonialCMS"; // Add this import
// import EnquiriesCMS from "./pages/Admin/EnquiriesCMS"; // Add this import
// import TeamCMS from "./pages/Admin/TeamCMS"; // Add this line

// // Auth Components
// import AuthModal from "./components/auth/AuthModal";

// // Auth Services
// import { getCurrentUser, isAdmin, logout } from "./services/authService";
// import { toast } from "react-toastify";

// // Admin Protected Route Component
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   if (!isAdmin()) {
//     logout();
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//           <p className="text-gray-600">You need admin privileges to access this page.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// function AppContent() {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [user, setUser] = useState(getCurrentUser());
//   const location = useLocation();

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       setShowWelcome(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAuthSuccess = () => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
    
//     if (currentUser && currentUser.role === 'admin') {
//       // Admin user - redirect to admin dashboard
//       setTimeout(() => {
//         window.location.href = '/admin';
//       }, 1000);
//     } else if (currentUser && currentUser.role !== 'admin') {
//       // Regular user - just show success message
//       toast.success('Welcome back!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   // Handle welcome page visibility and URL parameters
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
    
//     // Check if welcome parameter is set in URL
//     if (params.get('welcome') === 'true') {
//       setShowWelcome(true);
//     } else if (location.pathname !== "/") {
//       // Hide welcome page when navigating away from home
//       setShowWelcome(false);
//     }
    
//     // Update user state
//     setUser(getCurrentUser());
//   }, [location.pathname, location.search]);

//   // Show welcome page if showWelcome is true and on home route
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

//   // Routes where Navbar & Footer should be hidden
//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/admin",
//     "/admin/*"
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
//   );

//   // Check if current route is admin route
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={user}
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* Main Pages */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           {/* Career Pages */}
//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           {/* Policy Pages (NO Navbar & Footer) */}
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* Protected Admin Routes */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           >
//             <Route index element={<div className="p-6">Select a section from the sidebar</div>} />
//             <Route path="home" element={<HomeCMS />} />
//             <Route path="services" element={<ServicesCMS />} />
//             <Route path="blog" element={<BlogCMS />} />
//             <Route path="testimonials" element={<TestimonialsCMS />} />
//             <Route path="enquiries" element={<EnquiriesCMS />} />
//             <Route path="career" element={<CareerCMS />} />
//             <Route path="settings" element={<SettingsCMS />} />
//             <Route path="profile" element={<Profile />} />
//   <Route path="team" element={<TeamCMS />} /> {/* ✅ ADD THIS LINE */}

//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;






// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import BackToTop from "./components/BackToTop";
// import WelcomePage from "./components/welcome_page";

// // Main Pages
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/About/page";
// import ServicesPage from "./pages/services/page";
// import ContactSection from "./pages/Contact/page";
// import TestimonialPage from "./pages/Testinomial/page";
// import CaseStudyApp from "./pages/CaseStudy/page";
// import HouslyCareerPage from "./pages/Career/page";
// import CareersPage from "./pages/Career/job/page";
// import JobDetailsPage from "./pages/Career/job/[id]/page";
// import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// // Policy Pages
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import TermsOfService from "./components/TermsOfService";
// import CookiePolicy from "./components/CookiePolicy";

// // Admin Pages
// import AdminDashboard from "./pages/Admin/Dashboard";
// import HomeCMS from "./pages/Admin/HomeCMS";
// import ServicesCMS from "./pages/Admin/ServicesCMS";
// import BlogCMS from "./pages/Admin/BlogCMS";
// import CareerCMS from "./pages/Admin/CareerCMS";
// import SettingsCMS from "./pages/Admin/SettingsCMS";
// import Profile from "./pages/Admin/ProfilePage";
// import TestimonialsCMS from "./pages/Admin/TestimonialCMS";
// import EnquiriesCMS from "./pages/Admin/EnquiriesCMS";
// import TeamCMS from "./pages/Admin/TeamCMS";
// import DashboardAnalytics from "./pages/Admin/DashboardAnalytics"; // ✅ ADD THIS

// // Analytics Component
// import VisitorTracker from "./components/VisitorTracker"; // ✅ ADD THIS

// // Auth Components
// import AuthModal from "./components/auth/AuthModal";

// // Auth Services
// import { getCurrentUser, isAdmin, logout } from "./services/authService";
// import { toast } from "react-toastify";

// // Admin Protected Route Component
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   if (!isAdmin()) {
//     logout();
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//           <p className="text-gray-600">You need admin privileges to access this page.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// function AppContent() {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [user, setUser] = useState(getCurrentUser());
//   const location = useLocation();

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       setShowWelcome(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAuthSuccess = () => {
//     const currentUser = getCurrentUser();
//     setUser(currentUser);
    
//     if (currentUser && currentUser.role === 'admin') {
//       // Admin user - redirect to admin dashboard
//       setTimeout(() => {
//         window.location.href = '/admin';
//       }, 1000);
//     } else if (currentUser && currentUser.role !== 'admin') {
//       // Regular user - just show success message
//       toast.success('Welcome back!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   // Handle welcome page visibility and URL parameters
//  // Handle welcome page visibility and URL parameters
// useEffect(() => {
//   const params = new URLSearchParams(location.search);

//   if (params.get('welcome') === 'true') {
//     setShowWelcome(true);
//   } else if (location.pathname !== "/") {
//     setShowWelcome(false);
//   }
//   // If on "/" → keep showWelcome as true (initial state)

//   setUser(getCurrentUser());
// }, [location.pathname, location.search]);
  
// //   useEffect(() => {
// //   const params = new URLSearchParams(location.search);
  
// //   // Only show welcome page when URL has ?welcome=true
// //   if (params.get('welcome') === 'true') {
// //     setShowWelcome(true);
// //   } else {
// //     // Always hide welcome page otherwise
// //     setShowWelcome(false);
// //   }
  
// //   // Update user state
// //   setUser(getCurrentUser());
// // }, [location.pathname, location.search]);


//   // Show welcome page if showWelcome is true and on home route
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

//   // Routes where Navbar & Footer should be hidden
//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/admin",
//     "/admin/*"
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
//   );

//   // Check if current route is admin route
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       {/* Visitor Tracker - Tracks all page visits */}
//       <VisitorTracker />
      
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={user}
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* Main Pages */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           {/* Career Pages */}
//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           {/* Policy Pages (NO Navbar & Footer) */}
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* Protected Admin Routes */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           >
//             <Route index element={<DashboardAnalytics />} /> {/* ✅ CHANGE THIS */}
//             <Route path="home" element={<HomeCMS />} />
//             <Route path="services" element={<ServicesCMS />} />
//             <Route path="blog" element={<BlogCMS />} />
//             <Route path="testimonials" element={<TestimonialsCMS />} />
//             <Route path="enquiries" element={<EnquiriesCMS />} />
//             <Route path="career" element={<CareerCMS />} />
//             <Route path="settings" element={<SettingsCMS />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="team" element={<TeamCMS />} />
//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;






// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import BackToTop from "./components/BackToTop";
// import WelcomePage from "./components/welcome_page";

// // Main Pages
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/About/page";
// import ServicesPage from "./pages/services/page";
// import ContactSection from "./pages/Contact/page";
// import TestimonialPage from "./pages/Testinomial/page";
// import CaseStudyApp from "./pages/CaseStudy/page";
// import HouslyCareerPage from "./pages/Career/page";
// import CareersPage from "./pages/Career/job/page";
// import JobDetailsPage from "./pages/Career/job/[id]/page";
// import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// // Policy Pages
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import TermsOfService from "./components/TermsOfService";
// import CookiePolicy from "./components/CookiePolicy";

// // Admin Pages
// import AdminDashboard from "./pages/Admin/Dashboard";
// import HomeCMS from "./pages/Admin/HomeCMS";
// import ServicesCMS from "./pages/Admin/ServicesCMS";
// import BlogCMS from "./pages/Admin/BlogCMS";
// import CareerCMS from "./pages/Admin/CareerCMS";
// import SettingsCMS from "./pages/Admin/SettingsCMS";
// import Profile from "./pages/Admin/ProfilePage";
// import TestimonialsCMS from "./pages/Admin/TestimonialCMS";
// import EnquiriesCMS from "./pages/Admin/EnquiriesCMS";
// import TeamCMS from "./pages/Admin/TeamCMS";
// import DashboardAnalytics from "./pages/Admin/DashboardAnalytics";

// // Analytics Component
// import VisitorTracker from "./components/VisitorTracker";

// // Auth Components
// import AuthModal from "./components/auth/AuthModal";

// // ✅ CHANGE 1: Import from AuthContext instead of services
// import { useAuth } from "./context/AuthContext";
// import { toast } from "react-toastify";

// // Admin Protected Route Component
// // ✅ CHANGE 2: Use AuthContext instead of services
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAdmin, logout } = useAuth();
  
//   if (!isAdmin()) {
//     logout();
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//           <p className="text-gray-600">You need admin privileges to access this page.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// function AppContent() {
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showAuthModal, setShowAuthModal] = useState(false);
  
//   // ✅ CHANGE 3: Get user and auth functions from Context
//   const { user, isAuthenticated, isAdmin, logout } = useAuth();
//   const location = useLocation();

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       setShowWelcome(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAuthSuccess = () => {
//     // ✅ CHANGE 4: User is already updated in Context, just redirect
//     if (isAdmin()) {
//       setTimeout(() => {
//         window.location.href = '/admin';
//       }, 1000);
//     } else if (isAuthenticated) {
//       toast.success('Welcome back!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   // Handle welcome page visibility
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     if (params.get('welcome') === 'true') {
//       setShowWelcome(true);
//     } else if (location.pathname !== "/") {
//       setShowWelcome(false);
//     }
//   }, [location.pathname, location.search]);

//   // Show welcome page if showWelcome is true and on home route
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

//   // Routes where Navbar & Footer should be hidden
//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/admin",
//     "/admin/*"
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
//   );

//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       <VisitorTracker />
      
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={user}
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* Main Pages */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           {/* Career Pages */}
//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           {/* Policy Pages */}
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* Protected Admin Routes */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           >
//             <Route index element={<DashboardAnalytics />} />
//             <Route path="home" element={<HomeCMS />} />
//             <Route path="services" element={<ServicesCMS />} />
//             <Route path="blog" element={<BlogCMS />} />
//             <Route path="testimonials" element={<TestimonialsCMS />} />
//             <Route path="enquiries" element={<EnquiriesCMS />} />
//             <Route path="career" element={<CareerCMS />} />
//             <Route path="settings" element={<SettingsCMS />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="team" element={<TeamCMS />} />
//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }

// // ✅ CHANGE 5: Wrap App with AuthProvider
// import { AuthProvider } from "./context/AuthContext";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import BackToTop from "./components/BackToTop";
// import WelcomePage from "./components/welcome_page";

// // Main Pages
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/About/page";
// import ServicesPage from "./pages/services/page";
// import ContactSection from "./pages/Contact/page";
// import TestimonialPage from "./pages/Testinomial/page";
// import CaseStudyApp from "./pages/CaseStudy/page";
// import HouslyCareerPage from "./pages/Career/page";
// import CareersPage from "./pages/Career/job/page";
// import JobDetailsPage from "./pages/Career/job/[id]/page";
// import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// // Policy Pages
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import TermsOfService from "./components/TermsOfService";
// import CookiePolicy from "./components/CookiePolicy";

// // Admin Pages
// import AdminDashboard from "./pages/Admin/Dashboard";
// import HomeCMS from "./pages/Admin/HomeCMS";
// import ServicesCMS from "./pages/Admin/ServicesCMS";
// import BlogCMS from "./pages/Admin/BlogCMS";
// import CareerCMS from "./pages/Admin/CareerCMS";
// import SettingsCMS from "./pages/Admin/SettingsCMS";
// import Profile from "./pages/Admin/ProfilePage";
// import TestimonialsCMS from "./pages/Admin/TestimonialCMS";
// import EnquiriesCMS from "./pages/Admin/EnquiriesCMS";
// import TeamCMS from "./pages/Admin/TeamCMS";
// import DashboardAnalytics from "./pages/Admin/DashboardAnalytics";

// // Analytics Component
// import VisitorTracker from "./components/VisitorTracker";

// // Auth Components
// import AuthModal from "./components/auth/AuthModal";

// import { useAuth } from "./context/AuthContext";
// import { toast } from "react-toastify";

// // Admin Protected Route Component
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAdmin, logout } = useAuth();
  
//   if (!isAdmin()) {
//     logout();
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//           <p className="text-gray-600">You need admin privileges to access this page.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// function AppContent() {
//   const [showWelcome, setShowWelcome] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);
  
//   const { user, isAuthenticated, isAdmin, logout } = useAuth();
//   const location = useLocation();

//   // ✅ Check for first visit on initial load
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const isReturningFromAdmin = params.get('fromAdmin') === 'true';
    
//     // If coming from admin "Visit Website" button - NO welcome page
//     if (isReturningFromAdmin) {
//       setShowWelcome(false);
//       setIsChecking(false);
//       return;
//     }
    
//     // Check if user has visited before
//     const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    
//     if (!hasVisitedBefore) {
//       // First time visit - show welcome page
//       setShowWelcome(true);
//       sessionStorage.setItem('hasVisitedBefore', 'true');
//     } else {
//       // Already visited - no welcome page
//       setShowWelcome(false);
//     }
    
//     setIsChecking(false);
//   }, [location.search]);

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       setShowWelcome(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAuthSuccess = () => {
//     if (isAdmin()) {
//       setTimeout(() => {
//         window.location.href = '/admin';
//       }, 1000);
//     } else if (isAuthenticated) {
//       toast.success('Welcome back!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   // Show loading while checking
//   if (isChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   // Show welcome page only for first visit AND on home route
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

//   // Routes where Navbar & Footer should be hidden
//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/admin",
//     "/admin/*"
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
//   );

//   const isAdminRoute = location.pathname.startsWith('/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       <VisitorTracker />
      
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={user}
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* Main Pages */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           {/* Career Pages */}
//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           {/* Policy Pages */}
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* Protected Admin Routes */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           >
//             <Route index element={<DashboardAnalytics />} />
//             <Route path="home" element={<HomeCMS />} />
//             <Route path="services" element={<ServicesCMS />} />
//             <Route path="blog" element={<BlogCMS />} />
//             <Route path="testimonials" element={<TestimonialsCMS />} />
//             <Route path="enquiries" element={<EnquiriesCMS />} />
//             <Route path="career" element={<CareerCMS />} />
//             <Route path="settings" element={<SettingsCMS />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="team" element={<TeamCMS />} />
//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }

// import { AuthProvider } from "./context/AuthContext";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import WelcomePage from "./components/welcome_page";

// Main Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/About/page";
import ServicesPage from "./pages/services/page";
import ContactSection from "./pages/Contact/page";
import TestimonialPage from "./pages/Testinomial/page";
import CaseStudyApp from "./pages/CaseStudy/page";
import HouslyCareerPage from "./pages/Career/page";
import CareersPage from "./pages/Career/job/page";
import JobDetailsPage from "./pages/Career/job/[id]/page";
import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// Policy Pages
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import CookiePolicy from "./components/CookiePolicy";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import HomeCMS from "./pages/Admin/HomeCMS";
import ServicesCMS from "./pages/Admin/ServicesCMS";
import BlogCMS from "./pages/Admin/BlogCMS";
import CareerCMS from "./pages/Admin/CareerCMS";
import SettingsCMS from "./pages/Admin/SettingsCMS";
import Profile from "./pages/Admin/ProfilePage";
import TestimonialsCMS from "./pages/Admin/TestimonialCMS";
import EnquiriesCMS from "./pages/Admin/EnquiriesCMS";
import TeamCMS from "./pages/Admin/TeamCMS";
import DashboardAnalytics from "./pages/Admin/DashboardAnalytics";

import VisitorTracker from "./components/VisitorTracker";
import AuthModal from "./components/auth/AuthModal";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, logout } = useAuth();
  
  if (!isAdmin()) {
    logout();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // ✅ loading bhi lo taaki user load hone ka wait kar sake
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // ✅ Jab tak AuthContext user load kar raha hai, wait karo
    if (loading) return;

    const params = new URLSearchParams(location.search);
    const isReturningFromAdmin = params.get('fromAdmin') === 'true';

    // ✅ Admin ke "Visit Website" se aaya — welcome nahi
    if (isReturningFromAdmin) {
      setShowWelcome(false);
      setIsChecking(false);
      return;
    }

    // ✅ Admin logged in hai — refresh pe welcome nahi, seedha home
    if (isAdmin()) {
      setShowWelcome(false);
      sessionStorage.setItem('hasVisitedBefore', 'true');
      setIsChecking(false);
      return;
    }

    // ✅ Refresh detect karo
    const isRefresh = (() => {
      if (typeof performance !== "undefined" && performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (navEntries.length > 0) return navEntries[0].type === "reload";
      }
      if (typeof performance !== "undefined" && performance.navigation) {
        return performance.navigation.type === 1;
      }
      return false;
    })();

    // ✅ Refresh hai — welcome nahi, current page pe raho
    if (isRefresh) {
      setShowWelcome(false);
      sessionStorage.setItem('hasVisitedBefore', 'true');
      setIsChecking(false);
      return;
    }

    // ✅ Session mein pehle aa chuka hai — welcome nahi
    const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setShowWelcome(false);
      setIsChecking(false);
      return;
    }

    // ✅ Bilkul pehli baar aa raha hai — welcome dikhao
    setShowWelcome(true);
    sessionStorage.setItem('hasVisitedBefore', 'true');
    setIsChecking(false);

  }, [loading, location.search]); // ✅ loading dependency zaroori hai

  const handleSectorClick = (sectorId: string) => {
    if (sectorId === "real-estate" || sectorId === "finance") {
      window.location.href = "https://hously.in";
    } else if (sectorId === "it-tech") {
      setShowWelcome(false);
      window.scrollTo(0, 0);
    }
  };

  const handleAuthSuccess = () => {
    if (isAdmin()) {
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } else if (isAuthenticated) {
      toast.success('Welcome back!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // ✅ Auth load ho raha hai ya welcome check chal raha hai
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // ✅ Pehli baar aaya aur home route hai — welcome dikhao
  if (showWelcome && location.pathname === "/") {
    return <WelcomePage onSectorClick={handleSectorClick} />;
  }

  const hideLayoutRoutes = [
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/admin",
    "/admin/*"
  ];

  const hideLayout = hideLayoutRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route.replace('*', ''))
  );

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen flex flex-col">
      <VisitorTracker />
      
      {!hideLayout && !isAdminRoute && (
       <Navbar 
  user={
    user
      ? {
          ...user,
          role: user.role === "admin" ? "admin" : "user"
        }
      : null
  }
  onLoginClick={() => setShowAuthModal(true)}
/>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/testimonial" element={<TestimonialPage />} />
          <Route path="/casestudy" element={<CaseStudyApp />} />

          <Route path="/career" element={<HouslyCareerPage />} />
          <Route path="/career/job" element={<CareersPage />} />
          <Route path="/career/job/:id" element={<JobDetailsPage />} />
          <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DashboardAnalytics />} />
            <Route path="home" element={<HomeCMS />} />
            <Route path="services" element={<ServicesCMS />} />
            <Route path="blog" element={<BlogCMS />} />
            <Route path="testimonials" element={<TestimonialsCMS />} />
            <Route path="enquiries" element={<EnquiriesCMS />} />
            <Route path="career" element={<CareerCMS />} />
            <Route path="settings" element={<SettingsCMS />} />
            <Route path="profile" element={<Profile />} />
            <Route path="team" element={<TeamCMS />} />
          </Route>
        </Routes>
      </main>

      {!hideLayout && !isAdminRoute && <Footer />}
      {!hideLayout && !isAdminRoute && <BackToTop />}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
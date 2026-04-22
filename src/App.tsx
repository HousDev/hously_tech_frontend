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
import DashboardAnalytics from "./pages/Admin/DashboardAnalytics"; // ✅ ADD THIS

// Analytics Component
import VisitorTracker from "./components/VisitorTracker"; // ✅ ADD THIS

// Auth Components
import AuthModal from "./components/auth/AuthModal";

// Auth Services
import { getCurrentUser, isAdmin, logout } from "./services/authService";
import { toast } from "react-toastify";

// Admin Protected Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const location = useLocation();

  const handleSectorClick = (sectorId: string) => {
    if (sectorId === "real-estate" || sectorId === "finance") {
      window.location.href = "https://hously.in";
    } else if (sectorId === "it-tech") {
      setShowWelcome(false);
      window.scrollTo(0, 0);
    }
  };

  const handleAuthSuccess = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser && currentUser.role === 'admin') {
      // Admin user - redirect to admin dashboard
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } else if (currentUser && currentUser.role !== 'admin') {
      // Regular user - just show success message
      toast.success('Welcome back!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle welcome page visibility and URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check if welcome parameter is set in URL
    if (params.get('welcome') === 'true') {
      setShowWelcome(true);
    } else if (location.pathname !== "/") {
      // Hide welcome page when navigating away from home
      setShowWelcome(false);
    }
    
    // Update user state
    setUser(getCurrentUser());
  }, [location.pathname, location.search]);useEffect(() => {
  const params = new URLSearchParams(location.search);
  
  // Only show welcome page when URL has ?welcome=true
  if (params.get('welcome') === 'true') {
    setShowWelcome(true);
  } else {
    // Always hide welcome page otherwise
    setShowWelcome(false);
  }
  
  // Update user state
  setUser(getCurrentUser());
}, [location.pathname, location.search]);
  // Show welcome page if showWelcome is true and on home route
  if (showWelcome && location.pathname === "/") {
    return <WelcomePage onSectorClick={handleSectorClick} />;
  }

  // Routes where Navbar & Footer should be hidden
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

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Visitor Tracker - Tracks all page visits */}
      <VisitorTracker />
      
      {!hideLayout && !isAdminRoute && (
        <Navbar 
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
        />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/testimonial" element={<TestimonialPage />} />
          <Route path="/casestudy" element={<CaseStudyApp />} />

          {/* Career Pages */}
          <Route path="/career" element={<HouslyCareerPage />} />
          <Route path="/career/job" element={<CareersPage />} />
          <Route path="/career/job/:id" element={<JobDetailsPage />} />
          <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

          {/* Policy Pages (NO Navbar & Footer) */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<DashboardAnalytics />} /> {/* ✅ CHANGE THIS */}
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
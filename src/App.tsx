

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
// import CaseStudyCMS from "./pages/Admin/CaseStudyCMS";

// import VisitorTracker from "./components/VisitorTracker";
// import AuthModal from "./components/auth/AuthModal";
// import { useAuth } from "./context/AuthContext";
// import { toast } from "react-toastify";

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
  
//   // ✅ loading bhi lo taaki user load hone ka wait kar sake
//   const { user, isAuthenticated, isAdmin, loading } = useAuth();
//   const location = useLocation();

//   useEffect(() => {
//     // ✅ Jab tak AuthContext user load kar raha hai, wait karo
//     if (loading) return;

//     const params = new URLSearchParams(location.search);
//     const isReturningFromAdmin = params.get('fromAdmin') === 'true';

//     // ✅ Admin ke "Visit Website" se aaya — welcome nahi
//     if (isReturningFromAdmin) {
//       setShowWelcome(false);
//       setIsChecking(false);
//       return;
//     }

//     // ✅ Admin logged in hai — refresh pe welcome nahi, seedha home
//     if (isAdmin()) {
//       setShowWelcome(false);
//       sessionStorage.setItem('hasVisitedBefore', 'true');
//       setIsChecking(false);
//       return;
//     }

//     // ✅ Refresh detect karo
//     const isRefresh = (() => {
//       if (typeof performance !== "undefined" && performance.getEntriesByType) {
//         const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
//         if (navEntries.length > 0) return navEntries[0].type === "reload";
//       }
//       if (typeof performance !== "undefined" && performance.navigation) {
//         return performance.navigation.type === 1;
//       }
//       return false;
//     })();

//     // ✅ Refresh hai — welcome nahi, current page pe raho
//     if (isRefresh) {
//       setShowWelcome(false);
//       sessionStorage.setItem('hasVisitedBefore', 'true');
//       setIsChecking(false);
//       return;
//     }

//     // ✅ Session mein pehle aa chuka hai — welcome nahi
//     const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
//     if (hasVisitedBefore) {
//       setShowWelcome(false);
//       setIsChecking(false);
//       return;
//     }

//     // ✅ Bilkul pehli baar aa raha hai — welcome dikhao
//     setShowWelcome(true);
//     sessionStorage.setItem('hasVisitedBefore', 'true');
//     setIsChecking(false);

//   }, [loading, location.search]); // ✅ loading dependency zaroori hai

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

//   // ✅ Auth load ho raha hai ya welcome check chal raha hai
//   if (loading || isChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   // ✅ Pehli baar aaya aur home route hai — welcome dikhao
//   if (showWelcome && location.pathname === "/") {
//     return <WelcomePage onSectorClick={handleSectorClick} />;
//   }

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
//        <Navbar 
//   user={
//     user
//       ? {
//           ...user,
//           role: user.role === "admin" ? "admin" : "user"
//         }
//       : null
//   }
//   onLoginClick={() => setShowAuthModal(true)}
// />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

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
//             <Route path="case-studies" element={<CaseStudyCMS />} />

//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

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




// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
// import CaseStudyCMS from "./pages/Admin/CaseStudyCMS";

// import VisitorTracker from "./components/VisitorTracker";
// import AuthModal from "./components/auth/AuthModal";
// import { useAuth } from "./context/AuthContext";
// import { toast } from "react-toastify";

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
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);
  
//   const { user, isAuthenticated, isAdmin, loading } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (loading) return;
//     setIsChecking(false);
//   }, [loading]);

//   const handleSectorClick = (sectorId: string) => {
//     if (sectorId === "real-estate" || sectorId === "finance") {
//       window.location.href = "https://hously.in";
//     } else if (sectorId === "it-tech") {
//       navigate("/homes");
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleAuthSuccess = () => {
//     if (isAdmin()) {
//       setTimeout(() => {
//         window.location.href = '/homes/admin';
//       }, 1000);
//     } else if (isAuthenticated) {
//       toast.success('Welcome back!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   if (loading || isChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   // ✅ Welcome page — render completely standalone, no layout at all
//   if (location.pathname === "/") {
//     return (
//       <>
//         <VisitorTracker />
//         <WelcomePage onSectorClick={handleSectorClick} />
//       </>
//     );
//   }

//   const hideLayoutRoutes = [
//     "/privacy-policy",
//     "/terms-of-service",
//     "/cookie-policy",
//     "/homes/admin",
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route)
//   );

//   const isAdminRoute = location.pathname.startsWith('/homes/admin');

//   return (
//     <div className="relative min-h-screen flex flex-col">
//       <VisitorTracker />
      
//       {!hideLayout && !isAdminRoute && (
//         <Navbar 
//           user={
//             user
//               ? {
//                   ...user,
//                   role: user.role === "admin" ? "admin" : "user"
//                 }
//               : null
//           }
//           onLoginClick={() => setShowAuthModal(true)}
//         />
//       )}

//       <main className="flex-grow">
//         <Routes>
//           {/* ✅ Root "/" — handled above, but keep as fallback */}
//           <Route path="/" element={<WelcomePage onSectorClick={handleSectorClick} />} />

//           {/* ✅ Main IT Tech website under /homes */}
//           <Route path="/homes" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/contact" element={<ContactSection />} />
//           <Route path="/testimonial" element={<TestimonialPage />} />
//           <Route path="/casestudy" element={<CaseStudyApp />} />

//           <Route path="/career" element={<HouslyCareerPage />} />
//           <Route path="/career/job" element={<CareersPage />} />
//           <Route path="/career/job/:id" element={<JobDetailsPage />} />
//           <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/terms-of-service" element={<TermsOfService />} />
//           <Route path="/cookie-policy" element={<CookiePolicy />} />

//           {/* ✅ Admin routes now under /homes/admin */}
//           <Route 
//             path="/homes/admin" 
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
//             <Route path="case-studies" element={<CaseStudyCMS />} />
//           </Route>
//         </Routes>
//       </main>

//       {!hideLayout && !isAdminRoute && <Footer />}
//       {!hideLayout && !isAdminRoute && <BackToTop />}

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



import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import CaseStudyPage from "./pages/CaseStudy/page";
import HouslyCareerPage from "./pages/Career/page";
import CareersPage from "./pages/Career/job/page";
import JobDetailsPage from "./pages/Career/job/[id]/page";
import JobApplicationPage from "./pages/Career/job/[id]/apply/page";

// Blog Pages
import BlogPage from "./pages/Blog/page";
import BlogDetailPage from "./pages/Blog/[id]/page";

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
import CaseStudyCMS from "./pages/Admin/CaseStudyCMS";

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    setIsChecking(false);
  }, [loading]);

  const handleSectorClick = (sectorId: string) => {
    if (sectorId === "real-estate" || sectorId === "finance") {
      window.location.href = "https://hously.in";
    } else if (sectorId === "it-tech") {
      navigate("/homes");
      window.scrollTo(0, 0);
    }
  };

  const handleAuthSuccess = () => {
    if (isAdmin()) {
      setTimeout(() => {
        window.location.href = '/homes/admin';
      }, 1000);
    } else if (isAuthenticated) {
      toast.success('Welcome back!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // ✅ Welcome page — render completely standalone, no layout at all
  if (location.pathname === "/") {
    return (
      <>
        <VisitorTracker />
        <WelcomePage onSectorClick={handleSectorClick} />
      </>
    );
  }

  const hideLayoutRoutes = [
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/homes/admin",
  ];

  const hideLayout = hideLayoutRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  const isAdminRoute = location.pathname.startsWith('/homes/admin');

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
          {/* ✅ Root "/" — Welcome page fallback */}
          <Route path="/" element={<WelcomePage onSectorClick={handleSectorClick} />} />

          {/* ✅ Main IT Tech website under /homes */}
          <Route path="/homes" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/testimonial" element={<TestimonialPage />} />
<Route path="/casestudy" element={<CaseStudyPage />} />
<Route path="/casestudy/:id" element={<CaseStudyPage />} />
          {/* ✅ Blog routes — outside admin, at top level */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />

          <Route path="/career" element={<HouslyCareerPage />} />
          <Route path="/career/job" element={<CareersPage />} />
          <Route path="/career/job/:id" element={<JobDetailsPage />} />
          <Route path="/career/job/:id/apply" element={<JobApplicationPage />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* ✅ Admin routes under /homes/admin */}
          <Route 
            path="/homes/admin" 
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
            <Route path="case-studies" element={<CaseStudyCMS />} />
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


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
//         window.location.href = '/dashboard';
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
//     "/dashboard",
//   ];

//   const hideLayout = hideLayoutRoutes.some(route => 
//     location.pathname === route || location.pathname.startsWith(route)
//   );

//   const isAdminRoute = location.pathname.startsWith('/dashboard');

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

//           {/* ✅ Admin routes now under /dashboard */}
//           <Route 
//             path="/dashboard" 
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
import HomePage from "./pages/Public/HomePage";
import AboutPage from "./pages/Public/About/page";
import ServicesPage from "./pages/Public/services/page";
import ContactSection from "./pages/Public/Contact/page";
import TestimonialPage from "./pages/Public/Testinomial/page";
import { CaseStudiesPage, CaseStudyDetailsPage } from "./components/CaseStudy";
import ScheduleMeetingPage from "./pages/Public/ScheduleMeeting/page";
import HouslyCareerPage from "./pages/Public/Career/page";
import CareersPage from "./pages/Public/Career/job/page";
import JobDetailsPage from "./pages/Public/Career/job/[id]/page";
import JobApplicationPage from "./pages/Public/Career/job/[id]/apply/page";

// Blog Pages
import BlogPage from "./pages/Public/Blog/page";
import BlogDetailPage from "./pages/Public/Blog/[id]/page";

// Policy Pages
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import CookiePolicy from "./components/CookiePolicy";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import HomeCMS from "./pages/Admin/CMS/HomeCMS";
import ServicesCMS from "./pages/Admin/CMS/ServicesCMS";
import BlogCMS from "./pages/Admin/CMS/BlogCMS";
import CareerCMS from "./pages/Admin/CMS/CareerCMS";
import SettingsCMS from "./pages/Admin/CMS/SettingsCMS";
import Profile from "./pages/Admin/ProfilePage";
import TestimonialsCMS from "./pages/Admin/CMS/TestimonialCMS";
import EnquiriesCMS from "./pages/CRM/Enquiries";
import TeamCMS from "./pages/Admin/CMS/TeamCMS";
import DashboardAnalytics from "./pages/Admin/DashboardAnalytics";
import CaseStudyCMS from "./pages/Admin/CMS/CaseStudyCMS";
import MeetingsCMS from "./pages/CRM/Meetings";
import MasterDataPage from "./pages/master/MasterPage";
import HRMSDashboard from "./pages/Admin/HRMS/Dashboard";
import HRMSEmployees from "./pages/Admin/HRMS/Employees";
import HRMSRecruitment from "./pages/Admin/HRMS/Recruitment";
import HRMSAttendance from "./pages/Admin/HRMS/Attendance";
import HRMSLeaves from "./pages/Admin/HRMS/Leaves";
import HRMSPayroll from "./pages/Admin/HRMS/Payroll";
import HRMSExpenses from "./pages/Admin/HRMS/Expenses";
import HRMSTickets from "./pages/Admin/HRMS/Tickets";
import HRMSDocuments from "./pages/Admin/HRMS/Documents";
import HRMSReports from "./pages/Admin/HRMS/Reports";
import HRMSSettings from "./pages/Admin/HRMS/Settings";
import PermissionsPage from "./pages/Admin/Permissions";
import UsersPage from "./pages/Admin/UsersPage";
import IntegrationsPage from "./pages/Admin/IntegrationsPage";
import ReportsPage from "./pages/Admin/ReportsPage";
import TasksPage from "./pages/Admin/TaskManagement/TasksPage";


import VisitorTracker from "./components/VisitorTracker";
import AuthModal from "./components/auth/AuthModal";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import WhatsAppFAB from "./components/WhatsAppFAB";
import HouslyChatBoot from "./components/HouslyChatbotWidget";

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
        window.location.href = '/dashboard';
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
        <WhatsAppFAB />
        <HouslyChatBoot />
      </>
    );
  }

  const hideLayoutRoutes = [
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/dashboard",
  ];

  const hideLayout = hideLayoutRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  const isAdminRoute = location.pathname.startsWith('/dashboard');

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
          <Route path="/casestudy" element={<CaseStudiesPage />} />
          <Route path="/caseStudyDetails" element={<CaseStudyDetailsPage />} />
          <Route path="/schedule-meeting" element={<ScheduleMeetingPage />} />
          <Route path="/homes/schedule-meeting" element={<ScheduleMeetingPage />} />
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

          {/* ✅ Admin routes under /dashboard */}
          <Route
            path="/dashboard"
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
            <Route path="meetings" element={<MeetingsCMS />} />
            <Route path="master" element={<MasterDataPage />} />
            <Route path="career" element={<CareerCMS />} />
            <Route path="settings" element={<SettingsCMS />} />
            <Route path="profile" element={<Profile />} />
            <Route path="team" element={<TeamCMS />} />
            <Route path="case-studies" element={<CaseStudyCMS />} />

            {/* HRMS Routes */}
            <Route path="hrms/dashboard" element={<HRMSDashboard />} />
            <Route path="hrms/employees" element={<HRMSEmployees />} />
            <Route path="hrms/recruitment" element={<HRMSRecruitment />} />
            <Route path="hrms/attendance" element={<HRMSAttendance />} />
            <Route path="hrms/leaves" element={<HRMSLeaves />} />
            <Route path="hrms/payroll" element={<HRMSPayroll />} />
            <Route path="hrms/expenses" element={<HRMSExpenses />} />
            <Route path="hrms/tickets" element={<HRMSTickets />} />
            <Route path="hrms/documents" element={<HRMSDocuments />} />
            <Route path="hrms/reports" element={<HRMSReports />} />
            <Route path="hrms/settings" element={<HRMSSettings />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
        </Routes>
      </main>

      {!hideLayout && !isAdminRoute && <Footer />}
      {!hideLayout && !isAdminRoute && <BackToTop />}
      {!hideLayout && !isAdminRoute && <WhatsAppFAB />}
      {!hideLayout && !isAdminRoute && <HouslyChatBoot />}

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
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/images/hously-logo.png";
// import { Cookie } from "lucide-react";

// export default function TermsOfService() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check if user came from welcome page
//   const fromWelcome = location.state?.fromWelcome === true;

//   const handleBack = () => {
//     if (fromWelcome) {
//       // Redirect to Welcome Page by setting showWelcome=true
//       window.location.href = "/?welcome=true";
//     } else {
//       // Go to Home Page
//       navigate("/");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Logo Button */}
//     <button
//   onClick={handleBack}
//   className="fixed top-4 left-4 md:top-6 md:left-6 z-40 
//              hover:scale-105 transition-transform duration-300 
//              cursor-pointer"
// >
//   <img
//     src={logo}
//     alt="Hously Logo"
//     className="h-10 w-auto md:h-16 object-contain drop-shadow-2xl pointer-events-none"
//   />
// </button>


//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
//         {/* Back Button - Responsive spacing */}
//         {/* <button
//           onClick={handleBack}
//           className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 mb-6 md:mb-8 group"
//         >
//           <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
//           <span className="text-sm md:text-base">Back to Home</span>
//         </button> */}

//         <div className="max-w-4xl mx-auto">
//           {/* Header Section - Responsive layout */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
//             <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
//               <Cookie className="w-6 h-6 md:w-8 md:h-8 text-white" />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Cookie Policy</h1>
//               <p className="text-sm sm:text-base text-slate-400">Last updated: December 8, 2024</p>
//             </div>
//           </div>

//           {/* Main Content - Responsive padding and spacing */}
//           <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-slate-300">
            
//             {/* What Are Cookies */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">What Are Cookies</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. HOUSLY FINNTECH REALTY uses cookies to enhance your browsing experience and analyze how our website is used.
//               </p>
//             </section>

//             {/* How We Use Cookies */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">How We Use Cookies</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 We use cookies for several purposes:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">To enable certain functions and features of our website</li>
//                 <li className="text-sm sm:text-base">To remember your preferences and settings</li>
//                 <li className="text-sm sm:text-base">To authenticate users and prevent fraudulent use</li>
//                 <li className="text-sm sm:text-base">To analyze how visitors use our website and track website performance</li>
//                 <li className="text-sm sm:text-base">To deliver relevant content and advertisements</li>
//                 <li className="text-sm sm:text-base">To understand the effectiveness of our marketing campaigns</li>
//               </ul>
//             </section>

//             {/* Types of Cookies We Use */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Types of Cookies We Use</h2>
//               <div className="space-y-4 md:space-y-6">
//                 {/* Essential Cookies */}
//                 <div>
//                   <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Essential Cookies</h3>
//                   <p className="text-sm sm:text-base leading-relaxed">
//                     These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication. The website cannot function properly without these cookies.
//                   </p>
//                   <div className="mt-2 md:mt-3 p-3 md:p-4 bg-slate-700/50 rounded-lg">
//                     <p className="text-xs sm:text-sm"><strong>Examples:</strong> Session cookies, security cookies, load balancing cookies</p>
//                     <p className="text-xs sm:text-sm mt-1 md:mt-2"><strong>Duration:</strong> Session or up to 24 hours</p>
//                   </div>
//                 </div>

//                 {/* Analytics and Performance Cookies */}
//                 <div>
//                   <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Analytics and Performance Cookies</h3>
//                   <p className="text-sm sm:text-base leading-relaxed">
//                     These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's functionality and user experience.
//                   </p>
//                   <div className="mt-2 md:mt-3 p-3 md:p-4 bg-slate-700/50 rounded-lg">
//                     <p className="text-xs sm:text-sm"><strong>Examples:</strong> Google Analytics, website analytics tools</p>
//                     <p className="text-xs sm:text-sm mt-1 md:mt-2"><strong>Duration:</strong> Up to 2 years</p>
//                   </div>
//                 </div>

//                 {/* Functionality Cookies */}
//                 <div>
//                   <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Functionality Cookies</h3>
//                   <p className="text-sm sm:text-base leading-relaxed">
//                     These cookies allow the website to remember choices you make (such as your language preference or region) and provide enhanced, personalized features.
//                   </p>
//                   <div className="mt-2 md:mt-3 p-3 md:p-4 bg-slate-700/50 rounded-lg">
//                     <p className="text-xs sm:text-sm"><strong>Examples:</strong> Language preferences, region settings, customization options</p>
//                     <p className="text-xs sm:text-sm mt-1 md:mt-2"><strong>Duration:</strong> Up to 1 year</p>
//                   </div>
//                 </div>

//                 {/* Targeting and Advertising Cookies */}
//                 <div>
//                   <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Targeting and Advertising Cookies</h3>
//                   <p className="text-sm sm:text-base leading-relaxed">
//                     These cookies are used to deliver advertisements more relevant to you and your interests. They also help limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
//                   </p>
//                   <div className="mt-2 md:mt-3 p-3 md:p-4 bg-slate-700/50 rounded-lg">
//                     <p className="text-xs sm:text-sm"><strong>Examples:</strong> Advertising network cookies, social media cookies</p>
//                     <p className="text-xs sm:text-sm mt-1 md:mt-2"><strong>Duration:</strong> Up to 2 years</p>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Third-Party Cookies */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Third-Party Cookies</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality. Third-party services we may use include:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base"><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
//                 <li className="text-sm sm:text-base"><strong>Social Media Platforms:</strong> To enable social sharing and track engagement</li>
//                 <li className="text-sm sm:text-base"><strong>Advertising Networks:</strong> To deliver targeted advertisements</li>
//                 <li className="text-sm sm:text-base"><strong>Customer Support Tools:</strong> To provide chat and support functionality</li>
//               </ul>
//               <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
//                 These third parties have their own privacy policies, and we have no control over their cookies. We recommend reviewing their privacy policies for more information.
//               </p>
//             </section>

//             {/* Managing Cookies */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Managing Cookies</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways:
//               </p>

//               <div className="space-y-3 md:space-y-4">
//                 {/* Browser Controls */}
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Browser Controls</h3>
//                   <p className="text-sm sm:text-base leading-relaxed mb-1 md:mb-2">
//                     Most web browsers allow you to control cookies through their settings. You can set your browser to:
//                   </p>
//                   <ul className="list-disc list-inside space-y-0.5 md:space-y-1 ml-2 md:ml-4 text-xs sm:text-sm">
//                     <li>Block all cookies</li>
//                     <li>Block third-party cookies only</li>
//                     <li>Delete cookies when you close your browser</li>
//                     <li>Notify you before cookies are stored</li>
//                   </ul>
//                 </div>

//                 {/* Browser-Specific Instructions */}
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Browser-Specific Instructions</h3>
//                   <ul className="list-disc list-inside space-y-0.5 md:space-y-1 ml-2 md:ml-4 text-xs sm:text-sm">
//                     <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
//                     <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
//                     <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
//                     <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
//                   </ul>
//                 </div>

//                 {/* Opt-Out Tools */}
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Opt-Out Tools</h3>
//                   <p className="text-xs sm:text-sm leading-relaxed">
//                     You can also use industry opt-out tools to manage advertising cookies:
//                   </p>
//                   <ul className="list-disc list-inside space-y-0.5 md:space-y-1 ml-2 md:ml-4 text-xs sm:text-sm">
//                     <li>Network Advertising Initiative (NAI): <span className="text-blue-400 break-all">optout.networkadvertising.org</span></li>
//                     <li>Digital Advertising Alliance (DAA): <span className="text-blue-400 break-all">optout.aboutads.info</span></li>
//                     <li>European Interactive Digital Advertising Alliance (EDAA): <span className="text-blue-400 break-all">youronlinechoices.eu</span></li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Important Note */}
//               <div className="mt-4 md:mt-6 p-3 md:p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
//                 <p className="text-amber-200 text-xs sm:text-sm">
//                   <strong>Important:</strong> If you choose to block or delete cookies, some parts of our website may not function properly, and your user experience may be affected.
//                 </p>
//               </div>
//             </section>

//             {/* Do Not Track Signals */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Do Not Track Signals</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to have your online activity tracked. Currently, there is no uniform standard for how DNT signals should be interpreted. We do not currently respond to DNT signals, but we are committed to providing you with choices about the collection and use of your information.
//               </p>
//             </section>

//             {/* Mobile Device Identifiers */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Mobile Device Identifiers</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 When you access our services through a mobile device, we may collect device identifiers and other information about your device. You can reset your device's advertising identifier or limit ad tracking in your device settings:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4 mt-2 md:mt-4">
//                 <li className="text-sm sm:text-base"><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
//                 <li className="text-sm sm:text-base"><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
//               </ul>
//             </section>

//             {/* Cookie Retention */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Cookie Retention</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Different cookies have different retention periods:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4 mt-2 md:mt-4">
//                 <li className="text-sm sm:text-base"><strong>Session Cookies:</strong> Deleted when you close your browser</li>
//                 <li className="text-sm sm:text-base"><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
//               </ul>
//               <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
//                 We regularly review our cookie retention periods to ensure they are necessary and appropriate for the purposes for which they were set.
//               </p>
//             </section>

//             {/* Updates to This Policy */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Updates to This Policy</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post any changes on this page and update the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we use cookies.
//               </p>
//             </section>

//             {/* More Information */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">More Information</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 For more information about our use of cookies and how we protect your privacy, please review our Privacy Policy. If you have specific questions about cookies, please contact us:
//               </p>
//               <div className="space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <p className="text-sm sm:text-base">Email: careers@hously.in</p>
//                 <p className="text-sm sm:text-base">Phone: +919371009381</p>
//                 <p className="text-sm sm:text-base">Address: First Floor, Tamara Uprise, Pune, 411017</p>
//               </div>
//             </section>

//             {/* Your Consent */}
//             <section className="border-t border-slate-700 pt-4 md:pt-6">
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Your Consent</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. If you do not agree to our use of cookies, please adjust your browser settings or discontinue use of our website.
//               </p>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";
import { Cookie, Shield, Clock, Globe, Lock, Smartphone, ChevronRight } from "lucide-react";

export default function TermsOfService() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromWelcome = location.state?.fromWelcome === true;

  const handleBack = () => {
    if (fromWelcome) {
      window.location.href = "/?welcome=true";
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Logo Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-40 
                   hover:scale-105 transition-transform duration-300 
                   cursor-pointer group"
      >
        <img
          src={logo}
          alt="Hously Logo"
          className="h-10 w-auto md:h-14 object-contain drop-shadow-2xl pointer-events-none"
        />
      </button>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-8 sm:mb-10 md:mb-12">
            <div className="p-3 bg-gradient-to-br from-[#0270e1] to-[#024a9e] rounded-xl shadow-lg">
              <Cookie className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5">
                Cookie Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Last updated: December 8, 2024
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 md:p-8 space-y-6 md:space-y-8">
            
            {/* What Are Cookies */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  What Are Cookies
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-3">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. <span className="text-[#0270e1] font-semibold">HOUSLY FINNTECH REALTY</span> uses cookies to enhance your browsing experience and analyze how our website is used.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  How We Use Cookies
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                We use cookies for several purposes:
              </p>
              <ul className="space-y-1.5 pl-3">
                {[
                  "To enable certain functions and features of our website",
                  "To remember your preferences and settings",
                  "To authenticate users and prevent fraudulent use",
                  "To analyze how visitors use our website and track website performance",
                  "To deliver relevant content and advertisements",
                  "To understand the effectiveness of our marketing campaigns"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0270e1] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Types of Cookies We Use */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Types of Cookies We Use
                </h2>
              </div>
              <div className="space-y-4 pl-3">
                {/* Essential Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Essential Cookies</h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-2">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication.
                  </p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-400"><span className="text-white font-medium">Examples:</span> Session cookies, security cookies, load balancing cookies</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1"><span className="text-white font-medium">Duration:</span> Session or up to 24 hours</p>
                  </div>
                </div>

                {/* Analytics and Performance Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Analytics and Performance Cookies</h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-2">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-400"><span className="text-white font-medium">Examples:</span> Google Analytics, website analytics tools</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1"><span className="text-white font-medium">Duration:</span> Up to 2 years</p>
                  </div>
                </div>

                {/* Functionality Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Functionality Cookies</h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-2">
                    These cookies allow the website to remember choices you make and provide enhanced, personalized features.
                  </p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-400"><span className="text-white font-medium">Examples:</span> Language preferences, region settings, customization options</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1"><span className="text-white font-medium">Duration:</span> Up to 1 year</p>
                  </div>
                </div>

                {/* Targeting and Advertising Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-orange-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Targeting and Advertising Cookies</h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-2">
                    These cookies are used to deliver advertisements more relevant to you and your interests.
                  </p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs sm:text-sm text-slate-400"><span className="text-white font-medium">Examples:</span> Advertising network cookies, social media cookies</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1"><span className="text-white font-medium">Duration:</span> Up to 2 years</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Third-Party Cookies
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality.
              </p>
              <ul className="space-y-1.5 pl-3">
                {[
                  "Google Analytics - To analyze website traffic and user behavior",
                  "Social Media Platforms - To enable social sharing and track engagement",
                  "Advertising Networks - To deliver targeted advertisements",
                  "Customer Support Tools - To provide chat and support functionality"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0270e1] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Managing Cookies */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Managing Cookies
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4 pl-3">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways:
              </p>

              <div className="space-y-4 pl-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-2">Browser Controls</h3>
                  <p className="text-sm text-slate-300 mb-2">Most web browsers allow you to control cookies through their settings. You can set your browser to:</p>
                  <ul className="space-y-1">
                    {["Block all cookies", "Block third-party cookies only", "Delete cookies when you close your browser", "Notify you before cookies are stored"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 bg-[#0270e1] rounded-full mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-base font-semibold text-white mb-2">Browser-Specific Instructions</h3>
                  <ul className="space-y-1">
                    <li className="text-sm text-slate-300"><span className="text-white">Chrome:</span> Settings → Privacy and security → Cookies and other site data</li>
                    <li className="text-sm text-slate-300"><span className="text-white">Firefox:</span> Options → Privacy & Security → Cookies and Site Data</li>
                    <li className="text-sm text-slate-300"><span className="text-white">Safari:</span> Preferences → Privacy → Cookies and website data</li>
                    <li className="text-sm text-slate-300"><span className="text-white">Edge:</span> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mx-3">
                <p className="text-amber-300 text-xs sm:text-sm">
                  <strong>Important:</strong> If you choose to block or delete cookies, some parts of our website may not function properly, and your user experience may be affected.
                </p>
              </div>
            </section>

            {/* Mobile Device Identifiers */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Mobile Device Identifiers
                </h2>
              </div>
              <div className="pl-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3">
                  When you access our services through a mobile device, we may collect device identifiers. You can reset your device's advertising identifier in your device settings:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300"><span className="text-white font-medium">iOS:</span> Settings → Privacy → Advertising → Limit Ad Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <Smartphone className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300"><span className="text-white font-medium">Android:</span> Settings → Google → Ads → Opt out of Ads Personalization</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates and Contact */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  More Information
                </h2>
              </div>
              <div className="pl-3 space-y-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  For more information about our use of cookies and how we protect your privacy, please review our Privacy Policy. If you have specific questions about cookies, please contact us:
                </p>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-slate-300">📧 <span className="text-white">Email:</span> careers@hously.in</p>
                  <p className="text-sm text-slate-300">📞 <span className="text-white">Phone:</span> +919371009381</p>
                  <p className="text-sm text-slate-300">📍 <span className="text-white">Address:</span> First Floor, Tamara Uprise, Pune, 411017</p>
                </div>
              </div>
            </section>

            {/* Your Consent */}
            <section className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Your Consent
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-3">
                By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. If you do not agree to our use of cookies, please adjust your browser settings or discontinue use of our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
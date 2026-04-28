// import { Shield } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/images/hously-logo.png";

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
//      <button
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
//               <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
//               <p className="text-sm sm:text-base text-slate-400">Last updated: December 8, 2024</p>
//             </div>
//           </div>

//           {/* Main Content - Responsive padding and spacing */}
//           <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-slate-300">
            
//             {/* Introduction */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Introduction</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 HOUSLY FINNTECH REALTY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services across real estate, financial technology, and IT sectors.
//               </p>
//             </section>

//             {/* Information We Collect */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Information We Collect</h2>
              
//               <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Personal Information</h3>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 We may collect personal information that you voluntarily provide to us when you:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Register for an account</li>
//                 <li className="text-sm sm:text-base">Request information about our properties or services</li>
//                 <li className="text-sm sm:text-base">Subscribe to our newsletter</li>
//                 <li className="text-sm sm:text-base">Fill out a contact form</li>
//                 <li className="text-sm sm:text-base">Apply for financing or investment opportunities</li>
//               </ul>
//               <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
//                 This information may include: name, email address, phone number, mailing address, financial information, employment information, and other details relevant to your inquiry or transaction.
//               </p>

//               <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3 mt-4 md:mt-6">Automatically Collected Information</h3>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device. We also collect information about your browsing behavior and interaction with our website.
//               </p>
//             </section>

//             {/* How We Use Your Information */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">How We Use Your Information</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">We use the information we collect to:</p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Provide, operate, and maintain our services</li>
//                 <li className="text-sm sm:text-base">Process transactions and send related information</li>
//                 <li className="text-sm sm:text-base">Send you marketing and promotional communications</li>
//                 <li className="text-sm sm:text-base">Respond to your inquiries and provide customer support</li>
//                 <li className="text-sm sm:text-base">Improve and personalize your experience</li>
//                 <li className="text-sm sm:text-base">Analyze usage trends and optimize our website</li>
//                 <li className="text-sm sm:text-base">Detect, prevent, and address technical issues or fraudulent activity</li>
//                 <li className="text-sm sm:text-base">Comply with legal obligations</li>
//               </ul>
//             </section>

//             {/* Information Sharing and Disclosure */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Information Sharing and Disclosure</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 We may share your information in the following circumstances:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base"><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf</li>
//                 <li className="text-sm sm:text-base"><strong>Business Partners:</strong> We may share information with trusted business partners to provide you with products or services</li>
//                 <li className="text-sm sm:text-base"><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests</li>
//                 <li className="text-sm sm:text-base"><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
//                 <li className="text-sm sm:text-base"><strong>With Your Consent:</strong> We may share your information for any other purpose with your consent</li>
//               </ul>
//             </section>

//             {/* Data Security */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Data Security</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
//               </p>
//             </section>

//             {/* Your Rights and Choices */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Your Rights and Choices</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">Depending on your location, you may have the following rights:</p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Access to your personal information</li>
//                 <li className="text-sm sm:text-base">Correction of inaccurate data</li>
//                 <li className="text-sm sm:text-base">Deletion of your personal information</li>
//                 <li className="text-sm sm:text-base">Restriction of processing</li>
//                 <li className="text-sm sm:text-base">Data portability</li>
//                 <li className="text-sm sm:text-base">Objection to processing</li>
//                 <li className="text-sm sm:text-base">Withdrawal of consent</li>
//               </ul>
//               <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
//                 To exercise these rights, please contact us using the information provided below.
//               </p>
//             </section>

//             {/* Cookies and Tracking Technologies */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Cookies and Tracking Technologies</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
//               </p>
//             </section>

//             {/* Third-Party Links */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Third-Party Links</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
//               </p>
//             </section>

//             {/* Children's Privacy */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Children's Privacy</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
//               </p>
//             </section>

//             {/* Changes to This Privacy Policy */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Changes to This Privacy Policy</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
//               </p>
//             </section>

//             {/* Contact Us */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Contact Us</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 If you have any questions about this Privacy Policy, please contact us:
//               </p>
//               <div className="space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <p className="text-sm sm:text-base">Email: careers@hously.in</p>
//                 <p className="text-sm sm:text-base">Phone: +919371009381</p>
//                 <p className="text-sm sm:text-base">Address: First Floor, Tamara Uprise, Pune, 411017</p>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Shield, Sparkles, Eye, Database, Lock, Globe, Bell, Smartphone, ChevronRight, FileText, Users, Fingerprint, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function PrivacyPolicy() {
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
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5">
                Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Last updated: December 8, 2024
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 md:p-8 space-y-6 md:space-y-8">
            
            {/* Introduction */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Introduction
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-3">
                HOUSLY FINNTECH REALTY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services across real estate, financial technology, and IT sectors.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Information We Collect
                </h2>
              </div>
              
              <div className="space-y-4 pl-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Personal Information
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      "Register for an account",
                      "Request information about our properties or services",
                      "Subscribe to our newsletter",
                      "Fill out a contact form",
                      "Apply for financing or investment opportunities"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0270e1] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-3">
                    This information may include: name, email address, phone number, mailing address, financial information, employment information, and other details relevant to your inquiry or transaction.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Automatically Collected Information
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device. We also collect information about your browsing behavior and interaction with our website.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                We use the information we collect to:
              </p>
              <ul className="space-y-1.5 pl-3">
                {[
                  "Provide, operate, and maintain our services",
                  "Process transactions and send related information",
                  "Send you marketing and promotional communications",
                  "Respond to your inquiries and provide customer support",
                  "Improve and personalize your experience",
                  "Analyze usage trends and optimize our website",
                  "Detect, prevent, and address technical issues or fraudulent activity",
                  "Comply with legal obligations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0270e1] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Information Sharing and Disclosure
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                We may share your information in the following circumstances:
              </p>
              <ul className="space-y-1.5 pl-3">
                {[
                  "<strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf",
                  "<strong>Business Partners:</strong> We may share information with trusted business partners to provide you with products or services",
                  "<strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests",
                  "<strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition",
                  "<strong>With Your Consent:</strong> We may share your information for any other purpose with your consent"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0270e1] mt-0.5 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Security */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Data Security
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.</span>
                </p>
              </div>
            </section>

            {/* Your Rights and Choices */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Your Rights and Choices
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                Depending on your location, you may have the following rights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                {[
                  "Access to your personal information",
                  "Correction of inaccurate data",
                  "Deletion of your personal information",
                  "Restriction of processing",
                  "Data portability",
                  "Objection to processing",
                  "Withdrawal of consent"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#0270e1] rounded-full"></div>
                    <span className="text-sm sm:text-base text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-3 pl-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Cookies and Tracking Technologies
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</span>
                </p>
              </div>
            </section>

            {/* Third-Party Links & Children's Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Third-Party Links
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Children's Privacy
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </div>
              </section>
            </div>

            {/* Changes to This Privacy Policy */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Changes to This Privacy Policy
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed flex items-start gap-2">
                  <Bell className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</span>
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Contact Us
                </h2>
              </div>
              <div className="pl-3 space-y-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-slate-300">📧 <span className="text-white">Email:</span> careers@hously.in</p>
                  <p className="text-sm text-slate-300">📞 <span className="text-white">Phone:</span> +919371009381</p>
                  <p className="text-sm text-slate-300">📍 <span className="text-white">Address:</span> First Floor, Tamara Uprise, Pune, 411017</p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500">
                © 2024 HOUSLY FINNTECH REALTY. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



import { Shield, Sparkles, Eye, Database, Lock, Globe, Bell, Smartphone, ChevronRight, FileText, Users, Fingerprint, Clock, ArrowLeft } from "lucide-react";
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
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed Header - Logo Left, Back Button Right */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo on Left */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
            >
              <img
                src={logo}
                alt="Hously Logo"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </button>

            {/* Back to Home Button on Right */}
            
          </div>
        </div>
      </div>

      {/* Main Content with proper padding for fixed header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <button
              onClick={handleBack}
              className="flex items-center gap-2 group bg-white/5 hover:bg-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 border border-white/10 hover:border-[#0270e1]/50 -mt-0 sm:-mt-8"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#0270e1] group-hover:-translate-x-1 transition-all duration-300" />
              <span className="text-sm sm:text-base text-slate-300 group-hover:text-white font-medium">
                Back to Home
              </span>
            </button>
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-5 mt-3">
            <div className="p-3 bg-gradient-to-br from-[#0270e1] to-[#024a9e] rounded-xl shadow-lg flex-shrink-0">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>

            <div className="flex-1">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-white mb-1">
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
                  <Lock className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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
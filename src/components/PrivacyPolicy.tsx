import { Shield, ChevronRight, ArrowLeft, Lock, Users, Globe, Bell, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromWelcome = location.state?.fromWelcome === true;

  const handleBack = () => {
    navigate("/");
  };

  const sections = [
    { id: "intro", title: "1. Introduction" },
    { id: "collect", title: "2. Information We Collect" },
    { id: "use", title: "3. How We Use Information" },
    { id: "sharing", title: "4. Sharing & Disclosure" },
    { id: "security", title: "5. Data Security" },
    { id: "rights", title: "6. Your Rights & Choices" },
    { id: "cookies", title: "7. Cookies & Tracking" },
    { id: "thirdparty", title: "8. Third-Party Links" },
    { id: "changes", title: "9. Changes to Policy" },
    { id: "contact", title: "10. Contact Us" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-text">
      {/* Sticky Header */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo on Left */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Hously Logo"
                className="h-8 sm:h-9 object-contain cursor-pointer transition-opacity hover:opacity-90"
                onClick={handleBack}
              />
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Legal & Privacy</span>
            </div>

            {/* Back Button on Right */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-balck-600  text-white rounded-full px-4 py-1.5 transition-all text-xs font-bold active:scale-95 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content container */}
      <div className="flex-1 w-full py-12 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Left Column: Sticky Sidebar Index */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-2 border-l border-slate-100 pl-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-4">Table of Contents</span>
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-1"
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column: Actual Policy Content */}
            <div className="lg:col-span-3 space-y-12">

              {/* Header Section */}
              <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 shadow-sm flex-shrink-0">
                    <Shield className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Privacy Policy
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Effective Date: December 8, 2024
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-505 max-w-2xl leading-relaxed">
                  We value your trust and are committed to safeguarding your personal data. Below is a comprehensive disclosure of how we collect, process, and protect your information across our Real Estate, FinTech, and IT divisions.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="space-y-10">

                {/* Introduction */}
                <section id="intro" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      1. Introduction
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    HOUSLY FINNTECH REALTY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services across real estate, financial technology, and IT sectors.
                  </p>
                </section>

                {/* Information We Collect */}
                <section id="collect" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      2. Information We Collect
                    </h2>
                  </div>

                  <div className="space-y-4 pl-3.5">
                    <div className="space-y-2">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Personal Information
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
                          <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
                        This information may include: name, email address, phone number, mailing address, financial information, employment information, and other details relevant to your inquiry or transaction.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        Automatically Collected Information
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device. We also collect information about your browsing behavior and interaction with our website.
                      </p>
                    </div>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section id="use" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      3. How We Use Your Information
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    We use the information we collect to:
                  </p>
                  <ul className="space-y-1.5 pl-3.5">
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
                      <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Information Sharing and Disclosure */}
                <section id="sharing" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      4. Information Sharing and Disclosure
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="space-y-1.5 pl-3.5">
                    {[
                      "<strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf",
                      "<strong>Business Partners:</strong> We may share information with trusted business partners to provide you with products or services",
                      "<strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests",
                      "<strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition",
                      "<strong>With Your Consent:</strong> We may share your information for any other purpose with your consent"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Data Security */}
                <section id="security" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      5. Data Security
                    </h2>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 ml-3.5 max-w-3xl">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.</span>
                    </p>
                  </div>
                </section>

                {/* Your Rights and Choices */}
                <section id="rights" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      6. Your Rights and Choices
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    Depending on your location, you may have the following rights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3.5 max-w-2xl">
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
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-xs sm:text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 pl-3.5">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </section>

                {/* Cookies and Tracking Technologies */}
                <section id="cookies" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      7. Cookies and Tracking Technologies
                    </h2>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 ml-3.5 max-w-3xl">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</span>
                    </p>
                  </div>
                </section>

                {/* Third-Party Links & Children's Privacy */}
                <section id="thirdparty" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      8. Third-Party Links & Children's Privacy
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Third-Party Links</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Children's Privacy</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Changes to This Privacy Policy */}
                <section id="changes" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      9. Changes to This Privacy Policy
                    </h2>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 ml-3.5 max-w-3xl">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                      <Bell className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</span>
                    </p>
                  </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      10. Contact Us
                    </h2>
                  </div>
                  <div className="pl-3.5 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-2 max-w-md">
                      <p className="text-xs text-slate-600">📧 <span className="text-slate-800 font-bold">Email:</span> careers@hously.in</p>
                      <p className="text-xs text-slate-600">📞 <span className="text-slate-800 font-bold">Phone:</span> +919371009381</p>
                      <p className="text-xs text-slate-600">📍 <span className="text-slate-800 font-bold">Address:</span> First Floor, Tamara Uprise, Pune, 411017</p>
                    </div>
                  </div>
                </section>

              </div>

              {/* Footer Note */}
              <div className="text-center pt-8 border-t border-slate-100">
                <p className="text-[10px] text-slate-400">
                  © {new Date().getFullYear()} HOUSLY FINNTECH REALTY. All rights reserved.
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
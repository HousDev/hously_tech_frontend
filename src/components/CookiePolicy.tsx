import { Cookie, Shield, Clock, Globe, Lock, Smartphone, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function CookiePolicy() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromWelcome = location.state?.fromWelcome === true;

  const handleBack = () => {
    navigate("/");
  };

  const sections = [
    { id: "cookies-definition", title: "1. What Are Cookies" },
    { id: "cookies-usage", title: "2. How We Use Cookies" },
    { id: "cookies-types", title: "3. Types of Cookies" },
    { id: "cookies-thirdparty", title: "4. Third-Party Cookies" },
    { id: "cookies-managing", title: "5. Managing Cookies" },
    { id: "cookies-mobile", title: "6. Mobile Identifiers" },
    { id: "cookies-dnt", title: "7. Do Not Track" },
    { id: "cookies-retention", title: "8. Cookie Retention" },
    { id: "cookies-updates", title: "9. Updates to Policy" },
    { id: "cookies-more", title: "10. More Information" },
    { id: "cookies-consent", title: "11. Your Consent" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-text">
      {/* Sticky Header */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60">
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
                    <Cookie className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Cookie Policy
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Effective Date: December 8, 2024
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-505 max-w-2xl leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, track usage patterns, and provide personalized services. Below is a detailed breakdown of the cookies we use and how you can manage them.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="space-y-10">

                {/* What Are Cookies */}
                <section id="cookies-definition" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      1. What Are Cookies
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. <span className="text-blue-600 font-semibold">HOUSLY FINNTECH REALTY</span> uses cookies to enhance your browsing experience and analyze how our website is used.
                  </p>
                </section>

                {/* How We Use Cookies */}
                <section id="cookies-usage" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      2. How We Use Cookies
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    We use cookies for several purposes:
                  </p>
                  <ul className="space-y-1.5 pl-3.5">
                    {[
                      "To enable certain functions and features of our website",
                      "To remember your preferences and settings",
                      "To authenticate users and prevent fraudulent use",
                      "To analyze how visitors use our website and track website performance",
                      "To deliver relevant content and advertisements",
                      "To understand the effectiveness of our marketing campaigns"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Types of Cookies We Use */}
                <section id="cookies-types" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      3. Types of Cookies We Use
                    </h2>
                  </div>
                  <div className="space-y-4 pl-3.5">
                    {/* Essential Cookies */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Essential Cookies</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                        These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication. The website cannot function properly without these cookies.
                      </p>
                      <div className="mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                        <p className="text-[11px] text-slate-500"><span className="text-slate-700 font-bold">Examples:</span> Session cookies, security cookies, load balancing cookies</p>
                        <p className="text-[11px] text-slate-500 mt-1"><span className="text-slate-700 font-bold">Duration:</span> Session or up to 24 hours</p>
                      </div>
                    </div>

                    {/* Analytics and Performance Cookies */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Analytics and Performance Cookies</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's functionality and user experience.
                      </p>
                      <div className="mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                        <p className="text-[11px] text-slate-500"><span className="text-slate-700 font-bold">Examples:</span> Google Analytics, website analytics tools</p>
                        <p className="text-[11px] text-slate-500 mt-1"><span className="text-slate-700 font-bold">Duration:</span> Up to 2 years</p>
                      </div>
                    </div>

                    {/* Functionality Cookies */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Functionality Cookies</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                        These cookies allow the website to remember choices you make (such as your language preference or region) and provide enhanced, personalized features.
                      </p>
                      <div className="mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                        <p className="text-[11px] text-slate-500"><span className="text-slate-700 font-bold">Examples:</span> Language preferences, region settings, customization options</p>
                        <p className="text-[11px] text-slate-500 mt-1"><span className="text-slate-700 font-bold">Duration:</span> Up to 1 year</p>
                      </div>
                    </div>

                    {/* Targeting and Advertising Cookies */}
                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-orange-600" />
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">Targeting and Advertising Cookies</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                        These cookies are used to deliver advertisements more relevant to you and your interests. They also help limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                      </p>
                      <div className="mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                        <p className="text-[11px] text-slate-500"><span className="text-slate-700 font-bold">Examples:</span> Advertising network cookies, social media cookies</p>
                        <p className="text-[11px] text-slate-500 mt-1"><span className="text-slate-700 font-bold">Duration:</span> Up to 2 years</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Third-Party Cookies */}
                <section id="cookies-thirdparty" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      4. Third-Party Cookies
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide enhanced functionality. Third-party services we may use include:
                  </p>
                  <ul className="space-y-1.5 pl-3.5">
                    {[
                      "Google Analytics: To analyze website traffic and user behavior",
                      "Social Media Platforms: To enable social sharing and track engagement",
                      "Advertising Networks: To deliver targeted advertisements",
                      "Customer Support Tools: To provide chat and support functionality"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-600">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 mt-3 pl-3.5">
                    These third parties have their own privacy policies, and we have no control over their cookies. We recommend reviewing their privacy policies for more information.
                  </p>
                </section>

                {/* Managing Cookies */}
                <section id="cookies-managing" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      5. Managing Cookies
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 pl-3.5">
                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways:
                  </p>

                  <div className="space-y-4 pl-3.5">
                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-2">Browser Controls</h3>
                      <p className="text-xs text-slate-500 mb-2">Most web browsers allow you to control cookies through their settings. You can set your browser to:</p>
                      <ul className="space-y-1">
                        {["Block all cookies", "Block third-party cookies only", "Delete cookies when you close your browser", "Notify you before cookies are stored"].map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-2">Browser-Specific Instructions</h3>
                      <ul className="space-y-1">
                        <li className="text-xs text-slate-600"><span className="text-slate-800 font-bold">Chrome:</span> Settings → Privacy and security → Cookies and other site data</li>
                        <li className="text-xs text-slate-600"><span className="text-slate-800 font-bold">Firefox:</span> Options → Privacy & Security → Cookies and Site Data</li>
                        <li className="text-xs text-slate-600"><span className="text-slate-800 font-bold">Safari:</span> Preferences → Privacy → Cookies and website data</li>
                        <li className="text-xs text-slate-600"><span className="text-slate-800 font-bold">Edge:</span> Settings → Cookies and site permissions → Cookies and site data</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl mx-3.5">
                    <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold">Important:</span> If you choose to block or delete cookies, some parts of our website may not function properly, and your user experience may be affected.
                    </p>
                  </div>
                </section>

                {/* Mobile Device Identifiers */}
                <section id="cookies-mobile" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      6. Mobile Device Identifiers
                    </h2>
                  </div>
                  <div className="pl-3.5">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                      When you access our services through a mobile device, we may collect device identifiers and other information about your device. You can reset your device's advertising identifier or limit ad tracking in your device settings:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-slate-600"><span className="text-slate-800 font-bold">iOS:</span> Settings → Privacy → Advertising → Limit Ad Tracking</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-slate-600"><span className="text-slate-800 font-bold">Android:</span> Settings → Google → Ads → Opt out of Ads Personalization</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Do Not Track Signals */}
                <section id="cookies-dnt" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      7. Do Not Track Signals
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to have your online activity tracked. Currently, there is no uniform standard for how DNT signals should be interpreted. We do not currently respond to DNT signals, but we are committed to providing you with choices about the collection and use of your information.
                  </p>
                </section>

                {/* Cookie Retention */}
                <section id="cookies-retention" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      8. Cookie Retention
                    </h2>
                  </div>
                  <div className="pl-3.5">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                      Different cookies have different retention periods:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <p className="text-blue-600 font-bold text-xs">Session Cookies</p>
                        <p className="text-xs text-slate-505 mt-0.5">Deleted when you close your browser</p>
                      </div>
                      <div className="flex-1 p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                        <p className="text-blue-600 font-bold text-xs">Persistent Cookies</p>
                        <p className="text-xs text-slate-505 mt-0.5">Remain on your device for a set period or until manually deleted</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-550 leading-relaxed mt-3">
                      We regularly review our cookie retention periods to ensure they are necessary and appropriate for the purposes for which they were set.
                    </p>
                  </div>
                </section>

                {/* Updates to Policy */}
                <section id="cookies-updates" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      9. Updates to Policy
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post any changes on this page and update the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we use cookies.
                  </p>
                </section>

                {/* More Information */}
                <section id="cookies-more" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      10. More Information
                    </h2>
                  </div>
                  <div className="pl-3.5 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      For more information about our use of cookies and how we protect your privacy, please review our Privacy Policy. If you have specific questions about cookies, please contact us:
                    </p>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-2 max-w-md">
                      <p className="text-xs text-slate-600">📧 <span className="text-slate-800 font-bold">Email:</span> careers@hously.in</p>
                      <p className="text-xs text-slate-600">📞 <span className="text-slate-800 font-bold">Phone:</span> +919371009381</p>
                      <p className="text-xs text-slate-600">📍 <span className="text-slate-800 font-bold">Address:</span> First Floor, Tamara Uprise, Pune, 411017</p>
                    </div>
                  </div>
                </section>

                {/* Your Consent */}
                <section id="cookies-consent" className="scroll-mt-24 border-t border-slate-100 pt-4 mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      11. Your Consent
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. If you do not agree to our use of cookies, please adjust your browser settings or discontinue use of our website.
                  </p>
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
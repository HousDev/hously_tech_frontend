import { FileText, Shield, Scale, Briefcase, Banknote, Cpu, Users, Lock, Bell, AlertCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function TermsOfService() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromWelcome = location.state?.fromWelcome === true;

  const handleBack = () => {
    navigate("/");
  };

  const sections = [
    { id: "terms-agreement", title: "1. Agreement to Terms" },
    { id: "terms-overview", title: "2. Services Overview" },
    { id: "terms-eligibility", title: "3. User Eligibility" },
    { id: "terms-use", title: "4. Acceptable Use" },
    { id: "terms-property", title: "5. Intellectual Property" },
    { id: "terms-specific", title: "6. Service-Specific Terms" },
    { id: "terms-payment", title: "7. Payment & Disclaimers" },
    { id: "terms-liability", title: "8. Liability & Indemnity" },
    { id: "terms-disputes", title: "9. Dispute Resolution" },
    { id: "terms-changes", title: "10. Changes & Termination" },
    { id: "terms-severability", title: "11. Severability" },
    { id: "terms-contact", title: "12. Contact Information" }
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
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-balck-600 text-white rounded-full px-4 py-1.5 transition-all text-xs font-bold active:scale-95 shadow-sm"
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
                    className="block text-xs font-semibold text-slate-505 hover:text-blue-600 transition-colors py-1"
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
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Terms of Service
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Effective Date: December 8, 2024
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-505 max-w-2xl leading-relaxed">
                  Please read these Terms of Service carefully before accessing or using our services. This agreement governs your relationship with Hously Finntech Realty and sets forth your legal rights and obligations.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="space-y-10">

                {/* Agreement to Terms */}
                <section id="terms-agreement" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      1. Agreement to Terms
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-3.5">
                    These Terms of Service ("Terms") constitute a legally binding agreement between you and <span className="text-blue-600 font-semibold">HOUSLY FINNTECH REALTY</span> ("Company," "we," "us," or "our") concerning your access to and use of our website, services, and platforms across real estate, financial technology, and IT sectors. By accessing or using our services, you agree to be bound by these Terms.
                  </p>
                </section>

                {/* Services Overview */}
                <section id="terms-overview" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      2. Services Overview
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 pl-3.5">
                    HOUSLY FINNTECH REALTY provides integrated solutions across three primary sectors:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-3.5 max-w-3xl">
                    {[
                      { icon: Briefcase, title: "Real Estate", desc: "Property development, sales, leasing, and management services" },
                      { icon: Banknote, title: "Financial Technology", desc: "Investment advisory, financial planning, and lending services" },
                      { icon: Cpu, title: "IT & Technology", desc: "Software development, IT consulting, and digital transformation" }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200/50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-600">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                          </div>
                          <p className="text-[11px] text-slate-505 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* User Eligibility & Accounts */}
                <section id="terms-eligibility" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      3. User Eligibility & Accounts
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">User Eligibility</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">User Accounts</h4>
                      <p className="text-xs text-slate-605 leading-relaxed mb-2">
                        To access certain features, you agree to:
                      </p>
                      <ul className="space-y-1">
                        {["Provide accurate information", "Maintain account security", "Accept responsibility for activities", "Notify unauthorized access"].map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Acceptable Use */}
                <section id="terms-use" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      4. Acceptable Use
                    </h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 mx-3.5 max-w-3xl">
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 font-semibold">You agree not to:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Use services for illegal purposes",
                        "Infringe intellectual property rights",
                        "Transmit harmful or offensive content",
                        "Attempt unauthorized system access",
                        "Interfere with service operation",
                        "Use automated systems without permission",
                        "Impersonate any person or entity",
                        "Collect information about other users"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-xs sm:text-sm text-slate-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Intellectual Property */}
                <section id="terms-property" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      5. Intellectual Property Rights
                    </h2>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 ml-3.5 max-w-3xl">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                      <Scale className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>All content, features, and functionality of our services are owned by HOUSLY FINNTECH REALTY and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.</span>
                    </p>
                  </div>
                </section>

                {/* Service-Specific Terms */}
                <section id="terms-specific" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      6. Service-Specific Terms
                    </h2>
                  </div>
                  <div className="space-y-3.5 pl-3.5 max-w-3xl">
                    {[
                      { icon: Briefcase, color: "blue", title: "Real Estate Services", items: ["Property listings subject to change", "Transactions require separate agreements", "Availability not guaranteed until execution"] },
                      { icon: Banknote, color: "emerald", title: "Financial Services", items: ["Investment advice requires separate agreements", "Past performance not indicative of future results", "All investments carry risk"] },
                      { icon: Cpu, color: "purple", title: "Technology Services", items: ["Services provided 'as is' and 'as available'", "Custom development requires separate SOW", "No warranty of uninterrupted service"] }
                    ].map((service, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className={`p-1.5 rounded-lg bg-${service.color}-50 border border-${service.color}-100/80 text-${service.color}-600`}>
                            <service.icon className="w-4 h-4" />
                          </div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">{service.title}</h3>
                        </div>
                        <ul className="space-y-1">
                          {service.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <ChevronRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Payment Terms & Disclaimers */}
                <section id="terms-payment" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      7. Payment Terms & Disclaimers
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Payment Terms</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Payment terms vary by service type. All payments are non-refundable unless otherwise specified. We reserve the right to modify our pricing with appropriate notice.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Disclaimers</h4>
                      <p className="text-xs text-slate-605 leading-relaxed uppercase">
                        OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Liability & Indemnification */}
                <section id="terms-liability" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      8. Liability & Indemnification
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-amber-600" />
                        Limitation of Liability
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed uppercase">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Indemnification</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        You agree to indemnify and hold harmless HOUSLY FINNTECH REALTY from any claims arising out of your use of our services or violation of these Terms.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Dispute Resolution & Governing Law */}
                <section id="terms-disputes" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      9. Dispute Resolution & Governing Law
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Dispute Resolution</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Any disputes shall be resolved through binding arbitration. You waive any right to participate in a class action lawsuit.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Governing Law</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        These Terms shall be governed by the laws of the State of New York, United States.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Changes & Termination */}
                <section id="terms-changes" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      10. Changes & Termination
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3.5 max-w-3xl">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-500" />
                        Changes to Terms
                      </h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        We reserve the right to modify these Terms at any time. Your continued use constitutes acceptance of the modified Terms.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h4 className="text-xs font-extrabold text-slate-800 mb-2.5">Termination</h4>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        We may terminate your access for any reason, including breach of these Terms.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Severability */}
                <section id="terms-severability" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      11. Severability
                    </h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 mx-3.5 max-w-3xl">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section id="terms-contact" className="scroll-mt-24 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                      12. Contact Information
                    </h2>
                  </div>
                  <div className="pl-3.5 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us:
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
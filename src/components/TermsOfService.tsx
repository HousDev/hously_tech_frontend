
import { FileText, Sparkles, Shield, Scale, Briefcase, Banknote, Cpu, Users, Lock, Bell, AlertCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function TermsOfService() {
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
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>

            <div className="flex-1">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-white mb-1">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Last updated: December 8, 2024
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 md:p-8 space-y-6 md:space-y-8">
            
            {/* Agreement to Terms */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Agreement to Terms
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-3">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and <span className="text-[#0270e1] font-semibold">HOUSLY FINNTECH REALTY</span> ("Company," "we," "us," or "our") concerning your access to and use of our website, services, and platforms across real estate, financial technology, and IT sectors. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Services Overview */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Services Overview
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 pl-3">
                HOUSLY FINNTECH REALTY provides integrated solutions across three primary sectors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-3">
                {[
                  { icon: Briefcase, title: "Real Estate", desc: "Property development, sales, leasing, and management services" },
                  { icon: Banknote, title: "Financial Technology", desc: "Investment advisory, financial planning, and lending services" },
                  { icon: Cpu, title: "IT & Technology", desc: "Software development, IT consulting, and digital transformation" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                          <Icon className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* User Eligibility & Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    User Eligibility
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    User Accounts
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">
                    To access certain features, you agree to:
                  </p>
                  <ul className="space-y-1">
                    {["Provide accurate information", "Maintain account security", "Accept responsibility for activities", "Notify unauthorized access"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 bg-[#0270e1] rounded-full mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Acceptable Use */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Acceptable Use
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm text-slate-300 mb-3">You agree not to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span className="text-xs sm:text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Intellectual Property Rights
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <Scale className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>All content, features, and functionality of our services are owned by HOUSLY FINNTECH REALTY and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.</span>
                </p>
              </div>
            </section>

            {/* Service-Specific Terms */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Service-Specific Terms
                </h2>
              </div>
              <div className="space-y-3 pl-3">
                {[
                  { icon: Briefcase, color: "blue", title: "Real Estate Services", items: ["Property listings subject to change", "Transactions require separate agreements", "Availability not guaranteed until execution"] },
                  { icon: Banknote, color: "green", title: "Financial Services", items: ["Investment advice requires separate agreements", "Past performance not indicative of future results", "All investments carry risk"] },
                  { icon: Cpu, color: "purple", title: "Technology Services", items: ["Services provided 'as is' and 'as available'", "Custom development requires separate SOW", "No warranty of uninterrupted service"] }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 bg-${service.color}-500/20 rounded-lg`}>
                        <service.icon className={`w-4 h-4 text-${service.color}-400`} />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <ChevronRight className="w-3 h-3 text-[#0270e1] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Terms & Disclaimers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Payment Terms
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Payment terms vary by service type. All payments are non-refundable unless otherwise specified. We reserve the right to modify our pricing with appropriate notice.
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Disclaimers
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                </div>
              </section>
            </div>

            {/* Liability & Indemnification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Limitation of Liability
                  </h2>
                </div>
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                  <p className="text-xs sm:text-sm text-amber-300 leading-relaxed flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</span>
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Indemnification
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    You agree to indemnify and hold harmless HOUSLY FINNTECH REALTY from any claims arising out of your use of our services or violation of these Terms.
                  </p>
                </div>
              </section>
            </div>

            {/* Dispute Resolution & Governing Law */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Dispute Resolution
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Any disputes shall be resolved through binding arbitration. You waive any right to participate in a class action lawsuit.
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Governing Law
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    These Terms shall be governed by the laws of the State of New York, United States.
                  </p>
                </div>
              </section>
            </div>

            {/* Changes & Termination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Changes to Terms
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>We reserve the right to modify these Terms at any time. Your continued use constitutes acceptance of the modified Terms.</span>
                  </p>
                </div>
              </section>

              <section className="group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Termination
                  </h2>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We may terminate your access for any reason, including breach of these Terms.
                  </p>
                </div>
              </section>
            </div>

            {/* Severability */}
            <section className="group">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Severability
                </h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mx-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#0270e1] to-[#024a9e] rounded-full"></div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Contact Information
                </h2>
              </div>
              <div className="pl-3 space-y-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-slate-300">📧 <span className="text-white">Email:</span> careers@hously.in</p>
                  <p className="text-sm text-slate-300">📞 <span className="text-white">Phone:</span> +919371009381</p>
                  <p className="text-sm text-slate-300">📍 <span className="text-white">Address:</span> First Floor, Tamara Uprise, Pune, 411017</p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center pt-4">
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
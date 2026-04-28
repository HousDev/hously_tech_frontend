// import { FileText } from "lucide-react";
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
//               <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
//               <p className="text-sm sm:text-base text-slate-400">Last updated: December 8, 2024</p>
//             </div>
//           </div>

//           {/* Main Content - Responsive padding and spacing */}
//           <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-slate-300">
            
//             {/* Agreement to Terms */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Agreement to Terms</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 These Terms of Service ("Terms") constitute a legally binding agreement between you and HOUSLY FINNTECH REALTY ("Company," "we," "us," or "our") concerning your access to and use of our website, services, and platforms across real estate, financial technology, and IT sectors. By accessing or using our services, you agree to be bound by these Terms.
//               </p>
//             </section>

//             {/* Services Overview */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Services Overview</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 HOUSLY FINNTECH REALTY provides integrated solutions across three primary sectors:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base"><strong>Real Estate:</strong> Property development, sales, leasing, and management services for residential and commercial properties</li>
//                 <li className="text-sm sm:text-base"><strong>Financial Technology:</strong> Investment advisory, financial planning, fintech solutions, and lending services</li>
//                 <li className="text-sm sm:text-base"><strong>IT & Technology:</strong> Software development, IT consulting, digital transformation, and technology solutions</li>
//               </ul>
//             </section>

//             {/* User Eligibility */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">User Eligibility</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms. If you are accessing our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
//               </p>
//             </section>

//             {/* User Accounts */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">User Accounts</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 To access certain features of our services, you may be required to create an account. You agree to:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Provide accurate, current, and complete information</li>
//                 <li className="text-sm sm:text-base">Maintain and promptly update your account information</li>
//                 <li className="text-sm sm:text-base">Maintain the security of your account credentials</li>
//                 <li className="text-sm sm:text-base">Accept responsibility for all activities under your account</li>
//                 <li className="text-sm sm:text-base">Notify us immediately of any unauthorized access</li>
//               </ul>
//               <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
//                 We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or illegal activities.
//               </p>
//             </section>

//             {/* Acceptable Use */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Acceptable Use</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">You agree not to:</p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Use our services for any illegal purpose or in violation of any laws</li>
//                 <li className="text-sm sm:text-base">Infringe upon the intellectual property rights of others</li>
//                 <li className="text-sm sm:text-base">Transmit any harmful, offensive, or inappropriate content</li>
//                 <li className="text-sm sm:text-base">Attempt to gain unauthorized access to our systems or networks</li>
//                 <li className="text-sm sm:text-base">Interfere with or disrupt the operation of our services</li>
//                 <li className="text-sm sm:text-base">Use automated systems to access our services without permission</li>
//                 <li className="text-sm sm:text-base">Impersonate any person or entity or misrepresent your affiliation</li>
//                 <li className="text-sm sm:text-base">Collect or harvest information about other users</li>
//               </ul>
//             </section>

//             {/* Intellectual Property Rights */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Intellectual Property Rights</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 All content, features, and functionality of our services, including but not limited to text, graphics, logos, images, software, and design, are owned by HOUSLY FINNTECH REALTY or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
//               </p>
//             </section>

//             {/* Real Estate Services */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Real Estate Services</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 Specific terms for real estate services:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Property listings and information are subject to change without notice</li>
//                 <li className="text-sm sm:text-base">All property transactions are subject to separate purchase agreements</li>
//                 <li className="text-sm sm:text-base">Property availability and pricing are not guaranteed until contracts are executed</li>
//                 <li className="text-sm sm:text-base">We act as agents and facilitate transactions between buyers and sellers</li>
//                 <li className="text-sm sm:text-base">Commissions and fees will be disclosed prior to engagement</li>
//               </ul>
//             </section>

//             {/* Financial Services */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Financial Services</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 Important disclosures for financial services:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Investment advice and financial planning services require separate agreements</li>
//                 <li className="text-sm sm:text-base">Past performance does not guarantee future results</li>
//                 <li className="text-sm sm:text-base">All investments carry risk, including potential loss of principal</li>
//                 <li className="text-sm sm:text-base">We do not guarantee specific investment returns</li>
//                 <li className="text-sm sm:text-base">Financial services are subject to regulatory compliance and licensing requirements</li>
//                 <li className="text-sm sm:text-base">You should consult with qualified professionals before making financial decisions</li>
//               </ul>
//             </section>

//             {/* Technology Services */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Technology Services</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 Terms specific to IT and technology services:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Software and technology solutions are provided under separate license agreements</li>
//                 <li className="text-sm sm:text-base">We provide services on an "as is" and "as available" basis</li>
//                 <li className="text-sm sm:text-base">We do not warrant that services will be uninterrupted or error-free</li>
//                 <li className="text-sm sm:text-base">Custom development projects require separate statements of work</li>
//                 <li className="text-sm sm:text-base">Intellectual property rights in custom work are defined in project agreements</li>
//               </ul>
//             </section>

//             {/* Payment Terms */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Payment Terms</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Payment terms vary by service type and will be specified in your service agreement. Generally, you agree to pay all fees and charges associated with your use of our services. All payments are non-refundable unless otherwise specified. We reserve the right to modify our pricing with appropriate notice.
//               </p>
//             </section>

//             {/* Disclaimers */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Disclaimers</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
//               </p>
//               <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
//                 <li className="text-sm sm:text-base">Merchantability and fitness for a particular purpose</li>
//                 <li className="text-sm sm:text-base">Non-infringement of intellectual property rights</li>
//                 <li className="text-sm sm:text-base">Accuracy, reliability, or completeness of content</li>
//                 <li className="text-sm sm:text-base">Uninterrupted or error-free operation</li>
//               </ul>
//             </section>

//             {/* Limitation of Liability */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Limitation of Liability</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOUSLY FINNTECH REALTY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OUR SERVICES.
//               </p>
//             </section>

//             {/* Indemnification */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Indemnification</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 You agree to indemnify, defend, and hold harmless HOUSLY FINNTECH REALTY and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of our services or your violation of these Terms.
//               </p>
//             </section>

//             {/* Dispute Resolution */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Dispute Resolution</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in New York, NY. You waive any right to participate in a class action lawsuit or class-wide arbitration.
//               </p>
//             </section>

//             {/* Governing Law */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Governing Law</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
//               </p>
//             </section>

//             {/* Changes to Terms */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Changes to Terms</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
//               </p>
//             </section>

//             {/* Termination */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Termination</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use our services will immediately cease.
//               </p>
//             </section>

//             {/* Severability */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Severability</h2>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
//               </p>
//             </section>

//             {/* Contact Information */}
//             <section>
//               <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Contact Information</h2>
//               <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
//                 If you have any questions about these Terms of Service, please contact us:
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


import { FileText, Sparkles, Shield, Scale, Briefcase, Banknote, Cpu, Users, Lock, Bell, AlertCircle, ChevronRight } from "lucide-react";
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
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1.5">
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
import { FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/hously-logo.png";

export default function TermsOfService() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from welcome page
  const fromWelcome = location.state?.fromWelcome === true;

  const handleBack = () => {
    if (fromWelcome) {
      // Redirect to Welcome Page by setting showWelcome=true
      window.location.href = "/?welcome=true";
    } else {
      // Go to Home Page
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
             cursor-pointer"
>
  <img
    src={logo}
    alt="Hously Logo"
    className="h-10 w-auto md:h-16 object-contain drop-shadow-2xl pointer-events-none"
  />
</button>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Back Button - Responsive spacing */}
        {/* <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 mb-6 md:mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm md:text-base">Back to Home</span>
        </button> */}

        <div className="max-w-4xl mx-auto">
          {/* Header Section - Responsive layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
              <p className="text-sm sm:text-base text-slate-400">Last updated: December 8, 2024</p>
            </div>
          </div>

          {/* Main Content - Responsive padding and spacing */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-slate-300">
            
            {/* Agreement to Terms */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Agreement to Terms</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and HOUSLY FINNTECH REALTY ("Company," "we," "us," or "our") concerning your access to and use of our website, services, and platforms across real estate, financial technology, and IT sectors. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Services Overview */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Services Overview</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                HOUSLY FINNTECH REALTY provides integrated solutions across three primary sectors:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base"><strong>Real Estate:</strong> Property development, sales, leasing, and management services for residential and commercial properties</li>
                <li className="text-sm sm:text-base"><strong>Financial Technology:</strong> Investment advisory, financial planning, fintech solutions, and lending services</li>
                <li className="text-sm sm:text-base"><strong>IT & Technology:</strong> Software development, IT consulting, digital transformation, and technology solutions</li>
              </ul>
            </section>

            {/* User Eligibility */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">User Eligibility</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms. If you are accessing our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">User Accounts</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                To access certain features of our services, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Provide accurate, current, and complete information</li>
                <li className="text-sm sm:text-base">Maintain and promptly update your account information</li>
                <li className="text-sm sm:text-base">Maintain the security of your account credentials</li>
                <li className="text-sm sm:text-base">Accept responsibility for all activities under your account</li>
                <li className="text-sm sm:text-base">Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent or illegal activities.
              </p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Acceptable Use</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Use our services for any illegal purpose or in violation of any laws</li>
                <li className="text-sm sm:text-base">Infringe upon the intellectual property rights of others</li>
                <li className="text-sm sm:text-base">Transmit any harmful, offensive, or inappropriate content</li>
                <li className="text-sm sm:text-base">Attempt to gain unauthorized access to our systems or networks</li>
                <li className="text-sm sm:text-base">Interfere with or disrupt the operation of our services</li>
                <li className="text-sm sm:text-base">Use automated systems to access our services without permission</li>
                <li className="text-sm sm:text-base">Impersonate any person or entity or misrepresent your affiliation</li>
                <li className="text-sm sm:text-base">Collect or harvest information about other users</li>
              </ul>
            </section>

            {/* Intellectual Property Rights */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Intellectual Property Rights</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, images, software, and design, are owned by HOUSLY FINNTECH REALTY or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            {/* Real Estate Services */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Real Estate Services</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                Specific terms for real estate services:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Property listings and information are subject to change without notice</li>
                <li className="text-sm sm:text-base">All property transactions are subject to separate purchase agreements</li>
                <li className="text-sm sm:text-base">Property availability and pricing are not guaranteed until contracts are executed</li>
                <li className="text-sm sm:text-base">We act as agents and facilitate transactions between buyers and sellers</li>
                <li className="text-sm sm:text-base">Commissions and fees will be disclosed prior to engagement</li>
              </ul>
            </section>

            {/* Financial Services */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Financial Services</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                Important disclosures for financial services:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Investment advice and financial planning services require separate agreements</li>
                <li className="text-sm sm:text-base">Past performance does not guarantee future results</li>
                <li className="text-sm sm:text-base">All investments carry risk, including potential loss of principal</li>
                <li className="text-sm sm:text-base">We do not guarantee specific investment returns</li>
                <li className="text-sm sm:text-base">Financial services are subject to regulatory compliance and licensing requirements</li>
                <li className="text-sm sm:text-base">You should consult with qualified professionals before making financial decisions</li>
              </ul>
            </section>

            {/* Technology Services */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Technology Services</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                Terms specific to IT and technology services:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Software and technology solutions are provided under separate license agreements</li>
                <li className="text-sm sm:text-base">We provide services on an "as is" and "as available" basis</li>
                <li className="text-sm sm:text-base">We do not warrant that services will be uninterrupted or error-free</li>
                <li className="text-sm sm:text-base">Custom development projects require separate statements of work</li>
                <li className="text-sm sm:text-base">Intellectual property rights in custom work are defined in project agreements</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Payment Terms</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Payment terms vary by service type and will be specified in your service agreement. Generally, you agree to pay all fees and charges associated with your use of our services. All payments are non-refundable unless otherwise specified. We reserve the right to modify our pricing with appropriate notice.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Disclaimers</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Merchantability and fitness for a particular purpose</li>
                <li className="text-sm sm:text-base">Non-infringement of intellectual property rights</li>
                <li className="text-sm sm:text-base">Accuracy, reliability, or completeness of content</li>
                <li className="text-sm sm:text-base">Uninterrupted or error-free operation</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Limitation of Liability</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOUSLY FINNTECH REALTY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OUR SERVICES.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Indemnification</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                You agree to indemnify, defend, and hold harmless HOUSLY FINNTECH REALTY and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of our services or your violation of these Terms.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Dispute Resolution</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in New York, NY. You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Governing Law</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Changes to Terms</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Termination</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use our services will immediately cease.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Severability</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Contact Information</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-1 md:space-y-2 ml-2 md:ml-4">
                <p className="text-sm sm:text-base">Email: info@hously.in</p>
                <p className="text-sm sm:text-base">Phone: +919371009381</p>
                <p className="text-sm sm:text-base">Address: First Floor, Tamara Uprise, Pune, 411017</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
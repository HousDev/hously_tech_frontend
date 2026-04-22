import { Shield } from "lucide-react";
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
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
              <p className="text-sm sm:text-base text-slate-400">Last updated: December 8, 2024</p>
            </div>
          </div>

          {/* Main Content - Responsive padding and spacing */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 text-slate-300">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Introduction</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                HOUSLY FINNTECH REALTY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services across real estate, financial technology, and IT sectors.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Information We Collect</h2>
              
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3">Personal Information</h3>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Register for an account</li>
                <li className="text-sm sm:text-base">Request information about our properties or services</li>
                <li className="text-sm sm:text-base">Subscribe to our newsletter</li>
                <li className="text-sm sm:text-base">Fill out a contact form</li>
                <li className="text-sm sm:text-base">Apply for financing or investment opportunities</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
                This information may include: name, email address, phone number, mailing address, financial information, employment information, and other details relevant to your inquiry or transaction.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 md:mb-3 mt-4 md:mt-6">Automatically Collected Information</h3>
              <p className="text-sm sm:text-base leading-relaxed">
                When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device. We also collect information about your browsing behavior and interaction with our website.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">How We Use Your Information</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Provide, operate, and maintain our services</li>
                <li className="text-sm sm:text-base">Process transactions and send related information</li>
                <li className="text-sm sm:text-base">Send you marketing and promotional communications</li>
                <li className="text-sm sm:text-base">Respond to your inquiries and provide customer support</li>
                <li className="text-sm sm:text-base">Improve and personalize your experience</li>
                <li className="text-sm sm:text-base">Analyze usage trends and optimize our website</li>
                <li className="text-sm sm:text-base">Detect, prevent, and address technical issues or fraudulent activity</li>
                <li className="text-sm sm:text-base">Comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Information Sharing and Disclosure</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base"><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf</li>
                <li className="text-sm sm:text-base"><strong>Business Partners:</strong> We may share information with trusted business partners to provide you with products or services</li>
                <li className="text-sm sm:text-base"><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests</li>
                <li className="text-sm sm:text-base"><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                <li className="text-sm sm:text-base"><strong>With Your Consent:</strong> We may share your information for any other purpose with your consent</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Data Security</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Your Rights and Choices */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Your Rights and Choices</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-2 md:ml-4">
                <li className="text-sm sm:text-base">Access to your personal information</li>
                <li className="text-sm sm:text-base">Correction of inaccurate data</li>
                <li className="text-sm sm:text-base">Deletion of your personal information</li>
                <li className="text-sm sm:text-base">Restriction of processing</li>
                <li className="text-sm sm:text-base">Data portability</li>
                <li className="text-sm sm:text-base">Objection to processing</li>
                <li className="text-sm sm:text-base">Withdrawal of consent</li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed mt-3 md:mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Third-Party Links</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Children's Privacy</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Changes to This Privacy Policy</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Contact Us</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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
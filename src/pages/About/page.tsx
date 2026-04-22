

import Breadcrumb from "../../components/Breadcrumb";
import TeamSection from "../../components/team_sec";
import TechFeaturesSection from "../../components/tech_soln";
import { FaArrowRight, FaPlay } from "react-icons/fa";

export default function Component() {
  return (
    <div className="w-full">
      {/* Add Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * {
          font-family: 'Inter', sans-serif !important;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes movingX {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-20px);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .container {
          max-width: calc(1464px + 24px);
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Desktop Version (hidden on mobile) */}
      <div className="hidden lg:block">
        {/* About Section */}
        <section className="pt-12 md:pt-1 pb-12 md:pb-16 lg:pb-10 bg-white overflow-hidden"> {/* Reduced padding */}
          <div className="flex flex-wrap items-start -ml-[40px] px-24">
            {/* Left Column - Images */}
            <div className="w-full lg:w-6/12 px-[90px] mt-[10px] flex-shrink-0 max-w-full"> {/* Reduced mt */}
              <div className="relative inline-block opacity-0 animate-[slideInLeft_900ms_ease_0ms_both] pr-[110px] pb-[200px]">
                {/* Main Image */}
                <div className="rounded-[30px] overflow-hidden inline-block">
                  <img
                    alt="About"
                    src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-1.jpg"
                    className="max-w-full h-auto"
                  />
                </div>

                {/* Secondary Image */}
                <div className="absolute bottom-0 right-[50px] border-8 border-white rounded-[30px] overflow-hidden animate-[movingX_8s_linear_0s_infinite]">
                  <img
                    alt="img"
                    src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-2.jpg"
                    className="max-w-full h-auto"
                  />
                </div>

                {/* Circle Tag */}
                <div className="absolute top-[145px] right-0 inline-flex items-center justify-center w-[244px] h-[244px] border-[38px] border-white/30 rounded-full bg-black/30">
                  <span className="absolute top-1/2 left-1/2 -ml-[111.5px] -mt-[111.5px] animate-[spin_20s_linear_infinite] inline-block w-[220px] h-[223px] font-bold text-white text-base">
                    {Array.from("IT SOLUTIONS-TECHNOLOGY & INNOVATION.").map(
                      (char, index) => (
                        <span
                          key={index}
                          className="absolute h-[236px] w-[20px] left-[45.5%] top-[-5px] origin-center-bottom"
                          style={{ transform: `rotate(${9.4 * (index + 1)}deg)` }}
                        >
                          {char}
                        </span>
                      )
                    )}
                  </span>

                  {/* Play Button */}
                  <a className="z-10 inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-white text-[#6D30FB] cursor-pointer hover:scale-110 transition-transform">
                    <FaPlay />
                  </a>
                </div>

                {/* Shadow Text */}
                <div className="absolute bottom-0 left-0 -z-10">
                  <img
                    alt="About"
                    src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb1-3.png"
                    className="w-[113px]"
                  />
                  <div className="absolute bottom-0 left-0 -z-10 translate-x-[-200px] text-[280px] font-bold leading-[0.73] bg-gradient-to-b from-[#f8f8f8] to-transparent text-transparent bg-clip-text">
                    Hously
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="w-full lg:w-6/12 px-[40px] mt-[10px] flex-shrink-0 max-w-full"> {/* Reduced mt */}
              <div className="relative z-20 mb-[20px]"> {/* Reduced mb */}
                <span className="inline-block text-[#0076d8] font-medium uppercase tracking-wider mb-4 animate-[slideInLeft_900ms_ease_200ms_both]"> {/* Reduced mb */}
                  About Us
                </span>

                <h2 className="text-[48px] leading-tight font-bold mb-4 animate-[slideInLeft_900ms_ease_300ms_both]"> {/* Reduced text size and mb */}
                  Comprehensive IT Services for Modern Business Transformation
                </h2>

                <p className="text-[#6F756D] leading-[1.6] animate-[slideInUp_900ms_ease_400ms_both]"> {/* Reduced leading */}
                  We provide end-to-end IT solutions including cloud infrastructure, cybersecurity, custom software development, and digital transformation to help businesses grow and innovate.
                </p> {/* Made text more concise */}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4"> {/* Reduced gap */}
                {/* Feature 1 */}
                <div className="space-y-4 animate-[slideInUp_900ms_ease_500ms_both]">
                  <div className="inline-flex items-center justify-start pb-3"> {/* Reduced pb */}
                    <div className="w-16 h-16 flex items-center justify-center bg-[#0076d8]/10 rounded-2xl">
                      <svg className="w-8 h-8 text-[#0076d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2"> {/* Reduced mb */}
                      100% Customer Satisfaction
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      We bring experienced IT specialists, cloud architects, and technology experts committed to delivering excellence.
                    </p> {/* Made text more concise */}
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="space-y-4 animate-[slideInUp_900ms_ease_600ms_both]">
                  <div className="inline-flex items-center justify-start pb-3"> {/* Reduced pb */}
                    <div className="w-16 h-16 flex items-center justify-center bg-[#ffd801]/20 rounded-2xl">
                      <svg className="w-8 h-8 text-[#0076d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2"> {/* Reduced mb */}
                      Quality Assurance Guarantee
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Our rigorous testing and quality standards ensure reliable, secure, and high-performance solutions.
                    </p> {/* Made text more concise */}
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="mt-4"> {/* Reduced mt */}
                <a className="inline-flex items-center gap-2 text-[#0076d8] font-medium hover:gap-3 transition-all cursor-pointer">
                  More About Us
                  <FaArrowRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Work Process Section */}
        <section className="relative overflow-hidden bg-[#F5F5F5] pt-4 md:pt-6 lg:pt-4 pb-8 md:pb-10 lg:pb-8"> {/* Reduced pt and pb */}
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                'url("https://html.themehour.net/assets/img/bg/about-bg-1-1.png")',
            }}
          />

          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-wrap items-center flex-row-reverse mt-0 -mr-4 md:-mr-6 lg:-mr-8 -ml-4 md:-ml-6 lg:-ml-8">
              {/* Left Column - Image */}
              <div className="w-full lg:w-6/12 px-4 md:px-6 lg:px-8 mt-0 flex-shrink-0 max-w-full">
                <div className="rounded-2xl md:rounded-3xl overflow-hidden opacity-0 animate-[slideInRight_900ms_ease_0ms_both]">
                  <img
                    alt="IT Work Process"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                    className="align-middle border-none max-w-full w-full h-[300px] md:h-[380px] lg:h-[460px] object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="w-full lg:w-6/12 px-3 md:px-6 lg:px-8 mt-0 flex-shrink-0 max-w-full">
                <div className="relative z-20 mb-4 md:mb-5 lg:mb-6 "> {/* Reduced mb */}
                  {/* Subtitle */}
                  <span className="inline-block text-[#0076d8] text-sm md:text-base font-medium uppercase tracking-wider mb-2 opacity-0 animate-[slideInUp_900ms_ease_0ms_both]">
                    Work Process
                  </span>

                  {/* Title */}
                  <h2 className="text-[#051600] text-3xl md:text-4xl lg:text-5xl xl:text-[56px] leading-tight font-bold mt-0 mb-2 opacity-0 animate-[slideInUp_900ms_ease_0ms_both]"> {/* Reduced text size */}
                    How Does it Work?
                  </h2>

                  {/* Description */}
                  <p className="mt-1 text-[#6F756D] text-sm md:text-base leading-relaxed md:leading-[1.6] opacity-0 animate-[slideInUp_900ms_ease_0ms_both]"> {/* Reduced mt and leading */}
                    We follow a structured approach to understand requirements, design effective solutions, develop with precision, and deliver reliable results aligned with business goals.
                  </p> {/* Made text more concise */}
                </div>

                {/* Steps */}
                <div className="relative mt-2">
                  {/* Step 1 */}
                  <div className="relative flex gap-6 md:gap-8 lg:gap-14 mb-6 opacity-0 animate-[slideInUp_900ms_ease_0ms_both]">
                    <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#0076d8] rounded-xl text-base md:text-lg font-medium text-[#051600]">
                      1
                    </span>
                    <div>
                      <h3 className="text-[#051600] text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                        Discovery & Planning
                      </h3>
                      <p className="text-[#6F756D] text-sm md:text-base leading-relaxed max-w-sm">
                        We analyze business needs, define goals, and create clear roadmaps.
                      </p> {/* Made text more concise */}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex gap-6 md:gap-8 lg:gap-14 mb-6 md:ml-12 lg:ml-24 opacity-0 animate-[slideInUp_900ms_ease_0ms_both]">
                    <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#0076d8] rounded-xl text-base md:text-lg font-medium text-[#051600]">
                      2
                    </span>
                    <div>
                      <h3 className="text-[#051600] text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                        Design & Development
                      </h3>
                      <p className="text-[#6F756D] text-sm md:text-base leading-relaxed max-w-sm">
                        We design interfaces and develop scalable, secure systems.
                      </p> {/* Made text more concise */}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex gap-6 md:gap-8 lg:gap-14 md:ml-24 lg:ml-48 opacity-0 animate-[slideInUp_900ms_ease_0ms_both]">
                    <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-[#0076d8] rounded-xl text-base md:text-lg font-medium text-[#051600]">
                      3
                    </span>
                    <div>
                      <h3 className="text-[#051600] text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                        Testing & Support
                      </h3>
                      <p className="text-[#6F756D] text-sm md:text-base leading-relaxed max-w-sm">
                        We test thoroughly and provide technical support.
                      </p> {/* Made text more concise */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Version (visible only on mobile) */}
      <div className="block lg:hidden">
        {/* Mobile About Section */}
        <section className="pt-4 pb-8 bg-white px-4">
          {/* Mobile Content Section */}
          <div className="mb-8">
            <span className="inline-block text-[#0076d8] font-medium uppercase tracking-wider mb-2 text-sm">
              About Us
            </span>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Comprehensive IT Services for Modern Business Transformation
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              We provide end-to-end IT solutions including cloud infrastructure, cybersecurity,
              custom software development, and digital transformation to help businesses grow
              and innovate in the digital age.
            </p>

            {/* Mobile Features */}
            <div className="space-y-6 mb-6">
              {/* Feature 1 */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#0076d8]/10 rounded-2xl mr-4">
                    <svg className="w-7 h-7 text-[#0076d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    100% Customer Satisfaction
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  We bring a team of experienced IT specialists, cloud architects, and technology experts
                  committed to delivering excellence in every project.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#ffd801]/20 rounded-2xl mr-4">
                    <svg className="w-7 h-7 text-[#0076d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Quality Assurance Guarantee
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Our rigorous testing processes and quality standards ensure reliable, secure, and
                  high-performance solutions for your business.
                </p>
              </div>
            </div>

            {/* Mobile Button */}
            <div className="mb-8">
              <a
                href="#"
                className="inline-flex items-center justify-center py-4 px-8 rounded-full bg-[#0076d8] text-white font-medium w-full gap-2"
              >
                More About Us
                <FaArrowRight />
              </a>
            </div>
          </div>

          {/* Mobile Images Section */}
          <div className="relative">
            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden mb-4">
              <img
                alt="About"
                src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-1.jpg"
                className="w-full h-auto"
              />
            </div>

            {/* Secondary Image Container */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg mb-6">
                <img
                  alt="img"
                  src="https://html.themehour.net/robor/demo/assets/img/normal/about-thumb4-2.jpg"
                  className="w-full h-auto"
                />
              </div>

              {/* Play Button (Mobile Version) */}
              <div className="absolute bottom-4 right-4">
                <a className="z-10 inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-white text-[#6D30FB] cursor-pointer">
                  <FaPlay />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Work Process Section */}
        <section className="relative overflow-hidden bg-[#F5F5F5] py-5 px-4">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30"
            style={{
              backgroundImage:
                'url("https://html.themehour.net/assets/img/bg/about-bg-1-1.png")',
            }}
          />

          <div className="relative z-10">
            {/* Mobile Title */}
            <div className="text-center mb-6 mt-0">
              <span className="inline-block text-[#0076d8] font-medium uppercase tracking-wider mb-2 text-sm ">
                Work Process
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                How Does it Work?
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We follow a structured approach to understand your requirements,
                design effective solutions, develop with precision, and deliver
                reliable results.
              </p>
            </div>

            {/* Mobile Image */}
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                alt="IT Work Process"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Mobile Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-[#0076d8] rounded-xl bg-white">
                      <span className="text-lg font-bold text-gray-900">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Discovery & Planning
                    </h3>
                    <p className="text-gray-600">
                      We analyze your business needs, define goals, and create a clear roadmap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-[#0076d8] rounded-xl bg-white">
                      <span className="text-lg font-bold text-gray-900">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Design & Development
                    </h3>
                    <p className="text-gray-600">
                      We design intuitive interfaces and develop scalable, secure systems.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-[#0076d8] rounded-xl bg-white">
                      <span className="text-lg font-bold text-gray-900">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Testing & Support
                    </h3>
                    <p className="text-gray-600">
                      We test thoroughly and provide long-term technical support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Team and Tech Sections (Responsive by default) */}
      <TeamSection />
      <TechFeaturesSection />
    </div>
  );
}
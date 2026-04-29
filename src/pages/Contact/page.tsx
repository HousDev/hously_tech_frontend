


import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HouslyContactPage = () => {
    const [ stats,setStats] = useState<any>({
    projects: 0,
    clients: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    const targets = {
      projects: 100,
      clients: 50,
      satisfaction: 95,
    };

    const interval = setInterval(() => {
      setStats((prev:any) => ({
        projects: prev.projects < targets.projects ? prev.projects + 1 : targets.projects,
        clients: prev.clients < targets.clients ? prev.clients + 1 : targets.clients,
        satisfaction: prev.satisfaction < targets.satisfaction ? prev.satisfaction + 1 : targets.satisfaction,
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    inquiryType: '',
    serviceType: '',
    timeline: '',
    projectBudget: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Replace your handleSubmit function in HouslyContactPage.tsx


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  let originalText = '';
  
  try {
    // Basic validation
    if (!formData.fullName.trim()) {
      alert('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    if (!formData.inquiryType) {
      alert('Please select inquiry type');
      return;
    }
    if (!formData.message.trim()) {
      alert('Message is required');
      return;
    }

    // Prepare data for API
    const enquiryData = {
      full_name: formData.fullName,
      company_name: formData.companyName || undefined,
      email: formData.email,
      phone_number: formData.phoneNumber || undefined,
      inquiry_type: formData.inquiryType,
      service_type: formData.serviceType || undefined,
      project_budget: formData.projectBudget || undefined,
      message: formData.message
    };

    // Show loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Send to backend
    const response = await axios.post(`${API_BASE_URL}/enquiries`, enquiryData);

    if (response.data.success) {
      alert('Thank you! Your enquiry has been submitted successfully. We will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        inquiryType: '',
        serviceType: '',
        timeline: '',
        projectBudget: '',
        message: ''
      });
    } else {
      alert('Failed to submit enquiry. Please try again.');
    }
  } catch (error: any) {
    console.error('Error submitting enquiry:', error);
    
    if (error.response) {
      // Backend validation error
      if (error.response.data.errors) {
        const errors = error.response.data.errors;
        const errorMessage = errors.map((err: any) => `${err.path}: ${err.msg}`).join('\n');
        alert(`Validation errors:\n${errorMessage}`);
      } else {
        alert(error.response.data.message || 'Failed to submit enquiry');
      }
    } else {
      alert('Network error. Please check your connection and try again.');
    }
  } finally {
    // Reset button state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.textContent = originalText || 'Get Free Consultation';
      submitButton.disabled = false;
    }
  }
};

  return (
    <>
      <Breadcrumb/>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        
        {/* Hero Section */}
         {/* Hero Section */}
      <div className="bg-[#dbeafe] text-black py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Let's Build Something Great Together</h1>
          <p className="text-md mb-8 max-w-2xl mx-auto">
            Transform your business with cutting-edge IT solutions. Our expert team is ready to help you innovate, scale, and succeed in the digital world.
          </p>
          
          {/* <div className="flex flex-wrap justify-center gap-8 pb-4">
  <div className="text-center">
    <h3 className="text-3xl font-bold">
      {stats.projects}+
    </h3>
    <p className="text-sm opacity-90">Projects Delivered</p>
  </div>

  <div className="text-center">
    <h3 className="text-3xl font-bold">
      {stats.clients}+
    </h3>
    <p className="text-sm opacity-90">Clients</p>
  </div>

  <div className="text-center">
    <h3 className="text-3xl font-bold">
      {stats.satisfaction}%
    </h3>
    <p className="text-sm opacity-90">Client Satisfaction</p>
  </div>
</div> */}

        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 pb-8">
          
          {/* Row 1: Form + Get In Touch (Same Height) */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Let's Discuss Your Project Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0270e1] to-blue-600 flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0270e1]">Let's Discuss Your Project</h2>
                  <p className="text-gray-600 text-sm">Share your requirements with our IT experts</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company or organization"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type *</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="project">New Project</option>
                    <option value="consultation">Free Consultation</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Required *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App Development</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="devops">DevOps & Automation</option>
                    <option value="custom-software">Custom Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Briefly describe your requirement or challenge..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0270e1] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0076d8] hover:from-blue-600 hover:to-[#0270e1] text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  Get Free Consultation
                </button>
              </form>
            </div>

            {/* Get In Touch Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#fed700] to-amber-400 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0270e1]">Get In Touch</h2>
                  <p className="text-gray-600 text-sm">Connect with our IT experts</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0270e1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm mb-1">Speak with our IT consultants</p>
                    <a href="tel:+919848678729" className="text-[#0270e1] font-medium hover:underline text-lg">
                      +91 9371009381
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0270e1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-1">Send your project requirements</p>
                    <a href="mailto:info@houslyfinntech.com" className="text-[#0270e1] font-medium hover:underline text-lg">
                      careers@hously.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#0270e1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Visit Our Office</h3>
                    <p className="text-gray-600 text-sm mb-1">Meet us at our technology hub</p>
                    <p className="text-gray-700 text-sm">
                     First Floor,Tamara Uprise, Rahatani,
Pune, 411017
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#0270e1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-700 text-sm">Mon - Sat: 10:00 AM - 7:00 PM</p>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Need Urgent Support Card (Horizontal) */}
     <div className="mb-8">
  <div className="relative bg-gradient-to-br from-[#0c6ac8] via-[#3a7bc8] to-[#77a6dc] rounded-2xl shadow-xl p-6 md:p-8 text-white overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
    
    <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="lg:flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-medium">24/7 Emergency Support</span>
        </div>
        
        <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
          Need <span className="text-yellow-300">Urgent</span> IT Support?
        </h3>
        
        <div className="space-y-2 mb-6 lg:mb-0">
          <p className="text-white/95 text-lg flex items-center justify-center lg:justify-start gap-2">
            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Instant response from technical experts
          </p>
          <p className="text-white/80 flex items-center justify-center lg:justify-start gap-2">
            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Available 24/7 for critical issues
          </p>
          <p className="text-white/80 flex items-center justify-center lg:justify-start gap-2">
            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Average response time: under 15 minutes
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-auto lg:w-64">
        <div className="group relative">
          <button className="relative bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 w-full lg:w-64 shadow-lg hover:shadow-xl hover:-translate-y-1">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-md font-bold">Call Now</div>
              <div className="text-sm text-gray-600">Emergency Line</div>
            </div>
          </button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Direct to technical team
          </div>
        </div>
        
        <div className="group relative">
          <button className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 w-full  shadow-lg hover:shadow-xl hover:-translate-y-1">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-md font-bold">WhatsApp Chat</div>
              <div className="text-sm text-white/90">Quick text support</div>
            </div>
          </button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Typically responds in 5 minutes
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          {/* FAQ Section - As it is */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#0270e1] mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-6">Quick answers to common IT service inquiries</p>
            
            <div className="space-y-4">
              <details className="border-b border-gray-200 pb-4">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0270e1] transition-colors">
                  What IT services does Hously Finntech provide?
                </summary>
                <p className="mt-2 text-gray-600">We offer comprehensive IT solutions including web development, mobile app development, cloud services, AI/ML, cybersecurity, DevOps, and custom software development.</p>
              </details>
              
              <details className="border-b border-gray-200 pb-4">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0270e1] transition-colors">
                  How long does a typical project take?
                </summary>
                <p className="mt-2 text-gray-600">Project timelines vary based on complexity. Simple websites take 2-4 weeks, while enterprise applications can take 3-6 months. We provide detailed timelines during consultation.</p>
              </details>
              
              <details className="border-b border-gray-200 pb-4">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0270e1] transition-colors">
                  Do you provide post-deployment support?
                </summary>
                <p className="mt-2 text-gray-600">Yes, we offer comprehensive maintenance and support packages including bug fixes, updates, security patches, and technical assistance.</p>
              </details>
              
              <details className="border-b border-gray-200 pb-4">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0270e1] transition-colors">
                  Can you work with our existing technology stack?
                </summary>
                <p className="mt-2 text-gray-600">Absolutely! Our team is proficient in multiple technologies and can integrate seamlessly with your current systems or recommend optimal solutions.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HouslyContactPage;
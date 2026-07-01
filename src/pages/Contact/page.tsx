

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  ChevronRight,
  Globe,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { toast, Toaster } from 'react-hot-toast';
import { enquiryApi } from '../../lib/enquiryApi';

const HouslyContactPage = () => {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    satisfaction: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const targets = {
      projects: 100,
      clients: 50,
      satisfaction: 95,
    };

    const interval = setInterval(() => {
      setStats((prev) => ({
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
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.inquiryType) {
      toast.error('Please select inquiry type');
      return;
    }
    if (!formData.serviceType) {
      toast.error('Please select a service');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const enquiryData = {
        full_name: formData.fullName,
        company_name: formData.companyName || undefined,
        email: formData.email,
        phone_number: formData.phoneNumber || undefined,
        inquiry_type: formData.inquiryType,
        service_type: formData.serviceType || undefined,
        project_budget: formData.projectBudget || undefined,
        message: formData.message,
      };

      const response = await enquiryApi.create(enquiryData);

      if (response && response.id) {
        toast.success(
          'Thank you! Your enquiry has been submitted successfully. We will contact you within 24 hours.'
        );

        setFormData({
          fullName: '',
          companyName: '',
          email: '',
          phoneNumber: '',
          inquiryType: '',
          serviceType: '',
          timeline: '',
          projectBudget: '',
          message: '',
        });
      }
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit enquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: '#ffffff',
            },
          },
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        {/* Compact Hero Section */}
       
       

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 pb-12 relative z-10">
          {/* Premium Stats Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 border border-gray-100/80 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Globe className="w-5 h-5 text-[#0f3b7a]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Projects Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.projects}+</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 border border-gray-100/80 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Users className="w-5 h-5 text-[#0f3b7a]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Happy Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clients}+</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 border border-gray-100/80 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Award className="w-5 h-5 text-[#0f3b7a]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Satisfaction Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.satisfaction}%</p>
              </div>
            </div>
          </div>

          {/* Form + Get In Touch - More Compact */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Form - 3/5 */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 border border-gray-100/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-[#0f3b7a] to-[#1a5bbf] rounded-lg">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Let's Discuss Your Project</h2>
                  <p className="text-sm text-gray-500">Share your requirements with our IT experts</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company or organization"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none bg-white transition-all text-sm"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Service Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none bg-white transition-all text-sm"
                    >
                      <option value="">Select a service</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App Development</option>
                      <option value="cloud">Cloud Solutions</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="devops">DevOps & Automation</option>
                      <option value="custom-software">Custom Software</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Briefly describe your requirement or challenge..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f3b7a] focus:border-transparent outline-none resize-none transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0077d9] hover:shadow-lg hover:scale-[1.01] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      Get Free Consultation
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Get In Touch - 2/5 */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Get In Touch</h2>
                  <p className="text-sm text-gray-500">Connect with our IT experts</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all">
                    <Phone className="w-4 h-4 text-[#0f3b7a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Call Us</h3>
                    <p className="text-xs text-gray-500 mb-0.5">Speak with our IT consultants</p>
                    <a href="tel:+919371009381" className="text-[#0f3b7a] font-medium hover:underline text-sm">
                      +91 9371009381
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-all">
                    <Mail className="w-4 h-4 text-[#0f3b7a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Email Us</h3>
                    <p className="text-xs text-gray-500 mb-0.5">Send your project requirements</p>
                    <a href="mailto:careers@hously.in" className="text-[#0f3b7a] font-medium hover:underline text-sm">
                      careers@hously.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-all">
                    <MapPin className="w-4 h-4 text-[#0f3b7a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Visit Our Office</h3>
                    <p className="text-xs text-gray-500 mb-0.5">Meet us at our technology hub</p>
                    <p className="text-gray-700 text-xs">
                      First Floor, Tamara Uprise, Rahatani, Pune, 411017
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                  <div className="p-2.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all">
                    <Clock className="w-4 h-4 text-[#0f3b7a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">Business Hours</h3>
                    <p className="text-gray-700 text-xs">Mon - Sat: 10:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Support Card - Compact */}
          <div className="mb-8">
            <div className="relative bg-[#0077d9] rounded-2xl shadow-xl p-6 md:p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="lg:flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 border border-white/10">
                    <span className="flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-medium">24/7 Emergency Support</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Need <span className="text-yellow-300">Urgent</span> IT Support?
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Instant response from technical experts</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Available 24/7 for critical issues</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-100 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Average response time: under 15 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-auto lg:w-56">
                  <a
                    href="tel:+919371009381"
                    className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                  >
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Phone className="w-4 h-4 text-[#0f3b7a]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">Call Now</div>
                      <div className="text-xs text-gray-600">Emergency Line</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919371009381"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                  >
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">WhatsApp Chat</div>
                      <div className="text-xs text-white/90">Quick text support</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Compact */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-sm text-gray-500">Quick answers to common IT service inquiries</p>
              </div>
            </div>

            <div className="space-y-3">
              <details className="border-b border-gray-200 pb-3 group">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0f3b7a] transition-colors flex items-center justify-between text-sm">
                  What IT services does Hously Finntech provide?
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  We offer comprehensive IT solutions including web development,
                  mobile app development, cloud services, AI/ML, cybersecurity,
                  DevOps, and custom software development.
                </p>
              </details>

              <details className="border-b border-gray-200 pb-3 group">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0f3b7a] transition-colors flex items-center justify-between text-sm">
                  How long does a typical project take?
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Project timelines vary based on complexity. Simple websites
                  take 2-4 weeks, while enterprise applications can take 3-6
                  months. We provide detailed timelines during consultation.
                </p>
              </details>

              <details className="border-b border-gray-200 pb-3 group">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0f3b7a] transition-colors flex items-center justify-between text-sm">
                  Do you provide post-deployment support?
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Yes, we offer comprehensive maintenance and support packages
                  including bug fixes, updates, security patches, and technical
                  assistance.
                </p>
              </details>

              <details className="group">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#0f3b7a] transition-colors flex items-center justify-between text-sm">
                  Can you work with our existing technology stack?
                  <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Absolutely! Our team is proficient in multiple technologies
                  and can integrate seamlessly with your current systems or
                  recommend optimal solutions.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HouslyContactPage;
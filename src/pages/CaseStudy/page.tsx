import React, { useState } from 'react';
import { ArrowRight, Calendar, Users, TrendingUp, CheckCircle, X } from 'lucide-react';
// Types
interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  metrics: string;
  client: string;
  duration: string;
  teamSize: string;
  technologies: string[];
  challenge: string;
  solution: string;
  results: string[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
  };
}

// Data
const caseStudiesData: CaseStudy[] = [
  {
    id: 1,
    slug: "enterprise-cloud-migration-platform",
    title: "Enterprise Cloud Migration Platform",
    category: "Cloud Computing",
    description:
      "Large-scale cloud migration solution enabling secure, scalable, and cost-optimized infrastructure for enterprises.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    metrics:
      "Reduced infrastructure costs by 42%, improved scalability and uptime",
    client: "CloudWorks Inc.",
    duration: "8 months",
    teamSize: "12 engineers",
    technologies: ["AWS", "Azure", "Docker", "Kubernetes"],
    challenge:
      "Enterprises faced high costs and limited scalability due to legacy on-premise infrastructure.",
    solution:
      "We migrated core systems to the cloud with automated scaling, cost monitoring, and robust security.",
    results: [
      "42% reduction in infrastructure costs",
      "Improved uptime and scalability",
      "Simplified IT management"
    ],
    testimonial: {
      quote: "The migration was seamless and significantly improved our system performance.",
      author: "Anil Kapoor",
      position: "CTO, CloudWorks Inc."
    }
  },
  {
    id: 2,
    slug: "ai-powered-business-analytics-system",
    title: "AI-Powered Business Analytics System",
    category: "Artificial Intelligence",
    description:
      "Advanced analytics platform using AI and machine learning for real-time insights and decision-making.",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop",
    metrics:
      "Improved decision accuracy by 55%, reduced manual reporting effort",
    client: "DataIntellect Ltd.",
    duration: "7 months",
    teamSize: "10 specialists",
    technologies: ["Python", "TensorFlow", "Power BI", "SQL"],
    challenge:
      "Manual reporting and slow analysis caused delayed and inaccurate business decisions.",
    solution:
      "We implemented AI-driven analytics to automate data processing and deliver actionable insights in real time.",
    results: [
      "55% improved decision accuracy",
      "Reduced manual reporting effort",
      "Faster insights for management"
    ],
    testimonial: {
      quote: "The AI analytics platform transformed our decision-making processes.",
      author: "Meera Singh",
      position: "Head of Analytics, DataIntellect Ltd."
    }
  },
  {
    id: 3,
    slug: "custom-enterprise-software-solution",
    title: "Custom Enterprise Software Solution",
    category: "Software Development",
    description:
      "Tailor-made enterprise software for workflow automation, data integration, and operational efficiency.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
    metrics:
      "Boosted operational efficiency by 45%, improved system reliability",
    client: "SoftTech Solutions",
    duration: "9 months",
    teamSize: "11 developers",
    technologies: ["Java", "Spring Boot", "PostgreSQL", "React"],
    challenge:
      "Disconnected workflows and manual processes reduced operational efficiency.",
    solution:
      "We developed a custom enterprise system integrating all workflows and automating key processes.",
    results: [
      "45% boost in operational efficiency",
      "Enhanced system reliability",
      "Centralized workflow management"
    ],
    testimonial: {
      quote: "The custom software simplified our operations and reduced errors.",
      author: "Rohan Mehta",
      position: "Operations Manager, SoftTech Solutions"
    }
  },
  {
    id: 4,
    slug: "it-service-management-automation",
    title: "IT Service Management Automation",
    category: "IT Services",
    description:
      "Automated ITSM platform for incident management, service requests, and performance monitoring.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
    metrics:
      "Reduced incident resolution time by 60%, improved service availability",
    client: "ITCare Inc.",
    duration: "6 months",
    teamSize: "9 IT specialists",
    technologies: ["ServiceNow", "Jira", "Python", "AWS"],
    challenge:
      "Manual IT service management caused slow incident resolution and frequent service downtime.",
    solution:
      "We automated incident handling, service requests, and monitoring with alerts and dashboards.",
    results: [
      "60% faster incident resolution",
      "Improved service availability",
      "Reduced operational load"
    ],
    testimonial: {
      quote: "Automation made our IT services faster and more reliable.",
      author: "Suresh Nair",
      position: "IT Manager, ITCare Inc."
    }
  },
  {
    id: 5,
    slug: "enterprise-cybersecurity-framework",
    title: "Enterprise Cybersecurity Framework",
    category: "Cybersecurity",
    description:
      "Multi-layered security architecture protecting enterprise systems from advanced cyber threats.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
    metrics: "Prevented 99.9% of threats, reduced security incidents by 85%",
    client: "SecureNet Systems",
    duration: "6 months",
    teamSize: "11 security experts",
    technologies: ["SIEM", "Zero Trust", "Cloud Security", "Threat Monitoring"],
    challenge:
      "Frequent cyber threats and lack of centralized security monitoring.",
    solution:
      "We implemented a real-time cybersecurity framework with threat detection and response.",
    results: [
      "99.9% threat prevention",
      "85% reduction in security incidents",
      "Improved compliance"
    ],
    testimonial: {
      quote: "This solution gave us complete confidence in our IT security.",
      author: "Vikram Joshi",
      position: "CISO, SecureNet Systems"
    }
  },
  {
    id: 6,
    slug: "devops-ci-cd-transformation",
    title: "DevOps & CI/CD Transformation",
    category: "DevOps & Automation",
    description:
      "End-to-end DevOps pipeline implementation with automated testing, deployment, and monitoring.",
    image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&auto=format&fit=crop",
    metrics:
      "Accelerated release cycles by 70%, improved deployment stability",
    client: "TechOps Solutions",
    duration: "7 months",
    teamSize: "10 engineers",
    technologies: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
    challenge:
      "Slow release cycles and deployment instability caused delays in feature delivery.",
    solution:
      "We implemented automated CI/CD pipelines with testing, deployment, and monitoring for stability.",
    results: [
      "70% faster release cycles",
      "Improved deployment stability",
      "Enhanced team productivity"
    ],
    testimonial: {
      quote: "Our software releases are now faster, reliable, and more efficient.",
      author: "Priya Sharma",
      position: "DevOps Lead, TechOps Solutions"
    }
  }
];



// Case Study Details Card Component
const CaseStudyDetailsCard: React.FC<{ study: CaseStudy; onClose: () => void }> = ({ study, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Card Container */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg hover:scale-110 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Hero Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={study.image}
            alt={study.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <span className="inline-block bg-[#ffd801] text-[#0375d5] px-3 py-1 rounded-full text-xs font-medium mb-2">
                {study.category}
              </span>
              <h2 className="text-2xl font-bold text-white">{study.title}</h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-12rem)] p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#0375d5]" />
                <span className="text-sm font-medium text-gray-700">Client</span>
              </div>
              <p className="text-sm text-gray-600">{study.client}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#0375d5]" />
                <span className="text-sm font-medium text-gray-700">Duration</span>
              </div>
              <p className="text-sm text-gray-600">{study.duration}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{study.description}</p>
          </div>

          {/* Key Results */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Results</h3>
            <div className="space-y-2">
              {study.results.slice(0, 3).map((result, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {study.technologies.slice(0, 5).map((tech, index) => (
                <span
                  key={index}
                  className="bg-[#0375d5]/10 text-[#0375d5] px-3 py-1 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-3">
              <div className="text-[#ffd801] text-3xl leading-none">"</div>
              <p className="text-sm text-gray-700 italic line-clamp-3">
                {study.testimonial.quote}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0375d5] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {study.testimonial.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{study.testimonial.author}</p>
                <p className="text-xs text-gray-600">{study.testimonial.position}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with View Full Button */}
        <div className="border-t p-4">
          <button className="w-full bg-[#0375d5] text-white py-3 rounded-lg font-medium hover:bg-[#025a9e] transition-colors">
            View Full Case Study
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CaseStudyApp: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (

<div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      
     

      {/* Case Studies Grid */}
      <section className="py-30 pt32">
        <div className="container mx-auto px-2 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudiesData.map((study) => (
              <div
                key={study.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                onClick={() => setSelectedStudy(study)}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-[#ffd801] text-[#0375d5] px-4 py-1 rounded-full text-sm font-medium">
                    {study.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0375d5] transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {study.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 font-medium">{study.metrics}</span>
                  </div>

                  {/* Read More Button */}
                  <button className="flex items-center gap-2 text-[#0375d5] font-medium group-hover:gap-4 transition-all">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Details Card Overlay */}
      {selectedStudy && (
        <CaseStudyDetailsCard 
          study={selectedStudy} 
          onClose={() => setSelectedStudy(null)} 
        />
      )}
    </div>
  );
};

export default CaseStudyApp;
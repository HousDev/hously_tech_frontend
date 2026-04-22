import { Star, Code, Server, Database, Shield,  } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
export default function TestimonialPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "CTO, CloudTech Solutions",
      text: "Their cloud infrastructure expertise transformed our entire DevOps pipeline. We reduced deployment time by 70% and achieved 99.9% uptime. The team's knowledge of AWS and Kubernetes is exceptional.",
      rating: 5,
      initial: "SM",
      icon: <Server className="w-6 h-6" />
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "VP Engineering, DataFlow Inc",
      text: "The custom API development and microservices architecture they built scaled flawlessly from 1000 to 1 million users. Their expertise in Node.js and distributed systems is world-class.",
      rating: 5,
      initial: "RK",
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Head of IT, FinanceHub",
      text: "Migrating our legacy system to a modern tech stack seemed impossible until we partnered with them. They handled PostgreSQL optimization, React frontend, and CI/CD implementation perfectly.",
      rating: 5,
      initial: "EC",
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 4,
      name: "Marcus Johnson",
      role: "Security Lead, SecureBank",
      text: "Their cybersecurity audit and implementation of zero-trust architecture protected us from multiple threats. Penetration testing and compliance certification were handled professionally.",
      rating: 5,
      initial: "MJ",
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 5,
      name: "Priya Sharma",
      role: "Product Manager, AppVenture",
      text: "Full-stack development with React, Python Django, and GraphQL delivered ahead of schedule. The mobile-responsive design and real-time features exceeded all expectations.",
      rating: 5,
      initial: "PS",
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 6,
      name: "David Park",
      role: "DevOps Manager, TechScale",
      text: "Kubernetes orchestration, Docker containerization, and automated CI/CD pipelines revolutionized our deployment process. Infrastructure as Code implementation was flawless.",
      rating: 5,
      initial: "DP",
      icon: <Server className="w-6 h-6" />
    }
  ];

  

  return (
    <>
    <Breadcrumb/>
    <div className="min-h-screen bg-white">
     
    

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-[#0375d5]">Clients</span> Say
          </h2>
          <div className="w-24 h-1 bg-[#ffd801] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0375d5]/5 to-[#ffd801]/10 rounded-bl-full"></div>
              
              {/* Tech Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#0375d5] to-[#025a9e] rounded-lg mb-4 text-[#ffd801] relative z-10">
                {testimonial.icon}
              </div>

              {/* Quote Mark */}
              <div className="absolute top-6 right-8 text-[#ffd801] opacity-20 text-6xl font-serif leading-none">
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ffd801] text-[#ffd801]"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
                {testimonial.text}
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-[#ffd801]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0375d5] to-[#ffd801] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.initial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#0375d5] text-sm font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#0375d5] to-[#025a9e] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your IT Infrastructure?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join hundreds of companies that trust us with their technology needs
          </p>
          <button className="bg-[#ffd801] hover:bg-[#ffed4e] text-[#0375d5] font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
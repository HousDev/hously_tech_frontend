// // // import React from 'react';
// // // import { Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

// // // interface SocialLink {
// // //   icon: React.ReactNode;
// // //   url: string;
// // //   label: string;
// // // }

// // // interface TeamMember {
// // //   name: string;
// // //   role: string;
// // //   description: string;
// // //   image: string;
// // //   profileUrl: string;
// // //   delay: string;
// // //   socialLinks: SocialLink[];
// // // }

// // // const TeamSection: React.FC = () => {
// // //   const teamMembers: TeamMember[] = [
// // //     {
// // //       name: "Alex Javed",
// // //       role: "AI Solutions Architect",
// // //       description: "Designs scalable AI-driven systems that automate workflows and enhance decision-making.",
// // //       image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_1.png",
// // //       profileUrl: "#",
// // //       delay: "0ms",
// // //       socialLinks: [
// // //         { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// // //         { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// // //         { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// // //         { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// // //       ],
// // //     },
// // //     {
// // //       name: "Jenny William",
// // //       role: "Cloud Infrastructure Engineer",
// // //       description: "Specializes in secure, high-availability cloud solutions for modern enterprises.",
// // //       image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_2.png",
// // //       profileUrl: "#",
// // //       delay: "200ms",
// // //       socialLinks: [
// // //         { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// // //         { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// // //         { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// // //         { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// // //       ],
// // //     },
// // //     {
// // //       name: "Daniel Thomas",
// // //       role: "Full Stack Developer",
// // //       description: "Builds robust web applications with modern frameworks and scalable APIs.",
// // //       image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png",
// // //       profileUrl: "#",
// // //       delay: "400ms",
// // //       socialLinks: [
// // //         { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// // //         { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// // //         { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// // //         { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// // //       ],
// // //     },
// // //     {
// // //       name: "Jessica Lauren",
// // //       role: "Cybersecurity Analyst",
// // //       description: "Ensures data protection through proactive security audits and threat monitoring.",
// // //       image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_4.png",
// // //       profileUrl: "#",
// // //       delay: "600ms",
// // //       socialLinks: [
// // //         { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// // //         { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// // //         { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// // //         { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// // //       ],
// // //     },
// // //   ];

// // //   return (
// // //     <section className="relative py-4 bg-[#051600]">
// // //       <div className="max-w-7xl mx-auto px-4">
// // //         {/* Header */}
// // //         <div className="text-center mb-12">
// // //           <span className="text-blue-500 uppercase tracking-wider font-medium animate-slideInUp">
// // //             Expert IT Team
// // //           </span>
// // //           <h2 className="text-4xl lg:text-6xl font-bold text-white mt-2 animate-slideInUp">
// // //             Meet Our Technology Leaders
// // //           </h2>
// // //         </div>

// // //         {/* Team Cards */}
// // //         <div className="flex flex-wrap justify-center -mx-4">
// // //           {teamMembers.map((member, index) => (
// // //             <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
// // //               <div
// // //                 className="bg-[#141414] rounded-3xl p-6 text-center border border-[#1f1f1f] animate-slideInUp hover:border-transparent hover:shadow-[0_0_20px_rgba(1,119,209,0.5)] transition duration-500"
// // //                 style={{ animationDelay: member.delay }}
// // //               >
// // //                 {/* Image */}
// // //                 <div className="mb-6 overflow-hidden rounded-2xl">
// // //                   <img
// // //                     src={member.image}
// // //                     alt={member.name}
// // //                     className="w-full h-auto transform transition duration-500 hover:scale-105"
// // //                   />
// // //                 </div>

// // //                 {/* Content */}
// // //                 <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
// // //                 <p className="text-[#0177d1] text-sm mb-4">{member.role}</p>
// // //                 <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.description}</p>

// // //                 {/* Social Icons */}
// // //                 <div className="flex justify-center gap-3">
// // //                   {member.socialLinks.map((social, i) => (
// // //                     <a
// // //                       key={i}
// // //                       href={social.url}
// // //                       aria-label={social.label}
// // //                       className="w-9 h-9 flex items-center justify-center rounded-full border border-[#2f2f2f] text-white transition duration-300 hover:bg-gradient-to-tr hover:from-[#0177d1] hover:to-[#ffd801] hover:text-black"
// // //                     >
// // //                       {social.icon}
// // //                     </a>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Animations */}
// // //       <style>{`
// // //         @keyframes slideInUp {
// // //           from { opacity: 0; transform: translateY(40px); }
// // //           to { opacity: 1; transform: translateY(0); }
// // //         }
// // //         .animate-slideInUp { animation: slideInUp 900ms ease both; }
// // //       `}</style>
// // //     </section>
// // //   );
// // // };

// // // export default TeamSection;

// // import React from 'react';
// // import { Linkedin, Instagram, MessageCircle } from 'lucide-react';
// // import profileImg from "../assets/images/Kamlesh.jpg";

// // interface SocialLink {
// //   icon: React.ReactNode;
// //   url: string;
// //   label: string;
// // }

// // interface TeamMember {
// //   name: string;
// //   role: string;
// //   description: string;
// //   image: string;
// //   profileUrl: string;
// //   delay: string;
// //   socialLinks: SocialLink[];
// // }

// // const TeamSection: React.FC = () => {
// //   const teamMembers: TeamMember[] = [
// //     {
// //       name: "Kamlesh Shah",
// //       role: "Full Stack Developer & AI Solutions Architect",
// //       description:
// //         "Full Stack Developer delivering end-to-end web solutions with modern technologies, AI integrations, and a strong emphasis on scalability, security, and clean architecture.",
// //       image: profileImg,
// //       profileUrl: "#",
// //       delay: "0ms",
// //       socialLinks: [
// //         {
// //           icon: <Linkedin size={14} />, url: "https://www.linkedin.com/in/kamlesh-shah-833a61366", label: "LinkedIn" },
// //         { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// //         { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// //       ],
// //     }
// //     // {
// //     //   name: "Jenny William",
// //     //   role: "Cloud Infrastructure Engineer",
// //     //   description:
// //     //     "Specializes in secure, high-availability cloud solutions for modern enterprises.",
// //     //   image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_2.png",
// //     //   profileUrl: "#",
// //     //   delay: "200ms",
// //     //   socialLinks: [
// //     //     { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// //     //     { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// //     //     { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// //     //     { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// //     //   ],
// //     // },
// //     // {
// //     //   name: "Daniel Thomas",
// //     //   role: "Full Stack Developer",
// //     //   description:
// //     //     "Builds robust web applications with modern frameworks and scalable APIs.",
// //     //   image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png",
// //     //   profileUrl: "#",
// //     //   delay: "400ms",
// //     //   socialLinks: [
// //     //     { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// //     //     { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// //     //     { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// //     //     { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// //     //   ],
// //     // },
// //     // {
// //     //   name: "Jessica Lauren",
// //     //   role: "Cybersecurity Analyst",
// //     //   description:
// //     //     "Ensures data protection through proactive security audits and threat monitoring.",
// //     //   image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_4.png",
// //     //   profileUrl: "#",
// //     //   delay: "600ms",
// //     //   socialLinks: [
// //     //     { icon: <Facebook size={14} />, url: "#", label: "Facebook" },
// //     //     { icon: <Twitter size={14} />, url: "#", label: "Twitter" },
// //     //     { icon: <Instagram size={14} />, url: "#", label: "Instagram" },
// //     //     { icon: <MessageCircle size={14} />, url: "#", label: "WhatsApp" },
// //     //   ],
// //     // },
// //   ];

// //   return (
// //     <section className="relative py-16 bg-[#051600]">
// //       <div className="max-w-7xl mx-auto px-4">
// //         {/* Header */}
// //         <div className="text-center mb-14">
// //           <span className="text-blue-500 uppercase tracking-wider font-medium animate-slideInUp">
// //             Expert IT Team
// //           </span>
// //           <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 animate-slideInUp">
// //             Meet Our Technology Leaders
// //           </h2>
// //         </div>

// //         {/* Team Cards */}
// //         <div className="flex flex-wrap justify-center -mx-4">
// //           {teamMembers.map((member, index) => (
// //             <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
// //               <div
// //                 className="bg-[#141414] rounded-3xl p-6 text-center border border-[#1f1f1f]
// //                 hover:border-transparent hover:shadow-[0_0_20px_rgba(1,119,209,0.45)]
// //                 transition duration-500 animate-slideInUp"
// //                 style={{ animationDelay: member.delay }}
// //               >
// //                 {/* ✅ IMAGE (FIXED & SAME FOR ALL) */}
// //                 <div className="mb-6 h-[250px] rounded-2xl bg-white overflow-hidden flex items-center justify-center">
// //                   <img
// //                     src={member.image}
// //                     alt={member.name}
// //                     className="w-full h-full object-contain object-center transition duration-500 hover:scale-105"
// //                   />
// //                 </div>

// //                 {/* Content */}
// //                 <h3 className="text-xl font-semibold text-white mb-1">
// //                   {member.name}
// //                 </h3>
// //                 <p className="text-[#0177d1] text-sm mb-4">{member.role}</p>
// //                 <p className="text-gray-400 text-sm leading-relaxed mb-6">
// //                   {member.description}
// //                 </p>

// //                 {/* Social Icons */}
// //                 <div className="flex justify-center gap-3">
// //                   {member.socialLinks.map((social, i) => (
// //                     <a
// //                       key={i}
// //                       href={social.url}
// //                       aria-label={social.label}
// //                       className="w-9 h-9 flex items-center justify-center rounded-full
// //                       border border-[#2f2f2f] text-white
// //                       transition duration-300
// //                       hover:bg-gradient-to-tr hover:from-[#0177d1]
// //                       hover:text-black"
// //                     >
// //                       {social.icon}
// //                     </a>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Animation */}
// //       <style>{`
// //         @keyframes slideInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(40px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-slideInUp {
// //           animation: slideInUp 900ms ease both;
// //         }
// //       `}</style>
// //     </section>
// //   );
// // };

// // export default TeamSection;



// import React from 'react';
// import { Linkedin, Instagram } from 'lucide-react';
// import { FaWhatsapp } from 'react-icons/fa';
// import profileImg from "../assets/images/Kamlesh.jpg";


// interface SocialLink {
//   icon: React.ReactNode;
//   url: string;
//   label: string;
// }

// interface TeamMember {
//   name: string;
//   role: string;
//   description: string;
//   image: string;
//   profileUrl: string;
//   delay: string;
//   socialLinks: SocialLink[];
// }

// const TeamSection: React.FC = () => {
//   const teamMembers: TeamMember[] = [
//      {
//       name: "Laxman Vhadade",
//       role: "Founder & CEO",
//       description:
//         "12+ years of experience in Building trusted, customer-centric real estate and fintech solutions.",
//     image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png",
//       profileUrl: "#",
//       delay: "0ms",
//       socialLinks: [
//         {
//           icon: <Linkedin size={14} />, 
//           url: "#", 
//           label: "LinkedIn" 
//         },
//         { 
//           icon: <Instagram size={14} />, 
//           url: "#", 
//           label: "Instagram" 
//         },
//         { 
//           icon: <FaWhatsapp size={14} />, 
//           url: "#", 
//           label: "WhatsApp" 
//         },
//       ],
//     },
//     {
//       name: "Kamlesh Shah",
//       role: "Senior Full Stack Developer",
//       description:
//         "Building scalable and secure full-stack web solutions.",
//     image: profileImg,
//       profileUrl: "#",
//       delay: "0ms",
//       socialLinks: [
//         {
//           icon: <Linkedin size={14} />, 
//           url: "https://www.linkedin.com/in/kamlesh-shah-833a61366", 
//           label: "LinkedIn" 
//         },
//         { 
//           icon: <Instagram size={14} />, 
//           url: "https://www.instagram.com/", 
//           label: "Instagram" 
//         },
//         { 
//           icon: <FaWhatsapp size={14} />, 
//           url: "https://wa.me/917049776747", 
//           label: "WhatsApp" 
//         },
//       ],
//     }

     
//   ];

//   return (
//     <section className="relative py-16 bg-[#051600]">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-14">
//           <span className="text-blue-500 uppercase tracking-wider font-medium animate-slideInUp">
//             Expert IT Team
//           </span>
//           <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 animate-slideInUp">
//             Meet Our Technology Leaders
//           </h2>
//         </div>

//         {/* Team Cards */}
//         <div className="flex flex-wrap justify-center -mx-4">
//           {teamMembers.map((member, index) => (
//             <div key={index} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
//               <div
//                 className="bg-[#141414] rounded-3xl p-6 text-center border border-[#1f1f1f]
//                 hover:border-transparent hover:shadow-[0_0_20px_rgba(1,119,209,0.45)]
//                 transition duration-500 animate-slideInUp"
//                 style={{ animationDelay: member.delay }}
//               >
//                 {/* Image */}
//                 <div className="mb-6 h-[250px] rounded-2xl bg-white overflow-hidden flex items-center justify-center">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-contain object-center transition duration-500 hover:scale-105"
//                   />
//                 </div>

//                 {/* Content */}
//                 <h3 className="text-xl font-semibold text-white mb-1">
//                   {member.name}
//                 </h3>
//                 <p className="text-[#0177d1] text-sm mb-4">{member.role}</p>
//                 <p className="text-gray-400 text-sm leading-relaxed mb-6">
//                   {member.description}
//                 </p>

//                 {/* Social Icons */}
//                 <div className="flex justify-center gap-3">
//                   {member.socialLinks.map((social, i) => (
//                     <a
//                       key={i}
//                       href={social.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label={social.label}
//                       className="w-9 h-9 flex items-center justify-center rounded-full
//                       border border-[#2f2f2f] text-white
//                       transition duration-300
//                       hover:bg-gradient-to-tr hover:from-[#0177d1]
//                       hover:text-black"
//                     >
//                       {social.icon}
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Animation */}
//       <style>{`
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideInUp {
//           animation: slideInUp 900ms ease both;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default TeamSection;

// components/TeamSection.tsx
import React, { useState, useEffect } from 'react';
import { Linkedin, Instagram, Globe } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string | null;
  profile_url: string;
  is_active: boolean;
  social_links_parsed: SocialLink[];
}

const TeamSection: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/team`);
      
      if (response.data.success) {
        setTeamMembers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setError('Failed to load team members');
      // Fallback to static data
      setTeamMembers(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = (): TeamMember[] => [
    {
      id: 1,
      name: "Laxman Vhadade",
      role: "Founder & CEO",
      description: "12+ years of experience in Building trusted, customer-centric real estate and fintech solutions.",
      image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png",
      profile_url: "#",
      is_active: true,
      social_links_parsed: [
        { platform: "linkedin", url: "#", icon: "Linkedin" },
        { platform: "instagram", url: "#", icon: "Instagram" },
        { platform: "whatsapp", url: "#", icon: "FaWhatsapp" }
      ]
    },
    {
      id: 2,
      name: "Kamlesh Shah",
      role: "Senior Full Stack Developer",
      description: "Building scalable and secure full-stack web solutions.",
      image: "/uploads/team/kamlesh.jpg",
      profile_url: "#",
      is_active: true,
      social_links_parsed: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/kamlesh-shah-833a61366", icon: "Linkedin" },
        { platform: "instagram", url: "https://www.instagram.com/", icon: "Instagram" },
        { platform: "whatsapp", url: "https://wa.me/917049776747", icon: "FaWhatsapp" }
      ]
    }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'linkedin':
      case 'linkedinicon':
        return <Linkedin size={14} />;
      case 'instagram':
      case 'instagramicon':
        return <Instagram size={14} />;
      case 'whatsapp':
      case 'fawhatsapp':
        return <FaWhatsapp size={14} />;
      default:
        // Fallback to Globe icon for unknown icons
        console.warn(`Unknown icon name: ${iconName}, using Globe as fallback`);
        return <Globe size={14} />;
    }
  };

  // Function to get safe social links with while loop approach
  const getSafeSocialLinks = (socialLinks: any[]): SocialLink[] => {
    const safeLinks: SocialLink[] = [];
    
    // Check if socialLinks is valid
    if (!socialLinks || !Array.isArray(socialLinks)) {
      console.warn('Invalid social links, returning default icons');
      return getDefaultSocialLinks();
    }
    
    // Using while loop to process each social link
    let i = 0;
    while (i < socialLinks.length) {
      const link = socialLinks[i];
      
      // Validate the link object
      if (link && typeof link === 'object' && link.platform && link.url) {
        safeLinks.push({
          platform: link.platform || 'unknown',
          url: link.url || '#',
          icon: link.icon || getIconNameFromPlatform(link.platform)
        });
      } else {
        console.warn(`Invalid social link at index ${i}:`, link);
      }
      
      i++;
    }
    
    // If no valid links found, return default social links
    if (safeLinks.length === 0) {
      return getDefaultSocialLinks();
    }
    
    return safeLinks;
  };

  // Helper function to get icon name from platform
  const getIconNameFromPlatform = (platform: string): string => {
    const platformLower = platform.toLowerCase();
    
    if (platformLower.includes('linkedin')) return 'Linkedin';
    if (platformLower.includes('instagram')) return 'Instagram';
    if (platformLower.includes('whatsapp')) return 'FaWhatsapp';
    if (platformLower.includes('facebook')) return 'Facebook'; // You'd need to add this icon
    if (platformLower.includes('twitter')) return 'Twitter'; // You'd need to add this icon
    
    return 'Globe'; // Fallback icon
  };

  // Default social links
  const getDefaultSocialLinks = (): SocialLink[] => [
    { platform: "LinkedIn", url: "#", icon: "Linkedin" },
    { platform: "Instagram", url: "#", icon: "Instagram" },
    { platform: "WhatsApp", url: "#", icon: "FaWhatsapp" }
  ];

  if (loading) {
    return (
      <section className="relative py-16 bg-[#051600]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Meet Our Technology Leaders
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error && teamMembers.length === 0) {
    return (
      <section className="relative py-16 bg-[#051600]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 bg-[#051600]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-blue-500 uppercase tracking-wider font-medium animate-slideInUp">
            Expert IT Team
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 animate-slideInUp">
            Meet Our Technology Leaders
          </h2>
        </div>

        {/* Team Cards */}
        <div className="flex flex-wrap justify-center -mx-4">
          {teamMembers
            .filter(member => member.is_active)
            .map((member, index) => {
              // Get safe social links for each member
              const safeSocialLinks = getSafeSocialLinks(member.social_links_parsed);
              
              return (
                <div key={member.id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
                  <div
                    className="bg-[#141414] rounded-3xl p-6 text-center border border-[#1f1f1f]
                    hover:border-transparent hover:shadow-[0_0_20px_rgba(1,119,209,0.45)]
                    transition duration-500 animate-slideInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image */}
                    <div className="mb-6 h-[250px] rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                      {member.image ? (
                        <img
                          src={member.image.startsWith('http') ? member.image : `http://localhost:5000${member.image}`}
                          alt={member.name}
                          className="w-full h-full object-contain object-center transition duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Team+Member';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#0177d1] text-sm mb-4">{member.role}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {member.description}
                    </p>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-3">
                      {safeSocialLinks.length > 0 ? (
                        safeSocialLinks.map((social, i) => (
                          <a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.platform}
                            className="w-9 h-9 flex items-center justify-center rounded-full
                            border border-[#2f2f2f] text-white
                            transition duration-300
                            hover:bg-gradient-to-tr hover:from-[#0177d1]
                            hover:text-black"
                            title={social.platform}
                          >
                            {getIconComponent(social.icon)}
                          </a>
                        ))
                      ) : (
                        // Fallback icons when no social links are available
                        getDefaultSocialLinks().map((social, i) => (
                          <a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.platform}
                            className="w-9 h-9 flex items-center justify-center rounded-full
                            border border-[#2f2f2f] text-white
                            transition duration-300
                            hover:bg-gradient-to-tr hover:from-[#0177d1]
                            hover:text-black opacity-50"
                            title={`${social.platform} (Not available)`}
                          >
                            {getIconComponent(social.icon)}
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 900ms ease both;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
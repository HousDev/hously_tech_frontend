


// // // components/TeamSection.tsx
// // import React, { useState, useEffect } from 'react';
// // import { Linkedin, Instagram, Globe } from 'lucide-react';
// // import { FaWhatsapp } from 'react-icons/fa';
// // import axios from 'axios';

// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // interface SocialLink {
// //   platform: string;
// //   url: string;
// //   icon: string;
// // }

// // interface TeamMember {
// //   id: number;
// //   name: string;
// //   role: string;
// //   description: string;
// //   image: string | null;
// //   profile_url: string;
// //   is_active: boolean;
// //   social_links_parsed: SocialLink[];
// // }

// // const TeamSection: React.FC = () => {
// //   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     fetchTeamMembers();
// //   }, []);

// //   const fetchTeamMembers = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/team`);
// //       if (response.data.success) {
// //         setTeamMembers(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Failed to fetch team members:', error);
// //       setError('Failed to load team members');
// //       setTeamMembers(getFallbackData());
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getFallbackData = (): TeamMember[] => [
// //     {
// //       id: 1,
// //       name: "Laxman Vhadade",
// //       role: "Founder & CEO",
// //       description: "12+ years of experience in Building trusted, customer-centric real estate and fintech solutions.",
// //       image: "https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png",
// //       profile_url: "#",
// //       is_active: true,
// //       social_links_parsed: [
// //         { platform: "linkedin", url: "#", icon: "Linkedin" },
// //         { platform: "instagram", url: "#", icon: "Instagram" },
// //         { platform: "whatsapp", url: "#", icon: "FaWhatsapp" }
// //       ]
// //     },
// //     {
// //       id: 2,
// //       name: "Kamlesh Shah",
// //       role: "Senior Full Stack Developer",
// //       description: "Building scalable and secure full-stack web solutions.",
// //       image: "/uploads/team/kamlesh.jpg",
// //       profile_url: "#",
// //       is_active: true,
// //       social_links_parsed: [
// //         { platform: "linkedin", url: "https://www.linkedin.com/in/kamlesh-shah-833a61366", icon: "Linkedin" },
// //         { platform: "instagram", url: "https://www.instagram.com/", icon: "Instagram" },
// //         { platform: "whatsapp", url: "https://wa.me/917049776747", icon: "FaWhatsapp" }
// //       ]
// //     }
// //   ];

// //   const getIconComponent = (iconName: string) => {
// //     switch (iconName.toLowerCase()) {
// //       case 'linkedin':
// //       case 'linkedinicon':
// //         return <Linkedin size={13} />;
// //       case 'instagram':
// //       case 'instagramicon':
// //         return <Instagram size={13} />;
// //       case 'whatsapp':
// //       case 'fawhatsapp':
// //         return <FaWhatsapp size={13} />;
// //       default:
// //         console.warn(`Unknown icon name: ${iconName}, using Globe as fallback`);
// //         return <Globe size={13} />;
// //     }
// //   };

// //   const getSafeSocialLinks = (socialLinks: any[]): SocialLink[] => {
// //     const safeLinks: SocialLink[] = [];

// //     if (!socialLinks || !Array.isArray(socialLinks)) {
// //       console.warn('Invalid social links, returning default icons');
// //       return getDefaultSocialLinks();
// //     }

// //     let i = 0;
// //     while (i < socialLinks.length) {
// //       const link = socialLinks[i];
// //       if (link && typeof link === 'object' && link.platform && link.url) {
// //         safeLinks.push({
// //           platform: link.platform || 'unknown',
// //           url: link.url || '#',
// //           icon: link.icon || getIconNameFromPlatform(link.platform)
// //         });
// //       } else {
// //         console.warn(`Invalid social link at index ${i}:`, link);
// //       }
// //       i++;
// //     }

// //     if (safeLinks.length === 0) {
// //       return getDefaultSocialLinks();
// //     }

// //     return safeLinks;
// //   };

// //   const getIconNameFromPlatform = (platform: string): string => {
// //     const platformLower = platform.toLowerCase();
// //     if (platformLower.includes('linkedin')) return 'Linkedin';
// //     if (platformLower.includes('instagram')) return 'Instagram';
// //     if (platformLower.includes('whatsapp')) return 'FaWhatsapp';
// //     if (platformLower.includes('facebook')) return 'Facebook';
// //     if (platformLower.includes('twitter')) return 'Twitter';
// //     return 'Globe';
// //   };

// //   const getDefaultSocialLinks = (): SocialLink[] => [
// //     { platform: "LinkedIn", url: "#", icon: "Linkedin" },
// //     { platform: "Instagram", url: "#", icon: "Instagram" },
// //     { platform: "WhatsApp", url: "#", icon: "FaWhatsapp" }
// //   ];

// //   if (loading) {
// //     return (
// //       <section className="relative py-16 bg-[#051600]">
// //         <div className="max-w-4xl mx-auto px-4">
// //           <div className="text-center mb-14">
// //             <h2 className="text-4xl lg:text-5xl font-bold text-white">
// //               Meet Our Technology Leaders
// //             </h2>
// //           </div>
// //           <div className="flex justify-center">
// //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   if (error && teamMembers.length === 0) {
// //     return (
// //       <section className="relative py-16 bg-[#051600]">
// //         <div className="max-w-4xl mx-auto px-4 text-center">
// //           <p className="text-red-400">{error}</p>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="relative py-16 bg-[#051600]">
// //       <div className="max-w-6xl mx-auto px-4">

// //         {/* Header */}
// //         <div className="text-center mb-12">
// //           <span className="text-blue-500 uppercase tracking-wider font-medium text-sm animate-slideInUp">
// //             Expert IT Team
// //           </span>
// //           <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 animate-slideInUp">
// //             Meet Our Technology Leaders
// //           </h2>
// //         </div>

// //         {/* Team Grid — 1 col mobile, 2 col tablet, 4 col desktop */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
// //           {teamMembers
// //             .filter(member => member.is_active)
// //             .map((member, index) => {
// //               const safeSocialLinks = getSafeSocialLinks(member.social_links_parsed);

// //               return (
// //                 <div
// //                   key={member.id}
// //                   className="w-full max-w-[300px] bg-[#141414] rounded-[20px] p-5 text-center
// //                   border border-[#1f1f1f]
// //                   hover:border-transparent hover:shadow-[0_0_24px_rgba(1,119,209,0.45)]
// //                   transition duration-500 animate-slideInUp"
// //                   style={{ animationDelay: `${index * 100}ms` }}
// //                 >
// //                   {/* Circular Avatar */}
// //                   <div className="w-[110px] h-[110px] rounded-full mx-auto mb-4 border-[3px] border-[#0177d1] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
// //                     {member.image ? (
// //                       <img
// // src={member.image.startsWith('http') ? member.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${member.image}`}
// //                         alt={member.name}
// //                         className="w-full h-full object-cover object-top transition duration-400 hover:scale-105"
// //                         onError={(e) => {
// //                           e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Team+Member';
// //                         }}
// //                       />
// //                     ) : (
// //                       <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-sm">
// //                         No Image
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Content */}
// //                   <h3 className="text-base font-bold text-white mb-1">
// //                     {member.name}
// //                   </h3>
// //                   <p className="text-[#0177d1] text-[0.72rem] font-medium mb-2.5 leading-snug">
// //                     {member.role}
// //                   </p>
// //                   <p className="text-gray-400 text-[0.72rem] leading-relaxed mb-4">
// //                     {member.description}
// //                   </p>

// //                   {/* Social Icons */}
// //                   <div className="flex justify-center gap-2">
// //                     {safeSocialLinks.length > 0 ? (
// //                       safeSocialLinks.map((social, i) => (
// //                         <a
// //                           key={i}
// //                           href={social.url}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                           aria-label={social.platform}
// //                           className="w-8 h-8 flex items-center justify-center rounded-full
// //                           border border-[#2f2f2f] text-white
// //                           transition duration-300
// //                           hover:bg-gradient-to-tr hover:from-[#0177d1] hover:to-[#01a8ff]
// //                           hover:border-transparent hover:text-white"
// //                           title={social.platform}
// //                         >
// //                           {getIconComponent(social.icon)}
// //                         </a>
// //                       ))
// //                     ) : (
// //                       getDefaultSocialLinks().map((social, i) => (
// //                         <a
// //                           key={i}
// //                           href={social.url}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                           aria-label={social.platform}
// //                           className="w-8 h-8 flex items-center justify-center rounded-full
// //                           border border-[#2f2f2f] text-white opacity-50
// //                           transition duration-300
// //                           hover:bg-gradient-to-tr hover:from-[#0177d1] hover:to-[#01a8ff]
// //                           hover:border-transparent"
// //                           title={`${social.platform} (Not available)`}
// //                         >
// //                           {getIconComponent(social.icon)}
// //                         </a>
// //                       ))
// //                     )}
// //                   </div>
// //                 </div>
// //               );
// //             })}
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
// components/TeamSection.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaLinkedinIn, FaInstagram, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ROOT =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

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

  const [currentPage, setCurrentPage] = useState(0);
  const [membersPerPage, setMembersPerPage] = useState(4);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const updateMembersPerPage = () => {
      if (window.innerWidth < 640) {
        setMembersPerPage(3); // mobile
      } else {
        setMembersPerPage(4); // desktop
      }
    };

    updateMembersPerPage();
    window.addEventListener('resize', updateMembersPerPage);
    return () => window.removeEventListener('resize', updateMembersPerPage);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/team`);
      if (response.data.success) {
        setTeamMembers(response.data.data || []);
      } else {
        setTeamMembers(getFallbackData());
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setError('Failed to load team members');
      setTeamMembers(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = (): TeamMember[] => [
    {
      id: 1,
      name: 'Laxman Vhadade',
      role: 'Founder & CEO',
      description:
        '12+ years of experience in building trusted, customer-centric real estate and fintech solutions.',
      image: 'https://html.themehour.net/robor/demo/assets/img/team/team_1_3.png',
      profile_url: '#',
      is_active: true,
      social_links_parsed: [
        { platform: 'linkedin', url: 'https://www.linkedin.com/', icon: 'linkedin' },
        { platform: 'instagram', url: 'https://www.instagram.com/', icon: 'instagram' },
        { platform: 'whatsapp', url: 'https://wa.me/919999999999', icon: 'whatsapp' }
      ]
    },
    {
      id: 2,
      name: 'Kamlesh Shah',
      role: 'Senior Full Stack Developer',
      description: 'Building scalable and secure full-stack web solutions.',
      image: '/uploads/team/kamlesh.jpg',
      profile_url: '#',
      is_active: true,
      social_links_parsed: [
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com/in/kamlesh-shah-833a61366',
          icon: 'linkedin'
        },
        {
          platform: 'instagram',
          url: 'https://www.instagram.com/',
          icon: 'instagram'
        },
        {
          platform: 'whatsapp',
          url: 'https://wa.me/917049776747',
          icon: 'whatsapp'
        }
      ]
    },
  ];

  const activeMembers = useMemo(
    () => teamMembers.filter((member) => member.is_active),
    [teamMembers]
  );

  const totalPages = Math.max(1, Math.ceil(activeMembers.length / membersPerPage));

  const visibleMembers = useMemo(() => {
    const start = currentPage * membersPerPage;
    return activeMembers.slice(start, start + membersPerPage);
  }, [activeMembers, currentPage, membersPerPage]);

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getSocialIcon = (social: SocialLink) => {
    const key = (social.platform || social.icon || '').toLowerCase();

    if (key.includes('linkedin')) return <FaLinkedinIn size={15} />;
    if (key.includes('instagram')) return <FaInstagram size={15} />;
    if (key.includes('whatsapp')) return <FaWhatsapp size={15} />;
    return <FaGlobe size={15} />;
  };

  // ✅ New function to generate WhatsApp link with pre-filled message
  const getWhatsAppLink = (url: string) => {
    if (!url || url === '#') return '#';
    
    // Extract phone number from URL
    let phoneNumber = '';
    if (url.includes('wa.me/')) {
      phoneNumber = url.split('wa.me/')[1]?.split('?')[0] || '';
    } else if (url.includes('api.whatsapp.com/send')) {
      const params = new URLSearchParams(url.split('?')[1]);
      phoneNumber = params.get('phone') || '';
    } else {
      // If it's just a number, clean it
      phoneNumber = url.replace(/\D/g, '');
    }
    
    if (!phoneNumber) return url;
    
    // Generate WhatsApp link with pre-filled message
    const message = encodeURIComponent('Hi, I would like to connect with you regarding your services.');
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getImageSrc = (image: string | null) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${API_ROOT}${image}`;
  };

  const cardThemes = [
    {
      accent: '#ff2d7a',
      soft: 'rgba(255, 45, 122, 0.12)',
      border: 'rgba(255, 45, 122, 0.45)',
      text: 'text-pink-400'
    },
    {
      accent: '#00a8ff',
      soft: 'rgba(0, 168, 255, 0.12)',
      border: 'rgba(0, 168, 255, 0.45)',
      text: 'text-sky-400'
    },
    {
      accent: '#f59e0b',
      soft: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.45)',
      text: 'text-amber-400'
    },
    {
      accent: '#10b981',
      soft: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.45)',
      text: 'text-emerald-400'
    }
  ];

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#070b17] py-20">
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-violet-500" />
          </div>
        </div>
      </section>
    );
  }

  if (error && activeMembers.length === 0) {
    return (
      <section className="bg-[#070b17] py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#070b17] py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_30%),radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-[#0076d8] px-4 py-1 text-xs font-medium tracking-wide text-white">
            Expert IT Team
          </span>

          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Meet Our <span className="text-[#0076d8]">Technology</span>
            <br />
            Leaders
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
            Visionaries and builders who turn ambitious ideas into working systems.
            Each leader brings deep expertise and relentless drive.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`transition-all duration-300 ${
                  currentPage === index
                    ? 'h-2.5 w-8 rounded-full bg-[#0076d8]'
                    : 'h-2.5 w-2.5 rounded-full bg-white/25 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {visibleMembers.map((member, index) => {
            const absoluteIndex = currentPage * membersPerPage + index;
            const theme = cardThemes[absoluteIndex % cardThemes.length];
            const initials = getInitials(member.name);
            const imageSrc = getImageSrc(member.image);

            const socialLinks = Array.isArray(member.social_links_parsed)
              ? member.social_links_parsed
              : [];

            return (
              <div
                key={member.id}
                className="group relative w-full sm:w-[255px] rounded-[20px] border border-white/8 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                style={{
                  boxShadow:
                    '0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
                  borderTop: `2.5px solid ${theme.accent}`
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-24 rounded-t-[24px] blur-2xl opacity-30"
                  style={{ background: theme.soft }}
                />

                <div className="relative z-10 text-center">
                  <div className="relative mx-auto mb-4 h-20 w-20">
                    <div
                      className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-xl font-bold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}, rgba(255,255,255,0.08))`
                      }}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-initials')) {
                              const span = document.createElement('span');
                              span.className = 'fallback-initials';
                              span.textContent = initials;
                              parent.appendChild(span);
                            }
                          }}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>

                  <p className={`mt-1 text-sm font-medium ${theme.text}`}>
                    {member.role}
                  </p>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-400">
                    {member.description}
                  </p>

                  {/* Social buttons in circle */}
                  <div className="mt-5 flex justify-center gap-3">
                    {socialLinks.map((social, i) => {
                      const hasValidUrl =
                        typeof social.url === 'string' &&
                        social.url.trim() !== '' &&
                        social.url !== '#';

                      if (!hasValidUrl) return null;

                      // ✅ For WhatsApp, use the dynamic link with pre-filled message
                      let finalUrl = social.url;
                      if (social.platform?.toLowerCase().includes('whatsapp') || 
                          social.icon?.toLowerCase().includes('whatsapp')) {
                        finalUrl = getWhatsAppLink(social.url);
                      }

                      return (
                        <a
                          key={i}
                          href={finalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform || 'Social link'}
                          className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition-all duration-300 hover:scale-105 hover:text-white"
                          style={{
                            borderColor: theme.border,
                            background: 'rgba(255,255,255,0.05)'
                          }}
                        >
                          {getSocialIcon(social)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={prevPage}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextPage}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;



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
        return <Linkedin size={13} />;
      case 'instagram':
      case 'instagramicon':
        return <Instagram size={13} />;
      case 'whatsapp':
      case 'fawhatsapp':
        return <FaWhatsapp size={13} />;
      default:
        console.warn(`Unknown icon name: ${iconName}, using Globe as fallback`);
        return <Globe size={13} />;
    }
  };

  const getSafeSocialLinks = (socialLinks: any[]): SocialLink[] => {
    const safeLinks: SocialLink[] = [];

    if (!socialLinks || !Array.isArray(socialLinks)) {
      console.warn('Invalid social links, returning default icons');
      return getDefaultSocialLinks();
    }

    let i = 0;
    while (i < socialLinks.length) {
      const link = socialLinks[i];
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

    if (safeLinks.length === 0) {
      return getDefaultSocialLinks();
    }

    return safeLinks;
  };

  const getIconNameFromPlatform = (platform: string): string => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return 'Linkedin';
    if (platformLower.includes('instagram')) return 'Instagram';
    if (platformLower.includes('whatsapp')) return 'FaWhatsapp';
    if (platformLower.includes('facebook')) return 'Facebook';
    if (platformLower.includes('twitter')) return 'Twitter';
    return 'Globe';
  };

  const getDefaultSocialLinks = (): SocialLink[] => [
    { platform: "LinkedIn", url: "#", icon: "Linkedin" },
    { platform: "Instagram", url: "#", icon: "Instagram" },
    { platform: "WhatsApp", url: "#", icon: "FaWhatsapp" }
  ];

  if (loading) {
    return (
      <section className="relative py-16 bg-[#051600]">
        <div className="max-w-4xl mx-auto px-4">
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
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 bg-[#051600]">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-blue-500 uppercase tracking-wider font-medium text-sm animate-slideInUp">
            Expert IT Team
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 animate-slideInUp">
            Meet Our Technology Leaders
          </h2>
        </div>

        {/* Team Grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
          {teamMembers
            .filter(member => member.is_active)
            .map((member, index) => {
              const safeSocialLinks = getSafeSocialLinks(member.social_links_parsed);

              return (
                <div
                  key={member.id}
                  className="w-full max-w-[300px] bg-[#141414] rounded-[20px] p-5 text-center
                  border border-[#1f1f1f]
                  hover:border-transparent hover:shadow-[0_0_24px_rgba(1,119,209,0.45)]
                  transition duration-500 animate-slideInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Circular Avatar */}
                  <div className="w-[110px] h-[110px] rounded-full mx-auto mb-4 border-[3px] border-[#0177d1] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                    {member.image ? (
                      <img
src={member.image.startsWith('http') ? member.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${member.image}`}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition duration-400 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Team+Member';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#0177d1] text-[0.72rem] font-medium mb-2.5 leading-snug">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-[0.72rem] leading-relaxed mb-4">
                    {member.description}
                  </p>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-2">
                    {safeSocialLinks.length > 0 ? (
                      safeSocialLinks.map((social, i) => (
                        <a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="w-8 h-8 flex items-center justify-center rounded-full
                          border border-[#2f2f2f] text-white
                          transition duration-300
                          hover:bg-gradient-to-tr hover:from-[#0177d1] hover:to-[#01a8ff]
                          hover:border-transparent hover:text-white"
                          title={social.platform}
                        >
                          {getIconComponent(social.icon)}
                        </a>
                      ))
                    ) : (
                      getDefaultSocialLinks().map((social, i) => (
                        <a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="w-8 h-8 flex items-center justify-center rounded-full
                          border border-[#2f2f2f] text-white opacity-50
                          transition duration-300
                          hover:bg-gradient-to-tr hover:from-[#0177d1] hover:to-[#01a8ff]
                          hover:border-transparent"
                          title={`${social.platform} (Not available)`}
                        >
                          {getIconComponent(social.icon)}
                        </a>
                      ))
                    )}
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
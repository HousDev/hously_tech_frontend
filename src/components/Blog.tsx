


import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaRegCalendarAlt, 
  FaRegUser, 
  FaRegClock,
  FaSpinner,
  FaExclamationTriangle,
  FaImages
} from "react-icons/fa";
import { blogApi, type BlogPost } from '../lib/blogApi';

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fallback posts in case API fails
  const fallbackPosts: BlogPost[] = [
    {
      id: 1,
      title: "Enterprise IT Transformation with Cloud & AI",
      excerpt: "How modern enterprises are leveraging cloud-native architecture and AI to build scalable, future-ready IT systems.",
      content: `Enterprise IT is rapidly evolving from traditional infrastructure to intelligent, cloud-native ecosystems. Organizations are adopting microservices, containerization, and AI-driven automation to improve scalability, resilience, and operational efficiency.

Cloud-native platforms enable faster deployment cycles and better fault tolerance. Combined with AI-powered monitoring and analytics, enterprises can predict failures, optimize resource usage, and reduce downtime significantly.

The future of IT infrastructure lies in autonomous systems that can self-heal, self-scale, and self-secure, allowing IT teams to focus on innovation rather than maintenance.`,
      category: "IT Solutions",
      featured_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
      read_time: "6 min read",
      published_at: "2025-06-30",
      is_published: true,
      views: 1234,
      slug: "enterprise-it-transformation",
      author_name: "Kamlesh Shah",
      author_id: 1,
      tags: ["Cloud", "AI"],
      meta_title: "",
      meta_description: "",
      created_at: "",
      updated_at: ""
    },
    {
      id: 2,
      title: "Cybersecurity Strategies for Modern IT Environments",
      excerpt: "Essential security frameworks and best practices to protect enterprise IT systems from evolving cyber threats.",
      content: `With distributed cloud systems and remote work becoming standard, traditional perimeter-based security models are no longer sufficient. Modern IT environments require a Zero Trust approach where every request is authenticated and authorized.

AI-powered security tools analyze network behavior in real time to detect anomalies and prevent breaches before they escalate. Encryption, identity management, and continuous monitoring form the foundation of a robust cybersecurity strategy.

Organizations that prioritize proactive security measures not only reduce risk but also build trust with customers and stakeholders.`,
      category: "Cybersecurity",
      featured_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
      read_time: "7 min read",
      published_at: "2025-04-08",
      is_published: true,
      views: 987,
      slug: "cybersecurity-strategies",
      author_name: "Kamlesh Shah",
      author_id: 1,
      tags: ["Security"],
      meta_title: "",
      meta_description: "",
      created_at: "",
      updated_at: ""
    },
    {
      id: 3,
      title: "Modern IT Service Management for Digital Enterprises",
      excerpt: "How AI, automation, and user-centric design are reshaping IT service delivery in digital-first organizations.",
      content: `IT Service Management (ITSM) has shifted from reactive ticket handling to proactive, intelligent service delivery. AI-powered service desks and automation tools now resolve common issues without human intervention.

Modern ITSM focuses on employee experience, predictive incident management, and seamless integration across cloud and SaaS platforms. Automation enables faster resolution times while reducing operational overhead.

The future of IT service management is personalized, predictive, and deeply integrated with business outcomes.`,
      category: "IT Services",
      featured_image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
      read_time: "8 min read",
      published_at: "2025-03-22",
      is_published: true,
      views: 765,
      slug: "modern-it-service-management",
      author_name: "Kamlesh Shah",
      author_id: 1,
      tags: ["ITSM"],
      meta_title: "",
      meta_description: "",
      created_at: "",
      updated_at: ""
    },
  ];

  // Get proper image URL with fallback
  const getImageUrl = (imageUrl: string, fallbackUrl: string): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return fallbackUrl;
    }
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, return as is (API returns full URL)
    return imageUrl;
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching blog posts from API...');
        
        const data = await blogApi.getAll();
        
        if (data && data.length > 0) {
          console.log('✅ Blog posts fetched successfully:', data.length);
          
          // Filter only published posts and get first 3
          const publishedPosts = data
            .filter((post: BlogPost) => post.is_published)
            .slice(0, 3);
          
          setPosts(publishedPosts);
        } else {
          console.warn('⚠️ Using fallback posts - API returned empty');
          setPosts(fallbackPosts);
        }
      } catch (err) {
        console.error('❌ Error fetching blog posts:', err);
        setError('Failed to load blog posts. Showing demo content.');
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderAnimatedText = (text: string) => {
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((letter, letterIndex) => (
          <span
            key={`${wordIndex}-${letterIndex}`}
            className="inline-block animate-fadeInUp"
            style={{
              animationDelay: `${(wordIndex * 100 + letterIndex * 50)}ms`
            }}
          >
            {letter}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));
  };

  const subTitle = "News";
  const mainTitle = "Our Latest News & Blog";

  const openModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section id="blog" className="py-[30px] relative overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-[1488px] text-center">
          <div className="flex flex-col items-center space-y-3">
            <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="blog" className="py-[30px] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1488px]">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="mr-2 text-sm" />
                <span className="text-xs">{error}</span>
              </div>
            </div>
          )}

          {/* Title Section - FONT SIZES REDUCED */}
          <div className="flex flex-wrap justify-between items-end -mx-3">
            {/* Left Column - Title */}
            <div className="w-full lg:w-6/12 px-3">
              <div className="mb-[30px] relative z-10 -mt-4">
                {/* Sub Title */}
                <span
                  className="inline-block text-[13px] font-medium uppercase tracking-wider text-blue-600 mb-4 relative pb-1 animate-slideInLeft"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    animationDelay: '0ms',
                  }}
                >
                  {renderAnimatedText(subTitle)}
                </span>

                {/* Main Title */}
                <h2
                  className="
                    text-[23px] 
                    sm:text-[37px] 
                    font-bold 
                    leading-tight 
                    text-gray-900 
                    mb-12
                    -mt-5 
                    animate-slideInLeft
                  "
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    animationDelay: '0ms',
                  }}
                >
                  {renderAnimatedText(mainTitle)}
                </h2>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="flex flex-wrap -mx-3 -mt-15">
            {posts.length > 0 ? (
              posts.map((post, index) => {
                const delay = `${index * 270}ms`;
                const fallbackImage = fallbackPosts[index]?.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';
                
                return (
                  <div
                    key={post.id}
                    className={`w-full lg:w-1/2 xl:w-1/3 px-3 mt-8 animate-slideInUp`}
                    style={{
                      animationDelay: delay,
                    }}
                  >
                    <div className="group h-full flex flex-col">
                      {/* Image */}
                      <div className="rounded-2xl overflow-hidden mb-4 flex-shrink-0">
                        <button 
                          onClick={() => openModal(post)}
                          className="block w-full text-left"
                        >
                          <img
                            alt={post.title}
                            src={getImageUrl(post.featured_image, fallbackImage)}
                            className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        {/* Meta Information - FONT SIZES REDUCED */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="inline-flex items-center text-gray-600 text-[11px]">
                            <FaRegCalendarAlt className="mr-1.5 text-blue-600 text-[10px]" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="inline-flex items-center text-gray-600 text-[11px]">
                            <FaRegUser className="mr-1.5 text-blue-600 text-[10px]" />
                            {post.author_name || 'Admin'}
                          </span>
                          <span className="inline-flex items-center text-gray-600 text-[11px]">
                            <FaRegClock className="mr-1.5 text-blue-600 text-[10px]" />
                            {post.read_time || '5 min read'}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {post.category || 'General'}
                          </span>
                        </div>

                        {/* Title - FONT SIZE REDUCED */}
                        <h3 className="mb-2 flex-1">
                          <button
                            onClick={() => openModal(post)}
                            className="text-lg font-bold text-gray-900 leading-[1.42] relative inline-block hover:text-blue-600 transition-colors duration-300 text-left w-full"
                            style={{
                              fontFamily: '"Space Grotesk", sans-serif',
                            }}
                          >
                            {post.title}
                          </button>
                        </h3>

                        {/* Excerpt - FONT SIZE REDUCED */}
                        <p className="text-gray-600 mb-3 line-clamp-2 text-xs">
                          {post.excerpt}
                        </p>

                        {/* Read More Button - FONT SIZE REDUCED */}
                        <button
                          onClick={() => openModal(post)}
                          className="inline-flex items-center text-[11px] font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 mt-auto w-fit"
                        >
                          Read More
                          <i className="fas fa-long-arrow-right ml-1.5 text-[10px] relative transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-12">
                <div className="text-gray-300 mb-4">
                  <FaImages className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">No blog posts available</h3>
                <p className="text-xs text-gray-600">Check back later for updates.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Post Modal - FONT SIZES REDUCED */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeModal}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white transition-colors shadow-lg"
              >
                <FaTimes className="text-sm" />
              </button>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Hero Image */}
                <div className="relative h-56 md:h-64 lg:h-72">
                  <img
                    src={getImageUrl(
                      selectedPost.featured_image, 
                      fallbackPosts.find(p => p.id === selectedPost.id)?.featured_image || 
                      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'
                    )}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-5 md:p-6 lg:p-8">
                  {/* Meta Information - FONT SIZES REDUCED */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center text-gray-600 text-xs">
                      <FaRegCalendarAlt className="mr-1.5 text-blue-600 text-[11px]" />
                      {formatDate(selectedPost.published_at)}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <FaRegUser className="mr-1.5 text-blue-600 text-[11px]" />
                      {selectedPost.author_name || 'Admin'}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <FaRegClock className="mr-1.5 text-blue-600 text-[11px]" />
                      {selectedPost.read_time || '5 min read'}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-600 text-[11px] font-medium px-3 py-1 rounded-full">
                      {selectedPost.category || 'General'}
                    </span>
                  </div>

                  {/* Title - FONT SIZE REDUCED */}
                  <h1 
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {selectedPost.title}
                  </h1>

                  {/* Excerpt - FONT SIZE REDUCED */}
                  <p className="text-sm text-gray-700 mb-5 font-medium">
                    {selectedPost.excerpt}
                  </p>

                  {/* Full Content - FONT SIZE REDUCED */}
                  <div className="prose prose-sm max-w-none mb-6">
                    {selectedPost.content?.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-xs text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.9s ease forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.9s ease forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.9s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Modal animations */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-content {
          animation: modalFadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default BlogSection;
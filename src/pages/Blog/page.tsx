import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaRegCalendarAlt,
  FaRegUser,
  FaRegClock,
  FaSpinner,
  FaSearch,
  FaTag,
} from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb';
import { blogApi, type BlogPost } from '../../lib/blogApi';

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Enterprise IT Transformation with Cloud & AI',
    excerpt: 'How modern enterprises are leveraging cloud-native architecture and AI to build scalable, future-ready IT systems.',
    content: `Enterprise IT is rapidly evolving from traditional infrastructure to intelligent, cloud-native ecosystems.`,
    category: 'IT Solutions',
    featured_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
    read_time: '6 min read',
    published_at: '2025-06-30',
    is_published: true,
    views: 1234,
    slug: 'enterprise-it-transformation',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['Cloud', 'AI'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    title: 'Cybersecurity Strategies for Modern IT Environments',
    excerpt: 'Essential security frameworks and best practices to protect enterprise IT systems from evolving cyber threats.',
    content: `With distributed cloud systems and remote work becoming standard, traditional perimeter-based security models are no longer sufficient.`,
    category: 'Cybersecurity',
    featured_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    read_time: '7 min read',
    published_at: '2025-04-08',
    is_published: true,
    views: 987,
    slug: 'cybersecurity-strategies',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['Security'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    title: 'Modern IT Service Management for Digital Enterprises',
    excerpt: 'How AI, automation, and user-centric design are reshaping IT service delivery in digital-first organizations.',
    content: `IT Service Management (ITSM) has shifted from reactive ticket handling to proactive, intelligent service delivery.`,
    category: 'IT Services',
    featured_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
    read_time: '8 min read',
    published_at: '2025-03-22',
    is_published: true,
    views: 765,
    slug: 'modern-it-service-management',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['ITSM'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    title: 'DevOps Best Practices for Faster Delivery',
    excerpt: 'Streamline your software delivery pipeline with proven DevOps strategies and automation tools.',
    content: `DevOps bridges the gap between development and operations teams to enable faster, more reliable software delivery.`,
    category: 'DevOps',
    featured_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    read_time: '5 min read',
    published_at: '2025-02-15',
    is_published: true,
    views: 642,
    slug: 'devops-best-practices',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['DevOps', 'CI/CD'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 5,
    title: 'AI-Powered Analytics for Business Growth',
    excerpt: 'Unlock hidden insights in your data with machine learning and predictive analytics platforms.',
    content: `Businesses today generate enormous amounts of data. AI-powered analytics platforms help turn raw data into actionable business intelligence.`,
    category: 'AI & ML',
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    read_time: '6 min read',
    published_at: '2025-01-20',
    is_published: true,
    views: 891,
    slug: 'ai-powered-analytics',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['AI', 'Analytics'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
  {
    id: 6,
    title: 'Cloud Migration: A Step-by-Step Guide',
    excerpt: 'Everything you need to know about moving your infrastructure to the cloud without disruption.',
    content: `Cloud migration is a complex but rewarding process that can dramatically reduce costs and improve scalability.`,
    category: 'Cloud',
    featured_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    read_time: '9 min read',
    published_at: '2024-12-10',
    is_published: true,
    views: 1102,
    slug: 'cloud-migration-guide',
    author_name: 'Kamlesh Shah',
    author_id: 1,
    tags: ['Cloud', 'Migration'],
    meta_title: '',
    meta_description: '',
    created_at: '',
    updated_at: '',
  },
];

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No date';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

const getImageUrl = (imageUrl: string, fallback: string): string => {
  if (!imageUrl || imageUrl.trim() === '') return fallback;
  return imageUrl;
};

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAll();
        const published = data?.filter((p: BlogPost) => p.is_published) ?? [];
        setPosts(published.length > 0 ? published : fallbackPosts);
        setFiltered(published.length > 0 ? published : fallbackPosts);
      } catch {
        setPosts(fallbackPosts);
        setFiltered(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    let result = [...posts];
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeCategory, posts]);

  const handleCardClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <>
      <Breadcrumb />

      {/* Hero */}
      <div className=" py-5 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Our Latest <span className="text-[#0076d8]">News & Blog</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Stay updated with the latest insights, trends, and innovations in IT and technology.
        </p>
      </div>

      <section className="py-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Search + Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8] bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeCategory === cat
                      ? 'bg-[#0076d8] text-white border-[#0076d8] shadow'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#0076d8] hover:text-[#0076d8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-24">
              <FaSpinner className="w-8 h-8 text-[#0076d8] animate-spin" />
            </div>
          )}

          {/* Grid */}
          {!loading && (
            <>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No posts found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filtered.map((post, index) => {
                    const fallbackImg =
                      fallbackPosts[index % fallbackPosts.length]?.featured_image ||
                      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';

                    return (
                      <article
                        key={post.id}
                        onClick={() => handleCardClick(post)}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={getImageUrl(post.featured_image, fallbackImg)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={e => {
                              e.currentTarget.src = fallbackImg;
                            }}
                          />
                          {/* Category badge on image */}
                          <span className="absolute top-3 left-3 bg-[#0076d8] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            {post.category || 'General'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-3 mb-3 text-gray-500 text-[11px]">
                            <span className="flex items-center gap-1">
                              <FaRegCalendarAlt className="text-[#0076d8]" />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaRegUser className="text-[#0076d8]" />
                              {post.author_name || 'Admin'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaRegClock className="text-[#0076d8]" />
                              {post.read_time || '5 min read'}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#0076d8] transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {post.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                                >
                                  <FaTag className="text-[8px]" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Read More */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-[#0076d8] text-xs font-semibold group-hover:underline">
                              Read More →
                            </span>
                            {post.views != null && (
                              <span className="text-gray-400 text-[10px]">{post.views} views</span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
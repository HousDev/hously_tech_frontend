

import React, { useState, useEffect } from 'react';
import { blogApi, type BlogPost } from '../lib/blogApi';
import { FaRegClock, FaRegCommentAlt, FaSpinner, FaExclamationTriangle, FaTag } from 'react-icons/fa';

/* ─── helpers ─────────────────────────────────────────────── */
const formatDate = (d: string | null) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
};
const getInitials = (name: string) => {
  const p = name?.trim().split(' ') || [];
  if (!p.length || !p[0]) return '?';
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
};

/* ─── BlogCard matching reference image ──────────────────── */
const BlogCard: React.FC<{ post: BlogPost; fallbackImg: string; onClick: () => void }> = ({ post, fallbackImg, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 flex flex-col"
  >
    {/* Image + category badge */}
    <div className="relative overflow-hidden flex-shrink-0">
      <img
        src={post.featured_image || fallbackImg}
        alt={post.title}
        className="w-full h-[190px] object-cover transition-transform duration-500 group-hover:scale-105"
        onError={e => { e.currentTarget.src = fallbackImg; }}
      />
      {post.category && (
        <span className="absolute top-3 left-3 bg-[#0077d9] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {post.category}
        </span>
      )}
    </div>

    {/* Card body */}
    <div className="p-4 flex flex-col flex-1">
      {/* Read time */}
      <div className="flex items-center gap-1 text-gray-500 text-[11px] mb-2">
        <FaRegClock className="text-[10px]" />
        <span>{post.read_time || '5 min read'}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2 group-hover:text-[#0077d9] transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
        {post.excerpt}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full"
            >
              <FaTag className="text-[8px] text-gray-400" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: avatar + name + date | comments + Read button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#0077d9]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-[#0077d9]">
              {getInitials(post.author_name || 'Admin')}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-900 leading-none">{post.author_name || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(post.published_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Comments */}
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <FaRegCommentAlt className="text-[9px]" />
            {post.comment_count ?? 0} comments
          </span>
          {/* Read pill button */}
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            className="inline-flex items-center gap-1 bg-[#0077d9] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#005db0] transition-all"
          >
            Read <span>→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Fallback data ───────────────────────────────────────── */
const fallbackPosts: BlogPost[] = [
  {
    id: 1, title: 'Enterprise IT Transformation with Cloud & AI',
    excerpt: 'How modern enterprises are leveraging cloud-native architecture and AI to build scalable, future-ready IT systems.',
    content: '', category: 'IT Solutions',
    featured_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
    read_time: '6 min read', published_at: '2025-06-30', is_published: true, views: 1234,
    slug: 'enterprise-it-transformation', author_name: 'Kamlesh Shah', author_id: 1, tags: ['Cloud', 'AI'],
    meta_title: '', meta_description: '', created_at: '', updated_at: '',
  },
  {
    id: 2, title: 'Cybersecurity Strategies for Modern IT Environments',
    excerpt: 'Essential security frameworks and best practices to protect enterprise IT systems from evolving cyber threats.',
    content: '', category: 'Cybersecurity',
    featured_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    read_time: '7 min read', published_at: '2025-04-08', is_published: true, views: 987,
    slug: 'cybersecurity-strategies', author_name: 'Kamlesh Shah', author_id: 1, tags: ['Security'],
    meta_title: '', meta_description: '', created_at: '', updated_at: '',
  },
  {
    id: 3, title: 'Modern IT Service Management for Digital Enterprises',
    excerpt: 'How AI, automation, and user-centric design are reshaping IT service delivery in digital-first organizations.',
    content: '', category: 'IT Services',
    featured_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
    read_time: '8 min read', published_at: '2025-03-22', is_published: true, views: 765,
    slug: 'modern-it-service-management', author_name: 'Kamlesh Shah', author_id: 1, tags: ['ITSM'],
    meta_title: '', meta_description: '', created_at: '', updated_at: '',
  },
];

/* ─── Main Section Component ──────────────────────────────── */
const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getAll();
        if (data && data.length > 0) {
          setPosts(data.filter((p: BlogPost) => p.is_published).slice(0, 3));
        } else {
          setPosts(fallbackPosts);
        }
      } catch {
        setError('Failed to load blog posts. Showing demo content.');
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 max-w-7xl text-center py-16">
          <FaSpinner className="w-8 h-8 text-[#0077d9] animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Background — same as CaseStudy */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,118,216,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,118,216,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Error notice */}
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
              <FaExclamationTriangle className="text-sm flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Header — same badge/title pattern as CaseStudy */}
          <div className="flex flex-wrap justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-full border border-blue-200/30 mb-3 -mt-2">


                <span className="text-[10px] font-bold text-[#0077d9] tracking-wider uppercase">News & Blog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Our Latest</span>{' '}
                <span className="text-[#0077d9]">News & Blog</span>
              </h2>
            </div>
            {/* View all — desktop */}
            <div className="hidden lg:block">
              <button
                onClick={() => window.location.href = '/blog'}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-[#0077d9] hover:text-[#0077d9] transition-all duration-300 cursor-pointer"
              >
                View All Posts <span>→</span>
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                fallbackImg={fallbackPosts[i]?.featured_image || ''}
                onClick={() => window.location.href = `/blog/${post.id}`}
              />
            ))}
          </div>

          {/* View all — mobile */}
          <div className="lg:hidden flex justify-center mt-8">
            <button
              onClick={() => window.location.href = '/blog'}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-[#0077d9] hover:text-[#0077d9] transition-all duration-300 cursor-pointer"
            >
              View All Posts <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default BlogSection;
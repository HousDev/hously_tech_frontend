

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaRegCalendarAlt,
  FaRegUser,
  FaRegClock,
  FaSpinner,

  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaCopy,
  FaTimes,
  FaEye,
  FaTag,
} from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumb';
import { blogApi, type BlogPost, type BlogComment } from '../../../lib/blogApi';

// ── fallback data ────────────────────────────────────────────────────────
const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Enterprise IT Transformation with Cloud & AI',
    excerpt: 'How modern enterprises are leveraging cloud-native architecture and AI to build scalable, future-ready IT systems.',
    content: `Enterprise IT is rapidly evolving from traditional infrastructure to intelligent, cloud-native ecosystems. Organizations are adopting microservices, containerization, and AI-driven automation to improve scalability, resilience, and operational efficiency.

Cloud-native platforms enable faster deployment cycles and better fault tolerance. Combined with AI-powered monitoring and analytics, enterprises can predict failures, optimize resource usage, and reduce downtime significantly.

The future of IT infrastructure lies in autonomous systems that can self-heal, self-scale, and self-secure, allowing IT teams to focus on innovation rather than maintenance.`,
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
    comment_count: 3,
  },
  {
    id: 2,
    title: 'Cybersecurity Strategies for Modern IT Environments',
    excerpt: 'Essential security frameworks and best practices to protect enterprise IT systems from evolving cyber threats.',
    content: `With distributed cloud systems and remote work becoming standard, traditional perimeter-based security models are no longer sufficient. Modern IT environments require a Zero Trust approach where every request is authenticated and authorized.

AI-powered security tools analyze network behavior in real time to detect anomalies and prevent breaches before they escalate. Encryption, identity management, and continuous monitoring form the foundation of a robust cybersecurity strategy.

Organizations that prioritize proactive security measures not only reduce risk but also build trust with customers and stakeholders.`,
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
    comment_count: 2,
  },
  {
    id: 3,
    title: 'Modern IT Service Management for Digital Enterprises',
    excerpt: 'How AI, automation, and user-centric design are reshaping IT service delivery in digital-first organizations.',
    content: `IT Service Management (ITSM) has shifted from reactive ticket handling to proactive, intelligent service delivery. AI-powered service desks and automation tools now resolve common issues without human intervention.

Modern ITSM focuses on employee experience, predictive incident management, and seamless integration across cloud and SaaS platforms. Automation enables faster resolution times while reducing operational overhead.

The future of IT service management is personalized, predictive, and deeply integrated with business outcomes.`,
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
    comment_count: 5,
  },
  {
    id: 4,
    title: 'DevOps Best Practices for Faster Delivery',
    excerpt: 'Streamline your software delivery pipeline with proven DevOps strategies and automation tools.',
    content: `DevOps bridges the gap between development and operations teams to enable faster, more reliable software delivery.

Continuous Integration and Continuous Deployment (CI/CD) pipelines automate testing and deployment, reducing the time from code commit to production. Infrastructure as Code (IaC) tools like Terraform and Ansible ensure consistent, reproducible environments.

The key to successful DevOps adoption is cultural change — breaking down silos between dev, ops, and security teams to foster collaboration and shared responsibility.`,
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
    comment_count: 1,
  },
  {
    id: 5,
    title: 'AI-Powered Analytics for Business Growth',
    excerpt: 'Unlock hidden insights in your data with machine learning and predictive analytics platforms.',
    content: `Businesses today generate enormous amounts of data. AI-powered analytics platforms help turn raw data into actionable business intelligence.

Predictive analytics can forecast customer behavior, supply chain disruptions, and market trends before they happen. Natural Language Processing (NLP) enables non-technical users to query complex datasets in plain English.

Organizations that invest in AI analytics gain a significant competitive advantage through faster, smarter decision-making.`,
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
    comment_count: 4,
  },
  {
    id: 6,
    title: 'Cloud Migration: A Step-by-Step Guide',
    excerpt: 'Everything you need to know about moving your infrastructure to the cloud without disruption.',
    content: `Cloud migration is a complex but rewarding process that can dramatically reduce costs and improve scalability.

Start with a thorough assessment of your existing infrastructure, workloads, and dependencies. Choose the right migration strategy: Rehost (Lift & Shift), Replatform, Refactor, or Replace, depending on each application's requirements.

A phased approach — starting with non-critical workloads — reduces risk and allows your team to build cloud expertise gradually before migrating mission-critical systems.`,
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
    comment_count: 2,
  },
];

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'No date';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return 'Invalid date'; }
};

const getImageUrl = (imageUrl: string, fallback: string): string => {
  if (!imageUrl || imageUrl.trim() === '') return fallback;
  return imageUrl;
};

const allTags = Array.from(new Set(fallbackPosts.flatMap(p => p.tags ?? [])));

const getCommentColor = (name: string) => {
  const colors = ['#0077d9', '#0D9488', '#DC2626', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/* ════════════════════════════════════════════════════════════
   BLOG DETAIL PAGE
════════════════════════════════════════════════════════════ */
const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Comment states
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commenterEmail, setCommenterEmail] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Post Like state - Dynamic from DB
  const [postLiked, setPostLiked] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);
  const [postLikeLoading, setPostLikeLoading] = useState(false);

  // Save state (local storage for now)
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  // ── Fetch post and comments (UNCHANGED) ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getAll();
        const published: BlogPost[] = data?.filter((p: BlogPost) => p.is_published) ?? [];
        const list = published.length > 0 ? published : fallbackPosts;
        setAllPosts(list);

        const found = list.find(p => p.id === Number(id));
        setPost(found ?? list[0] ?? null);

        if (found) {
          setPostLikeCount(found.like_count || 0);
          await fetchComments(Number(id));
          await fetchPostLikeStatus(Number(id));
        }
      } catch {
        setAllPosts(fallbackPosts);
        const found = fallbackPosts.find(p => p.id === Number(id));
        setPost(found ?? fallbackPosts[0]);
        if (found) {
          setPostLikeCount(found.like_count || 0);
          await fetchComments(Number(id));
          await fetchPostLikeStatus(Number(id));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch comments from API (UNCHANGED)
  const fetchComments = async (postId: number) => {
    try {
      setCommentsLoading(true);
      const response = await blogApi.getComments(postId);
      setComments(response);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch post like status (UNCHANGED)
  const fetchPostLikeStatus = async (postId: number) => {
    try {
      const response = await blogApi.getPostLikeStatus(postId);
      setPostLiked(response.liked);
      setPostLikeCount(response.likeCount);
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  // Handle post like (UNCHANGED)
  const handlePostLike = async () => {
    if (postLikeLoading) return;
    const alreadyLiked = localStorage.getItem(`liked_post_${id}`) === 'true';
    if (!postLiked && alreadyLiked) {
      alert('You already liked this post');
      return;
    }
    setPostLikeLoading(true);
    try {
      if (postLiked) {
        await blogApi.unlikePost(Number(id));
        setPostLiked(false);
        setPostLikeCount(prev => prev - 1);
        localStorage.removeItem(`liked_post_${id}`);
      } else {
        await blogApi.likePost(Number(id));
        setPostLiked(true);
        setPostLikeCount(prev => prev + 1);
        localStorage.setItem(`liked_post_${id}`, 'true');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update like. Please try again.');
    } finally {
      setPostLikeLoading(false);
    }
  };

  // Add comment (UNCHANGED)
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim()) return;
    try {
      setSubmittingComment(true);
      const newCommentObj = await blogApi.addComment(Number(id), {
        name: commenterName,
        email: commenterEmail || null,
        content: newComment,
      });
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      if (post) {
        setPost({ ...post, comment_count: (post.comment_count || 0) + 1 });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await blogApi.likeComment(commentId);
      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: (comment.likes || 0) + 1 }
          : comment
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    if (!isSaved) {
      savedPosts.push(Number(id));
      localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts));
    } else {
      const filtered = savedPosts.filter((pId: number) => pId !== Number(id));
      localStorage.setItem('savedBlogPosts', JSON.stringify(filtered));
    }
  };

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    setIsSaved(savedPosts.includes(Number(id)));
    const likedStatus = localStorage.getItem(`liked_post_${id}`) === 'true';
    if (likedStatus) setPostLiked(true);
  }, [id]);

  const handleShare = () => setShowShareModal(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    let shareUrl = '';
    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter':  shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
      case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
      case 'email':    shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${title}&body=${url}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const recentPosts = allPosts.filter(p => p.id !== post?.id).slice(0, 5);
  const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));

  // ── Loading / Not found ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-8 h-8 text-[#0077d9] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Blog post not found.</p>
        <button onClick={() => navigate('/blog')} className="text-[#0077d9] text-sm font-semibold hover:underline">
          ← Back to Blog
        </button>
      </div>
    );
  }

  const fallbackImg = fallbackPosts.find(p => p.id === post.id)?.featured_image ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';

  // Derive table of contents from content paragraphs (headings = bold-started lines)
  const contentParagraphs = (post.content || '').split('\n\n').filter(Boolean);

  return (
    <>
      <Breadcrumb />

      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Back button ── */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm text-[#0077d9] font-medium mb-5 hover:gap-3 transition-all"
          >
            <FaArrowLeft className="text-xs" /> Back to all posts
          </button>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════ */}
            <main className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Hero Image */}
              <div className="relative">
                <img
                  src={getImageUrl(post.featured_image, fallbackImg)}
                  alt={post.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  onError={e => { e.currentTarget.src = fallbackImg; }}
                />
                {/* Like + Share icons — top right of image (white circles) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={handlePostLike}
                    disabled={postLikeLoading}
                    className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all ${
                      postLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                    } disabled:opacity-50`}
                  >
                    {postLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#0077d9] transition-all"
                  >
                    <FaShareAlt className="text-sm" />
                  </button>
                </div>
              </div>

              {/* ── Post body ── */}
              <div className="p-5 sm:p-8">

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
                  {post.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <span className="flex items-center gap-1.5">
                    <FaRegUser className="text-[#0077d9]" />
                    {post.author_name || 'Admin'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaComment className="text-[#0077d9]" />
                    {post.comment_count || comments.length} comments
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaRegCalendarAlt className="text-[#0077d9]" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaRegClock className="text-[#0077d9]" />
                    {post.read_time || '5 min read'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaEye className="text-[#0077d9]" />
                    {post.views?.toLocaleString() || 0} views
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {post.excerpt}
                </p>

                {/* Table of Contents */}
                {contentParagraphs.length > 1 && (
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Table of Contents</h2>
                    <ol className="space-y-1">
                      {contentParagraphs.map((para, i) => {
                        const heading = para.split('\n')[0].replace(/\*\*/g, '');
                        return (
                          <li key={i}>
                            <a
                              href={`#section-${i}`}
                              className="text-sm text-[#0077d9] hover:underline"
                            >
                              {heading.length > 60 ? heading.slice(0, 60) + '…' : heading}
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-5 mb-8">
                  {contentParagraphs.map((para, i) => {
                    const lines = para.split('\n');
                    const firstLine = lines[0];
                    const rest = lines.slice(1).join('\n');
                    const isHeading = firstLine.startsWith('**') || firstLine.length < 60;
                    return (
                      <div key={i} id={`section-${i}`}>
                        {isHeading && firstLine && (
                          <h3 className="text-sm font-bold text-gray-900 mb-1">
                            {firstLine.replace(/\*\*/g, '')}
                          </h3>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {isHeading ? rest || firstLine : para}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-gray-100 mb-8">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:border-[#0077d9] hover:text-[#0077d9] transition cursor-pointer"
                      >
                        <FaTag className="text-[8px]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* ── Comments ── */}
                <div id="comments">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">
                    Comments ({post.comment_count || comments.length})
                  </h2>

                  {/* Comment form */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-8">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className="w-full text-sm text-gray-700 placeholder-gray-400 border-0 outline-none resize-none mb-4"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <input
                        type="text"
                        placeholder="Name (optional)"
                        value={commenterName}
                        onChange={e => setCommenterName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d9]"
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={commenterEmail}
                        onChange={e => setCommenterEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d9]"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => { setNewComment(''); setCommenterName(''); setCommenterEmail(''); }}
                        className="px-5 py-2 text-sm border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleAddComment}
                        disabled={submittingComment}
                        className="px-5 py-2 text-sm bg-[#0077d9] text-white rounded-full hover:bg-[#005db0] transition disabled:opacity-50"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>

                  {/* Comments list */}
                  {commentsLoading ? (
                    <div className="flex justify-center py-8">
                      <FaSpinner className="w-6 h-6 text-[#0077d9] animate-spin" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">No comments yet. Be the first to comment!</p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id}>
                          <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: getCommentColor(comment.name) }}
                            >
                              <span className="text-xs font-bold text-white">{getInitials(comment.name)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-gray-900">{comment.name}</span>
                                <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleLikeComment(comment.id)}
                                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition"
                                >
                                  <FaRegHeart className="text-[10px]" />
                                  {comment.likes || 0} likes
                                </button>
                                <button
                                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                  className="flex items-center gap-1 text-xs text-[#0077d9] hover:underline"
                                >
                                  <FaComment className="text-[10px]" /> Reply
                                </button>
                              </div>
                              {/* Reply form */}
                              {replyingTo === comment.id && (
                                <div className="mt-3 pl-2 border-l-2 border-[#0077d9]/30 space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Your name *"
                                    value={replyName}
                                    onChange={e => setReplyName(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0077d9]"
                                  />
                                  <textarea
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder={`Replying to ${comment.name}...`}
                                    rows={2}
                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0077d9] resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={async () => {
                                        if (!replyText.trim() || !replyName.trim()) return;
                                        try {
                                          const newReply = await blogApi.addComment(Number(id), {
                                            name: replyName, email: null, content: replyText,
                                            // @ts-ignore
                                            parent_id: comment.id,
                                          });
                                          setComments(prev => prev.map(c =>
                                            c.id === comment.id ? { ...c, replies: [...(c.replies || []), newReply] } : c
                                          ));
                                          setReplyText(''); setReplyName(''); setReplyingTo(null);
                                        } catch { alert('Failed to post reply'); }
                                      }}
                                      className="px-3 py-1 bg-[#0077d9] text-white text-xs rounded-lg hover:bg-[#005db0] transition"
                                    >
                                      Post Reply
                                    </button>
                                    <button
                                      onClick={() => { setReplyingTo(null); setReplyText(''); setReplyName(''); }}
                                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Nested replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-2 space-y-2">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex gap-3 p-2.5 bg-blue-50/50 rounded-xl border-l-2 border-[#0077d9]/20">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: getCommentColor(reply.name) }}
                                  >
                                    <span className="text-[10px] font-bold text-white">{getInitials(reply.name)}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-xs font-semibold text-gray-900">{reply.name}</span>
                                      <span className="text-[10px] text-gray-400">{formatDate(reply.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-gray-700">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* ════════════════════════════════
                SIDEBAR — matches reference images
            ════════════════════════════════ */}
            <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

              {/* Author card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0077d9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {getInitials(post.author_name || 'Admin')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{post.author_name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Contributor</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Read more from {post.author_name || 'Admin'}.</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#0077d9] text-white text-xs font-semibold rounded-lg hover:bg-[#005db0] transition">
                    Follow
                  </button>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-semibold transition ${
                      isSaved ? 'border-[#0077d9] text-[#0077d9]' : 'border-gray-300 text-gray-600 hover:border-[#0077d9] hover:text-[#0077d9]'
                    }`}
                  >
                    {isSaved ? <FaBookmark className="text-[10px]" /> : <FaRegBookmark className="text-[10px]" />}
                    Save
                  </button>
                </div>
              </div>

              {/* Recent posts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent posts</h3>
                <div className="space-y-3">
                  {recentPosts.map(recent => {
                    const rFallback = fallbackPosts.find(f => f.id === recent.id)?.featured_image ||
                      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200';
                    return (
                      <div
                        key={recent.id}
                        onClick={() => navigate(`/blog/${recent.id}`)}
                        className="flex gap-3 cursor-pointer group"
                      >
                        <img
                          src={getImageUrl(recent.featured_image, rFallback)}
                          alt={recent.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-[#0077d9] transition line-clamp-2 leading-snug mb-1">
                            {recent.title}
                          </p>
                          <p className="text-[10px] text-gray-400">{formatDate(recent.published_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent comments */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent comments</h3>
                {commentsLoading ? (
                  <div className="flex justify-center py-3">
                    <FaSpinner className="w-4 h-4 text-[#0077d9] animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-[#0077d9] text-center py-2">No recent comments</p>
                ) : (
                  <div className="space-y-3">
                    {comments.slice(0, 3).map(c => (
                      <div key={c.id} className="flex gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getCommentColor(c.name) }}
                        >
                          <span className="text-[10px] font-bold text-white">{getInitials(c.name)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat, i) => (
                    <Link
                      key={i}
                      to={`/blog?category=${cat}`}
                      className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-[#0077d9] hover:text-white transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter — dark card */}
              <div className="bg-[#1e3a5f] rounded-2xl p-5 text-white">
                <h3 className="text-sm font-bold mb-1">Join our newsletter</h3>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Weekly insights, market updates and featured listings — delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-gray-800 bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077d9]"
                />
                <button className="w-full py-2 bg-[#0077d9] text-white text-sm font-semibold rounded-lg hover:bg-[#005db0] transition">
                  Subscribe
                </button>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {/* ── Share Modal (UNCHANGED logic) ── */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Share this post</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <FaTimes className="text-sm text-gray-600" />
              </button>
            </div>
            <img src={getImageUrl(post.featured_image, fallbackImg)} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-4" />
            <p className="text-sm font-semibold text-gray-900 mb-1">{post.title}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { key: 'facebook', color: '#1877F2', Icon: FaFacebookF, label: 'Facebook' },
                { key: 'twitter',  color: '#1DA1F2', Icon: FaTwitter,    label: 'Twitter' },
                { key: 'linkedin', color: '#0077B5', Icon: FaLinkedinIn, label: 'LinkedIn' },
                { key: 'whatsapp', color: '#25D366', Icon: FaWhatsapp,   label: 'WhatsApp' },
              ].map(({ key, color, Icon, label }) => (
                <button key={key} onClick={() => handleShareToSocial(key)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                    <Icon className="text-sm" />
                  </div>
                  <span className="text-xs text-gray-600">{label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center gap-2">
              <input type="text" readOnly value={window.location.href} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50" />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#0077d9] text-white rounded-lg text-sm font-medium hover:bg-[#005db0] transition flex items-center gap-2"
              >
                <FaCopy className="text-xs" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        .line-clamp-1 { display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      `}</style>
    </>
  );
};

export default BlogDetailPage;
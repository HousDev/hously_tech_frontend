

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaRegCalendarAlt,
  FaRegUser,
  FaRegClock,
  FaSpinner,
  FaSearch,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaUserCircle,
  FaThumbsUp,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaCopy,
  FaTimes,
  FaEye,
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

// Sample liked users for display - will be dynamic from DB later
const likedUsers = [
  { name: 'Rahul Mehta', avatar: 'https://ui-avatars.com/api/?background=0D9488&color=fff&name=Rahul+Mehta' },
  { name: 'Neha Sharma', avatar: 'https://ui-avatars.com/api/?background=0076d8&color=fff&name=Neha+Sharma' },
  { name: 'Amit Patel', avatar: 'https://ui-avatars.com/api/?background=DC2626&color=fff&name=Amit+Patel' },
  { name: 'Priya Singh', avatar: 'https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=Priya+Singh' },
  { name: 'Vikram Rao', avatar: 'https://ui-avatars.com/api/?background=F59E0B&color=fff&name=Vikram+Rao' },
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

const allTags = Array.from(new Set(fallbackPosts.flatMap(p => p.tags ?? [])));
// Helper for comment avatar color (based on name hash)
const getCommentColor = (name: string) => {
  const colors = ['#0076d8', '#0D9488', '#DC2626', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

// Helper for comment initials (first letter of first and last name)
const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Save state (local storage for now - can be moved to DB later)
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);



  const [replyingTo, setReplyingTo] = useState<number | null>(null);
const [replyText, setReplyText] = useState('');
const [replyName, setReplyName] = useState('');
  // Fetch post and comments
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
          // Set initial like count from post data
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

  // Fetch comments from API
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

  // Fetch post like status from API
  const fetchPostLikeStatus = async (postId: number) => {
    try {
      const response = await blogApi.getPostLikeStatus(postId);
      setPostLiked(response.liked);
      setPostLikeCount(response.likeCount);
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  // Handle post like (dynamic)
 const handlePostLike = async () => {
  if (postLikeLoading) return;

  // Prevent double-like from same browser
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

  // Add comment to API
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
    // Store in localStorage for now
    const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
    if (!isSaved) {
      savedPosts.push(Number(id));
      localStorage.setItem('savedBlogPosts', JSON.stringify(savedPosts));
    } else {
      const filtered = savedPosts.filter((pId: number) => pId !== Number(id));
      localStorage.setItem('savedBlogPosts', JSON.stringify(filtered));
    }
  };

  // Check if post is saved on load
 useEffect(() => {
  const savedPosts = JSON.parse(localStorage.getItem('savedBlogPosts') || '[]');
  setIsSaved(savedPosts.includes(Number(id)));
  // Restore like status from localStorage
  const likedStatus = localStorage.getItem(`liked_post_${id}`) === 'true';
  if (likedStatus) setPostLiked(true);
}, [id]);

  const handleShare = () => {
    setShowShareModal(true);
  };

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
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const recentPosts = allPosts.filter(p => p.id !== post?.id).slice(0, 4);
  const categories = Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-[#0076d8] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Blog post not found.</p>
        <button
          onClick={() => navigate('/blog')}
          className="text-[#0076d8] text-sm font-semibold hover:underline"
        >
          ← Back to Blog
        </button>
      </div>
    );
  }

  const fallbackImg = fallbackPosts.find(p => p.id === post.id)?.featured_image ||
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';

  return (
    <>
      <Breadcrumb />
      
      <section className="py-8 md:py-2 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* ── MAIN CONTENT ───────────────────────────────────── */}
            <main className="flex-1 min-w-0">
              {/* Back button */}
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-sm text-[#0076d8] font-medium mb-5 hover:gap-3 transition-all"
              >
                <FaArrowLeft className="text-xs" /> Back to all posts
              </button>

              {/* Hero Image - Always visible buttons */}
              <div className="relative rounded-xl overflow-hidden mb-5 shadow-md">
                <img
                  src={getImageUrl(post.featured_image, fallbackImg)}
                  alt={post.title}
                  className="w-full h-56 md:h-72 lg:h-80 object-cover"
                  onError={e => { e.currentTarget.src = fallbackImg; }}
                />
                {/* Post Action buttons - Always visible */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={handlePostLike}
                    disabled={postLikeLoading}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      postLiked ? 'bg-red-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-red-500'
                    } disabled:opacity-50`}
                  >
                    {postLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-[#0076d8] transition-all text-white"
                  >
                    <FaShareAlt className="text-sm" />
                  </button>
                  <button
                    onClick={handleSave}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isSaved ? 'bg-[#0076d8] text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-[#0076d8]'
                    }`}
                  >
                    {isSaved ? <FaBookmark className="text-sm" /> : <FaRegBookmark className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Compact Meta Row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-3 text-gray-500 text-xs">
                <span className="flex items-center gap-1.5">
                  <FaRegCalendarAlt className="text-[#0076d8]" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaRegUser className="text-[#0076d8]" />
                  {post.author_name || 'Admin'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaRegClock className="text-[#0076d8]" />
                  {post.read_time || '5 min read'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaEye className="text-[#0076d8]" />
                  {post.views?.toLocaleString() || 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <FaComment className="text-[#0076d8]" />
                  {post.comment_count || comments.length} comments
                </span>
              </div>

              {/* Category & Title */}
              <span className="inline-block bg-[#0076d8]/10 text-[#0076d8] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {post.category || 'General'}
              </span>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm md:text-base mb-5 border-l-3 border-[#0076d8] pl-4 bg-[#0076d8]/5 py-2 rounded-r-lg">
                {post.excerpt}
              </p>

              {/* Content */}
              <div className="prose prose-sm max-w-none mb-6 text-gray-700 leading-relaxed space-y-3">
                {post.content?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm md:text-base">
                    {para}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-700">Tags:</span>
                {(post.tags ?? []).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-[#0076d8] hover:text-white transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </main>

            {/* ── SIDEBAR ── Compact & Modern ───────────────────── */}
            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-5">
              
              {/* Author Card - Only author info, removed action card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-4 sm:mt-10">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?background=0076d8&color=fff&name=${encodeURIComponent(post.author_name || 'Admin')}&size=60&font-size=0.35`}
                    alt={post.author_name}
                    className="w-12 h-12 rounded-full border-2 border-[#0076d8]/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{post.author_name || 'Admin'}</h4>
                    <p className="text-xs text-[#0076d8]">Tech Writer & IT Consultant</p>
                    <div className="flex gap-1.5 mt-1">
                      <a href="#" className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0076d8] hover:text-white transition text-xs">
                        <FaTwitter className="text-[10px]" />
                      </a>
                      <a href="#" className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0076d8] hover:text-white transition text-xs">
                        <FaLinkedinIn className="text-[10px]" />
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">Passionate about cloud computing, AI, and digital transformation. Helping businesses leverage technology for growth.</p>
              </div>

              {/* Like Stats Card - Dynamic like count from DB */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePostLike}
                      disabled={postLikeLoading}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        postLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      } disabled:opacity-50`}
                    >
                      {postLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                      <span className="text-sm font-medium">{postLikeCount}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                    >
                      <FaShareAlt className="text-sm" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        isSaved ? 'bg-[#0076d8]/10 text-[#0076d8]' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {isSaved ? <FaBookmark className="text-[#0076d8]" /> : <FaRegBookmark />}
                      <span className="text-sm font-medium">Save</span>
                    </button>
                  </div>
                </div>
                
                {/* Liked by users */}
                <div className="mt-3 pt-3 border-t border-gray-100">
  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
    <FaThumbsUp className="text-[#0076d8] text-xs" />
    {postLikeCount > 0 
      ? `Liked by ${postLikeCount} ${postLikeCount === 1 ? 'person' : 'people'}`
      : 'Be the first to like this post'}
  </p>
</div>
              </div>

              {/* Recent Comments - Moved to Sidebar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaComment className="text-[#0076d8] text-xs" />
                  Recent Comments
                </h3>
                {commentsLoading ? (
                  <div className="flex justify-center py-4">
                    <FaSpinner className="w-4 h-4 text-[#0076d8] animate-spin" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  <div className="space-y-3">
                    {comments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0076d8]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-[#0076d8]">
                            {comment.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{comment.name}</span>
                            <span className="text-[9px] text-gray-400">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-[10px] text-gray-600 truncate">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    {comments.length > 5 && (
                      <Link to="#comments" className="text-[10px] text-[#0076d8] hover:underline block text-center">
                        View all {comments.length} comments →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/blog?search=${searchQuery}`); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8]"
                  />
                  <button
                    onClick={() => { if (searchQuery.trim()) navigate(`/blog?search=${searchQuery}`); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0076d8] text-white rounded-md flex items-center justify-center"
                  >
                    <FaSearch className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((cat, i) => (
                    <Link key={i} to={`/blog?category=${cat}`} className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-[#0076d8] hover:text-white transition">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Posts</h3>
                <div className="space-y-3">
                  {recentPosts.map(recent => {
                    const rFallback = fallbackPosts.find(f => f.id === recent.id)?.featured_image ||
                      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200';
                    return (
                      <div 
                        key={recent.id} 
                        onClick={() => navigate(`/blog/${recent.id}`)} 
                        className="group cursor-pointer bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex gap-3">
                          <img 
                            src={getImageUrl(recent.featured_image, rFallback)} 
                            alt={recent.title} 
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-[#0076d8] font-medium">{recent.category}</span>
                            <p className="text-xs font-semibold text-gray-800 group-hover:text-[#0076d8] transition line-clamp-2 mt-0.5">
                              {recent.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                <FaRegCalendarAlt className="text-[7px]" />
                                {formatDate(recent.published_at)}
                              </span>
                              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                <FaRegClock className="text-[7px]" />
                                {recent.read_time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.slice(0, 8).map((tag, i) => (
                    <span key={i} className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full hover:bg-[#0076d8] hover:text-white transition cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ── COMMENTS SECTION ── With Circle Avatars (Restored original style) ── */}
          <div id="comments" className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-5">
              <FaComment className="text-[#0076d8] text-lg" />
              <h2 className="text-lg font-bold text-gray-900">Comments ({post.comment_count || comments.length})</h2>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0076d8]/10 flex items-center justify-center flex-shrink-0">
                  <FaUserCircle className="w-5 h-5 text-[#0076d8]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8]"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email (optional)"
                      value={commenterEmail}
                      onChange={(e) => setCommenterEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8]"
                    />
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0076d8] resize-none"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={submittingComment}
                    className="px-4 py-1.5 bg-[#0076d8] text-white text-sm rounded-lg hover:bg-[#005db0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List - With Circle Avatars (Original Style) */}
      {/* Comments List - With Replies */}
{commentsLoading ? (
  <div className="flex justify-center py-8">
    <FaSpinner className="w-6 h-6 text-[#0076d8] animate-spin" />
  </div>
) : comments.length === 0 ? (
  <div className="text-center py-8 bg-gray-50 rounded-xl">
    <FaComment className="w-12 h-12 text-gray-300 mx-auto mb-2" />
    <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
  </div>
) : (
  <div className="space-y-4">
    {comments.map((comment) => (
      <div key={comment.id}>
        {/* ── Parent Comment ── */}
        <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCommentColor(comment.name) }}
          >
            <span className="text-xs font-bold text-white">
              {getInitials(comment.name)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
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
                <span>{comment.likes || 0} likes</span>
              </button>
              {/* ✅ Reply button */}
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-xs text-[#0076d8] hover:underline transition"
              >
                <FaComment className="text-[10px]" />
                Reply
              </button>
            </div>

            {/* ✅ Inline Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 pl-2 border-l-2 border-[#0076d8]/30">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0076d8]"
                  />
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Replying to ${comment.name}...`}
                    rows={2}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0076d8] resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!replyText.trim() || !replyName.trim()) return;
                        try {
                          const newReply = await blogApi.addComment(Number(id), {
                            name: replyName,
                            email: null,
                            content: replyText,
                            // @ts-ignore
                            parent_id: comment.id,
                          });
                          // Update comments state to show new reply
                          setComments(prev => prev.map(c =>
                            c.id === comment.id
                              ? { ...c, replies: [...(c.replies || []), newReply] }
                              : c
                          ));
                          setReplyText('');
                          setReplyName('');
                          setReplyingTo(null);
                        } catch (e) {
                          alert('Failed to post reply');
                        }
                      }}
                      className="px-3 py-1 bg-[#0076d8] text-white text-xs rounded-lg hover:bg-[#005db0] transition"
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
              </div>
            )}
          </div>
        </div>

        {/* ✅ Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3 p-2.5 bg-blue-50/50 rounded-xl border-l-2 border-[#0076d8]/20">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getCommentColor(reply.name) }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {getInitials(reply.name)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-0.5">
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
      </section>

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <img 
                src={getImageUrl(post.featured_image, fallbackImg)} 
                alt={post.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{post.title}</h4>
              <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Share this post</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <FaTimes className="text-sm text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              <button onClick={() => handleShareToSocial('facebook')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                  <FaFacebookF className="text-sm" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button onClick={() => handleShareToSocial('twitter')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                  <FaTwitter className="text-sm" />
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button onClick={() => handleShareToSocial('linkedin')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white">
                  <FaLinkedinIn className="text-sm" />
                </div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>
              <button onClick={() => handleShareToSocial('whatsapp')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <FaWhatsapp className="text-sm" />
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#0076d8] text-white rounded-lg text-sm font-medium hover:bg-[#005db0] transition flex items-center gap-2"
                >
                  <FaCopy className="text-xs" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
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

export default BlogDetailPage;
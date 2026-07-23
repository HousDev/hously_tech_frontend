import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import houslyLogo from '../../assets/images/hously-logo.png';
import loginBgTablet from '../../assets/images/login_bg_tablet.png';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Track cursor globally across the window and update login card tilt/drift
  useEffect(() => {
    const handleGlobalTilt = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      const maxDim = Math.max(window.innerWidth, window.innerHeight);
      const rotateX = -(dy / maxDim) * 6; // max 6 degrees
      const rotateY = (dx / maxDim) * 6;
      const translateX = (dx / maxDim) * 15; // max 15px
      const translateY = (dy / maxDim) * 15;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`,
        transition: 'transform 0.15s ease-out',
      });
    };

    window.addEventListener('mousemove', handleGlobalTilt);
    return () => {
      window.removeEventListener('mousemove', handleGlobalTilt);
    };
  }, []);

  // Load remembered credentials on mount
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Full-screen interactive particle constellation background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const particleCount = 85;
    const connectionDistance = 115;
    const mouse = { x: null as number | null, y: null as number | null, radius: 140 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
      });
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coordinates across the entire document
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleGlobalMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    // Draw loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 0.6;
            p.y += (dy / dist) * force * 0.6;
          }
        }

        // Render dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; // bright blue/sky dot
        ctx.fill();
      });

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw line from cursor to nearby particles
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.3;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);

      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userRole = (user?.role || '').toLowerCase();

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }

        const isUserAdmin =
          userRole === 'admin' ||
          userRole === 'super admin' ||
          userRole === 'supper admin';

        toast.success(isUserAdmin ? 'Welcome Back, Admin!' : 'Welcome Back!', {
          position: 'top-right',
          autoClose: 1500,
        });

        setTimeout(() => {
          if (isUserAdmin) {
            navigate('/dashboard');
          } else {
            navigate('/employee');
          }
        }, 1000);
      } else {
        setError(result.message || 'Authentication failed');
        toast.error(result.message || 'Authentication failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Authentication failed. Please verify your connection.');
      toast.error('Authentication failed');
      setLoading(false);
    }
  };

  // Generate slow drifting particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 3}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 12 + 8}s`,
    }));
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center overflow-hidden font-sans relative"
      style={{
        backgroundImage: `url(${loginBgTablet})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top-Left Corner Logo */}
      <div className="absolute top-6 left-8 z-20">
        <img
          src={houslyLogo}
          alt="Hously Fintech Realty"
          className="h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] brightness-110"
        />
      </div>

      {/* Interactive Connecting Lines Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Centered Login Card Panel */}
      <div className="w-full min-h-screen flex items-center justify-center p-6 relative z-10 bg-black/35 backdrop-blur-[2px]">
        {/* Glass Card Container (Ultra-Transparent dark glassmorphism) */}
        <div 
          ref={containerRef}
          style={tiltStyle}
          className="max-w-[400px] w-full bg-slate-950/45 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6 transition-transform duration-100 ease-out text-white"
        >
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-black text-white tracking-tight">
              Sign In to Portal
            </h2>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">
              Authorized Personnel Portal Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@houslytech.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#1378d1] focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Please contact administration to reset password')}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#1378d1] focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-white/5 border-white/10 rounded text-[#1378d1] focus:ring-blue-500 focus:ring-offset-slate-900"
                  disabled={loading}
                />
                <span className="ml-2 text-xs font-semibold text-white/60 hover:text-white/80 transition">
                  Keep me logged in
                </span>
              </label>
            </div>

            {/* Display Error Message */}
            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold leading-relaxed animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1378d1] hover:bg-[#0c66ca] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(19,120,209,0.25)] hover:shadow-[0_6px_20px_rgba(19,120,209,0.35)] disabled:opacity-50 flex items-center justify-pointer flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Portal
                </>
              )}
            </button>
          </form>

          {/* Back to main site button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-xl border border-white/10 shadow-sm"
            >
              <ArrowLeft size={14} /> Back to main site
            </button>
          </div>

          {/* Footer branding */}
          <div className="text-center pt-8 border-t border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest">
            © 2026 Hously Fintech Realty Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

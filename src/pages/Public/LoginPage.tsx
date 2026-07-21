import React, { useState, useEffect, useMemo } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import houslyLogo from '../../assets/images/hously-logo.png';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials on mount
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
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
    <div className="min-h-screen flex bg-gradient-to-r from-slate-50 via-blue-50 to-[#1378d1] overflow-hidden font-sans relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MNC Light Theme CSS Configurations */}
      <style>{`
        @keyframes float3D {
          0% { transform: translateY(0px) rotateX(4deg) rotateY(6deg); }
          50% { transform: translateY(-15px) rotateX(8deg) rotateY(-4deg); }
          100% { transform: translateY(0px) rotateX(4deg) rotateY(6deg); }
        }
        @keyframes blobMovement1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes floatUpParticle {
          0% { transform: translateY(120px) scale(0); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateY(-300px) scale(1); opacity: 0; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        /* Realistic Water Drop / Liquid Morphing keyframes */
        @keyframes morphWaterDrop {
          0%, 100% { border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; }
          33% { border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%; }
          66% { border-radius: 50% 40% 60% 40% / 40% 60% 40% 60%; }
        }
        @keyframes floatWaterDrop {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(25px) scale(0.95) rotate(10deg); }
        }
        
        /* Fly-out animation from right logo to left center landing */
        @keyframes flyOutLetter {
          0% {
            transform: translate3d(50vw, -120px, 0) scale(0.1) rotate(45deg);
            opacity: 0;
            filter: blur(5px);
          }
          75% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        .animate-float-3d { animation: float3D 9s ease-in-out infinite; }
        .animate-particle { animation: floatUpParticle var(--duration) linear infinite; animation-delay: var(--delay); }
        .animate-spin-slow { animation: spinSlow 30s linear infinite; }
        .animate-spin-reverse { animation: spinReverse 20s linear infinite; }
        
        /* Sequential flight animations */
        .fly-letter {
          opacity: 0;
          animation: flyOutLetter 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .liquid-blob-1 {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(19, 120, 209, 0.12) 0%, transparent 70%);
          filter: blur(80px);
          animation: blobMovement1 16s ease-in-out infinite;
        }
        
        /* Realistic CSS Water Droplets */
        .water-droplet {
          position: absolute;
          background: transparent;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          box-shadow: 
            inset 2px 2px 4px rgba(19, 120, 209, 0.05),
            3px 4px 6px rgba(19, 120, 209, 0.08),
            inset -2px -2px 4px rgba(255, 255, 255, 0.95),
            inset 2px 2px 4px rgba(19, 120, 209, 0.15);
          filter: drop-shadow(0 4px 6px rgba(19, 120, 209, 0.1));
          animation: morphWaterDrop 8s ease-in-out infinite, floatWaterDrop 9s ease-in-out infinite;
        }

        /* 3D Typography Extrusion Shadows */
        .text-3d-blue {
          color: #1378d1 !important;
          text-shadow: 
            1px 1px 0px #0a5697,
            2px 2px 0px #08477d,
            3px 3px 0px #063863,
            4px 4px 0px #04294a,
            5px 5px 0px #021a30,
            6px 6px 12px rgba(19, 120, 209, 0.35),
            0px 0px 20px rgba(19, 120, 209, 0.45);
        }

        .text-3d-gold {
          color: #ffd100 !important;
          text-shadow: 
            1px 1px 0px #cca700,
            2px 2px 0px #997e00,
            3px 3px 0px #665400,
            4px 4px 0px #332a00,
            5px 5px 0px rgba(0,0,0,0.2),
            6px 6px 12px rgba(255, 209, 0, 0.35),
            0px 0px 25px rgba(255, 209, 0, 0.55);
        }
      `}</style>

      {/* Left Column - Minimalist MNC Light panel */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12 overflow-hidden border-r border-slate-200/40 bg-transparent">
        
        {/* Soft Ambient Pastels Blobs */}
        <div className="liquid-blob-1 pointer-events-none" />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((style, idx) => (
            <div
              key={idx}
              className="absolute animate-particle rounded-full bg-blue-500/10"
              style={{
                left: style.left,
                top: style.top,
                width: style.size,
                height: style.size,
                '--duration': style.duration,
                '--delay': style.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Floating 3D Water Droplets in the Background (Scattered dew design) */}
        <div className="water-droplet w-12 h-12 top-20 left-20" style={{ animationDelay: '0s' }} />
        <div className="water-droplet w-8 h-8 bottom-24 left-36" style={{ animationDelay: '-3s' }} />
        <div className="water-droplet w-10 h-10 top-1/2 right-12" style={{ animationDelay: '-6s' }} />
        
        {/* Additional Small Water Drops */}
        <div className="water-droplet w-5 h-5 top-12 right-28" style={{ animationDelay: '-2s' }} />
        <div className="water-droplet w-4 h-4 bottom-36 right-36" style={{ animationDelay: '-4.5s' }} />
        <div className="water-droplet w-6 h-6 bottom-12 left-1/3" style={{ animationDelay: '-1s' }} />
        <div className="water-droplet w-3 h-3 top-1/3 left-1/4" style={{ animationDelay: '-5s' }} />
        <div className="water-droplet w-4 h-4 top-1/4 right-1/3" style={{ animationDelay: '-3.5s' }} />
        <div className="water-droplet w-3 h-3 top-1/4 left-10" style={{ animationDelay: '-1.5s' }} />
        <div className="water-droplet w-5 h-5 bottom-1/3 right-1/4" style={{ animationDelay: '-5.5s' }} />
        <div className="water-droplet w-4 h-4 top-10 right-1/2" style={{ animationDelay: '-2.5s' }} />

        {/* Dynamic Holographic Typography (Letters fly here & stop) */}
        <div className="absolute flex flex-col items-center justify-center z-10 select-none animate-float-3d">
          
          {/* Rotating HUD circle behind the logo */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/10 border-dashed animate-spin-slow pointer-events-none flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border border-yellow-500/10 border-dashed animate-spin-reverse pointer-events-none" />
          </div>

          {/* 3D Holographic typography structure (No wrapping containers/divs around L or Y) */}
          <div className="flex items-center gap-4 relative transform-style-3d select-none" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(10deg)' }}>
            
            {/* Raw letters (H, O, U, S) flying in sequence - Colored Royal Blue with 3D shadow */}
            <div className="flex gap-1.5 text-7xl md:text-8xl font-black italic tracking-tighter text-3d-blue font-sans">
              <span className="fly-letter" style={{ animationDelay: '0.3s' }}>h</span>
              <span className="fly-letter" style={{ animationDelay: '0.6s' }}>o</span>
              <span className="fly-letter" style={{ animationDelay: '0.9s' }}>u</span>
              <span className="fly-letter" style={{ animationDelay: '1.2s' }}>s</span>
            </div>

            {/* Raw letters (L, Y) flying in sequence - Colored Hously Gold with 3D shadow (No wrapping divs) */}
            <div className="flex gap-1.5 text-7xl md:text-8xl font-black italic tracking-tighter text-3d-gold font-sans">
              <span className="fly-letter" style={{ animationDelay: '1.5s' }}>l</span>
              <span className="fly-letter" style={{ animationDelay: '1.8s' }}>y</span>
            </div>

          </div>

          {/* Subtitles flying in sequentially (No wrapper divs/cards) */}
          <div className="mt-10 flex items-center justify-center select-none font-sans font-bold text-[10px] md:text-xs tracking-[0.2em] text-slate-500">
            <span className="fly-letter uppercase text-slate-550" style={{ animationDelay: '2.2s' }}>IT Services</span>
            <span className="fly-letter mx-2.5 text-slate-400 font-black" style={{ animationDelay: '2.4s' }}>•</span>
            <span className="fly-letter uppercase text-slate-550" style={{ animationDelay: '2.6s' }}>Real Estate</span>
            <span className="fly-letter mx-2.5 text-slate-400 font-black" style={{ animationDelay: '2.8s' }}>•</span>
            <span className="fly-letter uppercase text-slate-550" style={{ animationDelay: '3.0s' }}>Finance</span>
          </div>

        </div>

        {/* Back Link bottom-left corner */}
        <button
          onClick={() => navigate('/')}
          className="absolute bottom-8 left-8 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-all cursor-pointer bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm"
        >
          <ArrowLeft size={14} /> Back to main site
        </button>
      </div>

      {/* Right Column - Sleek Login Card Panel */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-16 xl:px-24 bg-transparent relative z-10">
        
        {/* Back button for mobile */}
        <button
          onClick={() => navigate('/')}
          className="lg:hidden absolute top-6 left-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Glass Card Container (MNC Level white glassmorphism overlay on steel-blue gradient) */}
        <div className="max-w-[400px] w-full mx-auto bg-white/90 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] space-y-6">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center">
            {/* Logo Bada Kiya on Right Side */}
            <img
              src={houslyLogo}
              alt="Hously Fintech Realty"
              className="h-20 w-auto mb-4 object-contain filter drop-shadow-[0_0_12px_rgba(19,120,209,0.25)]"
            />
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Sign In to Portal
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Authorized Personnel Portal Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@houslytech.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#1378d1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Please contact administration to reset password')}
                  className="text-[10px] font-bold text-[#1378d1] hover:text-[#0c66ca] transition"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#1378d1] focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 transition"
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
                  className="h-4 w-4 bg-slate-100 border-slate-200 rounded text-[#1378d1] focus:ring-blue-500 focus:ring-offset-white"
                  disabled={loading}
                />
                <span className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition">
                  Keep me logged in
                </span>
              </label>
            </div>

            {/* Display Error Message */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 font-semibold leading-relaxed animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1378d1] hover:bg-[#0c66ca] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-[0_4px_15px_rgba(19,120,209,0.25)] hover:shadow-[0_6px_20px_rgba(19,120,209,0.35)] disabled:opacity-50 flex items-center justify-center cursor-pointer"
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

          {/* Footer branding */}
          <div className="text-center pt-8 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Hously Fintech Realty Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

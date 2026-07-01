import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // Remove useNavigate
import MeetingScheduler from './MeetingScheduler';

const WhatsAppFAB: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const { pathname } = useLocation(); // Only keep what you need

  // ✅ HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Conditional return AFTER all hooks
  if (pathname.includes('/admin')) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "919371009381";
    const message = encodeURIComponent("Hello! I have an enquiry.");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = () => {
    const email = "careers@hously.in";
    const subject = encodeURIComponent("Inquiry regarding Hously Careers");
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMeetingClick = () => {
    setIsSchedulerOpen(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* LEFT SIDE STACK - WhatsApp (Top) & Email (Bottom) */}
          <div className="fixed left-[14px] md:left-4 z-50 flex flex-col items-center gap-3 md:gap-4 bottom-[72px] md:bottom-[95px]">
            {/* WHATSAPP FLOATING ACTION BUTTON (TOP) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: -50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -6, 0]
              }}
              exit={{ opacity: 0, scale: 0.5, x: -50 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
                x: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="flex items-center justify-center cursor-pointer select-none group"
              onClick={handleWhatsAppClick}
            >
              {/* Pulsing glow rings for WhatsApp */}
              <div className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-sm scale-105 animate-ping pointer-events-none" />

              {/* Main Circle using public/WhatsApp_icon.png */}
              <motion.div
                whileHover={{
                  scale: 1.12,
                  rotate: 8,
                  boxShadow: "0 10px 25px rgba(37, 211, 102, 0.5)"
                }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  scale: { type: 'spring', stiffness: 400, damping: 15 },
                  rotate: { type: 'spring', stiffness: 400, damping: 15 }
                }}
                className="relative flex items-center justify-center w-11 h-11 md:w-16 md:h-16 rounded-full overflow-hidden"
              >
                <img
                  src="/WhatsApp_icon.png"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  alt="WhatsApp Support"
                />
              </motion.div>
            </motion.div>

            {/* EMAIL FLOATING ACTION BUTTON (BOTTOM) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: -50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -6, 0]
              }}
              exit={{ opacity: 0, scale: 0.5, x: -50 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
                x: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.15
                }
              }}
              className="flex items-center justify-center cursor-pointer select-none group"
              onClick={handleEmailClick}
            >
              {/* Pulsing glow rings for email button */}
              <div className="absolute inset-0 rounded-full bg-[#0076d8]/20 blur-sm scale-105 animate-ping pointer-events-none" />

              {/* Main Email Circle */}
              <motion.div
                whileHover={{
                  scale: 1.12,
                  rotate: -8,
                  boxShadow: "0 10px 25px rgba(0, 118, 216, 0.5)"
                }}
                whileTap={{ scale: 0.92 }}
                transition={{
                  scale: { type: 'spring', stiffness: 400, damping: 15 },
                  rotate: { type: 'spring', stiffness: 400, damping: 15 }
                }}
                className="relative flex items-center justify-center w-11 h-11 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#0076d8] to-[#004e92] shadow-[0_8px_30px_rgba(0,118,216,0.3)] border border-blue-400/30 overflow-hidden"
              >
                {/* Lucide Mail SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 md:w-7 md:h-7 text-white"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>

                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* MEETING SCHEDULE FLOATING ACTION BUTTON (RIGHT STACK - MATCHES BACKTOTOP SIZE & COLOR) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: [0, -6, 0]
            }}
            exit={{ opacity: 0, scale: 0.5, x: 50 }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
              x: { duration: 0.5, type: 'spring', stiffness: 260, damping: 20 },
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }
            }}
            className="fixed bottom-[70px] md:bottom-[92px] right-[14px] md:right-4 z-50 flex items-center justify-center cursor-pointer select-none group"
            onClick={handleMeetingClick}
          >
            {/* Pulsing glow rings for meeting schedule */}
            <div className="absolute inset-0 rounded-full bg-[#0076d8]/20 blur-sm scale-105 animate-ping pointer-events-none" />

            {/* Main Circle matching BackToTop style exactly */}
            <motion.div
              whileHover={{
                scale: 1.12,
                boxShadow: "0 0 15px rgba(0, 118, 216, 0.6)"
              }}
              whileTap={{ scale: 0.92 }}
              transition={{
                scale: { type: 'spring', stiffness: 400, damping: 15 }
              }}
              className="relative flex items-center justify-center w-11 h-11 md:w-16 md:h-16 rounded-full bg-[#0076d8] shadow-lg border border-blue-400/20 overflow-hidden"
            >
              <img
                src="/calendar-days.png"
                className="w-8 h-8 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Schedule Meeting"
              />
            </motion.div>
          </motion.div>

          {/* MEETING SCHEDULER MODAL POPUP */}
          <AnimatePresence>
            {isSchedulerOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                {/* Backdrop blur & dark overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSchedulerOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                {/* Modal scale and spring entrance */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }}
                  className="relative z-10 w-full max-w-4xl"
                >
                  <MeetingScheduler onClose={() => setIsSchedulerOpen(false)} isModal={true} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFAB;
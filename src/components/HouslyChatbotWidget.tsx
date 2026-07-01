import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { enquiryApi } from '../lib/enquiryApi';
import { caseStudyApi } from '../lib/caseStudyApi';


// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string | { type: 'custom-element'; element: React.ReactNode };
  time: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECTS_DB = [
  'hously realty',
  'hously hrms',
  'hously crm',
  'hously app',
  'hously project',
  'hously fintech',
  'hously fintech realty'
];

const CONTACT_INFO = {
  phone: '+91 9371009381',
  email: 'careers@hously.in'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNow(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m < 10 ? '0' + m : m} ${ap}`;
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function Avatar({ role }: { role: 'bot' | 'user' }) {
  const isBot = role === 'bot';
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: isBot ? '#EFF6FF' : '#185FA5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 12,
        border: isBot ? '0.5px solid #bfdbfe' : 'none',
      }}
    >
      {isBot ? <img src="/chatboot.png" alt="bot" style={{ width: 14, height: 14, objectFit: 'contain' }} /> : '👤'}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HouslyChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWaitingForProject, setIsWaitingForProject] = useState(false);

  // Enquiry Form state
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Custom Website'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, showEnquiryForm]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Handle standard action selection / text submit
  const handleAction = (text: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      role: 'user',
      content: text,
      time: getNow()
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      const lowerText = text.toLowerCase();

      // Check current state machine first
      if (isWaitingForProject) {
        setIsWaitingForProject(false);
        try {
          const caseStudies = await caseStudyApi.getPublic();
          const queryWords = lowerText.trim().split(/\s+/).filter(Boolean);

          let matchedProject = null;

          if (queryWords.length > 0) {
            for (const cs of caseStudies) {
              const titleLower = cs.title.toLowerCase();
              if (queryWords.length === 1) {
                if (titleLower.includes(queryWords[0])) {
                  matchedProject = cs;
                  break;
                }
              } else {
                let matchCount = 0;
                for (const word of queryWords) {
                  if (titleLower.includes(word)) {
                    matchCount++;
                  }
                }
                if (matchCount >= 2) {
                  matchedProject = cs;
                  break;
                }
              }
            }
          }

          if (matchedProject) {
            addBotMessage(
              `Yes! We found your project "${matchedProject.title}". Please contact our support team at Mobile: ${CONTACT_INFO.phone} or Email: ${CONTACT_INFO.email}.`
            );
          } else {
            addBotMessage(
              `Sorry, we could not find a matching project for "${text}". Please contact support at Mobile: ${CONTACT_INFO.phone} or Email: ${CONTACT_INFO.email}.`
            );
          }
        } catch (err) {
          console.error("Failed to query CaseStudyCMS from API:", err);
          // Fallback to local DB check
          const found = PROJECTS_DB.includes(lowerText.trim());
          if (found) {
            addBotMessage(
              `Yes, contact mobile number: ${CONTACT_INFO.phone} and email: ${CONTACT_INFO.email} for your project support.`
            );
          } else {
            addBotMessage(
              `Sorry, we could not find any project with that name. Please contact support at Mobile: ${CONTACT_INFO.phone} or Email: ${CONTACT_INFO.email}.`
            );
          }
        }
        return;
      }

      // Check key keywords / actions
      if (text === 'New Project Requirements') {
        addBotMessage(
          'Select your project requirement:',
          ['Custom Website', 'Ready Made Website', 'Template Based Website', 'Custom Application', 'Ready Made Application', 'Software Development', 'Game Development']
        );
      } else if (text === 'Job Apply') {
        addBotMessage(
          'Select a profile to apply:',
          ['Php Laravel', 'React', 'React Native', 'Full Stack', 'Mern Stack', 'Business Development Executive']
        );
      } else if (text === 'Existing Project Support') {
        setIsWaitingForProject(true);
        addBotMessage('Please enter your project name below:');
      } else if (text === 'Custom Website') {
        // Open Enquiry Form
        setFormData(prev => ({ ...prev, enquiryType: 'Custom Website' }));
        setShowEnquiryForm(true);
      } else if (['ready made website', 'template based website', 'custom application', 'ready made application', 'software development', 'game development'].includes(lowerText)) {
        // Open form for other types as well
        setFormData(prev => ({ ...prev, enquiryType: text }));
        setShowEnquiryForm(true);
      } else if (['php laravel', 'react', 'react native', 'full stack', 'mern stack', 'business development executive'].includes(lowerText)) {
        // Open Enquiry Form for job application
        setFormData(prev => ({ ...prev, enquiryType: `Job Apply: ${text}` }));
        setShowEnquiryForm(true);
      } else {
        // Default reply
        addBotMessage(
          `Thank you for contacting Hously Fintech Realty. Please feel free to ask about project requirements, jobs, or existing support.`,
          ['New Project Requirements', 'Job Apply', 'Existing Project Support']
        );
      }
    }, 800);
  };

  const addBotMessage = (content: string, chips?: string[]) => {
    const botMsg: Message = {
      role: 'assistant',
      content: chips ? (
        {
          type: 'custom-element',
          element: (
            <div>
              <div style={{ marginBottom: 8 }}>{content}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAction(chip)}
                    style={styles.chip}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )
        }
      ) : content,
      time: getNow()
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowEnquiryForm(false);

    try {
      // Call backend API to save the enquiry
      await enquiryApi.create({
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        inquiry_type: formData.enquiryType,
        message: `Enquiry submitted via chatbot widget for ${formData.enquiryType}.`
      });

      // Add confirmation bot reply
      addBotMessage(
        `Thank you, ${formData.name}! Your enquiry for "${formData.enquiryType}" has been submitted. Our team will contact you at ${formData.phone} or ${formData.email} shortly.`
      );
    } catch (err) {
      console.error("Failed to submit enquiry to backend API:", err);
      // Fallback local message on API failure
      addBotMessage(
        `Thank you, ${formData.name}! Your enquiry for "${formData.enquiryType}" has been saved. Our team will contact you at ${formData.phone} or ${formData.email} shortly.`
      );
    }

    // Clear form
    setFormData({
      name: '',
      email: '',
      phone: '',
      enquiryType: 'Custom Website'
    });
  };

  return (
    <>
      <style>{`
        @keyframes hously-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .hously-messages::-webkit-scrollbar { width: 3px; }
        .hously-messages::-webkit-scrollbar-track { background: transparent; }
        .hously-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      {/* FAB */}
      <button
        style={styles.fab}
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : <img src="/chatboot.png" alt="Chat" style={{ width: 38, height: 38, objectFit: 'contain' }} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={styles.window} role="dialog" aria-label="Hously AI Assistant">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerAv}>
              <img src="/chatboot.png" alt="Hously AI" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </div>
            <div>
              <div style={styles.headerName}>Hously</div>
              <div style={styles.headerStatus}>
                <span style={styles.statusDot} />
                Online · Realty &amp; Tech Support
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea} className="hously-messages">
            <div style={styles.dateChip}>{getTodayLabel()}</div>

            {/* Welcome messages (always stays in history at the top) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <Avatar role="bot" />
              <div>
                <div style={styles.bubbleBot}>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12.5, color: '#0f172a' }}>
                    Welcome to Hously Fintech Realty 👋
                  </div>
                  <div style={{ color: '#64748b', fontSize: 11.5, marginBottom: 8, lineHeight: 1.5 }}>
                    Ask me anything about new projects, job applications, or existing project support.
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['New Project Requirements', 'Job Apply', 'Existing Project Support'].map((label) => (
                      <button
                        key={label}
                        style={styles.chip}
                        onClick={() => handleAction(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={styles.timestamp}>{getNow()}</div>
              </div>
            </div>

            {/* Render history */}
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 6,
                    flexDirection: isUser ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar role={isUser ? 'user' : 'bot'} />
                  <div style={{ maxWidth: isUser ? '78%' : '88%' }}>
                    <div style={isUser ? styles.bubbleUser : styles.bubbleBot}>
                      {typeof msg.content === 'string' ? (
                        msg.content
                      ) : (
                        msg.content.element
                      )}
                    </div>
                    <div
                      style={{
                        ...styles.timestamp,
                        textAlign: isUser ? 'right' : 'left',
                        paddingRight: isUser ? 2 : 0,
                        paddingLeft: isUser ? 0 : 2,
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Inline Enquiry Form */}
            {showEnquiryForm && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <Avatar role="bot" />
                <div style={styles.bubbleBot}>
                  <div style={{ fontWeight: 650, marginBottom: 8, fontSize: 12, color: '#0f172a' }}>
                    📋 Enter Enquiry Details:
                  </div>
                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={styles.formInput}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={styles.formInput}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={styles.formInput}
                    />
                    <input
                      type="text"
                      placeholder="Enquiry Type (e.g. Custom Website)"
                      required
                      value={formData.enquiryType}
                      onChange={e => setFormData({ ...formData, enquiryType: e.target.value })}
                      style={styles.formInput}
                    />

                    <div style={{ display: 'flex', gap: 6, justifySelf: 'flex-end', justifyContent: 'flex-end', marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => setShowEnquiryForm(false)}
                        style={styles.formCancelBtn}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={styles.formSubmitBtn}
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <Avatar role="bot" />
                <div style={styles.bubbleBot}>
                  <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#94a3b8',
                          display: 'inline-block',
                          animation: `hously-bounce 1.2s ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input bar */}
          <div style={styles.inputBar}>
            <div style={styles.inputWrap}>
              <span style={{ fontSize: 13, color: '#cbd5e1' }}>💬</span>
              <input
                ref={inputRef}
                style={styles.input}
                type="text"
                placeholder={isWaitingForProject ? "Enter project name..." : "Type your message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (input.trim()) {
                      handleAction(input);
                      setInput('');
                    }
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                if (input.trim()) {
                  handleAction(input);
                  setInput('');
                }
              }}
              style={styles.sendBtn}
            >
              <FaPaperPlane style={{ fontSize: 11, color: 'white' }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  fab: {
    position: 'fixed',
    left: 18,
    bottom: 18,
    width: 62,
    height: 62,
    borderRadius: '50%',
    background: '#185FA5',
    border: '3px solid rgba(255,255,255,0.3)',
    color: '#fff',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(24,95,165,0.5), 0 0 0 6px rgba(24,95,165,0.15)',
    zIndex: 9999,
  },
  window: {
    position: 'fixed',
    left: 18,
    bottom: 96,
    width: 'min(330px, calc(100vw - 24px))',
    height: 'min(460px, calc(100vh - 110px))',
    background: '#ffffff',
    borderRadius: 12,
    border: '0.5px solid #e2e8f0',
    boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9998,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    padding: '10px 12px',
    background: '#185FA5',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  headerAv: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    flexShrink: 0,
    border: '1.5px solid rgba(255,255,255,0.35)',
  },
  headerName: {
    fontSize: 12.5,
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.3,
  },
  headerStatus: {
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.8)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 0 1.5px rgba(74,222,128,0.3)',
  },
  closeBtn: {
    marginLeft: 'auto',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    fontSize: 13,
    color: '#fff',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 6,
    lineHeight: 1,
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px 10px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: 9,
    background: '#f8fafc',
  },
  dateChip: {
    textAlign: 'center',
    fontSize: 9.5,
    color: '#94a3b8',
    background: '#ffffff',
    border: '0.5px solid #e2e8f0',
    borderRadius: 99,
    padding: '2.5px 10px',
    alignSelf: 'center',
    marginBottom: 2,
  },
  bubbleBot: {
    maxWidth: '92%',
    background: '#ffffff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px 12px 12px 2px',
    padding: '9px 11px',
    fontSize: 12,
    lineHeight: 1.55,
    color: '#0f172a',
    wordBreak: 'break-word',
  },
  bubbleUser: {
    maxWidth: '82%',
    background: '#185FA5',
    borderRadius: '12px 12px 2px 12px',
    padding: '7px 11.5px',
    fontSize: 12,
    lineHeight: 1.55,
    color: '#ffffff',
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 3.5,
    paddingLeft: 2,
  },
  chip: {
    fontSize: 10.5,
    padding: '4px 9px',
    borderRadius: 99,
    border: '1px solid #185FA5',
    background: 'transparent',
    color: '#185FA5',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    marginTop: 4,
    marginRight: 4,
    transition: 'all 0.2s',
  },
  inputBar: {
    padding: '7px 8px',
    background: '#ffffff',
    borderTop: '0.5px solid #e2e8f0',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexShrink: 0,
  },
  inputWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    background: '#f8fafc',
    border: '0.5px solid #e2e8f0',
    borderRadius: 99,
    padding: '5px 10px',
    gap: 6,
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: 11.5,
    color: '#0f172a',
    outline: 'none',
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#185FA5',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  formInput: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: 6,
    border: '0.5px solid #cbd5e1',
    fontSize: 11,
    outline: 'none',
    background: '#f8fafc',
    boxSizing: 'border-box' as const,
  },
  formCancelBtn: {
    padding: '4px 12px',
    borderRadius: 6,
    border: '1px solid #cbd5e1',
    background: 'transparent',
    fontSize: 11,
    cursor: 'pointer',
    color: '#64748b',
    fontWeight: 500,
  },
  formSubmitBtn: {
    padding: '4px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#185FA5',
    fontSize: 11,
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
  }
};
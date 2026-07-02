import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    width?: string; // optional custom width
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    width = "max-w-[95vw] sm:max-w-sm md:max-w-md lg:max-w-lg",
}) => {
    // prevent body scroll while modal is open
    useEffect(() => {
        if (!isOpen) return;
        const prev = {
            overflow: document.body.style.overflow,
            paddingRight: document.body.style.paddingRight
        };
        // lock scroll
        document.body.style.overflow = "hidden";

        // optional: avoid layout shift when scrollbar disappears
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }

        return () => {
            document.body.style.overflow = prev.overflow;
            document.body.style.paddingRight = prev.paddingRight;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalScaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-modal-backdrop {
                    animation: modalFadeIn 0.2s ease-out forwards;
                }
                .animate-modal-card {
                    animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] animate-modal-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* card */}
            <div
                className={`relative bg-white rounded-2xl border border-slate-100 shadow-2xl w-full ${width} max-h-[90vh] flex flex-col z-50 animate-modal-card overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
                style={{ minWidth: 320 }}
            >
                {/* header */}
                {(title || subtitle) && (
                    <div className="sticky top-0 bg-white border-b border-slate-100 z-[60] px-6 py-4 flex flex-col">
                        {title && <h2 className="text-sm font-bold text-slate-800 tracking-wide">{title}</h2>}
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                )}

                {/* modal-scoped portal target */}
                <div id="modal-portal" className="absolute left-0 right-0 pointer-events-auto z-[55]" />

                <div className="p-6 overflow-y-auto flex-1 text-slate-700">
                    {children}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 z-[65] rounded-lg transition-all"
                    aria-label="Close modal"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Modal;
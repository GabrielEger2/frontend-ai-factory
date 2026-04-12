"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Size configuration                                                 */
/* ------------------------------------------------------------------ */

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
} as const;

export type ModalSize = keyof typeof sizeClasses;

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Called when the modal should close (Escape key, backdrop click, close button) */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Max-width preset */
  size?: ModalSize;
  /** Additional classes for the content panel */
  className?: string;
  /** Background class for the content panel */
  bgClassName?: string;
  /** When true, hides the default close button */
  hideCloseButton?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/*  Modal component                                                    */
/* ------------------------------------------------------------------ */

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
  bgClassName = "bg-base-100",
  hideCloseButton = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /* ---- Lock body scroll when open ---- */
  useEffect(() => {
    if (!isOpen) return;

    scrollPositionRef.current = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen]);

  /* ---- Escape key handler ---- */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  /* ---- Backdrop click ---- */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  /* ---- Redirect overlay scroll to content ---- */
  const handleOverlayWheel = (e: React.WheelEvent) => {
    if (e.target === overlayRef.current && contentRef.current) {
      contentRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleBackdropClick}
          onWheel={handleOverlayWheel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/80 backdrop-blur-sm p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.15, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            ref={contentRef}
            className={cn(
              "relative w-full max-h-[95vh] overflow-y-auto overscroll-y-contain rounded-box shadow-2xl",
              sizeClasses[size],
              bgClassName,
              className,
            )}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {!hideCloseButton && (
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-50 rounded-selector p-2 text-base-content/60 hover:bg-base-300 hover:text-base-content transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

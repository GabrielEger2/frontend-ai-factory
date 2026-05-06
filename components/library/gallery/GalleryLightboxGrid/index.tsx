"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { cn } from "@lib/utils";
import { containerVariants, fadeUp } from "@lib/motion-variants";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LightboxItem {
  /** Thumbnail / display image src */
  image: string;
  /** Required alt text */
  imageAlt: string;
  /** Optional larger image src for the lightbox view; falls back to `image` */
  fullImage?: string;
  /** Optional caption rendered under the image inside the lightbox */
  caption?: string;
  /** Optional metadata line (date, location, photographer credit) */
  meta?: string;
}

export interface GalleryLightboxGridProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  /** Grid items — recommended 6 or 9 for clean rows */
  items: LightboxItem[];
  /** Desktop column count */
  columns?: 2 | 3 | 4;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface ThumbnailProps {
  item: LightboxItem;
  index: number;
  onOpen: (i: number) => void;
}

function Thumbnail({ item, index, onOpen }: ThumbnailProps) {
  const safe = useSafeImageSrc(item.image, `lightbox-${index}`, 600, 600);
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={() => onOpen(index)}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-base-100"
      aria-label={`Open ${item.imageAlt}`}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt={item.imageAlt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral/0 transition-colors duration-300 group-hover:bg-neutral/30 group-focus-visible:bg-neutral/30">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-base-100/0 text-neutral-content opacity-0 transition-all duration-300 group-hover:bg-base-100/95 group-hover:text-base-content group-hover:opacity-100 group-focus-visible:bg-base-100/95 group-focus-visible:text-base-content group-focus-visible:opacity-100">
          <FiZoomIn className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  );
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  const item = items[index];
  const fullSrc = item.fullImage || item.image;
  const safe = useSafeImageSrc(fullSrc, `lightbox-full-${index}`, 1600, 1200);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.imageAlt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-base-100/15 text-neutral-content backdrop-blur-md transition-colors hover:bg-base-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FiX className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/15 text-neutral-content backdrop-blur-md transition-colors hover:bg-base-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:left-6"
        >
          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-base-100/15 text-neutral-content backdrop-blur-md transition-colors hover:bg-base-100/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:right-6"
        >
          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {/* Frame */}
      <motion.div
        key={index}
        className="relative mx-auto flex max-h-[90vh] w-full max-w-5xl flex-col gap-3 px-12 md:px-16"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={safe.src}
          onError={safe.onError}
          alt={item.imageAlt}
          className="max-h-[78vh] w-full rounded-xl object-contain"
        />
        {(item.caption || item.meta) && (
          <div className="flex flex-col items-start gap-1 text-left">
            {item.caption && (
              <p className="text-sm leading-relaxed text-neutral-content md:text-base">
                {item.caption}
              </p>
            )}
            {item.meta && (
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-content/65">
                {item.meta} · {index + 1} / {items.length}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * GalleryLightboxGrid — uniform aspect-square thumbnail grid with a
 * keyboard-driven lightbox modal. Click, Enter, or Space opens; Escape
 * closes; Arrow keys navigate. Body scroll locks while the lightbox is
 * open.
 */
export default function GalleryLightboxGrid({
  eyebrow,
  headline,
  description,
  items,
  columns = 3,
  className,
}: GalleryLightboxGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length,
    );
  }, [items.length]);

  // Keyboard handling + body scroll lock
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  const colClass =
    columns === 4
      ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 md:grid-cols-3";

  return (
    <section
      className={cn("w-full bg-base-100 py-12 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mx-auto mb-12 flex max-w-2xl flex-col text-left md:mb-16"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            variants={fadeUp}
            className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/65"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className={cn("grid grid-cols-1 gap-3 md:gap-4", colClass)}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map((item, i) => (
            <Thumbnail key={i} item={item} index={i} onOpen={setOpenIndex} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            items={items}
            index={openIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

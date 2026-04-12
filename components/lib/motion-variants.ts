/**
 * Shared animation variants used across layout components.
 *
 * Canonical source: ContentImageText and ContentStatementSplit.
 * Import these instead of copy-pasting variant objects per component.
 */

/* ------------------------------------------------------------------ */
/*  Local Variants type (framer-motion 12.x no longer exports it)      */
/* ------------------------------------------------------------------ */

type Variants = Record<string, Record<string, unknown>>;

/* ------------------------------------------------------------------ */
/*  containerVariants — stagger children                               */
/* ------------------------------------------------------------------ */

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ------------------------------------------------------------------ */
/*  fadeUp — opacity 0→1, y 16→0                                       */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  imageReveal — opacity 0→1, scale 0.97→1                            */
/* ------------------------------------------------------------------ */

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  accentReveal — opacity+y+scale with 0.3s delay                     */
/* ------------------------------------------------------------------ */

export const accentReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const, delay: 0.3 },
  },
};

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PolaroidCard {
  image: string;
  imageAlt: string;
  /** Handwritten-style caption written under the photograph */
  caption?: string;
}

export interface HeroPolaroidCollageProps {
  eyebrow?: string;
  headline: string;
  /** Italic accent rendered as the final word/phrase of the headline */
  scriptAccent?: string;
  scriptAccentColorScheme?: ColorScheme;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** 3 to 4 polaroid cards arranged in an asymmetric collage */
  polaroids: PolaroidCard[];
  /** Tape strip color scheme — visual accent at top of each polaroid */
  tapeColorScheme?: ColorScheme;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ACCENT_TEXT: Record<ColorScheme, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  neutral: "text-base-content",
};

const TAPE_BG: Record<ColorScheme, string> = {
  primary: "bg-primary/30",
  secondary: "bg-secondary/30",
  accent: "bg-accent/30",
  neutral: "bg-base-content/20",
};

// Predefined arrangement — rotation, offsets, and z-index for up to 4 polaroids.
const ARRANGEMENTS = [
  // Top-left, slight counter rotation
  {
    rotate: -6,
    offset: "left-2 top-4 md:left-8 md:top-8",
    z: 10,
    width: "w-44 md:w-56",
  },
  // Top-right, mid rotation
  {
    rotate: 8,
    offset: "right-2 top-12 md:right-12 md:top-12",
    z: 20,
    width: "w-48 md:w-64",
  },
  // Bottom-left, deeper offset, slight rotation
  {
    rotate: 4,
    offset: "left-12 bottom-6 md:left-32 md:bottom-12",
    z: 30,
    width: "w-44 md:w-56",
  },
  // Bottom-right, opposite rotation
  {
    rotate: -3,
    offset: "right-8 bottom-2 md:right-24 md:bottom-6",
    z: 15,
    width: "w-40 md:w-52",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface PolaroidProps {
  card: PolaroidCard;
  index: number;
  tapeBg: string;
}

function Polaroid({ card, index, tapeBg }: PolaroidProps) {
  const arr = ARRANGEMENTS[index % ARRANGEMENTS.length];
  const safe = useSafeImageSrc(card.image, `hero-polaroid-${index}`, 400, 400);

  return (
    <motion.figure
      className={cn(
        "absolute hidden flex-col bg-base-100 p-3 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.25)] md:flex",
        arr.offset,
        arr.width,
      )}
      style={{ zIndex: arr.z }}
      initial={{ opacity: 0, y: 32, rotate: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotate: arr.rotate, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.25 + index * 0.12,
      }}
      whileHover={{
        rotate: arr.rotate * 0.4,
        scale: 1.04,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {/* Tape strip */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-3deg]",
          tapeBg,
        )}
      />
      <div className="aspect-square w-full overflow-hidden bg-base-200">
        <img
          src={safe.src}
          onError={safe.onError}
          alt={card.imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {card.caption && (
        <figcaption className="mt-3 px-2 pb-2 text-center font-serif text-sm italic text-base-content/80">
          {card.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile collage — replaces absolute layout below md */
/* ------------------------------------------------------------------ */

interface MobileCollageProps {
  cards: PolaroidCard[];
  tapeBg: string;
}

function MobileCollage({ cards, tapeBg }: MobileCollageProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:hidden">
      {cards.slice(0, 4).map((card, i) => {
        const rotation = i % 2 === 0 ? "-rotate-2" : "rotate-2";
        return (
          <PolaroidStatic
            key={i}
            card={card}
            seed={`hero-polaroid-mobile-${i}`}
            rotation={rotation}
            tapeBg={tapeBg}
          />
        );
      })}
    </div>
  );
}

interface PolaroidStaticProps {
  card: PolaroidCard;
  seed: string;
  rotation: string;
  tapeBg: string;
}

function PolaroidStatic({ card, seed, rotation, tapeBg }: PolaroidStaticProps) {
  const safe = useSafeImageSrc(card.image, seed, 400, 400);
  return (
    <figure
      className={cn(
        "relative flex flex-col bg-base-100 p-3 shadow-md",
        rotation,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-3 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-3deg]",
          tapeBg,
        )}
      />
      <div className="aspect-square w-full overflow-hidden bg-base-200">
        <img
          src={safe.src}
          onError={safe.onError}
          alt={card.imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {card.caption && (
        <figcaption className="mt-2 text-center font-serif text-xs italic text-base-content/80">
          {card.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroPolaroidCollage({
  eyebrow,
  headline,
  scriptAccent,
  scriptAccentColorScheme = "primary",
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  polaroids,
  tapeColorScheme = "accent",
  className,
}: HeroPolaroidCollageProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentClass = ACCENT_TEXT[scriptAccentColorScheme];
  const tapeBg = TAPE_BG[tapeColorScheme];

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-base-200/40",
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-24">
        {/* -- Content column -- */}
        <motion.div
          className="lg:col-span-6"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {eyebrow && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-base-content/60"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headline}
            {scriptAccent && (
              <>
                {" "}
                <span
                  className={cn("font-serif italic font-normal", accentClass)}
                >
                  {scriptAccent}
                </span>
              </>
            )}
          </motion.h1>
          {subheadline && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-5 max-w-xl text-base leading-relaxed text-base-content/70 md:text-lg"
            >
              {subheadline}
            </motion.p>
          )}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryCtaText && (
              <CtaButton
                variant={secondaryCtaStyle}
                colorScheme={secondaryCtaColorScheme}
                href={secondaryCtaUrl}
              >
                {secondaryCtaText}
              </CtaButton>
            )}
          </motion.div>

          {/* Mobile-only collage rendered inside content column */}
          <div className="mt-12">
            <MobileCollage cards={polaroids} tapeBg={tapeBg} />
          </div>
        </motion.div>

        {/* -- Desktop polaroid collage -- */}
        <div className="relative hidden h-[560px] w-full md:block lg:col-span-6 lg:h-[640px]">
          {polaroids.slice(0, 4).map((card, i) => (
            <Polaroid key={i} card={card} index={i} tapeBg={tapeBg} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { buttonStyles, DotExpandLink } from "@ui/button";
import { TypeWriter } from "@ui/text-decorations/TypeWriter";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroBakeryEditorialProps {
  /** Small uppercase pill label printed above the headline */
  badge: string;
  /** Leading words of the display headline (rendered in serif) */
  headlineLeading: string;
  /** Hand-script italic accent word slotted between leading and trailing */
  headlineAccent: string;
  /**
   * Final part of the headline. When given a string array, it cycles through
   * the entries with a typewriter effect (mirrors the rotating-words pattern
   * used across the other heroes).
   */
  headlineTrailing: string | string[];
  /** Supporting paragraph below the headline */
  lead: string;
  /** Primary CTA — rendered as the cart-icon pill button */
  primaryCtaText: string;
  primaryCtaUrl?: string;
  /** Secondary CTA — rendered as a DotExpandLink */
  secondaryCtaText: string;
  secondaryCtaUrl?: string;
  /** Hero product/photo image displayed in the right column */
  productImage?: string;
  productImageAlt: string;
  /** Text rendered around the circular stamp seal in the upper-right corner */
  stampText: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Inline icons                                                       */
/* ------------------------------------------------------------------ */

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative SVGs                                                    */
/* ------------------------------------------------------------------ */

function StampBadge({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
      <defs>
        <path
          id="hb-circ"
          d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
        />
      </defs>
      <circle
        cx="80"
        cy="80"
        r="74"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeDasharray="2 5"
      />
      <text
        fontWeight="700"
        fontSize="11.5"
        letterSpacing="3"
        fill="currentColor"
      >
        <textPath href="#hb-circ" startOffset="0">
          {text}
        </textPath>
      </text>
      <circle cx="80" cy="80" r="34" fill="currentColor" />
      <g
        transform="translate(80,80)"
        stroke="var(--color-base-100)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M0,-16 V14" />
        <path d="M0,-8 q-7,-3 -10,3 q5,4 10,0 Z" fill="var(--color-base-100)" />
        <path d="M0,-8 q7,-3 10,3 q-5,4 -10,0 Z" fill="var(--color-base-100)" />
        <path d="M0,-2 q-7,-3 -10,3 q5,4 10,0 Z" fill="var(--color-base-100)" />
        <path d="M0,-2 q7,-3 10,3 q-5,4 -10,0 Z" fill="var(--color-base-100)" />
        <path d="M0,4 q-7,-3 -10,3 q5,4 10,0 Z" fill="var(--color-base-100)" />
        <path d="M0,4 q7,-3 10,3 q-5,4 -10,0 Z" fill="var(--color-base-100)" />
      </g>
    </svg>
  );
}

interface SeedGlyphProps {
  className: string;
  rotate: number;
  delay: number;
  reduce: boolean;
}

function SeedGlyph({ className, rotate, delay, reduce }: SeedGlyphProps) {
  return (
    <motion.svg
      className={cn("absolute pointer-events-none text-primary", className)}
      viewBox="0 0 20 20"
      fill="none"
      style={{ rotate }}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -6, 0],
              x: [0, 2, 0],
              rotate: [rotate, rotate + 4, rotate],
            }
      }
      transition={{
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    >
      <path
        d="M10 2 C 6 6, 6 14, 10 18 C 14 14, 14 6, 10 2 Z"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        fill="var(--color-base-100)"
      />
      <path
        d="M10 4 C 8 8, 8 12, 10 16"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroBakeryEditorial({
  badge,
  headlineLeading,
  headlineAccent,
  headlineTrailing,
  lead,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  productImage,
  productImageAlt,
  stampText,
  className,
}: HeroBakeryEditorialProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduce = !!shouldReduceMotion;

  const safeImg = useSafeImageSrc(
    productImage,
    "hero-bakery-editorial-01-product",
    1080,
    1080,
  );

  return (
    <section
      className={cn(
        "relative flex min-h-[100dvh] items-center justify-center bg-base-200/60 px-3 py-3 mt-20 sm:mt-0 sm:px-6 sm:py-6 lg:px-10 lg:py-10",
        className,
      )}
    >
      <div className="relative mx-auto w-full max-w-7xl rounded-[28px] border border-base-300 bg-base-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.12)]">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-base-200) 1px, transparent 1px), linear-gradient(to bottom, var(--color-base-200) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative grid grid-cols-1 gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-12 lg:py-20">
          {/* LEFT — copy */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {badge}
            </div>

            <h1
              className="mt-6 font-serif leading-[0.95] tracking-tight text-base-content"
              style={{ fontSize: "clamp(40px, 6vw, 76px)" }}
            >
              {headlineLeading}{" "}
              <span className="inline-block -rotate-2 font-serif text-5xl font-bold italic text-primary sm:text-6xl lg:text-7xl">
                {headlineAccent}
              </span>
              <br />
              {Array.isArray(headlineTrailing) ? (
                <TypeWriter
                  text={headlineTrailing}
                  speed={80}
                  deleteSpeed={40}
                  pauseDelay={1600}
                  cursorClassName="ml-1 font-light text-primary/70"
                  startOnView
                />
              ) : (
                headlineTrailing
              )}
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-base-content/70">
              {lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={primaryCtaUrl ?? "#"}
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                  className:
                    "group rounded-full pl-5 pr-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]",
                })}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-content/20">
                  <CartIcon className="h-4 w-4" />
                </span>
                {primaryCtaText}
              </a>
              <DotExpandLink
                href={secondaryCtaUrl ?? "#"}
                colorScheme="primary"
              >
                {secondaryCtaText}
              </DotExpandLink>
            </div>
          </div>

          {/* RIGHT — product column with stamp + seed glyphs */}
          <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
            <div className="hidden sm:block">
              <SeedGlyph
                className="top-[20%] left-[8%] h-5 w-5"
                rotate={-15}
                delay={0}
                reduce={reduce}
              />
              <SeedGlyph
                className="top-[20%] right-[2%] h-6 w-6"
                rotate={20}
                delay={0.6}
                reduce={reduce}
              />
              <SeedGlyph
                className="bottom-[15%] left-[1%] h-5 w-5"
                rotate={40}
                delay={1.2}
                reduce={reduce}
              />
              <SeedGlyph
                className="top-[52%] left-[8%] h-5 w-5"
                rotate={-30}
                delay={1.8}
                reduce={reduce}
              />
            </div>

            <div className="absolute right-3 top-3 z-30 h-28 w-28 text-secondary sm:right-6 sm:top-6 sm:h-36 sm:w-36">
              <StampBadge text={stampText} />
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute right-0 bottom-0 z-40 w-[clamp(360px,70vw,640px)] sm:right-[-20px] sm:bottom-[-30px] lg:right-[-180px] lg:bottom-[-100px] lg:w-[clamp(600px,70vw,800px)]"
              style={{
                filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.18))",
              }}
            >
              <img
                src={safeImg.src}
                onError={safeImg.onError}
                alt={productImageAlt}
                className="block h-auto w-full"
                draggable={false}
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

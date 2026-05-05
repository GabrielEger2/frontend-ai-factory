"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { Highlighter } from "@ui/text-decorations/Highlighter";
import { TextReveal } from "@ui/text-decorations/TextReveal";
import { TypeWriter } from "@ui/text-decorations/TypeWriter";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ParallaxImage {
  src: string;
  alt: string;
  /** Parallax start offset in pixels (negative = starts higher) */
  start?: number;
  /** Parallax end offset in pixels */
  end?: number;
  /** Width class — e.g. "w-1/3", "w-2/3", "w-5/12". Defaults to "w-1/3" */
  widthClass?: string;
  /** Alignment class — e.g. "ml-auto", "mx-auto", "ml-24". Defaults to "" */
  alignClass?: string;
}

export interface HeroParallaxImagesProps {
  /** Main headline displayed below the parallax section */
  headline: string;
  /** When provided, the last line cycles through these strings with a typewriter effect */
  headlineRotatingWords?: string[];
  /** Word inside `headline` to wrap with the Highlighter underline. When set, word-level TextReveal is skipped. */
  highlightWord?: string;
  /** Wrap the headline in a word-level TextReveal. Defaults to false. Ignored when `highlightWord` is set. */
  revealHeadline?: boolean;
  /** Color scheme for the Highlighter. Defaults to "primary". */
  accentColorScheme?: ColorScheme;
  subheadline: string;
  ctaText: string;
  ctaUrl?: string;
  /** CTA button style */
  ctaStyle?: CtaVariant;
  /** CTA color scheme */
  ctaColorScheme?: ColorScheme;
  /** Secondary CTA text — when provided, renders a second button */
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** The large center background image that expands on scroll */
  centerImage?: string;
  centerImageAlt: string;
  /** Floating parallax images scattered around the center image */
  parallaxImages?: ParallaxImage[];
  /** Height of the scroll section in px — controls how long the parallax effect lasts. Defaults to 1500 */
  scrollHeight?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PARALLAX_IMAGES: ParallaxImage[] = [
  {
    src: "https://picsum.photos/seed/heroparallax-img-0/360/480",
    alt: "Designer reviewing wireframes on a tablet",
    widthClass: "w-1/3",
    alignClass: "ml-auto",
  },
  {
    src: "https://picsum.photos/seed/heroparallax-img-1/280/360",
    alt: "Developer pair-programming on a laptop",
    widthClass: "w-1/4",
    alignClass: "mr-auto",
  },
  {
    src: "https://picsum.photos/seed/heroparallax-img-2/440/520",
    alt: "Team collaborating in a sunlit studio",
    widthClass: "w-2/5",
    alignClass: "ml-16",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_SCROLL_HEIGHT = 1500;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Normalize semantic alignment values ("left" | "right" | "center") into
 * Tailwind utility classes. If the caller already passes a Tailwind class
 * (e.g. "ml-auto", "mr-16"), it is passed through unchanged.
 */
function normalizeAlign(align: string | undefined): string {
  switch (align) {
    case "left":
      return "mr-auto";
    case "right":
      return "ml-auto";
    case "center":
      return "mx-auto";
    default:
      return align ?? "";
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface CenterImageProps {
  src: string;
  alt: string;
  scrollHeight: number;
  shouldReduceMotion: boolean | null;
}

function CenterImage({
  src,
  alt,
  scrollHeight,
  shouldReduceMotion,
}: CenterImageProps) {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, scrollHeight], [25, 0]);
  const clip2 = useTransform(scrollY, [0, scrollHeight], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, scrollHeight + 500],
    ["170%", "100%"],
  );
  const opacity = useTransform(
    scrollY,
    [scrollHeight, scrollHeight + 500],
    [1, 0],
  );

  if (shouldReduceMotion) {
    return (
      <div
        className="sticky top-0 h-screen w-full"
        role="img"
        aria-label={alt}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
    );
  }

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      role="img"
      aria-label={alt}
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

interface ParallaxImgProps {
  src: string;
  alt: string;
  start: number;
  end: number;
  className?: string;
  shouldReduceMotion: boolean | null;
  index: number;
}

function ParallaxImg({
  src,
  alt,
  start,
  end,
  className,
  shouldReduceMotion,
  index,
}: ParallaxImgProps) {
  const ref = useRef<HTMLImageElement>(null);
  const safeImg = useSafeImageSrc(
    src,
    `hero-parallax-images-01-image-${index}`,
    400,
    600,
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  if (shouldReduceMotion) {
    return (
      <img
        src={safeImg.src}
        onError={safeImg.onError}
        alt={alt}
        className={cn("rounded-lg object-cover", className)}
        ref={ref}
        loading="lazy"
      />
    );
  }

  return (
    <motion.img
      src={safeImg.src}
      onError={safeImg.onError}
      alt={alt}
      className={cn("rounded-lg object-cover", className)}
      ref={ref}
      style={{ transform, opacity }}
      loading="lazy"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Headline helpers                                                   */
/* ------------------------------------------------------------------ */

function renderHighlightedHeadline(
  headline: string,
  highlightWord: string,
  scheme: ColorScheme,
) {
  const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightWord.length);
  const after = headline.slice(idx + highlightWord.length);
  return (
    <>
      {before}
      <Highlighter action="underline" colorScheme={scheme} triggerOnView>
        {match}
      </Highlighter>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroParallaxImages({
  headline,
  headlineRotatingWords,
  highlightWord,
  revealHeadline,
  accentColorScheme = "primary",
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  centerImage,
  centerImageAlt,
  parallaxImages = DEFAULT_PARALLAX_IMAGES,
  scrollHeight = DEFAULT_SCROLL_HEIGHT,
  className,
}: HeroParallaxImagesProps) {
  const shouldReduceMotion = useReducedMotion();

  const useHighlighter = Boolean(highlightWord);
  const useTextReveal =
    !useHighlighter && revealHeadline && !shouldReduceMotion;

  return (
    <section className={cn("w-full bg-neutral", className)}>
      {/* Parallax scroll region */}
      <div
        style={{ height: `calc(${scrollHeight}px + 100vh)` }}
        className="relative w-full"
      >
        {centerImage && (
          <CenterImage
            src={centerImage}
            alt={centerImageAlt}
            scrollHeight={scrollHeight}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}

        {/* Floating parallax images */}
        <div className="mx-auto max-w-5xl px-4 pt-[200px]">
          {parallaxImages.map((img, i) => (
            <ParallaxImg
              key={i}
              src={img.src}
              alt={img.alt}
              start={img.start ?? (i % 2 === 0 ? -200 : 200)}
              end={img.end ?? (i % 2 === 0 ? 200 : -250)}
              className={cn(
                img.widthClass ?? "w-1/3",
                normalizeAlign(img.alignClass),
              )}
              shouldReduceMotion={shouldReduceMotion}
              index={i}
            />
          ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent to-neutral" />
      </div>

      {/* Content section below the parallax */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1
            variants={fadeUp}
            className="mb-6 text-4xl font-black uppercase text-neutral-content md:text-5xl lg:text-6xl"
          >
            {useHighlighter ? (
              renderHighlightedHeadline(
                headline,
                highlightWord as string,
                accentColorScheme,
              )
            ) : useTextReveal ? (
              <TextReveal split="word" triggerOnView>
                {headline}
              </TextReveal>
            ) : (
              headline
            )}
            {headlineRotatingWords && headlineRotatingWords.length > 0 && (
              <>
                <br />
                <TypeWriter
                  text={headlineRotatingWords}
                  className="text-primary"
                  cursorClassName="text-primary"
                  speed={60}
                  deleteSpeed={40}
                  pauseDelay={2500}
                  startOnView
                />
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-10 max-w-2xl text-lg leading-relaxed text-neutral-content/60 md:text-xl"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
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
        </motion.div>
      </div>
    </section>
  );
}

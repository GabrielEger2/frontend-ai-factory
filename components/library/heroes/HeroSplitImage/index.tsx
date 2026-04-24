"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { TypeWriter } from "@ui/text-decorations/TypeWriter";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type HeroSplitImageVariant =
  | "default"
  | "hero-split-image-01-compact"
  | "hero-split-image-01-airy";

export interface FeaturedItem {
  image: string;
  imageAlt: string;
  title: string;
  /** Original price — displayed with strikethrough when discountPrice is provided */
  price?: string;
  /** Discount price — displayed as the current price */
  discountPrice?: string;
}

export interface HeroSplitImageProps {
  headline: string;
  /** Styled portion of the headline — rendered in italic accent text */
  headlineAccent?: string;
  /** When provided, the last line cycles through these strings with a typewriter effect */
  headlineRotatingWords?: string[];
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
  /** WhatsApp link — when provided, shows a WhatsApp contact link below CTAs */
  whatsappUrl?: string;
  whatsappLabel?: string;
  /** Main image */
  image?: string;
  imageAlt: string;
  /** Floating badge — when provided, renders a small overlay card on the image */
  badgeHeadline?: string;
  badgeDescription?: string;
  /** Rotating badge text — when provided, renders a spinning circular text around an icon on the image */
  rotatingBadgeText?: string;
  /** Featured items section — when provided, renders a product/highlight grid below the CTAs */
  featuredItems?: FeaturedItem[];
  featuredItemsLabel?: string;
  featuredItemsLinkText?: string;
  featuredItemsLinkUrl?: string;
  /** Whether to apply a subtle grid background pattern to the section */
  gridBackground?: boolean;
  /** Visual variant — adjusts density and background tone */
  variant?: HeroSplitImageVariant;
  className?: string;
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

const imageReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const badgeReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const, delay: 0.4 },
  },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface RotatingBadgeProps {
  text: string;
  shouldReduceMotion: boolean | null;
}

function RotatingBadge({ text, shouldReduceMotion }: RotatingBadgeProps) {
  return (
    <div className="absolute -right-6 -top-6 z-40 hidden h-28 w-28 items-center justify-center lg:flex xl:-right-10 xl:-top-10 xl:h-32 xl:w-32">
      <motion.div
        className="relative h-full w-full"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg className="h-full w-full text-primary/30" viewBox="0 0 100 100">
          <path
            d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            fill="transparent"
            id="circlePath"
          />
          <text className="fill-primary text-[9px] font-bold uppercase tracking-widest">
            <textPath xlinkHref="#circlePath">{text}</textPath>
          </text>
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-primary/10 p-3 xl:p-4">
          <svg
            className="h-8 w-8 text-primary xl:h-10 xl:w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface FeaturedItemCardProps {
  item: FeaturedItem;
  index: number;
}

function FeaturedItemCard({ item, index }: FeaturedItemCardProps) {
  const safeImg = useSafeImageSrc(
    item.image,
    `hero-split-image-01-featured-image-${index}`,
    64,
    48,
  );
  return (
    <div className="flex items-center gap-3">
      <img
        src={safeImg.src}
        onError={safeImg.onError}
        alt={item.imageAlt}
        className="h-12 w-16 shrink-0 rounded-md bg-base-200 object-cover shadow-sm"
        loading="lazy"
      />
      <div className="min-w-0">
        <h4 className="truncate text-xs font-bold uppercase tracking-tight text-base-content">
          {item.title}
        </h4>
        {(item.price || item.discountPrice) && (
          <div className="flex items-center gap-2 text-[10px]">
            {item.price && item.discountPrice && (
              <span className="text-base-content/40 line-through">
                {item.price}
              </span>
            )}
            <span className="font-bold text-accent">
              {item.discountPrice ?? item.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSplitImage({
  headline,
  headlineAccent,
  headlineRotatingWords,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  whatsappUrl,
  whatsappLabel,
  badgeHeadline,
  badgeDescription,
  rotatingBadgeText,
  image,
  imageAlt,
  featuredItems,
  featuredItemsLabel,
  featuredItemsLinkText,
  featuredItemsLinkUrl,
  gridBackground = false,
  variant = "default",
  className,
}: HeroSplitImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeMainImg = useSafeImageSrc(
    image,
    "hero-split-image-01-image",
    800,
    800,
  );

  return (
    <section
      className={cn(
        "relative flex w-full items-center overflow-hidden bg-base-100 min-h-screen",
        variant === "hero-split-image-01-compact" && "bg-base-300",
        gridBackground &&
          "bg-[length:60px_60px] bg-[image:linear-gradient(to_right,var(--tw-gradient-stops)),linear-gradient(to_bottom,var(--tw-gradient-stops))]",
        className,
      )}
    >
      {/* Optional grid pattern overlay */}
      {gridBackground && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(var(--color-base-300)) 1px, transparent 1px), linear-gradient(to bottom, oklch(var(--color-base-300)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      )}

      <div
        className={cn(
          "relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-8 lg:px-12",
          variant === "hero-split-image-01-compact"
            ? "py-12 md:py-12 lg:py-12"
            : variant === "hero-split-image-01-airy"
              ? "py-20 md:py-24 lg:py-32"
              : "py-12 md:py-16 lg:py-24",
        )}
      >
        {/* -- Text column -- */}
        <motion.div
          className="relative z-10"
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-balance text-3xl font-bold leading-tight text-base-content sm:text-4xl md:text-5xl lg:text-7xl"
          >
            {headline}
            {headlineAccent && (
              <>
                {" "}
                <span className="font-serif italic text-accent">
                  {headlineAccent}
                </span>
              </>
            )}
            {headlineRotatingWords && headlineRotatingWords.length > 0 && (
              <>
                <br />
                <TypeWriter
                  text={headlineRotatingWords}
                  className="font-semibold italic text-primary"
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
            className="mb-10 mt-6 max-w-lg text-lg leading-relaxed text-base-content/60 md:text-xl"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
              className="group gap-2"
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

          {whatsappUrl && (
            <motion.div variants={fadeUp} className="mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 font-medium text-success underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <FaWhatsapp className="text-lg" />
                {whatsappLabel ?? "Chat on WhatsApp"}
              </a>
            </motion.div>
          )}

          {/* Featured items section */}
          {featuredItems && featuredItems.length > 0 && (
            <motion.div variants={fadeUp} className="mt-12">
              {(featuredItemsLabel || featuredItemsLinkText) && (
                <div className="mb-5 flex items-center justify-between border-b border-base-300 pb-2">
                  {featuredItemsLabel && (
                    <h3 className="text-sm font-bold uppercase tracking-widest text-base-content">
                      {featuredItemsLabel}
                    </h3>
                  )}
                  {featuredItemsLinkText && (
                    <a
                      href={featuredItemsLinkUrl ?? "#"}
                      className="flex items-center gap-1 text-xs text-base-content/60 transition-colors hover:text-primary"
                    >
                      {featuredItemsLinkText}
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {featuredItems.map((item, i) => (
                  <FeaturedItemCard key={i} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* -- Image column -- */}
        <div className="relative">
          {rotatingBadgeText && (
            <RotatingBadge
              text={rotatingBadgeText}
              shouldReduceMotion={shouldReduceMotion}
            />
          )}

          <motion.div
            variants={imageReveal}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="aspect-square overflow-hidden rounded-2xl shadow-xl rotate-2"
          >
            <img
              src={safeMainImg.src}
              onError={safeMainImg.onError}
              alt={imageAlt}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Decorative blur behind image */}
          <div className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          {/* Floating badge -- hidden on small screens to avoid overlap */}
          {badgeHeadline && (
            <motion.div
              variants={badgeReveal}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 hidden max-w-[200px] rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg md:block"
            >
              <p className="text-xl font-bold italic text-primary">
                {badgeHeadline}
              </p>
              {badgeDescription && (
                <p className="mt-1 text-xs leading-tight text-base-content/60">
                  {badgeDescription}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

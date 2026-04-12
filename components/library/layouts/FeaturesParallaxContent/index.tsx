"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContentSection {
  /** Heading displayed in the below-fold content area */
  contentHeadline: string;
  /** Body text for the below-fold content area */
  contentDescription: string;
  /** CTA button text */
  ctaText: string;
  /** CTA destination URL */
  ctaUrl: string;
}

export interface ParallaxSection {
  /** Background image URL for the sticky parallax panel */
  image: string;
  imageAlt: string;
  /** Small label displayed above the heading on the overlay */
  label: string;
  /** Large heading displayed on the parallax overlay */
  heading: string;
  /** Below-fold content block rendered after the parallax panel */
  content: ContentSection;
}

export interface FeaturesParallaxContentProps {
  /** Array of parallax sections — each renders a sticky image, overlay text, and content block */
  sections: ParallaxSection[];
  /** CTA button style applied to all content blocks */
  ctaStyle?: CtaVariant;
  /** CTA color scheme applied to all content blocks */
  ctaColorScheme?: ColorScheme;
  /** Horizontal padding around the image in pixels. Defaults to 12 */
  imagePadding?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_IMAGE_PADDING = 12;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface StickyImageProps {
  image: string;
  imageAlt: string;
  padding: number;
  shouldReduceMotion: boolean | null;
}

function StickyImage({
  image,
  imageAlt,
  padding,
  shouldReduceMotion,
}: StickyImageProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      ref={targetRef}
      className="sticky top-0 z-0 overflow-hidden rounded-3xl"
      role="img"
      aria-label={imageAlt}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${padding * 2}px)`,
        top: padding,
        scale: shouldReduceMotion ? undefined : scale,
      }}
    >
      <motion.div
        className="absolute inset-0 bg-neutral/70"
        style={{
          opacity: shouldReduceMotion ? 0.7 : overlayOpacity,
        }}
      />
    </motion.div>
  );
}

interface OverlayCopyProps {
  label: string;
  heading: string;
  shouldReduceMotion: boolean | null;
}

function OverlayCopy({ label, heading, shouldReduceMotion }: OverlayCopyProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-neutral-content"
      style={{
        y: shouldReduceMotion ? 0 : y,
        opacity: shouldReduceMotion ? 1 : opacity,
      }}
    >
      <p className="mb-2 text-center text-xl text-neutral-content/80 md:mb-4 md:text-3xl">
        {label}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
}

interface ContentBlockProps {
  content: ContentSection;
  ctaStyle: CtaVariant;
  ctaColorScheme: ColorScheme;
  shouldReduceMotion: boolean | null;
}

function ContentBlock({
  content,
  ctaStyle,
  ctaColorScheme,
  shouldReduceMotion,
}: ContentBlockProps) {
  return (
    <motion.div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 md:px-8"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <h3 className="col-span-1 text-3xl font-bold text-base-content md:col-span-4">
        {content.contentHeadline}
      </h3>
      <div className="col-span-1 md:col-span-8">
        <p className="mb-8 text-xl text-base-content/60 md:text-2xl">
          {content.contentDescription}
        </p>
        <CtaButton
          variant={ctaStyle}
          colorScheme={ctaColorScheme}
          href={content.ctaUrl}
        >
          {content.ctaText}
        </CtaButton>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FeaturesParallaxContent({
  sections,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  imagePadding = DEFAULT_IMAGE_PADDING,
  className,
}: FeaturesParallaxContentProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("w-full min-h-screen bg-base-100", className)}>
      {sections.map((section, idx) => (
        <div key={idx}>
          {/* Parallax image + overlay text */}
          <div
            style={{
              paddingLeft: imagePadding,
              paddingRight: imagePadding,
            }}
          >
            <div className="relative h-[150vh]">
              <StickyImage
                image={section.image}
                imageAlt={section.imageAlt}
                padding={imagePadding}
                shouldReduceMotion={shouldReduceMotion}
              />
              <OverlayCopy
                label={section.label}
                heading={section.heading}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          </div>

          {/* Below-fold content block */}
          <ContentBlock
            content={section.content}
            ctaStyle={ctaStyle}
            ctaColorScheme={ctaColorScheme}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      ))}
    </section>
  );
}

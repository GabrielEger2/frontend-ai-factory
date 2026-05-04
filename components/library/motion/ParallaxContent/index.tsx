"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@lib/utils";
import type { StyleKit } from "@lib/style-kit";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ParallaxSection {
  /** Background image URL for the sticky parallax panel */
  image: string;
  imageAlt: string;
  /** Small label displayed above the heading on the overlay */
  label: string;
  /** Large heading displayed on the parallax overlay */
  heading: string;
  /** Below-fold content rendered after the parallax panel — any React node */
  content: React.ReactNode;
}

export interface ParallaxContentProps {
  /** Array of parallax sections — each renders a sticky image, overlay text, and content node */
  sections?: ParallaxSection[];
  /** Site-wide style kit threaded by the Assembler */
  styleKit?: StyleKit;
  /** Horizontal padding around the image in pixels. Defaults to 12 */
  imagePadding?: number;
  /** Informational purpose tag attached as data attribute */
  purpose?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_PARALLAX_SECTIONS: ParallaxSection[] = [
  {
    image: "https://picsum.photos/seed/parallaxcontent-section-0/800/600",
    imageAlt: "Aerial view of a coastal city at sunset",
    label: "Discovery",
    heading: "Start where you are",
    content: (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 md:px-8">
        <h3 className="col-span-1 text-3xl font-bold text-base-content md:col-span-4">
          Map the terrain before you build
        </h3>
        <p className="col-span-1 text-xl text-base-content/60 md:col-span-8 md:text-2xl">
          We spend the first two weeks on the ground with your team —
          interviews, audits, and quiet listening — so the plan we deliver
          actually fits the company you have, not the one a deck imagines.
        </p>
      </div>
    ),
  },
  {
    image: "https://picsum.photos/seed/parallaxcontent-section-1/800/600",
    imageAlt: "Architect sketching plans in a sunlit studio",
    label: "Design",
    heading: "Decide what to build",
    content: (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 md:px-8">
        <h3 className="col-span-1 text-3xl font-bold text-base-content md:col-span-4">
          Tradeoffs made deliberate
        </h3>
        <p className="col-span-1 text-xl text-base-content/60 md:col-span-8 md:text-2xl">
          Every design choice gets paired with the cost it carries — engineering
          hours, support load, runway. The result is a plan you can defend in
          any room without flinching.
        </p>
      </div>
    ),
  },
  {
    image: "https://picsum.photos/seed/parallaxcontent-section-2/800/600",
    imageAlt: "Team celebrating a launch in a modern office",
    label: "Ship",
    heading: "Launch in weeks, not quarters",
    content: (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 md:px-8">
        <h3 className="col-span-1 text-3xl font-bold text-base-content md:col-span-4">
          Built to be handed off cleanly
        </h3>
        <p className="col-span-1 text-xl text-base-content/60 md:col-span-8 md:text-2xl">
          We document, demo, and stay on call through the first month live. By
          the time we&apos;re gone, your team owns the system end-to-end — and
          we mean it.
        </p>
      </div>
    ),
  },
];

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
  content: React.ReactNode;
  shouldReduceMotion: boolean | null;
}

function ContentBlock({ content, shouldReduceMotion }: ContentBlockProps) {
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ParallaxContent({
  sections = DEFAULT_PARALLAX_SECTIONS,
  styleKit: _styleKit,
  imagePadding = DEFAULT_IMAGE_PADDING,
  purpose,
  className,
}: ParallaxContentProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn("w-full min-h-screen bg-base-100", className)}
      data-purpose={purpose}
    >
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

          {/* Below-fold content node */}
          <ContentBlock
            content={section.content}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      ))}
    </section>
  );
}

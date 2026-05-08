"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DeviceFrame = "browser" | "macbook" | "phone" | "tablet";

export interface DeviceTrustBadge {
  label: string;
  /** Optional caption beneath the label, e.g. company size or rating */
  caption?: string;
}

export interface HeroDeviceChromeProps {
  eyebrow?: string;
  headline: string;
  /** Word inside `headline` to print in the accent color (no whitespace). */
  highlightWord?: string;
  subheadline?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /** Product screenshot — rendered inside the chosen device frame */
  screenshotImage: string;
  screenshotAlt: string;
  /** Which device chrome to wrap the screenshot in */
  deviceFrame?: DeviceFrame;
  /** Browser address bar text — only used when deviceFrame === "browser" */
  browserUrl?: string;
  /** Optional small badges underneath the CTAs (e.g. "SOC 2", "1,847 teams") */
  trustBadges?: DeviceTrustBadge[];
  /** Soft accent glow behind the device — defaults to true */
  showAccentGlow?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderHighlightedHeadline(headline: string, highlightWord?: string) {
  if (!highlightWord) return headline;
  const idx = headline.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + highlightWord.length);
  const after = headline.slice(idx + highlightWord.length);
  return (
    <>
      {before}
      <span className="text-primary">{match}</span>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Device frames — semantic-token shells around the screenshot        */
/* ------------------------------------------------------------------ */

interface DeviceShellProps {
  imageSrc: string;
  imageAlt: string;
  onError: React.ReactEventHandler<HTMLImageElement>;
  browserUrl?: string;
}

function BrowserFrame({
  imageSrc,
  imageAlt,
  onError,
  browserUrl,
}: DeviceShellProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3 border-b border-base-300 bg-base-300/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-error/80"
          />
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-warning/80"
          />
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-success/80"
          />
        </div>
        <div className="flex-1 truncate rounded-md bg-base-100 px-3 py-1 text-center font-mono text-[11px] text-base-content/60">
          {browserUrl ?? "app.example.com"}
        </div>
        <div
          aria-hidden="true"
          className="hidden h-2.5 w-2.5 rounded-full border border-base-300 sm:block"
        />
      </div>
      <div className="aspect-[16/10] w-full bg-base-100">
        <img
          src={imageSrc}
          alt={imageAlt}
          onError={onError}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}

function MacbookFrame({ imageSrc, imageAlt, onError }: DeviceShellProps) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-t-xl border border-base-300 bg-neutral p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)]">
        <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-base-100">
          <img
            src={imageSrc}
            alt={imageAlt}
            onError={onError}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mx-auto h-2 w-[110%] -translate-x-[5%] rounded-b-2xl bg-neutral/90"
      />
      <div
        aria-hidden="true"
        className="mx-auto h-1 w-[55%] rounded-b-md bg-neutral/70"
      />
    </div>
  );
}

function PhoneFrame({ imageSrc, imageAlt, onError }: DeviceShellProps) {
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[2.25rem] border-[10px] border-neutral bg-neutral shadow-[0_40px_80px_-30px_rgba(0,0,0,0.3)]">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.5rem] bg-base-100">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-neutral"
        />
        <img
          src={imageSrc}
          alt={imageAlt}
          onError={onError}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}

function TabletFrame({ imageSrc, imageAlt, onError }: DeviceShellProps) {
  return (
    <div className="mx-auto w-full overflow-hidden rounded-[2rem] border-[12px] border-neutral bg-neutral shadow-[0_40px_80px_-30px_rgba(0,0,0,0.3)]">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-base-100">
        <img
          src={imageSrc}
          alt={imageAlt}
          onError={onError}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
}

function renderDeviceFrame(frame: DeviceFrame, props: DeviceShellProps) {
  switch (frame) {
    case "macbook":
      return <MacbookFrame {...props} />;
    case "phone":
      return <PhoneFrame {...props} />;
    case "tablet":
      return <TabletFrame {...props} />;
    default:
      return <BrowserFrame {...props} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroDeviceChrome({
  eyebrow,
  headline,
  highlightWord,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  screenshotImage,
  screenshotAlt,
  deviceFrame = "browser",
  browserUrl,
  trustBadges,
  showAccentGlow = true,
  className,
}: HeroDeviceChromeProps) {
  const shouldReduceMotion = useReducedMotion();
  const safeShot = useSafeImageSrc(
    screenshotImage,
    "hero-device-chrome-screenshot",
    1280,
    800,
  );

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-center overflow-hidden bg-base-100 min-h-screen",
        className,
      )}
    >
      {/* Soft accent glow behind device */}
      {showAccentGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-primary/10 blur-[140px] md:right-[-5%]"
        />
      )}

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-28">
        {/* -- Headline column -- */}
        <motion.div
          className="lg:col-span-5"
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
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-base-content/70"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-success"
              />
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl"
          >
            {renderHighlightedHeadline(headline, highlightWord)}
          </motion.h1>
          {subheadline && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-5 max-w-md text-base leading-relaxed text-base-content/70 md:text-lg"
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
            className="mt-7 flex flex-wrap gap-3"
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
          {trustBadges && trustBadges.length > 0 && (
            <motion.ul
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {trustBadges.map((badge, i) => (
                <li key={i} className="flex flex-col">
                  <span className="text-sm font-medium text-base-content">
                    {badge.label}
                  </span>
                  {badge.caption && (
                    <span className="text-xs text-base-content/60">
                      {badge.caption}
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {/* -- Device column -- */}
        <motion.div
          className="lg:col-span-7"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        >
          {renderDeviceFrame(deviceFrame, {
            imageSrc: safeShot.src,
            imageAlt: screenshotAlt,
            onError: safeShot.onError,
            browserUrl,
          })}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBriefcase,
  FiChevronUp,
  FiHome,
  FiLayers,
  FiMail,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * Canonical icon keys the dock recognises. Keeping these as plain strings
 * means the slot data round-trips through JSON cleanly — the component
 * resolves the key to a Lucide-style icon internally.
 */
export type DockIconKey =
  | "home"
  | "work"
  | "projects"
  | "about"
  | "contact"
  | "layers"
  | "briefcase";

export interface NavbarDockLink {
  /** Visible label — shown in the tooltip on hover and in the mobile sheet */
  text: string;
  /** Destination URL or anchor */
  href: string;
  /** Icon key — resolves to an internal icon component */
  icon: DockIconKey;
}

export type CtaStyle = CtaVariant;

export interface NavbarDockProps {
  /** Logo rendered top-left (text or compact mark) */
  logo?: React.ReactNode;
  /** Dock items rendered bottom-center */
  links?: NavbarDockLink[];
  /** Optional CTA shown top-right on desktop and inside the mobile sheet */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** CTA style variant */
  ctaStyle?: CtaStyle;
  /** When true, anchors with `sticky` positioning (editor preview) */
  previewMode?: boolean;
  /** Extra classes on the outer wrapper */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_LINKS: NavbarDockLink[] = [
  { text: "Home", href: "/", icon: "home" },
  { text: "Work", href: "/work", icon: "work" },
  { text: "About", href: "/about", icon: "about" },
  { text: "Contact", href: "/contact", icon: "contact" },
];

const ICON_MAP: Record<DockIconKey, IconType> = {
  home: FiHome,
  work: FiBriefcase,
  projects: FiLayers,
  about: FiUser,
  contact: FiMail,
  layers: FiLayers,
  briefcase: FiBriefcase,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const buildHref = (href: string) => (href?.startsWith("#") ? `/${href}` : href);

/* ------------------------------------------------------------------ */
/*  DockItem — magnifies as the cursor approaches (motion-value driven) */
/* ------------------------------------------------------------------ */

const BASE_ICON_SIZE = 44; // px — base button width/height
const MAX_ICON_SIZE = 72; // px — peak magnified size
const INFLUENCE_RADIUS = 140; // px — distance over which magnification falls off

function DockItem({
  link,
  mouseX,
}: {
  link: NavbarDockLink;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  // Distance from the item's centre to the cursor, computed off-render
  // via useTransform so React never re-renders during pointer moves.
  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - (rect.x + rect.width / 2);
  });

  const sizeRange = useTransform(
    distance,
    [-INFLUENCE_RADIUS, 0, INFLUENCE_RADIUS],
    [BASE_ICON_SIZE, MAX_ICON_SIZE, BASE_ICON_SIZE],
  );

  const size = useSpring(sizeRange, {
    stiffness: 200,
    damping: 22,
    mass: 0.4,
  });

  const Icon = ICON_MAP[link.icon] ?? FiHome;
  const href = buildHref(link.href);

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={link.text}
      style={{ width: size, height: size }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-2xl bg-base-200/70 text-base-content shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors duration-200 hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
    >
      <Icon className="h-[42%] w-[42%]" aria-hidden="true" />

      <AnimatePresence>
        {hovered && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral px-2.5 py-1 text-xs font-medium text-neutral-content shadow-md"
          >
            {link.text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Dock — listens for mouse position, drives DockItem magnification    */
/* ------------------------------------------------------------------ */

function Dock({ links }: { links: NavbarDockLink[] }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <motion.nav
      onPointerMove={(e) => mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="pointer-events-auto flex items-end gap-3 rounded-3xl border border-base-300/70 bg-base-100/70 px-4 py-3 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl"
      aria-label="Primary navigation"
    >
      {links.map((link) => (
        <DockItem key={link.text} link={link} mouseX={mouseX} />
      ))}
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile sheet — slides up from the bottom on FiMenu tap             */
/* ------------------------------------------------------------------ */

function MobileSheet({
  links,
  ctaText,
  ctaUrl,
  ctaStyle,
  onClose,
}: {
  links: NavbarDockLink[];
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle: CtaStyle;
  onClose: () => void;
}) {
  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        aria-label="Close menu"
        className="fixed inset-0 z-[55] bg-neutral/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="fixed inset-x-0 bottom-0 z-[60] flex flex-col gap-1 rounded-t-3xl bg-base-100 px-6 pb-8 pt-4 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-base-300" />
        <div className="flex items-center justify-between pt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">
            Navigate
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-xl text-base-content/70"
          >
            <FiX />
          </button>
        </div>
        <ul className="mt-2 divide-y divide-base-300">
          {links.map((link) => {
            const Icon = ICON_MAP[link.icon] ?? FiHome;
            return (
              <li key={link.text}>
                <a
                  href={buildHref(link.href)}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 text-base-content"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-base font-medium">{link.text}</span>
                  </span>
                  <FiArrowRight className="text-base-content/50" />
                </a>
              </li>
            );
          })}
        </ul>
        {ctaText && ctaUrl && (
          <div className="pt-4">
            <CtaButton
              variant={ctaStyle}
              colorScheme="primary"
              href={ctaUrl}
              className="w-full justify-center text-sm"
            >
              {ctaText}
            </CtaButton>
          </div>
        )}
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function NavbarDock({
  logo,
  links = DEFAULT_LINKS,
  ctaText,
  ctaUrl,
  ctaStyle = "arrow",
  previewMode = false,
  className,
}: NavbarDockProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const positioning = previewMode ? "sticky" : "fixed";

  return (
    <>
      {/* Top bar — logo + optional CTA */}
      <div
        className={cn(
          positioning,
          "left-0 right-0 top-0 z-40 w-full px-5 py-4 lg:px-10",
          className,
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex shrink-0 items-center">{logo}</div>

          {/* Desktop CTA */}
          {ctaText && ctaUrl && (
            <div className="hidden lg:block">
              <CtaButton
                variant={ctaStyle}
                colorScheme="primary"
                href={ctaUrl}
                className="text-sm"
              >
                {ctaText}
              </CtaButton>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-base-content backdrop-blur-md lg:hidden"
          >
            <FiMenu />
          </button>
        </div>
      </div>

      {/* Bottom dock — desktop only */}
      <div
        className={cn(
          positioning,
          "bottom-6 left-1/2 z-40 hidden -translate-x-1/2 lg:block",
        )}
      >
        <Dock links={links} />
      </div>

      {/* Floating mobile dock trigger — visual hint that nav lives at the bottom */}
      <div
        className={cn(
          positioning,
          "bottom-5 left-1/2 z-40 -translate-x-1/2 lg:hidden",
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-base-300/70 bg-base-100/80 px-4 py-2.5 text-sm font-medium text-base-content shadow-[0_18px_40px_-18px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          aria-label="Open navigation"
        >
          <FiChevronUp />
          Menu
          <FiArrowUpRight className="h-3.5 w-3.5 text-base-content/60" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileSheet
            links={links}
            ctaText={ctaText}
            ctaUrl={ctaUrl}
            ctaStyle={ctaStyle}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

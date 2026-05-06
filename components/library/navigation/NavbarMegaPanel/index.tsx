"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { FiArrowUpRight, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { ClientSideLink } from "@ui/ClientSideLink";
import { CtaButton, type CtaVariant } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MegaPanelGroup {
  /** Column heading rendered above the link list */
  title: string;
  /** Link items inside the column */
  items: Array<{
    label: string;
    description?: string;
    href: string;
    badge?: string;
  }>;
}

export interface MegaPanelFeature {
  /** Heading shown on the right-hand featured card */
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  ctaLabel?: string;
  /** Optional image src for the featured card thumbnail */
  image?: string;
  imageAlt?: string;
}

export interface NavbarMegaPanelLink {
  /** Visible link label */
  text: string;
  /** Destination URL or anchor — used when the link has no panel */
  href: string;
  /**
   * When provided, hovering / clicking the link opens a full-width
   * mega-panel with these multi-column groups + an optional feature card.
   */
  panel?: {
    groups: MegaPanelGroup[];
    feature?: MegaPanelFeature;
  };
}

export type CtaStyle = CtaVariant;

export interface NavbarMegaPanelProps {
  /** Logo rendered at the start of the bar (typically an SVG or text mark) */
  logo?: React.ReactNode;
  /** Navigation links — links with `panel` open a wide multi-column panel */
  links?: NavbarMegaPanelLink[];
  /** Optional secondary text-only link before the CTA (e.g. "Sign in") */
  signInText?: string;
  /** Sign-in destination URL */
  signInUrl?: string;
  /** Optional CTA button label shown on desktop */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** CTA button style — flexes the internal Cta primitive */
  ctaStyle?: CtaStyle;
  /** Pixel threshold after which the bar tightens with a backdrop-blur fill */
  scrollThreshold?: number;
  /** When true, uses sticky positioning so the bar stays inside its container (editor preview) */
  previewMode?: boolean;
  /** Extra classes on the root nav element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_LINKS: NavbarMegaPanelLink[] = [
  { text: "Platform", href: "/platform" },
  { text: "Solutions", href: "/solutions" },
  { text: "Pricing", href: "/pricing" },
  { text: "Resources", href: "/resources" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const buildHref = (href: string) => (href?.startsWith("#") ? `/${href}` : href);

/* ------------------------------------------------------------------ */
/*  Mega panel content (desktop)                                       */
/* ------------------------------------------------------------------ */

function MegaPanelContent({
  groups,
  feature,
}: {
  groups: MegaPanelGroup[];
  feature?: MegaPanelFeature;
}) {
  const featureSpan = feature ? "lg:col-span-4" : "lg:col-span-6";
  const groupsCount = groups.length;
  const groupsCols =
    groupsCount === 1
      ? "lg:grid-cols-1"
      : groupsCount === 2
        ? "lg:grid-cols-2"
        : "lg:grid-cols-3";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className={cn("col-span-1 grid gap-8", featureSpan, groupsCols)}>
        {groups.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const href = buildHref(item.href);
                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      className="group/item -mx-2 flex flex-col gap-0.5 rounded-md px-2 py-2 transition-colors duration-200 hover:bg-base-200"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-base-content">
                        {item.label}
                        {item.badge && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.description && (
                        <span className="text-xs text-base-content/60">
                          {item.description}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {feature && (
        <a
          href={buildHref(feature.href)}
          className="group/feature col-span-1 flex flex-col overflow-hidden rounded-xl border border-base-300 bg-base-200 transition-colors duration-200 hover:border-base-content/30 lg:col-span-4 lg:col-start-9"
        >
          {feature.image && (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={feature.image}
                alt={feature.imageAlt ?? ""}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/feature:scale-[1.04]"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 p-5">
            {feature.eyebrow && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {feature.eyebrow}
              </span>
            )}
            <p className="text-base font-semibold leading-tight text-base-content">
              {feature.title}
            </p>
            {feature.description && (
              <p className="text-sm text-base-content/60">
                {feature.description}
              </p>
            )}
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-base-content">
              {feature.ctaLabel ?? "Read more"}
              <FiArrowUpRight className="transition-transform duration-200 group-hover/feature:-translate-y-0.5 group-hover/feature:translate-x-0.5" />
            </span>
          </div>
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop top-row link                                               */
/* ------------------------------------------------------------------ */

function DesktopLink({
  link,
  isActive,
  onActivate,
  onDeactivate,
}: {
  link: NavbarMegaPanelLink;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const hasPanel = !!link.panel;

  if (!hasPanel) {
    return (
      <ClientSideLink href={buildHref(link.href)}>
        <span
          className="relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content"
          onMouseEnter={onDeactivate}
        >
          {link.text}
        </span>
      </ClientSideLink>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-expanded={isActive}
      aria-haspopup="true"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
        isActive
          ? "text-base-content"
          : "text-base-content/70 hover:text-base-content",
      )}
    >
      {link.text}
      <FiChevronDown
        className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          isActive && "rotate-180",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile menu link with optional collapsible panel                   */
/* ------------------------------------------------------------------ */

function MobileLink({
  link,
  onNavigate,
}: {
  link: NavbarMegaPanelLink;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasPanel = !!link.panel;

  if (!hasPanel) {
    return (
      <a
        href={buildHref(link.href)}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        className="flex w-full items-center justify-between border-b border-base-300 py-5 text-lg font-medium text-base-content"
      >
        <span>{link.text}</span>
        <FiArrowUpRight />
      </a>
    );
  }

  return (
    <div className="border-b border-base-300">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-lg font-medium text-base-content"
      >
        <span className={cn(open && "text-primary")}>{link.text}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <FiChevronDown />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && link.panel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pb-6">
              {link.panel.groups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/50">
                    {group.title}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={buildHref(item.href)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate();
                          }}
                          className="flex items-center gap-2 py-1.5 text-base text-base-content"
                        >
                          {item.label}
                          {item.badge && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {link.panel.feature && (
                <a
                  href={buildHref(link.panel.feature.href)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                  }}
                  className="block rounded-xl border border-base-300 bg-base-200 p-4"
                >
                  {link.panel.feature.eyebrow && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {link.panel.feature.eyebrow}
                    </span>
                  )}
                  <p className="mt-1 text-base font-semibold text-base-content">
                    {link.panel.feature.title}
                  </p>
                  {link.panel.feature.description && (
                    <p className="mt-1 text-sm text-base-content/60">
                      {link.panel.feature.description}
                    </p>
                  )}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile drawer                                                      */
/* ------------------------------------------------------------------ */

function MobileMenu({
  links,
  logo,
  signInText,
  signInUrl,
  ctaText,
  ctaUrl,
  ctaStyle,
  onClose,
}: {
  links: NavbarMegaPanelLink[];
  logo?: React.ReactNode;
  signInText?: string;
  signInUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaStyle: CtaStyle;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-[60] flex min-h-[100dvh] w-full flex-col bg-base-100"
      aria-label="Mobile navigation"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b border-base-300 px-6 py-5">
        <div>{logo}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="text-2xl text-base-content"
        >
          <FiX />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6">
        {links.map((link) => (
          <MobileLink key={link.text} link={link} onNavigate={onClose} />
        ))}
      </div>
      <div className="space-y-3 border-t border-base-300 px-6 py-5">
        {signInText && signInUrl && (
          <a
            href={signInUrl}
            className="block text-center text-sm font-medium text-base-content/80"
          >
            {signInText}
          </a>
        )}
        {ctaText && ctaUrl && (
          <CtaButton
            variant={ctaStyle}
            colorScheme="primary"
            href={ctaUrl}
            className="w-full justify-center text-sm"
          >
            {ctaText}
          </CtaButton>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function NavbarMegaPanel({
  logo,
  links = DEFAULT_LINKS,
  signInText,
  signInUrl,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  scrollThreshold = 40,
  previewMode = false,
  className,
}: NavbarMegaPanelProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > scrollThreshold);
  });

  const activeLink = links.find((l) => l.text === activePanel) ?? null;
  const showPanel = !!(activeLink && activeLink.panel);

  return (
    <header
      className={cn(
        previewMode ? "sticky" : "fixed",
        "left-0 right-0 top-0 z-50 w-full transition-colors duration-300 ease-out",
        scrolled || showPanel
          ? "border-b border-base-300/60 bg-base-100/85 backdrop-blur-md"
          : "border-b border-transparent bg-base-100/0",
        className,
      )}
      onMouseLeave={() => setActivePanel(null)}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        {/* Brand */}
        <div className="flex shrink-0 items-center">{logo}</div>

        {/* Desktop links */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.text}>
                <DesktopLink
                  link={link}
                  isActive={activePanel === link.text}
                  onActivate={() => setActivePanel(link.text)}
                  onDeactivate={() => setActivePanel(null)}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-4 lg:flex">
          {signInText && signInUrl && (
            <a
              href={signInUrl}
              onMouseEnter={() => setActivePanel(null)}
              className="text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content"
            >
              {signInText}
            </a>
          )}
          {ctaText && ctaUrl && (
            <CtaButton
              variant={ctaStyle}
              colorScheme="primary"
              href={ctaUrl}
              className="text-sm"
            >
              {ctaText}
            </CtaButton>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="block text-2xl text-base-content lg:hidden"
        >
          <FiMenu />
        </button>
      </div>

      {/* Mega panel — desktop only */}
      <AnimatePresence>
        {showPanel && activeLink?.panel && (
          <motion.div
            key={activeLink.text}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="hidden border-t border-base-300/60 bg-base-100/95 backdrop-blur-md lg:block"
          >
            <div className="mx-auto max-w-7xl px-8 py-10">
              <MegaPanelContent
                groups={activeLink.panel.groups}
                feature={activeLink.panel.feature}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={links}
            logo={logo}
            signInText={signInText}
            signInUrl={signInUrl}
            ctaText={ctaText}
            ctaUrl={ctaUrl}
            ctaStyle={ctaStyle}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

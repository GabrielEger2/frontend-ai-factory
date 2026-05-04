"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { FiArrowRight, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@lib/utils";
import { ClientSideLink } from "@ui/ClientSideLink";
import { CtaButton, type CtaVariant } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NavbarPillLink {
  /** Visible link label */
  text: string;
  /** Destination URL or anchor (e.g. "/about", "#features") */
  href: string;
  /** Optional flyout content rendered on hover (desktop) / expand (mobile) */
  flyoutContent?: React.ComponentType;
}

export type CtaStyle = CtaVariant;

export interface NavbarPillProps {
  /** Logo rendered at the start of the bar (accepts any ReactNode, typically an SVG or image) */
  logo?: React.ReactNode;
  /** Alternate logo for dark-on-light contexts (scrolled state / mobile menu) */
  logoDark?: React.ReactNode;
  /** Navigation links */
  links?: NavbarPillLink[];
  /** Optional CTA button label shown on desktop */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** CTA button style — "default" uses the standard filled button, others use animated variants. "arrow" keeps the inline pill+arrow look from the reference. */
  ctaStyle?: CtaStyle | "arrow";
  /** Pixel threshold after which the bar tightens / increases its glass blur */
  scrollThreshold?: number;
  /** When true, uses `sticky` positioning instead of `fixed` so the bar stays inside its containing block (used by the editor preview) */
  previewMode?: boolean;
  /** Extra classes on the root `<nav>` element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_LINKS: NavbarPillLink[] = [
  { text: "Studio", href: "/" },
  { text: "Work", href: "/work" },
  { text: "Journal", href: "/journal" },
  { text: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const buildHref = (href: string) => (href?.startsWith("#") ? `/${href}` : href);

/* ------------------------------------------------------------------ */
/*  Brand mark — conic gradient orb fallback when no logo is provided  */
/* ------------------------------------------------------------------ */

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="block h-[22px] w-[22px] rounded-full shadow-[0_0_18px_rgba(124,58,237,0.6)]"
      style={{
        background:
          "conic-gradient(from 0deg, oklch(var(--color-primary)), oklch(var(--color-secondary)), oklch(var(--color-accent)), oklch(var(--color-primary)))",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Arrow CTA — inline pill with sliding arrow (matches the reference) */
/* ------------------------------------------------------------------ */

function ArrowCta({ text, url }: { text: string; url: string }) {
  return (
    <a
      href={url}
      className="group inline-flex items-center gap-2 rounded-full border border-base-content/30 px-4 py-2 text-sm transition-all duration-300 ease-out hover:border-base-content hover:bg-base-content hover:text-base-100"
    >
      <span>{text}</span>
      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA dispatcher                                                     */
/* ------------------------------------------------------------------ */

function NavbarCta({
  text,
  url,
  style,
}: {
  text: string;
  url: string;
  style: CtaStyle | "arrow";
}) {
  if (style === "arrow") return <ArrowCta text={text} url={url} />;

  return (
    <CtaButton
      variant={style}
      href={url}
      colorScheme="primary"
      className="text-sm"
    >
      {text}
    </CtaButton>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop link with hover gradient underline                         */
/* ------------------------------------------------------------------ */

function FlyoutLink({
  children,
  href,
  FlyoutContent,
}: {
  children: React.ReactNode;
  href: string;
  FlyoutContent?: React.ComponentType;
}) {
  const [open, setOpen] = useState(false);
  const finalHref = buildHref(href);
  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="group relative h-fit w-fit"
    >
      <ClientSideLink href={finalHref}>
        <span className="relative flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content">
          {children}
          {FlyoutContent && (
            <FiChevronDown
              className={cn(
                "transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          )}
          {/* gradient underline reveal */}
          <span
            className="pointer-events-none absolute bottom-1 left-3.5 right-3.5 h-px origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(var(--color-accent)), transparent)",
            }}
          />
        </span>
      </ClientSideLink>

      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 top-10 z-50 -translate-x-1/2 pt-4"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-base-100 shadow-sm" />
            <div className="relative -translate-y-2 overflow-hidden rounded-lg bg-base-100 text-base-content shadow-xl">
              <FlyoutContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopLinks({ links }: { links: NavbarPillLink[] }) {
  return (
    <ul className="flex items-center gap-1">
      {links.map((link) => (
        <li key={link.text}>
          <FlyoutLink href={link.href} FlyoutContent={link.flyoutContent}>
            {link.text}
          </FlyoutLink>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile menu                                                        */
/* ------------------------------------------------------------------ */

function MobileMenuLink({
  children,
  href,
  onNavigate,
}: {
  children: React.ReactNode;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        onNavigate();
      }}
      href={href}
      className="flex w-full cursor-pointer items-center justify-between border-b border-base-300 py-6 text-start text-xl font-medium text-base-content"
    >
      <span>{children}</span>
      <FiArrowRight />
    </a>
  );
}

function MobileMenuDropdown({
  children,
  FlyoutContent,
}: {
  children: React.ReactNode;
  href: string;
  FlyoutContent?: React.ComponentType;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-base-300 text-base-content">
      <div
        className="flex w-full cursor-pointer items-center justify-between py-6 text-start text-xl font-medium"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        <span className={cn(open && "text-primary")}>{children}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <FiChevronDown />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && FlyoutContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden bg-base-200 px-4"
          >
            <div className="space-y-4 pb-6">
              <FlyoutContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({
  links,
  logo,
  onClose,
}: {
  links: NavbarPillLink[];
  logo?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.nav
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed inset-0 z-[60] flex h-screen w-full flex-col bg-base-100"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between p-6">
        {logo}
        <button onClick={onClose} aria-label="Close menu">
          <FiX className="text-3xl text-base-content" />
        </button>
      </div>
      <div className="h-full overflow-y-auto bg-base-200 p-6">
        {links.map((link) =>
          link.flyoutContent ? (
            <MobileMenuDropdown
              key={link.text}
              href={link.href}
              FlyoutContent={link.flyoutContent}
              onNavigate={onClose}
            >
              {link.text}
            </MobileMenuDropdown>
          ) : (
            <MobileMenuLink
              key={link.text}
              href={link.href}
              onNavigate={onClose}
            >
              {link.text}
            </MobileMenuLink>
          ),
        )}
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function NavbarPill({
  logo,
  logoDark,
  links = DEFAULT_LINKS,
  ctaText,
  ctaUrl,
  ctaStyle = "arrow",
  scrollThreshold = 60,
  previewMode = false,
  className,
}: NavbarPillProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > scrollThreshold);
  });

  const renderedLogo = scrolled && logoDark ? logoDark : logo;

  return (
    <div
      className={cn(
        `${previewMode ? "sticky" : "fixed"} top-0 z-50 w-full px-4 pt-4 lg:px-12 lg:pt-6`,
        className,
      )}
      aria-label="Main navigation"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full border border-base-content/15 px-5 py-3 text-base-content backdrop-blur-md transition-all duration-300 ease-out lg:px-7",
          scrolled
            ? "bg-base-100/70 shadow-xl"
            : "bg-base-100/30 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        )}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-2.5">
          {renderedLogo ?? <BrandMark />}
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 lg:flex">
          <DesktopLinks links={links} />
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center lg:flex">
          {ctaText && ctaUrl && (
            <NavbarCta text={ctaText} url={ctaUrl} style={ctaStyle} />
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="block text-2xl lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={links}
            logo={logoDark ?? logo}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

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
import { Button } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NavbarLink {
  /** Visible link label */
  text: string;
  /** Destination URL or anchor (e.g. "/about", "#features") */
  href: string;
  /** Optional flyout content rendered on hover (desktop) / expand (mobile) */
  flyoutContent?: React.ComponentType;
}

export interface NavbarStickyProps {
  /** Logo rendered at the start of the bar (accepts any ReactNode, typically an SVG or image) */
  logo: React.ReactNode;
  /** Alternate logo for dark-on-light contexts (scrolled state / mobile menu) */
  logoDark?: React.ReactNode;
  /** Navigation links */
  links: NavbarLink[];
  /** Optional CTA button label shown on desktop */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** Pixel threshold after which the bar switches to the scrolled (filled) style */
  scrollThreshold?: number;
  /** Extra classes on the root `<nav>` element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Normalise anchor-only hrefs so they route through the home page. */
const buildHref = (href: string) => (href?.startsWith("#") ? `/${href}` : href);

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DesktopLinks({ links }: { links: NavbarLink[] }) {
  return (
    <div className="flex items-center gap-8">
      {links.map((link) => (
        <FlyoutLink
          key={link.text}
          href={link.href}
          FlyoutContent={link.flyoutContent}
        >
          {link.text}
        </FlyoutLink>
      ))}
    </div>
  );
}

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
        <span className="relative flex cursor-pointer items-center gap-1 font-medium transition-colors duration-200">
          {children}
          {FlyoutContent && (
            <FiChevronDown
              className={cn(
                "transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          )}
        </span>
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
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
            {/* Invisible bridge so the cursor can travel from the link to the flyout */}
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />

            {/* Arrow */}
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
    <div className="text-base-content">
      <a
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        href={href}
        className="flex w-full cursor-pointer items-center justify-between border-b border-base-300 py-6 text-start text-xl font-medium"
      >
        <span>{children}</span>
        <FiArrowRight />
      </a>
    </div>
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
  links: NavbarLink[];
  logo: React.ReactNode;
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
        {links.map((link) => {
          if (link.flyoutContent) {
            return (
              <MobileMenuDropdown
                key={link.text}
                href={link.href}
                FlyoutContent={link.flyoutContent}
                onNavigate={onClose}
              >
                {link.text}
              </MobileMenuDropdown>
            );
          }
          return (
            <MobileMenuLink
              key={link.text}
              href={link.href}
              onNavigate={onClose}
            >
              {link.text}
            </MobileMenuLink>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function NavbarSticky({
  logo,
  logoDark,
  links,
  ctaText,
  ctaUrl,
  scrollThreshold = 250,
  className,
}: NavbarStickyProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > scrollThreshold);
  });

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full px-6 transition-all duration-300 ease-out lg:px-12",
        scrolled
          ? "bg-neutral/95 py-3 shadow-xl backdrop-blur-sm"
          : "bg-transparent py-6 shadow-none",
        "text-neutral-content",
        className,
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo — swap to dark variant when scrolled, if provided */}
        <div className="shrink-0">{scrolled && logoDark ? logoDark : logo}</div>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          <DesktopLinks links={links} />

          {ctaText && ctaUrl && (
            <Button asChild size="sm">
              <a href={ctaUrl}>{ctaText}</a>
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="block text-3xl lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={links}
            logo={logoDark ?? logo}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

"use client";

import { useState } from "react";
import {
  FaFacebook,
  FaGlobe,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FooterMegaNavColumn {
  title: string;
  links: Array<{ text: string; href: string; badge?: string }>;
}

export interface FooterMegaSocialLink {
  network:
    | "instagram"
    | "linkedin"
    | "facebook"
    | "whatsapp"
    | "twitter"
    | "youtube"
    | "tiktok"
    | "google"
    | "pinterest"
    | "telegram";
  url: string;
  label: string;
}

export interface FooterMegaProps {
  /** Logo display text rendered in the brand block (string only — composition keeps slots JSON-serializable). */
  logoText?: string;
  /** Optional small caption shown under the logo */
  tagline?: string;

  /* ----- Newsletter ----- */
  /** Newsletter eyebrow (e.g. "Stay close") */
  newsletterEyebrow?: string;
  /** Newsletter headline */
  newsletterHeadline?: string;
  /** Supporting copy under the headline */
  newsletterDescription?: string;
  /** Email input placeholder */
  newsletterPlaceholder?: string;
  /** Submit button label */
  newsletterCtaText?: string;
  /** CTA visual variant */
  newsletterCtaStyle?: CtaVariant;
  /** CTA color scheme */
  newsletterCtaColorScheme?: ColorScheme;
  /** Privacy line under the form */
  newsletterPrivacyText?: string;
  /** Confirmation copy shown after submit */
  newsletterSuccessText?: string;

  /* ----- Sitemap ----- */
  /** Up to 5 sitemap columns */
  navColumns?: FooterMegaNavColumn[];

  /* ----- Bottom row ----- */
  /** Company display name (used in copyright) */
  companyName?: string;
  /** Optional list of small print rows (legal lines) */
  legalLinks?: Array<{ text: string; href: string }>;
  /** Social icon row */
  socialLinks?: FooterMegaSocialLink[];

  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_NAV_COLUMNS: FooterMegaNavColumn[] = [
  {
    title: "Product",
    links: [
      { text: "Overview", href: "/product" },
      { text: "Pricing", href: "/pricing" },
      { text: "Integrations", href: "/integrations" },
      { text: "Changelog", href: "/changelog", badge: "New" },
      { text: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Documentation", href: "/docs" },
      { text: "API reference", href: "/docs/api" },
      { text: "Customer stories", href: "/customers" },
      { text: "Engineering blog", href: "/blog" },
      { text: "Brand assets", href: "/brand" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "/about" },
      { text: "Careers", href: "/careers", badge: "12 open" },
      { text: "Press", href: "/press" },
      { text: "Partners", href: "/partners" },
      { text: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Trust & policies",
    links: [
      { text: "Security & SOC 2", href: "/security" },
      { text: "Privacy policy", href: "/privacy" },
      { text: "Terms of service", href: "/terms" },
      { text: "Subprocessors", href: "/subprocessors" },
      { text: "DPA & MSA", href: "/legal/dpa" },
    ],
  },
];

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  google: FaGoogle,
  pinterest: FaPinterest,
  telegram: FaTelegram,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FooterMega -- a "mega-footer" with a newsletter capture row, a
 * 4-5 column sitemap, an explicit legal-and-social bar, and a
 * copyright line. Sits on bg-neutral / text-neutral-content.
 *
 * The newsletter form is purely presentational here; wire it to your
 * own ESP through the action of the deployed page.
 */
export default function FooterMega({
  logoText = "Your Company",
  tagline,
  newsletterEyebrow = "Stay close",
  newsletterHeadline = "Quarterly updates, no growth-hack emails",
  newsletterDescription = "Roughly four emails a year — release notes, the postmortems we publish, and the conferences we sponsor. Unsubscribe anytime.",
  newsletterPlaceholder = "you@yourcompany.com",
  newsletterCtaText = "Subscribe",
  newsletterCtaStyle = "default",
  newsletterCtaColorScheme = "primary",
  newsletterPrivacyText = "We treat your email like a phone number. Never sold, never shared.",
  newsletterSuccessText = "Got it. Look for a confirmation email in the next minute.",
  navColumns = DEFAULT_NAV_COLUMNS,
  companyName = "Your Company",
  legalLinks,
  socialLinks = [],
  className,
}: FooterMegaProps) {
  const [submitted, setSubmitted] = useState(false);
  const cappedColumns = navColumns.slice(0, 5);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer
      className={cn(
        "relative w-full border-t border-neutral-content/10 bg-neutral text-neutral-content",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-10 pt-16 md:px-8 md:pt-20 lg:gap-16">
        {/* ----- Newsletter row ----- */}
        <section
          aria-labelledby="footer-mega-newsletter-heading"
          className="grid grid-cols-1 gap-8 border-b border-neutral-content/10 pb-12 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] lg:gap-16 lg:pb-16"
        >
          <div className="flex flex-col gap-3">
            {newsletterEyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-content/55">
                {newsletterEyebrow}
              </span>
            )}
            <h2
              id="footer-mega-newsletter-heading"
              className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
            >
              {newsletterHeadline}
            </h2>
            {newsletterDescription && (
              <p className="max-w-md text-sm leading-relaxed text-neutral-content/70 md:text-base">
                {newsletterDescription}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {submitted ? (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl bg-neutral-content/5 p-5 ring-1 ring-neutral-content/10"
              >
                <FiCheckCircle
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                />
                <p className="text-sm text-neutral-content/85 md:text-base">
                  {newsletterSuccessText}
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <label
                  htmlFor="footer-mega-newsletter-email"
                  className="sr-only"
                >
                  Email address
                </label>
                <input
                  id="footer-mega-newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder={newsletterPlaceholder}
                  className="flex-1 rounded-field border border-neutral-content/20 bg-neutral-content/5 px-4 py-3 text-neutral-content placeholder:text-neutral-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <CtaButton
                  variant={newsletterCtaStyle}
                  colorScheme={newsletterCtaColorScheme}
                  onClick={(event) => {
                    /* Form-submission handler still fires; the CTA wrapper navigates only when href is present. */
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  {newsletterCtaText}
                </CtaButton>
              </form>
            )}
            {newsletterPrivacyText && (
              <p className="text-xs text-neutral-content/55">
                {newsletterPrivacyText}
              </p>
            )}
          </div>
        </section>

        {/* ----- Sitemap row ----- */}
        <section
          aria-label="Sitemap"
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[minmax(0,_2fr)_repeat(4,_minmax(0,_1fr))]"
        >
          {/* Brand block */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <span className="text-2xl font-semibold tracking-tight">
              {logoText}
            </span>
            {tagline && (
              <p className="max-w-xs text-sm leading-relaxed text-neutral-content/65">
                {tagline}
              </p>
            )}
          </div>

          {/* Sitemap columns */}
          {cappedColumns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="flex flex-col gap-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-content/55">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.text} className="flex items-center gap-2">
                    <a
                      href={link.href}
                      className="text-neutral-content/85 transition-colors hover:text-neutral-content"
                    >
                      {link.text}
                    </a>
                    {link.badge && (
                      <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                        {link.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </section>

        {/* ----- Bottom bar ----- */}
        <section className="flex flex-col gap-4 border-t border-neutral-content/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <span className="text-neutral-content/65">
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </span>

          {legalLinks && legalLinks.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    className="text-neutral-content/65 transition-colors hover:text-neutral-content"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4 text-base">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.network] ?? FaGlobe;
                return (
                  <a
                    key={social.network}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="text-neutral-content/70 transition-colors hover:text-neutral-content"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </footer>
  );
}

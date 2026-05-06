"use client";

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
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FooterMinimalStripSocialLink {
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

export interface FooterMinimalStripProps {
  /** Brand display text on the left of the strip */
  logoText?: string;
  /** Optional small descriptor placed inline after the logo (e.g. "Studio · Curitiba") */
  caption?: string;
  /** Company name used in the copyright line */
  companyName?: string;
  /** Optional copyright suffix text — shown after the year (e.g. "Made with care in São Paulo"). */
  copyrightSuffix?: string;
  /** Up to 3 small inline legal links rendered in the center of the strip */
  legalLinks?: Array<{ text: string; href: string }>;
  /** Up to 6 social icons rendered on the right of the strip */
  socialLinks?: FooterMinimalStripSocialLink[];
  /** Visual tone — "neutral" sits on bg-neutral, "subtle" sits on bg-base-100 with a hairline top border */
  tone?: "neutral" | "subtle";
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Icon registry                                                      */
/* ------------------------------------------------------------------ */

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
 * FooterMinimalStrip — a single-line site-bottom footer.
 *
 * One stretched flex row on desktop (brand · legal · socials), collapsing
 * cleanly to a centered three-line stack on mobile. Designed for portfolio,
 * agency, and single-page brand sites where the rest of the page already
 * carries the storytelling weight.
 */
export default function FooterMinimalStrip({
  logoText = "Your Company",
  caption,
  companyName,
  copyrightSuffix,
  legalLinks = [],
  socialLinks = [],
  tone = "neutral",
  className,
}: FooterMinimalStripProps) {
  const cappedLegal = legalLinks.slice(0, 3);
  const cappedSocial = socialLinks.slice(0, 6);
  const displayCompany = companyName ?? logoText;

  return (
    <footer
      className={cn(
        "relative w-full",
        tone === "neutral"
          ? "border-t border-neutral-content/10 bg-neutral text-neutral-content"
          : "border-t border-base-300 bg-base-100 text-base-content",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-5">
        {/* ---------- Brand block ---------- */}
        <div className="flex flex-col items-center gap-1 md:flex-row md:items-baseline md:gap-3">
          <span
            className={cn(
              "text-base font-semibold tracking-tight",
              tone === "neutral" ? "text-neutral-content" : "text-base-content",
            )}
          >
            {logoText}
          </span>
          <span
            className={cn(
              "text-xs",
              tone === "neutral"
                ? "text-neutral-content/55"
                : "text-base-content/55",
            )}
          >
            &copy; {new Date().getFullYear()} {displayCompany}.
            {copyrightSuffix ? ` ${copyrightSuffix}` : ""}
          </span>
          {caption && (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "hidden text-xs md:inline",
                  tone === "neutral"
                    ? "text-neutral-content/30"
                    : "text-base-content/30",
                )}
              >
                ·
              </span>
              <span
                className={cn(
                  "text-xs",
                  tone === "neutral"
                    ? "text-neutral-content/55"
                    : "text-base-content/55",
                )}
              >
                {caption}
              </span>
            </>
          )}
        </div>

        {/* ---------- Legal links (center) ---------- */}
        {cappedLegal.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            {cappedLegal.map((link) => (
              <li key={link.text}>
                <a
                  href={link.href}
                  className={cn(
                    "transition-colors",
                    tone === "neutral"
                      ? "text-neutral-content/65 hover:text-neutral-content"
                      : "text-base-content/65 hover:text-base-content",
                  )}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* ---------- Social row ---------- */}
        {cappedSocial.length > 0 && (
          <nav aria-label="Social links" className="flex items-center gap-4">
            {cappedSocial.map((social) => {
              const Icon = SOCIAL_ICONS[social.network] ?? FaGlobe;
              return (
                <a
                  key={social.network}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    tone === "neutral"
                      ? "text-neutral-content/70 hover:bg-neutral-content/10 hover:text-neutral-content"
                      : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </nav>
        )}
      </div>
    </footer>
  );
}

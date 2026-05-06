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
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FooterColumnsSocialNavColumn {
  title: string;
  links: Array<{ text: string; href: string }>;
}

export interface FooterColumnsSocialHandle {
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
  /** Display handle, including @ if relevant (e.g. "@northbeam") */
  handle: string;
  /** Accessible label, full sentence (e.g. "Northbeam on LinkedIn") */
  label: string;
}

export interface FooterColumnsSocialProps {
  /** Brand display text (slot stays JSON-serializable). */
  logoText?: string;
  /** Short brand tagline rendered under the logo. */
  tagline?: string;
  /** Up to 4 sitemap columns. */
  navColumns?: FooterColumnsSocialNavColumn[];
  /** Up to 6 social handle cards rendered in their own column. */
  socialHandles?: FooterColumnsSocialHandle[];
  /** Heading for the social handle column (e.g. "Find us"). */
  socialHeading?: string;
  /** Company display name used in the copyright row. */
  companyName?: string;
  /** Optional legal links shown in the bottom bar. */
  legalLinks?: Array<{ text: string; href: string }>;
  /** Optional region / locale label (e.g. "Brasil · Português"). */
  regionLabel?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults & icon registry                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_NAV_COLUMNS: FooterColumnsSocialNavColumn[] = [
  {
    title: "Product",
    links: [
      { text: "Overview", href: "/product" },
      { text: "Pricing", href: "/pricing" },
      { text: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "/about" },
      { text: "Careers", href: "/careers" },
      { text: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Documentation", href: "/docs" },
      { text: "Blog", href: "/blog" },
      { text: "Changelog", href: "/changelog" },
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
 * FooterColumnsSocial — a multi-column utility footer where the social
 * presence gets first-class column space (handle-style cards, not just
 * icons). Sits on bg-base-200 by default for a quieter visual weight than
 * FooterMega's bg-neutral. No newsletter form — pair with a closing CTA
 * section above.
 */
export default function FooterColumnsSocial({
  logoText = "Your Company",
  tagline,
  navColumns = DEFAULT_NAV_COLUMNS,
  socialHandles = [],
  socialHeading = "Find us",
  companyName,
  legalLinks = [],
  regionLabel,
  className,
}: FooterColumnsSocialProps) {
  const cappedColumns = navColumns.slice(0, 4);
  const cappedHandles = socialHandles.slice(0, 6);
  const displayCompany = companyName ?? logoText;
  const showSocialColumn = cappedHandles.length > 0;

  return (
    <footer
      className={cn(
        "relative w-full border-t border-base-300 bg-base-200 text-base-content",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-10 pt-16 md:px-8 md:pt-20 lg:gap-16">
        {/* ---------- Top row: brand block + nav columns + social column ---------- */}
        <section
          aria-label="Sitemap"
          className={cn(
            "grid gap-10",
            "grid-cols-2",
            "sm:grid-cols-3",
            showSocialColumn
              ? "lg:grid-cols-[minmax(0,_1.4fr)_repeat(3,_minmax(0,_1fr))_minmax(0,_1.2fr)]"
              : "lg:grid-cols-[minmax(0,_1.4fr)_repeat(4,_minmax(0,_1fr))]",
          )}
        >
          {/* Brand block */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
            <span className="text-2xl font-semibold tracking-tight text-base-content">
              {logoText}
            </span>
            {tagline && (
              <p className="max-w-xs text-sm leading-relaxed text-base-content/65">
                {tagline}
              </p>
            )}
            {regionLabel && (
              <span className="inline-flex w-fit items-center rounded-full border border-base-300 bg-base-100 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-base-content/65">
                {regionLabel}
              </span>
            )}
          </div>

          {/* Nav columns */}
          {cappedColumns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="flex flex-col gap-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-base-content/85 transition-colors hover:text-base-content"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Social handle column */}
          {showSocialColumn && (
            <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/55">
                {socialHeading}
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {cappedHandles.map((handle) => {
                  const Icon = SOCIAL_ICONS[handle.network] ?? FaGlobe;
                  return (
                    <li key={handle.network}>
                      <a
                        href={handle.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={handle.label}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-3 py-2 transition-colors hover:border-base-content/30 hover:bg-base-100"
                      >
                        <span className="flex items-center gap-2.5 text-base-content/85">
                          <Icon className="h-4 w-4 text-base-content/65 transition-colors group-hover:text-base-content" />
                          <span className="font-medium">{handle.handle}</span>
                        </span>
                        <HiOutlineArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 -translate-y-px text-base-content/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:text-base-content/85"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* ---------- Bottom bar ---------- */}
        <section className="flex flex-col gap-4 border-t border-base-300 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <span className="text-base-content/65">
            &copy; {new Date().getFullYear()} {displayCompany}. All rights
            reserved.
          </span>

          {legalLinks.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    className="text-base-content/65 transition-colors hover:text-base-content"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </footer>
  );
}

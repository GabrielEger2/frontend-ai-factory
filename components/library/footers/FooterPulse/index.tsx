"use client";

import React, { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaGoogle,
  FaPinterest,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlineMap } from "react-icons/hi";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant } from "@ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FooterNavColumn {
  title: string;
  links: Array<{ text: string; href: string }>;
}

export interface FooterSocialLink {
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

export interface FooterPulseProps {
  /** Logo element (ReactNode — SVG, image, or text) */
  logo?: React.ReactNode;
  /** WhatsApp link (full wa.me URL with message) */
  whatsappUrl?: string;
  /** WhatsApp display text (e.g. "+55 11 99999-9999") */
  whatsappText?: string;
  /** Phone link (tel: format) */
  phoneUrl?: string;
  /** Phone display text */
  phoneText?: string;
  /** Email link (mailto: format with optional subject/body) */
  emailUrl?: string;
  /** Email display text — rendered as the large gradient hero of the footer */
  emailText?: string;
  /** Physical address text (supports line breaks via \n) */
  addressText?: string;
  /** Google Maps link for the address */
  addressMapsUrl?: string;
  /** Business hours text (e.g. "Mon–Fri 9am–6pm") */
  hoursText?: string;
  /** Navigation columns (max 4) */
  navColumns?: FooterNavColumn[];
  /** Social media links shown in the bottom bar */
  socialLinks?: FooterSocialLink[];
  /** Company name for copyright */
  companyName?: string;
  /** Optional CTA button label */
  ctaText?: string;
  /** CTA destination URL */
  ctaUrl?: string;
  /** CTA button style — "default" uses the standard filled button, others use animated variants */
  ctaStyle?: CtaVariant;
  /** Optional location label rendered above the live clock (e.g. "lisbon", "são paulo") */
  locationLabel?: string;
  /** IANA timezone for the live clock. Defaults to the visitor's locale. */
  timezone?: string;
  /** Tagline displayed under the logo (e.g. "studio · journal · interface · futures") */
  tagline?: string;
  /** Extra classes on the root element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_NAV_COLUMNS: FooterNavColumn[] = [
  {
    title: "Product",
    links: [
      { text: "Features", href: "/features" },
      { text: "Pricing", href: "/pricing" },
      { text: "Integrations", href: "/integrations" },
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
/*  Live clock — ticks every second, respects optional timezone        */
/* ------------------------------------------------------------------ */

function LiveClock({ timezone }: { timezone?: string }) {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const fmt = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: timezone,
        });
        setTime(formatter.format(new Date()));
      } catch {
        const d = new Date();
        const h = d.getHours().toString().padStart(2, "0");
        const m = d.getMinutes().toString().padStart(2, "0");
        const s = d.getSeconds().toString().padStart(2, "0");
        setTime(`${h}:${m}:${s}`);
      }
    };
    fmt();
    const iv = setInterval(fmt, 1000);
    return () => clearInterval(iv);
  }, [timezone]);

  return (
    <span className="font-mono text-3xl font-medium tracking-tight text-neutral-content md:text-4xl">
      {time}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FooterPulse({
  logo,
  whatsappUrl,
  whatsappText,
  phoneUrl,
  phoneText,
  emailUrl,
  emailText,
  addressText,
  addressMapsUrl,
  hoursText,
  navColumns = DEFAULT_NAV_COLUMNS,
  socialLinks = [],
  companyName = "Your Company",
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  locationLabel,
  timezone,
  tagline,
  className,
}: FooterPulseProps) {
  const showContact =
    whatsappUrl || phoneUrl || emailUrl || addressText || hoursText;

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-base-content/10 bg-neutral text-neutral-content",
        className,
      )}
    >
      {/* Subtle ambient gradient glow — matches the futuristic / glow palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(var(--color-primary)), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(var(--color-accent)), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20 lg:px-12 lg:pt-28">
        {/* ---------- Hero row: contact email + local time ---------- */}
        <div className="flex flex-col gap-12 border-b border-neutral-content/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
          {/* Left: contact + huge gradient email */}
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-content/50">
              Contact
            </p>
            {emailUrl && emailText ? (
              <a
                href={emailUrl}
                className="group inline-block bg-gradient-to-r from-neutral-content to-neutral-content bg-clip-text text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none tracking-tight text-transparent transition-[background-image] duration-500 hover:from-primary hover:via-secondary hover:to-accent"
              >
                {emailText}
              </a>
            ) : (
              <span className="block text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-none tracking-tight">
                {companyName}
              </span>
            )}

            {ctaText && ctaUrl && (
              <div className="pt-3">
                <CtaButton
                  variant={ctaStyle}
                  href={ctaUrl}
                  colorScheme="primary"
                  className="text-sm"
                >
                  {ctaText}
                </CtaButton>
              </div>
            )}
          </div>

          {/* Right: live clock */}
          <div className="space-y-3 lg:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-content/50">
              Local time{locationLabel ? ` · ${locationLabel}` : ""}
            </p>
            <LiveClock timezone={timezone} />
          </div>
        </div>

        {/* ---------- Mid row: brand block + nav columns ---------- */}
        <div className="grid gap-12 py-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          {/* Brand + secondary contact info */}
          <div className="max-w-md space-y-6">
            <div className="h-12">{logo}</div>

            {tagline && (
              <p className="text-sm text-neutral-content/60">{tagline}</p>
            )}

            {showContact && (
              <div className="space-y-3 text-sm">
                {(whatsappUrl || phoneUrl) && (
                  <div className="flex flex-wrap items-center gap-4">
                    {whatsappUrl && whatsappText && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        <span>{whatsappText}</span>
                      </a>
                    )}
                    {phoneUrl && phoneText && (
                      <a
                        href={phoneUrl}
                        className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                      >
                        <FaPhoneAlt className="h-4 w-4" />
                        <span>{phoneText}</span>
                      </a>
                    )}
                  </div>
                )}

                {emailUrl && emailText && (
                  <a
                    href={emailUrl}
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                    <HiOutlineMail className="h-4 w-4" />
                    <span>{emailText}</span>
                  </a>
                )}

                {addressMapsUrl && addressText && (
                  <a
                    href={addressMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 transition-opacity hover:opacity-80"
                  >
                    <HiOutlineMap className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="whitespace-pre-line">{addressText}</span>
                  </a>
                )}

                {hoursText && (
                  <p className="text-sm text-neutral-content/70">{hoursText}</p>
                )}
              </div>
            )}
          </div>

          {/* Nav columns */}
          {navColumns.length > 0 && (
            <nav
              className={cn(
                "grid gap-10 text-sm",
                navColumns.length === 1 && "grid-cols-1",
                navColumns.length === 2 && "grid-cols-2",
                navColumns.length === 3 && "grid-cols-2 md:grid-cols-3",
                navColumns.length >= 4 && "grid-cols-2 md:grid-cols-4",
              )}
              aria-label="Footer navigation"
            >
              {navColumns.map((column) => (
                <div key={column.title}>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-content/50">
                    {column.title}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.text}>
                        <a
                          href={link.href}
                          className="transition-opacity hover:opacity-75"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="flex flex-col gap-4 border-t border-neutral-content/10 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <span className="text-neutral-content/70">
            &copy; {new Date().getFullYear()} {companyName}.
          </span>

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
                    className="transition-opacity hover:opacity-70"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}

          <span className="text-neutral-content/50">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlineMap } from "react-icons/hi";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FooterNavColumn {
  /** Column heading */
  title: string;
  /** Links within this column */
  links: Array<{
    text: string;
    href: string;
  }>;
}

export interface FooterSocialLink {
  /** Social network name — determines which icon renders */
  network: "instagram" | "linkedin" | "facebook" | "whatsapp";
  /** Profile URL */
  url: string;
  /** Accessible label (e.g. "Instagram da Empresa X") */
  label: string;
}

export interface FooterRevealProps {
  /** Logo element (ReactNode — SVG, image, or text) */
  logo: React.ReactNode;
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
  /** Email display text */
  emailText?: string;
  /** Physical address text (supports line breaks via \n) */
  addressText?: string;
  /** Google Maps link for the address */
  addressMapsUrl?: string;
  /** Navigation columns (max 4) */
  navColumns: FooterNavColumn[];
  /** Social media links shown in the bottom bar */
  socialLinks: FooterSocialLink[];
  /** Company name for copyright */
  companyName: string;
  /** Footer height in pixels — controls the reveal viewport */
  height?: number;
  /** Extra classes on the root element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SOCIAL_ICONS: Record<
  FooterSocialLink["network"],
  React.ComponentType<{ className?: string }>
> = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FooterReveal({
  logo,
  whatsappUrl,
  whatsappText,
  phoneUrl,
  phoneText,
  emailUrl,
  emailText,
  addressText,
  addressMapsUrl,
  navColumns,
  socialLinks,
  companyName,
  height = 450,
  className,
}: FooterRevealProps) {
  return (
    <footer
      className={cn("relative", className)}
      style={{
        height: `${height}px`,
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
      }}
    >
      <div
        className="relative"
        style={{
          height: `calc(100vh + ${height}px)`,
          top: "-100vh",
        }}
      >
        <div
          className="sticky"
          style={{
            height: `${height}px`,
            top: `calc(100vh - ${height}px)`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden bg-neutral text-neutral-content">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-10 lg:px-12">
              {/* Top section — info + nav columns */}
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                {/* Logo + contact details */}
                <div className="max-w-md space-y-6">
                  <div className="h-12">{logo}</div>

                  <div className="space-y-3 text-sm">
                    {/* WhatsApp + Phone row */}
                    {(whatsappUrl || phoneUrl) && (
                      <div className="flex flex-wrap items-center gap-4">
                        {whatsappUrl && whatsappText && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                          >
                            <FaWhatsapp className="h-4 w-4" />
                            <span>{whatsappText}</span>
                          </a>
                        )}

                        {phoneUrl && phoneText && (
                          <a
                            href={phoneUrl}
                            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                          >
                            <FaPhoneAlt className="h-4 w-4" />
                            <span>{phoneText}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Email */}
                    {emailUrl && emailText && (
                      <a
                        href={emailUrl}
                        className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                      >
                        <HiOutlineMail className="h-4 w-4" />
                        <span>{emailText}</span>
                      </a>
                    )}

                    {/* Address */}
                    {addressMapsUrl && addressText && (
                      <a
                        href={addressMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-2 text-sm transition-opacity hover:opacity-80"
                      >
                        <HiOutlineMap className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="whitespace-pre-line">
                          {addressText}
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Navigation columns */}
                {navColumns.length > 0 && (
                  <nav
                    className={cn(
                      "grid w-full max-w-xl gap-10 text-sm",
                      navColumns.length === 1 && "grid-cols-1",
                      navColumns.length === 2 && "grid-cols-2",
                      navColumns.length === 3 && "grid-cols-2 md:grid-cols-3",
                      navColumns.length >= 4 && "grid-cols-2 md:grid-cols-4",
                    )}
                    aria-label="Footer navigation"
                  >
                    {navColumns.map((column) => (
                      <div key={column.title}>
                        <p className="font-medium">{column.title}</p>
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

              {/* Bottom bar — social icons + copyright */}
              <div className="mt-8 flex flex-col gap-4 border-t border-neutral-content/10 pt-5 text-xs md:flex-row md:items-center md:justify-between">
                {/* Social icons */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-4 text-lg">
                    {socialLinks.map((social) => {
                      const Icon = SOCIAL_ICONS[social.network];
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

                <p className="text-right text-[0.8rem] text-neutral-content/70">
                  &copy; {new Date().getFullYear()} {companyName}.
                  <br />
                  Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContactMapInfoProps {
  /** Section heading */
  headline: string;
  /** Supporting text */
  subheadline?: string;
  /** Full address text */
  address: string;
  /** Phone number */
  phone?: string;
  /** Email address */
  email?: string;
  /** Business hours description */
  hours?: string;
  /** Google Maps embed URL or coordinates */
  mapEmbedUrl?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactMapInfo({
  headline,
  subheadline,
  address,
  phone,
  email,
  hours,
  mapEmbedUrl,
  className,
}: ContactMapInfoProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
        {/* Info side */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 text-lg opacity-70">{subheadline}</p>
          )}
          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider opacity-50">
                Endereco
              </dt>
              <dd className="mt-1">{address}</dd>
            </div>
            {phone && (
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider opacity-50">
                  Telefone
                </dt>
                <dd className="mt-1">{phone}</dd>
              </div>
            )}
            {email && (
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider opacity-50">
                  E-mail
                </dt>
                <dd className="mt-1">{email}</dd>
              </div>
            )}
            {hours && (
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider opacity-50">
                  Horario
                </dt>
                <dd className="mt-1">{hours}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Map side */}
        <div className="min-h-[300px] overflow-hidden rounded-xl bg-base-200">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              title="Mapa"
            />
          ) : (
            <div className="flex h-full items-center justify-center opacity-40">
              Mapa
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

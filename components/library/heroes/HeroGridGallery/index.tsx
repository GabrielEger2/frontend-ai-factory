"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";
import { CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GalleryTile {
  image: string;
  imageAlt: string;
  /** Optional small caption rendered over the lower-left of the tile */
  caption?: string;
}

export interface HeroGridGalleryProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl?: string;
  ctaStyle?: CtaVariant;
  ctaColorScheme?: ColorScheme;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: CtaVariant;
  secondaryCtaColorScheme?: ColorScheme;
  /**
   * Bento-grid tiles. The first tile is the tall feature image; the next
   * three populate the surrounding asymmetric cells. Any extras are ignored.
   */
  tiles: GalleryTile[];
  /** Small accent label printed above the headline (e.g. issue #, season) */
  badge?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface TileImageProps {
  tile: GalleryTile;
  seed: string;
  w: number;
  h: number;
  className?: string;
}

function TileImage({ tile, seed, w, h, className }: TileImageProps) {
  const safe = useSafeImageSrc(tile.image, seed, w, h);
  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden bg-base-200",
        className,
      )}
    >
      <img
        src={safe.src}
        onError={safe.onError}
        alt={tile.imageAlt}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        loading="lazy"
      />
      {tile.caption && (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-neutral-content/20 bg-neutral/60 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-neutral-content backdrop-blur-sm">
          {tile.caption}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroGridGallery({
  eyebrow,
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  ctaStyle = "default",
  ctaColorScheme = "primary",
  secondaryCtaText,
  secondaryCtaUrl,
  secondaryCtaStyle = "drawOutline",
  secondaryCtaColorScheme = "primary",
  tiles,
  badge,
  className,
}: HeroGridGalleryProps) {
  const shouldReduceMotion = useReducedMotion();

  // Pad to 4 tiles if fewer were provided
  const safeTiles: GalleryTile[] = [...tiles];
  while (safeTiles.length < 4) {
    safeTiles.push({
      image: "",
      imageAlt: "Decorative gallery placeholder",
    });
  }

  return (
    <section
      className={cn(
        "flex min-h-screen w-full items-center overflow-hidden bg-base-100",
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-24">
        {/* -- Content column -- */}
        <motion.div
          className="flex flex-col justify-end lg:col-span-5"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {(eyebrow || badge) && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-6 flex items-center gap-3"
            >
              {badge && (
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {badge}
                </span>
              )}
              {eyebrow && (
                <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">
                  {eyebrow}
                </p>
              )}
            </motion.div>
          )}

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6 max-w-md text-base leading-relaxed text-base-content/70 md:text-lg"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <CtaButton
              variant={ctaStyle}
              colorScheme={ctaColorScheme}
              href={ctaUrl}
            >
              {ctaText}
            </CtaButton>
            {secondaryCtaText && (
              <CtaButton
                variant={secondaryCtaStyle}
                colorScheme={secondaryCtaColorScheme}
                href={secondaryCtaUrl}
              >
                {secondaryCtaText}
              </CtaButton>
            )}
          </motion.div>
        </motion.div>

        {/* -- Bento gallery -- */}
        <motion.div
          className="grid h-[480px] grid-cols-6 grid-rows-6 gap-3 md:h-[560px] md:gap-4 lg:col-span-7 lg:h-[640px]"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            className="col-span-4 row-span-6 overflow-hidden rounded-2xl"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TileImage
              tile={safeTiles[0]}
              seed="hero-grid-gallery-tile-0"
              w={800}
              h={1200}
            />
          </motion.div>

          <motion.div
            className="col-span-2 row-span-3 overflow-hidden rounded-2xl"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TileImage
              tile={safeTiles[1]}
              seed="hero-grid-gallery-tile-1"
              w={500}
              h={500}
            />
          </motion.div>

          <motion.div
            className="col-span-1 row-span-3 overflow-hidden rounded-2xl"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TileImage
              tile={safeTiles[2]}
              seed="hero-grid-gallery-tile-2"
              w={300}
              h={500}
            />
          </motion.div>

          <motion.div
            className="col-span-1 row-span-3 overflow-hidden rounded-2xl bg-primary/10"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <TileImage
              tile={safeTiles[3]}
              seed="hero-grid-gallery-tile-3"
              w={300}
              h={500}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

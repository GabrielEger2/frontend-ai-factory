"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { cn } from "@lib/utils";
import { useSafeImageSrc } from "@ui/useSafeImageSrc";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TeamCarouselMember {
  /** Full name */
  name: string;
  /** Role / title */
  role: string;
  /** Optional one-line teaser shown on the card */
  tagline?: string;
  /** Portrait image URL — falls back to seeded picsum */
  image?: string;
  /** Required alt text for the portrait */
  imageAlt?: string;
  /** Optional outbound link (LinkedIn, full bio, etc.) */
  href?: string;
  /** Optional small caption (department, location, years in role) */
  meta?: string;
}

export interface TeamCarouselProps {
  /** Eyebrow above the headline */
  eyebrow?: string;
  /** Section headline */
  headline: string;
  /** Supporting paragraph below the headline */
  description?: string;
  /** Members to render in the carousel — between 5 and 16 reads best */
  members: TeamCarouselMember[];
  /** Card width in pixels at desktop. Defaults to 320. */
  cardWidth?: number;
  /** Gap between cards in pixels. Defaults to 20. */
  cardGap?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface MemberCardProps {
  member: TeamCarouselMember;
  index: number;
  width: number;
}

function MemberCard({ member, index, width }: MemberCardProps) {
  const safe = useSafeImageSrc(
    member.image,
    `team-carousel-${index}-${member.name}`,
    640,
    800,
  );

  const Wrapper: any = member.href ? "a" : "div";
  const wrapperProps = member.href
    ? {
        href: member.href,
        "aria-label": `${member.name}, ${member.role}`,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={{ width }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-2xl bg-base-200 ring-1 ring-base-300 transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        member.href && "hover:-translate-y-1 hover:ring-primary/40",
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={safe.src}
          onError={safe.onError}
          alt={member.imageAlt ?? `${member.name}, ${member.role}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {member.meta && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-base-100/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-base-content/75 backdrop-blur-sm">
            {member.meta}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-base font-semibold tracking-tight text-base-content">
          {member.name}
        </h3>
        <p className="text-sm text-primary">{member.role}</p>
        {member.tagline && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-base-content/65">
            {member.tagline}
          </p>
        )}
      </div>
    </Wrapper>
  );
}

interface ArrowButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function ArrowButton({ direction, disabled, onClick }: ArrowButtonProps) {
  const Icon = direction === "prev" ? FiArrowLeft : FiArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous members" : "Next members"}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content transition-all duration-200",
        "hover:border-primary/50 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:opacity-40 disabled:hover:border-base-300 disabled:hover:text-base-content disabled:cursor-not-allowed",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TeamCarousel — horizontally-scrolling team cards with peek. Snaps to
 * each card on swipe, supports keyboard arrow keys, and exposes prev /
 * next buttons in the header. Cards are fixed-width with a 4:5 portrait
 * top and a small text block below.
 */
export default function TeamCarousel({
  eyebrow,
  headline,
  description,
  members,
  cardWidth = 320,
  cardGap = 20,
  className,
}: TeamCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const tolerance = 4;
    setCanPrev(el.scrollLeft > tolerance);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scrollByCard = useCallback(
    (direction: "prev" | "next") => {
      const el = trackRef.current;
      if (!el) return;
      const delta = (cardWidth + cardGap) * (direction === "next" ? 1 : -1);
      el.scrollBy({ left: delta, behavior: "smooth" });
    },
    [cardWidth, cardGap],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard("next");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard("prev");
      }
    },
    [scrollByCard],
  );

  return (
    <section
      className={cn("w-full bg-base-100 py-16 md:py-20 lg:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="flex max-w-2xl flex-col">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </p>
            )}
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-base-content sm:text-4xl md:text-5xl">
              {headline}
            </h2>
            {description && (
              <p className="mt-4 max-w-[55ch] text-base leading-relaxed text-base-content/65">
                {description}
              </p>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ArrowButton
              direction="prev"
              disabled={!canPrev}
              onClick={() => scrollByCard("prev")}
            />
            <ArrowButton
              direction="next"
              disabled={!canNext}
              onClick={() => scrollByCard("next")}
            />
          </div>
        </motion.div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Team members carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-300",
          "focus-visible:outline-none",
        )}
        style={{
          paddingLeft: "max(1rem, calc((100vw - 80rem) / 2 + 2rem))",
          paddingRight: "max(1rem, calc((100vw - 80rem) / 2 + 2rem))",
          gap: `${cardGap}px`,
        }}
      >
        {members.map((member, i) => (
          <div key={`${member.name}-${i}`} className="snap-start">
            <MemberCard member={member} index={i} width={cardWidth} />
          </div>
        ))}
      </div>

      {/* Mobile arrows — sit under the carousel */}
      <div className="mx-auto mt-6 flex max-w-7xl items-center gap-3 px-4 md:hidden">
        <ArrowButton
          direction="prev"
          disabled={!canPrev}
          onClick={() => scrollByCard("prev")}
        />
        <ArrowButton
          direction="next"
          disabled={!canNext}
          onClick={() => scrollByCard("next")}
        />
      </div>
    </section>
  );
}

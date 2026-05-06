import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import NavbarDock from "./index";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const StudioLogo = () => (
  <span className="font-serif text-lg font-semibold tracking-tight text-base-content">
    Estúdio Tavares
  </span>
);

const PhotographerLogo = () => (
  <span className="text-base font-medium tracking-[0.32em] text-base-content uppercase">
    Bianca Okazaki
  </span>
);

const ProductLogo = () => (
  <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-base-content">
    <span
      aria-hidden="true"
      className="block h-6 w-6 rounded-md bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
    />
    Mira
  </span>
);

/* ------------------------------------------------------------------ */
/*  Background scene — gives the dock something to float over          */
/* ------------------------------------------------------------------ */

function PreviewScene({
  variant,
  children,
}: {
  variant: "warm" | "cool" | "editorial" | "studio";
  children?: React.ReactNode;
}) {
  const palettes = {
    warm: "from-base-200 via-base-100 to-base-200",
    cool: "from-base-300 via-base-100 to-base-200",
    editorial: "from-base-100 via-base-200 to-base-300",
    studio: "from-base-200 via-base-100 to-base-100",
  } as const;

  return (
    <div
      className={`relative min-h-[140vh] bg-gradient-to-b ${palettes[variant]}`}
    >
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-40 lg:pt-48">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof NavbarDock> = {
  title: "Navigation/NavbarDock",
  component: NavbarDock,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: [
        "default",
        "slide",
        "dotExpand",
        "drawOutline",
        "glow",
        "arrow",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="relative">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavbarDock>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/**
 * Independent design studio in São Paulo. Five dock items, arrow CTA top-right,
 * editorial serif wordmark — the dock magnifies as the cursor approaches.
 */
export const DesignStudio: Story = {
  args: {
    logo: <StudioLogo />,
    ctaText: "Start a brief",
    ctaUrl: "#brief",
    ctaStyle: "arrow",
    links: [
      { text: "Studio", href: "/", icon: "home" },
      { text: "Work", href: "/work", icon: "work" },
      { text: "Projects", href: "/projects", icon: "projects" },
      { text: "Process", href: "/process", icon: "layers" },
      { text: "Contact", href: "#contact", icon: "contact" },
    ],
  },
  decorators: [
    (Story) => (
      <PreviewScene variant="warm">
        <Story />
        <h1 className="mt-12 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-base-content md:text-6xl">
          Brand systems for studios that think slowly and ship sharply.
        </h1>
        <p className="mt-6 max-w-xl text-base text-base-content/60 leading-relaxed">
          We work with 8–12 founders a year on identity, packaging, and digital
          surfaces. Hover the dock to feel its weight.
        </p>
      </PreviewScene>
    ),
  ],
};

/**
 * Photographer portfolio — minimal four-item dock, no CTA, sparse top-left
 * wordmark. The dock carries all interaction.
 */
export const PhotographerPortfolio: Story = {
  args: {
    logo: <PhotographerLogo />,
    links: [
      { text: "Index", href: "/", icon: "home" },
      { text: "Series", href: "/series", icon: "projects" },
      { text: "Editorial", href: "/editorial", icon: "layers" },
      { text: "Contact", href: "/contact", icon: "contact" },
    ],
  },
  decorators: [
    (Story) => (
      <PreviewScene variant="editorial">
        <Story />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/okazaki-1/720/900"
            alt="Editorial portrait, Tokyo, 2024"
            className="aspect-[4/5] w-full rounded-md object-cover"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/okazaki-2/720/900"
            alt="Editorial portrait, Lisbon, 2024"
            className="aspect-[4/5] w-full rounded-md object-cover md:translate-y-12"
          />
        </div>
      </PreviewScene>
    ),
  ],
};

/**
 * Mira — premium AI scheduling app. Three dock items, glow CTA — short
 * marketing site where the dock points to the few destinations that matter.
 */
export const ProductLanding: Story = {
  args: {
    logo: <ProductLogo />,
    ctaText: "Open Mira",
    ctaUrl: "/app",
    ctaStyle: "glow",
    links: [
      { text: "Overview", href: "/", icon: "home" },
      { text: "Features", href: "/features", icon: "layers" },
      { text: "Changelog", href: "/changelog", icon: "projects" },
      { text: "Support", href: "/support", icon: "contact" },
    ],
  },
  decorators: [
    (Story) => (
      <PreviewScene variant="cool">
        <Story />
        <h1 className="mt-12 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-base-content md:text-6xl">
          Mira reads your inbox so your calendar stops fighting back.
        </h1>
        <p className="mt-6 max-w-xl text-base text-base-content/60 leading-relaxed">
          Drafts replies, holds focus blocks, and surfaces what actually
          matters. Currently scheduling for 4,238 teams.
        </p>
      </PreviewScene>
    ),
  ],
};

/**
 * Freelance illustrator — five dock items, slide CTA, playful layout to
 * showcase the dock against denser background art.
 */
export const FreelanceIllustrator: Story = {
  args: {
    logo: (
      <span className="text-base font-bold tracking-tight text-base-content">
        Rafael Tavares
        <span className="ml-1.5 text-base-content/40">illustration</span>
      </span>
    ),
    ctaText: "Commission",
    ctaUrl: "#commission",
    ctaStyle: "slide",
    links: [
      { text: "Home", href: "/", icon: "home" },
      { text: "Sketchbook", href: "/sketchbook", icon: "projects" },
      { text: "Commissions", href: "/commissions", icon: "briefcase" },
      { text: "About", href: "/about", icon: "about" },
      { text: "Contact", href: "#contact", icon: "contact" },
    ],
  },
  decorators: [
    (Story) => (
      <PreviewScene variant="studio">
        <Story />
        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={n}
              src={`https://picsum.photos/seed/tavares-${n}/400/500`}
              alt={`Sketch ${n}`}
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
          ))}
        </div>
      </PreviewScene>
    ),
  ],
};

/**
 * Boutique consultancy — minimal dock with three items, drawOutline CTA,
 * focus on a single editorial statement above the fold.
 */
export const BoutiqueConsultancy: Story = {
  args: {
    logo: (
      <span className="font-serif text-lg italic text-base-content">
        Cordilheira &amp; Co.
      </span>
    ),
    ctaText: "Book a call",
    ctaUrl: "#book",
    ctaStyle: "drawOutline",
    links: [
      { text: "Practice", href: "/", icon: "home" },
      { text: "Engagements", href: "/engagements", icon: "briefcase" },
      { text: "Notes", href: "/notes", icon: "layers" },
      { text: "Contact", href: "#contact", icon: "contact" },
    ],
  },
  decorators: [
    (Story) => (
      <PreviewScene variant="warm">
        <Story />
        <p className="mt-12 max-w-xs text-xs font-semibold uppercase tracking-[0.22em] text-base-content/50">
          Strategy, narrative, GTM
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[1.04] text-base-content md:text-6xl">
          We work with founders writing the second chapter of a hard-won
          company.
        </h1>
      </PreviewScene>
    ),
  ],
};

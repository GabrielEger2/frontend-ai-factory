import type { Meta, StoryObj } from "@storybook/react";
import FeaturesCards from "./index";

const meta: Meta<typeof FeaturesCards> = {
  title: "Layouts/FeaturesCards",
  component: FeaturesCards,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    cardStyle: {
      control: "select",
      options: [
        "base",
        "flip",
        "reveal",
        "magic-gradient",
        "magic-orb",
        "product",
        "outline",
      ],
    },
    columns: {
      control: "select",
      options: [2, 3, 4],
    },
    flipDirection: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof FeaturesCards>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Digital agency — base cards showcasing core services with CTAs */
export const DigitalAgency: Story = {
  args: {
    headline: "What We Do Best",
    subheadline:
      "Full-service digital solutions that turn ambitious ideas into products people love.",
    cardStyle: "base",
    columns: 3,
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt: "Designer sketching wireframes on a tablet with a stylus pen",
        title: "Product Design",
        description:
          "From user research to high-fidelity prototypes, we design interfaces that feel intuitive from the first tap.",
        ctaText: "See our process",
        ctaUrl: "/services/design",
        badge: "Popular",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Lines of TypeScript code on a dark IDE with syntax highlighting",
        title: "Web Development",
        description:
          "Performant web applications built with Next.js, TypeScript, and serverless infrastructure that scales automatically.",
        ctaText: "View stack",
        ctaUrl: "/services/development",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Marketing dashboard showing conversion funnels and traffic sources",
        title: "Growth Strategy",
        description:
          "Data-driven SEO, content marketing, and conversion optimization that compound month over month.",
        ctaText: "Read case studies",
        ctaUrl: "/services/growth",
      },
    ],
  },
};

/** Consulting firm — flip cards revealing detailed offerings on hover */
export const ConsultingFlipCards: Story = {
  args: {
    headline: "Our Advisory Practice",
    subheadline:
      "Hover over each card to discover how we help organizations transform.",
    cardStyle: "flip",
    columns: 3,
    flipDirection: "horizontal",
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt: "Executive team reviewing a strategic roadmap in a boardroom",
        title: "Strategy Consulting",
        description:
          "Market analysis and competitive positioning for mid-size enterprises.",
        backTitle: "Deep Market Insight",
        backDescription:
          "We analyze 200+ data points per engagement to identify the three moves that will shift your market position within 18 months.",
        backCtaText: "Book a session",
        backCtaUrl: "/contact",
        badge: "Featured",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Operations floor with automated assembly line and monitoring screens",
        title: "Operations",
        description:
          "Process optimization that removes bottlenecks and reduces operational costs.",
        backTitle: "Lean Transformation",
        backDescription:
          "Our operational audits have saved clients an average of 23% in overhead costs within the first year of implementation.",
        backCtaText: "See results",
        backCtaUrl: "/case-studies/operations",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Team workshop with sticky notes on a glass wall mapping out digital transformation stages",
        title: "Digital Transformation",
        description:
          "End-to-end modernization from legacy systems to cloud-native architecture.",
        backTitle: "Future-Ready Systems",
        backDescription:
          "We migrate monoliths to microservices, train your team, and stay on as advisors until the new architecture is self-sustaining.",
        backCtaText: "Start assessment",
        backCtaUrl: "/contact",
      },
    ],
  },
};

/** Architecture portfolio — reveal cards that slide to show project details */
export const ArchitectureReveal: Story = {
  args: {
    headline: "Selected Projects",
    subheadline: "Hover to explore the story behind each structure.",
    cardStyle: "reveal",
    columns: 3,
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Modern glass-and-steel office tower reflecting sunset clouds",
        title: "Skyline Tower",
        description:
          "A 42-story commercial hub with integrated green terraces on every fifth floor.",
        ctaText: "Details",
        ctaUrl: "/projects/skyline-tower",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Residential complex with warm wood cladding and large balconies surrounded by trees",
        title: "Cedar Residences",
        description:
          "Sixty sustainable apartments designed around a central courtyard garden.",
        ctaText: "Details",
        ctaUrl: "/projects/cedar-residences",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Public library with curved concrete roof and floor-to-ceiling glass walls",
        title: "Civic Library",
        description:
          "Award-winning public space blending brutalist structure with natural light.",
        ctaText: "Details",
        ctaUrl: "/projects/civic-library",
      },
    ],
  },
};

/** SaaS features — magic gradient border cards highlighting product capabilities */
export const SaasMagicGradient: Story = {
  args: {
    headline: "Built for Speed and Scale",
    subheadline:
      "Every feature is designed to help your team ship faster without sacrificing quality.",
    cardStyle: "magic-gradient",
    columns: 3,
    cards: [
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Real-time collaboration interface with multiple cursors editing a document",
        title: "Real-Time Collaboration",
        description:
          "See changes as they happen. Conflict-free editing with presence indicators and cursor tracking across your entire workspace.",
        ctaText: "Try it live",
        ctaUrl: "/features/collaboration",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "CI/CD pipeline dashboard showing green build statuses and deployment history",
        title: "One-Click Deploy",
        description:
          "Push to production with confidence. Automated previews, rollback in seconds, and zero-downtime deployments built in.",
        ctaText: "See how",
        ctaUrl: "/features/deploy",
        badge: "New",
      },
      {
        image: "https://placehold.co/600x400",
        imageAlt:
          "Analytics chart showing uptime percentage at 99.99% with a world map of edge locations",
        title: "Global Edge Network",
        description:
          "Content served from 200+ edge locations worldwide. Sub-50ms response times for 95% of your users, regardless of geography.",
        ctaText: "View network",
        ctaUrl: "/features/edge",
      },
    ],
  },
};

/** E-commerce storefront — product cards with pricing, ratings, and cart actions */
export const EcommerceProducts: Story = {
  args: {
    headline: "Trending This Week",
    subheadline: "Our most popular picks, hand-selected by the editorial team.",
    cardStyle: "product",
    columns: 4,
    cards: [
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Minimalist ceramic desk lamp with matte white finish",
        title: "Arc Desk Lamp",
        price: 89,
        originalPrice: 129,
        rating: 4.7,
        badge: "Sale",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt: "Leather-bound notebook with brass clasp and cream pages",
        title: "Heritage Journal",
        price: 45,
        rating: 4.9,
        badge: "New",
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Wireless over-ear headphones in matte black with copper accents",
        title: "Studio Monitor Pro",
        price: 249,
        originalPrice: 299,
        rating: 4.5,
      },
      {
        image: "https://placehold.co/400x400",
        imageAlt:
          "Hand-poured soy candle in an amber glass jar with a wooden lid",
        title: "Cedarwood Candle",
        price: 32,
        rating: 4.8,
      },
    ],
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import HeroParallaxImages from "./index";

const meta: Meta<typeof HeroParallaxImages> = {
  title: "Heroes/HeroParallaxImages",
  component: HeroParallaxImages,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    scrollHeight: {
      control: { type: "range", min: 800, max: 3000, step: 100 },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="min-h-[50vh] bg-base-200" />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof HeroParallaxImages>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Photography studio — editorial feel, 6 portfolio images, glow CTA */
export const PhotographyStudio: Story = {
  args: {
    headline: "Every frame tells a story",
    subheadline:
      "Award-winning photography for brands that refuse to blend in. From editorial campaigns to product launches, we capture what matters.",
    ctaText: "View Portfolio",
    ctaUrl: "/portfolio",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    secondaryCtaText: "Book a Session",
    secondaryCtaUrl: "/contact",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    centerImage: "https://placehold.co/1600x900",
    centerImageAlt:
      "Dramatic studio portrait with moody lighting and smoke effects",
    parallaxImages: [
      {
        src: "https://placehold.co/600x400",
        alt: "Fashion editorial shoot in natural daylight studio",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
      },
      {
        src: "https://placehold.co/800x500",
        alt: "Product photography of luxury watch on marble surface",
        start: 200,
        end: -250,
        widthClass: "w-2/3",
        alignClass: "mx-auto",
      },
      {
        src: "https://placehold.co/600x400",
        alt: "Aerial landscape shot of coastal cliffs at golden hour",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
        alignClass: "ml-auto",
      },
      {
        src: "https://placehold.co/700x450",
        alt: "Behind-the-scenes of a commercial video production set",
        start: 0,
        end: -500,
        widthClass: "w-5/12",
        alignClass: "ml-24",
      },
      {
        src: "https://placehold.co/500x350",
        alt: "Black and white street photography in downtown Tokyo",
        start: -150,
        end: 300,
        widthClass: "w-1/4",
      },
      {
        src: "https://placehold.co/700x400",
        alt: "Corporate headshot session with executive team",
        start: 100,
        end: -200,
        widthClass: "w-1/2",
        alignClass: "mx-auto",
      },
    ],
  },
};

/** Real estate developer — property showcase, typewriter headline, slide CTA */
export const RealEstateDeveloper: Story = {
  args: {
    headline: "Luxury living in",
    headlineRotatingWords: [
      "Balneario Camboriu",
      "Florianopolis",
      "Curitiba",
      "Porto Alegre",
    ],
    subheadline:
      "Premium residential developments with ocean views, rooftop pools, and smart home integration. Over 2,000 units delivered since 2015.",
    ctaText: "Explore Projects",
    ctaUrl: "/projects",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    secondaryCtaText: "Schedule a Visit",
    secondaryCtaUrl: "/schedule",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "primary",
    centerImage: "https://placehold.co/1600x900",
    centerImageAlt:
      "Aerial view of a modern beachfront high-rise residential tower at sunset",
    parallaxImages: [
      {
        src: "https://placehold.co/600x400",
        alt: "Infinity pool overlooking the ocean on a rooftop terrace",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
      },
      {
        src: "https://placehold.co/800x500",
        alt: "Open-concept living room with floor-to-ceiling windows and ocean view",
        start: 200,
        end: -250,
        widthClass: "w-2/3",
        alignClass: "mx-auto",
      },
      {
        src: "https://placehold.co/600x400",
        alt: "Modern kitchen with marble countertops and integrated appliances",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
        alignClass: "ml-auto",
      },
      {
        src: "https://placehold.co/700x450",
        alt: "Landscaped garden path leading to a private beach access",
        start: 0,
        end: -500,
        widthClass: "w-5/12",
        alignClass: "ml-24",
      },
    ],
  },
};

/** Travel agency — adventurous, 5 destination images, dotExpand CTA */
export const TravelAgency: Story = {
  args: {
    headline: "Destinations that change you",
    subheadline:
      "Curated travel experiences across 40+ countries. From Patagonian glaciers to Japanese temples, we design journeys that go beyond tourism.",
    ctaText: "Plan Your Trip",
    ctaUrl: "/destinations",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    centerImage: "https://placehold.co/1600x900",
    centerImageAlt:
      "Panoramic view of a mountain range reflected in a crystal-clear alpine lake",
    parallaxImages: [
      {
        src: "https://placehold.co/600x400",
        alt: "Traveler standing at the edge of a Norwegian fjord at sunrise",
        start: -180,
        end: 220,
        widthClass: "w-1/3",
      },
      {
        src: "https://placehold.co/800x500",
        alt: "Traditional wooden boat navigating turquoise waters in Thailand",
        start: 150,
        end: -300,
        widthClass: "w-2/3",
        alignClass: "mx-auto",
      },
      {
        src: "https://placehold.co/500x350",
        alt: "Hot air balloons floating over Cappadocia rock formations at dawn",
        start: -200,
        end: 200,
        widthClass: "w-5/12",
        alignClass: "ml-auto",
      },
      {
        src: "https://placehold.co/600x400",
        alt: "Ancient temple ruins surrounded by jungle canopy in Cambodia",
        start: 50,
        end: -400,
        widthClass: "w-1/3",
        alignClass: "ml-16",
      },
      {
        src: "https://placehold.co/700x450",
        alt: "Northern lights dancing over a remote Icelandic landscape",
        start: -100,
        end: 150,
        widthClass: "w-1/2",
        alignClass: "mx-auto",
      },
    ],
    scrollHeight: 1800,
  },
};

/** Construction company — industrial, bold, fewer images, default CTA */
export const ConstructionCompany: Story = {
  args: {
    headline: "Building the future, one structure at a time",
    subheadline:
      "Commercial and industrial construction with 30 years of experience. ISO 9001 certified, on-time delivery guaranteed.",
    ctaText: "Request a Quote",
    ctaUrl: "/quote",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    centerImage: "https://placehold.co/1600x900",
    centerImageAlt:
      "Aerial view of a large-scale commercial construction site with cranes and steel framework",
    parallaxImages: [
      {
        src: "https://placehold.co/600x400",
        alt: "Completed modern office building with glass curtain wall facade",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
      },
      {
        src: "https://placehold.co/800x500",
        alt: "Engineering team reviewing blueprints at a construction site",
        start: 200,
        end: -250,
        widthClass: "w-2/3",
        alignClass: "mx-auto",
      },
      {
        src: "https://placehold.co/600x400",
        alt: "Industrial warehouse with steel structure during final assembly",
        start: -200,
        end: 200,
        widthClass: "w-1/3",
        alignClass: "ml-auto",
      },
    ],
    scrollHeight: 1200,
  },
};

/** Creative agency — playful, many images, typewriter, glow CTA */
export const CreativeAgency: Story = {
  args: {
    headline: "We make brands",
    headlineRotatingWords: ["unforgettable", "bold", "iconic", "magnetic"],
    subheadline:
      "Full-service creative agency specializing in branding, digital campaigns, and experiential marketing. Clients include Nike, Spotify, and Nubank.",
    ctaText: "See Our Work",
    ctaUrl: "/work",
    ctaStyle: "glow",
    ctaColorScheme: "accent",
    secondaryCtaText: "Start a Project",
    secondaryCtaUrl: "/contact",
    secondaryCtaStyle: "slide",
    secondaryCtaColorScheme: "primary",
    centerImage: "https://placehold.co/1600x900",
    centerImageAlt:
      "Vibrant abstract mural on the exterior wall of a creative studio space",
    parallaxImages: [
      {
        src: "https://placehold.co/600x400",
        alt: "Brand identity design spread with logo variations and color swatches",
        start: -220,
        end: 180,
        widthClass: "w-1/3",
      },
      {
        src: "https://placehold.co/800x500",
        alt: "Interactive digital installation at a product launch event",
        start: 180,
        end: -280,
        widthClass: "w-2/3",
        alignClass: "mx-auto",
      },
      {
        src: "https://placehold.co/500x350",
        alt: "Social media campaign mockups displayed on multiple smartphone screens",
        start: -180,
        end: 250,
        widthClass: "w-1/3",
        alignClass: "ml-auto",
      },
      {
        src: "https://placehold.co/600x400",
        alt: "Motion graphics reel playing on a large monitor in a dark editing suite",
        start: 0,
        end: -450,
        widthClass: "w-5/12",
        alignClass: "ml-24",
      },
      {
        src: "https://placehold.co/500x350",
        alt: "Packaging design prototypes for an organic skincare line",
        start: -120,
        end: 200,
        widthClass: "w-1/4",
      },
      {
        src: "https://placehold.co/700x400",
        alt: "Creative team brainstorming around a whiteboard covered in sketches",
        start: 80,
        end: -180,
        widthClass: "w-1/2",
        alignClass: "mx-auto",
      },
    ],
    scrollHeight: 2000,
  },
};

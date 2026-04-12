import type { Meta, StoryObj } from "@storybook/react";
import ContentAuthorSplit from "./index";

const meta: Meta<typeof ContentAuthorSplit> = {
  title: "Layouts/ContentAuthorSplit",
  component: ContentAuthorSplit,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof ContentAuthorSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Startup founder about page — personal story with CTA */
export const StartupFounder: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Open-plan office with developers working at standing desks",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt: "Portrait of a smiling founder in casual attire",
    authorName: "Lucas Ferreira",
    authorTagline:
      "Co-founder and CEO of Trellis, helping small businesses automate their workflows since 2019.",
    description:
      "I started Trellis after watching my parents spend every Sunday evening reconciling invoices by hand at their bakery. They had the talent and the customers, but the back-office work was grinding them down. Our first prototype replaced four spreadsheets with a single dashboard. Today we serve twelve thousand small businesses across Latin America, and every product decision still starts with the same question: would this save my parents an hour this week?",
    ctaText: "Read Our Story",
    ctaUrl: "/about",
  },
};

/** Chef and restaurant owner — culinary profile */
export const ChefProfile: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Elegant restaurant interior with warm lighting and white tablecloths",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt:
      "Chef in white coat plating a dish in a professional kitchen",
    authorName: "Isabella Monteiro",
    authorTagline:
      "Executive Chef at Olea. Two Michelin stars. Advocate for sustainable coastal cuisine.",
    description:
      "Growing up on the Algarve coast, I learned to cook from fishermen, not textbooks. The sea dictates the menu here — if the catch changes, so does the tasting course. We work with six family-run boats that practice line-and-hook fishing, and every vegetable comes from our rooftop garden or farms within thirty kilometers. Cooking, for me, is an act of preservation: of flavor, of tradition, and of the ecosystems that make both possible.",
    ctaText: "View the Menu",
    ctaUrl: "/menu",
  },
};

/** Creative director — portfolio intro */
export const CreativeDirector: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Design studio wall covered in mood boards, color swatches, and typography samples",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt: "Designer leaning against a desk holding a sketchbook",
    authorName: "Andre Nakamura",
    authorTagline:
      "Creative Director at Forma Studio. Fifteen years shaping brand identities for consumer technology.",
    description:
      "I believe the best brand work disappears into the product. When someone opens an app and it just feels right — the spacing, the motion, the tone of every micro-copy string — that is design doing its job. My team and I have built visual systems for products used by fifty million people, and our process always begins the same way: we listen until we understand the problem better than the client, and then we design the simplest thing that solves it.",
  },
};

/** Nonprofit executive director — mission-driven profile */
export const NonprofitDirector: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Volunteers planting trees along a riverbank on a sunny morning",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt:
      "Woman in field clothes smiling with a reforestation site behind her",
    authorName: "Mariana Vasconcelos",
    authorTagline:
      "Executive Director of Raizes Verdes. Leading reforestation efforts in the Atlantic Forest since 2012.",
    description:
      "The Atlantic Forest once stretched across 1.3 million square kilometers. Today, less than twelve percent remains. Our organization has planted over two million native seedlings across degraded areas in Minas Gerais and Bahia, partnering with local farming cooperatives who benefit from improved soil health and water retention. Every tree we plant is GPS-tagged and monitored for five years. Transparency is not optional when you are asking people to invest in a future they may never personally see.",
    ctaText: "Support Our Mission",
    ctaUrl: "/donate",
  },
};

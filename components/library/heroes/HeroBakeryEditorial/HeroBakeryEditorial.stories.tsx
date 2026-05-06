import type { Meta, StoryObj } from "@storybook/react";
import HeroBakeryEditorial from "./index";

const meta: Meta<typeof HeroBakeryEditorial> = {
  title: "Heroes/HeroBakeryEditorial",
  component: HeroBakeryEditorial,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof HeroBakeryEditorial>;

/** Artisan sourdough bakery — flagship loaf, plain trailing line. */
export const ArtisanBakery: Story = {
  args: {
    badge: "Neighborhood Bakery · Hayes Valley",
    headlineLeading: "Long-fermented",
    headlineAccent: "sourdough",
    headlineTrailing: "pulled from the oven before sunrise.",
    lead: "A 14-year-old levain, organic flour from a single Sonoma mill, and a wood-fired oven that runs Wednesday through Sunday. Pre-orders close Thursday at 6pm.",
    primaryCtaText: "Reserve a loaf",
    primaryCtaUrl: "#reserve",
    secondaryCtaText: "Visit the bakery",
    secondaryCtaUrl: "#about",
    productImage: "https://placehold.co/1080x1080",
    productImageAlt:
      "Loaf of dark-crust sourdough resting on a flour-dusted linen cloth",
    stampText: "EST. 2011 · WOOD-FIRED OVEN · ",
  },
};

/** Specialty coffee roaster — typewriter rotating brew styles. */
export const CoffeeRoaster: Story = {
  args: {
    badge: "Single-Origin · Small-Lot Roaster",
    headlineLeading: "Coffee that",
    headlineAccent: "remembers",
    headlineTrailing: [
      "where it grew.",
      "who picked it.",
      "the season it bloomed.",
      "the altitude it survived.",
    ],
    lead: "Seven farms across Huehuetenango and the Mantiqueira range. Roasted Tuesdays, shipped Wednesdays, and brewed at home by 3,847 subscribers.",
    primaryCtaText: "Shop microlots",
    primaryCtaUrl: "#shop",
    secondaryCtaText: "How the subscription works",
    secondaryCtaUrl: "#subscription",
    productImage: "https://placehold.co/1080x1080",
    productImageAlt:
      "Hand pouring water from a gooseneck kettle into a V60 dripper",
    stampText: "ROASTED IN BATCHES · LOT 047 · ",
  },
};

/** French patisserie — sunday-pastry positioning. */
export const FrenchPatisserie: Story = {
  args: {
    badge: "French Patisserie · Mission District",
    headlineLeading: "Sunday pastries,",
    headlineAccent: "every",
    headlineTrailing: "day of the week.",
    lead: "A rotating menu of six desserts, croissants laminated across three days, and the tarte Tatin that earned chef Mariana Cardoso her invitation to Le Cordon Bleu.",
    primaryCtaText: "Order a dessert",
    primaryCtaUrl: "#order",
    secondaryCtaText: "This month's menu",
    secondaryCtaUrl: "#menu",
    productImage: "https://placehold.co/1080x1080",
    productImageAlt:
      "Sliced apple tarte Tatin glazed with caramel on a vintage ceramic plate",
    stampText: "MAISON CARDOSO · PETITS LOTS · ",
  },
};

/** Direct-import olive oil deli — narrative trailing line. */
export const OliveOilDeli: Story = {
  args: {
    badge: "Pantry · Direct from the Producer",
    headlineLeading: "Extra virgin oil from the",
    headlineAccent: "first",
    headlineTrailing: "press of the October harvest.",
    lead: "Twenty-three growers across Trás-os-Montes and Alentejo. Numbered bottles, a tasting card with each shipment, and 48-hour delivery anywhere in the country.",
    primaryCtaText: "Order a bottle",
    primaryCtaUrl: "#order",
    secondaryCtaText: "Find a stockist",
    secondaryCtaUrl: "#stockists",
    productImage: "https://placehold.co/1080x1080",
    productImageAlt:
      "Dark glass bottle of extra virgin olive oil beside a sprig of rosemary",
    stampText: "COLD-PRESSED · 2025 HARVEST · ",
  },
};

/** Small-batch cookie & granola subscription — rotating product types. */
export const SmallBatchCookies: Story = {
  args: {
    badge: "Home Oven · Same-Day Delivery",
    headlineLeading: "Cookies, granolas, and",
    headlineAccent: "shortbread",
    headlineTrailing: [
      "made by hand.",
      "without refined sugar.",
      "with 70% dark chocolate.",
      "for the recurring box.",
    ],
    lead: "Recipes from Bianca Okazaki, who left her corporate job in 2019 to bake out of a 12-square-meter kitchen. Returnable packaging and a six-flavor monthly box.",
    primaryCtaText: "Build my box",
    primaryCtaUrl: "#box",
    secondaryCtaText: "Read the story",
    secondaryCtaUrl: "#story",
    productImage: "https://placehold.co/1080x1080",
    productImageAlt:
      "Stack of dark chocolate cookies on parchment paper with scattered oat flakes",
    stampText: "SUBSCRIBE · 6 FLAVORS A MONTH · ",
  },
};

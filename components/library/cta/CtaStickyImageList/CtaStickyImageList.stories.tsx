import type { Meta, StoryObj } from "@storybook/react";
import CtaStickyImageList from "./index";

const meta: Meta<typeof CtaStickyImageList> = {
  title: "CTA/CtaStickyImageList",
  component: CtaStickyImageList,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
    imageSide: {
      control: "select",
      options: ["left", "right"],
    },
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
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
  /* The whole point of this section is sticky-as-you-scroll behavior, so
     the story decorator pads above and below to give Storybook real scroll
     room — without it the sticky behavior never engages. */
  decorators: [
    (Story) => (
      <div>
        <div className="bg-base-200 px-6 py-12 text-sm text-base-content/60">
          Scroll past this banner to see the sticky image hold while the right
          column scrolls.
        </div>
        <Story />
        <div className="min-h-[60vh] bg-base-200 px-6 py-12 text-sm text-base-content/60">
          End of section — the footer CTA above sits below the sticky split.
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CtaStickyImageList>;

/* ------------------------------------------------------------------ */
/*  Boutique hospitality — the canonical editorial use                  */
/* ------------------------------------------------------------------ */

export const HotelCollection: Story = {
  args: {
    eyebrow: "Four houses, one keyholder",
    headline: "Stay where the kitchen knows your name",
    subheadline:
      "Four small hotels under thirty rooms each, run by the same family in the same coastal stretch since 1998. Pick a house, write us, we hold the key.",
    items: [
      {
        eyebrow: "Twelve rooms · Búzios",
        title: "Casa do Pontal",
        description:
          "A reformed fisherman's house above Praia da Foca, two minutes' walk from the cove. Breakfast on the rooftop, dinner three nights a week with the chef from Rio.",
        ctaText: "See the rooms",
        ctaUrl: "#pontal",
        image: "https://picsum.photos/seed/hotel-pontal-room/960/1200",
        imageAlt:
          "Whitewashed bedroom with linen curtains opening to a tiled balcony at sunset",
      },
      {
        eyebrow: "Eight rooms · Trancoso",
        title: "Pousada Quadrado",
        description:
          "On the green square, behind the painted facade, eight rooms organised around a quiet lap pool. Closer to the church than to the beach — by design.",
        ctaText: "See the rooms",
        ctaUrl: "#quadrado",
        image: "https://picsum.photos/seed/hotel-quadrado-pool/960/1200",
        imageAlt:
          "Long lap pool framed by colourful colonial facades in late afternoon light",
      },
      {
        eyebrow: "Eighteen rooms · Paraty",
        title: "Hotel Aurora",
        description:
          "An 1840s cocoa merchant's residence with the original tile floors intact. Long wooden corridors, deep window seats, and a courtyard that catches the rain.",
        ctaText: "See the rooms",
        ctaUrl: "#aurora",
        image: "https://picsum.photos/seed/hotel-aurora-corridor/960/1200",
        imageAlt:
          "Long colonial-era corridor with hand-painted tile floor and tall shuttered doors",
      },
      {
        eyebrow: "Twenty-four rooms · Ilhabela",
        title: "Casa da Mata",
        description:
          "On the wilder side of the island, past the last paved road. Open-air showers, a path down to a private beach, and a saltwater pool that looks west.",
        ctaText: "See the rooms",
        ctaUrl: "#mata",
        image: "https://picsum.photos/seed/hotel-mata-pool/960/1200",
        imageAlt:
          "Saltwater infinity pool overlooking forested coastline with no other buildings in view",
      },
      {
        eyebrow: "Six rooms · Cunha",
        title: "Refúgio Serra",
        description:
          "Up in the cool hills two hours inland — wood-burning stoves in every room, six guests at most, and a Sunday lunch that runs four hours.",
        ctaText: "See the rooms",
        ctaUrl: "#serra",
        image: "https://picsum.photos/seed/hotel-serra-fireplace/960/1200",
        imageAlt:
          "Stone fireplace lit at dusk in a timber-walled mountain lodge sitting room",
      },
    ],
    ctaText: "Write the keyholder",
    ctaUrl: "#contact",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    imageSide: "left",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Architecture studio — image on the right, dark slab                 */
/* ------------------------------------------------------------------ */

export const ArchitectureChapters: Story = {
  args: {
    eyebrow: "Practice",
    headline: "Five chapters of a fifteen-year practice",
    subheadline:
      "We take six new commissions a year. Below: the kinds of work the studio actually ships, with one representative project per chapter.",
    items: [
      {
        index: "01",
        eyebrow: "Residential",
        title: "A house above a quarry",
        description:
          "Three-bedroom cantilever in cor-ten and pine, sited on the lip of a disused granite quarry outside Mariana. Built in 14 months on a fixed-price contract.",
        ctaText: "Open the project",
        ctaUrl: "#quarry-house",
        image: "https://picsum.photos/seed/arch-cantilever/960/1200",
        imageAlt:
          "Cantilevered timber and steel house projecting over a rock face at twilight",
      },
      {
        index: "02",
        eyebrow: "Civic",
        title: "A library that closes the square",
        description:
          "Eight thousand square feet of community library replacing a parking lot in the historic centre. Compressed-earth walls, structural timber roof, no air conditioning.",
        ctaText: "Open the project",
        ctaUrl: "#library",
        image: "https://picsum.photos/seed/arch-library-interior/960/1200",
        imageAlt:
          "Double-height library reading room with timber roof beams and tall shelving",
      },
      {
        index: "03",
        eyebrow: "Hospitality",
        title: "Twelve rooms above a bakery",
        description:
          "A ground-floor bakery with twelve rooms folded into the upper storeys. Double-glazing tuned for the bread shift, separate guest stair from the back lane.",
        ctaText: "Open the project",
        ctaUrl: "#bakery-hotel",
        image: "https://picsum.photos/seed/arch-bakery-hotel/960/1200",
        imageAlt:
          "Compact bakery storefront on a stone street with bedroom shutters above",
      },
      {
        index: "04",
        eyebrow: "Adaptive reuse",
        title: "A studio inside a brewery",
        description:
          "Conversion of a 1920s brewery into a 22,000 sqft co-working studio. Original copper kettles kept in place as the central reading room.",
        ctaText: "Open the project",
        ctaUrl: "#brewery",
        image: "https://picsum.photos/seed/arch-brewery-studio/960/1200",
        imageAlt:
          "Industrial brick interior with copper brewing kettles converted into reading nooks",
      },
      {
        index: "05",
        eyebrow: "Landscape",
        title: "A restored salt lagoon",
        description:
          "A six-hectare landscape restoration of an abandoned salt-evaporation lagoon, with a single elevated walkway and three viewing platforms.",
        ctaText: "Open the project",
        ctaUrl: "#lagoon",
        image: "https://picsum.photos/seed/arch-lagoon/960/1200",
        imageAlt:
          "Slim timber boardwalk crossing a pink-tinted salt lagoon at low light",
      },
    ],
    ctaText: "Send a brief",
    ctaUrl: "#brief",
    ctaStyle: "drawOutline",
    ctaColorScheme: "neutral",
    imageSide: "right",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  SaaS product tour — three short items, no per-item CTAs            */
/* ------------------------------------------------------------------ */

export const ProductTourShort: Story = {
  args: {
    eyebrow: "How teams use it",
    headline: "Three shapes of work, one shared workspace",
    subheadline:
      "Engineering, design, and operations don't live in the same tools — but they live in the same projects. Here is how each side runs theirs in Lassen.",
    items: [
      {
        eyebrow: "For engineering",
        title: "Branch-aware tickets",
        description:
          "Every ticket carries the branch, the deploy preview, and the open PR review. Status updates write themselves from CI, not from standup.",
        image: "https://picsum.photos/seed/saas-engineering/960/1200",
        imageAlt:
          "Dashboard showing a list of tickets with branch names and CI status pills",
      },
      {
        eyebrow: "For design",
        title: "Frame-anchored review",
        description:
          "Comments stick to the frame, not the file version, so nothing decouples when the file is renamed or the components are migrated to a new library.",
        image: "https://picsum.photos/seed/saas-design/960/1200",
        imageAlt:
          "Design canvas with annotated frames and threaded review comments anchored in place",
      },
      {
        eyebrow: "For operations",
        title: "Runbooks that page",
        description:
          "Runbooks are stored where the runs happen. The first time an alert fires, the runbook is one click from the page. Edits land before the post-mortem.",
        image: "https://picsum.photos/seed/saas-ops/960/1200",
        imageAlt:
          "Incident page with attached runbook checklist and active pager assignment",
      },
    ],
    ctaText: "Start a free workspace",
    ctaUrl: "#signup",
    ctaStyle: "slide",
    ctaColorScheme: "primary",
    imageSide: "left",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Restaurant tasting menu — four courses, image-led                  */
/* ------------------------------------------------------------------ */

export const TastingMenu: Story = {
  args: {
    eyebrow: "Four courses, March",
    headline: "What the kitchen is cooking this week",
    subheadline:
      "Menu rotates Wednesdays. Bookings open Monday at 9am for the following ten services. Wine pairing optional, dessert is not.",
    items: [
      {
        index: "I.",
        title: "Smoked trout, brown butter, lovage",
        description:
          "Cold-smoked over apple wood for forty minutes, plated with brown butter that has been chilled and grated. Lovage from the rooftop, lemon from the chef's mother.",
        ctaText: "Reserve a table",
        ctaUrl: "#reserve",
        image: "https://picsum.photos/seed/menu-trout/960/1200",
        imageAlt:
          "Plated smoked trout fillet with grated brown butter and green lovage leaves",
      },
      {
        index: "II.",
        title: "Roast pumpkin, miso, burnt honey",
        description:
          "A whole crown pumpkin roasted for three hours in the bread oven, then glazed with white miso whisked into honey that has been pushed to the edge of bitter.",
        ctaText: "Reserve a table",
        ctaUrl: "#reserve",
        image: "https://picsum.photos/seed/menu-pumpkin/960/1200",
        imageAlt:
          "Lacquered roast pumpkin wedge with dark glaze and toasted seeds on a stone plate",
      },
      {
        index: "III.",
        title: "Lamb shoulder, hay, salted plum",
        description:
          "Twelve-hour shoulder rested in hay from the farm next door, sliced thick, served with salted plums put up in October. One of the only things on the menu since opening.",
        ctaText: "Reserve a table",
        ctaUrl: "#reserve",
        image: "https://picsum.photos/seed/menu-lamb/960/1200",
        imageAlt:
          "Sliced rare lamb shoulder on a wooden board beside a small bowl of dark plums",
      },
      {
        index: "IV.",
        title: "Buckwheat, sour cream, toasted barley",
        description:
          "A cold dessert built around buckwheat ice cream and cultured sour cream, dressed with barley toasted three shades darker than seems wise. No sugar added past the ice base.",
        ctaText: "Reserve a table",
        ctaUrl: "#reserve",
        image: "https://picsum.photos/seed/menu-buckwheat/960/1200",
        imageAlt:
          "Pale ice-cream quenelle on a dark plate with scattered toasted barley grains",
      },
    ],
    ctaText: "Hold a table",
    ctaUrl: "#book",
    ctaStyle: "default",
    ctaColorScheme: "accent",
    imageSide: "left",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Real-estate developer — minimal, no per-item CTAs, no eyebrows     */
/* ------------------------------------------------------------------ */

export const DeveloperProjects: Story = {
  args: {
    headline: "Six buildings, four neighborhoods",
    items: [
      {
        index: "01",
        title: "Edifício Tatuí",
        description:
          "Eighteen apartments in Vila Madalena, two-and-three-bedroom plans, completion Q3 2027. Reservation list opens June 2026.",
        image: "https://picsum.photos/seed/dev-tatui/960/1200",
        imageAlt:
          "Modernist residential tower with planted balconies on a tree-lined street",
      },
      {
        index: "02",
        title: "Casa Boqueirão",
        description:
          "Twelve sea-facing duplexes in Santos, including three penthouses with private rooftop pools. Sales office open daily on the avenue.",
        image: "https://picsum.photos/seed/dev-boqueirao/960/1200",
        imageAlt:
          "Beachfront residential building at sunrise with arched balconies above a wide promenade",
      },
      {
        index: "03",
        title: "Pátio Higienópolis",
        description:
          "Six lofts and a ground-floor bookstore behind an existing 1934 facade. Listed property — restoration plans approved July 2024.",
        image: "https://picsum.photos/seed/dev-higienopolis/960/1200",
        imageAlt:
          "Restored art-deco facade with original signage above a bookstore window",
      },
      {
        index: "04",
        title: "Quinta da Granja",
        description:
          "Eight country houses on a thirty-hectare estate near Itu, share of an organic farm and a private trail network. Two units remaining.",
        image: "https://picsum.photos/seed/dev-granja/960/1200",
        imageAlt:
          "Low timber country house with deep eaves overlooking a meadow and farm sheds",
      },
    ],
    ctaText: "Request the brochure",
    ctaUrl: "#brochure",
    ctaStyle: "arrow",
    imageSide: "right",
    tone: "light",
  },
};

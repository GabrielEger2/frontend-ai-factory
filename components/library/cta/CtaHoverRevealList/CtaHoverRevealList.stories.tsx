import type { Meta, StoryObj } from "@storybook/react";
import CtaHoverRevealList from "./index";

const meta: Meta<typeof CtaHoverRevealList> = {
  title: "CTA/CtaHoverRevealList",
  component: CtaHoverRevealList,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof CtaHoverRevealList>;

/* ------------------------------------------------------------------ */
/*  Bakery — the canonical use case the brief described                */
/* ------------------------------------------------------------------ */

export const ArtisanBakery: Story = {
  args: {
    eyebrow: "What's on the counter",
    headline: "Six things we bake well",
    subheadline:
      "Everything in this list goes into the oven before sunrise and out the door by 11am. Walk in, point, leave with something warm.",
    items: [
      {
        label: "Sourdough Loaves",
        caption: "Naturally leavened, 36-hour ferment, charred crust.",
        image: "https://picsum.photos/seed/bakery-sourdough/720/960",
        imageAlt: "Three dark-crusted sourdough boules cooling on a wire rack",
        url: "#sourdough",
      },
      {
        label: "Layer Cakes",
        caption: "Two tiers, brown butter sponge, seasonal fruit.",
        image: "https://picsum.photos/seed/bakery-cake/720/960",
        imageAlt: "Cross-section of a tall layer cake with strawberry filling",
        url: "#cakes",
      },
      {
        label: "Hand Pies",
        caption: "Lard-and-butter crust, savory or sweet, never both.",
        image: "https://picsum.photos/seed/bakery-pie/720/960",
        imageAlt: "Golden hand pie split open showing dark cherry filling",
        url: "#pies",
      },
      {
        label: "Croissants",
        caption: "Three days laminated, four colors of butter.",
        image: "https://picsum.photos/seed/bakery-croissant/720/960",
        imageAlt: "Stack of bronzed croissants with visible flaky layers",
        url: "#croissants",
      },
      {
        label: "Focaccia",
        caption: "Olive oil-soaked base, dimples for the brine to pool.",
        image: "https://picsum.photos/seed/bakery-focaccia/720/960",
        imageAlt: "Wide pan of dimpled focaccia studded with cherry tomatoes",
        url: "#focaccia",
      },
      {
        label: "Cookies and Bars",
        caption: "Whatever is in season, whatever the team is excited about.",
        image: "https://picsum.photos/seed/bakery-cookies/720/960",
        imageAlt: "Tray of dark cookies with sea-salt flakes scattered on top",
        url: "#cookies",
      },
    ],
    ctaText: "See the full menu",
    ctaUrl: "#menu",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Architecture studio — dark tone                                    */
/* ------------------------------------------------------------------ */

export const ArchitectureDisciplines: Story = {
  args: {
    eyebrow: "Practice",
    headline: "Four disciplines, one hand",
    subheadline:
      "We take on twelve projects a year across the four practices below. The principal who signs the contract is the principal who draws the project.",
    items: [
      {
        label: "Residential",
        caption: "Single-family homes and adaptive reuse on the coast.",
        image: "https://picsum.photos/seed/arch-residential/720/960",
        imageAlt:
          "Concrete and timber residence at dusk with warm interior lighting",
        url: "#residential",
      },
      {
        label: "Civic and Cultural",
        caption: "Libraries, small museums, community gathering halls.",
        image: "https://picsum.photos/seed/arch-civic/720/960",
        imageAlt: "Double-height atrium with central skylight and timber stair",
        url: "#civic",
      },
      {
        label: "Hospitality",
        caption: "Boutique inns and restaurants under thirty covers.",
        image: "https://picsum.photos/seed/arch-hospitality/720/960",
        imageAlt: "Intimate restaurant interior with low pendant lighting",
        url: "#hospitality",
      },
      {
        label: "Landscape and Site",
        caption: "Garden plans, terracing, stonework, native restoration.",
        image: "https://picsum.photos/seed/arch-landscape/720/960",
        imageAlt: "Drystone retaining wall meeting a meadow of native grasses",
        url: "#landscape",
      },
    ],
    ctaText: "Inquire about a project",
    ctaUrl: "#inquire",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Wine bar — dark slab                                               */
/* ------------------------------------------------------------------ */

export const NaturalWineList: Story = {
  args: {
    eyebrow: "Tonight's pours",
    headline: "Forty-two by the glass, by region",
    subheadline:
      "List rotates Wednesday and Saturday. Walk-ins until 10pm — no reservations, no corkage.",
    items: [
      {
        label: "Loire Valley",
        caption: "Chenin, cabernet franc, sauvignon — taut and saline.",
        image: "https://picsum.photos/seed/wine-loire/720/960",
        imageAlt:
          "Chilled white wine being poured into a stemless glass on marble",
        url: "#loire",
      },
      {
        label: "Jura",
        caption: "Savagnin, poulsard, trousseau — the weird ones.",
        image: "https://picsum.photos/seed/wine-jura/720/960",
        imageAlt:
          "Amber-colored wine in a small Burgundy glass against candlelight",
        url: "#jura",
      },
      {
        label: "Etna",
        caption: "Volcanic nerello from low-intervention growers.",
        image: "https://picsum.photos/seed/wine-etna/720/960",
        imageAlt: "Open bottle of red wine with a hand-drawn paper label",
        url: "#etna",
      },
      {
        label: "Catalunya",
        caption: "Xarel·lo and garnacha, mostly skin-contact.",
        image: "https://picsum.photos/seed/wine-catalunya/720/960",
        imageAlt: "Two glasses of orange wine on a worn wooden bar top",
        url: "#catalunya",
      },
      {
        label: "Mosel",
        caption: "Off-dry rieslings from the steepest slopes.",
        image: "https://picsum.photos/seed/wine-mosel/720/960",
        imageAlt: "Slate-mineral hillside vineyard climbing above the river",
        url: "#mosel",
      },
    ],
    ctaText: "See the bar",
    ctaUrl: "#bar",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Design studio portfolio — minimal, no eyebrow, no footer CTA       */
/* ------------------------------------------------------------------ */

export const StudioPortfolio: Story = {
  args: {
    headline: "Selected work, 2021 onward",
    items: [
      {
        label: "Casa Beira-Mar",
        caption: "Identity and signage — Florianópolis hospitality group",
        image: "https://picsum.photos/seed/studio-beiramar/720/960",
        imageAlt:
          "Bronze building plaque with engraved logotype catching afternoon light",
        url: "#case-1",
        index: "01",
      },
      {
        label: "Tavola Editions",
        caption: "Print system and book covers — independent publisher",
        image: "https://picsum.photos/seed/studio-tavola/720/960",
        imageAlt:
          "Stack of paperback novels with deckled edges and serif titles",
        url: "#case-2",
        index: "02",
      },
      {
        label: "Otaru Coffee",
        caption: "Packaging and retail — single-origin roaster, three cities",
        image: "https://picsum.photos/seed/studio-otaru/720/960",
        imageAlt: "Matte coffee bag with a pressed-foil emblem on a wood shelf",
        url: "#case-3",
        index: "03",
      },
      {
        label: "Ribeirão Mineral",
        caption: "Bottle and brand — small-batch sparkling water",
        image: "https://picsum.photos/seed/studio-ribeirao/720/960",
        imageAlt:
          "Tall glass bottle with embossed wave pattern on a stone surface",
        url: "#case-4",
        index: "04",
      },
    ],
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Tour operator — three rows is the floor; tests the short-list end  */
/* ------------------------------------------------------------------ */

export const ExpeditionsShortList: Story = {
  args: {
    eyebrow: "Spring 2026 departures",
    headline: "Three trips, twelve seats each",
    subheadline:
      "Bookings open Monday at 9am Pacific. Wait-list closed within 48 hours last cycle.",
    items: [
      {
        label: "Patagonia Crossing",
        caption: "Eleven nights, El Chaltén to Torres del Paine, Mar 4–14.",
        image: "https://picsum.photos/seed/trip-patagonia/720/960",
        imageAlt:
          "Granite spires of the Fitz Roy massif at first light over a glacial lake",
        url: "#patagonia",
      },
      {
        label: "Hokkaido Shoulder Season",
        caption: "Nine nights, Sapporo to Shiretoko, late April.",
        image: "https://picsum.photos/seed/trip-hokkaido/720/960",
        imageAlt:
          "Snow-edged forest path winding past a dark wooden onsen building",
        url: "#hokkaido",
      },
      {
        label: "Faroes Sea Cliffs",
        caption: "Seven nights, small-boat charter, weather-routed itinerary.",
        image: "https://picsum.photos/seed/trip-faroes/720/960",
        imageAlt:
          "Sheer green sea cliffs dropping into the North Atlantic with seabirds",
        url: "#faroes",
      },
    ],
    ctaText: "Reserve a seat",
    ctaUrl: "#reserve",
    tone: "light",
  },
};

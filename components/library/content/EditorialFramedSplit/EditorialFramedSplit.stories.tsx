import type { Meta, StoryObj } from "@storybook/react";
import EditorialFramedSplit from "./index";

const meta: Meta<typeof EditorialFramedSplit> = {
  title: "Content/EditorialFramedSplit",
  component: EditorialFramedSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaVariant: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof EditorialFramedSplit>;

/* ------------------------------------------------------------------ */
/*  ArchitectureStudio — full editorial: meta strip + chapters + pull  */
/*  quote + metrics band + closing CTA + footnote                      */
/* ------------------------------------------------------------------ */

export const ArchitectureStudio: Story = {
  args: {
    eyebrow: "Our Practice",
    headline: "From Inspiration to Reality",
    highlightWord: "Reality",
    standfirst:
      "We design houses that fit how their owners actually live — not how a magazine spread suggests they should. Most projects begin with a long walk through the plot at sunrise.",
    meta: [
      { label: "Practice", value: "Cardoso & Tavares" },
      { label: "Established", value: "São Paulo, 2007" },
      { label: "Built work", value: "47 residences" },
      { label: "Crew", value: "11 architects · 4 detailers" },
    ],
    ctaText: "Read Our Approach",
    ctaUrl: "#approach",
    leadImage: "https://picsum.photos/seed/arch-studio-lead/720/900",
    leadImageAlt: "Architect sketching plans at a sunlit drafting desk",
    leadImageCaption: "Atelier · Vila Madalena · Tuesday morning",
    secondaryImage: "https://picsum.photos/seed/arch-studio-secondary/720/540",
    secondaryImageAlt:
      "Two designers reviewing a notebook of hand-drawn floor plans",
    secondaryImageCaption: "Schematic review · Casa Pinheiros · 2024",
    supportingHeadline: "Customized Functionality",
    supportingBody:
      "Our depth in residential trends, two decades of joinery experience, and quiet obsession with how a home actually lives day to day are what turn a brief into a place that fits its owners.",
    chapters: [
      {
        index: "01",
        label: "Site visit",
        value: "Three sunrise walks before any sketch leaves the studio.",
      },
      {
        index: "02",
        label: "Schematic",
        value:
          "Hand-drawn first, then BIM. Every joint sized for the real material.",
      },
      {
        index: "03",
        label: "Detail set",
        value:
          "We mill our own door pulls. The site team uses the same drawings we do.",
      },
      {
        index: "04",
        label: "Handover",
        value:
          "A bound book of the project, the drawings, and the contractors who built it.",
      },
    ],
    pullQuote: {
      quote:
        "They walked the plot before they drew anything. By the time the plans arrived, the house was already in the right place.",
      attribution: "Mariana Okazaki",
      attributionMeta: "Owner · Casa Pinheiros · Built 2023",
    },
    metrics: [
      { value: "47", label: "Residences delivered since 2007" },
      { value: "92%", label: "Repeat or referred clients" },
      { value: "11.4", label: "Months average from brief to handover" },
      { value: "0", label: "Litigation in 18 years of practice" },
    ],
    closingCtaText: "Read the founding letter",
    closingCtaUrl: "/founding-letter",
    footnote:
      "Numbers reflect built residential work between 2007 and 2024, audited by the studio's project management office. Repeat-or-referred figure excludes inherited commissions from prior practices.",
    ctaVariant: "default",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  HeritageWinery — meta + chapters + pull quote, no metrics band     */
/* ------------------------------------------------------------------ */

export const HeritageWinery: Story = {
  args: {
    eyebrow: "Estate & Vineyard",
    headline: "Three Generations, One Hillside",
    highlightWord: "Hillside",
    standfirst:
      "Forty-three hectares on a single south-facing slope in Serra Gaúcha, planted by the Bertolini family in 1962 and farmed without irrigation since.",
    meta: [
      { label: "Estate", value: "Bertolini · Serra Gaúcha" },
      { label: "Planted", value: "1962" },
      { label: "Hectares", value: "43 · single slope" },
      { label: "Farming", value: "Dry · certified organic 2014" },
    ],
    ctaText: "Visit the Estate",
    ctaUrl: "/estate",
    leadImage: "https://picsum.photos/seed/winery-lead/720/900",
    leadImageAlt: "Vineyard rows climbing a sunlit hillside at golden hour",
    leadImageCaption: "Block 7 · Serra Gaúcha · March 2024",
    secondaryImage: "https://picsum.photos/seed/winery-secondary/720/540",
    secondaryImageAlt:
      "Cellar master pouring a barrel sample into a tasting glass",
    secondaryImageCaption:
      "Lucia Bertolini, third-generation cellar master, drawing 2023 cuvée",
    supportingHeadline: "Single-Vineyard Expression",
    supportingBody:
      "Every cuvée carries the soil it grew in. We bottle each block separately so you taste a specific year, a specific slope, and the patience of a family that has not been in a hurry since 1962.",
    chapters: [
      {
        index: "I",
        label: "The slope",
        value:
          "South-facing, 540–720m elevation. Volcanic basalt sits over sandstone subsoil.",
      },
      {
        index: "II",
        label: "The blocks",
        value:
          "Eleven blocks, eight varietals. Each is harvested, fermented, and bottled separately.",
      },
      {
        index: "III",
        label: "The cellar",
        value:
          "Native yeast, no fining, minimal sulphur. Aged in neutral French oak for fourteen months.",
      },
      {
        index: "IV",
        label: "The release",
        value:
          "1,200 to 2,800 bottles per block. Allocated to the mailing list before any retail.",
      },
    ],
    pullQuote: {
      quote:
        "Block seven is the wine my grandfather made first. We have not changed how it is farmed in sixty-one years, and we are not about to.",
      attribution: "Lucia Bertolini",
      attributionMeta: "Third-generation cellar master",
    },
    closingCtaText: "Join the allocation list",
    closingCtaUrl: "/list",
    ctaVariant: "slide",
    ctaColorScheme: "primary",
  },
};

/* ------------------------------------------------------------------ */
/*  BoutiqueFurniture — chapters + metrics, no meta strip              */
/* ------------------------------------------------------------------ */

export const BoutiqueFurniture: Story = {
  args: {
    eyebrow: "Workshop",
    headline: "Handmade Pieces, Built to Outlast Trends",
    highlightWord: "Outlast",
    standfirst:
      "We mill our own boards from American white oak and Brazilian freijó, dry them slowly in our own kiln, and finish each piece by hand in a converted stable in Cotia.",
    ctaText: "Browse the Catalogue",
    ctaUrl: "/catalogue",
    leadImage: "https://picsum.photos/seed/furniture-lead/720/900",
    leadImageAlt: "Cabinetmaker planing a long oak board in a daylit workshop",
    leadImageCaption:
      "Rafael Tavares · planing a 2.4m freijó top · workshop floor",
    secondaryImage: "https://picsum.photos/seed/furniture-secondary/720/540",
    secondaryImageAlt: "Detail shot of a hand-cut dovetail joint",
    secondaryImageCaption: "Hand-cut through dovetails · 8mm pins · no glue",
    supportingHeadline: "Sourced, Cut, Joined Under One Roof",
    supportingBody:
      "We mill our own boards, dry them slowly, and finish each piece by hand. Nothing leaves the workshop until it could pass for a fifty-year-old heirloom on the day of delivery.",
    chapters: [
      {
        index: "01",
        label: "Source",
        value:
          "American white oak, Brazilian freijó. Always rough-sawn, always traceable to a felling lot.",
      },
      {
        index: "02",
        label: "Mill & dry",
        value:
          "Quarter-sawn at 8/4. Air-dried twelve months, then kilned to 8% moisture.",
      },
      {
        index: "03",
        label: "Joinery",
        value:
          "Through dovetails, drawbored mortise-and-tenon. No metal fasteners on any visible face.",
      },
      {
        index: "04",
        label: "Finish",
        value:
          "Hard-wax oil, three coats, hand-buffed. Each piece signed and numbered on the underside.",
      },
    ],
    metrics: [
      { value: "184", label: "Pieces shipped in 2024" },
      { value: "11", label: "Bench-trained makers on payroll" },
      { value: "9.4", label: "Months average lead time" },
      { value: "12yr", label: "Structural warranty, transferable" },
    ],
    footnote:
      "Lead time reflects the period between deposit and crate-out for one-off commissions. Catalogue pieces typically ship within ten weeks of order.",
    ctaVariant: "drawOutline",
    ctaColorScheme: "neutral",
  },
};

/* ------------------------------------------------------------------ */
/*  PrivateMedicalClinic — meta + standfirst + metrics + closing CTA   */
/* ------------------------------------------------------------------ */

export const PrivateMedicalClinic: Story = {
  args: {
    eyebrow: "Whole-Person Care",
    headline: "Medicine That Listens Before It Prescribes",
    highlightWord: "Listens",
    standfirst:
      "A four-physician practice in Pinheiros built around forty-five-minute consultations, full lab review, and the time to actually think between visits.",
    meta: [
      { label: "Practice", value: "Clínica Casa Verde" },
      { label: "Founded", value: "2018" },
      { label: "Physicians", value: "4 · all internal medicine" },
      { label: "Capacity", value: "1,140 patients · capped" },
    ],
    ctaText: "Book a Consultation",
    ctaUrl: "/book",
    leadImage: "https://picsum.photos/seed/clinic-lead/720/900",
    leadImageAlt:
      "Physician taking notes during an unhurried consultation with a patient",
    leadImageCaption:
      "Dr. Bianca Okazaki · 45-minute consultation · Tuesday clinic",
    secondaryImage: "https://picsum.photos/seed/clinic-secondary/720/540",
    secondaryImageAlt:
      "Calm waiting lounge with linen seating and warm wood detailing",
    supportingHeadline: "Forty-Five Minute Appointments",
    supportingBody:
      "Our consultations run nearly four times the national average because the questions that matter rarely surface in the first ten minutes. We design every part of the visit around having time to actually think.",
    chapters: [
      {
        label: "Intake",
        value:
          "Two hours of paper review before your first visit, billed at zero.",
      },
      {
        label: "Visit",
        value:
          "45 minutes scheduled. We block 60 so the next patient is never waiting.",
      },
      {
        label: "Follow-up",
        value:
          "Same physician, every time. Direct line for anything that surfaces between visits.",
      },
    ],
    metrics: [
      { value: "45", label: "Minutes per consultation, by design" },
      { value: "1,140", label: "Patients in the panel · capped" },
      { value: "1.7", label: "Days average referral-to-specialist time" },
      { value: "100%", label: "Same-physician continuity since 2018" },
    ],
    closingCtaText: "Read our patient agreement",
    closingCtaUrl: "/agreement",
    footnote:
      "Patient panel cap reflects ANS guidance on internal-medicine continuity. Continuity figure measures the share of follow-ups completed with the originating physician between Jan 2018 and Dec 2024.",
    ctaVariant: "glow",
    ctaColorScheme: "accent",
  },
};

/* ------------------------------------------------------------------ */
/*  CoastalRealEstate — pull quote + metrics, leaner body              */
/* ------------------------------------------------------------------ */

export const CoastalRealEstate: Story = {
  args: {
    eyebrow: "Properties",
    headline: "Homes That Catch the First Light of the Bay",
    highlightWord: "First Light",
    standfirst:
      "We list nine properties a year along a forty-kilometre stretch of the southern bay. Each one gets the campaign of the only listing we have.",
    ctaText: "View Listings",
    ctaUrl: "/listings",
    leadImage: "https://picsum.photos/seed/coastal-lead/720/900",
    leadImageAlt:
      "Modern coastal home glowing under early morning sun, water in the distance",
    leadImageCaption: "Praia do Forte · north-facing aspect · listing #BR-241",
    secondaryImage: "https://picsum.photos/seed/coastal-secondary/720/540",
    secondaryImageAlt:
      "Open-plan kitchen and living room facing floor-to-ceiling windows",
    supportingHeadline: "Local Knowledge, Quiet Process",
    supportingBody:
      "We list fewer properties on purpose. Each one gets a tailored campaign, professional staging, and an agent who has actually walked the neighborhood at sunrise. No mass mailers, no pressure tours.",
    chapters: [
      {
        index: "01",
        label: "Walked",
        value:
          "Every listing scouted at sunrise and sunset before it goes to market.",
      },
      {
        index: "02",
        label: "Staged",
        value:
          "Photography, drone, and copy by an in-house team. No outsourced trunk-shows.",
      },
      {
        index: "03",
        label: "Shown",
        value: "Private viewings only. Fifty-minute slots, never overlapping.",
      },
    ],
    pullQuote: {
      quote:
        "They turned down two offers above asking because the buyers had not been to the house at sunrise. The third buyer had — and the deal closed in four days.",
      attribution: "Henrique Falcão",
      attributionMeta: "Seller · Casa Praia do Forte · 2023",
    },
    metrics: [
      { value: "9", label: "Listings per year, by design" },
      { value: "47.2", label: "Days average time to firm offer" },
      { value: "98.4%", label: "List-to-sale price realisation, 2024" },
      { value: "0", label: "Mass mailers ever sent" },
    ],
    ctaVariant: "dotExpand",
    ctaColorScheme: "primary",
  },
};

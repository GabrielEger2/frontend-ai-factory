import type { Meta, StoryObj } from "@storybook/react";
import HeroNewsroomTicker from "./index";

const meta: Meta<typeof HeroNewsroomTicker> = {
  title: "Heroes/HeroNewsroomTicker",
  component: HeroNewsroomTicker,
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
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
    secondaryCtaStyle: {
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
    secondaryCtaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof HeroNewsroomTicker>;

/** Independent business publication — full ticker, four featured stories with thumbnails */
export const BusinessJournal: Story = {
  args: {
    tickerItems: [
      { label: "BVMF — IBOV", value: "127,418", trend: "up" },
      { label: "USD/BRL", value: "5.0237", trend: "down" },
      { label: "BRENT", value: "$78.42", trend: "up" },
      { label: "VALE3", value: "R$ 64.18", trend: "down" },
      { label: "PETR4", value: "R$ 38.94", trend: "up" },
      { label: "Selic", value: "10.50%", trend: "flat" },
    ],
    issueLabel: "Volume xii / issue 184 — saturday",
    headline:
      "Brazil's quietest cooperatives are now financing eight percent of small-grain logistics.",
    lede: "An eighteen-month investigation across Mato Grosso, Parana, and the south of Goias finds a generation of regional cooperatives quietly absorbing the freight that the country's largest exporters spent the last decade trying to outsource. Reporting by the desk in Sao Paulo with photography by Bianca Okazaki.",
    ctaText: "Read the report",
    ctaUrl: "/reports/cooperatives",
    ctaStyle: "default",
    ctaColorScheme: "neutral",
    secondaryCtaText: "Subscribe — R$ 38 / mo",
    secondaryCtaUrl: "/subscribe",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    featuredHeadlinesLabel: "On the desk this week",
    featuredHeadlines: [
      {
        kicker: "Politics",
        title:
          "The new minister has eight weeks and a Senate that does not want him to use them.",
        url: "/politics/minister-window",
        meta: "Beatriz Vasques · 7 min",
        image: "https://placehold.co/160x120",
        imageAlt: "Senate floor at the start of the morning session",
      },
      {
        kicker: "Markets",
        title:
          "Why a quiet rebuild of the Santos export terminal is worrying everyone except its owner.",
        url: "/markets/santos-terminal",
        meta: "Rafael Tavares · 11 min",
        image: "https://placehold.co/160x120",
        imageAlt: "Container stacks at the Santos export terminal",
      },
      {
        kicker: "Long read",
        title:
          "A small town in Bahia has spent fourteen years quietly building a public university from inside its own library.",
        url: "/longreads/bahia-library",
        meta: "Mariana Cardoso · 22 min",
        image: "https://placehold.co/160x120",
        imageAlt: "Library reading room in late afternoon light",
      },
      {
        kicker: "Opinion",
        title: "The hardest currency Brazil ships is still trust.",
        url: "/opinion/trust-currency",
        meta: "Editorial · 4 min",
      },
    ],
  },
};

/** Climate research dispatch — three featured items, secondary scheme */
export const ClimateResearch: Story = {
  args: {
    tickerItems: [
      { label: "CO2 — Mauna Loa", value: "424.7 ppm", trend: "up" },
      { label: "Arctic ice (May)", value: "12.84 Mkm²", trend: "down" },
      { label: "Brazil deforest YTD", value: "1,847 km²", trend: "down" },
      { label: "Renewables, BR mix", value: "47.2%", trend: "up" },
      { label: "Methane (latest)", value: "1924 ppb", trend: "up" },
    ],
    issueLabel: "Dispatch 41 — week of 13 may",
    headline:
      "The Cerrado lost less canopy in April than in any month of the last seven years.",
    lede: "Three independent monitors confirm a forty-seven percent slowdown across April relative to the rolling baseline, with the largest declines clustered in three federal districts that adopted the satellite-cooperation pact last September. The dispatch breaks down what is structural and what is weather.",
    ctaText: "Read the dispatch",
    ctaUrl: "/dispatches/41",
    ctaStyle: "slide",
    ctaColorScheme: "secondary",
    secondaryCtaText: "Download the dataset",
    secondaryCtaUrl: "/data/41.csv",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "secondary",
    featuredHeadlinesLabel: "Background reading",
    featuredHeadlines: [
      {
        kicker: "Methodology",
        title: "How the three-source rule cleared up six months of noisy data.",
        url: "/method/three-source",
        meta: "Field notes · 9 min",
      },
      {
        kicker: "Field report",
        title:
          "A forty-eight hour drive across two states and the small office that quietly changed the model.",
        url: "/field/cerrado-drive",
        meta: "Beatriz O. · 14 min",
        image: "https://placehold.co/160x120",
        imageAlt: "Long open road crossing dry Cerrado scrubland",
      },
      {
        kicker: "Data note",
        title: "What the seasonality charts get right, and where they don't.",
        url: "/notes/seasonality",
        meta: "Tech note · 6 min",
      },
    ],
  },
};

/** Fintech analyst homepage — high contrast, four small headlines, no images */
export const FintechAnalyst: Story = {
  args: {
    tickerItems: [
      { label: "S&P 500", value: "5,718.42", trend: "up" },
      { label: "BTC/USD", value: "62,847", trend: "down" },
      { label: "10Y UST", value: "4.214%", trend: "up" },
      { label: "VIX", value: "13.7", trend: "flat" },
      { label: "DXY", value: "104.62", trend: "down" },
    ],
    issueLabel: "Morning desk · 06:14 ET",
    headline:
      "Three rate-cut paths the desk now considers plausible into the September meeting.",
    lede: "Sentiment from inside the FOMC, paired with revisions across the Reuters poll and the Cleveland CPI nowcast, has narrowed our distribution. We map the three remaining scenarios, what each does to the long end, and how a small carry book should be positioned ahead of Wednesday's print.",
    ctaText: "Open today's note",
    ctaUrl: "/notes/morning",
    ctaStyle: "arrow",
    ctaColorScheme: "primary",
    secondaryCtaText: "Subscribe — $194 / mo",
    secondaryCtaUrl: "/subscribe",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "neutral",
    featuredHeadlinesLabel: "Recent notes",
    featuredHeadlines: [
      {
        kicker: "Macro",
        title: "Why the Bank of Canada is the one to watch this quarter.",
        url: "/notes/boc",
        meta: "08 may · 6 min",
      },
      {
        kicker: "Credit",
        title:
          "The IG primary calendar held up better than anyone wanted to admit.",
        url: "/notes/ig-primary",
        meta: "07 may · 9 min",
      },
      {
        kicker: "FX",
        title: "Brent's quiet steepening looks more EM than oil.",
        url: "/notes/brent-em",
        meta: "06 may · 5 min",
      },
      {
        kicker: "Positioning",
        title: "What the dealer survey misses about the long end this cycle.",
        url: "/notes/dealer-survey",
        meta: "03 may · 11 min",
      },
    ],
  },
};

/** Quarterly print review — restrained, accent CTA, two featured stories */
export const QuarterlyPrintReview: Story = {
  args: {
    tickerItems: [
      { label: "Issue 17", value: "shipping 22.06", trend: "flat" },
      { label: "Pages", value: "184", trend: "flat" },
      { label: "Print run", value: "3,847 copies", trend: "up" },
      { label: "Subscribers", value: "+1,184", trend: "up" },
    ],
    issueLabel: "Letter from the editors — issue xvii",
    headline:
      "Seventeen issues in, the journal is still a quarterly object you cannot read on a phone.",
    lede: "The summer issue gathers eleven essays, four short stories, and a long photo report from the south of Patagonia, printed on uncoated stock and stitched in lots of two hundred at a small press in Porto. Letters to the editor close on the eighth of June.",
    ctaText: "Pre-order issue xvii",
    ctaUrl: "/issues/17",
    ctaStyle: "dotExpand",
    ctaColorScheme: "accent",
    secondaryCtaText: "Read past letters",
    secondaryCtaUrl: "/letters",
    secondaryCtaStyle: "drawOutline",
    secondaryCtaColorScheme: "accent",
    featuredHeadlinesLabel: "From this issue",
    featuredHeadlines: [
      {
        kicker: "Essay",
        title:
          "On rooms designed for one person to read in for the rest of an afternoon.",
        url: "/issues/17/rooms",
        meta: "Andre Gomes · 18 min",
        image: "https://placehold.co/160x120",
        imageAlt: "Reading chair beside a tall window in afternoon light",
      },
      {
        kicker: "Photo report",
        title: "Three weeks across the Pampa, photographed slow.",
        url: "/issues/17/pampa",
        meta: "Bianca Okazaki · sixty-eight plates",
        image: "https://placehold.co/160x120",
        imageAlt: "Wide grassland under a long flat sky",
      },
    ],
  },
};

/** Policy briefing — minimum data, no featured rail, single CTA */
export const PolicyBriefing: Story = {
  args: {
    tickerItems: [
      { label: "Bills tabled", value: "47", trend: "up" },
      { label: "Hearings — week", value: "12", trend: "flat" },
      { label: "Vetoes — YTD", value: "8", trend: "down" },
      { label: "Vote margin", value: "±14", trend: "flat" },
    ],
    issueLabel: "Briefing 09 — week of 13 may",
    headline:
      "The committee finally moved the long-stalled procurement bill, and almost no one was watching.",
    lede: "Tuesday afternoon's vote cleared the procurement reform package out of committee on a margin of eleven to nine, with two surprise abstentions and a procedural objection that did not survive the chair's reading. Floor consideration is now expected before the late-June recess.",
    ctaText: "Read briefing 09",
    ctaUrl: "/briefings/09",
    ctaStyle: "default",
    ctaColorScheme: "primary",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import TestimonialsStagger from "./index";

const meta: Meta<typeof TestimonialsStagger> = {
  title: "Testimonials/TestimonialsStagger",
  component: TestimonialsStagger,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    sectionHeight: {
      control: { type: "range", min: 400, max: 800, step: 50 },
    },
    cardSizeLg: {
      control: { type: "range", min: 280, max: 450, step: 15 },
    },
    cardSizeSm: {
      control: { type: "range", min: 220, max: 350, step: 10 },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialsStagger>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** SaaS platform -- B2B software customer quotes */
export const SaasCustomers: Story = {
  args: {
    testimonials: [
      {
        image: "https://placehold.co/100x130/2c3e50/e0e0e0?text=AK",
        imageAlt: "Headshot of Alex Kim, CEO at StreamlineOps",
        name: "Alex Kim",
        title: "CEO at StreamlineOps",
        quote:
          "My favorite solution in the market. Our team works 5x faster since we switched.",
      },
      {
        image: "https://placehold.co/100x130/34495e/e0e0e0?text=DM",
        imageAlt: "Headshot of Dan Mitchell, CTO at VaultSecure",
        name: "Dan Mitchell",
        title: "CTO at VaultSecure",
        quote:
          "I'm confident our data is safe. I can't say that about other providers we've tried.",
      },
      {
        image: "https://placehold.co/100x130/1e272e/e0e0e0?text=SR",
        imageAlt: "Headshot of Stephanie Ruiz, Head of Product at LaunchPad",
        name: "Stephanie Ruiz",
        title: "Head of Product at LaunchPad",
        quote:
          "We were honestly lost before we found this platform. It transformed our entire workflow.",
      },
      {
        image: "https://placehold.co/100x130/0a3d62/e0e0e0?text=ML",
        imageAlt: "Headshot of Marie Laurent, VP of Engineering at ScaleForce",
        name: "Marie Laurent",
        title: "VP of Engineering at ScaleForce",
        quote:
          "Planning for the future is seamless now. The forecasting tools alone justify the cost.",
      },
      {
        image: "https://placehold.co/100x130/0c2461/e0e0e0?text=AP",
        imageAlt: "Headshot of Andre Park, Founder of CloudNine",
        name: "Andre Park",
        title: "Founder at CloudNine",
        quote: "If I could give 11 stars, I'd give 12. No exaggeration.",
      },
      {
        image: "https://placehold.co/100x130/4a4a4a/e0e0e0?text=JW",
        imageAlt:
          "Headshot of Jeremy Walsh, Director of Operations at BrightPath",
        name: "Jeremy Walsh",
        title: "Director of Operations at BrightPath",
        quote:
          "SO glad we found you! I estimate it's saved me at least 100 hours in the last quarter alone.",
      },
      {
        image: "https://placehold.co/100x130/636e72/e0e0e0?text=PT",
        imageAlt: "Headshot of Pam Torres, COO at NextWave",
        name: "Pam Torres",
        title: "COO at NextWave",
        quote:
          "Took some convincing internally, but now that we're on board, we're never going back.",
      },
      {
        image: "https://placehold.co/100x130/2d3436/e0e0e0?text=DC",
        imageAlt: "Headshot of Daniel Chen, Head of Analytics at MetricFlow",
        name: "Daniel Chen",
        title: "Head of Analytics at MetricFlow",
        quote:
          "I would be lost without the in-depth analytics. The ROI is easily 100x for us.",
      },
      {
        image: "https://placehold.co/100x130/5a5a5a/e0e0e0?text=FS",
        imageAlt: "Headshot of Fernando Silva, CEO at Logistika",
        name: "Fernando Silva",
        title: "CEO at Logistika",
        quote: "It's just the best. Period. Nothing else comes close.",
      },
      {
        image: "https://placehold.co/100x130/3a3a3a/e0e0e0?text=AJ",
        imageAlt: "Headshot of Andy Jensen, Co-founder at PivotPoint",
        name: "Andy Jensen",
        title: "Co-founder at PivotPoint",
        quote:
          "I switched 5 years ago and never looked back. Best business decision I've made.",
      },
      {
        image: "https://placehold.co/100x130/6c5ce7/e0e0e0?text=PH",
        imageAlt: "Headshot of Pete Huang, Product Lead at Synapse",
        name: "Pete Huang",
        title: "Product Lead at Synapse",
        quote:
          "I've been searching for a solution like this for years. So glad I finally found one.",
      },
      {
        image: "https://placehold.co/100x130/00b894/e0e0e0?text=MK",
        imageAlt: "Headshot of Marina Kovacs, Engineering Manager at Prism",
        name: "Marina Kovacs",
        title: "Engineering Manager at Prism",
        quote:
          "So simple and intuitive — we got the entire team up to speed in 10 minutes flat.",
      },
    ],
  },
};

/** Fitness studio -- personal training client testimonials */
export const FitnessClients: Story = {
  args: {
    testimonials: [
      {
        image: "https://placehold.co/100x130/e17055/e0e0e0?text=RM",
        imageAlt: "Headshot of Rachel Morgan after completing a marathon",
        name: "Rachel Morgan",
        title: "Marathon runner, member since 2022",
        quote:
          "I never thought I'd run a marathon. The personalized coaching program changed everything for me.",
      },
      {
        image: "https://placehold.co/100x130/fdcb6e/1a1a2e?text=TL",
        imageAlt: "Headshot of Tom Liu in the gym",
        name: "Tom Liu",
        title: "Software engineer, member since 2023",
        quote:
          "The flexibility of the schedule and the quality of trainers made it easy to stay consistent.",
      },
      {
        image: "https://placehold.co/100x130/0984e3/e0e0e0?text=SB",
        imageAlt: "Headshot of Sarah Blake at a CrossFit competition",
        name: "Sarah Blake",
        title: "CrossFit athlete, member since 2021",
        quote:
          "Best investment in my health I've ever made. Down 30 pounds and stronger than ever.",
      },
      {
        image: "https://placehold.co/100x130/a29bfe/1a1a2e?text=JD",
        imageAlt: "Headshot of James Donnelly stretching after a workout",
        name: "James Donnelly",
        title: "Retiree, member since 2024",
        quote:
          "At 67, I thought my active days were behind me. These trainers proved me completely wrong.",
      },
      {
        image: "https://placehold.co/100x130/55efc4/1a1a2e?text=LH",
        imageAlt: "Headshot of Lisa Hernandez at a yoga retreat",
        name: "Lisa Hernandez",
        title: "Yoga instructor, member since 2020",
        quote:
          "The community here is unmatched. It's not just a gym — it's genuinely like a second family.",
      },
    ],
    sectionHeight: 550,
    cardSizeLg: 340,
    cardSizeSm: 270,
  },
};

/** Digital agency -- client feedback on project delivery */
export const AgencyClients: Story = {
  args: {
    testimonials: [
      {
        image: "https://placehold.co/100x130/74b9ff/1a1a2e?text=NK",
        imageAlt: "Headshot of Nina Kowalski, CMO at TrendForge",
        name: "Nina Kowalski",
        title: "CMO at TrendForge",
        quote:
          "They delivered our rebrand two weeks ahead of schedule and the results exceeded every expectation.",
      },
      {
        image: "https://placehold.co/100x130/fab1a0/1a1a2e?text=OT",
        imageAlt: "Headshot of Oscar Tanaka, Founder of Bloom Marketplace",
        name: "Oscar Tanaka",
        title: "Founder at Bloom Marketplace",
        quote:
          "Our conversion rate doubled within the first month of launching the new site. Incredible work.",
      },
      {
        image: "https://placehold.co/100x130/dfe6e9/2d3436?text=CB",
        imageAlt: "Headshot of Clara Bennett, Director of Digital at MedFirst",
        name: "Clara Bennett",
        title: "Director of Digital at MedFirst",
        quote:
          "They understood our compliance needs from day one. Rare to find a creative agency that gets healthcare.",
      },
      {
        image: "https://placehold.co/100x130/b2bec3/2d3436?text=RV",
        imageAlt: "Headshot of Raj Venkatesh, CTO at EduVerse",
        name: "Raj Venkatesh",
        title: "CTO at EduVerse",
        quote:
          "The technical architecture they proposed saved us six figures in infrastructure costs over the year.",
      },
      {
        image: "https://placehold.co/100x130/636e72/e0e0e0?text=EP",
        imageAlt: "Headshot of Elena Petrova, Brand Manager at LuxeHaus",
        name: "Elena Petrova",
        title: "Brand Manager at LuxeHaus",
        quote:
          "Every pixel felt intentional. Our brand finally looks as premium online as it does in store.",
      },
      {
        image: "https://placehold.co/100x130/2d3436/e0e0e0?text=MF",
        imageAlt: "Headshot of Marcus Ford, CEO at Atlas Freight",
        name: "Marcus Ford",
        title: "CEO at Atlas Freight",
        quote:
          "Went from zero digital presence to industry-leading in under 6 months. Phenomenal partnership.",
      },
      {
        image: "https://placehold.co/100x130/6c5ce7/e0e0e0?text=AW",
        imageAlt: "Headshot of Amara Williams, VP of Growth at NestEgg",
        name: "Amara Williams",
        title: "VP of Growth at NestEgg",
        quote:
          "They didn't just build a website — they built a growth engine. Leads are up 180% quarter over quarter.",
      },
    ],
  },
};

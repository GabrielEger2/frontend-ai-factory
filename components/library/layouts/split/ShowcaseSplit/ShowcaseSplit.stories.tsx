import type { Meta, StoryObj } from "@storybook/react";
import ShowcaseSplit from "./index";

const meta: Meta<typeof ShowcaseSplit> = {
  title: "Layouts/Split/ShowcaseSplit",
  component: ShowcaseSplit,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof ShowcaseSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS platform -- enterprise clients praising integration speed */
export const B2BSaasClients: Story = {
  args: {
    label: "Client Testimonials",
    headline: "Trusted by Engineering Teams Worldwide",
    purpose: "testimonials",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "VP of Engineering presenting quarterly results on a large screen",
        name: "Marina Carvalho",
        title: "VP of Engineering at DataBridge",
        quote:
          "Our on-call rotation went from chaos to calm within the first month. The automated incident routing alone saved us forty engineering hours per week, and the post-mortem templates turned our retrospectives into actual improvements instead of blame sessions.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "CTO reviewing architecture diagrams with her team at a whiteboard",
        name: "Felipe Andrade",
        title: "CTO at Nexus Freight",
        quote:
          "We evaluated seven observability platforms before choosing this one. The deciding factor was the GraphQL API that let us pipe alerts directly into our existing Slack workflows without writing a single webhook handler ourselves.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Platform architect working remotely from a sunlit home office",
        name: "Isabela Torres",
        title: "Platform Architect at FinScope",
        quote:
          "Migrating our legacy monitoring stack took two sprints, not the two quarters we estimated. Their migration tooling handled ninety percent of the dashboard conversions automatically, and the support engineers pair-programmed the rest with us.",
      },
    ],
  },
};

/** Law firm -- client spotlight on case outcomes and trust */
export const LawFirmClientsSpotlight: Story = {
  args: {
    label: "Client Spotlight",
    headline: "The People Behind Our Results",
    purpose: "testimonials",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Business owner standing in front of a recently opened restaurant",
        name: "Ricardo Lopes",
        title: "Owner of Sabor do Mar Restaurant Group",
        quote:
          "When a former partner tried to dissolve our joint venture without notice, the team secured an injunction within seventy-two hours and negotiated a buyout that preserved every one of our employees' contracts. They treated my business like it was their own.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Entrepreneur reviewing documents at a polished conference table",
        name: "Fernanda Duarte",
        title: "Founder of Bloom Cosmetics",
        quote:
          "Trademark disputes in the beauty industry are brutal. My attorneys filed the opposition, gathered evidence from three countries, and we won the ruling in under eight months. I have recommended them to every founder in my network since.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt: "Family of four walking through a park on a bright afternoon",
        name: "Carlos and Patricia Mendes",
        title: "Estate planning clients since 2019",
        quote:
          "Setting up a family trust felt intimidating until our lawyer walked us through every scenario in plain language. Five years later we still meet annually to adjust the plan as our kids grow. That kind of long-term attention is rare.",
      },
    ],
  },
};

/** Creative agency -- portfolio showcase of collaborator experiences */
export const CreativeAgencyPortfolio: Story = {
  args: {
    headline: "Collaborators We Are Proud Of",
    purpose: "testimonials",
    testimonials: [
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Brand director reviewing a large-format print proof in a studio",
        name: "Luisa Fonseca",
        title: "Brand Director at Voltz Electric Vehicles",
        quote:
          "We needed a complete rebrand in time for the international auto show. The agency delivered brand guidelines, a sixty-page pitch deck, and a thirty-second launch film in nine weeks. The booth had a line around the corner on opening day.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Marketing head brainstorming campaign ideas on a glass wall covered with sticky notes",
        name: "Gustavo Prado",
        title: "Head of Marketing at Cora Health",
        quote:
          "Our patient acquisition cost dropped by thirty-five percent after the campaign refresh. The creative team did not just make pretty ads; they interviewed twelve of our patients first and built the entire messaging strategy around real stories.",
      },
      {
        image: "https://placehold.co/500x700",
        imageAlt:
          "Startup founder giving a keynote speech at a technology conference",
        name: "Renata Azevedo",
        title: "CEO of Plume Education",
        quote:
          "We hired them for a landing page and ended up redesigning the entire product experience. Their UX research uncovered three conversion blockers we had missed for a year. Sign-ups doubled in the first month after launch.",
      },
    ],
  },
};

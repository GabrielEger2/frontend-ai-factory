import type { Meta, StoryObj } from "@storybook/react";
import TestimonialSpotlightQuote from "./index";

const meta: Meta<typeof TestimonialSpotlightQuote> = {
  title: "Testimonial/TestimonialSpotlightQuote",
  component: TestimonialSpotlightQuote,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialSpotlightQuote>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Premium B2B SaaS — neutral tone, calm editorial */
export const SaasMarqueeWin: Story = {
  args: {
    eyebrow: "From the field",
    quote:
      "We replaced four different observability tools with one cleaner workflow, and the team adopted it without a single training session. That alone paid for the contract.",
    authorName: "Mariana Cardoso",
    authorTitle: "VP Platform Engineering at Northbeam",
    authorImage: "https://picsum.photos/seed/spotlight-mariana-cardoso/600/750",
    authorImageAlt: "Mariana Cardoso, VP Platform Engineering at Northbeam",
    caption: "Recorded after her team's six-month review, October 2025.",
    tone: "neutral",
  },
};

/** Agency case study — inverse tone, magazine impact */
export const AgencyEditorialDark: Story = {
  args: {
    eyebrow: "Drift Studio · Q3 2025",
    quote:
      "They asked the uncomfortable questions in week one — about pricing, about positioning, about the team. The answers reshaped the launch in ways we wouldn't have arrived at alone.",
    authorName: "Rafael Tavares",
    authorTitle: "Co-founder & CEO at Drift Studio",
    authorImage: "https://picsum.photos/seed/spotlight-rafael-tavares/600/750",
    authorImageAlt: "Rafael Tavares, Co-founder of Drift Studio",
    caption:
      "Eight-week sprint, six-figure pipeline impact in the first quarter.",
    tone: "inverse",
  },
};

/** Founder testimonial — muted tone, with company logo */
export const FounderWithLogo: Story = {
  args: {
    eyebrow: "Founder voice",
    quote:
      "I've worked with thirteen agencies in the last decade. None shipped this quickly without dropping quality, and none gave us a system we kept iterating on a year later.",
    authorName: "Bianca Okazaki",
    authorTitle: "Founder & CEO, Foxtrot Studio",
    authorImage: "https://picsum.photos/seed/spotlight-bianca-okazaki/600/750",
    authorImageAlt: "Bianca Okazaki, Founder of Foxtrot Studio",
    companyLogo: "https://placehold.co/120x32/333333/EEEEEE/svg?text=FOXTROT",
    companyLogoAlt: "Foxtrot Studio logo",
    tone: "muted",
  },
};

/** Brazilian SMB — pt-BR copy, neutral tone */
export const BrazilianSMB: Story = {
  args: {
    eyebrow: "Cliente desde 2023",
    quote:
      "A operação era uma colcha de retalhos — quatro planilhas, três sistemas, dois grupos de WhatsApp. Em três semanas a gente trocou tudo isso por um único painel que a equipe inteira entende.",
    authorName: "Camila Reyes Rodrigues",
    authorTitle: "Diretora de Operações, Casa Reyes",
    authorImage: "https://picsum.photos/seed/spotlight-camila-reyes/600/750",
    authorImageAlt: "Camila Reyes Rodrigues",
    caption:
      "Casa Reyes opera 14 unidades pela região metropolitana de Curitiba.",
    tone: "neutral",
  },
};

/** Healthcare org — neutral, with longer-form caption */
export const HealthcareLeader: Story = {
  args: {
    eyebrow: "Sistema regional",
    quote:
      "Saímos de quarenta-e-sete dias entre referência e atendimento para onze. Nada disso teria acontecido sem o protocolo escrito que a equipe deles entregou na quarta semana.",
    authorName: "Dr. David Okafor",
    authorTitle: "Chief Medical Officer, Aurora Health Network",
    authorImage: "https://picsum.photos/seed/spotlight-david-okafor/600/750",
    authorImageAlt: "Dr. David Okafor, CMO at Aurora Health Network",
    caption:
      "Audited Q2-Q4 2025 across 14 clinics. Numbers reconciled by NQF in January 2026.",
    tone: "muted",
  },
};

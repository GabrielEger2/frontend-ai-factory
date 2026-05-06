import type { Meta, StoryObj } from "@storybook/react";
import TestimonialMasonryQuotes from "./index";

const meta: Meta<typeof TestimonialMasonryQuotes> = {
  title: "Testimonial/TestimonialMasonryQuotes",
  component: TestimonialMasonryQuotes,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted"] },
    columns: { control: "select", options: [2, 3, 4] },
  },
};
export default meta;
type Story = StoryObj<typeof TestimonialMasonryQuotes>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** B2B SaaS — 9 quotes, 3 columns, neutral surface, mixed tones */
export const SaasReviewWall: Story = {
  args: {
    eyebrow: "What teams are saying",
    headline: "Customers shipping faster, with cleaner tooling.",
    subheadline:
      "847 reviews across G2, Capterra, and our own NPS panel. We pulled the ones that taught us the most about what to build next.",
    columns: 3,
    tone: "neutral",
    items: [
      {
        quote:
          "Three weeks in, the platform team migrated 84 services without filing a single ticket against us. That's never happened with another vendor.",
        authorName: "Mariana Cardoso",
        authorTitle: "VP Platform Engineering, Northbeam",
        authorImage: "https://picsum.photos/seed/saas-mariana-cardoso/120/120",
        authorImageAlt: "Mariana Cardoso",
        tag: "Platform migration",
        tone: "elevated",
      },
      {
        quote: "Replaced four observability tools with one cleaner workflow.",
        authorName: "Rafael Tavares",
        authorTitle: "Co-founder, Drift Studio",
        authorImage: "https://picsum.photos/seed/saas-rafael-tavares/120/120",
        authorImageAlt: "Rafael Tavares",
      },
      {
        quote:
          "Best partner decision we made in 2025. The team operates like a senior squad we hired.",
        authorName: "Bianca Okazaki",
        authorTitle: "Founder, Foxtrot Studio",
        authorImage: "https://picsum.photos/seed/saas-bianca-okazaki/120/120",
        authorImageAlt: "Bianca Okazaki",
        tone: "accent",
      },
      {
        quote: "Engineer onboarding dropped from two weeks to four days.",
        authorName: "Amina Hassan",
        authorTitle: "Head of Design, Northwave",
        authorImage: "https://picsum.photos/seed/saas-amina-hassan/120/120",
        authorImageAlt: "Amina Hassan",
        tag: "G2 review",
      },
      {
        quote:
          "The clarity of communication alone was worth the price. We knew where things stood every Friday at 4pm — never once chased a status update.",
        authorName: "Camila Reyes Rodrigues",
        authorTitle: "Diretora de Operações, Casa Reyes",
        authorImage: "https://picsum.photos/seed/saas-camila-reyes/120/120",
        authorImageAlt: "Camila Reyes Rodrigues",
        tone: "outline",
      },
      {
        quote:
          "We finally have a brand story everyone in the company tells the same way. Sales calls feel different now.",
        authorName: "Yuki Tanaka",
        authorTitle: "VP Marketing, Glasscube",
        authorImage: "https://picsum.photos/seed/saas-yuki-tanaka/120/120",
        authorImageAlt: "Yuki Tanaka",
      },
      {
        quote:
          "Pipeline up 47.2% in the first quarter. The redesign paid for itself before the next billing cycle.",
        authorName: "David Okafor",
        authorTitle: "CTO, Northwind Labs",
        authorImage: "https://picsum.photos/seed/saas-david-okafor/120/120",
        authorImageAlt: "David Okafor",
        tag: "Q1 results",
      },
      {
        quote:
          "They asked the uncomfortable questions in week one. The answers reshaped our launch.",
        authorName: "Hannah Schmitt",
        authorTitle: "Founder, Morrow & Co",
        authorImage: "https://picsum.photos/seed/saas-hannah-schmitt/120/120",
        authorImageAlt: "Hannah Schmitt",
        tone: "elevated",
      },
      {
        quote:
          "Still the cleanest implementation work I've seen in 12 years of running engineering teams.",
        authorName: "Naomi Wright",
        authorTitle: "CEO, Rivermark",
        authorImage: "https://picsum.photos/seed/saas-naomi-wright/120/120",
        authorImageAlt: "Naomi Wright",
      },
    ],
  },
};

/** Brazilian e-commerce — pt-BR copy, muted background, 4 columns */
export const BrazilianEcomWall: Story = {
  args: {
    eyebrow: "Lojistas conectados",
    headline: "1.847 lojas que trocaram a planilha pelo nosso painel.",
    subheadline:
      "Pegamos as histórias que mais nos ensinaram nos últimos seis meses. Algumas curtas, outras longas — todas verificadas pelo time de sucesso.",
    columns: 4,
    tone: "muted",
    items: [
      {
        quote:
          "Saímos de quatro planilhas para um painel que a equipe inteira consulta antes da reunião de segunda.",
        authorName: "Tainá Albuquerque",
        authorTitle: "Sócia, Ateliê Sertão",
        authorImage:
          "https://picsum.photos/seed/ecom-taina-albuquerque/120/120",
        authorImageAlt: "Tainá Albuquerque",
        tag: "Operações",
        tone: "elevated",
      },
      {
        quote: "Estoque parou de divergir. Só isso já valeu o ano.",
        authorName: "Henrique Vasconcellos",
        authorTitle: "CFO, Maré Calçados",
        authorImage: "https://picsum.photos/seed/ecom-henrique-vasc/120/120",
        authorImageAlt: "Henrique Vasconcellos",
      },
      {
        quote:
          "A conversão na ficha de produto subiu 23,4% em três meses — sem mudar uma linha do checkout.",
        authorName: "Larissa Mendonça",
        authorTitle: "Head de Produto, Cravo & Canela",
        authorImage: "https://picsum.photos/seed/ecom-larissa-mendonca/120/120",
        authorImageAlt: "Larissa Mendonça",
        tone: "accent",
      },
      {
        quote:
          "Atendimento responde em 90 segundos no horário de pico. Antes a gente respondia no outro dia.",
        authorName: "Beatriz Okazaki",
        authorTitle: "Atendimento, Selva Brasil",
        authorImage: "https://picsum.photos/seed/ecom-beatriz-okazaki/120/120",
        authorImageAlt: "Beatriz Okazaki",
        tag: "SLA",
      },
      {
        quote:
          "Migrei sozinho num domingo à tarde. Segunda já estava vendendo.",
        authorName: "Diogo Antunes",
        authorTitle: "Sócio-fundador, Estação Café",
        authorImage: "https://picsum.photos/seed/ecom-diogo-antunes/120/120",
        authorImageAlt: "Diogo Antunes",
        tone: "outline",
      },
      {
        quote:
          "O time financeiro fechou o mês em três horas, contra três dias antes. O ROI foi imediato.",
        authorName: "Carla Bittencourt",
        authorTitle: "Controller, Vento Norte",
        authorImage:
          "https://picsum.photos/seed/ecom-carla-bittencourt/120/120",
        authorImageAlt: "Carla Bittencourt",
      },
      {
        quote: "Suporte que entende e-commerce de verdade. Raro.",
        authorName: "Yago Marçal",
        authorTitle: "Gerente, Doce Forno",
        authorImage: "https://picsum.photos/seed/ecom-yago-marcal/120/120",
        authorImageAlt: "Yago Marçal",
        tone: "elevated",
      },
      {
        quote:
          "Conseguimos abrir três marketplaces num mês porque o catálogo finalmente estava limpo.",
        authorName: "Renata Pessanha",
        authorTitle: "Diretora Comercial, Manacá Decor",
        authorImage: "https://picsum.photos/seed/ecom-renata-pessanha/120/120",
        authorImageAlt: "Renata Pessanha",
        tag: "Multi-canal",
      },
    ],
  },
};

/** Editorial agency — minimal frame, 6 quotes, 2 columns, accent-led */
export const AgencyEditorial: Story = {
  args: {
    eyebrow: "Selected words",
    headline: "Six clients. Six stories we kept thinking about.",
    columns: 2,
    tone: "neutral",
    items: [
      {
        quote:
          "They asked uncomfortable questions in week one — about pricing, about positioning, about the team. The answers reshaped the launch in ways we wouldn't have arrived at alone, and a year later we're still using the same operating notes.",
        authorName: "Lucia Federighi",
        authorTitle: "Founder, Federighi & Daughters",
        authorImage:
          "https://picsum.photos/seed/agency-lucia-federighi/120/120",
        authorImageAlt: "Lucia Federighi",
        tag: "Repositioning",
        tone: "accent",
      },
      {
        quote: "The strategy memo arrived in week two and is still on my wall.",
        authorName: "Theo Nakashima",
        authorTitle: "Co-founder, Outpost Coffee",
        authorImage: "https://picsum.photos/seed/agency-theo-nakashima/120/120",
        authorImageAlt: "Theo Nakashima",
      },
      {
        quote:
          "Three weeks in, our website read like the company we're trying to become — not the company we used to be.",
        authorName: "Saskia Lindqvist",
        authorTitle: "CEO, Bryggen Studio",
        authorImage:
          "https://picsum.photos/seed/agency-saskia-lindqvist/120/120",
        authorImageAlt: "Saskia Lindqvist",
        tone: "outline",
      },
      {
        quote: "Best money we've spent on a partner this year. Period.",
        authorName: "Adaeze Mensah",
        authorTitle: "Head of Brand, Junior Industries",
        authorImage: "https://picsum.photos/seed/agency-adaeze-mensah/120/120",
        authorImageAlt: "Adaeze Mensah",
        tone: "elevated",
      },
      {
        quote:
          "We hired six agencies before this one. Only this team treated our retail catalog like a brand artifact instead of a content task.",
        authorName: "Kenji Aldama",
        authorTitle: "VP Retail, Salt & Stone",
        authorImage: "https://picsum.photos/seed/agency-kenji-aldama/120/120",
        authorImageAlt: "Kenji Aldama",
        tag: "Retail rebrand",
      },
      {
        quote:
          "I read the kickoff doc three times. Then I forwarded it to my chairman.",
        authorName: "Inés Borrego",
        authorTitle: "CEO, Pampa Hospitality",
        authorImage: "https://picsum.photos/seed/agency-ines-borrego/120/120",
        authorImageAlt: "Inés Borrego",
      },
    ],
  },
};

/** Indie product — minimal, no eyebrow, just a wall */
export const IndieProductNoHeader: Story = {
  args: {
    columns: 3,
    tone: "muted",
    items: [
      {
        quote:
          "Set up in 11 minutes, shipped my first invoice the same evening.",
        authorName: "Adrian Barros",
        authorTitle: "Freelance illustrator, São Paulo",
        authorImage: "https://picsum.photos/seed/indie-adrian-barros/120/120",
        authorImageAlt: "Adrian Barros",
        tone: "elevated",
      },
      {
        quote: "The keyboard shortcuts are the reason I switched.",
        authorName: "Hyun-jin Park",
        authorTitle: "Product designer, Seoul",
        authorImage: "https://picsum.photos/seed/indie-hyunjin-park/120/120",
        authorImageAlt: "Hyun-jin Park",
      },
      {
        quote:
          "Feels like an old-school Mac app — fast, opinionated, no nag screens, no upgrade prompts. Genuinely a relief.",
        authorName: "Marcela Ostrowski",
        authorTitle: "Solo founder, Curitiba",
        authorImage:
          "https://picsum.photos/seed/indie-marcela-ostrowski/120/120",
        authorImageAlt: "Marcela Ostrowski",
        tag: "Indie review",
        tone: "accent",
      },
      {
        quote: "Charged me once. Worked forever. Wild concept in 2026.",
        authorName: "Tom Vereecken",
        authorTitle: "Hardware tinkerer, Antwerp",
        authorImage: "https://picsum.photos/seed/indie-tom-vereecken/120/120",
        authorImageAlt: "Tom Vereecken",
        tone: "outline",
      },
      {
        quote: "Replaced three subscriptions with this one app and a textfile.",
        authorName: "Priya Devraj",
        authorTitle: "Engineer, Bangalore",
        authorImage: "https://picsum.photos/seed/indie-priya-devraj/120/120",
        authorImageAlt: "Priya Devraj",
      },
      {
        quote:
          "Built it themselves, fixed my bug in 36 hours, sent me a sticker. Refreshing.",
        authorName: "Imani Carter",
        authorTitle: "Educator, Atlanta",
        authorImage: "https://picsum.photos/seed/indie-imani-carter/120/120",
        authorImageAlt: "Imani Carter",
        tag: "Bug report",
      },
    ],
  },
};

/** Healthcare — long-form quotes, 2 columns, calmer rhythm */
export const HealthcareLongForm: Story = {
  args: {
    eyebrow: "Field reports",
    headline: "Practitioners explaining what changed.",
    subheadline:
      "Anonymized excerpts from quarterly reviews. Numbers were reconciled by NQF in January 2026.",
    columns: 2,
    tone: "neutral",
    items: [
      {
        quote:
          "Time-from-referral-to-care dropped from 47 days to 11. Nothing about that would have happened without the protocol document the team handed us in the fourth week — written for our staff, not their template library.",
        authorName: "Dr. David Okafor",
        authorTitle: "Chief Medical Officer, Aurora Health Network",
        authorImage: "https://picsum.photos/seed/health-david-okafor/120/120",
        authorImageAlt: "Dr. David Okafor",
        tag: "14 clinics audited",
        tone: "elevated",
      },
      {
        quote:
          "We finally have one source of truth across the four clinics. The administrative load on our nursing leads dropped by what we estimate is six hours per week per person.",
        authorName: "Bárbara Ferreira",
        authorTitle: "Diretora Clínica, Rede Vida Plena",
        authorImage:
          "https://picsum.photos/seed/health-barbara-ferreira/120/120",
        authorImageAlt: "Bárbara Ferreira",
      },
      {
        quote:
          "The intake form alone — that one redesign — paid for the whole engagement. Patients complete it in three minutes instead of fourteen, and they don't drop out at the insurance step anymore.",
        authorName: "Dr. Naveen Iyengar",
        authorTitle: "Founder, Sequoia Family Medicine",
        authorImage: "https://picsum.photos/seed/health-naveen-iyengar/120/120",
        authorImageAlt: "Dr. Naveen Iyengar",
        tone: "accent",
      },
      {
        quote:
          "Our triage nurses keep telling me how much calmer the floor feels. I trust their read more than any dashboard.",
        authorName: "Lena Kowalski",
        authorTitle: "Director of Operations, North Forest Health",
        authorImage: "https://picsum.photos/seed/health-lena-kowalski/120/120",
        authorImageAlt: "Lena Kowalski",
        tone: "outline",
      },
    ],
  },
};

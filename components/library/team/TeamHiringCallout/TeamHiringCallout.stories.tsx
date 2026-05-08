import type { Meta, StoryObj } from "@storybook/react";
import TeamHiringCallout from "./index";

const meta: Meta<typeof TeamHiringCallout> = {
  title: "Team/TeamHiringCallout",
  component: TeamHiringCallout,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["light", "dark"] },
  },
};
export default meta;
type Story = StoryObj<typeof TeamHiringCallout>;

/* ------------------------------------------------------------------ */
/*  Health-tech scaleup — 6 members, 5 roles, 5 perks, dark tone       */
/* ------------------------------------------------------------------ */

export const HealthTechScaleup: Story = {
  args: {
    eyebrow: "Estamos contratando",
    headline:
      "Trinta e sete pessoas, oito ainda por contratar até o fim do trimestre",
    subheadline:
      "Construímos software clínico que roda em hospitais públicos brasileiros. Buscamos gente que já tenha tocado um sistema em produção com SLA — não dá pra aprender no caminho. Estágio remoto, sede em São Paulo.",
    teamMembers: [
      {
        name: "Dra. Priya Iyengar",
        role: "Co-fundadora · CEO",
        image: "https://picsum.photos/seed/hire-priya/400/400",
        imageAlt: "Dra. Priya Iyengar em consultório com luz lateral",
      },
      {
        name: "Akira Watanabe",
        role: "Co-fundador · CTO",
        image: "https://picsum.photos/seed/hire-akira/400/400",
        imageAlt: "Akira Watanabe em pair programming na sala da engenharia",
      },
      {
        name: "Ngozi Adekunle",
        role: "Head de produto",
        image: "https://picsum.photos/seed/hire-ngozi/400/400",
        imageAlt: "Ngozi Adekunle conduzindo design review no quadro branco",
      },
      {
        name: "Mateo Vargas",
        role: "Head de operações",
        image: "https://picsum.photos/seed/hire-mateo/400/400",
        imageAlt: "Mateo Vargas em videochamada com hospital cliente",
      },
      {
        name: "Larissa Tonon",
        role: "Líder de engenharia · Backend",
        image: "https://picsum.photos/seed/hire-larissa/400/400",
        imageAlt: "Larissa Tonon revisando arquitetura no quadro magnético",
      },
      {
        name: "Raphael Mwangi",
        role: "Diretor médico",
        image: "https://picsum.photos/seed/hire-raphael/400/400",
        imageAlt: "Dr. Raphael Mwangi durante reunião com equipa de pesquisa",
      },
    ],
    roles: [
      {
        title: "Engenheira(o) backend sênior · Plataforma clínica",
        department: "Engineering",
        location: "Remoto · Brasil",
        applyUrl: "/jobs/backend-senior-clinica",
        employmentType: "CLT",
      },
      {
        title: "SRE · Plataforma de saúde 24/7",
        department: "Infrastructure",
        location: "São Paulo · Híbrido",
        applyUrl: "/jobs/sre",
        employmentType: "CLT",
      },
      {
        title: "Product designer sênior · Fluxo hospitalar",
        department: "Product",
        location: "Remoto · LatAm",
        applyUrl: "/jobs/product-designer",
        employmentType: "CLT",
      },
      {
        title: "Implementation lead · Hospitais SUS",
        department: "Operations",
        location: "Recife · Híbrido",
        applyUrl: "/jobs/implementation-recife",
        employmentType: "CLT",
      },
      {
        title: "Médica(o) consultor · Integração clínica",
        department: "Clinical",
        location: "Remoto · 20h",
        applyUrl: "/jobs/medico-consultor",
        employmentType: "PJ · 20h",
      },
    ],
    perks: [
      { icon: "🏥", label: "Plano de saúde sem coparticipação" },
      { icon: "🏠", label: "Trabalho remoto desde 2019" },
      { icon: "📈", label: "Equity para todo o time" },
      { icon: "🌎", label: "Oito dias presenciais por trimestre" },
      { icon: "🍃", label: "30 dias de férias + recesso de fim de ano" },
    ],
    ctaText: "Ver todas as vagas",
    ctaUrl: "/carreiras",
    tone: "dark",
  },
};

/* ------------------------------------------------------------------ */
/*  Creative agency — 4 members, 4 roles, 4 perks, light tone          */
/* ------------------------------------------------------------------ */

export const CreativeAgency: Story = {
  args: {
    eyebrow: "Build with us",
    headline: "Four open seats in the next twelve weeks",
    subheadline:
      "We are a fourteen-person studio doubling down on motion and editorial. The four roles below are the entire hiring plan for 2026 — there is no junior backfill behind them. Every interview ends with the team you will work with.",
    teamMembers: [
      {
        name: "Ines Cavalcanti",
        role: "Partner · Creative Director",
        image: "https://picsum.photos/seed/hire-agency-ines/400/400",
        imageAlt: "Ines Cavalcanti at studio review wall covered with prints",
      },
      {
        name: "Tomás Restrepo",
        role: "Partner · Strategy",
        image: "https://picsum.photos/seed/hire-agency-tomas/400/400",
        imageAlt: "Tomás Restrepo at standing desk reviewing brief documents",
      },
      {
        name: "Sungho Park",
        role: "Director · Motion",
        image: "https://picsum.photos/seed/hire-agency-sungho/400/400",
        imageAlt:
          "Sungho Park editing animation timeline at color-graded monitor",
      },
      {
        name: "Beatrice Halloran",
        role: "Director · Production",
        image: "https://picsum.photos/seed/hire-agency-beatrice/400/400",
        imageAlt:
          "Beatrice Halloran reviewing project schedule at studio kitchen island",
      },
    ],
    roles: [
      {
        title: "Senior Motion Designer · Editorial brand work",
        department: "Motion",
        location: "Brooklyn · Hybrid",
        applyUrl: "/careers/senior-motion",
        employmentType: "Full-time",
      },
      {
        title: "Mid-level Brand Designer",
        department: "Brand",
        location: "Brooklyn · Hybrid",
        applyUrl: "/careers/mid-brand",
        employmentType: "Full-time",
      },
      {
        title: "Producer · Long-form campaigns",
        department: "Production",
        location: "Remote · US",
        applyUrl: "/careers/producer",
        employmentType: "Full-time",
      },
      {
        title: "Strategist · Cultural research",
        department: "Strategy",
        location: "Brooklyn · 4 days in office",
        applyUrl: "/careers/strategist",
        employmentType: "Full-time",
      },
    ],
    perks: [
      { icon: "✈️", label: "Annual studio onsite in Lisbon" },
      { icon: "🎨", label: "$2,400 yearly culture stipend" },
      { icon: "🩺", label: "Full health, dental, vision" },
      { icon: "🌅", label: "Half-day Fridays, year-round" },
    ],
    ctaText: "See full hiring plan",
    ctaUrl: "/careers/2026-plan",
    tone: "light",
  },
};

/* ------------------------------------------------------------------ */
/*  Boutique law firm — 5 members, 3 roles, no perks, light tone       */
/* ------------------------------------------------------------------ */

export const BoutiqueLawFirm: Story = {
  args: {
    eyebrow: "Lateral hires · 2026",
    headline: "Three lateral seats, all partner-track",
    subheadline:
      "We grow through laterals, not summer associates. The three openings below are filled by referral or by the candidates who reach out directly through the link beside each role. Compensation transparent in the JD.",
    teamMembers: [
      {
        name: "Eleanor Guimarães",
        role: "Managing Partner",
        image: "https://picsum.photos/seed/hire-law-eleanor/400/400",
        imageAlt: "Eleanor Guimarães in firm conference room",
      },
      {
        name: "Marcus Aldenberg",
        role: "Senior Partner · Litigation",
        image: "https://picsum.photos/seed/hire-law-marcus/400/400",
        imageAlt: "Marcus Aldenberg in firm library",
      },
      {
        name: "Yara Khoury",
        role: "Partner · Tax",
        image: "https://picsum.photos/seed/hire-law-yara/400/400",
        imageAlt: "Yara Khoury at office desk reviewing brief",
      },
      {
        name: "Theodore Imai",
        role: "Partner · Real Estate",
        image: "https://picsum.photos/seed/hire-law-theodore/400/400",
        imageAlt: "Theodore Imai near window with city view",
      },
      {
        name: "Amaya Bertoldi",
        role: "Partner · Employment",
        image: "https://picsum.photos/seed/hire-law-amaya/400/400",
        imageAlt: "Amaya Bertoldi at standing desk reviewing case file",
      },
    ],
    roles: [
      {
        title: "Senior Associate · Cross-border M&A",
        department: "Corporate",
        location: "New York",
        applyUrl: "/careers/senior-associate-ma",
        employmentType: "Partner-track",
      },
      {
        title: "Of Counsel · International Tax",
        department: "Tax",
        location: "Miami · Hybrid",
        applyUrl: "/careers/of-counsel-tax",
        employmentType: "Of Counsel",
      },
      {
        title: "Senior Associate · Privacy & AI Governance",
        department: "Privacy & Tech",
        location: "Boston",
        applyUrl: "/careers/senior-associate-privacy",
        employmentType: "Partner-track",
      },
    ],
    ctaText: "Read our compensation memo",
    ctaUrl: "/careers/compensation",
    tone: "light",
  },
};

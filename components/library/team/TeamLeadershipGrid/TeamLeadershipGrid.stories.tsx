import type { Meta, StoryObj } from "@storybook/react";
import TeamLeadershipGrid from "./index";

const meta: Meta<typeof TeamLeadershipGrid> = {
  title: "Team/TeamLeadershipGrid",
  component: TeamLeadershipGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: { control: "select", options: [3, 4] },
    cardMood: { control: "select", options: ["calm", "framed"] },
  },
};
export default meta;
type Story = StoryObj<typeof TeamLeadershipGrid>;

/** Brazilian design studio leadership — calm portraits, four columns. */
export const StudioLeadership: Story = {
  args: {
    eyebrow: "Quem conduz",
    headline: "Oito sócios, três cidades, um jeito de trabalhar",
    description:
      "Conheça quem assina cada projeto que sai do estúdio. Atendemos diretamente — sem camadas de gerenciamento entre você e quem está desenhando.",
    columns: 4,
    cardMood: "calm",
    ctaText: "Como trabalhamos",
    ctaUrl: "/processo",
    members: [
      {
        name: "Mariana Cardoso",
        role: "Sócia · Direção criativa",
        tagline: "Identidade visual e direção de arte para marcas culturais.",
        image: "https://picsum.photos/seed/team-mariana/600/750",
        imageAlt: "Retrato de Mariana Cardoso em estúdio com luz natural",
        href: "/equipe/mariana-cardoso",
        location: "São Paulo",
      },
      {
        name: "Rafael Tavares",
        role: "Sócio · Estratégia de marca",
        tagline: "Posicionamento, naming e narrativa para B2B.",
        image: "https://picsum.photos/seed/team-rafael/600/750",
        imageAlt: "Retrato de Rafael Tavares em frente a parede de cortiça",
        href: "/equipe/rafael-tavares",
        location: "Lisboa",
      },
      {
        name: "Bianca Okazaki",
        role: "Sócia · Design de produto",
        tagline: "Produtos digitais, sistemas e tooling interno.",
        image: "https://picsum.photos/seed/team-bianca/600/750",
        imageAlt: "Retrato de Bianca Okazaki em escrivaninha com monitor",
        href: "/equipe/bianca-okazaki",
        location: "Curitiba",
      },
      {
        name: "Daniel Schroeter",
        role: "Sócio · Tecnologia",
        tagline: "Engenharia front-end, Next.js e CMS headless.",
        image: "https://picsum.photos/seed/team-daniel/600/750",
        imageAlt: "Retrato de Daniel Schroeter ao lado de janela",
        href: "/equipe/daniel-schroeter",
        location: "Lisboa · Remoto",
      },
      {
        name: "Joana Linhares",
        role: "Diretora de fotografia",
        tagline: "Direção e produção de campanhas de imagem.",
        image: "https://picsum.photos/seed/team-joana/600/750",
        imageAlt: "Retrato de Joana Linhares com câmera nas mãos",
        location: "São Paulo",
      },
      {
        name: "Clara Mendes",
        role: "Coordenadora de produção",
        tagline: "Cronogramas, fornecedores e gestão de obra gráfica.",
        image: "https://picsum.photos/seed/team-clara/600/750",
        imageAlt: "Retrato de Clara Mendes em mesa de reunião",
        location: "Curitiba",
      },
      {
        name: "Vinicius Almeida",
        role: "Designer sênior",
        tagline: "Tipografia, sistemas editoriais e impressos.",
        image: "https://picsum.photos/seed/team-vinicius/600/750",
        imageAlt: "Retrato de Vinicius Almeida em ateliê tipográfico",
        location: "São Paulo",
      },
      {
        name: "Aline Sato",
        role: "Designer sênior",
        tagline: "Embalagem, branding e identidade aplicada.",
        image: "https://picsum.photos/seed/team-aline/600/750",
        imageAlt: "Retrato de Aline Sato em frente a parede de embalagens",
        location: "São Paulo",
      },
    ],
  },
};

/** Boutique law firm — framed cards, three columns, English. */
export const LawFirmPartners: Story = {
  args: {
    eyebrow: "Partners — 2026",
    headline: "Six partners, four practice areas, one mailing address",
    description:
      "We are a full-service firm structured around our partners. Every matter is led by one of the six attorneys below, not handed off to an associate after intake.",
    columns: 3,
    cardMood: "framed",
    ctaText: "See our practice areas",
    ctaUrl: "/practice",
    members: [
      {
        name: "Eleanor Guimarães",
        role: "Managing Partner",
        tagline: "Cross-border M&A and corporate restructuring.",
        image: "https://picsum.photos/seed/lawfirm-eleanor/600/750",
        imageAlt: "Eleanor Guimarães in firm conference room",
        href: "/team/eleanor-guimaraes",
        location: "New York",
      },
      {
        name: "Marcus Aldenberg",
        role: "Senior Partner · Litigation",
        tagline: "Complex commercial disputes and arbitration.",
        image: "https://picsum.photos/seed/lawfirm-marcus/600/750",
        imageAlt: "Marcus Aldenberg in firm library",
        href: "/team/marcus-aldenberg",
        location: "New York",
      },
      {
        name: "Yara Khoury",
        role: "Partner · Tax",
        tagline: "International tax planning and compliance.",
        image: "https://picsum.photos/seed/lawfirm-yara/600/750",
        imageAlt: "Yara Khoury at office desk",
        href: "/team/yara-khoury",
        location: "Miami",
      },
      {
        name: "Theodore Imai",
        role: "Partner · Real Estate",
        tagline: "Commercial leasing, acquisitions and zoning.",
        image: "https://picsum.photos/seed/lawfirm-theodore/600/750",
        imageAlt: "Theodore Imai near window with city view",
        href: "/team/theodore-imai",
        location: "Chicago",
      },
      {
        name: "Amaya Bertoldi",
        role: "Partner · Employment",
        tagline: "Labour disputes, executive separation, ESG counsel.",
        image: "https://picsum.photos/seed/lawfirm-amaya/600/750",
        imageAlt: "Amaya Bertoldi at standing desk",
        href: "/team/amaya-bertoldi",
        location: "Boston",
      },
      {
        name: "Henrik Solberg",
        role: "Partner · Privacy & Tech",
        tagline: "Data privacy, AI governance, software licensing.",
        image: "https://picsum.photos/seed/lawfirm-henrik/600/750",
        imageAlt: "Henrik Solberg in modern office lobby",
        href: "/team/henrik-solberg",
        location: "Boston",
      },
    ],
  },
};

/** Health-tech startup — small founding team, four columns, calm. */
export const StartupFoundingTeam: Story = {
  args: {
    eyebrow: "The first ten",
    headline: "We hired ten people before we hired a head of HR",
    description:
      "Almost everyone here came from clinical practice, biotech, or product. We will tell you exactly who you would be working with on day one.",
    columns: 4,
    cardMood: "calm",
    members: [
      {
        name: "Dr. Priya Iyengar",
        role: "Co-founder · CEO",
        tagline: "Twelve years as a hospital pharmacist before this.",
        image: "https://picsum.photos/seed/health-priya/600/750",
        imageAlt: "Dr. Priya Iyengar in clinic-style office",
        location: "Toronto",
      },
      {
        name: "Akira Watanabe",
        role: "Co-founder · CTO",
        tagline: "Built two FHIR-grade backends before joining.",
        image: "https://picsum.photos/seed/health-akira/600/750",
        imageAlt: "Akira Watanabe pair-programming with junior engineer",
        location: "Toronto",
      },
      {
        name: "Ngozi Adekunle",
        role: "Head of Product",
        tagline: "Designs the discharge workflow your nurses will use.",
        image: "https://picsum.photos/seed/health-ngozi/600/750",
        imageAlt: "Ngozi Adekunle running design review at whiteboard",
        location: "Toronto · Remote",
      },
      {
        name: "Mateo Vargas",
        role: "Head of Operations",
        tagline: "Implementation, training, and customer success.",
        image: "https://picsum.photos/seed/health-mateo/600/750",
        imageAlt: "Mateo Vargas on a video call with hospital staff",
        location: "Mexico City",
      },
    ],
  },
};

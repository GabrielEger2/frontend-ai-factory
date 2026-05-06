import type { Meta, StoryObj } from "@storybook/react";
import TeamCarousel from "./index";

const meta: Meta<typeof TeamCarousel> = {
  title: "Team/TeamCarousel",
  component: TeamCarousel,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TeamCarousel>;

/** Mid-sized agency — 11 members across departments, default sizing. */
export const AgencyTeam: Story = {
  args: {
    eyebrow: "Quem você vai conhecer",
    headline:
      "Onze pessoas, três continentes, zero camadas entre você e o trabalho",
    description:
      "Toda conta tem um responsável sênior dedicado. Sem account manager genérico, sem repasse para júnior depois do briefing.",
    members: [
      {
        name: "Mariana Cardoso",
        role: "Direção criativa",
        tagline:
          "Identidade, embalagem, direção de arte para marcas culturais.",
        image: "https://picsum.photos/seed/agency-mariana/640/800",
        imageAlt: "Mariana Cardoso em estúdio com prova impressa nas mãos",
        href: "/equipe/mariana-cardoso",
        meta: "12 anos",
      },
      {
        name: "Rafael Tavares",
        role: "Estratégia",
        tagline: "Posicionamento, naming e narrativa para B2B e SaaS.",
        image: "https://picsum.photos/seed/agency-rafael/640/800",
        imageAlt: "Rafael Tavares em frente a parede de cortiça com post-its",
        href: "/equipe/rafael-tavares",
        meta: "Lisboa",
      },
      {
        name: "Bianca Okazaki",
        role: "Design de produto",
        tagline: "Apps, dashboards e tooling interno.",
        image: "https://picsum.photos/seed/agency-bianca/640/800",
        imageAlt: "Bianca Okazaki em escrivaninha com monitor duplo",
        href: "/equipe/bianca-okazaki",
        meta: "Curitiba",
      },
      {
        name: "Daniel Schroeter",
        role: "Engenharia",
        tagline: "Next.js, headless CMS, performance.",
        image: "https://picsum.photos/seed/agency-daniel/640/800",
        imageAlt: "Daniel Schroeter ao lado de janela com luz natural",
        href: "/equipe/daniel-schroeter",
        meta: "Lisboa · Remoto",
      },
      {
        name: "Joana Linhares",
        role: "Direção de fotografia",
        tagline: "Direção de imagem para campanhas e editoriais.",
        image: "https://picsum.photos/seed/agency-joana/640/800",
        imageAlt: "Joana Linhares ajustando câmera em set",
        href: "/equipe/joana-linhares",
        meta: "São Paulo",
      },
      {
        name: "Clara Mendes",
        role: "Coordenação de produção",
        tagline: "Cronogramas, orçamentos e gestão de fornecedores.",
        image: "https://picsum.photos/seed/agency-clara/640/800",
        imageAlt: "Clara Mendes em sala de reunião com plano impresso",
        href: "/equipe/clara-mendes",
        meta: "Curitiba",
      },
      {
        name: "Vinicius Almeida",
        role: "Design sênior",
        tagline: "Tipografia, sistemas editoriais, impressos.",
        image: "https://picsum.photos/seed/agency-vinicius/640/800",
        imageAlt: "Vinicius Almeida em ateliê tipográfico",
        href: "/equipe/vinicius-almeida",
        meta: "São Paulo",
      },
      {
        name: "Aline Sato",
        role: "Design sênior",
        tagline: "Embalagem, branding aplicado, identidade.",
        image: "https://picsum.photos/seed/agency-aline/640/800",
        imageAlt: "Aline Sato em frente a parede de embalagens",
        href: "/equipe/aline-sato",
        meta: "São Paulo",
      },
      {
        name: "Henrique Borges",
        role: "Motion designer",
        tagline: "Animação 2D, identidade animada, redes sociais.",
        image: "https://picsum.photos/seed/agency-henrique/640/800",
        imageAlt: "Henrique Borges em estação de trabalho com tablet gráfico",
        href: "/equipe/henrique-borges",
        meta: "Curitiba",
      },
      {
        name: "Beatriz Pavão",
        role: "Atendimento sênior",
        tagline: "Briefing, alinhamento e gestão de cliente.",
        image: "https://picsum.photos/seed/agency-beatriz/640/800",
        imageAlt: "Beatriz Pavão em videoconferência sorrindo",
        href: "/equipe/beatriz-pavao",
        meta: "São Paulo",
      },
      {
        name: "Gustavo Rangel",
        role: "Ilustração",
        tagline: "Editorial, livro infantil, identidade ilustrada.",
        image: "https://picsum.photos/seed/agency-gustavo/640/800",
        imageAlt: "Gustavo Rangel com mesa cheia de aquarelas",
        href: "/equipe/gustavo-rangel",
        meta: "Lisboa",
      },
    ],
  },
};

/** Restaurant group — kitchen and front-of-house, smaller cards. */
export const RestaurantGroupCrew: Story = {
  args: {
    eyebrow: "Cozinha & salão",
    headline: "Quem está na cozinha quando você reserva mesa",
    description:
      "Nosso grupo opera quatro casas no Rio e em Lisboa. Os chefes-de-cozinha e gerentes abaixo respondem por cada operação.",
    cardWidth: 280,
    cardGap: 16,
    members: [
      {
        name: "Chef Ricardo Fonseca",
        role: "Chef-executivo",
        tagline: "Direção culinária do grupo desde 2019.",
        image: "https://picsum.photos/seed/rest-ricardo/640/800",
        imageAlt: "Chef Ricardo Fonseca emplatando em cozinha aberta",
        meta: "Grupo",
      },
      {
        name: "Chef Tatiana Yoshimura",
        role: "Chef · Casa Botafogo",
        tagline:
          "Cozinha contemporânea brasileira com base em ingredientes locais.",
        image: "https://picsum.photos/seed/rest-tatiana/640/800",
        imageAlt: "Chef Tatiana Yoshimura conferindo prato no passe",
        meta: "Rio de Janeiro",
      },
      {
        name: "Chef Pietro Lavandeira",
        role: "Chef · Casa Príncipe Real",
        tagline: "Cozinha de inspiração mediterrânica e produto português.",
        image: "https://picsum.photos/seed/rest-pietro/640/800",
        imageAlt: "Chef Pietro Lavandeira na bancada de mise en place",
        meta: "Lisboa",
      },
      {
        name: "Chef Iracema Bastos",
        role: "Chef · Casa Leblon",
        tagline: "Sazonal, produtos do mar, fogo a lenha.",
        image: "https://picsum.photos/seed/rest-iracema/640/800",
        imageAlt: "Chef Iracema Bastos ajustando brasa no forno",
        meta: "Rio de Janeiro",
      },
      {
        name: "Letícia Pizzato",
        role: "Sommelier-chefe",
        tagline: "Carta de vinhos das quatro casas.",
        image: "https://picsum.photos/seed/rest-leticia/640/800",
        imageAlt: "Letícia Pizzato servindo vinho em adega",
        meta: "Grupo",
      },
      {
        name: "Sebastião Mourão",
        role: "Maître · Casa Príncipe Real",
        tagline: "Operação de salão e reservas em Lisboa.",
        image: "https://picsum.photos/seed/rest-sebastiao/640/800",
        imageAlt: "Sebastião Mourão recepcionando hóspedes",
        meta: "Lisboa",
      },
      {
        name: "Cíntia Pacheco",
        role: "Gerente · Casa Botafogo",
        tagline: "Gestão da operação carioca e equipe de salão.",
        image: "https://picsum.photos/seed/rest-cintia/640/800",
        imageAlt: "Cíntia Pacheco organizando reservas no atril",
        meta: "Rio de Janeiro",
      },
    ],
  },
};

/** Tech company engineering team — wider cards, English copy. */
export const EngineeringDepartment: Story = {
  args: {
    eyebrow: "Engineering",
    headline: "The 14 people who keep the platform running",
    description:
      "Our platform serves 380 million events a day across 47 customer environments. The engineers below own that surface, on-call rotations included.",
    cardWidth: 360,
    members: [
      {
        name: "Yuki Tanabe",
        role: "VP Engineering",
        tagline: "Builds the org, sets the bar, owns the reliability target.",
        image: "https://picsum.photos/seed/eng-yuki/640/800",
        imageAlt: "Yuki Tanabe at a whiteboard during architecture review",
        href: "/team/yuki-tanabe",
        meta: "Tokyo",
      },
      {
        name: "Esme Doukouré",
        role: "Staff · Platform",
        tagline:
          "Owns the ingestion pipeline and the noisy-neighbor protections.",
        image: "https://picsum.photos/seed/eng-esme/640/800",
        imageAlt: "Esme Doukouré pair-programming with a colleague",
        href: "/team/esme-doukoure",
        meta: "London",
      },
      {
        name: "Hassan Mokhtar",
        role: "Staff · Storage",
        tagline:
          "Ten years on distributed databases. Cassandra, then ScyllaDB, now ours.",
        image: "https://picsum.photos/seed/eng-hassan/640/800",
        imageAlt: "Hassan Mokhtar reviewing dashboards on a wide monitor",
        href: "/team/hassan-mokhtar",
        meta: "Berlin",
      },
      {
        name: "Aisling O'Reilly",
        role: "Staff · Reliability",
        tagline: "Runs incident response and the shared on-call rotation.",
        image: "https://picsum.photos/seed/eng-aisling/640/800",
        imageAlt: "Aisling O'Reilly leading an incident review",
        href: "/team/aisling-oreilly",
        meta: "Dublin",
      },
      {
        name: "Tobias Ferreira",
        role: "Staff · Developer Experience",
        tagline:
          "CI, the SDK, and every internal tool you'd touch in week one.",
        image: "https://picsum.photos/seed/eng-tobias/640/800",
        imageAlt: "Tobias Ferreira giving a tooling demo",
        href: "/team/tobias-ferreira",
        meta: "São Paulo",
      },
      {
        name: "Nia Akinwale",
        role: "Senior · Frontend",
        tagline: "Owns the operator console and the design-system bridge.",
        image: "https://picsum.photos/seed/eng-nia/640/800",
        imageAlt: "Nia Akinwale at standing desk with design files",
        href: "/team/nia-akinwale",
        meta: "London",
      },
    ],
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import TeamJourneyTimeline from "./index";

const meta: Meta<typeof TeamJourneyTimeline> = {
  title: "Team/TeamJourneyTimeline",
  component: TeamJourneyTimeline,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TeamJourneyTimeline>;

/* ------------------------------------------------------------------ */
/*  Studio — design studio founded 2014, six milestones, today card    */
/* ------------------------------------------------------------------ */

export const DesignStudio: Story = {
  args: {
    eyebrow: "Nossa história",
    headline: "Doze anos a desenhar identidade visual em Pinheiros",
    description:
      "O estúdio começou com uma sócia, uma cadeira emprestada e três meses de aluguel pagos adiantados. Hoje somos doze pessoas, dois andares e uma agenda de projetos que vai até o fim do ano.",
    milestones: [
      {
        year: "2014",
        title: "A primeira sala alugada na Aspicuelta",
        description:
          "Mariana Cardoso saiu de uma agência grande com um cliente — uma livraria independente — e três meses de despesa garantida. A sala tinha 12 metros quadrados, uma janela e nenhum aquecedor.",
        image: "https://picsum.photos/seed/journey-2014/600/750",
        imageAlt: "Retrato de Mariana Cardoso na primeira sala do estúdio",
        personName: "Mariana Cardoso",
        personRole: "Sócia-fundadora",
      },
      {
        year: "2017",
        title: "Rafael entra como sócio de estratégia",
        description:
          "Depois de três anos como freelancer recorrente, Rafael Tavares aceitou virar sócio. A entrada coincidiu com a primeira identidade cultural premiada do estúdio — o festival Mirada — e com a mudança para um espaço de 80 m² na mesma rua.",
        image: "https://picsum.photos/seed/journey-2017/600/750",
        imageAlt: "Retrato de Rafael Tavares em frente à parede de cortiça",
        personName: "Rafael Tavares",
        personRole: "Sócio · estratégia",
      },
      {
        year: "2019",
        title: "Primeira encomenda internacional",
        description:
          "Editora portuguesa pediu a identidade de uma coleção de poesia africana. A obra rendeu menção honrosa nos Tipos Latinos de 2020 e abriu a porta para os primeiros clientes em Lisboa.",
      },
      {
        year: "2021",
        title: "Bianca lidera o braço de produto digital",
        description:
          "Com a demanda crescente por interfaces, Bianca Okazaki entrou como sócia para abrir uma vertical dedicada a design de produto. O estúdio se reorganizou em duas equipas paralelas, com revisão coletiva todas as quintas.",
        image: "https://picsum.photos/seed/journey-2021/600/750",
        imageAlt: "Retrato de Bianca Okazaki em mesa com monitores",
        personName: "Bianca Okazaki",
        personRole: "Sócia · design de produto",
      },
      {
        year: "2023",
        title: "Mudança para o casarão dos anos 40",
        description:
          "Compramos o casarão na Aspicuelta, depois de oito anos de aluguel na mesma rua. A reforma foi feita em quatro meses, com plantas pelo arquiteto Pedro Themudo e uma cozinha coletiva no centro do programa.",
      },
      {
        year: "2025",
        title: "Daniel monta o time de tecnologia",
        description:
          "Com o crescimento do braço digital, Daniel Schroeter entrou como sócio para liderar a frente de engenharia. Pela primeira vez o estúdio entrega um produto fim a fim — design + frontend + headless CMS — sem terceirizar.",
        image: "https://picsum.photos/seed/journey-2025/600/750",
        imageAlt: "Retrato de Daniel Schroeter ao lado de uma janela",
        personName: "Daniel Schroeter",
        personRole: "Sócio · tecnologia",
      },
    ],
    todayLabel: "Hoje",
    todayTitle: "Doze pessoas, dois andares e três cidades",
    todayDescription:
      "Em 2026 a equipe está distribuída entre São Paulo, Curitiba e Lisboa, com encontro presencial mensal no casarão. A agenda nova abre em outubro — atendemos quatro projetos novos por trimestre, indicados ou referenciados.",
    todayImage: "https://picsum.photos/seed/journey-today-studio/1200/720",
    todayImageAlt:
      "Foto coletiva da equipe do estúdio reunida na escada do casarão da Aspicuelta",
  },
};

/* ------------------------------------------------------------------ */
/*  Family bakery — five milestones across three generations, no CTA   */
/* ------------------------------------------------------------------ */

export const FamilyBakery: Story = {
  args: {
    eyebrow: "Three generations",
    headline:
      "From a Brooklyn cellar oven in 1962 to four storefronts and a wholesale program",
    description:
      "The bakery has changed hands twice without ever changing buildings. Each generation took the keys with the bread already proofing.",
    milestones: [
      {
        year: "1962",
        title: "Lorenzo Vassallo opens the cellar oven on Henry Street",
        description:
          "Lorenzo immigrated from Calabria in 1955 and worked seven years on a wholesale line in Carroll Gardens before signing the lease on a basement on Henry Street. The first oven was wood-fired and barely fit through the doorway.",
        image: "https://picsum.photos/seed/journey-bakery-1962/600/750",
        imageAlt: "Black-and-white portrait of Lorenzo Vassallo at the oven",
        personName: "Lorenzo Vassallo",
        personRole: "Founder · 1962-1989",
      },
      {
        year: "1989",
        title: "Sofia takes over the morning shift",
        description:
          "Lorenzo's daughter Sofia Vassallo had baked alongside her father since age nine. She took the lead on weekend service in 1989, then bought the bakery outright when Lorenzo retired in 1993. The wood oven stayed.",
        image: "https://picsum.photos/seed/journey-bakery-1989/600/750",
        imageAlt: "Sofia Vassallo shaping a loaf at the wooden bench",
        personName: "Sofia Vassallo",
        personRole: "Owner · 1989-2018",
      },
      {
        year: "2004",
        title: "Wholesale account with five neighborhood restaurants",
        description:
          "A chef around the corner asked for fifteen baguettes a day. Within a year that grew to a five-restaurant wholesale route delivered by handcart at 5:30am. The route still runs the same way, by the same hands, four days a week.",
      },
      {
        year: "2018",
        title: "Marco buys the bakery from his mother",
        description:
          "Sofia stepped back after a partial retirement in 2017. Her son Marco Vassallo, who had spent eight years running pastry programs in Paris and Rome, returned to Brooklyn and took on the lease. The hand-painted sign stayed exactly where it was.",
        image: "https://picsum.photos/seed/journey-bakery-2018/600/750",
        imageAlt: "Marco Vassallo behind the front counter at golden hour",
        personName: "Marco Vassallo",
        personRole: "Owner · 2018-present",
      },
      {
        year: "2023",
        title: "Three new storefronts and a viennoiserie program",
        description:
          "Marco opened a Williamsburg location in 2021, a Park Slope shop in 2022, and a Cobble Hill counter focused on viennoiserie in 2023. All four shops bake their bread from the original Henry Street starter, refreshed every twelve hours.",
      },
    ],
    todayLabel: "Today",
    todayTitle: "Four shops, one starter, the same Henry Street oven",
    todayDescription:
      "The original wood oven still bakes the morning bread for all four locations — the dough is mixed at 2am on Henry Street and driven out by 5am. Sofia comes in twice a week to taste the loaves before service.",
    todayImage: "https://picsum.photos/seed/journey-bakery-today/1200/720",
    todayImageAlt:
      "Marco, Sofia, and the bakery team in front of the original Henry Street storefront at sunrise",
  },
};

/* ------------------------------------------------------------------ */
/*  Architecture practice — short timeline, no portraits               */
/* ------------------------------------------------------------------ */

export const ArchitecturePractice: Story = {
  args: {
    eyebrow: "Sobre o atelier",
    headline:
      "Vinte e um anos de prática, dez sócios e duas mudanças de morada",
    milestones: [
      {
        year: "2003",
        title: "Inês deixa o escritório de Souto de Moura",
        description:
          "Depois de seis anos a colaborar em projetos de habitação no escritório do Eduardo Souto de Moura, Inês Castelo Branco abriu um pequeno atelier no centro do Porto. Os primeiros três anos foram dedicados a reabilitação de habitação unifamiliar.",
      },
      {
        year: "2009",
        title: "Primeira obra pública: a biblioteca de Vila do Conde",
        description:
          "O concurso da biblioteca municipal de Vila do Conde deu ao atelier a primeira obra pública e marcou a transição para uma operação com seis arquitetos seniores. A obra foi inaugurada em 2012.",
      },
      {
        year: "2014",
        title: "Mudança para o atelier no Bonfim",
        description:
          "Com a equipa em dez pessoas, o atelier deixou o escritório partilhado no centro e instalou-se num edifício industrial reabilitado no Bonfim, com sala de maquetes e oficina de cortiça no piso térreo.",
      },
      {
        year: "2019",
        title: "Reconhecimento internacional — publicação na El Croquis",
        description:
          "A casa do Monte, concluída em 2018, foi publicada num número monográfico da El Croquis dedicado à arquitetura portuguesa contemporânea. O atelier passou a integrar a lista de prática regular de comissões académicas de júri.",
      },
      {
        year: "2024",
        title: "Promoção de cinco arquitetos a sócios",
        description:
          "Pela primeira vez o atelier deixou de ser uma estrutura de sócia única — Inês promoveu cinco colaboradores a sócios, todos com pelo menos oito anos de casa. A operação passou a ser dirigida por um conselho de seis arquitetos.",
      },
    ],
    todayLabel: "Hoje",
    todayTitle: "Seis sócios, vinte arquitetos, três obras em curso",
    todayDescription:
      "Em 2026 o atelier mantém uma carteira de cerca de quinze projetos simultâneos, divididos entre habitação privada, pequeno equipamento público e reabilitação patrimonial. Damos sempre uma resposta dentro de cinco dias úteis.",
    todayImage: "https://picsum.photos/seed/journey-arch-today/1200/720",
    todayImageAlt:
      "Equipa do atelier reunida em frente à fachada do edifício industrial reabilitado no Bonfim",
  },
};

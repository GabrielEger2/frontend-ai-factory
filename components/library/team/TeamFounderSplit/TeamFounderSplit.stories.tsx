import type { Meta, StoryObj } from "@storybook/react";
import TeamFounderSplit from "./index";

const meta: Meta<typeof TeamFounderSplit> = {
  title: "Team/TeamFounderSplit",
  component: TeamFounderSplit,
  parameters: { layout: "fullscreen" },
  argTypes: {
    portraitSide: { control: "select", options: ["left", "right"] },
  },
};
export default meta;
type Story = StoryObj<typeof TeamFounderSplit>;

/** Brazilian design studio founder — portrait right, signature image. */
export const StudioFounder: Story = {
  args: {
    eyebrow: "Quem está por trás",
    headline: "Mariana abriu o estúdio em 2014 com um cliente e uma cadeira",
    founderName: "Mariana Cardoso",
    founderRole: "Sócia-fundadora · Direção criativa",
    portraitSide: "right",
    bioParagraphs: [
      "Antes de fundar o estúdio, Mariana passou seis anos numa agência de publicidade liderando contas culturais — Itaú Cultural, MASP, Festival de Inverno de Campos do Jordão. Saiu para abrir uma operação menor onde fosse possível atender direto, sem camadas.",
      "Hoje conduz a direção criativa em projetos de identidade visual, embalagem e direção de arte. Trabalha lado a lado com clientes, normalmente em pé, normalmente com café derramado em algum esboço. Acredita que marca cultural se faz com leitura, paciência e um briefing que cabe numa folha.",
      "Foi professora convidada na ESPM e na Faculdade Santa Marcelina entre 2019 e 2023. Assina projetos premiados pelo Brasil Design Award, ADP e Tipos Latinos.",
    ],
    image: "https://picsum.photos/seed/founder-mariana/700/875",
    imageAlt:
      "Retrato de Mariana Cardoso em estúdio iluminado por luz natural, segurando uma prova de impressão",
    signatureImage:
      "https://placehold.co/240x80/transparent/1a1a1a?text=Mariana+Cardoso&font=raleway",
    signatureAlt: "Assinatura manuscrita de Mariana Cardoso",
    credentials: [
      { label: "Brasil Design Award · 2023" },
      { label: "Tipos Latinos · 2022" },
      { label: "ADP — Associação dos Designers" },
      { label: "Ex-ESPM · Professora convidada" },
    ],
    ctaText: "Marcar uma conversa",
    ctaUrl: "/contato",
    secondaryCtaText: "Ler bio completa",
    secondaryCtaUrl: "/sobre/mariana-cardoso",
  },
};

/** Solo consultant — portrait left, no signature image, two paragraphs. */
export const FintechConsultant: Story = {
  args: {
    eyebrow: "Founder",
    headline: "I spent eleven years inside payments before going solo",
    founderName: "Adetokunbo Bankole",
    founderRole: "Principal · Bankole Advisory",
    portraitSide: "left",
    bioParagraphs: [
      "I led integrations and payment risk at two scale-stage fintechs in Lagos and London — first at a B2B card-issuing platform from Series B through Series D, then leading the merchant onboarding org at a UK acquirer until 2024.",
      "Bankole Advisory works with mid-market merchants and emerging fintechs on PSP selection, card-scheme negotiations, dispute and chargeback ops, and Africa-Europe corridor expansion. I take on three engagements at a time. Engagement size: 10–14 weeks.",
    ],
    image: "https://picsum.photos/seed/founder-bankole/700/875",
    imageAlt:
      "Adetokunbo Bankole standing near a window with city skyline behind",
    credentials: [
      { label: "Ex-Visa Europe · Risk lead" },
      { label: "MIT FinTech program · 2019" },
      { label: "African Payments Forum — Board" },
    ],
    ctaText: "Request engagement",
    ctaUrl: "/engage",
    secondaryCtaText: "Read 2025 letter to clients",
    secondaryCtaUrl: "/letters/2025",
  },
};

/** Architecture practice — portrait right, no credentials, three long paragraphs. */
export const ArchitectFounder: Story = {
  args: {
    eyebrow: "Sobre",
    headline: "Vinte e um anos a desenhar casas e edifícios públicos",
    founderName: "Inês Castelo Branco",
    founderRole: "Arquiteta · ICB Atelier",
    portraitSide: "right",
    bioParagraphs: [
      "Formada pela Faculdade de Arquitetura da Universidade do Porto em 2003, fundou o atelier em 2009 depois de seis anos no escritório de Souto de Moura. O atelier mantém-se pequeno por opção: um sócio, três arquitetos seniores, uma equipa de obra.",
      "O trabalho divide-se entre habitação unifamiliar, sobretudo no Norte de Portugal, e equipamentos públicos de pequena escala — bibliotecas, escolas, capelas. A reabilitação ocupa cerca de 40% da carteira; preferimos respirar com o existente do que apagá-lo.",
      "Projetos do atelier foram publicados na Casabella, El Croquis e Dezeen. A casa do Monte recebeu o Prémio AICA-MC de 2022. Damos sempre uma resposta dentro de cinco dias úteis.",
    ],
    image: "https://picsum.photos/seed/founder-ines/700/875",
    imageAlt:
      "Retrato de Inês Castelo Branco no atelier com maquetes de cortiça atrás",
    ctaText: "Conhecer o atelier",
    ctaUrl: "/sobre",
  },
};

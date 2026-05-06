import type { Meta, StoryObj } from "@storybook/react";
import TeamMemberSpotlight from "./index";

const meta: Meta<typeof TeamMemberSpotlight> = {
  title: "Team/TeamMemberSpotlight",
  component: TeamMemberSpotlight,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "muted", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof TeamMemberSpotlight>;

/** New senior hire — neutral tone, KPI credentials, primary CTA. */
export const NewSeniorHire: Story = {
  args: {
    eyebrow: "Bem-vinda ao estúdio",
    headline: "Bianca chega para liderar nossa prática de produto",
    memberName: "Bianca Okazaki",
    memberRole: "Sócia · Design de produto",
    quote:
      "Vim do mercado de SaaS porque queria voltar a desenhar produtos que duram mais que dois trimestres de roadmap. O estúdio aceitou que eu desenhasse o time como eu desenho um produto: com gente sênior, prazo honesto e linhas claras de quem decide o quê.",
    context: "Conversamos em fevereiro de 2026, no segundo dia dela",
    image: "https://picsum.photos/seed/spotlight-bianca/700/875",
    imageAlt:
      "Retrato de Bianca Okazaki em escrivaninha com monitor duplo e caderno de esboço aberto",
    credentials: [
      { value: "11", label: "Anos em produto" },
      { value: "23", label: "Apps embarcados" },
      { value: "4.7", label: "NPS de equipa anterior" },
      { value: "Curitiba", label: "Onde trabalha" },
    ],
    ctaText: "Ler bio completa",
    ctaUrl: "/equipe/bianca-okazaki",
    tone: "neutral",
  },
};

/** Department lead — muted tone, no KPIs, longer quote. */
export const HeadOfEngineering: Story = {
  args: {
    eyebrow: "Meet the team",
    headline: "Esme runs platform engineering",
    memberName: "Esme Doukouré",
    memberRole: "Head of Platform Engineering",
    quote:
      "We rebuilt the ingestion pipeline twice in three years. The first time we did it on top of the existing storage layer because deadlines. The second time we tore the storage layer out first because we'd learned what the actual write-path bottleneck was. The team that did the second rebuild is the team I want you to know.",
    context: "Recorded for the 2026 engineering update",
    image: "https://picsum.photos/seed/spotlight-esme/700/875",
    imageAlt: "Esme Doukouré at architecture review whiteboard, marker in hand",
    ctaText: "Read the engineering update",
    ctaUrl: "/blog/engineering-update-2026",
    tone: "muted",
  },
};

/** Editorial founder feature — inverse tone, no headline, dramatic quote. */
export const FounderFeature: Story = {
  args: {
    memberName: "Adetokunbo Bankole",
    memberRole: "Principal · Bankole Advisory",
    quote:
      "I left the corporate side because I was tired of writing internal memos that nobody outside the room could act on. Three engagements at a time, ten weeks each, every recommendation tied to a measurable outcome. That's the whole pitch.",
    context: "Lagos, junho de 2025 — para a revista Mensal",
    image: "https://picsum.photos/seed/spotlight-bankole/700/875",
    imageAlt:
      "Adetokunbo Bankole standing near a window with city skyline behind",
    credentials: [
      { value: "11", label: "Years in payments" },
      { value: "47", label: "Engagements closed" },
      { value: "3", label: "Active at any time" },
    ],
    ctaText: "Schedule a discovery call",
    ctaUrl: "/engage",
    tone: "inverse",
  },
};

/** Doctor / specialist spotlight — neutral, with credentials, healthcare voice. */
export const SpecialistDoctor: Story = {
  args: {
    eyebrow: "Em destaque",
    headline:
      "Conheça a Dra. Priya, que conduz nossa equipe de farmácia clínica",
    memberName: "Dra. Priya Iyengar",
    memberRole: "Diretora · Farmácia Clínica",
    quote:
      "Antes de codar uma única linha do produto, passei doze anos numa farmácia hospitalar. O motivo dele existir é porque, naquelas doze anos, escrevi a mesma carta de alta umas quatorze mil vezes — e nenhuma versão chegou ao paciente do jeito que devia.",
    context: "Toronto, fevereiro de 2026",
    image: "https://picsum.photos/seed/spotlight-priya/700/875",
    imageAlt:
      "Dra. Priya Iyengar em consultório com livros de referência atrás",
    credentials: [
      { value: "12", label: "Anos clínicos" },
      { value: "47k+", label: "Cartas de alta" },
      { value: "PharmD", label: "Univ. de Toronto" },
    ],
    ctaText: "Ver toda a equipa clínica",
    ctaUrl: "/equipa-clinica",
    tone: "neutral",
  },
};

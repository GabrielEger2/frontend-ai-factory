import type { Meta, StoryObj } from "@storybook/react";
import TeamValuesManifesto from "./index";

const meta: Meta<typeof TeamValuesManifesto> = {
  title: "Team/TeamValuesManifesto",
  component: TeamValuesManifesto,
  parameters: { layout: "fullscreen" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "muted"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof TeamValuesManifesto>;

/* ------------------------------------------------------------------ */
/*  Design studio — four values, neutral tone, "read handbook" CTA     */
/* ------------------------------------------------------------------ */

export const DesignStudioPrinciples: Story = {
  args: {
    eyebrow: "What we believe",
    headline: "Four rules we wrote down so we'd stop arguing about them",
    manifesto:
      "Most studios put their values on the careers page and forget them by Tuesday. Ours sit on the kitchen wall, get re-read every January, and any one of us can call them out mid-meeting. They have changed exactly twice in seven years.",
    values: [
      {
        title: "Critique in person, never in writing",
        description:
          "Reviews happen at the same table, with printouts and pencils. Slack threads with three reactions and a 'just my two cents' get nothing made. If a piece of work is worth feedback, it is worth thirty minutes and a coffee.",
        image: "https://picsum.photos/seed/manifesto-critique/900/1100",
        imageAlt:
          "Three designers leaning over a printed layout on a wooden table, one of them pointing at a margin with a sharpened pencil",
        caption: "Tuesday review · 11h",
      },
      {
        title: "Ship the second draft, not the seventh",
        description:
          "We protect the first instinct hard. Polish lives in production where the work gets used; pre-launch perfectionism is mostly fear in a nicer outfit. The handbook calls this 'the 70% rule' and yes, the math is fuzzy on purpose.",
        image: "https://picsum.photos/seed/manifesto-ship/900/1100",
        imageAlt:
          "Designer at standing desk pushing a deploy button on a laptop, second monitor showing a minimal landing page in production",
      },
      {
        title: "Pair on every brief, no solo heroes",
        description:
          "Every project has a senior + junior pair from kickoff to handoff. The senior carries taste and pushback, the junior carries energy and the questions nobody else thinks to ask. Solo work is for personal sites and resignation letters.",
        image: "https://picsum.photos/seed/manifesto-pair/900/1100",
        imageAlt:
          "Two designers sharing one laptop screen, the junior pointing at a Figma frame while the senior leans back with arms crossed",
        caption: "Pairing · Casa Pinheiros",
      },
      {
        title: "The kitchen is the meeting room",
        description:
          "Lunch is at one o'clock. Everyone eats together, no laptops, no client calls, no exceptions. Most of our hardest decisions get made over rice and beans, and the worst ones — the ones we walked back later — got made in conference rooms.",
        image: "https://picsum.photos/seed/manifesto-kitchen/900/1100",
        imageAlt:
          "Studio kitchen at lunchtime, six people around a wooden table sharing a hot meal, a window letting in mid-afternoon light",
        caption: "Almoço · 13h sharp",
      },
    ],
    ctaText: "Read the full handbook",
    ctaUrl: "/handbook",
  },
};

/* ------------------------------------------------------------------ */
/*  Climate SaaS — three values, muted tone, no CTA                    */
/* ------------------------------------------------------------------ */

export const ClimateSaaSMinimal: Story = {
  args: {
    eyebrow: "How we operate",
    headline:
      "Three operating principles, written by the team that has to live with them",
    manifesto:
      "We rewrote these every six months for the first two years and kept landing in the same place. So we stopped editing and started enforcing. They sit at the top of every project doc and on the bottom of every offer letter.",
    values: [
      {
        title: "Measure the carbon, then ship the feature",
        description:
          "Every quarterly roadmap leads with the emissions impact of what we are building, not the headcount projection. If the feature does not move the number we exist to move, it gets cut, deferred, or rebuilt until it does.",
        image: "https://picsum.photos/seed/manifesto-climate-data/900/1100",
        imageAlt:
          "Engineer at a desk reviewing a dashboard with carbon-emissions metrics overlaid on a regional map of supply-chain nodes",
        caption: "Quarterly planning",
      },
      {
        title: "Customers in the room, not on the call",
        description:
          "Every senior hire spends their first month embedded with a customer — at a port, at a refinery, on a cargo deck. We do not write specs for users we have never watched do their actual job. The founders still take three trips a year.",
        image: "https://picsum.photos/seed/manifesto-climate-port/900/1100",
        imageAlt:
          "Two team members in safety vests on a working dock, talking with a logistics operator in front of a stack of shipping containers",
      },
      {
        title: "Open by default, private by exception",
        description:
          "Roadmaps, salary bands, board notes, customer churn — all internal-public unless there is a specific reason to lock a doc down. The list of locked docs lives in a single channel and gets reviewed every Friday afternoon.",
        image: "https://picsum.photos/seed/manifesto-climate-open/900/1100",
        imageAlt:
          "Open laptop showing a team handbook page with table of contents, sticky notes from team members visible in background",
      },
    ],
    tone: "muted",
  },
};

/* ------------------------------------------------------------------ */
/*  Hospitality group — five values, neutral, hiring CTA               */
/* ------------------------------------------------------------------ */

export const HospitalityGroupFiveValues: Story = {
  args: {
    eyebrow: "A cozinha por dentro",
    headline: "Cinco coisas que decidimos antes de abrir a primeira casa",
    manifesto:
      "O grupo tem três restaurantes, sessenta e dois funcionários e um caderno de regras escrito à mão pela Inês em 2017. As páginas estão amareladas e quase tudo continua valendo. Estas são as cinco que mais usamos.",
    values: [
      {
        title: "Staff meal antes do serviço, sempre",
        description:
          "Cinco e meia da tarde, todo mundo senta. Quem cozinhou serve, quem serviu lava. A primeira mesa é a nossa — não é regalia, é como a gente entende quem está de pé hoje e quem precisa de um respiro antes da noite começar.",
        image: "https://picsum.photos/seed/manifesto-hosp-staff/900/1100",
        imageAlt:
          "Equipa da cozinha sentada à volta de uma mesa partilhando staff meal em pratos brancos antes de abrir a casa",
        caption: "Staff meal · 17h30",
      },
      {
        title: "Quem entra, fica pelo menos dois anos",
        description:
          "Não trocamos cozinha como quem troca tênis. Cada contratação tem um plano de dois anos: o que aprende no primeiro, o que ensina no segundo. Quem sai antes disso nos diz por quê — e a gente escuta sem revidar.",
        image: "https://picsum.photos/seed/manifesto-hosp-line/900/1100",
        imageAlt:
          "Cozinheiro sénior orientando uma cozinheira recém-contratada na linha de empratamento durante o serviço",
      },
      {
        title: "Sem grito quando não é urgente",
        description:
          "Cozinha pega fogo de vez em quando, literal e figuradamente. Mas grito é resposta a perigo, nunca a impaciência. Quem grita por motivo errado conversa com a Inês depois do serviço e na semana seguinte volta dois turnos no salão.",
        image: "https://picsum.photos/seed/manifesto-hosp-pass/900/1100",
        imageAlt:
          "Inês inclinada sobre o passe da cozinha revisando um prato com toalha branca dobrada no ombro, expressão concentrada",
        caption: "Passe · 19h45",
      },
      {
        title: "O fornecedor é parte da equipa",
        description:
          "Fazemos visita anual a cada um dos vinte e oito produtores que nos abastecem. Pagamos em dia, mesmo nos meses ruins. Nenhum prato entra na ementa antes da pessoa que produz o ingrediente provar a versão final.",
        image: "https://picsum.photos/seed/manifesto-hosp-farm/900/1100",
        imageAlt:
          "Visita à quinta com produtor mostrando hortaliças frescas a dois cozinheiros do restaurante numa manhã de inverno",
        caption: "Quinta da Adriana · março",
      },
      {
        title: "Receita aberta, segredo no tempero",
        description:
          "Publicamos as receitas no site quando um prato sai da ementa. A casa não vive de propriedade intelectual da cozinha — vive da mão de quem está nela hoje. Cinquenta e três receitas no arquivo, mais de cem mil leitores no último ano.",
        image: "https://picsum.photos/seed/manifesto-hosp-recipe/900/1100",
        imageAlt:
          "Caderno de receitas manuscrito aberto sobre bancada de mármore com colher de pau, ingredientes secos e uma chávena de café",
      },
    ],
    ctaText: "Ver vagas abertas",
    ctaUrl: "/carreiras",
  },
};

/* ------------------------------------------------------------------ */
/*  Boutique consultancy — three values, no manifesto, muted tone      */
/* ------------------------------------------------------------------ */

export const BoutiqueConsultancyMinimal: Story = {
  args: {
    eyebrow: "Three operating rules",
    headline:
      "We took a long time to write these. We will not be rewriting them.",
    values: [
      {
        title: "Six clients at a time, never seven",
        description:
          "We cap the firm at six active engagements. The seventh is a polite no, a referral, and a calendar invite for next quarter. Six is the number where we still know everyone's first name and where the spreadsheet still fits on one screen.",
        image: "https://picsum.photos/seed/manifesto-cons-cap/900/1100",
        imageAlt:
          "Whiteboard with six client names written in marker, a horizontal line drawn underneath and the word 'cap' in capital letters",
      },
      {
        title: "Senior on every meeting, no exceptions",
        description:
          "Partners attend every working session, every check-in, every tough call. We do not have a junior bench because we do not believe in one. The work is the work; if it cannot be done by a senior, we should not have sold it.",
        image: "https://picsum.photos/seed/manifesto-cons-senior/900/1100",
        imageAlt:
          "Two senior consultants on a video call with a client, notebooks open, one of them writing while the other listens intently",
        caption: "Friday review",
      },
      {
        title: "Walk away from the brief that doesn't fit",
        description:
          "We have walked away from briefs that would have funded a full year. Twice. The fit conversation happens in the first call and again before the contract; if it sours, we say so and end the process before the proposal goes out.",
        image: "https://picsum.photos/seed/manifesto-cons-walk/900/1100",
        imageAlt:
          "Consultant standing alone by a window with a closed folder under one arm, late-afternoon light coming in from the side",
      },
    ],
    tone: "muted",
    ctaText: "Start the fit call",
    ctaUrl: "/intro-call",
  },
};

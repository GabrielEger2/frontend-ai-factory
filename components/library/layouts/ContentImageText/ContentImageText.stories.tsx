import type { Meta, StoryObj } from "@storybook/react";
import ContentImageText from "./index";

const meta: Meta<typeof ContentImageText> = {
  title: "Layouts/ContentImageText",
  component: ContentImageText,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    imagePosition: {
      control: "select",
      options: ["left", "right"],
    },
    colorScheme: {
      control: "select",
      options: ["light", "dark"],
    },
    ctaStyle: {
      control: "select",
      options: ["default", "slide", "dotExpand", "drawOutline", "glow"],
    },
    ctaColorScheme: {
      control: "select",
      options: ["primary", "secondary", "accent", "neutral"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContentImageText>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Architecture firm — project showcase with editorial feel */
export const ArchitectureFirm: Story = {
  args: {
    label: "Nossa Filosofia",
    headline: "Espaços que Respiram",
    description:
      "Acreditamos que a arquitetura deve dialogar com o entorno. Cada projeto começa com uma escuta atenta do terreno, da luz natural e das pessoas que vão habitar o espaço. Nossos edifícios não competem com a paisagem — eles a complementam.",
    ctaText: "Ver Projetos",
    ctaUrl: "/projetos",
    ctaStyle: "drawOutline",
    ctaColorScheme: "neutral",
    image: "https://placehold.co/800x600",
    imageAlt:
      "Fachada de edifício residencial com jardim vertical e concreto aparente",
    imagePosition: "left",
    colorScheme: "light",
  },
};

/** Craft brewery — brand story, dark background, image right */
export const CraftBrewery: Story = {
  args: {
    label: "Desde 2017",
    headline: "Cerveja de Verdade",
    description:
      "Começamos em uma garagem com um kit de cinco litros e uma obsessão por lúpulos frescos. Hoje produzimos doze rótulos em uma fábrica própria no interior de Minas, mas o processo continua artesanal: fermentação lenta, ingredientes rastreados e nenhum conservante.",
    ctaText: "Conheça Nossos Rótulos",
    ctaUrl: "/cervejas",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
    image: "https://placehold.co/800x600",
    imageAlt: "Barris de cobre em fábrica artesanal iluminada por luz quente",
    imagePosition: "right",
    colorScheme: "dark",
  },
};

/** Veterinary clinic — warm, approachable tone */
export const VeterinaryClinic: Story = {
  args: {
    headline: "Cuidado que Faz a Diferença",
    description:
      "Nossa equipe de veterinários é especializada em medicina preventiva. Oferecemos check-ups completos, vacinação, cirurgias e acompanhamento nutricional. Porque cada pet merece atenção individualizada e um plano de saúde pensado para a sua rotina.",
    ctaText: "Agendar Consulta",
    ctaUrl: "/agendar",
    ctaStyle: "default",
    ctaColorScheme: "primary",
    image: "https://placehold.co/800x600",
    imageAlt:
      "Veterinária examinando um golden retriever em consultório moderno",
    imagePosition: "left",
    colorScheme: "light",
  },
};

/** SaaS product — feature highlight section */
export const SaasFeatureHighlight: Story = {
  args: {
    label: "Automação Inteligente",
    headline: "Menos Planilhas, Mais Resultados",
    description:
      "Conecte suas ferramentas de vendas, marketing e suporte em um único dashboard. Nossa IA identifica gargalos no funil e sugere ações em tempo real. Empresas que usam a plataforma reduzem o ciclo de vendas em 34% nos primeiros três meses.",
    ctaText: "Testar Grátis",
    ctaUrl: "/trial",
    ctaStyle: "glow",
    ctaColorScheme: "primary",
    image: "https://placehold.co/800x600",
    imageAlt:
      "Tela de dashboard com gráficos de funil de vendas e métricas em tempo real",
    imagePosition: "right",
    colorScheme: "light",
  },
};

/** Yoga studio — calm, minimal dark theme */
export const YogaStudio: Story = {
  args: {
    label: "Bem-Estar",
    headline: "Encontre Seu Equilíbrio",
    description:
      "Oferecemos aulas de Hatha, Vinyasa e Yin Yoga para todos os níveis. Nosso espaço foi projetado para silêncio e concentração: iluminação natural, pisos de madeira e turmas de no máximo oito alunos. Venha praticar com quem entende que yoga é jornada, não destino.",
    ctaText: "Ver Horários",
    ctaUrl: "/horarios",
    ctaStyle: "dotExpand",
    ctaColorScheme: "secondary",
    image: "https://placehold.co/800x600",
    imageAlt:
      "Sala de yoga minimalista com luz natural entrando por janelas amplas",
    imagePosition: "left",
    colorScheme: "dark",
  },
};

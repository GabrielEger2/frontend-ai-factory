import type { Meta, StoryObj } from "@storybook/react";
import ImageText from "./index";

const meta: Meta<typeof ImageText> = {
  title: "Layouts/Split/ImageText",
  component: ImageText,
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
    styleKit: {
      control: "object",
    },
  },
};
export default meta;
type Story = StoryObj<typeof ImageText>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Real estate listing — dark scheme, image left, slide CTA */
export const RealEstateListing: Story = {
  args: {
    label: "Lancamento Exclusivo",
    headline: "Viva Onde o Mar Encontra a Serra",
    description:
      "Apartamentos de 120 a 240 metros quadrados com varanda gourmet e vista permanente para o litoral norte. Projeto assinado pelo escritorio Monteiro & Prata, com acabamentos em marmore e madeira certificada. Entrega prevista para o segundo semestre de 2027.",
    ctaText: "Agendar Visita",
    ctaUrl: "/agendar",
    styleKit: { ctaVariant: "slide", ctaColorScheme: "primary" },
    image: "https://placehold.co/800x600",
    imageAlt:
      "Fachada de edificio residencial de alto padrao com vegetacao tropical",
    imagePosition: "left",
    colorScheme: "dark",
    purpose: "real-estate-listing",
  },
};

/** SaaS onboarding — light scheme, image right, glow CTA */
export const SaasOnboarding: Story = {
  args: {
    label: "Comece em Minutos",
    headline: "Onboarding Sem Fricao",
    description:
      "Conecte suas ferramentas existentes em tres cliques. Nossa plataforma importa dados de CRMs, ERPs e planilhas automaticamente, criando um workspace unificado que sua equipe pode usar no mesmo dia. Sem treinamento extenso, sem migracao manual.",
    ctaText: "Criar Conta Gratis",
    ctaUrl: "/signup",
    styleKit: { ctaVariant: "glow", ctaColorScheme: "accent" },
    image: "https://placehold.co/800x600",
    imageAlt:
      "Tela de dashboard mostrando wizard de configuracao em tres etapas",
    imagePosition: "right",
    colorScheme: "light",
    purpose: "saas-onboarding",
  },
};

/** Healthcare services — light scheme, image left, drawOutline CTA */
export const HealthcareServices: Story = {
  args: {
    label: "Excelencia Clinica",
    headline: "Diagnosticos Precisos, Tratamentos Humanizados",
    description:
      "Contamos com uma equipe multidisciplinar de trinta e dois especialistas e equipamentos de ultima geracao para oferecer atendimento completo. Da consulta inicial ate o acompanhamento pos-tratamento, cada etapa e planejada com foco no conforto e na recuperacao do paciente.",
    ctaText: "Conhecer Especialidades",
    ctaUrl: "/especialidades",
    styleKit: { ctaVariant: "drawOutline", ctaColorScheme: "secondary" },
    image: "https://placehold.co/800x600",
    imageAlt:
      "Medica conversando com paciente em consultorio moderno e acolhedor",
    imagePosition: "left",
    colorScheme: "light",
    purpose: "healthcare-services",
  },
};

/** Food brand story — dark scheme, image right, dotExpand CTA */
export const FoodBrandStory: Story = {
  args: {
    label: "Desde 1998",
    headline: "Do Campo a Mesa, Sem Atalhos",
    description:
      "Trabalhamos com quarenta e seis produtores familiares em tres estados brasileiros. Cada lote de ingredientes e rastreado da colheita ao empacotamento, garantindo frescor e procedencia. Nossos molhos artesanais levam ate setenta e duas horas de coccao lenta para atingir o sabor que nossos clientes conhecem.",
    ctaText: "Conhecer Produtores",
    ctaUrl: "/produtores",
    styleKit: { ctaVariant: "dotExpand", ctaColorScheme: "neutral" },
    image: "https://placehold.co/800x600",
    imageAlt:
      "Cozinha industrial com panelas de cobre e ingredientes frescos organizados",
    imagePosition: "right",
    colorScheme: "dark",
    purpose: "food-brand-story",
  },
};

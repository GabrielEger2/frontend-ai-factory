import type { Meta, StoryObj } from "@storybook/react";
import CtaBanner from "./index";

const meta: Meta<typeof CtaBanner> = {
  title: "CTA/CtaBanner",
  component: CtaBanner,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof CtaBanner>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** E-commerce — seasonal sale with urgency */
export const SeasonalSale: Story = {
  args: {
    headline: "Black Friday: Até 60% de Desconto",
    subheadline:
      "Ofertas válidas até domingo. Frete grátis em compras acima de R$199.",
    ctaText: "Ver Ofertas",
    ctaUrl: "/black-friday",
    secondaryCtaText: "Lista de Desejos",
    secondaryCtaUrl: "/wishlist",
  },
};

/** SaaS — free trial push */
export const FreeTrial: Story = {
  args: {
    headline: "Pronto Para Automatizar Seu Negócio?",
    subheadline:
      "Teste grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.",
    ctaText: "Começar Agora",
    ctaUrl: "/signup",
    secondaryCtaText: "Agendar Demo",
    secondaryCtaUrl: "/demo",
  },
};

/** Real estate — contact for exclusive listings */
export const RealEstateExclusive: Story = {
  args: {
    headline: "Imóveis Exclusivos no Litoral Gaúcho",
    subheadline:
      "Apartamentos de alto padrão com vista para o mar. Condições especiais para os primeiros compradores.",
    ctaText: "Falar com Corretor",
    ctaUrl: "/contato",
  },
};

/** Education — enrollment deadline */
export const EnrollmentDeadline: Story = {
  args: {
    headline: "Matrículas Abertas Para 2027",
    subheadline:
      "Garanta a vaga do seu filho com 15% de desconto na primeira mensalidade. Vagas limitadas.",
    ctaText: "Matricular Agora",
    ctaUrl: "/matricula",
    secondaryCtaText: "Conhecer a Escola",
    secondaryCtaUrl: "/tour-virtual",
  },
};

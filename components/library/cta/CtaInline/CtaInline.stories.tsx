import type { Meta, StoryObj } from "@storybook/react";
import CtaInline from "./index";

const meta: Meta<typeof CtaInline> = {
  title: "CTA/CtaInline",
  component: CtaInline,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
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
type Story = StoryObj<typeof CtaInline>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Newsletter signup — blog footer CTA */
export const NewsletterSignup: Story = {
  args: {
    headline: "Receba Novidades Toda Semana",
    description: "Dicas de marketing digital direto no seu e-mail. Sem spam.",
    ctaText: "Inscrever-se",
    ctaUrl: "/newsletter",
    ctaStyle: "default",
    ctaColorScheme: "primary",
  },
};

/** Gym membership — quick action prompt */
export const GymMembership: Story = {
  args: {
    headline: "Primeira Semana Por Nossa Conta",
    description:
      "Experimente todas as modalidades antes de escolher seu plano.",
    ctaText: "Agendar Aula",
    ctaUrl: "/agendar",
    ctaStyle: "slide",
    ctaColorScheme: "accent",
  },
};

/** Consulting firm — schedule a call */
export const ConsultingCall: Story = {
  args: {
    headline: "Vamos Conversar Sobre Seu Projeto?",
    description:
      "30 minutos de consultoria gratuita com um dos nossos especialistas.",
    ctaText: "Agendar Horário",
    ctaUrl: "/agendar-consultoria",
    ctaStyle: "drawOutline",
    ctaColorScheme: "secondary",
  },
};

/** Restaurant — reservation */
export const RestaurantReservation: Story = {
  args: {
    headline: "Reserve Sua Mesa",
    ctaText: "Fazer Reserva",
    ctaUrl: "/reserva",
    ctaStyle: "glow",
    ctaColorScheme: "neutral",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import CtaFloating from "./index";

const meta: Meta<typeof CtaFloating> = {
  title: "CTA/CtaFloating",
  component: CtaFloating,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    position: {
      control: "select",
      options: ["bottom-right", "bottom-center", "bottom-left"],
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[600px] bg-base-200 p-8">
        <p className="text-center text-base-content/40">
          Role a página para ver o botão flutuante fixo no canto da tela.
        </p>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CtaFloating>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** WhatsApp-style floating contact — bottom right */
export const WhatsAppContact: Story = {
  args: {
    ctaText: "Fale Conosco",
    ctaUrl: "https://wa.me/5511999999999",
    position: "bottom-right",
  },
};

/** E-commerce promo — centered at bottom */
export const PromoBanner: Story = {
  args: {
    ctaText: "Frete Grátis Hoje",
    ctaUrl: "/promocoes",
    position: "bottom-center",
  },
};

/** Appointment booking — bottom left */
export const BookAppointment: Story = {
  args: {
    ctaText: "Agendar Agora",
    ctaUrl: "/agendar",
    position: "bottom-left",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import ContactForm from "./index";

const meta: Meta<typeof ContactForm> = {
  title: "Contact/ContactForm",
  component: ContactForm,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof ContactForm>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Law firm — formal contact with default fields */
export const LawFirm: Story = {
  args: {
    headline: "Fale com Nossa Equipe",
    subheadline:
      "Preencha o formulário e um de nossos advogados retornará em até 24 horas úteis.",
    submitText: "Enviar Mensagem",
  },
};

/** Dental clinic — appointment request with custom fields */
export const DentalClinic: Story = {
  args: {
    headline: "Agende Sua Consulta",
    subheadline: "Primeira avaliação gratuita. Atendemos todos os convênios.",
    submitText: "Solicitar Agendamento",
    fields: [
      {
        name: "name",
        label: "Nome Completo",
        type: "text" as const,
        required: true,
      },
      {
        name: "phone",
        label: "WhatsApp",
        type: "tel" as const,
        required: true,
      },
      { name: "email", label: "E-mail", type: "email" as const },
      { name: "insurance", label: "Convênio", type: "text" as const },
      {
        name: "message",
        label: "Descreva seu caso",
        type: "textarea" as const,
      },
    ],
  },
};

/** Freelancer portfolio — minimal contact */
export const FreelancerPortfolio: Story = {
  args: {
    headline: "Vamos Trabalhar Juntos?",
    submitText: "Enviar",
    fields: [
      {
        name: "name",
        label: "Seu Nome",
        type: "text" as const,
        required: true,
      },
      {
        name: "email",
        label: "E-mail",
        type: "email" as const,
        required: true,
      },
      {
        name: "message",
        label: "Conte sobre seu projeto",
        type: "textarea" as const,
        required: true,
      },
    ],
  },
};

/** Event venue — booking inquiry with extra fields */
export const EventVenue: Story = {
  args: {
    headline: "Solicite um Orçamento",
    subheadline:
      "Casamentos, formaturas, eventos corporativos. Capacidade para até 500 convidados.",
    submitText: "Solicitar Orçamento",
    fields: [
      { name: "name", label: "Nome", type: "text" as const, required: true },
      {
        name: "email",
        label: "E-mail",
        type: "email" as const,
        required: true,
      },
      {
        name: "phone",
        label: "Telefone",
        type: "tel" as const,
        required: true,
      },
      { name: "eventType", label: "Tipo de Evento", type: "text" as const },
      { name: "guests", label: "Número de Convidados", type: "text" as const },
      {
        name: "message",
        label: "Detalhes Adicionais",
        type: "textarea" as const,
      },
    ],
  },
};

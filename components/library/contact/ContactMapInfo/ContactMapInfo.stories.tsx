import type { Meta, StoryObj } from "@storybook/react";
import ContactMapInfo from "./index";

const meta: Meta<typeof ContactMapInfo> = {
  title: "Contact/ContactMapInfo",
  component: ContactMapInfo,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof ContactMapInfo>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Restaurant — full info with hours and map */
export const Restaurant: Story = {
  args: {
    headline: "Visite-nos",
    subheadline: "Estamos no coração do bairro Moinhos de Vento.",
    address: "Rua Padre Chagas, 314 — Moinhos de Vento, Porto Alegre, RS",
    phone: "(51) 3333-4444",
    email: "reservas@olea.com.br",
    hours: "Terça a Sábado, 12h–15h e 19h–23h. Domingo, 12h–16h.",
  },
};

/** Law office — formal, no map embed */
export const LawOffice: Story = {
  args: {
    headline: "Nosso Escritório",
    address:
      "Av. Borges de Medeiros, 2500, Sala 1201 — Centro Histórico, Porto Alegre, RS",
    phone: "(51) 3021-9876",
    email: "contato@ferreiradias.adv.br",
    hours: "Segunda a Sexta, 9h–18h",
  },
};

/** Auto repair shop — practical, with map */
export const AutoRepairShop: Story = {
  args: {
    headline: "Onde Estamos",
    subheadline: "Traga seu veículo para uma avaliação gratuita.",
    address: "Av. Assis Brasil, 4520 — Passo d'Areia, Porto Alegre, RS",
    phone: "(51) 99812-3456",
    hours: "Segunda a Sexta, 8h–18h. Sábado, 8h–12h.",
  },
};

/** Coworking space — modern, all fields populated */
export const CoworkingSpace: Story = {
  args: {
    headline: "Conheça Nosso Espaço",
    subheadline: "Agende uma visita e experimente um dia grátis de coworking.",
    address:
      "Rua Voluntários da Pátria, 901, 5º andar — Centro, Porto Alegre, RS",
    phone: "(51) 3500-1234",
    email: "ola@hubwork.co",
    hours: "Segunda a Sexta, 7h–22h. Sábado, 9h–18h.",
  },
};

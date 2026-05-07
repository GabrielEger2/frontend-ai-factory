import type { Meta, StoryObj } from "@storybook/react";
import ContactLocationsMap from "./index";

const meta: Meta<typeof ContactLocationsMap> = {
  title: "Contact/ContactLocationsMap",
  component: ContactLocationsMap,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ContactLocationsMap>;

export const GlobalArchitectureStudio: Story = {
  args: {
    headline: "Studios across four time zones",
    subheadline:
      "Drop in for a portfolio review or schedule a project consultation at any of our regional studios.",
    highlightWord: "four",
    featuredImage: "https://placehold.co/1600x900?text=Studio+Hero",
    featuredImageAlt: "Curved facade of a contemporary architecture studio",
    locations: [
      {
        city: "Sydney",
        address: "Level 12, 88 Phillip Street, Sydney NSW 2000",
        phone: "+61 2 8001 4480",
        email: "sydney@archlattice.studio",
        hours: "Mon-Fri 9-18",
      },
      {
        city: "Melbourne",
        address: "Suite 4, 540 Collins Street, Melbourne VIC 3000",
        phone: "+61 3 9001 7720",
        email: "melbourne@archlattice.studio",
        hours: "Mon-Fri 9-18",
      },
      {
        city: "Los Angeles",
        address: "915 South Hill Street, Los Angeles, CA 90015",
        phone: "+1 213 555 0142",
        email: "la@archlattice.studio",
        hours: "Mon-Fri 9-17",
      },
      {
        city: "London",
        address: "60 Great Portland Street, London W1W 7RT",
        phone: "+44 20 4520 8080",
        email: "london@archlattice.studio",
        hours: "Mon-Fri 9-18",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.5!2d-118.2615!3d34.0445",
  },
};

export const SaasSupportHubs: Story = {
  args: {
    headline: "Support hubs close to your team",
    subheadline:
      "Our customer success teams operate from three regional hubs so enterprise accounts always get same-day support.",
    featuredImage: "https://placehold.co/1600x900?text=Support+Hubs",
    featuredImageAlt: "Open plan customer support office with glass walls",
    locations: [
      {
        city: "Austin",
        address: "301 Congress Avenue, Suite 1900, Austin, TX 78701",
        phone: "+1 512 555 0188",
        email: "austin@routelane.io",
        hours: "Mon-Fri 8-19 CT",
      },
      {
        city: "Berlin",
        address: "Friedrichstrasse 76, 10117 Berlin",
        phone: "+49 30 5557 4400",
        email: "berlin@routelane.io",
        hours: "Mon-Fri 9-18 CET",
      },
      {
        city: "Singapore",
        address: "71 Robinson Road, Level 14, Singapore 068895",
        phone: "+65 3158 8090",
        email: "sg@routelane.io",
        hours: "Mon-Fri 9-18 SGT",
      },
    ],
  },
};

export const RealEstateBrokerage: Story = {
  args: {
    headline: "Visit a Lattice + Stone office",
    subheadline:
      "Our brokers know each neighborhood by walking it. Stop in for coffee and a market briefing.",
    highlightWord: "neighborhood",
    featuredImage: "https://placehold.co/1600x900?text=Brokerage+Office",
    featuredImageAlt: "Front desk of a luxury real estate brokerage",
    locations: [
      {
        city: "Brooklyn",
        address: "117 Wythe Avenue, Brooklyn, NY 11249",
        phone: "+1 718 555 0166",
        hours: "Tue-Sat 10-19",
      },
      {
        city: "Miami",
        address: "1450 Brickell Avenue, Suite 320, Miami, FL 33131",
        phone: "+1 305 555 0119",
        hours: "Mon-Sat 10-20",
      },
      {
        city: "Aspen",
        address: "500 East Hopkins Avenue, Aspen, CO 81611",
        phone: "+1 970 555 0102",
        hours: "Wed-Sun 11-19",
      },
      {
        city: "Lisbon",
        address: "Avenida da Liberdade 144, 1250-146 Lisboa",
        phone: "+351 21 555 0090",
        hours: "Mon-Fri 10-19",
      },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250",
  },
};

export const RestaurantGroup: Story = {
  args: {
    headline: "Find an Olive & Ash table",
    subheadline:
      "Reservations open six weeks ahead. Walk-ins welcome at the bar from 5pm.",
    featuredImage: "https://placehold.co/1600x900?text=Restaurant+Interior",
    featuredImageAlt:
      "Warm dining room with brass pendants and an open kitchen",
    locations: [
      {
        city: "Charleston",
        address: "42 King Street, Charleston, SC 29401",
        phone: "+1 843 555 0177",
        hours: "Tue-Sun 17-23",
      },
      {
        city: "Chicago",
        address: "219 North Green Street, Chicago, IL 60607",
        phone: "+1 312 555 0144",
        hours: "Wed-Sun 17-23",
      },
    ],
  },
};

export const NonprofitFieldOffices: Story = {
  args: {
    headline: "Field offices ready to mobilize",
    subheadline:
      "Our field teams partner with local clinics to deliver maternal health care across five regions.",
    highlightWord: "five",
    featuredImage: "https://placehold.co/1600x900?text=Field+Office",
    featuredImageAlt: "Volunteers loading supplies into a field office van",
    locations: [
      {
        city: "Nairobi",
        address: "Riverside Drive 24, Nairobi 00100",
        email: "nairobi@maternaglobal.org",
        hours: "Mon-Fri 8-17 EAT",
      },
      {
        city: "Dhaka",
        address: "House 42, Road 11, Banani, Dhaka 1213",
        email: "dhaka@maternaglobal.org",
        hours: "Sun-Thu 9-17 BST",
      },
      {
        city: "Lima",
        address: "Avenida Pardo 610, Miraflores, Lima 15074",
        email: "lima@maternaglobal.org",
        hours: "Mon-Fri 8-17 PET",
      },
      {
        city: "Accra",
        address: "12 Independence Avenue, Accra GA-184-3066",
        email: "accra@maternaglobal.org",
        hours: "Mon-Fri 8-17 GMT",
      },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800",
  },
};

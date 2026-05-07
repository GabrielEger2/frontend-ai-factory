import type { Meta, StoryObj } from "@storybook/react";
import GalleryImageTextEditorial from "./index";

const meta: Meta<typeof GalleryImageTextEditorial> = {
  title: "Content/GalleryImageTextEditorial",
  component: GalleryImageTextEditorial,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof GalleryImageTextEditorial>;

/** Hospitality story page — three rooms across two estates. */
export const HospitalityStory: Story = {
  args: {
    eyebrow: "Quinta da Lousa · Sintra",
    headline: "Three rooms, two estates, one host who answers her own messages",
    description:
      "Every stay at Quinta da Lousa is hosted by Mariana Cardoso herself. These are the rooms she's most likely to suggest, in the order she'd suggest them.",
    entries: [
      {
        label: "Room 01 · The hayloft",
        heading: "A room that used to dry tobacco, now drying linen instead",
        body: "Built into the original 1612 farmhouse and rebuilt in 2021, the hayloft still has the chestnut beams that once held tobacco-drying racks. The bed sits under the south-facing arched window — the same one Mariana's grandmother used to sit at to read in the afternoons, before the room had a roof.",
        image: "https://picsum.photos/seed/editorial-hayloft/900/1200",
        imageAlt:
          "Hayloft bedroom with chestnut beams and arched south-facing window",
        imageCaption: "Photograph by Joana Linhares · April 2025 · Sintra, PT",
      },
      {
        label: "Room 02 · The orchard cottage",
        heading:
          "Quietest room on the property, slowest to leave in the morning",
        body: "The orchard cottage stands a hundred meters from the main house, surrounded by sixty-year-old olive trees and a productive lemon grove. Two bedrooms, one shared kitchen, and a wood stove that the housekeeper pre-lights from October through March.",
        image: "https://picsum.photos/seed/editorial-orchard/900/1200",
        imageAlt:
          "Stone cottage interior with wood stove and olive trees beyond",
        imageCaption: "Photograph by Daniel Schroeter · February 2024",
      },
      {
        label: "Room 03 · The watchtower",
        heading: "Three flights up, then one more to the rooftop tea table",
        body: "The watchtower is the smallest room on the estate — single bed, single chair, one shelf of books in Portuguese, French, and Japanese. Above it, a private rooftop with a folding table where Mariana brings up jasmine tea at dusk if the weather holds.",
        image: "https://picsum.photos/seed/editorial-tower/900/1200",
        imageAlt:
          "Watchtower bedroom with single bed and shelf of trilingual books",
        imageCaption: "Photograph by Joana Linhares · March 2025",
      },
    ],
  },
};

/** Magazine archive — issue retrospective with photo credits. */
export const MagazineArchive: Story = {
  args: {
    eyebrow: "Revista Vão · Issue retrospective",
    headline: "Eleven years of writing about the buildings nobody photographs",
    description:
      "An incomplete walk through the issues that mattered most — three from the early years, two from the middle, one we're still proud of.",
    entries: [
      {
        label: "Issue 02 · Spring 2014",
        heading: "Eleven schoolyards in São Paulo, photographed during recess",
        body: "Our second issue, and the first time we sent a writer to a place without a story to chase. Bianca Okazaki spent six weeks visiting public-school playgrounds at recess. The result was a 64-page photo essay and a piece in the Folha that brought us our first 200 subscribers.",
        image: "https://picsum.photos/seed/editorial-issue02/900/1200",
        imageAlt:
          "Magazine spread showing schoolyard photographs in black and white",
        imageCaption: "Photographs by Bianca Okazaki · São Paulo · 2014",
      },
      {
        label: "Issue 17 · Winter 2018",
        heading:
          "Inside the rural chapels of central Portugal, before the storms",
        body: "We went looking for a hundred chapels — small, rural, often unattended — to document their interiors before another winter of Atlantic storms. We found 47. Eight of those were demolished or collapsed within two years of our visit. This issue exists in part because the buildings no longer do.",
        image: "https://picsum.photos/seed/editorial-issue17/900/1200",
        imageAlt:
          "Rural chapel interior with hand-painted vault and stone floor",
        imageCaption: "Photograph by Rafael Tavares · Beira Alta · 2018",
      },
      {
        label: "Issue 31 · Autumn 2024",
        heading:
          "The bridge our writer crossed every day for a year, finally written down",
        body: "Our most recent issue centers a single Lisbon footbridge that Mariana Cardoso crossed every day during her year of teaching at the architecture school. The piece runs forty pages, contains no photographs of the bridge itself, and asks readers to walk it before reading.",
        image: "https://picsum.photos/seed/editorial-issue31/900/1200",
        imageAlt:
          "Magazine spread with handwritten note and pencil sketch of footbridge",
        imageCaption: "Sketch by Mariana Cardoso · Lisboa · 2024",
      },
    ],
  },
};

/** Portfolio narrative — design studio with four chapter pieces. */
export const StudioNarrative: Story = {
  args: {
    eyebrow: "How we work · A walk-through",
    headline: "Four habits that have survived every studio reorganisation",
    entries: [
      {
        label: "Habit 01",
        heading:
          "Mondays start with everyone showing one piece of work they love",
        body: "Not their own. Not even a brand's. Just one thing they saw the week before that made them stop. We started doing this in 2019; it's the only meeting that has run continuously since the studio opened.",
        image: "https://picsum.photos/seed/editorial-habit01/900/1200",
        imageAlt: "Studio team gathered around a printed reference wall",
        imageCaption: "Studio Mondays · 2024",
      },
      {
        label: "Habit 02",
        heading: "Every project gets a name before it gets a brief",
        body: "Project codenames — pulled from rivers, mountain passes, or whatever Bianca Okazaki has been reading — give us a way to talk about the work without performing for the client. The name often outlives the brand it shipped.",
        image: "https://picsum.photos/seed/editorial-habit02/900/1200",
        imageAlt: "Project codename board with handwritten labels",
        imageAspect: "3:4",
      },
      {
        label: "Habit 03",
        heading: "We print the deck before we present it",
        body: "Always. Even if it's a Zoom call. Printing forces us to hold the work in our hands the way the client never will, which makes the talking easier and the typesetting better.",
        image: "https://picsum.photos/seed/editorial-habit03/900/1200",
        imageAlt: "Printed presentation pages laid out across a wooden table",
      },
      {
        label: "Habit 04",
        heading: "Every project ends with a 600-word retrospective, no slides",
        body: "Written by whoever was closest to the work, distributed inside the studio only. The retros are the closest thing we have to a knowledge base — they're how a junior designer joining in 2025 ends up arguing convincingly about a decision we made in 2019.",
        image: "https://picsum.photos/seed/editorial-habit04/900/1200",
        imageAlt:
          "Pages of printed studio retrospective with margin annotations",
        imageAspect: "3:4",
      },
    ],
  },
};

/** Restaurant menu narrative — three dishes, square images. */
export const RestaurantMenu: Story = {
  args: {
    eyebrow: "Menu · Outono 2025",
    headline: "Three dishes we'll write down before they leave the menu",
    description:
      "Every plate at Restaurante 17:43 has a story longer than the line it gets on the menu card. Here are three of them.",
    entries: [
      {
        label: "Entrada",
        heading: "Pão de fermentação natural com manteiga de azeite",
        body: "Made from a 30-year-old culture our chef Rafael Tavares carried over from his grandmother's kitchen in Trás-os-Montes. The butter is folded with cold-pressed olive oil from a single farm in Moncorvo, then salted with flor de sal from Algarve. It's the only dish on the menu that has never changed.",
        image: "https://picsum.photos/seed/editorial-pao/900/900",
        imageAlt:
          "Sourdough bread with olive-oil butter on a hand-thrown ceramic plate",
        imageAspect: "1:1",
        imageCaption: "Photograph by Joana Linhares · Outono 2025",
      },
      {
        label: "Prato principal",
        heading: "Cabrito assado lentamente com batata-doce e mostarda preta",
        body: "Goat shoulder from a single farm in Mértola, slow-roasted for nine hours with bay leaves and black mustard seed. The sweet potato is from our garden in Sintra, harvested the morning of service. We make this dish for exactly seventeen people each evening.",
        image: "https://picsum.photos/seed/editorial-cabrito/900/900",
        imageAlt:
          "Slow-roasted goat shoulder plated with caramelised sweet potato",
        imageAspect: "1:1",
      },
      {
        label: "Sobremesa",
        heading:
          "Tarte de pêssego em folhado de manteiga com gelado de fava-tonka",
        body: "Peaches from the orchard at Quinta da Lousa, baked into a butter puff our pastry chef Bianca Okazaki rolls every morning at 6 a.m. The tonka-bean ice cream is churned to order — soft enough to fold over the still-warm peach when it lands at your table.",
        image: "https://picsum.photos/seed/editorial-tarte/900/900",
        imageAlt:
          "Warm peach tart with melting tonka-bean ice cream on slate plate",
        imageAspect: "1:1",
      },
    ],
  },
};

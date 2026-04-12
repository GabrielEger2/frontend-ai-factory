import type { Meta, StoryObj } from "@storybook/react";
import AuthorSplit from "./index";

const meta: Meta<typeof AuthorSplit> = {
  title: "Layouts/Split/AuthorSplit",
  component: AuthorSplit,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof AuthorSplit>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Tech startup founder — personal origin story with CTA */
export const FounderStory: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Panoramic view of a co-working space with developers at standing desks",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt: "Portrait of a founder in a casual navy blazer",
    authorName: "Rafael Duarte",
    authorTagline:
      "Co-founder and CTO of Nuvem. Building cloud infrastructure for Latin American startups since 2018.",
    description:
      "I spent six years at a big-four consultancy watching talented engineers waste hours fighting deployment pipelines that were never designed for the region. Latency to US-East, currency conversion on billing, compliance with LGPD — every problem had a workaround but no real solution. Nuvem was born from the frustration of patching instead of building. We now run seventeen edge locations across Brazil, Mexico, and Colombia, and our average deploy time is under ninety seconds. The goal has not changed: let developers ship code, not fight infrastructure.",
    ctaText: "Read Our Full Story",
    ctaUrl: "/about",
    purpose: "founder-story",
  },
};

/** Team member spotlight — no CTA, HR or culture page */
export const TeamMemberSpotlight: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Design team collaborating around a large screen showing wireframes",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt: "Smiling woman with glasses in a bright studio setting",
    authorName: "Camila Rocha",
    authorTagline:
      "Head of Product Design. Former lead designer at Nubank. Speaker at Config and Front in Zurich.",
    description:
      "I joined the team because I wanted to solve problems that affect millions of people who have never heard the word fintech. Design at this scale means obsessing over edge cases — the user with a cracked screen, the merchant with intermittent connectivity, the first-time smartphone owner trying to send a payment. Every pixel we ship carries responsibility. My team runs weekly usability sessions with real merchants in Recife, Manaus, and Belo Horizonte, and those conversations shape our roadmap more than any analytics dashboard.",
    purpose: "team-member-spotlight",
  },
};

/** Author promoting a book — editorial profile with CTA */
export const BookAuthor: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt: "Rows of bookshelves in a sunlit independent bookstore",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt: "Author seated at a writing desk with manuscript pages",
    authorName: "Eduardo Menezes",
    authorTagline:
      "Novelist and essayist. Author of Mares Internos and A Cidade Que Nao Dorme. Finalist for the Premio Jabuti 2025.",
    description:
      "I write about cities that exist between memory and invention. My latest novel follows three generations of a family in Santos as the port transforms around them — container ships replacing fishing boats, warehouses becoming loft apartments, and the sea receding from streets it once flooded every winter. Fiction lets me hold contradictions that journalism cannot: progress and loss, nostalgia and relief, the weight of a place and the freedom of leaving it.",
    ctaText: "Order the Book",
    ctaUrl: "/livros/mares-internos",
    purpose: "book-author",
  },
};

/** Gallery artist — visual portfolio intro */
export const GalleryArtist: Story = {
  args: {
    bannerImage: "https://placehold.co/1200x500",
    bannerImageAlt:
      "Large abstract canvas paintings leaning against white gallery walls",
    authorImage: "https://placehold.co/200x200",
    authorImageAlt:
      "Artist in paint-stained apron standing in front of a large mural",
    authorName: "Beatriz Fonseca",
    authorTagline:
      "Visual artist working in oil, acrylic, and mixed media. Exhibited at MASP, Inhotim, and Art Basel Miami.",
    description:
      "My work begins with color before form. I mix pigments from iron-oxide soils collected in Minas Gerais and layer them over industrial materials — sheet metal, reclaimed concrete, rusted wire mesh. The tension between the organic and the manufactured is the conversation I keep returning to. Each piece takes between three and eight months because I let the layers dry naturally, sometimes outdoors, so the weather participates in the process. Collectors often ask when a piece is finished. The honest answer is that it stops when the surface starts answering back.",
    ctaText: "View Portfolio",
    ctaUrl: "/portfolio",
    purpose: "gallery-artist",
  },
};

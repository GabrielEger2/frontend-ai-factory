import { mergeImageOutput } from "../handler";
import type { HumanizerOutput, ImageOutput } from "../../shared/types";

describe("mergeImageOutput", () => {
  it("returns humanizerOutput unchanged when imageOutput is undefined", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            headline: "Texto",
            heroImage: "https://placehold.co/1200x800?text=Imagem",
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, undefined);

    expect(result).toEqual(humanizerOutput);
    // Reference equality preserved — passthrough should not allocate.
    expect(result).toBe(humanizerOutput);
  });

  it("writes the URL into the slot when componentId matches", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            headline: "Texto",
            heroImage: "https://placehold.co/1200x800?text=Imagem",
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/1.jpg",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);

    expect(result.components[0].slots.heroImage).toBe(
      "https://images.pexels.com/photos/1.jpg",
    );
    // Untouched slots are preserved.
    expect(result.components[0].slots.headline).toBe("Texto");
  });

  it("writes the alt slot when existing alt is null (null is falsy)", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            heroImage: "https://placehold.co/1200x800?text=Imagem",
            heroImageAlt: null,
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/1.jpg",
              alt: "A bakery storefront in soft morning light",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);

    expect(result.components[0].slots.heroImageAlt).toBe(
      "A bakery storefront in soft morning light",
    );
  });

  it("does NOT overwrite an existing non-empty alt slot", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            heroImage: "https://placehold.co/1200x800?text=Imagem",
            heroImageAlt: "Vitrine da padaria ao amanhecer",
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/1.jpg",
              alt: "A bakery storefront in soft morning light",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);

    // URL still merges in.
    expect(result.components[0].slots.heroImage).toBe(
      "https://images.pexels.com/photos/1.jpg",
    );
    // Existing pt-BR alt is preserved over Pexels English alt.
    expect(result.components[0].slots.heroImageAlt).toBe(
      "Vitrine da padaria ao amanhecer",
    );
  });

  it("is harmless when componentId is in imageOutput but not in humanizerOutput", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            headline: "Texto",
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "ghost-component-99",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/2.jpg",
            },
          },
        },
      ],
    };

    // Should not throw and should leave humanizer components untouched.
    expect(() => mergeImageOutput(humanizerOutput, imageOutput)).not.toThrow();
    const result = mergeImageOutput(humanizerOutput, imageOutput);
    expect(result.components).toHaveLength(1);
    expect(result.components[0].componentId).toBe("hero-split-image-01");
    expect(result.components[0].slots.headline).toBe("Texto");
    // No URL was injected — the ghost componentId was skipped silently.
    expect(result.components[0].slots.heroImage).toBeUndefined();
  });

  it("writes the alt slot when alt slot key is absent (undefined is falsy)", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          slots: {
            // heroImage exists but the heroImageAlt key was never written
            // by Humanizer (i.e. component.slots["heroImageAlt"] === undefined).
            heroImage: "https://placehold.co/1200x800?text=Imagem",
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "hero-split-image-01",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/3.jpg",
              alt: "Cozy cafe interior",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);

    // Falsy check on the absent slot key (undefined) lets the Pexels alt land.
    expect(result.components[0].slots.heroImageAlt).toBe("Cozy cafe interior");
  });

  it("writes nested-list keys into entries[i].image", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          slots: {
            headline: "Showcase",
            entries: [
              {
                heading: "First",
                body: "Body 1",
                image: "https://placehold.co/1200x800?text=Imagem",
                imageAlt: null,
              },
              {
                heading: "Second",
                body: "Body 2",
                image: "https://placehold.co/1200x800?text=Imagem",
                imageAlt: "Existing alt",
              },
            ],
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          imageSlots: {
            "entries[0].image": {
              url: "https://images.pexels.com/photos/100.jpg",
              alt: "Editorial bakery scene",
            },
            "entries[1].image": {
              url: "https://images.pexels.com/photos/101.jpg",
              alt: "Pexels alt that must NOT win",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);
    const entries = result.components[0].slots.entries as Array<
      Record<string, unknown>
    >;

    expect(entries[0].image).toBe("https://images.pexels.com/photos/100.jpg");
    expect(entries[1].image).toBe("https://images.pexels.com/photos/101.jpg");
    // entries[0].imageAlt was null (falsy) → Pexels alt lands.
    expect(entries[0].imageAlt).toBe("Editorial bakery scene");
    // entries[1].imageAlt was non-empty → existing alt preserved.
    expect(entries[1].imageAlt).toBe("Existing alt");
    // Non-image fields are untouched.
    expect(entries[0].heading).toBe("First");
    expect(entries[1].heading).toBe("Second");
    // Other top-level slots are untouched.
    expect(result.components[0].slots.headline).toBe("Showcase");
  });

  it("does not mutate the original entries array on nested write", () => {
    const originalEntries = [
      {
        heading: "First",
        image: "https://placehold.co/1200x800?text=Imagem",
      },
    ];
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          slots: {
            entries: originalEntries,
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          imageSlots: {
            "entries[0].image": {
              url: "https://images.pexels.com/photos/200.jpg",
            },
          },
        },
      ],
    };

    mergeImageOutput(humanizerOutput, imageOutput);

    // Reference equality on the input array — input must not be mutated.
    expect(originalEntries[0].image).toBe(
      "https://placehold.co/1200x800?text=Imagem",
    );
  });

  it("silently skips a nested write when the list slot is missing", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          slots: {
            headline: "Showcase",
            // entries is intentionally omitted
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "gallery-image-text-editorial-01",
          imageSlots: {
            "entries[0].image": {
              url: "https://images.pexels.com/photos/300.jpg",
            },
          },
        },
      ],
    };

    expect(() => mergeImageOutput(humanizerOutput, imageOutput)).not.toThrow();
    const result = mergeImageOutput(humanizerOutput, imageOutput);
    // No `entries` slot was written, no crash.
    expect(result.components[0].slots.entries).toBeUndefined();
    expect(result.components[0].slots.headline).toBe("Showcase");
  });

  it("merges flat and nested keys for the same component", () => {
    const humanizerOutput: HumanizerOutput = {
      components: [
        {
          componentId: "mixed-component-01",
          slots: {
            heroImage: "https://placehold.co/1200x800?text=Imagem",
            entries: [{ heading: "A", image: "https://placehold.co/1200x800" }],
          },
        },
      ],
    };

    const imageOutput: ImageOutput = {
      components: [
        {
          componentId: "mixed-component-01",
          imageSlots: {
            heroImage: {
              url: "https://images.pexels.com/photos/400.jpg",
            },
            "entries[0].image": {
              url: "https://images.pexels.com/photos/401.jpg",
            },
          },
        },
      ],
    };

    const result = mergeImageOutput(humanizerOutput, imageOutput);
    const entries = result.components[0].slots.entries as Array<
      Record<string, unknown>
    >;

    expect(result.components[0].slots.heroImage).toBe(
      "https://images.pexels.com/photos/400.jpg",
    );
    expect(entries[0].image).toBe("https://images.pexels.com/photos/401.jpg");
  });
});

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
});

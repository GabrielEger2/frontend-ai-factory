import React from "react";

export interface FeaturesGridItem {
  /** Icon image URL */
  icon: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

export interface FeaturesGridProps {
  /** Section heading */
  sectionTitle: string;
  /** Optional section subtitle */
  sectionSubtitle?: string;
  /** List of feature items (max 6) */
  features: FeaturesGridItem[];
}

export default function FeaturesGrid({
  sectionTitle,
  sectionSubtitle,
  features,
}: FeaturesGridProps) {
  return (
    <section className="w-full bg-base-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-bold leading-tight tracking-tight text-base-content sm:text-4xl">
            {sectionTitle}
          </h2>

          {sectionSubtitle && (
            <p className="mt-4 font-sans text-lg leading-relaxed text-base-content/70">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Card grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-box border border-base-300 bg-base-200 p-8 transition-shadow hover:shadow-md"
            >
              <img
                src={feature.icon}
                alt=""
                className="h-12 w-12 object-contain"
              />

              <h3 className="mt-6 font-sans text-xl font-semibold text-base-content">
                {feature.title}
              </h3>

              <p className="mt-3 font-sans text-base leading-relaxed text-base-content/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";

export interface FeaturesIconListItem {
  /** Icon image URL */
  icon: string;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

export interface FeaturesIconListProps {
  /** Section heading */
  sectionTitle: string;
  /** Optional section subtitle */
  sectionSubtitle?: string;
  /** List of feature items (max 8) */
  features: FeaturesIconListItem[];
}

export default function FeaturesIconList({
  sectionTitle,
  sectionSubtitle,
  features,
}: FeaturesIconListProps) {
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

        {/* Icon list — 2 columns on desktop, 1 on mobile */}
        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-5">
              <img
                src={feature.icon}
                alt=""
                className="mt-1 h-10 w-10 shrink-0 object-contain"
              />

              <div>
                <h3 className="font-sans text-lg font-semibold text-base-content">
                  {feature.title}
                </h3>

                <p className="mt-2 font-sans text-base leading-relaxed text-base-content/70">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

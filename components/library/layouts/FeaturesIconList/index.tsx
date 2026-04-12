"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FeatureIconItem {
  /** React node for the icon — typically an SVG or emoji */
  icon: React.ReactNode;
  /** Feature heading */
  title: string;
  /** Feature description */
  description: string;
}

export interface LogoItem {
  /** SVG content or image URL */
  image: string;
  imageAlt: string;
}

export interface FeaturesIconListProps {
  /** Section headline */
  headline: string;
  /** List of features with icons */
  features: FeatureIconItem[];
  /** Optional large image displayed beside the features list on desktop */
  image?: string;
  imageAlt?: string;
  /** Optional row of company/partner logos below the features */
  logos?: LogoItem[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Decorative underline (private)                                     */
/* ------------------------------------------------------------------ */

function AccentUnderline() {
  return (
    <div className="mt-2" aria-hidden="true">
      <span className="inline-block h-1 w-40 rounded-full bg-primary" />
      <span className="ml-1 inline-block h-1 w-3 rounded-full bg-primary" />
      <span className="ml-1 inline-block h-1 w-1 rounded-full bg-primary" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * FeaturesIconList -- a split layout with icon-prefixed feature items on
 * the left and an optional large image on the right. An optional logo bar
 * appears below, separated by a divider. Ideal for product feature pages,
 * service overviews, or partner showcases.
 */
export default function FeaturesIconList({
  headline,
  features,
  image,
  imageAlt,
  logos,
  className,
}: FeaturesIconListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("w-full bg-base-100 py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Main content — features + image */}
        <div className="lg:flex lg:items-center">
          {/* Features list */}
          <motion.div
            className="w-full space-y-12 lg:w-1/2"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Headline + accent underline */}
            <motion.div variants={fadeUp}>
              <h2 className="text-2xl font-semibold text-base-content lg:text-3xl">
                {headline}
              </h2>
              <AccentUnderline />
            </motion.div>

            {/* Feature items */}
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4"
              >
                <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/10 p-2 text-primary">
                  {feature.icon}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-base-content">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base-content/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image */}
          {image && (
            <motion.div
              className="mt-12 hidden lg:mt-0 lg:flex lg:w-1/2 lg:items-center lg:justify-center"
              variants={imageReveal}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <img
                src={image}
                alt={imageAlt ?? ""}
                className="h-[28rem] w-[28rem] rounded-full object-cover xl:h-[34rem] xl:w-[34rem]"
                loading="lazy"
              />
            </motion.div>
          )}
        </div>

        {/* Logo bar */}
        {logos && logos.length > 0 && (
          <>
            <hr className="my-12 border-base-300" />
            <motion.div
              className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5"
              variants={containerVariants}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {logos.map((logo, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-center justify-center"
                >
                  <img
                    src={logo.image}
                    alt={logo.imageAlt}
                    className="h-8 max-w-[140px] object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

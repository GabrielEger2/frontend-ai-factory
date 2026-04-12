"use client";

import { cn } from "@lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ContactFormProps {
  /** Section heading */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Form submit button text */
  submitText?: string;
  /** Fields to render — name, email, phone, message are standard */
  fields?: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "textarea";
    required?: boolean;
  }>;
  className?: string;
}

const defaultFields: ContactFormProps["fields"] = [
  { name: "name", label: "Nome", type: "text", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "phone", label: "Telefone", type: "tel" },
  { name: "message", label: "Mensagem", type: "textarea", required: true },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactForm({
  headline,
  subheadline,
  submitText = "Enviar",
  fields = defaultFields,
  className,
}: ContactFormProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-20 md:py-28",
        className,
      )}
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {headline}
          </h2>
          {subheadline && (
            <p className="mt-4 text-lg opacity-70">{subheadline}</p>
          )}
        </div>
        <form className="space-y-6">
          {fields?.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  className="w-full rounded-lg border bg-transparent px-4 py-3"
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="w-full rounded-lg border bg-transparent px-4 py-3"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            {submitText}
          </button>
        </form>
      </div>
    </section>
  );
}

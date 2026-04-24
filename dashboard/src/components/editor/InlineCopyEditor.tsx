"use client";

import { useEffect, useRef, useState } from "react";

interface InlineCopyEditorProps {
  /** Component ID these slots belong to — forwarded to onSlotsChange. */
  componentId: string;
  /** Current slot values (string slots are editable; others are skipped). */
  slots: Record<string, unknown>;
  /**
   * Emits the full next slots object for this component. Debounced at
   * ~300ms so rapid typing doesn't thrash the patch-draft endpoint.
   */
  onSlotsChange: (
    componentId: string,
    newSlots: Record<string, unknown>,
  ) => void;
}

const DEBOUNCE_MS = 300;

/**
 * Per-component slot text editor. Only string-typed slots are rendered
 * (image/url/list slots are skipped in v1 — indicated with a disabled
 * placeholder row). Multi-line strings render as `<textarea>`; short
 * ones as `<input type="text">`. Changes are buffered locally and
 * flushed to the parent after DEBOUNCE_MS of idle so the working draft
 * save stays snappy during continuous typing.
 */
export function InlineCopyEditor({
  componentId,
  slots,
  onSlotsChange,
}: InlineCopyEditorProps) {
  // Local buffer of the in-edit values keyed by slot name.
  const [buffer, setBuffer] = useState<Record<string, unknown>>(slots);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastComponentId = useRef(componentId);

  // When the consumer swaps to a different component, reset the buffer
  // and cancel any pending debounced emit for the previous component.
  useEffect(() => {
    if (lastComponentId.current !== componentId) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      lastComponentId.current = componentId;
      setBuffer(slots);
    }
  }, [componentId, slots]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function updateSlot(name: string, value: string) {
    const next = { ...buffer, [name]: value };
    setBuffer(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSlotsChange(componentId, next);
    }, DEBOUNCE_MS);
  }

  const entries = Object.entries(buffer);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">Content</h3>
        <p className="text-xs text-slate-500">
          Editing slots for{" "}
          <code className="text-[11px] text-slate-600">{componentId}</code>
        </p>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-slate-500">
          No content slots on this component.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {entries.map(([name, value]) => {
          if (typeof value === "string") {
            const isLong = value.length > 60 || value.includes("\n");
            return (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  {name}
                </label>
                {isLong ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateSlot(name, e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateSlot(name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                )}
              </div>
            );
          }

          // Non-string slot — expose as a disabled hint so the seller
          // sees it exists but understands only text editing is supported
          // in v1. List/image slots stay at their humanizer-produced value.
          return (
            <div key={name} className="flex flex-col gap-1 opacity-60">
              <label className="text-xs font-medium text-slate-700">
                {name}
              </label>
              <input
                type="text"
                value={summarizeNonStringSlot(value)}
                disabled
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs italic text-slate-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function summarizeNonStringSlot(value: unknown): string {
  if (Array.isArray(value)) {
    return `list (${value.length} item${value.length === 1 ? "" : "s"}) — not editable in v1`;
  }
  if (value && typeof value === "object") {
    return "object — not editable in v1";
  }
  if (value == null) {
    return "(empty)";
  }
  return String(value);
}

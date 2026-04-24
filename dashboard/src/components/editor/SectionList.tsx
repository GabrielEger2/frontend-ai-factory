"use client";

import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import manifest from "@components/library/manifest.json";

interface ManifestVariant {
  id: string;
  name: string;
}

interface ManifestEntry {
  id: string;
  name?: string;
  category?: string;
  variants?: ManifestVariant[];
}

const MANIFEST = manifest as unknown as ManifestEntry[];

function getManifestEntry(componentId: string): ManifestEntry | undefined {
  return MANIFEST.find((entry) => entry.id === componentId);
}

interface SectionListProps {
  components: string[];
  variantSelections: Record<string, string>;
  onReorder: (newOrder: string[]) => void;
  onSwapRequest: (componentId: string) => void;
  onVariantChange: (componentId: string, variantId: string) => void;
  onSelect?: (componentId: string) => void;
  selectedId?: string | null;
}

/**
 * Draggable list of sections in the blueprint. Each row:
 *   - grip handle (dnd-kit drag trigger)
 *   - friendly component name (from manifest) + fallback to id
 *   - variant picker (when manifest declares variants)
 *   - swap button → opens ComponentPicker for alternatives
 *
 * On drop the new order is emitted via `onReorder` so the parent can
 * patch the workingDraft optimistically.
 */
export function SectionList({
  components,
  variantSelections,
  onReorder,
  onSwapRequest,
  onVariantChange,
  onSelect,
  selectedId,
}: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = useMemo(
    () => components.map((id, idx) => `${id}::${idx}`),
    [components],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(components, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {components.map((componentId, index) => (
            <SortableSection
              key={`${componentId}::${index}`}
              itemId={`${componentId}::${index}`}
              componentId={componentId}
              selectedVariant={variantSelections[componentId]}
              onSwapRequest={onSwapRequest}
              onVariantChange={onVariantChange}
              onSelect={onSelect}
              isSelected={selectedId === componentId}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

interface SortableSectionProps {
  itemId: string;
  componentId: string;
  selectedVariant?: string;
  onSwapRequest: (componentId: string) => void;
  onVariantChange: (componentId: string, variantId: string) => void;
  onSelect?: (componentId: string) => void;
  isSelected: boolean;
}

function SortableSection({
  itemId,
  componentId,
  selectedVariant,
  onSwapRequest,
  onVariantChange,
  onSelect,
  isSelected,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const entry = getManifestEntry(componentId);
  const label = entry?.name ?? componentId;
  const variants = entry?.variants ?? [];

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={
        "group flex flex-col gap-2 rounded-md border bg-white px-3 py-2 text-sm " +
        (isSelected
          ? "border-slate-900 ring-1 ring-slate-900"
          : "border-slate-200 hover:border-slate-300")
      }
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab touch-none text-slate-400 hover:text-slate-700"
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true" className="text-base leading-none">
            ⋮⋮
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect?.(componentId)}
          className="flex-1 truncate text-left text-slate-800 hover:text-slate-900"
          title={componentId}
        >
          {label}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSwapRequest(componentId);
          }}
          className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
        >
          Swap
        </button>
      </div>

      {variants.length > 0 && (
        <select
          value={selectedVariant ?? "default"}
          onChange={(e) => onVariantChange(componentId, e.target.value)}
          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          <option value="default">Default</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name ?? v.id}
            </option>
          ))}
        </select>
      )}
    </li>
  );
}

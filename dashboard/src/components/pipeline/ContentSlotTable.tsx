import type { ContentOutput, HumanizerOutput } from "@/types/project";

interface ContentSlotTableProps {
  output: ContentOutput | HumanizerOutput;
}

export function ContentSlotTable({ output }: ContentSlotTableProps) {
  if (!output.components || output.components.length === 0) {
    return (
      <p className="text-sm text-slate-500">No component data available.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="pb-2 pr-4 font-medium text-slate-500">
              Component ID
            </th>
            <th className="pb-2 pr-4 font-medium text-slate-500">Slot</th>
            <th className="pb-2 font-medium text-slate-500">Value</th>
          </tr>
        </thead>
        <tbody>
          {output.components.map((component) =>
            Object.entries(component.slots).map(([slotName, slotValue]) => (
              <tr
                key={`${component.componentId}-${slotName}`}
                className="border-b border-slate-100"
              >
                <td className="py-2 pr-4 text-slate-700 font-mono text-xs">
                  {component.componentId}
                </td>
                <td className="py-2 pr-4 text-slate-600">{slotName}</td>
                <td className="py-2 text-slate-600 max-w-xs truncate">
                  {String(slotValue)}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useEventStore } from "@/store/useEventStore";
import type { SectionId } from "@/types";

const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero", about: "About", highlights: "Highlights", schedule: "Schedule",
  speakers: "Speakers / Judges", prizes: "Prizes", sponsors: "Sponsors",
  registration: "Registration", contact: "Contact",
};

export default function SectionManager() {
  const { sections, toggleSection, reorderSections } = useEventStore();
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const copy = [...ordered];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    reorderSections(copy.map((s, i) => ({ ...s, order: i })));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Sections</h3>
      {ordered.map((sec, i) => (
        <div key={sec.id} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
          <div className="flex flex-col">
            <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-500 hover:text-white disabled:opacity-30 text-xs leading-none" aria-label="Move up">▲</button>
            <button onClick={() => move(i, 1)} disabled={i === ordered.length - 1} className="text-slate-500 hover:text-white disabled:opacity-30 text-xs leading-none" aria-label="Move down">▼</button>
          </div>
          <span className={`flex-1 text-sm ${sec.enabled ? "text-slate-200" : "text-slate-600 line-through"}`}>{SECTION_LABELS[sec.id]}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={sec.enabled} onChange={() => toggleSection(sec.id)} className="sr-only peer" disabled={sec.id === "hero"} />
            <div className="w-9 h-5 bg-slate-700 peer-checked:bg-indigo-600 rounded-full peer-disabled:opacity-50 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
          </label>
        </div>
      ))}
      <p className="text-xs text-slate-500 mt-2">Hero section is always shown. Use arrows to reorder.</p>
    </div>
  );
}

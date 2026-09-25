import { useEventStore } from "@/store/useEventStore";
import Button from "@/components/ui/Button";
import type { TemplateId } from "@/types";

const TEMPLATES: { id: TemplateId; name: string; emoji: string; description: string; tags: string[] }[] = [
  { id: "hackathon",   name: "Hackathon",       emoji: "💻", description: "Bold, energetic layout for tech events. Features prize tiers, sponsor wall, and hacking timeline.", tags: ["Tech", "Prizes", "Sponsors"] },
  { id: "workshop",    name: "Workshop",         emoji: "📚", description: "Clean, professional template for workshops and seminars. Emphasizes speakers and schedule.", tags: ["Speakers", "Schedule", "Learning"] },
  { id: "cultural",    name: "Cultural Festival",emoji: "🎭", description: "Vibrant, colorful design for cultural and arts events. Hero imagery front and center.", tags: ["Colorful", "Festive", "Gallery"] },
  { id: "competition", name: "Competition",      emoji: "🏆", description: "Focused layout for competitions and contests. Prizes and registration are prominently displayed.", tags: ["Prizes", "Rules", "Registration"] },
  { id: "formal",      name: "Formal Event",     emoji: "🎓", description: "Elegant, minimal design for conferences, convocations, and official college events.", tags: ["Elegant", "Professional", "Clean"] },
];

export default function TemplatePicker() {
  const { template, setTemplate, setStep } = useEventStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Choose a template</h1>
      <p className="text-slate-400 mb-8">Pick the style that best fits your event. You can customize everything next.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`text-left rounded-2xl border p-5 transition-all ${
              template === t.id
                ? "border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30"
                : "border-slate-800 bg-slate-900 hover:border-slate-600"
            }`}
          >
            <div className="text-4xl mb-3">{t.emoji}</div>
            <h3 className="font-semibold text-lg mb-2">{t.name}</h3>
            <p className="text-slate-400 text-sm mb-3 leading-relaxed">{t.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            {template === t.id && (
              <div className="mt-3 text-indigo-400 text-sm font-medium">✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="secondary" onClick={() => setStep("form")}>← Back</Button>
        <Button onClick={() => setStep("preview")}>Customize & Preview →</Button>
      </div>
    </div>
  );
}

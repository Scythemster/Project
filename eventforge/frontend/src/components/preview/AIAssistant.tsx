import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { assistEdit } from "@/api/generateContent";
import { loadAISettings, toAIOptions } from "@/store/aiSettings";
import { THEMES } from "@/utils/themeUtils";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

const QUICK = [
  "Make the copy more energetic and exciting",
  "Make it more formal and professional",
  "Suggest a punchier headline",
  "Shorten the about section",
  "Suggest a fitting color theme",
];

export default function AIAssistant() {
  const { generated, setGenerated, setThemeId } = useEventStore();
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (text: string) => {
    if (!generated || !text.trim()) return;
    setLoading(true); setError(null); setNote(null);
    try {
      const aiOptions = toAIOptions(loadAISettings());
      const result = await assistEdit(generated, text.trim(), aiOptions);
      setGenerated(result.generated);
      if (result.generated.suggestedTheme && THEMES[result.generated.suggestedTheme]) {
        setThemeId(result.generated.suggestedTheme);
      }
      setNote(result.note);
      setInstruction("");
    } catch (e: any) {
      setError(e.message ?? "Assistant failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Ask AI to edit</h3>
        <p className="text-xs text-slate-500 mb-3">Describe a change and the AI rewrites your content. Factual details stay untouched.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button key={q} onClick={() => run(q)} disabled={loading}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full px-2.5 py-1 disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>

      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="e.g. Make the tagline shorter and add urgency"
        rows={3}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(instruction); }}
      />
      <Button size="sm" className="w-full" loading={loading} disabled={!instruction.trim()} onClick={() => run(instruction)}>
        {loading ? "Thinking…" : "Apply AI Suggestion"}
      </Button>

      {note && <Alert variant="success">{note}</Alert>}
      {error && <Alert variant="error" onDismiss={() => setError(null)}>{error} <span className="block mt-1 opacity-80">Tip: set an API key in AI Settings on the previous step.</span></Alert>}
    </div>
  );
}
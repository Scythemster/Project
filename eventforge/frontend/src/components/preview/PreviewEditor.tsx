import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import LivePreview from "./LivePreview";
import PreviewToolbar from "./PreviewToolbar";
import CustomizationPanel from "./CustomizationPanel";
import SectionManager from "@/components/section-manager/SectionManager";
import AIAssistant from "./AIAssistant";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { clsx } from "clsx";

type Tab = "ai" | "style" | "sections";

export default function PreviewEditor() {
  const { setStep, generated } = useEventStore();
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-9rem)]">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 border-r border-slate-800 flex flex-col bg-slate-950">
        <div className="flex border-b border-slate-800">
          <button onClick={() => setTab("ai")} className={clsx("flex-1 py-3 text-sm font-medium", tab === "ai" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500")}>✨ AI</button>
          <button onClick={() => setTab("style")} className={clsx("flex-1 py-3 text-sm font-medium", tab === "style" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500")}>🎨 Style</button>
          <button onClick={() => setTab("sections")} className={clsx("flex-1 py-3 text-sm font-medium", tab === "sections" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500")}>📐 Sections</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {generated?.missingFields?.length ? (
            <Alert variant="warning" className="mb-5">
              <p className="font-medium mb-1">Missing info the AI noticed:</p>
              <ul className="list-disc list-inside">{generated.missingFields.map((f) => <li key={f}>{f}</li>)}</ul>
            </Alert>
          ) : null}
          {tab === "ai" ? <AIAssistant /> : tab === "style" ? <CustomizationPanel /> : <SectionManager />}
        </div>
        <div className="p-4 border-t border-slate-800 flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setStep("template")}>← Back</Button>
          <Button size="sm" className="flex-1" onClick={() => setStep("export")}>Export →</Button>
        </div>
      </aside>

      {/* Preview */}
      <section className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <span className="text-sm text-slate-400">Live Preview</span>
          <PreviewToolbar />
        </div>
        <div className="flex-1 overflow-hidden">
          <LivePreview />
        </div>
      </section>
    </div>
  );
}

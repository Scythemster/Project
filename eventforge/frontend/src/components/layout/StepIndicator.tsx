import { clsx } from "clsx";
import type { WizardStep } from "@/types";

const STEPS: { id: WizardStep; label: string; num: number }[] = [
  { id: "form",     label: "Event Details", num: 1 },
  { id: "template", label: "Choose Template", num: 2 },
  { id: "preview",  label: "Customize & Preview", num: 3 },
  { id: "export",   label: "Export", num: 4 },
];

interface StepIndicatorProps { current: WizardStep; }

export default function StepIndicator({ current }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Progress" className="flex items-center justify-center gap-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className={clsx("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              active && "bg-indigo-600/20 text-indigo-300",
              done && "text-emerald-400",
              !active && !done && "text-slate-500"
            )}>
              <span className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                active && "bg-indigo-600 text-white",
                done && "bg-emerald-700 text-white",
                !active && !done && "bg-slate-800 text-slate-500"
              )}>
                {done ? "✓" : step.num}
              </span>
              <span className="hidden sm:block">{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={clsx("h-px w-8 mx-1", idx < currentIdx ? "bg-emerald-700" : "bg-slate-800")} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

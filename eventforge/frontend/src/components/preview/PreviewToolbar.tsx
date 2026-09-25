import { useEventStore } from "@/store/useEventStore";
import { clsx } from "clsx";

export default function PreviewToolbar() {
  const { previewMode } = useEventStore((s) => s.ui);
  const setPreviewMode = useEventStore((s) => s.setPreviewMode);
  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
      <button
        onClick={() => setPreviewMode("desktop")}
        className={clsx("px-3 py-1.5 rounded text-sm font-medium transition-colors", previewMode === "desktop" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white")}
        aria-pressed={previewMode === "desktop"}
      >
        🖥️ Desktop
      </button>
      <button
        onClick={() => setPreviewMode("mobile")}
        className={clsx("px-3 py-1.5 rounded text-sm font-medium transition-colors", previewMode === "mobile" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white")}
        aria-pressed={previewMode === "mobile"}
      >
        📱 Mobile
      </button>
    </div>
  );
}

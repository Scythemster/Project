import { useMemo } from "react";
import { useEventStore } from "@/store/useEventStore";
import { renderEventHtml } from "@/utils/templateRenderer";
import type { EventConfig } from "@/types";

export function useCurrentConfig(): EventConfig | null {
  const { eventInput, generated, template, theme, sections, heroImageUrl, customRegistrationLabel } = useEventStore();
  return useMemo(() => {
    if (!eventInput || !generated) return null;
    return { input: eventInput, generated, template, theme, sections, heroImageUrl, customRegistrationLabel };
  }, [eventInput, generated, template, theme, sections, heroImageUrl, customRegistrationLabel]);
}

export default function LivePreview() {
  const previewMode = useEventStore((s) => s.ui.previewMode);
  const cfg = useCurrentConfig();

  const html = useMemo(() => (cfg ? renderEventHtml(cfg) : "<p style='color:#888;padding:2rem'>No preview yet</p>"), [cfg]);

  const frameWidth = previewMode === "mobile" ? "375px" : "100%";

  return (
    <div className="flex justify-center bg-slate-950 h-full overflow-auto p-4">
      <iframe
        title="Event website preview"
        srcDoc={html}
        sandbox="allow-same-origin"
        className="bg-white rounded-lg shadow-2xl transition-all duration-300"
        style={{ width: frameWidth, height: "100%", minHeight: "600px", border: "none", maxWidth: "100%" }}
      />
    </div>
  );
}

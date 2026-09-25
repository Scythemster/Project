import JSZip from "jszip";
import type { EventConfig } from "@/types";
import { renderEventHtml } from "@/utils/templateRenderer";

export async function exportToZip(cfg: EventConfig): Promise<void> {
  const zip = new JSZip();
  const html = renderEventHtml(cfg);
  zip.file("index.html", html);
  zip.file("README.txt",
    `EventForge Export\n==================\nEvent: ${cfg.input.eventName}\nOrganizer: ${cfg.input.clubName}\n\nTo use: Open index.html in any browser.\nTo host: Upload index.html to GitHub Pages, Netlify, or any static host.\n`
  );
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cfg.input.eventName.replace(/\s+/g, "-").toLowerCase()}-website.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

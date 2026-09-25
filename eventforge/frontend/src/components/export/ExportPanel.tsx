import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "@/store/useEventStore";
import { useCurrentConfig } from "@/components/preview/LivePreview";
import { exportToZip } from "@/export/zipExporter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

export default function ExportPanel() {
  const cfg = useCurrentConfig();
  const { setStep, reset } = useEventStore();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!cfg) return;
    setDownloading(true);
    setError(null);
    try {
      await exportToZip(cfg);
      setDone(true);
    } catch (e: any) {
      setError(e.message ?? "Export failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-6">📦</div>
      <h1 className="text-3xl font-bold mb-3">Your event site is ready!</h1>
      <p className="text-slate-400 mb-8">Download a self-contained website you can host anywhere.</p>

      {error && <Alert variant="error" className="mb-6 text-left" onDismiss={() => setError(null)}>{error}</Alert>}
      {done && <Alert variant="success" className="mb-6 text-left">Downloaded! Unzip and open index.html in any browser.</Alert>}

      <Card className="mb-6 text-left">
        <h2 className="font-semibold mb-3">What is included</h2>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✅ A single <code className="text-indigo-400">index.html</code> with all styles inlined</li>
          <li>✅ Your selected theme, fonts, colors, and section order</li>
          <li>✅ All event content — schedule, prizes, sponsors, contact</li>
          <li>✅ Works offline and on any static host (GitHub Pages, Netlify, Vercel)</li>
          <li>✅ No dependency on EventForge or any external API</li>
        </ul>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <Button size="lg" onClick={handleDownload} loading={downloading} disabled={!cfg}>
          {downloading ? "Preparing ZIP…" : "⬇ Download Website (.zip)"}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => setStep("preview")}>← Back to Editor</Button>
      </div>

      <button onClick={handleReset} className="text-sm text-slate-500 hover:text-slate-300 underline">
        Start a new event
      </button>
    </div>
  );
}

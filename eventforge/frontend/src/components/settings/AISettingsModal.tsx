import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import {
  type AISettingsState, DEFAULT_AI_SETTINGS, loadAISettings, saveAISettings,
} from "@/store/aiSettings";
import { fetchAISettings, type AISettingsStatus, type ProviderId } from "@/api/generateContent";

const PROVIDER_OPTIONS = [
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "gemini", label: "Google Gemini" },
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "custom", label: "Custom (OpenAI-compatible: Ollama, LM Studio, OpenRouter)" },
];

const MODEL_PLACEHOLDERS: Record<ProviderId, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-1.5-flash",
  anthropic: "claude-3-5-haiku-latest",
  custom: "llama3.1",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: (s: AISettingsState) => void;
}

export default function AISettingsModal({ open, onClose, onSaved }: Props) {
  const [settings, setSettings] = useState<AISettingsState>(DEFAULT_AI_SETTINGS);
  const [status, setStatus] = useState<AISettingsStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSettings(loadAISettings());
      fetchAISettings().then(setStatus).catch(() => setStatusError("Backend not reachable - start it or use in-browser settings."));
    }
  }, [open]);

  const update = <K extends keyof AISettingsState>(key: K, value: AISettingsState[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    saveAISettings(settings);
    onSaved?.(settings);
    onClose();
  };

  const footer = (
    <div className="flex justify-between items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setSettings({ ...DEFAULT_AI_SETTINGS })}>Reset</Button>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="AI Settings" footer={footer}>
      <div className="space-y-5">
        {status && (
          <Alert variant={status.backendKeyConfigured ? "success" : "info"}>
            Backend default: <strong>{status.backendProvider}</strong>
            {status.backendKeyConfigured
              ? " - a server API key is configured, so generation works out of the box."
              : " - no server key set. Either add one in backend/.env or use your own key below."}
          </Alert>
        )}
        {statusError && <Alert variant="warning">{statusError}</Alert>}

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-1"
            checked={settings.enabled}
            onChange={(e) => update("enabled", e.target.checked)}
          />
          <span>
            <span className="font-medium text-slate-200">Use my own AI settings (this browser)</span>
            <span className="block text-xs text-slate-500">
              Overrides the backend default for your requests. Leave off to use the server configuration.
            </span>
          </span>
        </label>

        <fieldset disabled={!settings.enabled} className={settings.enabled ? "space-y-5" : "space-y-5 opacity-50 pointer-events-none"}>
          <Select
            label="Provider"
            options={PROVIDER_OPTIONS}
            value={settings.provider}
            onChange={(e) => update("provider", e.target.value as ProviderId)}
          />

          <Input
            label="Model"
            value={settings.model}
            onChange={(e) => update("model", e.target.value)}
            placeholder={MODEL_PLACEHOLDERS[settings.provider]}
            hint="Leave blank to use the provider default"
          />

          {settings.provider === "custom" && (
            <Input
              label="Base URL"
              value={settings.baseUrl}
              onChange={(e) => update("baseUrl", e.target.value)}
              placeholder="http://localhost:11434/v1"
              hint="Any OpenAI-compatible endpoint (Ollama, LM Studio, OpenRouter, Together)"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">
                Temperature: <span className="text-indigo-400">{settings.temperature.toFixed(2)}</span>
              </label>
              <input
                type="range" min={0} max={2} step={0.05}
                value={settings.temperature}
                onChange={(e) => update("temperature", Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">Lower = focused, higher = creative</p>
            </div>
            <Input
              label="Max tokens"
              type="number" min={64} max={8192}
              value={settings.maxTokens}
              onChange={(e) => update("maxTokens", Number(e.target.value))}
            />
          </div>

          <div>
            <Input
              label="Your API key (optional)"
              type="password"
              value={settings.apiKey}
              onChange={(e) => update("apiKey", e.target.value)}
              placeholder="sk-... / AIza... / sk-ant-..."
              hint="Sent to your backend only, used for this request. Leave blank to use the server key."
            />
            <label className="flex items-center gap-2 mt-2 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" checked={settings.persistKey} onChange={(e) => update("persistKey", e.target.checked)} />
              Remember this key in my browser (localStorage)
            </label>
          </div>

          <Alert variant="warning">
            <strong>Security note:</strong> entering a key here sends it from your browser to your backend.
            This is fine for local or personal use, but do not enter a key on a public deployment you do not control.
            For production, configure keys in backend/.env instead.
          </Alert>
        </fieldset>
      </div>
    </Modal>
  );
}
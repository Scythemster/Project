import { useEventStore } from "@/store/useEventStore";
import { THEMES, FONT_PAIRS } from "@/utils/themeUtils";
import Input from "@/components/ui/Input";
import type { ThemeId, FontPairId } from "@/types";

const THEME_IDS = Object.keys(THEMES) as ThemeId[];
const FONT_IDS = Object.keys(FONT_PAIRS) as FontPairId[];
const FONT_LABELS: Record<FontPairId, string> = {
  "inter-inter": "Inter (clean)",
  "poppins-inter": "Poppins + Inter (modern)",
  "playfair-inter": "Playfair + Inter (elegant)",
  "space-inter": "Space Grotesk + Inter (techy)",
};

export default function CustomizationPanel() {
  const { theme, setThemeId, setFontPair, setPrimaryColor, heroImageUrl, setHeroImageUrl, customRegistrationLabel, setRegistrationLabel } = useEventStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Color Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEME_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setThemeId(id)}
              className={`rounded-lg p-2 border-2 transition-all ${theme.id === id ? "border-white" : "border-transparent"}`}
              style={{ background: THEMES[id].primaryColor }}
              aria-label={`${id} theme`}
              title={id}
            >
              <span className="block h-6 rounded" style={{ background: THEMES[id].accentColor }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Custom Primary Color</h3>
        <div className="flex items-center gap-2">
          <input type="color" value={theme.primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-9 w-14 rounded bg-transparent cursor-pointer" aria-label="Primary color" />
          <span className="text-sm text-slate-400 font-mono">{theme.primaryColor}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Font Pairing</h3>
        <div className="space-y-2">
          {FONT_IDS.map((id) => (
            <label key={id} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input type="radio" name="fontpair" checked={theme.fontPair === id} onChange={() => setFontPair(id)} />
              {FONT_LABELS[id]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Input label="Hero Image URL (optional)" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." hint="Leave blank for a gradient background" />
      </div>

      <div>
        <Input label="Registration Button Label" value={customRegistrationLabel} onChange={(e) => setRegistrationLabel(e.target.value)} placeholder="Register Now" />
      </div>
    </div>
  );
}

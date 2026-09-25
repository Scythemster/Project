import type { EventConfig, SectionConfig } from "@/types";
import { FONT_PAIRS } from "@/utils/themeUtils";
import { escapeHtml } from "@/utils/sanitize";

function fmtDate(iso: string): string {
  try { return new Date(iso).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }); } catch { return iso; }
}

function buildCss(cfg: EventConfig): string {
  const { theme } = cfg;
  const fonts = FONT_PAIRS[theme.fontPair] ?? FONT_PAIRS["inter-inter"];
  return `
@import url('https://fonts.googleapis.com/css2?family=${fonts.googleQuery}&display=swap');
:root {
  --primary: ${theme.primaryColor};
  --accent: ${theme.accentColor};
  --bg: ${theme.bgColor};
  --text: ${theme.textColor};
  --font-heading: '${fonts.heading}', sans-serif;
  --font-body: '${fonts.body}', sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.6}
h1,h2,h3,h4{font-family:var(--font-heading);line-height:1.2}
a{color:var(--primary)}
.container{max-width:900px;margin:0 auto;padding:0 1.5rem}
.hero{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 1.5rem;background:linear-gradient(135deg,var(--bg) 0%,color-mix(in srgb,var(--primary) 20%,var(--bg)) 100%);position:relative;overflow:hidden}
.hero h1{font-size:clamp(2rem,6vw,4rem);font-weight:900;margin-bottom:1rem}
.hero p{font-size:1.2rem;opacity:0.8;max-width:600px;margin-bottom:2rem}
.btn{display:inline-block;padding:.8rem 2rem;background:var(--primary);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:1rem;transition:opacity .2s}
.btn:hover{opacity:.85}
.section{padding:5rem 0}
.section-alt{background:color-mix(in srgb,var(--primary) 5%,var(--bg))}
h2.section-title{font-size:2rem;font-weight:800;margin-bottom:2rem;color:var(--primary)}
.grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem}
.card{background:color-mix(in srgb,var(--primary) 8%,#fff1);border:1px solid color-mix(in srgb,var(--primary) 20%,transparent);border-radius:16px;padding:1.5rem}
.schedule-item{display:grid;grid-template-columns:120px 1fr;gap:1rem;padding:1rem 0;border-bottom:1px solid color-mix(in srgb,var(--primary) 15%,transparent)}
.schedule-item:last-child{border-bottom:none}
.time{font-weight:700;color:var(--primary)}
.prize-card{text-align:center;padding:2rem 1.5rem}
.prize-rank{font-size:2rem;font-weight:900;color:var(--accent);margin-bottom:.5rem}
.sponsor-grid{display:flex;flex-wrap:wrap;gap:1rem;align-items:center}
.sponsor-badge{background:color-mix(in srgb,var(--primary) 10%,#fff1);border:1px solid color-mix(in srgb,var(--primary) 20%,transparent);border-radius:12px;padding:.75rem 1.25rem;font-weight:600}
footer{text-align:center;padding:2rem;opacity:.5;font-size:.85rem;border-top:1px solid color-mix(in srgb,var(--primary) 15%,transparent)}
@media(max-width:600px){.schedule-item{grid-template-columns:1fr}}
`;
}

function heroSection(cfg: EventConfig): string {
  const { input, generated, customRegistrationLabel, heroImageUrl } = cfg;
  const regLabel = customRegistrationLabel || "Register Now";
  const bgStyle = heroImageUrl ? `background-image:url('${escapeHtml(heroImageUrl)}');background-size:cover;background-position:center;` : "";
  return `
  <section class="hero" style="${bgStyle}">
    <div style="position:relative;z-index:1">
      <p style="opacity:.7;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.1em;font-size:.85rem">${escapeHtml(input.clubName)}</p>
      <h1>${escapeHtml(generated.headline)}</h1>
      <p>${escapeHtml(generated.tagline)}</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:1rem">
        <span>📅 ${fmtDate(input.startDate)}</span>
        ${input.venue ? `<span>📍 ${escapeHtml(input.venue)}</span>` : ""}
      </div>
      ${input.registrationUrl ? `<a class="btn" href="${escapeHtml(input.registrationUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(regLabel)}</a>` : ""}
    </div>
  </section>`;
}

function aboutSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  const sec = cfg.sections.find(s => s.id === "about");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.about ?? "About the Event";
  return `
  <section class="section">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <p style="font-size:1.1rem;line-height:1.8;max-width:720px;margin-bottom:2rem">${escapeHtml(generated.about)}</p>
      ${generated.objectives.length ? `
      <h3 style="margin-bottom:1rem;font-size:1.2rem">What to expect</h3>
      <ul style="list-style:none;display:grid;gap:.75rem">
        ${generated.objectives.map(o => `<li style="display:flex;gap:.75rem"><span style="color:var(--accent)">✦</span> ${escapeHtml(o)}</li>`).join("")}
      </ul>` : ""}
    </div>
  </section>`;
}

function scheduleSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  if (!input.schedule?.length) return "";
  const sec = cfg.sections.find(s => s.id === "schedule");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.schedule ?? "Schedule";
  return `
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <div>
        ${input.schedule.map(item => `
        <div class="schedule-item">
          <span class="time">${escapeHtml(item.time)}</span>
          <div><strong>${escapeHtml(item.title)}</strong>${item.description ? `<p style="opacity:.75;margin-top:.25rem">${escapeHtml(item.description)}</p>` : ""}</div>
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function prizesSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  if (!input.prizes?.length) return "";
  const sec = cfg.sections.find(s => s.id === "prizes");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.prizes ?? "Prizes";
  return `
  <section class="section">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <div class="grid-2">
        ${input.prizes.map(p => `
        <div class="card prize-card">
          <div class="prize-rank">${escapeHtml(p.rank)}</div>
          ${p.amount ? `<div style="font-size:1.5rem;font-weight:800;margin-bottom:.5rem">${escapeHtml(p.amount)}</div>` : ""}
          ${p.description ? `<p style="opacity:.75">${escapeHtml(p.description)}</p>` : ""}
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function sponsorsSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  if (!input.sponsors?.length) return "";
  const sec = cfg.sections.find(s => s.id === "sponsors");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.sponsors ?? "Our Sponsors";
  return `
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <div class="sponsor-grid">
        ${input.sponsors.map(s => `
        <div class="sponsor-badge">${s.websiteUrl ? `<a href="${escapeHtml(s.websiteUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name)}</a>` : escapeHtml(s.name)}${s.tier ? ` <span style="opacity:.5;font-size:.8em">(${s.tier})</span>` : ""}</div>`).join("")}
      </div>
    </div>
  </section>`;
}

function speakersSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  if (!input.speakers?.length) return "";
  const sec = cfg.sections.find(s => s.id === "speakers");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.speakers ?? "Speakers & Judges";
  return `
  <section class="section">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <div class="grid-2">
        ${input.speakers.map(sp => `
        <div class="card">
          ${sp.photoUrl ? `<img src="${escapeHtml(sp.photoUrl)}" alt="${escapeHtml(sp.name)}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:1rem">` : `<div style="width:64px;height:64px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1rem">${escapeHtml(sp.name[0] ?? "?")}</div>`}
          <h3>${escapeHtml(sp.name)}</h3>
          ${sp.title ? `<p style="color:var(--accent);font-size:.85rem;margin-bottom:.5rem">${escapeHtml(sp.title)}</p>` : ""}
          ${sp.bio ? `<p style="opacity:.75;font-size:.9rem">${escapeHtml(sp.bio)}</p>` : ""}
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function registrationSection(cfg: EventConfig): string {
  const { input, generated, customRegistrationLabel } = cfg;
  if (!input.registrationUrl) return "";
  const sec = cfg.sections.find(s => s.id === "registration");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.registration ?? "Register Now";
  const label = customRegistrationLabel || "Register Now";
  return `
  <section class="section section-alt" style="text-align:center">
    <div class="container">
      <h2 class="section-title" style="text-align:center">${escapeHtml(heading)}</h2>
      <p style="margin-bottom:2rem;opacity:.8">Spots are limited. Secure your place today.</p>
      <a class="btn" href="${escapeHtml(input.registrationUrl!)}" target="_blank" rel="noopener noreferrer" style="font-size:1.1rem;padding:1rem 2.5rem">${escapeHtml(label)}</a>
    </div>
  </section>`;
}

function contactSection(cfg: EventConfig): string {
  const { input, generated } = cfg;
  if (!input.contact) return "";
  const c = input.contact;
  const sec = cfg.sections.find(s => s.id === "contact");
  const heading = sec?.customHeading ?? generated.sectionHeadings?.contact ?? "Contact Us";
  return `
  <section class="section">
    <div class="container">
      <h2 class="section-title">${escapeHtml(heading)}</h2>
      <div style="display:flex;flex-wrap:wrap;gap:1.5rem">
        ${c.email ? `<a href="mailto:${escapeHtml(c.email)}">📧 ${escapeHtml(c.email)}</a>` : ""}
        ${c.phone ? `<span>📞 ${escapeHtml(c.phone)}</span>` : ""}
        ${c.website ? `<a href="${escapeHtml(c.website)}" target="_blank" rel="noopener noreferrer">🌐 Website</a>` : ""}
        ${c.twitter ? `<span>𝕏 ${escapeHtml(c.twitter)}</span>` : ""}
        ${c.instagram ? `<span>📸 ${escapeHtml(c.instagram)}</span>` : ""}
      </div>
    </div>
  </section>`;
}

const SECTION_BUILDERS: Record<string, (cfg: EventConfig) => string> = {
  hero:         heroSection,
  about:        aboutSection,
  highlights:   (cfg) => aboutSection(cfg), // reuse about for highlights in some templates
  schedule:     scheduleSection,
  speakers:     speakersSection,
  prizes:       prizesSection,
  sponsors:     sponsorsSection,
  registration: registrationSection,
  contact:      contactSection,
};

export function renderEventHtml(cfg: EventConfig): string {
  const enabledSections = [...cfg.sections]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const css = buildCss(cfg);
  const body = enabledSections.map(s => (SECTION_BUILDERS[s.id] ?? (() => ""))(cfg)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https: data:; script-src 'none'">
  <title>${escapeHtml(cfg.input.eventName)} — ${escapeHtml(cfg.input.clubName)}</title>
  <style>${css}</style>
</head>
<body>
${body}
<footer><p>Powered by EventForge</p></footer>
</body>
</html>`;
}

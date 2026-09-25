# EventForge

AI-powered event website generator for college clubs and student organizations.

EventForge turns a simple form into a polished, customizable, exportable event website in minutes. Enter your event details, pick a template, let AI write compelling copy, customize the design, and download a self-contained website you can host anywhere.

## Features

- Event details form with full validation (react-hook-form + Zod)
- AI content generation for headline, tagline, about, objectives, and section headings. Never invents factual details (dates, venues, prizes, sponsors).
- 5 reusable templates: Hackathon, Workshop, Cultural Festival, Competition, Formal Event
- Live preview in a sandboxed iframe with desktop and mobile modes
- Customization: theme colors, custom primary color, font pairings, hero image, section visibility and order, registration button label
- Export a single self-contained index.html (all CSS inlined) that works offline and on any static host
- Security: HTML escaping, HTTPS-only URL validation, CSP in exports, API keys kept server-side
- 34 automated tests (Vitest + React Testing Library + Supertest)

## Tech Stack

- Frontend: React 18, Vite 5, TypeScript, Tailwind CSS
- State: Zustand
- Forms & validation: react-hook-form, Zod
- Export: JSZip
- Backend: Express, TypeScript
- AI: OpenAI (with a deterministic fallback when no key is set)
- Testing: Vitest, React Testing Library, Supertest

## Getting Started

Prerequisites: Node.js 18+ and npm

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # optional: add your OpenAI key
npm run dev               # starts on http://localhost:3001
```

Without an OPENAI_API_KEY, the backend runs in fallback mode and returns deterministic, honest content built from your input. This lets you use the entire app with no API key. To enable real AI, set OPENAI_API_KEY and OPENAI_MODEL in backend/.env.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies /api/* to the backend on port 3001, so run both together. Open http://localhost:5173 and click Create Event Site. There is a Use mock AI checkbox on the form so you can try the full flow even without the backend running.

## Usage Flow

1. Event Details - fill in name, club, category, date, description, and optional schedule/prizes/sponsors/speakers/contact.
2. Choose Template - pick a visual style for your event category.
3. Customize & Preview - adjust theme, fonts, hero image, toggle and reorder sections, all reflected live.
4. Export - download a .zip containing a standalone index.html.

## Testing

```bash
cd frontend && npm test    # unit + component tests
cd backend && npm test     # API integration tests
```

## Building for Production

```bash
cd frontend && npm run build          # static files in frontend/dist
cd backend && npm run build && npm start
```

## Deployment

Frontend (static): deploy frontend/dist to Netlify, Vercel, or GitHub Pages.
Backend (Node service): deploy to Render, Railway, or Fly.io. Set OPENAI_API_KEY, OPENAI_MODEL, PORT, and CORS_ORIGIN.

## Security Notes

- API keys never reach the browser; all LLM calls happen in the backend.
- Exported sites are sanitized: all user/AI text is HTML-escaped, and exports include a script-src 'none' CSP.
- URLs are validated as https: only before being embedded.
- AI output is schema-validated with Zod on the server before it is trusted.

## License

MIT - free to use and adapt for your club or organization.

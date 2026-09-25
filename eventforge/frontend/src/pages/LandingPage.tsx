import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const FEATURES = [
  { icon: "✨", title: "AI-Generated Copy", desc: "Compelling headlines, descriptions, and objectives written by AI from your event details." },
  { icon: "🎨", title: "5 Pro Templates", desc: "Hackathon, workshop, cultural festival, competition, and formal event styles." },
  { icon: "👁️", title: "Live Preview", desc: "See your changes instantly in desktop and mobile views side-by-side." },
  { icon: "🎛️", title: "Full Customization", desc: "Change colors, fonts, sections, and content. Everything is editable." },
  { icon: "📦", title: "Export as ZIP", desc: "Download a self-contained website that works on any host — GitHub Pages, Netlify, anywhere." },
  { icon: "⚡", title: "Zero Code Needed", desc: "Fill out a form and get a professional event site in under 5 minutes." },
];

const CATEGORIES = [
  { emoji: "💻", name: "Hackathons" },
  { emoji: "📚", name: "Workshops" },
  { emoji: "🎭", name: "Cultural Fests" },
  { emoji: "🏆", name: "Competitions" },
  { emoji: "🎓", name: "Seminars" },
  { emoji: "🎩", name: "Formal Events" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-purple-950/30 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span>⚡</span> AI-Powered Event Website Generator
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Launch Your Event Site{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            EventForge turns a simple form into a polished, fully-customizable event webpage.
            Perfect for college clubs, hackathons, workshops, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg">Get Started — It's Free</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="secondary">See Features</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 border-y border-slate-800">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-500 text-sm mb-6">Works for every type of event</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <span key={c.name} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm text-slate-300">
                <span>{c.emoji}</span> {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Everything you need</h2>
          <p className="text-slate-400 text-center mb-14 text-lg">From blank form to finished website, no design skills required.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:border-indigo-800 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-14">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { n: "1", t: "Fill the Form", d: "Enter your event details — name, date, description, schedule, sponsors." },
              { n: "2", t: "Pick a Template", d: "Choose a visual style suited to your event category." },
              { n: "3", t: "AI Generates", d: "Our AI writes compelling copy and configures your page sections." },
              { n: "4", t: "Customize & Export", d: "Tweak colors, fonts, and sections, then download your site." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold mb-4">{step.n}</div>
                <h3 className="font-semibold mb-2">{step.t}</h3>
                <p className="text-slate-400 text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your event site?</h2>
          <p className="text-slate-400 mb-8">Free, instant, no account needed.</p>
          <Link to="/create">
            <Button size="lg">Start Creating</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <span className="text-2xl">⚡</span>
          <span>EventForge</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/create">
            <Button size="sm">Create Event Site</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

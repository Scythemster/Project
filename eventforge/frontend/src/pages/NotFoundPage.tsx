import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8">The page you are looking for does not exist.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );
}

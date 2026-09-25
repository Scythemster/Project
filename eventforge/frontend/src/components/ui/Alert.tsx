import { clsx } from "clsx";
import React from "react";
type AlertVariant = "info" | "success" | "warning" | "error";
interface AlertProps { variant?: AlertVariant; title?: string; children: React.ReactNode; onDismiss?: () => void; className?: string; }
export default function Alert({ variant = "info", title, children, onDismiss, className }: AlertProps) {
  const styles = {
    info:    "bg-indigo-950 border-indigo-800 text-indigo-200",
    success: "bg-emerald-950 border-emerald-800 text-emerald-200",
    warning: "bg-amber-950 border-amber-800 text-amber-200",
    error:   "bg-rose-950 border-rose-800 text-rose-200",
  };
  const icons = { info: "i", success: "✓", warning: "!", error: "×" };
  return (
    <div role="alert" className={clsx("border rounded-xl p-4 flex gap-3", styles[variant], className)}>
      <span className="text-lg flex-shrink-0 font-bold">{icons[variant]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 text-lg" aria-label="Dismiss">×</button>
      )}
    </div>
  );
}

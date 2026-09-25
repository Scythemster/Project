import { clsx } from "clsx";
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";
interface BadgeProps { variant?: BadgeVariant; children: React.ReactNode; className?: string; }
import React from "react";
export default function Badge({ variant = "default", children, className }: BadgeProps) {
  const v = {
    default: "bg-slate-800 text-slate-300",
    success: "bg-emerald-900/50 text-emerald-400",
    warning: "bg-amber-900/50 text-amber-400",
    danger: "bg-rose-900/50 text-rose-400",
    info: "bg-indigo-900/50 text-indigo-400",
  };
  return <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", v[variant], className)}>{children}</span>;
}

import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline";
}

export default function Card({ variant = "default", className, children, ...props }: CardProps) {
  const variants = {
    default: "bg-slate-900 border border-slate-800",
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    outline: "border border-slate-700",
  };
  return (
    <div className={clsx("rounded-2xl p-6", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

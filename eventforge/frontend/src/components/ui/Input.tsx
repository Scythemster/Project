import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-rose-400 ml-1" aria-hidden>*</span>}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "bg-slate-900 border rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          error ? "border-rose-500" : "border-slate-700 hover:border-slate-600",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export default Input;
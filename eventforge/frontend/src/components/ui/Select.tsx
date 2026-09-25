import { clsx } from "clsx";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, className, id, ...props },
  ref
) {
  const selectId = id ?? props.name ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-rose-400 ml-1" aria-hidden>*</span>}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "bg-slate-900 border rounded-lg px-3 py-2.5 text-sm text-slate-100 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          error ? "border-rose-500" : "border-slate-700 hover:border-slate-600",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export default Select;
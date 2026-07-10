import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  /** When true on a password field, renders a built-in show/hide toggle. */
  passwordToggle?: boolean;
}

export default function Input({
  className,
  error = false,
  success = false,
  prefixIcon: Prefix,
  suffixIcon: Suffix,
  passwordToggle = false,
  type,
  ...props
}: InputProps) {
  const [show, setShow] = useState(false);

  const isPassword = passwordToggle && type === "password";
  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  const hasPrefix = Boolean(Prefix);
  const hasSuffix = Boolean(Suffix) || isPassword;

  const ring = error
    ? "ring-red-300 focus:ring-2 focus:ring-red-500 focus:shadow-lg focus:shadow-red-500/10"
    : success
    ? "ring-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10"
    : "ring-slate-200 hover:ring-slate-300 focus:ring-2 focus:ring-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10";

  const inputClass = clsx(
    "h-11 w-full rounded-xl bg-white px-3.5 text-sm text-slate-900 shadow-sm",
    "ring-1 ring-inset outline-none transition-all duration-200",
    "placeholder:text-slate-400",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
    ring,
    hasPrefix && "pl-10",
    hasSuffix && "pr-10",
    className
  );

  // Simple mode — backward compatible bare input.
  if (!hasPrefix && !hasSuffix) {
    return <input type={type} {...props} className={inputClass} />;
  }

  return (
    <div className="relative w-full">
      {Prefix && (
        <Prefix
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}

      <input type={resolvedType} {...props} className={inputClass} />

      {isPassword ? (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-indigo-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      ) : (
        Suffix && (
          <Suffix
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )
      )}
    </div>
  );
}

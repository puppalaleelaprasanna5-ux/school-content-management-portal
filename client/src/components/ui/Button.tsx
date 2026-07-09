import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "flex",
        "h-14",
        "w-full",
        "items-center",
        "justify-center",
        "rounded-2xl",
        "bg-gradient-to-r",
        "from-indigo-600",
        "to-purple-600",
        "font-semibold",
        "text-white",
        "shadow-lg",
        "transition-all",
        "duration-300",
        "hover:-translate-y-0.5",
        "hover:shadow-xl",
        "active:translate-y-0",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        className
      )}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Signing In...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full",
        "h-14",
        "rounded-2xl",
        "border",
        "border-slate-300",
        "bg-white",
        "px-5",
        "text-[15px]",
        "text-slate-700",
        "placeholder:text-slate-400",
        "transition-all",
        "duration-200",
        "outline-none",
        "focus:border-indigo-500",
        "focus:ring-4",
        "focus:ring-indigo-100",
        className
      )}
    />
  );
}
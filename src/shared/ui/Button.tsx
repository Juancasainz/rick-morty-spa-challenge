import React from "react";

type ButtonVariant = "primary" | "secondary";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "secondary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm " +
    "border transition disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-black text-white border-black hover:bg-black/90"
      : "bg-white border-black/20 hover:transition-shadow hover:shadow-[0_0_0_1px_rgba(120,255,230,0.18),0_0_24px_rgba(120,255,230,0.14)]";

  return <button type="button" {...props} className={`${base} ${styles} ${className}`} />;
}

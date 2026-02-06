export type BadgeColor = "green" | "yellow" | "emerald";

type Props = {
  label: string;
  color: BadgeColor;
};

const COLOR_CLASSES: Record<BadgeColor, string> = {
  green: "bg-green-100 text-green-800 ring-green-200",
  yellow: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  emerald: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export function Badge({ label, color }: Props) {
  if (!label) return null;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        "ring-1 ring-inset",
        COLOR_CLASSES[color],
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {label}
    </span>
  );
}

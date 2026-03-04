import React from "react";

type Props = {
    label: string;
    value: React.ReactNode;
};

export function Field({ label, value, ...props }: Props) {
    return (
        <div {...props} className={`rounded-xl border border-black/10 p-3 bg-black`}>
            <p className="text-xs uppercase tracking-wide">{label}</p>
            <p className="mt-1 text-sm">{value || "—"}</p>
        </div>
    );
}

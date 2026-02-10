import React from "react";

type Props = {
    label: string;
    value: React.ReactNode;
};

export function Field({ label, value, ...props }: Props) {
    return (
        <div {...props} className={`rounded-xl border border-black/10 p-3 bg-black`}>
            <div className="text-xs uppercase tracking-wide">{label}</div>
            <div className="mt-1 text-sm">{value || "—"}</div>
        </div>
    );
}

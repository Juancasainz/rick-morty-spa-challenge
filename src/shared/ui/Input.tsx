import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  title: string;
};

export function Input({ id, title, className = "", ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {title}
      </label>
      <input
        id={id}
        {...props}
        className={`mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm ${className}`}
      />
    </div>
  );
}
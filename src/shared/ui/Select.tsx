import React from "react";

type OptionsMap = Record<string, string>;

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  id: string;
  title: string;
  value: string;
  options: OptionsMap;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function Select({
  id,
  title,
  value,
  options,
  placeholder,
  onChange,
  className = "",
  ...rest
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {title}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm ${className}`}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}

        {Object.entries(options).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

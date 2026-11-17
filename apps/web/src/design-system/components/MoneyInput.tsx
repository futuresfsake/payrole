"use client";

import { useState } from "react";
import { formatPhp, parsePhp } from "@/lib/money";
import { Input } from "./Input";

export interface MoneyInputProps {
  id: string;
  label: string;
  /** Integer centavos, or null when empty. */
  value: number | null;
  onChange: (centavos: number | null) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

/** Typing is free text; the value that leaves this component is always integer centavos. */
export function MoneyInput({ id, label, value, onChange, hint, error, disabled }: MoneyInputProps) {
  const [text, setText] = useState(value === null ? "" : formatPhp(value).replace("₱", ""));
  const [typed, setTyped] = useState(false);
  const parsed = parsePhp(text);
  const invalid = typed && text.trim() !== "" && parsed === null;

  return (
    <Input
      id={id}
      label={label}
      hint={hint ?? "Pesos and centavos, for example 1,250.50"}
      error={error ?? (invalid ? "Use numbers with up to 2 decimals, for example 1,250.50." : undefined)}
      disabled={disabled}
      inputMode="decimal"
      className="[&_input]:text-right [&_input]:font-mono"
      value={text}
      onChange={(event) => {
        setTyped(true);
        setText(event.target.value);
        onChange(event.target.value.trim() === "" ? null : parsePhp(event.target.value));
      }}
      onBlur={() => {
        if (parsed !== null) setText(formatPhp(parsed).replace("₱", ""));
      }}
    />
  );
}

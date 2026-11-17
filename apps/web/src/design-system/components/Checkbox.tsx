"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  hint?: string;
}

export function Checkbox({ id, label, checked, onCheckedChange, disabled, hint }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3 py-1">
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(
          "mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-[4px] border border-control bg-surface",
          "data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <RadixCheckbox.Indicator>
          <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <div>
        <label htmlFor={id} className={cn(disabled && "text-muted")}>
          {label}
        </label>
        {hint ? (
          <p id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

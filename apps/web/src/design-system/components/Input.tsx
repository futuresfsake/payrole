import { forwardRef, type InputHTMLAttributes } from "react";
import { Field, controlClass } from "./Field";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ id, label, hint, error, className, ...rest }, ref) {
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={controlClass(Boolean(error))}
        {...rest}
      />
    </Field>
  );
});

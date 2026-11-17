import { forwardRef, type InputHTMLAttributes } from "react";
import { Field, controlClass } from "./Field";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

/** Native date input: keyboard and screen-reader friendly, and the browser shows its own calendar. Values are ISO dates. */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({ id, label, hint, error, ...rest }, ref) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        ref={ref}
        id={id}
        type="date"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={controlClass(Boolean(error))}
        {...rest}
      />
    </Field>
  );
});

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white border border-accent hover:bg-accent-hover",
  secondary: "bg-surface text-ink border border-control hover:bg-soft",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-soft",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading = false, icon, disabled, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-150",
        size === "md" ? "min-h-8 px-4 py-1.5" : "min-h-6 px-3",
        VARIANTS[variant],
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-soft disabled:text-muted",
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

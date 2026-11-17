"use client";

import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Overlay: the only place a shadow is allowed. */
export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-ink/40" />
        <RadixDialog.Content
          className="fixed left-1/2 top-1/2 w-[min(440px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-dialog bg-surface p-6 shadow-xl"
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <RadixDialog.Title className="text-base font-semibold">{title}</RadixDialog.Title>
          {description ? <RadixDialog.Description className="mt-1 text-muted">{description}</RadixDialog.Description> : null}
          <div className="mt-4">{children}</div>
          {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

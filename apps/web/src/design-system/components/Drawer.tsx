"use client";

import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/** Side panel for secondary tasks, and the mobile navigation drawer. */
export function Drawer({ open, onOpenChange, title, children }: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-ink/40" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 flex w-[min(420px,100vw)] flex-col bg-surface shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <RadixDialog.Title className="text-base font-semibold">{title}</RadixDialog.Title>
            <RadixDialog.Close asChild>
              <IconButton label="Close">
                <X className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

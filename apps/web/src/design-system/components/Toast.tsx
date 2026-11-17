"use client";

import { CheckCircle2, X } from "lucide-react";
import { IconButton } from "./IconButton";

export interface ToastProps {
  message: string;
  onClose: () => void;
}

/** Success feedback after an action. Overlay, so it may carry a shadow. */
export function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-dialog border border-line bg-surface py-2 pl-4 pr-2 shadow-lg"
    >
      <CheckCircle2 className="h-4 w-4 flex-none text-success" aria-hidden="true" />
      <p>{message}</p>
      <IconButton label="Dismiss message" onClick={onClose}>
        <X className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

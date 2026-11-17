"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export interface OfflineBannerProps {
  /** Test hook: force the state without touching the network. */
  forceOffline?: boolean;
}

/** Me workspace is a PWA. Reading cached pages works offline; anything that changes data waits for a connection. */
export function OfflineBanner({ forceOffline }: OfflineBannerProps) {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online && !forceOffline) return null;
  return (
    <div role="status" className="flex items-center gap-3 border-b border-line bg-warning-tint px-4 py-2 text-warning">
      <WifiOff className="h-4 w-4 flex-none" aria-hidden="true" />
      <p>You're offline. You can read what you've already opened. Requests and approvals will wait until you reconnect.</p>
    </div>
  );
}

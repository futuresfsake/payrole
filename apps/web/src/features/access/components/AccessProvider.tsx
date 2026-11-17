"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ErrorState, Skeleton } from "@/design-system";
import { useResource } from "@/lib/useResource";
import { getEffectiveAccess } from "../api/access";
import { AccessContext } from "../context";

export function AccessProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, error, loading, reload } = useResource(getEffectiveAccess);

  useEffect(() => {
    if (error?.status === 401) router.replace("/sign-in");
  }, [error, router]);

  if (loading && !data) {
    return (
      <div className="p-6">
        <Skeleton rows={6} label="Loading your workspaces" className="max-w-3xl" />
      </div>
    );
  }
  if (error && error.status !== 401) {
    return (
      <div className="p-6">
        <ErrorState problem={error} onRetry={reload} />
      </div>
    );
  }
  if (!data) return null;
  return <AccessContext.Provider value={{ access: data, reload }}>{children}</AccessContext.Provider>;
}

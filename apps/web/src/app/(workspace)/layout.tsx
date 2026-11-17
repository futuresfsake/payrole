import type { ReactNode } from "react";
import { AccessProvider } from "@/features/access/components/AccessProvider";
import { AppShell } from "@/features/access/components/AppShell";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AccessProvider>
      <AppShell>{children}</AppShell>
    </AccessProvider>
  );
}

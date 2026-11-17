import { Building2, Banknote, Network, User, Users } from "lucide-react";
import type { AccessScope, ScopeType } from "@/lib/access";

const ICONS: Record<ScopeType, typeof User> = {
  self: User,
  team: Users,
  org_unit: Network,
  pay_group: Banknote,
  tenant: Building2,
};

const NAMES: Record<ScopeType, string> = {
  self: "Own records",
  team: "Team",
  org_unit: "Org unit",
  pay_group: "Pay group",
  tenant: "Whole company",
};

export interface ScopeChipProps {
  scope: AccessScope;
}

/** States what the current view covers. The text comes from the server so it matches the query that ran. */
export function ScopeChip({ scope }: ScopeChipProps) {
  const Icon = ICONS[scope.type];
  return (
    <span className="inline-flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-1 text-muted">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{NAMES[scope.type]}: </span>
      {scope.label}
    </span>
  );
}

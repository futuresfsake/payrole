"use client";

import { useResource } from "@/lib/useResource";
import { listApprovals } from "../api/approvals";

export function useApprovals() {
  return useResource(listApprovals);
}

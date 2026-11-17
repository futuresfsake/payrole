"use client";

import { useResource } from "@/lib/useResource";
import { getLeaveBalances, listMyLeaveRequests } from "../api/leave";

export function useLeaveBalances() {
  return useResource(getLeaveBalances);
}

export function useMyLeaveRequests() {
  return useResource(listMyLeaveRequests);
}

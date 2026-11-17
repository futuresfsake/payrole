"use client";

import { useContext } from "react";
import { AccessContext, type AccessContextValue } from "../context";

/** The effective-access object from the API. Components ask for permissions here; they never look at role names. */
export function useAccess(): AccessContextValue {
  const value = useContext(AccessContext);
  if (!value) throw new Error("useAccess must be used inside AccessProvider");
  return value;
}

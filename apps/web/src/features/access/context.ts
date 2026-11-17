"use client";

import { createContext } from "react";
import type { EffectiveAccessDto } from "./api/access";

export interface AccessContextValue {
  access: EffectiveAccessDto;
  reload: () => void;
}

export const AccessContext = createContext<AccessContextValue | null>(null);

"use client";

import type { ReactNode } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: readonly TabItem[];
  defaultValue?: string;
  label: string;
}

/** Selected tab: neutral fill, same weight, thin accent bar underneath. */
export function Tabs({ items, defaultValue, label }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value}>
      <RadixTabs.List aria-label={label} className="mb-4 flex border-b border-line">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className="relative px-4 py-3 transition-colors duration-150 hover:bg-soft data-[state=active]:bg-soft data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}

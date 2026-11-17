"use client";

import { useCallback, useEffect, useState } from "react";
import { asProblem } from "./api";
import type { Problem } from "./problem";

export interface Resource<T> {
  data: T | undefined;
  error: Problem | undefined;
  loading: boolean;
  reload: () => void;
}

/** Loads one resource and exposes loading, error (as problem+json) and reload. Fetching stays in features/<domain>/api. */
export function useResource<T>(fetcher: () => Promise<T>): Resource<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Problem>();
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setError(undefined);
      })
      .catch((failure: unknown) => {
        if (!cancelled) setError(asProblem(failure));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // The fetcher is a stable module function per hook; reload() bumps `tick`.
  }, [tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  return { data, error, loading, reload };
}

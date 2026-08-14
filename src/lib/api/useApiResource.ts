"use client";

import { useCallback, useEffect, useState } from "react";
import type { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api/client";

export function useApiResource<T>(path: string | null, schema: z.ZodType<T>) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{
    path: string | null;
    revision: number;
    data: T | null;
    error: ApiError | null;
  }>({ path: null, revision: -1, data: null, error: null });

  const reload = useCallback(() => {
    setRevision((current) => current + 1);
    return Promise.resolve();
  }, []);

  useEffect(() => {
    if (!path) return;
    let active = true;
    apiFetch(path, schema)
      .then((data) => {
        if (active) setState({ path, revision, data, error: null });
      })
      .catch((caught: unknown) => {
        if (active) {
          setState({
            path,
            revision,
            data: null,
            error: caught instanceof ApiError ? caught : null,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [path, revision, schema]);

  const current = state.path === path && state.revision === revision;
  return {
    data: current ? state.data : null,
    loading: Boolean(path) && !current,
    error: current ? state.error : null,
    reload,
  };
}

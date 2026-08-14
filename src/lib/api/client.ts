import type { z } from "zod";
import { errorResponseSchema } from "@/lib/contracts/common";

const API_PREFIX = "/api/backend";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly correlationId: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

async function parseError(response: Response): Promise<ApiError> {
  const payload: unknown = await response.json().catch(() => null);
  const parsed = errorResponseSchema.safeParse(payload);
  if (parsed.success) {
    return new ApiError(
      parsed.data.error.message,
      response.status,
      parsed.data.error.code,
      parsed.data.error.correlation_id,
      parsed.data.error.retryable,
    );
  }
  return new ApiError(
    "Respons server tidak dapat diproses.",
    response.status,
    "INVALID_RESPONSE",
    response.headers.get("x-correlation-id") ?? "tidak tersedia",
    response.status >= 500,
  );
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "same-origin",
    cache: "no-store",
  });
  if (response.status !== 401 || path.startsWith("/v1/auth/")) return response;

  const refreshed = await fetch(`${API_PREFIX}/v1/auth/refresh`, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!refreshed.ok) return response;

  return fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "same-origin",
    cache: "no-store",
  });
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await request(path, init);
  if (!response.ok) throw await parseError(response);
  const payload: unknown = await response.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(
      "Bentuk data dari server tidak sesuai kontrak.",
      500,
      "CONTRACT_MISMATCH",
      response.headers.get("x-correlation-id") ?? "tidak tersedia",
      false,
    );
  }
  return parsed.data;
}


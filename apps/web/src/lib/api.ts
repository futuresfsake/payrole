import type { components } from "./api-types";
import type { Problem } from "./problem";

export type ApiSchemas = components["schemas"];

export class ApiError extends Error {
  readonly problem: Problem;
  constructor(problem: Problem) {
    super(problem.title);
    this.name = "ApiError";
    this.problem = problem;
  }
}

function toProblem(status: number, body: unknown): Problem {
  if (body && typeof body === "object" && "title" in body && "correlationId" in body) return body as Problem;
  return { type: "about:blank", title: "Something went wrong", status, detail: "The server sent a reply we couldn't read.", correlationId: "unknown" };
}

/** Typed JSON fetch. Failures throw an ApiError holding the problem+json body, with its reason code and correlation id. */
export async function apiFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  let response: Response;
  try {
    response = await fetch(path, {
      ...rest,
      headers: { ...(json !== undefined ? { "content-type": "application/json" } : {}), ...headers },
      ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
    });
  } catch {
    throw new ApiError({ type: "about:blank", title: "You're offline or the server can't be reached", status: 0, detail: "Check your connection and try again.", correlationId: "none" });
  }
  if (response.status === 204) return undefined as T;
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(toProblem(response.status, body));
  return body as T;
}

export function asProblem(error: unknown): Problem {
  if (error instanceof ApiError) return error.problem;
  return { type: "about:blank", title: "Something went wrong", status: 0, correlationId: "none" };
}

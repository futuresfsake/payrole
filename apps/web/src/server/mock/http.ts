import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ReasonCode } from "@/lib/problem";

const COOKIE = "payrole_session";

export function correlationId(): string {
  return `req-${Math.random().toString(16).slice(2, 10)}`;
}

export function problem(status: number, title: string, detail?: string, reasonCode?: ReasonCode): NextResponse {
  return NextResponse.json(
    { type: "about:blank", title, status, ...(detail ? { detail } : {}), correlationId: correlationId(), ...(reasonCode ? { reasonCode } : {}) },
    { status, headers: { "content-type": "application/problem+json" } },
  );
}

/** The mock session is the person's key in an HttpOnly cookie. The real API uses a server-side session store. */
export async function sessionPersonKey(): Promise<string | null> {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

export async function startSession(personKey: string): Promise<void> {
  (await cookies()).set(COOKIE, personKey, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export function unauthenticated(): NextResponse {
  return problem(401, "Sign in to continue", "Your session ended or you haven't signed in yet.");
}

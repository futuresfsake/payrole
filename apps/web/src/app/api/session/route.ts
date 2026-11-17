import { NextResponse } from "next/server";
import { z } from "zod";
import { findPerson } from "@/server/mock/people";
import { endSession, problem, startSession } from "@/server/mock/http";

const body = z.object({ personId: z.string().min(1), code: z.string().regex(/^\d{6}$/) });

/** Mock identity provider: any person from the seed, and any 6-digit code except 000000. */
export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return problem(422, "Enter the 6 digits from your authenticator app");
  const person = findPerson(parsed.data.personId);
  if (!person || !person.active) return problem(401, "That person can't sign in");
  if (parsed.data.code === "000000") return problem(401, "That code didn't match", "Try the newest code from your authenticator app.");
  await startSession(person.key);
  return new NextResponse(null, { status: 204 });
}

export async function DELETE() {
  await endSession();
  return new NextResponse(null, { status: 204 });
}

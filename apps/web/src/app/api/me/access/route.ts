import { NextResponse } from "next/server";
import { computeAccess } from "@/server/mock/access";
import { sessionPersonKey, unauthenticated } from "@/server/mock/http";

export async function GET() {
  const key = await sessionPersonKey();
  const access = key ? computeAccess(key) : null;
  if (!access) return unauthenticated();
  return NextResponse.json(access);
}

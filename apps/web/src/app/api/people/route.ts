import { NextResponse } from "next/server";
import { signInPeople } from "@/server/mock/access";

export async function GET() {
  return NextResponse.json(signInPeople());
}

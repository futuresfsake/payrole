import { NextResponse } from "next/server";
import { balanceFor, typeName } from "@/server/mock/store";
import { sessionPersonKey, unauthenticated } from "@/server/mock/http";

export async function GET() {
  const key = await sessionPersonKey();
  if (!key) return unauthenticated();
  const balances = (["VL", "SL"] as const).map((code) => {
    const { left, used } = balanceFor(key, code);
    return { typeCode: code, typeName: typeName(code), daysLeft: left, daysUsed: used };
  });
  return NextResponse.json(balances);
}

import { apiFetch, type ApiSchemas } from "@/lib/api";

export type SignInPerson = ApiSchemas["SignInPerson"];

export function listSignInPeople(): Promise<SignInPerson[]> {
  return apiFetch<SignInPerson[]>("/api/people");
}

export function signIn(personId: string, code: string): Promise<void> {
  return apiFetch<void>("/api/session", { method: "POST", json: { personId, code } });
}

export function signOut(): Promise<void> {
  return apiFetch<void>("/api/session", { method: "DELETE" });
}

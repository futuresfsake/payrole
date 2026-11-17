"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alert, Button, Input, Select } from "@/design-system";
import { asProblem } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { listSignInPeople, signIn } from "../api/auth";
import { signInSchema, type SignInValues } from "../schemas/signIn";

export function SignInForm() {
  const router = useRouter();
  const people = useResource(listSignInPeople);
  const [failure, setFailure] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { personId: "", code: "" } });

  async function submit(values: SignInValues) {
    setFailure(null);
    try {
      await signIn(values.personId, values.code);
      router.push("/me");
    } catch (error) {
      const problem = asProblem(error);
      setFailure(`${problem.title}${problem.detail ? `. ${problem.detail}` : ""}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
      {failure ? <Alert tone="danger" title="Couldn't sign you in">{failure}</Alert> : null}
      <Select
        id="sign-in-person"
        label="Sign in as"
        hint="Development sign-in. The real company login replaces this list."
        placeholder={people.loading ? "Loading people…" : "Choose a person"}
        options={(people.data ?? []).map((person) => ({ value: person.id, label: `${person.name}, ${person.title}` }))}
        error={errors.personId?.message}
        {...register("personId")}
      />
      <Input
        id="sign-in-code"
        label="Authenticator code"
        hint="Any 6 digits works, except 000000."
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        error={errors.code?.message}
        {...register("code")}
      />
      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Sign in
      </Button>
    </form>
  );
}

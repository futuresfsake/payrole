"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export interface StepUpInput {
  code: string;
  purpose?: string;
}

export type StepUpResult = { ok: true } | { ok: false; message: string };

export interface StepUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the person is about to do, in words: "Show the full SSS number". */
  title: string;
  /** Only when the permission needs a declared purpose (reveal, export, bulk read). */
  purposes?: readonly string[];
  onConfirm: (input: StepUpInput) => Promise<StepUpResult>;
}

const schema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6 digits from your authenticator app."),
  purpose: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

/** MFA check, plus a declared purpose where the permission requires one. Shared by every sensitive action. */
export function StepUpDialog({ open, onOpenChange, title, purposes, onConfirm }: StepUpDialogProps) {
  const [failure, setFailure] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { code: "", purpose: "" } });

  async function submit(values: FormValues) {
    if (purposes && !values.purpose) {
      setError("purpose", { message: "Choose why you need this. It is saved in the audit log." });
      return;
    }
    setFailure(null);
    const result = await onConfirm({ code: values.code, purpose: values.purpose || undefined });
    if (result.ok) {
      reset();
      onOpenChange(false);
    } else {
      setFailure(result.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Confirm it is you. This check is valid for 5 minutes."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" loading={isSubmitting} type="submit" form="step-up-form">
            Confirm
          </Button>
        </>
      }
    >
      <form id="step-up-form" onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          id="step-up-code"
          label="Authenticator code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          error={errors.code?.message ?? failure ?? undefined}
          {...register("code")}
        />
        {purposes ? (
          <Select
            id="step-up-purpose"
            label="Why do you need this?"
            hint="Your reason is saved in the audit log with your name."
            placeholder="Choose a reason"
            options={purposes.map((purpose) => ({ value: purpose, label: purpose }))}
            error={errors.purpose?.message}
            {...register("purpose")}
          />
        ) : null}
      </form>
    </Dialog>
  );
}

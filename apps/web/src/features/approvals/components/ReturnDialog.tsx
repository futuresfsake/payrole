"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Dialog, Input } from "@/design-system";

const schema = z.object({ comment: z.string().trim().min(3, "Tell them what to change, in a few words.").max(300) });
type Values = z.infer<typeof schema>;

export interface ReturnDialogProps {
  open: boolean;
  requesterName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment: string) => Promise<void>;
}

export function ReturnDialog({ open, requesterName, onOpenChange, onConfirm }: ReturnDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { comment: "" } });

  async function submit(values: Values) {
    await onConfirm(values.comment);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Return this request to ${requesterName}?`}
      description="They will see your comment and can send a new request."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" type="submit" form="return-form" loading={isSubmitting}>
            Return request
          </Button>
        </>
      }
    >
      <form id="return-form" onSubmit={handleSubmit(submit)} noValidate>
        <Input id="return-comment" label="Your comment" error={errors.comment?.message} {...register("comment")} />
      </form>
    </Dialog>
  );
}

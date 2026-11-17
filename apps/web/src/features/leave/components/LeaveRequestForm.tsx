"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, DatePicker, Input, Select } from "@/design-system";
import { asProblem } from "@/lib/api";
import type { Problem } from "@/lib/problem";
import { fileLeaveRequest, type LeaveRequestDto } from "../api/leave";
import { leaveRequestSchema, type LeaveRequestValues } from "../schemas/leaveRequest";
import { countLeaveDays } from "../utils/leaveDays";
import { daysLabel } from "../utils/requestStatus";

export interface LeaveRequestFormProps {
  onFiled: (request: LeaveRequestDto) => void;
}

export function LeaveRequestForm({ onFiled }: LeaveRequestFormProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestValues>({ resolver: zodResolver(leaveRequestSchema), defaultValues: { typeCode: "VL", startDate: "", endDate: "", note: "" } });

  const [start, end] = watch(["startDate", "endDate"]);
  const days = start && end ? countLeaveDays(start, end) : 0;

  async function submit(values: LeaveRequestValues) {
    setProblem(null);
    try {
      const created = await fileLeaveRequest({ ...values, note: values.note || undefined });
      reset();
      onFiled(created);
    } catch (error) {
      setProblem(asProblem(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex max-w-xl flex-col gap-4" aria-label="File a leave request">
      {problem ? (
        <Alert tone="danger" title={problem.title}>
          {problem.detail}
        </Alert>
      ) : null}
      <Select
        id="leave-type"
        label="Kind of leave"
        options={[
          { value: "VL", label: "Vacation leave" },
          { value: "SL", label: "Sick leave" },
        ]}
        error={errors.typeCode?.message}
        {...register("typeCode")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker id="leave-start" label="First day" error={errors.startDate?.message} {...register("startDate")} />
        <DatePicker id="leave-end" label="Last day" error={errors.endDate?.message} {...register("endDate")} />
      </div>
      <p aria-live="polite" className="text-muted">
        {days > 0 ? `${daysLabel(days)} off, counting weekdays only.` : "Choose the dates to see how many days you'll take."}
      </p>
      <Input id="leave-note" label="Note for your approver (optional)" error={errors.note?.message} {...register("note")} />
      <Button type="submit" variant="primary" loading={isSubmitting} className="self-start">
        Send request
      </Button>
    </form>
  );
}

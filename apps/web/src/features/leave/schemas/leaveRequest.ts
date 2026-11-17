import { z } from "zod";

export const leaveRequestSchema = z
  .object({
    typeCode: z.enum(["VL", "SL"], { message: "Choose the kind of leave." }),
    startDate: z.string().min(1, "Choose the first day."),
    endDate: z.string().min(1, "Choose the last day."),
    note: z.string().max(300, "Keep the note under 300 characters.").optional(),
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    path: ["endDate"],
    message: "The last day can't be before the first day.",
  });

export type LeaveRequestValues = z.infer<typeof leaveRequestSchema>;

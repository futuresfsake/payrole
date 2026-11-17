import { z } from "zod";

export const signInSchema = z.object({
  personId: z.string().min(1, "Choose who you are signing in as."),
  code: z.string().regex(/^\d{6}$/, "Enter the 6 digits from your authenticator app."),
});

export type SignInValues = z.infer<typeof signInSchema>;

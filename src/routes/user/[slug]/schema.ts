import { z } from "zod";
export const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string(),
  role: z.string(),
});

export type FormSchema = typeof formSchema;

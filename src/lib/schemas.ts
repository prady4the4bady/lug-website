
import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const reportBugSchema = z.object({
    summary: z.string().min(10, "Summary must be at least 10 characters.").max(100, "Summary must be 100 characters or less."),
    description: z.string().min(20, "Description must be at least 20 characters.").max(1000, "Description must be 1000 characters or less."),
    category: z.enum(['UI/UX', 'Backend', 'Feature Request', 'Other'], {
        required_error: "You need to select a category.",
    })
});

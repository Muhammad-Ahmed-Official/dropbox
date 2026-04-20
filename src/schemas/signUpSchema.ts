import z from "zod";

export const signUpSchema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be at most 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.email({ message: "Please enter a valid email" }).min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  passwordConfirmation: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

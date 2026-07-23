import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least 1 letter")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character");

export const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One letter", test: (v: string) => /[a-zA-Z]/.test(v) },
  {
    label: "One special character",
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
];

export const signUpSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  password: passwordSchema,
});

export const emailStepSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;

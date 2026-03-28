import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["MANAGER", "RECEIVER", "CASHIER"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  holder: z.string().optional(),
  contact: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const editWalletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["MASTER", "MANAGER", "RECEIVER", "CASHIER"]),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  holder: z.string().optional(),
  contact: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type EditWalletInput = z.infer<typeof editWalletSchema>;

import { z } from "zod";

export const createTokenSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CREDIT", "COUPON", "FLYER", "MEMBERSHIP", "GIFT_CARD", "CUSTOM"]),
  totalMinted: z.number().min(1, "Must mint at least 1"),
  description: z.string().optional(),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;

import { z } from "zod";

export const transferSchema = z.object({
  sourceWalletId: z.string().min(1),
  targetWalletId: z.string().min(1),
  tokenId: z.string().min(1),
  amount: z.number().min(1, "Amount must be at least 1"),
});

export type TransferInput = z.infer<typeof transferSchema>;

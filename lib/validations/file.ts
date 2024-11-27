import { z } from "zod";

export const filePatchSchema = z.object({
  name: z.string().min(1).max(20).optional(),
});

export const fileMoveSchema = z.object({
  folderId: z.number().min(1, "folderId must be a positive number"), // folderId を必須の数値に
});

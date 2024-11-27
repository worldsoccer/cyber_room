import { z } from "zod";

export const folderPatchSchema = z.object({
  name: z.string().min(1).max(20).optional(),
});

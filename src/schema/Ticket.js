import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(8, "Minimum 5 karakter!"),
  description: z.string().min(5, "Minimum 10 karakter!"),
  user: z.string(),
});

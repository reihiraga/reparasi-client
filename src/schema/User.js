import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(8, "Minimum 8 karakter!"),
  password: z.string().min(5, "Minimum 5 karakter!"),
  //   roles: z.array(z.string()),
  roles: z.string(),
});

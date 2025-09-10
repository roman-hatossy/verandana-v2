import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().min(2, "Podaj imię"),
  phone: z.string().min(5, "Podaj telefon"),
  email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  company: z.string().optional()
});
export type LeadDTO = z.infer<typeof leadSchema>;

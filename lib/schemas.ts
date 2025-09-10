import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, { message: 'Imię musi mieć co najmniej 2 znaki.' }),
  phone: z.string().min(9, { message: 'Numer telefonu musi mieć co najmniej 9 cyfr.' }),
  email: z.string().email({ message: 'Proszę podać poprawny adres email.' }),
  message: z.string().min(10, { message: 'Wiadomość musi mieć co najmniej 10 znaków.' }).max(500),
  company: z.string().optional(),
  type: z.enum(['home_extension', 'conservatory', 'pergola', 'carport', 'other'], {
    errorMap: () => ({ message: 'Proszę wybrać typ konstrukcji.' }),
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'Zgoda jest wymagana.',
  }),
});

export type LeadDTO = z.infer<typeof leadSchema>;

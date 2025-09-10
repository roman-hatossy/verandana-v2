// File: lib/schemas.ts
import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, { message: 'Imię musi mieć co najmniej 2 znaki.' }),
  phone: z.string().min(9, { message: 'Numer telefonu musi mieć co najmniej 9 cyfr.' }),
  email: z.string().email({ message: 'Proszę podać poprawny adres e-mail.' }),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, { message: 'Kod pocztowy musi być w formacie XX-XXX.' }),
  message: z.string().min(10, { message: 'Wiadomość musi mieć co najmniej 10 znaków.' }).max(500),
  company: z.string().optional(),
  type: z.enum(['home_extension', 'conservatory', 'pergola', 'carport', 'other'], {
    // KOREKTA: Zastosowano prawidłową składnię z jednym kluczem 'message' dla błędu walidacji.
    message: 'Proszę wybrać prawidłowy typ konstrukcji.',
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'Zgoda na przetwarzanie danych jest wymagana.',
  }),
  preferredDate: z.string().optional(),
});

// Typ LeadDTO wyeksportowany poza obiektem schematu.
export type LeadDTO = z.infer<typeof inquirySchema>;
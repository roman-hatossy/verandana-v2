// File: components/InquiryForm.hooks.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// KOREKTA: Zmieniono 'leadSchema' na 'inquirySchema'
import { inquirySchema, type LeadDTO } from '../lib/schemas';

export const useInquiryForm = () => useForm<LeadDTO>({
  // KOREKTA: Zmieniono 'leadSchema' na 'inquirySchema'
  resolver: zodResolver(inquirySchema),
  defaultValues: {
    name: '',
    phone: '',
    email: '',
    postalCode: '',
    message: '',
    company: '',
    consent: false,
  },
});
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadDTO } from '../lib/schemas'; // Poprawiona ścieżka
export const useInquiryForm=()=>useForm<LeadDTO>({resolver:zodResolver(leadSchema),defaultValues:{name:'',phone:'',email:'',message:'',company:''}});

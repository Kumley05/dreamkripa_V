import { z } from 'zod';

export const leadFormSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name should only contain letters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name should only contain letters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(),
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(val.replace(/\D/g, ''));
    }, 'Please enter a valid 10-digit mobile number'),
  programCategoryId: z.number().optional(),
  programId: z.number().optional(),
  educationLevel: z.string().optional(),
  city: z.string()
    .max(100, 'City name must not exceed 100 characters')
    .optional(),
  state: z.string()
    .max(100, 'State name must not exceed 100 characters')
    .optional(),
  preferredIntake: z.string().optional(),
  message: z.string()
    .max(2000, 'Message must not exceed 2000 characters')
    .optional(),
  consentEmail: z.boolean().default(true),
  consentPhone: z.boolean().default(true),
}).refine(data => data.email || data.phone, {
  message: 'Please provide either email or phone number',
  path: ['phone'],
});

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(),
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(val.replace(/\D/g, ''));
    }, 'Please enter a valid 10-digit mobile number'),
  subject: z.string().max(255, 'Subject must not exceed 255 characters').optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost', 'duplicate']).optional(),
  assignedTo: z.string().max(255).optional(),
  notes: z.string().max(5000).optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>;

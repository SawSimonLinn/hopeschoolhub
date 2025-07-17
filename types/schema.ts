import { z } from 'zod';

const monthlyPaymentSchema = z.object({
  month: z.string(),
  status: z.enum(['Paid', 'Unpaid']),
  amount: z.number(),
  paidOn: z.string().optional(),
});

export const studentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  photoUrl: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .optional()
    .or(z.literal('')),

  grade: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number()
  ),
  age: z.preprocess(val => (val === '' ? undefined : Number(val)), z.number()),
  paymentType: z.enum(['Monthly', 'Yearly']),
  amountPaid: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number()
  ),

  studentId: z.string().min(1),
  personalId: z.string().min(1),
  dob: z.string().min(1),
  registrationDate: z.string().min(1),
  yearsOfEnroll: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number()
  ),

  parentName: z.string().min(2),
  gender: z.string().min(1),
  nationality: z.string().min(1), // was 2+
  religion: z.string().min(1), // was 2+
  canTransferCertificate: z.boolean().default(false),
  address: z.string().min(5),
  contactNumber: z
    .string()
    .min(7)
    .regex(/^\+?[0-9\s-]+$/, { message: 'Invalid contact number format.' }),

  churchName: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => val || 'N/A'),

  // Remove if not being used yet in your form
  schoolFeeAmount: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),

  monthlyPayments: z.array(monthlyPaymentSchema).optional().default([]),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const teacherSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(2, { message: 'Subject must be at least 2 characters.' }),
  hireDate: z.string().optional().or(z.literal('')),
  age: z.preprocess(
    val =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z
      .number({ invalid_type_error: 'Age must be a number.' })
      .min(1, { message: 'Age must be a positive number.' })
  ),
  grade: z.preprocess(
    val =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z
      .number({ invalid_type_error: 'Grade must be a number.' })
      .min(0, { message: 'Grade cannot be negative.' })
  ),
  teacherId: z.string().min(1, { message: 'Teacher ID is required.' }),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email/Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const settingsSchema = z
  .object({
    currentUsername: z.string(),
    newUsername: z.string().min(1, 'New username/email is required.'),
    profilePicUrl: z
      .string()
      .url({ message: 'Please enter a valid URL.' })
      .optional()
      .or(z.literal('')),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters.')
      .optional()
      .or(z.literal('')),
    confirmNewPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    data => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'New passwords do not match.',
      path: ['confirmNewPassword'],
    }
  );

export type SettingsFormData = z.infer<typeof settingsSchema>;

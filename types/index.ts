import type { StudentFormData, TeacherFormData } from './schema';

export interface MonthlyPayment {
  month: string;
  status: 'Paid' | 'Unpaid';
  amount: number;
  paidOn?: string;
}

export interface Student {
  id: string;
  name: string;
  photoUrl: string;
  grade: number;
  age: number;
  paymentType: 'Monthly' | 'Yearly';
  amountPaid: number;
  schoolFeeAmount: number;
  studentId: string;
  personalId: string;
  dob: string;
  registrationDate: string;
  yearsOfEnroll: number;
  parentName: string;
  gender: string;
  nationality: string;
  religion: string;
  canTransferCertificate: boolean;
  address: string;
  contactNumber: string;
  churchName: string;
  monthlyPayments?: MonthlyPayment[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string | undefined;
  subject: string;
  hireDate: string | undefined;
  age: number;
  grade: number;
  teacherId: string;
}

export interface PendingStudentApplication extends StudentFormData {
  applicationId: string;
  status: 'pending';
  submittedAt: string; // ISO date string
}

export interface PendingTeacherApplication extends TeacherFormData {
  applicationId: string;
  status: 'pending';
  submittedAt: string; // ISO date string
}

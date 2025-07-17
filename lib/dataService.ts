import type { StudentFormData, TeacherFormData } from '@/types/schema';
import type {
  Student,
  Teacher,
  PendingStudentApplication,
  PendingTeacherApplication,
  MonthlyPayment,
} from '@/types';
import { format, formatISO, addMonths } from 'date-fns';
import { databases, ID } from '@/lib/appwrite';

const STUDENTS_KEY = 'hopeSchoolHubStudents_v2';
const TEACHERS_KEY = 'hopeSchoolHubTeachers_v2';
const PENDING_STUDENTS_KEY = 'hopeSchoolHubPendingStudents_v2';
const PENDING_TEACHERS_KEY = 'hopeSchoolHubPendingTeachers_v2';
const NEXT_DB_ID_KEY = 'hopeSchoolHubNextDbId_v2';
const DEMO_DATA_LOADED_KEY = 'demoDataLoaded_v4'; // Incremented version to allow reloading

// --- Local Storage Interaction ---
function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    localStorage.removeItem(key); // Clear corrupted data
    return defaultValue;
  }
}

function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

// --- ID Management ---
let nextDbId: number;

function initializeId() {
  if (typeof window === 'undefined') {
    nextDbId = 1;
    return;
  }
  const storedId = getFromLocalStorage<number | null>(NEXT_DB_ID_KEY, null);
  if (storedId) {
    nextDbId = storedId;
  } else {
    const students = getFromLocalStorage<Student[]>(STUDENTS_KEY, []);
    const teachers = getFromLocalStorage<Teacher[]>(TEACHERS_KEY, []);
    const maxStudentId =
      students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;
    const maxTeacherId =
      teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) : 0;
    nextDbId = Math.max(maxStudentId, maxTeacherId, 0) + 1;
    setToLocalStorage(NEXT_DB_ID_KEY, nextDbId);
  }
}

function getNextId(): number {
  const id = nextDbId;
  nextDbId++;
  setToLocalStorage(NEXT_DB_ID_KEY, nextDbId);
  return id;
}

// --- Payment Helpers ---
function generateMonthlyPayments(totalAnnualAmount: number): MonthlyPayment[] {
  const monthlyAmount = totalAnnualAmount > 0 ? totalAnnualAmount / 12 : 0;
  const payments: MonthlyPayment[] = [];
  const startDate = new Date();

  for (let i = 0; i < 12; i++) {
    const monthDate = addMonths(startDate, i);
    payments.push({
      month: format(monthDate, 'MMMM yyyy'),
      status: 'Unpaid',
      amount: monthlyAmount,
    });
  }
  return payments;
}

// --- API Simulation ---
async function simulateApiCall<T>(action: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = action();
        resolve(result as T);
      } catch (error) {
        reject(error);
      }
    }, 50);
  });
}

// --- Demo Data ---
const demoStudents: Omit<Student, 'id' | 'monthlyPayments'>[] = [
  {
    name: 'John Smith',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 10,
    age: 16,
    paymentType: 'Monthly',
    amountPaid: 1800.0, // This is now total annual fee
    studentId: 'S1001',
    personalId: 'P123456789',
    dob: '2008-05-20',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 2,
    parentName: 'Jane Smith',
    gender: 'Male',
    nationality: 'American',
    religion: 'Christianity',
    canTransferCertificate: true,
    address: '123 Main St, Anytown, USA',
    contactNumber: '555-123-4567',
    churchName: 'First Community Church',
  },
  {
    name: 'Emily Johnson',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 11,
    age: 17,
    paymentType: 'Yearly',
    amountPaid: 1500.0,
    studentId: 'S1002',
    personalId: 'P987654321',
    dob: '2007-08-15',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 3,
    parentName: 'Robert Johnson',
    gender: 'Female',
    nationality: 'Canadian',
    religion: 'Christianity',
    canTransferCertificate: false,
    address: '456 Oak Ave, Otherville, Canada',
    contactNumber: '555-987-6543',
    churchName: 'N/A',
  },
  {
    name: 'Carlos Martinez',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 9,
    age: 15,
    paymentType: 'Monthly',
    amountPaid: 2400.0,
    studentId: 'S1003',
    personalId: 'P555666777',
    dob: '2009-02-10',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 1,
    parentName: 'Maria Martinez',
    gender: 'Male',
    nationality: 'Mexican',
    religion: 'Catholicism',
    canTransferCertificate: true,
    address: '789 Pine Rd, Somewhere, USA',
    contactNumber: '555-111-2222',
    churchName: 'St. Marys Church',
  },
  {
    name: 'Aisha Khan',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 12,
    age: 18,
    paymentType: 'Monthly',
    amountPaid: 3000.0,
    studentId: 'S1004',
    personalId: 'P888999000',
    dob: '2006-11-30',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 4,
    parentName: 'Fatima Khan',
    gender: 'Female',
    nationality: 'Pakistani',
    religion: 'Islam',
    canTransferCertificate: true,
    address: '321 Maple Ln, Anytown, USA',
    contactNumber: '555-333-4444',
    churchName: 'N/A',
  },
  {
    name: 'Kenji Tanaka',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 10,
    age: 16,
    paymentType: 'Yearly',
    amountPaid: 1650.0,
    studentId: 'S1005',
    personalId: 'P444555666',
    dob: '2008-04-22',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 2,
    parentName: 'Yuki Tanaka',
    gender: 'Male',
    nationality: 'Japanese',
    religion: 'Buddhism',
    canTransferCertificate: true,
    address: '15 Cherry Blossom St, Tokyo, Japan',
    contactNumber: '555-777-8888',
    churchName: 'N/A',
  },
  {
    name: 'Olivia Chen',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 9,
    age: 14,
    paymentType: 'Monthly',
    amountPaid: 2100.0,
    studentId: 'S1006',
    personalId: 'P111222333',
    dob: '2010-01-18',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 1,
    parentName: 'David Chen',
    gender: 'Female',
    nationality: 'American',
    religion: 'N/A',
    canTransferCertificate: false,
    address: '987 Birch Ave, Someplace, USA',
    contactNumber: '555-444-5555',
    churchName: 'N/A',
  },
  {
    name: 'Chloe Williams',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 11,
    age: 17,
    paymentType: 'Monthly',
    amountPaid: 2200.0,
    studentId: 'S1007',
    personalId: 'P777888999',
    dob: '2007-03-12',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 3,
    parentName: 'Sophia Williams',
    gender: 'Female',
    nationality: 'Australian',
    religion: 'Christianity',
    canTransferCertificate: true,
    address: '555 Wattle St, Sydney, Australia',
    contactNumber: '555-666-7777',
    churchName: 'N/A',
  },
  {
    name: 'Liam Brown',
    photoUrl: 'https://placehold.co/400x400.png',
    grade: 9,
    age: 15,
    paymentType: 'Yearly',
    amountPaid: 1550.0,
    studentId: 'S1008',
    personalId: 'P888999111',
    dob: '2009-09-09',
    registrationDate: formatISO(new Date(), { representation: 'date' }),
    yearsOfEnroll: 1,
    parentName: 'James Brown',
    gender: 'Male',
    nationality: 'British',
    religion: 'N/A',
    canTransferCertificate: false,
    address: '22 Acacia Ave, London, UK',
    contactNumber: '555-222-3333',
    churchName: 'N/A',
  },
];

const demoTeachers: Omit<Teacher, 'id'>[] = [
  {
    name: 'Michael Davis',
    email: 'michael.davis@example.com',
    subject: 'Mathematics',
    hireDate: '2020-08-01',
    age: 35,
    grade: 10,
    teacherId: 'T001',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    subject: 'English Literature',
    hireDate: '2018-09-15',
    age: 42,
    grade: 11,
    teacherId: 'T002',
  },
];

// --- Data Initialization ---
function initializeDemoData() {
  if (typeof window === 'undefined') return;

  if (localStorage.getItem(DEMO_DATA_LOADED_KEY)) return;

  let students = getFromLocalStorage<Student[]>(STUDENTS_KEY, []);
  if (students.length === 0) {
    const demoStudentsWithIds = demoStudents.map((s, index) => {
      const student: Student = {
        ...s,
        id: index + 1,
      };
      if (student.paymentType === 'Monthly') {
        student.monthlyPayments = generateMonthlyPayments(student.amountPaid);
      }
      return student;
    });
    setToLocalStorage(STUDENTS_KEY, demoStudentsWithIds);
  }

  let teachers = getFromLocalStorage<Teacher[]>(TEACHERS_KEY, []);
  if (teachers.length === 0) {
    const demoTeachersWithIds = demoTeachers.map((t, index) => ({
      ...t,
      id: index + 100,
    }));
    setToLocalStorage(TEACHERS_KEY, demoTeachersWithIds);
  }

  localStorage.setItem(DEMO_DATA_LOADED_KEY, 'true');
}

initializeDemoData();
initializeId();

// --- Students ---
export const addStudent = async (data: StudentFormData) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyPayments = months.map(month => ({
    month,
    status: 'Unpaid',
    amount: data.schoolFeeAmount ? data.schoolFeeAmount / 12 : 0,
  }));
  const studentDataToSend = {
    ...data,
    photoUrl: data.photoUrl || '',
    schoolFeeAmount: data.schoolFeeAmount ?? 0,
    monthlyPayments: JSON.stringify(monthlyPayments),
  };

  await databases.createDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
    ID.unique(),
    studentDataToSend
  );

  try {
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      ID.unique(),
      studentDataToSend
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to add student: ${(error as Error).message}`);
  }
};

export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      ...doc,
    })) as Student[];
  } catch (error: any) {
    throw new Error(
      'Failed to fetch students: ' + (error?.message || 'unknown')
    );
  }
};

// Fetches all students from the database
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      id
    );
    return {
      id: doc.$id,
      name: doc.name,
      grade: doc.grade,
      age: doc.age,
      paymentType: doc.paymentType,
      amountPaid: doc.amountPaid,
      studentId: doc.studentId,
      photoUrl: doc.photoUrl || '',
      personalId: doc.personalId,
      dob: doc.dob,
      registrationDate: doc.registrationDate,
      yearsOfEnroll: doc.yearsOfEnroll,
      parentName: doc.parentName,
      gender: doc.gender,
      nationality: doc.nationality,
      religion: doc.religion,
      canTransferCertificate: doc.canTransferCertificate,
      address: doc.address,
      contactNumber: doc.contactNumber,
      churchName: doc.churchName,
      monthlyPayments: Array.isArray(doc.monthlyPayments)
        ? doc.monthlyPayments
        : typeof doc.monthlyPayments === 'string'
        ? JSON.parse(doc.monthlyPayments || '[]')
        : [],
    } as Student;
  } catch (error) {
    console.error('Failed to get student by ID:', error);
    return null;
  }
};

// Updates a student document by its ID
export const updateStudent = async (
  id: string,
  updatedData: Partial<StudentFormData>
): Promise<Student> => {
  try {
    const payload = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    const updated = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      id,
      payload
    );

    return {
      id: updated.$id,
      ...updated,
    };
  } catch (error: any) {
    throw new Error('Update failed: ' + (error?.message || 'unknown'));
  }
};

// Deletes a student document by its ID
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      id
    );

    return {
      id: document.$id,
      message: 'Student deleted successfully',
    };
  } catch (error: any) {
    throw new Error('Delete failed: ' + (error?.message || 'unknown'));
  }
};

export const updateStudentPaymentStatus = async (
  studentId: string,
  monthIndex: number,
  newStatus: 'Paid' | 'Unpaid'
): Promise<Student> => {
  try {
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      studentId
    );

    const monthlyPayments = Array.isArray(doc.monthlyPayments)
      ? doc.monthlyPayments
      : JSON.parse(doc.monthlyPayments || '[]');

    if (!monthlyPayments[monthIndex]) {
      throw new Error(`Payment entry not found for index ${monthIndex}`);
    }

    monthlyPayments[monthIndex].status = newStatus;
    monthlyPayments[monthIndex].paidOn =
      newStatus === 'Paid' ? formatISO(new Date()) : undefined;

    const updated = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
      studentId,
      {
        monthlyPayments,
      }
    );

    return {
      id: updated.$id,
      ...updated,
    };
  } catch (error: any) {
    console.error('Failed to update payment status:', error);
    throw new Error(
      'Failed to update payment: ' + (error?.message || 'unknown')
    );
  }
};

//   return simulateApiCall(() => {
//     let students = getFromLocalStorage<Student[]>(STUDENTS_KEY, []);
//     const initialLength = students.length;
//     students = students.filter((s) => s.id !== id);
//     if (students.length < initialLength) {
//       setToLocalStorage(STUDENTS_KEY, students);
//       return true;
//     }
//     return false;
//   });
// };

// --- Teachers ---
export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID!
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      hireDate: doc.hireDate,
      age: doc.age,
      grade: doc.grade,
      teacherId: doc.teacherId,
    }));
  } catch (error: any) {
    throw new Error(
      'Failed to fetch teachers: ' + (error?.message || 'unknown')
    );
  }
};

export const getTeacherById = async (id: string): Promise<Teacher> => {
  try {
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID!,
      id
    );

    return {
      id: doc.$id,
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      hireDate: doc.hireDate,
      age: doc.age,
      grade: doc.grade,
      teacherId: doc.teacherId,
    };
  } catch (error: any) {
    throw new Error(
      'Failed to fetch teacher: ' + (error?.message || 'unknown')
    );
  }
};

export const addTeacher = async (
  teacherData: TeacherFormData
): Promise<Teacher> => {
  try {
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID!,
      ID.unique(), // let Appwrite generate the ID
      teacherData
    );

    const teacher: Teacher = {
      id: response.$id,
      name: response.name,
      email: response.email,
      subject: response.subject,
      hireDate: response.hireDate,
      age: response.age,
      grade: response.grade,
      teacherId: response.teacherId,
    };

    return teacher;
  } catch (error: any) {
    console.error('Failed to add teacher:', error);
    throw new Error('Failed to add teacher: ' + (error?.message || 'unknown'));
  }
};

export const updateTeacher = async (
  id: string,
  updatedData: Partial<TeacherFormData>
): Promise<Teacher> => {
  try {
    const updated = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID!,
      id,
      updatedData
    );

    return {
      id: updated.$id,
      name: updated.name,
      email: updated.email,
      subject: updated.subject,
      hireDate: updated.hireDate,
      age: updated.age,
      grade: updated.grade,
      teacherId: updated.teacherId,
    };
  } catch (error: any) {
    throw new Error('Update failed: ' + (error?.message || 'unknown'));
  }
};

export const deleteTeacher = async (id: string): Promise<void> => {
  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TEACHERS_COLLECTION_ID!,
      id
    );
  } catch (error: any) {
    throw new Error('Delete failed: ' + (error?.message || 'unknown'));
  }
};

// --- Pending Applications ---
export const getPendingStudentApplications = async (): Promise<
  PendingStudentApplication[]
> => {
  return simulateApiCall(() =>
    getFromLocalStorage<PendingStudentApplication[]>(PENDING_STUDENTS_KEY, [])
  );
};

export const addPendingStudentApplication = async (
  data: StudentFormData
): Promise<PendingStudentApplication> => {
  return simulateApiCall(() => {
    const currentPending = getFromLocalStorage<PendingStudentApplication[]>(
      PENDING_STUDENTS_KEY,
      []
    );
    const applicationSpecificIdPart =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const newPendingStudent: PendingStudentApplication = {
      ...data,
      applicationId: `app-s-${applicationSpecificIdPart}`,
      status: 'pending',
      submittedAt: formatISO(new Date()),
    };
    const updatedPending = [...currentPending, newPendingStudent];
    setToLocalStorage(PENDING_STUDENTS_KEY, updatedPending);
    return newPendingStudent;
  });
};

export const approveStudentApplication = async (
  applicationId: string
): Promise<Student | undefined> => {
  return simulateApiCall(async () => {
    let pendingStudents = getFromLocalStorage<PendingStudentApplication[]>(
      PENDING_STUDENTS_KEY,
      []
    );
    const appIndex = pendingStudents.findIndex(
      app => app.applicationId === applicationId
    );
    if (appIndex === -1) {
      throw new Error(
        `Pending student application ${applicationId} not found.`
      );
    }

    const appToApprove = pendingStudents[appIndex];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      applicationId: _appId,
      status: _status,
      submittedAt: _subAt,
      ...studentData
    } = appToApprove;

    const newStudent = await addStudent(studentData as StudentFormData);

    if (newStudent) {
      pendingStudents.splice(appIndex, 1);
      setToLocalStorage(PENDING_STUDENTS_KEY, pendingStudents);
      return newStudent;
    }
    return undefined;
  });
};

export const declineStudentApplication = async (
  applicationId: string
): Promise<boolean> => {
  return simulateApiCall(() => {
    let pendingStudents = getFromLocalStorage<PendingStudentApplication[]>(
      PENDING_STUDENTS_KEY,
      []
    );
    const initialLength = pendingStudents.length;
    pendingStudents = pendingStudents.filter(
      app => app.applicationId !== applicationId
    );
    if (pendingStudents.length < initialLength) {
      setToLocalStorage(PENDING_STUDENTS_KEY, pendingStudents);
      return true;
    }
    return false;
  });
};

export const getPendingTeacherApplications = async (): Promise<
  PendingTeacherApplication[]
> => {
  return simulateApiCall(() =>
    getFromLocalStorage<PendingTeacherApplication[]>(PENDING_TEACHERS_KEY, [])
  );
};

export const addPendingTeacherApplication = async (
  data: TeacherFormData
): Promise<PendingTeacherApplication> => {
  return simulateApiCall(() => {
    const currentPending = getFromLocalStorage<PendingTeacherApplication[]>(
      PENDING_TEACHERS_KEY,
      []
    );
    const applicationSpecificIdPart =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    const newPendingTeacher: PendingTeacherApplication = {
      ...data,
      applicationId: `app-t-${applicationSpecificIdPart}`,
      status: 'pending',
      submittedAt: formatISO(new Date()),
    };
    const updatedPending = [...currentPending, newPendingTeacher];
    setToLocalStorage(PENDING_TEACHERS_KEY, updatedPending);
    return newPendingTeacher;
  });
};

export const approveTeacherApplication = async (
  applicationId: string
): Promise<Teacher | undefined> => {
  return simulateApiCall(async () => {
    let pendingTeachers = getFromLocalStorage<PendingTeacherApplication[]>(
      PENDING_TEACHERS_KEY,
      []
    );
    const appIndex = pendingTeachers.findIndex(
      app => app.applicationId === applicationId
    );
    if (appIndex === -1) {
      throw new Error(
        `Pending teacher application ${applicationId} not found.`
      );
    }

    const appToApprove = pendingTeachers[appIndex];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      applicationId: _appId,
      status: _status,
      submittedAt: _subAt,
      ...teacherData
    } = appToApprove;

    const newTeacher = await addTeacher(teacherData as TeacherFormData);

    if (newTeacher) {
      pendingTeachers.splice(appIndex, 1);
      setToLocalStorage(PENDING_TEACHERS_KEY, pendingTeachers);
      return newTeacher;
    }
    return undefined;
  });
};

export const declineTeacherApplication = async (
  applicationId: string
): Promise<boolean> => {
  return simulateApiCall(() => {
    let pendingTeachers = getFromLocalStorage<PendingTeacherApplication[]>(
      PENDING_TEACHERS_KEY,
      []
    );
    const initialLength = pendingTeachers.length;
    pendingTeachers = pendingTeachers.filter(
      app => app.applicationId !== applicationId
    );
    if (pendingTeachers.length < initialLength) {
      setToLocalStorage(PENDING_TEACHERS_KEY, pendingTeachers);
      return true;
    }
    return false;
  });
};

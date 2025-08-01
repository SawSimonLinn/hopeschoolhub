'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { getStudents } from '@/lib/dataService';
import type { Student } from '@/types';
import {
  isGuest as checkIsGuest,
  isAdmin as checkIsAdmin,
} from '@/lib/authService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  FinancialStats,
  type FinancialStatsData,
} from '@/components/dashboard/FinancialStats';
import {
  GradesChart,
  type GradesChartData,
} from '@/components/dashboard/GradesChart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { List } from 'lucide-react';
import { format, getMonth } from 'date-fns';

export default function DashboardHomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [financialStats, setFinancialStats] =
    useState<FinancialStatsData | null>(null);
  const [gradesData, setGradesData] = useState<GradesChartData[]>([]);
  const { toast } = useToast();

  const currentMonthIndex = getMonth(new Date());

  useEffect(() => {
    setIsGuest(checkIsGuest());
    setIsAdmin(checkIsAdmin());

    async function fetchData() {
      setIsLoading(true);
      try {
        const fetchedStudents = await getStudents();
        setStudents(fetchedStudents);

        // Process data for components
        processFinancialStats(fetchedStudents);
        processGradesData(fetchedStudents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load dashboard data.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function processFinancialStats(allStudents: Student[]) {
    let collected = 0;
    let pending = 0;
    let paidStudentsCount = 0;

    allStudents.forEach(s => {
      if (s.paymentType === 'Yearly') {
        collected += s.amountPaid;
        paidStudentsCount++;
      } else if (Array.isArray(s.monthlyPayments)) {
        // Ensure monthlyPayments is an array
        let isCurrentMonthPaid = false;
        s.monthlyPayments.forEach((p, index) => {
          if (p.status === 'Paid') {
            collected += p.amount;
            if (index === currentMonthIndex) {
              isCurrentMonthPaid = true;
            }
          } else {
            pending += p.amount;
          }
        });
        if (isCurrentMonthPaid) {
          paidStudentsCount++;
        }
      }
    });

    setFinancialStats({
      totalStudents: allStudents.length,
      paidStudents: paidStudentsCount,
      collectedFee: collected,
      pendingFee: pending,
    });
  }

  function processGradesData(allStudents: Student[]) {
    const data = allStudents.map(student => ({
      name: student.name,
      grade: student.grade,
      // In a real app, this would be fetched from exam results
      examScore: Math.floor(Math.random() * 41) + 60,
    }));
    setGradesData(data);
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner size={32} />
        <p className='ml-2'>Loading dashboard...</p>
      </div>
    );
  }

  const getGreeting = () => {
    if (isGuest) return 'Welcome, Guest!';
    if (isAdmin) return 'Welcome back, Admin!';
    return 'Welcome to HopeSchoolHub!';
  };

  return (
    <div className='space-y-8'>
      <PageHeader
        title={getGreeting()}
        description={
          isGuest
            ? 'You are viewing as a guest. Some functionalities are restricted.'
            : 'Your central hub for school management.'
        }
      />

      {financialStats && <FinancialStats stats={financialStats} />}

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        <div className='lg:col-span-3'>
          <GradesChart data={gradesData} />
        </div>
        <div className='lg:col-span-2'>
          <Card className='h-full shadow-lg'>
            <CardHeader>
              <CardTitle className='font-headline text-xl'>
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest student payments and actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center h-48 text-center text-muted-foreground'>
                <List className='h-10 w-10 mb-2' />
                <p className='font-semibold'>No recent activity to show.</p>
                <p className='text-sm'>
                  Fee payments and other actions will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

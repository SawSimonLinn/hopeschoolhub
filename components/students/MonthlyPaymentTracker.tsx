'use client';

import type { Student } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ListChecks, Loader2 } from 'lucide-react';

interface MonthlyPaymentTrackerProps {
  student: Student;
  onUpdate: (monthIndex: number, newStatus: 'Paid' | 'Unpaid') => Promise<void>;
  isGuest: boolean;
}

export function MonthlyPaymentTracker({
  student,
  onUpdate,
  isGuest,
}: MonthlyPaymentTrackerProps) {
  const [updatingMonth, setUpdatingMonth] = useState<number | null>(null);

  const handleUpdateClick = async (
    monthIndex: number,
    currentStatus: 'Paid' | 'Unpaid'
  ) => {
    if (isGuest) return;
    setUpdatingMonth(monthIndex);
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      await onUpdate(monthIndex, newStatus);
    } finally {
      setUpdatingMonth(null);
    }
  };

  const monthlyPayments = Array.isArray(student.monthlyPayments)
    ? student.monthlyPayments
    : [];

  return (
    <Card className='shadow-xl'>
      <CardHeader>
        <CardTitle className='font-headline text-2xl flex items-center gap-2'>
          <ListChecks className='h-6 w-6 text-primary' />
          Monthly Payments
        </CardTitle>
        <CardDescription>12-month payment schedule and status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-3'>
          {monthlyPayments?.map((payment, index) => (
            <li
              key={index}
              className='flex items-center justify-between p-2 rounded-md transition-colors even:bg-muted/30 hover:bg-muted/50'
            >
              <div className='flex items-center gap-3'>
                {payment.status === 'Paid' ? (
                  <CheckCircle className='h-5 w-5 text-green-500' />
                ) : (
                  <Circle className='h-5 w-5 text-muted-foreground' />
                )}
                <div>
                  <p className='font-medium'>{payment.month}</p>
                  <p className='text-xs text-muted-foreground'>
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={payment.status === 'Paid' ? 'default' : 'secondary'}
                  className={
                    payment.status === 'Paid'
                      ? 'bg-green-500/90 text-white'
                      : ''
                  }
                >
                  {payment.status}
                </Badge>
                {!isGuest && (
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => handleUpdateClick(index, payment.status)}
                    disabled={updatingMonth === index}
                    className='h-8 w-8 p-0'
                    aria-label={`Mark ${payment.month} as ${
                      payment.status === 'Paid' ? 'Unpaid' : 'Paid'
                    }`}
                  >
                    {updatingMonth === index ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <ListChecks className='h-4 w-4 text-muted-foreground' />
                    )}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

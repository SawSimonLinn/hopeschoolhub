'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Wallet, Hourglass } from 'lucide-react';

export interface FinancialStatsData {
  totalStudents: number;
  paidStudents: number;
  collectedFee: number;
  pendingFee: number;
}

interface FinancialStatsProps {
  stats: FinancialStatsData;
}

export function FinancialStats({ stats }: FinancialStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <Card className='shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium font-body'>
            Total Students
          </CardTitle>
          <Users className='h-5 w-5 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalStudents}</div>
          <p className='text-xs text-muted-foreground'>All active students</p>
        </CardContent>
      </Card>
      <Card className='shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium font-body'>
            Paid Students (This Month)
          </CardTitle>
          <UserCheck className='h-5 w-5 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.paidStudents}</div>
          <p className='text-xs text-muted-foreground'>
            {stats.totalStudents > 0
              ? `${((stats.paidStudents / stats.totalStudents) * 100).toFixed(
                  0
                )}% paid`
              : 'N/A'}
          </p>
        </CardContent>
      </Card>
      <Card className='shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium font-body'>
            Collected Fees
          </CardTitle>
          <Wallet className='h-5 w-5 text-blue-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-700'>
            {formatCurrency(stats.collectedFee)}
          </div>
          <p className='text-xs text-muted-foreground'>Total fees collected</p>
        </CardContent>
      </Card>
      <Card className='shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium font-body'>
            Pending Fees
          </CardTitle>
          <Hourglass className='h-5 w-5 text-orange-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-700'>
            {formatCurrency(stats.pendingFee)}
          </div>
          <p className='text-xs text-muted-foreground'>
            Total outstanding payments
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subMonths, getMonth } from 'date-fns';

export interface GradesChartData {
  name: string;
  grade: number;
  examScore: number;
}

interface GradesChartProps {
  data: GradesChartData[];
}

// Generate month options for the last 12 months
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const date = subMonths(new Date(), i);
  return {
    value: getMonth(date).toString(),
    label: format(date, 'MMMM yyyy'),
  };
});

export function GradesChart({ data }: GradesChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthOptions[0].value
  );

  const filteredData = useMemo(() => {
    // Since we don't have real monthly data, we'll just show all students
    // In a real app, you would filter `data` based on `selectedMonth`
    return data;
  }, [data, selectedMonth]);

  return (
    <Card className='shadow-lg h-full'>
      <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='font-headline text-xl'>
            Monthly Exam Grades
          </CardTitle>
          <CardDescription>
            Performance of students in monthly exams.
          </CardDescription>
        </div>
        <div className='mt-4 sm:mt-0'>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='Select Month' />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart
            data={filteredData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='grade'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor='end'
              height={60}
              tickFormatter={value => `Grade: ${value}`}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar
              dataKey='examScore'
              fill='hsl(var(--primary))'
              name='Exam Score'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

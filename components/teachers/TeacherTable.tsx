'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Teacher } from '@/types';
import { Eye, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';

interface TeacherTableProps {
  teachers: Teacher[];
  onDelete: (teacher: Teacher) => void;
  isGuest: boolean;
}

export function TeacherTable({
  teachers,
  onDelete,
  isGuest,
}: TeacherTableProps) {
  return (
    <div className='rounded-lg border overflow-x-auto shadow-md bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px] min-w-[50px]'>#</TableHead>
            <TableHead className='w-[200px] min-w-[200px]'>Name</TableHead>
            <TableHead className='w-[120px] min-w-[120px]'>
              Teacher ID
            </TableHead>
            <TableHead className='min-w-[200px]'>Email</TableHead>
            <TableHead className='min-w-[120px]'>Subject</TableHead>
            <TableHead className='min-w-[180px]'>Hire Date</TableHead>
            <TableHead className='text-right w-[100px] min-w-[100px]'>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={teacher.id} className='hover:bg-muted/50'>
              <TableCell>{index + 1}</TableCell>
              <TableCell className='font-medium'>{teacher.name}</TableCell>
              <TableCell>
                <Badge variant='outline'>{teacher.teacherId}</Badge>
              </TableCell>
              <TableCell>
                {isGuest ? '**********' : teacher.email || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant='secondary'>{teacher.subject}</Badge>
              </TableCell>
              <TableCell>
                {teacher.hireDate && isValid(parseISO(teacher.hireDate))
                  ? format(parseISO(teacher.hireDate), 'PPP')
                  : 'N/A'}
              </TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/teachers/${teacher.id}`}
                        className='flex items-center cursor-pointer'
                      >
                        <Eye className='mr-2 h-4 w-4' /> View Details
                      </Link>
                    </DropdownMenuItem>
                    {!isGuest && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/teachers/${teacher.id}/edit`}
                            className='flex items-center cursor-pointer'
                          >
                            <Edit3 className='mr-2 h-4 w-4' /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(teacher)}
                          className='text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center cursor-pointer'
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

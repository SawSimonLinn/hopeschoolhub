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
import type { Student } from '@/types';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudentTableProps {
  students: Student[];
  onDelete: (student: Student) => void;
  isGuest: boolean;
}

export function StudentTable({
  students,
  onDelete,
  isGuest,
}: StudentTableProps) {
  return (
    <div className='rounded-lg border overflow-x-auto shadow-md bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px] min-w-[50px]'>#</TableHead>
            <TableHead className='w-[250px] min-w-[250px]'>Name</TableHead>
            <TableHead className='w-[150px] min-w-[150px]'>
              Student ID
            </TableHead>
            <TableHead className='min-w-[80px]'>Grade</TableHead>
            <TableHead className='min-w-[150px]'>Contact Number</TableHead>
            <TableHead className='min-w-[180px]'>Registration Date</TableHead>
            <TableHead className='text-right w-[100px] min-w-[100px]'>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={student.id ?? index} // Use index as fallback if id is missing
              className='hover:bg-muted/50'
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell className='font-medium flex items-center gap-3'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage
                    src={student.photoUrl}
                    alt={student.name}
                    className='object-cover'
                    data-ai-hint='student avatar'
                  />
                  <AvatarFallback>
                    {student.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {student.name}
              </TableCell>
              <TableCell>
                <Badge variant='secondary'>{student.studentId}</Badge>
              </TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>
                {isGuest ? '**********' : student.contactNumber}
              </TableCell>
              <TableCell>
                {student.registrationDate &&
                isValid(parseISO(student.registrationDate))
                  ? format(parseISO(student.registrationDate), 'PPP')
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
                        href={`/dashboard/students/${student.id}`}
                        className='flex items-center cursor-pointer'
                      >
                        <Eye className='mr-2 h-4 w-4' /> View Details
                      </Link>
                    </DropdownMenuItem>
                    {!isGuest && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/students/${student.id}/edit`}
                            className='flex items-center cursor-pointer'
                          >
                            <Edit3 className='mr-2 h-4 w-4' /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(student)}
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

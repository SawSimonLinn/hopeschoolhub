'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Teacher } from '@/types';
import {
  getTeacherById,
  deleteTeacher as deleteTeacherService,
} from '@/lib/dataService';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  CalendarDays,
  Mail,
  User,
  BookOpen,
  Hash,
  Briefcase,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';
import { isGuest as checkIsGuest } from '@/lib/authService';

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  const { toast } = useToast();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(checkIsGuest());
    if (teacherId) {
      setIsLoading(true);
      getTeacherById(teacherId)
        .then(fetchedTeacher => {
          if (fetchedTeacher) {
            setTeacher(fetchedTeacher);
          } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Teacher not found.',
            });
            router.replace('/dashboard/teachers');
          }
        })
        .catch(error => {
          console.error('Failed to fetch teacher:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load teacher data.',
          });
          router.replace('/dashboard/teachers');
        })
        .finally(() => setIsLoading(false));
    }
  }, [teacherId, router, toast]);

  const handleDelete = async () => {
    if (isGuest || !teacher) return;
    try {
      const success = await deleteTeacherService(teacher.id);
      if (success) {
        toast({
          title: 'Teacher Deleted',
          description: `${teacher.name} has been removed.`,
        });
        router.refresh();
        setTimeout(() => {
          router.push('/dashboard/teachers');
        }, 500);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete teacher.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while deleting.',
      });
    }
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Loading Teacher Details...'
          description='Please wait.'
        >
          <Button variant='outline' asChild>
            <Link href='/dashboard/teachers'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to List
            </Link>
          </Button>
        </PageHeader>
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner size={32} />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <PageHeader title='Teacher Not Found'>
        <Button variant='outline' asChild>
          <Link href='/dashboard/teachers'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Teachers List
          </Link>
        </Button>
      </PageHeader>
    );
  }

  const detailItem = (
    icon: React.ElementType,
    label: string,
    value?: string | number | null,
    isBadge: boolean = false,
    badgeVariant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline' = 'secondary',
    guestSensitive: boolean = false
  ) => {
    if (guestSensitive && isGuest) {
      value = 'Restricted';
    }
    if (value === undefined || value === null || value === '') return null;
    const IconComponent = icon;
    return (
      <div className='flex items-start py-2'>
        <IconComponent className='mr-3 mt-1 h-5 w-5 text-muted-foreground flex-shrink-0' />
        <div>
          <p className='text-sm text-muted-foreground'>{label}</p>
          {isBadge && value !== 'Restricted' ? (
            <Badge variant={badgeVariant} className='font-medium'>
              {value}
            </Badge>
          ) : (
            <p className='font-medium'>{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={teacher.name}
        description={`Teacher ID: ${teacher.teacherId}`}
      >
        <div className='flex gap-2'>
          <Button variant='outline' asChild>
            <Link href='/dashboard/teachers'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to List
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Card className='shadow-xl'>
        <CardHeader>
          <CardTitle className='font-headline text-2xl'>
            Teacher Profile
          </CardTitle>
          <CardDescription>
            All recorded details for {teacher.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2'>
          {detailItem(User, 'Full Name', teacher.name)}
          {detailItem(Hash, 'Teacher ID', teacher.teacherId, true, 'outline')}
          {detailItem(
            Mail,
            'Email Address',
            teacher.email || 'N/A',
            false,
            'secondary',
            true
          )}
          {detailItem(BookOpen, 'Subject Taught', teacher.subject, true)}
          {detailItem(Star, 'Age', `${teacher.age} years old`)}
          {detailItem(Briefcase, 'Associated Grade', teacher.grade)}
          {detailItem(
            CalendarDays,
            'Hire Date',
            teacher.hireDate && isValid(parseISO(teacher.hireDate))
              ? format(parseISO(teacher.hireDate), 'MMMM d, yyyy')
              : 'N/A'
          )}
        </CardContent>
        {!isGuest && (
          <CardFooter className='flex justify-end gap-2 border-t pt-6'>
            <Button variant='outline' asChild>
              <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                <Edit3 className='mr-2 h-4 w-4' /> Edit
              </Link>
            </Button>
            <Button variant='destructive' onClick={() => setDialogOpen(true)}>
              <Trash2 className='mr-2 h-4 w-4' /> Delete
            </Button>
          </CardFooter>
        )}
      </Card>

      {!isGuest && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleDelete}
          title='Delete Teacher'
          description={`Are you sure you want to delete ${teacher?.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}

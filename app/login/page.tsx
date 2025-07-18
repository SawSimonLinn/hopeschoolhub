'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { GraduationCap } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { loginAsGuest } from '@/lib/authService';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const { isCheckingAuth } = useAuthRedirect();
  const router = useRouter();

  if (isCheckingAuth) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background p-4'>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center'>
          <GraduationCap className='mx-auto h-16 w-16 text-primary' />
          <h1 className='mt-6 text-4xl font-headline font-extrabold tracking-tight text-foreground'>
            HopeSchoolHub Admin
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Sign in or continue as a guest.
          </p>
        </div>
        <LoginForm />
        <div className='relative my-4'>
          <Separator />
          <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground'>
            OR
          </span>
        </div>
        <Button variant='outline' className='w-full' onClick={handleGuestLogin}>
          Continue as Guest (View Only)
        </Button>
      </div>
    </div>
  );
}

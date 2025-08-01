'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { getAuthState } from "@/lib/authService";
import { getAuthState } from '../lib/authService'; // Adjust the import path as necessary
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure this runs only on the client after hydration
    const isAuthenticated = getAuthState();
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
    // A slight delay to prevent flash of content if redirection is too fast
    // For a real app, a proper loading state manager would be better
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-background'>
        <div className='space-y-4 p-8 rounded-lg shadow-xl bg-card'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-6 w-full' />
          <Skeleton className='h-10 w-24' />
        </div>
      </div>
    );
  }

  return null;
}

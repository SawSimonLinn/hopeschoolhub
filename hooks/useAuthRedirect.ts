
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, isGuest as checkIsGuest } from '@/lib/authService';

const AUTH_ROUTES = ['/login'];
const PUBLIC_APPLY_ROUTES_PREFIX = '/apply';
const PROTECTED_ROUTES_PREFIX = '/dashboard';
const ADMIN_ONLY_PATHS = [
  '/dashboard/settings',
  '/dashboard/students/add',
  '/dashboard/teachers/add',
  '/dashboard/applications', // Added new admin page
];
const ADMIN_ONLY_EDIT_REGEX = /^\/dashboard\/(students|teachers)\/[0-9]+\/edit$/;


export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser(); 
    const isGuestUser = checkIsGuest();

    // Allow access to public application forms regardless of auth state
    if (pathname.startsWith(PUBLIC_APPLY_ROUTES_PREFIX)) {
      setIsCheckingAuth(false);
      return;
    }
    
    if (currentUser === 'admin' && AUTH_ROUTES.includes(pathname)) {
      router.replace('/dashboard');
    } else if (!currentUser && pathname.startsWith(PROTECTED_ROUTES_PREFIX)) {
      router.replace('/login');
    } else if (isGuestUser) {
      if (ADMIN_ONLY_PATHS.some(p => pathname.startsWith(p)) || ADMIN_ONLY_EDIT_REGEX.test(pathname)) {
        router.replace('/dashboard'); 
      }
    }
    
    setIsCheckingAuth(false);
  }, [pathname, router]);

  return { isCheckingAuth };
}

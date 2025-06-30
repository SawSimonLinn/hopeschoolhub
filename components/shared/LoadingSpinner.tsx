"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-primary", className)}
      size={size}
      aria-label="Loading..."
    />
  );
}

// cn utility if not globally available in this context (it should be from lib/utils)
// If not, it can be defined locally or imported:
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

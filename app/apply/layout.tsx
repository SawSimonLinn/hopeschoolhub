
import type { Metadata } from 'next';
import { GraduationCap } from "lucide-react";
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Application - HopeSchoolHub',
  description: 'Submit your application to HopeSchoolHub.',
};

export default function ApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This div now wraps the content for the /apply routes and applies the specific background.
    // font-body and antialiased are inherited from the RootLayout's body tag.
    <div className="bg-gradient-to-br from-background to-secondary">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl space-y-8"> {/* Increased max-width for forms */}
          <Link href="/login" className="flex items-center justify-center gap-3 mb-6 text-foreground hover:text-primary transition-colors">
            <GraduationCap className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            <span className="text-2xl font-headline font-semibold sm:text-3xl">HopeSchoolHub Applications</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

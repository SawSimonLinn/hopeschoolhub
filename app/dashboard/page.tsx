
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, UserPlus, ArrowRight, Link as LinkIcon, Copy, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { getStudents, getTeachers, getPendingStudentApplications, getPendingTeacherApplications } from "@/lib/dataService";
import { subDays, isAfter, parseISO, isValid } from "date-fns";
import { isGuest as checkIsGuest, isAdmin as checkIsAdmin } from "@/lib/authService";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const allQuickLinks = [
  { title: "Manage Applications", href: "/dashboard/applications", icon: FileCheck2, description: "Review and process new applications.", adminOnly: true },
  { title: "View Students", href: "/dashboard/students", icon: Users, description: "Browse and manage student records.", adminOnly: false },
  { title: "Add New Student", href: "/dashboard/students/add", icon: UserPlus, description: "Enroll a new student into the system.", adminOnly: true },
  { title: "View Teachers", href: "/dashboard/teachers", icon: Briefcase, description: "Access and update teacher profiles.", adminOnly: false },
  { title: "Add New Teacher", href: "/dashboard/teachers/add", icon: UserPlus, description: "Onboard a new teacher to the faculty.", adminOnly: true },
];

export default function DashboardHomePage() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [newEnrollments, setNewEnrollments] = useState(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const studentApplyLink = typeof window !== 'undefined' ? `${window.location.origin}/apply/student` : "";
  const teacherApplyLink = typeof window !== 'undefined' ? `${window.location.origin}/apply/teacher` : "";


  useEffect(() => {
    setIsGuest(checkIsGuest());
    setIsAdmin(checkIsAdmin());

    async function fetchData() {
      setIsLoading(true);
      try {
        const students = await getStudents();
        const teachers = await getTeachers();
        const pendingStudents = await getPendingStudentApplications();
        const pendingTeachers = await getPendingTeacherApplications();

        setStudentCount(students.length);
        setTeacherCount(teachers.length);
        setPendingApplicationsCount(pendingStudents.length + pendingTeachers.length);

        const thirtyDaysAgo = subDays(new Date(), 30);
        const recentEnrollments = students.filter(student => {
          if (!student.registrationDate) return false;
          try {
            const regDate = parseISO(student.registrationDate);
            return isValid(regDate) && isAfter(regDate, thirtyDaysAgo);
          } catch (e) {
            return false;
          }
        }).length;
        setNewEnrollments(recentEnrollments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load dashboard data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const handleCopyLink = (link: string, linkName: string) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        toast({ title: "Link Copied!", description: `${linkName} application link copied to clipboard.` });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link to clipboard." });
        console.error('Failed to copy link: ', err);
      });
  };

  const visibleQuickLinks = allQuickLinks.filter(link => !link.adminOnly || isAdmin);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={32} />
        <p className="ml-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Welcome to HopeSchoolHub!" description={isGuest ? "Viewing as a guest. Some functionalities are restricted." : "Your central place for managing students and teachers."} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {visibleQuickLinks.map((link) => (
          <Card key={link.href} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium font-headline">{link.title}</CardTitle>
              <link.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
              <Link href={link.href} passHref>
                <Button variant="outline" className="w-full sm:w-auto group">
                  Go to {link.title.split(" ")[1] || link.title.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><LinkIcon className="mr-2 h-5 w-5"/>Application Links</CardTitle>
            <CardDescription>Share these links for new student and teacher applications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
              <div>
                <p className="font-medium text-sm">Student Application Link</p>
                <a href={studentApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{studentApplyLink}</a>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(studentApplyLink, "Student")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
               <div>
                <p className="font-medium text-sm">Teacher Application Link</p>
                <a href={teacherApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{teacherApplyLink}</a>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(teacherApplyLink, "Teacher")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">System Overview</CardTitle>
          <CardDescription>At a glance statistics for your institution.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{studentCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{teacherCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">New Enrollments (Month)</p>
                <p className="text-2xl font-bold">{newEnrollments}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold">{pendingApplicationsCount}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

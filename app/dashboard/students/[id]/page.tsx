
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Student } from "@/types";
import { getStudentById, deleteStudent as deleteStudentService, updateStudentPaymentStatus } from "@/lib/dataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Edit3, Trash2, CalendarDays, User, Briefcase, Phone, Hash, Users, Home, MapPin, Globe, BookOpen, Award, ShieldCheck, UserCheck, Repeat, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { format, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { isGuest as checkIsGuest } from "@/lib/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MonthlyPaymentTracker } from "@/components/students/MonthlyPaymentTracker";

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = Number(params.id as string);
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(checkIsGuest());
    if (studentId) {
      setIsLoading(true);
      getStudentById(studentId)
        .then(fetchedStudent => {
          if (fetchedStudent) {
            setStudent(fetchedStudent);
          } else {
            toast({ variant: "destructive", title: "Error", description: "Student not found." });
            router.replace("/dashboard/students");
          }
        })
        .catch(error => {
          console.error("Failed to fetch student:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load student data." });
          router.replace("/dashboard/students");
        })
        .finally(() => setIsLoading(false));
    }
  }, [studentId, router, toast]);

  const handleDelete = async () => {
    if (isGuest || !student) return;
    try {
      const success = await deleteStudentService(student.id);
      if (success) {
        toast({ title: "Student Deleted", description: `${student.name} has been removed.` });
        router.push("/dashboard/students");
        router.refresh();
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete student." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred while deleting." });
    }
    setDialogOpen(false);
  };
  
  const handlePaymentUpdate = async (monthIndex: number, newStatus: 'Paid' | 'Unpaid') => {
    if (isGuest || !student) return;
    
    try {
      const updatedStudent = await updateStudentPaymentStatus(student.id, monthIndex, newStatus);
      if (updatedStudent) {
        setStudent(updatedStudent);
        toast({
          title: "Payment Updated",
          description: `Payment for month ${monthIndex + 1} marked as ${newStatus}.`,
        });
      } else {
         throw new Error("Failed to update payment status on the backend.");
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "Could not update payment status." });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading Student Details..." description="Please wait.">
          <Button variant="outline" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
        </PageHeader>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={32} />
        </div>
      </div>
    );
  }

  if (!student) {
    return ( 
      <PageHeader title="Student Not Found">
         <Button variant="outline" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students List
          </Link>
        </Button>
      </PageHeader>
    );
  }
  
  const detailItem = (icon: React.ElementType, label: string, value?: string | number | boolean | null, isBadge: boolean = false, badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary", guestSensitive: boolean = false) => {
    if (guestSensitive && isGuest) {
        value = "Restricted";
    }
    if (value === undefined || value === null || value === "") return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start py-2">
        <IconComponent className="mr-3 mt-1 h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {typeof value === 'boolean' ? (
            <p className="font-medium">{value ? "Yes" : "No"}</p>
          ) : isBadge && value !== "Restricted" ? ( 
            <Badge variant={badgeVariant} className="font-medium">{value}</Badge>
          ) : (
            <p className="font-medium">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title={student.name} description={`Student ID: ${student.studentId}`}>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="shadow-xl">
            <CardHeader className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={student.photoUrl} alt={student.name} data-ai-hint="student photo" />
                <AvatarFallback className="text-4xl">{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <CardTitle className="font-headline text-3xl mb-1">{student.name}</CardTitle>
                <CardDescription className="text-base">All recorded details for {student.name}.</CardDescription>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                  {detailItem(Hash, "Student ID", student.studentId, true)}
                  {detailItem(Award, "Grade", student.grade)}
                  {detailItem(Repeat, "Payment Type", student.paymentType, true, "default")}
                  {detailItem(DollarSign, student.paymentType === 'Monthly' ? "Total Annual Fee" : "Amount Paid", `$${student.amountPaid.toFixed(2)}`)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 pt-6 border-t">
              {detailItem(CalendarDays, "Age", `${student.age} years old`)}
              {detailItem(CalendarDays, "Date of Birth", student.dob && isValid(parseISO(student.dob)) ? format(parseISO(student.dob), "MMMM d, yyyy") : 'N/A', false, "secondary", true)}
              {detailItem(CalendarDays, "Registration Date", student.registrationDate && isValid(parseISO(student.registrationDate)) ? format(parseISO(student.registrationDate), "MMMM d, yyyy") : 'N/A')}
              {detailItem(Briefcase, "Years of Enrollment", student.yearsOfEnroll)}
              {detailItem(Users, "Parent/Guardian Name", student.parentName, false, "secondary", true)}
              {detailItem(UserCheck, "Gender", student.gender)}
              {detailItem(Globe, "Nationality", student.nationality)}
              {detailItem(BookOpen, "Religion", student.religion)}
              {detailItem(Home, "Address", student.address, false, "secondary", true)}
              {detailItem(Phone, "Contact Number", student.contactNumber, false, "secondary", true)}
              {detailItem(MapPin, "Church Name", student.churchName || "N/A", false, "secondary", true)}
              {detailItem(ShieldCheck, "Eligible for Transfer Certificate", student.canTransferCertificate)}
              {detailItem(Hash, "Personal ID / Passport", student.personalId, false, "secondary", true)}
            </CardContent>
            {!isGuest && (
              <CardFooter className="flex justify-end gap-2 border-t pt-6">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/students/${student.id}/edit`}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={() => setDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-1">
           {student.paymentType === 'Monthly' && student.monthlyPayments && (
             <MonthlyPaymentTracker student={student} onUpdate={handlePaymentUpdate} isGuest={isGuest} />
           )}
        </div>
      </div>


      {!isGuest && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleDelete}
          title="Delete Student"
          description={`Are you sure you want to delete ${student?.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}

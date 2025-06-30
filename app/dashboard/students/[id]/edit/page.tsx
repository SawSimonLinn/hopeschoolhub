"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StudentForm } from "@/components/students/StudentForm";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Student } from "@/types";
import { getStudentById, updateStudent } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import type { StudentFormData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = Number(params.id as string);
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      getStudentById(studentId)
        .then((fetchedStudent) => {
          if (fetchedStudent) {
            setStudent(fetchedStudent);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Student not found.",
            });
            router.replace("/dashboard/students");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch student:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load student data.",
          });
          router.replace("/dashboard/students");
        })
        .finally(() => setIsLoading(false));
    }
  }, [studentId, router, toast]);

  const handleSubmit = async (data: StudentFormData) => {
    if (!student) return;
    setIsSubmitting(true);
    try {
      await updateStudent(String(student.id), data);
      toast({
        title: "Student Updated",
        description: `${data.name}'s details have been successfully updated.`,
      });
      router.push(`/dashboard/students/${student.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update student:", error);
      let errorMessage = "Failed to update student. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error Updating Student",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Student..."
          description="Please wait while we fetch the details."
        >
          <Button variant="outline" asChild>
            <Link href="/dashboard/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students List
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${student.name}`}
        description="Update student details using the form below."
      >
        <Button variant="outline" asChild>
          <Link href={`/dashboard/students/${student.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>
      </PageHeader>
      <StudentForm
        student={student}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Save Changes"
      />
    </div>
  );
}

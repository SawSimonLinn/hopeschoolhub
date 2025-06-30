
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/students/StudentForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { addStudent } from "@/lib/dataService";
import type { StudentFormData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await addStudent(data); 
      toast({
        title: "Student Added",
        description: `${data.name} has been successfully added.`,
      });
      router.push("/dashboard/students");
      router.refresh(); 
    } catch (error) {
      console.error("Failed to add student:", error);
      let errorMessage = "Failed to add student. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error Adding Student",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Student" description="Enter the details for the new student.">
        <Button variant="outline" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students List
          </Link>
        </Button>
      </PageHeader>
      <StudentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Add Student" />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { addTeacher } from "@/lib/dataService";
import type { TeacherFormData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddTeacherPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TeacherFormData) => {
    setIsSubmitting(true);
    try {
      await addTeacher(data);
      toast({
        title: "Teacher Added",
        description: `${data.name} has been successfully added.`,
      });
      router.push("/dashboard/teachers");
      router.refresh();
    } catch (error) {
      console.error("Failed to add teacher:", error);
      let errorMessage = "Failed to add teacher. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error Adding Teacher",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Teacher"
        description="Enter the details for the new teacher."
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/teachers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teachers List
          </Link>
        </Button>
      </PageHeader>
      <TeacherForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Teacher"
      />
    </div>
  );
}

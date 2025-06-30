
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Teacher } from "@/types";
import { getTeacherById, updateTeacher } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import type { TeacherFormData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherIdParam = Number(params.id as string); 
  const { toast } = useToast();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teacherIdParam) {
      setIsLoading(true);
      getTeacherById(teacherIdParam)
        .then(fetchedTeacher => {
          if (fetchedTeacher) {
            setTeacher(fetchedTeacher);
          } else {
            toast({ variant: "destructive", title: "Error", description: "Teacher not found." });
            router.replace("/dashboard/teachers");
          }
        })
        .catch(error => {
          console.error("Failed to fetch teacher:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load teacher data." });
          router.replace("/dashboard/teachers");
        })
        .finally(() => setIsLoading(false));
    }
  }, [teacherIdParam, router, toast]);

  const handleSubmit = async (data: TeacherFormData) => {
    if (!teacher) return;
    setIsSubmitting(true);
    try {
      await updateTeacher(teacher.id, data); 
      toast({
        title: "Teacher Updated",
        description: `${data.name}'s details have been successfully updated.`,
      });
      router.push(`/dashboard/teachers/${teacher.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update teacher:", error);
      let errorMessage = "Failed to update teacher. Please try again.";
       if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error Updating Teacher",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading Teacher..." description="Please wait while we fetch the details.">
          <Button variant="outline" asChild>
            <Link href="/dashboard/teachers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Teachers List
            </Link>
          </Button>
        </PageHeader>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={32} />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
       <PageHeader title="Teacher Not Found">
         <Button variant="outline" asChild>
          <Link href="/dashboard/teachers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teachers List
          </Link>
        </Button>
      </PageHeader>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${teacher.name}`} description="Update teacher details using the form below.">
         <Button variant="outline" asChild>
          <Link href={`/dashboard/teachers/${teacher.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>
      </PageHeader>
      <TeacherForm teacher={teacher} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Save Changes" />
    </div>
  );
}

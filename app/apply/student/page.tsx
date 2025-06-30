
"use client";

import { useState } from "react";
import { StudentForm } from "@/components/students/StudentForm";
import { useToast } from "@/hooks/use-toast";
import { addPendingStudentApplication } from "@/lib/dataService";
import type { StudentFormData } from "@/types/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";

export default function StudentApplicationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await addPendingStudentApplication(data); 
      toast({
        title: "Application Submitted for Review!",
        description: "Your student application has been received and is pending review.",
      });
      setIsSubmittedSuccessfully(true);
    } catch (error) {
      console.error("Failed to submit student application:", error);
      let errorMessage = "Failed to submit application. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Error Submitting Application",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccessfully) {
    return (
      <Card className="shadow-xl border-green-500 border-2">
        <CardHeader className="items-center text-center p-6 sm:p-8">
          <CircleCheckBig className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-xl sm:text-2xl font-headline">Application Submitted Successfully!</CardTitle>
          <CardDescription className="mt-2 text-base">
            Thank you for applying to HopeSchoolHub. We have received your student application. 
            It is currently under review. We will contact you if further information is needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-6 sm:pb-8">
            <Button variant="outline" asChild className="mt-4 sm:mt-6">
                <Link href="/login">Return to Login Page</Link>
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <StudentForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Submit Student Application"
    />
  );
}

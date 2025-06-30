
"use client";

import { useState } from "react";
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { useToast } from "@/hooks/use-toast";
import { addPendingTeacherApplication } from "@/lib/dataService";
import type { TeacherFormData } from "@/types/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";

export default function TeacherApplicationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const handleSubmit = async (data: TeacherFormData) => {
    setIsSubmitting(true);
    try {
      await addPendingTeacherApplication(data); 
      toast({
        title: "Application Submitted for Review!",
        description: "Your teaching application has been received and is pending review.",
      });
      setIsSubmittedSuccessfully(true);
    } catch (error) {
      console.error("Failed to submit teacher application:", error);
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
            Thank you for your interest in a teaching position at HopeSchoolHub. We have received your application.
            It is currently under review. We will contact you regarding the next steps.
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
    <TeacherForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Submit Teacher Application"
    />
  );
}

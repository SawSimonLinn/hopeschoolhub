
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Users, FileCheck2, CheckCircle, XCircle, CalendarDays, User, Hash, Mail, BookOpen, Star, UsersIcon as PeopleIcon, Home, Phone, Globe, BookOpenIcon, Award, ShieldCheck, UserCheck, Link as LinkIcon, Copy, Repeat, DollarSign, Image as ImageIcon } from "lucide-react";
import type { PendingStudentApplication, PendingTeacherApplication } from "@/types";
import {
  getPendingStudentApplications,
  getPendingTeacherApplications,
  approveStudentApplication,
  declineStudentApplication,
  approveTeacherApplication,
  declineTeacherApplication,
} from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { format, parseISO, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";

type ApplicationType = "student" | "teacher";

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [pendingStudents, setPendingStudents] = useState<PendingStudentApplication[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacherApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{ type: "approve" | "decline"; appType: ApplicationType; id: string; name: string } | null>(null);

  const [studentApplyLink, setStudentApplyLink] = useState("");
  const [teacherApplyLink, setTeacherApplyLink] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStudentApplyLink(`${window.location.origin}/apply/student`);
      setTeacherApplyLink(`${window.location.origin}/apply/teacher`);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [students, teachers] = await Promise.all([
        getPendingStudentApplications(),
        getPendingTeacherApplications()
      ]);
      setPendingStudents(students);
      setPendingTeachers(teachers);
    } catch (error) {
      console.error("Failed to fetch pending applications:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load pending applications." });
    } finally {
      setIsLoading(false);
    }
  };


  const handleAction = (type: "approve" | "decline", appType: ApplicationType, id: string, name: string) => {
    setCurrentAction({ type, appType, id, name });
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!currentAction) return;
    const { type, appType, id, name } = currentAction;

    let success = false;
    let actionMessage = "";

    try {
      if (appType === "student") {
        if (type === "approve") {
          const approvedStudent = await approveStudentApplication(id);
          success = !!approvedStudent;
          actionMessage = success ? `${name}'s application approved and added to students.` : `Failed to approve ${name}'s application.`;
        } else {
          success = await declineStudentApplication(id);
          actionMessage = success ? `${name}'s application declined.` : `Failed to decline ${name}'s application.`;
        }
      } else if (appType === "teacher") {
        if (type === "approve") {
          const approvedTeacher = await approveTeacherApplication(id);
          success = !!approvedTeacher;
          actionMessage = success ? `${name}'s application approved and added to teachers.` : `Failed to approve ${name}'s application.`;
        } else {
          success = await declineTeacherApplication(id);
          actionMessage = success ? `${name}'s application declined.` : `Failed to decline ${name}'s application.`;
        }
      }
    } catch (error) {
        console.error(`Error during ${type} action for ${name}:`, error);
        success = false;
        actionMessage = `An error occurred. Failed to ${type} ${name}'s application.`;
    }


    toast({
      title: success ? "Action Successful" : "Action Failed",
      description: actionMessage,
      variant: success ? "default" : "destructive",
    });

    setDialogOpen(false);
    setCurrentAction(null);
    if (success) {
      fetchData(); 
    }
  };
  
  const detailItem = (icon: React.ElementType, label: string, value?: string | number | boolean | null, isBadge: boolean = false, badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary") => {
    if (value === undefined || value === null || value === "") return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start text-sm py-1">
        <IconComponent className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          {typeof value === 'boolean' ? (
            <p className="font-medium">{value ? "Yes" : "No"}</p>
          ) : isBadge ? (
            <Badge variant={badgeVariant} className="font-medium text-xs px-1.5 py-0.5">{value}</Badge>
          ) : (
            <p className="font-medium break-all">{value}</p>
          )}
        </div>
      </div>
    );
  };

  const handleCopyLink = (link: string, linkName: string) => {
    if (!link) return; 
    navigator.clipboard.writeText(link)
      .then(() => {
        toast({ title: "Link Copied!", description: `${linkName} application link copied to clipboard.` });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link to clipboard." });
        console.error('Failed to copy link: ', err);
      });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
         <PageHeader title="Manage Applications" description="Review and process new student and teacher applications." />
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><LinkIcon className="mr-2 h-5 w-5"/>Application Links</CardTitle>
                <CardDescription>Share these links for new student and teacher applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
                    <div>
                        <p className="font-medium text-sm">Student Application Link</p>
                        {studentApplyLink ? (
                        <a href={studentApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{studentApplyLink}</a>
                        ) : <LoadingSpinner size={16} className="my-1"/>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyLink(studentApplyLink, "Student")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0" disabled={!studentApplyLink}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
                    <div>
                        <p className="font-medium text-sm">Teacher Application Link</p>
                        {teacherApplyLink ? (
                            <a href={teacherApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{teacherApplyLink}</a>
                        ): <LoadingSpinner size={16} className="my-1"/>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyLink(teacherApplyLink, "Teacher")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0" disabled={!teacherApplyLink}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                </div>
            </CardContent>
        </Card>
        <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={32} />
            <p className="ml-2">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Manage Applications" description="Review and process new student and teacher applications." />

      <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><LinkIcon className="mr-2 h-5 w-5"/>Application Links</CardTitle>
            <CardDescription>Share these links for new student and teacher applications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
              <div>
                <p className="font-medium text-sm">Student Application Link</p>
                {studentApplyLink ? (
                   <a href={studentApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{studentApplyLink}</a>
                ) : <LoadingSpinner size={16} className="my-1"/>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(studentApplyLink, "Student")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0" disabled={!studentApplyLink}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-muted/30">
               <div>
                <p className="font-medium text-sm">Teacher Application Link</p>
                 {teacherApplyLink ? (
                    <a href={teacherApplyLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all">{teacherApplyLink}</a>
                 ): <LoadingSpinner size={16} className="my-1"/>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(teacherApplyLink, "Teacher")} className="mt-2 sm:mt-0 sm:ml-4 shrink-0" disabled={!teacherApplyLink}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </CardContent>
        </Card>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="students" className="text-base">
            <Users className="mr-2 h-5 w-5" /> Student ({pendingStudents.length})
          </TabsTrigger>
          <TabsTrigger value="teachers" className="text-base">
            <Briefcase className="mr-2 h-5 w-5" /> Teacher ({pendingTeachers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          {pendingStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck2 className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No pending student applications.</p>
              <p className="text-sm">New student applications will appear here for review.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingStudents.map((app) => (
                <Card key={app.applicationId} className="shadow-lg flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{app.name}</CardTitle>
                    <CardDescription>
                      Submitted: {app.submittedAt && isValid(parseISO(app.submittedAt)) ? format(parseISO(app.submittedAt), "PPP p") : 'Unknown'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                     <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">View Full Details</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-1">
                          {detailItem(User, "Full Name", app.name)}
                          {detailItem(Hash, "Student ID", app.studentId, true)}
                          {detailItem(Award, "Grade", app.grade)}
                          {detailItem(CalendarDays, "Age", `${app.age} years old`)}
                          {detailItem(Repeat, "Payment Type", app.paymentType, true, "default")}
                          {detailItem(DollarSign, "Amount Paid", app.amountPaid ? `$${app.amountPaid.toFixed(2)}` : '$0.00')}
                          {detailItem(CalendarDays, "Date of Birth", app.dob && isValid(parseISO(app.dob)) ? format(parseISO(app.dob), "MMMM d, yyyy") : 'N/A')}
                          {detailItem(Briefcase, "Years of Enrollment", app.yearsOfEnroll)}
                          {detailItem(PeopleIcon, "Parent/Guardian Name", app.parentName)}
                          {detailItem(UserCheck, "Gender", app.gender)}
                          {detailItem(Globe, "Nationality", app.nationality)}
                          {detailItem(BookOpenIcon, "Religion", app.religion)}
                          {detailItem(Home, "Address", app.address)}
                          {detailItem(Phone, "Contact Number", app.contactNumber)}
                          {detailItem(Award, "Church Name", app.churchName || "N/A")}
                          {detailItem(ShieldCheck, "Eligible for Transfer Certificate", app.canTransferCertificate)}
                          {detailItem(Hash, "Personal ID / Passport", app.personalId)}
                          {detailItem(ImageIcon, "Photo URL", app.photoUrl)}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleAction("decline", "student", app.applicationId, app.name)}>
                      <XCircle className="mr-2 h-4 w-4" /> Decline
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleAction("approve", "student", app.applicationId, app.name)}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          {pendingTeachers.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
              <FileCheck2 className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-semibold">No pending teacher applications.</p>
              <p className="text-sm">New teacher applications will appear here for review.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingTeachers.map((app) => (
                <Card key={app.applicationId} className="shadow-lg flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{app.name}</CardTitle>
                     <CardDescription>
                      Submitted: {app.submittedAt && isValid(parseISO(app.submittedAt)) ? format(parseISO(app.submittedAt), "PPP p") : 'Unknown'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                     <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">View Full Details</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-1">
                          {detailItem(User, "Full Name", app.name)}
                          {detailItem(Hash, "Teacher ID", app.teacherId, true, "outline")}
                          {detailItem(Mail, "Email Address", app.email || "N/A")}
                          {detailItem(BookOpen, "Subject Taught", app.subject, true)}
                          {detailItem(Star, "Age", `${app.age} years old`)}
                          {detailItem(Award, "Associated Grade", app.grade)}
                          {detailItem(CalendarDays, "Hire Date (Proposed)", app.hireDate && isValid(parseISO(app.hireDate)) ? format(parseISO(app.hireDate), "MMMM d, yyyy") : 'N/A')}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                     <Button variant="outline" size="sm" onClick={() => handleAction("decline", "teacher", app.applicationId, app.name)}>
                      <XCircle className="mr-2 h-4 w-4" /> Decline
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleAction("approve", "teacher", app.applicationId, app.name)}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {currentAction && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={confirmAction}
          title={`${currentAction.type === "approve" ? "Approve" : "Decline"} Application`}
          description={`Are you sure you want to ${currentAction.type} the application for ${currentAction.name}?`}
          confirmText={currentAction.type === "approve" ? "Approve" : "Decline"}
          confirmButtonVariant={currentAction.type === "approve" ? "default" : "destructive"}
        />
      )}
    </div>
  );
}


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentTable } from "@/components/students/StudentTable";
import type { Student } from "@/types";
import { getStudents, deleteStudent as deleteStudentService } from "@/lib/dataService";
import { PlusCircle, Search, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { isGuest as checkIsGuest, isAdmin as checkIsAdmin } from "@/lib/authService";

export default function ViewStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsGuest(checkIsGuest());
    setIsAdmin(checkIsAdmin());
    async function fetchInitialStudents() {
      setIsLoading(true);
      try {
        const fetchedStudents = await getStudents();
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load student data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialStudents();
  }, [toast]);

 useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = students.filter(item =>
      item.name.toLowerCase().includes(lowercasedFilter) ||
      item.studentId.toLowerCase().includes(lowercasedFilter) ||
      (item.personalId && item.personalId.toLowerCase().includes(lowercasedFilter)) ||
      (item.contactNumber && item.contactNumber.toLowerCase().includes(lowercasedFilter))
    );
    setFilteredStudents(filteredData);
  }, [searchTerm, students]);

  const handleDeleteRequest = (student: Student) => {
    if (isGuest) return;
    setStudentToDelete(student);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (isGuest || !studentToDelete) return;
    
    try {
      const success = await deleteStudentService(studentToDelete.id);
      if (success) {
        const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents); 
        toast({ title: "Student Deleted", description: `${studentToDelete.name} has been removed.` });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete student." });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "An error occurred while deleting the student." });
    }
    
    setDialogOpen(false);
    setStudentToDelete(null);
  };

  if (isLoading) {
    return (
       <div className="space-y-6">
        <PageHeader title="Manage Students" description="View, add, edit, or delete student records.">
          {isAdmin && (
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/students/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
              </Link>
            </Button>
          )}
        </PageHeader>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={32} />
          <p className="ml-2">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Students" description="View, add, edit, or delete student records.">
        {isAdmin && (
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/students/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
            </Link>
          </Button>
        )}
      </PageHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students by name, ID, contact..."
          className="w-full max-w-md pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStudents.length > 0 ? (
        <StudentTable students={filteredStudents} onDelete={handleDeleteRequest} isGuest={isGuest} />
      ) : (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No Students Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "No students match your search." : "There are no students in the system yet. Try adding one if you are an admin."}
          </p>
          {!searchTerm && isAdmin && (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/students/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add First Student
              </Link>
            </Button>
          )}
        </div>
      )}

      <ConfirmationDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Student"
        description={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

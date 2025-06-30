
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeacherTable } from "@/components/teachers/TeacherTable";
import type { Teacher } from "@/types";
import { getTeachers, deleteTeacher as deleteTeacherService } from "@/lib/dataService";
import { PlusCircle, Search, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { isGuest as checkIsGuest, isAdmin as checkIsAdmin } from "@/lib/authService";

export default function ViewTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsGuest(checkIsGuest());
    setIsAdmin(checkIsAdmin());
    async function fetchInitialTeachers() {
      setIsLoading(true);
      try {
        const fetchedTeachers = await getTeachers();
        setTeachers(fetchedTeachers);
        setFilteredTeachers(fetchedTeachers);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load teacher data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialTeachers();
  }, [toast]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = teachers.filter(item =>
      item.name.toLowerCase().includes(lowercasedFilter) ||
      (item.email && item.email.toLowerCase().includes(lowercasedFilter)) ||
      item.subject.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredTeachers(filteredData);
  }, [searchTerm, teachers]);

  const handleDeleteRequest = (teacher: Teacher) => {
    if (isGuest) return;
    setTeacherToDelete(teacher);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (isGuest || !teacherToDelete) return;
    
    try {
      const success = await deleteTeacherService(teacherToDelete.id);
      if (success) {
        const updatedTeachers = teachers.filter(t => t.id !== teacherToDelete.id);
        setTeachers(updatedTeachers);
        setFilteredTeachers(updatedTeachers);
        toast({ title: "Teacher Deleted", description: `${teacherToDelete.name} has been removed.` });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete teacher." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred while deleting the teacher." });
    }
    
    setDialogOpen(false);
    setTeacherToDelete(null);
  };

  if (isLoading) {
    return (
       <div className="space-y-6">
        <PageHeader title="Manage Teachers" description="View, add, edit, or delete teacher records.">
          {isAdmin && (
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard/teachers/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
              </Link>
            </Button>
          )}
        </PageHeader>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={32} />
           <p className="ml-2">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Teachers" description="View, add, edit, or delete teacher records.">
        {isAdmin && (
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/teachers/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
            </Link>
          </Button>
        )}
      </PageHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search teachers by name, email, or subject..."
          className="w-full max-w-sm pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTeachers.length > 0 ? (
        <TeacherTable teachers={filteredTeachers} onDelete={handleDeleteRequest} isGuest={isGuest} />
      ) : (
         <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No Teachers Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "No teachers match your search." : "There are no teachers in the system yet. Try adding one if you are an admin."}
          </p>
          {!searchTerm && isAdmin && (
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/teachers/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add First Teacher
              </Link>
            </Button>
          )}
        </div>
      )}

      <ConfirmationDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        description={`Are you sure you want to delete ${teacherToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

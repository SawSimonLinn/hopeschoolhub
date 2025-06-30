
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { teacherSchema, type TeacherFormData } from "@/types/schema";
import type { Teacher } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function TeacherForm({ teacher, onSubmit, isSubmitting, submitButtonText = "Submit" }: TeacherFormProps) {
  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: teacher?.name || "",
      email: teacher?.email || "",
      subject: teacher?.subject || "",
      hireDate: teacher?.hireDate && isValid(parseISO(teacher.hireDate)) ? format(parseISO(teacher.hireDate), "yyyy-MM-dd") : "",
      age: teacher?.age ?? undefined,
      grade: teacher?.grade ?? undefined,
      teacherId: teacher?.teacherId || "",
    },
  });
  
  const [hireDateOpen, setHireDateOpen] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{teacher ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
        <CardDescription>{teacher ? "Update the teacher's details below." : "Fill in the form to add a new teacher."}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher ID</FormLabel>
                    <FormControl>
                      <Input placeholder="T001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jane.smith@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Taught</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field: { onChange: rhfOnChange, onBlur, name, ref, value: formValue } }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                       <Input
                        type="number"
                        placeholder="30"
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        value={formValue === undefined || formValue === null ? '' : String(formValue)}
                        onChange={e => {
                          const val = e.target.value;
                          rhfOnChange(val === '' ? undefined : +val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade" // Assuming grade means grade level they can teach or are associated with
                render={({ field: { onChange: rhfOnChange, onBlur, name, ref, value: formValue } }) => (
                  <FormItem>
                    <FormLabel>Associated Grade Level</FormLabel>
                     <FormControl>
                       <Input
                        type="number"
                        placeholder="10"
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                        value={formValue === undefined || formValue === null ? '' : String(formValue)}
                        onChange={e => {
                          const val = e.target.value;
                          rhfOnChange(val === '' ? undefined : +val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                 <FormItem className="flex flex-col">
                  <FormLabel>Hire Date (Optional)</FormLabel>
                  <Popover open={hireDateOpen} onOpenChange={setHireDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && isValid(parseISO(field.value)) ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          setHireDateOpen(false);
                        }}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

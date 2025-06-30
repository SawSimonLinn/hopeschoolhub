
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { studentSchema, type StudentFormData } from "@/types/schema";
import type { Student } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CalendarIcon, DollarSign, ImageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentFormProps {
  student?: Student; // Student object if editing, includes 'id'
  onSubmit: (data: StudentFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function StudentForm({ student, onSubmit, isSubmitting, submitButtonText = "Submit" }: StudentFormProps) {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || "",
      photoUrl: student?.photoUrl || "",
      grade: student?.grade ?? undefined,
      age: student?.age ?? undefined,
      paymentType: student?.paymentType || undefined,
      amountPaid: student?.amountPaid ?? undefined,
      studentId: student?.studentId || "",
      personalId: student?.personalId || "",
      dob: student?.dob ? (isValid(parseISO(student.dob)) ? format(parseISO(student.dob), "yyyy-MM-dd") : "") : "",
      registrationDate: student?.registrationDate ? (isValid(parseISO(student.registrationDate)) ? format(parseISO(student.registrationDate), "yyyy-MM-dd") : "") : "",
      yearsOfEnroll: student?.yearsOfEnroll ?? undefined,
      parentName: student?.parentName || "",
      gender: student?.gender || "",
      nationality: student?.nationality || "",
      religion: student?.religion || "",
      canTransferCertificate: student?.canTransferCertificate || false,
      address: student?.address || "",
      contactNumber: student?.contactNumber || "",
      churchName: student?.churchName || "",
    },
  });

  const [dobOpen, setDobOpen] = useState(false);
  const [regDateOpen, setRegDateOpen] = useState(false);

  const handleFormSubmit = async (data: StudentFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{student ? "Edit Student" : "Add New Student"}</CardTitle>
        <CardDescription>{student ? "Update the student's details below." : "Fill in the form to add a new student."}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl><Input placeholder="S1001" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (Optional)</FormLabel>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        id="photoUrl"
                        placeholder="https://example.com/student-photo.png"
                        {...field}
                        className="pl-10"
                        aria-invalid={!!form.formState.errors.photoUrl}
                        aria-describedby="photoUrl-error"
                      />
                    </FormControl>
                  </div>
                  <FormMessage id="photoUrl-error" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field: { onChange: rhfOnChange, onBlur, name, ref, value: formValue } }) => (
                  <FormItem>
                    <FormLabel>Amount Paid</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500.00"
                          step="0.01"
                          name={name}
                          ref={ref}
                          onBlur={onBlur}
                          className="pl-10"
                          value={formValue === undefined || formValue === null ? '' : String(formValue)}
                          onChange={e => {
                            const val = e.target.value;
                            rhfOnChange(val === '' ? undefined : +val);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field: { onChange: rhfOnChange, onBlur, name, ref, value: formValue } }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
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
                        placeholder="16"
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
                name="yearsOfEnroll"
                render={({ field: { onChange: rhfOnChange, onBlur, name, ref, value: formValue } }) => (
                  <FormItem>
                    <FormLabel>Years of Enrollment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover open={dobOpen} onOpenChange={setDobOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
                          onSelect={(date) => { field.onChange(date ? format(date, "yyyy-MM-dd") : ""); setDobOpen(false); }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Registration Date</FormLabel>
                    <Popover open={regDateOpen} onOpenChange={setRegDateOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
                          onSelect={(date) => { field.onChange(date ? format(date, "yyyy-MM-dd") : ""); setRegDateOpen(false);}}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="personalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal ID / Passport No.</FormLabel>
                  <FormControl><Input placeholder="National ID or Passport" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="+1-555-123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl><Input placeholder="American" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl><Input placeholder="Christianity" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Textarea placeholder="123 Main St, Anytown, USA" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <FormField
                control={form.control}
                name="churchName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Church Name (if any)</FormLabel>
                    <FormControl><Input placeholder="First Community Church" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="canTransferCertificate"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mt-6 md:mt-7 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Transfer Certificate Eligible?</FormLabel>
                        <FormDescription>Check if the student can receive a transfer certificate.</FormDescription>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

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

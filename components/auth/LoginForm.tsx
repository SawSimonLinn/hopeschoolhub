"use client";

import { account } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginFormData } from "@/types/schema";
import { loginUser } from "@/lib/authService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = loginUser(data.email, data.password);

    setIsLoading(false);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back, Admin!",
      });
      router.push("/dashboard");
      router.refresh(); // Important to re-fetch server components if needed
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
      form.setError("email", { type: "manual", message: " " }); // Clear previous specific errors, show general one
      form.setError("password", {
        type: "manual",
        message: "Invalid credentials.",
      });
    }
  }

  // async function onSubmit(data: LoginFormData) {
  //   setIsLoading(true);
  //   try {
  //     const session = await account.createEmailPasswordSession(
  //       data.email,
  //       data.password
  //     );
  //     console.log("Project:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  //     console.log("Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);

  //     console.log("Session created:", session);

  //     toast({
  //       title: "Login Successful",
  //       description: "Welcome back!",
  //     });

  //     router.push("/dashboard");
  //     router.refresh();
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Login Failed",
  //       description: error?.message || "Something went wrong. Try again.",
  //     });
  //     console.error("Login Error:", error);
  //     form.setError("email", { type: "manual", message: " " });
  //     form.setError("password", {
  //       type: "manual",
  //       message: "Invalid credentials.",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="admin@example.com or admin"
                      {...field}
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby="email-error"
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        aria-invalid={!!form.formState.errors.password}
                        aria-describedby="password-error"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage id="password-error" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

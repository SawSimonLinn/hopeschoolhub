
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { settingsSchema, type SettingsFormData } from "@/types/schema";
import { updateUsername, getCurrentUser, logoutUser, updateProfilePicUrl, getProfilePicUrl } from "@/lib/authService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Info, Image as ImageIcon } from "lucide-react"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SettingsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUsername(user);
      form.setValue("currentUsername", user);
    }
    const picUrl = getProfilePicUrl();
    if (picUrl) {
      setCurrentProfilePicUrl(picUrl);
      form.setValue("profilePicUrl", picUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currentUsername: "",
      newUsername: "",
      profilePicUrl: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  
  useEffect(() => {
    if (currentUsername) {
        form.setValue("currentUsername", currentUsername);
        form.setValue("newUsername", currentUsername); 
    }
    if (currentProfilePicUrl) {
        form.setValue("profilePicUrl", currentProfilePicUrl);
    }
  }, [currentUsername, currentProfilePicUrl, form]);


  async function onSubmit(data: SettingsFormData) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 

    let usernameUpdated = false;
    let profilePicUpdated = false;
    let settingsChanged = false;

    if (data.newUsername.toLowerCase() !== data.currentUsername.toLowerCase()) {
        usernameUpdated = updateUsername(data.currentUsername, data.newUsername);
        if (usernameUpdated) {
            settingsChanged = true;
            toast({
            title: "Username Updated",
            description: `Your username has been changed to ${data.newUsername}. Please log in again.`,
            });
        } else {
            toast({
            variant: "destructive",
            title: "Username Update Failed",
            description: "Could not update username. Please ensure current username is correct.",
            });
        }
    }
    
    if (data.profilePicUrl !== currentProfilePicUrl) {
        updateProfilePicUrl(data.profilePicUrl || "");
        setCurrentProfilePicUrl(data.profilePicUrl || ""); 
        settingsChanged = true;
        toast({
            title: "Profile Picture Updated",
            description: "Your profile picture has been updated.",
        });
        profilePicUpdated = true;
    }


    let passwordMessage = "";
    if (data.newPassword) {
      settingsChanged = true;
      // In a real app, you'd hash and save the new password on the backend.
      // For this demo, we acknowledge it, but the hardcoded password in authService remains.
      passwordMessage = " Password change acknowledged (demo - password not stored).";
    }
    
    if (usernameUpdated) {
        logoutUser();
        router.push("/login");
        router.refresh();
    } else if (settingsChanged) {
         toast({
            title: "Settings Updated",
            description: (profilePicUpdated ? "Profile picture updated." : "") + passwordMessage,
        });
        
        if (profilePicUpdated && !passwordMessage && !usernameUpdated) {
            router.refresh(); 
        }
    } else {
        toast({
            title: "No Changes",
            description: "No changes were made to your settings.",
        });
    }

    setIsLoading(false);
    if (!usernameUpdated && data.newUsername.toLowerCase() !== data.currentUsername.toLowerCase()) {
        form.setValue("newUsername", data.currentUsername);
    }
    form.resetField("newPassword");
    form.resetField("confirmNewPassword");
  }

  return (
    <Card className="w-full max-w-xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">User Settings</CardTitle>
        <CardDescription>Update your username/email, profile picture, and password.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="currentUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="currentUsername">Current Username/Email</FormLabel>
                  <FormControl>
                    <Input 
                      id="currentUsername" 
                      {...field} 
                      disabled 
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage id="currentUsername-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newUsername">New Username/Email</FormLabel>
                  <FormControl>
                    <Input 
                      id="newUsername" 
                      placeholder="yournewusername or new@example.com" 
                      {...field}
                      aria-invalid={!!form.formState.errors.newUsername}
                      aria-describedby="newUsername-error"
                    />
                  </FormControl>
                  <FormMessage id="newUsername-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePicUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="profilePicUrl">Profile Picture URL (Optional)</FormLabel>
                   <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input 
                        id="profilePicUrl" 
                        placeholder="https://example.com/your-avatar.png" 
                        {...field}
                        className="pl-10"
                        aria-invalid={!!form.formState.errors.profilePicUrl}
                        aria-describedby="profilePicUrl-error"
                      />
                    </FormControl>
                  </div>
                  <FormMessage id="profilePicUrl-error" />
                </FormItem>
              )}
            />
            
            <Alert variant="default" className="bg-accent/20 border-accent/50 text-accent-foreground">
              <Info className="h-4 w-4 !text-accent" />
              <AlertTitle className="text-accent">Password Change (Demo)</AlertTitle>
              <AlertDescription>
                For this demonstration, the admin login uses a specific hardcoded password (`adminpassword`). Password changes entered here are acknowledged but not fully implemented to update this hardcoded value, as there is no secure backend storage.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">New Password (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Input 
                        id="newPassword" 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        aria-invalid={!!form.formState.errors.newPassword}
                        aria-describedby="newPassword-error"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage id="newPassword-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                       <Input 
                        id="confirmNewPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        aria-invalid={!!form.formState.errors.confirmNewPassword}
                        aria-describedby="confirmNewPassword-error"
                        disabled={!form.watch("newPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        disabled={!form.watch("newPassword")}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage id="confirmNewPassword-error" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !form.formState.isDirty}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

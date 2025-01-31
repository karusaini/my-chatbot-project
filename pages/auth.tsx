"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react"; // Importing the loading icon from Lucide (you can use any other icon library)

interface LoginFormInputs {
  email: string;
  password: string;
}

interface RegisterFormInputs extends LoginFormInputs {
  confirmPassword: string;
}

const AuthPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false); // State for button loading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const {
    register: registerRegisterForm,
    handleSubmit: handleSubmitRegisterForm,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormInputs>();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);

      if (user) {
        const companyName = user.user_metadata?.company_name;
        if (!companyName) {
          router.push("/setup-organization");
        } else {
          router.push("/dashboard");
        }
      }
    };

    checkAuth();
  }, [router]);

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true); // Set loading state to true
    const { error, data: _data } = await supabase.auth
      .signInWithPassword({
        email: data.email,
        password: data.password,
      })
      .catch((err) => ({
        error: { message: "Something went wrong!" },
        data: null,
      }));

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default",
      });
      router.push("/dashboard");
    }
    setLoading(false); // Reset loading state after submission
  };

  const onSubmitRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true); // Set loading state to true
    const { error, data: _data } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Welcome! Please complete your registration.",
        variant: "default",
      });
      router.push("/setup-organization");
    }
    setLoading(false); // Reset loading state after submission
  };

  const handleGoogleLogin = async () => {
    setLoading(true); // Set loading state to true
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://talkbot-ai-new.vercel.app/setup-organization",
      },
    });
    if (error) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome!",
        variant: "default",
      });
    }
    setLoading(false); // Reset loading state after submission
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md p-3 sm:p-6 shadow-md">
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "login" | "register")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleSubmit(onSubmitLogin)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Continue with Google"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleSubmitRegisterForm(onSubmitRegister)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...registerRegisterForm("email", {
                        required: "Email is required",
                      })}
                    />
                    {registerErrors.email && (
                      <p className="text-red-600 text-sm">
                        {registerErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerRegisterForm("password", {
                        required: "Password is required",
                      })}
                    />
                    {registerErrors.password && (
                      <p className="text-red-600 text-sm">
                        {registerErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...registerRegisterForm("confirmPassword", {
                        required: "Confirm Password is required",
                      })}
                    />
                    {registerErrors.confirmPassword && (
                      <p className="text-red-600 text-sm">
                        {registerErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Continue with Google"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

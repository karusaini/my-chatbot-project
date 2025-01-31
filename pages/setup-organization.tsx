"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2 } from "lucide-react";

interface CompanyFormInputs {
  userName: string;
  companyName: string;
  companyUrl: string;
  companyDescription: string;
}

const CompanyFormPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Check if user is logged in and fetch metadata
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      } else {
        if (user.user_metadata?.company_name) {
          router.push("/dashboard");
        }
      }
    };

    checkAuth();
  }, [router]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormInputs>();

  // Handle form submission
  const onSubmit: SubmitHandler<CompanyFormInputs> = async (data) => {
    setLoading(true);

    setTimeout(async () => {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.userName,
          company_name: data.companyName,
          company_url: data.companyUrl,
          company_description: data.companyDescription,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Company details saved successfully!",
          variant: "default",
        });
        router.push("/dashboard");
      }

      setLoading(false);
    }, 7000); // 7-second delay
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 px-6 sm:px-6">
      <Card className="w-full max-w-md p-3 sm:p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Company Details
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!loading ? (
              <>
                <div>
                  <Label htmlFor="userName">User Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    {...register("userName", {
                      required: "User name is required",
                    })}
                  />
                  {errors.userName && (
                    <p className="text-red-600 text-sm">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    {...register("companyName", {
                      required: "Company name is required",
                    })}
                  />
                  {errors.companyName && (
                    <p className="text-red-600 text-sm">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="companyUrl">Company URL</Label>
                  <Input
                    id="companyUrl"
                    type="url"
                    placeholder="Enter company website URL"
                    {...register("companyUrl", {
                      required: "Company URL is required",
                    })}
                  />
                  {errors.companyUrl && (
                    <p className="text-red-600 text-sm">
                      {errors.companyUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="companyDescription">
                    Company Description
                  </Label>
                  <Input
                    id="companyDescription"
                    placeholder="Enter company description"
                    {...register("companyDescription", {
                      required: "Company description is required",
                    })}
                  />
                  {errors.companyDescription && (
                    <p className="text-red-600 text-sm">
                      {errors.companyDescription.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <DotLottieReact
                  src="https://lottie.host/09b42976-86fd-4e21-9dac-c52636ac563c/nQ3O2JoV6l.lottie"
                  loop
                  autoplay
                />
                <div className="!mb-1 !mt-0 text-[16px] font-semibold text-center">
                  Fetching website content...
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Save Details"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyFormPage;

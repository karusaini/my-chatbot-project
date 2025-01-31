"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import axios from "axios";

const DashboardPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [openIntegrateDialog, setOpenIntegrateDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for checking integration
  const [checkResult, setCheckResult] = useState<null | boolean>(null); // To store check result

  // Fetch user metadata on load
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      } else {
        setUser(user);
        setUserMetadata(user.user_metadata); // Set metadata directly from the user object
      }
    };

    checkAuth();
  }, [router]);

  if (!userMetadata) return <div>Loading...</div>;

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have successfully signed out.",
      variant: "default",
    });
    router.push("/auth"); // Redirect to the auth page after sign-out
  };

  // Generate iframe code
  const iframeCode = (user: any) => `
        <iframe id="${user.id}" src="http://localhost:3000/chatbot"
          width="100%" height="100%"
          style="border: none; position: fixed; bottom: 20px; right: 20px; z-index: 9999;"
        ></iframe>
      `;

  const handleCopy = async () => {
    navigator.clipboard.writeText(iframeCode(user)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleTestIntegration = async () => {
    setLoading(true);
    setCheckResult(null); // Reset check result before testing

    const url = userMetadata.company_url;
    const id = user?.id as string;

    const result = await axios.post("/api/chatbot/test-integration", {
      url,
      id,
    });
    setCheckResult(result.data?.success);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h1 className="text-2xl font-semibold mb-4">
            Hey {userMetadata.name}!
          </h1>

          {/* Company Info */}
          <div className="space-y-2 mb-6">
            <div>
              <strong>Company Name:</strong> {userMetadata.company_name}
            </div>
            <div>
              <strong>Company URL:</strong>{" "}
              <a href={userMetadata.company_url} className="text-blue-500">
                {userMetadata.company_url}
              </a>
            </div>
            <div>
              <strong>Description:</strong> {userMetadata.company_description}
            </div>
          </div>

          {/* Short Description */}
          <p className="mb-6 text-gray-700">
            Welcome to your dashboard! Here you can manage your chatbot
            integrations and test them. Get started by testing the chatbot or
            integrating it with your website.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Chatbot Tested",
                  description: "Chatbot test was successful",
                  variant: "default",
                })
              }
            >
              Test Chatbot
            </Button>

            <Dialog
              open={openIntegrateDialog}
              onOpenChange={setOpenIntegrateDialog}
            >
              <DialogTrigger asChild>
                <Button className="w-full">Integrate Chatbot</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Integrate Chatbot</DialogHeader>
                <p>Follow the steps below to integrate the chatbot widget:</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <strong>Step 1:</strong> Copy the embedded code below.
                  </div>
                  <div className="flex items-center space-x-4">
                    <textarea
                      readOnly
                      value={iframeCode(user)}
                      rows={4}
                      className="w-full p-2 border rounded-md"
                    />
                    <Button onClick={handleCopy} disabled={isCopied}>
                      {isCopied ? "Copied!" : "Copy Code"}
                    </Button>
                  </div>
                  <div>
                    <strong>Step 2:</strong> Paste the code into your site's
                    HTML, or wherever the iframe should be placed.
                  </div>
                  <div>
                    <strong>Step 3:</strong> Done! The chatbot widget should
                    appear on your site.
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenIntegrateDialog(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openTestDialog} onOpenChange={setOpenTestDialog}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={handleTestIntegration}>
                  Test Integration
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Test Integration</DialogHeader>

                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin border-4 border-t-4 border-blue-500 w-10 h-10 rounded-full"></div>
                  </div>
                ) : checkResult === null ? (
                  <p>
                    Click "Test Integration" to start checking your integration.
                  </p>
                ) : checkResult ? (
                  <div>
                    <p className="text-green-500">
                      Integration is detected successfully!
                    </p>
                    <p>Your chatbot is now live on your site. Enjoy!</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-500">Integration is not detected!</p>
                    <p>Here are some troubleshooting steps:</p>
                    <ul className="list-disc pl-5">
                      <li>
                        Ensure the iframe code is placed correctly in your
                        site's HTML.
                      </li>
                      <li>
                        Make sure the chatbot iframe ID matches the user ID.
                      </li>
                      <li>
                        Check if there are any errors in the browser console.
                      </li>
                    </ul>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenTestDialog(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              className="ml-32"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

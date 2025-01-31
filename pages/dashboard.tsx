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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti"; // Import Confetti
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Social media icons

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
  const [confettiTriggered, setConfettiTriggered] = useState(false); // To control confetti trigger
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []); // Runs only once, on the client side

  useEffect(() => {
    if (!openTestDialog) {
      setLoading(false);
      setCheckResult(null);
    }
  }, [openTestDialog]);

  // Generate embed code
  const embedCode = (user: User | null) => `<script
  src="https://talkbot-ai-new.vercel.app/chatbot-widget.js"
  data-chatbot-id="${user?.id}"
  data-company-name="${user?.user_metadata?.company_name}"
  data-company-description="${user?.user_metadata?.company_description}"> 
</script>
`;

  const handleCopy = async () => {
    navigator.clipboard.writeText(embedCode(user)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleTestIntegration = async () => {
    setLoading(true);
    setCheckResult(null); // Reset check result before testing

    const url = userMetadata.company_url;
    const chatbotId = user?.id as string;

    const result = await axios.post("/api/chatbot/test-integration", {
      url,
      chatbotId,
    });
    setCheckResult(result.data?.success);
    setLoading(false);

    if (result.data?.success) {
      setConfettiTriggered(true); // Trigger the confetti effect once
    }
  };

  if (!userMetadata) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 px-10 sm:px-6  ">
      {/* Confetti Fullscreen with z-index styling */}
      {checkResult == true &&
        windowDimensions.width &&
        windowDimensions.height && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            numberOfPieces={700} // Limit to 100 pieces
            recycle={false} // Make it show only once
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 9999, // Ensure it's above other elements
            }}
          />
        )}

      <Card className="w-full max-w-md p-3 sm:p-6 shadow-md relative z-10  ">
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
            {/* Test Chatbot Button as a Link */}
            <Link href={userMetadata.company_url} target="_blank" passHref>
              <Button className="w-full" variant="outline">
                Test Chatbot
              </Button>
            </Link>

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
                      value={embedCode(user)}
                      rows={4}
                      className="w-full p-2 border rounded-md"
                    />
                    <Button onClick={handleCopy} disabled={isCopied}>
                      {isCopied ? "Copied!" : "Copy Code"}
                    </Button>
                  </div>
                  <div>
                    <strong>Step 2:</strong> Paste the code into your site's
                    HTML, or wherever the embed should be placed.
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
                    <Loader2 className="animate-spin mr-2" />
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
                    {/* New Buttons after Successful Integration */}
                    <div className=" flex gap-4 space-4 mt-4">
                      <Link href="/admin" passHref>
                        <Button className="w-fit">Explore Admin Panel</Button>
                      </Link>
                      <Link
                        href={userMetadata.company_url}
                        target="_blank"
                        passHref
                      >
                        <Button variant="outline" className=" w-fit">
                          Start talking to your chatbot
                        </Button>
                      </Link>
                    </div>

                    {/* Social Media Icons inside Success View */}
                    <div className="mt-6 flex space-x-4 justify-start">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        className="text-blue-600"
                      >
                        <FaFacebook size={24} />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        className="text-blue-400"
                      >
                        <FaTwitter size={24} />
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        className="text-blue-700"
                      >
                        <FaLinkedin size={24} />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        className="text-pink-600"
                      >
                        <FaInstagram size={24} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-500">Integration is not detected!</p>
                    <p>Here are some troubleshooting steps:</p>
                    <ul className="list-disc pl-5">
                      <li>
                        Ensure the embed code is placed correctly in your site's
                        HTML.
                      </li>
                      <li>
                        Make sure the chatbot embed ID matches the user ID.
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

            <Link href="/sign-out">
              <Button variant="destructive" className="ml-32 mt-4">
                Sign Out
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

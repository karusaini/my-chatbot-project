import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import supabase from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

const EmbedCodePage = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const user = await supabase.auth.getUser();
    setUser(user.data.user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

  async function checkElementExists(
    url: string,
    elementId: string
  ): Promise<boolean> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch the page");

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      return !!doc.getElementById(elementId);
    } catch (error) {
      console.error("Error checking element:", error);
      return false;
    }
  }

  const handleCheck = async () => {
    let url = "http://127.0.0.1:5500/index.html";
    let id = user?.id as string;

    let resp = await checkElementExists(url, id);
    console.log(resp);
    alert(resp);
  };

  if (!!!user) {
    return <>loading...</>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Embed Chatbot Widget</h2>
      <p className="mb-4">
        Copy the code below and paste it into your website to add the chatbot:
      </p>
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

        <Button onClick={handleCheck}>Check</Button>
      </div>
    </div>
  );
};

export default EmbedCodePage;

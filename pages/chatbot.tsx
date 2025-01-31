import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { X } from "lucide-react"; // Close icon

const ChatbotPage = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = () => {
    alert(`Feedback submitted: ${feedback}`);
    setFeedback("");
  };

  return (
    <div className="relative">
      {/* Feedback Banner */}
      <div className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 text-center">
        <span>We'd love your feedback!</span>
        <Button
          variant="outline"
          size="sm"
          className="ml-4"
          onClick={() => setIsChatVisible(true)}
        >
          Give Feedback
        </Button>
      </div>

      {/* Chatbot Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsChatVisible(true)}
          className="rounded-full p-4 bg-blue-600 text-white shadow-lg"
        >
          <span className="text-xl">💬</span>
        </Button>
      </div>

      {/* Chatbot Modal */}
      {isChatVisible && (
        <div className="fixed bottom-4 right-4 w-80 p-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl">Chat with us</h3>
            <button onClick={() => setIsChatVisible(false)}>
              <X />
            </button>
          </div>
          <div className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardContent>
                  <p>Hi! How can I assist you today?</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-4">
            <Input
              placeholder="Type your message..."
              className="w-full"
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button className="w-full mt-2" onClick={handleFeedbackSubmit}>
              Send Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url('/background.jpg')] flex items-center justify-center p-8">
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-white/40"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center gap-12 items-center max-w-7xl w-full p-8 bg-white/80 rounded-2xl">
        {/* Text Content */}
        <div className="flex flex-1 flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            AI-Powered Chatbot Builder for Company Data
          </h1>
          <div className="flex md:hidden justify-center ">
            <Image
              src="/chatbot.jpg"
              alt="AI Chatbot Illustration"
              width={400} // Medium size
              height={250} // Adjust height proportionally
              className="rounded-2xl  border-2 transform hover:scale-105 transition duration-500 ease-in-out"
            />
          </div>
          <p className="text-md sm:text-sm text-gray-600 leading-relaxed text-center">
            Transform your company information and website content into an
            intelligent AI chatbot with our powerful platform. Simply provide
            your company details and webpage links, and let our system
            automatically extract pages and data to build a fully functional,
            context-aware chatbot. Deliver exceptional customer interactions,
            automate responses, and enhance user engagement effortlessly.
            Perfect for businesses seeking smarter communication solutions
            without the hassle of manual training.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-6 mt-8">
            <Link href="/auth">
              <Button
                size="lg"
                className="text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 w-full sm:w-auto"
              >
                Login / Register
              </Button>
            </Link>
            <Link
              href="https://github.com/karusaini/my-chatbot-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="text-black border-black hover:bg-black hover:text-white transition duration-300 ease-in-out px-8 py-3 rounded-lg w-full sm:w-auto"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hidden md:flex flex-1 justify-center ">
          <Image
            src="/chatbot.jpg"
            alt="AI Chatbot Illustration"
            width={400} // Medium size
            height={250} // Adjust height proportionally
            className="rounded-2xl hover:shadow-xl transform hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-[60px] h-screen w-screen flex flex-col items-center justify-center gap-[12px] text-center">
      <h1 className="text-[2.5rem] font-bold">
        AI-Powered Chatbot Builder for Company Data
      </h1>
      <p className="text-[1.3rem]">
        Transform your company information and website content into an
        intelligent AI chatbot with our powerful platform. Simply provide your
        company details and webpage links, and let our system automatically
        extract pages and data to build a fully functional, context-aware
        chatbot. Deliver exceptional customer interactions, automate responses,
        and enhance user engagement effortlessly. Perfect for businesses seeking
        smarter communication solutions without the hassle of manual training.
      </p>
      <Link href="/auth">
        <Button size="lg" className="mt-[20px]">
          Login / Register
        </Button>
      </Link>
    </div>
  );
}

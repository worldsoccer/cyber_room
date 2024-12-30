import type { Metadata } from "next";
// import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QuizProvider } from "@/context/quiz_context";

// const fontNotoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "サイバー大学勉強部屋",
  description: "サイバー大学の勉強をするサイトです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`bg-background antialiased min-h-screen`}>
        <QuizProvider>{children}</QuizProvider>
        <Toaster />
      </body>
    </html>
  );
}

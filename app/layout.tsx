import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 14 Meta Threads Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
      }
      signUpFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
      }
    >
      <html lang='en'>
        <body className={inter.className}>
          <main className='flex flex-row'>
            <Topbar />
            <LeftSidebar />
            <section className='main-container'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}

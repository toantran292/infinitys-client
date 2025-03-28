import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProviderWrapper } from "@/providers/query-client";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ChatProvider } from "@/contexts/ChatContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col overflow-x-hidden`}
      >
        <QueryClientProviderWrapper>
          <AuthProvider>
            <NotificationProvider>
              <ChatProvider>
                <main className="flex-1 relative">{children}</main>
              </ChatProvider>
              <Toaster richColors closeButton />
            </NotificationProvider>
          </AuthProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}

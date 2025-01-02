import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import { CommandPalette } from "@/components/command-palette.";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${GeistSans.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          {children}
          {/* <CommandPalette /> */}
        </SidebarProvider>
      </body>
    </html>
  );
}

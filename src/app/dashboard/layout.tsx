"use client";

import { SessionProvider } from "next-auth/react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body >
                <SessionProvider>
                    <SidebarProvider defaultOpen={false}>
                        <AppSidebar />
                        {children}
                    </SidebarProvider>
                </SessionProvider>
            </body>
        </html>
    );
}

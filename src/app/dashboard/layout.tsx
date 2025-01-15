"use client";

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation'
import { useEffect } from "react";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("session", session, status);
    }, [session, status]);

    if (status === "loading") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated") {
        redirect(`/login`)
    }

    return (
        <html lang="en">
            <body>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    {children}
                </SidebarProvider>
            </body>
        </html>
    );
}

"use client"

import Image from "next/image";

import { useAuthLayoutStore } from "@/stores/authLayoutStore";

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { title, subtitle, illustration } = useAuthLayoutStore();
    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="relative hidden items-center justify-center bg-primary p-10 md:flex">
                <Image
                    src={illustration || "/placeholder.svg?height=400&width=400"}
                    alt="Authentication illustration"
                    width={400}
                    height={400}
                    className="relative z-10"
                    priority
                />
                <div className="absolute inset-0 bg-primary" />
            </div>
            <div className="flex items-center justify-center p-4">
                <div className="mx-auto flex w-[400px] flex-col justify-center space-y-4 sm:w-[350px]">
                    <div className="flex flex-col text-left">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {subtitle && <span className="text-sm text-primary">{subtitle}</span>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}


"use client"

import { useEffect } from "react";

import LoginForm from '@/components/auth/LoginForm';
import { useAuthLayoutStore } from "@/stores/authLayoutStore";

export default function LoginPage() {
    const { setTitle, setSubtitle, setIllustration } = useAuthLayoutStore();
    useEffect(() => {
        setTitle("Login");
        setSubtitle("Sign in to your account");
        setIllustration("/login-illustration.svg");
    }, [setTitle, setSubtitle, setIllustration]);

    return (
        <div className="w-full mx-auto">
            <LoginForm />
        </div>
    );
}

"use client"

import { useEffect } from 'react';

import RegisterForm from '@/components/auth/RegisterForm';
import { useAuthLayoutStore } from '@/stores/authLayoutStore';

export default function RegisterPage() {
    const { setTitle, setSubtitle, setIllustration } = useAuthLayoutStore();
    useEffect(() => {
        setTitle("Register");
        setSubtitle("Create a new account");
        setIllustration("/register-illustration.svg");
    }, [setTitle, setSubtitle, setIllustration]);
    return (
        <div className="w-full mx-auto">
            <RegisterForm />
        </div>
    );
}

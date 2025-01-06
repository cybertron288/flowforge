// components/auth/LoginForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type LoginFormInputs = {
    email: string;
    password: string;
};

const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .nonempty('Email is required'),
    password: z
        .string()
        .nonempty('Password is required')
        .min(8, 'Password must be at least 8 characters')
});

export default function LoginForm() {
    const form = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (data: LoginFormInputs) => {
        setError('');

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        console.log("result", result)

        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = () => {
        // Handle Google OAuth logic
        console.log('Google Sign-In triggered');
    };

    const handleGitHubSignIn = async () => {
        // Handle GitHub OAuth logic
        const result = await signIn('github', { callbackUrl: `/dashboard` });

        console.log("result", result)

        console.log('GitHub Sign-In triggered');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter email"
                                type="email"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)} />

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Enter password"
                                type="password"

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)} />

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full mt-4 ">
                    Login
                </Button>
            </form>
            <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300" />
                <p className="px-2 text-gray-500 text-sm">OR</p>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex gap-2">

                <Button
                    variant="outline"
                    className="w-full mb-2 flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                >
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
                    Sign in with Google
                </Button>

                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGitHubSignIn}
                >
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                    Sign in with GitHub
                </Button>
            </div>
        </Form>
    );
}
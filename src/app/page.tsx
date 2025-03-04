'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormInputs) => {
    setError('');

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false, // Handle errors manually
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Redirect to the dashboard or desired page
      window.location.href = '/dashboard';
    }
  };

  return (
    <>
      <h1>Home</h1>
    </>

  );
}

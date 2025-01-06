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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="p-2 border rounded w-full"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="p-2 border rounded w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded"
      >
        Login
      </button>
    </form>
  );
}

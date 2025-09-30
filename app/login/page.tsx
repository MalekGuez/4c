"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/AuthContext';
import PageLoginForm from '../components/LoginForm/PageLoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSwitchToRegister = () => {
    router.push('/register');
  };

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageLoginForm onSwitchToRegister={handleSwitchToRegister} />
    </div>
  );
}

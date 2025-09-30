"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/AuthContext';
import PageRegisterForm from '../components/RegisterForm/PageRegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageRegisterForm onSwitchToLogin={handleSwitchToLogin} />
    </div>
  );
}

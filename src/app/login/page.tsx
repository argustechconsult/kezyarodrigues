'use client';

import LoginPage from '../../components/LoginPage';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { login, isAuthenticated } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    login();
    router.push('/admin');
  };

  return <LoginPage onLogin={handleLogin} />;
}

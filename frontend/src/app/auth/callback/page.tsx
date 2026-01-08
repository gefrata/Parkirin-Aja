'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Login Google gagal');
      router.push('/login');
      return;
    }

    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/`;

    toast.success('Login Google berhasil');
    router.push('/dashboard');
  }, [token]);

  return null;
}

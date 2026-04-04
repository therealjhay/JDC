'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAdmin() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      router.push('/admin/login');
    }
  }, [router]);
}

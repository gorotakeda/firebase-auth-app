'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { logout } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Container } from '@/components/layout/Container';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, authenticated, refreshAuth } = useAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/');
    }
  }, [loading, authenticated, router]);

  const handleLogout = async () => {
    await logout();
    await signOut(auth);
    await refreshAuth();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  const initial = (user.display_name || user.email)?.[0]?.toUpperCase() || '?';

  return (
    <Container>
      <div className="text-center mb-8">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt="Avatar"
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {initial}
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800">
          {user.display_name || 'ユーザー'}
        </h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ようこそ!
      </h1>

      <p className="text-center text-gray-600 mb-6">
        ログインに成功しました。
      </p>

      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">ユーザー情報</h3>
        <p className="text-gray-600 text-sm mb-2">
          <strong>ID:</strong> {user.id.substring(0, 20)}...
        </p>
      </div>

      <Button variant="logout" onClick={handleLogout}>
        ログアウト
      </Button>
    </Container>
  );
}

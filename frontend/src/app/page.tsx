'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase';
import { loginWithToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';
import { Container } from '@/components/layout/Container';

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません';
    case 'auth/wrong-password':
      return 'パスワードが正しくありません';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/invalid-credential':
      return 'メールアドレスまたはパスワードが正しくありません';
    case 'auth/too-many-requests':
      return 'ログイン試行回数が多すぎます。しばらく待ってからお試しください';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます';
    default:
      return 'ログインに失敗しました';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { authenticated, loading: authLoading, refreshAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.push('/dashboard');
    }
  }, [authenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const result = await loginWithToken(idToken);
      await refreshAuth();
      router.push(result.redirect_url);
    } catch (err: unknown) {
      setLoading(false);
      const firebaseError = err as { code?: string };
      setError(getErrorMessage(firebaseError.code || ''));
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const result = await loginWithToken(idToken);
      await refreshAuth();
      router.push(result.redirect_url);
    } catch (err: unknown) {
      setLoading(false);
      const firebaseError = err as { code?: string };
      setError(getErrorMessage(firebaseError.code || ''));
    }
  };

  if (authLoading) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        ログイン
      </h1>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div className="text-center py-5">
          <Spinner />
          <p className="mt-2 text-gray-600">認証中...</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              type="email"
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
            <Input
              type="password"
              label="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
            />
            <Button type="submit" variant="primary">
              ログイン
            </Button>
          </form>

          <div className="relative my-5 text-center">
            <span className="bg-white px-4 text-gray-400 relative z-10">または</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          <Button variant="secondary" onClick={handleRegister}>
            新規登録
          </Button>
        </>
      )}
    </Container>
  );
}

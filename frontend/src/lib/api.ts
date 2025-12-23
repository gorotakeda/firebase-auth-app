const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginResponse {
  status: string;
  message: string;
  redirect_url: string;
}

interface UserResponse {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    display_name: string | null;
    photo_url: string | null;
  };
}

export async function loginWithToken(idToken: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'ログインに失敗しました');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });
  return response.json();
}

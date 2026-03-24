import { useAuthStore } from '@/src/features/auth/store/authstore';
import { env } from '../config/env';

const BASE_URL = env.API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Agar already refresh chal raha hai toh same promise return karo
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      if (!refreshToken) {
        logout();
        return null;
      }

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh bhi fail ho gaya — logout karo
        logout();
        return null;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Store mein naya token save karo
      setTokens(newAccessToken, refreshToken);
      return newAccessToken;
    } catch {
      useAuthStore.getState().logout();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core Request ─────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  retry = true,
): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      finalHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 401 aaya — token refresh karo aur retry karo
  if (response.status === 401 && auth && retry) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new ApiError(401, 'Session expired. Please login again.');
    }
    // Naye token ke saath retry karo (retry=false taaki infinite loop na ho)
    return request<T>(endpoint, options, false);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.log('❌ API ERROR BODY:', JSON.stringify(err, null, 2)); // ← add karo
    throw new ApiError(response.status, err.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// ─── API Client ───────────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: 'POST', body }),
  patch: <T>(endpoint: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: 'PATCH', body }),
  delete: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: 'DELETE' }),
};

export { ApiError };

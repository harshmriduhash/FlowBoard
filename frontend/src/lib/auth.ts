export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user?: { id: string; email: string; role: string; workspaceId: string };
};

const KEY = 'flowboard_auth';

export function loadAuth(): AuthState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { accessToken: null, refreshToken: null };
  try {
    return JSON.parse(raw);
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

export function saveAuth(state: AuthState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

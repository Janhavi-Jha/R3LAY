export interface UserProfile {
  id: number;
  cognitoSub: string;
  email: string;
  name: string;
  role: string;
  assignedCoaches: string;
  employeeId: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = "r3lay_cognito_auth_session";

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }
    return session;
  } catch (e) {
    console.error("Failed to parse auth session", e);
    return null;
  }
}

export function getAuthToken(): string | null {
  const session = getAuthSession();
  return session?.token || null;
}

export function getStoredUser(): UserProfile | null {
  const session = getAuthSession();
  return session?.user || null;
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null;
}

export function setAuthSession(token: string, user: UserProfile, expiresInSeconds: number = 3600): void {
  if (typeof window === "undefined") return;
  const session: AuthSession = {
    token,
    user,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  // also sync in localStorage for tab persistence
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

import { useCallback, useEffect, useState } from "react";

const REGISTER_EMAIL_KEY = "registerEmail";
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

type StoredPayload = {
  email?: string;
  ts?: number;
};

export interface UseRegisterEmailOptions {
  /**
   * TTL in milliseconds for the stored email. Defaults to 24 hours.
   */
  ttl?: number;
}

/**
 * Hook to manage the temporary register-email in sessionStorage.
 *
 * - Keeps sessionStorage and local state in sync.
 * - Applies TTL expiration.
 * - Safe around environments without sessionStorage.
 */
export function useLocalStorageEmail(options?: UseRegisterEmailOptions) {
  const ttl = options?.ttl ?? DEFAULT_TTL;
  const [email, setEmail] = useState<string | undefined>(() => {
    try {
      const raw = sessionStorage.getItem(REGISTER_EMAIL_KEY);
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as StoredPayload | null;
      if (!parsed || !parsed.email) return undefined;
      const ts = typeof parsed.ts === "number" ? parsed.ts : 0;
      if (ts && Date.now() - ts > ttl) {
        // expired — remove and return undefined
        try {
          sessionStorage.removeItem(REGISTER_EMAIL_KEY);
        } catch {
          /* ignore */
        }
        return undefined;
      }
      return parsed.email;
    } catch {
      return undefined;
    }
  });

  const readFromStorage = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(REGISTER_EMAIL_KEY);
      if (!raw) {
        setEmail(undefined);
        return undefined;
      }
      const parsed = JSON.parse(raw) as StoredPayload | null;
      if (!parsed || !parsed.email) {
        setEmail(undefined);
        return undefined;
      }
      const ts = typeof parsed.ts === "number" ? parsed.ts : 0;
      if (ts && Date.now() - ts > ttl) {
        // expired
        try {
          sessionStorage.removeItem(REGISTER_EMAIL_KEY);
        } catch {
          /* ignore */
        }
        setEmail(undefined);
        return undefined;
      }
      setEmail(parsed.email);
      return parsed.email;
    } catch {
      setEmail(undefined);
      return undefined;
    }
  }, [ttl]);

  const setRegisterEmail = useCallback((value?: string | null) => {
    try {
      if (!value) {
        sessionStorage.removeItem(REGISTER_EMAIL_KEY);
        setEmail(undefined);
        return;
      }
      const payload: StoredPayload = { email: String(value), ts: Date.now() };
      sessionStorage.setItem(REGISTER_EMAIL_KEY, JSON.stringify(payload));
      setEmail(payload.email);
    } catch {
      // ignore (e.g. storage disabled), but still update state
      setEmail(value ?? undefined);
    }
  }, []);

  const clearRegisterEmail = useCallback(() => {
    try {
      sessionStorage.removeItem(REGISTER_EMAIL_KEY);
    } catch {
      // ignore
    }
    setEmail(undefined);
  }, []);

  // keep state in sync with storage if storage changes in another tab
  useEffect(() => {
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key !== REGISTER_EMAIL_KEY) return;
      readFromStorage();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [readFromStorage]);

  // expose current value and helpers
  return {
    email,
    setRegisterEmail,
    clearRegisterEmail,
    readFromStorage,
  } as const;
}

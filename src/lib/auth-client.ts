"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  userType?: string;
  businessName?: string;
  phoneNumber?: string;
  isVerified?: boolean;
}

interface AuthError {
  code?: string;
  message?: string;
}

interface AuthResponse<T> {
  data?: T;
  error?: AuthError;
}

// Auth client for client-side authentication
export const authClient = {
  signUp: {
    email: async ({ email, password, name, userType }: { email: string; password: string; name: string; userType?: string }): Promise<AuthResponse<{ user: User; session: { token: string } }>> => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, userType }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { code: data.code, message: data.error } };
        }

        return { data: data.data };
      } catch (error) {
        return { error: { message: "Network error" } };
      }
    },
  },

  signIn: {
    email: async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }): Promise<AuthResponse<{ user: User; session: { token: string } }>> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { code: data.code, message: data.error } };
        }

        return { data: data.data };
      } catch (error) {
        return { error: { message: "Network error" } };
      }
    },

    social: async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) => {
      // Not implemented for simple auth
      throw new Error("Social login not implemented");
    },
  },

  signOut: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  getSession: async (): Promise<AuthResponse<{ user: User }>> => {
    try {
      const response = await fetch("/api/auth/me");
      
      if (!response.ok) {
        return { data: undefined };
      }

      const data = await response.json();
      return { data: data.data };
    } catch (error) {
      return { data: undefined };
    }
  },
};

// useSession hook for client-side session management
export function useSession() {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    setIsPending(true);
    try {
      const { data } = await authClient.getSession();
      setSession(data || null);
      setError(null);
    } catch (err) {
      setError(err);
      setSession(null);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data: session, isPending, error, refetch };
}

// useAuth hook for auth operations
export function useAuth() {
  const { data: session, isPending, refetch } = useSession();

  const logout = async () => {
    await authClient.signOut();
  };

  return {
    user: session?.user || null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    logout,
    refetch,
  };
}

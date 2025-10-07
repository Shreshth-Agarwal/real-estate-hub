"use client";
import { useEffect, useState } from "react";

export const authClient = {
  getSession: async () => ({ data: null })
};

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);

  const refetch = () => {
    setSession(null);
  };

  useEffect(() => {
    setSession(null);
  }, []);

  return { data: session, isPending, error, refetch };
}
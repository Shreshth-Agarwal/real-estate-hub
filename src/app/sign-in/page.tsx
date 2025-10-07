"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError?.code) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1rem",
      background: "linear-gradient(to bottom right, #F5F5DC, #000000)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
        background: "#FFFEF0",
        border: "2px solid #D4AF37",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "0.5rem",
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "#666666", fontSize: "0.95rem" }}>
            Sign in to your Hub4Estate account
          </p>
        </div>

        {error && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#000000",
              marginBottom: "0.5rem",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "2px solid #D4AF37",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none",
                background: "#FFFFFF",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#000000",
              marginBottom: "0.5rem",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                border: "2px solid #D4AF37",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none",
                background: "#FFFFFF",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: isLoading ? "#9B8B5B" : "#D4AF37",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#C19B2F";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.background = "#D4AF37";
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.875rem",
          color: "#666666",
        }}>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/sign-up")}
            style={{
              background: "none",
              border: "none",
              color: "#D4AF37",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

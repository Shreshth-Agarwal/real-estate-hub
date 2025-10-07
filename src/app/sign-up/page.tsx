"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"consumer" | "provider" | "">("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate user type selection
    if (!userType) {
      setError("Please select your account type");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        name,
        password,
        userType,
      });

      if (authError?.code) {
        if (authError.code === "USER_ALREADY_EXISTS") {
          setError("This email is already registered");
        } else {
          setError("Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Redirect based on user type
      const redirectPath = userType === "provider" ? "/provider/dashboard" : "/dashboard";
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);
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
      background: "linear-gradient(to bottom right, #F6F1E6, #0B0B0B)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        padding: "2.5rem",
        background: "#F6F1E6",
        border: "2px solid #D4AF37",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#0B0B0B",
            marginBottom: "0.5rem",
          }}>
            Create Account
          </h1>
          <p style={{ color: "#666666", fontSize: "0.95rem" }}>
            Join Hub4Estate and transform your real-estate journey
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

        {/* Role Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#0B0B0B",
            marginBottom: "0.75rem",
          }}>
            Select Your Account Type
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setUserType("consumer")}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "1rem",
                border: userType === "consumer" ? "2px solid #D4AF37" : "2px solid #E5E5E5",
                backgroundColor: userType === "consumer" ? "#D4AF37" : "#FFFFFF",
                color: userType === "consumer" ? "#0B0B0B" : "#666666",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                I'm a Consumer
              </div>
              <div style={{ fontSize: "0.75rem" }}>
                Home Builder/Buyer
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("provider")}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "1rem",
                border: userType === "provider" ? "2px solid #D4AF37" : "2px solid #E5E5E5",
                backgroundColor: userType === "provider" ? "#D4AF37" : "#FFFFFF",
                color: userType === "provider" ? "#0B0B0B" : "#666666",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                I'm a Provider
              </div>
              <div style={{ fontSize: "0.75rem" }}>
                Business/Professional
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0B0B0B",
              marginBottom: "0.5rem",
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="John Doe"
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

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0B0B0B",
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

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0B0B0B",
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
            <p style={{ fontSize: "0.75rem", color: "#666666", marginTop: "0.25rem" }}>
              Must be at least 8 characters
            </p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0B0B0B",
              marginBottom: "0.5rem",
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={isLoading || !userType}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: (isLoading || !userType) ? "#9B8B5B" : "#D4AF37",
              color: "#0B0B0B",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: (isLoading || !userType) ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && userType) e.currentTarget.style.background = "#C19B2F";
            }}
            onMouseLeave={(e) => {
              if (!isLoading && userType) e.currentTarget.style.background = "#D4AF37";
            }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.875rem",
          color: "#666666",
        }}>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/sign-in")}
            style={{
              background: "none",
              border: "none",
              color: "#D4AF37",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
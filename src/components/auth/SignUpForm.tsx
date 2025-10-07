"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams?.get("error");
  const roleParam = searchParams?.get("role"); // Get role from URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("📝 [SIGN-UP] Email sign-up initiated:", {
      email,
      name,
      timestamp: new Date().toISOString(),
    });

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (error?.code) {
        console.error("❌ [SIGN-UP ERROR]:", {
          errorCode: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        });

        if (error.code === "USER_ALREADY_EXISTS") {
          toast.error("This email is already registered");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      console.log("✅ [SIGN-UP SUCCESS] Account created:", {
        userId: data?.user?.id,
        email: data?.user?.email,
        timestamp: new Date().toISOString(),
      });

      toast.success("Account created successfully!");

      // Auto sign in after registration
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        console.error("❌ [AUTO SIGN-IN ERROR]:", {
          error: signInError,
          timestamp: new Date().toISOString(),
        });
        toast.info("Please sign in with your new account");
        router.push("/sign-in");
        return;
      }

      console.log("🎯 [REDIRECT] Redirecting to onboarding");
      // Pass role to onboarding if specified
      const onboardingUrl = roleParam ? `/onboarding?role=${roleParam}` : "/onboarding";
      router.push(onboardingUrl);
      router.refresh();
    } catch (err) {
      console.error("❌ [SIGN-UP ERROR] Unexpected error:", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    
    console.log("🔐 [GOOGLE OAUTH] Initiating Google sign-up:", {
      timestamp: new Date().toISOString(),
      redirectURL: "/onboarding",
    });

    try {
      // Pass role to callback URL
      const callbackURL = roleParam ? `/onboarding?role=${roleParam}` : "/onboarding";
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      
      console.log("🔄 [GOOGLE OAUTH] Redirecting to Google consent screen");
    } catch (err) {
      console.error("❌ [GOOGLE OAUTH ERROR]:", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      toast.error("Google sign-up failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md space-y-6 bg-card border border-border rounded-2xl p-8 shadow-xl"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Join Hub4Estate and transform your real-estate journey
        </p>
      </div>

      {oauthError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {oauthError === "no_code" && "OAuth authorization failed. Please try again."}
            {oauthError === "session_failed" && "Failed to create session. Please try again."}
            {oauthError === "oauth_failed" && "OAuth authentication failed. Please try again."}
            {!["no_code", "session_failed", "oauth_failed"].includes(oauthError) && oauthError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleSignUp}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Google...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Google
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="px-0"
          onClick={() => router.push("/sign-in")}
          disabled={isLoading || isGoogleLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  );
}
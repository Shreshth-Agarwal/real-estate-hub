"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function Hero() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const token = localStorage.getItem("bearer_token");
      fetch(`/api/users/${session.user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user_type) {
            setUserType(data.user_type);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const handleGetStarted = () => {
    if (session?.user) {
      // Redirect based on user type
      if (userType === "provider") {
        router.push("/provider/dashboard");
      } else if (userType === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-up");
    }
  };

  const handleListBusiness = () => {
    if (session?.user) {
      // If already logged in, redirect to provider dashboard or setup
      if (userType === "provider") {
        router.push("/provider/dashboard");
      } else {
        // Redirect to provider setup if not a provider yet
        router.push("/provider/setup");
      }
    } else {
      router.push("/sign-up?role=provider");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>India's #1 Real Estate Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              One place for{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                every real-estate need
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              Verified professionals • Searchable catalogs • Instant quotes • Project workspace • Policy AI
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleListBusiness}
                className="w-full sm:w-auto text-base px-8 py-6 border-2 hover:bg-accent"
              >
                <Store className="mr-2 w-5 h-5" />
                List Your Business
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 pt-8"
            >
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Active Buyers</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                  <div>
                    <div className="font-semibold">Premium Tiles</div>
                    <div className="text-sm text-muted-foreground">₹45/sqft</div>
                  </div>
                </div>
                <div className="h-32 bg-muted rounded-lg" />
                <Button className="w-full">Request Quote</Button>
              </motion.div>

              {/* Secondary card */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-0 left-0 w-72 bg-card border border-border rounded-2xl shadow-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Project Budget</span>
                  <span className="text-primary font-bold">₹12.5L</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Materials</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-primary to-purple-500" />
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
              >
                ✓ KYC Verified
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
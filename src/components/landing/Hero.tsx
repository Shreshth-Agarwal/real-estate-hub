"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useRef } from "react";

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [userType, setUserType] = useState<string | null>(null);
  
  const session: { user?: any } | null = null;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const handleGetStarted = () => {
    if (session?.user) {
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
      if (userType === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/provider/setup");
      }
    } else {
      router.push("/sign-up?role=provider");
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"
        style={{ opacity }}
      />
      
      {/* Floating Orbs */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{ y: y3, scale }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 z-10"
        ref={ref}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/15 to-purple-500/15 border border-primary/20 rounded-full text-sm font-medium backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-semibold">
                India's Most Trusted Real Estate Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight"
            >
              One place for{" "}
              <motion.span
                className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                every real-estate need
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground/90 max-w-2xl leading-relaxed"
            >
              Connect with verified professionals, browse searchable catalogs, get instant quotes, and manage projects — all powered by AI
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="group relative overflow-hidden w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-primary via-primary/90 to-purple-600 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleListBusiness}
                className="w-full sm:w-auto text-lg px-10 py-7 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-all duration-300"
              >
                <Store className="mr-2 w-5 h-5" />
                List Your Business
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-8 pt-8"
            >
              {[
                { value: "50K+", label: "Active Users", icon: TrendingUp },
                { value: "10K+", label: "Products", icon: Zap },
                { value: "98%", label: "Trust Score", icon: Shield },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[700px]">
              {/* Main catalog card */}
              <motion.div
                style={{ y: y1 }}
                animate={floatingAnimation}
                className="absolute top-0 right-0 w-80 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-6 space-y-4 hover:shadow-primary/20 transition-all duration-500"
                whileHover={{ scale: 1.05, rotateZ: 2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Premium Tiles</div>
                    <div className="text-sm text-primary font-semibold">₹45/sqft</div>
                  </div>
                </div>
                <motion.div 
                  className="h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                <Button className="w-full text-base py-6 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/50 transition-all">
                  Request Quote Instantly
                </Button>
              </motion.div>

              {/* Project budget card */}
              <motion.div
                style={{ y: y2 }}
                animate={{ y: [0, 25, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-10 left-0 w-80 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-6 space-y-4 hover:shadow-purple-500/20 transition-all duration-500"
                whileHover={{ scale: 1.05, rotateZ: -2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Project Budget</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    ₹12.5L
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Materials & Labor</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={inView ? { width: "68%" } : {}}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Escrow Protected</span>
                </div>
              </motion.div>

              {/* Verified badge */}
              <motion.div
                animate={{ 
                  rotate: [0, 8, 0, -8, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-xl shadow-green-500/50 text-base font-bold flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                KYC Verified
              </motion.div>

              {/* Floating AI assistant indicator */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Powered
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

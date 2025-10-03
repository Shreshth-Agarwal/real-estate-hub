"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const features = [
    "Verified professionals",
    "Searchable catalogs",
    "Instant quotes",
    "Project workspace",
    "Policy AI",
  ];

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0.1, 0]) }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)]"
        />
        {/* Parallax watermark */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          className="absolute inset-0 flex items-center justify-center opacity-[0.03]"
        >
          <div className="text-[20vw] font-bold">H4E</div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
      >
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Trusted by 10,000+ real estate professionals
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
          >
            <span className="block">One place for every</span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              real-estate need
            </span>
          </motion.h1>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm md:text-base text-muted-foreground max-w-3xl mx-auto"
          >
            {features.map((feature, index) => (
              <div key={feature} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{feature}</span>
                {index < features.length - 1 && (
                  <span className="hidden md:inline ml-2 text-border">•</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 border-2 hover:bg-accent"
            >
              List Your Shop
            </Button>
          </motion.div>

          {/* Tilted Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-12 md:pt-20"
          >
            <div className="relative max-w-4xl mx-auto">
              <div
                className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
                style={{ transform: "perspective(1000px) rotateX(5deg)" }}
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-muted via-background to-accent/20">
                  <div className="p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-foreground/10 rounded" />
                        <div className="h-3 w-48 bg-foreground/5 rounded" />
                      </div>
                      <div className="w-16 h-16 rounded-xl bg-primary/10" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square rounded-lg bg-foreground/5" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-primary via-accent to-primary" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
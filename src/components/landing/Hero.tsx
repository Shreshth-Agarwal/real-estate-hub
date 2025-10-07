"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const orbVariants = {
    animate: (custom: number) => ({
      y: [0, -30, 0],
      x: [0, custom * 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.4, 0.6, 0.4],
      transition: {
        duration: 6 + custom * 0.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <section 
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '5rem',
        background: `linear-gradient(135deg, ${royalColors.beige} 0%, #E8DCC8 100%)`,
      }}
    >
      {/* Floating Animated Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={orbVariants}
            animate="animate"
            style={{
              position: 'absolute',
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              width: `${80 + i * 20}px`,
              height: `${80 + i * 20}px`,
              borderRadius: '50%',
              background: i % 2 === 0 
                ? `radial-gradient(circle, ${royalColors.gold}30, ${royalColors.gold}10)` 
                : `radial-gradient(circle, ${royalColors.black}20, ${royalColors.black}05)`,
              filter: 'blur(40px)',
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Parallax Background Shapes */}
      <motion.div 
        style={{ 
          position: 'absolute',
          inset: 0,
          y,
          opacity,
        }}
      >
        <div style={{ 
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${royalColors.gold}15, transparent 70%)`,
          filter: 'blur(60px)',
        }} />
        <div style={{ 
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${royalColors.black}10, transparent 70%)`,
          filter: 'blur(80px)',
        }} />
      </motion.div>

      <motion.div
        ref={contentRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ 
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: `${royalColors.gold}15`,
              border: `1px solid ${royalColors.gold}40`,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles style={{ width: '1rem', height: '1rem', color: royalColors.gold }} />
            </motion.div>
            <span style={{ color: royalColors.gold, fontWeight: '600' }}>
              India's Most Trusted Real Estate Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 'bold',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: royalColors.black,
            }}
          >
            One place for{" "}
            <motion.span 
              style={{
                display: 'block',
                background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.black})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              every real-estate need
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              color: `${royalColors.black}cc`,
              maxWidth: '42rem',
              lineHeight: '1.6',
            }}
          >
            Connect with verified professionals, browse searchable catalogs, get instant quotes, and manage projects — all powered by AI
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              paddingTop: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <motion.button
              onClick={() => router.push('/sign-up')}
              whileHover={{ scale: 1.05, boxShadow: `0 10px 30px ${royalColors.gold}40` }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'relative',
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: royalColors.white,
                background: royalColors.gold,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Get Started Free</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>
            <motion.button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ 
                scale: 1.05, 
                borderColor: royalColors.gold,
                backgroundColor: `${royalColors.gold}10`,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: royalColors.black,
                background: 'transparent',
                border: `2px solid ${royalColors.gold}60`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              paddingTop: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { value: "50K+", label: "Active Users" },
              { value: "10K+", label: "Products" },
              { value: "98%", label: "Trust Score" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ 
                  delay: 0.8 + i * 0.1, 
                  duration: 0.5,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  style={{ 
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                    fontWeight: 'bold', 
                    color: royalColors.black,
                    marginBottom: '0.25rem',
                  }}
                  animate={{ 
                    textShadow: [
                      `0 0 0px ${royalColors.gold}00`,
                      `0 0 20px ${royalColors.gold}40`,
                      `0 0 0px ${royalColors.gold}00`,
                    ],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.5 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div style={{ fontSize: '0.875rem', color: `${royalColors.black}80` }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: '24px',
            height: '40px',
            border: `2px solid ${royalColors.gold}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '6px',
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '4px',
              height: '8px',
              background: royalColors.gold,
              borderRadius: '2px',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

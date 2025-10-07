"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function CTASection() {
  const router = useRouter();

  return (
    <section style={{
      padding: '6rem 0',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}dd)`,
    }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '30rem',
          height: '30rem',
          background: `radial-gradient(circle, ${royalColors.white}20, transparent)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '30rem',
          height: '30rem',
          background: `radial-gradient(circle, ${royalColors.white}15, transparent)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: `${royalColors.white}20`,
            border: `1px solid ${royalColors.white}30`,
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '2rem',
            color: royalColors.white,
          }}
        >
          <Sparkles style={{ width: '1rem', height: '1rem' }} />
          <span>Start Your Journey Today</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: royalColors.white,
            lineHeight: '1.2',
          }}
        >
          Ready to transform your{" "}
          <span style={{ display: 'block' }}>
            real estate experience?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: `${royalColors.white}dd`,
            maxWidth: '42rem',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
          }}
        >
          Join thousands of users who are already streamlining their real estate projects with Hub4Estate
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="cta-buttons"
        >
          <button
            onClick={() => router.push('/sign-up')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              color: royalColors.gold,
              background: royalColors.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>Get Started for Free</span>
            <ArrowRight size={20} />
          </button>
          <p style={{
            fontSize: '0.875rem',
            color: `${royalColors.white}cc`,
          }}>
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .cta-buttons {
          flex-direction: column;
        }
        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }
      `}</style>
    </section>
  );
}

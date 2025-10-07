"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, CheckCircle, Rocket } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description: "Browse verified catalogs or post your requirements",
      delay: 0.1,
    },
    {
      icon: MessageSquare,
      title: "Request Quotes",
      description: "Get comparable quotes from multiple verified providers",
      delay: 0.2,
    },
    {
      icon: CheckCircle,
      title: "Compare & Choose",
      description: "Review options side-by-side and select the best fit",
      delay: 0.3,
    },
    {
      icon: Rocket,
      title: "Track & Deliver",
      description: "Manage everything in your project workspace",
      delay: 0.4,
    },
  ];

  return (
    <section 
      id="how-it-works"
      style={{
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
        background: royalColors.beige,
      }}
    >
      <div style={{ 
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at bottom, ${royalColors.gold}05, transparent)`,
      }} />
      
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: royalColors.black,
          }}>
            How it <span style={{ color: royalColors.gold }}>works</span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: `${royalColors.black}cc`,
            maxWidth: '42rem',
            margin: '0 auto',
          }}>
            From search to delivery in four simple steps
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          position: 'relative',
        }}>
          <div className="connecting-line" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2rem',
                height: '2rem',
                background: royalColors.gold,
                color: royalColors.white,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                zIndex: 10,
              }}>
                {index + 1}
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  position: 'relative',
                  marginBottom: '1.5rem',
                  marginTop: '1rem',
                }}
              >
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '1rem',
                  background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}cc)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <step.icon style={{ width: '2.5rem', height: '2.5rem', color: royalColors.white }} />
                </div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}cc)`,
                  filter: 'blur(24px)',
                  opacity: 0.2,
                  zIndex: -1,
                }} />
              </motion.div>

              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: royalColors.black,
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: `${royalColors.black}cc`,
                lineHeight: '1.5',
              }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .connecting-line {
          display: none;
        }
        @media (min-width: 768px) {
          .connecting-line {
            display: block;
            position: absolute;
            top: 4rem;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(to right, ${royalColors.gold}40, ${royalColors.gold}80, ${royalColors.gold}40);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Shield, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function FeaturesShowcase() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find materials across 10,000+ products instantly",
    },
    {
      icon: Shield,
      title: "Verified Pros",
      description: "KYC-verified professionals with trust scores",
    },
    {
      icon: Zap,
      title: "Instant Quotes",
      description: "Get comparable quotes in minutes, not days",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Ask anything about policies, processes, or materials",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track project progress and budget in real-time",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work with your team in shared workspaces",
    },
    {
      icon: FileText,
      title: "Smart Docs",
      description: "Store and organize all project documents",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "10+ hours saved every week on coordination",
    },
    {
      icon: CheckCircle2,
      title: "Quality Assured",
      description: "Ratings and reviews from real customers",
    },
  ];

  return (
    <section 
      id="features"
      style={{
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
        background: royalColors.white,
      }}
    >
      <div style={{ 
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at top, ${royalColors.gold}05, transparent)`,
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
            Everything you need in{" "}
            <span style={{
              background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.black})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              one platform
            </span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: `${royalColors.black}cc`,
            maxWidth: '42rem',
            margin: '0 auto',
          }}>
            Powerful features designed to make real estate transactions seamless
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              style={{
                position: 'relative',
                background: royalColors.beige,
                border: `1px solid ${royalColors.gold}20`,
                borderRadius: '1rem',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${royalColors.gold}60`;
                target.style.boxShadow = `0 8px 24px ${royalColors.gold}15`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.borderColor = `${royalColors.gold}20`;
                target.style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}cc)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <feature.icon style={{ width: '1.5rem', height: '1.5rem', color: royalColors.white }} />
                </div>
              </div>
              
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: royalColors.black,
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: `${royalColors.black}cc`,
                lineHeight: '1.5',
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

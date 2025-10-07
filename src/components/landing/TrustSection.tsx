"use client";

import { Shield, Star, CheckCircle, FileCheck, Trophy, Award } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
  gray: '#6B7280',
};

export default function TrustSection() {
  const stats = [
    { 
      value: "100%", 
      label: "KYC Verified",
      icon: Shield,
      description: "Every provider undergoes strict verification"
    },
    { 
      value: "50K+", 
      label: "Rated & Reviewed",
      icon: Star,
      description: "Real reviews from verified customers"
    },
    { 
      value: "Live", 
      label: "Trust Score",
      icon: Trophy,
      description: "Real-time trust scoring system"
    },
    { 
      value: "Secure", 
      label: "Documented",
      icon: FileCheck,
      description: "All transactions are documented"
    },
  ];

  const trustBadges = [
    { icon: "🔒", label: "SSL Secured" },
    { icon: "✅", label: "ISO Certified" },
    { icon: "🏆", label: "Industry Leader" },
    { icon: "🛡️", label: "Data Protected" },
    { icon: "📱", label: "Mobile Secure" },
    { icon: "🎖️", label: "Award Winning" },
  ];

  return (
    <section 
      style={{
        padding: '5rem 0',
        background: `linear-gradient(135deg, ${royalColors.beige}, ${royalColors.white})`,
        position: 'relative',
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #0B0B0B 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 1.5rem',
        position: 'relative',
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: royalColors.black,
          }}>
            Built on <span style={{ color: royalColors.gold }}>trust & transparency</span>
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: `${royalColors.black}cc`,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Every provider is verified. Every transaction is secure. Every review is real.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: royalColors.white,
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: `1px solid ${royalColors.gold}20`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = royalColors.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = `${royalColors.gold}20`;
              }}
            >
              <div style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1rem',
                borderRadius: '1rem',
                background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  color: royalColors.white,
                }} />
              </div>
              
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: royalColors.black,
                marginBottom: '0.5rem',
              }}>
                {stat.value}
              </div>
              
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: royalColors.black,
                marginBottom: '0.75rem',
              }}>
                {stat.label}
              </div>
              
              <p style={{
                fontSize: '0.875rem',
                color: royalColors.gray,
                lineHeight: '1.5',
              }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div style={{
          background: royalColors.white,
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: `1px solid ${royalColors.gold}10`,
        }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: royalColors.black,
            marginBottom: '2rem',
          }}>
            Our Security & Certifications
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1.5rem',
          }}>
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: royalColors.beige,
                  borderRadius: '0.75rem',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: royalColors.black,
                }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: royalColors.black,
            marginBottom: '1.5rem',
          }}>
            Join thousands of verified professionals building trust every day
          </p>
          <button
            style={{
              padding: '0.875rem 2rem',
              background: royalColors.gold,
              color: royalColors.white,
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Shield style={{ width: '1.25rem', height: '1.25rem' }} />
            Get Verified Today
          </button>
        </div>
      </div>
    </section>
  );
}
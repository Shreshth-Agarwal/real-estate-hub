"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check, Trophy } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

export default function Hero() {
  const router = useRouter();

  const features = [
    "Verified professionals",
    "Searchable catalogs",
    "Instant quotes",
    "Project workspace",
    "Policy AI"
  ];

  return (
    <section 
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        background: `linear-gradient(135deg, ${royalColors.beige} 0%, #F8F3E8 50%, ${royalColors.beige} 100%)`,
      }}
    >
      {/* Simple decorative circles */}
      <div style={{ 
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${royalColors.gold}10, transparent 70%)`,
      }} />
      <div style={{ 
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${royalColors.gold}08, transparent 70%)`,
      }} />

      <div style={{ 
        position: 'relative',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        zIndex: 10,
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          alignItems: 'center', 
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Trust Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              background: royalColors.white,
              border: `1px solid ${royalColors.gold}40`,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <Trophy style={{ width: '1rem', height: '1rem', color: royalColors.gold }} />
            <span style={{ color: royalColors.black }}>
              Trusted by 10,000+ real estate professionals
            </span>
          </div>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              fontWeight: 'bold',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: royalColors.black,
              marginBottom: '1rem',
            }}
          >
            One place for every
            <span 
              style={{
                display: 'block',
                color: royalColors.gold,
                marginTop: '0.5rem',
              }}
            >
              real-estate need
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            color: `${royalColors.black}cc`,
            maxWidth: '650px',
            lineHeight: '1.5',
            marginBottom: '1rem',
          }}>
            From materials to professionals, quotes to project management—all in one intelligent platform
          </p>

          {/* Feature Points */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: royalColors.white,
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  color: royalColors.black,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <Check style={{ width: '1rem', height: '1rem', color: royalColors.gold }} />
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '1rem',
          }}>
            <button
              onClick={() => router.push('/sign-up')}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: royalColors.white,
                background: royalColors.black,
                border: 'none',
                borderRadius: '0.5rem',
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
              Get Started
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            
            <button
              onClick={() => router.push('/provider/setup')}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: royalColors.black,
                background: 'transparent',
                border: `2px solid ${royalColors.black}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = royalColors.black;
                e.currentTarget.style.color = royalColors.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = royalColors.black;
              }}
            >
              List Your Shop
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${royalColors.gold}20`,
            width: '100%',
            maxWidth: '600px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: royalColors.black }}>10K+</div>
              <div style={{ fontSize: '0.875rem', color: `${royalColors.black}99` }}>Active Users</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: royalColors.black }}>50K+</div>
              <div style={{ fontSize: '0.875rem', color: `${royalColors.black}99` }}>Products Listed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: royalColors.black }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: `${royalColors.black}99` }}>Verified</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: royalColors.black }}>4.8★</div>
              <div style={{ fontSize: '0.875rem', color: `${royalColors.black}99` }}>User Rating</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          section {
            padding-top: 5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
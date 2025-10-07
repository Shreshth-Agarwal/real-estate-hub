"use client";

import { ArrowRight, Search, FileText, CheckSquare, Users, Store, Shield, TrendingUp, Award } from "lucide-react";
import { useRouter } from "next/navigation";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
  blue: '#2563EB',
  green: '#059669',
};

export default function DualJourneys() {
  const router = useRouter();

  const consumerSteps = [
    { icon: Search, label: "Search catalogs & professionals" },
    { icon: FileText, label: "Get instant quotes" },
    { icon: CheckSquare, label: "Compare & choose the best" },
    { icon: Users, label: "Collaborate in project workspace" },
  ];

  const providerSteps = [
    { icon: Store, label: "List your catalog" },
    { icon: Shield, label: "Get KYC verified" },
    { icon: TrendingUp, label: "Receive qualified RFQs" },
    { icon: Award, label: "Build trust & grow revenue" },
  ];

  return (
    <section 
      style={{
        padding: '5rem 0',
        background: royalColors.beige,
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: royalColors.black,
          }}>
            Built for every journey
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: `${royalColors.black}cc`,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Whether you're building your dream home or growing your business
          </p>
        </div>

        {/* Journey Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {/* Consumer Journey Card */}
          <div style={{
            background: royalColors.white,
            borderRadius: '1rem',
            padding: '2.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: `2px solid transparent`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = royalColors.blue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onClick={() => router.push('/sign-up')}>
            {/* Icon and Title */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                background: `linear-gradient(135deg, ${royalColors.blue}15, ${royalColors.blue}25)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Search style={{ width: '2rem', height: '2rem', color: royalColors.blue }} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: royalColors.black,
                marginBottom: '0.5rem',
              }}>
                Consumer Path
              </h3>
              <p style={{
                fontSize: '1rem',
                color: `${royalColors.black}99`,
                lineHeight: '1.5',
              }}>
                Find materials, get quotes, and manage your construction project
              </p>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {consumerSteps.map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    background: royalColors.beige,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <step.icon style={{ width: '1rem', height: '1rem', color: royalColors.blue }} />
                  </div>
                  <span style={{
                    fontSize: '0.95rem',
                    color: royalColors.black,
                  }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: '100%',
                padding: '0.875rem',
                background: royalColors.blue,
                color: royalColors.white,
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = royalColors.blue;
              }}
            >
              Start as Consumer
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>

          {/* Provider Journey Card */}
          <div style={{
            background: royalColors.white,
            borderRadius: '1rem',
            padding: '2.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: `2px solid transparent`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = royalColors.green;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onClick={() => router.push('/provider/setup')}>
            {/* Icon and Title */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                background: `linear-gradient(135deg, ${royalColors.green}15, ${royalColors.green}25)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Store style={{ width: '2rem', height: '2rem', color: royalColors.green }} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: royalColors.black,
                marginBottom: '0.5rem',
              }}>
                Provider Path
              </h3>
              <p style={{
                fontSize: '1rem',
                color: `${royalColors.black}99`,
                lineHeight: '1.5',
              }}>
                List products, get verified, and grow your business
              </p>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {providerSteps.map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    background: royalColors.beige,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <step.icon style={{ width: '1rem', height: '1rem', color: royalColors.green }} />
                  </div>
                  <span style={{
                    fontSize: '0.95rem',
                    color: royalColors.black,
                  }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: '100%',
                padding: '0.875rem',
                background: royalColors.green,
                color: royalColors.white,
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#047857';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = royalColors.green;
              }}
            >
              List Your Business
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
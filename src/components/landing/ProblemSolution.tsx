"use client";

import { X, Check, AlertCircle, CheckCircle } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
  red: '#DC2626',
  green: '#059669',
};

export default function ProblemSolution() {
  const oldWayProblems = [
    "Scattered WhatsApp groups",
    "Unreliable word-of-mouth contacts",
    "Lost quotes in email threads",
    "No price history or comparison"
  ];

  const newWaySolutions = [
    "One searchable catalog for all materials",
    "Verified professionals with trust badges",
    "Compare quotes side-by-side instantly",
    "Complete project workspace & history"
  ];

  return (
    <section 
      style={{
        padding: '5rem 0',
        background: royalColors.white,
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
            From chaos to clarity
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: `${royalColors.black}cc`,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Stop juggling WhatsApp chats, spreadsheets, and unreliable contacts
          </p>
        </div>

        {/* Comparison Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* The Old Way Card */}
          <div style={{
            background: '#FEF2F2',
            border: '2px solid #FCA5A5',
            borderRadius: '1rem',
            padding: '2rem',
            position: 'relative',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: royalColors.red,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: royalColors.white }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: royalColors.black,
              }}>
                The Old Way
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {oldWayProblems.map((problem, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <X style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    color: royalColors.red,
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }} />
                  <span style={{
                    fontSize: '1rem',
                    color: royalColors.black,
                    lineHeight: '1.5',
                  }}>
                    {problem}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative Element */}
            <div style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '-0.5rem',
              width: '4rem',
              height: '4rem',
              background: `radial-gradient(circle, ${royalColors.red}20, transparent 70%)`,
              borderRadius: '50%',
            }} />
          </div>

          {/* The Hub4Estate Way Card */}
          <div style={{
            background: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: '1rem',
            padding: '2rem',
            position: 'relative',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: royalColors.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: royalColors.white }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: royalColors.black,
              }}>
                The Hub4Estate Way
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {newWaySolutions.map((solution, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <Check style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    color: royalColors.green,
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }} />
                  <span style={{
                    fontSize: '1rem',
                    color: royalColors.black,
                    lineHeight: '1.5',
                  }}>
                    {solution}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative Element */}
            <div style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '-0.5rem',
              width: '4rem',
              height: '4rem',
              background: `radial-gradient(circle, ${royalColors.green}20, transparent 70%)`,
              borderRadius: '50%',
            }} />

            {/* Badge */}
            <div style={{
              position: 'absolute',
              bottom: '-0.75rem',
              right: '1rem',
              background: royalColors.gold,
              color: royalColors.white,
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              RECOMMENDED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
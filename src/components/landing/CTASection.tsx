"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
  gray: '#6B7280',
};

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section style={{
      padding: '5rem 0',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${royalColors.black}, ${royalColors.black}ee)`,
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-5rem',
        right: '-5rem',
        width: '20rem',
        height: '20rem',
        background: `radial-gradient(circle, ${royalColors.gold}20, transparent)`,
        borderRadius: '50%',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-5rem',
        left: '-5rem',
        width: '25rem',
        height: '25rem',
        background: `radial-gradient(circle, ${royalColors.gold}15, transparent)`,
        borderRadius: '50%',
      }} />

      <div style={{
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 1.5rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: royalColors.white,
          lineHeight: '1.2',
        }}>
          Ready to transform your
          <span style={{ 
            display: 'block',
            color: royalColors.gold,
            marginTop: '0.5rem',
          }}>
            real estate experience?
          </span>
        </h2>

        <p style={{
          fontSize: '1.125rem',
          color: `${royalColors.white}dd`,
          maxWidth: '600px',
          margin: '0 auto 3rem',
          lineHeight: '1.6',
        }}>
          Join 10,000+ professionals who trust Hub4Estate for their construction and real estate needs
        </p>

        {/* Email Signup Form */}
        <form 
          onSubmit={handleSubmit}
          style={{
            maxWidth: '500px',
            margin: '0 auto 2rem',
          }}
        >
          {!isSubmitted ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  flex: '1 1 300px',
                  position: 'relative',
                }}>
                  <Mail style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    color: royalColors.gray,
                  }} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="email-input"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      fontSize: '1rem',
                      border: `1px solid rgba(212, 175, 55, 0.19)`,
                      borderRadius: '0.5rem',
                      background: '#FFFFFF',
                      color: '#0B0B0B',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0.875rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: royalColors.black,
                    background: royalColors.gold,
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
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: `${royalColors.white}99`,
              }}>
                No credit card required • Free forever plan available
              </p>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              background: `${royalColors.gold}20`,
              borderRadius: '0.5rem',
              border: `1px solid ${royalColors.gold}40`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}>
                <Check style={{ 
                  width: '1.5rem', 
                  height: '1.5rem', 
                  color: royalColors.gold,
                }} />
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: royalColors.gold,
                }}>
                  Success!
                </span>
              </div>
              <p style={{
                fontSize: '1rem',
                color: royalColors.white,
              }}>
                Check your email for next steps
              </p>
            </div>
          )}
        </form>

        {/* Features list */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          paddingTop: '2rem',
          borderTop: `1px solid ${royalColors.gold}20`,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: royalColors.white,
          }}>
            <Check style={{ width: '1.25rem', height: '1.25rem', color: royalColors.gold }} />
            <span>Free Forever</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: royalColors.white,
          }}>
            <Check style={{ width: '1.25rem', height: '1.25rem', color: royalColors.gold }} />
            <span>No Credit Card</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: royalColors.white,
          }}>
            <Check style={{ width: '1.25rem', height: '1.25rem', color: royalColors.gold }} />
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .email-input:focus {
          border-color: #D4AF37 !important;
        }
      `}</style>
    </section>
  );
}
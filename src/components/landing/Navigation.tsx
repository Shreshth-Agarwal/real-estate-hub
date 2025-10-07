"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(246, 241, 230, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? `1px solid ${royalColors.gold}20` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}cc)`,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
            }}>
              <span style={{ color: royalColors.white, fontWeight: 'bold', fontSize: '1.25rem' }}>H</span>
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: royalColors.black }}>Hub4Estate</span>
          </Link>

          <div style={{ alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: royalColors.black,
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${royalColors.gold}15`}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
            <Link href="/sign-in" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '0.5rem 1.5rem',
                border: 'none',
                background: 'transparent',
                color: royalColors.black,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${royalColors.gold}15`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Sign In
              </button>
            </Link>
            <Link href="/sign-up" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '0.5rem 1.5rem',
                border: 'none',
                background: royalColors.gold,
                color: royalColors.white,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 134, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                Get Started
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'block',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: royalColors.black,
            }}
            className="mobile-menu-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              borderTop: `1px solid ${royalColors.gold}20`,
              background: royalColors.beige,
            }}
            className="mobile-menu"
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: royalColors.black,
                    textDecoration: 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={(e) => e.currentTarget.style.background = `${royalColors.gold}15`}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ 
                paddingTop: '1rem', 
                marginTop: '0.5rem',
                borderTop: `1px solid ${royalColors.gold}20`,
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem' 
              }}>
                <Link href="/sign-in" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    background: 'transparent',
                    color: royalColors.black,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    textAlign: 'left',
                  }}>
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    background: royalColors.gold,
                    color: royalColors.white,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}>
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .desktop-nav {
          display: none;
        }
        .mobile-menu-btn {
          display: block;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
          .mobile-menu-btn {
            display: none;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  );
}

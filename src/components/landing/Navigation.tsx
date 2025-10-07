"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/catalogs", label: "Catalogs" },
    { href: "/knowledge", label: "Knowledge Hub" },
    { href: "/provider/dashboard", label: "Providers" },
    { href: "/projects", label: "Projects" },
    { href: "/community", label: "Community" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: royalColors.white,
        borderBottom: `1px solid ${isScrolled ? '#e5e5e5' : 'transparent'}`,
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              background: royalColors.black,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: royalColors.white, fontWeight: 'bold', fontSize: '1.25rem' }}>H</span>
            </div>
            <span style={{ fontWeight: '600', fontSize: '1.25rem', color: royalColors.black }}>Hub4Estate</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: royalColors.black,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = royalColors.gold}
                onMouseLeave={(e) => e.currentTarget.style.color = royalColors.black}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
            <Link href="/sign-in" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '0.625rem 1.25rem',
                border: 'none',
                background: 'transparent',
                color: royalColors.black,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = royalColors.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = royalColors.black}
              >
                Sign In
              </button>
            </Link>
            <Link href="/sign-up" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '0.625rem 1.5rem',
                border: 'none',
                background: royalColors.black,
                color: royalColors.white,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
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
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'none',
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

      {isOpen && (
        <div
          style={{
            borderTop: '1px solid #e5e5e5',
            background: royalColors.white,
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
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'background 0.2s ease',
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div style={{ 
              paddingTop: '1rem', 
              marginTop: '0.5rem',
              borderTop: '1px solid #e5e5e5',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem' 
            }}>
              <Link href="/sign-in" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  background: 'transparent',
                  color: royalColors.black,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}>
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  background: royalColors.black,
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
        </div>
      )}

      <style jsx>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none !important;
        }
        .mobile-menu {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}
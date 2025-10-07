"use client";

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

export default function Footer() {
  const footerLinks = {
    Product: ["Features", "Catalog Search", "RFQ System", "AI Assistant"],
    "For Business": ["List Your Shop", "Become Provider", "KYC Verification", "Pricing Plans"],
    Resources: ["Blog", "Help Center", "Community", "API Documentation"],
    Company: ["About Us", "Contact", "Legal", "Privacy Policy"],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer style={{
      background: royalColors.black,
      color: royalColors.beige,
      borderTop: `1px solid ${royalColors.gold}20`,
      padding: '4rem 1.5rem 2rem',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: royalColors.gold,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: royalColors.white, fontWeight: 'bold', fontSize: '1.25rem' }}>H</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: royalColors.beige }}>Hub4Estate</span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: `${royalColors.beige}cc`,
              maxWidth: '20rem',
              lineHeight: '1.5',
            }}>
              One place for every real-estate need. Verified professionals, searchable catalogs, and instant quotes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: `${royalColors.beige}cc` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail style={{ width: '1rem', height: '1rem' }} />
                <span>support@hub4estate.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone style={{ width: '1rem', height: '1rem' }} />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.5rem',
                    background: `${royalColors.beige}15`,
                    border: `1px solid ${royalColors.beige}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: royalColors.beige,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label={social.label}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = royalColors.gold;
                    e.currentTarget.style.color = royalColors.white;
                    e.currentTarget.style.borderColor = royalColors.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${royalColors.beige}15`;
                    e.currentTarget.style.color = royalColors.beige;
                    e.currentTarget.style.borderColor = `${royalColors.beige}20`;
                  }}
                >
                  <social.icon style={{ width: '1rem', height: '1rem' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 style={{ 
                fontWeight: '600', 
                marginBottom: '1rem', 
                color: royalColors.gold,
                fontSize: '1rem',
              }}>
                {category}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.875rem',
                        color: `${royalColors.beige}cc`,
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = royalColors.gold;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = `${royalColors.beige}cc`;
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: `1px solid ${royalColors.gold}20`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: `${royalColors.beige}99`,
          }}>
            © {new Date().getFullYear()} Hub4Estate. All rights reserved.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            fontSize: '0.875rem',
          }}>
            <a href="#" style={{ 
              color: `${royalColors.beige}99`, 
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = royalColors.gold}
            onMouseLeave={(e) => e.currentTarget.style.color = `${royalColors.beige}99`}
            >
              Terms of Service
            </a>
            <a href="#" style={{ 
              color: `${royalColors.beige}99`, 
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = royalColors.gold}
            onMouseLeave={(e) => e.currentTarget.style.color = `${royalColors.beige}99`}
            >
              Privacy Policy
            </a>
            <a href="#" style={{ 
              color: `${royalColors.beige}99`, 
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = royalColors.gold}
            onMouseLeave={(e) => e.currentTarget.style.color = `${royalColors.beige}99`}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
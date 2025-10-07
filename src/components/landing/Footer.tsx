"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#B8860B',
  white: '#FFFFFF',
};

export default function Footer() {
  const footerLinks = {
    Product: ["Features", "Catalog Search", "RFQ System"],
    "For Business": ["List Your Shop", "Become Provider"],
    Resources: ["Blog", "Help Center", "Community"],
    Company: ["About Us", "Contact", "Legal"],
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: `linear-gradient(135deg, ${royalColors.gold}, ${royalColors.gold}cc)`,
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
                    background: royalColors.beige,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: royalColors.black,
                    textDecoration: 'none',
                  }}
                  aria-label={social.label}
                >
                  <social.icon style={{ width: '1rem', height: '1rem' }} />
                </a>
              ))}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: royalColors.gold }}>{category}</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.875rem',
                        color: `${royalColors.beige}cc`,
                        textDecoration: 'none',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: `1px solid ${royalColors.gold}20`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          color: `${royalColors.beige}cc`,
        }}>
          <div>
            © {new Date().getFullYear()} Hub4Estate. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

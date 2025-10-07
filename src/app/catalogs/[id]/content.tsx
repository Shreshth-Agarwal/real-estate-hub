"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, Package, FileText, Download, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CatalogItem {
  name: string;
  price: string;
  unit: string;
  stock: string;
}

interface Catalog {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  category: string | null;
  subCategory: string | null;
  images: string[];
  pdfUrl: string | null;
  items: CatalogItem[];
  isPublic: boolean;
  createdAt: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  userPhone: string | null;
}

export default function CatalogDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchCatalog();
    }
  }, [params.id]);

  const fetchCatalog = async () => {
    try {
      const response = await fetch(`/api/catalogs/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setCatalog(data.catalog);
      } else {
        console.error('Failed to fetch catalog:', data.error);
      }
    } catch (error) {
      console.error('Error fetching catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const royalTheme = {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    gold: '#F59E0B',
    background: '#F9FAFB',
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '3px solid #e5e7eb', 
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: royalTheme.background }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Package style={{ width: '64px', height: '64px', margin: '0 auto 24px', color: royalTheme.textLight }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: royalTheme.text, marginBottom: '8px' }}>
            Catalog Not Found
          </h2>
          <p style={{ color: royalTheme.textLight, marginBottom: '24px' }}>
            The catalog you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/catalogs" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: royalTheme.primary,
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500',
          }}>
            Browse Catalogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: royalTheme.background }}>
      <header style={{ borderBottom: `1px solid ${royalTheme.border}`, backgroundColor: royalTheme.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/catalogs" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px', color: royalTheme.primary, textDecoration: 'none' }}>
            <ArrowLeft style={{ marginRight: '8px', width: '16px', height: '16px' }} />
            Back to Catalogs
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {session?.user ? (
              <Link href="/dashboard" style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: royalTheme.text,
                border: `1px solid ${royalTheme.border}`,
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
              }}>
                Dashboard
              </Link>
            ) : (
              <Link href="/sign-in" style={{
                padding: '8px 16px',
                backgroundColor: royalTheme.primary,
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
              }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            {catalog.images && catalog.images.length > 0 ? (
              <div>
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '400px', 
                  backgroundColor: royalTheme.border, 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}>
                  <Image
                    src={catalog.images[selectedImage]}
                    alt={catalog.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {catalog.images.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                    {catalog.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '1',
                          border: selectedImage === index ? `2px solid ${royalTheme.primary}` : `1px solid ${royalTheme.border}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          padding: 0,
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${catalog.title} ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: royalTheme.border,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Package style={{ width: '64px', height: '64px', color: royalTheme.textLight }} />
              </div>
            )}
          </div>

          <div>
            <div style={{ backgroundColor: royalTheme.white, borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {catalog.category && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: `${royalTheme.primary}15`,
                  color: royalTheme.primary,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '16px',
                }}>
                  {catalog.category}
                  {catalog.subCategory && ` • ${catalog.subCategory}`}
                </span>
              )}
              
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: royalTheme.text, marginBottom: '16px', lineHeight: '1.2' }}>
                {catalog.title}
              </h1>
              
              {catalog.description && (
                <p style={{ fontSize: '16px', color: royalTheme.textLight, lineHeight: '1.6', marginBottom: '24px' }}>
                  {catalog.description}
                </p>
              )}

              {catalog.pdfUrl && (
                <a
                  href={catalog.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: royalTheme.white,
                    color: royalTheme.primary,
                    border: `1px solid ${royalTheme.primary}`,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '24px',
                  }}
                >
                  <FileText style={{ width: '18px', height: '18px' }} />
                  Download PDF Catalog
                </a>
              )}

              <div style={{ borderTop: `1px solid ${royalTheme.border}`, paddingTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: royalTheme.text, marginBottom: '16px' }}>
                  Contact Provider
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User style={{ width: '20px', height: '20px', color: royalTheme.textLight }} />
                    <span style={{ fontSize: '14px', color: royalTheme.text }}>{catalog.userName}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail style={{ width: '20px', height: '20px', color: royalTheme.textLight }} />
                    <a href={`mailto:${catalog.userEmail}`} style={{ fontSize: '14px', color: royalTheme.primary, textDecoration: 'none' }}>
                      {catalog.userEmail}
                    </a>
                  </div>
                  
                  {catalog.userPhone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Phone style={{ width: '20px', height: '20px', color: royalTheme.textLight }} />
                      <a href={`tel:${catalog.userPhone}`} style={{ fontSize: '14px', color: royalTheme.primary, textDecoration: 'none' }}>
                        {catalog.userPhone}
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => window.location.href = `mailto:${catalog.userEmail}?subject=Inquiry about ${catalog.title}`}
                  style={{
                    width: '100%',
                    marginTop: '24px',
                    padding: '12px 24px',
                    backgroundColor: royalTheme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Contact Provider
                </button>
              </div>
            </div>
          </div>
        </div>

        {catalog.items && catalog.items.length > 0 && (
          <div style={{ backgroundColor: royalTheme.white, borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: royalTheme.text, marginBottom: '24px' }}>
              Items in this Catalog
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${royalTheme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', fontWeight: '600', color: royalTheme.text }}>Item Name</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '14px', fontWeight: '600', color: royalTheme.text }}>Price</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontSize: '14px', fontWeight: '600', color: royalTheme.text }}>Unit</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontSize: '14px', fontWeight: '600', color: royalTheme.text }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${royalTheme.border}` }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: royalTheme.text }}>{item.name}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: royalTheme.text, textAlign: 'right', fontWeight: '500' }}>
                        {item.price ? `₹${parseFloat(item.price).toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: royalTheme.textLight, textAlign: 'center' }}>{item.unit}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: royalTheme.textLight, textAlign: 'center' }}>{item.stock || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Search, Filter, Package } from "lucide-react";
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
}

export default function CatalogsContent() {
  const { data: session } = useSession();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (category && category !== '') params.append("category", category);

      const response = await fetch(`/api/catalogs/list?${params.toString()}`);

      const data = await response.json();
      if (response.ok) {
        setCatalogs(data.catalogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchCatalogs();
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: royalTheme.background }}>
      <header style={{ borderBottom: `1px solid ${royalTheme.border}`, backgroundColor: royalTheme.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: royalTheme.text }}>Hub4Estate</h1>
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
              <>
                <Link href="/sign-in" style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: royalTheme.text,
                  textDecoration: 'none',
                  fontSize: '14px',
                }}>
                  Sign In
                </Link>
                <Link href="/sign-up" style={{
                  padding: '8px 16px',
                  backgroundColor: royalTheme.primary,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: royalTheme.text, marginBottom: '16px' }}>
            Discover Building Materials
          </h1>
          <p style={{ fontSize: '20px', color: royalTheme.textLight, marginBottom: '32px' }}>
            Browse catalogs from verified suppliers • Request quotes • Compare prices
          </p>

          <div style={{ maxWidth: '1024px', margin: '0 auto', backgroundColor: royalTheme.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: royalTheme.textLight }} />
                <input
                  type="text"
                  placeholder="Search for tiles, cement, fixtures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: `1px solid ${royalTheme.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: `1px solid ${royalTheme.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: royalTheme.white,
                  minWidth: '150px',
                }}
              >
                <option value="">All Categories</option>
                <option value="Materials">Materials</option>
                <option value="Services">Services</option>
                <option value="Equipment">Equipment</option>
                <option value="Labor">Labor</option>
                <option value="Design">Design</option>
              </select>

              <button
                onClick={handleSearch}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  backgroundColor: royalTheme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ backgroundColor: royalTheme.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '100%', height: '200px', backgroundColor: royalTheme.border, borderRadius: '8px', marginBottom: '16px' }}></div>
                <div style={{ width: '70%', height: '20px', backgroundColor: royalTheme.border, borderRadius: '4px', marginBottom: '8px' }}></div>
                <div style={{ width: '50%', height: '16px', backgroundColor: royalTheme.border, borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        ) : catalogs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {catalogs.map((catalog) => (
              <Link
                key={catalog.id}
                href={`/catalogs/${catalog.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: royalTheme.white,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                >
                  {catalog.images && catalog.images.length > 0 ? (
                    <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: royalTheme.border }}>
                      <Image
                        src={catalog.images[0]}
                        alt={catalog.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: royalTheme.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Package style={{ width: '48px', height: '48px', color: royalTheme.textLight }} />
                    </div>
                  )}
                  
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: 'auto' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: royalTheme.text, marginBottom: '8px', lineHeight: '1.4' }}>
                        {catalog.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: royalTheme.textLight, marginBottom: '12px', lineHeight: '1.5' }}>
                        {catalog.description ? (catalog.description.length > 100 ? catalog.description.substring(0, 100) + '...' : catalog.description) : 'No description'}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      {catalog.category && (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: `${royalTheme.primary}15`,
                          color: royalTheme.primary,
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          {catalog.category}
                        </span>
                      )}
                      {catalog.items && catalog.items.length > 0 && (
                        <span style={{ fontSize: '12px', color: royalTheme.textLight }}>
                          {catalog.items.length} item{catalog.items.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: royalTheme.white,
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <Package style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: royalTheme.textLight, opacity: 0.5 }} />
            <p style={{ fontSize: '18px', fontWeight: '500', color: royalTheme.text, marginBottom: '8px' }}>
              No catalogs found
            </p>
            <p style={{ fontSize: '14px', color: royalTheme.textLight }}>
              Try adjusting your search filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

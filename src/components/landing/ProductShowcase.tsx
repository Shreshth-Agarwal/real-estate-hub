"use client";

import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const royalColors = {
  beige: '#F6F1E6',
  black: '#0B0B0B',
  gold: '#D4AF37',
  white: '#FFFFFF',
  gray: '#6B7280',
};

export default function ProductShowcase() {
  const router = useRouter();

  const mockProducts = [
    {
      id: 1,
      name: "Wall Lights",
      price: "₹298",
      unit: "per piece",
      rating: 4.4,
      orders: "156",
      image: "🏮",
    },
    {
      id: 2,
      name: "Vitrified Tiles",
      price: "₹45",
      unit: "per sq ft",
      rating: 4.5,
      orders: "234",
      image: "🏢",
    },
    {
      id: 3,
      name: "Premium Cement",
      price: "₹385",
      unit: "per bag",
      rating: 4.8,
      orders: "512",
      image: "🧱",
    },
    {
      id: 4,
      name: "Steel TMT Bars",
      price: "₹58",
      unit: "per kg",
      rating: 4.7,
      orders: "423",
      image: "🏗️",
    },
    {
      id: 5,
      name: "Designer Faucets",
      price: "₹2,450",
      unit: "per piece",
      rating: 4.6,
      orders: "389",
      image: "🚿",
    },
    {
      id: 6,
      name: "Marble Flooring",
      price: "₹120",
      unit: "per sq ft",
      rating: 4.9,
      orders: "178",
      image: "💎",
    },
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
            Explore <span style={{ color: royalColors.gold }}>10,000+</span> products
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: `${royalColors.black}cc`,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            From tiles to cement, fixtures to steel—everything you need, verified and ready
          </p>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {mockProducts.map((product) => (
            <div
              key={product.id}
              style={{
                background: royalColors.white,
                border: `1px solid #e5e7eb`,
                borderRadius: '0.75rem',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = royalColors.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Product Image Area */}
              <div style={{
                height: '180px',
                background: `linear-gradient(135deg, ${royalColors.beige}, ${royalColors.beige}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: '4rem' }}>{product.image}</span>
                
                {/* Badge */}
                {parseInt(product.orders) > 400 && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: royalColors.gold,
                    color: royalColors.white,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}>
                    POPULAR
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: royalColors.black,
                  marginBottom: '0.5rem',
                }}>
                  {product.name}
                </h3>

                {/* Price */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.25rem',
                  marginBottom: '0.75rem',
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: royalColors.black,
                  }}>
                    {product.price}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    color: royalColors.gray,
                  }}>
                    {product.unit}
                  </span>
                </div>

                {/* Rating and Orders */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: `1px solid #f3f4f6`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}>
                    <Star style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      color: royalColors.gold,
                      fill: royalColors.gold,
                    }} />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: royalColors.black,
                    }}>
                      {product.rating}
                    </span>
                  </div>
                  
                  <span style={{
                    fontSize: '0.875rem',
                    color: royalColors.gray,
                  }}>
                    {product.orders} orders
                  </span>
                </div>

                {/* Quick Action Button */}
                <button
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.625rem',
                    background: royalColors.beige,
                    color: royalColors.black,
                    border: `1px solid ${royalColors.gold}30`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = royalColors.gold;
                    e.currentTarget.style.color = royalColors.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = royalColors.beige;
                    e.currentTarget.style.color = royalColors.black;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ShoppingCart style={{ width: '1rem', height: '1rem' }} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Browse Catalog Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => router.push('/catalogs')}
            style={{
              padding: '1rem 2.5rem',
              background: royalColors.black,
              color: royalColors.white,
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '600',
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
            Browse Full Catalog
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      </div>
    </section>
  );
}
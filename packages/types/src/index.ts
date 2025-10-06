import { z } from "zod";

// ============================================
// Shared Types for Hub4Estate Split Platform
// ============================================

// User Types
export const UserRole = z.enum(["consumer", "provider", "admin"]);
export type UserRole = z.infer<typeof UserRole>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  user_type: UserRole,
  avatar_url: z.string().url().optional(),
  locale: z.string().default("en"),
  created_at: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// Provider Profile Types
export const KYCStatus = z.enum(["pending", "verified", "rejected"]);
export type KYCStatus = z.infer<typeof KYCStatus>;

export const ProviderProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  shop_name: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  categories: z.array(z.string()),
  brands: z.array(z.string()),
  logo_url: z.string().url().optional(),
  kyc_status: KYCStatus,
  trust_score: z.number().int().min(0).max(100),
  description: z.string().optional(),
  gallery: z.array(z.string().url()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ProviderProfile = z.infer<typeof ProviderProfileSchema>;

// Catalog Types
export const StockStatus = z.enum(["in", "out", "limited"]);
export type StockStatus = z.infer<typeof StockStatus>;

export const CatalogSchema = z.object({
  id: z.string(),
  provider_id: z.string(),
  title: z.string(),
  brand: z.string(),
  sku: z.string().optional(),
  description: z.string(),
  price: z.number(),
  currency: z.string().default("INR"),
  unit: z.string(),
  moq: z.number().int().positive(),
  stock_status: StockStatus,
  attributes: z.record(z.any()),
  city: z.string(),
  delivery_radius_km: z.number().int().positive(),
  images: z.array(z.string().url()),
  pdf_url: z.string().url().optional(),
  popularity_score: z.number().int().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Catalog = z.infer<typeof CatalogSchema>;

// RFQ Types
export const RFQStatus = z.enum([
  "draft",
  "submitted",
  "responded",
  "accepted",
  "rejected",
  "expired",
]);
export type RFQStatus = z.infer<typeof RFQStatus>;

export const RFQRequestSchema = z.object({
  id: z.string(),
  catalog_id: z.string().optional(),
  consumer_id: z.string(),
  provider_id: z.string().optional(),
  quantity: z.number(),
  unit: z.string(),
  message: z.string(),
  preferred_date: z.string().datetime().optional(),
  status: RFQStatus,
  created_at: z.string().datetime(),
});
export type RFQRequest = z.infer<typeof RFQRequestSchema>;

// Quote Types
export const QuoteStatus = z.enum(["pending", "accepted", "rejected"]);
export type QuoteStatus = z.infer<typeof QuoteStatus>;

export const QuoteSchema = z.object({
  id: z.string(),
  rfq_id: z.string(),
  provider_id: z.string(),
  price: z.number(),
  currency: z.string().default("INR"),
  delivery_eta_days: z.number().int().positive(),
  notes: z.string().optional(),
  status: QuoteStatus,
  created_at: z.string().datetime(),
});
export type Quote = z.infer<typeof QuoteSchema>;

// API Response Types
export const ApiSuccessResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    timestamp: z.string().datetime(),
  });

export const ApiErrorResponse = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  timestamp: z.string().datetime(),
});

export type ApiError = z.infer<typeof ApiErrorResponse>;

// Environment Configuration Types
export interface AppEnvironment {
  APP_NAME: string;
  APP_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_AUD: string;
  COOKIE_NAME: string;
  COOKIE_DOMAIN: string;
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

// Platform Identifier
export type Platform = "user" | "business" | "admin";

// Cross-Platform SSO Token
export const AdminSSOTokenSchema = z.object({
  token: z.string(),
  aud: z.literal("admin-bridge"),
  scope: z.literal("admin:cross-app"),
  expires_at: z.number(),
  original_platform: z.enum(["user", "business"]),
  user_id: z.string(),
});
export type AdminSSOToken = z.infer<typeof AdminSSOTokenSchema>;
import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';

// Users table - core user management
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  userType: text('user_type').notNull().default('consumer'), // 'consumer', 'provider', 'admin'
  avatarUrl: text('avatar_url'),
  locale: text('locale').notNull().default('en'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Provider profiles table
export const profilesProvider = sqliteTable('profiles_provider', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  shopName: text('shop_name').notNull(),
  phone: text('phone'),
  address: text('address'),
  lat: real('lat'),
  lng: real('lng'),
  categories: text('categories', { mode: 'json' }), // text array as JSON
  brands: text('brands', { mode: 'json' }), // text array as JSON
  logoUrl: text('logo_url'),
  kycStatus: text('kyc_status').notNull().default('pending'), // 'pending', 'verified', 'rejected'
  trustScore: integer('trust_score').notNull().default(0),
  description: text('description'),
  gallery: text('gallery', { mode: 'json' }), // text array as JSON
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Catalogs table - product/service listings
export const catalogs = sqliteTable('catalogs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  providerId: integer('provider_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  brand: text('brand'),
  sku: text('sku'),
  description: text('description'),
  price: real('price').notNull(),
  currency: text('currency').notNull().default('INR'),
  unit: text('unit').notNull(),
  moq: integer('moq').notNull(), // minimum order quantity
  stockStatus: text('stock_status').notNull().default('in_stock'), // 'in_stock', 'out_of_stock', 'limited'
  attributes: text('attributes', { mode: 'json' }), // jsonb equivalent
  city: text('city').notNull(),
  deliveryRadiusKm: integer('delivery_radius_km'),
  images: text('images', { mode: 'json' }), // text array as JSON
  pdfUrl: text('pdf_url'),
  popularityScore: integer('popularity_score').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Catalog price history table
export const catalogPriceHistory = sqliteTable('catalog_price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  catalogId: integer('catalog_id').references(() => catalogs.id).notNull(),
  price: real('price').notNull(),
  currency: text('currency').notNull(),
  effectiveAt: text('effective_at').notNull(),
});

// RFQ requests table
export const rfqRequests = sqliteTable('rfq_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  catalogId: integer('catalog_id').references(() => catalogs.id),
  consumerId: integer('consumer_id').references(() => users.id).notNull(),
  providerId: integer('provider_id').references(() => users.id),
  quantity: real('quantity').notNull(),
  unit: text('unit').notNull(),
  message: text('message'),
  preferredDate: text('preferred_date'),
  status: text('status').notNull().default('draft'), // 'draft', 'submitted', 'responded', 'accepted', 'rejected', 'expired'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Quotes table
export const quotes = sqliteTable('quotes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rfqId: integer('rfq_id').references(() => rfqRequests.id).notNull(),
  providerId: integer('provider_id').references(() => users.id).notNull(),
  price: real('price').notNull(),
  currency: text('currency').notNull().default('INR'),
  deliveryEtaDays: integer('delivery_eta_days'),
  notes: text('notes'),
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'rejected'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  budget: real('budget'),
  currency: text('currency').notNull().default('INR'),
  status: text('status').notNull().default('planning'), // 'planning', 'in_progress', 'completed'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Project items table
export const projectItems = sqliteTable('project_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  catalogId: integer('catalog_id').references(() => catalogs.id),
  qty: real('qty').notNull(),
  unit: text('unit').notNull(),
  note: text('note'),
  createdAt: text('created_at').notNull(),
});

// Ratings table
export const ratings = sqliteTable('ratings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  raterId: integer('rater_id').references(() => users.id).notNull(),
  targetType: text('target_type').notNull(), // 'provider', 'catalog'
  targetId: integer('target_id').notNull(),
  score: integer('score').notNull(), // 1-5
  reviewMd: text('review_md'),
  createdAt: text('created_at').notNull(),
});

// Verification documents table
export const verificationDocs = sqliteTable('verification_docs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  docType: text('doc_type').notNull(),
  docUrl: text('doc_url').notNull(),
  ocrJson: text('ocr_json', { mode: 'json' }),
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  reviewedBy: integer('reviewed_by').references(() => users.id),
  reviewedAt: text('reviewed_at'),
  createdAt: text('created_at').notNull(),
});

// Blog posts table
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorId: integer('author_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  bodyMd: text('body_md').notNull(),
  tags: text('tags', { mode: 'json' }), // JSON array
  heroUrl: text('hero_url'),
  status: text('status').notNull().default('draft'), // 'draft', 'review', 'published'
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// City knowledge table
export const cityKnowledge = sqliteTable('city_knowledge', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  regionCode: text('region_code').notNull().unique(),
  summaryMd: text('summary_md').notNull(),
  govContacts: text('gov_contacts', { mode: 'json' }),
  planningDocs: text('planning_docs', { mode: 'json' }), // JSON array
  utilitySteps: text('utility_steps', { mode: 'json' }),
  lastRefreshed: text('last_refreshed').notNull(),
});

// Social posts table
export const socialPosts = sqliteTable('social_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorId: integer('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  mediaUrls: text('media_urls', { mode: 'json' }), // JSON array
  likesCount: integer('likes_count').notNull().default(0),
  commentsCount: integer('comments_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Social comments table
export const socialComments = sqliteTable('social_comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => socialPosts.id).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});

// Social groups table
export const socialGroups = sqliteTable('social_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  visibility: text('visibility').notNull().default('public'), // 'public', 'private'
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  membersCount: integer('members_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// Social group members table
export const socialGroupMembers = sqliteTable('social_group_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').references(() => socialGroups.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  role: text('role').notNull().default('member'), // 'member', 'admin'
  joinedAt: text('joined_at').notNull(),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

// Project tasks table
export const projectTasks = sqliteTable('project_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'), // 'pending', 'in_progress', 'completed'
  assignedTo: integer('assigned_to').references(() => users.id),
  dueDate: text('due_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Project docs table
export const projectDocs = sqliteTable('project_docs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  docUrl: text('doc_url').notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id).notNull(),
  createdAt: text('created_at').notNull(),
});

// Project members table
export const projectMembers = sqliteTable('project_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  role: text('role').notNull().default('member'), // 'owner', 'member'
  joinedAt: text('joined_at').notNull(),
});

// Indexes for performance optimization
export const catalogsProviderIdIndex = index('catalogs_provider_id_idx').on(catalogs.providerId);
export const catalogsCityPriceIndex = index('catalogs_city_price_idx').on(catalogs.city, catalogs.price);
export const rfqRequestsProviderCreatedIndex = index('rfq_requests_provider_created_idx').on(rfqRequests.providerId, rfqRequests.createdAt);
export const catalogsTitleBrandIndex = index('catalogs_title_brand_idx').on(catalogs.title, catalogs.brand, catalogs.description);
export const catalogsAttributesIndex = index('catalogs_attributes_idx').on(catalogs.attributes);


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
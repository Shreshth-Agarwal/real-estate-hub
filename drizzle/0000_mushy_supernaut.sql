CREATE TABLE `catalog_price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`catalog_id` integer NOT NULL,
	`price` real NOT NULL,
	`currency` text NOT NULL,
	`effective_at` text NOT NULL,
	FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `catalogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer NOT NULL,
	`title` text NOT NULL,
	`brand` text,
	`sku` text,
	`description` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`unit` text NOT NULL,
	`moq` integer NOT NULL,
	`stock_status` text DEFAULT 'in_stock' NOT NULL,
	`attributes` text,
	`city` text NOT NULL,
	`delivery_radius_km` integer,
	`images` text,
	`pdf_url` text,
	`popularity_score` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles_provider` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`shop_name` text NOT NULL,
	`phone` text,
	`address` text,
	`lat` real,
	`lng` real,
	`categories` text,
	`brands` text,
	`logo_url` text,
	`kyc_status` text DEFAULT 'pending' NOT NULL,
	`trust_score` integer DEFAULT 0 NOT NULL,
	`description` text,
	`gallery` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_provider_user_id_unique` ON `profiles_provider` (`user_id`);--> statement-breakpoint
CREATE TABLE `project_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`catalog_id` integer,
	`qty` real NOT NULL,
	`unit` text NOT NULL,
	`note` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`title` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`budget` real,
	`currency` text DEFAULT 'INR' NOT NULL,
	`status` text DEFAULT 'planning' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rfq_id` integer NOT NULL,
	`provider_id` integer NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`delivery_eta_days` integer,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`rfq_id`) REFERENCES `rfq_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rater_id` integer NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`score` integer NOT NULL,
	`review_md` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`rater_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rfq_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`catalog_id` integer,
	`consumer_id` integer NOT NULL,
	`provider_id` integer,
	`quantity` real NOT NULL,
	`unit` text NOT NULL,
	`message` text,
	`preferred_date` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`catalog_id`) REFERENCES `catalogs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`consumer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`user_type` text DEFAULT 'consumer' NOT NULL,
	`avatar_url` text,
	`locale` text DEFAULT 'en' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verification_docs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`doc_type` text NOT NULL,
	`doc_url` text NOT NULL,
	`ocr_json` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` integer,
	`reviewed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

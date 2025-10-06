import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
 
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectURI: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
			scopes: ["openid", "email", "profile"],
		},
	},
	plugins: [bearer()],
	advanced: {
		generateId: false,
	},
	// Add hooks for logging and validation
	hooks: {
		after: [
			{
				matcher: (context) => context.path === "/sign-up/social",
				handler: async (ctx) => {
					console.log("🔐 [AUTH] Social sign-up completed:", {
						userId: ctx.user?.id,
						email: ctx.user?.email,
						name: ctx.user?.name,
						timestamp: new Date().toISOString(),
					});
				},
			},
			{
				matcher: (context) => context.path === "/sign-in/social",
				handler: async (ctx) => {
					console.log("🔐 [AUTH] Social sign-in completed:", {
						userId: ctx.user?.id,
						email: ctx.user?.email,
						timestamp: new Date().toISOString(),
					});
				},
			},
		],
		before: [
			{
				matcher: (context) => context.path === "/sign-up/social" || context.path === "/sign-in/social",
				handler: async (ctx) => {
					console.log("🔐 [AUTH] Social auth initiated:", {
						path: ctx.path,
						provider: ctx.body?.provider,
						timestamp: new Date().toISOString(),
					});
				},
			},
		],
	},
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}
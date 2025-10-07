import { NextRequest } from 'next/server';
import { db } from "@/db";

export const auth = {
  api: {
    getSession: async () => null
  },
  handler: async () => null
};

export async function getCurrentUser(request: NextRequest) {
  return null;
}

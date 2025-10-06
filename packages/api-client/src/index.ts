// ============================================
// API Client for Hub4Estate Split Platform
// ============================================

import type { Platform } from "@repo/types";

export interface ApiClientConfig {
  baseURL: string;
  platform: Platform;
  getAuthToken?: () => string | null;
}

export class ApiClient {
  private baseURL: string;
  private platform: Platform;
  private getAuthToken?: () => string | null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.platform = config.platform;
    this.getAuthToken = config.getAuthToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken?.();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Platform": this.platform,
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new ApiError(response.status, error.message || error.error?.message, error);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request<T>(endpoint + queryString, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Factory functions for creating platform-specific clients
export function createUserApiClient(getAuthToken?: () => string | null) {
  return new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_USER_APP_URL || "https://users.hub4estate.com",
    platform: "user",
    getAuthToken,
  });
}

export function createBusinessApiClient(getAuthToken?: () => string | null) {
  return new ApiClient({
    baseURL: process.env.NEXT_PUBLIC_BUSINESS_APP_URL || "https://business.hub4estate.com",
    platform: "business",
    getAuthToken,
  });
}
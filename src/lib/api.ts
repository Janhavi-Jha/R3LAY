import { APP_CONFIG } from "./config";
import { getAuthToken, clearAuthSession } from "./auth";

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Normalize endpoint path with API_BASE_URL
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = cleanEndpoint.startsWith("http")
    ? cleanEndpoint
    : `${APP_CONFIG.apiBaseUrl}${cleanEndpoint.startsWith("/api") ? cleanEndpoint.replace("/api", "") : cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearAuthSession();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("r3lay:auth:expired"));
      }
      throw new ApiError("Session expired or unauthorized. Please log in with Cognito again.", 401);
    }

    if (!response.ok) {
      let errMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      let errData = null;
      try {
        errData = await response.json();
        if (errData?.error) errMessage = errData.error;
        if (errData?.message) errMessage = errData.message;
      } catch {
        // ignore parse error
      }
      throw new ApiError(errMessage, response.status, errData);
    }

    // Check if response is JSON or blob/text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error)?.message || "Network error. Failed to reach R3LAY backend service.",
      0
    );
  }
}

// Service Methods
export const R3layApi = {
  // Auth
  login: async (username: string, password: string) => {
    return apiRequest<{
      success: boolean;
      token: string;
      expiresIn: number;
      user: any;
      cognitoSession: any;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>("/api/auth/me");
  },

  getConfig: async () => {
    return apiRequest<any>("/api/config");
  },

  // Trains & Coaches
  getTrains: async () => {
    return apiRequest<{ trains: any[] }>("/api/trains");
  },

  getTrainDetails: async (trainId: string) => {
    return apiRequest<{ train: any }>(`/api/trains/${trainId}`);
  },

  getTrainCoaches: async (trainId: string) => {
    return apiRequest<{ coaches: any[] }>(`/api/trains/${trainId}/coaches`);
  },

  getCoachSeats: async (coachId: string) => {
    return apiRequest<{
      coach: any;
      seats: any[];
      totalCount: number;
      vacantCount: number;
      occupiedCount: number;
      racCount: number;
    }>(`/api/coaches/${coachId}/seats`);
  },

  // Passengers
  getPassengers: async (filters?: {
    search?: string;
    coach?: string;
    status?: string;
    requirement?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.coach) params.append("coach", filters.coach);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.requirement) params.append("requirement", filters.requirement);
    const queryString = params.toString();
    return apiRequest<{ passengers: any[]; total: number }>(
      `/api/passengers${queryString ? `?${queryString}` : ""}`
    );
  },

  // Live Events & Actions
  getEvents: async (type?: string) => {
    const queryString = type && type !== "ALL" ? `?type=${type}` : "";
    return apiRequest<{ events: any[] }>(`/api/events${queryString}`);
  },

  markNoShow: async (payload: {
    passengerId?: string;
    pnr?: string;
    coachNumber?: string;
    berthNumber?: number;
    reason?: string;
  }) => {
    return apiRequest<{
      success: boolean;
      message: string;
      passenger: any;
      freedSeat: any;
      event: any;
      triggeredRecommendation?: any;
    }>("/api/events/no-show", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  manualBerthAdjustment: async (payload: {
    passengerId: string;
    targetCoach: string;
    targetBerth: number;
    reason?: string;
  }) => {
    return apiRequest<{ success: boolean; message: string; event: any }>(
      "/api/events/manual-adjustment",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  // Recommendations
  getRecommendations: async (status?: string) => {
    const queryString = status && status !== "ALL" ? `?status=${status}` : "";
    return apiRequest<{
      recommendations: any[];
      counts: { total: number; pending: number; approved: number; rejected: number };
    }>(`/api/recommendations${queryString}`);
  },

  approveRecommendation: async (id: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      recommendation: any;
      event: any;
    }>(`/api/recommendations/${id}/approve`, {
      method: "POST",
    });
  },

  rejectRecommendation: async (id: string, reason?: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      recommendation: any;
    }>(`/api/recommendations/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  // Optimization
  runOptimization: async () => {
    return apiRequest<{
      success: boolean;
      solverEngine: string;
      executionTimeMs: number;
      constraintsEvaluated: number;
      feasibleSolutionsCount: number;
      recommendationsGenerated: number;
      recommendations: any[];
      message: string;
    }>("/api/optimization/run", {
      method: "POST",
    });
  },

  // AI Assistant
  askAssistant: async (message: string) => {
    return apiRequest<{
      response: string;
      model: string;
      timestamp: string;
      trainNumber: string;
    }>("/api/assistant", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  // Analytics
  getAnalytics: async () => {
    return apiRequest<{
      occupancy: any;
      recommendations: any;
      events: any;
      movementOptimization: any;
    }>("/api/analytics");
  },

  // Reports
  getReports: async (type: string, format: string = "json") => {
    return apiRequest<any>(`/api/reports?type=${type}&format=${format}`);
  },

  // Settings
  getOptimizationSettings: async () => {
    return apiRequest<{ weights: any }>("/api/settings/optimization");
  },

  saveOptimizationSettings: async (weights: any) => {
    return apiRequest<{ success: boolean; message: string; weights: any }>(
      "/api/settings/optimization",
      {
        method: "PUT",
        body: JSON.stringify(weights),
      }
    );
  },
};

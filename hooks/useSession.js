"use client";

export function useSession() {
  // Fallback session hook since we're not using NextAuth
  return {
    data: null,
    status: "unauthenticated"
  };
}

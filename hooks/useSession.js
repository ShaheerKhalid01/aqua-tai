"use client";
import { useSession as useNextAuthSession } from "next-auth/react";

export function useSession() {
  try {
    const session = useNextAuthSession();
    return {
      data: session?.data || null,
      status: session?.status || "unauthenticated"
    };
  } catch (error) {
    // Fallback for SSR/build time
    return {
      data: null,
      status: "unauthenticated"
    };
  }
}

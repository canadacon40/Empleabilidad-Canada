"use client";

import { useLeadTracking } from "@/hooks/useLeadTracking";

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useLeadTracking();
  return <>{children}</>;
}

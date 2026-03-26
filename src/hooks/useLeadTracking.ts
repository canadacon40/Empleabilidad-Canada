"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useLeadTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trackEvent = useCallback(async (type: string, payload: any = {}) => {
    try {
      // Get anonymous ID if not exists
      let anonId = localStorage.getItem("lead_anon_id");
      if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem("lead_anon_id", anonId);
      }

      await fetch("/api/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          payload: {
            ...payload,
            pathname,
            url: window.location.href,
            anonId,
          },
        }),
      });
    } catch (err) {
      console.error("Failed to track event:", err);
    }
  }, [pathname]);

  // Track page views and UTMs
  useEffect(() => {
    const utms: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("utm_")) {
        utms[key] = value;
      }
    });

    trackEvent("PAGE_VIEW", { utms });
  }, [pathname, searchParams, trackEvent]);

  // Track Scroll Depth
  useEffect(() => {
    let thresholds = [25, 50, 75, 100];
    let reached = new Set<number>();

    const handleScroll = () => {
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      thresholds.forEach(t => {
        if (scrolled >= t && !reached.has(t)) {
          reached.add(t);
          trackEvent("SCROLL_DEPTH", { depth: t });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackEvent]);

  return { trackEvent };
}

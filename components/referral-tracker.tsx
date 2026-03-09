"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    
    if (ref && !hasTracked.current) {
      hasTracked.current = true;
      
      const trackReferral = async () => {
        try {
          // Fire and forget - tracking should not block UI
          fetch("/api/referral", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ referrerId: ref }),
          });
          
          // Clean up the URL to not leave ?ref dangling, but this is optional
          // window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error("Failed to track referral", error);
        }
      };

      trackReferral();
    }
  }, [searchParams]);

  // Render nothing
  return null;
}

"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires `landing_view` once per mount. Renders nothing. */
export function LandingViewTracker() {
  useEffect(() => {
    track("landing_view");
  }, []);
  return null;
}

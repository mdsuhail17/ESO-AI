"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis with ultra-smooth settings
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.7,
      smoothTouch: true,
      touchMultiplier: 1.2,
      infinite: false,
      syncTouch: true,
      touchInertiaMultiplier: 50,
      touchInertiaDeltaMultiplier: 0.5,
    });

    // Make Lenis available globally for other components
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    // Animation frame function - integrated with Lenis and framer-motion
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).lenis = null;
      }
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}


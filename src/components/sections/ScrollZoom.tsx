"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function ScrollZoomInner({ children, className, intensity }: { children: React.ReactNode; className: string; intensity: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [intensity, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80 * (1 - intensity), 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, y, opacity }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

export function ScrollZoom({ children, className = "", intensity = 0.75 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }
  return <ScrollZoomInner className={className} intensity={intensity}>{children}</ScrollZoomInner>;
}

export function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ScrollZoom className={className}>
      {children}
    </ScrollZoom>
  );
}

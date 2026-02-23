"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

export function AnimateIn({
  children, delay = 0, from = "bottom", className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "right" | "scale";
  className?: string;
}) {
  const [ref, visible] = useInView();
  const transforms: Record<string, string> = {
    bottom: "translateY(44px)", left: "translateX(-44px)",
    right: "translateX(44px)", scale: "scale(0.93)",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[from],
      transition: `all .75s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

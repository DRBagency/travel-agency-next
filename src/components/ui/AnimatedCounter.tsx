"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  locale?: string;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1.2,
  locale = "es",
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString(locale)
  );
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, value, duration, motionValue]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

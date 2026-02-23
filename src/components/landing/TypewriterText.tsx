"use client";

import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export default function TypewriterText({
  text,
  className = "",
  delay = 0.3,
  speed = 0.04,
}: TypewriterTextProps) {
  const chars = text.split("");

  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: delay + i * speed }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: delay + chars.length * speed,
        }}
        className="inline-block w-[3px] h-[0.9em] align-middle ms-0.5"
        style={{ backgroundColor: "currentColor" }}
      />
    </span>
  );
}

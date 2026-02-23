"use client";

interface SectionDividerProps {
  topColor?: string;
  bottomColor?: string;
  variant?: "wave" | "curve" | "tilt";
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({
  topColor = "#f8fafc",
  bottomColor = "#ffffff",
  variant = "wave",
  flip = false,
  className = "",
}: SectionDividerProps) {
  const paths: Record<string, string> = {
    wave: "M0,64 C320,120 640,0 960,64 C1280,128 1440,40 1440,40 L1440,120 L0,120 Z",
    curve: "M0,80 Q720,0 1440,80 L1440,120 L0,120 Z",
    tilt: "M0,40 L1440,100 L1440,120 L0,120 Z",
  };

  return (
    <div
      className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      style={{ marginTop: -1, marginBottom: -1 }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px]"
      >
        <rect width="1440" height="120" fill={topColor} />
        <path d={paths[variant] || paths.wave} fill={bottomColor} />
      </svg>
    </div>
  );
}

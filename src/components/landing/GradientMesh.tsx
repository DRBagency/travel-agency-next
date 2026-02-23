"use client";

interface GradientMeshProps {
  primaryColor?: string;
  className?: string;
  opacity?: number;
}

export default function GradientMesh({
  primaryColor = "#1CABB0",
  className = "",
  opacity = 0.3,
}: GradientMeshProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div
        className="absolute inset-0 animate-mesh-shift"
        style={{
          backgroundImage: `
            radial-gradient(60% 60% at 20% 30%, ${primaryColor}40 0%, transparent 60%),
            radial-gradient(50% 50% at 80% 20%, #8B5CF640 0%, transparent 55%),
            radial-gradient(45% 45% at 50% 80%, #06B6D430 0%, transparent 50%)
          `,
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
}

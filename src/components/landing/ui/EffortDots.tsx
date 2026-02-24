"use client";

export function EffortDots({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: i <= level ? "#1CABB0" : "#d1d5db",
          }}
        />
      ))}
    </div>
  );
}

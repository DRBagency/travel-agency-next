"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveAnimationProps {
  className?: string;
  fit?: "cover" | "contain";
}

export default function RiveAnimation({
  className,
  fit = "contain",
}: RiveAnimationProps) {
  const { RiveComponent } = useRive({
    src: "/traveller.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: fit === "cover" ? Fit.Cover : Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className={className} style={{ backgroundColor: "#4BA8C9" }}>
      <RiveComponent />
    </div>
  );
}

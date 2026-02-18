"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveAnimationProps {
  className?: string;
}

export default function RiveAnimation({ className }: RiveAnimationProps) {
  const { RiveComponent } = useRive({
    src: "/traveller.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className={className}>
      <RiveComponent />
    </div>
  );
}

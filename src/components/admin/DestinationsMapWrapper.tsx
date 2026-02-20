"use client";

import dynamic from "next/dynamic";

const DestinationsMapWidget = dynamic(
  () => import("./DestinationsMapWidget"),
  { ssr: false }
);

interface Destination {
  id: string;
  nombre: string;
  precio: number;
  latitude: number;
  longitude: number;
  imagen_url?: string | null;
}

export default function DestinationsMapWrapper({
  destinations,
  labels,
}: {
  destinations: Destination[];
  labels: {
    destinationsMap: string;
    viewDestinations: string;
    noDestinations: string;
  };
}) {
  return <DestinationsMapWidget destinations={destinations} labels={labels} />;
}

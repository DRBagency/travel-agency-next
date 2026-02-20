"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type L from "leaflet";

interface Destination {
  id: string;
  nombre: string;
  precio: number;
  latitude: number;
  longitude: number;
  imagen_url?: string | null;
}

export default function DestinationsMapWidget({
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || destinations.length === 0 || mapInstance.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
      });

      // Tile layer — clean style
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const markerIcon = L.divIcon({
        className: "drb-map-marker",
        html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#1CABB0,#178991);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const bounds = L.latLngBounds([]);

      destinations.forEach((dest) => {
        const marker = L.marker([dest.latitude, dest.longitude], { icon: markerIcon }).addTo(map);
        marker.bindPopup(
          `<div style="font-family:system-ui;min-width:120px;">
            <strong style="font-size:13px;">${dest.nombre}</strong>
            <br/><span style="font-size:12px;color:#666;">${dest.precio}€</span>
          </div>`,
          { closeButton: false, className: "drb-popup" }
        );
        bounds.extend([dest.latitude, dest.longitude]);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
      }

      mapInstance.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [destinations]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="panel-card h-full overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {labels.destinationsMap}
          </h2>
          {destinations.length > 0 && (
            <span className="badge-info text-[10px]">{destinations.length}</span>
          )}
        </div>
        <Link
          href="/admin/destinos"
          className="text-xs font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-700 dark:hover:text-drb-turquoise-300 transition-colors flex items-center gap-1"
        >
          {labels.viewDestinations}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center px-4 pb-3">
          <MapPin className="w-8 h-8 text-amber-300 dark:text-amber-600 mb-2" />
          <p className="text-sm text-gray-400 dark:text-white/40">{labels.noDestinations}</p>
        </div>
      ) : (
        <div className="px-4 pb-3">
          <div
            ref={mapRef}
            className="w-full h-[140px] rounded-xl overflow-hidden bg-gray-100 dark:bg-white/[0.03]"
            style={{ opacity: ready ? 1 : 0.5, transition: "opacity 0.3s" }}
          />
        </div>
      )}
    </motion.div>
  );
}

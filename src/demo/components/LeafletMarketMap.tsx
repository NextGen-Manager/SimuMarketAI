"use client";

import { useEffect, useRef, useState } from "react";
import * as leaflet from "leaflet";
import type { Circle, Map as LeafletMap, Marker } from "leaflet";
import {
  demoMarketMap,
  type MapCoordinate,
} from "@/demo/data/market-map";

type LeafletMarketMapProps = {
  radius: number;
  onLocationMove: () => void;
};

function readThemeColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function toLeafletCoordinate(
  coordinate: MapCoordinate,
): [latitude: number, longitude: number] {
  return [coordinate[0], coordinate[1]];
}

function createLocationIcon() {
  return leaflet.divIcon({
    className: "cursor-grab text-teal-700",
    html: `
      <svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">
        <path
          d="M16 1C8.27 1 2 7.27 2 15c0 10.1 14 26 14 26s14-15.9 14-26C30 7.27 23.73 1 16 1Z"
          fill="currentColor"
          stroke="var(--color-surface)"
          stroke-width="2"
        />
        <circle cx="16" cy="15" r="5" fill="var(--color-surface)" />
      </svg>
    `,
    iconAnchor: [16, 41],
    iconSize: [32, 42],
    tooltipAnchor: [0, -38],
  });
}

export function LeafletMarketMap({
  radius,
  onLocationMove,
}: LeafletMarketMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const radiusCircleRef = useRef<Circle | null>(null);
  const locationMarkerRef = useRef<Marker | null>(null);
  const onLocationMoveRef = useRef(onLocationMove);
  const initialRadiusRef = useRef(radius);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    onLocationMoveRef.current = onLocationMove;
  }, [onLocationMove]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const teal = readThemeColor("--color-teal-700");
      const amber = readThemeColor("--color-amber-600");
      const surface = readThemeColor("--color-surface");
      const map = leaflet.map(containerRef.current, {
        attributionControl: true,
        keyboard: true,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      const center = leaflet.latLng(toLeafletCoordinate(demoMarketMap.center));
      map.setView(center, 14);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })
        .addTo(map);

      const radiusCircle = leaflet
        .circle(toLeafletCoordinate(demoMarketMap.center), {
          color: teal,
          fillColor: teal,
          fillOpacity: 0.1,
          radius: initialRadiusRef.current,
          weight: 2,
        })
        .addTo(map);

      const locationMarker = leaflet
        .marker(center, {
          autoPan: true,
          draggable: true,
          icon: createLocationIcon(),
        })
        .bindTooltip("Tarik untuk memindahkan lokasi usaha", {
          direction: "top",
        })
        .addTo(map);

      locationMarker.on("drag", () => {
        radiusCircle.setLatLng(locationMarker.getLatLng());
      });
      locationMarker.on("dragend", () => {
        onLocationMoveRef.current();
      });

      for (const competitor of demoMarketMap.competitors) {
        leaflet
          .circleMarker(toLeafletCoordinate(competitor.coordinate), {
            color: surface,
            fillColor: amber,
            fillOpacity: 1,
            radius: 6,
            weight: 2,
          })
          .bindTooltip(
            `${competitor.name} · ${competitor.distanceLabel}`,
            { direction: "top", offset: [0, -5] },
          )
          .addTo(map);
      }

      map.fitBounds(center.toBounds(initialRadiusRef.current * 2), {
        animate: false,
        padding: [24, 24],
      });
      mapRef.current = map;
      radiusCircleRef.current = radiusCircle;
      locationMarkerRef.current = locationMarker;
      window.requestAnimationFrame(() => map.invalidateSize());
      setStatus("ready");
    } catch (error) {
      console.error("Leaflet map initialization failed.", error);
      setStatus("error");
    }

    return () => {
      radiusCircleRef.current = null;
      locationMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const radiusCircle = radiusCircleRef.current;
    if (!map || !radiusCircle) return;

    radiusCircle.setRadius(radius);
    const center =
      locationMarkerRef.current?.getLatLng() ??
      leaflet.latLng(toLeafletCoordinate(demoMarketMap.center));
    map.fitBounds(center.toBounds(radius * 2), {
      animate: false,
      padding: [24, 24],
    });
  }, [radius]);

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-[10px] border border-line bg-surface-2">
      <div
        ref={containerRef}
        role="region"
        aria-label="Peta interaktif lokasi usaha dan kompetitor di Tebet"
        className="h-full w-full"
      />

      {status === "loading" ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1000] grid place-items-center bg-surface-2"
          aria-live="polite"
        >
          <div className="text-center">
            <span className="mx-auto block h-2 w-28 animate-pulse rounded-full bg-line" aria-hidden />
            <p className="mt-3 text-[12px] font-semibold text-ink-400">
              Menyiapkan peta…
            </p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div
          className="absolute inset-0 z-[1000] grid place-items-center bg-surface-2 px-6 text-center"
          role="alert"
        >
          <div>
            <p className="text-[13px] font-semibold text-ink-900">
              Peta tidak dapat dimuat
            </p>
            <p className="mt-1 text-[12px] leading-5 text-ink-500">
              Muat ulang halaman. Data lokasi yang sudah diisi tetap aman.
            </p>
          </div>
        </div>
      ) : null}

      {status === "ready" ? (
        <div className="pointer-events-none absolute right-2 top-2 z-[500] flex gap-2 rounded-[7px] border border-line bg-surface/95 px-2.5 py-2 text-[10.5px] font-semibold text-ink-500">
          <span className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 16 20"
              className="h-3.5 w-3 text-teal-700"
              aria-hidden
            >
              <path
                d="M8 .5A7.5 7.5 0 0 0 .5 8C.5 13.4 8 20 8 20s7.5-6.6 7.5-12A7.5 7.5 0 0 0 8 .5Z"
                fill="currentColor"
              />
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
            Lokasi usaha
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-600" aria-hidden />
            Kompetitor
          </span>
        </div>
      ) : null}
    </div>
  );
}

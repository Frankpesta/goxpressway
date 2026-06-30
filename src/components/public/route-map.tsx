"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { animate } from "framer-motion";

interface Checkpoint {
  _id: string;
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  arrivalStatus?: string;
  sequence: number;
}

interface Props {
  checkpoints: Checkpoint[];
  height?: number;
}

const BLUE = "#2563eb";
const BLUE_ALPHA = "rgba(37, 99, 235, 0.25)";

function makeCurrentMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText =
    "position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;";

  const ring = document.createElement("div");
  ring.style.cssText = `
    position:absolute;inset:0;border-radius:50%;
    background:${BLUE_ALPHA};
  `;
  el.appendChild(ring);

  const dot = document.createElement("div");
  dot.style.cssText = `
    width:18px;height:18px;border-radius:50%;
    background:${BLUE};border:3px solid white;
    box-shadow:0 2px 10px rgba(37,99,235,0.5);
    position:relative;z-index:1;
    transform:scale(0);
  `;
  el.appendChild(dot);

  // Spring entrance with Framer Motion
  animate(dot, { scale: [0, 1.3, 1] }, { duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 });
  // Pulse ring with Framer Motion
  animate(ring, { scale: [0.5, 2.2], opacity: [0.7, 0] }, { duration: 1.8, repeat: Infinity, ease: "easeOut" });

  return el;
}

function makeArrivedMarkerEl(delayMs: number): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "width:20px;height:20px;";

  const dot = document.createElement("div");
  dot.style.cssText = `
    width:20px;height:20px;border-radius:50%;
    background:${BLUE};border:3px solid white;
    box-shadow:0 1px 5px rgba(37,99,235,0.35);
    transform:scale(0);
  `;
  el.appendChild(dot);

  animate(dot, { scale: [0, 1.2, 1] }, { duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: delayMs / 1000 });

  return el;
}

function makeUpcomingMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "width:14px;height:14px;";

  const dot = document.createElement("div");
  dot.style.cssText = `
    width:14px;height:14px;border-radius:50%;
    background:white;border:2px solid #94a3b8;
    box-shadow:0 1px 3px rgba(0,0,0,0.15);
  `;
  el.appendChild(dot);
  return el;
}

export function RouteMap({ checkpoints, height = 320 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || checkpoints.length < 2) return;

    const sorted = [...checkpoints].sort((a, b) => a.sequence - b.sequence);
    // Last checkpoint with arrivalStatus is "current"
    const currentIdx = sorted.reduce((acc, cp, i) => (cp.arrivalStatus ? i : acc), 0);

    const currentCp = sorted[currentIdx];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© <a href='https://openstreetmap.org'>OpenStreetMap</a>",
            maxzoom: 19,
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [currentCp.longitude, currentCp.latitude],
      zoom: 4,
    });

    map.on("load", () => {
      const allCoords = sorted.map(
        (cp) => [cp.longitude, cp.latitude] as [number, number]
      );

      // ── Full route as gray dashed line ──
      map.addSource("route-full", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: allCoords },
        },
      });
      map.addLayer({
        id: "route-full",
        type: "line",
        source: "route-full",
        paint: {
          "line-color": "#cbd5e1",
          "line-width": 2.5,
          "line-dasharray": [4, 4],
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // ── Animated completed-route drawing ──
      if (currentIdx > 0) {
        const completedCoords = allCoords.slice(0, currentIdx + 1);

        map.addSource("route-progress", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: completedCoords.slice(0, 2),
            },
          },
        });
        map.addLayer({
          id: "route-progress",
          type: "line",
          source: "route-progress",
          paint: { "line-color": BLUE, "line-width": 3.5, "line-opacity": 0.9 },
          layout: { "line-cap": "round", "line-join": "round" },
        });

        const DRAW_DURATION = 1400;
        const start = performance.now();

        function drawFrame(now: number) {
          const t = Math.min((now - start) / DRAW_DURATION, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic

          const totalSegs = currentIdx;
          const progress = eased * totalSegs;
          const segIdx = Math.min(Math.floor(progress), totalSegs - 1);
          const segT = progress - segIdx;

          const pts: [number, number][] = [];
          for (let i = 0; i <= segIdx; i++) pts.push(completedCoords[i]);
          if (segIdx < totalSegs) {
            const a = completedCoords[segIdx];
            const b = completedCoords[segIdx + 1];
            pts.push([a[0] + (b[0] - a[0]) * segT, a[1] + (b[1] - a[1]) * segT]);
          }

          (map.getSource("route-progress") as maplibregl.GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: pts.length >= 2 ? pts : completedCoords.slice(0, 2),
            },
          });

          if (t < 1) requestAnimationFrame(drawFrame);
        }

        requestAnimationFrame(drawFrame);
      }

      // ── Checkpoint markers ──
      sorted.forEach((cp, i) => {
        const isArrived = !!cp.arrivalStatus;
        const isCurrent = i === currentIdx;

        let el: HTMLElement;
        if (isCurrent) {
          el = makeCurrentMarkerEl();
        } else if (isArrived) {
          el = makeArrivedMarkerEl(i * 80);
        } else {
          el = makeUpcomingMarkerEl();
        }

        const popup = new maplibregl.Popup({
          offset: isCurrent ? 30 : 16,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div style="font-family:system-ui,sans-serif;padding:4px 2px;min-width:90px">
            <div style="font-weight:600;font-size:13px;color:#1e293b">${cp.cityName}</div>
            <div style="font-size:11px;color:#64748b;margin-top:1px">${cp.country}</div>
            ${cp.arrivalStatus ? `<div style="font-size:11px;color:${BLUE};margin-top:3px;font-weight:500">✓ ${cp.arrivalStatus}</div>` : ""}
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([cp.longitude, cp.latitude])
          .setPopup(popup)
          .addTo(map);

        if (isCurrent) setTimeout(() => marker.togglePopup(), 1000);
      });

      // ── Fit all checkpoints in view ──
      const bounds = new maplibregl.LngLatBounds();
      sorted.forEach((cp) => bounds.extend([cp.longitude, cp.latitude]));
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 50, left: 60, right: 60 },
        maxZoom: 8,
        duration: 1200,
        offset: [0, -20],
      });
    });

    return () => {
      map.remove();
    };
  // checkpoint data can change via real-time subscription; re-mount map when it does
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(checkpoints)]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", borderRadius: "0.75rem", overflow: "hidden" }}
    />
  );
}

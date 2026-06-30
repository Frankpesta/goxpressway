"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion } from "framer-motion";
import { TrackingTimeline } from "@/components/public/tracking-timeline";
import { QrCodeDisplay } from "@/components/admin/shipments/qr-code-display";
import {
  Package,
  Calendar,
  MapPin,
  Weight,
  Ruler,
  Copy,
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
} from "lucide-react";

const RouteMap = dynamic(
  () => import("@/components/public/route-map").then((m) => m.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 rounded-xl bg-muted animate-pulse" />
    ),
  }
);
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  Created: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Pending Pickup": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Picked Up": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Transit": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "At Facility": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Out for Delivery": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Returned: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-md bg-muted animate-pulse", className)} />
  );
}

function TrackingPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export default function PublicTrackingPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = use(params);
  const shipment = useQuery(api.shipments.getShipmentByTrackingCode, {
    trackingCode,
  });

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track/${trackingCode}`
      : `/track/${trackingCode}`;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90">
            <Package className="h-5 w-5" />
            GOxpress Way
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
            render={<Link href="/" />}
          >
            <Home className="mr-2 h-4 w-4" />
            Track Another
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {shipment === undefined ? (
          <TrackingPageSkeleton />
        ) : shipment === null ? (
          /* Not found */
          <div className="rounded-xl border bg-card p-8 text-center space-y-4">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
            <div>
              <h1 className="text-xl font-bold">Shipment Not Found</h1>
              <p className="text-muted-foreground text-sm mt-1">
                No shipment with tracking code{" "}
                <span className="font-mono font-semibold">{trackingCode}</span>{" "}
                was found.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Double-check your tracking number and try again. If the problem
              persists, contact support.
            </p>
            <Button render={<Link href="/" />} className="mt-2">
              <Home className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </div>
        ) : (
          <>
            {/* Status hero card */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-muted-foreground">
                      {trackingCode}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(trackingCode);
                        toast.success("Tracking code copied!");
                      }}
                      className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy tracking code</span>
                    </button>
                  </div>
                  <StatusPill status={shipment.status} />
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded font-medium">
                  {shipment.shipmentType}
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="font-medium text-foreground">
                  {shipment.senderCity}, {shipment.senderCountry}
                </span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {shipment.receiverCity}, {shipment.receiverCountry}
                </span>
              </div>

              {shipment.estimatedDeliveryDate && (
                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-semibold">{shipment.estimatedDeliveryDate}</span>
                </div>
              )}
            </div>

            {/* Route map — only shown when 2+ checkpoints exist */}
            {shipment.checkpoints.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-base font-semibold">Live Route Map</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap a marker to see checkpoint details
                  </p>
                </div>
                <RouteMap checkpoints={shipment.checkpoints} height={300} />
                <p className="text-[10px] text-muted-foreground px-6 pb-3 pt-2">
                  © OpenStreetMap contributors
                </p>
              </motion.div>
            )}

            {/* Timeline */}
            {shipment.timeline.length > 0 ? (
              <TrackingTimeline events={shipment.timeline} />
            ) : (
              <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground text-sm">
                No tracking events yet. Check back soon.
              </div>
            )}

            {/* Sender / Receiver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SectionCard title="Sender">
                <div className="space-y-1.5">
                  <p className="font-semibold text-sm">{shipment.senderFullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.senderCity}, {shipment.senderState}
                  </p>
                  <p className="text-sm text-muted-foreground">{shipment.senderCountry}</p>
                </div>
              </SectionCard>
              <SectionCard title="Receiver">
                <div className="space-y-1.5">
                  <p className="font-semibold text-sm">{shipment.receiverFullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.receiverCity}, {shipment.receiverState}
                  </p>
                  <p className="text-sm text-muted-foreground">{shipment.receiverCountry}</p>
                </div>
              </SectionCard>
            </div>

            {/* Shipment Specifications */}
            <SectionCard title="Shipment Specifications" icon={Package}>
              <div className="space-y-2">
                <InfoRow label="Service Type" value={shipment.shipmentType} />
                <InfoRow
                  label="Total Weight"
                  value={
                    <span className="flex items-center gap-1">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                      {shipment.weight} kg
                    </span>
                  }
                />
                <InfoRow
                  label="Dimensions"
                  value={
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                      {shipment.length} × {shipment.width} × {shipment.height} cm
                    </span>
                  }
                />
                {shipment.dispatchDate && (
                  <InfoRow label="Dispatch Date" value={shipment.dispatchDate} />
                )}
              </div>
            </SectionCard>

            {/* Items */}
            {shipment.items.length > 0 && (
              <SectionCard title={`Package Contents (${shipment.items.length} item${shipment.items.length !== 1 ? "s" : ""})`} icon={Package}>
                <div className="space-y-3">
                  {shipment.items.map((item, i) => (
                    <div
                      key={item._id}
                      className={cn(
                        "text-sm",
                        i > 0 && "pt-3 border-t"
                      )}
                    >
                      <p className="font-medium">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} · {item.weight} kg
                        {item.description ? ` · ${item.description}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Route checkpoints */}
            {shipment.checkpoints.length >= 2 && (
              <SectionCard title="Route Progress">
                <div className="overflow-x-auto py-2">
                  <div className="flex items-start gap-0 min-w-max">
                    {shipment.checkpoints.map((cp, i) => (
                      <div key={cp._id} className="flex items-center">
                        {/* Checkpoint */}
                        <div className="flex flex-col items-center w-20 text-center">
                          <div
                            className={cn(
                              "h-3.5 w-3.5 rounded-full border-2 mb-1.5",
                              cp.arrivalStatus
                                ? "bg-primary border-primary"
                                : "bg-background border-muted-foreground/40"
                            )}
                          />
                          <p className="text-xs font-medium leading-tight">{cp.cityName}</p>
                          <p className="text-[10px] text-muted-foreground">{cp.country}</p>
                          {cp.arrivalStatus && (
                            <p className="text-[10px] text-primary mt-0.5">{cp.arrivalStatus}</p>
                          )}
                        </div>
                        {/* Connector */}
                        {i < shipment.checkpoints.length - 1 && (
                          <div
                            className={cn(
                              "h-0.5 w-10 mx-1 flex-shrink-0",
                              shipment.checkpoints[i + 1]?.arrivalStatus
                                ? "bg-primary"
                                : "bg-border"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>
            )}

            {/* QR Code */}
            <SectionCard title="Scan & Track">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <QrCodeDisplay
                  url={shipment.qrCodeUrl ?? trackingUrl}
                  trackingCode={trackingCode}
                  size={160}
                />
                <div className="text-sm text-muted-foreground text-center sm:text-left space-y-1">
                  <p className="font-medium text-foreground">Quick Access QR Code</p>
                  <p>Scan this code to instantly open this tracking page on any device.</p>
                  <p className="text-xs font-mono break-all">{trackingUrl}</p>
                </div>
              </div>
            </SectionCard>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GOxpress Way · Global Courier & Logistics
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  Package,
  TrendingUp,
  CheckCircle2,
  Archive,
  Truck,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Clock,
} from "lucide-react";

// ── Status badge helper ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Created: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "Pending Pickup": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Picked Up": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "In Transit": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Arrived At Facility": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Out For Delivery": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Failed Delivery": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Returned: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number | string | undefined;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="bg-card border rounded-2xl p-5 flex items-start gap-4">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {label}
        </div>
        <div className="text-2xl font-extrabold leading-none">
          {value === undefined ? (
            <span className="text-muted-foreground/40 text-lg">—</span>
          ) : (
            <>
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const metrics = useQuery(api.shipments.getDashboardMetrics);
  const recent = useQuery(api.shipments.getRecentShipments, { limit: 10 });
  const currentUser = useQuery(api.users.getCurrentUser);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const STAT_CARDS = [
    { label: "Total Shipments", value: metrics?.totalShipments, icon: Package, color: "#2563eb" },
    { label: "Active Shipments", value: metrics?.activeShipments, icon: TrendingUp, color: "#d97706" },
    { label: "Delivered", value: metrics?.deliveredShipments, icon: CheckCircle2, color: "#16a34a" },
    { label: "In Transit", value: metrics?.inTransitShipments, icon: Truck, color: "#7c3aed" },
    { label: "Failed Deliveries", value: metrics?.failedDeliveries, icon: AlertTriangle, color: "#dc2626" },
    { label: "Archived", value: metrics?.archivedShipments, icon: Archive, color: "#64748b" },
    {
      label: "Total Revenue",
      value: metrics?.totalRevenue !== undefined
        ? metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : undefined,
      icon: DollarSign,
      color: "#0d9488",
      prefix: "$",
    },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{currentUser?.name ? `, ${currentUser.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/shipments/new"
            className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            + New Shipment
          </Link>
          <Link
            href="/admin/analytics"
            className="border text-sm font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors flex items-center gap-1.5"
          >
            Analytics <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent Shipments</h2>
          <Link
            href="/admin/shipments"
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-card border rounded-2xl overflow-hidden">
          {!recent ? (
            <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No shipments yet.</p>
              <Link href="/admin/shipments/new" className="mt-3 inline-block text-sm text-primary font-semibold hover:underline">
                Create your first shipment →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tracking</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Route</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cost</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recent.map((s) => (
                    <tr key={s._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/shipments/${s.trackingCode}`}
                          className="font-mono text-xs font-semibold text-primary hover:underline"
                        >
                          {s.trackingCode}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{s.senderCity}</span>
                        {" → "}
                        <span className="font-medium text-foreground">{s.receiverCity}</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.shipmentType}</td>
                      <td className="py-3 px-4 text-xs font-semibold">
                        ${s.totalCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(s.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

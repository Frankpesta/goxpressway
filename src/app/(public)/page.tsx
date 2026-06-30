"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "@convex/_generated/api";
import { SERVICE_LIST } from "@/data/services";
import { NavHeader } from "@/components/public/nav-header";
import { SiteFooter } from "@/components/public/site-footer";
import { isValidTrackingCode } from "../../../convex/lib/tracking";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Globe,
  HeadphonesIcon,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Zap,
  Package,
  Truck,
  Globe,
};

const PHOTOS = {
  hero:
    "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=85",
  warehouse:
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=900&q=85",
  courier:
    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=900&q=85",
  air:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
};

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSearch({ rateLimited }: { rateLimited: boolean }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleTrack() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a tracking code.");
      return;
    }
    if (!isValidTrackingCode(trimmed)) {
      setError("Use the format GOX-YYYY-NNNNNN.");
      return;
    }
    setError("");
    router.push(`/track/${trimmed}`);
  }

  return (
    <div className="rounded-xl border border-white/15 bg-white p-2 shadow-2xl shadow-slate-950/20">
      {rateLimited && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          <AlertTriangle className="h-4 w-4" />
          Too many requests. Please wait a minute.
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => event.key === "Enter" && handleTrack()}
          placeholder="GOX-2026-839201"
          className="min-h-12 flex-1 rounded-lg border-0 bg-slate-100 px-4 font-mono text-sm font-semibold tracking-widest text-slate-950 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-orange-500"
        />
        <button
          onClick={handleTrack}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
        >
          <Search className="h-4 w-4" />
          Track
        </button>
      </div>
      {error && <p className="px-2 pt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function LiveStats() {
  const metrics = useQuery(api.shipments.getDashboardMetrics);
  const stats = [
    ["Total shipments", metrics?.totalShipments ?? "--"],
    ["Delivered", metrics?.deliveredShipments ?? "--"],
    ["Countries", "50+"],
    ["Support", "24/7"],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([label, value]) => (
        <div key={label} className="rounded-lg border bg-white p-5 shadow-sm dark:bg-card">
          <div className="text-2xl font-black text-brand-orange">{value}</div>
          <div className="mt-1 text-xs font-bold uppercase text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}

function HomePageInner() {
  const searchParams = useSearchParams();
  const rateLimited = searchParams.get("rateLimited") === "1";

  const WHY_US = [
    { icon: MapPin, title: "Live route intelligence", desc: "GPS-backed tracking gives senders and receivers a precise view of every movement." },
    { icon: ShieldCheck, title: "Insured by default", desc: "Every parcel travels with protection, chain-of-custody records, and proof of delivery." },
    { icon: Clock, title: "Priority time windows", desc: "Express workflows keep critical deliveries moving through dedicated handling lanes." },
    { icon: HeadphonesIcon, title: "Human support", desc: "Logistics specialists are available around the clock for exceptions and high-value cargo." },
    { icon: Globe, title: "Global partner mesh", desc: "Reach 50+ countries through vetted last-mile and customs partners." },
    { icon: BarChart3, title: "Operational dashboard", desc: "Admins get shipment analytics, timelines, labels, and audit-ready activity history." },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader />

      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,109,0,0.16),transparent_38%,rgba(255,255,255,0.05))]" />
        <div className="relative mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase text-white/80">
              <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
              Priority courier network
            </div>
            <h1 className="text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
              Ship fast. Track every mile.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Goxpress Way brings excellent clarity to modern logistics:
              premium courier service, live tracking, and global coverage from
              pickup to proof of delivery.
            </p>
            <div className="mt-8 max-w-xl">
              <HeroSearch rateLimited={rateLimited} />
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase text-white/50">
                {["Real-time tracking", "Insured delivery", "50+ countries"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[520px]"
          >
            <div className="absolute right-0 top-0 h-[420px] w-[82%] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <img src={PHOTOS.hero} alt="Courier loading delivery parcels" className="logistics-photo" />
            </div>
            <div className="absolute bottom-10 left-0 h-56 w-[58%] overflow-hidden rounded-xl border-4 border-brand-navy shadow-2xl">
              <img src={PHOTOS.warehouse} alt="Warehouse fulfilment operation" className="logistics-photo" />
            </div>
            <div className="absolute bottom-0 right-8 w-72 rounded-xl border border-white/15 bg-white p-5 text-slate-950 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500">Live shipment</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-black text-green-700">
                  On route
                </span>
              </div>
              <div className="mt-4 text-2xl font-black">GOX-2026-839201</div>
              <div className="mt-4 space-y-3 text-sm">
                {["Collected in London", "Cleared at hub", "Out for delivery"].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" />
                    <span className="font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 dark:bg-background sm:px-6">
        <div className="mx-auto max-w-7xl">
          <LiveStats />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-brand-orange">Services</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Built for every shipment profile</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-black text-primary">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SERVICE_LIST.map((svc, index) => {
              const Icon = SERVICE_ICONS[svc.icon] ?? Package;
              return (
                <FadeUp key={svc.slug} delay={index * 0.06}>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="group block h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-36 overflow-hidden">
                      <img
                        src={[PHOTOS.courier, PHOTOS.warehouse, PHOTOS.air, PHOTOS.hero][index]}
                        alt={`${svc.name} logistics`}
                        className="logistics-photo transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-navy text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-black text-brand-orange">{svc.price}</span>
                      </div>
                      <h3 className="text-lg font-black">{svc.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{svc.description}</p>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/45 px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <div className="grid grid-cols-2 gap-4">
              <img src={PHOTOS.courier} alt="Courier scanning parcels" className="h-72 rounded-xl object-cover" />
              <img src={PHOTOS.air} alt="Air freight plane" className="mt-10 h-72 rounded-xl object-cover" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-sm font-black uppercase text-brand-orange">Why GOxpress Way</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">A cleaner operating layer for urgent logistics</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              From express parcels to freight movements, teams get the visibility
              and reliability they expect from an enterprise courier without
              losing the personal support of a specialist partner.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {WHY_US.map((item) => (
                <div key={item.title} className="rounded-lg border bg-card p-5">
                  <item.icon className="mb-3 h-5 w-5 text-brand-orange" />
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <FadeUp>
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl bg-brand-navy text-white lg:grid-cols-[1fr_0.8fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <PackageCheck className="mb-6 h-10 w-10 text-brand-orange" />
              <h2 className="text-3xl font-black sm:text-4xl">Ready to move your next shipment?</h2>
              <p className="mt-4 max-w-xl text-white/65">
                Create a shipment, request a quote, or speak with a logistics
                expert about a recurring delivery lane.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/admin/login" className="rounded-lg bg-brand-orange px-5 py-3 text-sm font-black text-slate-950">
                  Create Shipment
                </Link>
                <Link href="/contact" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-black text-white">
                  Contact Sales
                </Link>
              </div>
            </div>
            <img src={PHOTOS.warehouse} alt="Modern logistics warehouse" className="min-h-80 object-cover" />
          </div>
        </FadeUp>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-brand-navy">
          <Package className="h-10 w-10 animate-pulse text-white/50" />
        </div>
      }
    >
      <HomePageInner />
    </Suspense>
  );
}

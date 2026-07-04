"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NavHeader } from "@/components/public/nav-header";
import { SiteFooter } from "@/components/public/site-footer";
import { SERVICES, SERVICE_LIST } from "@/data/services";
import {
  Zap,
  Package,
  Truck,
  Globe,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Clock,
  ShieldCheck,
  MapPin,
  PackageCheck,
  Star,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = { Zap, Package, Truck, Globe };

const SERVICE_IMAGES: Record<string, { hero: string; feature: string; gallery: [string, string, string] }> = {
  express: {
    hero: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=85",
    feature: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1582578598774-a377d4b32223?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=700&q=80",
    ],
  },
  standard: {
    hero: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=85",
    feature: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=700&q=80",
    ],
  },
  freight: {
    hero: "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=85",
    feature: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80",
    ],
  },
  international: {
    hero: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    feature: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=700&q=80",
    ],
  },
};

const SERVICE_STEPS: Record<string, Array<{ title: string; desc: string }>> = {
  express: [
    { title: "Book in minutes", desc: "Enter shipment details online and schedule a priority pickup for the same day or next morning." },
    { title: "Priority collection", desc: "A dedicated express courier arrives within 2 hours of booking — no waiting, no delays." },
    { title: "Guaranteed delivery", desc: "Your parcel moves through our express lane and arrives with a digital signature proof of delivery." },
  ],
  standard: [
    { title: "Create your shipment", desc: "Fill in sender and receiver details, confirm dimensions and weight, and choose a convenient pickup date." },
    { title: "We collect and sort", desc: "Your package enters our global hub network, sorted and routed through the most efficient path." },
    { title: "Door-to-door tracking", desc: "Follow every milestone from pickup to final delivery, with live map updates the whole way." },
  ],
  freight: [
    { title: "Request a quote", desc: "Share your cargo dimensions, origin, destination, and timeline — we'll propose the best routing option." },
    { title: "Specialist handling", desc: "Our freight team manages pickup, loading, documentation, and all required certifications for your cargo." },
    { title: "Full visibility", desc: "Track your freight across every leg — sea, air, or road — with a dedicated account manager on call." },
  ],
  international: [
    { title: "One booking, global reach", desc: "Enter your destination country and we calculate duties, taxes, and the fastest routing automatically." },
    { title: "Customs cleared", desc: "Our customs brokerage team handles all import/export documentation so your shipment clears every border." },
    { title: "Last-mile delivery", desc: "Local partner couriers ensure your package reaches the final address in 50+ countries worldwide." },
  ],
};

const TRUST_STATS = [
  { value: "98.7%", label: "On-time delivery" },
  { value: "50+", label: "Countries served" },
  { value: "48k+", label: "Shipments delivered" },
  { value: "24/7", label: "Support availability" },
];

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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const svc = SERVICES[slug];
  if (!svc) notFound();

  const Icon = ICONS[svc.icon] ?? Package;
  const images = SERVICE_IMAGES[slug] ?? SERVICE_IMAGES.express;
  const steps = SERVICE_STEPS[slug] ?? SERVICE_STEPS.express;
  const otherServices = SERVICE_LIST.filter((s) => s.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />

      {/* Hero — brand-navy with hero image */}
      <section className="relative bg-brand-navy px-4 text-white sm:px-6">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,109,0,0.12),transparent_45%,rgba(255,255,255,0.03))]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb */}
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase text-white/50 hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Services
            </Link>

            {/* Service icon */}
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${svc.accent}30`, border: `1px solid ${svc.accent}50` }}
            >
              <Icon className="h-7 w-7" style={{ color: svc.accent }} />
            </div>

            <p className="mb-3 text-sm font-black uppercase" style={{ color: svc.accent }}>
              {svc.tagline}
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl">{svc.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">{svc.description}</p>

            {/* Pricing + timing */}
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <div>
                <div className="text-3xl font-black text-brand-orange">{svc.price}</div>
                <div className="mt-1 text-xs font-bold uppercase text-white/40">Starting from</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-black">{svc.deliveryTime}</div>
                <div className="mt-1 text-xs font-bold uppercase text-white/40">Delivery time</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin/login"
                className="rounded-xl px-6 py-3 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
                style={{ background: svc.accent }}
              >
                Book {svc.name}
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-black text-white hover:bg-white/5 transition-colors"
              >
                Talk to an Expert
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          >
            <Image
              src={images.hero}
              alt={`${svc.name} service`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Trust stats bar */}
      <section className="border-b bg-muted/40 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: svc.accent }}>{stat.value}</div>
                <div className="mt-0.5 text-xs font-bold uppercase text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature section — image left, features right */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {/* Image */}
              <div className="relative min-h-[420px] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={images.feature}
                  alt={`${svc.name} operation`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 p-8 text-white">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur"
                    style={{ background: `${svc.accent}30` }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-white/80">Premium courier service</span>
                  </div>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-sm font-black uppercase text-brand-orange">What's included</p>
                  <h2 className="text-3xl font-black">
                    Everything you need, nothing you don't
                  </h2>
                </div>
                <p className="leading-8 text-muted-foreground">{svc.longDescription}</p>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: svc.accent }}
                      />
                      <span className="text-sm font-semibold">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick info cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground">Delivery</div>
                      <div className="text-sm font-black">{svc.deliveryTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground">Insurance</div>
                      <div className="text-sm font-black">Included</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground">Tracking</div>
                      <div className="text-sm font-black">Real-time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <HeadphonesIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground">Support</div>
                      <div className="text-sm font-black">24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-10 text-center">
            <p className="text-sm font-black uppercase text-brand-orange">The Experience</p>
            <h2 className="mt-2 text-3xl font-black">See it in action</h2>
            <p className="mt-2 text-muted-foreground">
              World-class logistics infrastructure, purpose-built for reliability.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {images.gallery.map((photo, i) => (
              <FadeUp key={photo} delay={i * 0.1}>
                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={photo}
                    alt={`${svc.name} in action`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-12 text-center">
            <p className="text-sm font-black uppercase text-brand-orange">How it works</p>
            <h2 className="mt-2 text-3xl font-black">Simple from start to finish</h2>
            <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
              From the moment you book to the moment it's delivered — every step is tracked, every hand-off confirmed.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.12}>
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-7 transition-shadow hover:shadow-lg">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-black"
                    style={{ background: svc.accent }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-black">{step.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{step.desc}</p>
                  <div
                    className="absolute right-0 top-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
                    style={{ background: svc.accent }}
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 py-20 sm:px-6">
        <FadeUp>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-brand-navy text-white lg:grid lg:grid-cols-[1fr_0.7fr]">
            <div className="p-10 sm:p-14">
              <PackageCheck className="mb-5 h-10 w-10 text-brand-orange" />
              <h2 className="text-3xl font-black sm:text-4xl">
                Ready to ship with {svc.name}?
              </h2>
              <p className="mt-4 max-w-md text-white/65">
                Create a shipment in minutes or speak with a logistics expert who can walk you through the best options for your exact needs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl px-6 py-3 text-sm font-black text-slate-950 transition-transform hover:-translate-y-0.5"
                  style={{ background: svc.accent }}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            <div className="relative min-h-72 w-full">
              <Image
                src={images.gallery[1]}
                alt="Logistics facility"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Other services */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black">Explore other services</h2>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-black text-primary">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {otherServices.map((other, i) => {
              const OtherIcon = ICONS[other.icon] ?? Package;
              const otherImages = SERVICE_IMAGES[other.slug] ?? SERVICE_IMAGES.express;
              return (
                <FadeUp key={other.slug} delay={i * 0.08}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group block overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={otherImages.hero}
                        alt={`${other.name} service`}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      <div
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ background: `${other.accent}25`, border: `1px solid ${other.accent}40` }}
                      >
                        <OtherIcon className="h-4 w-4" style={{ color: other.accent }} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-black">{other.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{other.tagline}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-black" style={{ color: other.accent }}>{other.price}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

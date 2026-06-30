"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = { Zap, Package, Truck, Globe };

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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
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
  const otherServices = SERVICE_LIST.filter((s) => s.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/services" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Services
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{svc.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="py-24 px-4 text-center text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${svc.accent}cc 0%, oklch(0.27 0.135 258) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-3">
            {svc.tagline}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{svc.name}</h1>
          <p className="text-lg text-white/75 leading-relaxed">{svc.description}</p>
          <div className="flex justify-center gap-8 mt-8">
            <div>
              <div className="text-2xl font-extrabold">{svc.price}</div>
              <div className="text-xs text-white/50 mt-0.5">Starting from</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-extrabold">{svc.deliveryTime}</div>
              <div className="text-xs text-white/50 mt-0.5">Delivery time</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Details */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Description */}
          <div className="md:col-span-2 space-y-8">
            <FadeUp>
              <div>
                <h2 className="text-xl font-bold mb-4">About {svc.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{svc.longDescription}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div>
                <h2 className="text-xl font-bold mb-5">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {svc.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: svc.accent }}
                      />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <FadeUp delay={0.15}>
              <div className="bg-card border rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-muted-foreground text-xs">Delivery Time</div>
                      <div className="font-medium">{svc.deliveryTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-muted-foreground text-xs">Insurance</div>
                      <div className="font-medium">Included in price</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-muted-foreground text-xs">Starting From</div>
                      <div className="font-semibold text-base" style={{ color: svc.accent }}>
                        {svc.price}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/admin/login"
                  className="block w-full text-center text-primary-foreground font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  style={{ background: svc.accent }}
                >
                  Book {svc.name} →
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="bg-muted/40 rounded-2xl p-6">
                <h3 className="font-semibold text-sm mb-3">Need help choosing?</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Our logistics experts can help you find the best service for your exact needs.
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Contact Sales →
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-8">
            <h2 className="text-xl font-bold">Explore Other Services</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherServices.map((other, i) => {
              const OtherIcon = ICONS[other.icon] ?? Package;
              return (
                <FadeUp key={other.slug} delay={i * 0.07}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group flex items-center gap-3 bg-card border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${other.accent}18` }}
                    >
                      <OtherIcon className="h-4 w-4" style={{ color: other.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{other.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{other.tagline}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
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

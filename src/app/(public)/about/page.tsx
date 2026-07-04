"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NavHeader } from "@/components/public/nav-header";
import { SiteFooter } from "@/components/public/site-footer";
import {
  Target,
  Eye,
  Heart,
  Zap,
  ShieldCheck,
  Globe,
  Users,
  Award,
} from "lucide-react";

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

const VALUES = [
  { icon: Zap, title: "Speed", desc: "We move fast — so your packages do too. Every process is optimized to eliminate delays." },
  { icon: Eye, title: "Transparency", desc: "No surprises. Real-time tracking keeps every stakeholder informed at all times." },
  { icon: ShieldCheck, title: "Reliability", desc: "We deliver on our promises. Our 98.7% on-time rate speaks louder than words." },
  { icon: Heart, title: "Care", desc: "We treat every package as if it were our own — with the attention and protection it deserves." },
  { icon: Globe, title: "Global Mindset", desc: "Borders are just lines on a map. We connect people and businesses worldwide." },
  { icon: Users, title: "Partnership", desc: "We grow alongside our clients, adapting our services to their evolving needs." },
];

const MILESTONES = [
  { year: "2019", event: "Founded in London by David Okafor & Sarah Chen, starting with a small team and a vision for transparent, technology-first logistics." },
  { year: "2020", event: "Launched our digital tracking platform — one of the first courier services with real-time GPS tracking and live status updates." },
  { year: "2021", event: "Expanded operations across Europe and the Americas, hiring our first 50 team members." },
  { year: "2022", event: "Partnered with global last-mile carriers to reach 30+ countries across 5 continents." },
  { year: "2023", event: "Reached 200+ employees, opened offices in New York and Dubai, and launched Freight services." },
  { year: "2024", event: "Processed our 100,000th shipment and expanded the network to 50+ countries worldwide." },
  { year: "2025", event: "Launched GOxpress Way 2.0 with AI-powered route optimisation and live map tracking." },
];

const ABOUT_PHOTO =
  "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=85";
const TEAM_PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=85",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />

      {/* Hero */}
      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2"
        >
          <div>
            <p className="mb-3 text-sm font-black uppercase text-brand-orange">
              Our Story
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl">
              Redefining logistics, one shipment at a time
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/70">
              GOxpress Way was born from a simple belief: courier services
              should be as fast, transparent, and reliable as the businesses
              they serve.
            </p>
          </div>
          <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <Image
              src={ABOUT_PHOTO}
              alt="Global freight yard"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeUp>
            <div className="bg-card border rounded-2xl p-8 h-full">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make global logistics accessible, transparent, and reliable for every business and individual — from an independent online seller to a multinational corporation — through technology-first courier services that put the customer in complete control.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-card border rounded-2xl p-8 h-full">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5">
                <Eye className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's most trusted logistics platform — a company where every package, every customer, and every delivery partner is treated with the highest standard of care, innovation, and professionalism, from local deliveries to global freight.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Company Story / Timeline */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              How We Got Here
            </p>
            <h2 className="text-3xl font-bold">The GOxpress Way Journey</h2>
          </FadeUp>

          <div className="relative">
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.06}>
                  <div className="flex gap-6">
                    <div className="w-[76px] shrink-0 text-right">
                      <span className="text-sm font-bold text-primary">{m.year}</span>
                    </div>
                    <div className="relative flex-1 pb-2">
                      <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              What We Stand For
            </p>
            <h2 className="text-3xl font-bold">Our Core Values</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.07}>
                <div className="bg-card border rounded-2xl p-6 h-full">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              The People Behind GOxpress Way
            </p>
            <h2 className="text-3xl font-bold">Leadership Team</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "David Okafor", role: "CEO & Co-Founder", initials: "DO", color: "oklch(0.27 0.135 258)" },
              { name: "Sarah Chen", role: "CTO & Co-Founder", initials: "SC", color: "#7c3aed" },
              { name: "Amara Nwosu", role: "Chief Operations Officer", initials: "AN", color: "#16a34a" },
              { name: "James Adeyemi", role: "VP of Global Partnerships", initials: "JA", color: "#d97706" },
            ].map((member, i) => (
              <FadeUp key={member.name} delay={i * 0.08}>
                <div className="overflow-hidden rounded-xl border bg-card text-center shadow-sm">
                  <div className="relative h-56 w-full">
                    <Image
                      src={TEAM_PHOTOS[i]}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                  <div className="font-semibold">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="h-8 w-8 text-amber-500" />
              <h2 className="text-2xl font-bold">Recognised for Excellence</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[
                { award: "Best Logistics Tech Company", org: "Global Tech Awards 2023" },
                { award: "Top 50 Fastest-Growing Startups", org: "TechCrunch Disrupt 2022" },
                { award: "Customer Excellence Award", org: "International Business Awards 2024" },
              ].map((a, i) => (
                <FadeUp key={a.award} delay={i * 0.1}>
                  <div className="bg-card border rounded-2xl p-6">
                    <div className="text-amber-500 text-2xl mb-2">🏆</div>
                    <div className="font-semibold text-sm">{a.award}</div>
                    <div className="text-xs text-muted-foreground mt-1">{a.org}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <FadeUp>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Want to work with us?</h2>
            <p className="text-muted-foreground mb-6">
              Whether you need to ship a package or explore a partnership, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="border font-semibold px-6 py-2.5 rounded-xl hover:bg-accent transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { BarChart3, Globe2, PackageCheck, ShieldCheck } from "lucide-react";

const AUTH_PHOTO =
  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=85";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-brand-navy text-white lg:block">
        <img
          src={AUTH_PHOTO}
          alt="Warehouse operations dashboard"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,23,48,0.96),rgba(8,23,48,0.74)_55%,rgba(255,109,0,0.32))]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-lg bg-white text-slate-950">
              <PackageCheck className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-sm bg-brand-orange" />
            </span>
            <span className="text-xl font-black">
              GO<span className="text-brand-orange">xpress</span> Way
            </span>
          </Link>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-black uppercase text-brand-orange">
              Admin operations portal
            </p>
            <h1 className="text-5xl font-black leading-tight">
              Control every shipment from one secure desk.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/68">
              Manage bookings, timelines, shipment exceptions, analytics, and
              audit logs with a focused logistics command center.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: "Secure access" },
              { icon: BarChart3, label: "Live metrics" },
              { icon: Globe2, label: "Global routes" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
                <Icon className="mb-3 h-5 w-5 text-brand-orange" />
                <div className="text-sm font-black">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";
import { Mail, MapPin, PackageCheck, Phone } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="mb-5 flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-lg bg-white text-slate-950">
              <PackageCheck className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-sm bg-brand-orange" />
            </span>
            <span className="text-xl font-black">
              GO<span className="text-brand-orange">xpress</span> Way
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-7 text-white/65">
            Premium courier, freight, and international logistics with live
            shipment visibility from dispatch to doorstep.
          </p>
          <div className="mt-6 grid max-w-sm grid-cols-3 overflow-hidden rounded-lg border border-white/10">
            {[
              ["98.7%", "On time"],
              ["50+", "Countries"],
              ["24/7", "Support"],
            ].map(([value, label]) => (
              <div key={label} className="border-r border-white/10 p-4 last:border-0">
                <div className="text-lg font-black text-brand-orange">{value}</div>
                <div className="text-[11px] font-semibold uppercase text-white/45">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase text-white/90">Services</h3>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              ["Express Delivery", "/services/express"],
              ["Standard Shipping", "/services/standard"],
              ["Freight Services", "/services/freight"],
              ["International Shipping", "/services/international"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-brand-orange">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase text-white/90">Company</h3>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Track Package", "/"],
              ["Admin Portal", "/admin/login"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-brand-orange">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase text-white/90">Reach Us</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>20 Finsbury Square, London EC2A 1AF</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>+44 20 7946 0022</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>support@goxpressway.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Copyright {year} GOxpress Way Ltd. All rights reserved.</span>
          <span>Registered in England and Wales. Company No. 11924571</span>
        </div>
      </div>
    </footer>
  );
}

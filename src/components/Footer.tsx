import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Lazeez Gourmet"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-semibold text-lg tracking-wide">
                LAZEEZ GOURMET
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing the tastiest culinary treasures from the kitchens
              of the Middle East to the Maldives.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com/lazeezgourmet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/lazeezgourmet/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gold mb-4 uppercase text-sm tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/#about", label: "About" },
                { href: "/menu", label: "Menu" },
                { href: "/#gallery", label: "Gallery" },
                { href: "/#contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gold mb-4 uppercase text-sm tracking-wider">
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+9607782460"
                className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone size={16} />
                +960 778 2460
              </a>
              <a
                href="tel:+9603350505"
                className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <Phone size={16} />
                +960 335 0505
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                H. Thiyara, Male&apos; 20081, Maldives
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-gold mb-4 uppercase text-sm tracking-wider">
              Opening Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock size={16} className="shrink-0" />
                <div>
                  <p>SAT - THU</p>
                  <p className="text-white">12:00 PM - 12:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock size={16} className="shrink-0" />
                <div>
                  <p>FRIDAY</p>
                  <p className="text-white">3:00 PM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lazeez Gourmet. All rights reserved.</p>
          <p className="mt-1 text-xs">
            All bills are subject to a 10% service charge and 8% GST.
          </p>
        </div>
      </div>
    </footer>
  );
}

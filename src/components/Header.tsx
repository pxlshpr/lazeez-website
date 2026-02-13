"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ReservationModal } from "./ReservationModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsOpen: setCartOpen } = useCart();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showSolidBg = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBg
          ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg dark:shadow-neutral-950/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Lazeez Gourmet"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span
              className={`font-semibold text-lg tracking-wide transition-colors ${
                showSolidBg
                  ? "text-burgundy"
                  : "text-white"
              }`}
            >
              LAZEEZ GOURMET
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold ${
                  showSolidBg
                    ? "text-charcoal dark:text-neutral-200"
                    : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                showSolidBg
                  ? "text-charcoal-light dark:text-neutral-400 hover:text-charcoal dark:hover:text-white"
                  : "text-white/70 hover:text-white"
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-burgundy text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setReserveOpen(true)}
              className="bg-burgundy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-dark transition-colors"
            >
              Reserve
            </button>
          </nav>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart mobile */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-2 transition-colors ${
                showSolidBg
                  ? "text-charcoal-light dark:text-neutral-400"
                  : "text-white/70"
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-burgundy text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${
                showSolidBg
                  ? "text-charcoal dark:text-neutral-200"
                  : "text-white"
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-cream-dark dark:border-neutral-700">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-charcoal dark:text-neutral-200 hover:text-burgundy py-3 px-4 rounded-lg hover:bg-cream dark:hover:bg-neutral-800 text-sm font-medium tracking-wide uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                setReserveOpen(true);
              }}
              className="bg-burgundy text-white px-5 py-3 rounded-full text-sm font-medium text-center mt-2 hover:bg-burgundy-dark transition-colors"
            >
              Reserve a Table
            </button>
          </nav>
        </div>
      )}
      <ReservationModal isOpen={reserveOpen} onClose={() => setReserveOpen(false)} />
    </header>
  );
}

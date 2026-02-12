"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
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
                scrolled ? "text-burgundy" : "text-white"
              }`}
            >
              LAZEEZ GOURMET
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold ${
                  scrolled ? "text-charcoal" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/9607782460"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-burgundy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-dark transition-colors"
            >
              Reserve
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? "text-charcoal" : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-cream-dark">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-charcoal hover:text-burgundy py-3 px-4 rounded-lg hover:bg-cream text-sm font-medium tracking-wide uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/9607782460"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-burgundy text-white px-5 py-3 rounded-full text-sm font-medium text-center mt-2 hover:bg-burgundy-dark transition-colors"
            >
              Reserve a Table
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

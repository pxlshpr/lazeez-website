"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ReservationModal } from "./ReservationModal";

const slides = [
  "/images/gallery/lazeez_1.jpg",
  "/images/gallery/lazeez_3.jpg",
  "/images/gallery/lazeez_7.jpg",
  "/images/gallery/lazeez_11.jpg",
  "/images/gallery/lazeez_13.jpg",
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [reserveOpen, setReserveOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background slides */}
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="Lazeez Gourmet cuisine"
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm">
            Authentic Middle Eastern Cuisine
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
            A Taste of the
            <br />
            <span className="text-gold-light">Middle East</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Traditional cooking techniques meet natural, quality ingredients
            &mdash; transported from the heart of Palestine to the Maldives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/menu"
              className="bg-burgundy text-white px-8 py-3.5 rounded-full font-medium hover:bg-burgundy-dark transition-colors text-sm uppercase tracking-wider"
            >
              Explore Our Menu
            </Link>
            <button
              onClick={() => setReserveOpen(true)}
              className="border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors text-sm uppercase tracking-wider"
            >
              Reserve a Table
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          className="absolute bottom-8 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </a>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-gold w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
    <ReservationModal isOpen={reserveOpen} onClose={() => setReserveOpen(false)} />
    </>

  );
}

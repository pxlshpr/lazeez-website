"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/gallery/lazeez_1.jpg",
  "/images/gallery/lazeez_2.jpg",
  "/images/gallery/lazeez_3.jpg",
  "/images/gallery/lazeez_4.jpg",
  "/images/gallery/lazeez_5.jpg",
  "/images/gallery/lazeez_6.jpg",
  "/images/gallery/lazeez_7.jpg",
  "/images/gallery/lazeez_8.jpg",
  "/images/gallery/lazeez_9.jpg",
  "/images/gallery/lazeez_10.jpg",
  "/images/gallery/lazeez_11.jpg",
  "/images/gallery/lazeez_13.jpg",
];

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-burgundy font-medium tracking-[0.2em] uppercase text-sm mb-3">
            Visual Journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
            Our Gallery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 || i === 5
                  ? "md:col-span-2 md:row-span-2 aspect-square"
                  : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`Lazeez Gourmet gallery ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
          >
            <X size={32} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 text-white/80 hover:text-white z-10"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-4 text-white/80 hover:text-white z-10"
          >
            <ChevronRight size={40} />
          </button>
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={images[lightbox]}
              alt="Gallery"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

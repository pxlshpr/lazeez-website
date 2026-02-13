"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type FeaturedItem = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export function FeaturedDishes() {
  const featured = useQuery(api.menu.getFeaturedItems) as FeaturedItem[] | undefined;

  return (
    <section className="py-24 bg-cream dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-burgundy font-medium tracking-[0.2em] uppercase text-sm mb-3">
            Our Specialties
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal dark:text-white">
            Featured Dishes
          </h2>
        </div>

        {!featured ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-burgundy" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dish) => {
              const displayName = dish.name
                .replace(/\s*\(Veg\)/i, "")
                .replace(/\s*\(veg\)/i, "");
              const hasImage = dish.imageUrl && !dish.imageUrl.includes("logo.png");

              return (
                <div
                  key={dish._id}
                  className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-neutral-950/20 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {hasImage ? (
                      <Image
                        src={dish.imageUrl!}
                        alt={displayName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-cream dark:bg-neutral-800 flex items-center justify-center">
                        <span className="text-charcoal-light dark:text-neutral-500 text-sm">
                          No image
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-burgundy text-white text-sm font-semibold px-3 py-1 rounded-full">
                      MVR {dish.price.toFixed(0)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-charcoal dark:text-white text-lg mb-1">
                      {displayName}
                    </h3>
                    {dish.description && (
                      <p className="text-charcoal-light dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-block bg-burgundy text-white px-8 py-3.5 rounded-full font-medium hover:bg-burgundy-dark transition-colors text-sm uppercase tracking-wider"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

const featured = [
  {
    name: "Mezze Platter",
    description: "A vibrant selection of hummus, moutabal, fattoush, warak enab & marinated olives",
    price: "170",
    image: "/images/gallery/lazeez_4.jpg",
  },
  {
    name: "Mixed Shawarma Platter",
    description: "Grilled chicken & lamb in pita with labneh, thoum, and pickles",
    price: "170",
    image: "/images/gallery/lazeez_6.jpg",
  },
  {
    name: "Lazeez Mixed Grill",
    description: "An assortment of our finest grilled meats with aromatic sides",
    price: "320",
    image: "/images/gallery/lazeez_8.jpg",
  },
  {
    name: "Kunafa n' Kream",
    description: "Crispy shredded phyllo with sweet cream cheese and sugar syrup",
    price: "129",
    image: "/images/gallery/lazeez_5.jpg",
  },
];

export function FeaturedDishes() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((dish) => (
            <div
              key={dish.name}
              className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-neutral-950/20 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-burgundy text-white text-sm font-semibold px-3 py-1 rounded-full">
                  MVR {dish.price}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-charcoal dark:text-white text-lg mb-1">
                  {dish.name}
                </h3>
                <p className="text-charcoal-light dark:text-neutral-400 text-sm leading-relaxed">
                  {dish.description}
                </p>
              </div>
            </div>
          ))}
        </div>

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

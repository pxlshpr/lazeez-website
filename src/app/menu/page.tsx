"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Leaf } from "lucide-react";
import { categories, getMenuItems, getAllMenuItems, type MenuItem } from "@/lib/menu-data";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("levant_flavours");
  const [searchQuery, setSearchQuery] = useState("");

  const items = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return getAllMenuItems().filter((item) =>
        item.name.toLowerCase().includes(q)
      );
    }
    return getMenuItems(activeCategory);
  }, [activeCategory, searchQuery]);

  const isVeg = (name: string) =>
    name.toLowerCase().includes("(veg)") || name.toLowerCase().includes("(vegetarian)");

  return (
    <>
      <div className="pt-20 min-h-screen bg-cream">
        {/* Header */}
        <div className="bg-burgundy text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gold font-medium tracking-[0.2em] uppercase text-sm mb-3">
              Lazeez Gourmet
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-white/70 max-w-lg mx-auto">
              All bills are subject to a 10% service charge and 8% GST
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto mt-8">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light"
                size={18}
              />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-charcoal text-sm placeholder:text-charcoal-light/60 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="sticky top-20 z-30 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
              <div className="flex gap-1 py-3 min-w-max">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === cat.slug
                        ? "bg-burgundy text-white"
                        : "text-charcoal-light hover:bg-cream"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {searchQuery && (
            <p className="text-charcoal-light mb-6">
              {items.length} result{items.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: MenuItem) => (
              <MenuCard key={item.id} item={item} isVeg={isVeg(item.name)} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20">
              <p className="text-charcoal-light text-lg">
                No dishes found. Try a different search.
              </p>
            </div>
          )}
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
}

function MenuCard({ item, isVeg }: { item: MenuItem; isVeg: boolean }) {
  const hasImage = item.image && !item.image.includes("logo.png");
  const displayName = item.name.replace(/\s*\(Veg\)/i, "").replace(/\s*\(veg\)/i, "");

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-[120px]">
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-charcoal text-[15px] leading-snug flex-1">
              {displayName}
            </h3>
            {isVeg && (
              <Leaf size={14} className="text-green-600 shrink-0 mt-0.5" />
            )}
          </div>
          {item.description && (
            <p className="text-charcoal-light text-xs mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <p className="text-burgundy font-semibold text-sm">
          MVR {item.price.toFixed(2)}
        </p>
      </div>
      {hasImage && (
        <div className="relative w-[120px] shrink-0">
          <Image
            src={item.image!}
            alt={displayName}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>
      )}
    </div>
  );
}

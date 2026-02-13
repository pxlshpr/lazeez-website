"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Leaf, Loader2, Plus, ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { useCart } from "@/context/CartContext";

type ConvexMenuItem = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  subcategoryId?: string;
  imageUrl?: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

type ConvexCategory = {
  _id: string;
  slug: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
};

type ConvexSubcategory = {
  _id: string;
  categoryId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export default function MenuPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [detailItem, setDetailItem] = useState<ConvexMenuItem | null>(null);
  const subcatScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingTo = useRef(false);

  const categories = useQuery(api.menu.getCategories) as
    | ConvexCategory[]
    | undefined;
  const allItems = useQuery(api.menu.getAllItems) as
    | ConvexMenuItem[]
    | undefined;

  const activeId = activeCategoryId ?? categories?.[0]?._id ?? null;

  const subcategories = useQuery(
    api.menu.getSubcategories,
    activeId ? { categoryId: activeId as never } : "skip"
  ) as ConvexSubcategory[] | undefined;

  const hasSubcategories =
    subcategories && subcategories.length > 0 && !searchQuery;

  // Reset active subcategory when category changes
  useEffect(() => {
    setActiveSubcategoryId(null);
  }, [activeId]);

  // Items for current view
  const items = useMemo(() => {
    if (!allItems) return [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (!activeId) return allItems;
    return allItems.filter((item) => item.categoryId === activeId);
  }, [allItems, activeId, searchQuery]);

  // Group items by subcategory (always show all - subcategories are jump links, not filters)
  const groupedItems = useMemo(() => {
    if (!hasSubcategories || !subcategories) return null;

    const groups: { subcategory: ConvexSubcategory; items: ConvexMenuItem[] }[] =
      [];
    for (const sub of subcategories) {
      const subItems = items.filter((i) => i.subcategoryId === sub._id);
      if (subItems.length > 0) {
        groups.push({ subcategory: sub, items: subItems });
      }
    }

    const ungrouped = items.filter((i) => !i.subcategoryId);
    if (ungrouped.length > 0) {
      groups.push({
        subcategory: {
          _id: "other",
          categoryId: activeId!,
          name: "Other",
          sortOrder: 999,
          isActive: true,
        },
        items: ungrouped,
      });
    }

    return groups;
  }, [items, subcategories, hasSubcategories, activeId]);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    if (!groupedItems || groupedItems.length === 0) return;

    const elements = groupedItems
      .map((g) => document.getElementById(`section-${g.subcategory._id}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "");
            setActiveSubcategoryId(id);
          }
        }
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groupedItems]);

  // Scroll to a subcategory section
  const scrollToSection = useCallback((subId: string) => {
    const el = document.getElementById(`section-${subId}`);
    if (!el) return;
    isScrollingTo.current = true;
    setActiveSubcategoryId(subId);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isScrollingTo.current = false;
    }, 1000);
  }, []);

  // Auto-scroll the active pill into view
  useEffect(() => {
    if (!activeSubcategoryId || !subcatScrollRef.current) return;
    const pill = subcatScrollRef.current.querySelector(
      `[data-sub="${activeSubcategoryId}"]`
    ) as HTMLElement | null;
    if (pill) {
      pill.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSubcategoryId]);

  const loading = !categories || !allItems;

  return (
    <>
      <div className="pt-20 min-h-screen bg-cream dark:bg-neutral-950">
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

        {/* Combined sticky nav: category dropdown + subcategory jump-links */}
        {!searchQuery && categories && (
          <div className="sticky top-20 z-30 bg-white dark:bg-neutral-900 shadow-sm dark:shadow-neutral-950/20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 py-2.5">
                {/* Category dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={activeId || ""}
                    onChange={(e) => setActiveCategoryId(e.target.value)}
                    className="appearance-none bg-burgundy text-white pl-4 pr-8 py-2 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none"
                    size={14}
                  />
                </div>

                {/* Subcategory jump-links */}
                {hasSubcategories && (
                  <>
                    <div className="w-px h-6 bg-cream-dark dark:bg-neutral-700 shrink-0" />
                    <div
                      ref={subcatScrollRef}
                      className="overflow-x-auto flex-1 min-w-0 scrollbar-hide"
                    >
                      <div className="flex gap-1.5 min-w-max">
                        {subcategories.map((sub) => (
                          <button
                            key={sub._id}
                            data-sub={sub._id}
                            onClick={() => scrollToSection(sub._id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                              activeSubcategoryId === sub._id
                                ? "bg-charcoal dark:bg-white text-white dark:text-charcoal"
                                : "text-charcoal-light dark:text-neutral-400 hover:bg-cream dark:hover:bg-neutral-800"
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-burgundy" size={32} />
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="text-charcoal-light dark:text-neutral-400 mb-6">
                  {items.length} result{items.length !== 1 ? "s" : ""} for
                  &ldquo;{searchQuery}&rdquo;
                </p>
              )}

              {groupedItems ? (
                // All items grouped by subcategory with section anchors
                <div className="space-y-10">
                  {groupedItems.map((group) => (
                    <div
                      key={group.subcategory._id}
                      id={`section-${group.subcategory._id}`}
                      style={{ scrollMarginTop: "180px" }}
                    >
                      <h2 className="text-xl font-bold text-burgundy mb-4">
                        {group.subcategory.name}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.items.map((item) => (
                          <MenuCard
                            key={item._id}
                            item={item}
                            onTap={() => setDetailItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Flat list (search results or categories without subcategories)
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <MenuCard
                      key={item._id}
                      item={item}
                      onTap={() => setDetailItem(item)}
                    />
                  ))}
                </div>
              )}

              {items.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-charcoal-light dark:text-neutral-500 text-lg">
                    No dishes found. Try a different search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <WhatsAppButton />
      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
      />
    </>
  );
}

function MenuCard({
  item,
  onTap,
}: {
  item: ConvexMenuItem;
  onTap: () => void;
}) {
  const { addItem } = useCart();
  const hasImage = item.imageUrl && !item.imageUrl.includes("logo.png");
  const displayName = item.name
    .replace(/\s*\(Veg\)/i, "")
    .replace(/\s*\(veg\)/i, "");

  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-neutral-950/20 transition-shadow flex h-[120px] cursor-pointer"
      onClick={onTap}
    >
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-charcoal dark:text-white text-[15px] leading-snug flex-1">
              {displayName}
            </h3>
            {item.isVegetarian && (
              <Leaf size={14} className="text-green-600 shrink-0 mt-0.5" />
            )}
          </div>
          {item.description && (
            <p className="text-charcoal-light dark:text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-burgundy font-semibold text-sm">
            MVR {item.price.toFixed(2)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(item);
            }}
            className="w-7 h-7 rounded-full bg-burgundy text-white flex items-center justify-center hover:bg-burgundy-dark transition-colors shrink-0"
            aria-label={`Add ${displayName} to pre-order`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      {hasImage && (
        <div className="relative w-[120px] shrink-0">
          <Image
            src={item.imageUrl!}
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

"use client";

import Image from "next/image";
import { X, Leaf, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

type MenuItem = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isSpicy: boolean;
};

export function ItemDetailModal({
  item,
  onClose,
}: {
  item: MenuItem | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();

  if (!item) return null;

  const displayName = item.name
    .replace(/\s*\(Veg\)/i, "")
    .replace(/\s*\(veg\)/i, "");
  const hasImage = item.imageUrl && !item.imageUrl.includes("logo.png");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image */}
        {hasImage && (
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={item.imageUrl!}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-start gap-2 mb-3">
            <h2 className="text-xl font-bold text-charcoal dark:text-white flex-1">
              {displayName}
            </h2>
            {item.isVegetarian && (
              <Leaf size={18} className="text-green-600 shrink-0 mt-1" />
            )}
          </div>

          {item.description && (
            <p className="text-charcoal-light dark:text-neutral-400 text-sm leading-relaxed mb-4">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-cream-dark dark:border-neutral-700">
            <p className="text-burgundy font-bold text-lg">
              MVR {item.price.toFixed(2)}
            </p>
            <button
              onClick={() => {
                addItem(item);
                onClose();
              }}
              className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-dark transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add to Pre-Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

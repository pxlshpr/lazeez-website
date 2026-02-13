"use client";

import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

export function Toast() {
  const { toast } = useCart();

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        toast
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="bg-charcoal dark:bg-white text-white dark:text-charcoal px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium whitespace-nowrap">
        <Check size={16} className="text-green-400 dark:text-green-600" />
        {toast}
      </div>
    </div>
  );
}

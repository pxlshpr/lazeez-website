"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2, MessageCircle, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartModal() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    serviceCharge,
    gst,
    total,
  } = useCart();

  if (!isOpen) return null;

  const formatMessage = () => {
    let msg = "*Lazeez Gourmet - Pre-Order*\n\n";
    items.forEach((item) => {
      const displayName = item.name
        .replace(/\s*\(Veg\)/i, "")
        .replace(/\s*\(veg\)/i, "");
      const lineTotal = item.price * item.quantity;
      msg += `\u2022 ${displayName}${item.isVegetarian ? " (Veg)" : ""}\n`;
      msg += `  Qty: ${item.quantity} \u00d7 MVR ${item.price.toFixed(2)} = MVR ${lineTotal.toFixed(2)}\n`;
    });
    msg += `\nSubtotal: MVR ${subtotal.toFixed(2)}`;
    msg += `\nService Charge (10%): MVR ${serviceCharge.toFixed(2)}`;
    msg += `\nGST (8%): MVR ${gst.toFixed(2)}`;
    msg += `\n*Grand Total: MVR ${total.toFixed(2)}*`;
    return msg;
  };

  const whatsappUrl = `https://wa.me/9607782460?text=${encodeURIComponent(formatMessage())}`;
  const viberUrl = `viber://forward?text=${encodeURIComponent(formatMessage())}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-dark dark:border-neutral-700">
          <h2 className="text-lg font-bold text-charcoal dark:text-white">
            Pre-Order ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-charcoal-light dark:text-neutral-400 hover:text-charcoal dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-light dark:text-neutral-500 text-sm">
                Your cart is empty
              </p>
            </div>
          ) : (
            items.map((item) => {
              const displayName = item.name
                .replace(/\s*\(Veg\)/i, "")
                .replace(/\s*\(veg\)/i, "");
              const hasImage =
                item.imageUrl && !item.imageUrl.includes("logo.png");
              return (
                <div key={item._id} className="flex gap-3 items-center">
                  {hasImage && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl!}
                        alt={displayName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-charcoal-light dark:text-neutral-400">
                      MVR {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-full border border-cream-dark dark:border-neutral-600 flex items-center justify-center text-charcoal-light dark:text-neutral-400 hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-charcoal dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-full border border-cream-dark dark:border-neutral-600 flex items-center justify-center text-charcoal-light dark:text-neutral-400 hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-charcoal dark:text-white w-20 text-right">
                    MVR {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-charcoal-light dark:text-neutral-500 hover:text-red-500 transition-colors ml-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Totals & Actions */}
        {items.length > 0 && (
          <div className="border-t border-cream-dark dark:border-neutral-700 p-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-light dark:text-neutral-400">
                <span>Subtotal</span>
                <span>MVR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light dark:text-neutral-400">
                <span>Service Charge (10%)</span>
                <span>MVR {serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light dark:text-neutral-400">
                <span>GST (8%)</span>
                <span>MVR {gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal dark:text-white font-bold text-base pt-2 border-t border-cream-dark dark:border-neutral-700">
                <span>Grand Total</span>
                <span>MVR {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Send buttons */}
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25d366] text-white py-3 rounded-full text-sm font-medium text-center hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href={viberUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#7360f2] text-white py-3 rounded-full text-sm font-medium text-center hover:bg-[#6050d8] transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Viber
              </a>
            </div>

            <button
              onClick={clearCart}
              className="w-full text-charcoal-light dark:text-neutral-500 text-sm hover:text-red-500 transition-colors py-2"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

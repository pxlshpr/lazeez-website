"use client";

import { useState } from "react";
import { X, Phone, MessageCircle, Users, Calendar, Armchair } from "lucide-react";

export function ReservationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [pax, setPax] = useState(2);
  const [windowSeat, setWindowSeat] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("choose");
    setDate("");
    setTime("19:00");
    setPax(2);
    setWindowSeat(false);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sendWhatsApp = () => {
    const formattedDate = formatDate(date);
    let msg = `Hi, I'd like to make a reservation.\n\n`;
    msg += `Date: ${formattedDate}\n`;
    msg += `Time: ${time}\n`;
    msg += `Guests: ${pax}\n`;
    msg += `Window seat: ${windowSeat ? "Yes, please" : "No preference"}`;
    const url = `https://wa.me/9607782460?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    handleClose();
  };

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-neutral-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-dark dark:border-neutral-700">
          <h2 className="text-lg font-bold text-charcoal dark:text-white">
            {step === "choose" ? "Reserve a Table" : "Reservation Details"}
          </h2>
          <button
            onClick={handleClose}
            className="text-charcoal-light dark:text-neutral-400 hover:text-charcoal dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {step === "choose" ? (
          <div className="p-5 space-y-3">
            <p className="text-charcoal-light dark:text-neutral-400 text-sm mb-4">
              How would you like to make your reservation?
            </p>
            <button
              onClick={() => setStep("form")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-cream-dark dark:border-neutral-700 hover:border-burgundy dark:hover:border-burgundy transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#25d366]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="text-[#25d366]" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-charcoal dark:text-white text-sm">
                  Message on WhatsApp
                </p>
                <p className="text-charcoal-light dark:text-neutral-400 text-xs">
                  Pick a date and we&apos;ll prefill your message
                </p>
              </div>
            </button>
            <a
              href="tel:+9607782460"
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-cream-dark dark:border-neutral-700 hover:border-burgundy dark:hover:border-burgundy transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
                <Phone className="text-burgundy" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-charcoal dark:text-white text-sm">
                  Call us directly
                </p>
                <p className="text-charcoal-light dark:text-neutral-400 text-xs">
                  +960 778 2460
                </p>
              </div>
            </a>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-white mb-2">
                <Calendar size={16} className="text-burgundy" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-neutral-700 bg-white dark:bg-neutral-800 text-charcoal dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>

            {/* Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-white mb-2">
                <Calendar size={16} className="text-burgundy" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-dark dark:border-neutral-700 bg-white dark:bg-neutral-800 text-charcoal dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>

            {/* Pax */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-white mb-2">
                <Users size={16} className="text-burgundy" />
                Number of Guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPax(Math.max(1, pax - 1))}
                  className="w-10 h-10 rounded-full border border-cream-dark dark:border-neutral-700 flex items-center justify-center text-charcoal dark:text-white hover:border-burgundy transition-colors text-lg"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-charcoal dark:text-white w-8 text-center">
                  {pax}
                </span>
                <button
                  onClick={() => setPax(Math.min(20, pax + 1))}
                  className="w-10 h-10 rounded-full border border-cream-dark dark:border-neutral-700 flex items-center justify-center text-charcoal dark:text-white hover:border-burgundy transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Window Seat */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal dark:text-white mb-2">
                <Armchair size={16} className="text-burgundy" />
                Window Seat
              </label>
              <button
                onClick={() => setWindowSeat(!windowSeat)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  windowSeat ? "bg-burgundy" : "bg-cream-dark dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    windowSeat ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={sendWhatsApp}
              disabled={!date}
              className="w-full bg-[#25d366] text-white py-3 rounded-full text-sm font-medium hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle size={18} />
              Send via WhatsApp
            </button>

            <button
              onClick={() => setStep("choose")}
              className="w-full text-charcoal-light dark:text-neutral-500 text-sm py-2 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

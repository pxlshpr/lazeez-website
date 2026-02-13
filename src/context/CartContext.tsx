"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  quantity: number;
};

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toast: string | null;
  itemCount: number;
  subtotal: number;
  serviceCharge: number;
  gst: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    const displayName = item.name
      .replace(/\s*\(Veg\)/i, "")
      .replace(/\s*\(veg\)/i, "");
    showToast(`${displayName} added to cart!`);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const serviceCharge = subtotal * 0.1;
  const gst = subtotal * 0.08;
  const total = subtotal + serviceCharge + gst;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        toast,
        itemCount,
        subtotal,
        serviceCharge,
        gst,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

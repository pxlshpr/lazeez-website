export type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
};

export type MenuCategory = {
  slug: string;
  label: string;
  subcategories?: string[];
};

export const categories: MenuCategory[] = [
  {
    slug: "levant_flavours",
    label: "Levant Flavours",
    subcategories: [
      "Breakfast",
      "Cold Mezze",
      "Hot Mezze",
      "Salads",
      "Soup",
      "Shawarmas & Wraps",
      "From the Grill",
      "Oriental Dishes",
      "Sawani",
      "Advance Order",
      "Sides",
    ],
  },
  { slug: "all_day_eats", label: "All Day Eats" },
  { slug: "thirsty", label: "Thirsty" },
  { slug: "sweet_endings", label: "Sweet Endings" },
  { slug: "high_tea", label: "High Tea" },
];

// Static menu data extracted from lazeez.mv
import rawMenu from "@/data/menu.json";

const menuRecord = rawMenu as Record<string, MenuItem>;

export function getMenuItems(category?: string): MenuItem[] {
  const items = Object.values(menuRecord);
  if (!category) return items;
  return items.filter((item) => item.category === category);
}

export function getAllMenuItems(): MenuItem[] {
  return Object.values(menuRecord);
}

export function searchMenu(query: string): MenuItem[] {
  const q = query.toLowerCase();
  return Object.values(menuRecord).filter((item) =>
    item.name.toLowerCase().includes(q)
  );
}

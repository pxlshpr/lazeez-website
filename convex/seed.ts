import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const SETTINGS = [
  { key: "phone_primary", value: "+960 778 2460" },
  { key: "phone_secondary", value: "+960 335 0505" },
  { key: "whatsapp", value: "9607782460" },
  { key: "email", value: "info@lazeez.mv" },
  { key: "address", value: "H. Thiyara, Male' 20081, Maldives" },
  { key: "facebook", value: "https://facebook.com/lazeezgourmet" },
  { key: "instagram", value: "https://instagram.com/lazeezgourmet/" },
  { key: "service_charge", value: "10" },
  { key: "gst", value: "8" },
];

const HOURS = [
  { dayOfWeek: 0, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Sunday" },
  { dayOfWeek: 1, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Monday" },
  { dayOfWeek: 2, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Tuesday" },
  { dayOfWeek: 3, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Wednesday" },
  { dayOfWeek: 4, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Thursday" },
  { dayOfWeek: 5, openTime: "15:00", closeTime: "00:00", isClosed: false, label: "Friday" },
  { dayOfWeek: 6, openTime: "12:00", closeTime: "00:00", isClosed: false, label: "Saturday" },
];

const SUBCATEGORIES = [
  "Breakfast", "Cold Mezze", "Hot Mezze", "Salads", "Soup",
  "Shawarmas & Wraps", "From the Grill", "Oriental Dishes",
  "Sawani", "Advance Order", "Sides",
];

export const seedStructure = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("categories").first();
    if (existing) return { status: "already_seeded" };

    // Categories
    const catIds: Record<string, string> = {};
    const cats = [
      { slug: "levant_flavours", label: "Levant Flavours", sortOrder: 1 },
      { slug: "all_day_eats", label: "All Day Eats", sortOrder: 2 },
      { slug: "thirsty", label: "Thirsty", sortOrder: 3 },
      { slug: "sweet_endings", label: "Sweet Endings", sortOrder: 4 },
      { slug: "high_tea", label: "High Tea", sortOrder: 5 },
    ];
    for (const cat of cats) {
      const id = await ctx.db.insert("categories", { ...cat, isActive: true });
      catIds[cat.slug] = id;
    }

    // Subcategories
    const levantId = catIds["levant_flavours"];
    for (let i = 0; i < SUBCATEGORIES.length; i++) {
      await ctx.db.insert("subcategories", {
        categoryId: levantId as never,
        name: SUBCATEGORIES[i],
        sortOrder: i + 1,
        isActive: true,
      });
    }

    // Settings
    for (const s of SETTINGS) {
      await ctx.db.insert("siteSettings", s);
    }

    // Hours
    for (const h of HOURS) {
      await ctx.db.insert("operatingHours", h);
    }

    return { status: "seeded", categoryIds: catIds };
  },
});

export const insertMenuItemsBatch = internalMutation({
  args: {
    items: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        categorySlug: v.string(),
        imageUrl: v.optional(v.string()),
        isVegetarian: v.boolean(),
        isSpicy: v.boolean(),
        sortOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Look up category IDs
    const categories = await ctx.db.query("categories").collect();
    const catMap = new Map(categories.map((c) => [c.slug, c._id]));

    let count = 0;
    for (const item of args.items) {
      const categoryId = catMap.get(item.categorySlug);
      if (!categoryId) continue;

      await ctx.db.insert("menuItems", {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId,
        imageUrl: item.imageUrl,
        isVegetarian: item.isVegetarian,
        isSpicy: item.isSpicy,
        isAvailable: true,
        isFeatured: false,
        sortOrder: item.sortOrder,
      });
      count++;
    }
    return { inserted: count };
  },
});

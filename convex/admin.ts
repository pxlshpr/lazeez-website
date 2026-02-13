import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Menu item management
export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    categoryId: v.id("categories"),
    subcategoryId: v.optional(v.id("subcategories")),
    imageUrl: v.optional(v.string()),
    isVegetarian: v.boolean(),
    isSpicy: v.boolean(),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      ...args,
      isAvailable: true,
      sortOrder: 0,
    });
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("subcategories")),
    imageUrl: v.optional(v.string()),
    isVegetarian: v.optional(v.boolean()),
    isSpicy: v.optional(v.boolean()),
    isAvailable: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) updates[key] = val;
    }
    await ctx.db.patch(id, updates);
  },
});

export const deleteMenuItem = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Category management
export const createCategory = mutation({
  args: {
    slug: v.string(),
    label: v.string(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", { ...args, isActive: true });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    label: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) updates[key] = val;
    }
    await ctx.db.patch(id, updates);
  },
});

// Site settings
export const updateSetting = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("siteSettings", args);
    }
  },
});

// Subcategory migration
export const assignSubcategoriesAndDedupe = mutation({
  args: {
    assignments: v.array(
      v.object({
        subcategoryName: v.string(),
        itemNames: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Get levant_flavours category
    const levant = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "levant_flavours"))
      .first();
    if (!levant) throw new Error("levant_flavours category not found");

    // Get all subcategories for this category
    const subcategories = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", levant._id))
      .collect();
    const subMap = new Map(subcategories.map((s) => [s.name, s._id]));

    // Get all levant_flavours menu items
    const allItems = await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("categoryId", levant._id))
      .collect();

    // Build name→subcategoryId mapping
    const nameToSubId = new Map<string, typeof subcategories[0]["_id"]>();
    for (const assignment of args.assignments) {
      const subId = subMap.get(assignment.subcategoryName);
      if (!subId) {
        console.log(`Subcategory not found: ${assignment.subcategoryName}`);
        continue;
      }
      for (const name of assignment.itemNames) {
        nameToSubId.set(name.toLowerCase(), subId);
      }
    }

    // Assign subcategories and deduplicate
    const seen = new Set<string>();
    let updated = 0;
    let deleted = 0;

    for (const item of allItems) {
      const key = item.name.toLowerCase();
      if (seen.has(key)) {
        // Duplicate - delete it
        await ctx.db.delete(item._id);
        deleted++;
        continue;
      }
      seen.add(key);

      const subId = nameToSubId.get(key);
      if (subId) {
        await ctx.db.patch(item._id, { subcategoryId: subId });
        updated++;
      }
    }

    return { updated, deleted, total: allItems.length };
  },
});

// Reservation management
export const updateReservationStatus = mutation({
  args: {
    id: v.id("reservations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

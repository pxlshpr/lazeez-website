import { query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_sort")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getMenuItemsByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
  },
});

export const getFeaturedItems = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_featured")
      .filter((q) =>
        q.and(
          q.eq(q.field("isFeatured"), true),
          q.eq(q.field("isAvailable"), true)
        )
      )
      .collect();
  },
});

export const searchItems = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allItems = await ctx.db.query("menuItems").collect();
    const q = args.query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.isAvailable &&
        (item.name.toLowerCase().includes(q) ||
          (item.description?.toLowerCase().includes(q) ?? false))
    );
  },
});

export const getAllItems = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("menuItems")
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
  },
});

// Admin: get all items including unavailable
export const getAllItemsAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

// Admin: get all categories including inactive
export const getAllCategoriesAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Admin: get all subcategories including inactive
export const getAllSubcategoriesAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query("subcategories").collect();
  },
});

export const getSubcategories = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

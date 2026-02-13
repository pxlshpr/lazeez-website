import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Menu structure
  categories: defineTable({
    slug: v.string(),
    label: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]).index("by_sort", ["sortOrder"]),

  subcategories: defineTable({
    categoryId: v.id("categories"),
    name: v.string(),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_category", ["categoryId"]),

  menuItems: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    categoryId: v.id("categories"),
    subcategoryId: v.optional(v.id("subcategories")),
    imageUrl: v.optional(v.string()),
    isVegetarian: v.boolean(),
    isSpicy: v.boolean(),
    isAvailable: v.boolean(),
    isFeatured: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_subcategory", ["subcategoryId"])
    .index("by_featured", ["isFeatured"]),

  // Gallery
  galleryImages: defineTable({
    url: v.string(),
    altText: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_sort", ["sortOrder"]),

  // Restaurant info
  operatingHours: defineTable({
    dayOfWeek: v.number(),
    openTime: v.string(),
    closeTime: v.string(),
    isClosed: v.boolean(),
    label: v.string(),
  }).index("by_day", ["dayOfWeek"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  // Customer interactions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
  }),

  reservations: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    partySize: v.number(),
    reservationDate: v.string(),
    reservationTime: v.string(),
    specialRequests: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
      v.literal("no_show")
    ),
  }),

  // Orders (for future app)
  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    orderType: v.union(
      v.literal("dine_in"),
      v.literal("takeaway"),
      v.literal("delivery")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    subtotal: v.number(),
    serviceCharge: v.number(),
    gst: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
  }),

  orderItems: defineTable({
    orderId: v.id("orders"),
    menuItemId: v.optional(v.id("menuItems")),
    itemName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    notes: v.optional(v.string()),
  }).index("by_order", ["orderId"]),
});

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFileSync } from "fs";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://greedy-mole-415.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Read menu data
const menuData = JSON.parse(readFileSync("src/data/menu.json", "utf-8"));
const items = Object.values(menuData);

console.log(`Loaded ${items.length} menu items`);

// Get category IDs from Convex
const categories = await client.query(api.menu.getCategories);
const catMap = new Map(categories.map(c => [c.slug, c._id]));

console.log("Categories:", Object.fromEntries(catMap));

// Insert items in batches of 20
const BATCH_SIZE = 20;
let inserted = 0;

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE);

  for (const item of batch) {
    const categoryId = catMap.get(item.category);
    if (!categoryId) {
      console.warn(`Skipping ${item.name}: unknown category ${item.category}`);
      continue;
    }

    const isVeg = item.name.toLowerCase().includes("(veg)");
    const isSpicy = item.name.toLowerCase().includes("spicy");
    const imageUrl = item.image && !item.image.includes("logo.png") ? item.image : undefined;

    try {
      await client.mutation(api.admin.createMenuItem, {
        name: item.name,
        description: item.description || undefined,
        price: item.price,
        categoryId,
        imageUrl,
        isVegetarian: isVeg,
        isSpicy,
        isFeatured: false,
      });
      inserted++;
    } catch (e) {
      console.error(`Failed to insert ${item.name}:`, e.message);
    }
  }

  console.log(`Inserted ${Math.min(i + BATCH_SIZE, items.length)}/${items.length} items...`);
}

console.log(`\nDone! Inserted ${inserted} menu items.`);

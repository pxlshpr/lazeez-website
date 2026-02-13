import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://greedy-mole-415.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

const FEATURED_NAMES = [
  "Mezze Platter (Veg)",
  "Mixed Shawarma Platter",
  "Lazeez Mixed Grill",
  "Kunafa n\u2019 kream",
];

const allItems = await client.query(api.menu.getAllItems);
console.log(`Total items: ${allItems.length}`);

let marked = 0;
for (const name of FEATURED_NAMES) {
  const item = allItems.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (item) {
    await client.mutation(api.admin.updateMenuItem, { id: item._id, isFeatured: true });
    console.log(`Marked as featured: ${item.name} (${item._id})`);
    marked++;
  } else {
    // Try partial match
    const partial = allItems.find(i => i.name.toLowerCase().includes(name.toLowerCase().slice(0, 10)));
    if (partial) {
      await client.mutation(api.admin.updateMenuItem, { id: partial._id, isFeatured: true });
      console.log(`Marked as featured (partial match): ${partial.name} (${partial._id})`);
      marked++;
    } else {
      console.warn(`Not found: ${name}`);
    }
  }
}
console.log(`\nMarked ${marked} items as featured`);

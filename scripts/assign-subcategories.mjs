import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://greedy-mole-415.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Subcategory assignments for Levant Flavours
// Each item appears in exactly one subcategory (no duplicates)
const assignments = [
  {
    subcategoryName: "Breakfast",
    itemNames: [
      "Eggs to your choice",
      "Palestinian Breakfast",
      "Manakeesh with Za\u0027atar",
      "Shakshooka",
      "Mfarageth Batata",
      "Soujuk with Eggs",
    ],
  },
  {
    subcategoryName: "Cold Mezze",
    itemNames: [
      "The Traditional Hummus (Veg)",
      "Hummus Bel Lahme",
      "Hummus Beiruti (Spicy) (Veg)",
      "Fattet Hummus (Veg)",
      "Moutabal (Veg)",
      "Labneh (Veg)",
      "Warak Enab 6 Pcs (Veg)",
      "Githeyo Hummus (Veg)",
      "Hummus Bel Foul (Spicy) (Veg)",
      "Fattet Eggplant (Veg)",
      "Mezze Platter (Veg)",
    ],
  },
  {
    subcategoryName: "Hot Mezze",
    itemNames: [
      "Foul Moudammas (Veg)",
      "Falafel (Veg)",
      "Chicken Liver",
      "Spicy Stuffed Falafel (Veg)",
      "Moussaka (Veg)",
      "Batata Harra(spicy) (Veg)",
      "Vegetable Platter (Veg)",
      "Lamb Aarayis",
      "Chicken Aarayis",
      "Lamb Kebbah",
      "Fattet Chicken",
    ],
  },
  {
    subcategoryName: "Salads",
    itemNames: [
      "Fattoush (Veg)",
      "Falafel Salad",
      "Rocca Salad",
      "Tabbouleh (Veg)",
      "Couscous Tabbouleh (Veg)",
      "Tahini Salad (Veg)",
      "Spicy Tuna Salad (Veg)",
    ],
  },
  {
    subcategoryName: "Soup",
    itemNames: [
      "Lentil (veg)",
      "Freekeh, Palestinian Traditional Soup",
    ],
  },
  {
    subcategoryName: "Shawarmas & Wraps",
    itemNames: [
      "Chicken Shawarma Wrap",
      "Lamb Shawarma Wrap",
      "Falafel Wrap (veg)",
      "Musakhan Rolls",
      "Chicken Kabab Wrap",
      "Lamb Kabab Wrap",
    ],
  },
  {
    subcategoryName: "From the Grill",
    itemNames: [
      "Lazeez Chicken Shawarma",
      "Mixed Shawarma Platter",
      "Grilled Spicy Chicken Wings",
      "Shish Tawouk",
      "Chicken Kabab",
      "Lazeez Special (Stuffed Chicken Breast)",
      "Grilled Chicken",
      "Lamb Chops",
      "Lamb Mechwe",
      "Spicy Kebab",
      "Lamb Kabab",
      "Lazeez Mixed Grill",
      "Grilled Jumbo Prawns",
      "Grilled Hamoor (450 gm)",
    ],
  },
  {
    subcategoryName: "Oriental Dishes",
    itemNames: [
      "Chicken Maqluba",
      "Lamb Maqluba",
      "Chicken Qidreh",
      "Lamb Qidreh",
      "Sayadieh",
      "Dawood Basha",
      "Okra with Lamb",
      "Lazeez Prawn Rice (spicy)",
    ],
  },
  {
    subcategoryName: "Sawani",
    itemNames: [
      "Spicy Fettucini with Minced Lamb",
      "Spicy Fettucini with Tuna",
      "Kafta with Tomato in the Oven",
      "Kafta with Tahini in the oven",
      "Macaroni in Yoghurt (Veg)",
      "Spicy Spaghetti with Kabab",
      "Spicy Vegetable Tray (Veg)",
      "Lamb Tagine",
      "Chicken Tagine",
    ],
  },
  {
    subcategoryName: "Advance Order",
    itemNames: [
      "Lamb Shank",
      "Mansaf",
      "Mulukhia with Chicken",
      "Spinach and Lamb Stew",
      "Ouzi",
      "Mahashi",
    ],
  },
  {
    subcategoryName: "Sides",
    itemNames: [
      "Garlic Creme (Creme thoum)",
      "Spicy Garlic Creme",
      "Tahini Sauce",
      "Tahini Parsley Sauce",
      "Pita Bread",
      "French Fries",
      "Grilled vegetables",
      "Saffron Rice",
      "Garlic Rice",
      "Pickles",
      "Cut Cucumber \u0026 Carrots",
      "Okra (Veg)",
      "Nuts",
    ],
  },
];

console.log("Assigning subcategories and deduplicating...");
console.log(`Using Convex URL: ${CONVEX_URL}\n`);

try {
  const result = await client.mutation(api.admin.assignSubcategoriesAndDedupe, {
    assignments,
  });
  console.log("Result:", result);
  console.log(`\nUpdated: ${result.updated} items`);
  console.log(`Deleted: ${result.deleted} duplicates`);
  console.log(`Total processed: ${result.total} items`);
} catch (e) {
  console.error("Error:", e.message);
}

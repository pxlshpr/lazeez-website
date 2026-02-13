import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://greedy-mole-415.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

// Subcategory definitions for All Day Eats
const allDayEatsSubcategories = [
  {
    subcategoryName: "Breakfast",
    itemNames: [
      "Maldivian Breakfast",
      "Palestinian Breakfast",
      "Classic",
      "Eggs Benedict",
      "Smashed avo on toast",
      "Egg mayo toast",
      "Mashuni",
      "Kulhimas",
      "Homemade french toast sticks",
      "Waffle with nutella",
      "Crunchy granola",
      "Egg to your choice",
      "Shakshooka",
      "Mfarageth batata",
      "Soujuk with eggs",
      "Hiki Mashuni",
      "Barabo Mashuni",
      "Sourdough bread",
    ],
  },
  {
    subcategoryName: "Manakeesh",
    itemNames: [
      "Manakeesh (za\u2019atar)",
      "Manakeesh (Cheese)",
      "Manakeesh (Beef Mince)",
    ],
  },
  {
    subcategoryName: "Pizza",
    itemNames: [
      "Margherita pizza",
      "Pepperoni pizza",
      "Chicken Supreme",
    ],
  },
  {
    subcategoryName: "Pasta",
    itemNames: [
      "Aglio olio (Chicken)",
      "Aglio olio (Prawn)",
      "Aglio olio (Rehi)",
      "Aglio Lio",
      "Bolognese",
      "Carbonara",
      "Arrabiata",
      "Valhomas spaghetti",
    ],
  },
  {
    subcategoryName: "Burgers & Sandwiches",
    itemNames: [
      "Fried chicken burger",
      "Classic beef burger",
      "Ufo burger",
      "Cheesy beef \u0026 mushroom panini",
      "Chicken pesto panini",
      "tuna melt panini",
      "Mini Sliders",
    ],
  },
  {
    subcategoryName: "Mains",
    itemNames: [
      "Grilled salmon",
      "Stir-Fry Plate - Chicken",
      "Stir-Fry Plate - Beef",
      "Stir-Fry Plate - Prawn",
      "Quesadillas (Chicken / Beef)",
      "Nachos",
      "Chicken Nachos",
      "Beef Nachos",
      "Fried rice",
      "Nasi goreng",
      "Valhomas rice",
      "Dhal Curry",
      "Edamame",
    ],
  },
  {
    subcategoryName: "Salads",
    itemNames: [
      "Pumpkin salad",
      "Beetroot feta salad",
      "Farmer salad",
    ],
  },
  {
    subcategoryName: "Sides",
    itemNames: [
      "Grilled sausage",
      "Garlic bread",
      "Roshi",
      "Mashed potato",
      "Grilled sweet potato",
      "Sauteed spinach",
      "Smoked salmon",
      "Turkey ham",
      "Beef bacon",
      "Avocado",
      "Sauteed mushroom",
      "Hash Brown",
      "Sweet potato fries",
      "French Fries",
      "Cheesy fries",
      "Side Salad",
      "Cut Cucumber \u0026 Carrots",
      "Grilled vegetables",
      "Saffron Rice",
      "Garlic Rice",
      "Pickles",
      "Olives",
      "Pita Bread Medium",
      "Pita bread large",
      "Garlic Sauce",
      "Spicy Garlic Sauce",
      "Tahini Sauce",
      "Tahini Parsley Sauce",
    ],
  },
];

// Subcategory definitions for Thirsty
const thirstySubcategories = [
  {
    subcategoryName: "Fresh Juices",
    itemNames: [
      "Green glow",
      "Vital c boost",
      "Beet it",
      "Lemon \u0026 mint",
      "Orange",
      "Carrot",
      "Pomegranate",
    ],
  },
  {
    subcategoryName: "Mocktails",
    itemNames: [
      "Passion Fruit",
      "Tangy twist",
      "Passion breeze",
      "Peach paradise",
      "Blue Lagoon",
      "Red ruby",
      "Lazeez island",
      "Red Bull Mojito (Passion / Mint)",
    ],
  },
  {
    subcategoryName: "Hot Coffee",
    itemNames: [
      "Turkish",
      "Lavazza Black",
      "Espresso",
      "Double",
      "Macchiato",
      "Cappuccino",
      "Latte Macchiato",
      "Spanish Latte",
    ],
  },
  {
    subcategoryName: "Cold Coffee",
    itemNames: [
      "Frappuccino",
      "Milkshake",
      "Iced Shaken White Mocha",
      "Iced latte",
      "Iced spanish latte",
      "Chai iced latte",
      "Affogato",
    ],
  },
  {
    subcategoryName: "Tea & Hot Drinks",
    itemNames: [
      "Specialty teas",
      "Masala tea",
      "Hot Chocolate",
      "Matcha latte",
      "Milk tea",
      "Aryan",
    ],
  },
  {
    subcategoryName: "Iced Tea",
    itemNames: [
      "Lemon ice tea",
      "Peach ice tea",
      "Passionfruit ice tea",
    ],
  },
  {
    subcategoryName: "Specials",
    itemNames: [
      "Faloodha",
    ],
  },
  {
    subcategoryName: "Soft Drinks",
    itemNames: [
      "Coca Cola",
      "Coca Cola Zero",
      "Fanta",
      "Sprite",
      "Soda Water",
      "Mineral",
      "Sparkling",
    ],
  },
];

async function run() {
  // Get all categories
  const cats = await client.query(api.menu.getAllCategoriesAdmin);
  const allDayEats = cats.find(c => c.slug === "all_day_eats");
  const thirsty = cats.find(c => c.slug === "thirsty");

  if (!allDayEats) { console.error("all_day_eats category not found"); return; }
  if (!thirsty) { console.error("thirsty category not found"); return; }

  // Get all items
  const allItems = await client.query(api.menu.getAllItemsAdmin);

  // Process each category
  for (const [categoryId, assignments] of [
    [allDayEats._id, allDayEatsSubcategories],
    [thirsty._id, thirstySubcategories],
  ]) {
    const catName = categoryId === allDayEats._id ? "All Day Eats" : "Thirsty";
    console.log(`\n=== ${catName} ===`);
    const catItems = allItems.filter(i => i.categoryId === categoryId);
    console.log(`Total items in category: ${catItems.length}`);

    let totalAssigned = 0;
    for (let i = 0; i < assignments.length; i++) {
      const { subcategoryName, itemNames } = assignments[i];

      // Create subcategory
      const subId = await client.mutation(api.admin.createSubcategory, {
        categoryId,
        name: subcategoryName,
        sortOrder: i + 1,
      });
      console.log(`  Created subcategory: ${subcategoryName} (${subId})`);

      // Assign items
      let assigned = 0;
      for (const name of itemNames) {
        const item = catItems.find(
          it => it.name.toLowerCase() === name.toLowerCase()
        );
        if (item) {
          await client.mutation(api.admin.updateMenuItem, {
            id: item._id,
            subcategoryId: subId,
          });
          assigned++;
        } else {
          // Try partial match (first 8 chars)
          const partial = catItems.find(
            it => it.name.toLowerCase().includes(name.toLowerCase().slice(0, 8))
          );
          if (partial) {
            await client.mutation(api.admin.updateMenuItem, {
              id: partial._id,
              subcategoryId: subId,
            });
            assigned++;
            console.log(`    Partial match: "${name}" → "${partial.name}"`);
          } else {
            console.warn(`    Not found: ${name}`);
          }
        }
      }
      console.log(`    Assigned ${assigned}/${itemNames.length} items`);
      totalAssigned += assigned;
    }

    // Check for unassigned items
    const updatedItems = await client.query(api.menu.getAllItemsAdmin);
    const unassigned = updatedItems.filter(
      i => i.categoryId === categoryId && !i.subcategoryId
    );
    if (unassigned.length > 0) {
      console.log(`  Unassigned items: ${unassigned.map(i => i.name).join(", ")}`);
    }
    console.log(`  Total assigned: ${totalAssigned}`);
  }
}

run().catch(console.error);

import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const csv = fs.readFileSync("data/imports/catalog_products.csv", "utf8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
});

const rows = parsed.data.filter(row => row.fieldType === "Product");

const { data: dbProducts, error } = await supabase
  .from("products")
  .select("id,sku,title,slug");

if (error) {
  console.error(error);
  process.exit(1);
}

const bySku = new Map(
  dbProducts
    .filter(p => p.sku)
    .map(p => [String(p.sku).trim().toLowerCase(), p])
);

let unmatched = [];

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  const title = String(row.name || "").trim();
  if (!title) continue;

  const sku =
    String(row.sku || "").trim() || `POYKEE-${i + 1}`;

  if (!bySku.has(sku.toLowerCase())) {
    unmatched.push({
      row: i + 1,
      sku,
      title
    });
  }
}

console.log("\nUNMATCHED PRODUCTS:", unmatched.length);
console.log("====================================");

for (const p of unmatched) {
  console.log(`${p.row} | ${p.sku} | ${p.title}`);
}

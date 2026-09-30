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

console.log("CSV products:", rows.length);

let fixed = 0;
let alreadyOk = 0;
let missing = 0;

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  const title = String(row.name || "").trim();
  if (!title) continue;

  // IMPORTANT: exactly the same fallback used by src/lib/products.ts
  const expectedSku =
    String(row.sku || "").trim() || `POYKEE-${i + 1}`;

  // First try finding it by existing SKU
  const { data: bySku } = await supabase
    .from("products")
    .select("id,sku,title")
    .eq("sku", expectedSku)
    .maybeSingle();

  if (bySku) {
    alreadyOk++;
    continue;
  }

  // Product imported without SKU: identify it by exact title
  const { data: matches, error } = await supabase
    .from("products")
    .select("id,sku,title")
    .eq("title", title);

  if (error) {
    console.error("ERROR:", title, error.message);
    continue;
  }

  if (!matches || matches.length !== 1) {
    console.log(
      "COULD NOT MATCH:",
      expectedSku,
      title,
      `(${matches?.length || 0} matches)`
    );
    missing++;
    continue;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ sku: expectedSku })
    .eq("id", matches[0].id);

  if (updateError) {
    console.error("UPDATE FAILED:", expectedSku, updateError.message);
  } else {
    fixed++;
  }

  if ((i + 1) % 100 === 0) {
    console.log(
      `Checked ${i + 1}/${rows.length} — fixed ${fixed}, already OK ${alreadyOk}`
    );
  }
}

console.log("");
console.log("DONE");
console.log("Fixed:", fixed);
console.log("Already correct:", alreadyOk);
console.log("Could not match:", missing);

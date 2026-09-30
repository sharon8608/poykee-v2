import fs from "fs";
import Papa from "papaparse";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const csvPath = "data/imports/catalog_products.csv";

if (!fs.existsSync(csvPath)) {
  throw new Error(`CSV not found: ${csvPath}`);
}

const csv = fs.readFileSync(csvPath, "utf8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
});

if (parsed.errors.length) {
  console.log("CSV warnings:", parsed.errors.slice(0, 5));
}

function cleanHtml(value = "") {
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function wixImageToUrl(value = "") {
  const v = String(value).trim();

  if (!v) return null;

  if (v.startsWith("http://") || v.startsWith("https://")) {
    return v;
  }

  if (v.startsWith("wix:image://")) {
    const match = v.match(/wix:image:\/\/v1\/([^/#]+)/);
    if (match?.[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }

  return v;
}

function makeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

const seen = new Set();
const products = [];

for (let index = 0; index < parsed.data.length; index++) {
  const row = parsed.data[index];

  const title = String(row.name || row.title || "").trim();

  if (!title) continue;

  const sku = String(row.sku || "").trim();

  let slug =
    String(row.slug || "").trim() ||
    makeSlug(title) ||
    `product-${index + 1}`;

  // Ensure every slug is unique inside this import.
  let uniqueSlug = slug;
  let counter = 2;

  while (seen.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  seen.add(uniqueSlug);

  const priceValue = String(row.price || "0")
    .replace(/[^0-9.,-]/g, "")
    .replace(",", ".");

  const inventoryValue = parseInt(row.inventory || "0", 10);

  products.push({
    sku: sku || null,
    slug: uniqueSlug,
    title,
    description: cleanHtml(row.description || ""),
    price: Number(priceValue) || 0,
    image_url: wixImageToUrl(
      row.productImageUrl ||
      row.image ||
      row.image_url ||
      ""
    ),
    category: String(row.collection || row.category || "").trim() || null,
    inventory: Number.isFinite(inventoryValue) ? inventoryValue : 0,
    published: String(row.visible ?? "true").toLowerCase() !== "false",
  });
}

console.log(`CSV rows parsed: ${parsed.data.length}`);
console.log(`Products prepared: ${products.length}`);

for (let i = 0; i < products.length; i += 100) {
  const batch = products.slice(i, i + 100);

  const { error } = await supabase
    .from("products")
    .upsert(batch, { onConflict: "slug" });

  if (error) {
    console.error(`Import failed around product ${i + 1}:`);
    console.error(error);
    process.exit(1);
  }

  console.log(
    `Imported ${Math.min(i + 100, products.length)} / ${products.length}`
  );
}

console.log("IMPORT COMPLETE");

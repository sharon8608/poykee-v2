import fs from "fs";
import path from "path";
import Papa from "papaparse";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const csvPath = path.join(process.cwd(), "data/imports/catalog_products.csv");
const csv = fs.readFileSync(csvPath, "utf8");

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 70);
}

function cleanHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function wixImageToUrl(image = "") {
  const first = image.split(";")[0]?.trim();
  if (!first) return "";
  if (first.startsWith("http")) return first;
  return `https://static.wixstatic.com/media/${first}`;
}

const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
const usedSlugs = new Map();

function uniqueSlug(base) {
  const safeBase = base || "poykee-item";
  const count = usedSlugs.get(safeBase) || 0;
  usedSlugs.set(safeBase, count + 1);
  return count === 0 ? safeBase : `${safeBase}-${count + 1}`;
}

const products = parsed.data
  .filter((row) => row.fieldType === "Product")
  .map((row, index) => {
    const title = row.name?.trim() || "Untitled work";
    const sku = row.sku?.trim() || `POYKEE-${index + 1}`;
    const baseSlug = `${slugify(title)}-${slugify(sku || String(index + 1))}`;

    return {
      sku,
      slug: uniqueSlug(baseSlug),
      title,
      description: cleanHtml(row.description || ""),
      price: Number(row.price || 0),
      image_url: wixImageToUrl(row.productImageUrl || ""),
      category: row.collection || "",
      inventory: Number(row.inventory || 0),
      published: String(row.visible).toLowerCase() === "true",
    };
  });

console.log(`Importing ${products.length} products...`);

for (let i = 0; i < products.length; i += 100) {
  const batch = products.slice(i, i + 100);

  const { error } = await supabase
    .from("products")
    .upsert(batch, { onConflict: "slug" });

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Imported ${Math.min(i + 100, products.length)} / ${products.length}`);
}

console.log("Done.");

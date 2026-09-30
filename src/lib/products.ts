import fs from "fs";
import path from "path";
import Papa from "papaparse";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrls: string[];
  collection: string[];
  sku: string;
  price: number;
  visible: boolean;
  inventory: number;
};

type WixRow = {
  handleId?: string;
  fieldType?: string;
  name?: string;
  description?: string;
  productImageUrl?: string;
  collection?: string;
  sku?: string;
  price?: string;
  visible?: string;
  inventory?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 90);
}

function cleanHtml(html?: string) {
  return (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function wixImageToUrl(image: string) {
  const clean = image.trim();
  if (!clean) return "";
  if (clean.startsWith("http")) return clean;
  return `https://static.wixstatic.com/media/${clean}`;
}

let cache: Product[] | null = null;

export function getProducts(): Product[] {
  if (cache) return cache;

  const csvPath = path.join(process.cwd(), "data", "imports", "catalog_products.csv");
  const csv = fs.readFileSync(csvPath, "utf8");

  const parsed = Papa.parse<WixRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  cache = parsed.data
    .filter((row) => row.fieldType === "Product")
    .map((row, index) => {
      const name = row.name?.trim() || "Untitled work";
      const sku = row.sku?.trim() || `POYKEE-${index + 1}`;
      const slug = `${slugify(name)}-${sku.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      return {
        id: row.handleId || sku,
        slug,
        name,
        description: cleanHtml(row.description),
        imageUrls: (row.productImageUrl || "")
          .split(";")
          .map(wixImageToUrl)
          .filter(Boolean),
        collection: (row.collection || "")
          .split(";")
          .map((x) => x.trim())
          .filter(Boolean),
        sku,
        price: Number(row.price || 0),
        visible: String(row.visible).toLowerCase() === "true",
        inventory: Number(row.inventory || 0),
      };
    })
    .filter((product) => product.visible);

  return cache;
}

export function getProductBySlug(slug: string) {
  return getProducts().find((product) => product.slug === slug);
}

export function getFeaturedProducts(limit = 24) {
  const products = getProducts().filter(
    (product) =>
      product.visible &&
      product.inventory > 0 &&
      product.price >= 150 &&
      product.imageUrls.length > 0
  );

  const sweetSpot = products
    .filter((product) => product.price >= 250 && product.price <= 600)
    .sort((a, b) => b.price - a.price);

  const affordable = products
    .filter((product) => product.price >= 150 && product.price < 250)
    .sort((a, b) => b.price - a.price);

  const premium = products
    .filter((product) => product.price > 600)
    .sort((a, b) => a.price - b.price);

  const featured: Product[] = [];

  let s = 0;
  let a = 0;
  let p = 0;

  while (featured.length < limit) {
    if (sweetSpot[s]) featured.push(sweetSpot[s++]);

    if (sweetSpot[s] && featured.length < limit) {
      featured.push(sweetSpot[s++]);
    }

    if (premium[p] && featured.length < limit) {
      featured.push(premium[p++]);
    }

    if (affordable[a] && featured.length < limit) {
      featured.push(affordable[a++]);
    }

    if (
      s >= sweetSpot.length &&
      a >= affordable.length &&
      p >= premium.length
    ) {
      break;
    }
  }

  return featured.slice(0, limit);
}

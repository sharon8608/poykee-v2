import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import mime from "mime";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const bucket = "product-images";
const limit = Number(process.argv[2] || 20);

const { data: products, error } = await supabase
  .from("products")
  .select("id, title, image_url, image_storage_url")
  .not("image_url", "is", null)
  .is("image_storage_url", null)
  .limit(limit);

if (error) throw error;

console.log(`Migrating ${products.length} images...`);

for (const product of products) {
  try {
    console.log(`\nMigrating: ${product.title}`);

    const response = await fetch(product.image_url);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = mime.getExtension(contentType) || "jpg";
    const filePath = `${product.id}/main.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, { contentType, upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const newUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        image_url_original: product.image_url,
        image_storage_url: newUrl,
        image_url: newUrl,
      })
      .eq("id", product.id);

    if (updateError) throw updateError;

    console.log("Done:", newUrl);
  } catch (err) {
    console.error("Failed:", product.title, err.message);
  }
}

console.log("\nBatch complete.");

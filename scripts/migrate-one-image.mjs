import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import mime from "mime";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const bucket = "product-images";

const { data: product, error } = await supabase
  .from("products")
  .select("id, title, image_url, image_storage_url")
  .not("image_url", "is", null)
  .is("image_storage_url", null)
  .limit(1)
  .single();

if (error || !product) {
  console.error("No product found", error);
  process.exit(1);
}

console.log("Migrating:", product.title);
console.log("Old image:", product.image_url);

const response = await fetch(product.image_url);

if (!response.ok) {
  throw new Error(`Failed to download image: ${response.status}`);
}

const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const contentType = response.headers.get("content-type") || "image/jpeg";
const extension = mime.getExtension(contentType) || "jpg";

const filePath = `${product.id}/main.${extension}`;

const { error: uploadError } = await supabase.storage
  .from(bucket)
  .upload(filePath, buffer, {
    contentType,
    upsert: true,
  });

if (uploadError) {
  throw uploadError;
}

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

if (updateError) {
  throw updateError;
}

console.log("Done.");
console.log("New image:", newUrl);

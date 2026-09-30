import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

let offset = 0;
let fixed = 0;

while (true) {
  const { data: products, error } = await supabase
    .from("products")
    .select("id,image_url")
    .range(offset, offset + 499);

  if (error) throw error;
  if (!products?.length) break;

  for (const product of products) {
    if (!product.image_url) continue;

    let first = product.image_url
      .split(";")[0]
      .trim();

    if (!first) continue;

    if (!first.startsWith("http")) {
      first = `https://static.wixstatic.com/media/${first}`;
    }

    if (first === product.image_url) continue;

    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: first })
      .eq("id", product.id);

    if (updateError) {
      console.error("FAILED:", product.id, updateError.message);
    } else {
      fixed++;
    }
  }

  offset += products.length;
  console.log(`Checked ${offset} products — fixed ${fixed}`);
}

console.log(`DONE — fixed ${fixed} image URLs`);

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const bucket = "product-images";
let totalDeleted = 0;

while (true) {
  const { data: folders, error } = await supabase.storage
    .from(bucket)
    .list("", { limit: 100 });

  if (error) throw error;
  if (!folders || folders.length === 0) break;

  let deletedThisRound = 0;

  for (const folder of folders) {
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(folder.name);

    if (listError || !files?.length) continue;

    const paths = files.map((f) => `${folder.name}/${f.name}`);

    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (removeError) {
      console.log("FAILED:", folder.name, removeError.message);
      continue;
    }

    deletedThisRound += paths.length;
    totalDeleted += paths.length;
  }

  console.log(`Deleted this round: ${deletedThisRound}. Total: ${totalDeleted}`);

  if (deletedThisRound === 0) break;
}

console.log(`Finished. Deleted ${totalDeleted} files.`);

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function updateProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const price = Number(formData.get("price") || 0);
  const inventory = Number(formData.get("inventory") || 0);
  const published = formData.get("published") === "on";

  await supabase
    .from("products")
    .update({ title, description, price, inventory, published })
    .eq("id", id);

  redirect("/poykee-admin");
}

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));

  await supabase.from("products").delete().eq("id", id);

  redirect("/poykee-admin");
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return <main className="p-8">Product not found</main>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-8 text-neutral-950">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-3xl font-light">Edit product</h1>

        <form action={updateProduct} className="space-y-5">
          <input type="hidden" name="id" value={product.id} />

          <label className="block">
            <span className="text-sm text-neutral-500">Title</span>
            <input
              name="title"
              defaultValue={product.title}
              className="mt-2 w-full border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-500">Description</span>
            <textarea
              name="description"
              defaultValue={product.description || ""}
              rows={8}
              className="mt-2 w-full border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-500">Price</span>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price || 0}
              className="mt-2 w-full border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-500">Inventory</span>
            <input
              name="inventory"
              type="number"
              defaultValue={product.inventory || 0}
              className="mt-2 w-full border p-3"
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked={product.published}
            />
            Published
          </label>

          <button className="w-full bg-neutral-950 px-6 py-3 text-white">
            Save changes
          </button>
        </form>

        <form action={deleteProduct} className="mt-8">
          <input type="hidden" name="id" value={product.id} />
          <button className="w-full border border-red-500 px-6 py-3 text-red-600">
            Delete product
          </button>
        </form>
      </div>
    </main>
  );
}

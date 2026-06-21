import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, price, image_url, category, inventory, published")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <main className="p-8">Error: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-8 text-neutral-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light">Poykee Admin</h1>
            <p className="mt-2 text-neutral-500">Manage your products</p>
          </div>

          <Link href="/" className="text-sm underline">
            View website
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Published</th>
                <th className="p-4">Category</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-16 w-16 object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-neutral-100" />
                      )}

                      <div>
                        <p className="font-medium">{product.title}</p>

                        <div className="mt-1 flex gap-3">
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-xs text-neutral-500 underline"
                          >
                            View
                          </Link>

                          <Link
                            href={`/poykee-admin/products/${product.id}`}
                            className="text-xs text-blue-600 underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    ${Number(product.price || 0).toLocaleString()}
                  </td>

                  <td className="p-4">{product.inventory}</td>

                  <td className="p-4">
                    {product.published ? "Yes" : "No"}
                  </td>

                  <td className="p-4">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

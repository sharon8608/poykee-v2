import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getProductBySlug } from "@/lib/products";
import PayPalCheckout from "@/components/PayPalCheckout";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // CSV is temporarily retained for the complete Wix image gallery.
  const localProduct = getProductBySlug(slug);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  // The public site still uses the original CSV slugs.
  // Find the corresponding Supabase product by SKU first.
  let query = supabase
    .from("products")
    .select(
      "id,slug,title,description,price,image_url,category,inventory,published,sku"
    );

  if (localProduct?.sku) {
    query = query.eq("sku", localProduct.sku);
  } else {
    query = query.eq("slug", slug);
  }

  const { data: dbProduct } = await query.maybeSingle();

  if (!dbProduct) notFound();

  const images =
    localProduct?.imageUrls?.length
      ? localProduct.imageUrls
      : dbProduct.image_url
        ? [dbProduct.image_url]
        : [];

  const collections =
    localProduct?.collection?.length
      ? localProduct.collection
      : dbProduct.category
        ? [dbProduct.category]
        : [];

  const available = dbProduct.published && dbProduct.inventory > 0;

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          {images.length ? (
            images.slice(0, 10).map((image, index) => (
              <div key={`${image}-${index}`} className="bg-neutral-100">
                <Image
                  src={image}
                  alt={`${dbProduct.title} image ${index + 1}`}
                  width={1000}
                  height={1200}
                  className="h-auto w-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="aspect-[4/5] bg-neutral-100" />
          )}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          {collections.length > 0 && (
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              {collections.join(" • ")}
            </p>
          )}

          <h1 className="mt-4 text-4xl font-light leading-tight">
            {dbProduct.title}
          </h1>

          <p className="mt-6 text-2xl">
            ${Number(dbProduct.price).toLocaleString()}
          </p>

          <div className="mt-8 border-y border-neutral-200 py-6">
            <p className="whitespace-pre-line leading-8 text-neutral-700">
              {dbProduct.description || "Description coming soon."}
            </p>
          </div>

          <div className="mt-6 text-sm text-neutral-500">
            <p>SKU: {dbProduct.sku || "—"}</p>
          </div>

          <Link
            href={`/contact?artwork=${encodeURIComponent(dbProduct.title)}`}
            className="mt-6 block w-full border border-neutral-950 px-8 py-4 text-center text-sm uppercase tracking-[0.2em] hover:bg-neutral-50"
          >
            Ask about this artwork
          </Link>

          {available ? (
            <PayPalCheckout
              productId={dbProduct.id}
              clientId={process.env.PAYPAL_CLIENT_ID!}
            />
          ) : (
            <div className="mt-8 bg-neutral-100 px-8 py-4 text-center text-sm uppercase tracking-[0.2em]">
              Sold
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

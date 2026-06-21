import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";

export function generateStaticParams() {
  return getProducts().slice(0, 200).map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="border-b border-neutral-200 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-[0.25em]">
            POYKEE
          </Link>
          <Link href="/" className="text-sm uppercase tracking-wide text-neutral-600">
            Back to collection
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          {product.imageUrls.length ? (
            product.imageUrls.slice(0, 6).map((image, index) => (
              <div key={image} className="bg-neutral-100">
                <Image
                  src={image}
                  alt={`${product.name} image ${index + 1}`}
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
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            {product.collection.join(" • ")}
          </p>

          <h1 className="mt-4 text-4xl font-light leading-tight">
            {product.name}
          </h1>

          <p className="mt-6 text-2xl">${product.price.toLocaleString()}</p>

          <div className="mt-8 border-y border-neutral-200 py-6">
            <p className="whitespace-pre-line leading-8 text-neutral-700">
              {product.description || "Description coming soon."}
            </p>
          </div>

          <div className="mt-6 text-sm text-neutral-500">
            <p>SKU: {product.sku}</p>
            <p>Inventory: {product.inventory}</p>
          </div>

          <button className="mt-8 w-full bg-neutral-950 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white">
            Inquire / PayPal checkout coming soon
          </button>
        </div>
      </section>
    </main>
  );
}

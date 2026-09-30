import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const products = getFeaturedProducts(16);

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Fine Art • Prints • Drawings • Photography
        </p>

        <h1 className="max-w-4xl text-5xl font-light leading-tight md:text-7xl">
          Curated vintage and original artworks.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          Discover paintings, drawings, prints and photographs from the Poykee collection.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-block border border-neutral-950 px-7 py-3 text-sm uppercase tracking-[0.2em]"
        >
          Browse all works
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              New selection
            </p>
            <h2 className="mt-2 text-3xl font-light">Featured works</h2>
          </div>

          <Link
            href="/products"
            className="text-sm uppercase tracking-wide text-neutral-500 hover:text-black"
          >
            View all →
          </Link>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const products = getFeaturedProducts(16);

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      <section className="w-full bg-[#93a79d]">
        <a href="/products" className="block">
          <img
            src="/poykee-banner.png"
            alt="Poykee — The Art of Collecting"
            className="h-auto w-full object-cover"
          />
        </a>
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

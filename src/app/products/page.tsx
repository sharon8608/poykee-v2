import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export default function ProductsPage() {
  const products = getProducts();

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="border-b border-neutral-200 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="text-2xl font-semibold tracking-[0.25em]">
            POYKEE
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Collection
        </p>
        <h1 className="mt-3 text-5xl font-light">All works</h1>
        <p className="mt-4 text-neutral-500">{products.length} available works</p>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}

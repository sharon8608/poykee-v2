import ProductGrid from "@/components/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const products = getFeaturedProducts(32);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="border-b border-neutral-200 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-semibold tracking-[0.25em]">POYKEE</div>
          <nav className="hidden gap-8 text-sm uppercase tracking-wide text-neutral-600 md:flex">
            <a href="#">Paintings</a>
            <a href="#">Drawings</a>
            <a href="#">Prints</a>
            <a href="#">Photography</a>
            <a href="#">About</a>
          </nav>
        </div>
      </header>

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
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              New selection
            </p>
            <h2 className="mt-2 text-3xl font-light">Featured works</h2>
          </div>
          <p className="text-sm text-neutral-500">{products.length} works</p>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

const categories = [
  { label: "All Works", value: "" },
  { label: "Paintings", value: "paintings" },
  { label: "Drawings", value: "drawings" },
  { label: "Prints", value: "prints" },
  { label: "Photography", value: "photography" },
];

function matchesCategory(collections: string[], category: string) {
  if (!category) return true;

  const text = collections.join(" ").toLowerCase();

  if (category === "paintings") {
    return text.includes("painting");
  }

  if (category === "drawings") {
    return (
      text.includes("drawing") ||
      text.includes("watercolor") ||
      text.includes("watercolour") ||
      text.includes("pastel")
    );
  }

  if (category === "prints") {
    return (
      text.includes("print") ||
      text.includes("etching") ||
      text.includes("engraving") ||
      text.includes("lithograph")
    );
  }

  if (category === "photography") {
    return (
      text.includes("photo") ||
      text.includes("photography") ||
      text.includes("photograph") ||
      text.includes("cdv")
    );
  }

  return true;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "" } = await searchParams;

  const allProducts = getProducts();

  const products = allProducts.filter((product) =>
    matchesCategory(product.collection, category.toLowerCase())
  );

  const active =
    categories.find((item) => item.value === category.toLowerCase()) ||
    categories[0];

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Collection
        </p>

        <h1 className="mt-3 text-5xl font-light">{active.label}</h1>

        <p className="mt-4 text-neutral-500">
          {products.length} available works
        </p>

        <div className="mt-8 flex flex-wrap gap-3 border-b border-neutral-200 pb-8">
          {categories.map((item) => {
            const selected = item.value === active.value;

            return (
              <Link
                key={item.label}
                href={
                  item.value
                    ? `/products?category=${item.value}`
                    : "/products"
                }
                className={
                  selected
                    ? "border border-black bg-black px-5 py-2 text-sm uppercase tracking-wide text-white"
                    : "border border-neutral-300 px-5 py-2 text-sm uppercase tracking-wide hover:border-black"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <p className="py-20 text-center text-neutral-500">
              No works found in this category.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

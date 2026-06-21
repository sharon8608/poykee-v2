import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`} className="group">
          <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
            {product.imageUrls[0] ? (
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                width={700}
                height={900}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                No image
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="line-clamp-2 text-sm uppercase tracking-wide text-neutral-900">
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-500">
              {product.collection.slice(0, 2).join(" • ")}
            </p>
            <p className="mt-2 text-base text-neutral-900">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Poykee",
  description:
    "Discover Poykee, an independent online gallery specializing in antique, vintage and original works of art.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        About
      </p>

      <h1 className="mt-4 text-5xl font-light">
        About Poykee
      </h1>

      <div className="mt-10 space-y-6 text-lg leading-8 text-neutral-700">
        <p>
          Poykee is an independent online gallery specializing in antique,
          vintage and original works of art.
        </p>

        <p>
          Our collection brings together paintings, drawings, prints,
          photography and works on paper from different periods and origins.
          Each work is individually selected for its artistic, historical
          or decorative interest.
        </p>

        <p>
          With a constantly evolving collection, Poykee offers collectors,
          dealers, decorators and art lovers the opportunity to discover
          distinctive works at accessible prices.
        </p>

        <p>
          We sell internationally and are happy to provide additional
          photographs, condition information, dimensions or other details
          about any artwork in the collection.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="bg-black px-7 py-3 text-sm uppercase tracking-[0.15em] text-white"
        >
          Explore the collection
        </Link>

        <Link
          href="/contact"
          className="border border-black px-7 py-3 text-sm uppercase tracking-[0.15em]"
        >
          Contact Poykee
        </Link>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Information
      </p>

      <h1 className="mt-4 text-5xl font-light">Shipping & Returns</h1>

      <div className="mt-10 space-y-10 text-neutral-700">
        <section>
          <h2 className="text-2xl font-light text-black">Worldwide shipping</h2>
          <p className="mt-4 leading-7">
            Poykee ships artworks internationally. Works are carefully packed
            according to their size, medium and condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light text-black">Delivery</h2>
          <p className="mt-4 leading-7">
            Shipping costs and delivery times depend on the destination and
            artwork. Please contact us if you would like a shipping quote
            before purchasing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light text-black">
            Condition & additional information
          </h2>
          <p className="mt-4 leading-7">
            Antique and vintage works may show age-related wear. Additional
            photographs and condition information are available on request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light text-black">Returns</h2>
          <p className="mt-4 leading-7">
            Please contact Poykee promptly if there is an issue with your
            order so we can review the situation and provide the appropriate
            solution.
          </p>
        </section>
      </div>

      <Link
        href="/contact"
        className="mt-12 inline-block border border-black px-7 py-3 text-sm uppercase tracking-[0.15em]"
      >
        Contact us
      </Link>
    </main>
  );
}

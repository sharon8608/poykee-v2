import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="text-xl font-semibold tracking-[0.25em]">POYKEE</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">
            Curated antique, vintage and original artworks for collectors
            worldwide.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Collection
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/products?category=paintings">Paintings</Link>
            <Link href="/products?category=drawings">Drawings</Link>
            <Link href="/products?category=prints">Prints</Link>
            <Link href="/products?category=photography">Photography</Link>
            <Link href="/products">All Works</Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Information
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/about">About Poykee</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shipping">Shipping & Returns</Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Follow & Shop
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href="https://www.instagram.com/poykee_antiques/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://www.ebay.com/str/oldmasterart"
              target="_blank"
              rel="noopener noreferrer"
            >
              eBay
            </a>

            <a
              href="https://www.etsy.com/shop/Poykee"
              target="_blank"
              rel="noopener noreferrer"
            >
              Etsy
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-6 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Poykee. All rights reserved.
      </div>
    </footer>
  );
}

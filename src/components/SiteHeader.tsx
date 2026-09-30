import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-[0.25em]"
        >
          POYKEE
        </Link>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.12em] text-neutral-600 lg:flex">
          <Link className="hover:text-black" href="/products?category=paintings">
            Paintings
          </Link>
          <Link className="hover:text-black" href="/products?category=drawings">
            Drawings
          </Link>
          <Link className="hover:text-black" href="/products?category=prints">
            Prints
          </Link>
          <Link className="hover:text-black" href="/products?category=photography">
            Photography
          </Link>
          <Link className="hover:text-black" href="/products">
            All Works
          </Link>
          <Link className="hover:text-black" href="/about">
            About
          </Link>
          <Link className="hover:text-black" href="/contact">
            Contact
          </Link>
        </nav>

        <Link
          href="/contact"
          className="text-xs uppercase tracking-[0.15em] lg:hidden"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}

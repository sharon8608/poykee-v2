"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Paintings", href: "/products?category=paintings" },
  { label: "Drawings", href: "/products?category=drawings" },
  { label: "Prints", href: "/products?category=prints" },
  { label: "Photography", href: "/products?category=photography" },
  { label: "All Works", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-2xl font-semibold tracking-[0.25em]"
        >
          POYKEE
        </Link>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.12em] text-neutral-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              className="transition-colors hover:text-black"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] lg:hidden"
        >
          {open ? "Close" : "Menu"}

          <span className="flex w-5 flex-col gap-1">
            <span
              className={`block h-px bg-black transition-transform ${
                open ? "translate-y-[2.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px bg-black transition-transform ${
                open ? "-translate-y-[2.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full border-t border-neutral-100 bg-white shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-neutral-100 py-4 text-sm uppercase tracking-[0.16em] last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-neutral-100 px-6 py-5">
            <div className="mx-auto flex max-w-7xl gap-6 text-xs uppercase tracking-[0.15em] text-neutral-500">
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
      )}
    </header>
  );
}

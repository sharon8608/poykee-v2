import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ artwork?: string }>;
}) {
  const { artwork } = await searchParams;

  const subject = artwork
    ? `Question about: ${artwork}`
    : "Poykee enquiry";

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Contact
      </p>

      <h1 className="mt-4 text-5xl font-light">
        How can we help?
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
        For questions about an artwork, condition, dimensions, shipping or
        additional photographs, please get in touch.
      </p>

      {artwork && (
        <div className="mt-8 border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Artwork
          </p>
          <p className="mt-2">{artwork}</p>
        </div>
      )}

      <a
        href={`mailto:poykeeart@gmail.com?subject=${encodeURIComponent(subject)}`}
        className="mt-10 inline-block bg-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-white"
      >
        Email Poykee
      </a>

      <div className="mt-14 border-t border-neutral-200 pt-8">
        <p className="text-sm text-neutral-500">You can also find Poykee on</p>

        <div className="mt-4 flex gap-6">
          <a
            href="https://www.instagram.com/poykee_antiques/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Instagram
          </a>

          <a
            href="https://www.ebay.com/str/oldmasterart"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            eBay
          </a>

          <a
            href="https://www.etsy.com/shop/Poykee"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Etsy
          </a>
        </div>
      </div>
    </main>
  );
}

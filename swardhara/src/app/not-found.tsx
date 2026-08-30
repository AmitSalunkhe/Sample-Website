import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-ink">हे पान सापडलं नाही</h1>
        <p className="mt-4 text-ink-soft">
          दुवा जुना असेल, किंवा पत्ता चुकला असेल.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-paper transition-opacity hover:opacity-90"
        >
          मुखपृष्ठावर परत
        </Link>
      </main>
      <Footer />
    </>
  );
}

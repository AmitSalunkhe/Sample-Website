import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrackList from "@/components/TrackList";
import Crumb from "@/components/Crumb";
import { genreBySlug, genres, site, tracksInGenre } from "@/lib/content";

/* Every genre is known at build time, so all of these are static HTML. */
export function generateStaticParams() {
  return genres.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const genre = genreBySlug(slug);
  if (!genre) return {};
  return {
    title: `${genre.name} | ${site.name}`,
    description: genre.blurb,
  };
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const genre = genreBySlug(slug);
  if (!genre) notFound();

  const tracks = tracksInGenre(genre.slug);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-4xl px-5 pt-12 pb-24 sm:px-8">
        <Crumb to="/#prakar" label="सगळे प्रकार" />

        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">
          {genre.name}
        </h1>
        <p className="mt-1 text-lg text-geru-deep">{genre.tagline}</p>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">{genre.blurb}</p>

        <h2 className="mt-12 mb-4 font-display text-2xl text-ink">
          {tracks.length} {tracks.length === 1 ? "रचना" : "रचना"}
        </h2>
        <TrackList tracks={tracks} />
      </main>
      <Footer />
    </>
  );
}

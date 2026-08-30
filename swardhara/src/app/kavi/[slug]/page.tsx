import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrackList from "@/components/TrackList";
import Crumb from "@/components/Crumb";
import { poetBySlug, poets, site, tracks as allTracks } from "@/lib/content";

export function generateStaticParams() {
  return poets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const poet = poetBySlug(slug);
  if (!poet) return {};
  return { title: `${poet.name} | ${site.name}`, description: poet.blurb };
}

export default async function PoetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poet = poetBySlug(slug);
  if (!poet) notFound();

  /* Matched on the poet's name, which is what a track actually records. Only
     the abhangs whose authorship is certain carry one, so a poet with nothing
     attributed here shows the note below rather than an empty list. */
  const tracks = allTracks.filter((t) => t.poet === poet.name);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-4xl px-5 pt-12 pb-24 sm:px-8">
        <Crumb to="/#kavi" label="सगळे कवी" />

        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">
          {poet.name}
        </h1>
        <p className="mt-1 text-lg text-geru-deep">{poet.epithet}</p>
        <p className="mt-1 text-ink-soft">{poet.years}</p>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">{poet.blurb}</p>

        {tracks.length > 0 ? (
          <>
            <h2 className="mt-12 mb-4 font-display text-2xl text-ink">
              इथल्या रचना
            </h2>
            <TrackList tracks={tracks} />
          </>
        ) : (
          <p className="mt-12 max-w-2xl rounded-lg border border-paper-edge bg-paper-deep/50 p-5 text-ink-soft">
            या संग्रहात यांची एकही रचना अजून नाही. कवी म्हणून त्यांचं स्थान
            वारकरी परंपरेत मोठं आहे, पण इथली गाणी दुसऱ्यांची आहेत.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TrackList from "@/components/TrackList";
import Crumb from "@/components/Crumb";
import { playlistBySlug, playlists, playlistTracks, site } from "@/lib/content";

export function generateStaticParams() {
  return playlists.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const list = playlistBySlug(slug);
  if (!list) return {};
  return { title: `${list.name} | ${site.name}`, description: list.blurb };
}

/** Total running time, so a two hour session is not a surprise. */
function totalLength(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? `${h} तास ${m} मिनिटं` : `${m} मिनिटं`;
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = playlistBySlug(slug);
  if (!list) notFound();

  const tracks = playlistTracks(list);
  const seconds = tracks.reduce((sum, t) => sum + t.seconds, 0);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-4xl px-5 pt-12 pb-24 sm:px-8">
        <Crumb to="/#yadya" label="सगळ्या याद्या" />

        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">
          {list.name}
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{list.blurb}</p>
        <p className="mt-2 text-sm text-ink-soft">
          {tracks.length} रचना · {totalLength(seconds)}
        </p>

        <div className="mt-10">
          <TrackList tracks={tracks} />
        </div>
      </main>
      <Footer />
    </>
  );
}

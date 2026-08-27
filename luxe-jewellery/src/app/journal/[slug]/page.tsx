import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, getArticle } from "@/lib/journal";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found | Aurelia" };
  return {
    title: `${article.title} | Aurelia Journal`,
    description: article.standfirst,
    openGraph: { title: article.title, description: article.standfirst, type: "article" },
  };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = ARTICLES.filter((a) => a.slug !== slug);

  return (
    <main className="mx-auto max-w-[760px] px-6 pb-32 pt-32 md:pt-40">
      <a className="skip-link" href="#article-body">
        Skip to article
      </a>

      <Link
        href="/#journal"
        className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-luxe text-champagne/85 transition-colors hover:text-ivory"
      >
        &larr; Aurelia Journal
      </Link>

      <article className="mt-10">
        <p className="text-[11px] uppercase tracking-luxe text-champagne/85">
          {article.kicker} &middot; {article.readingTime}
        </p>

        <h1 className="font-display mt-6 text-4xl font-light leading-[1.1] md:text-6xl">
          {article.title}
        </h1>

        <p className="mt-8 border-l border-champagne/40 pl-6 text-[17px] font-light italic leading-relaxed text-ivory/75">
          {article.standfirst}
        </p>

        <div id="article-body" className="mt-12 space-y-7">
          {article.body.map((para, i) => (
            <p key={i} className="text-[16px] font-light leading-[1.75] text-ivory/80">
              {para}
            </p>
          ))}
        </div>
      </article>

      <div className="hairline my-16" />

      <section aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-[11px] uppercase tracking-luxe text-champagne/85">
          More from the journal
        </h2>
        <ul className="mt-8 space-y-6">
          {others.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/journal/${a.slug}`}
                className="group flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8"
              >
                <span className="w-24 shrink-0 text-[11px] uppercase tracking-luxe text-champagne/70">
                  {a.kicker}
                </span>
                <span className="font-display text-2xl font-light transition-colors group-hover:text-champagne">
                  {a.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-20">
        <Link
          href="/#appointment"
          className="inline-flex min-h-11 items-center bg-champagne px-10 py-4 text-[11px] uppercase tracking-luxe text-obsidian transition-opacity hover:opacity-85"
        >
          Book a viewing
        </Link>
      </div>
    </main>
  );
}

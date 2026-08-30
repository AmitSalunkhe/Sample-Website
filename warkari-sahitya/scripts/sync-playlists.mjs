/**
 * Pulls the YouTube playlists into songs.json.
 *
 * Run by a GitHub Action once a day, so the API key lives in repository
 * secrets and never reaches a browser. Node 18+, no dependencies.
 *
 * The rule this follows: YouTube owns which videos exist, curation.json owns
 * what they are called. A video seen for the first time gets a tidied version
 * of its own title and a guessed category, and appears immediately rather than
 * waiting for anyone. Whatever is written into curation.json wins from then on
 * and is never overwritten by this script.
 *
 *   node scripts/sync-playlists.mjs        # writes songs.json
 *   node scripts/sync-playlists.mjs --dry  # prints what would change
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const PLAYLISTS = [
  'PLGfsx-HZaySVXCZuEqz9j6ns4SOlga3Gw', // अभंग
  'PLGfsx-HZaySUH64wD8DuDaU7kdlvt4ECE', // पंचपदी
];

const KEY = process.env.YOUTUBE_API_KEY;
const DRY = process.argv.includes('--dry');
const SELFTEST = process.argv.includes('--self-test');

if (!KEY && !SELFTEST) {
  console.error('YOUTUBE_API_KEY is not set.');
  process.exit(1);
}

const api = async (path, params) => {
  const url = new URL('https://www.googleapis.com/youtube/v3/' + path);
  Object.entries({ ...params, key: KEY }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${path} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
};

/** Every video id in a playlist, following pagination. */
async function playlistIds(playlistId) {
  const ids = [];
  let pageToken;
  do {
    const page = await api('playlistItems', {
      part: 'contentDetails',
      playlistId,
      maxResults: 50,
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of page.items ?? []) {
      const id = item.contentDetails?.videoId;
      if (id) ids.push(id);
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return ids;
}

/** Title, length and whether it can actually be embedded. 50 ids per call. */
async function videoDetails(ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 50) {
    const page = await api('videos', {
      part: 'snippet,contentDetails,status',
      id: ids.slice(i, i + 50).join(','),
    });
    for (const v of page.items ?? []) {
      out.set(v.id, {
        title: v.snippet?.title ?? '',
        channel: v.snippet?.channelTitle ?? '',
        seconds: isoToSeconds(v.contentDetails?.duration ?? ''),
        embeddable: v.status?.embeddable !== false,
        public: v.status?.privacyStatus !== 'private',
      });
    }
  }
  return out;
}

/** PT1H2M3S to seconds. */
function isoToSeconds(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
}

/**
 * A usable name out of a YouTube title.
 *
 * These titles stack the song, the singer, a transliteration and a pile of
 * hashtags behind pipe characters, in no fixed order. Three rules, learned from
 * the titles actually in these playlists:
 *
 *  - Everything from the first hashtag onward is usually tags and loose words,
 *    so cut there when something is left in front. That is what turns
 *    "पंचपदी भाग - 20 #सांप्रदायिक चाली" into "पंचपदी भाग - 20".
 *  - Otherwise prefer the first pipe-separated part written in Devanagari.
 *    "#navratri Gajar | जगत जननी..." leads with a hashtag and an English word,
 *    and the song is in the second part.
 *  - A danda (।) is punctuation inside a Marathi line, not a separator, so only
 *    the pipe splits.
 */
function tidyTitle(raw) {
  const squash = (x) => x.replace(/\s{2,}/g, ' ').trim();
  const devanagari = /[ऀ-ॿ]/;

  const hash = raw.indexOf('#');
  if (hash > 0) {
    const before = squash(raw.slice(0, hash));
    if (before.length >= 4) return trimEdges(before);
  }

  const parts = raw
    .replace(/#[^\s|]+/g, ' ')
    .split(/[|｜]/)
    .map(squash)
    .filter((x) => x.length >= 4);

  if (!parts.length) return squash(raw.replace(/#[^\s|]+/g, ' ')) || raw;

  const marathi = parts.find((x) => devanagari.test(x));
  return trimEdges(marathi ?? parts[0]);
}

/** Drops dangling punctuation a cut can leave behind. */
function trimEdges(x) {
  return x.replace(/^[-–—:,.\s]+/, '').replace(/[-–—:,.\s]+$/, '').trim();
}

/** A first guess from the words in the title. Correct it in curation.json. */
function guessCategory(title) {
  const t = title.toLowerCase();
  if (/स्तोत्र|अष्टक|मंत्र|अथर्वशीर्ष|आरती|stotra|stotram|mantra|aarti|atharvashirsha|ashtakam|ashtak|suktam/.test(t)) return 'stotra';
  if (/पंचपदी|panchpadi/.test(t)) return 'panchpadi';
  if (/कीर्तन|kirtan/.test(t)) return 'kirtan';
  if (/भजन|bhajan|नामघोष/.test(t)) return 'bhajan';
  if (/मैफल|महोत्सव|maifil/.test(t)) return 'maifil';
  return 'abhang';
}

async function main() {
  const curation = JSON.parse(await readFile(join(ROOT, 'curation.json'), 'utf8'));
  const overrides = curation.overrides ?? {};
  const exclude = new Set(curation.exclude ?? []);

  const ids = [];
  for (const p of PLAYLISTS) {
    for (const id of await playlistIds(p)) {
      if (!ids.includes(id)) ids.push(id);
    }
  }

  const details = await videoDetails(ids);

  const songs = [];
  const dropped = [];
  const fresh = [];

  for (const id of ids) {
    if (exclude.has(id)) { dropped.push([id, 'excluded in curation.json']); continue; }

    const d = details.get(id);
    /* A video the API will not describe is private or deleted. It cannot play,
       and a track that cannot play is worse than one that is absent. */
    if (!d) { dropped.push([id, 'private or deleted']); continue; }
    if (!d.public) { dropped.push([id, 'private']); continue; }
    if (!d.embeddable) { dropped.push([id, 'embedding disabled']); continue; }
    if (!d.seconds) { dropped.push([id, 'no duration, probably still processing']); continue; }

    const o = overrides[id];
    if (!o) fresh.push([id, tidyTitle(d.title)]);

    songs.push({
      t: o?.t ?? tidyTitle(d.title),
      by: o?.by ?? d.channel,
      ...(o?.poet ? { poet: o.poet } : {}),
      ...(o?.raga ? { raga: o.raga } : {}),
      cat: o?.cat ?? guessCategory(d.title),
      sec: d.seconds,
      id,
    });
  }

  const json = JSON.stringify(songs);
  const before = await readFile(join(ROOT, 'songs.json'), 'utf8').catch(() => '');

  console.log(`playlists ${PLAYLISTS.length} · ids ${ids.length} · playable ${songs.length}`);
  if (fresh.length) {
    console.log('\nnew, using their own titles (edit curation.json to name them properly):');
    for (const [id, t] of fresh) console.log(`  ${id}  ${t}`);
  }
  if (dropped.length) {
    console.log('\nnot included:');
    for (const [id, why] of dropped) console.log(`  ${id}  ${why}`);
  }

  if (json === before) { console.log('\nno change'); return; }
  if (DRY) { console.log('\n--dry, songs.json left alone'); return; }

  await writeFile(join(ROOT, 'songs.json'), json);
  console.log('\nsongs.json updated');
}

/* The two functions that decide what a new song is called and where it goes,
   checked against real titles from these playlists. No API key needed, so this
   runs anywhere:  node scripts/sync-playlists.mjs --self-test  */
function selfTest() {
  const cases = [
    ['#navratri Gajar | जगत जननी तू अंबामाता दुर्गाभवानी with lyrics  तेजस मेस्त्री #bhajan #trending #new',
     'जगत जननी तू अंबामाता दुर्गाभवानी with lyrics तेजस मेस्त्री', 'bhajan'],
    ['रूप पाहता लोचनी | अभंग | सुंदर मेस्त्री | Rupa pahata lochani by Sundar Mestry',
     'रूप पाहता लोचनी', 'abhang'],
    ['Atharvashirsha | Sooryagayathri | Ajay -Atul | Ganpati Atharvashirsha |Ganesh Chaturthi Special 2025',
     'Atharvashirsha', 'stotra'],
    ['पंचपदी भाग - 20 #सांप्रदायिक चाली #Panchpadi Part - 20',
     'पंचपदी भाग - 20', 'panchpadi'],
    ['संतचरणरज बाळकृष्ण दादा वसंतगडकर कीर्तन चाल :- कान्होबा तुझी घोंगडी..राग शिवरंजनी',
     'संतचरणरज बाळकृष्ण दादा वसंतगडकर कीर्तन चाल :- कान्होबा तुझी घोंगडी..राग शिवरंजनी', 'kirtan'],
    ['स्मरण लता । सादरकर्त्या अंजली व नंदिनी  गायकवाड   | मैफिल अलिबाग संगीत महोत्सव २०२२',
     'स्मरण लता । सादरकर्त्या अंजली व नंदिनी गायकवाड', 'maifil'],
  ];

  let bad = 0;
  for (const [raw, wantTitle, wantCat] of cases) {
    const gotTitle = tidyTitle(raw);
    const gotCat = guessCategory(raw);
    const ok = gotTitle === wantTitle && gotCat === wantCat;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${gotTitle}   [${gotCat}]`);
    if (!ok) console.log(`      wanted: ${wantTitle}   [${wantCat}]`);
  }
  console.log(bad ? `\n${bad} failing` : '\nall passing');
  process.exit(bad ? 1 : 0);
}

if (SELFTEST) selfTest();
else main().catch((err) => { console.error(err.message); process.exit(1); });

/**
 * Swardhara content model.
 *
 * Everything the site renders comes from this file. Pages read it; no component
 * hard-codes a title or a performer's name.
 *
 * On sourcing: the site hosts no audio. Every track points at a YouTube upload
 * from the collection this site was built around, played through the IFrame API
 * behind our own UI. Each id below was checked in a live player: it constructs,
 * fires onReady and reports a real duration. Four videos from the source
 * playlists are missing here because they are private and report 0:00, and a
 * track that cannot play is worse than one that is absent.
 *
 * On attribution: `singer` is filled only where the video's own title or channel
 * names the performer, and `poet` only where the abhang's authorship is not in
 * doubt. Both are left out rather than guessed. `channel` is always the real
 * uploader, so credit stays traceable to whoever put the recording up.
 */

export type Slug = string;

export type Genre = {
  slug: Slug;
  name: string;
  roman: string;
  tagline: string;
  blurb: string;
  accent: "geru" | "tulsi" | "haldi" | "nil" | "gulal";
};

export type Track = {
  slug: Slug;
  /** The composition, not the video's title. Video titles carry hashtags. */
  title: string;
  roman: string;
  genre: Slug;
  /** Left out when authorship is uncertain. */
  poet?: string;
  /** Left out when no performer is named. */
  singer?: string;
  /** The raga, where the recording states one. Half of this collection does. */
  raga?: string;
  /** The uploading channel. Always present: this is who to credit. */
  channel: string;
  /** Seconds, as the player reported them. Used to flag long sessions. */
  seconds: number;
  /** null means no verified upload. Never guessed. */
  youtubeId: string | null;
};

export type Poet = {
  slug: Slug;
  name: string;
  roman: string;
  years: string;
  epithet: string;
  blurb: string;
};

export type Playlist = {
  slug: Slug;
  name: string;
  roman: string;
  blurb: string;
  tracks: Slug[];
};

/* ------------------------------------------------------------------ */
/* Genres                                                              */
/* ------------------------------------------------------------------ */

export const genres: Genre[] = [
  {
    slug: "abhang",
    name: "अभंग",
    roman: "Abhang",
    tagline: "विठ्ठलाच्या ओढीने लिहिलेली कविता",
    blurb:
      "वारकरी संप्रदायाचा श्वास. ज्ञानेश्वर, नामदेव, एकनाथ आणि तुकाराम यांनी संस्कृतच्या कुलुपातून भक्ती काढून ती मराठीच्या ओठांवर ठेवली. अभंग म्हणजे जे भंग पावत नाही ते.",
    accent: "geru",
  },
  {
    slug: "kirtan",
    name: "कीर्तन",
    roman: "Kirtan",
    tagline: "गोष्ट, चाल आणि टाळ एकत्र",
    blurb:
      "नामदेवांनी सुरू केलेली परंपरा. कीर्तनकार एका अभंगाभोवती निरूपण उभं करतो, मध्येच गातो, मध्येच बोलतो, आणि श्रोता कधी गुंतला हे त्याचं त्यालाच कळत नाही.",
    accent: "tulsi",
  },
  {
    slug: "bhajan",
    name: "भजन",
    roman: "Bhajan",
    tagline: "नामाचा घोष, पुन्हा पुन्हा",
    blurb:
      "एकच ओळ, वाढत जाणारा वेग, आणि सगळ्यांचे आवाज एकत्र. भजनाला श्रोता नसतो, सगळेच सहभागी असतात.",
    accent: "haldi",
  },
  {
    slug: "panchpadi",
    name: "पंचपदी",
    roman: "Panchpadi",
    tagline: "एका बैठकीत रागांचा प्रवास",
    blurb:
      "सांप्रदायिक चालींची मालिका. एका पदातून दुसऱ्यात, एका रागातून दुसऱ्यात, न थांबता; ऐकताना कधी राग बदलला हे लक्षातही येत नाही.",
    accent: "nil",
  },
  {
    slug: "stotra",
    name: "स्तोत्र",
    roman: "Stotra",
    tagline: "संस्कृतातली स्तुती",
    blurb:
      "अथर्वशीर्ष, महालक्ष्मी अष्टक, देवीची स्तोत्रं. अभंगापेक्षा जुनी भाषा आणि घट्ट बांधलेला छंद, म्हणून पाठ करायला सोपी.",
    accent: "gulal",
  },
  {
    slug: "maifil",
    name: "मैफल",
    roman: "Maifil",
    tagline: "सुरुवातीपासून शेवटपर्यंत",
    blurb:
      "तुकडे नाहीत, पूर्ण कार्यक्रम. टाळ्यांसह आणि मध्यंतरासह, जसा तो प्रत्यक्ष घडला तसा.",
    accent: "tulsi",
  },
];

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */

export const tracks: Track[] = [
  /* ---- रूप पाहता लोचनी: one abhang, eight readings ---- */
  {
    slug: "rup-pahata-lochani-pahadi",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    raga: "पहाडी",
    channel: "Vasantgadkar Official",
    seconds: 406,
    youtubeId: "P5aaMcwNtvM",
  },
  {
    slug: "rup-pahata-lochani-kirwani",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    raga: "किरवाणी आणि दरबारी कानडा",
    channel: "Vasantgadkar Official",
    seconds: 436,
    youtubeId: "CPEerVipX2c",
  },
  {
    slug: "rup-pahata-lochani-punyatithi",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    channel: "Vasantgadkar Official",
    seconds: 459,
    youtubeId: "HeoEzp7OcDo",
  },
  {
    slug: "rup-pahata-lochani-mestry",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "सुंदर मेस्त्री",
    channel: "Sundar Mestry",
    seconds: 251,
    youtubeId: "pxqzfwWFuP8",
  },
  {
    slug: "rup-pahata-lochani-gajbhar",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "उज्वल गजभार",
    channel: "Ujwal Gajbhar Official",
    seconds: 810,
    youtubeId: "5XnYFWhoNO8",
  },
  {
    slug: "rup-pahata-lochani-patil",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "ह.भ.प. पुरुषोत्तम महाराज पाटील",
    channel: "Santseva Trust",
    seconds: 541,
    youtubeId: "mhUELq6SOJc",
  },
  {
    slug: "rup-pahata-lochani-nerulkar",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "रामदास पाटील नेरुळकर",
    channel: "RAMDAS PATIL NERULKAR",
    seconds: 555,
    youtubeId: "pCEUzCaNNyw",
  },
  {
    slug: "rup-pahata-lochani-rupavali",
    title: "रूप पाहता लोचनी",
    roman: "Rup Pahata Lochani",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "कल्पेश जाधव",
    channel: "हार्मोनियम मित्र KALPESH JADHAV",
    seconds: 720,
    youtubeId: "eZFu49rGwCY",
  },

  /* ---- सुंदर ते ध्यान ---- */
  {
    slug: "sundar-te-dhyan-madhuvanti",
    title: "सुंदर ते ध्यान",
    roman: "Sundar Te Dhyan",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    raga: "मधुवंती",
    channel: "Vasantgadkar Official",
    seconds: 552,
    youtubeId: "8x3OZOxq1yU",
  },
  {
    slug: "sundar-te-dhyan-vasantgadkar",
    title: "सुंदर ते ध्यान उभे विटेवरी",
    roman: "Sundar Te Dhyan Ubhe Vitevari",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    channel: "Vasantgadkar Official",
    seconds: 467,
    youtubeId: "NyebcYdEuQs",
  },
  {
    slug: "sundar-te-dhyan-punyatithi",
    title: "सुंदर ते ध्यान",
    roman: "Sundar Te Dhyan",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    channel: "Vasantgadkar Official",
    seconds: 476,
    youtubeId: "tp5sIkBMywI",
  },
  {
    slug: "sundar-te-dhyan-deshmukh",
    title: "सुंदर ते ध्यान उभे विटेवरी",
    roman: "Sundar Te Dhyan Ubhe Vitevari",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "कृष्णा देशमुख",
    channel: "Prabhat Parv Bhajan Kirtan",
    seconds: 601,
    youtubeId: "btG9zvfrTew",
  },

  /* ---- इतर अभंग ---- */
  {
    slug: "nitya-pathache-bara-abhang",
    title: "नित्य पाठाचे बारा अभंग",
    roman: "Nitya Pathache Bara Abhang",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    channel: "Vasantgadkar Official",
    seconds: 1977,
    youtubeId: "2bkPQSXgcnw",
  },
  {
    slug: "sampatti-sohala",
    title: "संपत्ती सोहळा नावडे मनाला",
    roman: "Sampatti Sohala Navade Manala",
    genre: "abhang",
    poet: "संत तुकाराम",
    channel: "Naad Vithalacha",
    seconds: 334,
    youtubeId: "YP9ihYZ9LeA",
  },
  {
    slug: "dhanya-dhanya-janma",
    title: "धन्य धन्य जन्म ज्याचा",
    roman: "Dhanya Dhanya Janma Jyacha",
    genre: "abhang",
    singer: "बुवा सुशील गोठणकर",
    channel: "Thunder is live",
    seconds: 428,
    youtubeId: "PEBmKTMGAiQ",
  },
  {
    slug: "purva-punya-ase",
    title: "पूर्व पुण्य असे जयाचे पदरी",
    roman: "Purva Punya Ase Jayache Padari",
    genre: "abhang",
    singer: "पूजा भुरुक, वैष्णवी मावळे",
    channel: "Musical Vaipoo",
    seconds: 263,
    youtubeId: "veEhZncx5hM",
  },
  {
    slug: "deh-vitthal",
    title: "देह विठ्ठल",
    roman: "Deh Vitthal",
    genre: "abhang",
    singer: "अवधूत गांधी",
    channel: "Panorama Music Marathi",
    seconds: 286,
    youtubeId: "fqA8u17jIcU",
  },

  /* ---- कीर्तन ---- */
  {
    slug: "kanhoba-tuzi-ghongadi",
    title: "कान्होबा तुझी घोंगडी",
    roman: "Kanhoba Tuzi Ghongadi",
    genre: "kirtan",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    raga: "शिवरंजनी",
    channel: "Vasantgadkar Official",
    seconds: 493,
    youtubeId: "UXSgXNAJQWo",
  },
  {
    slug: "krishna-mazi-mata",
    title: "कृष्ण माझी माता",
    roman: "Krishna Mazi Mata",
    genre: "kirtan",
    singer: "बाळकृष्ण दादा वसंतगडकर",
    raga: "पारंपरिक चाल",
    channel: "Vasantgadkar Official",
    seconds: 514,
    youtubeId: "-XPnZLNd1-Q",
  },

  /* ---- भजन ---- */
  {
    slug: "jay-jay-ram-krishna-hari",
    title: "जय जय राम कृष्ण हरी",
    roman: "Jay Jay Ram Krishna Hari",
    genre: "bhajan",
    channel: "HARMONIUM MELODY Adhyatma",
    seconds: 721,
    youtubeId: "a-vjUwsREvA",
  },
  {
    slug: "jay-jay-ram-krishna-hari-sarang",
    title: "जय जय राम कृष्ण हरी",
    roman: "Jay Jay Ram Krishna Hari",
    genre: "bhajan",
    raga: "सारंग",
    channel: "HARMONIUM MELODY Adhyatma",
    seconds: 991,
    youtubeId: "tLdEc5VaxCs",
  },

  /* ---- पंचपदी ---- */
  {
    slug: "panchpadi-bhag-20",
    title: "पंचपदी, भाग २०",
    roman: "Panchpadi Bhag 20",
    genre: "panchpadi",
    singer: "अरुण कोठावळे",
    raga: "सांप्रदायिक चाली",
    channel: "Arun kothawale",
    seconds: 1481,
    youtubeId: "XAv80aKEyv8",
  },

  /* ---- स्तोत्र ---- */
  {
    slug: "ganpati-atharvashirsha",
    title: "गणपती अथर्वशीर्ष",
    roman: "Ganpati Atharvashirsha",
    genre: "stotra",
    singer: "सूर्यगायत्री",
    channel: "Times Music Spiritual",
    seconds: 402,
    youtubeId: "qpJ8dFMgtGs",
  },
  {
    slug: "mahalaxmi-ashtakam",
    title: "महालक्ष्मी अष्टकम",
    roman: "Mahalaxmi Ashtakam",
    genre: "stotra",
    channel: "Bhakti Mantras India",
    seconds: 590,
    youtubeId: "zG2qzHSfYi0",
  },
  {
    slug: "jagat-janani-ambamata",
    title: "जगत जननी तू अंबामाता",
    roman: "Jagat Janani Tu Ambamata",
    genre: "stotra",
    singer: "तेजस मेस्त्री",
    channel: "MANISH TAMBOSKAR_PAKHAWAJ",
    seconds: 270,
    youtubeId: "CK1FdwSGR48",
  },
  {
    slug: "devi-stotra-sangrah",
    title: "देवी स्तोत्र आणि आरती संग्रह",
    roman: "Devi Stotra Ani Aarti Sangrah",
    genre: "stotra",
    channel: "Bhakti Mantras India",
    seconds: 3966,
    youtubeId: "m8QDTCjDrpM",
  },

  /* ---- मैफल ---- */
  {
    slug: "smaran-lata",
    title: "स्मरण लता",
    roman: "Smaran Lata",
    genre: "maifil",
    singer: "अंजली आणि नंदिनी गायकवाड",
    channel: "Maifil Alibag",
    seconds: 8994,
    youtubeId: "q3IYYAIxtMY",
  },
];

/* ------------------------------------------------------------------ */
/* The poets whose words are actually sung here                        */
/* ------------------------------------------------------------------ */

export const poets: Poet[] = [
  {
    slug: "tukaram",
    name: "संत तुकाराम",
    roman: "Sant Tukaram",
    years: "इ.स. १६०८ ते १६५०",
    epithet: "जगद्गुरू",
    blurb:
      "देहूचा हा वाणी सर्वांत थेट बोलतो. दांभिकपणावर तो तुटून पडतो आणि विठ्ठलाशी भांडतोही. इथले बहुतेक अभंग त्याचेच आहेत.",
  },
  {
    slug: "dnyaneshwar",
    name: "संत ज्ञानेश्वर",
    roman: "Sant Dnyaneshwar",
    years: "इ.स. १२७५ ते १२९६",
    epithet: "माउली",
    blurb:
      "वयाच्या एकविसाव्या वर्षी समाधी घेणाऱ्या या कवीने गीतेचं मराठीत भाष्य लिहिलं आणि मराठी भाषेला तत्त्वज्ञान बोलायला शिकवलं.",
  },
  {
    slug: "namdev",
    name: "संत नामदेव",
    roman: "Sant Namdev",
    years: "इ.स. १२७० ते १३५०",
    epithet: "कीर्तनाचा आद्य प्रवर्तक",
    blurb:
      "पंढरपूरचा हा शिंपी कवी मराठी आणि हिंदी दोन्हींत लिहितो. कीर्तन नावाचा प्रकार त्याच्यापासून सुरू होतो.",
  },
  {
    slug: "eknath",
    name: "संत एकनाथ",
    roman: "Sant Eknath",
    years: "इ.स. १५३३ ते १५९९",
    epithet: "भारूडकार",
    blurb: "पैठणच्या एकनाथांनी भारूड लिहिलं. वरून विनोदी रूपक, आतून अध्यात्म.",
  },
];

/* ------------------------------------------------------------------ */
/* Playlists                                                           */
/* ------------------------------------------------------------------ */

export const playlists: Playlist[] = [
  {
    slug: "rup-pahata-lochani-chali",
    name: "रूप पाहता लोचनी, आठ चाली",
    roman: "Rup Pahata Lochani, Aath Chali",
    blurb:
      "एकच अभंग, आठ गळे. पहाडी, किरवाणी, दरबारी कानडा; शब्द तेच राहतात आणि प्रत्येक वेळी वेगळं काहीतरी ऐकू येतं.",
    tracks: [
      "rup-pahata-lochani-pahadi",
      "rup-pahata-lochani-kirwani",
      "rup-pahata-lochani-punyatithi",
      "rup-pahata-lochani-mestry",
      "rup-pahata-lochani-gajbhar",
      "rup-pahata-lochani-patil",
      "rup-pahata-lochani-nerulkar",
      "rup-pahata-lochani-rupavali",
    ],
  },
  {
    slug: "sundar-te-dhyan-chali",
    name: "सुंदर ते ध्यान, चार चाली",
    roman: "Sundar Te Dhyan, Char Chali",
    blurb: "तुकारामांचा सर्वांत परिचित अभंग, मधुवंतीपासून पारंपरिक चालीपर्यंत.",
    tracks: [
      "sundar-te-dhyan-madhuvanti",
      "sundar-te-dhyan-vasantgadkar",
      "sundar-te-dhyan-punyatithi",
      "sundar-te-dhyan-deshmukh",
    ],
  },
  {
    slug: "vasantgadkaranchi-seva",
    name: "वसंतगडकरांची सेवा",
    roman: "Vasantgadkaranchi Seva",
    blurb:
      "बाळकृष्ण दादा वसंतगडकर यांची कीर्तनं आणि अभंग, जनार्दन बाबा पुण्यतिथी सोहळ्यातली.",
    tracks: [
      "kanhoba-tuzi-ghongadi",
      "krishna-mazi-mata",
      "sundar-te-dhyan-madhuvanti",
      "rup-pahata-lochani-pahadi",
      "nitya-pathache-bara-abhang",
    ],
  },
  {
    slug: "pahatecha-namghosh",
    name: "पहाटेचा नामघोष",
    roman: "Pahatecha Namghosh",
    blurb: "दिवस सुरू करायला. एकच ओळ, आणि वाढत जाणारा वेग.",
    tracks: [
      "jay-jay-ram-krishna-hari",
      "jay-jay-ram-krishna-hari-sarang",
      "panchpadi-bhag-20",
    ],
  },
  {
    slug: "devichi-stotre",
    name: "देवीची स्तोत्रं",
    roman: "Devichi Stotre",
    blurb: "नवरात्रासाठी, आणि एरवीही.",
    tracks: [
      "mahalaxmi-ashtakam",
      "jagat-janani-ambamata",
      "ganpati-atharvashirsha",
      "devi-stotra-sangrah",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

export const genreBySlug = (slug: Slug) => genres.find((g) => g.slug === slug);
export const trackBySlug = (slug: Slug) => tracks.find((t) => t.slug === slug);
export const poetBySlug = (slug: Slug) => poets.find((p) => p.slug === slug);
export const playlistBySlug = (slug: Slug) => playlists.find((p) => p.slug === slug);

export const tracksInGenre = (slug: Slug) => tracks.filter((t) => t.genre === slug);

export const playlistTracks = (p: Playlist) =>
  p.tracks.map(trackBySlug).filter((t): t is Track => Boolean(t));

export const isPlayable = (t: Track) => t.youtubeId !== null;

/** Past twenty minutes it is a full session, not a single song. Say so. */
export const isLongForm = (t: Track) => t.seconds >= 20 * 60;

/** m:ss for the listing. The player formats its own clock. */
export const trackLength = (t: Track) =>
  `${Math.floor(t.seconds / 60)}:${String(t.seconds % 60).padStart(2, "0")}`;

/** The line under a track title: who sang it, and in what raga if stated. */
export const trackCredit = (t: Track) => {
  const bits = [t.singer ?? t.channel];
  if (t.raga) bits.push(`राग ${t.raga}`);
  else if (t.poet) bits.push(t.poet);
  return bits.join(" · ");
};

export const site = {
  name: "स्वरधारा",
  roman: "Swardhara",
  tagline: "अभंग, कीर्तन आणि भजनाचा संग्रह",
  description:
    "वारकरी परंपरेतली अभंग, कीर्तनं, भजनं, पंचपदी आणि स्तोत्रं. एकच अभंग अनेक रागांत आणि अनेक गळ्यांतून, सगळं एकाच ठिकाणी.",
};

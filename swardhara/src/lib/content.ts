/**
 * Swardhara — content model.
 *
 * Everything the site renders comes from this file. Pages read it; no component
 * hard-codes a song title or a poet's name.
 *
 * On audio: we never host recordings. Nearly every well-known recording of these
 * songs is owned by Saregama / HMV, Times Music or a similar label, so a track
 * here is a *pointer* to a YouTube video that the label itself published, played
 * through the YouTube IFrame API. `youtubeId: null` means the pointer has not
 * been verified yet, and such a track renders as unplayable rather than as a
 * broken player. See PHASE 3 in README.md before filling these in.
 */

export type Slug = string;

/** A form of Marathi song. The site is organised around these first. */
export type Genre = {
  slug: Slug;
  /** Devanagari name, used everywhere in the UI. */
  name: string;
  /** Latin transliteration, used for URLs, alt text and search. */
  roman: string;
  /** One line, shown on the genre card. */
  tagline: string;
  /** Two or three sentences, shown at the top of the genre page. */
  blurb: string;
  /** Drives the card's colour treatment. Matches an accent token in globals.css. */
  accent: "geru" | "tulsi" | "haldi" | "nil" | "gulal";
};

export type Track = {
  slug: Slug;
  title: string;
  roman: string;
  genre: Slug;
  /** Lyricist or composing saint. Free text: some are traditional. */
  poet: string;
  /** Best-known playback artist for the recording we point at. */
  singer: string;
  composer?: string;
  /**
   * YouTube video id for a label-published upload.
   * null = not yet verified. Never guess one: a wrong id plays the wrong song.
   */
  youtubeId: string | null;
};

export type Poet = {
  slug: Slug;
  name: string;
  roman: string;
  /** e.g. "इ.स. १६०८ – १६५०". Empty string for traditional or unknown. */
  years: string;
  /** One line under the name. */
  epithet: string;
  blurb: string;
  genres: Slug[];
};

export type Playlist = {
  slug: Slug;
  name: string;
  roman: string;
  blurb: string;
  /** Track slugs, in playing order. */
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
      "वारकरी संप्रदायाचा श्वास. ज्ञानेश्वर, नामदेव, एकनाथ, तुकाराम — यांनी संस्कृतच्या कुलुपातून भक्ती काढून ती मराठीच्या ओठांवर ठेवली. अभंग म्हणजे जे भंग पावत नाही ते.",
    accent: "geru",
  },
  {
    slug: "gaulan",
    name: "गौळण",
    roman: "Gaulan",
    tagline: "मथुरेच्या वाटेवरचा खट्याळ अडवा",
    blurb:
      "गवळणी दही-दूध घेऊन मथुरेला निघाल्या आहेत आणि कृष्ण वाट अडवून उभा आहे. भक्तीत शृंगार आणि विनोद मिसळणारा हा प्रकार कीर्तनाच्या पूर्वरंगात हमखास येतो.",
    accent: "gulal",
  },
  {
    slug: "bhavgeet",
    name: "भावगीत",
    roman: "Bhavgeet",
    tagline: "देव नाही, फक्त माणसाचं मन",
    blurb:
      "विसाव्या शतकात मराठी कवितेला चाल लागली आणि भावगीत जन्मलं. प्रेम, विरह, पाऊस, आठवण — देवाचा उल्लेख न करता गायलेलं सगळं.",
    accent: "nil",
  },
  {
    slug: "bhaktigeet",
    name: "भक्तिगीत",
    roman: "Bhaktigeet",
    tagline: "पहाटेच्या रेडिओवरचा स्वर",
    blurb:
      "अभंगाइतकं जुनं नाही आणि भावगीताइतकं ऐहिक नाही. गणपती, दत्त, राम, विठ्ठल — आधुनिक चालींमध्ये बांधलेली स्तुती.",
    accent: "haldi",
  },
  {
    slug: "natyasangeet",
    name: "नाट्यसंगीत",
    roman: "Natyasangeet",
    tagline: "रंगमंचावर उभा राहिलेला राग",
    blurb:
      "संगीत नाटकाची देणगी. शास्त्रीय रागाला नाटकाचा प्रसंग दिला की नाट्यपद तयार होतं — आणि प्रेक्षक 'वन्समोअर' म्हणेपर्यंत ते संपत नाही.",
    accent: "tulsi",
  },
  {
    slug: "lavani",
    name: "लावणी",
    roman: "Lavani",
    tagline: "ढोलकीवर थांबलेला ठेका",
    blurb:
      "तमाशाच्या फडातून आलेली, ढोलकीच्या तालावर चालणारी लावणी. शृंगारिक आणि निर्गुणी — दोन्ही रूपांत ती तितकीच खरी आहे.",
    accent: "gulal",
  },
  {
    slug: "koligeet",
    name: "कोळीगीत",
    roman: "Koligeet",
    tagline: "समुद्रावरून परत येणारी होडी",
    blurb:
      "कोकण किनाऱ्याच्या कोळी समाजाची गाणी. लाटांचा हेलकावा थेट तालात उतरतो — म्हणून कोळीगीत ऐकताना पाय आपोआप हलतात.",
    accent: "nil",
  },
];

/* ------------------------------------------------------------------ */
/* Poets, saints and the voices that carried them                      */
/* ------------------------------------------------------------------ */

export const poets: Poet[] = [
  {
    slug: "dnyaneshwar",
    name: "संत ज्ञानेश्वर",
    roman: "Sant Dnyaneshwar",
    years: "इ.स. १२७५ – १२९६",
    epithet: "माउली",
    blurb:
      "वयाच्या एकविसाव्या वर्षी समाधी घेणाऱ्या या कवीने गीतेचं मराठीत भाष्य लिहिलं आणि मराठी भाषेला तत्त्वज्ञान बोलायला शिकवलं. 'पसायदान' आजही सभा संपवतं.",
    genres: ["abhang"],
  },
  {
    slug: "namdev",
    name: "संत नामदेव",
    roman: "Sant Namdev",
    years: "इ.स. १२७० – १३५०",
    epithet: "कीर्तनाचा आद्य प्रवर्तक",
    blurb:
      "पंढरपूरचा हा शिंपी कवी मराठी आणि हिंदी दोन्हींत लिहितो, आणि त्याचे अभंग गुरू ग्रंथ साहिबातही आहेत. भक्तीला महाराष्ट्राबाहेर नेणारा पहिला आवाज.",
    genres: ["abhang"],
  },
  {
    slug: "eknath",
    name: "संत एकनाथ",
    roman: "Sant Eknath",
    years: "इ.स. १५३३ – १५९९",
    epithet: "भारूडकार",
    blurb:
      "पैठणच्या एकनाथांनी भारूड लिहिलं — वरून विनोदी रूपक, आतून अध्यात्म. गौळणींनाही त्यांनीच साहित्याचा दर्जा दिला.",
    genres: ["abhang", "gaulan"],
  },
  {
    slug: "tukaram",
    name: "संत तुकाराम",
    roman: "Sant Tukaram",
    years: "इ.स. १६०८ – १६५०",
    epithet: "जगद्गुरू",
    blurb:
      "देहूचा हा वाणी सर्वांत थेट बोलतो. दांभिकपणावर तो तुटून पडतो आणि विठ्ठलाशी भांडतोही. मराठीतली सर्वांत निर्भय कविता त्याची आहे.",
    genres: ["abhang"],
  },
  {
    slug: "bahinabai",
    name: "बहिणाबाई चौधरी",
    roman: "Bahinabai Chaudhari",
    years: "इ.स. १८८० – १९५१",
    epithet: "निरक्षर कवयित्री",
    blurb:
      "शेतात काम करताना अहिराणी-मराठीत ओव्या रचणाऱ्या बहिणाबाई स्वतः लिहू-वाचू शकत नव्हत्या. त्यांच्या मुलाने त्या लिहून ठेवल्या नसत्या तर हे सगळं हरवलं असतं.",
    genres: ["bhavgeet"],
  },
  {
    slug: "gadima",
    name: "ग. दि. माडगूळकर",
    roman: "G. D. Madgulkar",
    years: "इ.स. १९१९ – १९७७",
    epithet: "आधुनिक वाल्मिकी",
    blurb:
      "'गीतरामायण' लिहून त्यांनी रामायण रेडिओवर आणलं आणि संपूर्ण महाराष्ट्र दर आठवड्याला ऐकत बसला. गदिमांशिवाय मराठी भावगीताचा इतिहास लिहिता येत नाही.",
    genres: ["bhavgeet", "bhaktigeet"],
  },
  {
    slug: "sudhir-phadke",
    name: "सुधीर फडके",
    roman: "Sudhir Phadke",
    years: "इ.स. १९१९ – २००२",
    epithet: "बाबूजी",
    blurb:
      "गदिमांचे शब्द ज्या आवाजात पोहोचले तो आवाज. संगीतकार आणि गायक दोन्ही — 'गीतरामायण' हे त्यांचं आणि गदिमांचं संयुक्त स्मारक आहे.",
    genres: ["bhavgeet", "bhaktigeet"],
  },
  {
    slug: "lata-mangeshkar",
    name: "लता मंगेशकर",
    roman: "Lata Mangeshkar",
    years: "इ.स. १९२९ – २०२२",
    epithet: "स्वरसम्राज्ञी",
    blurb:
      "हिंदीत जग जिंकण्याआधी आणि नंतरही तिने मराठी अभंग, भावगीत आणि कोळीगीत गायलं. मराठी माणसासाठी ती आधी 'दीदी' आहे, मग बाकी सगळं.",
    genres: ["abhang", "bhavgeet", "koligeet"],
  },
];

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */
/* youtubeId is deliberately null across the board — see the note at the top of
 * this file. Phase 3 verifies each one against a label-published upload. */

export const tracks: Track[] = [
  {
    slug: "pasaydan",
    title: "पसायदान",
    roman: "Pasaydan",
    genre: "abhang",
    poet: "संत ज्ञानेश्वर",
    singer: "लता मंगेशकर",
    composer: "हृदयनाथ मंगेशकर",
    youtubeId: null,
  },
  {
    slug: "he-vishwachi-maze-ghar",
    title: "हे विश्वचि माझे घर",
    roman: "He Vishwachi Maze Ghar",
    genre: "abhang",
    poet: "संत ज्ञानेश्वर",
    singer: "किशोरी आमोणकर",
    youtubeId: null,
  },
  {
    slug: "sundar-te-dhyan",
    title: "सुंदर ते ध्यान",
    roman: "Sundar Te Dhyan",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "पं. भीमसेन जोशी",
    youtubeId: null,
  },
  {
    slug: "je-ka-ranjale-ganjale",
    title: "जे का रंजले गांजले",
    roman: "Je Ka Ranjale Ganjale",
    genre: "abhang",
    poet: "संत तुकाराम",
    singer: "पं. भीमसेन जोशी",
    youtubeId: null,
  },
  {
    slug: "teerth-vitthal",
    title: "तीर्थ विठ्ठल क्षेत्र विठ्ठल",
    roman: "Teerth Vitthal Kshetra Vitthal",
    genre: "abhang",
    poet: "संत नामदेव",
    singer: "पं. भीमसेन जोशी",
    youtubeId: null,
  },
  {
    slug: "vithu-mauli",
    title: "विठू माउली तू माउली जगाची",
    roman: "Vithu Mauli Tu Mauli Jagachi",
    genre: "bhaktigeet",
    poet: "पारंपरिक",
    singer: "प्रल्हाद शिंदे",
    youtubeId: null,
  },
  {
    slug: "yamuna-jali",
    title: "यमुनाजळी खेळू खेळ",
    roman: "Yamunajali Khelu Khel",
    genre: "gaulan",
    poet: "पारंपरिक",
    singer: "आशा भोसले",
    youtubeId: null,
  },
  {
    slug: "radha-hi-bawari",
    title: "राधा ही बावरी",
    roman: "Radha Hi Bawari",
    genre: "bhavgeet",
    poet: "अश्विनी शेंडे",
    singer: "श्रीधर फडके",
    composer: "श्रीधर फडके",
    youtubeId: null,
  },
  {
    slug: "ghana-ghana-mala",
    title: "घन घन माला नभी दाटल्या",
    roman: "Ghan Ghan Mala Nabhi Datalya",
    genre: "bhavgeet",
    poet: "ग. दि. माडगूळकर",
    singer: "सुधीर फडके",
    composer: "सुधीर फडके",
    youtubeId: null,
  },
  {
    slug: "he-bandh-reshmache",
    title: "हे बंध रेशमाचे",
    roman: "He Bandh Reshmache",
    genre: "bhavgeet",
    poet: "शांता शेळके",
    singer: "आशा भोसले",
    youtubeId: null,
  },
  {
    slug: "man-vadhay-vadhay",
    title: "मन वढाय वढाय",
    roman: "Man Vadhay Vadhay",
    genre: "bhavgeet",
    poet: "बहिणाबाई चौधरी",
    singer: "आशा भोसले",
    youtubeId: null,
  },
  {
    slug: "swayamvar-zale-sitecha",
    title: "स्वयंवर झाले सीतेचे",
    roman: "Swayamvar Zale Sitecha",
    genre: "bhaktigeet",
    poet: "ग. दि. माडगूळकर",
    singer: "सुधीर फडके",
    composer: "सुधीर फडके",
    youtubeId: null,
  },
  {
    slug: "he-surano-chandra-vha",
    title: "हे सुरांनो चंद्र व्हा",
    roman: "He Surano Chandra Vha",
    genre: "natyasangeet",
    poet: "वसंत कानेटकर",
    singer: "पं. वसंतराव देशपांडे",
    composer: "पं. जितेंद्र अभिषेकी",
    youtubeId: null,
  },
  {
    slug: "ghei-chhand-makarand",
    title: "घेई छंद मकरंद",
    roman: "Ghei Chhand Makarand",
    genre: "natyasangeet",
    poet: "राम गणेश गडकरी",
    singer: "पं. वसंतराव देशपांडे",
    youtubeId: null,
  },
  {
    slug: "priye-paha",
    title: "प्रिये पहा",
    roman: "Priye Paha",
    genre: "natyasangeet",
    poet: "कृ. प्र. खाडिलकर",
    singer: "छोटा गंधर्व",
    youtubeId: null,
  },
  {
    slug: "bugadi-mazi-sandali",
    title: "बुगडी माझी सांडली गं",
    roman: "Bugadi Mazi Sandali Ga",
    genre: "lavani",
    poet: "जगदीश खेबूडकर",
    singer: "आशा भोसले",
    composer: "वसंत पवार",
    youtubeId: null,
  },
  {
    slug: "mi-hay-koli",
    title: "मी हाय कोळी",
    roman: "Mi Hay Koli",
    genre: "koligeet",
    poet: "पारंपरिक",
    singer: "शाहीर विठ्ठल उमप",
    youtubeId: null,
  },
  {
    slug: "vadal-vara-sutala",
    title: "वादळ वारं सुटलं गो",
    roman: "Vadal Vara Sutala Go",
    genre: "koligeet",
    poet: "पारंपरिक",
    singer: "कोरस",
    youtubeId: null,
  },
];

/* ------------------------------------------------------------------ */
/* Playlists                                                           */
/* ------------------------------------------------------------------ */

export const playlists: Playlist[] = [
  {
    slug: "pahatecha-abhang",
    name: "पहाटेचे अभंग",
    roman: "Pahatecha Abhang",
    blurb: "काकड आरतीच्या वेळेची शांतता. भीमसेनजींच्या आवाजात दिवस सुरू होतो.",
    tracks: ["sundar-te-dhyan", "teerth-vitthal", "je-ka-ranjale-ganjale", "pasaydan"],
  },
  {
    slug: "ashadhi-wari",
    name: "आषाढी वारी",
    roman: "Ashadhi Wari",
    blurb: "पंढरपूरच्या वाटेवर टाळ-मृदंगासोबत चालणारी यादी.",
    tracks: ["vithu-mauli", "teerth-vitthal", "he-vishwachi-maze-ghar", "yamuna-jali"],
  },
  {
    slug: "natyasangeetachi-maifil",
    name: "नाट्यसंगीताची मैफल",
    roman: "Natyasangeetachi Maifil",
    blurb: "पडदा उघडतो, तंबोरा लागतो, आणि रंगमंचावर राग उभा राहतो.",
    tracks: ["ghei-chhand-makarand", "he-surano-chandra-vha", "priye-paha"],
  },
  {
    slug: "pavsali-bhavgeet",
    name: "पावसाळी भावगीतं",
    roman: "Pavsali Bhavgeet",
    blurb: "खिडकीबाहेर पाऊस आणि आत गदिमांचे शब्द. यापेक्षा जास्त काही नको.",
    tracks: [
      "ghana-ghana-mala",
      "radha-hi-bawari",
      "he-bandh-reshmache",
      "man-vadhay-vadhay",
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

/** Resolves a playlist's track slugs to Track objects, dropping any unknown slug. */
export const playlistTracks = (p: Playlist) =>
  p.tracks.map(trackBySlug).filter((t): t is Track => Boolean(t));

/** True once a track points at a verified upload and can actually be played. */
export const isPlayable = (t: Track) => t.youtubeId !== null;

export const site = {
  name: "स्वरधारा",
  roman: "Swardhara",
  tagline: "मराठी गाण्यांचा अखंड प्रवाह",
  description:
    "अभंग, गौळण, भावगीत, भक्तिगीत, नाट्यसंगीत, लावणी आणि कोळीगीत — एकाच ठिकाणी, चोवीस तास वाहणारी मराठी स्वरधारा.",
};

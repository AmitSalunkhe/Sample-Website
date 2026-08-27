export const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Story = {
  id: string;
  title: string;
  line: string;
  img: string;
  place: string;
};

/** Occasions we shoot, each written as the feeling, not the package. */
export const STORIES: Story[] = [
  {
    id: "wedding",
    title: "Weddings",
    line: "The day two families became one. Every glance, every vow, every aunt who cried harder than she meant to.",
    img: "1519741497674-611481863552",
    place: "Udaipur",
  },
  {
    id: "first-birthday",
    title: "First Birthdays",
    line: "One tiny candle and a room full of love. Cake-covered smiles, and grandparents quietly wiping their eyes.",
    img: "1490578474895-699cd4e2cf59",
    place: "Pune",
  },
  {
    id: "engagement",
    title: "Engagements",
    line: "The quiet, trembling yes that started an entire lifetime.",
    img: "1529636798458-92182e662485",
    place: "Goa",
  },
  {
    id: "newborn",
    title: "Newborn",
    line: "First breaths, first cries, first everything, held forever in light.",
    img: "1476703993599-0035a21b17a9",
    place: "Mumbai",
  },
  {
    id: "festivals",
    title: "Festivals",
    line: "Traditions handed gently from one generation to the next, in the same room, in better light.",
    img: "1503454537195-1dcabb73ffb9",
    place: "Jaipur",
  },
  {
    id: "family",
    title: "Family Reunions",
    line: "Everyone under one roof again, and laughter in every corner of it.",
    img: "1460364157752-926555421a7e",
    place: "Nashik",
  },
  {
    id: "graduation",
    title: "Graduations",
    line: "Years of quiet effort, finally worn with pride.",
    img: "1543269865-cbf427effbad",
    place: "Bengaluru",
  },
  {
    id: "corporate",
    title: "Corporate",
    line: "Milestones worth far more than a memo.",
    img: "1600880292203-757bb62b4baf",
    place: "Hyderabad",
  },
];

export const GALLERY = [
  "1522673607200-164d1b6ce486",
  "1583939003579-730e3918a45a",
  "1509909756405-be0199881695",
  "1438761681033-6461ffad8d80",
  "1452587925148-ce544e77e70d",
  "1511285560929-80b456fea0bc",
  "1507003211169-0a1dd7228f2d",
  "1471286174890-9c112ffca5b4",
];

export const PROCESS = [
  {
    n: "01",
    t: "Send us your memories",
    d: "Photographs, old video, voice notes, and the stories only you can tell. A shoebox of prints is a perfectly good starting point.",
  },
  {
    n: "02",
    t: "We shape the story",
    d: "A real editor sits with your material and finds the thread. We call you once we have it, before a single frame is cut.",
  },
  {
    n: "03",
    t: "Cinematic production",
    d: "Grading, sound, music and pacing: the craft that turns a sequence of clips into something that actually moves you.",
  },
  {
    n: "04",
    t: "Yours, for good",
    d: "Delivered in archival quality, backed up on our end for twenty years, and re-mastered free whenever formats change.",
  },
];

export const PACKAGES = [
  {
    name: "The Half Day",
    price: "₹45,000",
    for: "Birthdays, naming ceremonies, intimate gatherings",
    includes: [
      "Five hours, one photographer",
      "120+ edited photographs",
      "A two-minute cinematic cut",
      "Online gallery, delivered in ten days",
    ],
    featured: false,
  },
  {
    name: "The Wedding",
    price: "₹1,85,000",
    for: "Full multi-day celebrations, start to finish",
    includes: [
      "Three days, two photographers and a cinematographer",
      "600+ edited photographs",
      "An eight-minute film, plus a 60-second teaser",
      "Hand-bound album, 40 spreads",
      "Twenty-year archival backup",
    ],
    featured: true,
  },
  {
    name: "Restoration",
    price: "From ₹18,000",
    for: "Old photographs and family footage brought back",
    includes: [
      "Scan, repair and colour-restore up to 60 images",
      "Damaged film stabilised and re-graded",
      "Narrated family film, up to five minutes",
      "Originals returned, untouched",
    ],
    featured: false,
  },
];

export const VOICES = [
  {
    q: "We hired them for the wedding. What we did not expect was my father watching his own wedding footage, restored, on the same screen an hour later. He did not speak for a while.",
    n: "Ananya & Rohit",
    m: "Wedding film, Udaipur",
  },
  {
    q: "I sent them a biscuit tin of loose photographs with no dates and no order. They sent back the story of my mother's life.",
    n: "Meera Kulkarni",
    m: "Restoration",
  },
  {
    q: "Our daughter will not remember her first birthday. But she will have seven minutes of it, and she will know exactly how loved she was in that room.",
    n: "The Fernandes family",
    m: "First birthday film",
  },
];

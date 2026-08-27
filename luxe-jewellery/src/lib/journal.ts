export type Article = {
  slug: string;
  kicker: string;
  title: string;
  readingTime: string;
  standfirst: string;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "why-we-cut-our-own-rough",
    kicker: "Craft",
    title: "Why we still cut our own rough",
    readingTime: "Six minutes",
    standfirst:
      "Buying finished stones would save us nine weeks and a great deal of money. We have tried it twice and gone back both times.",
    body: [
      "A cut stone arrives with its decisions already made. Someone else has judged where the inclusions sit, how deep the pavilion should run, and how much weight to keep. Those judgements were almost always made to maximise carat weight, because that is what a wholesale price list rewards. They were not made to maximise how the stone behaves in a room with one window.",
      "When we buy rough, we are buying the argument rather than the conclusion. Our cutter will sit with a stone for a week before touching it. Sometimes the answer is to lose half a carat to open the table and let light leave the stone properly. On paper that is a worse stone. On a hand it is not close.",
      "This is also the reason no two Aurelia centre stones are identical, and why we cannot show you a catalogue with fixed specifications. Every stone is the resolution of a specific problem in a specific piece of rough.",
      "It costs us margin on every single piece. We keep doing it because the alternative is selling something we did not really make.",
    ],
  },
  {
    slug: "storing-gold",
    kicker: "Care",
    title: "How to store gold so it never needs re-polishing",
    readingTime: "Four minutes",
    standfirst:
      "Most of the scratches we repair were not caused by wearing the piece. They were caused by the drawer it lives in.",
    body: [
      "Gold is soft. 22k is softer than 18k, and both are softer than the steel of a watch back or the zip of the bag you dropped them into. Nearly all the damage we see is contact damage from other objects, not from daily wear.",
      "The single most effective thing you can do is store each piece separately. A soft pouch each, or a lined box with individual compartments. Not a shared tray, and never a shared pouch with a chain in it.",
      "Keep necklaces hung or laid flat rather than coiled. A fine chain that is coiled under its own clasp will work a kink into itself over a few months, and a kinked link is a weak link.",
      "Take pieces off before swimming, before the gym, and before you use anything containing chlorine. Chlorine attacks the alloy metals rather than the gold itself, which is what causes the pitting that looks like the gold has gone dull from inside.",
      "If a piece does dull, bring it to us before you try anything at home. Most household polishing cloths are abrasive, and removing metal is not reversible.",
    ],
  },
  {
    slug: "fifty-years-at-the-bench",
    kicker: "Heritage",
    title: "The Jaipur bench, fifty years on",
    readingTime: "Nine minutes",
    standfirst:
      "The workshop has moved twice, survived one fire and three generations of argument about whether to mechanise. It never has.",
    body: [
      "The house began in 1974 with two benches in a room off Johari Bazaar. The founding decision, which sounds sentimental now but was mostly practical, was that one artisan should carry a piece from rough to polish rather than passing it down a line.",
      "The practical argument was about accountability. When a setting fails, a line cannot tell you why. One person can, because they remember the stone.",
      "We mechanised exactly once. In the late nineties we bought a casting setup and ran it for eleven months. The pieces were faster, more consistent, and immediately recognisable as not ours. Openwork that had been pierced from solid stock came out with the soft edges casting gives you. We sold the equipment.",
      "Today the bench runs about four hundred pieces a year, which a factory would clear before lunch. Every one is signed on the inner band with the mark of whoever made it, and logged against its stones. That register is now fifty years deep.",
      "It means that when a piece comes back to us for resizing, and they do come back, we can tell you who made it and what they were working with. Several times we have resized a ring for the granddaughter of the woman it was made for, at the same bench, sometimes by the son of the man who signed it.",
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

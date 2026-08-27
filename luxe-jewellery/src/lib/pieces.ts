export type Piece = {
  id: string;
  name: string;
  collection: string;
  src: string;
  metal: string;
  stones: string;
  price: string;
  note: string;
  scale?: number;
};

export const PIECES: Piece[] = [
  {
    id: "infinita",
    name: "Infinita",
    collection: "Continuum",
    src: "/jewels/necklace-3.webp",
    metal: "18k yellow gold",
    stones: "38 brilliant-cut diamonds, 0.42ct total",
    price: "₹1,84,000",
    note:
      "A line with no beginning and no end, set by hand in a single unbroken pavé. The most difficult setting we make, and the one our artisans ask for.",
    scale: 1.15,
  },
  {
    id: "solene",
    name: "Solène",
    collection: "Vows",
    src: "/jewels/ring-1.webp",
    metal: "18k yellow gold",
    stones: "Round brilliant centre, 1.10ct, with graduated shoulders",
    price: "₹4,60,000",
    note:
      "A six-prong crown that lifts the stone clear of the band, so light enters from beneath. Sold as a bridal pair, matched at the bench.",
    scale: 0.92,
  },
  {
    id: "florentine",
    name: "Florentine",
    collection: "Heirloom",
    src: "/jewels/bangles.webp",
    metal: "18k yellow gold",
    stones: "Seven bezel-set diamonds",
    price: "₹1,42,000",
    note:
      "Openwork filigree cut from a solid band — not cast. Nine hours of piercing work before a single stone is set.",
    scale: 0.95,
  },
  {
    id: "trinity",
    name: "Trinité",
    collection: "Continuum",
    src: "/jewels/necklace-1.webp",
    metal: "18k rose gold",
    stones: "Pink sapphire pavé",
    price: "₹2,15,000",
    note:
      "Three interlocking bands that move independently and never separate. Worn long, it turns as you walk and catches light from every side.",
    scale: 1.05,
  },
  {
    id: "lumiere",
    name: "Lumière",
    collection: "Soirée",
    src: "/jewels/earring-1.webp",
    metal: "18k yellow gold",
    stones: "Graduated brilliant-cut diamonds",
    price: "₹2,90,000",
    note:
      "Weighted to sit forward, not flat — so the drop stays in motion and the stones keep working under low light.",
    scale: 0.9,
  },
  {
    id: "aurora",
    name: "Aurora",
    collection: "Soirée",
    src: "/jewels/necklace-5.webp",
    metal: "18k yellow gold",
    stones: "Pavé-set brilliants",
    price: "₹3,25,000",
    note:
      "Our most photographed piece, and the one most often returned to us for resizing — because it is passed down.",
    scale: 1.1,
  },
];

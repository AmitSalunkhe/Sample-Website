import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-paper-edge bg-paper-deep">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="font-display text-2xl text-ink">{site.name}</p>
        <p className="mt-2 max-w-xl text-ink-soft">{site.description}</p>

        {/*
          Not decoration. The site points at label-published uploads and hosts
          no audio of its own, and saying so plainly is the whole basis on which
          it can exist.
        */}
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink-faint">
          स्वरधारा स्वतः कोणतीही ध्वनिमुद्रणं साठवत नाही. इथली सर्व गाणी संबंधित
          संगीत कंपन्यांनी YouTube वर प्रसिद्ध केलेल्या मूळ ध्वनिफितींमधून वाजतात.
          सर्व हक्क त्या-त्या हक्कदारांचे.
        </p>

        <p className="mt-8 text-sm text-ink-faint">
          © {new Date().getFullYear()} {site.roman}
        </p>
      </div>
    </footer>
  );
}

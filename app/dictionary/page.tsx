import Link from "next/link";
import { glossary } from "../../lib/glossary";

const glossaryEntries = Object.entries(glossary).sort(([first], [second]) =>
  first.localeCompare(second),
);

export const metadata = {
  title: "Quantum Tunnel Dictionary | Alliant",
  description:
    "Plain-language definitions for the Quantum Tunnel paper-game terms used on the playtest board.",
};

export default function DictionaryPage() {
  return (
    <main className="alliant-page dictionary-page">
      <div className="page-backdrop" aria-hidden="true" />

      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Dictionary navigation">
          <Link href="/">Home</Link>
          <Link href="/quantum-tunnel">Playtest Board</Link>
        </nav>
      </header>

      <section className="dictionary-hero" aria-labelledby="dictionary-title">
        <p className="eyebrow">Quantum Tunnel / glossary</p>
        <h1 id="dictionary-title">Dictionary</h1>
        <p>
          Simple definitions for the paper-game words used on the playtest
          board.
        </p>
      </section>

      <section className="dictionary-grid" aria-label="Board-game glossary">
        {glossaryEntries.map(([term, definition]) => (
          <article className="dictionary-entry" key={term}>
            <h2>{term}</h2>
            <p>{definition}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

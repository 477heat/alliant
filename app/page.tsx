import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    name: "Playtest Board",
    href: "/quantum-tunnel",
    signal: "Paper game",
    body: "A visual table layout for testing Quantum Tunnel cards, missions, battle pressure, and gate checks.",
  },
  {
    name: "Board-Pieces",
    href: "/board-pieces",
    signal: "Room editor",
    body: "A scaled board for placing measured room shapes and freely moving rotated pieces.",
  },
  {
    name: "Sovereign Engine",
    href: "https://sovengine.xyz",
    signal: "Verified origin",
    body: "A Web3 character engine that uses astrology and EAS verification for proof of personhood, turning verified origin data into characters and future progeny projects.",
  },
  {
    name: "Anthologies",
    href: "https://anthologies.xyz",
    signal: "Story worlds",
    body: "A home for connected stories, lore, collections, and living creative universes.",
  },
] as const;

export default function Home() {
  return (
    <main className="alliant-page">
      <div className="page-backdrop" aria-hidden="true" />
      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Project links">
          {projects.map((project) => (
            <Link key={project.href} href={project.href}>
              {project.name}
            </Link>
          ))}
        </nav>
      </header>

      <section className="hero-shell" aria-labelledby="alliant-title">
        <div className="hero-copy">
          <p className="eyebrow">Parent signal / creator economy</p>
          <h1 id="alliant-title">Alliant</h1>
          <p className="hero-lede">
            Alliant builds connected projects that help creators keep ownership
            of their work and turn original ideas into durable passive-income
            paths, powered by Web3.
          </p>
        </div>

        <div className="shield-stage" aria-label="Alliant project gallery">
          <div className="gold-light" aria-hidden="true" />
          <Image
            src="/alliant_shield.png"
            alt="Alliant shield logo"
            width={540}
            height={540}
            className="shield-logo"
            priority
          />

          <div className="project-gallery">
            {projects.map((project, index) => (
              <Link
                className={`project-card project-card-${index + 1}`}
                href={project.href}
                key={project.href}
              >
                <span className="project-signal">{project.signal}</span>
                <strong>{project.name}</strong>
                <span>{project.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mission-band" aria-label="Alliant mission">
        <div>
          <p className="section-label">Direction</p>
          <h2>Built for creators who want their work to keep working.</h2>
        </div>
        <p>
          Sovereign Engine and Anthologies approach the same mission from two
          angles: identity-driven creation and story. Together they form an
          ecosystem for keeping the source of creation visible, useful, and able
          to create income over time.
        </p>
      </section>

      <footer className="site-footer">
        <span>Paper Lab</span>
        <span className="footer-links">
          <Link href="/quantum-tunnel">Quantum Tunnel Playtest Board</Link>
          <Link href="/dictionary">Dictionary</Link>
        </span>
      </footer>
    </main>
  );
}

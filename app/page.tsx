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
    name: "Sovereign Engine",
    href: "https://sovengine.xyz",
    signal: "Verified origin",
    body: "A command layer for human-linked ownership, access, attributes, and future progeny projects.",
  },
  {
    name: "SoulMaster",
    href: "https://soulmaster.xyz",
    signal: "Creator tools",
    body: "A path for shaping, packaging, and extending original work into usable creator assets.",
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
            paths.
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
          Sovereign Engine, SoulMaster, and Anthologies each approach the same
          mission from a different angle: identity, tooling, and story. Together
          they form an ecosystem for keeping the source of creation visible,
          useful, and able to create income over time.
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

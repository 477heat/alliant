import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    name: "Kickstarter Updates",
    navLabel: "Updates",
    href: "https://anthologies.xyz/kickstarter-updates",
    signal: "Launch journal",
    body: "The current public update page for Anthologies, campaign progress, project notes, and what supporters should know next.",
  },
  {
    name: "Sovereign Engine",
    navLabel: "Engine",
    href: "https://sovengine.xyz",
    signal: "Character engine",
    body: "Uses astrology and EAS verification for proof of personhood. The playtest board and board-pieces tools are ongoing test surfaces for this engine.",
  },
  {
    name: "Anthologies",
    navLabel: "Anthologies",
    href: "https://anthologies.xyz",
    signal: "Story worlds",
    body: "The story and publishing layer where worlds, lore, updates, and creator-facing releases can be gathered around the same source projects.",
  },
  {
    name: "Web3 Access",
    navLabel: "Web3",
    href: "#web3-access",
    signal: "Wallet tools",
    body: "Wallets and NFTs are used as access tools, portable user storage, and production records for what a creator makes, tests, or unlocks.",
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
              {project.navLabel}
            </Link>
          ))}
        </nav>
      </header>

      <section className="hero-shell" aria-labelledby="alliant-title">
        <div className="hero-copy">
          <p className="eyebrow">Parent signal / creator economy</p>
          <h1 id="alliant-title">Alliant</h1>
          <p className="hero-lede">
            Alliant connects story worlds, character engines, playtest tools,
            and Web3 access systems so creators can build, test, publish, and
            keep a stronger record of what they make.
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

      <section className="mission-band" id="web3-access" aria-label="Alliant mission">
        <div>
          <p className="section-label">Direction</p>
          <h2>One project family, several connected tools.</h2>
        </div>
        <p>
          Anthologies carries the public story layer, Sovereign Engine turns
          verified identity and astrology into playable character systems, and
          the Playtest Board plus Board-Pieces tools help those ideas become
          testable. Web3 ties the pieces together with wallets and NFTs used for
          access, user-owned records, and creator production paths.
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

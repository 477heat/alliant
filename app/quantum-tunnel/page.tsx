import Link from "next/link";

const soulStats = [
  { label: "Vigor", value: 6, note: "body" },
  { label: "Will", value: 7, note: "resolve" },
  { label: "Focus", value: 6, note: "clarity" },
  { label: "Grace", value: 5, note: "timing" },
  { label: "Echo", value: 6, note: "memory" },
] as const;

const loadoutCards = [
  {
    name: "Anchor Thread",
    type: "Defense",
    stat: "Vigor",
    effect: "Prevent 1 drain.",
  },
  {
    name: "Signal Lens",
    type: "Boost",
    stat: "Focus",
    effect: "+2 Focus at the gate.",
  },
  {
    name: "Memory Spark",
    type: "Recovery",
    stat: "Echo",
    effect: "Recover 1 exhausted card.",
  },
  {
    name: "Field Ration",
    type: "Tool",
    stat: "Pressure",
    effect: "Reduce pressure by 1.",
  },
  {
    name: "Relay Knife",
    type: "Battle",
    stat: "Grace",
    effect: "Clear 1 minor threat.",
  },
] as const;

const pressureTurns = [
  { turn: "01", card: "Signal Static", result: "-1 Focus unless blocked" },
  { turn: "02", card: "Body Drift", result: "-1 Vigor unless anchored" },
  { turn: "03", card: "Rift Hound", result: "Battle: clear or lose 2 Vigor" },
  { turn: "04", card: "Echo Break", result: "-1 Echo unless recovered" },
] as const;

const outcomes = [
  { label: "Fail", detail: "Soul returns. Reward locked." },
  { label: "Partial", detail: "Weak Signal Fragment." },
  { label: "Full", detail: "Signal Fragment kept." },
] as const;

export const metadata = {
  title: "Quantum Tunnel Playtest Board | Alliant",
  description:
    "A visual paper-game board for testing Quantum Tunnel loadouts, mission pressure, battle threats, and gate checks.",
};

export default function QuantumTunnelPage() {
  return (
    <main className="alliant-page playtest-page">
      <div className="page-backdrop" aria-hidden="true" />

      <header className="site-header">
        <Link className="brand-mark" href="/" aria-label="Alliant home">
          <span className="brand-dot" />
          <span>Alliant</span>
        </Link>
        <nav className="project-nav" aria-label="Playtest navigation">
          <Link href="/">Home</Link>
          <Link href="#loadout">Loadout</Link>
          <Link href="#mission">Mission</Link>
          <Link href="#gate">Gate</Link>
        </nav>
      </header>

      <section className="playtest-hero" aria-labelledby="playtest-title">
        <div>
          <p className="eyebrow">Quantum Tunnel / paper test</p>
          <h1 id="playtest-title">Playtest Board</h1>
        </div>
        <p>
          One soul, five cards, four pressure turns, one gate, one reward.
        </p>
      </section>

      <section className="tabletop-grid" aria-label="Quantum Tunnel tabletop layout">
        <article className="soul-sheet">
          <div className="board-heading">
            <p className="section-label">Character</p>
            <h2>Test Soul</h2>
          </div>
          <div className="soul-core">
            <div className="soul-sigil" aria-hidden="true">
              QT
            </div>
            <div>
              <span className="mini-label">Mission role</span>
              <strong>Signal Runner</strong>
              <p>Balanced starting soul for the first table test.</p>
            </div>
          </div>
          <div className="stat-grid">
            {soulStats.map((stat) => (
              <div className="stat-tile" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <em>{stat.note}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="mission-panel" id="mission">
          <div className="board-heading">
            <p className="section-label">Mission</p>
            <h2>Find The Signal Origin</h2>
          </div>
          <div className="mission-track">
            {pressureTurns.map((pressure) => (
              <div className="pressure-card" key={pressure.turn}>
                <span>Turn {pressure.turn}</span>
                <strong>{pressure.card}</strong>
                <p>{pressure.result}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="gate-panel" id="gate">
          <div className="board-heading">
            <p className="section-label">Final gate</p>
            <h2>Will + Focus + Echo</h2>
          </div>
          <div className="gate-meter">
            <span>18</span>
            <div className="gate-window">
              <span>target range</span>
            </div>
            <span>24</span>
          </div>
          <p className="gate-total">7 + 6 + 6 = 19</p>
          <div className="outcome-row">
            {outcomes.map((outcome) => (
              <div className="outcome-chip" key={outcome.label}>
                <strong>{outcome.label}</strong>
                <span>{outcome.detail}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="loadout-zone" id="loadout" aria-label="Five-card loadout">
        <div className="board-heading">
          <p className="section-label">Five-card loadout</p>
          <h2>Choose the right tool, not just the strongest card.</h2>
        </div>
        <div className="loadout-cards">
          {loadoutCards.map((card) => (
            <article className="game-card" key={card.name}>
              <span className="card-type">{card.type}</span>
              <h3>{card.name}</h3>
              <div className="card-stat">{card.stat}</div>
              <p>{card.effect}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

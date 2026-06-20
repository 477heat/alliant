import Link from "next/link";
import { GlossaryTerm, GlossaryText } from "../../components/GlossaryTerm";

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
          <Link href="/dictionary">Dictionary</Link>
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
          One <GlossaryTerm term="Soul">soul</GlossaryTerm>, five{" "}
          <GlossaryTerm term="Loadout">cards</GlossaryTerm>, four{" "}
          <GlossaryTerm term="Mission Pressure">pressure turns</GlossaryTerm>, one{" "}
          <GlossaryTerm term="Final Gate">gate</GlossaryTerm>, one{" "}
          <GlossaryTerm term="Reward">reward</GlossaryTerm>.
        </p>
      </section>

      <section className="tabletop-grid" aria-label="Quantum Tunnel tabletop layout">
        <article className="soul-sheet">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Character">Character</GlossaryTerm>
            </p>
            <h2>Test Soul</h2>
          </div>
          <div className="soul-core">
            <div className="soul-sigil" aria-hidden="true">
              QT
            </div>
            <div>
              <span className="mini-label">Mission role</span>
              <strong>Signal Runner</strong>
              <p>
                Balanced starting <GlossaryTerm term="Soul">soul</GlossaryTerm>{" "}
                for the first table test.
              </p>
            </div>
          </div>
          <div className="stat-grid">
            {soulStats.map((stat) => (
              <div className="stat-tile" key={stat.label}>
                <span>
                  <GlossaryTerm term={stat.label}>{stat.label}</GlossaryTerm>
                </span>
                <strong>{stat.value}</strong>
                <em>{stat.note}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="mission-panel" id="mission">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Mission">Mission</GlossaryTerm>
            </p>
            <h2>Find The Signal Origin</h2>
          </div>
          <div className="mission-track">
            {pressureTurns.map((pressure) => (
              <div className="pressure-card" key={pressure.turn}>
                <span>Turn {pressure.turn}</span>
                <strong>{pressure.card}</strong>
                <p>
                  <GlossaryText
                    terms={[
                      "Battle",
                      "Drain",
                      "Echo",
                      "Focus",
                      "Minor Threat",
                      "Threat",
                      "Vigor",
                    ]}
                    text={pressure.result}
                  />
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="gate-panel" id="gate">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Final Gate">Final gate</GlossaryTerm>
            </p>
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
                <strong>
                  {outcome.label === "Partial" ? (
                    <GlossaryTerm term="Partial Return">Partial</GlossaryTerm>
                  ) : outcome.label === "Full" ? (
                    <GlossaryTerm term="Full Success">Full</GlossaryTerm>
                  ) : (
                    outcome.label
                  )}
                </strong>
                <span>
                  <GlossaryText
                    terms={[
                      "Partial Return",
                      "Reward",
                      "Signal Fragment",
                      "Soul",
                    ]}
                    text={outcome.detail}
                  />
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="loadout-zone" id="loadout" aria-label="Five-card loadout">
        <div className="board-heading">
          <p className="section-label">
            Five-card <GlossaryTerm term="Loadout">loadout</GlossaryTerm>
          </p>
          <h2>
            Choose the right <GlossaryTerm term="Tool">tool</GlossaryTerm>, not
            just the strongest card.
          </h2>
        </div>
        <div className="loadout-cards">
          {loadoutCards.map((card) => (
            <article className="game-card" key={card.name}>
              <span className="card-type">
                <GlossaryTerm term={card.type}>{card.type}</GlossaryTerm>
              </span>
              <h3>{card.name}</h3>
              <div className="card-stat">
                <GlossaryTerm term={card.stat}>{card.stat}</GlossaryTerm>
              </div>
              <p>
                <GlossaryText
                  terms={[
                    "Drain",
                    "Echo",
                    "Exhaust",
                    "Final Gate",
                    "Focus",
                    "Minor Threat",
                    "Pressure",
                    "Recovery",
                    "Threat",
                  ]}
                  text={card.effect}
                />
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

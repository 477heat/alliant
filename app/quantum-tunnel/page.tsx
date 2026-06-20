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
  { turn: "01", card: "Signal Static", result: "Block the drain or lose 1 Focus" },
  { turn: "02", card: "Body Drift", result: "Block the drain or lose 1 Vigor" },
  { turn: "03", card: "Rift Hound", result: "Battle: clear the threat or lose 2 Vigor" },
  { turn: "04", card: "Echo Break", result: "Recover the Echo break or lose 1 Echo" },
] as const;

const missionModifiers = [
  {
    name: "Static Field",
    element: "Signal",
    status: "active",
    effect: "Focus drain is +1.",
  },
  {
    name: "False Door",
    element: "Signal",
    status: "active",
    effect: "Add 1 pressure turn.",
  },
  {
    name: "Bone Gravity",
    element: "Body",
    status: "null",
    effect: "No effect.",
  },
  {
    name: "Memory Fog",
    element: "Echo",
    status: "null",
    effect: "No effect.",
  },
  {
    name: "Ash Wind",
    element: "Fire",
    status: "null",
    effect: "No effect.",
  },
] as const;

const turnSteps = [
  {
    step: "01",
    title: "Reveal",
    term: "Reveal Step",
    text: "Flip the next Mission Pressure card. This tells you what the mission is doing this turn.",
  },
  {
    step: "02",
    title: "Respond",
    term: "Response Step",
    text: "Choose one Loadout card, block the drain, clear the threat, recover a card, or save your best card for the Final Gate.",
  },
  {
    step: "03",
    title: "Resolve",
    term: "Resolve Step",
    text: "Apply the choice. Anything not blocked or cleared now hurts the character, then used cards exhaust.",
  },
  {
    step: "04",
    title: "Advance",
    term: "Advance Step",
    text: "Move to the next Pressure Turn. After the fourth turn, make the Final Gate check.",
  },
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
          <Link href="#turns">Turns</Link>
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
          <GlossaryTerm term="Loadout">loadout cards</GlossaryTerm>, one{" "}
          <GlossaryTerm term="Character Card">portrait character card</GlossaryTerm>,
          one <GlossaryTerm term="Mission Card">landscape mission card</GlossaryTerm>{" "}
          with its <GlossaryTerm term="Modifier">modifier</GlossaryTerm> half
          inverted. Other rules remain draft.
        </p>
      </section>

      <section className="turn-guide" id="turns" aria-label="How a turn works">
        <div className="board-heading">
          <p className="section-label">
            <GlossaryTerm term="Turn">Turn</GlossaryTerm> structure
          </p>
          <h2>How one pressure turn plays</h2>
        </div>
        <div className="turn-step-grid">
          {turnSteps.map((step) => (
            <article className="turn-step" key={step.step}>
              <span>{step.step}</span>
              <strong>
                <GlossaryTerm term={step.term}>{step.title}</GlossaryTerm>
              </strong>
              <p>
                <GlossaryText
                  terms={[
                    "Advance Step",
                    "Block",
                    "Character",
                    "Clear",
                    "Drain",
                    "Echo",
                    "Exhaust",
                    "Final Gate",
                    "Loadout",
                    "Mission Pressure",
                    "Pressure Turn",
                    "Recover",
                    "Response Step",
                    "Reveal Step",
                    "Resolve Step",
                    "Threat",
                    "Turn",
                  ]}
                  text={step.text}
                />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="tabletop-grid" aria-label="Quantum Tunnel tabletop layout">
        <article className="soul-sheet">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Character Card">Character card</GlossaryTerm>
            </p>
            <h2>
              Same size / <GlossaryTerm term="Portrait">portrait</GlossaryTerm>
            </h2>
          </div>
          <div className="character-card-frame" aria-label="Portrait character card example">
            <div className="soul-core">
              <div className="soul-sigil" aria-hidden="true">
                SP
              </div>
              <div>
                <span className="mini-label">Character / portrait card</span>
                <strong>Sweetpea</strong>
                <p>
                  Signal Runner / test{" "}
                  <GlossaryTerm term="Character">character</GlossaryTerm>.
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
          </div>
        </article>

        <article className="mission-panel" id="mission">
          <div className="board-heading">
            <p className="section-label">
              <GlossaryTerm term="Mission Card">Mission card</GlossaryTerm>
            </p>
            <h2>
              Same size / <GlossaryTerm term="Landscape">landscape</GlossaryTerm>
            </h2>
          </div>
          <div className="dual-mission-card" aria-label="Dual-use mission card example">
            <div className="mission-half mission-half--top">
              <span className="mini-label">
                Top half / <GlossaryTerm term="Mission">mission</GlossaryTerm>
              </span>
              <h3>Find The Signal Origin</h3>
              <dl className="mission-facts">
                <div>
                  <dt>
                    <GlossaryTerm term="Element">Element</GlossaryTerm>
                  </dt>
                  <dd>Signal</dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>4+ turns</dd>
                </div>
                <div>
                  <dt>
                    <GlossaryTerm term="Final Gate">Gate</GlossaryTerm>
                  </dt>
                  <dd>Will + Focus + Echo</dd>
                </div>
                <div>
                  <dt>
                    <GlossaryTerm term="Reward">Reward</GlossaryTerm>
                  </dt>
                  <dd>Signal Fragment</dd>
                </div>
              </dl>
            </div>
            <div className="mission-divider" aria-hidden="true" />
            <div className="mission-half mission-half--bottom">
              <div className="modifier-rotated">
                <span className="mini-label">
                  Bottom half / <GlossaryTerm term="Modifier">modifier</GlossaryTerm>
                </span>
                <h3>Static Field</h3>
                <p>
                  <GlossaryTerm term="Element">Element</GlossaryTerm>: Signal.
                  If this matches the mission, Focus drain is +1.
                </p>
              </div>
            </div>
          </div>
          <div className="modifier-rule">
            <strong>5 attached modifiers</strong>
            <p>
              Matching <GlossaryTerm term="Element">element</GlossaryTerm> ={" "}
              <GlossaryTerm term="Active Modifier">active</GlossaryTerm>.
              Different element ={" "}
              <GlossaryTerm term="Null Modifier">null</GlossaryTerm>.
            </p>
          </div>
          <div className="modifier-grid" aria-label="Attached modifier cards">
            {missionModifiers.map((modifier) => (
              <div
                className={`modifier-chip modifier-chip--${modifier.status}`}
                key={modifier.name}
              >
                <span>{modifier.status}</span>
                <strong>{modifier.name}</strong>
                <em>{modifier.element}</em>
                <p>{modifier.effect}</p>
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

      <section className="pressure-zone" aria-label="Mission pressure turns">
        <div className="board-heading">
          <p className="section-label">
            <GlossaryTerm term="Mission Pressure">Mission pressure</GlossaryTerm>
          </p>
          <h2>Revealed pressure track</h2>
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
                    "Block",
                    "Clear",
                    "Drain",
                    "Echo",
                    "Focus",
                    "Minor Threat",
                    "Recover",
                    "Threat",
                    "Vigor",
                  ]}
                  text={pressure.result}
                />
              </p>
            </div>
          ))}
        </div>
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
